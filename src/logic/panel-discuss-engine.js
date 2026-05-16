// src/logic/panel-discuss-engine.js
// Pure logic for the shared panel discussion orchestrator (BL-162).
// No browser globals, no network calls, no persistent storage. Stateless.
// Per-panel IIFEs load this module and delegate speaker selection
// (and later in subsequent slices, prompt assembly, voice pool injection,
// state mutation) to these functions.
//
// Slice 0 — Speaker selection (selectSlots).
// Future slices: prompt-assembly, voice-pool-selector, state mutation.
//
// Principles governing this module: see .claude/principles/panel-design.md.
//   1. One engine, many panels — no per-panel duplication.
//   2. React to the person, not the topic.
//   3. Engine ignorance, voice expression — engine does not verify accuracy.

// selectSlots — picks the speaker order for a single round.
//
// INPUT  (panelData):
//   {
//     anchor:        string           — character id, opens slot 0 and closes slot N
//     middleCast:    string[]         — non-anchor character ids in the desired middle order
//     includeTheDon: boolean (opt)    — when true, "alliss" is prepended to the middle (Golf only)
//   }
//
// RETURN: string[]
//   Ordered slot list: anchor at index 0, middleCast (with optional "alliss" prepended)
//   in slots 1..N-1, anchor at the final index N.
//
// THROWS:
//   - if anchor is missing or empty
//   - if middleCast is not an array
//   - if anchor appears in middleCast (anchor must be distinct from the middle)
function selectSlots(panelData) {
  if (!panelData || typeof panelData !== 'object') {
    throw new Error('selectSlots: panelData object required');
  }
  const { anchor, middleCast, includeTheDon } = panelData;
  if (!anchor || typeof anchor !== 'string') {
    throw new Error('selectSlots: anchor string required');
  }
  if (!Array.isArray(middleCast)) {
    throw new Error('selectSlots: middleCast array required');
  }
  if (middleCast.includes(anchor)) {
    throw new Error('selectSlots: anchor must not appear in middleCast');
  }
  const middleOrder = includeTheDon ? ['alliss', ...middleCast] : middleCast;
  return [anchor, ...middleOrder, anchor];
}

const _PanelDiscussEngineExports = { selectSlots };

// Browser: expose as global so per-panel IIFEs can call PanelDiscussEngine.selectSlots(...)
if (typeof window !== 'undefined') window.PanelDiscussEngine = _PanelDiscussEngineExports;

// Node (pipeline unit tests) export
if (typeof module !== 'undefined') module.exports = _PanelDiscussEngineExports;
