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

// 7. API module declared
check('API module is declared (const API)',
  /const API\s*=\s*\(\s*\(\s*\)\s*=>/.test(html));

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

// ── Summary ───────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\nUI Audit: ${passed}/${total} checks passing\n`);
process.exit(failed > 0 ? 1 : 0);
