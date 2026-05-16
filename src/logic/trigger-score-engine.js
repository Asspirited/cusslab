// src/logic/trigger-score-engine.js
// Pure logic for trigger-weighted middle-slot speaker selection (BL-167 Slice 2).
// No DOM, no network I/O, no persistent storage. Stateless.
// Loaded by index.html (browser global TriggerScoreEngine) and by pipeline/unit-runner.js.
//
// Principles governing this module: see .claude/principles/panel-design.md.
//   1. One engine, many panels — score() and selectNext() take panel data as input;
//      no panel hardcoded. ctx.wounds and ctx.enthusiasms are passed in by caller.
//   2. React to the person, not the topic — we score against the IMMEDIATELY PREVIOUS
//      turn, so whoever was lit up by what was just said is more likely to fire next.
//   3. Engine ignorance, voice expression — score() never verifies accuracy. A
//      candidate whose enthusiasm primer matches a misreading of the previous turn
//      still scores the full enthusiasm weight. The character voice handles
//      correctness/register; the engine just picks who fires.
//
// score(candidateId, prevTurnContent, ctx) → number
//
// INPUT:
//   candidateId       string                 candidate to score
//   prevTurnContent   string                 the immediately preceding turn's text
//   ctx: {
//     prevSpeakerId   string (opt)           id of who spoke prevTurnContent
//     wounds          object                 { id: [keyword, ...] }   — fires w1
//     enthusiasms     object                 { id: [keyword, ...] }   — fires w5
//     relState        object (opt)           RelationshipState — fires w3, w6
//     debtLedger      object (opt)           { id: { owedToward: { otherId: bool } } }
//     recentMoves     object (opt)           { id: [postureType,...] } — fires w4
//     claimedTerritory object (opt)          { id: [keyword,...] }    — fires w7
//     weights         object (opt)           { w1..w7 } overrides
//   }
//
// RETURN: non-negative number. Higher = more likely to be selected.
//
// PRINCIPLE 3 — Engine ignorance: phrase matching is case-insensitive substring
//   only. No semantic / accuracy / fact-check call. Misreadings score full weight.
//
// selectNext(remainingCast, prevTurnContent, ctx, opts) → string
//
// INPUT:
//   remainingCast     string[]               candidate ids still in the pool
//   prevTurnContent   string                 the immediately preceding turn's text
//   ctx               object                 same shape as score()
//   opts: {
//     pmin            number (opt, 0..1)     floor probability per cold candidate (default DEFAULT_PMIN)
//     rng             function (opt)         () → [0,1) random source (default Math.random)
//   }
//
// RETURN: one of remainingCast (string).
//
// BEHAVIOUR:
//   - When Σ score > 0: P(i) = pmin/M + (1 - M·pmin) · max(0, score(i)) / Σscore
//     (each candidate has an individual floor pmin; remaining mass is weighted)
//   - When Σ score == 0: P(i) = 1/M for all i (uniform random)
//   - pmin must satisfy M·pmin ≤ 1; otherwise we clamp pmin = 1/M and warn.

const DEFAULT_WEIGHTS = Object.freeze({
  w1: 3, // wound trigger      (negative pull)
  w2: 2, // debt owed          (negative pull)
  w3: 2, // hostile temp       (negative pull)
  w4: 1, // posture contradict (negative pull)
  w5: 3, // enthusiasm primer  (positive pull)  — MUST equal w1 (locked Gherkin #9)
  w6: 2, // warm temp          (positive pull)
  w7: 1, // claimed territory  (positive pull)
});

const DEFAULT_PMIN = 0.10;

// Hostile temperatures (negative w3 pull)
const HOSTILE_TEMPS = new Set(['simmering', 'hot', 'cold', 'cooling']);
// Warm temperatures (positive w6 pull)
const WARM_TEMPS = new Set(['warm', 'reverent']);

// Phrase match — case-insensitive substring. Same idiom as makeWoundDetector.
// Returns true iff ANY keyword from keywords is a substring of text.
function matchAnyKeyword(text, keywords) {
  if (!keywords || !keywords.length) return false;
  const t = String(text || '').toLowerCase();
  if (!t) return false;
  for (const k of keywords) {
    if (!k) continue;
    if (t.includes(String(k).toLowerCase())) return true;
  }
  return false;
}

// Temperature read helper — relState.characters[id].toward[other].temperature
function readTemperature(relState, fromId, towardId) {
  if (!relState || !relState.characters) return null;
  const ch = relState.characters[fromId];
  if (!ch || !ch.toward) return null;
  const t = ch.toward[towardId];
  return (t && typeof t.temperature === 'string') ? t.temperature : null;
}

