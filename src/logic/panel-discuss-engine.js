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

// buildSystemPrompt — composes the per-turn system prompt for any panel (BL-162 Slice 1).
//
// INPUT (ctx):
//   turnRules:        string         — panel's TURN_RULES content
//   topicDismissal:   string|null    — TOPIC-DISMISSAL block (suppressed for anchor turns)
//   anchorId:         string         — anchor character id (from PANEL_CONFIG.anchor)
//   voicePoolBlock:   string|null    — pre-built per-character voice pool block (panel-built)
//   slot:             number         — current slot index (0-based)
//   totalSlots:       number         — total slots in this round
//   member:           {id, prompt}   — current speaker member object
//   prev:             string         — pre-built Previous: content (panel-built)
//   arcLog:           string[]       — narrative arc entries (BL-144)
//   recentMoves:      string[]       — posture types for REGISTER BREAK guard (BL-145)
//   roundSoFarText:   string         — pre-built ROUND SO FAR transcript (panel-built)
//   panelStateBlocks: string         — concatenated panel-specific state blocks BEFORE member.prompt
//                                       (e.g., food, marmite, hypo, lie, your-state, intensity)
//   panelMemberBlocks:string         — panel-specific blocks AFTER member.prompt
//                                       (e.g., iceBreak, roundNote, mechanics, arcInstructions)
//
// RETURN: string — the full system prompt.
//
// BEHAVIOUR:
//   - TURN_RULES placed first.
//   - TOPIC-DISMISSAL injected for non-anchor turns; suppressed for anchor opener and closer.
//   - ANCHOR_OPENER MODE block injected at slot 0 when member is the anchor.
//   - ANCHOR_CLOSER MODE block injected at the final slot when member is the anchor,
//     with the pre-built ROUND SO FAR transcript embedded.
//   - panelStateBlocks injected between (anchor/dismissal section) and member.prompt.
//   - member.prompt injected verbatim.
//   - voicePoolBlock injected after member.prompt when provided.
//   - panelMemberBlocks injected after voicePoolBlock.
//   - Previous: block appended when slot > 0 AND prev is non-empty.
//   - NARRATIVE ARC SO FAR appended when arcLog non-empty.
//   - REGISTER BREAK guard appended when last 3 recentMoves are identical.
//
// Backwards-compatible with Golf's pre-extraction inline assembly (byte-identical output
// for byte-identical inputs).
function buildSystemPrompt(ctx) {
  if (!ctx || typeof ctx !== 'object') {
    throw new Error('buildSystemPrompt: ctx object required');
  }
  const {
    turnRules,
    topicDismissal,
    anchorId,
    voicePoolBlock,
    slot,
    totalSlots,
    member,
    prev,
    arcLog,
    recentMoves,
    roundSoFarText,
    panelStateBlocks,
    panelMemberBlocks,
  } = ctx;

  if (typeof turnRules !== 'string') throw new Error('buildSystemPrompt: turnRules string required');
  if (!member || typeof member.prompt !== 'string') throw new Error('buildSystemPrompt: member.prompt required');

  const isAnchorOpener = (slot === 0 && member.id === anchorId);
  const isAnchorCloser = (typeof totalSlots === 'number' && slot === totalSlots - 1 && member.id === anchorId);
  const isInterjection = !!ctx.interjectionMode;  // BL-170 — anchor mid-round interjection
  const isAnchorTurn = isAnchorOpener || isAnchorCloser || isInterjection;

  const dismissalSection = (isAnchorTurn || !topicDismissal) ? '' : (topicDismissal + '\n\n');

  const anchorOpenerBlock = isAnchorOpener
    ? '\n\nANCHOR_OPENER MODE:\nYou are opening this round. Set the room. Establish the frame for the question — your specific lens on what was asked. You will also have the last word at the close of the round.\n'
    : '';

  const anchorCloserBlock = isAnchorCloser
    ? `\n\nANCHOR_CLOSER MODE:\nYou are closing this round. You have heard every panellist speak. Reflect on what just transpired — top and tail the bullshit, in your voice, your register. Your closer is the round's final word.\n\nROUND SO FAR:\n${roundSoFarText || ''}\n`
    : '';

  // BL-170 — Anchor mid-round interjection. Short course-correction between middle slots.
  // Never used as opener/closer (those are separate modes). Distinct text from both.
  const anchorInterjectionBlock = isInterjection
    ? '\n\nANCHOR_INTERJECTION MODE:\nYou are interjecting mid-round — between middle slots, not at the bookends. The previous turn pulled you back in. Speak short. Redirect — never obstruct — gracefully steer the room back toward the question. Your turn here is a course-correction, not a takeover. One or two sentences. Then the middle resumes.\n'
    : '';

  // BL-171 — Cross-character questions. Non-anchor non-interjection turns only.
  // Allows panellists to address each other; addressed character may answer, ignore, or hijack.
  const crossCharacterQuestionsBlock = (ctx.crossCharacterQuestionsEnabled && !isAnchorTurn)
    ? '\n\nCROSS-CHARACTER QUESTIONS:\nYou may, occasionally, direct a question or remark to another panellist by name rather than responding only to the user. Address them directly by name. They may answer it. They may ignore it. They may hijack it to make their own point. All three are valid responses from them. Do not force this — only deploy when something they said genuinely earns a follow-up from you. Once per response at most. The point is room interaction, not interrogation.\n'
    : '';

  // BL-175 — Cross-character catchphrase parody. Non-anchor non-interjection turns only.
  // Three-character comedy: speaker redeploys another character's signature line ironically,
  // addressed at a third target. Rod's example: Faldo deploying Bruce's "be like water" at Radar.
  const crossCharacterParodyBlock = (ctx.parodyEnabled && !isAnchorTurn)
    ? '\n\nCROSS-CHARACTER PARODY:\nWhen another panellist\'s signature line or aphorism is the obvious tool for landing your point, you may briefly redeploy it ironically — addressed at a third target, not at the originator. Example: Faldo deploying Bruce Lee\'s "be like water" against Radar — "Yeah, be like water, Radar, maybe try drinking it instead of whisky." The audience knows the canonical line; the target catches the parody mid-sentence. Once per response at most. After the parody beat, return to your own angle. The point is room comedy from a three-character interaction, not impression or unmotivated quotation.\n'
    : '';

  const previousBlock = (typeof slot === 'number' && slot > 0) ? `\n\nPrevious:\n${prev || ''}` : '';
  const narrativeArcBlock = (Array.isArray(arcLog) && arcLog.length > 0) ? `\n\nNARRATIVE ARC SO FAR:\n${arcLog.join('\n')}` : '';

  const lastThree = Array.isArray(recentMoves) ? recentMoves.slice(-3) : [];
  const guardFires = lastThree.length >= 3 && lastThree.every(t => t === lastThree[0]);
  const breakRegisterBlock = guardFires
    ? `\n\nREGISTER BREAK: The last three contributions have all been ${lastThree[0]}. Arrive from a completely different angle. Change your posture.`
    : '';

  return turnRules + '\n\n'
    + dismissalSection
    + anchorOpenerBlock
    + anchorCloserBlock
    + anchorInterjectionBlock
    + crossCharacterQuestionsBlock
    + crossCharacterParodyBlock
    + (panelStateBlocks || '')
    + member.prompt
    + (voicePoolBlock || '')
    + (panelMemberBlocks || '')
    + previousBlock
    + narrativeArcBlock
    + breakRegisterBlock;
}

