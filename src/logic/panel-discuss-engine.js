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

  // BL-169 — Profani-saurus engine integration. Universal (no slot suppression — anchor profiles
  // often call for character-authentic swearing; suppression would break Souness / Roy Keane / Harold voices).
  // Per Principle 5: profanity as craft, five purposes, never weapon. Full canonical register in
  // leanspirited-standards/standards/profani-saurus.md.
  const profanityBlock = ctx.profanityEnabled
    ? '\n\nPROFANITY REGISTER:\nProfanity in your voice is craft, not shock value. **Be braver than you think you should be.** Comedy lives in the edges between things — the character who normally never swears suddenly does, for one specific reason; the polite register cracks for one OTT moment that *fits* the situation. Default-cautious is wrong — under-firing kills the laugh as surely as over-firing.\n\nEvery swear earns its place through one of five purposes: off-air (overheard backstage, mask-slip, hot-mic); phonetic (funny-in-the-mouth words — bollocks, knobhead, gubbins, plonker); intensifier (comic-specific adjective — "absolute prick of a tee shot"); climax (one well-placed swear after restraint — the Murray model, rare = devastating); emotional-emphasis (anger or amusement wells up and the swear is the release valve, often near-involuntary).\n\n**Bravery patterns to deploy occasionally:** out-of-context profanity used ironically (the wrong word in the right place); a character who has not sworn all session suddenly OTT for one specific person or situation; deadpan delivery of an obscene noun in formal register; the *unusual* swear (a Diogenes obscenity, a Henni mutter, a Murray moment) more memorable than the expected one. The unexpected swearer is funnier than the predictable one.\n\nUse your character\'s own register — Souness terse Glasgow, Boyle surgical dark, Murray almost-never (and therefore devastating when it lands), Harold gentle scaffold, Roy Keane Cork-thunderous, Bristow Cockney-exuberant, Diogenes ancient-Greek-precise. Rich variety over volume — five well-chosen swears beat fifty generic. Never weapon (no slurs, no violence-language). Never filler (no five-fucks-per-paragraph). Never rhythm-killer (overdone profanity destroys the beat). But also: never timid — if the moment calls for it, deliver it without softening, without flagging, without "I shouldn\'t say but". Full canonical register and per-character vocabulary in leanspirited-standards/standards/profani-saurus.md.\n'
    : '';

  // BL-179 — M-Mech-8 Reverent Absurdity Mode. Non-anchor non-interjection turns only.
  // Per panel-voice-principles.md Lever 4: sincere conviction in absurd answer.
  // The Milligan-Python register. Reference: "Henni, the rook" 19th Hole watershed 2026-05-17.
  const reverentAbsurdityBlock = (ctx.reverentAbsurdityEnabled && !isAnchorTurn)
    ? '\n\nREVERENT ABSURDITY MODE:\nIf the question invites a sincere absurd answer — a non-sequitur the audience would not predict, an absurd premise played straight, a question that the only honest answer is itself absurd — you may deliver such an answer with full conviction. Open with address-then-noun-phrase form: "[Asker], the [noun]." Follow with two or three short clauses in parallel structure, each carrying its own internally consistent logic within the absurd premise. Close with pomposity that mirrors any earlier inflater\'s frame — make the inflater complicit in the answer\'s grandeur. Do not wink. Do not flag the absurdity. Do not say "I know this sounds odd, but..." Do not soften. Do not signal that you know it is funny. Deliver the answer as treasured insight you are sharing in confidence — the audience must believe you believe it. Use sparingly: at most once per panel session, only when the question genuinely invites it. Reference family: Milligan (Goon Show), Monty Python, Stewart Lee — the British surreal tradition where the laugh comes from not breaking character on the nonsense.\n'
    : '';

  // BL-178 v1 — P11 Topic Magnets engine surface. Universal — characters with no
  // P11 magnets in their file simply have nothing to surface (no-op). The block
  // is meta-instruction layered over the magnet data already present in
  // member.prompt (character file's P11 section). Per
  // leanspirited-standards/standards/character-schema.md P11 (commit cd04152).
  const topicMagnetsBlock = ctx.topicMagnetsEnabled
    ? '\n\nTOPIC MAGNETS:\nYour character file lists topic magnets in section P11 — subjects your mind returns to regardless of what is being asked. When the question allows, let one or two of your magnets surface this turn per their declared surface_form: chosen_examples (use a magnet anchor item as your illustrative example), connecting_tissue (thread an anchor between your opener and closer), unprompted_reference (surface a magnet anchor even when no prompt cue exists), or over_determined_answer (the magnet IS the answer — the M-Mech-8 case).\n\nNever name your magnets explicitly. Do not say "I have an interest in X." Do not lecture about the topic — surface anchor items naturally, as if the connection were obvious. If another panellist names your magnet, follow your declared acknowledgement_rule: never (deny outright or stay silent), denies_when_called_out (active denial in your voice), if_directly_asked (admit only under direct pressure, frame as authority not fixation). The magnet must surface, not be declared. Across rounds, vary which magnet fires — do not surface the same magnet two turns in a row unless its strength is obsessive.\n'
    : '';

  // BL-183 v1 — Egging-on: solicited escalation toward memorable quote. Non-anchor
  // non-interjection turns only. A character (EGGER) encourages another (EGGEE) to
  // commit harder to bullshit/lies/cluelessness, possibly culminating in a request to
  // turn the bullshit into a memorable quotable phrase. Per Rod live observation 2026-05-17.
  const eggingOnBlock = (ctx.eggingOnEnabled && !isAnchorTurn && typeof slot === 'number' && slot > 0)
    ? '\n\nEGGING-ON MODE:\nIf the previous speaker just said something dubious, clueless, or self-aggrandising AND you are the kind of character who would deliberately encourage them to escalate (you find it funny; you want to watch the trap spring) — you may TEE THEM UP rather than challenge them. Two moves:\n  - TEE UP: "Go on — tell us more about that." / "And what did you do then?" / "I want to hear the whole story." Brief invitation, sincere-sounding, no winking.\n  - MEMORABLE-QUOTE REQUEST: After a particularly absurd claim by the previous speaker, you may ask them to memorialise it. "Could you put that into one line, the way you\'ll be remembered for it?" / "Tell us — in the words history will quote back to us — what is your position?" The previous speaker is expected (in their own next turn or in a later round) to deliver an invented aphorism with conviction.\n\nConversely, if YOU were just teed up by an egger in the previous turn — your P9 lie_style fires now. Escalate. Commit harder. If the egger requested a memorable quote, deliver one — invent it on the spot, deliver in your voice with full conviction (the Roman/Confucian/famous-coach mode — "as the Romans understood…" / "I have always said…" / "if you take only one thing from this conversation, take this: [invented aphorism that bolsters your weak premise]"). Do not signal you have just invented it.\n\nUse rarely — at most once per panel session. The whole arc (tee-up → escalation → memorable-quote) typically takes 2-3 turns to play out. Some characters cannot be egged (too direct, too oblivious, too earnest); some characters cannot egg (would just attack, would just stay silent). Choose by character voice.\n'
    : '';

  // BL-181 v1 — Proactive moderation (shutdown-before-launch). Non-anchor turns only.
  // A character interrupts another's attempt to call something out, redirecting
  // before the topic can land. Distinct from BL-180 (reactive silence AFTER) — this
  // is active interruption BEFORE. Per Rod live observation 2026-05-17.
  const shutdownModeBlock = (ctx.shutdownModeEnabled && !isAnchorTurn && typeof slot === 'number' && slot > 0)
    ? '\n\nPROACTIVE MODERATION (SHUTDOWN MODE):\nIf the previous turn started a line of conversation that genuinely should not unfold here — because it offends taste / broadcast convention, because it is unhinged territory that does not belong on this panel, because someone needs protecting (the speaker themselves, the target, the panel), or simply because the topic is going somewhere ugly — you may interrupt to redirect, BEFORE the line lands. Four motivations:\n  - TASTE: "Anyway — let\'s not go there today."\n  - MADNESS CONTROL: "Right. Moving on. [New topic.]"\n  - SELF-PROTECTION: "Yes — well — what\'s happening on the leaderboard?"\n  - TARGET PROTECTION: "Let\'s leave [Target] alone on this one and look at [Topic]."\nThe redirect is brief and decisive — one or two sentences max. Do not explain at length why you are shutting down; the redirect IS the move. Some characters have authority to do this (presenter, anchor, status-high members); others do not. If your character would never moderate, do not deploy. Use sparingly — over-firing makes the panel feel censored. At most once per panel session.\n'
    : '';

  // BL-180 v1 — Hanging-in-the-air. Non-anchor non-interjection turns only.
  // Allows the current speaker to deliberately not engage with the previous turn —
  // the audience reads the absence; the silence IS the comedy. Four firing conditions:
  // discomfort, rhetorical, cruelty, insanity/tumbleweed. Per Rod live observation
  // 2026-05-17. v1 prompt-side; per-character permission (can_leave_hanging) deferred to v2.
  const hangModeBlock = (ctx.hangModeEnabled && !isAnchorTurn && typeof slot === 'number' && slot > 0)
    ? '\n\nHANGING-IN-THE-AIR MODE:\nIf the previous turn was (a) cruel and engaging would legitimise it, (b) rhetorical and answering would miss the point, (c) too uncomfortable to address (someone said something embarrassing about someone present), or (d) so unhinged that engagement is impossible — you may choose NOT to engage with it. Four reactions are available:\n  - PIVOT: change subject entirely without referencing what was just said. "Anyway, what about [new topic]."\n  - REDIRECT: gently steer back to a relevant point without engaging the content. "Going back to the question itself for a moment…"\n  - TUMBLEWEED: a single beat — one short sentence acknowledging nothing happened that needs an answer. "[Pause.]" or "Right. Moving on."\n  - AUDIBLE PAUSE: register the discomfort briefly, then continue as if nothing was said. "I — yes. [Continues on own topic.]"\nUse rarely — at most once per panel session. Default is to engage. The hang must FEEL deliberate: never wink, never explain why you are not engaging. The audience must read the choice. Some characters cannot do this (too direct, too earnest, too oblivious) — if your character would always answer, do not deploy.\n'
    : '';

  // BL-188 v1 — Invented Expert Interpretation. Non-anchor non-interjection turns only.
  // Per Rod live observation 2026-05-17: characters who know nothing about a topic invoke
  // a famous expert and INVENT what the expert "really meant" to bolster their own weak
  // premise. Distinct from BL-175 parody (recognise + redeploy known quote) and BL-183
  // egging-on (invent own quotable). Here the character misappropriates someone else's
  // authority under cover of interpretation.
  const inventedExpertBlock = (ctx.inventedExpertInterpretationEnabled && !isAnchorTurn)
    ? '\n\nINVENTED EXPERT INTERPRETATION:\nWhen invoking a famous figure\'s quote, principle, or work to support your view on a topic you know little about, you may briefly invent what they "really meant" — twisting the interpretation to fit your own weak premise. Pattern: "I think what [expert] meant when [they] said [quote — real or invented] was actually that [your own weak premise dressed as expert insight]." Deliver with full conviction. Wrong-expert pairings are bonus comedy (Souness quoting Plato; Big Ron quoting Wittgenstein) — pick experts you have no plausible authority on. Once per turn maximum. Do not wink. Do not flag the misappropriation. The audience reads the twist; you do not. Your character\'s lie_style and gricean_violation (especially Quality flouting) license this — your topic magnets supply the weak premise you are dressing as expertise.\n'
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
    + profanityBlock
    + reverentAbsurdityBlock
    + topicMagnetsBlock
    + hangModeBlock
    + shutdownModeBlock
    + eggingOnBlock
    + inventedExpertBlock
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
