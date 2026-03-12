#!/usr/bin/env node
// pipeline/e2e-test.js
// End-to-end browser tests using Playwright headless Chromium.
// Proves buttons connect to logic — catches JS crashes and API wiring failures.
// Run: node pipeline/e2e-test.js
// Exit 0 = all checks pass. Exit 1 = one or more failures.

// Playwright Chromium requires local libs on WSL — set via run-all.js spawnEnv or manually:
// export LD_LIBRARY_PATH="/home/rodent/locallibs/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH"
const { chromium } = require('playwright');

const LIVE_URL    = 'https://asspirited.github.io/cusslab';
const API_TIMEOUT = 35000; // 35s — API calls can take a few seconds
const PAGE_TIMEOUT = 15000;

// ── Helpers ────────────────────────────────────────────────────────────────────

const results  = [];
const consoleErrors = [];

function pass(name) {
  results.push({ name, ok: true });
  console.log(`    ✓ ${name}`);
}

function fail(name, reason) {
  results.push({ name, ok: false, reason });
  console.log(`    ✗ ${name}`);
  console.log(`      ${reason}`);
}

// ── Tests ──────────────────────────────────────────────────────────────────────

async function testPageLoad(page) {
  const name = 'Page loads without JS fatal errors';
  try {
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push('UNCAUGHT: ' + err.message));

    await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT });
    await page.waitForTimeout(1500); // let IIFEs run

    // Filter known-noisy non-fatal errors (e.g. plausible, 3rd-party)
    const fatal = consoleErrors.filter(e =>
      !e.includes('plausible') &&
      !e.includes('Failed to load resource') &&
      !e.includes('net::ERR_')
    );

    if (fatal.length > 0) {
      fail(name, `Console errors: ${fatal.slice(0, 3).join(' | ')}`);
    } else {
      pass(name);
    }
  } catch (e) {
    fail(name, e.message);
  }
}

async function testKeyPanelsPresent(page) {
  const name = 'Key panels are present in DOM';
  try {
    const ids = [
      'panel-pubnavigator',
      'panel-hardmen',
      'panel-suntzu',
      'panel-comedyroom',
      'panel-football',
      'panel-golf',
    ];
    const missing = [];
    for (const id of ids) {
      const el = await page.$(`#${id}`);
      if (!el) missing.push(id);
    }
    if (missing.length > 0) {
      fail(name, `Missing panels: ${missing.join(', ')}`);
    } else {
      pass(name);
    }
  } catch (e) {
    fail(name, e.message);
  }
}

async function testApiModuleAvailable(page) {
  const name = 'API module is available at window.API';
  try {
    // api-client.js exports to global — if it crashed the global won't be set
    // We check via page.evaluate since the module name is 'API' (IIFE return)
    // Actually it's const API = (() => {...})() — not window.API. Check indirectly
    // by confirming no "API is not defined" style error and that Settings panel
    // has key status indicator (which API.initKeyUI() sets up)
    const indicator = await page.$('#key-status-indicator');
    if (!indicator) {
      fail(name, '#key-status-indicator not found — API.initKeyUI() may not have run');
      return;
    }
    const text = await indicator.textContent();
    // Should be one of: "● No API key", "● Connected", "● N errors"
    if (!text || text.trim().length === 0) {
      fail(name, 'key-status-indicator is empty — API module may be undefined');
    } else {
      pass(name);
    }
  } catch (e) {
    fail(name, e.message);
  }
}

async function testPubNavigatorButtonClick(page) {
  const name = 'Pub Navigator: clicking a situation triggers an API response';
  try {
    // Switch to pub navigator
    await page.click("text=Survive a Friday night at...", { timeout: PAGE_TIMEOUT });
    await page.waitForTimeout(300);

    // Click first situation card
    const btn = await page.$('.pn-situation-btn');
    if (!btn) {
      fail(name, 'No .pn-situation-btn found — situations not rendered');
      return;
    }
    await btn.click();

    // Loading indicator should appear briefly — confirms click handler fired
    // Then wait for response body to get text
    const responseBody = page.locator('#pn-response-body');
    await responseBody.waitFor({ state: 'visible', timeout: API_TIMEOUT });
    const text = await responseBody.textContent();

    if (!text || text.trim().length < 10) {
      fail(name, `Response body is empty or too short: "${text?.slice(0, 60)}"`);
      return;
    }

    // Detect error messages from api-client.js
    const errorPhrases = [
      'API key rejected',
      'Out of API credits',
      'Request failed',
      'timed out',
      'unavailable',
      'try again',
    ];
    const lowerText = text.toLowerCase();
    const foundError = errorPhrases.find(p => lowerText.includes(p.toLowerCase()));
    if (foundError) {
      fail(name, `Response appears to be an error: "${text.slice(0, 100)}"`);
    } else {
      pass(name);
    }
  } catch (e) {
    if (e.message.includes('Timeout') || e.message.includes('timeout')) {
      fail(name, `Timed out waiting for response (${API_TIMEOUT / 1000}s) — API call may be hanging`);
    } else {
      fail(name, e.message);
    }
  }
}

