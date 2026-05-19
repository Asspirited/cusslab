#!/usr/bin/env node
// BL-184 v1 M-6: disagreement-productivity index — static / structural check.
// Per `leanspirited-standards/standards/panel-voice-principles.md` Lever 5:
// productive disagreement requires (a) incongruent register engaged on the
// panel, (b) panel temperature positioned away from the neutral origin so
// there is a directional bias for disagreement to surface against, and
// (c) the cohort of M-Mech-9-capable characters covers both polarities so
// disagreement-by-disguise can run in either direction.
//
// Composite v1 index per panel (0.0-1.0), structural-only:
//   base               0.50  panel has incongruentRegisterEnabled: true (gate)
//   + |intent|>=0.3    0.25  directional intent (HOSTILE or WARM bias present)
//   + |congruence|>=0.2 OR
//     congruence<0     0.25  incongruent-leaning surface (the M-Mech-9 home)
//   cap 1.00
//
// Global gate:
//   - cohort of characters declaring formal incongruent_register sub-fields
//     must cover BOTH polarities (hostile_as_warm AND warm_as_hostile).
//   - If only one polarity is represented across the whole cast, productive
//     disagreement collapses to one-direction-only and the global score is
//     halved.
//
// Pass criteria: every panel with incongruentRegisterEnabled has index >= 0.50
// AND both polarities covered globally.
//
// v2 (deferred — see BL-208): transcript-replay version that samples N
// completed sessions per panel and uses a secondary LLM judge to score:
// % time in L3-L5 incongruence, count of competing voices per round,
// drift-to-consensus events. Requires (a) transcript capture infrastructure,
// (b) Anthropic API spend per sample.
//
// Run: node pipeline/measurement/disagreement-productivity.js
// CI: invoked by run-all.js when wired (deferred).

'use strict';

const fs   = require('fs');
const path = require('path');

const indexPath     = path.join(__dirname, '..', '..', 'index.html');
const charactersDir = path.join(__dirname, '..', '..', 'characters');

const PANEL_THRESHOLD = 0.50;

// Lever-5-ish numeric thresholds — magnitudes below these are treated as
// "essentially neutral" for productivity-scoring purposes.
const INTENT_DIR_THRESHOLD     = 0.3;
const CONGRUENCE_MAG_THRESHOLD = 0.2;

const POLARITY_FIELD_RE = /[-*]\s*\*\*polarities\s*:\*\*\s*`\[([^\]]*)\]`/m;

function parsePolaritiesFromText(text) {
  if (!/incongruent_register/.test(text)) return null;
  const m = text.match(POLARITY_FIELD_RE);
  if (!m) return null;
  return m[1].split(',').map(s => s.trim()).filter(Boolean);
}

function loadGlobalPolarityCoverage() {
  const has = { hostile_as_warm: false, warm_as_hostile: false };
  const files = fs.readdirSync(charactersDir).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const text = fs.readFileSync(path.join(charactersDir, f), 'utf8');
    const polarities = parsePolaritiesFromText(text);
    if (!polarities) continue;
    for (const p of polarities) if (p in has) has[p] = true;
  }
  return has;
}

