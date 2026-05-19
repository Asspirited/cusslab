#!/usr/bin/env node
// BL-184 v1 M-4: M-Mech-9 calibration drift — static / structural check.
// Per `leanspirited-standards/standards/panel-voice-principles.md` Lever 4:
// "M-Mech-9 calibration scale uses only L3-L5; L1-L2 = just warmth; L6-L7 =
// collapse to open hostility". Each character that participates in M-Mech-9
// declares its allowed band in P9 `incongruent_register` sub-fields.
//
// v1 — file-only static check (no transcript replay needed):
//   - Scans `characters/*.md` for P9 `incongruent_register` sub-field blocks.
//   - For every character that declares the block, parses:
//     polarities    : must be subset of { hostile_as_warm, warm_as_hostile }
//     allowed_levels: must be subset of [1..7], length >= 1, monotonic
//     motivations   : must have length >= 1
//   - Flags any character whose declaration is malformed.
//   - Flags any character whose `allowed_levels` strays outside the spec'd
//     L3-L5 sweet spot (anything <3 or >5 is calibration drift — the band
//     is allowed to be a *subset* of [3,4,5] but not to include other values
//     unless we explicitly widen the spec).
//   - Reports the cohort: per-polarity counts, per-motivation counts, per-band.
//   - Exit 0 if all declarations well-formed and within [3,5] band;
//     exit 1 otherwise.
//
// v2 (deferred — see BL-207): transcript-replay version that samples N
// actual M-Mech-9 firings per character from Worker logs / HCSession captures
// and uses a secondary LLM judge to score the calibration level achieved
// (1-7 scale) per turn vs the declared band. Requires (a) transcript capture
// infrastructure not yet in place, (b) Anthropic API spend per sample.
//
// Run: node pipeline/measurement/mech-calibration-drift.js
// CI: invoked by run-all.js when wired (deferred).

'use strict';

const fs   = require('fs');
const path = require('path');

const charactersDir = path.join(__dirname, '..', '..', 'characters');

const ALLOWED_POLARITIES  = new Set(['hostile_as_warm', 'warm_as_hostile']);
const SPEC_BAND_MIN       = 3;
const SPEC_BAND_MAX       = 5;
const ABSOLUTE_LEVEL_MIN  = 1;
const ABSOLUTE_LEVEL_MAX  = 7;

// Match a line like: `- **polarities:** \`[hostile_as_warm, warm_as_hostile]\` — ...`
// Field captured in group 1, values list (still bracketed) in group 2.
const FIELD_RE = /^[-*]\s*\*\*(polarities|allowed_levels|motivations)\s*:\*\*\s*`\[([^\]]*)\]`/gm;

