#!/usr/bin/env node
// BL-184 v1 M-5: cross-character magnet collision audit.
// Per `leanspirited-standards/standards/character-schema.md` P11 rule:
// "No magnet shared verbatim across characters (BL-176 / WL-131 compliance)."
//
// Scans `characters/*.md` for P11 magnet topic lines, normalises them, and flags
// any topic that appears in more than one character file. Exit 0 = clean.
// Exit 1 = collision(s) detected.
//
// Run: node pipeline/measurement/magnet-collision.js
// CI: invoked by run-all.js when wired.

'use strict';

const fs = require('fs');
const path = require('path');

const charactersDir = path.join(__dirname, '..', '..', 'characters');

// Match lines like:
//   **MAGNET 1 — Pre-1900 golf history (Prestwick, ...)**
//   **MAGNET 2 — Victorian wage data**
// Extract the topic phrase between the em-dash and end-of-name (before opening paren).
const MAGNET_RE = /^\s*\*\*MAGNET\s+\d+\s+[—-]\s+(.+?)\s*\*\*\s*$/i;

function normaliseTopic(topic) {
  return topic
    .toLowerCase()
    .replace(/\(.*?\)/g, '')      // strip parenthesised clarifications
    .replace(/[\/].*$/, '')        // strip everything after first slash (alt names)
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMagnets(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split('\n');
  const topics = [];
  for (const line of lines) {
    const m = line.match(MAGNET_RE);
    if (m) topics.push({ raw: m[1].trim(), normalised: normaliseTopic(m[1]) });
  }
  return topics;
}

function main() {
  const files = fs.readdirSync(charactersDir)
    .filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md')
    .map(f => path.join(charactersDir, f));

  const topicMap = new Map(); // normalised -> [{file, raw}]
  let charactersWithMagnets = 0;

  for (const filePath of files) {
    const magnets = extractMagnets(filePath);
    if (magnets.length === 0) continue;
    charactersWithMagnets++;
    const char = path.basename(filePath, '.md');
    for (const { raw, normalised } of magnets) {
      if (!topicMap.has(normalised)) topicMap.set(normalised, []);
      topicMap.get(normalised).push({ char, raw });
    }
  }

  const collisions = [];
  for (const [normalised, entries] of topicMap) {
    if (entries.length > 1) collisions.push({ normalised, entries });
  }

  const totalMagnets = Array.from(topicMap.values()).reduce((n, arr) => n + arr.length, 0);

  console.log(`Magnet collision audit — ${files.length} character files scanned`);
  console.log(`  Characters with P11 magnets: ${charactersWithMagnets}`);
  console.log(`  Total magnet topics declared: ${totalMagnets}`);
  console.log(`  Unique normalised topics:    ${topicMap.size}`);
  console.log(`  Collisions detected:         ${collisions.length}`);

  if (collisions.length === 0) {
    console.log('  ✓ M-5 PASS — no cross-character magnet collisions');
    process.exit(0);
  }

  console.log('  ✗ M-5 FAIL — collisions:');
  for (const { normalised, entries } of collisions) {
    console.log(`    "${normalised}" appears in:`);
    for (const { char, raw } of entries) {
      console.log(`      - ${char}: "${raw}"`);
    }
  }
  process.exit(1);
}

main();
