#!/usr/bin/env node
// BL-217 future-scope M-7: P12/P13/P14 structural validation.
// Per `leanspirited-standards/standards/character-schema.md` DRAFT
// (commit bf1fb56) Panel Response Modes section. Validates that every
// character file's P12 HANG MODE, P13 SHUTDOWN CAPABILITY, and P14
// DISMISSAL PROFILE entries are well-formed against the observed-usage
// enums, the speakable-string rule (BL-212), and the conditional-field
// requirements.
//
// Static / structural check (no transcript replay):
//   - Scans characters/*.md for **field:** patterns and parses values.
//   - P12: can_leave_hanging is bool. If true, hang_triggers + hang_reactions
//     populated with enum-valid values.
//   - P13: shutdown_capability ∈ {high, medium, low}. If >= medium,
//     shutdown_motivations populated with enum-valid values.
//   - P14: dismissal_profile pools (polite_but_funny / cold_dismissal /
//     piss_take) — entries must contain speakable content (BL-212 rule:
//     pure stage-direction `"[...]"` entries disallowed).
//   - Reports distribution + flags any violations.
//   - Exit 0 if all well-formed, exit 1 otherwise.
//
// Schema status: DRAFT pending Three Amigos. Enum values match the
// observed cohort as of 2026-05-19. If Three Amigos extends the enums,
// the constants below must be updated in lockstep.
//
// Run: node pipeline/measurement/p12-p14-structure.js
// CI: invoked by run-all.js when wired (deferred).

'use strict';

const fs   = require('fs');
const path = require('path');

const charactersDir = path.join(__dirname, '..', '..', 'characters');

const HANG_TRIGGERS_ENUM      = new Set(['discomfort', 'rhetorical', 'cruelty', 'insanity']);
const HANG_REACTIONS_ENUM     = new Set(['audible_pause_then_continue', 'tumbleweed_marker', 'brief_redirect', 'pivot_to_new_topic']);
const SHUTDOWN_CAPABILITY_ENUM = new Set(['high', 'medium', 'low']);
const SHUTDOWN_MOTIVATIONS_ENUM = new Set(['taste', 'target_protection', 'madness_control', 'self_protection']);
const DISMISSAL_FLAVOURS       = ['polite_but_funny', 'cold_dismissal', 'piss_take'];

// Match `**field:** value` patterns. Tolerates "**field:**" header variation.
const BOOL_RE = (name) => new RegExp(`\\*\\*${name}\\s*:\\*\\*\\s*(true|false)`, 'i');
const ENUM_RE = (name) => new RegExp(`\\*\\*${name}\\s*:\\*\\*\\s*([a-zA-Z_]+)`);
const LIST_RE = (name) => new RegExp(`\\*\\*${name}\\s*:\\*\\*\\s*\\[([^\\]]*)\\]`);

function parseList(raw) {
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

// Pure-stage-direction detection: an entry that starts with `[` and ends
// with `]` with no speakable text outside the brackets is disallowed (BL-212).
// Bracketed prefix/suffix with speakable content is OK.
function isPureStageDirection(entry) {
  const trimmed = entry.trim();
  if (!trimmed.startsWith('[')) return false;
  if (!trimmed.endsWith(']')) return false;
  // Single bracketed block with nothing else
  const inner = trimmed.slice(1, -1);
  return !inner.includes(']') && !inner.includes('[');
}

// Parse a dismissal_profile block from a character's text. Returns object
// with three sub-arrays (each may be undefined if the flavour is absent).
function parseDismissalProfile(text) {
  // Find the dismissal_profile section — heuristic: from "dismissal_profile"
  // or `**dismissal_profile:**` until the next `---` or end of file.
  const startMatch = text.match(/dismissal_profile\s*:?\*?\*?[\s\S]/);
  if (!startMatch) return null;
  const startIdx = startMatch.index;
  const tail = text.slice(startIdx);
  const endIdx = tail.search(/\n---\n|\n## /);
  const block = endIdx === -1 ? tail : tail.slice(0, endIdx);

  const out = {};
  for (const flavour of DISMISSAL_FLAVOURS) {
    // Two formats seen across the cohort:
    //   YAML-ish:   `**polite_but_funny:** ["...", "..."]`
    //   Bullet form: `**polite_but_funny:**\n    - "..."`
    const inlineRe  = new RegExp(`\\*\\*${flavour}\\s*:\\*\\*\\s*\\[([^\\]]*)\\]`);
    const bulletRe  = new RegExp(`\\*\\*${flavour}\\s*:\\*\\*([\\s\\S]*?)(?=\\*\\*(?:${DISMISSAL_FLAVOURS.join('|')})\\s*:\\*\\*|$)`);

    const inlineM = block.match(inlineRe);
    if (inlineM) {
      // Inline array form: split on quoted strings
      const raw = inlineM[1];
      const entries = [];
      const strRe = /"((?:[^"\\]|\\.)*)"/g;
      let m;
      while ((m = strRe.exec(raw)) !== null) entries.push(m[1]);
      out[flavour] = entries;
      continue;
    }
    const bulletM = block.match(bulletRe);
    if (bulletM) {
      const body = bulletM[1];
      const entries = [];
      const lineRe = /^\s*-\s*"((?:[^"\\]|\\.)*)"\s*$/gm;
      let m;
      while ((m = lineRe.exec(body)) !== null) entries.push(m[1]);
      out[flavour] = entries;
    }
  }

  return out;
}

