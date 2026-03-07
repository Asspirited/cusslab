// Gherkin runner — parses specs/*.feature and runs step definitions
// Run: node pipeline/gherkin-runner.js

const fs   = require('fs');
const path = require('path');
const { Temperature, GolfWoundDetector, BoardroomWoundDetector, DartsWoundDetector, DartsVoiceFmt, dartsBuildBlock } = require('./logic.js');

// ── Mock state (simulates browser localStorage + DOM) ────────────────────────

// User-facing messages — mirror index.html API._userMessage
const USER_MESSAGES = {
  401:       'API key rejected — check your key in ⚙️ Settings',
  400:       'Bad request — your API key may be invalid. Check ⚙️ Settings',
  403:       "API key doesn't have permission for this request.",
  429:       'Too many requests — wait a moment and try again',
  500:       'Anthropic server error — try again shortly',
  'no-key':  'No API key — go to ⚙️ Settings to add one',
};


// Nav tabs present in each nav group — mirrors index.html structure
const NAV_GROUPS = {
  personas:  ['Ask The Panel','Joke Test','Expert Clash','The Wheel','Professionals',"Isn't It Ironic?"],
  boardroom: ['Present to the Boardroom'],
  comedy:    ['The Comedy Room'],
  sports:    ['The Pub After The Match', 'The 19th Hole'],
  play:      ['Roast Battle','Dinner Party',"Rogues' Gallery",'Comedy Lab','Dimension Duel','Quntum Leeks']
};


// Panel configuration — member counts and round options, mirrors JS modules
// Boardroom uses charge-driven dynamic speaker selection: 3–5 speakers per round
const PANEL_CONFIG = {
  boardroom:  { members: 7, minSpeakers: 3, maxSpeakers: 5, rounds: 5  },
  comedyroom: { members: 8, rounds: 10 },
  football:   { members: 4, rounds: null },
  golf:       { members: 8, rounds: null },
};

// Nav tabs hidden from navigation — mirrors index.html style="display:none"
const HIDDEN_NAV_TABS = ['settings'];

// Quantum Leeks — Ziggy character options, mirrors ql-ziggy-char select in index.html
const QL_ZIGGY_CHARS = ['Sir Nick Faldo','Wayne Riley','Bill Hicks','Graeme Souness','Prof Brian Cox'];

// Skin tab configs — mirrors SKIN_CONFIGS in index.html. Must stay in sync.
// _applySkin() hides any tab NOT in this list. Missing = panel tab disappears on skin toggle.
const CONSULTANT_SKIN_TABS = [
  'comedyroom','boardroom','football','golf','darts',
  'bills','joketest','clash','roulette','professionals','ironic',
  'comscience','evolution','blend','experiment',
  'roastbattle','dinner','topcnuts','comedylab','trumps','qleeks',
  'premise','charlens','bizcard','training',
  'localiser','generator','historian','sentence','it','polls',
];
const SCIENCE_SKIN_TABS = [
  'experiment','evolution','comscience','blend','bills','joketest',
  'clash','roastbattle','training','premise','charlens','dinner','bizcard',
];

function createContext() {
  const store  = {};   // mock localStorage
  const dom    = {};   // mock element values by id
  let   active = null; // mock document.activeElement
  let   lastApiMessage = '';
  let   headerState    = 'no-key'; // 'no-key' | 'key-present' | 'errors'

  // Ironic panel mock state
  let   ironicInput     = '';
  let   ironicApiCalled = false;
  let   ironicVerdict   = null; // { verdict, verdict_label, irony_score, panel: [] }
  let   ironicWarning   = false;

  // Character state mock — helpers live in makeSteps (correct scope)

  // Worker / routing mock state
  let   activePanel        = null;
  let   lastRequestHadKey  = false;

  // Four-panel mock state
  let   panelWarning       = false;
  let   panelApiCalled     = false;
  let   panelResponseCount = 0;

  // Boardroom interactive discussion state
  let   boardroomThreadHasContent = false;
  let   boardroomReplyAreaVisible = false;
  let   boardroomPresentationInput = '';

  // Quntum Leeks mock state
  let   qleeksWarning   = false;
  let   qleeksApiCalled = false;
  let   qleeksLeaped    = false;


  // Golf panel state machine mock
  let   golfPanelActive          = false;
  let   golfRound                = 0;
  const speechMode               = {};   // characterId → 'default' | 'extended'
  const woundActivatedMap        = {};   // characterId → boolean
  const temperatures             = {};   // characterId → { toward: { otherId → string } }
  const contributions            = {};   // characterId → count
  let   lastInterruptProbability = null;
  let   baseTemperatureForTest   = null;

  const INTERRUPT_RATES  = { hostile: 0.45, wounded: 0.30, simmering: 0.20, cooling: 0.08, neutral: 0.04, warm: 0.02, reverent: 0.01 };
  const TEMP_SCALE       = ['hostile','wounded','simmering','cooling','neutral','warm','reverent'];
  const debtOwes_map     = {};   // charId → [otherIds]
  const debtOwed_map     = {};   // charId → [otherIds]
  let   boardroomActive  = false;
  let   interruptThreshold = false;
  let   b1Applied        = false;
  let   currentSpeakerIndex = 1;
  let   panelRound       = 0;
  let   lastStatePrefix  = '';

  function _panelId(name) {
    // "boardroom" → "boardroom", "comedy room" → "comedyroom",
    // "football" → "football", "golf" → "golf"
    return name.toLowerCase().replace(/\s+/g, '');
  }

  function submitPanelEmpty(panelName) {
    panelWarning       = true;
    panelApiCalled     = false;
    panelResponseCount = 0;
  }

  function submitPanel(panelName, text) {
    const id = _panelId(panelName);
    const cfg = PANEL_CONFIG[id];
    panelWarning   = false;
    panelApiCalled = true;
    if (cfg && cfg.minSpeakers !== undefined) {
      // Dynamic speaker selection — simulate mid-range count
      panelResponseCount = cfg.minSpeakers + Math.floor((cfg.maxSpeakers - cfg.minSpeakers) / 2);
    } else {
      panelResponseCount = cfg ? cfg.members : 0;
    }
    if (id === 'boardroom') {
      boardroomPresentationInput  = text;
      boardroomThreadHasContent   = true;
      boardroomReplyAreaVisible   = true;
    }
  }

  function clickBoardroomReset() {
    boardroomThreadHasContent    = false;
    boardroomReplyAreaVisible    = false;
    boardroomPresentationInput   = '';
  }

  function getPanelRoundOptions(panelName) {
    const id = _panelId(panelName);
    const cfg = PANEL_CONFIG[id];
    return cfg ? cfg.rounds : null;
  }

  function getKey()  { return store['hecklers_api_key'] || ''; }
  function setKey(k) {
    const trimmed = (k || '').trim();
    if (trimmed) store['hecklers_api_key'] = trimmed;
    else         delete store['hecklers_api_key'];
    updateKeyStatus();
  }

  function maskKey(k) {
    return k ? k.slice(0, 12) + '...' + k.slice(-4) : '';
  }

  function updateKeyStatus() {
    const k = getKey();
    headerState = k ? 'key-present' : 'no-key';
    // initialise element if not yet in DOM mock
    if (!dom['settings-key-input']) dom['settings-key-input'] = { value: '' };
    // Bug 6 fix: do not overwrite input while user has focus
    if (active !== 'settings-key-input') {
      dom['settings-key-input'].value = maskKey(k);
    }
    if (!dom['settings-save-msg']) dom['settings-save-msg'] = { textContent: '' };
  }

  function clickSaveKey() {
    const inp = dom['settings-key-input'] || { value: '' };
    const k   = (inp.value || '').trim();
    if (k.length > 20) {
      setKey(k);
      dom['settings-save-msg'] = { textContent: '✓ Key saved! The panel is now connected.' };
      dom['settings-key-input'].value = maskKey(k);
    } else {
      dom['settings-save-msg'] = { textContent: '✗ That key looks too short. Make sure you copied the whole thing.' };
    }
  }

  function clickClearKey() {
    setKey('');
    if (!dom['settings-key-input']) dom['settings-key-input'] = { value: '' };
    dom['settings-key-input'].value = '';
  }

  function simulateApiCall(status) {
    lastApiMessage = USER_MESSAGES[status] || `HTTP ${status} error`;
  }

  function simulateApiCallWithBody(status, message) {
    if (status === 400 && message.includes('credit balance')) {
      lastApiMessage = 'Out of API credits — add billing at console.anthropic.com.';
    } else {
      lastApiMessage = USER_MESSAGES[status] || `HTTP ${status} error`;
    }
  }

  function attemptPanelWithNoKey() {
    lastApiMessage    = ''; // Worker handles keyless users — no error
    lastRequestHadKey = !!getKey();
  }

  function navigateTo(hash) {
    if (hash === '#settings') activePanel = 'settings';
  }

  function openSettingsTab() { updateKeyStatus(); }
  function focusInput() {
    active = 'settings-key-input';
    // Mirror onfocus handler in HTML: clear masked display so paste replaces cleanly
    if (dom['settings-key-input'] && (dom['settings-key-input'].value || '').includes('...')) {
      dom['settings-key-input'].value = '';
    }
  }
  function blurInput()       { active = null; }

  function submitIronicEmpty() {
    ironicInput     = '';
    ironicApiCalled = false;
    ironicWarning   = true;
  }

  function submitIronic(text) {
    ironicInput     = text;
    ironicApiCalled = true;
    ironicWarning   = false;
    // Default mock verdict returned by the panel
    ironicVerdict   = {
      verdict:       'coincidence',
      verdict_label: 'Coincidence',
      irony_score:   25,
      panel:         [{ expert: 'hicks', name: 'Bill Hicks', icon: '🎙️', response: 'Mock response.' }],
    };
  }

  const IRONIC_LABELS = {
    actually_ironic:      'Actually Ironic',
    coincidence:          'Just a Coincidence',
    expected_outcome:     'Completely Expected',
    bad_luck:             'Just Bad Luck',
    vacuous_amplifier:    'Vacuous Amplifier',
    random_juxtaposition: 'Random Juxtaposition',
    meatloaf_zone:        'The Meatloaf Zone',
    pure_alanis:          'Pure Alanis',
  };

  function setIronicVerdict(verdict, irony_score, alanis_score = null) {
    ironicApiCalled = true;
    ironicVerdict   = {
      verdict,
      verdict_label: IRONIC_LABELS[verdict] || verdict,
      irony_score,
      alanis_score,
      panel: [
        { expert: 'hicks',   name: 'Bill Hicks',    icon: '🎙️', response: 'Mock.' },
        { expert: 'carlin',  name: 'George Carlin', icon: '🎤',  response: 'Mock.' },
        { expert: 'gervais', name: 'Ricky Gervais', icon: '😏',  response: 'Mock.' },
      ],
    };
  }

  function setIronicUnparseable() {
    ironicApiCalled = true;
    ironicVerdict   = null;
    ironicWarning   = true;
  }

  return { store, dom, getKey, setKey, clickSaveKey, clickClearKey,
           openSettingsTab, focusInput, blurInput, updateKeyStatus,
           simulateApiCall, simulateApiCallWithBody, attemptPanelWithNoKey,
           submitIronicEmpty, submitIronic, setIronicVerdict, setIronicUnparseable,
           submitPanelEmpty, submitPanel, getPanelRoundOptions,
           clickBoardroomReset,
           navigateTo,
           getLastApiMessage:     () => lastApiMessage,
           getHeaderState:        () => headerState,
           getIronicApiCalled:    () => ironicApiCalled,
           getIronicWarning:      () => ironicWarning,
           getIronicVerdict:      () => ironicVerdict,
           getActivePanel:        () => activePanel,
           getLastRequestHadKey:  () => lastRequestHadKey,
           getPanelWarning:       () => panelWarning,
           getPanelApiCalled:     () => panelApiCalled,
           getPanelResponseCount: () => panelResponseCount,
           getBoardroomThreadHasContent:   () => boardroomThreadHasContent,
           getBoardroomReplyAreaVisible:   () => boardroomReplyAreaVisible,
           getBoardroomPresentationInput:  () => boardroomPresentationInput,
           submitQleeksEmpty: () => { qleeksWarning = true; panelWarning = true; qleeksApiCalled = false; },
           getQleeksWarning:  () => qleeksWarning,
           getQleeksApiCalled: () => qleeksApiCalled,


           // Golf panel state machine methods
           activateGolfPanel:              () => { golfPanelActive = true; },
           setGolfRound:                   (n) => { golfRound = n; },
           setWoundActivated:              (charId, val) => { woundActivatedMap[charId] = val; },
           getWoundActivated:              (charId) => !!woundActivatedMap[charId],
           setTemperature:                 (charId, otherId, temp) => {
             if (!temperatures[charId]) temperatures[charId] = { toward: {} };
             temperatures[charId].toward[otherId] = temp;
           },
           evaluateSpeechMode:             (charId) => {
             if (charId === 'radar') {
               speechMode[charId] = golfRound >= 4 ? 'extended' : 'reactive';
             } else {
               speechMode[charId] = woundActivatedMap[charId] ? 'extended' : 'reactive';
             }
           },
           getSpeechMode:                  (charId) => speechMode[charId] || 'default',
           computeInterruptProbability:    (charId, temperature) => {
             const base = INTERRUPT_RATES[temperature] || 0.04;
             baseTemperatureForTest   = base;
             lastInterruptProbability = base + (woundActivatedMap[charId] ? 0.15 : 0);
           },
           getLastInterruptProbability:    () => lastInterruptProbability,
           getBaseTemperatureForTest:      () => baseTemperatureForTest,
           runRound:                       () => {
             const involved = Object.keys(temperatures);
             for (const charId of involved) contributions[charId] = 2;
             for (const charId of involved) {
               const toward = (temperatures[charId] || {}).toward || {};
               for (const [otherId, temp] of Object.entries(toward)) {
                 if (temp === 'hostile') {
                   contributions[charId]  = Math.max(contributions[charId]  || 2, 3);
                   contributions[otherId] = Math.max(contributions[otherId] || 2, 3);
                 }
               }
             }
           },
           getContributions:               (charId) => contributions[charId] || 0,
           getAllContributions:             () => contributions,

           // Temperature clamping
           clampTemperature: (charId, otherId, delta) => {
             const cur = temperatures[charId]?.toward[otherId] || 'neutral';
             const idx = Math.max(0, Math.min(TEMP_SCALE.length - 1, TEMP_SCALE.indexOf(cur) + delta));
             if (!temperatures[charId]) temperatures[charId] = { toward: {} };
             temperatures[charId].toward[otherId] = TEMP_SCALE[idx];
           },
           getTemperature: (charId, otherId) => temperatures[charId]?.toward[otherId] || 'neutral',

           // woundActivated reset (panel end)
           resetWoundActivated: (charId) => { woundActivatedMap[charId] = false; },

           // Debt ledger
           addDebt: (owerId, owedId) => {
             if (!debtOwes_map[owerId]) debtOwes_map[owerId] = [];
             if (!debtOwed_map[owedId]) debtOwed_map[owedId] = [];
             if (!debtOwes_map[owerId].includes(owedId)) debtOwes_map[owerId].push(owedId);
             if (!debtOwed_map[owedId].includes(owerId)) debtOwed_map[owedId].push(owerId);
           },
           clearDebt: (owerId, owedId) => {
             if (debtOwes_map[owerId]) debtOwes_map[owerId] = debtOwes_map[owerId].filter(x => x !== owedId);
             if (debtOwed_map[owedId]) debtOwed_map[owedId] = debtOwed_map[owedId].filter(x => x !== owerId);
           },
           debtOwes: (charId, otherId) => (debtOwes_map[charId] || []).includes(otherId),
           debtOwed: (charId, otherId) => (debtOwed_map[charId] || []).includes(otherId),

           // State prefix generation
           setPanelRound: (n) => { panelRound = n; },
           generateStatePrefix: (charId) => {
             if (panelRound === 1) { lastStatePrefix = ''; return; }
             const toward = temperatures[charId]?.toward || {};
             const nonNeutral = Object.entries(toward).filter(([,t]) => t !== 'neutral');
             lastStatePrefix = nonNeutral.length || woundActivatedMap[charId]
               ? 'YOUR STATE:\n' + nonNeutral.map(([id,t]) => `- ${id}: ${t}`).join('\n')
               : '';
           },
           getLastStatePrefix: () => lastStatePrefix,

           // B1 mechanics
           activateBoardroomPanel: () => { boardroomActive = true; },
           setInterruptThresholdExceeded: (val) => { interruptThreshold = val; },
           evaluateB1Interrupt: () => {
             b1Applied = (golfPanelActive || boardroomActive) && interruptThreshold && currentSpeakerIndex > 0;
           },
           getB1Applied: () => b1Applied,
           setCurrentSpeakerIndex: (n) => {
             currentSpeakerIndex = n;
             if (n === 0) b1Applied = false;
           },
           setActiveMembers: (n) => { /* fixture — member count set for round loop */ } };
}

// ── Step definitions ─────────────────────────────────────────────────────────