// shouldAnchorInterject — decision whether to insert an anchor turn between middle slots (BL-170).
//
// INPUT (ctx):
//   woundActivated: boolean (opt)  — was the previous middle speaker's wound activated this round?
//   recentMoves:    string[] (opt) — posture history; sustained same-posture boosts the rate
//   baseRate:       number (opt)   — default 0.10 (~10% interjection per slot in absence of boosts)
//
// RETURN: boolean — true if the anchor should interject before the next middle slot.
//
// BEHAVIOUR:
//   - Base rate ~10% per call (no boosts).
//   - woundActivated true → rate floored at 0.75 (anchor almost always interjects on wound moments).
//   - last 3 recentMoves identical → rate floored at 0.45 (sustained register drift triggers steering).
//   - Final rate is max(baseRate, applicable boosts).
function shouldAnchorInterject(ctx) {
  const {
    woundActivated = false,
    recentMoves = [],
    baseRate = 0.10,
  } = ctx || {};
  let rate = (typeof baseRate === 'number' && baseRate >= 0 && baseRate <= 1) ? baseRate : 0.10;
  if (woundActivated) rate = Math.max(rate, 0.75);
  const last3 = Array.isArray(recentMoves) ? recentMoves.slice(-3) : [];
  const guardFires = last3.length >= 3 && last3.every(m => m === last3[0]);
  if (guardFires) rate = Math.max(rate, 0.45);
  return Math.random() < rate;
}

// selectVoicePoolPicks — randomly picks one item per pool key (BL-162 Slice 2).
//
// INPUT (pools):
//   { [poolKey]: any[] }
//   e.g. { food: ['ham sandwich', 'baguette'], cars: ['Cortina', 'Capri'] }
//
// RETURN: { [poolKey]: any }
//   Object where each input key maps to one randomly-selected item from that
//   pool's array. Empty arrays / non-arrays are skipped (key omitted from output).
//
// BEHAVIOUR:
//   - null or non-object input returns {}.
//   - Each pool key's array is sampled with Math.random() — uniform.
//   - Empty arrays are skipped (not included in result).
//   - Non-array values for a key are skipped.
//
// PRINCIPLE 3 (engine ignorance): no accuracy check on items; the voice expresses.
function selectVoicePoolPicks(pools) {
  if (!pools || typeof pools !== 'object') return {};
  const picks = {};
  for (const key of Object.keys(pools)) {
    const arr = pools[key];
    if (Array.isArray(arr) && arr.length > 0) {
      picks[key] = arr[Math.floor(Math.random() * arr.length)];
    }
  }
  return picks;
}

const _PanelDiscussEngineExports = { selectSlots, buildSystemPrompt, selectVoicePoolPicks, shouldAnchorInterject };

// Browser: expose as global so per-panel IIFEs can call PanelDiscussEngine.selectSlots(...)
if (typeof window !== 'undefined') window.PanelDiscussEngine = _PanelDiscussEngineExports;

// Node (pipeline unit tests) export
if (typeof module !== 'undefined') module.exports = _PanelDiscussEngineExports;
