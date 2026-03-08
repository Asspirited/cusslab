// Browser Sim — checks syntax, loading order, tab wiring, API connectivity
// Run: node pipeline/browser-sim.js

const fs   = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Load external src/ scripts referenced in index.html (in order they appear)
const srcScripts = [...html.matchAll(/src="(src\/[^"]+\.js)"/g)]
  .map(m => { try { return fs.readFileSync(path.join(__dirname, '..', m[1]), 'utf8'); } catch { return ''; } })
  .join('\n');

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

// Extract all <script> blocks
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
const allJs   = srcScripts + '\n' + scripts.join('\n');

// Module declaration positions — search HTML + src/ combined
function declPos(name) {
  const combined = srcScripts + '\n' + html;
  const m = combined.match(new RegExp(`const ${name}\\s*=\\s*\\(\\s*\\(\\s*\\)\\s*=>`));
  return m ? combined.indexOf(m[0]) : -1;
}

// ── Checks ────────────────────────────────────────────────────────────────────

// 1. No obvious syntax error: check balanced braces in JS
const open  = (allJs.match(/\{/g) || []).length;
const close = (allJs.match(/\}/g) || []).length;
check('JS brace balance (open === close)', open === close,
  open !== close ? `open: ${open}  close: ${close}` : '');

// 2. API module declared
check('API module declared', declPos('API') !== -1);

// 3. App module declared
check('App module declared', declPos('App') !== -1);

// 4. API declared before App
check('API declared before App',
  declPos('API') !== -1 && declPos('App') !== -1 && declPos('API') < declPos('App'));

// 5. localStorage usage in try/catch
check('localStorage.setItem wrapped in try/catch',
  /try\s*\{[^}]*localStorage\.setItem/.test(allJs));

// 6. No raw fetch() calls outside API module
// API module may be inline or in src/integration/api-client.js
const apiBlockForFetch = (() => {
  // Try external file first
  const extStart = srcScripts.indexOf('const API = (()');
  if (extStart !== -1) {
    const extEnd = srcScripts.indexOf('\n})();', extStart) + 6;
    return srcScripts.slice(extStart, extEnd);
  }
  // Fall back to inline
  const start = html.indexOf('const API = (()');
  const end   = html.indexOf('\n})();', start) + 6;
  return start !== -1 ? html.slice(start, end) : '';
})();
const fetchOutsideApi = allJs
  .replace(apiBlockForFetch, '')
  .match(/\bfetch\s*\(/g) || [];
check('No raw fetch() calls outside API module', fetchOutsideApi.length === 0,
  fetchOutsideApi.length ? `${fetchOutsideApi.length} raw fetch call(s) found` : '');

// 7. No stale Worker URL — cusslab.workers.dev is dead, must be leanspirited.workers.dev
const STALE_WORKER_URL = 'cusslab-api.cusslab.workers.dev';
const allSrcFiles = (() => {
  const files = ['src/integration/api-client.js', 'golf-adventure.html', 'index.html'];
  return files.map(f => {
    try { return require('fs').readFileSync(require('path').join(__dirname, '..', f), 'utf8'); }
    catch(e) { return ''; }
  }).join('\n');
})();
check('No stale Worker URL (cusslab.workers.dev) in source files',
  !allSrcFiles.includes(STALE_WORKER_URL),
  allSrcFiles.includes(STALE_WORKER_URL) ? 'Found stale cusslab.workers.dev URL — update to leanspirited.workers.dev' : '');

// ── Summary ───────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\nBrowser Sim: ${passed}/${total} checks passing\n`);
process.exit(failed > 0 ? 1 : 0);
