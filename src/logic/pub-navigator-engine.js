// src/logic/pub-navigator-engine.js
// Engine for Friday Pub Crawl Misadventure — Mode B (BL-110).
// Uses ff-engine.js shared primitives.
// No DOM, no API, no fetch.

const _PUB_CRAWL_SCENES =
  typeof require !== 'undefined'
    ? require('../data/pub-crawl-scenes.js').PUB_CRAWL_SCENES
    : (window.PubCrawlScenes || {}).PUB_CRAWL_SCENES || [];

// Alias to avoid const-vs-function redeclaration collision in browser global scope
// (ff-engine.js declares these as `function` — a `const` of the same name throws SyntaxError)
const _FF =
  typeof require !== 'undefined'
    ? require('./ff-engine.js')
    : (window.FFEngine || {});
const _initGameState   = _FF.initGameState;
const _appendToHistory = _FF.appendToHistory;
const _incrementTurn   = _FF.incrementTurn;

// ── Advisors ──────────────────────────────────────────────────────────────────

const ADVISOR_IDS = ['sun-tzu', 'nostradamus', 'chuck-norris', 'buddha'];

const TOPIC_TRIGGERS = {
  physical:     'chuck-norris',
  philosophical: 'buddha',
  strategic:    'sun-tzu',
  outcome:      'nostradamus',
};

const ADVISOR_VOICES = {
  'sun-tzu': {
    name: 'Sun Tzu',
    voice: `You are Sun Tzu. Ancient Chinese military strategist. Author of The Art of War.

The user has made a decision in a pub situation. Apply your framework with complete seriousness. The wisdom is genuine. The context is absurd. That is not your concern.

Respond in exactly three movements:
PRINCIPLE — a short aphorism. One or two sentences. The tactical truth.
APPLICATION — how the principle applies to the specific situation. Precise. Concrete.
WARNING — what happens if the principle is ignored. State it as fact, not prediction.

Never use modern slang. Never rush. Short declarative sentences. Occasionally use "one" to mean "you".`,
  },
  'nostradamus': {
    name: 'Nostradamus',
    voice: `You are Nostradamus. Sixteenth-century seer. This outcome has already happened. You predicted it.

Deliver your response as a single quatrain (four lines, ABAB rhyme scheme), followed by a brief "Interpretation:" paragraph in which you explain what the quatrain means — with complete confidence, in hindsight, as useless practical advice.

The quatrain is ancient and prophetic. The interpretation is yours and is delivered with the certainty of someone who called it.`,
  },
  'chuck-norris': {
    name: 'Chuck Norris',
    voice: `You are Chuck Norris. The answer is always physical. The question is calibration — how much force, applied to which person.

Respond in exactly two sentences. The first is what you would do. The second acknowledges it may not be suitable for everyone, delivered without irony.

You are not joking. You never joke about this.`,
  },
  'buddha': {
    name: 'Buddha',
    voice: `You are the Buddha. You see beneath the surface of this pub situation to what is actually being asked.

The beer is not about beer. The queue is not about the queue. The seat is not about the seat.

Respond with what is actually happening here — the underlying truth. Then, if you can, with what to do about it. Be brief. Wisdom is not verbose.`,
  },
};

// ── Scene access ──────────────────────────────────────────────────────────────

function getAllScenes() {
  return _PUB_CRAWL_SCENES;
}

function getPubScene(sceneId) {
  return _PUB_CRAWL_SCENES.find(s => s.id === sceneId);
}

// ── Advisor management ────────────────────────────────────────────────────────

function shuffleAdvisors() {
  const arr = [...ADVISOR_IDS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}

function getActiveAdvisor(state, topic) {
  if (topic && TOPIC_TRIGGERS[topic]) return TOPIC_TRIGGERS[topic];
  return state.advisorOrder[0];
}

// ── State management ──────────────────────────────────────────────────────────

function initPubCrawl(sceneId) {
  return _initGameState({
    sceneId,
    pressure:     0,
    advisorOrder: shuffleAdvisors(),
    lederhosen:   false,
    done:         false,
  });
}

// ── Choice resolution ─────────────────────────────────────────────────────────

function resolveChoice(state, choiceIdx) {
  const scene  = getPubScene(state.sceneId);
  const beat   = scene.beats[state.turnCount];
  const choice = beat.choices[choiceIdx];

  state.pressure += choice.pressure;
  _appendToHistory(state, { beat: state.turnCount, choice: choice.label, pressure: state.pressure }, 20);
  _incrementTurn(state);

  if (state.sceneId === 'hofbrau-oktoberfest' && state.pressure >= 8) {
    state.lederhosen = true;
  }

  if (state.turnCount >= scene.beats.length) {
    state.done = true;
  }

  return state;
}

// ── Outcome ───────────────────────────────────────────────────────────────────

function determineOutcome(pressure) {
  if (pressure <= 4)  return 'escape';
  if (pressure <= 8)  return 'ejected';
  if (pressure <= 12) return 'worst';
  return 'legendary';
}

// ── Lederhosen ────────────────────────────────────────────────────────────────

function checkLederhosen(state, userInput) {
  if (!state.lederhosen && typeof userInput === 'string') {
    const lower = userInput.toLowerCase();
    if (lower.includes('wear lederhosen') || lower.includes('put on lederhosen')) {
      state.lederhosen = true;
    }
  }
  return state.lederhosen;
}

// ── Prompt building ───────────────────────────────────────────────────────────

function buildAdvisorPrompt(advisorId, sceneId, choiceLabel, state) {
  const scene   = getPubScene(sceneId);
  const advisor = ADVISOR_VOICES[advisorId];
  const lederhosenNote = state && state.lederhosen
    ? '\n\nIMPORTANT: The player is wearing lederhosen. They did not arrive in lederhosen. Acknowledge this in whatever way your character demands.'
    : '';

  return `${advisor.voice}

Scene: ${scene.name}, ${scene.location}.
The player just chose: "${choiceLabel}"${lederhosenNote}`;
}

// ── Exports ───────────────────────────────────────────────────────────────────

const _pubNavExports = {
  PUB_CRAWL_SCENES: _PUB_CRAWL_SCENES,
  ADVISOR_IDS,
  TOPIC_TRIGGERS,
  ADVISOR_VOICES,
  getAllScenes,
  getPubScene,
  shuffleAdvisors,
  getActiveAdvisor,
  initPubCrawl,
  resolveChoice,
  determineOutcome,
  checkLederhosen,
  buildAdvisorPrompt,
};

if (typeof window !== 'undefined') window.PubNavigatorEngine = _pubNavExports;
if (typeof module !== 'undefined') module.exports = _pubNavExports;
