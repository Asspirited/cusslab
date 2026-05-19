#!/usr/bin/env node
// BL-184 v1 M-1: flavour pool repetition / cross-character bleed audit.
// Per `leanspirited-standards/standards/panel-voice-principles.md` Lever 1:
// "across 20 calls, no flavour entry appears more than 3 times" — and
// `leanspirited-standards/standards/character-schema.md` validation:
// "Pool has minimum 6 entries per dimension".
//
// v1 — file-only static check (no transcript replay needed):
//   - Scans `index.html` for inline Lever 1 flavour bank declarations:
//     `*_VOICE_POOLS = { dimension: [array...], ... }` (per-dimension pool)
//     `*_ENTHUSIASM  = { char_id:   [array...], ... }` (per-character trigger pool)
//   - For each pool found, reports entry count per key.
//   - Flags any pool key with fewer than 6 entries (Lever 1 floor).
//   - Flags any entry STRING appearing verbatim in more than one bank
//     across different characters / dimensions (cross-character / cross-bank
//     bleed signal — Lever 1 promise of variation).
//   - Exit 0 if all pools >= 6 AND no cross-bank verbatim collisions; exit 1 otherwise.
//
// v2 (deferred): transcript-replay version that samples N actual prompt
// outputs from Worker logs / HCSession captures and tallies actual fire
// frequency vs the >3-in-20 Lever 1 promise.
//
// Run: node pipeline/measurement/flavour-repetition.js
// CI: invoked by run-all.js when wired (deferred).

'use strict';

const fs   = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', '..', 'index.html');

