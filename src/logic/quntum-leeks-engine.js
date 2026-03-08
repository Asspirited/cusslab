// src/logic/quntum-leeks-engine.js
// Pure game logic for the Quntum Leeks panel.
// No DOM, no API, no fetch. All functions take state as a parameter.
// index.html loads this after src/data/quntum-leeks-scenarios.js.
// QuantumLeeks IIFE in index.html calls these functions, owns the mutable _state.

const { QUNTUM_LEEKS_SCENARIOS } =
  typeof require !== 'undefined'
    ? require('../data/quntum-leeks-scenarios.js')
    : { QUNTUM_LEEKS_SCENARIOS: window.QUNTUM_LEEKS_SCENARIOS };

/**
 * Returns a fresh default game state object.
 * index.html calls this at the start of every leap().
 */
function initState() {
  return {
    scenario:        null,
    history:         [],
    turnCount:       0,
    leaped:          false,
    probability:     50,
    prevProbability: 50,
    samDamage:       0,
    leekinessSpend:  false,
    leekinessBet:    0,
    selectedZiggyOpt: -1,
    deathcapActive:  false,
    ziggyOptions:    [],
    samStats: {
      truthiness:       70,
      bottiness:        60,
      leekiness:        3,
      swissCheeseLevel: 20,
    },
  };
}

/**
 * Picks a random scenario key from QUNTUM_LEEKS_SCENARIOS.
 * Returns the key string (not the scenario object).
 */
function pickRandomScenario() {
  const keys = Object.keys(QUNTUM_LEEKS_SCENARIOS);
  return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Attempts to place a Leekiness bet.
 * Mutates state. Returns true if accepted, false if rejected.
 * @param {object} state - mutable game state
 * @param {number} n - requested bet amount
 */
function betLeekiness(state, n) {
  const bet = Math.min(3, Math.max(1, isNaN(n) ? 1 : n));
  if (state.samStats.leekiness < bet) return false;
  state.leekinessBet = bet;
  state.samStats.leekiness -= bet;
  return true;
}

/**
 * Marks the leekinessSpend flag on state.
 * No-op if leekiness is 0.
 * @param {object} state - mutable game state
 */
function spendLeekiness(state) {
  if (state.samStats.leekiness <= 0) return;
  state.leekinessSpend = true;
}

/**
 * Processes end-of-turn effects from the API response.
 * Mutates state. No-op on the first turn (isFirst=true).
 * @param {object} state - mutable game state
 * @param {object} data - API response object with { probability }
 * @param {boolean} isFirst - true on the opening turn
 */
function processTurnEffects(state, data, isFirst) {
  if (isFirst) return;
  const newProb = typeof data.probability === 'number' ? data.probability : state.probability;

  if (newProb > state.prevProbability) {
    state.samStats.leekiness++;
  }
  if (newProb < state.prevProbability - 10) {
    state.samDamage++;
  }

  const accurateAdvice = state.selectedZiggyOpt >= 0 && state.samStats.truthiness > 60;
  if (accurateAdvice) {
    state.samStats.swissCheeseLevel = Math.max(0, state.samStats.swissCheeseLevel - 2);
  } else {
    state.samStats.swissCheeseLevel = Math.min(
      100,
      state.samStats.swissCheeseLevel + Math.floor(Math.random() * 6)
    );
  }

  state.deathcapActive  = state.samStats.swissCheeseLevel >= 80;
  state.leekinessSpend  = false;
  state.leekinessBet    = 0;
  state.selectedZiggyOpt = -1;
  state.prevProbability  = newProb;
}

/**
 * Builds the ACTIVE MODIFIERS string appended to the system prompt each turn.
 * Pure function — reads state, returns string.
 * @param {object} state - game state (read-only)
 * @returns {string} modifier block, or empty string if none active
 */
function buildModifiers(state) {
  const mods = [];
  if (state.leekinessSpend) {
    mods.push('Al is pushing his luck on this action — higher variance outcome (Spend Leekiness active).');
  }
  if (state.leekinessBet > 0) {
    mods.push(`Al has bet ${state.leekinessBet} Leekiness points — amplify outcome magnitude in both directions.`);
  }
  if (state.samStats.swissCheeseLevel >= 80) {
    mods.push('[DEATHCAP MODE ACTIVE] Sam is in a hallucination state. His actions follow internally consistent but externally catastrophic logic. Al is the only anchor he has left.');
  }
  if (state.samDamage >= 4) {
    mods.push(`Sam has suffered ${state.samDamage} damage events. His dialogue reflects cumulative degradation — earnest but visibly deteriorating.`);
  }
  return mods.length ? '\n\nACTIVE MODIFIERS THIS TURN:\n' + mods.join('\n') : '';
}

// Node (pipeline) export
if (typeof module !== 'undefined') {
  module.exports = {
    QUNTUM_LEEKS_SCENARIOS,
    initState,
    pickRandomScenario,
    betLeekiness,
    spendLeekiness,
    processTurnEffects,
    buildModifiers,
  };
}