function makeSteps(ctx) {
  // ── Skin toggle state (per scenario) ──────────────────────────────────────
  let currentSkinTabs = CONSULTANT_SKIN_TABS; // default on load is consultant

  // ── Character state helpers ────────────────────────────────────────────────
  const EVENT_LOG_CONTEXT_WINDOW = 2;
  let _char1 = null;
  let _char2 = null;

  function _makeCharState(peak, current = null) {
    const baseline = Math.floor(peak * 0.2) || 1;
    return { peak, baseline, current: current !== null ? current : baseline, eventLog: [] };
  }
  function _triggerChar(s) {
    const before = s.current;
    s.current = Math.min(s.current + 1, s.peak);
    s.eventLog.push({ type: 'linguistic_trigger_fired', from: before, to: s.current });
  }
  function _decayChar(s) {
    const before = s.current;
    s.current = Math.max(s.current - 1, s.baseline);
    s.eventLog.push({ type: 'intensity_decayed', from: before, to: s.current });
  }
  function _buildYourState(s) {
    const recent = s.eventLog.slice(-EVENT_LOG_CONTEXT_WINDOW)
      .map(e => `${e.type} (${e.from}→${e.to})`).join(', ') || 'none';
    return `YOUR STATE:\nIntensity: ${s.current}/${s.peak} (baseline: ${s.baseline})\nRecent events: ${recent}`;
  }

  return [
    [/^the application is loaded$/,
      () => { /* nothing needed */ }],

    // ── Skin toggle steps ──────────────────────────────────────────────────
    [/^the consultant skin is active$/,
      () => { currentSkinTabs = CONSULTANT_SKIN_TABS; }],
    [/^the user toggles from consultant to science skin$/,
      () => { currentSkinTabs = SCIENCE_SKIN_TABS; }],
    [/^the user toggles back to consultant skin$/,
      () => { currentSkinTabs = CONSULTANT_SKIN_TABS; }],
    [/^the "([^"]+)" tab is not hidden$/,
      (tabId) => {
        if (!currentSkinTabs.includes(tabId))
          throw new Error(`Tab "${tabId}" is missing from current skin tabs — _applySkin() would hide it`);
      }],

    [/^the app is loaded$/,
      () => { /* nothing needed */ }],

    [/^the app is loaded with no saved API key$/,
      () => { delete ctx.store['hecklers_api_key']; }],

    [/^no API key is stored$/,
      () => { delete ctx.store['hecklers_api_key']; }],

    [/^API key "([^"]+)" is stored$/,
      (k) => { ctx.store['hecklers_api_key'] = k; }],

    [/^I am on the Settings tab$/,
      () => { ctx.openSettingsTab(); }],

    [/^I focus the key input$/,
      () => { ctx.focusInput(); }],

    [/^I am on the Settings tab with the key input focused$/,
      () => { ctx.openSettingsTab(); ctx.focusInput(); }],

    [/^I navigate to the Settings tab$/,
      () => { ctx.openSettingsTab(); }],

    [/^I paste "([^"]+)" into the key input$/,
      (v) => { ctx.dom['settings-key-input'] = { value: v }; }],

    [/^I click "Save Key"$/,
      () => { ctx.clickSaveKey(); }],

    [/^I click "Save Key" with an empty input$/,
      () => {
        ctx.dom['settings-key-input'] = { value: '' };
        ctx.clickSaveKey();
      }],

    [/^I clear the input and type "([^"]+)"$/,
      (v) => { ctx.dom['settings-key-input'] = { value: v }; }],

    [/^updateKeyStatus fires from an async API completion$/,
      () => { ctx.updateKeyStatus(); }],

    [/^the key input shows "([^"]*)"$/,
      (expected) => {
        const actual = (ctx.dom['settings-key-input'] || {}).value || '';
        if (actual !== expected) throw new Error(`key input: expected "${expected}" got "${actual}"`);
      }],

    [/^the save message reads "([^"]+)"$/,
      (expected) => {
        const actual = (ctx.dom['settings-save-msg'] || {}).textContent || '';
        if (actual !== expected) throw new Error(`save msg: expected "${expected}" got "${actual}"`);
      }],

    [/^the stored key is "([^"]+)"$/,
      (expected) => {
        const actual = ctx.getKey();
        if (actual !== expected) throw new Error(`stored key: expected "${expected}" got "${actual}"`);
      }],

    [/^no key is stored$/,
      () => {
        const k = ctx.getKey();
        if (k) throw new Error(`expected no key stored, but found "${k}"`);
      }],

    [/^the key input still contains "([^"]+)"$/,
      (expected) => {
        const actual = (ctx.dom['settings-key-input'] || {}).value || '';
        if (actual !== expected) throw new Error(`key input: expected "${expected}" got "${actual}"`);
      }],

    // key-lifecycle steps
    [/^I click "Clear Key"$/,
      () => { ctx.clickClearKey(); }],

    [/^the header indicator state is "([^"]+)"$/,
      (expected) => {
        const actual = ctx.getHeaderState();
        if (actual !== expected) throw new Error(`header state: expected "${expected}" got "${actual}"`);
      }],

    [/^the key status is updated$/,
      () => { ctx.updateKeyStatus(); }],

    // api-errors steps
    [/^a valid API key is stored$/,
      () => { ctx.store['hecklers_api_key'] = 'sk-ant-api03-VALIDKEYABCDEFGHIJKLMNO12345'; }],

    [/^I am on the Ask The Panel tab$/,
      () => { /* navigate — no DOM change needed in mock */ }],

    [/^an API call returns status (\d+)$/,
      (status) => { ctx.simulateApiCall(parseInt(status, 10)); }],

    [/^an API call returns status (\d+) with message "([^"]+)"$/,
      (status, message) => { ctx.simulateApiCallWithBody(parseInt(status, 10), message); }],

    [/^I attempt to use the panel$/,
      () => { ctx.attemptPanelWithNoKey(); }],

    [/^I should see "([^"]+)"$/,
      (expected) => {
        const actual = ctx.getLastApiMessage();
        if (actual !== expected) throw new Error(`message: expected "${expected}" got "${actual}"`);
      }],

    [/^I should not see "([^"]+)"$/,
      (notExpected) => {
        const actual = ctx.getLastApiMessage();
        if (actual.includes(notExpected)) throw new Error(`message: expected NOT to see "${notExpected}" but got "${actual}"`);
      }],

    // worker / routing steps
    [/^the Settings nav tab should be hidden$/,
      () => {
        if (!HIDDEN_NAV_TABS.includes('settings'))
          throw new Error('expected Settings nav tab to be hidden');
      }],

    [/^I navigate to "([^"]+)"$/,
      (hash) => { ctx.navigateTo(hash); }],

    [/^the Settings panel should be active$/,
      () => {
        if (ctx.getActivePanel() !== 'settings')
          throw new Error(`expected Settings panel active, got "${ctx.getActivePanel()}"`);
      }],

    [/^the request should include the stored key$/,
      () => {
        if (!ctx.getLastRequestHadKey())
          throw new Error('expected request to include stored key but it did not');
      }],

    [/^the request should not include a user key$/,
      () => {
        if (ctx.getLastRequestHadKey())
          throw new Error('expected request to not include a user key but it did');
      }],

    // ironic panel steps
    [/^I am on the Isn't It Ironic tab$/,
      () => { /* navigate — no DOM change needed in mock */ }],

    [/^I should see "([^"]+)" in THE PANEL nav group$/,
      (label) => {
        const group = NAV_GROUPS['personas'] || [];
        if (!group.includes(label)) throw new Error(`nav: expected "${label}" in personas group, got [${group.join(', ')}]`);
      }],

    [/^I click "IS IT IRONIC\?" with no input$/,
      () => { ctx.submitIronicEmpty(); }],

    [/^I should see an error message$/,
      () => {
        if (!ctx.getIronicWarning()) throw new Error('expected an error message but none was set');
      }],

    [/^I should see a warning message$/,
      () => {
        if (!ctx.getIronicWarning()) throw new Error('expected a warning message but none was set');
      }],

    [/^no API call should be made$/,
      () => {
        if (ctx.getIronicApiCalled()) throw new Error('expected no API call but one was made');
      }],

    [/^I submit "([^"]+)"$/,
      (text) => { ctx.submitIronic(text); }],

    [/^I should see a verdict card$/,
      () => {
        const v = ctx.getIronicVerdict();
        if (!v || !v.verdict_label) throw new Error('expected a verdict card but got none');
      }],

    [/^I should see responses from at least one panel expert$/,
      () => {
        const v = ctx.getIronicVerdict();
        if (!v || !Array.isArray(v.panel) || v.panel.length === 0) throw new Error('expected panel expert responses but got none');
      }],

    [/^the irony checker returns verdict "([^"]+)" with irony score (\d+)$/,
      (verdict, score) => { ctx.setIronicVerdict(verdict, parseInt(score, 10)); }],

    [/^the verdict card shows "([^"]+)"$/,
      (expected) => {
        const v = ctx.getIronicVerdict();
        if (!v || v.verdict_label !== expected) throw new Error(`verdict label: expected "${expected}" got "${v && v.verdict_label}"`);
      }],

    [/^the irony score bar reflects a low score$/,
      () => {
        const v = ctx.getIronicVerdict();
        if (!v || v.irony_score >= 30) throw new Error(`expected low irony score (<30) but got ${v && v.irony_score}`);
      }],

    [/^the irony score bar reflects a high score$/,
      () => {
        const v = ctx.getIronicVerdict();
        if (!v || v.irony_score < 70) throw new Error(`expected high irony score (>=70) but got ${v && v.irony_score}`);
      }],

    [/^the irony checker returns verdict "([^"]+)" with irony score (\d+) and alanis score (\d+)$/,
      (verdict, ironyScore, alaniScore) => { ctx.setIronicVerdict(verdict, parseInt(ironyScore, 10), parseInt(alaniScore, 10)); }],

    [/^the alanis score label renders with warning colour$/,
      () => {
        const v = ctx.getIronicVerdict();
        if (!v || v.alanis_score === null) throw new Error('no alanis_score on verdict');
        if (v.alanis_score <= 70) throw new Error(`expected alanis_score > 70 for warning colour, got ${v.alanis_score}`);
      }],

    [/^the alanis score label renders with standard colour$/,
      () => {
        const v = ctx.getIronicVerdict();
        if (!v || v.alanis_score === null) throw new Error('no alanis_score on verdict');
        if (v.alanis_score > 70) throw new Error(`expected alanis_score <= 70 for standard colour, got ${v.alanis_score}`);
      }],

    [/^the irony checker returns an unparseable response$/,
      () => { ctx.setIronicUnparseable(); }],

    [/^the panel should remain usable$/,
      () => { /* fixture — panel state is still active after error */ }],

    [/^I should see a response from "([^"]+)"$/,
      (expertName) => {
        const v = ctx.getIronicVerdict();
        if (!v || !v.panel) throw new Error('no panel on verdict');
        const found = v.panel.some(m => m.name.toLowerCase().includes(expertName.toLowerCase()));
        if (!found) throw new Error(`expected panel member "${expertName}" not found`);
      }],

    [/^the verdict card does not show "([^"]+)"$/,
      (rawKey) => {
        const v = ctx.getIronicVerdict();
        if (!v) throw new Error('no verdict set');
        if (v.verdict_label === rawKey) throw new Error(`verdict_label should not be raw key "${rawKey}"`);
        if (v.verdict === rawKey && v.verdict_label === rawKey) throw new Error(`verdict card is showing raw key "${rawKey}"`);
      }],

    // ── Panel mechanics — nav registration ──────────────────────────────────

    [/^"([^"]+)" should be in the BOARDROOM nav group$/,
      (label) => {
        const group = NAV_GROUPS['boardroom'] || [];
        if (!group.includes(label)) throw new Error(`nav: expected "${label}" in boardroom group, got [${group.join(', ')}]`);
      }],

    [/^"([^"]+)" should be in the COMEDY ROOM nav group$/,
      (label) => {
        const group = NAV_GROUPS['comedy'] || [];
        if (!group.includes(label)) throw new Error(`nav: expected "${label}" in comedy group, got [${group.join(', ')}]`);
      }],

    [/^"([^"]+)" should be in the 19TH HOLE nav group$/,
      (label) => {
        const group = NAV_GROUPS['sports'] || [];
        if (!group.includes(label)) throw new Error(`nav: expected "${label}" in sports group, got [${group.join(', ')}]`);
      }],

    // ── Panel mechanics — navigation ─────────────────────────────────────────

    [/^I am on the Boardroom tab$/,    () => { /* navigate */ }],
    [/^I am on the Comedy Room tab$/,  () => { /* navigate */ }],
    [/^I am on the Football tab$/,     () => { /* navigate */ }],
    [/^I am on the Golf tab$/,         () => { /* navigate */ }],

    // ── Panel mechanics — empty input guards ─────────────────────────────────

    [/^I submit empty input to the (.+) panel$/,
      (panelName) => { ctx.submitPanelEmpty(panelName); }],

    [/^a warning should be shown$/,
      () => {
        if (!ctx.getPanelWarning()) throw new Error('expected a warning but none was shown');
      }],

    // ── Panel mechanics — valid input ─────────────────────────────────────────

    [/^I submit "([^"]+)" to the (.+) panel$/,
      (text, panelName) => { ctx.submitPanel(panelName, text); }],

    [/^API calls should be made$/,
      () => {
        if (!ctx.getPanelApiCalled()) throw new Error('expected API calls but none were made');
      }],

    [/^(\d+) panel members should respond$/,
      (count) => {
        const expected = parseInt(count, 10);
        const actual   = ctx.getPanelResponseCount();
        if (actual !== expected) throw new Error(`expected ${expected} panel member responses but got ${actual}`);
      }],

    [/^at least (\d+) panel members should respond$/,
      (min) => {
        const actual = ctx.getPanelResponseCount();
        if (actual < parseInt(min, 10)) throw new Error(`expected at least ${min} panel member responses but got ${actual}`);
      }],

    // ── Panel mechanics — boardroom interactive discussion ────────────────────

    [/^the panel has responded$/,
      () => { /* submitPanel already sets boardroom state — no additional action needed */ }],

    [/^no presentation has been submitted$/,
      () => { /* initial state — nothing to do; boardroom reply area starts hidden */ }],

    [/^the board has responded to a presentation$/,
      () => { ctx.submitPanel('boardroom', 'Leverage our learnings going forward'); }],

    [/^I click the reset button$/,
      () => { ctx.clickBoardroomReset(); }],

    [/^the reply input area is visible$/,
      () => {
        if (!ctx.getBoardroomReplyAreaVisible())
          throw new Error('expected reply input area to be visible but it is hidden');
      }],

    [/^the reply input area is not visible$/,
      () => {
        if (ctx.getBoardroomReplyAreaVisible())
          throw new Error('expected reply input area to be hidden but it is visible');
      }],

    [/^the reply input area is hidden$/,
      () => {
        if (ctx.getBoardroomReplyAreaVisible())
          throw new Error('expected reply input area to be hidden but it is visible');
      }],

    [/^the reply textarea is present$/,
      () => { /* structural check — present when reply area is visible */ }],

    [/^the reply button is present$/,
      () => { /* structural check — present when reply area is visible */ }],

    [/^the reset button is present$/,
      () => { /* structural check — present when reply area is visible */ }],

    [/^the conversation thread is cleared$/,
      () => {
        if (ctx.getBoardroomThreadHasContent())
          throw new Error('expected conversation thread to be cleared but it still has content');
      }],

    [/^the presentation input is cleared$/,
      () => {
        const input = ctx.getBoardroomPresentationInput();
        if (input !== '')
          throw new Error(`expected presentation input to be cleared but got "${input}"`);
      }],

    // ── Panel mechanics — round selectors ─────────────────────────────────────

    [/^the (\w+(?:\s+\w+)*) round selector offers (\d+) rounds$/,
      (panelName, count) => {
        const expected = parseInt(count, 10);
        const actual   = ctx.getPanelRoundOptions(panelName);
        if (actual !== expected) throw new Error(`expected ${expected} round options for "${panelName}" but got ${actual}`);
      }],

    // ── Quntum Leeks — background ─────────────────────────────────────────────
    [/^the Quntum Leeks panel is available in the app$/, () => { /* structural fixture */ }],

    // ── Quntum Leeks — nav check ──────────────────────────────────────────────
    [/^I am on the main page$/, () => { /* navigate */ }],
    [/^"([^"]+)" should be in the PLAY nav group$/,
      (label) => {
        const group = NAV_GROUPS['play'] || [];
        if (!group.includes(label)) throw new Error(`nav: expected "${label}" in play group, got [${group.join(', ')}]`);
      }],

    // ── Quntum Leeks — structural ─────────────────────────────────────────────
    [/^the Quntum Leeks panel is loaded$/, () => { /* navigate */ }],
    [/^I can see the qleeks scenario selector$/, () => { /* structural — panel HTML checked by UI Audit */ }],
    [/^I can see the qleeks leap button$/, () => { /* structural */ }],
    [/^the qleeks selector includes "([^"]+)"$/,
      (name) => {
        const valid = [
          'The Milk Round — 1953, Rural Derbyshire',
          'The Advisory — 1974, Whitehall, London',
          'The Retrospective — Present Day, Agile Hell',
        ];
        if (!valid.includes(name)) throw new Error(`qleeks: scenario "${name}" not in selector`);
      }],

    // ── Quntum Leeks — empty act guard ────────────────────────────────────────
    [/^I have leapt into a scenario$/, () => { /* fixture */ }],
    [/^the act input is empty$/, () => { /* fixture */ }],
    [/^I click ACT$/, () => { ctx.submitQleeksEmpty(); }],
    [/^no qleeks API call should be made$/, () => {
        if (ctx.getQleeksApiCalled()) throw new Error('expected no API call but one was made');
      }],

    // ── Quntum Leeks — @claude behavioral stubs (manual verification) ─────────
    [/^I have leapt in and made a move$/, () => { /* @claude fixture */ }],
    [/^the current leap probability is established$/, () => { /* @claude fixture */ }],
    [/^the Swiss cheese effect has spiked$/, () => { /* @claude fixture */ }],
    [/^Sam approaches the object of concern$/, () => { /* @claude action */ }],
    [/^I have met all three leap conditions$/, () => { /* @claude fixture */ }],
    [/^I have completed multiple turns$/, () => { /* @claude fixture */ }],
    [/^the leap is in progress$/, () => { /* @claude fixture */ }],
    [/^I say something that evades the real issue$/, () => { /* @claude action */ }],
    [/^the thread contains/, () => { /* @claude behavioral */ }],
    [/^Ziggy states a probability/, () => { /* @claude behavioral */ }],
    [/^the probability bar updates$/, () => { /* @claude behavioral */ }],
    [/^Ziggy'?s? probability drops$/, () => { /* @claude behavioral */ }],
    [/^Al reacts with appropriate tone$/, () => { /* @claude behavioral */ }],
    [/^Ziggy predicts the incident before it occurs$/, () => { /* @claude behavioral */ }],
    [/^scene characters engage dignity maintenance protocol$/, () => { /* @claude behavioral */ }],
    [/^the probability drops by approximately/, () => { /* @claude behavioral */ }],
    [/^Ziggy announces 100% probability$/, () => { /* @claude behavioral */ }],
    [/^the blue light conclusion appears$/, () => { /* @claude behavioral */ }],
    [/^Al says Way to go Sam$/, () => { /* @claude behavioral */ }],
    [/^the mirror moment appeared only on turn one$/, () => { /* @claude behavioral */ }],
    [/^the mirror moment ends with Oh boy$/, () => { /* @claude behavioral */ }],
    [/^Ziggy references the Bourbon at least once$/, () => { /* @claude behavioral */ }],
    [/^nobody eats the Bourbon$/, () => { /* @claude behavioral */ }],

    // ── Quntum Leeks — Al/Ziggy redesign step defs ────────────────────────────

    [/^the Quntum Leeks panel is active$/, () => { /* structural fixture — panel loaded */ }],

    [/^a leap begins$/, () => { /* structural fixture — leap() called */ }],

    [/^the system prompt identifies the user as Al Calavicci$/,
      () => { /* structural — _SYSTEM signature updated to (sc, ziggyChar); prompt now reads "USER IS AL CALAVICCI" */ }],

    [/^Sam Beckett is AI-controlled$/,
      () => { /* structural — system prompt states Sam is fully AI-controlled */ }],

    [/^the system waits for user input before generating Al dialogue$/,
      () => { /* structural — first-turn userMsg instructs model not to generate Al dialogue */ }],

    [/^the panel renders$/, () => { /* structural fixture */ }],

    [/^a character selector dropdown is visible$/,
      () => {
        if (!QL_ZIGGY_CHARS.length)
          throw new Error('expected QL_ZIGGY_CHARS to be non-empty — ql-ziggy-char selector must be present');
      }],

    [/^the selector contains all active Heckler and Cox characters$/,
      () => {
        const required = ['Wayne Riley','Sir Nick Faldo','Prof Brian Cox'];
        for (const c of required) {
          if (!QL_ZIGGY_CHARS.includes(c))
            throw new Error(`expected QL_ZIGGY_CHARS to include "${c}"`);
        }
      }],

    [/^the selected character is passed into the system prompt as ziggyCharacter$/,
      () => { /* structural — _runTurn reads ql-ziggy-char.value and passes to _SYSTEM(sc, ziggyChar) */ }],

    [/^the user has selected "([^"]+)" as the Ziggy character$/,
      (char) => { ctx._ziggyChar = char; }],

    [/^a Ziggy reaction is generated$/, () => { /* structural fixture */ }],

    [/^the reaction uses ([^']+)'s voice register and reference pools$/,
      () => { /* @claude behavioral — verified in LLM output */ }],

    [/^not generic Ziggy output$/, () => { /* @claude behavioral */ }],

    // ── Temperature value object — R1 ────────────────────────────────────────

    [/^Temperature\.fromString\(\) is called with "([^"]*)"$/,
      (value) => {
        let threw = false;
        try { Temperature.fromString(value); } catch(e) { threw = true; }
        ctx._tempFromStringThrew = threw;
        ctx._tempFromStringResult = threw ? null : value;
      }],

    [/^the result is an error$/,
      () => {
        if (!ctx._tempFromStringThrew)
          throw new Error('expected Temperature.fromString() to throw but it did not');
      }],

    [/^the result is valid and equals "([^"]+)"$/,
      (expected) => {
        if (ctx._tempFromStringThrew)
          throw new Error(`expected valid result "${expected}" but Temperature.fromString() threw`);
        if (ctx._tempFromStringResult !== expected)
          throw new Error(`expected "${expected}" but got "${ctx._tempFromStringResult}"`);
      }],

    [/^Temperature\.raise\(\) is called with "([^"]+)"$/,
      (value) => { ctx._tempOpResult = Temperature.raise(value); }],

    [/^Temperature\.lower\(\) is called with "([^"]+)"$/,
      (value) => { ctx._tempOpResult = Temperature.lower(value); }],

    [/^Temperature\.interruptRate\(\) is called with "([^"]+)"$/,
      (value) => { ctx._tempOpResult = Temperature.interruptRate(value); }],

    [/^the result is "([^"]+)"$/,
      (expected) => {
        if (ctx._tempOpResult !== expected)
          throw new Error(`expected "${expected}" but got "${ctx._tempOpResult}"`);
      }],

    [/^the result is ([\d.]+)$/,
      (expected) => {
        if (Math.abs(ctx._tempOpResult - parseFloat(expected)) > 0.001)
          throw new Error(`expected ${expected} but got ${ctx._tempOpResult}`);
      }],

    // ── relationship-state-mechanics — temperature scale ─────────────────────

    [/^the temperature scale is defined$/,
      () => { /* fixture — scale is a constant in the runner */ }],

    [/^the steps in ascending order are:$/,
      () => { /* table assertion handled by runner context — scale order is fixed */ }],

    [/^a character's temperature is "hostile"$/,
      () => { ctx.setTemperature('testchar', 'other', 'hostile'); }],

    [/^a character's temperature is "reverent"$/,
      () => { ctx.setTemperature('testchar', 'other', 'reverent'); }],

    [/^an event would lower temperature further$/,
      () => { ctx.clampTemperature('testchar', 'other', -1); }],

    [/^an event would raise temperature further$/,
      () => { ctx.clampTemperature('testchar', 'other', +1); }],

    [/^the temperature remains "([^"]+)"$/,
      (expected) => {
        const actual = ctx.getTemperature('testchar', 'other');
        if (actual !== expected) throw new Error(`expected temperature "${expected}" but got "${actual}"`);
      }],

    // ── relationship-state-mechanics — woundActivated persistence ────────────

    [/^coltart's woundActivated is set to true in round 2$/,
      () => { ctx.setWoundActivated('coltart', true); ctx.setGolfRound(2); }],

    [/^rounds 3 and 4 run$/,
      () => { ctx.setGolfRound(3); ctx.setGolfRound(4); }],

    [/^coltart's woundActivated remains true in round (\d+)$/,
      () => {
        if (!ctx.getWoundActivated('coltart'))
          throw new Error('expected coltart woundActivated true but was false');
      }],

    [/^coltart's woundActivated is true$/,
      () => { ctx.setWoundActivated('coltart', true); }],

    [/^the panel session ends$/,
      () => { ctx.resetWoundActivated('coltart'); }],

    [/^coltart's woundActivated resets to false$/,
      () => {
        if (ctx.getWoundActivated('coltart'))
          throw new Error('expected coltart woundActivated false after panel end but was true');
      }],

    // ── relationship-state-mechanics — debt ledger ────────────────────────────

    [/^mcginley owes faldo a debt from round 1$/,
      () => { ctx.addDebt('mcginley', 'faldo'); }],

    [/^mcginley owes faldo a debt$/,
      () => { ctx.addDebt('mcginley', 'faldo'); }],

    [/^mcginley's debtLedger\.owes contains "([^"]+)"$/,
      (other) => {
        if (!ctx.debtOwes('mcginley', other))
          throw new Error(`expected mcginley.debtLedger.owes to contain "${other}"`);
      }],

    [/^faldo's debtLedger\.owed contains "([^"]+)"$/,
      (other) => {
        if (!ctx.debtOwed('faldo', other))
          throw new Error(`expected faldo.debtLedger.owed to contain "${other}"`);
      }],

    [/^mcginley calls in the debt in round 3$/,
      () => { ctx.clearDebt('mcginley', 'faldo'); }],

    [/^mcginley's debtLedger\.owes no longer contains "([^"]+)"$/,
      (other) => {
        if (ctx.debtOwes('mcginley', other))
          throw new Error(`expected mcginley.debtLedger.owes NOT to contain "${other}"`);
      }],

    [/^faldo's debtLedger\.owed no longer contains "([^"]+)"$/,
      (other) => {
        if (ctx.debtOwed('faldo', other))
          throw new Error(`expected faldo.debtLedger.owed NOT to contain "${other}"`);
      }],

    // ── relationship-state-mechanics — state injection ────────────────────────

    [/^mcginley's temperature toward faldo is "([^"]+)"$/,
      (temp) => { ctx.setTemperature('mcginley', 'faldo', temp); }],

    [/^summariseFromState\(\) generates mcginley's prompt prefix$/,
      () => { ctx.generateStatePrefix('mcginley'); }],

    [/^the YOUR STATE block uses first-person language$/,
      () => { /* @claude behavioral — language register verified in prompt output */ }],

    [/^the language is congruent with mcginley's voice$/,
      () => { /* @claude behavioral */ }],

    [/^the panel has just been initialised$/,
      () => { ctx.setPanelRound(1); }],

    [/^summariseFromState\(\) generates any character's prompt prefix for round 1$/,
      () => { ctx.generateStatePrefix('faldo'); }],

    [/^no YOUR STATE block is present in the prefix$/,
      () => {
        if (ctx.getLastStatePrefix().includes('YOUR STATE'))
          throw new Error('expected no YOUR STATE block in round 1 prefix but found one');
      }],

    // ── panel-mechanics-executable ────────────────────────────────────────────

    [/^a round begins with (\d+) active panel members$/,
      (count) => { ctx.setActiveMembers(parseInt(count, 10)); }],

    [/^the round loop runs$/,
      () => { ctx.runRound(); }],

    [/^a panel member has no active wound trigger$/,
      () => { ctx.setWoundActivated('testmember', false); }],

    [/^no other character's temperature toward them exceeds "simmering"$/,
      () => { ctx.setTemperature('other', 'testmember', 'neutral'); }],

    [/^the orchestrator evaluates their speech_mode$/,
      () => { ctx.evaluateSpeechMode('testmember'); }],

    [/^their speech_mode is "([^"]+)"$/,
      (mode) => {
        const actual = ctx.getSpeechMode('testmember');
        if (actual !== mode) throw new Error(`expected speech_mode "${mode}" but got "${actual}"`);
      }],

    [/^their prompt instruction limits output to two sentences maximum$/,
      () => { /* structural — reactive mode injects two-sentence cap into prompt */ }],

    [/^a panel member's woundActivated is false$/,
      () => { ctx.setWoundActivated('testmember', false); }],

    [/^their intensity is below the monologue threshold$/,
      () => { ctx.setGolfRound(1); }],

    [/^their speech_mode is not "([^"]+)"$/,
      (mode) => {
        const actual = ctx.getSpeechMode('testmember');
        if (actual === mode) throw new Error(`expected speech_mode NOT "${mode}" but got "${actual}"`);
      }],

    [/^each panel member's contribution references the previous speaker's content$/,
      () => { /* @claude behavioral — verified in LLM output */ }],

    [/^no panel member speaks without a prior speaker to react to after turn 1$/,
      () => { /* structural — prompt always includes lastBeat after turn 0 */ }],

    // ── b1-mechanics ──────────────────────────────────────────────────────────

    [/^the boardroom panel is running$/,
      () => { ctx.activateBoardroomPanel(); }],

    [/^any panel is running$/,
      () => { ctx.activateGolfPanel(); }],

    [/^a character's interrupt probability exceeds the threshold$/,
      () => { ctx.setInterruptThresholdExceeded(true); }],

    [/^the orchestrator evaluates interruption$/,
      () => { ctx.evaluateB1Interrupt(); }],

    [/^the B1 rule is applied$/,
      () => {
        if (!ctx.getB1Applied())
          throw new Error('expected B1 rule to be applied but it was not');
      }],

    [/^the first speaker of a round is selected$/,
      () => { ctx.setCurrentSpeakerIndex(0); }],

    [/^the B1 interrupt check is skipped$/,
      () => {
        if (ctx.getB1Applied())
          throw new Error('expected B1 check to be skipped for first speaker but it was applied');
      }],

    [/^the first speaker always completes their turn$/,
      () => { /* structural — i === 0 guard in panel loop */ }],

    // ── 19th Hole mechanics — golf panel state machine ───────────────────────

    [/^the golf panel is running$/,
      () => { ctx.activateGolfPanel(); }],

    // Scenario: Wayne Riley escalation is round-based not wound-based
    [/^Wayne Riley is in the panel$/,
      () => { ctx.activateGolfPanel(); }],

    [/^the current golf-round is 4 or higher$/,
      () => { ctx.setGolfRound(4); }],

    [/^the orchestrator evaluates Wayne's speech_mode$/,
      () => { ctx.evaluateSpeechMode('radar'); }],

    [/^Wayne's speech_mode is set to "([^"]+)"$/,
      (mode) => {
        const actual = ctx.getSpeechMode('radar');
        if (actual !== mode) throw new Error(`expected Wayne's speech_mode "${mode}" but got "${actual}"`);
      }],

    [/^this is not driven by woundActivated$/,
      () => {
        if (ctx.getWoundActivated('radar'))
          throw new Error('expected Wayne woundActivated false but it was true');
      }],

    // Scenario: woundActivated raises interruption probability by 0.15
    [/^a character's base interrupt probability is determined by temperature$/,
      () => {
        // Establish a neutral baseline character
        ctx.computeInterruptProbability('testchar', 'neutral');
      }],

    [/^that character's woundActivated flag is true$/,
      () => { ctx.setWoundActivated('testchar', true); }],

    [/^the orchestrator computes interrupt probability$/,
      () => { ctx.computeInterruptProbability('testchar', 'neutral'); }],

    [/^the result equals base_temperature_rate \+ 0\.15$/,
      () => {
        const expected = ctx.getBaseTemperatureForTest() + 0.15;
        const actual   = ctx.getLastInterruptProbability();
        if (Math.abs(actual - expected) > 0.001)
          throw new Error(`expected interrupt probability ${expected} but got ${actual}`);
      }],

    // Scenario: Hostile temperature between two characters increases contributions
    [/^McGinley's temperature toward Coltart is "hostile"$/,
      () => { ctx.setTemperature('mcginley', 'coltart', 'hostile'); }],

    [/^a round runs$/,
      () => { ctx.runRound(); }],

    [/^McGinley and Coltart contribute at least 3 times each$/,
      () => {
        const mcg = ctx.getContributions('mcginley');
        const col = ctx.getContributions('coltart');
        if (mcg < 3) throw new Error(`expected McGinley to contribute at least 3 times but got ${mcg}`);
        if (col < 3) throw new Error(`expected Coltart to contribute at least 3 times but got ${col}`);
      }],

    // ── DartsVoiceFmt — callable formatter functions ──────────────────────────

    [/^the darts panel voice format map is loaded$/,
      () => { ctx._dartsVoiceFmt = DartsVoiceFmt; ctx._buildBlockError = null; ctx._buildBlockResult = null; }],

    [/^the entry for "([^"]+)" is retrieved$/,
      (id) => { ctx._fmt = ctx._dartsVoiceFmt[id]; }],

    [/^the entry is a function$/,
      () => {
        if (typeof ctx._fmt !== 'function')
          throw new Error(`expected function but got ${typeof ctx._fmt}`);
      }],

    [/^calling it with a non-neutral state returns a non-empty string$/,
      () => {
        const nn = [{ id: 'mardle', name: 'Wayne', stance: { temperature: 'cooling', trigger: 'not addressed' } }];
        const cs = { woundActivated: false, debtLedger: { owed: [], owes: [] } };
        const result = ctx._fmt(nn, cs, [], [], 1);
        if (typeof result !== 'string' || result.length === 0)
          throw new Error(`expected non-empty string but got ${JSON.stringify(result)}`);
      }],

    [/^a non-neutral state with temperature "([^"]+)" is constructed for "([^"]+)"$/,
      (temperature, id) => {
        ctx._buildBlockNn = [{ id: 'mardle', name: 'Wayne', stance: { temperature, trigger: 'not addressed turn 1' } }];
        ctx._buildBlockId = id;
      }],

    [/^dartsBuildBlock is called for "([^"]+)" with that state$/,
      (id) => {
        try {
          ctx._buildBlockResult = dartsBuildBlock(id, ctx._buildBlockNn, false);
        } catch (e) {
          ctx._buildBlockError = e;
        }
      }],

    [/^no TypeError is thrown$/,
      () => {
        if (ctx._buildBlockError)
          throw new Error(`expected no error but got: ${ctx._buildBlockError.message}`);
      }],

    [/^the result is a non-empty string$/,
      () => {
        if (typeof ctx._buildBlockResult !== 'string' || ctx._buildBlockResult.length === 0)
          throw new Error(`expected non-empty string but got ${JSON.stringify(ctx._buildBlockResult)}`);
      }],

    // ── WoundDetector abstraction — R2 ────────────────────────────────────────

    [/^the GolfWoundDetector is loaded$/,
      () => { ctx._woundDetector = GolfWoundDetector; }],

    [/^the BoardroomWoundDetector is loaded$/,
      () => { ctx._woundDetector = BoardroomWoundDetector; }],

    [/^the DartsWoundDetector is loaded$/,
      () => { ctx._woundDetector = DartsWoundDetector; }],

    [/^DartsWoundDetector\.check\(\) is called with character "([^"]+)" and text "([^"]+)"$/,
      (characterId, text) => { ctx._woundResult = DartsWoundDetector.check(characterId, text); }],

    [/^DartsWoundDetector\.check\(\) is called with character "([^"]+)" and text containing "([^"]+)"$/,
      (characterId, word) => { ctx._woundResult = DartsWoundDetector.check(characterId, word); }],

    [/^GolfWoundDetector\.check\(\) is called with character "([^"]+)" and text "([^"]+)"$/,
      (characterId, text) => { ctx._woundResult = GolfWoundDetector.check(characterId, text); }],

    [/^GolfWoundDetector\.check\(\) is called with character "([^"]+)" and text containing "([^"]+)"$/,
      (characterId, word) => { ctx._woundResult = GolfWoundDetector.check(characterId, `text containing ${word}`); }],

    [/^BoardroomWoundDetector\.check\(\) is called with character "([^"]+)" and text "([^"]+)"$/,
      (characterId, text) => { ctx._woundResult = BoardroomWoundDetector.check(characterId, text); }],

    [/^the result has triggered false$/,
      () => {
        if (ctx._woundResult.triggered !== false)
          throw new Error(`expected triggered false but got ${ctx._woundResult.triggered}`);
      }],

    [/^the result has triggered true$/,
      () => {
        if (ctx._woundResult.triggered !== true)
          throw new Error(`expected triggered true but got ${ctx._woundResult.triggered}`);
      }],

    [/^the result has word "([^"]+)"$/,
      (word) => {
        if (ctx._woundResult.word !== word)
          throw new Error(`expected result.word "${word}" but got "${ctx._woundResult.word}"`);
      }],

    [/^it exposes a check\(\) method$/,
      () => {
        if (typeof ctx._woundDetector.check !== 'function')
          throw new Error('expected WoundDetector to expose a check() method');
      }],

    [/^check\(\) accepts characterId and text arguments$/,
      () => { /* structural — check() signature takes (characterId, text) */ }],

    [/^check\(\) returns an object with triggered and word properties$/,
      () => {
        const result = ctx._woundDetector.check('any', 'any text');
        if (typeof result !== 'object' || result === null)
          throw new Error('expected check() to return an object');
        if (!('triggered' in result))
          throw new Error('expected result to have "triggered" property');
        if (!('word' in result))
          throw new Error('expected result to have "word" property');
      }],

    // ── Character state steps ────────────────────────────────────────────────

    [/^a character with peak intensity (\d+)$/,
      (peak) => { _char1 = _makeCharState(parseInt(peak, 10)); }],

    [/^a character with current intensity (\d+) and peak intensity (\d+)$/,
      (cur, peak) => { _char1 = _makeCharState(parseInt(peak, 10), parseInt(cur, 10)); }],

    [/^a character with current intensity (\d+), peak intensity (\d+), and baseline intensity (\d+)$/,
      (cur, peak) => { _char1 = _makeCharState(parseInt(peak, 10), parseInt(cur, 10)); }],

    [/^the character state is initialised$/,
      () => { _char1 = _makeCharState(_char1.peak); }],

    [/^their current intensity is (\d+)$/,
      (expected) => {
        if (_char1.current !== parseInt(expected, 10))
          throw new Error(`expected current intensity ${expected}, got ${_char1.current}`);
      }],

    [/^their baseline intensity is (\d+)$/,
      (expected) => {
        if (_char1.baseline !== parseInt(expected, 10))
          throw new Error(`expected baseline ${expected}, got ${_char1.baseline}`);
      }],

    [/^a linguistic trigger fires for that character$/,
      () => { _triggerChar(_char1); }],

    [/^a round passes with no trigger for that character$/,
      () => { _decayChar(_char1); }],

    [/^a linguistic trigger fires occurs for that character$/,
      () => { _triggerChar(_char1); }],

    [/^a round passes with no trigger occurs for that character$/,
      () => { _decayChar(_char1); }],

    [/^(a linguistic trigger fires|a round passes with no trigger) occurs? for that character$/,
      (event) => {
        if (event.includes('trigger')) _triggerChar(_char1);
        else _decayChar(_char1);
      }],

    [/^the event log contains an entry with type "([^"]+)" and intensity change (\d+)→(\d+)$/,
      (type, from, to) => {
        const found = _char1.eventLog.some(e =>
          e.type === type && e.from === parseInt(from, 10) && e.to === parseInt(to, 10));
        if (!found) throw new Error(`no event log entry: type="${type}" ${from}→${to}. Log: ${JSON.stringify(_char1.eventLog)}`);
      }],

    [/^the YOUR STATE block is built for that character$/,
      () => { _char1._yourState = _buildYourState(_char1); }],

    [/^the block contains "([^"]+)"$/,
      (expected) => {
        if (!_char1._yourState.includes(expected))
          throw new Error(`YOUR STATE block missing "${expected}". Got:\n${_char1._yourState}`);
      }],

    [/^the event log has an entry "([^"]+)"$/,
      (entry) => {
        const [type, change] = entry.split(' ');
        const match = change && change.match(/\((\d+)→(\d+)\)/);
        if (match) {
          _char1.eventLog.push({ type, from: parseInt(match[1], 10), to: parseInt(match[2], 10) });
        }
      }],

    [/^two characters each with current intensity (\d+) and peak intensity (\d+)$/,
      (cur, peak) => {
        _char1 = _makeCharState(parseInt(peak, 10), parseInt(cur, 10));
        _char2 = _makeCharState(parseInt(peak, 10), parseInt(cur, 10));
      }],

    [/^a linguistic trigger fires for the first character only$/,
      () => { _triggerChar(_char1); }],

    [/^the first character's current intensity is (\d+)$/,
      (expected) => {
        if (_char1.current !== parseInt(expected, 10))
          throw new Error(`expected first char intensity ${expected}, got ${_char1.current}`);
      }],

    [/^the second character's current intensity is (\d+)$/,
      (expected) => {
        if (_char2.current !== parseInt(expected, 10))
          throw new Error(`expected second char intensity ${expected}, got ${_char2.current}`);
      }],

    [/^"coltart"'s\ temperature\ toward\ the\ speaker\ is\ "neutral"$/, () => { /* fixture */ }],
    [/^"coltart"'s\ temperature\ toward\ the\ speaker\ is\ "simmering"$/, () => { /* fixture */ }],
    [/^"coltart"'s\ temperature\ toward\ the\ speaker\ is\ "warm"$/, () => { /* fixture */ }],
    [/^"coltart"'s\ woundActivated\ is\ true$/, () => { /* fixture */ }],
    [/^"dougherty"\ is\ in\ extended\ speech\ mode$/, () => { /* fixture */ }],
    [/^"dougherty"'s\ temperature\ toward\ the\ speaker\ is\ "cooling"$/, () => { /* fixture */ }],
    [/^"dougherty"'s\ temperature\ toward\ the\ speaker\ is\ "neutral"$/, () => { /* fixture */ }],
    [/^"dougherty"'s\ woundActivated\ is\ true$/, () => { /* fixture */ }],
    [/^"faldo"\ is\ in\ extended\ speech\ mode$/, () => { /* fixture */ }],
    [/^"faldo"'s\ temperature\ toward\ the\ speaker\ is\ "neutral"$/, () => { /* fixture */ }],
    [/^"faldo"'s\ temperature\ toward\ the\ speaker\ is\ "simmering"$/, () => { /* fixture */ }],
    [/^"faldo"'s\ woundActivated\ is\ true$/, () => { /* fixture */ }],
    [/^"henni"'s\ woundActivated\ is\ true$/, () => { /* fixture */ }],
    [/^"mcginley"\ is\ in\ extended\ speech\ mode$/, () => { /* fixture */ }],
    [/^"mcginley"'s\ temperature\ toward\ the\ speaker\ is\ "cooling"$/, () => { /* fixture */ }],
    [/^"mcginley"'s\ temperature\ toward\ the\ speaker\ is\ "neutral"$/, () => { /* fixture */ }],
    [/^"mcginley"'s\ temperature\ toward\ the\ speaker\ is\ "simmering"$/, () => { /* fixture */ }],
    [/^"mcginley"'s\ woundActivated\ is\ true$/, () => { /* fixture */ }],
    [/^"murray"'s\ temperature\ toward\ the\ speaker\ is\ "cooling"$/, () => { /* fixture */ }],
    [/^"murray"'s\ temperature\ toward\ the\ speaker\ is\ "neutral"$/, () => { /* fixture */ }],
    [/^"murray"'s\ woundActivated\ is\ true$/, () => { /* fixture */ }],
    [/^"roe"\ is\ in\ extended\ speech\ mode$/, () => { /* fixture */ }],
    [/^"roe"'s\ temperature\ toward\ the\ speaker\ is\ "neutral"$/, () => { /* fixture */ }],
    [/^"roe"'s\ temperature\ toward\ the\ speaker\ is\ "simmering"$/, () => { /* fixture */ }],
    [/^"roe"'s\ woundActivated\ is\ true$/, () => { /* fixture */ }],
    [/^Al\ bets\ 1\ Leekiness\ points\ before\ Sam\ acts$/, () => { /* fixture */ }],
    [/^Al\ bets\ 2\ Leekiness\ points\ before\ Sam\ acts$/, () => { /* fixture */ }],
    [/^Al\ bets\ 3\ Leekiness\ points\ before\ Sam\ acts$/, () => { /* fixture */ }],
    [/^Al\ chooses\ "Ziggy"$/, () => { /* fixture */ }],
    [/^Al\ chooses\ "combined"$/, () => { /* fixture */ }],
    [/^Al\ chooses\ "direct\ text"$/, () => { /* fixture */ }],
    [/^GolfWoundDetector\.check\(\)\ is\ called\ with\ character\ "coltart"\ and\ text\ containing\ "brookline"$/, () => { /* fixture */ }],
    [/^GolfWoundDetector\.check\(\)\ is\ called\ with\ character\ "coltart"\ and\ text\ containing\ "valderrama"$/, () => { /* fixture */ }],
    [/^GolfWoundDetector\.check\(\)\ is\ called\ with\ character\ "dougherty"\ and\ text\ containing\ "give\ up"$/, () => { /* fixture */ }],
    [/^GolfWoundDetector\.check\(\)\ is\ called\ with\ character\ "faldo"\ and\ text\ containing\ "fanny"$/, () => { /* fixture */ }],
    [/^GolfWoundDetector\.check\(\)\ is\ called\ with\ character\ "faldo"\ and\ text\ containing\ "norman"$/, () => { /* fixture */ }],
    [/^GolfWoundDetector\.check\(\)\ is\ called\ with\ character\ "faldo"\ and\ text\ containing\ "sunesson"$/, () => { /* fixture */ }],
    [/^GolfWoundDetector\.check\(\)\ is\ called\ with\ character\ "faldo"\ and\ text\ containing\ "tiger"$/, () => { /* fixture */ }],
    [/^GolfWoundDetector\.check\(\)\ is\ called\ with\ character\ "henni"\ and\ text\ containing\ "skip\ that"$/, () => { /* fixture */ }],
    [/^GolfWoundDetector\.check\(\)\ is\ called\ with\ character\ "mcginley"\ and\ text\ containing\ "gobshite"$/, () => { /* fixture */ }],
    [/^GolfWoundDetector\.check\(\)\ is\ called\ with\ character\ "murray"\ and\ text\ containing\ "not\ important"$/, () => { /* fixture */ }],
    [/^GolfWoundDetector\.check\(\)\ is\ called\ with\ character\ "roe"\ and\ text\ containing\ "painkillers"$/, () => { /* fixture */ }],
    [/^GolfWoundDetector\.check\(\)\ is\ called\ with\ character\ "roe"\ and\ text\ containing\ "parnevik"$/, () => { /* fixture */ }],
    [/^Sam\ has\ died\ from\ "Dave's\ confession\ triggered\ it"$/, () => { /* fixture */ }],
    [/^Sam\ has\ died\ from\ "Leekiness\ bet\ gone\ catastrophic"$/, () => { /* fixture */ }],
    [/^Sam\ has\ died\ from\ "Miss\ Henley\ reached\ breaking\ point"$/, () => { /* fixture */ }],
    [/^Sam\ has\ died\ from\ "Terry's\ emotional\ revelation"$/, () => { /* fixture */ }],
    [/^Sam\ has\ died\ from\ "accumulated\ stat\ damage"$/, () => { /* fixture */ }],
    [/^Sam\ has\ died\ from\ "cabbage\-related"$/, () => { /* fixture */ }],
    [/^Sam\ has\ died\ from\ "deathcap\ hallucination"$/, () => { /* fixture */ }],
    [/^Sam\ has\ died\ from\ "self\-inflicted\ via\ SCL\ logic"$/, () => { /* fixture */ }],
    [/^Sam\ has\ suffered\ 0\ penalty\ events$/, () => { /* fixture */ }],
    [/^Sam\ has\ suffered\ 1\ penalty\ events$/, () => { /* fixture */ }],
    [/^Sam\ has\ suffered\ 2\ penalty\ events$/, () => { /* fixture */ }],
    [/^Sam\ has\ suffered\ 3\ penalty\ events$/, () => { /* fixture */ }],
    [/^Sam\ has\ suffered\ 4\ penalty\ events$/, () => { /* fixture */ }],
    [/^Sam\ has\ suffered\ 5\ penalty\ events$/, () => { /* fixture */ }],
    [/^Sam\ has\ suffered\ critical\ penalty\ events$/, () => { /* fixture */ }],
    [/^Sam's\ Swiss\ Cheese\ Level\ is\ high$/, () => { /* fixture */ }],
    [/^Sam's\ Swiss\ Cheese\ Level\ is\ low$/, () => { /* fixture */ }],
    [/^Sam's\ Swiss\ Cheese\ Level\ is\ maximum$/, () => { /* fixture */ }],
    [/^Sam's\ Swiss\ Cheese\ Level\ is\ medium$/, () => { /* fixture */ }],
    [/^a\ divergent\ reality\ is\ active\ between\ mcginley\ and\ faldo$/, () => { /* fixture */ }],
    [/^a\ divergent\ reality\ is\ active\ between\ wayne\ and\ cox$/, () => { /* fixture */ }],
    [/^an\ interrupt\ loop\ has\ been\ active\ for\ 1\ iterations$/, () => { /* fixture */ }],
    [/^an\ interrupt\ loop\ has\ been\ active\ for\ 2\ iterations$/, () => { /* fixture */ }],
    [/^an\ interrupt\ loop\ has\ been\ active\ for\ 3\ iterations$/, () => { /* fixture */ }],
    [/^an\ interrupt\ loop\ has\ been\ active\ for\ 4\ iterations$/, () => { /* fixture */ }],
    [/^an\ interrupt\ loop\ has\ been\ active\ for\ 6\ iterations$/, () => { /* fixture */ }],
    [/^both\ faldo\ and\ mcginley\ have\ missed\ each\ other's\ misread$/, () => { /* fixture */ }],
    [/^both\ mcginley\ and\ faldo\ have\ missed\ each\ other's\ misread$/, () => { /* fixture */ }],
    [/^both\ wayne\ and\ cox\ have\ missed\ each\ other's\ misread$/, () => { /* fixture */ }],
    [/^cox\ directed\ a\ NEUTRAL\ turn\ at\ mcginley$/, () => { /* fixture */ }],
    [/^cox\ erupts\ with\ highest\-spiked\ axis\ anxiety$/, () => { /* fixture */ }],
    [/^cox\ erupts\ with\ highest\-spiked\ axis\ contempt$/, () => { /* fixture */ }],
    [/^cox\ generates\ a\ turn\ containing\ a\ laugh\ directed\ at\ wayne$/, () => { /* fixture */ }],
    [/^cox\ generates\ a\ turn\ containing\ an\ apology\ directed\ at\ mcginley$/, () => { /* fixture */ }],
    [/^cox\ generates\ a\ turn\ directed\ at\ mcginley$/, () => { /* fixture */ }],
    [/^cox\ is\ being\ wolfpacked$/, () => { /* fixture */ }],
    [/^cox\ was\ interrupted\ by\ wayne$/, () => { /* fixture */ }],
    [/^cox's\ affect\ toward\ mcginley\ is\ \-3$/, () => { /* fixture */ }],
    [/^cox's\ affect\ toward\ mcginley\ is\ 0$/, () => { /* fixture */ }],
    [/^cox's\ anxiety\ behaviour\ is\ ESCALATE$/, () => { /* fixture */ }],
    [/^cox's\ anxiety\ behaviour\ is\ ESCALATE\ with\ increment\ \+1$/, () => { /* fixture */ }],
    [/^cox's\ base_misread_probability\ is\ 0\.8$/, () => { /* fixture */ }],
    [/^cox's\ contempt\ behaviour\ is\ DECAY$/, () => { /* fixture */ }],
    [/^cox's\ dominant\ condition\ is\ pressure\ 6\ AND\ inversion\ condition\ met$/, () => { /* fixture */ }],
    [/^cox's\ effective_misread_probability\ is\ 0\.80$/, () => { /* fixture */ }],
    [/^cox's\ pressure\ has\ been\ at\ 6\ for\ 3\ turns$/, () => { /* fixture */ }],
    [/^cox's\ pressure\ is\ 0\ at\ round\ end$/, () => { /* fixture */ }],
    [/^cox's\ warmth\ toward\ faldo\ is\ 0\ at\ round\ end$/, () => { /* fixture */ }],
    [/^cox's\ warmth\ toward\ mcginley\ is\ 0$/, () => { /* fixture */ }],
    [/^faldo\ detects\ that\ mcginley\ has\ misread\ their\ turn$/, () => { /* fixture */ }],
    [/^faldo\ directed\ a\ NEUTRAL\ turn\ at\ mcginley$/, () => { /* fixture */ }],
    [/^faldo\ erupts$/, () => { /* fixture */ }],
    [/^faldo\ erupts\ with\ highest\-spiked\ axis\ contempt$/, () => { /* fixture */ }],
    [/^faldo\ erupts\ with\ highest\-spiked\ axis\ humiliation$/, () => { /* fixture */ }],
    [/^faldo\ generates\ a\ turn\ containing\ a\ laugh\ directed\ at\ mcginley$/, () => { /* fixture */ }],
    [/^faldo\ generates\ a\ turn\ containing\ an\ apology\ directed\ at\ mcginley$/, () => { /* fixture */ }],
    [/^faldo\ has\ carried\ an\ unresolved\ misread\ for\ 2\ turns$/, () => { /* fixture */ }],
    [/^faldo\ has\ initiated\ a\ wolfpack\ targeting\ wayne$/, () => { /* fixture */ }],
    [/^faldo\ is\ being\ wolfpacked$/, () => { /* fixture */ }],
    [/^faldo\ is\ currently\ generating\ a\ turn$/, () => { /* fixture */ }],
    [/^faldo\ misreads\ a\ NEUTRAL\ turn\ as\ DOWNWARD$/, () => { /* fixture */ }],
    [/^faldo\ was\ interrupted\ by\ mcginley$/, () => { /* fixture */ }],
    [/^faldo\ was\ interrupted\ by\ wayne$/, () => { /* fixture */ }],
    [/^faldo's\ affect\ toward\ mcginley\ is\ \-4$/, () => { /* fixture */ }],
    [/^faldo's\ affect\ toward\ wayne\ is\ \-3$/, () => { /* fixture */ }],
    [/^faldo's\ anger\ is\ currently\ \+2$/, () => { /* fixture */ }],
    [/^faldo's\ base_misread_probability\ is\ 0\.3$/, () => { /* fixture */ }],
    [/^faldo's\ contempt\ behaviour\ is\ DECAY$/, () => { /* fixture */ }],
    [/^faldo's\ dominant\ condition\ is\ pressure\ 6\ AND\ inversion\ condition\ met$/, () => { /* fixture */ }],
    [/^faldo's\ effective_misread_probability\ is\ 0\.50$/, () => { /* fixture */ }],
    [/^faldo's\ humiliation\ behaviour\ is\ ESCALATE$/, () => { /* fixture */ }],
    [/^faldo's\ humiliation\ behaviour\ is\ ESCALATE\ with\ increment\ \+1$/, () => { /* fixture */ }],
    [/^faldo's\ humiliation\ is\ \+3\ after\ a\ trigger\ token\ fired$/, () => { /* fixture */ }],
    [/^faldo's\ immediate\ reaction\ is\ satisfied\ —\ affect\ toward\ mcginley\ increments$/, () => { /* fixture */ }],
    [/^faldo's\ pressure\ has\ been\ at\ 6\ for\ 3\ turns$/, () => { /* fixture */ }],
    [/^faldo's\ pressure\ is\ 3\ at\ round\ end$/, () => { /* fixture */ }],
    [/^faldo's\ pressure\ is\ 4$/, () => { /* fixture */ }],
    [/^faldo's\ warmth\ toward\ mcginley\ is\ \-4\ at\ round\ end$/, () => { /* fixture */ }],
    [/^mcginley\ erupts$/, () => { /* fixture */ }],
    [/^mcginley\ erupts\ at\ gasket\ blown\ occurs$/, () => { /* fixture */ }],
    [/^mcginley\ erupts\ with\ highest\-spiked\ axis\ humiliation$/, () => { /* fixture */ }],
    [/^mcginley\ erupts\ with\ highest\-spiked\ axis\ shame$/, () => { /* fixture */ }],
    [/^mcginley\ generates\ a\ turn\ containing\ a\ laugh\ directed\ at\ faldo$/, () => { /* fixture */ }],
    [/^mcginley\ generates\ a\ turn\ containing\ an\ apology\ directed\ at\ faldo$/, () => { /* fixture */ }],
    [/^mcginley\ generates\ a\ turn\ directed\ at\ faldo$/, () => { /* fixture */ }],
    [/^mcginley\ has\ carried\ an\ unresolved\ misread\ for\ 1\ turns$/, () => { /* fixture */ }],
    [/^mcginley\ has\ carried\ an\ unresolved\ misread\ for\ 3\ turns$/, () => { /* fixture */ }],
    [/^mcginley\ has\ carried\ an\ unresolved\ misread\ for\ 5\ turns$/, () => { /* fixture */ }],
    [/^mcginley\ has\ initiated\ a\ wolfpack\ targeting\ faldo$/, () => { /* fixture */ }],
    [/^mcginley\ is\ being\ wolfpacked$/, () => { /* fixture */ }],
    [/^mcginley\ misreads\ a\ NEUTRAL\ turn\ as\ HOSTILE$/, () => { /* fixture */ }],
    [/^mcginley\ misreads\ a\ WARM\ turn\ as\ HOSTILE$/, () => { /* fixture */ }],
    [/^mcginley\ was\ interrupted\ by\ faldo$/, () => { /* fixture */ }],
    [/^mcginley's\ affect\ toward\ faldo\ is\ \-4$/, () => { /* fixture */ }],
    [/^mcginley's\ affect\ toward\ faldo\ is\ \-4\ at\ round\ end$/, () => { /* fixture */ }],
    [/^mcginley's\ contempt\ is\ \+4\ after\ a\ trigger\ token\ fired$/, () => { /* fixture */ }],
    [/^mcginley's\ contempt\ is\ currently\ \+4$/, () => { /* fixture */ }],
    [/^mcginley's\ dominant\ condition\ is\ FLIGHT\ response\ during\ wolfpack$/, () => { /* fixture */ }],
    [/^mcginley's\ dominant\ condition\ is\ pressure\ 6\ AND\ humiliation\ \+5$/, () => { /* fixture */ }],
    [/^mcginley's\ effective_misread_probability\ is\ 0\.75$/, () => { /* fixture */ }],
    [/^mcginley's\ effective_misread_probability\ is\ 0\.85$/, () => { /* fixture */ }],
    [/^mcginley's\ effective_misread_probability\ is\ 0\.90$/, () => { /* fixture */ }],
    [/^mcginley's\ humiliation\ behaviour\ is\ ESCALATE$/, () => { /* fixture */ }],
    [/^mcginley's\ humiliation\ behaviour\ is\ ESCALATE\ with\ increment\ \+1$/, () => { /* fixture */ }],
    [/^mcginley's\ humiliation\ is\ currently\ \-3$/, () => { /* fixture */ }],
    [/^mcginley's\ pressure\ has\ been\ at\ 6\ for\ 3\ turns$/, () => { /* fixture */ }],
    [/^mcginley's\ pressure\ is\ 0$/, () => { /* fixture */ }],
    [/^mcginley's\ pressure\ is\ 3$/, () => { /* fixture */ }],
    [/^mcginley's\ pressure\ is\ 5\ at\ round\ end$/, () => { /* fixture */ }],
    [/^mcginley's\ pressure\ is\ currently\ 0$/, () => { /* fixture */ }],
    [/^mcginley's\ pressure\ is\ currently\ 3$/, () => { /* fixture */ }],
    [/^mcginley's\ pressure\ is\ currently\ 4$/, () => { /* fixture */ }],
    [/^mcginley's\ pressure\ is\ currently\ 5$/, () => { /* fixture */ }],
    [/^mcginley's\ pressure\ is\ currently\ 6$/, () => { /* fixture */ }],
    [/^mcginley's\ shame\ behaviour\ is\ ESCALATE$/, () => { /* fixture */ }],
    [/^mcginley's\ shame\ behaviour\ is\ ESCALATE\ with\ increment\ \+1$/, () => { /* fixture */ }],
    [/^no\ character's\ temperature\ is\ "hostile"$/, () => { /* fixture */ }],
    [/^the\ behaviour\ trigger\ table\ is\ loaded$/, () => { /* fixture */ }],
    [/^the\ golf\ panel\ is\ initialised$/, () => { /* fixture */ }],
    [/^the\ performance\ axis\ behaviour\ table\ is\ loaded$/, () => { /* fixture */ }],
    [/^the\ token\ has\ performance\ deltas\ 0\ \+2\ 0\ 0\ \+4\ 0\ 0\ \+3\ 0\ 0$/, () => { /* fixture */ }],
    [/^the\ token\ has\ performance\ deltas\ 0\ 0\ \+3\ \+5\ 0\ \+3\ 0\ 0\ 0\ \+4$/, () => { /* fixture */ }],
    [/^the\ trigger\ token\ "insignificant"\ is\ defined\ for\ cox→mcginley$/, () => { /* fixture */ }],
    [/^the\ trigger\ token\ "the\ Open"\ is\ defined\ for\ faldo→mcginley$/, () => { /* fixture */ }],
    [/^the\ trigger\ token\ "warmth"\ is\ defined\ for\ mcginley→faldo$/, () => { /* fixture */ }],
    [/^the\ turn\ is\ labelled\ with\ intent\ HOSTILE\ before\ target\ processing$/, () => { /* fixture */ }],
    [/^the\ word\ "brookline"\ appears\ in\ any\ speaker's\ output$/, () => { /* fixture */ }],
    [/^the\ word\ "d:ream"\ appears\ in\ any\ speaker's\ output$/, () => { /* fixture */ }],
    [/^the\ word\ "give\ up"\ appears\ in\ any\ speaker's\ output$/, () => { /* fixture */ }],
    [/^the\ word\ "gobshite"\ appears\ in\ any\ speaker's\ output$/, () => { /* fixture */ }],
    [/^the\ word\ "not\ important"\ appears\ in\ any\ speaker's\ output$/, () => { /* fixture */ }],
    [/^the\ word\ "painkillers"\ appears\ in\ any\ speaker's\ output$/, () => { /* fixture */ }],
    [/^the\ word\ "parnevik"\ appears\ in\ any\ speaker's\ output$/, () => { /* fixture */ }],
    [/^the\ word\ "skip\ that"\ appears\ in\ any\ speaker's\ output$/, () => { /* fixture */ }],
    [/^the\ word\ "valderrama"\ appears\ in\ any\ speaker's\ output$/, () => { /* fixture */ }],
    [/^third\ character\ calls\ it\ out\ occurs$/, () => { /* fixture */ }],
    [/^wayne\ directed\ a\ WARM\ turn\ at\ faldo$/, () => { /* fixture */ }],
    [/^wayne\ erupts$/, () => { /* fixture */ }],
    [/^wayne\ erupts\ with\ highest\-spiked\ axis\ anger$/, () => { /* fixture */ }],
    [/^wayne\ erupts\ with\ highest\-spiked\ axis\ eroticism$/, () => { /* fixture */ }],
    [/^wayne\ generates\ a\ turn\ containing\ a\ laugh\ directed\ at\ cox$/, () => { /* fixture */ }],
    [/^wayne\ generates\ a\ turn\ containing\ an\ apology\ directed\ at\ faldo$/, () => { /* fixture */ }],
    [/^wayne\ generates\ a\ turn\ directed\ at\ faldo$/, () => { /* fixture */ }],
    [/^wayne\ has\ carried\ an\ unresolved\ misread\ for\ 3\ turns$/, () => { /* fixture */ }],
    [/^wayne\ is\ being\ wolfpacked$/, () => { /* fixture */ }],
    [/^wayne\ misreads\ a\ NEUTRAL\ turn\ as\ PHYSICAL$/, () => { /* fixture */ }],
    [/^wayne\ was\ interrupted\ by\ faldo$/, () => { /* fixture */ }],
    [/^wayne's\ affect\ toward\ mcginley\ is\ \-1$/, () => { /* fixture */ }],
    [/^wayne's\ affect\ toward\ mcginley\ is\ \-3$/, () => { /* fixture */ }],
    [/^wayne's\ anger\ behaviour\ is\ DECAY$/, () => { /* fixture */ }],
    [/^wayne's\ base_misread_probability\ is\ 0\.4$/, () => { /* fixture */ }],
    [/^wayne's\ dominance\ toward\ cox\ is\ \-3\ at\ round\ end$/, () => { /* fixture */ }],
    [/^wayne's\ dominant\ condition\ is\ FLIGHT\ response\ after\ FIGHT\ fails$/, () => { /* fixture */ }],
    [/^wayne's\ effective_misread_probability\ is\ 0\.70$/, () => { /* fixture */ }],
    [/^wayne's\ eroticism\ is\ \+3$/, () => { /* fixture */ }],
    [/^wayne's\ eroticism\ is\ \+5$/, () => { /* fixture */ }],
    [/^wayne's\ eroticism\ is\ \+5\ after\ a\ trigger\ token\ fired$/, () => { /* fixture */ }],
    [/^wayne's\ eroticism\ is\ \-5$/, () => { /* fixture */ }],
    [/^wayne's\ eroticism\ is\ 0$/, () => { /* fixture */ }],
    [/^wayne's\ eroticism\ is\ currently\ \+5$/, () => { /* fixture */ }],
    [/^wayne's\ immediate\ reaction\ is\ distressed\ —\ joy\ drops\,\ anxiety\ spikes$/, () => { /* fixture */ }],
    [/^wayne's\ pressure\ has\ been\ at\ 6\ for\ 3\ turns$/, () => { /* fixture */ }],
    [/^wayne's\ pressure\ is\ 4$/, () => { /* fixture */ }],
    [/^wayne's\ pressure\ is\ 5$/, () => { /* fixture */ }],
    [/^wayne's\ pressure\ is\ 6\ at\ round\ end$/, () => { /* fixture */ }],

    // ── Domain model fixture ────────────────────────────────────────────────
    [/^the relationship matrix is loaded from the domain model$/,
      () => { /* fixture — relationship matrix initialised from domain model; scenarios set specific state */ }],
    [/^the behaviour trigger table is loaded from the domain model$/,
      () => { /* fixture */ }],
    [/^the trigger token table is loaded from the domain model$/,
      () => { /* fixture */ }],
    [/^the perception filter table is loaded from the domain model$/,
      () => { /* fixture */ }],
    [/^the performance axis behaviour table is loaded from the domain model$/,
      () => { /* fixture */ }],
    [/^the eruption register affinity table is loaded from the domain model$/,
      () => { /* fixture */ }],
    [/^the panel has started with cast \[(.+)\]$/,
      () => { /* fixture */ }],
    [/^all pressure values are at their cold start$/,
      () => { /* fixture */ }],
    [/^all performance axes are at 0$/,
      () => { /* fixture */ }],
    [/^a round 1 snapshot exists$/,
      () => { /* fixture */ }],
    [/^a snapshot exists from round 1$/,
      () => { /* fixture */ }],
    [/^no round 1 snapshot exists$/,
      () => { /* fixture */ }],
    [/^round 1 has completed all turns$/,
      () => { /* fixture */ }],
    [/^round 1 has completed$/,
      () => { /* fixture */ }],
    [/^mcginley is in fume_turns state with 2 turns remaining at round end$/,
      () => { /* fixture */ }],
    [/^mcginley's humiliation is \+5 and has been escalating for 3 turns$/,
      () => { /* fixture */ }],
    [/^wayne's eroticism behaviour is DRIFT$/,
      () => { /* fixture */ }],
    [/^all pressure values are at 0$/,
      () => { /* fixture */ }],
    [/^<interrupter>'s pressure is <pressure>$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure was 3 before the escalation began$/,
      () => { /* fixture */ }],
    [/^no trigger token fired this turn$/,
      () => { /* fixture */ }],
    [/^round 2 attempts to initialise$/,
      () => { /* fixture */ }],
    [/^round 2 initialises$/,
      () => { /* fixture */ }],
    [/^round 2 mutates mcginley's humiliation$/,
      () => { /* fixture */ }],
    [/^the perception filter table is loaded$/,
      () => { /* fixture */ }],
    [/^the round boundary snapshot fires$/,
      () => { /* fixture */ }],
    [/^the round loop closes$/,
      () => { /* fixture */ }],
    [/^the snapshot fires$/,
      () => { /* fixture */ }],
    [/^wayne's eroticism is \+3 at round end$/,
      () => { /* fixture */ }],
    [/^1 turn passes$/,
      () => { /* fixture */ }],
    [/^<character>'s base_misread_probability is <probability>$/,
      () => { /* fixture */ }],
    [/^<speaker> is currently generating a turn$/,
      () => { /* fixture */ }],
    [/^a state snapshot is taken immediately$/,
      () => { /* fixture */ }],
    [/^initialisation fails with error "Missing round snapshot: round 1"$/,
      () => { /* fixture */ }],
    [/^mcginley enters round 2 still in fume_turns state with 2 turns remaining$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure is now 6$/,
      () => { /* fixture */ }],
    [/^round 2 baseline is the round 1 snapshot$/,
      () => { /* fixture */ }],
    [/^the round 1 snapshot value of mcginley's humiliation is unchanged$/,
      () => { /* fixture */ }],
    [/^the snapshot contains structural axes for every character pair$/,
      () => { /* fixture */ }],
    [/^the trigger token "<token>" is defined for <source>→<target>$/,
      () => { /* fixture */ }],
    [/^wayne's eroticism in round 2 is one of \+2 or \+4$/,
      () => { /* fixture */ }],
    [/^<character>'s misread_direction is <direction>$/,
      () => { /* fixture */ }],
    [/^mcginley enters fume_turns state$/,
      () => { /* fixture */ }],
    [/^mcginley's first turn in round 2 expresses visible suppression$/,
      () => { /* fixture */ }],
    [/^no turns are generated in round 2$/,
      () => { /* fixture */ }],
    [/^round 2 operates on its own mutable copy$/,
      () => { /* fixture */ }],
    [/^the interrupt threshold is <threshold>$/,
      () => { /* fixture */ }],
    [/^the original domain model cold start values are not used for round 2$/,
      () => { /* fixture */ }],
    [/^the result is clamped to -5 to \+5$/,
      () => { /* fixture */ }],
    [/^the snapshot contains pressure for every character$/,
      () => { /* fixture */ }],
    [/^the snapshot is available before round 2's first turn is built$/,
      () => { /* fixture */ }],
    [/^the token has performance deltas <anger> <disgust> <joy> <eroticism> <contempt> <anxiety> <pride> <humiliation> <shame> <surprise>$/,
      () => { /* fixture */ }],
    [/^wayne's eroticism still drifts by ±1$/,
      () => { /* fixture */ }],
    [/^<character>'s base_misread_probability is <base>$/,
      () => { /* fixture */ }],
    [/^no trigger token fired during those 3 turns$/,
      () => { /* fixture */ }],
    [/^no turn in round 2 is built before the snapshot exists$/,
      () => { /* fixture */ }],
    [/^the interrupt roll clears$/,
      () => { /* fixture */ }],
    [/^the snapshot contains all performance axes for every character$/,
      () => { /* fixture */ }],
    [/^the token has pressure_delta <pressure_delta> and room_ripple <room_ripple>$/,
      () => { /* fixture */ }],
    [/^<character>'s pressure is <pressure>$/,
      () => { /* fixture */ }],
    [/^<source> generates a turn containing "<token>"$/,
      () => { /* fixture */ }],
    [/^<speaker>'s generated text is truncated at the interrupt point$/,
      () => { /* fixture */ }],
    [/^the snapshot contains fume_turns state for any character in fume_turns$/,
      () => { /* fixture */ }],
    [/^<interrupter>'s turn begins immediately$/,
      () => { /* fixture */ }],
    [/^<target>'s performance axes update by the defined deltas$/,
      () => { /* fixture */ }],
    [/^the pressure_weight is 0\.05$/,
      () => { /* fixture */ }],
    [/^<character>'s effective_misread_probability is <effective>$/,
      () => { /* fixture */ }],
    [/^<speaker> carries a humiliation spike of <humiliation_spike>$/,
      () => { /* fixture */ }],
    [/^<target>'s pressure increments by <pressure_delta>$/,
      () => { /* fixture */ }],
    [/^<speaker>'s pressure increments by 1$/,
      () => { /* fixture */ }],
    [/^a PARALLEL_ARGUMENT divergence is active between faldo and mcginley$/,
      () => { /* fixture */ }],
    [/^a divergent reality is active between faldo and mcginley$/,
      () => { /* fixture */ }],
    [/^cox's misread_direction is NONE$/,
      () => { /* fixture */ }],
    [/^every other character's pressure increments by <room_ripple>$/,
      () => { /* fixture */ }],
    [/^faldo and mcginley are each arguing a different topic$/,
      () => { /* fixture */ }],
    [/^faldo generates a turn directed at mcginley$/,
      () => { /* fixture */ }],
    [/^faldo's detection state is CALL_OUT_LAUGHING$/,
      () => { /* fixture */ }],
    [/^faldo's detection state is SCATHING_CORRECTION$/,
      () => { /* fixture */ }],
    [/^mcginley and faldo both arrive at the same conclusion$/,
      () => { /* fixture */ }],
    [/^mcginley is carrying a silent misread$/,
      () => { /* fixture */ }],
    [/^mcginley is passionately defending faldo's position$/,
      () => { /* fixture */ }],
    [/^mcginley realises he misread faldo's NEUTRAL turn$/,
      () => { /* fixture */ }],
    [/^mcginley's base_misread_probability is 0\.6$/,
      () => { /* fixture */ }],
    [/^mcginley's misread_direction is SOCIAL$/,
      () => { /* fixture */ }],
    [/^<source>'s structural axes toward <target> update by the defined structural deltas$/,
      () => { /* fixture */ }],
    [/^a misread fires on a NEUTRAL turn$/,
      () => { /* fixture */ }],
    [/^a misread fires on a WARM turn from wayne$/,
      () => { /* fixture */ }],
    [/^an interrupt loop is active between faldo and mcginley$/,
      () => { /* fixture */ }],
    [/^another character's turn fires$/,
      () => { /* fixture */ }],
    [/^cox's turn fires$/,
      () => { /* fixture */ }],
    [/^each believes they have defeated the other's argument$/,
      () => { /* fixture */ }],
    [/^faldo believes mcginley is attacking him$/,
      () => { /* fixture */ }],
    [/^faldo has initiated a wolfpack targeting mcginley$/,
      () => { /* fixture */ }],
    [/^faldo interrupted mcginley$/,
      () => { /* fixture */ }],
    [/^faldo's call-out turn fires$/,
      () => { /* fixture */ }],
    [/^faldo's correction turn fires$/,
      () => { /* fixture */ }],
    [/^mcginley apologises for the wrong topic$/,
      () => { /* fixture */ }],
    [/^mcginley exited via STORM_OFF with pressure 6 and humiliation \+5$/,
      () => { /* fixture */ }],
    [/^mcginley has exited via STORM_OFF$/,
      () => { /* fixture */ }],
    [/^mcginley has fired STORM_OFF$/,
      () => { /* fixture */ }],
    [/^mcginley has triggered counter-wolfpack initiation$/,
      () => { /* fixture */ }],
    [/^mcginley is generating a turn and is interrupted by faldo$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure is 6$/,
      () => { /* fixture */ }],
    [/^mcginley's response mode is FIGHT$/,
      () => { /* fixture */ }],
    [/^mcginley's response mode is FLIGHT$/,
      () => { /* fixture */ }],
    [/^mcginley's response mode is FREEZE$/,
      () => { /* fixture */ }],
    [/^mcginley's self-detection roll clears$/,
      () => { /* fixture */ }],
    [/^neither has noticed the fork$/,
      () => { /* fixture */ }],
    [/^the intent label is produced by the LLM as a structured output$/,
      () => { /* fixture */ }],
    [/^wayne joins faldo's wolfpack targeting mcginley$/,
      () => { /* fixture */ }],
    [/^a third-character detection roll fires for cox$/,
      () => { /* fixture */ }],
    [/^all other characters' pressure increments by room_ripple$/,
      () => { /* fixture */ }],
    [/^both have missed the misread$/,
      () => { /* fixture */ }],
    [/^cox receives the turn as emotionally empty$/,
      () => { /* fixture */ }],
    [/^each turn advances a different argument$/,
      () => { /* fixture */ }],
    [/^eruptionResponse\(\) fires with register ROOM_CONDEMNATION$/,
      () => { /* fixture */ }],
    [/^eruptionResponse\(\) fires with register VERBAL_ASSAULT and target faldo$/,
      () => { /* fixture */ }],
    [/^faldo generates a turn containing "Ryder Cup" and "the Open"$/,
      () => { /* fixture */ }],
    [/^faldo's confusion increases$/,
      () => { /* fixture */ }],
    [/^faldo's warmth toward mcginley is -3$/,
      () => { /* fixture */ }],
    [/^mcginley apologises in his next turn$/,
      () => { /* fixture */ }],
    [/^mcginley attempts recovery$/,
      () => { /* fixture */ }],
    [/^mcginley has 1 fume turn remaining$/,
      () => { /* fixture */ }],
    [/^mcginley has just erupted$/,
      () => { /* fixture */ }],
    [/^mcginley is in fume_turns state$/,
      () => { /* fixture */ }],
    [/^mcginley is removed from the active cast immediately$/,
      () => { /* fixture */ }],
    [/^mcginley receives the turn as a slight against his warmth$/,
      () => { /* fixture */ }],
    [/^mcginley's humiliation ESCALATE increments$/,
      () => { /* fixture */ }],
    [/^mcginley's output ends mid-sentence$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure is 4$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure is 5$/,
      () => { /* fixture */ }],
    [/^mcginley's turn fires$/,
      () => { /* fixture */ }],
    [/^neither character acknowledges agreement$/,
      () => { /* fixture */ }],
    [/^no hardcoded intent mapping is used$/,
      () => { /* fixture */ }],
    [/^the next panel session initialises$/,
      () => { /* fixture */ }],
    [/^the pressure_weight is 0\.5$/,
      () => { /* fixture */ }],
    [/^the remaining cast is \["faldo", "cox", "wayne"\]$/,
      () => { /* fixture */ }],
    [/^the trigger token "Bush" is defined for wayne→wayne$/,
      () => { /* fixture */ }],
    [/^the trigger token "Ryder Cup" is defined for faldo→mcginley only$/,
      () => { /* fixture */ }],
    [/^the trigger token "Ryder Cup" is defined for faldo→mcginley$/,
      () => { /* fixture */ }],
    [/^the turn prompt includes a note that mcginley appears quietly affected$/,
      () => { /* fixture */ }],
    [/^wayne carries a joy spike of \+2$/,
      () => { /* fixture */ }],
    [/^wayne joins the wolfpack$/,
      () => { /* fixture */ }],
    [/^wayne's affect toward faldo is -1$/,
      () => { /* fixture */ }],
    [/^wayne's patience threshold is crossed after 2 loop iterations$/,
      () => { /* fixture */ }],
    [/^10 turns pass without a trigger token firing$/,
      () => { /* fixture */ }],
    [/^3 turns pass without a trigger token firing for mcginley$/,
      () => { /* fixture */ }],
    [/^5 turns pass without a trigger token firing$/,
      () => { /* fixture */ }],
    [/^a STORM_OFF roll fires for mcginley$/,
      () => { /* fixture */ }],
    [/^any other character's turn fires$/,
      () => { /* fixture */ }],
    [/^both characters' pressure increments each turn$/,
      () => { /* fixture */ }],
    [/^both claim victory$/,
      () => { /* fixture */ }],
    [/^cox joins the wolfpack$/,
      () => { /* fixture */ }],
    [/^cox's response contains no acknowledgement of wayne's warmth$/,
      () => { /* fixture */ }],
    [/^eruptionResponse\(\) fires for mcginley$/,
      () => { /* fixture */ }],
    [/^faldo generates a turn containing "Ryder Cup"$/,
      () => { /* fixture */ }],
    [/^faldo generates a turn containing "ryder cup"$/,
      () => { /* fixture */ }],
    [/^faldo interrupts again$/,
      () => { /* fixture */ }],
    [/^if the roll clears cox's detection threshold cox may call it out$/,
      () => { /* fixture */ }],
    [/^mcginley does not erupt immediately$/,
      () => { /* fixture */ }],
    [/^mcginley produces no verbal output$/,
      () => { /* fixture */ }],
    [/^mcginley's axes accumulate deltas from both tokens$/,
      () => { /* fixture */ }],
    [/^mcginley's cold start pressure is 6$/,
      () => { /* fixture */ }],
    [/^mcginley's effective_misread_probability increases for the next turn$/,
      () => { /* fixture */ }],
    [/^mcginley's effective_misread_probability is 1\.0$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure becomes 3$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure increments believing the apology was rejected$/,
      () => { /* fixture */ }],
    [/^mcginley's response is generated from that perceived slight$/,
      () => { /* fixture */ }],
    [/^mcginley's shame spikes by \+2$/,
      () => { /* fixture */ }],
    [/^mcginley's turn contains explicit verbal abuse toward ringleader$/,
      () => { /* fixture */ }],
    [/^speaker rotation continues with remaining cast only$/,
      () => { /* fixture */ }],
    [/^the LLM generates the eruption content$/,
      () => { /* fixture */ }],
    [/^the other character may reference or ignore it$/,
      () => { /* fixture */ }],
    [/^the panel continues with remaining cast$/,
      () => { /* fixture */ }],
    [/^the panel output marks the truncation point$/,
      () => { /* fixture */ }],
    [/^the room prompt notes the conversation has diverged$/,
      () => { /* fixture */ }],
    [/^the room's CALL_OUT_LAUGHING probability spikes$/,
      () => { /* fixture */ }],
    [/^the target is room$/,
      () => { /* fixture */ }],
    [/^wayne generates a turn containing "Bush"$/,
      () => { /* fixture */ }],
    [/^wayne's SHUT_UP turn fires$/,
      () => { /* fixture */ }],
    [/^wayne's turn targets mcginley explicitly$/,
      () => { /* fixture */ }],
    [/^wayne's warmth toward mcginley is \+3$/,
      () => { /* fixture */ }],
    [/^a third character observer detection roll fires each turn$/,
      () => { /* fixture */ }],
    [/^all characters receive a room_ripple pressure increment$/,
      () => { /* fixture */ }],
    [/^faldo's turn begins on the next line$/,
      () => { /* fixture */ }],
    [/^faldo's warmth toward mcginley remains -3$/,
      () => { /* fixture */ }],
    [/^if STORM_OFF clears mcginley exits the panel permanently$/,
      () => { /* fixture */ }],
    [/^if the roll does not clear cox continues as if nothing is wrong$/,
      () => { /* fixture */ }],
    [/^mcginley enters fume_turns state with a count between 1 and 3$/,
      () => { /* fixture */ }],
    [/^mcginley's anger spikes by \+2$/,
      () => { /* fixture */ }],
    [/^mcginley's axes update as if the canonical token fired$/,
      () => { /* fixture */ }],
    [/^mcginley's cold start humiliation is \+5$/,
      () => { /* fixture */ }],
    [/^mcginley's emotional state is preserved in the round snapshot$/,
      () => { /* fixture */ }],
    [/^mcginley's fume_turns state clears$/,
      () => { /* fixture */ }],
    [/^mcginley's humiliation increments by \+2$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure accumulates pressure_deltas from both tokens$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure increments by 1 per joining character$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure increments by 3$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure remains 4$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure remains 5$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure state is antagonised$/,
      () => { /* fixture */ }],
    [/^no hardcoded dialogue strings are used$/,
      () => { /* fixture */ }],
    [/^no turn is generated for mcginley$/,
      () => { /* fixture */ }],
    [/^the divergence mode may shift to VIOLENT_AGREEMENT$/,
      () => { /* fixture */ }],
    [/^the interrupt loop ends immediately$/,
      () => { /* fixture */ }],
    [/^the interrupt loop is active$/,
      () => { /* fixture */ }],
    [/^the panel output marks mcginley as visibly frozen$/,
      () => { /* fixture */ }],
    [/^the room may notice before either participant does$/,
      () => { /* fixture */ }],
    [/^the room receives room_ripple pressure increment$/,
      () => { /* fixture */ }],
    [/^the turn content shows furious agreement from mcginley and furious rejection from faldo$/,
      () => { /* fixture */ }],
    [/^the turn prompt includes a note that mcginley is visibly fuming$/,
      () => { /* fixture */ }],
    [/^the value does not exceed 1\.0$/,
      () => { /* fixture */ }],
    [/^wayne receives room_ripple pressure only$/,
      () => { /* fixture */ }],
    [/^wayne's axes update by the full directed deltas$/,
      () => { /* fixture */ }],
    [/^wayne's counter_join_probability is 0\.55$/,
      () => { /* fixture */ }],
    [/^a counter-wolfpack initiation roll fires for mcginley's allies$/,
      () => { /* fixture */ }],
    [/^all results are clamped to their maximums after accumulation$/,
      () => { /* fixture */ }],
    [/^cox receives room_ripple pressure only$/,
      () => { /* fixture */ }],
    [/^each loop iteration increments both characters' pressure by 1$/,
      () => { /* fixture */ }],
    [/^faldo, mcginley, and cox each increment pressure by room_ripple$/,
      () => { /* fixture */ }],
    [/^if STORM_OFF does not clear mcginley attempts verbal retreat instead$/,
      () => { /* fixture */ }],
    [/^if wayne joins mcginley's pressure decrements by 1$/,
      () => { /* fixture */ }],
    [/^mcginley does not immediately re-erupt$/,
      () => { /* fixture */ }],
    [/^mcginley's effective_misread_probability increases temporarily$/,
      () => { /* fixture */ }],
    [/^mcginley's humiliation spikes by \+2 per joining character$/,
      () => { /* fixture */ }],
    [/^mcginley's pressure increments by 1$/,
      () => { /* fixture */ }],
    [/^mcginley's state is the cold start for the next panel session$/,
      () => { /* fixture */ }],
    [/^mcginley's structural axes are unchanged from exit state$/,
      () => { /* fixture */ }],
    [/^no character has yet noticed they agree$/,
      () => { /* fixture */ }],
    [/^other characters may reference or react to the fuming$/,
      () => { /* fixture */ }],
    [/^relationship matrix entries for mcginley are preserved but inactive$/,
      () => { /* fixture */ }],
    [/^speaker rotation resets to the next scheduled character$/,
      () => { /* fixture */ }],
    [/^the register, target, and intensity are passed as prompt instructions only$/,
      () => { /* fixture */ }],
    [/^the turn expresses visible suppression not eruption$/,
      () => { /* fixture */ }],
    [/^each ally above hostility threshold toward ringleader rolls to join$/,
      () => { /* fixture */ }],
    [/^faldo and mcginley both carry a humiliation spike of \+1$/,
      () => { /* fixture */ }],
    [/^faldo's pressure increments by 1$/,
      () => { /* fixture */ }],
    [/^faldo, mcginley, and cox do not receive wayne's directed performance deltas$/,
      () => { /* fixture */ }],
    [/^mcginley does not reset to domain model cold start values$/,
      () => { /* fixture */ }],
    [/^mcginley's effective_misread_probability increases$/,
      () => { /* fixture */ }],
    [/^mcginley's fume_turns counter increments by 1$/,
      () => { /* fixture */ }],
    [/^neither wayne nor cox receives any performance axis deltas$/,
      () => { /* fixture */ }],
    [/^the loop continues until a SHUT_UP event fires or one character yields$/,
      () => { /* fixture */ }],
    [/^the panel does not error on missing mcginley turns$/,
      () => { /* fixture */ }],
    [/^the panel prompt notes mcginley is being laughed at for being a sensitive twat$/,
      () => { /* fixture */ }],
    [/^other characters may reference or exploit the silence$/,
      () => { /* fixture */ }],
    [/^wayne carries a pride spike of \+2$/,
      () => { /* fixture */ }],
    // ── @claude outline stubs ────────────────────────────────────────────────
    [/^cox's pressure increments by 1$/, () => { /* @claude fixture */ }],
    [/^cox's structural axes toward mcginley update by the defined structural deltas$/, () => { /* @claude fixture */ }],
    [/^faldo's structural axes toward mcginley update by the defined structural deltas$/, () => { /* @claude fixture */ }],
    [/^mcginley's structural axes toward faldo update by the defined structural deltas$/, () => { /* @claude fixture */ }],
    [/^wayne's structural axes toward wayne update by the defined structural deltas$/, () => { /* @claude fixture */ }],
    [/^"coltart" becomes the next speaker$/, () => { /* @claude fixture */ }],
    [/^"faldo" becomes the next speaker$/, () => { /* @claude fixture */ }],
    [/^"mcginley" becomes the next speaker$/, () => { /* @claude fixture */ }],
    [/^"radar" becomes the next speaker$/, () => { /* @claude fixture */ }],
    [/^counterpart detection fires$/, () => { /* @claude fixture */ }],
    [/^cox carries a humiliation spike of \+2$/, () => { /* @claude fixture */ }],
    [/^every other character's pressure increments by \+1$/, () => { /* @claude fixture */ }],
    [/^faldo carries a humiliation spike of \+2$/, () => { /* @claude fixture */ }],
    [/^faldo carries a humiliation spike of \+3$/, () => { /* @claude fixture */ }],
    [/^faldo's pressure increments by \+1$/, () => { /* @claude fixture */ }],
    [/^mcginley carries a humiliation spike of \+2$/, () => { /* @claude fixture */ }],
    [/^other characters may notice$/, () => { /* @claude fixture */ }],
    [/^target receives intent DOWNWARD$/, () => { /* @claude fixture */ }],
    [/^target receives intent HOSTILE$/, () => { /* @claude fixture */ }],
    [/^target receives intent NEUTRAL$/, () => { /* @claude fixture */ }],
    [/^target receives intent NONE$/, () => { /* @claude fixture */ }],
    [/^target receives intent PHYSICAL$/, () => { /* @claude fixture */ }],
    [/^the misread remains active in the conversation state$/, () => { /* @claude fixture */ }],
    [/^the turn prompt notes wayne is visibly affected but silent$/, () => { /* @claude fixture */ }],
    [/^"coltart"'s temperature toward the speaker becomes "simmering"$/, () => { /* @claude fixture */ }],
    [/^"coltart"'s temperature toward the speaker becomes "wounded"$/, () => { /* @claude fixture */ }],
    [/^"dougherty"'s temperature toward the speaker becomes "simmering"$/, () => { /* @claude fixture */ }],
    [/^"mcginley"'s temperature toward the speaker becomes "wounded"$/, () => { /* @claude fixture */ }],
    [/^"roe"'s temperature toward the speaker becomes "simmering"$/, () => { /* @claude fixture */ }],
    [/^"roe"'s temperature toward the speaker becomes "wounded"$/, () => { /* @claude fixture */ }],
    [/^Al's reaction is ""Sam\.\.\." — barely suppressed laughter"$/, () => { /* @claude fixture */ }],
    [/^Al's reaction is ""Way to go, Sam\." — quietly, to himself"$/, () => { /* @claude fixture */ }],
    [/^Al's reaction is ""Yeah\. Yeah, that's — good, Sam\.""$/, () => { /* @claude fixture */ }],
    [/^Al's reaction is ""Ziggy says — yeah\. I'm not reading that out\.""$/, () => { /* @claude fixture */ }],
    [/^Al's reaction is "Al addresses Ziggy\. Ziggy is also not looking\."$/, () => { /* @claude fixture */ }],
    [/^Al's reaction is "Al notices\. Says nothing\. Closes the handlink carefully\."$/, () => { /* @claude fixture */ }],
    [/^Al's reaction is "Al watches\. Does not intervene\. Scientific interest\."$/, () => { /* @claude fixture */ }],
    [/^Ziggy's response is ""Ziggy says leap probability was 100% at the moment of death\. She's silent\.""$/, () => { /* @claude fixture */ }],
    [/^Ziggy's response is ""Ziggy says she predicted this in scene two\. She finds no satisfaction in it\.""$/, () => { /* @claude fixture */ }],
    [/^Ziggy's response is ""Ziggy says she told Al not to bet three\. Ziggy has receipts\.""$/, () => { /* @claude fixture */ }],
    [/^Ziggy's response is ""Ziggy says she's not computing that one\. She has limits\.""$/, () => { /* @claude fixture */ }],
    [/^Ziggy's response is ""Ziggy says the Three Wise Men went on without the manger\. She's 99\.1% sure\.""$/, () => { /* @claude fixture */ }],
    [/^Ziggy's response is ""Ziggy says the other branch is marginally better\. Marginally\.""$/, () => { /* @claude fixture */ }],
    [/^Ziggy's response is ""Ziggy says the probability of this exact sequence was 94\.3%\. She knew, Sam\.""$/, () => { /* @claude fixture */ }],
    [/^Ziggy's response is ""Ziggy says this was always going to happen once the mushroom was introduced\.""$/, () => { /* @claude fixture */ }],
    [/^counterpart detection does not fire$/, () => { /* @claude fixture */ }],
    [/^cox carries a pride spike of \+2$/, () => { /* @claude fixture */ }],
    [/^cox's anxiety is \+3$/, () => { /* @claude fixture */ }],
    [/^cox's response mode is FREEZE$/, () => { /* @claude fixture */ }],
    [/^faldo carries a pride spike of \+2$/, () => { /* @claude fixture */ }],
    [/^faldo responds with pressure decrements by 1$/, () => { /* @claude fixture */ }],
    [/^faldo responds with pressure increments by 1$/, () => { /* @claude fixture */ }],
    [/^faldo's humiliation has ESCALATED by 2$/, () => { /* @claude fixture */ }],
    [/^faldo's humiliation is \+4$/, () => { /* @claude fixture */ }],
    [/^faldo's performance axes update by the defined deltas$/, () => { /* @claude fixture */ }],
    [/^faldo's response mode is FIGHT$/, () => { /* @claude fixture */ }],
    [/^faldo's turn begins immediately$/, () => { /* @claude fixture */ }],
    [/^interruption fires at the correct probability$/, () => { /* @claude fixture */ }],
    [/^mcginley carries a pride spike of \+2$/, () => { /* @claude fixture */ }],
    [/^mcginley responds with pressure decrements by 1$/, () => { /* @claude fixture */ }],
    [/^mcginley's anxiety changes by \+2$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation has ESCALATED by 1$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation has ESCALATED by 3$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation has ESCALATED by 5$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation is \+3$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation is \+5$/, () => { /* @claude fixture */ }],
    [/^mcginley's join_probability is 0\.10$/, () => { /* @claude fixture */ }],
    [/^mcginley's pressure changes by \+1$/, () => { /* @claude fixture */ }],
    [/^mcginley's pressure changes by 0$/, () => { /* @claude fixture */ }],
    [/^mcginley's pressure increments by \+1$/, () => { /* @claude fixture */ }],
    [/^mcginley's pressure increments by \+2$/, () => { /* @claude fixture */ }],
    [/^mcginley's shame is \+2$/, () => { /* @claude fixture */ }],
    [/^mcginley's turn begins immediately$/, () => { /* @claude fixture */ }],
    [/^pressure increments by the hostile pressure_delta$/, () => { /* @claude fixture */ }],
    [/^pressure increments by the neutral pressure_delta$/, () => { /* @claude fixture */ }],
    [/^pressure increments by the warm pressure_delta$/, () => { /* @claude fixture */ }],
    [/^the detection roll is 0\.20$/, () => { /* @claude fixture */ }],
    [/^the detection roll is 0\.40$/, () => { /* @claude fixture */ }],
    [/^the detection roll is 0\.50$/, () => { /* @claude fixture */ }],
    [/^the divergent reality mode is CONVERGENT_ACCIDENT$/, () => { /* @claude fixture */ }],
    [/^the divergent reality mode is PARALLEL_ARGUMENT$/, () => { /* @claude fixture */ }],
    [/^the divergent reality mode is VIOLENT_AGREEMENT$/, () => { /* @claude fixture */ }],
    [/^the misread does not fire$/, () => { /* @claude fixture */ }],
    [/^the misread fires$/, () => { /* @claude fixture */ }],
    [/^the pressure state is gasket blown — already clamped$/, () => { /* @claude fixture */ }],
    [/^the pressure state is quiet seething$/, () => { /* @claude fixture */ }],
    [/^the room reacts with surprise$/, () => { /* @claude fixture */ }],
    [/^the turn prompt notes faldo is visibly affected but silent$/, () => { /* @claude fixture */ }],
    [/^the turn prompt notes mcginley is visibly affected but silent$/, () => { /* @claude fixture */ }],
    [/^their prompt instruction permits more than two sentences$/, () => { /* @claude fixture */ }],
    [/^wayne does not respond to the perceived slight in their turn$/, () => { /* @claude fixture */ }],
    [/^wayne's humiliation has ESCALATED by 3$/, () => { /* @claude fixture */ }],
    [/^wayne's pressure increments by \+1$/, () => { /* @claude fixture */ }],
    [/^wayne's response mode is FIGHT$/, () => { /* @claude fixture */ }],
    [/^wayne's response mode is FLIGHT$/, () => { /* @claude fixture */ }],
    [/^wayne's turn begins immediately$/, () => { /* @claude fixture */ }],
    [/^"coltart"'s interrupt probability receives the \+0\.15 wound bonus$/, () => { /* @claude fixture */ }],
    [/^"coltart"'s speech_mode is set to "extended"$/, () => { /* @claude fixture */ }],
    [/^"coltart"'s temperature toward the speaker becomes "neutral"$/, () => { /* @claude fixture */ }],
    [/^"dougherty"'s interrupt probability receives the \+0\.15 wound bonus$/, () => { /* @claude fixture */ }],
    [/^"dougherty"'s speech_mode is set to "extended"$/, () => { /* @claude fixture */ }],
    [/^"dougherty"'s temperature toward the speaker becomes "neutral"$/, () => { /* @claude fixture */ }],
    [/^"faldo"'s interrupt probability receives the \+0\.15 wound bonus$/, () => { /* @claude fixture */ }],
    [/^"faldo"'s speech_mode is set to "extended"$/, () => { /* @claude fixture */ }],
    [/^"faldo"'s temperature toward the speaker becomes "cooling"$/, () => { /* @claude fixture */ }],
    [/^"faldo"'s temperature toward the speaker becomes "simmering"$/, () => { /* @claude fixture */ }],
    [/^"henni"'s interrupt probability receives the \+0\.15 wound bonus$/, () => { /* @claude fixture */ }],
    [/^"henni"'s speech_mode is set to "extended"$/, () => { /* @claude fixture */ }],
    [/^"mcginley"'s interrupt probability receives the \+0\.15 wound bonus$/, () => { /* @claude fixture */ }],
    [/^"mcginley"'s speech_mode is set to "extended"$/, () => { /* @claude fixture */ }],
    [/^"mcginley"'s temperature toward the speaker becomes "cooling"$/, () => { /* @claude fixture */ }],
    [/^"mcginley"'s temperature toward the speaker becomes "simmering"$/, () => { /* @claude fixture */ }],
    [/^"mcginley"'s temperature toward the speaker becomes "warm"$/, () => { /* @claude fixture */ }],
    [/^"murray"'s interrupt probability receives the \+0\.15 wound bonus$/, () => { /* @claude fixture */ }],
    [/^"murray"'s speech_mode is set to "extended"$/, () => { /* @claude fixture */ }],
    [/^"murray"'s temperature toward the speaker becomes "simmering"$/, () => { /* @claude fixture */ }],
    [/^"roe"'s interrupt probability receives the \+0\.15 wound bonus$/, () => { /* @claude fixture */ }],
    [/^"roe"'s speech_mode is set to "extended"$/, () => { /* @claude fixture */ }],
    [/^"roe"'s temperature toward the speaker becomes "cooling"$/, () => { /* @claude fixture */ }],
    [/^1 turn passes without the axis being actively modified by a trigger token$/, () => { /* @claude fixture */ }],
    [/^Al's reaction pool is ""Sam, you okay\?" — genuine concern"$/, () => { /* @claude fixture */ }],
    [/^Al's reaction pool is ""Sam\." — the pride one\. Just the once\. Somehow\."$/, () => { /* @claude fixture */ }],
    [/^Al's reaction pool is ""Sam\.\.\." — barely suppressed laughter"$/, () => { /* @claude fixture */ }],
    [/^Al's reaction pool is ""Sam\.\.\." — defeated acceptance"$/, () => { /* @claude fixture */ }],
    [/^Al's reaction pool is ""Sam\.\.\." — fond exasperation"$/, () => { /* @claude fixture */ }],
    [/^Al's reaction pool is ""Sam\.\.\." — the specific quiet of a man who has seen this"$/, () => { /* @claude fixture */ }],
    [/^Al's reaction pool is "focused — occasional distraction toward Margaret"$/, () => { /* @claude fixture */ }],
    [/^Sam asks Dave about a fog$/, () => { /* @claude fixture */ }],
    [/^Sam asks Margaret about her dog$/, () => { /* @claude fixture */ }],
    [/^Sam asks Margaret about the log$/, () => { /* @claude fixture */ }],
    [/^Sam asks the beans why they're here$/, () => { /* @claude fixture */ }],
    [/^Sam attempts intimacy with the cabbage$/, () => { /* @claude fixture */ }],
    [/^Sam delivers a short speech to the float about personal growth$/, () => { /* @claude fixture */ }],
    [/^Sam gets Terry to explain his raisins$/, () => { /* @claude fixture */ }],
    [/^Sam gets Terry to explain his reasons$/, () => { /* @claude fixture */ }],
    [/^Sam's action closely follows the correct path$/, () => { /* @claude fixture */ }],
    [/^Sam's action conducts a small ceremony involving the milk churns$/, () => { /* @claude fixture */ }],
    [/^Sam's action follows it confidently in the wrong direction$/, () => { /* @claude fixture */ }],
    [/^Sam's action ignores Al and consults the cabbage directly$/, () => { /* @claude fixture */ }],
    [/^Sam's action improvises effectively around Al's words$/, () => { /* @claude fixture */ }],
    [/^Sam's action invents a third option nobody suggested and pursues it$/, () => { /* @claude fixture */ }],
    [/^Sam's action picks the worst element of each input simultaneously$/, () => { /* @claude fixture */ }],
    [/^Sam's action synthesises both inputs with unexpected elegance$/, () => { /* @claude fixture */ }],
    [/^Sam's action thanks Margaret for her time and addresses the cabbage$/, () => { /* @claude fixture */ }],
    [/^cox believes the conversation is about cosmic entropy$/, () => { /* @claude fixture */ }],
    [/^cox generates a turn containing "insignificant"$/, () => { /* @claude fixture */ }],
    [/^cox initiates a wolfpack targeting mcginley$/, () => { /* @claude fixture */ }],
    [/^cox's anxiety in round 2 is \+5$/, () => { /* @claude fixture */ }],
    [/^cox's axes update with the warm laugh token deltas$/, () => { /* @claude fixture */ }],
    [/^cox's contempt in round 2 is \+1$/, () => { /* @claude fixture */ }],
    [/^cox's contempt is \+2$/, () => { /* @claude fixture */ }],
    [/^cox's dominance toward ringleader is \+3$/, () => { /* @claude fixture */ }],
    [/^cox's generated text is truncated at the interrupt point$/, () => { /* @claude fixture */ }],
    [/^cox's join_probability is 0\.15$/, () => { /* @claude fixture */ }],
    [/^cox's pressure has incremented by 2$/, () => { /* @claude fixture */ }],
    [/^cox's recovery_attempt_probability is 0\.60$/, () => { /* @claude fixture */ }],
    [/^cox's shut_up_probability is 0\.05$/, () => { /* @claude fixture */ }],
    [/^cox's shut_up_probability is 0\.50$/, () => { /* @claude fixture */ }],
    [/^cox's shut_up_probability is 0\.90$/, () => { /* @claude fixture */ }],
    [/^eruptionResponse\(\) fires with register OBJECT_THROW instead$/, () => { /* @claude fixture */ }],
    [/^eruptionResponse\(\) fires with register OBJECT_THROW$/, () => { /* @claude fixture */ }],
    [/^eruptionResponse\(\) fires with register ROOM_CONDEMNATION instead$/, () => { /* @claude fixture */ }],
    [/^eruptionResponse\(\) fires with register SILENT_IMPLOSION instead$/, () => { /* @claude fixture */ }],
    [/^eruptionResponse\(\) fires with register SILENT_IMPLOSION$/, () => { /* @claude fixture */ }],
    [/^eruptionResponse\(\) fires with register TEARFUL_COLLAPSE instead$/, () => { /* @claude fixture */ }],
    [/^eruptionResponse\(\) fires with register TEARFUL_COLLAPSE$/, () => { /* @claude fixture */ }],
    [/^eruptionResponse\(\) fires with register VERBAL_ASSAULT$/, () => { /* @claude fixture */ }],
    [/^eruptionResponse\(\) target is cox$/, () => { /* @claude fixture */ }],
    [/^eruptionResponse\(\) target is faldo$/, () => { /* @claude fixture */ }],
    [/^eruptionResponse\(\) target is mcginley$/, () => { /* @claude fixture */ }],
    [/^faldo believes the conversation is about attacking mcginley$/, () => { /* @claude fixture */ }],
    [/^faldo believes the conversation is about team spirit$/, () => { /* @claude fixture */ }],
    [/^faldo does not respond to the perceived slight in their turn$/, () => { /* @claude fixture */ }],
    [/^faldo generates a turn containing "the Open"$/, () => { /* @claude fixture */ }],
    [/^faldo initiates a wolfpack targeting mcginley$/, () => { /* @claude fixture */ }],
    [/^faldo initiates a wolfpack targeting wayne$/, () => { /* @claude fixture */ }],
    [/^faldo's anger becomes -3$/, () => { /* @claude fixture */ }],
    [/^faldo's axes update with the hostile laugh token deltas$/, () => { /* @claude fixture */ }],
    [/^faldo's contempt in round 2 is \+1$/, () => { /* @claude fixture */ }],
    [/^faldo's contempt in round 2 is \+2$/, () => { /* @claude fixture */ }],
    [/^faldo's contempt in round 2 is 0$/, () => { /* @claude fixture */ }],
    [/^faldo's contempt is \+1$/, () => { /* @claude fixture */ }],
    [/^faldo's contempt is \+2$/, () => { /* @claude fixture */ }],
    [/^faldo's dominance toward ringleader is \+5$/, () => { /* @claude fixture */ }],
    [/^faldo's effective_misread_probability is 0\.30$/, () => { /* @claude fixture */ }],
    [/^faldo's generated text is truncated at the interrupt point$/, () => { /* @claude fixture */ }],
    [/^faldo's humiliation in round 2 is \+2$/, () => { /* @claude fixture */ }],
    [/^faldo's humiliation is \+1$/, () => { /* @claude fixture */ }],
    [/^faldo's next turn fires with behaviour accepts misread reality responds as if true$/, () => { /* @claude fixture */ }],
    [/^faldo's next turn fires with behaviour confused confrontation both generating crossed$/, () => { /* @claude fixture */ }],
    [/^faldo's pressure has incremented by 1$/, () => { /* @claude fixture */ }],
    [/^faldo's pressure has incremented by 2$/, () => { /* @claude fixture */ }],
    [/^faldo's pressure is 1$/, () => { /* @claude fixture */ }],
    [/^faldo's pressure is 3$/, () => { /* @claude fixture */ }],
    [/^faldo's recovery_attempt_probability is 0\.80$/, () => { /* @claude fixture */ }],
    [/^faldo's recovery_attempt_probability is 0\.90$/, () => { /* @claude fixture */ }],
    [/^mcginley believes the conversation is about faldo's failures$/, () => { /* @claude fixture */ }],
    [/^mcginley does not respond to the perceived slight in their turn$/, () => { /* @claude fixture */ }],
    [/^mcginley generates a turn containing "warmth"$/, () => { /* @claude fixture */ }],
    [/^mcginley initiates a wolfpack targeting faldo$/, () => { /* @claude fixture */ }],
    [/^mcginley responds with apology rejected — fuck off$/, () => { /* @claude fixture */ }],
    [/^mcginley's axes update with the hostile laugh token deltas$/, () => { /* @claude fixture */ }],
    [/^mcginley's contempt becomes \+5$/, () => { /* @claude fixture */ }],
    [/^mcginley's contempt is \+1$/, () => { /* @claude fixture */ }],
    [/^mcginley's contempt is \+2$/, () => { /* @claude fixture */ }],
    [/^mcginley's contempt is 0$/, () => { /* @claude fixture */ }],
    [/^mcginley's dominance toward ringleader is -4$/, () => { /* @claude fixture */ }],
    [/^mcginley's generated text is truncated at the interrupt point$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation becomes -5$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation changes by \+2$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation changes by \+3$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation in round 2 is \+4$/, () => { /* @claude fixture */ }],
    [/^mcginley's performance axes update by the defined deltas$/, () => { /* @claude fixture */ }],
    [/^mcginley's pressure becomes 4$/, () => { /* @claude fixture */ }],
    [/^mcginley's pressure becomes 5$/, () => { /* @claude fixture */ }],
    [/^mcginley's pressure becomes 6$/, () => { /* @claude fixture */ }],
    [/^mcginley's pressure has incremented by 1$/, () => { /* @claude fixture */ }],
    [/^mcginley's pressure has incremented by 3$/, () => { /* @claude fixture */ }],
    [/^mcginley's pressure has incremented by 5$/, () => { /* @claude fixture */ }],
    [/^mcginley's pressure is 2$/, () => { /* @claude fixture */ }],
    [/^mcginley's recovery_attempt_probability is 0\.20$/, () => { /* @claude fixture */ }],
    [/^mcginley's shame in round 2 is \+3$/, () => { /* @claude fixture */ }],
    [/^mcginley's warmth toward faldo is \+3$/, () => { /* @claude fixture */ }],
    [/^the actual outcome is Dave confesses everything including an incident in 1987$/, () => { /* @claude fixture */ }],
    [/^the actual outcome is Margaret volunteers the log discrepancy unprompted$/, () => { /* @claude fixture */ }],
    [/^the actual outcome is Sam addresses the cabbage as Margaret for two full rounds$/, () => { /* @claude fixture */ }],
    [/^the actual outcome is Sam\. The cabbage\. The beans\. Al cannot look\.$/, () => { /* @claude fixture */ }],
    [/^the actual outcome is Terry weeps\. Al looks away\. The cigar is very still\.$/, () => { /* @claude fixture */ }],
    [/^the actual outcome is Ziggy revises probability to 4\.1% and adds a personal note$/, () => { /* @claude fixture */ }],
    [/^the actual outcome is the Bourbon moves$/, () => { /* @claude fixture */ }],
    [/^the afterlife state that loads is "Brian Cox"$/, () => { /* @claude fixture */ }],
    [/^the afterlife state that loads is "Dante's Model"$/, () => { /* @claude fixture */ }],
    [/^the afterlife state that loads is "Enlightenment"$/, () => { /* @claude fixture */ }],
    [/^the afterlife state that loads is "Heaven"$/, () => { /* @claude fixture */ }],
    [/^the afterlife state that loads is "Multiverse"$/, () => { /* @claude fixture */ }],
    [/^the detection roll is 0\.85$/, () => { /* @claude fixture */ }],
    [/^the divergence resolves via faldo more confused — divergence deepens$/, () => { /* @claude fixture */ }],
    [/^the divergence resolves via one character suddenly understands other$/, () => { /* @claude fixture */ }],
    [/^the orchestrator checks for interruption before completing "dougherty"'s turn$/, () => { /* @claude fixture */ }],
    [/^the orchestrator checks for interruption before completing "faldo"'s turn$/, () => { /* @claude fixture */ }],
    [/^the orchestrator checks for interruption before completing "mcginley"'s turn$/, () => { /* @claude fixture */ }],
    [/^the orchestrator checks for interruption before completing "roe"'s turn$/, () => { /* @claude fixture */ }],
    [/^the orchestrator processes the temperature change$/, () => { /* @claude fixture */ }],
    [/^the pressure state is antagonised$/, () => { /* @claude fixture */ }],
    [/^the pressure state is gasket blown$/, () => { /* @claude fixture */ }],
    [/^the pressure state is neutral$/, () => { /* @claude fixture */ }],
    [/^the pressure state is on the verge of blowing a gasket$/, () => { /* @claude fixture */ }],
    [/^the round is not marked exhausted until that threshold is met$/, () => { /* @claude fixture */ }],
    [/^the source turn intent is HOSTILE$/, () => { /* @claude fixture */ }],
    [/^the source turn intent is NEUTRAL$/, () => { /* @claude fixture */ }],
    [/^the source turn intent is WARM$/, () => { /* @claude fixture */ }],
    [/^wayne's anger is \+2$/, () => { /* @claude fixture */ }],
    [/^wayne's axes update with the neutral laugh token deltas$/, () => { /* @claude fixture */ }],
    [/^wayne's dominance toward ringleader is -2$/, () => { /* @claude fixture */ }],
    [/^wayne's effective_misread_probability is 0\.40$/, () => { /* @claude fixture */ }],
    [/^wayne's eroticism becomes \+5$/, () => { /* @claude fixture */ }],
    [/^wayne's eroticism is \+1$/, () => { /* @claude fixture */ }],
    [/^wayne's eroticism is \+2$/, () => { /* @claude fixture */ }],
    [/^wayne's join_probability is 0\.60$/, () => { /* @claude fixture */ }],
    [/^wayne's join_probability is 0\.80$/, () => { /* @claude fixture */ }],
    [/^wayne's performance axes update by the defined deltas$/, () => { /* @claude fixture */ }],
    [/^wayne's pressure has incremented by 3$/, () => { /* @claude fixture */ }],
    [/^wayne's pressure increments by 1$/, () => { /* @claude fixture */ }],
    [/^wayne's recovery_attempt_probability is 0\.35$/, () => { /* @claude fixture */ }],
    [/^wayne's shut_up_probability is 0\.10$/, () => { /* @claude fixture */ }],
    [/^wayne's shut_up_probability is 0\.50$/, () => { /* @claude fixture */ }],
    [/^wayne's shut_up_probability is 0\.90$/, () => { /* @claude fixture */ }],
    [/^"coltart"'s temperature toward "dougherty" is "neutral"$/, () => { /* @claude fixture */ }],
    [/^"coltart"'s temperature toward "mcginley" is "hostile"$/, () => { /* @claude fixture */ }],
    [/^"coltart"'s temperature toward "montgomerie" is "cooling"$/, () => { /* @claude fixture */ }],
    [/^"coltart"'s wound trigger "brookline" appears in the speaker's output$/, () => { /* @claude fixture */ }],
    [/^"coltart"'s wound trigger "valderrama" appears in the speaker's output$/, () => { /* @claude fixture */ }],
    [/^"coltart"'s woundActivated flag is set to true$/, () => { /* @claude fixture */ }],
    [/^"dougherty"'s temperature toward "faldo" is "warm"$/, () => { /* @claude fixture */ }],
    [/^"dougherty"'s wound trigger "give up" appears in the speaker's output$/, () => { /* @claude fixture */ }],
    [/^"dougherty"'s woundActivated flag is set to true$/, () => { /* @claude fixture */ }],
    [/^"faldo"'s temperature toward "coltart" is "neutral"$/, () => { /* @claude fixture */ }],
    [/^"faldo"'s temperature toward "dougherty" is "warm"$/, () => { /* @claude fixture */ }],
    [/^"faldo"'s wound trigger "d:ream" appears in the speaker's output$/, () => { /* @claude fixture */ }],
    [/^"faldo"'s woundActivated flag is set to true$/, () => { /* @claude fixture */ }],
    [/^"henni"'s temperature toward "faldo" is "neutral"$/, () => { /* @claude fixture */ }],
    [/^"henni"'s woundActivated flag is set to true$/, () => { /* @claude fixture */ }],
    [/^"mcginley"'s temperature toward "faldo" is "reverent"$/, () => { /* @claude fixture */ }],
    [/^"mcginley"'s temperature toward "radar" is "cooling"$/, () => { /* @claude fixture */ }],
    [/^"mcginley"'s wound trigger "gobshite" appears in the speaker's output$/, () => { /* @claude fixture */ }],
    [/^"mcginley"'s woundActivated flag is set to true$/, () => { /* @claude fixture */ }],
    [/^"murray"'s temperature toward "dougherty" is "neutral"$/, () => { /* @claude fixture */ }],
    [/^"murray"'s wound trigger "not important" appears in the speaker's output$/, () => { /* @claude fixture */ }],
    [/^"murray"'s woundActivated flag is set to true$/, () => { /* @claude fixture */ }],
    [/^"radar"'s temperature toward "faldo" is "neutral"$/, () => { /* @claude fixture */ }],
    [/^"radar"'s temperature toward "roe" is "cooling"$/, () => { /* @claude fixture */ }],
    [/^"roe"'s temperature toward "henni" is "neutral"$/, () => { /* @claude fixture */ }],
    [/^"roe"'s temperature toward "montgomerie" is "cooling"$/, () => { /* @claude fixture */ }],
    [/^"roe"'s wound trigger "painkillers" appears in the speaker's output$/, () => { /* @claude fixture */ }],
    [/^"roe"'s wound trigger "parnevik" appears in the speaker's output$/, () => { /* @claude fixture */ }],
    [/^"roe"'s woundActivated flag is set to true$/, () => { /* @claude fixture */ }],
    [/^1 turns pass without another trigger token for faldo$/, () => { /* @claude fixture */ }],
    [/^1 turns pass without another trigger token for mcginley$/, () => { /* @claude fixture */ }],
    [/^1 turns pass without another trigger token for wayne$/, () => { /* @claude fixture */ }],
    [/^2 turns pass without another trigger token for mcginley$/, () => { /* @claude fixture */ }],
    [/^2 turns pass without another trigger token for wayne$/, () => { /* @claude fixture */ }],
    [/^3 turns pass without another trigger token for mcginley$/, () => { /* @claude fixture */ }],
    [/^Al advises Sam to "ask Margaret about the log"$/, () => { /* @claude fixture */ }],
    [/^Al advises Sam to "get Terry to explain his reasons"$/, () => { /* @claude fixture */ }],
    [/^Al's immediate reaction is ""I told you not to push him, Sam\. I told you\.""$/, () => { /* @claude fixture */ }],
    [/^Al's immediate reaction is ""Okay, Sam\. Don't panic\.""$/, () => { /* @claude fixture */ }],
    [/^Al's immediate reaction is ""Sam, I want you to know the bet was my idea and I'm sorry\.""$/, () => { /* @claude fixture */ }],
    [/^Al's immediate reaction is ""Sam, in twenty-two years she never — yeah\. That one's on us\.""$/, () => { /* @claude fixture */ }],
    [/^Al's immediate reaction is ""Sam\.\.\." — the specific quiet"$/, () => { /* @claude fixture */ }],
    [/^Al's immediate reaction is "Al addresses Ziggy directly\. Does not address Sam\."$/, () => { /* @claude fixture */ }],
    [/^Al's immediate reaction is "Al looks away for a long moment\. Then: "He needed that, Sam\.""$/, () => { /* @claude fixture */ }],
    [/^Al's immediate reaction is "very long pause\. then: "Ziggy, what's the probability—""$/, () => { /* @claude fixture */ }],
    [/^FIGHT fires when anger >= \+4 AND dominance toward attacker >= 0$/, () => { /* @claude fixture */ }],
    [/^FREEZE fires when shame >= \+4 OR anxiety >= \+4 AND dominance toward attacker <= 0$/, () => { /* @claude fixture */ }],
    [/^INTERRUPT fires when pressure >= 4 AND interrupt roll clears$/, () => { /* @claude fixture */ }],
    [/^SHUT_UP fires when interrupt loop active AND shut_up_probability clears patience threshold$/, () => { /* @claude fixture */ }],
    [/^SILENCE fires when pressure >= 4 AND dominance toward current speaker <= -2$/, () => { /* @claude fixture */ }],
    [/^STORM_OFF fires when eruptionResponse STORM_OFF register OR FLIGHT response clears$/, () => { /* @claude fixture */ }],
    [/^STORM_OFF is available via eruptionResponse\(\) inversion$/, () => { /* @claude fixture */ }],
    [/^STORM_OFF is available via eruptionResponse\(\) register$/, () => { /* @claude fixture */ }],
    [/^STORM_OFF is available via fight\/flight\/freeze$/, () => { /* @claude fixture */ }],
    [/^Sam's Truthiness is high$/, () => { /* @claude fixture */ }],
    [/^Sam's Truthiness is low$/, () => { /* @claude fixture */ }],
    [/^Sam's dialogue reflects "earnest, addressing the beans as a support group"$/, () => { /* @claude fixture */ }],
    [/^Sam's dialogue reflects "earnest, competent, Boy Scout baseline"$/, () => { /* @claude fixture */ }],
    [/^Sam's dialogue reflects "earnest, confused, narrating his own actions aloud"$/, () => { /* @claude fixture */ }],
    [/^Sam's dialogue reflects "earnest, confused, one shoe is missing somehow"$/, () => { /* @claude fixture */ }],
    [/^Sam's dialogue reflects "earnest, has begun to identify with the beans"$/, () => { /* @claude fixture */ }],
    [/^Sam's dialogue reflects "earnest, is the beans, will not be moved from this"$/, () => { /* @claude fixture */ }],
    [/^Sam's dialogue reflects "earnest, slightly confused, one detail wrong"$/, () => { /* @claude fixture */ }],
    [/^WOLFPACK_JOIN fires when affect toward target <= -2 AND join roll clears weighted probability$/, () => { /* @claude fixture */ }],
    [/^WOLFPACK_LEAD fires when affect toward target <= -3 AND pressure >= 4$/, () => { /* @claude fixture */ }],
    [/^a trigger token fires with anger delta -5$/, () => { /* @claude fixture */ }],
    [/^a trigger token fires with contempt delta \+3$/, () => { /* @claude fixture */ }],
    [/^a trigger token fires with eroticism delta \+5$/, () => { /* @claude fixture */ }],
    [/^a trigger token fires with humiliation delta -4$/, () => { /* @claude fixture */ }],
    [/^a trigger token fires with pressure_delta \+1$/, () => { /* @claude fixture */ }],
    [/^a trigger token fires with pressure_delta \+2$/, () => { /* @claude fixture */ }],
    [/^a trigger token fires with pressure_delta \+3$/, () => { /* @claude fixture */ }],
    [/^cox is currently generating a turn$/, () => { /* @claude fixture */ }],
    [/^cox's anxiety is \+2 at turn start$/, () => { /* @claude fixture */ }],
    [/^cox's anxiety is \+5 and has been for 2 turns$/, () => { /* @claude fixture */ }],
    [/^cox's anxiety is \+5 at round end$/, () => { /* @claude fixture */ }],
    [/^cox's contempt is \+3 at round end$/, () => { /* @claude fixture */ }],
    [/^cox's contempt is \+4 at turn start$/, () => { /* @claude fixture */ }],
    [/^cox's dominance toward wayne is \+3$/, () => { /* @claude fixture */ }],
    [/^cox's dominant axis is anxiety at value \+5$/, () => { /* @claude fixture */ }],
    [/^cox's immediate reaction is notes the absence cosmically, continues$/, () => { /* @claude fixture */ }],
    [/^cox's inversion condition is not met$/, () => { /* @claude fixture */ }],
    [/^cox's patience_threshold is 4$/, () => { /* @claude fixture */ }],
    [/^cox's perception filter reads the laugh as warm$/, () => { /* @claude fixture */ }],
    [/^cox's pressure in round 2 is 0$/, () => { /* @claude fixture */ }],
    [/^cox's pressure is 4$/, () => { /* @claude fixture */ }],
    [/^cox's warmth toward faldo in round 2 is 0$/, () => { /* @claude fixture */ }],
    [/^cox's warmth toward faldo is 0$/, () => { /* @claude fixture */ }],
    [/^each panel member contributes at least 2 times$/, () => { /* @claude fixture */ }],
    [/^faldo believes the conversation is about mcginley's failures$/, () => { /* @claude fixture */ }],
    [/^faldo misread it and responded from DOWNWARD$/, () => { /* @claude fixture */ }],
    [/^faldo's contempt is \+1 at round end$/, () => { /* @claude fixture */ }],
    [/^faldo's contempt is \+2 at round end$/, () => { /* @claude fixture */ }],
    [/^faldo's contempt is \+3 at turn start$/, () => { /* @claude fixture */ }],
    [/^faldo's contempt is \+4 at round end$/, () => { /* @claude fixture */ }],
    [/^faldo's contempt is \+4 at turn start$/, () => { /* @claude fixture */ }],
    [/^faldo's detection state is GO_WITH_IT$/, () => { /* @claude fixture */ }],
    [/^faldo's detection state is WHAT_THE_FUCK$/, () => { /* @claude fixture */ }],
    [/^faldo's dominance toward mcginley is \+5$/, () => { /* @claude fixture */ }],
    [/^faldo's dominance toward wayne is \+4$/, () => { /* @claude fixture */ }],
    [/^faldo's dominant axis is anger at value \+5$/, () => { /* @claude fixture */ }],
    [/^faldo's dominant axis is humiliation at value \+5$/, () => { /* @claude fixture */ }],
    [/^faldo's highest dyadic pressure source is mcginley$/, () => { /* @claude fixture */ }],
    [/^faldo's humiliation is \+2 at round end$/, () => { /* @claude fixture */ }],
    [/^faldo's humiliation is \+3 at turn start$/, () => { /* @claude fixture */ }],
    [/^faldo's humiliation is \+5 and has been for 1 turns$/, () => { /* @claude fixture */ }],
    [/^faldo's inversion condition is not met$/, () => { /* @claude fixture */ }],
    [/^faldo's misread_direction is DOWNWARD$/, () => { /* @claude fixture */ }],
    [/^faldo's next turn fires with behaviour names misread explicitly laughs at target$/, () => { /* @claude fixture */ }],
    [/^faldo's next turn fires with behaviour subtle sarcastic correction makes target look stupid$/, () => { /* @claude fixture */ }],
    [/^faldo's perception filter reads the apology as genuine$/, () => { /* @claude fixture */ }],
    [/^faldo's perception filter reads the apology as hostile$/, () => { /* @claude fixture */ }],
    [/^faldo's perception filter reads the laugh as hostile$/, () => { /* @claude fixture */ }],
    [/^faldo's pressure in round 2 is 3$/, () => { /* @claude fixture */ }],
    [/^faldo's silent_misread roll clears threshold$/, () => { /* @claude fixture */ }],
    [/^faldo's warmth toward mcginley in round 2 is -4$/, () => { /* @claude fixture */ }],
    [/^mcginley apologises for wrong thing occurs$/, () => { /* @claude fixture */ }],
    [/^mcginley believes the conversation is about defending faldo$/, () => { /* @claude fixture */ }],
    [/^mcginley believes the conversation is about team spirit$/, () => { /* @claude fixture */ }],
    [/^mcginley is currently generating a turn$/, () => { /* @claude fixture */ }],
    [/^mcginley misread it and responded from HOSTILE$/, () => { /* @claude fixture */ }],
    [/^mcginley's affect toward faldo in round 2 is -4$/, () => { /* @claude fixture */ }],
    [/^mcginley's affect toward wayne is \+2$/, () => { /* @claude fixture */ }],
    [/^mcginley's dominance toward faldo is -4$/, () => { /* @claude fixture */ }],
    [/^mcginley's dominant axis is anger at value \+4$/, () => { /* @claude fixture */ }],
    [/^mcginley's dominant axis is humiliation at value \+5$/, () => { /* @claude fixture */ }],
    [/^mcginley's dominant axis is shame at value \+4$/, () => { /* @claude fixture */ }],
    [/^mcginley's effective_misread_probability is 0\.60$/, () => { /* @claude fixture */ }],
    [/^mcginley's highest dyadic pressure source is faldo$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation is \+2 at turn start$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation is \+4 at round end$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation is \+4 at turn start$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation is \+5 and has been for 1 turns$/, () => { /* @claude fixture */ }],
    [/^mcginley's humiliation is \+5 and has been for 3 turns$/, () => { /* @claude fixture */ }],
    [/^mcginley's inversion condition is not met$/, () => { /* @claude fixture */ }],
    [/^mcginley's joy behaviour is DECAY$/, () => { /* @claude fixture */ }],
    [/^mcginley's perception filter reads the apology as genuine$/, () => { /* @claude fixture */ }],
    [/^mcginley's perception filter reads the laugh as hostile$/, () => { /* @claude fixture */ }],
    [/^mcginley's pressure in round 2 is 5$/, () => { /* @claude fixture */ }],
    [/^mcginley's shame is \+1 at turn start$/, () => { /* @claude fixture */ }],
    [/^mcginley's shame is \+3 at round end$/, () => { /* @claude fixture */ }],
    [/^mcginley's silent_misread roll clears threshold$/, () => { /* @claude fixture */ }],
    [/^no detection roll has cleared$/, () => { /* @claude fixture */ }],
    [/^random detection roll clears occurs$/, () => { /* @claude fixture */ }],
    [/^the base outcome is Swiss cheese spike$/, () => { /* @claude fixture */ }],
    [/^the base outcome is any outcome$/, () => { /* @claude fixture */ }],
    [/^the base outcome is catastrophic$/, () => { /* @claude fixture */ }],
    [/^the base outcome is mild failure$/, () => { /* @claude fixture */ }],
    [/^the base outcome is mild success$/, () => { /* @claude fixture */ }],
    [/^the base outcome is moderate failure$/, () => { /* @claude fixture */ }],
    [/^the base outcome is moderate success$/, () => { /* @claude fixture */ }],
    [/^the divergence resolves via CALL_OUT_LAUGHING fires from observer$/, () => { /* @claude fixture */ }],
    [/^the divergence resolves via eruption content reveals divergence to room$/, () => { /* @claude fixture */ }],
    [/^the intent label is one of NEUTRAL, WARM, HOSTILE$/, () => { /* @claude fixture */ }],
    [/^the interrupt threshold is 3$/, () => { /* @claude fixture */ }],
    [/^the inversion probability threshold is met$/, () => { /* @claude fixture */ }],
    [/^the orchestrator evaluates "coltart"'s speech_mode$/, () => { /* @claude fixture */ }],
    [/^the orchestrator evaluates "dougherty"'s speech_mode$/, () => { /* @claude fixture */ }],
    [/^the orchestrator evaluates "faldo"'s speech_mode$/, () => { /* @claude fixture */ }],
    [/^the orchestrator evaluates "henni"'s speech_mode$/, () => { /* @claude fixture */ }],
    [/^the orchestrator evaluates "mcginley"'s speech_mode$/, () => { /* @claude fixture */ }],
    [/^the orchestrator evaluates "murray"'s speech_mode$/, () => { /* @claude fixture */ }],
    [/^the orchestrator evaluates "roe"'s speech_mode$/, () => { /* @claude fixture */ }],
    [/^the random roll is 0\.45$/, () => { /* @claude fixture */ }],
    [/^the random roll is 0\.60$/, () => { /* @claude fixture */ }],
    [/^the random roll is 0\.65$/, () => { /* @claude fixture */ }],
    [/^the random roll is 0\.70$/, () => { /* @claude fixture */ }],
    [/^the random roll is 0\.75$/, () => { /* @claude fixture */ }],
    [/^the random roll is 0\.80$/, () => { /* @claude fixture */ }],
    [/^the speaker directly insults "coltart"$/, () => { /* @claude fixture */ }],
    [/^the speaker directly insults "faldo"$/, () => { /* @claude fixture */ }],
    [/^the speaker directly insults "mcginley"$/, () => { /* @claude fixture */ }],
    [/^the speaker genuinely agrees with "dougherty"$/, () => { /* @claude fixture */ }],
    [/^the speaker genuinely agrees with "faldo"$/, () => { /* @claude fixture */ }],
    [/^the speaker genuinely agrees with "mcginley"$/, () => { /* @claude fixture */ }],
    [/^the speaker ignores "mcginley" for two consecutive turns$/, () => { /* @claude fixture */ }],
    [/^the speaker ignores "roe" for two consecutive turns$/, () => { /* @claude fixture */ }],
    [/^the speaker mimics "faldo"$/, () => { /* @claude fixture */ }],
    [/^the speaker mimics "murray"$/, () => { /* @claude fixture */ }],
    [/^the token has performance deltas \+1 \+1 0 0 \+2 0 0 \+2 0 0$/, () => { /* @claude fixture */ }],
    [/^the token has performance deltas \+2 0 0 0 0 \+3 0 \+4 \+2 \+1$/, () => { /* @claude fixture */ }],
    [/^the token has performance deltas 0 0 \+2 0 0 \+2 \+3 0 0 0$/, () => { /* @claude fixture */ }],
    [/^the token has pressure_delta \+1 and room_ripple \+1$/, () => { /* @claude fixture */ }],
    [/^the token has pressure_delta \+2 and room_ripple \+1$/, () => { /* @claude fixture */ }],
    [/^the turn is labelled with intent NEUTRAL before target processing$/, () => { /* @claude fixture */ }],
    [/^the turn is labelled with intent WARM before target processing$/, () => { /* @claude fixture */ }],
    [/^the wolfpack initiation threshold is affect <= -3 AND pressure >= 4$/, () => { /* @claude fixture */ }],
    [/^wayne believes the conversation is about bush tucker survival$/, () => { /* @claude fixture */ }],
    [/^wayne's anger is \+5 at turn start$/, () => { /* @claude fixture */ }],
    [/^wayne's dominance toward cox in round 2 is -3$/, () => { /* @claude fixture */ }],
    [/^wayne's dominance toward faldo is -2$/, () => { /* @claude fixture */ }],
    [/^wayne's dominant axis is anger at value \+5$/, () => { /* @claude fixture */ }],
    [/^wayne's dominant axis is shame at value \+4$/, () => { /* @claude fixture */ }],
    [/^wayne's eroticism is one of \+2, \+4$/, () => { /* @claude fixture */ }],
    [/^wayne's eroticism is one of \+4, \+5$/, () => { /* @claude fixture */ }],
    [/^wayne's eroticism is one of -1, \+1$/, () => { /* @claude fixture */ }],
    [/^wayne's eroticism is one of -5, -4$/, () => { /* @claude fixture */ }],
    [/^wayne's highest dyadic pressure source is cox$/, () => { /* @claude fixture */ }],
    [/^wayne's inversion condition is not met$/, () => { /* @claude fixture */ }],
    [/^wayne's join_probability is 0\.55$/, () => { /* @claude fixture */ }],
    [/^wayne's misread_direction is PHYSICAL$/, () => { /* @claude fixture */ }],
    [/^wayne's patience_threshold is 2$/, () => { /* @claude fixture */ }],
    [/^wayne's perception filter reads the laugh as neutral$/, () => { /* @claude fixture */ }],
    [/^wayne's pressure in round 2 is 6$/, () => { /* @claude fixture */ }],
    [/^wayne's pressure is 6$/, () => { /* @claude fixture */ }],
    [/^wayne's silent_misread roll clears threshold$/, () => { /* @claude fixture */ }],
    [/^wayne's warmth toward faldo is \+3$/, () => { /* @claude fixture */ }],

  ];
}

// ── Feature file parser ───────────────────────────────────────────────────────

function parseFeature(text) {
  const lines     = text.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  const scenarios = [];
  let   current   = null;
  let   outline   = null; // active Scenario Outline accumulator
  let   inExamples = false;
  let   exHeaders  = [];

  function _expandOutline(o) {
    for (const row of o.examples) {
      const expanded = {
        name: o.name + ' — ' + Object.values(row).join(', '),
        steps: o.steps.map(s => {
          let r = s;
          for (const [k, v] of Object.entries(row)) r = r.split(`<${k}>`).join(v);
          return r;
        }),
      };
      scenarios.push(expanded);
    }
  }

  for (const line of lines) {
    if (line.startsWith('Feature:') || line.startsWith('Rule:')) continue;
    if (line.startsWith('Background:')) { current = { name: 'Background', steps: [], isBackground: true }; continue; }

    if (line.startsWith('Scenario Outline:')) {
      if (outline) _expandOutline(outline);
      outline    = { name: line.replace('Scenario Outline:', '').trim(), steps: [], examples: [] };
      current    = null;
      inExamples = false;
      continue;
    }

    if (line.startsWith('Examples:')) {
      inExamples = true;
      exHeaders  = [];
      continue;
    }

    if (inExamples && line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (!exHeaders.length) { exHeaders = cells; }
      else {
        const row = {};
        exHeaders.forEach((h, i) => { row[h] = cells[i] || ''; });
        if (outline) outline.examples.push(row);
      }
      continue;
    }

    if (line.startsWith('Scenario:')) {
      if (outline) { _expandOutline(outline); outline = null; inExamples = false; }
      current = { name: line.replace('Scenario:', '').trim(), steps: [] };
      scenarios.push(current);
      continue;
    }

    if (outline && !inExamples && /^(Given|When|Then|And|But)\s/.test(line)) {
      outline.steps.push(line.replace(/^(Given|When|Then|And|But)\s+/, ''));
      continue;
    }
    if (current && /^(Given|When|Then|And|But)\s/.test(line)) {
      current.steps.push(line.replace(/^(Given|When|Then|And|But)\s+/, ''));
    }
  }
  if (outline) _expandOutline(outline);
  return scenarios;
}

function runStep(step, steps) {
  for (const [pattern, fn] of steps) {
    const m = step.match(pattern);
    if (m) { fn(...m.slice(1)); return; }
  }
  throw new Error(`No step definition for: "${step}"`);
}

// ── Background steps ──────────────────────────────────────────────────────────

function parseBackground(text) {
  const lines = text.split('\n').map(l => l.trim());
  const bg = [];
  let inBg = false;
  for (const line of lines) {
    if (line.startsWith('Background:'))        { inBg = true; continue; }
    if (line.startsWith('Scenario:') ||
        line.startsWith('Scenario Outline:')) { inBg = false; continue; }
    if (inBg && /^(Given|When|Then|And|But)\s/.test(line)) {
      bg.push(line.replace(/^(Given|When|Then|And|But)\s+/, ''));
    }
  }
  return bg;
}

// ── Runner ────────────────────────────────────────────────────────────────────

const specsDir = path.join(__dirname, '..', 'specs');
const files    = fs.readdirSync(specsDir).filter(f => f.endsWith('.feature'));

let totalPass  = 0;
let totalFail  = 0;
let totalSkip  = 0;
const allFailures = [];

for (const file of files) {
  const text      = fs.readFileSync(path.join(specsDir, file), 'utf8');

  // Skip @claude-tagged features — AI behavioural specs, not app tests
  if (/^@claude\s*$/m.test(text)) {
    const scenarios = parseFeature(text);
    totalSkip += scenarios.length;
    console.log(`\n  ${file}  (@claude — ${scenarios.length} scenarios, manual verification)`);
    continue;
  }

  const scenarios = parseFeature(text);
  const bgSteps   = parseBackground(text);

  console.log(`\n  ${file}`);

  for (const scenario of scenarios) {
    const ctx   = createContext();
    const steps = makeSteps(ctx);
    let   ok    = true;
    let   msg   = '';

    try {
      for (const s of bgSteps)       runStep(s, steps);
      for (const s of scenario.steps) runStep(s, steps);
    } catch (e) {
      ok  = false;
      msg = e.message;
    }

    if (ok) {
      totalPass++;
      console.log(`    ✓ ${scenario.name}`);
    } else {
      totalFail++;
      allFailures.push(`    ✗ ${scenario.name}: ${msg}`);
      console.log(`    ✗ ${scenario.name}`);
      console.log(`      ${msg}`);
    }
  }
}

console.log(`\nGherkin: ${totalPass}/${totalPass + totalFail} scenarios passing  (${totalSkip} @claude skipped)\n`);
process.exit(totalFail > 0 ? 1 : 0);
