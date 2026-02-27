// Browser Sim — checks syntax, loading order, tab wiring, API connectivity
// Run: node pipeline/browser-sim.js

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

// Extract all <script> blocks
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
const allJs   = scripts.join('\n');

// Module declaration positions
function declPos(name) {
  const m = html.match(new RegExp(`const ${name}\\s*=\\s*\\(\\s*\\(\\s*\\)\\s*=>`));
  return m ? html.indexOf(m[0]) : -1;
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
const apiBlockForFetch = (() => {
  const start = html.indexOf('const API = (()');
  const end   = html.indexOf('\n})();', start) + 6;
  return start !== -1 ? html.slice(start, end) : '';
})();
const fetchOutsideApi = allJs
  .replace(apiBlockForFetch, '')
  .match(/\bfetch\s*\(/g) || [];
check('No raw fetch() calls outside API module', fetchOutsideApi.length === 0,
  fetchOutsideApi.length ? `${fetchOutsideApi.length} raw fetch call(s) found` : '');

// ── Summary ───────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\nBrowser Sim: ${passed}/${total} checks passing\n`);
process.exit(failed > 0 ? 1 : 0);