// Parse the values inside `[a, b, c]` into a list of trimmed strings.
function parseValueList(raw) {
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

// Returns true if the character's `incongruent_register` mentions include at
// least one that is NOT in an exclusion context (CANNOT FIRE / NOT AVAILABLE /
// EXCLUDED / N/A / "not in their toolkit"). Characters whose only mention is
// an explicit opt-out are NOT considered M-Mech-9 participants.
function hasRealIncongruentMention(text) {
  if (!/incongruent_register/.test(text)) return false;
  const lines = text.split('\n');
  for (const ln of lines) {
    if (!/incongruent_register/.test(ln)) continue;
    if (/CANNOT FIRE|NOT AVAILABLE|EXCLUDED|N\/A|not in (their|his|her) toolkit/.test(ln)) continue;
    return true;
  }
  return false;
}

// Parse one character file's incongruent_register sub-fields (if present).
// Returns { declared: bool, polarities, allowed_levels, motivations, issues[] }.
function parseCharacterFile(text) {
  const out = { declared: false, polarities: [], allowed_levels: [], motivations: [], issues: [] };

  // Heuristic: presence of `incongruent_register sub-fields` header OR of any
  // of the three bullet-fields is taken as "declared".
  if (!hasRealIncongruentMention(text)) return out;
  if (!/\*\*(polarities|allowed_levels|motivations)\s*:\*\*/.test(text)) return out;

  out.declared = true;

  FIELD_RE.lastIndex = 0;
  let match;
  while ((match = FIELD_RE.exec(text)) !== null) {
    const field  = match[1];
    const values = parseValueList(match[2]);
    if (field === 'polarities')      out.polarities      = values;
    else if (field === 'allowed_levels') out.allowed_levels = values.map(v => Number(v));
    else if (field === 'motivations')    out.motivations    = values;
  }

  // Validate polarities
  if (out.polarities.length === 0) {
    out.issues.push('polarities: missing or empty');
  } else {
    for (const p of out.polarities) {
      if (!ALLOWED_POLARITIES.has(p)) out.issues.push(`polarities: unknown value "${p}"`);
    }
  }

  // Validate allowed_levels
  if (out.allowed_levels.length === 0) {
    out.issues.push('allowed_levels: missing or empty');
  } else {
    for (const lvl of out.allowed_levels) {
      if (!Number.isInteger(lvl)) {
        out.issues.push(`allowed_levels: non-integer "${lvl}"`);
      } else if (lvl < ABSOLUTE_LEVEL_MIN || lvl > ABSOLUTE_LEVEL_MAX) {
        out.issues.push(`allowed_levels: ${lvl} outside [${ABSOLUTE_LEVEL_MIN},${ABSOLUTE_LEVEL_MAX}]`);
      } else if (lvl < SPEC_BAND_MIN || lvl > SPEC_BAND_MAX) {
        out.issues.push(`allowed_levels: ${lvl} outside L${SPEC_BAND_MIN}-L${SPEC_BAND_MAX} spec sweet-spot (calibration drift)`);
      }
    }
    // Monotonic check — entries should appear in ascending order
    for (let i = 1; i < out.allowed_levels.length; i++) {
      if (out.allowed_levels[i] <= out.allowed_levels[i - 1]) {
        out.issues.push(`allowed_levels: not strictly ascending at index ${i}`);
        break;
      }
    }
  }

  // Validate motivations
  if (out.motivations.length === 0) {
    out.issues.push('motivations: missing or empty');
  }

  return out;
}

function main() {
  const files = fs.readdirSync(charactersDir)
    .filter(f => f.endsWith('.md'))
    .sort();

  const declarations    = []; // { id, polarities, allowed_levels, motivations, issues }
  const lieStyleOnly    = []; // ids that mention incongruent_register only via lie_style
  let charactersScanned = 0;

  for (const f of files) {
    charactersScanned++;
    const id   = path.basename(f, '.md');
    const text = fs.readFileSync(path.join(charactersDir, f), 'utf8');
    const parsed = parseCharacterFile(text);
    if (parsed.declared) {
      declarations.push({ id, ...parsed });
    } else if (hasRealIncongruentMention(text)) {
      lieStyleOnly.push(id);
    }
  }

  // Cohort summaries
  const polarityCounts   = { hostile_as_warm: 0, warm_as_hostile: 0, both: 0 };
  const motivationCounts = new Map();
  const bandCounts       = new Map(); // band string ("3,4,5") -> count
  let issueCount = 0;

  for (const d of declarations) {
    if (d.polarities.includes('hostile_as_warm') && d.polarities.includes('warm_as_hostile')) polarityCounts.both++;
    else if (d.polarities.includes('hostile_as_warm')) polarityCounts.hostile_as_warm++;
    else if (d.polarities.includes('warm_as_hostile')) polarityCounts.warm_as_hostile++;
    for (const m of d.motivations) motivationCounts.set(m, (motivationCounts.get(m) || 0) + 1);
    const bandKey = d.allowed_levels.join(',') || '(none)';
    bandCounts.set(bandKey, (bandCounts.get(bandKey) || 0) + 1);
    issueCount += d.issues.length;
  }

  console.log(`M-Mech-9 calibration drift audit — ${charactersScanned} character files scanned`);
  console.log(`  Characters with formal incongruent_register sub-fields: ${declarations.length}`);
  console.log(`  Characters mentioning it only in lie_style (no sub-fields): ${lieStyleOnly.length}`);
  console.log(`  Total validation issues:                                  ${issueCount}`);

  if (lieStyleOnly.length > 0) {
    console.log('\n  INFO — characters with lie_style only (M-Mech-9 enabled but no calibration declared):');
    console.log(`    ${lieStyleOnly.join(', ')}`);
    console.log('    These characters will fall through to engine defaults when M-Mech-9 fires.');
    console.log('    Not a failure; v2 (LLM-judge transcript replay) will measure actual drift.');
  }

  console.log('\n  Polarity coverage (across declaring characters):');
  console.log(`    hostile_as_warm only: ${polarityCounts.hostile_as_warm}`);
  console.log(`    warm_as_hostile only: ${polarityCounts.warm_as_hostile}`);
  console.log(`    both polarities:      ${polarityCounts.both}`);

  console.log('\n  Allowed-level bands (count of characters per band):');
  const sortedBands = [...bandCounts.entries()].sort((a, b) => b[1] - a[1]);
  for (const [band, n] of sortedBands) {
    console.log(`    [${band}]: ${n}`);
  }

  console.log('\n  Motivation distribution (count of characters per motivation):');
  const sortedMotivs = [...motivationCounts.entries()].sort((a, b) => b[1] - a[1]);
  for (const [m, n] of sortedMotivs) {
    console.log(`    ${m}: ${n}`);
  }

  if (issueCount > 0) {
    console.log('\n  Validation issues by character:');
    for (const d of declarations) {
      if (d.issues.length === 0) continue;
      console.log(`    ${d.id}:`);
      for (const issue of d.issues) console.log(`      - ${issue}`);
    }
    console.log('\n  ✗ M-4 FAIL — calibration drift or malformed declarations above');
    process.exit(1);
  }

  console.log('\n  ✓ M-4 PASS — all declarations well-formed and within L3-L5 sweet spot');
  process.exit(0);
}

main();
