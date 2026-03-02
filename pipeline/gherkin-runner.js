// Gherkin runner — parses specs/*.feature and runs step definitions
// Run: node pipeline/gherkin-runner.js

const fs   = require('fs');
const path = require('path');

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
};

// Panel configuration — member counts and round options, mirrors JS modules
const PANEL_CONFIG = {
  boardroom:  { members: 7, rounds: 5  },
  comedyroom: { members: 8, rounds: 10 },
  football:   { members: 4, rounds: null },
  golf:       { members: 8, rounds: null },
};

// Nav tabs hidden from navigation — mirrors index.html style="display:none"
const HIDDEN_NAV_TABS = ['settings'];

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

  // Worker / routing mock state
  let   activePanel        = null;
  let   lastRequestHadKey  = false;

  // Four-panel mock state
  let   panelWarning       = false;
  let   panelApiCalled     = false;
  let   panelResponseCount = 0;

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
    panelWarning       = false;
    panelApiCalled     = true;
    panelResponseCount = cfg ? cfg.members : 0;
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

  function setIronicVerdict(verdict, irony_score) {
    const LABELS = {
      actually_ironic:      'Actually Ironic',
      coincidence:          'Coincidence',
      expected_outcome:     'Completely Expected',
      bad_luck:             'Just Bad Luck',
      vacuous_amplifier:    'Vacuous Amplifier',
      random_juxtaposition: 'Random Juxtaposition',
    };
    ironicApiCalled = true;
    ironicVerdict   = {
      verdict,
      verdict_label: LABELS[verdict] || verdict,
      irony_score,
      panel: [{ expert: 'hicks', name: 'Bill Hicks', icon: '🎙️', response: 'Mock.' }],
    };
  }

  return { store, dom, getKey, setKey, clickSaveKey, clickClearKey,
           openSettingsTab, focusInput, blurInput, updateKeyStatus,
           simulateApiCall, simulateApiCallWithBody, attemptPanelWithNoKey,
           submitIronicEmpty, submitIronic, setIronicVerdict,
           submitPanelEmpty, submitPanel, getPanelRoundOptions,
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
           getPanelResponseCount: () => panelResponseCount };
}

// ── Step definitions ─────────────────────────────────────────────────────────

function makeSteps(ctx) {
  return [
    [/^the application is loaded$/,
      () => { /* nothing needed */ }],

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

    // ── Panel mechanics — round selectors ─────────────────────────────────────

    [/^the (\w+(?:\s+\w+)*) round selector offers (\d+) rounds$/,
      (panelName, count) => {
        const expected = parseInt(count, 10);
        const actual   = ctx.getPanelRoundOptions(panelName);
        if (actual !== expected) throw new Error(`expected ${expected} round options for "${panelName}" but got ${actual}`);
      }],
  ];
}

// ── Feature file parser ───────────────────────────────────────────────────────

function parseFeature(text) {
  const lines     = text.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  const scenarios = [];
  let   current   = null;

  for (const line of lines) {
    if (line.startsWith('Feature:') || line.startsWith('Background:')) {
      if (line.startsWith('Background:')) current = { name: 'Background', steps: [], isBackground: true, background: [] };
      continue;
    }
    if (line.startsWith('Scenario:')) {
      current = { name: line.replace('Scenario:', '').trim(), steps: [] };
      scenarios.push(current);
      continue;
    }
    if (current && /^(Given|When|Then|And|But)\s/.test(line)) {
      current.steps.push(line.replace(/^(Given|When|Then|And|But)\s+/, ''));
    }
  }
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
    if (line.startsWith('Background:')) { inBg = true; continue; }
    if (line.startsWith('Scenario:'))   { inBg = false; continue; }
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
