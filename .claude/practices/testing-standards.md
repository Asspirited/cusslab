# Testing Standards — Heckler and Cox
# Informed by: Cohn, Marick, Fowler, Beck, Hendrickson, Adzic, Rose
# Last updated: 2026-03-12
# Read when: designing any new test, diagnosing a false green, or adding new scripts to index.html

---

## The Testing Gap We Have (and Must Close)

**The fundamental problem:** Our pipeline runs in Node. The product runs in a browser.
Node and browser have different scope models. A bug that crashes the browser may be
invisible to every Node-based test. WL-125 is the proof: three external scripts
crashed in browser scope, pipeline GREEN, app broken for a full session.

---

## The Authorities and What They Teach Us

### Mike Cohn — Test Automation Pyramid
> Unit tests: many. Service/integration: some. UI/browser: few but essential.

We have the unit tests. We have zero browser-execution tests. The pyramid base is
solid; the apex is missing. A pyramid with no apex is a foundation that proves
the wall renders correctly while the roof is missing.

**Applied here:** At least one Playwright (or equivalent) smoke test per new external
script added to index.html — confirm the window global is set after page load.

---

### Brian Marick — Four-Quadrant Model (evolved by Adzic in "Fifty Quick Ideas to Improve Your Tests")
> Q1: Unit tests — technology-facing, team-supporting. ✅ We have these.
> Q2: Functional tests — business-facing, team-supporting (Gherkin/BDD). ✅ We have these.
> Q3: Exploratory — business-facing, product-critiquing. ✅ Rod does this (2c in startup).
> Q4: Non-functional (performance, security, browser compat) — technology-facing, product-critiquing. ❌ We have none.

**Applied here:** Q4 tests for us = browser runtime tests. Not optional extras.
The cross-script scope collision (WL-125) and the API 400 from empty user messages
(WL-126) are both Q4 failures. They cannot be caught by Q1 or Q2 tests alone.

---

### Elisabeth Hendrickson — "Explore It!" (testing as an activity, not a phase)
> Testing is not just verification. It is exploration: find what the specification
> missed. The spec said "buttons work." The spec did not say "buttons work when
> external scripts share a global scope."

**Applied here:** Rod's exploratory test (step 2c in session-startup.md) is the
only Q3/Q4 layer we currently have. It must stay. BL-118 and BL-119 reduce
the gap but do not replace Rod's eyes-on-product lens.

**Charter for the exploratory test (step 2c):**
> "Explore how the panels behave when the API returns errors."
> "Explore what happens when buttons are clicked before scripts load."
> "Explore every panel after a new external script is added."

---

### Kent Beck — TDD ("Test-Driven Development by Example")
> Write the failing test first. The test specifies the behaviour. The implementation
> makes it pass. No implementation without a failing test.

**Applied here (the rule we already have):**
- Gherkin gate: behaviour specified before code.
- Failing test gate: test written and confirmed failing before implementation.

**The gap (not yet implemented):**
- For new external scripts: write the browser-scope test before writing the script.
- For new API calls: write a test that confirms the request shape before writing the call.

---

### Martin Fowler — "Testing" (bliki) + Continuous Integration
> A build that takes longer than 10 minutes is a build that will be skipped.
> A test that cannot be run locally is a test that will be ignored.
> The cost of a false negative (pipeline RED when code is fine) is high.
> The cost of a false positive (pipeline GREEN when code is broken) is higher.

**Applied here:**
- Every pipeline step must be runnable with `node pipeline/<script>.js`.
- Playwright (headless) is acceptable if it runs in < 30 seconds locally.
- False greens (pipeline GREEN, product broken) are waste-log entries, not
  acceptable trade-offs.

---

### Gojko Adzic — "Specification by Example" + "Fifty Quick Ideas to Improve Your Tests"
> Tests should be specifications, not just safety nets. If you cannot read a test
> and understand the feature, the test is checking implementation, not behaviour.

**Applied here:**
> "Given the page loads, when all external scripts execute, then window.PubNavigatorEngine
> is defined." — This IS a specification. It tells us what "loaded correctly" means.

> "Given the Roast Room is visible, when the user types a title, then the ROAST IT
> button becomes enabled." — This IS a specification. It tells us what "enabled" means.

**The lesson from WL-125 and WL-126:** We had specifications (Gherkin) for the
panel behaviour, but no specification for the loading behaviour. Add loading
specifications to the pipeline.

---

### Seb Rose — "BDD Books" series (with Gaspar Nagy and Gojko Adzic)
> BDD is not about tools. It is about communication. Scenarios exist to bridge
> the gap between what the product owner wants and what the developer builds.
> A scenario that nobody reads is not BDD — it is just automated testing.

**Applied here:**
- Every new external script added: Three Amigos + Gherkin for "script loads
  correctly" before the file is written.
- Every new API call pattern (new arg shapes): Three Amigos + Gherkin for
  "call succeeds with valid input, fails gracefully with invalid input."

---

## Testing Rules — Applied to Cusslab

### Rule 1: New external script = new browser-scope test (BL-119 + BL-118)
When adding any `<script src="src/...">`:
1. Check: does this file declare top-level `const` names that exist in other scripts?
   Run ui-audit.js → BL-119 check (when implemented).
2. Write: a Gherkin scenario asserting the window global is set after page load.
3. Only then: write the script.

### Rule 2: New API call pattern = smoke-test the request shape
When using `API.call(system, user, maxTokens)`:
- `user` MUST be a non-empty string. Never `''`.
- If the content belongs in the system prompt only, use `'Respond now.'` as placeholder.
- Add this to the BDD step for the panel: "When the user submits, Then the API
  returns a response (not a 400 error)."

### Rule 3: No `alert()` — ever
All user-facing errors go through `UI.toast()`. `alert()` blocks the browser,
creates Chrome's "from cusslab-api..." modal, and bypasses all our error styling.
ui-audit.js check (add): assert zero `alert(` calls in inline script.

### Rule 4: Cross-module function wrappers are tested
Any `onclick` in a template literal that calls `Module.method()` must have:
1. A global function wrapper (existing ui-audit check).
2. The wrapper must catch and surface errors (not silently swallow them).

### Rule 5: Exploratory test scope (step 2c) must expand with the product
Rod's session-start exploratory test covers: Boardroom, Comedy Room, Football,
Golf, QuntumLeeks. As new panels ship, add them to the charter:
- Pub Crawl: select a scene, make a choice, expect an advisor response.
- Oracle: enter a valid postcode, click, expect three names.
- Writing Room: enter a topic, click, expect three author responses.
- Roast Room: enter a title, click, expect five author responses.

---

## When to Read This File

| Signal | Action |
|---|---|
| Adding a new `<script src>` to index.html | Read Rule 1 |
| Writing a new `API.call()` or `API.callJSON()` | Read Rule 2 |
| Writing any user-facing error handler | Read Rule 3 |
| Adding a panel button with `onclick` in a template literal | Read Rule 4 |
| Session start step 2c | Read Rule 5 |
| Pipeline RED with no code change | Diagnose false negative; check Node/browser scope gap |
| Pipeline GREEN but Rod reports broken | False green — WL entry immediately, then follow ci-cd.md Recovery Playbook |
