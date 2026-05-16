// src/logic/panel-discuss-engine.js
// Pure logic for the shared panel discussion orchestrator (BL-162).
// No browser globals, no network calls, no persistent storage. Stateless.
// Per-panel IIFEs load this module and delegate speaker selection
// (and later in subsequent slices, prompt assembly, voice pool injection,
// state mutation) to these functions.
//
// Slice 0 — Speaker selection (selectSlots).
// Future slices: prompt-assembly, voice-pool-selector, state mutation.
//
// Principles governing this module: see .claude/principles/panel-design.md.
//   1. One engine, many panels — no per-panel duplication.
//   2. React to the person, not the topic.
//   3. Engine ignorance, voice expression — engine does not verify accuracy.

// BL-167 Slice 2 — when called with enthusiasms (and optionally relState etc),
// scoring delegates to TriggerScoreEngine.score for the full 7-weight model.
// When enthusiasms is omitted, falls back to BL-173 wound-only substring count
// (backwards compatible). TriggerScoreEngine is resolved from window (browser)
// or via require (Node).
const _TriggerScoreEngine = (typeof window !== 'undefined' && window.TriggerScoreEngine)
  || (typeof require !== 'undefined' ? require('./trigger-score-engine.js') : null);

// selectSlots — picks the speaker order for a single round.
//
// INPUT  (panelData):
//   {
//     anchor:            string         — character id; opens slot 0 and closes slot N
//     middleCast:        string[]       — non-anchor character ids
//     includeTheDon:     boolean (opt)  — when true, "alliss" is prepended to the middle (Golf only)
//     subsetSize:        number (opt)   — pick this many of middleCast (default: full)
//     turnsPerCharacter: number (opt)   — each subset member speaks this many times (default: 1)
//     userInput:         string (opt)   — used for relevance scoring against wounds + primers
//     wounds:            object (opt)   — { characterId: [triggerWord, ...] }
//     enthusiasms:       object (opt)   — { characterId: [primer, ...] }  (BL-167 Slice 2)
//     relState:          object (opt)   — RelationshipState for w3/w6 (BL-167 Slice 2)
//     debtLedger:        object (opt)   — { id: { owedToward: {...} } } for w2
//     recentMoves:       object (opt)   — { id: [posture, ...] } for w4
//     claimedTerritory:  object (opt)   — { id: [keyword, ...] } for w7
//     weights:           object (opt)   — { w1..w7 } overrides
//     prevSpeakerId:     string (opt)   — speaker of the relevance input
//   }
//
// RETURN: string[]
//   Ordered slot list: anchor at index 0, [interleaved subset × turns] in slots 1..N-1,
//   anchor at the final index N.
//
// BEHAVIOUR (BL-173):
//   - When subsetSize == middleCast.length AND turnsPerCharacter == 1 (defaults):
//     returns [anchor, ...middleCast, anchor]                       (backwards compatible)
//   - When subsetSize < middleCast.length:
//     subset is chosen by relevance score (count of wound-word substring matches in
//     userInput). Top subsetSize candidates win. Ties resolved by random shuffle.
//     Zero-score candidates remain selectable as fill.
//   - When turnsPerCharacter > 1:
//     subset members are interleaved round-robin so each appears that many times,
//     spread across the middle (A B C A B C A B C for subset=3, K=3).
//   - Anchor still bookends regardless of subset/turns config.
//
// PRINCIPLE 3 — Engine ignorance: substring matching of wound triggers is intentional;
//   no context check. Misreadings are valid signals. The voice layer handles the comedy.
//
// THROWS:
//   - if anchor is missing or empty
//   - if middleCast is not an array
//   - if anchor appears in middleCast
function selectSlots(panelData) {
  if (!panelData || typeof panelData !== 'object') {
    throw new Error('selectSlots: panelData object required');
  }
  const { anchor, middleCast, includeTheDon, subsetSize, turnsPerCharacter, userInput, wounds,
          enthusiasms, relState, debtLedger, recentMoves, claimedTerritory, weights, prevSpeakerId } = panelData;
  if (!anchor || typeof anchor !== 'string') {
    throw new Error('selectSlots: anchor string required');
  }
  if (!Array.isArray(middleCast)) {
    throw new Error('selectSlots: middleCast array required');
  }
  if (middleCast.includes(anchor)) {
    throw new Error('selectSlots: anchor must not appear in middleCast');
  }

  const baseMiddle = includeTheDon ? ['alliss', ...middleCast] : middleCast;

  const effectiveSubsetSize = (typeof subsetSize === 'number' && subsetSize > 0)
    ? Math.min(subsetSize, baseMiddle.length)
    : baseMiddle.length;
  const effectiveTurns = (typeof turnsPerCharacter === 'number' && turnsPerCharacter > 0)
    ? turnsPerCharacter
    : 1;

  // Backwards-compatible fast path: full middle, single turns.
  if (effectiveSubsetSize === baseMiddle.length && effectiveTurns === 1) {
    return [anchor, ...baseMiddle, anchor];
  }

  // Relevance scoring — BL-173 wound-only count, OR (BL-167 Slice 2) full
  // TriggerScoreEngine.score when enthusiasms/relState/etc are present.
  const useTriggerEngine = !!_TriggerScoreEngine
    && !!(enthusiasms || relState || debtLedger || recentMoves || claimedTerritory || weights);
  const lowerInput = (userInput || '').toLowerCase();
  const scores = {};
  if (useTriggerEngine) {
    const ctx = { wounds, enthusiasms, relState, debtLedger, recentMoves, claimedTerritory, weights, prevSpeakerId };
    for (const id of baseMiddle) {
      scores[id] = _TriggerScoreEngine.score(id, userInput || '', ctx);
    }
  } else {
    // Backwards-compatible BL-173 path: substring count of wound triggers only.
    for (const id of baseMiddle) {
      const triggers = (wounds && wounds[id]) || [];
      let score = 0;
      for (const t of triggers) {
        if (t && lowerInput.includes(String(t).toLowerCase())) score += 1;
      }
      scores[id] = score;
    }
  }

  // Tie-break: pre-shuffle so equal-score candidates get random order; then stable-sort by score desc.
  const shuffled = [...baseMiddle].sort(() => Math.random() - 0.5);
  shuffled.sort((a, b) => scores[b] - scores[a]);
  const subset = shuffled.slice(0, effectiveSubsetSize);

  // Round-robin interleave for K turns.
  const interleaved = [];
  for (let k = 0; k < effectiveTurns; k++) {
    for (const id of subset) interleaved.push(id);
  }

  return [anchor, ...interleaved, anchor];
}

const _PanelDiscussEngineExports = { selectSlots };

// Browser: expose as global so per-panel IIFEs can call PanelDiscussEngine.selectSlots(...)
if (typeof window !== 'undefined') window.PanelDiscussEngine = _PanelDiscussEngineExports;

// Node (pipeline unit tests) export
if (typeof module !== 'undefined') module.exports = _PanelDiscussEngineExports;
