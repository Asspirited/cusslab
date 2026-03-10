// src/logic/ff-engine.js
// Shared Fighting Fantasy engine primitives.
// Used by Quntum Leeks, Golf Adventure, and Pub Navigator.
// No DOM, no API, no fetch. Pure functions only.

/**
 * Returns a fresh base game state.
 * @param {object} overrides - game-specific fields to merge in (e.g. { composure: 10 })
 * @returns {object} state with history:[], turnCount:0, plus overrides
 */
function initGameState(overrides) {
  return { history: [], turnCount: 0, ...overrides };
}

/**
 * Appends an entry to state.history, evicting the oldest if over cap.
 * Mutates state.
 * @param {object} state - game state with a history array
 * @param {*} entry - entry to append
 * @param {number} cap - maximum history length (no cap if falsy)
 */
function appendToHistory(state, entry, cap) {
  state.history.push(entry);
  if (cap && state.history.length > cap) {
    state.history.shift();
  }
}

/**
 * Increments state.turnCount by 1.
 * Mutates state.
 * @param {object} state - game state with a turnCount field
 */
function incrementTurn(state) {
  state.turnCount++;
}

/**
 * Formats an array of modifier strings into a prompt-ready block.
 * Pure function.
 * @param {string[]} modifiers - active modifier strings
 * @returns {string} empty string if no modifiers; otherwise header + joined lines
 */
function buildModifierBlock(modifiers) {
  if (!modifiers || modifiers.length === 0) return '';
  return '\n\nACTIVE MODIFIERS THIS TURN:\n' + modifiers.join('\n');
}

const _ffEngineExports = {
  initGameState,
  appendToHistory,
  incrementTurn,
  buildModifierBlock,
};

// Browser: expose as FFEngine global
if (typeof window !== 'undefined') window.FFEngine = _ffEngineExports;

// Node (pipeline) export
if (typeof module !== 'undefined') module.exports = _ffEngineExports;
