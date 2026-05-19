#!/usr/bin/env node
// BL-184 v1 M-3: reacts_to mechanism wiring coverage audit.
// Per `leanspirited-standards/standards/panel-voice-principles.md` Lever 3:
// "≥50% of turns from turn 2 onward have `reacts_to` populated" — currently
// claimed but unmeasured. Lever 3 is delivered prompt-side via the
// CROSS-CHARACTER REFERENCES block in `src/logic/panel-discuss-engine.js`,
// gated on `ctx.crossCharacterReferencesEnabled === true`.
//
// v1 — engine-wiring coverage check (no transcript replay needed):
//   - Scans `index.html` for every `PanelDiscussEngine.buildSystemPrompt({...})`
//     call (the canonical engine surface). Parses the ctx object to detect
//     which mechanism flags are wired (true / false / missing).
//   - Reports a panel-by-panel matrix of mechanism flags.
//   - Identifies discussion-style panels (IIFEs with MEMBERS + TURN_RULES)
//     that do NOT use the engine at all — these have no Lever 3 surface and
//     cannot honour the reacts_to promise.
//   - Exit 0 if every engine-using call passes `crossCharacterReferencesEnabled: true`
//     AND no MEMBERS+TURN_RULES panel is missing the engine entirely;
//     exit 1 if any panel is missing it.
//
// v2 (deferred): transcript-replay version that samples N actual outputs
// from Worker logs / HCSession captures and counts turns with `reacts_to`
// populated rate from turn 2 onward, asserting the ≥50% Lever 3 claim.
//
// Run: node pipeline/measurement/reacts-to-coverage.js
// CI: invoked by run-all.js when wired (deferred).

'use strict';

const fs   = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', '..', 'index.html');

// Mechanism flags surfaced through `buildSystemPrompt` ctx (per
// src/logic/panel-discuss-engine.js). crossCharacterReferencesEnabled is the
// canonical Lever 3 reacts_to surface — the others are tracked for context so
// the wiring matrix is useful for engineering review beyond M-3 itself.
const MECH_FLAGS = [
  'crossCharacterReferencesEnabled',   // Lever 3 — reacts_to / BL-163
  'crossCharacterQuestionsEnabled',    // BL-171
  'parodyEnabled',                     // BL-175
  'profanityEnabled',                  // BL-169
  'reverentAbsurdityEnabled',          // BL-179
  'topicMagnetsEnabled',               // BL-178
  'incongruentRegisterEnabled',        // M-Mech-9
  'idiomInventionEnabled',             // BL-174
  'inventedExpertInterpretationEnabled', // BL-188
  'hangModeEnabled',                   // BL-180
  'shutdownModeEnabled',               // BL-181
  'eggingOnEnabled',                   // BL-183
  'panelConsensusEnabled',             // BL-189
];

// The flag that owns the M-3 promise (Lever 3 reacts_to surface).
const M3_FLAG = 'crossCharacterReferencesEnabled';

