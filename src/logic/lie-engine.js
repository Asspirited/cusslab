// ── Lie Engine — panel-agnostic ──────────────────────────────────────────────
// Exposes global: LieEngine
//
// Per-character profile:
//   { lie_baseline: 0.0–0.7, lie_ceiling: 'plausible'|'credible_stretch'|'whopper'|'utterly_ridiculous', lie_tell: 'string' }
//
// Threat levels (0–3):
//   0 = plausible exaggeration only
//   1 = credible stretch
//   2 = whopper
//   3 = utterly ridiculous (capped by lie_ceiling)
//
// Triggers that increment threat:
//   wound_activated   → +2 (minimum threat 2)
//   character_order   → +0 (threat decays unless wound or explicit triggers fire)
//
// State persisted in sessionStorage per panel key.

const LieEngine = (() => {

  const SCALE_ORDER = ['plausible', 'credible_stretch', 'whopper', 'utterly_ridiculous'];
  const CEILING_IDX = { plausible: 0, credible_stretch: 1, whopper: 2, utterly_ridiculous: 3 };

  const SCALE_INSTRUCTIONS = {
    plausible:          'Your claim is plausible but slightly inflated. Deliver with confidence. May be checked.',
    credible_stretch:   'Your claim is at the edge of credibility. A confident person believes it. Anyone who knows better notices.',
    whopper:            'Your claim is a significant distortion of reality. You deliver it with absolute conviction. You have probably repeated it so many times you half-believe it.',
    utterly_ridiculous: 'Your claim is completely unverifiable and probably impossible. You state it as established fact. You are certain. The room may react. You remain certain.',
  };

  function _scale(threatLevel, ceiling) {
    const rawIdx  = Math.min(Math.max(0, threatLevel), 3);
    const ceilIdx = CEILING_IDX[ceiling] ?? 3;
    return SCALE_ORDER[Math.min(rawIdx, ceilIdx)];
  }

  function loadState(panelKey) {
    try { return JSON.parse(sessionStorage.getItem(panelKey + '-lie') || 'null') || {}; }
    catch { return {}; }
  }

  function saveState(panelKey, state) {
    sessionStorage.setItem(panelKey + '-lie', JSON.stringify(state));
  }

  // Call once per discuss() invocation: returns the lie state for this session.
  // State persists across discuss() calls within the same browser session (threat accumulates).
  function getState(panelKey) {
    return loadState(panelKey);
  }

  // Apply wound activation to a character's threat state.
  // wound_activated raises threat to minimum 2 per spec.
  function applyWound(state, speakerId) {
    state[speakerId] = state[speakerId] || { threat: 0 };
    if (state[speakerId].threat < 2) state[speakerId].threat = 2;
  }

  // Build the lie injection block for a character's system prompt.
  // Returns '' if no lie fires this turn.
  // woundActivated: boolean — true if wound just activated for this character this turn.
  function buildBlock(speakerId, profiles, state, woundActivated) {
    const p = (profiles || {})[speakerId];
    if (!p) return '';

    const charState = state[speakerId] || { threat: 0 };

    // Wound pushes threat to minimum 2 (per spec: "Wound activation sets threat level to minimum 2")
    if (woundActivated && charState.threat < 2) {
      charState.threat = 2;
      state[speakerId] = charState;
    }

    // Probabilistic fire based on baseline (boosted by threat)
    const fireRate = Math.min(0.95, (p.lie_baseline || 0) + charState.threat * 0.1);
    if (Math.random() >= fireRate) return '';

    const scale = _scale(charState.threat, p.lie_ceiling);
    return `LIE ENGINE:\nYour lie tell: "${p.lie_tell}" — use this phrase naturally before or during your main claim this turn.\nScale: ${scale} — ${SCALE_INSTRUCTIONS[scale] || ''}\nDeliver with complete conviction. No hedging.\n\n`;
  }

  return { getState, saveState, applyWound, buildBlock };
})();
