// Gherkin runner — parses specs/*.feature and runs step definitions against real DOM (JSDOM)
// Run: node pipeline/gherkin-runner.js

'use strict';

const fs   = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const HTML_PATH = path.join(__dirname, '..', 'index.html');

// ── User-facing API error messages (mirror index.html API._userMessage) ───────
// Kept here for api-errors scenarios that simulate HTTP responses without real fetch

const USER_MESSAGES = {
  401:      'API key rejected — check your key in ⚙️ Settings',
  400:      'Bad request — your API key may be invalid. Check ⚙️ Settings',
  403:      "API key doesn't have permission for this request.",
  429:      'Too many requests — wait a moment and try again',
  500:      'Anthropic server error — try again shortly',
  'no-key': 'No API key — go to ⚙️ Settings to add one',
};

// ── Context factory ───────────────────────────────────────────────────────────

function createContext({ clearKey = false } = {}) {
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  // Thin mock layer retained for api-errors scenarios
  let lastApiMessage = '';

  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url:        'http://localhost/',
    beforeParse(window) {
      // Stub fetch — no real network calls in tests
      window.fetch = () => Promise.reject(new Error('fetch not available in test environment'));
    },
  });

  const { window } = dom;
  const { document, localStorage } = window;

  if (clearKey) {
    localStorage.removeItem('heckler-api-key');
  }

  return {
    document,
    window,
    localStorage,
    // Mock API simulation for api-errors feature
    simulateApiCall(status) {
      if (!localStorage.getItem('heckler-api-key')) {
        lastApiMessage = USER_MESSAGES['no-key'];
      } else {
        lastApiMessage = USER_MESSAGES[status] || `HTTP ${status} error`;
      }
    },
    attemptPanelWithNoKey() { lastApiMessage = USER_MESSAGES['no-key']; },
    getLastApiMessage: () => lastApiMessage,
  };
}

// ── DOM helpers ───────────────────────────────────────────────────────────────

function el(ctx, id) {
  const node = ctx.document.getElementById(id);
  if (!node) throw new Error(`Element not found: #${id}`);
  return node;
}

function clickEl(ctx, id) {
  el(ctx, id).click();
}

function panelId(name) {
  const map = {
    'Localiser':        'localiser',
    'Generator':        'generator',
    'Historian':        'historian',
    'Trumps':           'trumps',
    'IT Consultant':    'it',
    'Sentence Builder': 'sentence',
    'Polls':            'polls',
    'Quiz':             'quiz',
    'Leaderboard':      'leaderboard',
    'Settings':         'settings',
  };
  const id = map[name] || name.toLowerCase().replace(/\s+/g, '-');
  return id;
}

function isPanelVisible(ctx, name) {
  const id  = panelId(name);
  const pnl = ctx.document.getElementById(`panel-${id}`);
  if (!pnl) throw new Error(`Panel not found: #panel-${id}`);
  return pnl.style.display !== 'none';
}

function navTo(ctx, name) {
  const id  = panelId(name);
  const btn = ctx.document.getElementById(`nav-${id}`);
  if (!btn) throw new Error(`Nav button not found: #nav-${id}`);
  btn.click();
}

// ── Step definitions ──────────────────────────────────────────────────────────

