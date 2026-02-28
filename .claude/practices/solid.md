# SOLID & Clean Code — Practices
# Heckler and Cox
# Last updated: 2026-02-28
# Principles: see .claude/principles/xp.md (four rules of simple design)
# Reference: Robert C. Martin — Clean Code (2008), Clean Architecture (2017)

---

## SOLID — Applied to Single-File Architecture

SOLID principles apply within the module pattern constraint.
Each IIFE module is a class. Each exported function is a method.
The single-file constraint does not exempt us from these principles.

---

### S — Single Responsibility Principle

One module, one reason to change.
One function, one thing it does.

**Violation (open item):** _applySkin() currently handles both personality application
AND cultural calibration. Two reasons to change. Must be split.

**Correct pattern:**
```js
const applyPersonality = (panel, response) => { ... }   // one job
const applyCulture = (response, region) => { ... }       // one job
```

**Test:** can you describe what this function does in one sentence without using "and"?
If not, it has more than one responsibility.

---

### O — Open/Closed Principle

Open for extension, closed for modification.
New panels extend the panel config — they do not modify the scoring core.
New scoring dimensions extend the dimension array — they do not modify computeF().

**Correct pattern:**
```js
const PANELS = {
  heckler: { ... },
  suit: { ... },
  // new panel added here — core scoring untouched
};
```

---

### L — Liskov Substitution Principle

Panel objects must be interchangeable.
Any code that works with one panel must work with all panels.
If a new panel requires special-casing in the core, the interface is wrong.

**Test:** replace any panel object with any other. Does the code still work?

---

### I — Interface Segregation Principle

No module should depend on methods it does not use.
The scoring context does not need to know about panel personalities.
The panel context does not need to know about API token counts.
Keep interfaces minimal.

---

### D — Dependency Inversion Principle

Depend on abstractions, not concretions.
The scoring engine does not call the Anthropic API directly.
The panel context does not call fetch() directly.
The Cloudflare Worker is the concrete implementation — the domain depends on its interface.

---

## Clean Code Rules

**Function size:** 20 lines maximum. If it exceeds 20 lines, split it.
Not a guideline. A hard limit. If you cannot split it, the design is wrong.

**Naming:** honest names that reveal intent.
```js
// BAD
const x = compute(t, r);
const data = process(input);

// GOOD
const profanityScore = computeProfanityScore(text, region);
const panelResponse = generatePanelResponse(prompt);
```

**No magic strings:**
```js
// BAD
if (mode === 'unhinged') { ... }

// GOOD
const PROFANITY_MODES = { BOARDROOM: 'boardroom', WATER_COOLER: 'water_cooler', UNHINGED: 'unhinged' };
if (mode === PROFANITY_MODES.UNHINGED) { ... }
```

**No empty catch blocks (except localStorage):**
```js
// BAD
try { riskyOperation(); } catch (e) {}

// GOOD
try { riskyOperation(); } catch (e) { logError('riskyOperation failed', e); }
```

**Comments explain why, not what:**
```js
// BAD
// increment intensity
state.current_intensity += delta;

// GOOD
// repeat triggers spike above previous peak — panels remember being provoked
state.current_intensity = Math.max(state.peak_intensity + 1, state.current_intensity + delta);
```

---

## Refactoring Triggers (Step 6 of Integrated Cycle)

Run after every green test. Ask in order:

1. Does any function exceed 20 lines? → split
2. Does anything have more than one responsibility? → split
3. Are there magic strings? → extract to named constants
4. Are there empty catch blocks? → add error logging
5. Do comments explain what instead of why? → rewrite
6. Is there duplication? → extract to shared function
7. Can any name be made more honest? → rename

After refactoring: run tests again. Must still be green.
Never refactor on a red pipeline.