// Scan index.html for panels with incongruentRegisterEnabled. For each, find
// the nearest panelTemperature: { intent, congruence } below it, and the
// nearest IntellectualAttempts.inject('id', ...) call for the panel id.
function loadEnabledPanels() {
  const text  = fs.readFileSync(indexPath, 'utf8');
  const lines = text.split('\n');
  const panels = []; // { id, intent, congruence, line }

  const ENABLED_RE   = /incongruentRegisterEnabled\s*:\s*true/;
  const TEMP_RE      = /panelTemperature\s*:\s*\{\s*intent\s*:\s*(-?\d+(?:\.\d+)?)\s*,\s*congruence\s*:\s*(-?\d+(?:\.\d+)?)\s*\}/;
  const INJECT_RE    = /IntellectualAttempts\.inject\(\s*['"]([^'"]+)['"]/;
  const LOG_RUN_RE   = /HCSession\.logPanelRun\(\s*['"]([^'"]+)['"]/;
  const TEMP_COMMENT_RE = /\/\/\s*([A-Za-z][A-Za-z0-9 _-]*?)\s*:\s*\{\s*intent/;

  const SEARCH_WINDOW_BELOW = 60;

  for (let i = 0; i < lines.length; i++) {
    if (!ENABLED_RE.test(lines[i])) continue;

    let intent = null, congruence = null, id = null;
    const end = Math.min(lines.length, i + SEARCH_WINDOW_BELOW);
    for (let j = i + 1; j < end; j++) {
      if (intent === null) {
        const m = lines[j].match(TEMP_RE);
        if (m) { intent = Number(m[1]); congruence = Number(m[2]); }
      }
      if (id === null) {
        const m = lines[j].match(INJECT_RE) || lines[j].match(LOG_RUN_RE) || lines[j].match(TEMP_COMMENT_RE);
        if (m) { id = m[1].toLowerCase().replace(/\s+/g, '-'); }
      }
      if (intent !== null && id !== null) break;
    }
    panels.push({ id: id || `(unknown@${i + 1})`, intent, congruence, line: i + 1 });
  }

  return panels;
}

function scorePanel({ intent, congruence }) {
  let s = 0.50; // gate: incongruentRegisterEnabled is on
  if (intent !== null && Math.abs(intent) >= INTENT_DIR_THRESHOLD) s += 0.25;
  if (congruence !== null && (Math.abs(congruence) >= CONGRUENCE_MAG_THRESHOLD || congruence < 0)) s += 0.25;
  if (s > 1) s = 1;
  return s;
}

function main() {
  const polarityCoverage = loadGlobalPolarityCoverage();
  const panels           = loadEnabledPanels();

  const bothPolaritiesCovered = polarityCoverage.hostile_as_warm && polarityCoverage.warm_as_hostile;

  console.log(`Disagreement-productivity audit — ${panels.length} panels with incongruentRegisterEnabled`);
  console.log(`  Global polarity coverage:`);
  console.log(`    hostile_as_warm declared somewhere: ${polarityCoverage.hostile_as_warm ? 'yes' : 'NO'}`);
  console.log(`    warm_as_hostile declared somewhere: ${polarityCoverage.warm_as_hostile ? 'yes' : 'NO'}`);
  console.log(`    both polarities covered:            ${bothPolaritiesCovered ? 'yes' : 'NO (productivity halved)'}`);

  console.log('\n  Per-panel productivity index:');
  const failed = [];
  let sum = 0;
  for (const p of panels) {
    let idx = scorePanel(p);
    if (!bothPolaritiesCovered) idx = idx / 2;
    sum += idx;
    const intentStr     = p.intent     === null ? 'n/a' : p.intent.toFixed(2);
    const congruenceStr = p.congruence === null ? 'n/a' : p.congruence.toFixed(2);
    const status        = idx >= PANEL_THRESHOLD ? '✓' : '✗';
    console.log(`    ${status} ${p.id.padEnd(14)} intent=${intentStr.padStart(5)} congruence=${congruenceStr.padStart(5)}  index=${idx.toFixed(2)}`);
    if (idx < PANEL_THRESHOLD) failed.push(p.id);
  }

  const avg = panels.length === 0 ? 0 : sum / panels.length;
  console.log(`\n  Panel-averaged disagreement-productivity index: ${avg.toFixed(2)}`);

  if (failed.length > 0) {
    console.log(`\n  ✗ M-6 FAIL — ${failed.length} panel(s) below threshold ${PANEL_THRESHOLD.toFixed(2)}: ${failed.join(', ')}`);
    process.exit(1);
  }
  if (!bothPolaritiesCovered) {
    console.log(`\n  ✗ M-6 FAIL — only one M-Mech-9 polarity declared across cast (productivity halved)`);
    process.exit(1);
  }
  if (panels.length === 0) {
    console.log(`\n  ✗ M-6 FAIL — no panels with incongruentRegisterEnabled found`);
    process.exit(1);
  }

  console.log(`\n  ✓ M-6 PASS — all panels >= ${PANEL_THRESHOLD.toFixed(2)} and both polarities covered`);
  process.exit(0);
}

main();
