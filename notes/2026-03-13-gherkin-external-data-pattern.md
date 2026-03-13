# Gherkin Step Defs: External Data File Pattern

Session: 2026-03-13 (context continuation — BL-130 fix)

## Problem
Step defs that checked member data for The Crucible Corner used the "search IIFE HTML slice"
pattern from earlier panels (Golf, Racing). Those panels inlined all data in the IIFE.

Crucible Corner externalised data to `src/data/crucible-corner-data.js` (same pattern as
`final-furlong-data.js`). The IIFE references the global `SNOOKER_MEMBERS` at runtime, but
does not repeat the member definitions. So `html.slice(snStart, snStart + 25000)` didn't
find `id: 'jimmy_white'` — it's in the separate file.

## Fix / Pattern
When a panel's data lives in an external file, step defs must `require()` that file directly:

```javascript
const data = require(path.join(__dirname, '..', 'src', 'data', 'crucible-corner-data.js'));
if (!data.SNOOKER_MEMBERS.some(m => m.id === memberId))
  throw new Error(`SNOOKER_MEMBERS does not include member "${memberId}"`);
```

Never search the IIFE HTML slice for data that is defined in an external file.

## Rule
- Data in IIFE → search HTML slice
- Data in external file → require() the file

The data file already has a `module.exports` guard for Node. Always include this guard when
creating data files that need to be testable via gherkin-runner.js.

## WL-137 — this mistake was caught at pipeline (zero user impact). Closed same session.