// score — compute the trigger score for one candidate against one prior turn.
//
// INPUT:
//   candidateId       string                 candidate to score
//   prevTurnContent   string                 the immediately preceding turn's text
//   ctx               object (see top-of-file contract for full shape)
//
// RETURN: non-negative number. Higher = more likely to be selected.
function score(candidateId, prevTurnContent, ctx) {
  ctx = ctx || {};
  const weights = Object.assign({}, DEFAULT_WEIGHTS, ctx.weights || {});

  let total = 0;

  // w1 — wound trigger match
  if (ctx.wounds && matchAnyKeyword(prevTurnContent, ctx.wounds[candidateId])) {
    total += weights.w1;
  }

  // w5 — enthusiasm primer match  (must equal w1 — locked scenario 9)
  if (ctx.enthusiasms && matchAnyKeyword(prevTurnContent, ctx.enthusiasms[candidateId])) {
    total += weights.w5;
  }

  // w7 — claimed territory match
  if (ctx.claimedTerritory && matchAnyKeyword(prevTurnContent, ctx.claimedTerritory[candidateId])) {
    total += weights.w7;
  }

  const prevId = ctx.prevSpeakerId;
  if (prevId) {
    // w2 — debt owed by candidate toward prev speaker
    if (ctx.debtLedger && ctx.debtLedger[candidateId]) {
      const owed = ctx.debtLedger[candidateId].owedToward;
      if (owed && owed[prevId]) total += weights.w2;
    }

    // w3 / w6 — temperature
    const temp = readTemperature(ctx.relState, candidateId, prevId);
    if (temp) {
      if (HOSTILE_TEMPS.has(temp)) total += weights.w3;
      else if (WARM_TEMPS.has(temp)) total += weights.w6;
    }

    // w4 — posture contradiction. recentMoves[prevId] last entry contradicts
    // recentMoves[candidateId] last entry. We treat 'contradiction' minimally:
    // matching postureType values mean alignment; explicit opposites mean contradiction.
    if (ctx.recentMoves) {
      const prevMoves = ctx.recentMoves[prevId] || [];
      const myMoves = ctx.recentMoves[candidateId] || [];
      const prevLast = prevMoves[prevMoves.length - 1];
      const myLast = myMoves[myMoves.length - 1];
      if (prevLast && myLast && areContradictoryPostures(prevLast, myLast)) {
        total += weights.w4;
      }
    }
  }

  return total;
}

// Postures are considered contradictory if they are an explicit opposite pair.
// Conservative table — extend as the register vocabulary grows.
const POSTURE_OPPOSITES = {
  endorsement: 'quiet_disagreement',
  quiet_disagreement: 'endorsement',
  silence_noted: 'deflation',
  deflation: 'silence_noted',
};
function areContradictoryPostures(a, b) {
  return POSTURE_OPPOSITES[a] === b;
}

// selectNext — pick one candidate from remainingCast, weighted by trigger score
// with a per-candidate floor probability pmin.
//
// INPUT:
//   remainingCast     string[]               candidate ids still in the pool
//   prevTurnContent   string                 the immediately preceding turn's text
//   ctx               object                 same shape as score()
//   opts              { pmin, rng } (opt)
//
// RETURN: one id from remainingCast (string).
function selectNext(remainingCast, prevTurnContent, ctx, opts) {
  if (!Array.isArray(remainingCast) || remainingCast.length === 0) {
    throw new Error('selectNext: remainingCast must be a non-empty array');
  }
  opts = opts || {};
  const rng = opts.rng || Math.random;
  const M = remainingCast.length;

  // Clamp pmin so M·pmin ≤ 1 (each candidate gets at least pmin/M base mass)
  let pmin = (typeof opts.pmin === 'number') ? opts.pmin : DEFAULT_PMIN;
  if (pmin < 0) pmin = 0;
  if (pmin * M > 1) pmin = 1 / M;

  // Score every candidate
  const scores = remainingCast.map((id) => Math.max(0, score(id, prevTurnContent, ctx)));
  const total = scores.reduce((s, x) => s + x, 0);

  // Uniform fallback when nobody scores
  if (total === 0) {
    const idx = Math.floor(rng() * M);
    return remainingCast[Math.min(idx, M - 1)];
  }

  // P(i) = pmin + (1 - M·pmin) · score(i) / total
  // (pmin is the per-candidate floor; remaining (1 - M·pmin) is score-weighted)
  const floor = pmin;
  const remainingMass = 1 - M * floor;
  const probabilities = scores.map((s) => floor + remainingMass * (s / total));

  // Sample
  const r = rng();
  let cum = 0;
  for (let i = 0; i < M; i++) {
    cum += probabilities[i];
    if (r < cum) return remainingCast[i];
  }
  return remainingCast[M - 1]; // safety on float-error overshoot
}

const _TriggerScoreEngineExports = {
  DEFAULT_WEIGHTS,
  DEFAULT_PMIN,
  HOSTILE_TEMPS,
  WARM_TEMPS,
  matchAnyKeyword,
  readTemperature,
  areContradictoryPostures,
  score,
  selectNext,
};

if (typeof window !== 'undefined') window.TriggerScoreEngine = _TriggerScoreEngineExports;
if (typeof module !== 'undefined') module.exports = _TriggerScoreEngineExports;
