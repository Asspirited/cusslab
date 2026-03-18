// TBT engine — pure functions for Through the Biscuit Tin
// Bounded context: separate from all Cusslab domain logic

'use strict';

const TIN_OBJECTS = [
  { id: 'photograph',           name: 'photograph' },
  { id: 'wisden_page',          name: 'wisden page' },
  { id: 'match_stub',           name: 'match stub' },
  { id: 'brylcreem_ad',         name: 'Brylcreem advertisement' },
  { id: 'southampton_programme',name: 'Southampton FC programme' },
  { id: 'eagle_comic',          name: 'Eagle comic' },
  { id: 'button',               name: 'button' },
];

const GAME_START = { month: 'NOVEMBER', year: 1979 };

function calculateAge(dob, gameYear) {
  return gameYear - dob;
}

function getGameDate(turnNumber) {
  const monthsElapsed = turnNumber - 1;
  const totalMonths   = (GAME_START.year * 12 + monthIndex(GAME_START.month)) + monthsElapsed;
  const year          = Math.floor(totalMonths / 12);
  const month         = MONTH_NAMES[totalMonths % 12];
  return { month, year };
}

const MONTH_NAMES = [
  'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
  'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'
];

function monthIndex(name) {
  return MONTH_NAMES.indexOf(name);
}

function getTinObjects() {
  return TIN_OBJECTS.slice();
}

const FORM_BANDS = [
  { min: 0,  max: 4,  word: 'Lost' },
  { min: 5,  max: 8,  word: 'Nowhere' },
  { min: 9,  max: 12, word: 'Shaky' },
  { min: 13, max: 16, word: 'Decent' },
  { min: 17, max: 20, word: 'Flying' },
];

function getFormWord(value) {
  const clamped = Math.max(0, Math.min(20, value));
  const band = FORM_BANDS.find(b => clamped >= b.min && clamped <= b.max);
  return band ? band.word : 'Shaky';
}

const ACTIVITY_TYPES = {
  VISIT_NAN: 'VISIT_NAN',
  NETS:      'NETS',
  WORK:      'WORK',
  REST:      'REST',
  PUB:       'PUB',
  STUDY:     'STUDY',
};

