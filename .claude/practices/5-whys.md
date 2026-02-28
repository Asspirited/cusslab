# 5 Whys — Practices
# Heckler and Cox
# Last updated: 2026-02-28
# Principles: see .claude/principles/lean.md, systems-thinking.md
# Reference: Taiichi Ohno — Toyota Production System (1978)

---

## When to Run a 5 Whys

**Mandatory triggers:**
- Any Rod-caught bug (caught in browser, not pipeline)
- Any false green (pipeline passed, behaviour was wrong)
- Any process violation (step out of order in integrated cycle)

**Run in the same session the bug was caught. Not deferred.**

---

## The Procedure

1. State the problem as a specific, observable fact.
   Not: "the tests are bad"
   Yes: "Rod caught a bug in the browser that the pipeline did not catch"

2. Ask "Why did this happen?" Write the answer.

3. Ask "Why did THAT happen?" Write the answer.

4. Repeat until you reach a root cause — something systemic, not a one-off.
   A root cause is something that, if fixed, prevents the whole chain from recurring.
   Usually 4-6 whys. Stop when the answer is a system or process, not a person or event.

5. Identify the corrective action — which file changes, which process changes.

6. Log in the session retrospective.

---

## Example — Bug 6 (API key revert)

**Problem:** Rod saved a new API key. On next load, the old masked key appeared instead of the new one.

**Why 1:** The input field showed the old value after save.
→ Because the save function updated localStorage but the field was re-populated from the old value.

**Why 2:** The field was re-populated from the old value.
→ Because the load function ran after save and overwrote the field.

**Why 3:** The pipeline did not catch this.
→ Because the Gherkin Then step asserted mockStorage.setItem was called, not that the DOM showed the correct value.

**Why 4:** The Then step asserted a mock call instead of DOM state.
→ Because the Gherkin runner used mocks — it could not access real DOM state.

**Why 5:** The runner used mocks instead of real DOM.
→ Because JSDOM was not installed. The architecture did not support real DOM testing.

**Root cause:** Architecture prevented observable DOM state testing.
**Corrective action:** JSDOM adoption (decided 2026-02-27). Then steps now assert DOM state.

---

## Ishikawa (Fishbone) — When to Use Instead

Use Ishikawa when the problem has multiple contributing causes that interact.
5 Whys finds one root cause chain. Ishikawa maps multiple cause categories.

**Ishikawa categories for software:**
- Process (steps skipped, wrong order)
- People (knowledge gap, communication failure)
- Technology (wrong tool, missing capability)
- Environment (external dependency, billing failure)
- Standards (missing rule, ambiguous rule)

Use Ishikawa when a 5 Whys produces multiple "Why 1" answers that are all true.
That signals a multi-cause problem — map all causes before choosing corrective action.

---

## Our Root Cause Log

All bugs to date share the same root cause: architecture prevented real DOM testing.
One root cause. Multiple symptoms. One fix (JSDOM).

If the next bug has a different root cause, that is progress.
If the next bug has the same root cause, that is a systemic failure — escalate immediately.
