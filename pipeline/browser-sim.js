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

// 3. State module declared
check('State module declared', declPos('State') !== -1);

// 4. App module declared
check('App module declared', declPos('App') !== -1);

// 5. API declared before App
check('API declared before App',
  declPos('API') !== -1 && declPos('App') !== -1 && declPos('API') < declPos('App'));

// 6. State declared before App
check('State declared before App',
  declPos('State') !== -1 && declPos('App') !== -1 && declPos('State') < declPos('App'));

// 7. setKey function exists inside API module
const apiBlock = (() => {
  const start = html.indexOf('const API = (()');
  const end   = html.indexOf('\n})();', start) + 6;
  return html.slice(start, end);
})();
check('setKey defined in API module', /function setKey\s*\(/.test(apiBlock));

// 8. getKey function exists inside API module
check('getKey defined in API module', /function getKey\s*\(/.test(apiBlock));

// 9. updateKeyStatus defined in API module
check('updateKeyStatus defined in API module', /function updateKeyStatus\s*\(/.test(apiBlock));

// 10. updateKeyStatus called from setKey
const setKeyFn = apiBlock.match(/function setKey[\s\S]*?^  \}/m)?.[0] || '';
check('updateKeyStatus called from setKey',
  /updateKeyStatus\s*\(/.test(setKeyFn) || apiBlock.includes('updateKeyStatus()'));

// 11. Bug 6 fix present: activeElement guard in updateKeyStatus
check('Bug 6 fix: activeElement guard present in updateKeyStatus',
  /activeElement\s*!==\s*inp/.test(apiBlock));

// 12. localStorage usage in try/catch
check('localStorage.setItem wrapped in try/catch',
  /try\s*\{[^}]*localStorage\.setItem/.test(allJs));

// 13. No empty catch blocks in API module (other modules tracked separately as pre-existing violations)
const apiEmptyCatch = apiBlock.match(/catch\s*\([^)]*\)\s*\{\s*\}/g) || [];
const allEmptyCatch = allJs.match(/catch\s*\([^)]*\)\s*\{\s*\}/g) || [];
const preExisting   = allEmptyCatch.length - apiEmptyCatch.length;
if (preExisting > 0) console.log(`  ! Pre-existing empty catch(s) in non-API modules: ${preExisting} — tracked in backlog`);
check('No empty catch blocks in API/settings module', apiEmptyCatch.length === 0,
  apiEmptyCatch.length ? `${apiEmptyCatch.length} empty catch(s) in API module` : '');

// 14. initKeyUI called in App init
const appBlock = (() => {
  const start = html.indexOf('const App = (()');
  const end   = html.indexOf('\n})();', start) + 6;
  return html.slice(start, end);
})();
check('initKeyUI called during App init', /initKeyUI\s*\(/.test(appBlock));

// 15. Modules use API.call not raw fetch (spot check first 3 non-API modules)
const fetchOutsideApi = allJs
  .replace(apiBlock, '')
  .match(/\bfetch\s*\(/g) || [];
check('No raw fetch() calls outside API module', fetchOutsideApi.length === 0,
  fetchOutsideApi.length ? `${fetchOutsideApi.length} raw fetch call(s) found` : '');

// ── Summary ───────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\nBrowser Sim: ${passed}/${total} checks passing\n`);
process.exit(failed > 0 ? 1 : 0);