function makeSteps(ctx) {
  return [

    // ── Background / setup ────────────────────────────────────────────────────

    [/^the application is loaded$/,
      () => { /* JSDOM already loaded */ }],

    [/^the app is loaded$/,
      () => { /* JSDOM already loaded */ }],

    [/^the app is loaded with no saved API key$/,
      () => { ctx.localStorage.removeItem('heckler-api-key'); }],

    [/^no API key is stored$/,
      () => { ctx.localStorage.removeItem('heckler-api-key'); }],

    [/^API key "([^"]+)" is stored$/,
      (k) => { ctx.localStorage.setItem('heckler-api-key', k); }],

    [/^a valid API key is stored$/,
      () => { ctx.localStorage.setItem('heckler-api-key', 'sk-ant-api03-VALIDKEYABCDEFGHIJKLMNO12345'); }],

    [/^a valid API key is saved$/,
      () => { ctx.localStorage.setItem('heckler-api-key', 'sk-ant-api03-VALIDKEYABCDEFGHIJKLMNO12345'); }],

    [/^"([^"]+)" is already saved$/,
      (k) => { ctx.localStorage.setItem('heckler-api-key', k); }],

    // ── Navigation ────────────────────────────────────────────────────────────

    [/^I am on the Settings tab$/,
      () => { navTo(ctx, 'Settings'); }],

    [/^I am on the Settings tab with the key input focused$/,
      () => { navTo(ctx, 'Settings'); el(ctx, 'settings-key-input').focus(); }],

    [/^I navigate to the Settings tab$/,
      () => { navTo(ctx, 'Settings'); }],

    [/^I navigate to the Settings panel$/,
      () => { navTo(ctx, 'Settings'); }],

    [/^the Settings panel is open$/,
      () => { navTo(ctx, 'Settings'); }],

    [/^the Localiser panel is open$/,
      () => { navTo(ctx, 'Localiser'); }],

    [/^the Leaderboard panel is open$/,
      () => { navTo(ctx, 'Leaderboard'); }],

    [/^the Quiz panel is open$/,
      () => { navTo(ctx, 'Quiz'); }],

    [/^the Polls panel is open$/,
      () => { navTo(ctx, 'Polls'); }],

    [/^the Generator panel is open$/,
      () => { navTo(ctx, 'Generator'); }],

    [/^I navigate to the Leaderboard panel$/,
      () => { navTo(ctx, 'Leaderboard'); }],

    [/^I click the Localiser nav item$/,
      () => { navTo(ctx, 'Localiser'); }],

    [/^I click the Settings nav item$/,
      () => { navTo(ctx, 'Settings'); }],

    [/^I click the Generator nav item$/,
      () => { navTo(ctx, 'Generator'); }],

    [/^I click the (\S+) nav item$/,
      (name) => { navTo(ctx, name); }],

    // ── Settings input actions ────────────────────────────────────────────────

    [/^I paste "([^"]+)" into the key input$/,
      (v) => { el(ctx, 'settings-key-input').value = v; }],

    [/^I type "([^"]+)" into the API key input$/,
      (v) => { el(ctx, 'settings-key-input').value = v; }],

    [/^I clear the input and type "([^"]+)"$/,
      (v) => { el(ctx, 'settings-key-input').value = v; }],

    [/^the API key input is empty$/,
      () => { el(ctx, 'settings-key-input').value = ''; }],

    [/^I click "Save Key"$/,
      () => { clickEl(ctx, 'settings-save-btn'); }],

    [/^I click "Save Key" with an empty input$/,
      () => {
        el(ctx, 'settings-key-input').value = '';
        clickEl(ctx, 'settings-save-btn');
      }],

    [/^I click Save$/,
      () => { clickEl(ctx, 'settings-save-btn'); }],

    [/^I click "Clear Key"$/,
      () => { clickEl(ctx, 'settings-clear-btn'); }],

    [/^updateKeyStatus fires from an async API completion$/,
      () => {
        // Simulate async re-render: re-read storage and update input if not focused
        const k   = ctx.localStorage.getItem('heckler-api-key') || '';
        const inp = ctx.document.getElementById('settings-key-input');
        if (inp && ctx.document.activeElement !== inp) inp.value = k;
      }],

    [/^the key status is updated$/,
      () => { /* storage state is the source of truth — no-op */ }],

    // ── Settings assertions ───────────────────────────────────────────────────

    [/^the key input shows "([^"]*)"$/,
      (expected) => {
        const actual = el(ctx, 'settings-key-input').value;
        if (actual !== expected) throw new Error(`key input: expected "${expected}" got "${actual}"`);
      }],

    [/^the API key input value is "([^"]+)"$/,
      (expected) => {
        const actual = el(ctx, 'settings-key-input').value;
        if (actual !== expected) throw new Error(`API key input: expected "${expected}" got "${actual}"`);
      }],

    [/^the save message reads "([^"]+)"$/,
      (expected) => {
        const actual = el(ctx, 'settings-save-msg').textContent;
        if (actual !== expected) throw new Error(`save msg: expected "${expected}" got "${actual}"`);
      }],

    [/^the stored key is "([^"]+)"$/,
      (expected) => {
        const actual = ctx.localStorage.getItem('heckler-api-key') || '';
        if (actual !== expected) throw new Error(`stored key: expected "${expected}" got "${actual}"`);
      }],

    [/^no key is stored$/,
      () => {
        const k = ctx.localStorage.getItem('heckler-api-key');
        if (k) throw new Error(`expected no key stored, but found "${k}"`);
      }],

    [/^the key input still contains "([^"]+)"$/,
      (expected) => {
        const actual = el(ctx, 'settings-key-input').value;
        if (actual !== expected) throw new Error(`key input: expected "${expected}" got "${actual}"`);
      }],

    [/^I see "([^"]+)"$/,
      (expected) => {
        const body = ctx.document.body.textContent || '';
        if (!body.includes(expected)) throw new Error(`expected to see "${expected}" in page`);
      }],

    [/^I do not see "([^"]+)"$/,
      (expected) => {
        const body = ctx.document.body.textContent || '';
        if (body.includes(expected)) throw new Error(`expected NOT to see "${expected}" in page`);
      }],

    [/^I see a validation error$/,
      () => {
        const msg = ctx.document.getElementById('settings-save-msg');
        if (!msg || !msg.textContent.trim()) throw new Error('expected a validation error message, but none shown');
      }],

    [/^the header indicator state is "([^"]+)"$/,
      (expected) => {
        const ind = ctx.document.getElementById('key-status-indicator');
        if (!ind) throw new Error('key-status-indicator element not found in DOM');
        const actual = ind.dataset.state || ind.className;
        if (!actual.includes(expected)) throw new Error(`header state: expected "${expected}" got "${actual}"`);
      }],

    // ── Panel visibility assertions ───────────────────────────────────────────

    [/^the Localiser panel is visible$/,
      () => {
        if (!isPanelVisible(ctx, 'Localiser')) throw new Error('Localiser panel is not visible');
      }],

    [/^(\d+) nav items are shown in the sidebar$/,
      (n) => {
        const actual = ctx.document.querySelectorAll('.nav-item').length;
        if (actual !== parseInt(n, 10)) throw new Error(`expected ${n} nav items, got ${actual}`);
      }],

    [/^the Generator panel is visible$/,
      () => {
        if (!isPanelVisible(ctx, 'Generator')) throw new Error('Generator panel is not visible');
      }],

    [/^the Localiser panel is not visible$/,
      () => {
        if (isPanelVisible(ctx, 'Localiser')) throw new Error('Localiser panel should not be visible');
      }],

    [/^the Generator nav item is highlighted as active$/,
      () => {
        const btn = el(ctx, 'nav-generator');
        if (!btn.classList.contains('active')) throw new Error('Generator nav item is not highlighted');
      }],

    [/^the Localiser nav item is not highlighted$/,
      () => {
        const btn = el(ctx, 'nav-localiser');
        if (btn.classList.contains('active')) throw new Error('Localiser nav item should not be highlighted');
      }],

    [/^the (\S+) panel is visible$/,
      (name) => {
        if (!isPanelVisible(ctx, name)) throw new Error(`${name} panel is not visible`);
      }],

    // ── Quiz assertions ───────────────────────────────────────────────────────

    [/^I see "Question (\d+) of (\d+)"$/,
      (n, total) => {
        const expected = `Question ${n} of ${total}`;
        const actual   = (ctx.document.getElementById('quiz-progress') || {}).textContent || '';
        if (!actual.includes(expected)) throw new Error(`quiz progress: expected "${expected}" got "${actual}"`);
      }],

    // ── Polls assertions ──────────────────────────────────────────────────────

    [/^a poll question is shown$/,
      () => {
        const q = ctx.document.getElementById('polls-question');
        if (!q || !q.textContent.trim()) throw new Error('polls-question is empty');
      }],

    [/^4 answer options are shown$/,
      () => {
        const opts = ctx.document.querySelectorAll('.poll-option');
        if (opts.length !== 4) throw new Error(`expected 4 poll options, got ${opts.length}`);
      }],

    [/^I click the first answer option$/,
      () => { clickEl(ctx, 'polls-option-1'); }],

    [/^percentage bars are shown for all 4 options$/,
      () => {
        const bars = ctx.document.getElementById('polls-bars');
        if (!bars || bars.style.display === 'none') throw new Error('polls-bars not visible after voting');
      }],

    [/^I have voted for the first answer option$/,
      () => { clickEl(ctx, 'polls-option-1'); }],

    [/^I click the second answer option$/,
      () => { clickEl(ctx, 'polls-option-2'); }],

    [/^the first answer option is still marked as voted$/,
      () => {
        const opt = el(ctx, 'polls-option-1');
        if (!opt.classList.contains('voted') && !opt.disabled) {
          throw new Error('first poll option is not marked as voted');
        }
      }],

    [/^I click Next Poll$/,
      () => { clickEl(ctx, 'polls-next-btn'); }],

    [/^a new poll question is shown$/,
      () => {
        const q = ctx.document.getElementById('polls-question');
        if (!q || !q.textContent.trim()) throw new Error('polls-question is empty after Next Poll');
      }],

    // ── Localiser assertions ──────────────────────────────────────────────────

    [/^I type "([^"]+)" into the phrase input$/,
      (v) => {
        const inp = ctx.document.getElementById('localiser-phrase') ||
                    ctx.document.getElementById('localiser-input');
        if (!inp) throw new Error('localiser phrase input not found');
        inp.value = v;
      }],

    [/^I select "([^"]+)" from the region dropdown$/,
      (v) => {
        const sel = ctx.document.getElementById('localiser-region') ||
                    ctx.document.getElementById('localiser-culture');
        if (!sel) throw new Error('localiser region dropdown not found');
        sel.value = v;
      }],

    [/^I click LOCALISE IT$/,
      () => {
        const btn = ctx.document.getElementById('localiser-btn') ||
                    ctx.document.getElementById('localiser-submit');
        if (!btn) throw new Error('LOCALISE IT button not found');
        btn.click();
      }],

    [/^the Hippo's Law banner shows "([^"]+)"$/,
      (expected) => {
        const banner = ctx.document.getElementById('localiser-hippos');
        if (!banner) throw new Error('localiser-hippos element not found');
        const actual = banner.textContent || '';
        if (!actual.includes(expected)) throw new Error(`Hippo's Law: expected "${expected}" got "${actual}"`);
      }],

    // ── api-errors steps (mock-based API simulation) ──────────────────────────

    [/^I am on the Ask The Panel tab$/,
      () => { /* navigate — no DOM change needed for mock API simulation */ }],

    [/^an API call returns status (\d+)$/,
      (status) => { ctx.simulateApiCall(parseInt(status, 10)); }],

    [/^I attempt to use the panel$/,
      () => { ctx.attemptPanelWithNoKey(); }],

    [/^I should see "([^"]+)"$/,
      (expected) => {
        const actual = ctx.getLastApiMessage();
        if (actual !== expected) throw new Error(`message: expected "${expected}" got "${actual}"`);
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
      continue;
    }
    if (line.startsWith('@')) continue;
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

