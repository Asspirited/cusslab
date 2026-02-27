# 5 Whys — Root Cause Analysis Log

Every bug found by Rod gets a 5 Whys entry here before the fix is applied.
The goal is not to blame — it is to find the deepest fixable cause.

---

## Bug 1 — Settings tab did nothing when clicked (2026-02-26)

**What Rod saw:** Clicking Settings & API Key in sidebar had no effect.

**Why 1:** The `settings` tab was missing from the `SKIN_CONFIGS.consultant.tabs` array, so `switchTab()` rejected it silently.

**Why 2:** The panel and nav item were added to the HTML but the registration step was skipped.

**Why 3:** There was no test that verified every nav tab was registered before shipping.

**Why 4:** TDD was not applied — implementation was written without a failing test first. A failing test would have required thinking through all the places a panel needs to be registered.

**Why 5:** The discipline of writing the test first was abandoned in favour of appearing to make fast progress.

**Test added at:** Why 3 — UI Audit check 3: "All panel IDs registered in SKIN_CONFIGS consultant"

---

## Bug 2 — Duplicate ExperimentRunner module causing SyntaxError (2026-02-26)

**What Rod saw:** All sidebar buttons did nothing. Console showed `Uncaught SyntaxError`.

**Why 1:** `const ExperimentRunner` was declared twice in the same script block, which is a JS syntax error.

**Why 2:** A second ExperimentRunner module was added during API key work and inserted without checking for an existing declaration.

**Why 3:** There was no test that checked for duplicate `const` declarations in the script.

**Why 4:** Code was written and shipped without running a syntax check or reading the file as a whole to understand what already existed.

**Why 5:** Same root cause as Bug 1 — optimising for speed of output over correctness of process. Also: Single Responsibility was violated — the API key feature touched unrelated parts of the file.

**Test added at:** Why 3 — Browser Sim check 1: "JavaScript has no syntax errors (node --check)"

---

## Bug 3 — Inline `<script>` in Settings panel crashing app on load (2026-02-26)

**What Rod saw:** All sidebar buttons did nothing. Console showed `Uncaught ReferenceError: API is not defined at line 1665`.

**Why 1:** A `<script>` tag inside the Settings panel HTML called `API.getKey()` at parse time, before the API module was declared.

**Why 2:** An inline script was placed inside panel markup without considering when browsers execute inline scripts (immediately, as the HTML is parsed).

**Why 3:** There was no test checking for inline scripts in the body that reference app modules before declaration.

**Why 4:** The pre-implementation checklist was not used. Question 2 ("what must exist before this runs?") and Question 4 ("silent failure modes — loading order") would have caught this immediately.

**Why 5:** The pre-implementation checklist did not exist as a mandatory step. Even when it was later written, the discipline of applying it before every change was not enforced.

**Test added at:** Why 3 — Browser Sim check 2: "No inline `<script>` tags in body reference app modules before declaration"

---

## Bug 4 — [This expert is unavailable.] shown instead of actionable error (2026-02-26)

**What Rod saw:** After getting the app to load, clicking Ask The Panel showed `[This expert is unavailable.]` for every expert.

**Why 1:** The `catch` block in `Bills.ask()` showed a generic hardcoded string instead of the actual error.

**Why 2:** Error handling was written to hide failures rather than surface them. The API call was failing but the user had no way to know why.

**Why 3:** No test existed that verified the error message was actionable for specific failure cases (no key, bad key, rate limit, network failure).

**Why 4:** BDD was not applied — no Gherkin scenario existed for "what does the user see when the API call fails." If it had, the scenario would have specified the expected message and the generic string would have failed it.

**Why 5:** Same root cause running through all bugs: implementation was written before behaviour was specified. The test defines the contract. Without the test, the contract doesn't exist, and any implementation passes.

**Test added at:** Why 3 — Unit tests for `_userMessage()` covering all HTTP status codes; Gherkin scenarios in specs/logging.feature

---

## Bug 5 — "Request failed — if this persists, check status.anthropic.com" (2026-02-26)

**What Rod saw:** After saving API key and clicking Ask The Panel, a generic fallback error message appeared.

**Why 1:** The HTTP status code returned by Anthropic was not in the explicit list in `_userMessage()`, so it fell through to the generic fallback.