// Find the matching closing `}` for an object literal starting at `openIdx`
// (the index of the opening `{`). Identical to flavour-repetition.js.
function findMatchingBrace(text, openIdx) {
  let depth = 0;
  let i     = openIdx;
  const len = text.length;
  while (i < len) {
    const ch  = text[i];
    const nxt = text[i + 1];
    if (ch === '/' && nxt === '/') {
      const nl = text.indexOf('\n', i);
      if (nl === -1) return -1;
      i = nl + 1;
      continue;
    }
    if (ch === '/' && nxt === '*') {
      const end = text.indexOf('*/', i + 2);
      if (end === -1) return -1;
      i = end + 2;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      const q = ch;
      i++;
      while (i < len) {
        if (text[i] === '\\') { i += 2; continue; }
        if (text[i] === q) { i++; break; }
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

// Find the line number for an index into the text.
function lineNumberFor(text, idx) {
  let line = 1;
  for (let i = 0; i < idx && i < text.length; i++) {
    if (text[i] === '\n') line++;
  }
  return line;
}

// Identify the nearest enclosing IIFE module — finds the most recent
// `const ModuleName = (() => {` declaration above the given index. Returns
// the module name, or '(top-level)' if none found.
function enclosingPanelName(text, idx) {
  const slice = text.slice(0, idx);
  const re = /\bconst\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(\(\)\s*=>/g;
  let m;
  let last = null;
  while ((m = re.exec(slice)) !== null) {
    last = m[1];
  }
  return last || '(top-level)';
}

// Extract literal boolean value for a top-level flag inside a ctx object
// body. Returns true / false / null (null = flag not present at top level).
// Only matches `flag: true` / `flag: false` literally — anything else
// (variable, expression, ternary) is reported as 'expression'.
function flagValue(body, flag) {
  // Match top-level only — flag must follow a comma or the body start, allowing
  // whitespace/comments. We approximate by requiring the flag at a line whose
  // leading non-space chars start with the flag identifier (i.e. one level deep).
  const re = new RegExp(`(^|[\\n,])\\s*${flag}\\s*:\\s*([^,\\n]+)`);
  const m = body.match(re);
  if (!m) return null;
  const raw = m[2].trim().replace(/[,;]+$/, '').trim();
  if (raw === 'true')  return true;
  if (raw === 'false') return false;
  return 'expression';
}

// Find all PanelDiscussEngine.buildSystemPrompt({...}) call sites and parse
// each ctx body.
function findEngineCalls(text) {
  const calls = [];
  const re = /PanelDiscussEngine\.buildSystemPrompt\s*\(\s*\{/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const braceIdx = text.indexOf('{', m.index);
    const closeIdx = findMatchingBrace(text, braceIdx);
    if (closeIdx === -1) continue;
    const body  = text.slice(braceIdx + 1, closeIdx);
    const panel = enclosingPanelName(text, m.index);
    const line  = lineNumberFor(text, m.index);
    const flags = {};
    for (const flag of MECH_FLAGS) {
      flags[flag] = flagValue(body, flag);
    }
    calls.push({ panel, line, flags });
  }
  return calls;
}

// Find all discussion-style panels — IIFE modules that declare both a MEMBERS
// array and a TURN_RULES constant. These are panels that follow the engine
// shape and should (ideally) use PanelDiscussEngine.buildSystemPrompt.
function findDiscussionPanels(text) {
  const re = /\bconst\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(\(\)\s*=>\s*\{/g;
  const modules = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const name     = m[1];
    const startIdx = m.index;
    const openIdx  = text.indexOf('{', startIdx);
    const closeIdx = findMatchingBrace(text, openIdx);
    if (closeIdx === -1) continue;
    const body    = text.slice(openIdx + 1, closeIdx);
    const hasMembers   = /\bconst\s+MEMBERS\s*=\s*\[/.test(body);
    const hasTurnRules = /\bconst\s+(?:[A-Z_]+_)?TURN_RULES\s*=\s*[`'"]/.test(body)
                      || /\bconst\s+TURN_RULES\s*=\s*[A-Z_]+TURN_RULES\b/.test(body);
    if (hasMembers && hasTurnRules) {
      modules.push({ name, line: lineNumberFor(text, startIdx) });
    }
  }
  return modules;
}

function formatFlagValue(v) {
  if (v === true)  return 'TRUE ';
  if (v === false) return 'false';
  if (v === null)  return '  -  ';
  return '<expr>';
}

function main() {
  const text  = fs.readFileSync(indexPath, 'utf8');
  const calls = findEngineCalls(text);
  const panels = findDiscussionPanels(text);

  const enginePanels = new Set(calls.map(c => c.panel));
  const missingEngine = panels.filter(p => !enginePanels.has(p.name));

  console.log(`reacts_to coverage audit — wiring matrix (M-3 / Lever 3)`);
  console.log(`  Discussion-style panel modules (MEMBERS + TURN_RULES): ${panels.length}`);
  console.log(`  PanelDiscussEngine.buildSystemPrompt call sites:        ${calls.length}`);
  console.log(`  Panels using engine:                                    ${enginePanels.size}`);
  console.log(`  Panels NOT using engine (no Lever 3 surface):           ${missingEngine.length}`);

  if (calls.length === 0) {
    console.log('\n  ✗ M-3 FAIL — no PanelDiscussEngine.buildSystemPrompt call sites found.');
    process.exit(1);
  }

  // Wiring matrix — short tags ensure no header collision.
  const SHORT = {
    crossCharacterReferencesEnabled:     'reacts',
    crossCharacterQuestionsEnabled:      'xqstn ',
    parodyEnabled:                       'parody',
    profanityEnabled:                    'profan',
    reverentAbsurdityEnabled:            'rvabs ',
    topicMagnetsEnabled:                 'magnet',
    incongruentRegisterEnabled:          'incong',
    idiomInventionEnabled:               'idiom ',
    inventedExpertInterpretationEnabled: 'invXpr',
    hangModeEnabled:                     'hang  ',
    shutdownModeEnabled:                 'shtdwn',
    eggingOnEnabled:                     'egging',
    panelConsensusEnabled:               'consen',
  };
  console.log('\n  Wiring matrix (TRUE / false / - missing / <expr> non-literal):');
  const hdr = MECH_FLAGS.map(f => SHORT[f].padEnd(7)).join(' ');
  console.log(`    panel:line       ${hdr}`);
  for (const c of calls) {
    const row = MECH_FLAGS.map(f => formatFlagValue(c.flags[f]).padEnd(7)).join(' ');
    console.log(`    ${(c.panel + ':' + c.line).padEnd(17)}${row}`);
  }
  console.log(`\n  Flag legend:`);
  for (const f of MECH_FLAGS) {
    console.log(`    ${SHORT[f].padEnd(7)} = ${f}`);
  }

  if (missingEngine.length > 0) {
    console.log('\n  Discussion-style panels NOT using PanelDiscussEngine (no Lever 3 surface):');
    for (const p of missingEngine) {
      console.log(`    - ${p.name} (declared at line ${p.line})`);
    }
  }

  // M-3 pass criterion: every engine call site has crossCharacterReferencesEnabled === true.
  const m3Failures = calls.filter(c => c.flags[M3_FLAG] !== true);
  if (m3Failures.length > 0) {
    console.log(`\n  ✗ M-3 FAIL — ${m3Failures.length} engine call(s) missing ${M3_FLAG}: true:`);
    for (const c of m3Failures) {
      console.log(`    - ${c.panel}:${c.line} (${M3_FLAG} = ${formatFlagValue(c.flags[M3_FLAG]).trim()})`);
    }
    process.exit(1);
  }

  if (missingEngine.length > 0) {
    console.log(`\n  ✗ M-3 FAIL — ${missingEngine.length} discussion-style panel(s) have no Lever 3 surface (not using engine).`);
    process.exit(1);
  }

  console.log(`\n  ✓ M-3 PASS — all ${calls.length} engine call(s) wire ${M3_FLAG}: true; all discussion panels use engine.`);
  process.exit(0);
}

main();
