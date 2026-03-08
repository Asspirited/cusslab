// golf-engine/game-engine.js
// Pure game logic — no DOM, no API, no globals.
// Dual-mode: browser <script src> sets GameEngine global; Node require() exports it.
// Reference: Martin — Clean Architecture; Beck — TDD; Feathers — seam extraction

const GameEngine = (() => {

  // ── State factory ──────────────────────────────────────────────────────────

  function start({ tournament, player, panel, atmosphere }) {
    const fieldScores = {};
    tournament.players.forEach(pl => { fieldScores[pl.name] = 0; });
    if (tournament.field) tournament.field.forEach(f => { fieldScores[f.name] = 0; });

    return {
      tournament,
      player,
      selectedPanel: panel || [],
      atmosphere: atmosphere || 'NORMAL',
      day: 0,
      holeIdx: 0,
      holesPerDay: 3,
      yourScore: 0,
      holeResults: [],
      phase: 'tee',
      holeStrokes: 0,
      currentShot: null,
      isRolling: false,
      composure: 10,
      fieldScores,
      history: [],
      panelState: {
        runningJokes: [], playerNickname: null, lastInsult: null,
        atmosphere_escalation: 0, panelFeuds: {}, momentsMentioned: [],
      },
      fortuneActive: false,
      angerActive: false,
      angerShots: 0,
      illnessActive: false,
      illnessHoles: 0,
      tempThresholdMod: 0,
      tempThresholdHoles: 0,
      tempSkillBonus: false,
      tempSkillHoles: 0,
      isDead: false,
      causeOfDeath: null,
      collapseNode: null,
      collapseChipOutAvailable: true,
      clothing: { trousers: true, glove: true, shoes: true, hat: true, shirt: true },
    };
  }

  // ── Roll resolution ────────────────────────────────────────────────────────
  // Pure: same roll + shot + state → same result. No random inside.

  function processRoll(roll, shot, state) {
    const hole = state.tournament.holes[state.holeIdx];
    const mod  = hole.modifiers || {};
    const pen  = state.composure <= 3 ? 2 : state.composure <= 6 ? 1 : 0;

    let eff = shot.thresh + pen + (mod.thresholdAdd || 0);
    if (state.tempThresholdMod)  eff += state.tempThresholdMod;
    if (state.angerActive) {
      if (shot.risk <= 2) eff += 2;
      if (shot.risk >= 3) eff -= 1;
    }
    if (state.illnessActive)  eff += 1;
    if (state.tempSkillBonus) eff -= 1;
    eff = Math.max(1, Math.min(6, eff));

    const success      = roll >= eff;
    const catastrophic = roll === 1 && shot.risk >= 3;
    const great        = roll === 6 && shot.risk <= 3;
    const quality      = catastrophic ? 'disaster' : !success ? 'trouble' : great ? 'miracle' : 'solid';

    return { quality, eff, pen };
  }

  // ── Phase routing ──────────────────────────────────────────────────────────
  // Pure: returns next phase name or 'end'.

  function advancePhase(quality, state) {
    const hole = state.tournament.holes[state.holeIdx];
    const { phase } = state;

    if (phase === 'tee') {
      if (hole.par === 3) {
        return quality === 'miracle' ? 'end' : 'par3';
      }
      return 'approach';
    }
    if (phase === 'approach' || phase === 'par3') {
      return quality === 'miracle' ? 'end' : 'putt';
    }
    if (phase === 'putt') {
      return 'end';
    }
    return 'end';
  }

  // ── Hole scoring ───────────────────────────────────────────────────────────
  // Pure: returns { diff, state } with updated yourScore and holeResults.

  function endHole(state) {
    const hole = state.tournament.holes[state.holeIdx];
    const diff = state.holeStrokes - hole.par;
    const newState = {
      ...state,
      yourScore: state.yourScore + diff,
      holeResults: [
        ...state.holeResults,
        { day: state.day, holeId: hole.id, score: state.holeStrokes, par: hole.par, diff },
      ],
    };
    return { diff, state: newState };
  }

  // ── Field simulation ───────────────────────────────────────────────────────
  // Pure: returns updated fieldScores object.

  function simulateField(state) {
    const t = state.tournament;
    const fieldScores = { ...state.fieldScores };

    if (t.field) t.field.forEach(f => { fieldScores[f.name] = f.scores[state.day] || 0; });
    t.players.forEach(pl => {
      if (pl.id !== state.player.id) fieldScores[pl.name] = pl.historicalScores[state.day] || 0;
    });
    fieldScores[state.player.name] = state.yourScore;

    return fieldScores;
  }

  // ── Situation text ─────────────────────────────────────────────────────────
  // Pure: same state → same string (deterministic).

  function buildSituation(state) {
    const dayWords = ['first', 'second', 'third', 'fourth'];
    const s = state.yourScore;
    const scoreStr = s === 0 ? 'level par' : s < 0 ? `${s} under par` : `+${s} over par`;
    const histScore = state.player.historicalScores[state.day] || 0;
    const diff = s - histScore;
    const histNote = diff === 0 ? 'tracking history exactly'
      : diff < 0 ? `${Math.abs(diff)} ahead of history`
      : `${diff} behind history`;
    const atmoAdd = {
      SIMMERING:    ' Something is building between the group.',
      POWDER_KEG:   ' The atmosphere is incendiary.',
      CHAOS_MODE:   ' Nothing today has gone as planned.',
      DEEP_WOUNDS:  ' Old wounds are bleeding into the present.',
      FUNNY_PECULIAR: ' Things have taken a strange turn.',
    }[state.atmosphere] || '';
    return `${state.player.name}. ${dayWords[state.day] || `Day ${state.day + 1}`} round of the ${state.tournament.name}. You are ${scoreStr} — ${histNote}.${atmoAdd}`;
  }

  return { start, processRoll, advancePhase, endHole, simulateField, buildSituation };

})();

if (typeof module !== 'undefined') module.exports = { GameEngine };
