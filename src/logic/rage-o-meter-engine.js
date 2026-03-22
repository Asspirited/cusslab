// src/logic/rage-o-meter-engine.js
// Pure logic for the Rage-O-Meter component.
// No DOM, no API, no fetch. All functions are stateless.
// index.html loads this; the RageOMeter IIFE owns the DOM and calls these functions.

const BASELINE_MIN = 5;
const BASELINE_MAX = 25;

function generateBaseline() {
  return Math.floor(Math.random() * (BASELINE_MAX - BASELINE_MIN + 1)) + BASELINE_MIN;
}

function initCharacter(name, color) {
  const baseline = generateBaseline();
  return { name, color, baseline, current: baseline, history: [baseline] };
}

function commitRound(character, newRage) {
  return {
    ...character,
    current: newRage,
    history: [...character.history, newRage],
  };
}

function computeDelta(character) {
  return character.current - character.baseline;
}

function rankByDelta(characters) {
  return [...characters].sort((a, b) => computeDelta(b) - computeDelta(a));
}

function buildVerdict(rankedCharacters) {
  const most    = rankedCharacters[0];
  const coolest = rankedCharacters[rankedCharacters.length - 1];
  const total   = rankedCharacters.reduce((s, c) => s + computeDelta(c), 0);
  const avg     = Math.round(total / rankedCharacters.length);
  const mostDelta = computeDelta(most);

  let verdict = mostDelta > 40
    ? `${most.name} completely lost it — a ${mostDelta}-point rage spike from baseline. `
    : `${most.name} took the most damage, up ${mostDelta} from baseline. `;

  if (computeDelta(coolest) < 5) {
    verdict += `${coolest.name} remained insufferably unbothered throughout. `;
  }

  verdict += `Average rage rise across all combatants: ${avg > 0 ? '+' : ''}${avg}. `;
  verdict += avg > 25 ? `This was a genuinely destructive roast. Seek therapy.`
           : avg > 10 ? `Solid scorching. Everyone went home angrier.`
           :            `Mild heat. Come back when you mean it.`;

  return verdict;
}

function isRageEnabled(panelConfig) {
  return !!(panelConfig && panelConfig.rageEnabled === true);
}

module.exports = {
  BASELINE_MIN,
  BASELINE_MAX,
  generateBaseline,
  initCharacter,
  commitRound,
  computeDelta,
  rankByDelta,
  buildVerdict,
  isRageEnabled,
};
