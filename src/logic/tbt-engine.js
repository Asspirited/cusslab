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
    relationships: {
      nan:         'green',
      mum:         'green',
      grandfather: 'greyed',
    },
    cricket:  { matches: 0, innings: 0, runs: 0, wkts: 0, avg: null, hs: null },
    football: { apps: 0, goals: 0, level: null },
    form:     'uncertain',
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
  buildTurnSummaryData,
  TIN_OBJECTS,
  GAME_START,
};
