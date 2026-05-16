// src/logic/idiom-engine.js
// Pure logic for character idiom invention prompt blocks (BL-174 v1).
// No DOM, no network I/O, no persistent storage. Stateless.
// Loaded by index.html (browser global IdiomEngine) and by pipeline/unit-runner.js.
//
// Principles governing this module: see .claude/principles/panel-design.md.
//   1. One engine, many panels — buildIdiomBlock takes per-character profile data
//      as input; no panel hardcoded. Per-panel profile maps live in index.html.
//   3. Engine ignorance, voice expression — engine emits a prompt block; the
//      character voice (and the model) decides what idiom to actually invent,
//      misquote, or bastardise.
//
// buildIdiomBlock(charId, profile, opts) → string
//
// INPUT:
//   charId    string                        character id (e.g. "faldo")
//   profile   object | undefined            { modes: [...], register: string, frequency: string }
//                                           — typically the per-panel map lookup
//   opts      object (opt) — reserved for v2 (frequency cadence, trigger-score state)
//
// RETURN: string — empty when no profile or no modes; otherwise an IDIOM INSTRUCTION
//   block ready to concatenate into the character's system prompt.
//
// MODES (each profile lists one or more):
//   - misquote   — a well-known idiom used badly, as if remembered imperfectly
//   - bastardise — an existing idiom with one word swapped for a character-authentic
//                  swear or character-specific term (per Principle 5 register criteria)
//   - invent     — a brand-new phrase delivered with complete sincerity, as if proverbial
//
// v1 is prompt-side only: the block licenses the modes; the model self-paces.
// v2 (later) will add per-turn cadence + trigger-score integration. v3 will add
// code-side selection of specific idioms from a pool (BL-172 voice-pool pattern).

const MODE_DESCRIPTIONS = Object.freeze({
  misquote:   'misquote a well-known saying — use it badly, slightly wrong, as if you remember it imperfectly',
  bastardise: 'bastardise an existing idiom — swap one word for a register-authentic swear or character-specific term in your usual register',
  invent:     'invent a brand-new phrase delivered with complete sincerity, as if proverbial — your audience should briefly wonder if it is real',
});

function buildIdiomBlock(charId, profile, opts) {
  if (!profile || typeof profile !== 'object') return '';
  const modes = Array.isArray(profile.modes) ? profile.modes.filter(m => MODE_DESCRIPTIONS[m]) : [];
  if (modes.length === 0) return '';
  const register = (typeof profile.register === 'string' && profile.register.trim()) ? profile.register.trim() : '';
  const frequency = (typeof profile.frequency === 'string' && profile.frequency.trim())
    ? profile.frequency.trim()
    : 'once per turn maximum, sometimes not at all';
  const modeLines = modes.map(m => `  - ${m}: ${MODE_DESCRIPTIONS[m]}`).join('\n');
  const registerLine = register ? `\nRegister: ${register}.` : '';
  return `\n\nIDIOM INSTRUCTION: You may once this turn deploy an idiom in one of these modes:\n${modeLines}${registerLine}\nFrequency: ${frequency}. Deploy sparingly — if your turn does not need it, do not force it. When you do deploy, the idiom should sound natural in your voice — not a literary set-piece.\n`;
}

const _IdiomEngineExports = {
  MODE_DESCRIPTIONS,
  buildIdiomBlock,
};

if (typeof window !== 'undefined') window.IdiomEngine = _IdiomEngineExports;
if (typeof module !== 'undefined') module.exports = _IdiomEngineExports;
