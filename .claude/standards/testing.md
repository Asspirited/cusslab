# Testing Standards — Heckler and Cocks

*Fifty Quick Ideas to Improve Your Tests — Adzic, Evans, Roden (2015)*
*Rod Roden is co-author.*

---

## TDD — Non-Negotiable

Seven steps. No deviation. No shortcut.

1. Write a failing unit test for the smallest unit of behaviour
2. Run it — confirm it fails for the right reason
3. Write the minimum code to make it pass
4. Run it — confirm it passes
5. Refactor — clean up without changing behaviour
6. Run it — confirm it still passes
7. Repeat for the next unit

**The test must exist before the code. Always.**
All 6 bugs on this project share the same root cause: tests were written after code,
confirming what the code did rather than specifying what it should do.

---

## Three Isolation Levels

Route every test to the right level. Using Level 3 for everything is slow and fragile.

**Level 1 — Unit isolation** (unit-runner.js)
No DOM. Pure function input/output. Use for:
- `computeF()`, `cultureScore()`, scoring engine logic
- String transformations, calculations, data mapping
- Fastest possible. No setup needed.

```javascript
test('computeF returns 0 for empty input', () => {
  assert.equal(computeF(''), 0);
});
```

**Level 2 — Component isolation** (Gherkin, panel-level)
Fresh DOM, single panel HTML only — not full application.
Use for: settings panel, individual panel responses, UI component behaviour.
Faster than full app load, still tests real browser behaviour.

**Level 3 — Full application isolation** (Gherkin, integration)
Full index.html, clean state, full initialisation.
Reserve for: interactions between panels, end-to-end journeys.
Slowest — use sparingly.

---

## Background Setup

Every feature file uses a Background for shared preconditions.
Background runs before every scenario automatically — consistently, impossible to forget.

```gherkin
Feature: Settings panel

  Background:
    Given the application is loaded with a clean state
    And no API key is saved

  Scenario: ...
```

---

## State Factories

Named states used in Background and Given steps.
Never construct state inline in a step definition.

```javascript
// pipeline/test-factories.js
const STATE = {
  cleanInstall: () => ({
    localStorage: {},
    apiKey: null,
    panelOpen: false
  }),
  withSavedApiKey: (key = 'sk-ant-test123') => ({
    localStorage: { 'heckler-api-key': key },
    apiKey: key
  }),
  withOpenSettings: (base = STATE.cleanInstall()) => ({
    ...base,
    activePanel: 'settings'
  })
};
```

---

## Test Context Object

One shared context object passed through all steps in a scenario.
HTML loaded once at module level — not per scenario.

```javascript
// pipeline/test-context.js
const rawHtml = fs.readFileSync('index.html', 'utf8'); // once

async function setupCleanState(context) {
  const dom = new JSDOM(rawHtml, { runScripts: 'dangerously' });
  context.window = dom.window;
  context.document = dom.window.document;
  dom.window.localStorage.clear();
  await waitFor(() => dom.window.document.getElementById('app-root') !== null);
  return context;
}
```

---

## After Hooks — Guaranteed Cleanup

```javascript
After(async function(scenario) {
  this.context.window.localStorage.clear();
  if (scenario.result.status === 'failed') {
    console.log('Failed state:', {
      localStorage: JSON.stringify(this.context.window.localStorage),
      activePanel: this.context.document.querySelector('.panel.active')?.id
    });
  }
});
```

---

## Wait for Events, Not Time

Never use setTimeout as test synchronisation.

```javascript
// BAD — slow, fragile
await new Promise(resolve => setTimeout(resolve, 500));

// GOOD — fast, reliable
async function waitFor(condition, timeout = 2000, interval = 50) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (condition()) return true;
    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error('Timeout waiting for condition');
}
```

---

## Then Steps Must Test Observable DOM State

The Bug 6 false green happened because Then tested a mock call, not the DOM.

```javascript
// BAD — tests implementation
Then('the key should be saved', async function() {
  assert.ok(mockStorage.setItem.called); // what the code did
});

// GOOD — tests what Rod sees
Then('the input field should display {string}', async function(expected) {
  const input = this.context.document.getElementById('api-key-input');
  assert.equal(input.value, expected); // what Rod sees in the browser
});
```

---

## Key Ideas from Fifty Quick Ideas (applied here)

**Generating test ideas:**
- Define a shared big-picture view of quality — Pipeline Report is this made visible
- Explore capabilities, not features — scenarios describe what the product enables
- Test benefit as well as implementation — if Rod wouldn't notice it breaking, question the test
- Document trust boundaries — user API key / Anthropic API boundary needs explicit scenarios

**Designing good checks:**
- Focus on key examples — 1 happy path, 1 failure, 1 edge case. More than 5 = smell.
- Contrast with counter-examples — every "works" scenario needs a "fails" counterpart
- Describe what, not how — observable outcomes only, never implementation steps
- Flip equivalence classes — don't test every culture variant if the logic is the same

**Improving testability:**
- Separate integration from logic — scoring engine testable without API
- Wait for events not time — never setTimeout for synchronisation
- Control your time — make timestamps injectable if features depend on them

**Managing test suites:**
- Version control tests alongside code — specs/ lives in the same repo
- Don't organise by work items — Bug 6 scenario lives in specs/settings.feature, not specs/bug6.feature
- Give tests a half-life — any refactor triggers review of the relevant spec
- Check for symmetry — missing coverage for error paths is almost always a symmetry gap

---

## Coverage Minimums

Statements: ≥ 40%
Branches:   ≥ 30%

These are floors, not targets. Coverage achieved by writing scenarios to hit
the number is worse than no coverage — it creates false confidence.
Coverage must come from genuine scenario writing driven by Rod's priorities.

---

## Test Suite Health Checks (every session)

- Pending scenario count: must decrease or hold, never increase without a plan
- False green count: must be zero (pipeline actively misled = worst failure)
- Rod-caught count: must trend to zero over time
- After hook failures: any scenario leaving dirty state is flagged