function parseCharacterFile(text) {
  const out = {
    can_leave_hanging:   null,
    hang_triggers:       null,
    hang_reactions:      null,
    shutdown_capability: null,
    shutdown_motivations: null,
    dismissal_profile:   null,
    issues: [],
  };

  const boolM = text.match(BOOL_RE('can_leave_hanging'));
  if (boolM) out.can_leave_hanging = boolM[1].toLowerCase() === 'true';

  const hangTrigM = text.match(LIST_RE('hang_triggers'));
  if (hangTrigM) out.hang_triggers = parseList(hangTrigM[1]);

  const hangReactM = text.match(LIST_RE('hang_reactions'));
  if (hangReactM) out.hang_reactions = parseList(hangReactM[1]);

  const capM = text.match(ENUM_RE('shutdown_capability'));
  if (capM) out.shutdown_capability = capM[1].toLowerCase();

  const motivM = text.match(LIST_RE('shutdown_motivations'));
  if (motivM) out.shutdown_motivations = parseList(motivM[1]);

  out.dismissal_profile = parseDismissalProfile(text);

  // P12 validation
  if (out.can_leave_hanging === true) {
    if (!out.hang_triggers || out.hang_triggers.length === 0) {
      out.issues.push('P12: can_leave_hanging=true but hang_triggers missing/empty');
    } else {
      for (const t of out.hang_triggers) {
        if (!HANG_TRIGGERS_ENUM.has(t)) out.issues.push(`P12: hang_triggers unknown value "${t}"`);
      }
    }
    if (!out.hang_reactions || out.hang_reactions.length === 0) {
      out.issues.push('P12: can_leave_hanging=true but hang_reactions missing/empty');
    } else {
      for (const r of out.hang_reactions) {
        if (!HANG_REACTIONS_ENUM.has(r)) out.issues.push(`P12: hang_reactions unknown value "${r}"`);
      }
    }
  }

  // P13 validation
  if (out.shutdown_capability !== null && !SHUTDOWN_CAPABILITY_ENUM.has(out.shutdown_capability)) {
    out.issues.push(`P13: shutdown_capability unknown value "${out.shutdown_capability}"`);
  }
  if (out.shutdown_capability === 'high' || out.shutdown_capability === 'medium') {
    if (!out.shutdown_motivations || out.shutdown_motivations.length === 0) {
      out.issues.push(`P13: shutdown_capability=${out.shutdown_capability} but shutdown_motivations missing/empty`);
    } else {
      for (const m of out.shutdown_motivations) {
        if (!SHUTDOWN_MOTIVATIONS_ENUM.has(m)) out.issues.push(`P13: shutdown_motivations unknown value "${m}"`);
      }
    }
  }

  // P14 validation (speakable-string rule)
  if (out.dismissal_profile) {
    for (const flavour of DISMISSAL_FLAVOURS) {
      const entries = out.dismissal_profile[flavour];
      if (!entries) continue;
      for (const e of entries) {
        if (isPureStageDirection(e)) {
          out.issues.push(`P14: ${flavour} contains pure stage-direction entry "${e}" (BL-212 rule violation — belongs in P12 HANG MODE)`);
        }
      }
    }
  }

  return out;
}

function main() {
  const files = fs.readdirSync(charactersDir)
    .filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md')
    .sort();

  const records = []; // { id, ...parsed }
  let totalIssues = 0;

  for (const f of files) {
    const id   = path.basename(f, '.md');
    const text = fs.readFileSync(path.join(charactersDir, f), 'utf8');
    const parsed = parseCharacterFile(text);
    records.push({ id, ...parsed });
    totalIssues += parsed.issues.length;
  }

  // Cohort distribution
  const hangTrue  = records.filter(r => r.can_leave_hanging === true).length;
  const hangFalse = records.filter(r => r.can_leave_hanging === false).length;
  const hangNull  = records.filter(r => r.can_leave_hanging === null).length;
  const capHigh   = records.filter(r => r.shutdown_capability === 'high').length;
  const capMed    = records.filter(r => r.shutdown_capability === 'medium').length;
  const capLow    = records.filter(r => r.shutdown_capability === 'low').length;
  const capNull   = records.filter(r => r.shutdown_capability === null).length;
  const withDismissal = records.filter(r => r.dismissal_profile && Object.keys(r.dismissal_profile).length > 0).length;

  console.log(`P12/P13/P14 structural validation — ${records.length} character files scanned`);
  console.log(`  Per leanspirited-standards/character-schema.md DRAFT (BL-217)`);
  console.log(`  Total validation issues: ${totalIssues}`);

  console.log('\n  P12 HANG MODE distribution:');
  console.log(`    can_leave_hanging true:  ${hangTrue}`);
  console.log(`    can_leave_hanging false: ${hangFalse}`);
  console.log(`    not declared:            ${hangNull}`);

  console.log('\n  P13 SHUTDOWN CAPABILITY distribution:');
  console.log(`    high:   ${capHigh}`);
  console.log(`    medium: ${capMed}`);
  console.log(`    low:    ${capLow}`);
  console.log(`    not declared: ${capNull}`);

  console.log(`\n  P14 DISMISSAL PROFILE: ${withDismissal} characters have at least one pool defined`);

  if (totalIssues > 0) {
    console.log('\n  Validation issues by character:');
    for (const r of records) {
      if (r.issues.length === 0) continue;
      console.log(`    ${r.id}:`);
      for (const issue of r.issues) console.log(`      - ${issue}`);
    }
    console.log(`\n  ✗ M-7 FAIL — ${totalIssues} validation issue(s) above`);
    process.exit(1);
  }

  console.log('\n  ✓ M-7 PASS — all character files conform to BL-217 DRAFT schema');
  process.exit(0);
}

main();