**Why 2:** The status code mapping was written based on assumed status codes, not verified against what Anthropic actually returns in each scenario.

**Why 3:** No integration test existed that simulated actual Anthropic error responses and verified the message shown.

**Why 4:** Tests for `_userMessage()` were written after the implementation, testing the codes that were already handled — confirming the code rather than specifying the contract.

**Why 5:** TDD was not applied. The unit tests for `_userMessage()` should have been written first, covering every possible Anthropic status code. Writing them first would have forced the question: "what does Anthropic actually return, and have I handled all of it?"

**Root cause common to all 5 bugs:** Implementation is written before behaviour is specified. Tests are written to confirm code rather than to define contracts. The fix is not more tests — it is applying TDD and BDD as the only acceptable sequence.

**Test added at:** Why 3 — unit tests for `_userMessage()` with all status codes. Still needs: actual Anthropic error response verified in console by Rod before this can be fully closed.

**Status: OPEN** — waiting for Rod to confirm actual status code from console.

---

## Bug 6 — UI Audit checks invented elements never in approved Gherkin (2026-02-27)

**What Rod saw:** Pipeline RED — audit checking for `key-status-indicator`, `Save Key` button, `Clear Key` button, and `function switchTab` — none of which exist in `index.html` or are required by any approved scenario.

**Why 1:** `pipeline/ui-audit.js` was written with checks that don't match what `index.html` actually contains — `key-status-indicator`, `Save Key`, `Clear Key`, and `switchTab` were invented in the audit but never implemented.

**Why 2:** The audit was written independently of the approved Gherkin scenarios in `specs/settings.feature`. It specified its own version of what the Settings panel "should" have, rather than deriving checks from the agreed specification.

**Why 3:** There is no process gate requiring that every audit check can be traced to an approved Gherkin scenario. Checks were added based on what the author assumed the feature needed.

**Why 4:** The audit was treated as a place to define requirements, not verify them. Requirements belong in Gherkin scenarios, approved by Rod, before any code or tests are written.

**Why 5:** Same root cause as every prior bug: specification and implementation were decoupled. The audit author wrote what they thought the feature should look like, bypassing the Three Amigos / Gherkin approval gate entirely.

**Fix applied:** Removed checks for `key-status-indicator`, `Save Key`, `Clear Key`. Fixed `switchTab` → `switchTo` to match the actual function declared in `index.html`. Source of truth is `specs/settings.feature`.

**Test added at:** Why 3 — process rule: every UI audit check must map to a line in an approved `.feature` file.

---

## Bug 7 — Browser Sim checking implementation details, not observable behaviour (2026-02-27)

**What Rod saw:** Pipeline RED with 8 failing Browser Sim checks for `State` module, `setKey`/`getKey`/`updateKeyStatus` in API module, `activeElement` guard, and `initKeyUI` — none of which exist in `index.html` and none of which correspond to any approved Gherkin scenario.

**Why 1:** `pipeline/browser-sim.js` was written to check internal implementation structure (module names, function names, internal call sequences) rather than observable behaviour derivable from Gherkin scenarios.

**Why 2:** The checks were invented by the author based on what they expected the implementation to look like — a `State` module, an `API` module containing key functions, a specific `activeElement` guard. The actual code uses `Storage`, not `State` or `API`, for key management.

**Why 3:** There is no rule requiring every pipeline check to be traceable to an approved Gherkin scenario. Checks were added freely based on implementation assumptions.

**Why 4:** The pipeline was treated as a place to enforce architecture preferences rather than verify user-observable contracts. Only Gherkin scenarios approved by Rod define what the app must do. Pipeline checks verify that the code satisfies those contracts — not that the code looks a particular way internally.

**Why 5:** Same root cause as every prior bug: the author specified what they thought the implementation should be, bypassing the agreed process. Tests must be derived from contracts (Gherkin), not written to confirm code that hasn't been agreed.

**Fix applied:** Removed all 8 implementation-detail checks. Kept only checks that verify observable structural invariants (syntax, module load order, no raw fetch outside API boundary).

---

## Pattern across all bugs

Every single bug has the same Why 5:
> Implementation was written before behaviour was specified. Tests confirmed code rather than defined contracts.

The fix is behavioural, not technical. Write the test first. Always.