async function testSunTzuAdvisorySubmit(page) {
  const name = 'Sun Tzu Advisory: submit fires and returns a response';
  try {
    await page.click("text=Ask Sun Tzu", { timeout: PAGE_TIMEOUT });
    await page.waitForTimeout(300);

    const input = page.locator('#sta-input');
    await input.waitFor({ state: 'visible', timeout: PAGE_TIMEOUT });
    await input.fill('Should I pick a fight with the photocopier?');

    const btn = page.locator('#sta-btn');
    const isDisabled = await btn.getAttribute('disabled');
    if (isDisabled !== null && isDisabled !== false) {
      // Try to trigger onInput manually
      await input.dispatchEvent('input');
      await page.waitForTimeout(200);
    }

    await btn.click({ timeout: PAGE_TIMEOUT });

    const responseBody = page.locator('#sta-response-body');
    await responseBody.waitFor({ state: 'visible', timeout: API_TIMEOUT });
    const text = await responseBody.textContent();

    if (!text || text.trim().length < 10) {
      fail(name, `Response body empty or too short: "${text?.slice(0, 60)}"`);
      return;
    }

    const errorPhrases = ['API key rejected', 'Request failed', 'timed out', 'unavailable'];
    const foundError = errorPhrases.find(p => text.toLowerCase().includes(p.toLowerCase()));
    if (foundError) {
      fail(name, `Response appears to be an error: "${text.slice(0, 100)}"`);
    } else {
      pass(name);
    }
  } catch (e) {
    if (e.message.includes('Timeout') || e.message.includes('timeout')) {
      fail(name, `Timed out (${API_TIMEOUT / 1000}s) — API call hanging or button not connected`);
    } else {
      fail(name, e.message);
    }
  }
}

async function testHardmenPanelRenders(page) {
  const name = 'Hardmen: panel renders 5 situation buttons';
  try {
    await page.click("text=The Hardmen", { timeout: PAGE_TIMEOUT });
    await page.waitForTimeout(400);

    const btns = await page.$$('#hm-situations .btn-secondary');
    if (btns.length !== 5) {
      fail(name, `Expected 5 situation buttons, found ${btns.length}`);
    } else {
      pass(name);
    }
  } catch (e) {
    fail(name, e.message);
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

(async () => {
  console.log('');
  console.log('  E2E Tests — headless Chromium against live site');
  console.log(`  Target: ${LIVE_URL}`);
  console.log('  ────────────────────────────────────────────────────────────────────');

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await testPageLoad(page);
    await testKeyPanelsPresent(page);
    await testApiModuleAvailable(page);
    await testPubNavigatorButtonClick(page);
    await testSunTzuAdvisorySubmit(page);
    await testHardmenPanelRenders(page);

  } catch (e) {
    fail('E2E runner', `Browser launch failed: ${e.message}`);
  } finally {
    if (browser) await browser.close();
  }

  const passed = results.filter(r => r.ok).length;
  const total  = results.length;
  const allOk  = passed === total;

  console.log('  ────────────────────────────────────────────────────────────────────');
  console.log(`  E2E: ${passed}/${total} checks passing`);
  if (consoleErrors.length > 0) {
    const filtered = consoleErrors.filter(e => !e.includes('plausible') && !e.includes('net::ERR_'));
    if (filtered.length > 0) {
      console.log(`  Browser console errors: ${filtered.length}`);
      filtered.slice(0, 3).forEach(e => console.log(`    ${e.slice(0, 120)}`));
    }
  }
  console.log('');

  process.exit(allOk ? 0 : 1);
})();
