#!/usr/bin/env node
// BL-184 v1 M-2: magnet surface-rate audit.
// Per leanspirited-standards/standards/character-schema.md P11 rule:
// each character's P11 magnets should surface in their declared anchor items.
// This v1 script audits the WIRING side of the equation — for each character
// with a P11 section, verify that:
//   (a) the character's magnets are also represented in their panel's
//       inline magnet data (e.g. GOLF_MAGNETS for Golf cast)
//   (b) the inline data has at least one anchor item per magnet
// v2 (deferred): transcript-replay version that samples N actual prompt outputs
// from Worker logs and tallies actual fire frequency against declared
// magnetic_strength.
//
// Run: node pipeline/measurement/magnet-surface-rate.js
// CI: invoked by run-all.js when wired (BL-184 follow-on).

'use strict';

const fs = require('fs');
const path = require('path');

const charactersDir = path.join(__dirname, '..', '..', 'characters');
const indexHtmlPath = path.join(__dirname, '..', '..', 'index.html');

const MAGNET_RE = /^\s*\*\*MAGNET\s+\d+\s+[—-]\s+(.+?)\s*\*\*\s*$/i;

function extractCharacterMagnets(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  if (!text.includes('## P11')) return null;
  const lines = text.split('\n');
  const topics = [];
  for (const line of lines) {
    const m = line.match(MAGNET_RE);
    if (m) topics.push(m[1].trim());
  }
  return topics;
}

function extractInlineMagnetMap(indexHtml, mapName) {
  // Find `const <mapName> = { ... };` and parse simple character-id keys.
  const startRe = new RegExp(`const\\s+${mapName}\\s*=\\s*{`);
  const start = indexHtml.search(startRe);
  if (start < 0) return null;
  let depth = 0;
  let i = indexHtml.indexOf('{', start);
  const blockStart = i;
  for (; i < indexHtml.length; i++) {
    if (indexHtml[i] === '{') depth++;
    else if (indexHtml[i] === '}') { depth--; if (depth === 0) break; }
  }
  const block = indexHtml.slice(blockStart, i + 1);
  // Match `id: 'M1 ...'` or `id: "M1 ..."` (multi-line strings included).
  // Use simple heuristic: split on top-level commas via line-start pattern `\n    \w+:\s*`.
  const charMagnetMap = {};
  const entryRe = /\n\s+(\w+(?:-\w+)?):\s*['"`]([\s\S]*?)['"`](?:,|\n\s*})/g;
  let m;
  while ((m = entryRe.exec(block)) !== null) {
    charMagnetMap[m[1]] = m[2];
  }
  return charMagnetMap;
}

function main() {
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // For v1, audit GOLF_MAGNETS specifically. Other panels' magnet maps will be
  // added as they're migrated to PanelDiscussEngine (TIER 1 work in flight).
  const panelMagnetMaps = {
    GOLF_MAGNETS: extractInlineMagnetMap(indexHtml, 'GOLF_MAGNETS')
  };

  const files = fs.readdirSync(charactersDir)
    .filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md')
    .map(f => path.join(charactersDir, f));

  const charactersWithMagnets = new Map();
  for (const filePath of files) {
    const topics = extractCharacterMagnets(filePath);
    if (topics && topics.length > 0) {
      charactersWithMagnets.set(path.basename(filePath, '.md'), topics);
    }
  }

  const failures = [];
  let charactersAuditedAgainstPanelMap = 0;

  for (const [panelMapName, charMagnetMap] of Object.entries(panelMagnetMaps)) {
    if (!charMagnetMap) {
      failures.push(`Panel map ${panelMapName} not found in index.html`);
      continue;
    }
    for (const [charId, inlineMagnetBlob] of Object.entries(charMagnetMap)) {
      const characterFileMagnets = charactersWithMagnets.get(charId);
      if (!characterFileMagnets) {
        failures.push(`${panelMapName}[${charId}]: in inline map but no characters/${charId}.md with P11`);
        continue;
      }
      charactersAuditedAgainstPanelMap++;
      // Count distinct M-labels in inline blob (M1, M2, M3, M4).
      const inlineMagnetCount = (inlineMagnetBlob.match(/M\d+\s*\[/g) || []).length;
      const fileMagnetCount = characterFileMagnets.length;
      if (inlineMagnetCount < fileMagnetCount) {
        failures.push(`${panelMapName}[${charId}]: character file has ${fileMagnetCount} magnets but inline has only ${inlineMagnetCount} — under-represented`);
      }
      // Spot-check: each inline M-block should mention at least 3 anchor items
      // (proxy: count comma-separated tokens in the M-block).
      const mBlocks = inlineMagnetBlob.split(/M\d+\s*\[/).slice(1);
      mBlocks.forEach((b, idx) => {
        const commas = (b.match(/,/g) || []).length;
        if (commas < 3) {
          failures.push(`${panelMapName}[${charId}]: magnet ${idx + 1} appears to have <4 anchor items (commas=${commas})`);
        }
      });
    }
  }

  console.log(`Magnet surface-rate audit (M-2 v1)`);
  console.log(`  Character files with P11:    ${charactersWithMagnets.size}`);
  console.log(`  Panel magnet maps scanned:   ${Object.keys(panelMagnetMaps).length}`);
  console.log(`  Characters audited (panel↔file): ${charactersAuditedAgainstPanelMap}`);
  console.log(`  Issues detected:             ${failures.length}`);

  if (failures.length === 0) {
    console.log('  ✓ M-2 PASS — all panel-inline magnet data matches character files');
    process.exit(0);
  }

  console.log('  ✗ M-2 FAIL — issues:');
  for (const f of failures) console.log(`    - ${f}`);
  process.exit(1);
}

main();
