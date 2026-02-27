'use strict';

// pipeline/test-context.js
// JSDOM-based test context. Loaded once; each scenario gets a fresh DOM.
// Run: node pipeline/gherkin-runner.js

const fs   = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const HTML_PATH = path.join(__dirname, '..', 'index.html');
const rawHtml   = fs.readFileSync(HTML_PATH, 'utf8');  // read once, reused per scenario

// ── Setup ─────────────────────────────────────────────────────────────────────

async function setupCleanState(ctx = {}) {
  const dom = new JSDOM(rawHtml, {
    runScripts:        'dangerously',
    resources:         'usable',
    pretendToBeVisual: true,
    url:               'http://localhost/'
  });

  // Wait for app init (DOMContentLoaded fires synchronously in JSDOM)
  await new Promise(resolve => {
    if (dom.window.document.readyState !== 'loading') resolve();
    else dom.window.document.addEventListener('DOMContentLoaded', resolve);
  });

  dom.window.localStorage.clear();

  ctx.window    = dom.window;
  ctx.document  = dom.window.document;
  ctx._dom      = dom;

  // API mock — scenarios override via ctx.mockApiResponse
  ctx.mockApiResponse   = null;
  ctx.mockApiReturnEra  = null;
  ctx.mockBellScore     = null;

  return ctx;
}

// ── DOM helpers ───────────────────────────────────────────────────────────────

function el(ctx, id) {
  const e = ctx.document.getElementById(id);
  if (!e) throw new Error(`#${id} not found in DOM`);
  return e;
}

function qs(ctx, selector) {
  const e = ctx.document.querySelector(selector);
  if (!e) throw new Error(`No element matching "${selector}"`);
  return e;
}

function qsa(ctx, selector) {
  return Array.from(ctx.document.querySelectorAll(selector));
}

function click(ctx, id) {
  el(ctx, id).click();
}

function clickSelector(ctx, selector) {
  qs(ctx, selector).click();
}

function setInputValue(ctx, id, value) {
  const input = el(ctx, id);
  input.value = value;
  input.dispatchEvent(new ctx.window.Event('input', { bubbles: true }));
}

function selectOption(ctx, id, value) {
  const select = el(ctx, id);
  select.value = value;
  select.dispatchEvent(new ctx.window.Event('change', { bubbles: true }));
}

function isVisible(ctx, id) {
  const e = ctx.document.getElementById(id);
  if (!e) return false;
  const style = ctx.window.getComputedStyle(e);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

function hasClass(ctx, id, cls) {
  return el(ctx, id).classList.contains(cls);
}

function textContains(ctx, selector, str) {
  const e = ctx.document.querySelector(selector);
  if (!e) return false;
  return e.textContent.includes(str);
}

// ── waitFor ───────────────────────────────────────────────────────────────────

async function waitFor(condition, timeoutMs = 2000, intervalMs = 50) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (condition()) return true;
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error(`waitFor timed out after ${timeoutMs}ms — condition: ${condition.toString()}`);
}

// ── Fake timer (for banner dismiss tests) ────────────────────────────────────

function advanceTimers(ctx, ms) {
  // Calls any setTimeout handlers registered on ctx.window that fire within ms
  // Requires the app to use ctx.window.setTimeout, which JSDOM routes correctly
  // when runScripts: 'dangerously' is set.
  // Simple approach: just wait in real time for a very short settle.
  return new Promise(r => setTimeout(r, ms > 1000 ? 10 : ms));
}

module.exports = {
  setupCleanState,
  waitFor,
  el, qs, qsa,
  click, clickSelector,
  setInputValue, selectOption,
  isVisible, hasClass, textContains,
  advanceTimers
};
