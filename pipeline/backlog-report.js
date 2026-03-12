#!/usr/bin/env node
// pipeline/backlog-report.js
// BL + WL stats: open items first, then closed ordered by fix date with CD3
// Run: node pipeline/backlog-report.js

const fs   = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ── Helpers ───────────────────────────────────────────────────────────────────

function readFile(rel) {
  try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch { return ''; }
}

function extractDate(str) {
  // Grab first YYYY-MM-DD found in a string
  const m = str.match(/(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

// ── Parse BL items ────────────────────────────────────────────────────────────

function parseBL(md) {
  const items = [];
  // Split on BL headers
  const chunks = md.split(/(?=### BL-\d+)/);
  for (const chunk of chunks) {
    const headerM = chunk.match(/^### (BL-\d+)\s*[—–-]\s*(.+)/m);
    if (!headerM) continue;
    const num   = headerM[1];
    const title = headerM[2].trim().slice(0, 70);

    // CD3
    const cd3M  = chunk.match(/\*\*CD3[=:]?\s*([\d.]+)\*\*/i) ||
                  chunk.match(/CD3[=:]\s*([\d.]+)/i);
    const cd3   = cd3M ? parseFloat(cd3M[1]) : null;

    // Status
    const statusM = chunk.match(/\*\*?Status[:\*]*\s*([^\n]+)/i) ||
                    chunk.match(/Status[:\s]+([^\n]+)/i);
    const statusRaw = statusM ? statusM[1] : '';
    const status = /closed|done|shipped|implemented/i.test(statusRaw) ? 'CLOSED' : 'OPEN';

    // Close date — only from CLOSED status lines
    const closeDate = status === 'CLOSED' ? extractDate(statusRaw) : null;

    items.push({ num, title, cd3, status, closeDate });
  }
  return items;
}

// ── Parse WL items ────────────────────────────────────────────────────────────

function parseWL(md) {
  const items = [];
  const chunks = md.split(/(?=### WL-[\w-]+)/);
  for (const chunk of chunks) {
    const headerM = chunk.match(/^### (WL-[\w-]+)/m);
    if (!headerM) continue;
    const num = headerM[1];

    // Title from **Item:** line
    const itemM = chunk.match(/\*\*Item[:\*]*\s*([^\n]+)/i);
    const title = itemM ? itemM[1].replace(/\*\*/g, '').trim().slice(0, 70) : '(no title)';

    // Session date
    const sessionM = chunk.match(/\*\*Session[:\*]*\s*([^\n]+)/i);
    const session  = sessionM ? extractDate(sessionM[1]) || sessionM[1].trim().slice(0, 20) : '—';

    // Status
    const statusM   = chunk.match(/\*\*Status[:\*]*\s*([^\n]+)/i);
    const statusRaw = statusM ? statusM[1] : '';
    const status    = /closed/i.test(statusRaw) ? 'CLOSED' : 'OPEN';
    const closeDate = status === 'CLOSED' ? extractDate(statusRaw) : null;

    items.push({ num, title, session, status, closeDate });
  }
  return items;
}

// ── Format helpers ────────────────────────────────────────────────────────────

const W = process.stdout.columns || 100;
const LINE = '─'.repeat(Math.min(W, 100));

function pad(str, n) { return String(str).padEnd(n); }
function rpad(str, n) { return String(str).padStart(n); }

function cd3Str(cd3) {
  if (cd3 === null) return '   —  ';
  return `CD3=${cd3.toFixed(1)}`.padEnd(7);
}

// ── Main ──────────────────────────────────────────────────────────────────────

const blMd = readFile('.claude/practices/backlog.md');
const wlMd = readFile('.claude/practices/waste-log.md');

const blItems = parseBL(blMd);
const wlItems = parseWL(wlMd);

// Separate OPEN / CLOSED
const blOpen   = blItems.filter(i => i.status === 'OPEN').sort((a, b) => (b.cd3 || 0) - (a.cd3 || 0));
const blClosed = blItems.filter(i => i.status === 'CLOSED').sort((a, b) => {
  if (!a.closeDate && !b.closeDate) return 0;
  if (!a.closeDate) return 1;
  if (!b.closeDate) return -1;
  return b.closeDate.localeCompare(a.closeDate); // most recent first
});

const wlOpen   = wlItems.filter(i => i.status === 'OPEN');
const wlClosed = wlItems.filter(i => i.status === 'CLOSED').sort((a, b) => {
  if (!a.closeDate && !b.closeDate) return 0;
  if (!a.closeDate) return 1;
  if (!b.closeDate) return -1;
  return b.closeDate.localeCompare(a.closeDate);
});

// ── Output ────────────────────────────────────────────────────────────────────

console.log('');
console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║                   BACKLOG + WASTE LOG REPORT                    ║');
console.log('╚══════════════════════════════════════════════════════════════════╝');
console.log('');

// ── BL OPEN ───────────────────────────────────────────────────────────────────
console.log(`  ● BL OPEN — ${blOpen.length} items  (sorted by CD3 desc)`);
console.log('  ' + LINE.slice(0, 68));
for (const i of blOpen) {
  const cd3 = cd3Str(i.cd3);
  console.log(`  ${pad(i.num, 8)}  ${cd3}  ${i.title}`);
}
if (blOpen.length === 0) console.log('  (none)');

console.log('');

// ── BL CLOSED ─────────────────────────────────────────────────────────────────
console.log(`  ✓ BL CLOSED — ${blClosed.length} items  (most recent first)`);
console.log('  ' + LINE.slice(0, 68));
for (const i of blClosed) {
  const cd3  = cd3Str(i.cd3);
  const date = i.closeDate ? `[${i.closeDate}]` : '[no date]  ';
  console.log(`  ${pad(i.num, 8)}  ${cd3}  ${pad(date, 12)}  ${i.title}`);
}
if (blClosed.length === 0) console.log('  (none)');

console.log('');
console.log(`  BL total: ${blItems.length} | open: ${blOpen.length} | closed: ${blClosed.length} | close rate: ${blItems.length ? Math.round(blClosed.length / blItems.length * 100) : 0}%`);

console.log('');
console.log('  ' + LINE.slice(0, 68));
console.log('');

// ── WL OPEN ───────────────────────────────────────────────────────────────────
console.log(`  ⚠ WL OPEN — ${wlOpen.length} items`);
console.log('  ' + LINE.slice(0, 68));
for (const i of wlOpen) {
  const date = i.session ? `[${i.session}]` : '           ';
  console.log(`  ${pad(i.num, 10)}  ${pad(date, 14)}  ${i.title}`);
}
if (wlOpen.length === 0) console.log('  (none)');

console.log('');

// ── WL CLOSED ─────────────────────────────────────────────────────────────────
console.log(`  ✓ WL CLOSED — ${wlClosed.length} items  (most recent first)`);
console.log('  ' + LINE.slice(0, 68));
for (const i of wlClosed) {
  const date = i.closeDate ? `[${i.closeDate}]` : i.session ? `[${i.session}]` : '           ';
  console.log(`  ${pad(i.num, 10)}  ${pad(date, 14)}  ${i.title}`);
}
if (wlClosed.length === 0) console.log('  (none)');

console.log('');
console.log(`  WL total: ${wlItems.length} | open: ${wlOpen.length} | closed: ${wlClosed.length} | close rate: ${wlItems.length ? Math.round(wlClosed.length / wlItems.length * 100) : 0}%`);
console.log('');