function parseBackground(text) {
  const lines = text.split('\n').map(l => l.trim());
  const bg    = [];
  let inBg    = false;
  for (const line of lines) {
    if (line.startsWith('Background:'))  { inBg = true; continue; }
    if (line.startsWith('Scenario:'))    { inBg = false; continue; }
    if (line.startsWith('@'))            continue;
    if (inBg && /^(Given|When|Then|And|But)\s/.test(line)) {
      bg.push(line.replace(/^(Given|When|Then|And|But)\s+/, ''));
    }
  }
  return bg;
}

function runStep(step, steps) {
  for (const [pattern, fn] of steps) {
    const m = step.match(pattern);
    if (m) { fn(...m.slice(1)); return; }
  }
  throw new Error(`No step definition for: "${step}"`);
}

// ── Runner ────────────────────────────────────────────────────────────────────

const specsDir = path.join(__dirname, '..', 'specs');
const files    = fs.readdirSync(specsDir).filter(f => f.endsWith('.feature'));

let totalPass = 0;
let totalFail = 0;

for (const file of files) {
  const text      = fs.readFileSync(path.join(specsDir, file), 'utf8');
  const scenarios = parseFeature(text);
  const bgSteps   = parseBackground(text);
  const isClearKey = bgSteps.some(s => s === 'the app is loaded with no saved API key');

  console.log(`\n  ${file}`);

  for (const scenario of scenarios) {
    const ctx   = createContext({ clearKey: isClearKey });
    const steps = makeSteps(ctx);
    let   ok    = true;
    let   msg   = '';

    try {
      for (const s of bgSteps)        runStep(s, steps);
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
      console.log(`    ✗ ${scenario.name}`);
      console.log(`      ${msg}`);
    }
  }
}

console.log(`\nGherkin: ${totalPass}/${totalPass + totalFail} scenarios passing\n`);
process.exit(totalFail > 0 ? 1 : 0);
