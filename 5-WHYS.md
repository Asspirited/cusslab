# 5 Whys — Bug Log

---

## B6 — API key input reverts to old value after saving

**Bug:** Rod saves a new API key. The green "✓ Key saved!" message appears. The input field shows the
old key value instead of the masked new key — or reverts to the old value shortly after saving.

**Why 1:** `updateKeyStatus()` unconditionally sets `settings-key-input.value` every time it is called,
including from async contexts (`_logError`, post-API-call success handler).

**Why 2:** `updateKeyStatus()` was designed as a general-purpose UI refresh function and was wired into
every state-change path without considering that it would fire while the user is actively editing the input.

**Why 3:** No pre-implementation checklist was produced for the settings save flow. The entry points
(page load, button click, async API completion, error logging) were never enumerated, so the async
overwrite path was never identified as a risk.

**Why 4:** TDD was not applied. No failing test existed for "async updateKeyStatus does not overwrite
a focused input". The behaviour was considered implicitly correct because it worked in the happy path
(no concurrent API calls).

**Why 5:** Code was written before the requirement was understood. The discipline of writing the test
first — which forces enumeration of all entry points and failure modes — was skipped.

**Fix:** In `updateKeyStatus()`, guard the `inp.value` assignment with `document.activeElement !== inp`.
This prevents async callbacks from overwriting the textarea while the user has focus on it.

**Test added at:** Why 1 level — Gherkin scenario "Async status update does not overwrite input while
user is focused on it" in specs/settings.feature.

**Commit:** fix: prevent async updateKeyStatus from reverting key input while user edits (Bug 6)

---

## B5 — Generic API error message shown to user

**Bug:** When an API call fails, the user sees a generic or unhelpful error message ("unavailable")
instead of a specific, actionable one.

**Status:** OPEN — 5 Whys documented, fix pending.

**Why 1:** Error handling in panel modules falls through to a generic catch clause that does not
use `_userMessage()`.

**Why 2:** `_userMessage()` was added to the API module but panel modules that were written before
it existed were not updated to use it.

**Why 3:** No Gherkin scenario existed for error states. The happy path was tested implicitly
(by Rod using the app); error paths were never enumerated.

**Why 4:** BDD was not applied. If an error-path scenario had existed before the panel modules
were written, the test would have forced each module to handle errors consistently.

**Why 5:** Same root as B6 — code written before behaviour was specified. Gherkin written
reactively after bugs, not proactively before features.

**Fix:** Update each panel module's catch clause to call `API._userMessage()` (or expose it
publicly) and display the result. Verify against each HTTP status code in STANDARDS.md.

**Test added at:** Why 1 level — Gherkin scenario to be written in specs/api-errors.feature.
