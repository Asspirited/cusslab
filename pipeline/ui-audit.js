// UI Audit — checks panel registration, nav integrity, required DOM elements
// Run: node pipeline/ui-audit.js

const fs   = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

let passed = 0;
let failed = 0;

function check(description, ok, detail) {
  if (ok) {
    passed++;
    console.log(`  ✓ ${description}`);
  } else {
    failed++;
    console.log(`  ✗ ${description}${detail ? ': ' + detail : ''}`);
  }
}

// ── Extract panel IDs from HTML ───────────────────────────────────────────────

const panelIds = [];
for (const m of html.matchAll(/id="panel-([\w]+)"/g)) panelIds.push(m[1]);

// ── Extract SKIN_CONFIGS tabs ─────────────────────────────────────────────────

const skinMatch = html.match(/consultant:\s*\{[^}]*tabs:\s*\[([^\]]+)\]/s);
const skinTabs  = skinMatch
  ? skinMatch[1].match(/'([\w]+)'/g).map(s => s.replace(/'/g, ''))
  : [];

// ── Extract NAV_GROUP_MAP keys ────────────────────────────────────────────────

const navMatch  = html.match(/_NAV_GROUP_MAP\s*=\s*\{([^}]+)\}/s);
const navKeys   = navMatch
  ? navMatch[1].match(/(\w+)\s*:/g).map(s => s.replace(':', '').trim())
  : [];

// ── Checks ────────────────────────────────────────────────────────────────────

// 1. All SKIN_CONFIGS consultant tabs have a panel element
const missingPanels = skinTabs.filter(t => !panelIds.includes(t));
check('All consultant skin tabs have panel elements',
  missingPanels.length === 0,
  missingPanels.length ? `missing: ${missingPanels.join(', ')}` : '');

// 2. No duplicate panel IDs
const dupes = panelIds.filter((id, i) => panelIds.indexOf(id) !== i);
check('No duplicate panel IDs',
  dupes.length === 0,
  dupes.length ? `duplicates: ${dupes.join(', ')}` : '');

// 3. All consultant skin tabs are in NAV_GROUP_MAP
const missingNav = skinTabs.filter(t => !navKeys.includes(t));
check('All skin tabs registered in NAV_GROUP_MAP',
  missingNav.length === 0,
  missingNav.length ? `missing: ${missingNav.join(', ')}` : '');

// 3b. All NAV_GROUP_MAP keys (excluding 'settings') have a panel and are in consultant skin tabs
const navOnlyKeys = navKeys.filter(k => k !== 'settings');
const missingFromSkin = navOnlyKeys.filter(k => !skinTabs.includes(k));
check('All nav-linked panels are in consultant skin tabs',
  missingFromSkin.length === 0,
  missingFromSkin.length ? `missing from skin: ${missingFromSkin.join(', ')}` : '');

// 4. settings-key-input exists
check('settings-key-input element exists',
  html.includes('id="settings-key-input"'));

// 5. settings-save-msg exists
check('settings-save-msg element exists',
  html.includes('id="settings-save-msg"'));

// 6. Save Key button exists in settings panel
check('Save Key button exists in settings panel',
  html.includes('id="settings-save-btn"'));

// 7. API module declared (inline or loaded via src/integration/api-client.js)
const apiClientSrc = (() => { try { return require('fs').readFileSync(require('path').join(__dirname, '../src/integration/api-client.js'), 'utf8'); } catch { return ''; } })();
check('API module is declared (const API)',
  /const API\s*=\s*\(\s*\(\s*\)\s*=>/.test(html) ||
  /const API\s*=\s*\(\s*\(\s*\)\s*=>/.test(apiClientSrc));

// 8. switchTab global function exists
check('switchTab global function exists',
  /function switchTab\s*\(/.test(html));

// 9. Main script has no syntax errors
// The main script is the large one (not the plausible stub) — find the last <script>...</script>
const scriptMatch = html.match(/[\s\S]*<script>([\s\S]*?)<\/script>/);
let syntaxOk = false;
let syntaxDetail = '';
if (scriptMatch) {
  try {
    new Function(scriptMatch[1]);
    syntaxOk = true;
  } catch (e) {
    syntaxDetail = e.message.split('\n')[0];
  }
} else {
  syntaxDetail = 'could not extract main script block';
}
check('Main script has no syntax errors', syntaxOk, syntaxDetail);

// 10. Module-style onclick calls inside dynamically-rendered HTML have global function wrappers
// Rationale: innerHTML template literals render buttons at runtime. Any onclick="ModuleName.method()"
// inside a template literal is dynamically rendered. If a JS error occurs inside the called function,
// it fails silently without try/catch. And in some browser contexts, const module variables may not
// be accessible from event handler scope. Every module used this way must have global function
// wrappers AND surface errors. (WL-118 — PubCrawl had no wrappers; startScene errors were silent)
//
// Detection: find onclick="[UpperCase]" patterns inside backtick template literals in the script.
const scriptBlock = html.slice(html.indexOf('<script>'), html.lastIndexOf('</script>'));
const templateModuleOnclicks = [];
const btPattern = /`([^`]+)`/g;
let btMatch;
while ((btMatch = btPattern.exec(scriptBlock)) !== null) {
  for (const mm of btMatch[1].matchAll(/onclick="([A-Z][A-Za-z]+)\./g)) {
    templateModuleOnclicks.push(mm[1]);
  }
}
const uniqueTemplateModules = [...new Set(templateModuleOnclicks)];
const templateModulesWithoutWrappers = uniqueTemplateModules.filter(mod => {
  const wrapperPattern = new RegExp(`function \\w+\\s*\\([^)]*\\)\\s*\\{\\s*${mod}\\.`);
  return !wrapperPattern.test(html);
});
check('Dynamically-rendered onclick calls have global function wrappers',
  templateModulesWithoutWrappers.length === 0,
  templateModulesWithoutWrappers.length ? `no wrappers for: ${templateModulesWithoutWrappers.join(', ')}` : '');

// 11. No unguarded chained window global access in inline script
// Why: `const X = window.Foo.Bar` at IIFE definition time crashes the ENTIRE script if
//      window.Foo is undefined — taking out every module defined after it (cascade crash).
// Safe pattern: `(window.Foo || {}).Bar` or `window.Foo && window.Foo.Bar`
// Root cause of WL-119 cascade: window.PubCrawlScenes.PUB_CRAWL_SCENES unguarded.
const unguardedChainsInline = [];
const chainReInline = /const\s+\w+\s*=\s*window\.([A-Z]\w+)\.([A-Za-z_]\w*)/g;
let cwInlineMatch;
while ((cwInlineMatch = chainReInline.exec(scriptBlock)) !== null) {
  unguardedChainsInline.push(cwInlineMatch[0].replace(/\s+/g, ' ').trim());
}
check('No unguarded chained window global access in inline script',
  unguardedChainsInline.length === 0,
  unguardedChainsInline.length ? unguardedChainsInline.join('; ') : '');

// 12. External local JS files: no unguarded chained window global access
// Why: if an external script accesses window.X.Y at module top level, and window.X is not yet set
//      (e.g. because a dependency script threw), the external script throws and its own window global
//      is never set — which then cascades back into the inline script (ENGINE=undefined pattern).
// Safe pattern: `(window.Foo || {}).Bar` or local variable guarded with `|| {}`
const extScriptSrcs = [...html.matchAll(/<script\s+src="(src\/[^"?]+\.js)[^"]*"/g)].map(m => m[1]);
const unguardedChainsExt = [];
for (const src of extScriptSrcs) {
  try {
    const content = fs.readFileSync(path.join(__dirname, '..', src), 'utf8');
    for (const m of content.matchAll(/const\s+\w+\s*=\s*window\.([A-Z]\w+)\.([A-Za-z_]\w*)/g)) {
      unguardedChainsExt.push(`${src}: ${m[0].replace(/\s+/g, ' ').trim()}`);
    }
  } catch { /* file not found — skip */ }
}
check('External JS files: no unguarded chained window global access',
  unguardedChainsExt.length === 0,
  unguardedChainsExt.length ? unguardedChainsExt.join('; ') : '');

// ── Summary ───────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\nUI Audit: ${passed}/${total} checks passing\n`);
process.exit(failed > 0 ? 1 : 0);