function classifyActivity(input) {
  if (!input || typeof input !== 'string') return null;
  const lower = input.toLowerCase().trim();
  if (/\b(nan|nan'?s|nans|visit nan|check on nan|go round|go to nan)\b/.test(lower)) return ACTIVITY_TYPES.VISIT_NAN;
  if (/\b(nets|practice|batting|bowling|net session|training|cricket club)\b/.test(lower)) return ACTIVITY_TYPES.NETS;
  if (/\b(work|paper round|shift|job|earn|money)\b/.test(lower)) return ACTIVITY_TYPES.WORK;
  if (/\b(rest|sleep|early night|stay in|bed|tired)\b/.test(lower)) return ACTIVITY_TYPES.REST;
  if (/\b(pub|pint|out with|lads|mates|drink|drinks)\b/.test(lower)) return ACTIVITY_TYPES.PUB;
  if (/\b(study|homework|revision|revise|school|read|coursework)\b/.test(lower)) return ACTIVITY_TYPES.STUDY;
  return null;
}

const BANK_CRITICAL_THRESHOLD = 1.00;
const PRACTICE_SESSIONS_PER_SKILL_POINT = 4;

const NAN_QUALITY_INITIAL = 7;
const NAN_QUALITY_MAX     = 9;
const NAN_QUALITY_MIN     = 0;

function getNanDial(nanQuality, nanGrief) {
  if (nanGrief) return 'greyed';
  if (nanQuality >= 7) return 'green';
  if (nanQuality >= 4) return 'amber';
  return 'red';
}

function classifyVisitQuality(input) {
  if (!input || typeof input !== 'string') return 1;
  const lower = input.toLowerCase();
  if (/\b(biscuit tin|tin|grandfather|grandad|old days|old man|looked through|asked nan about)\b/.test(lower)) return 3;
  if (/\b(proper|chat|sat with|talked|conversation|cup of tea|sit.?down|stayed)\b/.test(lower)) return 2;
  return 1;
}

function computeForm(attrs) {
  const { physique, skill, confidence, tenacity, sharpness, freshness, lifeNoise } = attrs;
  const score = (physique * 0.70) + (skill * 0.60) + (confidence * 0.40) + (tenacity * 0.30)
              + sharpness + freshness - lifeNoise;
  return getFormWord(score);
}

function calculateLifeNoise(state) {
  let noise = 0;
  const nanDial = typeof state.nanQuality === 'number'
    ? getNanDial(state.nanQuality, state.nanGrief)
    : state.relationships.nan;
  if (nanDial === 'red' || nanDial === 'greyed') noise++;
  if (state.bank < BANK_CRITICAL_THRESHOLD) noise++;
  if (state.home === 'red') noise++;
  return noise;
}

function applyActivity(state, activityType, visitQuality) {
  const delta = {
    formDelta: 0, bankDelta: 0, nanQualityδ: -1, note: '',
    physiqueδ: 0, skillδ: 0, confidenceδ: 0, tenacityδ: 0,
    sharpnessδ: 0, freshnessδ: 0, practiceSessionsδ: 0,
  };
  switch (activityType) {
    case ACTIVITY_TYPES.VISIT_NAN: {
      const quality = visitQuality || 1;
      if (quality === 3) {
        delta.nanQualityδ = 3;
        delta.note = 'You sat with Nan and looked through the biscuit tin. She talked about your grandfather.';
      } else if (quality === 2) {
        delta.nanQualityδ = 1;
        delta.note = 'You had a proper sit-down with Nan.';
      } else {
        delta.nanQualityδ = 0;
        delta.note = 'You went round to Nan\'s.';
      }
      break;
    }
    case ACTIVITY_TYPES.NETS: {
      const sessions = (state.practiceSessionsThisCycle || 0) + 1;
      delta.physiqueδ = -1;
      delta.sharpnessδ = 2;
      if (sessions >= PRACTICE_SESSIONS_PER_SKILL_POINT) {
        delta.skillδ = 1;
        delta.practiceSessionsδ = -(sessions - 1);
      } else {
        delta.practiceSessionsδ = 1;
      }
      delta.note = 'You went to nets.';
      break;
    }
    case ACTIVITY_TYPES.WORK:
      delta.bankDelta = state.weeklyWage || 2.50;
      delta.physiqueδ = -1;
      delta.note = `Paper round done. £${(state.weeklyWage || 2.50).toFixed(2)} earned.`;
      break;
    case ACTIVITY_TYPES.REST:
      delta.physiqueδ = 2;
      delta.freshnessδ = 2;
      delta.note = 'You took the evening. Needed it.';
      break;
    case ACTIVITY_TYPES.PUB:
      delta.physiqueδ = -1;
      delta.note = 'You went to the pub.';
      break;
    case ACTIVITY_TYPES.STUDY:
      delta.note = 'You did your homework.';
      break;
  }
  return delta;
}

function initTBTGame(dob, grandfatherName, playerName) {
  return {
    playerName,
    grandfatherName,
    dob,
    age: calculateAge(dob, GAME_START.year),
    bank: 4.30,
    work: 'Paper round',
    weeklyWage: 2.50,
    home: "Nan's spare room",
    nanQuality: NAN_QUALITY_INITIAL,
    nanGrief:   false,
    relationships: {
      nan:         getNanDial(NAN_QUALITY_INITIAL, false),
      mum:         'green',
      grandfather: 'greyed',
    },
    cricket:  { matches: 0, innings: 0, runs: 0, wkts: 0, avg: null, hs: null },
    football: { apps: 0, goals: 0, level: null },
    form:     10,
    physique:  5,
    skill:     3,
    confidence: 5,
    tenacity:  5,
    sharpness: 1,
    freshness: 2,
    practiceSessionsThisCycle: 0,
    gameState: 'OPENING',
    turnNumber: 1,
  };
}

function classifyIntent(input) {
  if (!input || typeof input !== 'string') return 'OTHER';
  const lower = input.toLowerCase().trim();

  if (/\b(examine|look at|inspect|read|pick up|open|check|what is|what'?s)\b/.test(lower)) {
    return 'EXAMINE';
  }
  if (/\b(go|get|head|walk|catch|take|yes|utley|club|bus|saturday|cricket|there)\b/.test(lower)) {
    return 'GET_ON_BUS';
  }
  if (/\b(stay|no|home|sit|don't|not today|later|tomorrow|nan|here)\b/.test(lower)) {
    return 'STAY';
  }
  return 'OTHER';
}

const EXAMINE_RESPONSES = {
  match_stub: `Pale green card. You hold it between two fingers and it gives — soft, the way paper goes when it's been in a pocket for years. Not kept. Carried.\n\nTHE OVAL. HOME v AUSTRALIA. AUGUST 1948. 2/6. On the reverse, a printed batting order. His name is on it. You don't recognise any of the others yet. No score written on it. No annotation.\n\nWhatever happened at The Oval in August 1948, your grandfather wanted to remember he was there.`,

  eagle_comic: `April 1952. The Mekon on the cover — green-domed, sitting in his flying saucer, regarding Dan Dare with cold contempt. Like he's already won and is choosing not to announce it yet.\n\nThe colours are still bright. The tin kept the light out for thirty years.\n\nYou think the Mekon looks a bit naff, if you're honest. You keep looking at it anyway. Your grandfather kept this for thirty years and then put it in the tin. That's the part you can't quite explain.`,

  button: `White. Four holes. Doesn't match anything in this house.`,

  coin: `Heavier than you expect. Both sides worn smooth — not by age but by handling, by the specific pressure of a thumb. The wording is completely gone. What remains: a crest, something heraldic, an eagle or a lion or possibly both.\n\nYou can't tell if it's a semi-final or a final. You can't tell which year. You can't tell anything except that someone carried this for a very long time.`,

  photograph: `Black and white, slightly foxed at the edges where the damp got in at some point. Two rows of men in cricket whites, standing and sitting in front of The Oval pavilion. Your grandfather in the front row. Young — younger than you've ever thought of him as. Something around his mouth that isn't quite a smile. Like he knows something the camera doesn't.\n\nOn the back, in handwriting you don't recognise: The Oval, August 1948.`,

  wisden_page: `Torn out carefully — whoever did this took their time. The page is slightly yellowed but the print is sharp. England v Australia, The Oval, August 1948. A scorecard. His name second in the batting order.\n\nThere's a score next to his name. You'll need to find out what it means.`,

  southampton_programme: `A league match at The Dell, November 1947. Southampton versus someone — the cover is slightly water-damaged in the bottom corner, which is the south coast for you. His name in the printed lineup. Centre-half.\n\nNot a Cup Final. Not a famous match. Just a Tuesday in November, Southampton versus someone, The Dell, 1947. He kept this one. Not the glamorous one. This one.`,

  brylcreem_ad: `Torn from a magazine. Him again — younger than the photograph, hair swept back, looking directly at the camera. Something about his expression: he's enjoying a private joke with someone just out of frame.\n\nThe Brylcreem logo in the corner. He was paid to look like that. He kept it anyway.`,
};

const EXAMINE_PATTERNS = [
  { pattern: /\b(stub|match stub|match|oval|1948)\b/,                         id: 'match_stub' },
  { pattern: /\b(eagle|comic|mekon|dan dare|dan)\b/,                          id: 'eagle_comic' },
  { pattern: /\b(button)\b/,                                                  id: 'button' },
  { pattern: /\b(coin|cup|crest|heraldic)\b/,                                 id: 'coin' },
  { pattern: /\b(photo|photograph|picture|image)\b/,                          id: 'photograph' },
  { pattern: /\b(wisden|scorecard|score|batting order|cricket score)\b/,      id: 'wisden_page' },
  { pattern: /\b(programme|program|southampton|dell|football programme)\b/,   id: 'southampton_programme' },
  { pattern: /\b(brylcreem|advert|advertisement|ad)\b/,                       id: 'brylcreem_ad' },
];

function identifyExamineTarget(input) {
  if (!input || typeof input !== 'string') return null;
  const lower = input.toLowerCase();
  for (const { pattern, id } of EXAMINE_PATTERNS) {
    if (pattern.test(lower)) return id;
  }
  return null;
}

function getExamineResponse(objectId) {
  return EXAMINE_RESPONSES[objectId] || null;
}

function buildTurnSummaryData(state, events) {
  const { month, year } = getGameDate(state.turnNumber);
  return {
    month,
    year,
    events: events || [],
    nanDial: state.relationships.nan,
    form:    state.form,
    bank:    `£${state.bank.toFixed(2)}`,
  };
}

module.exports = {
  initTBTGame,
  calculateAge,
  getGameDate,
  getTinObjects,
  classifyIntent,
  classifyActivity,
  classifyVisitQuality,
  applyActivity,
  getFormWord,
  getNanDial,
  computeForm,
  calculateLifeNoise,
  identifyExamineTarget,
  getExamineResponse,
  buildTurnSummaryData,
  TIN_OBJECTS,
  GAME_START,
  EXAMINE_RESPONSES,
  ACTIVITY_TYPES,
  FORM_BANDS,
  NAN_QUALITY_INITIAL,
  NAN_QUALITY_MAX,
  NAN_QUALITY_MIN,
};