// Match top-level bank declarations. Two shapes share the same parser:
//   const FALDO_VOICE_POOLS = { ... };  (per-dimension)
//   const GOLF_ENTHUSIASM   = { ... };  (per-character)
// Captured groups: (1) full bank name, (2) kind label.
const BANK_DECL_RE = /\bconst\s+([A-Z][A-Z0-9_]*(?:_VOICE_POOLS|_ENTHUSIASM))\s*=\s*\{/g;

// Find the matching closing `}` for an object literal starting at `openIdx`
// (the index of the opening `{`). Returns the index of the closing brace, or
// -1 if not found. Handles nested braces, strings (single/double/template),
// line + block comments. Sufficient for our pretty-printed inline declarations.
function findMatchingBrace(text, openIdx) {
  let depth   = 0;
  let i       = openIdx;
  const len   = text.length;
  while (i < len) {
    const ch  = text[i];
    const nxt = text[i + 1];

    // Line comment
    if (ch === '/' && nxt === '/') {
      const nl = text.indexOf('\n', i);
      if (nl === -1) return -1;
      i = nl + 1;
      continue;
    }
    // Block comment
    if (ch === '/' && nxt === '*') {
      const end = text.indexOf('*/', i + 2);
      if (end === -1) return -1;
      i = end + 2;
      continue;
    }
    // String literal — skip past matching quote, respecting backslash escapes
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch;
      i++;
      while (i < len) {
        if (text[i] === '\\') { i += 2; continue; }
        if (text[i] === quote) { i++; break; }
        i++;
      }
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  return -1;
}

// Parse a bank body (the text between the outer `{` and `}`) into a list of
// { key, entries } pairs. Entries are the raw string literals inside the
// top-level array for that key. Only arrays-of-strings are collected; other
// value shapes (functions, nested objects) are skipped silently.
function parseBankBody(body) {
  const pairs = [];
  let i = 0;
  const len = body.length;

  function skipWhitespaceAndComments() {
    while (i < len) {
      const ch  = body[i];
      const nxt = body[i + 1];
      if (/\s/.test(ch)) { i++; continue; }
      if (ch === '/' && nxt === '/') {
        const nl = body.indexOf('\n', i);
        i = nl === -1 ? len : nl + 1;
        continue;
      }
      if (ch === '/' && nxt === '*') {
        const end = body.indexOf('*/', i + 2);
        i = end === -1 ? len : end + 2;
        continue;
      }
      break;
    }
  }

  function readKey() {
    skipWhitespaceAndComments();
    if (i >= len) return null;
    const ch = body[i];
    // Quoted key
    if (ch === '"' || ch === "'") {
      const q = ch;
      let j = i + 1;
      while (j < len && body[j] !== q) {
        if (body[j] === '\\') j += 2; else j++;
      }
      const key = body.slice(i + 1, j);
      i = j + 1;
      return key;
    }
    // Bare identifier key
    const m = body.slice(i).match(/^[A-Za-z_$][A-Za-z0-9_$]*/);
    if (!m) return null;
    i += m[0].length;
    return m[0];
  }

  function expect(ch) {
    skipWhitespaceAndComments();
    if (body[i] === ch) { i++; return true; }
    return false;
  }

  // Advance past a value of arbitrary shape (not array-of-strings). Used to
  // skip function values, nested objects, numbers, identifiers, etc.
  function skipValue() {
    skipWhitespaceAndComments();
    if (i >= len) return;
    const ch = body[i];
    if (ch === '{') {
      const close = findMatchingBrace(body, i);
      i = close === -1 ? len : close + 1;
      return;
    }
    if (ch === '[') {
      // Skip a non-string-only array generically
      let depth = 0;
      while (i < len) {
        const c = body[i];
        const n = body[i + 1];
        if (c === '/' && n === '/') { const nl = body.indexOf('\n', i); i = nl === -1 ? len : nl + 1; continue; }
        if (c === '/' && n === '*') { const end = body.indexOf('*/', i + 2); i = end === -1 ? len : end + 2; continue; }
        if (c === '"' || c === "'" || c === '`') {
          const q = c; i++;
          while (i < len) { if (body[i] === '\\') { i += 2; continue; } if (body[i] === q) { i++; break; } i++; }
          continue;
        }
        if (c === '[') depth++;
        else if (c === ']') { depth--; if (depth === 0) { i++; return; } }
        i++;
      }
      return;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      const q = ch; i++;
      while (i < len) { if (body[i] === '\\') { i += 2; continue; } if (body[i] === q) { i++; break; } i++; }
      return;
    }
    // Generic token — advance to next comma at depth 0 or end of body
    while (i < len && body[i] !== ',' && body[i] !== '\n') i++;
  }

  // Try to read an array-of-strings. If the array contains anything that is
  // not a string literal (e.g. an object), bail and return null so caller can
  // fall back to skipValue.
  function tryReadStringArray() {
    skipWhitespaceAndComments();
    if (body[i] !== '[') return null;
    const arrStart = i;
    i++; // past '['
    const entries = [];
    while (i < len) {
      skipWhitespaceAndComments();
      if (body[i] === ']') { i++; return entries; }
      const ch = body[i];
      if (ch === '"' || ch === "'" || ch === '`') {
        const q = ch;
        let j = i + 1;
        // Concat-aware: build the literal value, respecting escapes.
        let value = '';
        while (j < len) {
          const c = body[j];
          if (c === '\\') {
            const esc = body[j + 1];
            if (esc === 'n') value += '\n';
            else if (esc === 't') value += '\t';
            else if (esc === 'r') value += '\r';
            else value += esc;
            j += 2;
            continue;
          }
          if (c === q) { j++; break; }
          value += c;
          j++;
        }
        entries.push(value);
        i = j;
        skipWhitespaceAndComments();
        if (body[i] === ',') { i++; continue; }
        if (body[i] === ']') { i++; return entries; }
        // Anything else after a string and not comma/close = unsupported shape
        i = arrStart;
        return null;
      }
      // Non-string element — array not pure-strings, skip whole bank value
      i = arrStart;
      return null;
    }
    return null;
  }

  while (i < len) {
    skipWhitespaceAndComments();
    if (i >= len) break;
    if (body[i] === ',') { i++; continue; }

    const key = readKey();
    if (key === null) break;
    if (!expect(':')) { skipValue(); continue; }

    const entries = tryReadStringArray();
    if (entries === null) {
      // Not an array-of-strings — skip silently.
      skipValue();
    } else {
      pairs.push({ key, entries });
    }

    skipWhitespaceAndComments();
    if (body[i] === ',') { i++; }
  }

  return pairs;
}

// Derive a stable "character or dimension label" from the bank name + key.
// FALDO_VOICE_POOLS / food         -> { character: 'faldo',  dimension: 'food'         }
// GOLF_ENTHUSIASM  / mcginley      -> { character: 'mcginley', dimension: 'enthusiasm' }
function labelFor(bankName, key) {
  if (bankName.endsWith('_VOICE_POOLS')) {
    const character = bankName.replace(/_VOICE_POOLS$/, '').toLowerCase();
    return { character, dimension: key };
  }
  if (bankName.endsWith('_ENTHUSIASM')) {
    // Bank prefix is the panel (BOARDROOM / GOLF / FOOTBALL...); key is the character id.
    return { character: key, dimension: bankName.replace(/_ENTHUSIASM$/, '').toLowerCase() + '_enthusiasm' };
  }
  return { character: bankName.toLowerCase(), dimension: key };
}

function main() {
  const text = fs.readFileSync(indexPath, 'utf8');

  const banks   = []; // { name, pairs }
  let match;
  BANK_DECL_RE.lastIndex = 0;
  while ((match = BANK_DECL_RE.exec(text)) !== null) {
    const name      = match[1];
    const openBrace = text.indexOf('{', match.index);
    const closeIdx  = findMatchingBrace(text, openBrace);
    if (closeIdx === -1) continue;
    const body      = text.slice(openBrace + 1, closeIdx);
    const pairs     = parseBankBody(body);
    banks.push({ name, pairs });
  }

  // Pool-size check
  const undersizedPools = []; // { bank, character, dimension, size }
  // Cross-bank collision check
  const entryMap = new Map(); // entry -> [{ bank, character, dimension }]

  let totalPools   = 0;
  let totalEntries = 0;

  for (const { name, pairs } of banks) {
    for (const { key, entries } of pairs) {
      totalPools++;
      totalEntries += entries.length;
      const { character, dimension } = labelFor(name, key);
      if (entries.length < 6) {
        undersizedPools.push({ bank: name, character, dimension, size: entries.length });
      }
      for (const raw of entries) {
        const normalised = raw.trim().toLowerCase();
        if (!normalised) continue;
        if (!entryMap.has(normalised)) entryMap.set(normalised, []);
        entryMap.get(normalised).push({ bank: name, character, dimension, raw });
      }
    }
  }

  const collisions = [];
  for (const [normalised, sites] of entryMap) {
    // Cross-CHARACTER bleed is the signal we care about — same flavour entry
    // surfacing in two different characters' pools (Lever 1 variation promise).
    // Same character appearing in multiple panels (e.g. Cox in Boardroom +
    // ComedyRoom) legitimately shares enthusiasm triggers — those are NOT
    // collisions for our purposes.
    // Also flag intra-character intra-dimension duplicates (one entry listed
    // twice in the same pool — almost always a typo).
    const uniqueChars = new Set(sites.map(s => s.character));
    const sameDimSites = sites.length > 1 && sites.every(s => s.character === sites[0].character && s.dimension === sites[0].dimension);
    if (uniqueChars.size > 1) collisions.push({ normalised, sites, reason: 'cross-character' });
    else if (sameDimSites) collisions.push({ normalised, sites, reason: 'intra-pool-duplicate' });
  }

  console.log(`Flavour pool repetition audit — ${banks.length} bank declarations scanned (index.html)`);
  console.log(`  Total pools (keys across all banks): ${totalPools}`);
  console.log(`  Total entries:                       ${totalEntries}`);
  console.log(`  Unique normalised entries:           ${entryMap.size}`);
  console.log(`  Undersized pools (<6 entries):       ${undersizedPools.length}`);
  console.log(`  Cross-character entry collisions:    ${collisions.length}`);

  console.log('\n  Per-bank pool sizes:');
  for (const { name, pairs } of banks) {
    if (pairs.length === 0) {
      console.log(`    ${name}: (no string-array pools parsed)`);
      continue;
    }
    const sizes = pairs.map(p => `${p.key}=${p.entries.length}`).join(', ');
    console.log(`    ${name}: ${sizes}`);
  }

  if (undersizedPools.length > 0) {
    console.log('\n  Undersized pools (Lever 1 floor = 6):');
    for (const u of undersizedPools) {
      console.log(`    - ${u.bank} / ${u.dimension} (character=${u.character}): ${u.size} entries`);
    }
  }

  if (collisions.length > 0) {
    console.log('\n  Cross-character entry collisions (verbatim entry in multiple characters\' pools):');
    for (const { normalised, sites, reason } of collisions) {
      console.log(`    [${reason}] "${normalised}" appears in:`);
      for (const s of sites) {
        console.log(`      - ${s.bank} / ${s.dimension} (character=${s.character}): "${s.raw}"`);
      }
    }
  }

  if (undersizedPools.length === 0 && collisions.length === 0) {
    console.log('\n  ✓ M-1 PASS — all pools >= 6, no cross-bank verbatim collisions');
    process.exit(0);
  }

  console.log('\n  ✗ M-1 FAIL — see issues above');
  process.exit(1);
}

main();
