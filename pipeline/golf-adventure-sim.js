// Golf Adventure Sim — structural checks for golf-adventure.html
// Mirrors browser-sim.js pattern. Always exits 0 (warn-only).
// Run: node pipeline/golf-adventure-sim.js

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'golf-adventure.html'), 'utf8');

// Load all src/*.js referenced in script tags (in order)
const srcScripts = [...html.matchAll(/src="([^"]+\.js)"/g)]
  .map(m => {
    try { return fs.readFileSync(path.join(ROOT, m[1]), 'utf8'); }
    catch { return ''; }
  })
  .join('\n');

const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
const allJs   = srcScripts + '\n' + scripts.join('\n');

let passed = 0;
let warned  = 0;

function check(desc, ok, detail) {
  if (ok) { passed++; console.log(`  ✓ ${desc}`); }
  else     { warned++;  console.log(`  ⚠ ${desc}${detail ? ': ' + detail : ''}`); }
}

// ── Checks ─────────────────────────────────────────────────────────────────

// 1. Brace balance
const open  = (allJs.match(/\{/g) || []).length;
const close = (allJs.match(/\}/g) || []).length;
check('JS brace balance (open === close)', open === close,
  open !== close ? `open: ${open}  close: ${close}` : '');

// 2. G state object declared
check('G state object declared (let G = {)', /let\s+G\s*=\s*\{/.test(allJs));

// 3. G.tournament field present in initial declaration
const gDecl = allJs.match(/let\s+G\s*=\s*\{([\s\S]*?)\};/);
const gBody  = gDecl ? gDecl[1] : '';
check('G.tournament field in state init',   /tournament\s*:/.test(gBody));
check('G.player field in state init',       /player\s*:/.test(gBody));
check('G.matchPlayScore field in state init', /matchPlayScore\s*:/.test(gBody));

// 4. beginAdventure() resets G.matchPlayScore to 0
check('beginAdventure resets G.matchPlayScore',
  /G\.matchPlayScore\s*=\s*0/.test(allJs));

// 5. Required DOM elements present
const DOM_IDS = ['tournament-grid', 'char-grid', 'hud-player', 'hud-tournament', 'hud-score'];
const missingDom = DOM_IDS.filter(id => !html.includes(`id="${id}"`));
check('Required DOM elements present', missingDom.length === 0,
  missingDom.length ? `missing: ${missingDom.join(', ')}` : '');

// 6. External script files all exist on disk
const missingFiles = [...html.matchAll(/src="([^"]+\.js)"/g)]
  .map(m => m[1])
  .filter(f => !fs.existsSync(path.join(ROOT, f)));
check('All referenced script files exist on disk', missingFiles.length === 0,
  missingFiles.length ? `missing: ${missingFiles.join(', ')}` : '');

// 7. No direct api.anthropic.com fetch (CORS issue — should route through worker)
const rawAnthropicFetch = (allJs.match(/fetch\s*\(\s*["']https:\/\/api\.anthropic\.com/g) || []).length;
check('No direct api.anthropic.com fetch (should use worker)',
  rawAnthropicFetch === 0,
  rawAnthropicFetch ? `${rawAnthropicFetch} raw anthropic fetch call(s) — CORS failure in browser` : '');

// ── Summary ─────────────────────────────────────────────────────────────────

const total = passed + warned;
console.log(`\nGolf Adventure Sim: ${passed}/${total} checks passing  (${warned} warnings)\n`);
process.exit(0); // always — warn-only, never block pipeline
