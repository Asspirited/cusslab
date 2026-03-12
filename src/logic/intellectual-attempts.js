// src/logic/intellectual-attempts.js
// Pure logic for the IntellectualAttempts behaviour class.
// No DOM, no API. Depends on src/data/intellectual-attempts-config.js.

const _iaData = typeof require !== 'undefined'
  ? require('../data/intellectual-attempts-config.js')
  : { ATTEMPT_KEYWORDS: window.ATTEMPT_KEYWORDS, INTELLECTUAL_ATTEMPTS_CONFIG: window.INTELLECTUAL_ATTEMPTS_CONFIG };

const _ATTEMPT_KEYWORDS           = _iaData.ATTEMPT_KEYWORDS;
const _INTELLECTUAL_ATTEMPTS_CONFIG = _iaData.INTELLECTUAL_ATTEMPTS_CONFIG;

/**
 * Detects an intellectual attempt type from input text.
 * Returns the attempt type string (e.g. 'ATTEMPT_IRONY') or null.
 */
function detectIntellectualAttempt(inputText) {
  const lower = (inputText || '').toLowerCase();
  for (const keyword of Object.keys(_ATTEMPT_KEYWORDS)) {
    if (lower.includes(keyword)) return _ATTEMPT_KEYWORDS[keyword];
  }
  return null;
}

/**
 * Builds the system prompt instruction block for a given attempt type.
 * Uses the richer instruction text (index.html canonical version).
 */
function buildAttemptInstruction(characterConfig, attemptType) {
  const degree   = characterConfig.default_degree;
  const delivery = characterConfig.default_delivery;
  return `\n\nINTELLECTUAL_ATTEMPT: In this response, use ${attemptType}. Degree of success: ${degree}. Delivery mode: ${delivery}. Weave it naturally into your voice — do not announce it. Misuse the concept in a way consistent with your character. Reference the sporting-colemanballs patterns: tautology, irony-as-coincidence, literally-as-intensifier, named concept dropped wrongly.`;
}

/**
 * Injects an attempt instruction into a system prompt if the character
 * supports the detected attempt type.
 * Returns the augmented system prompt, or the original if no injection applies.
 */
function inject(panelId, characterId, systemPrompt, attemptType) {
  const panelConfig = _INTELLECTUAL_ATTEMPTS_CONFIG[panelId];
  if (!panelConfig) return systemPrompt;
  const charConfig = panelConfig[characterId];
  if (!charConfig) return systemPrompt;
  if (!charConfig.types.includes(attemptType)) return systemPrompt;
  return systemPrompt + buildAttemptInstruction(charConfig, attemptType);
}

const _iaExports = {
  ATTEMPT_KEYWORDS: _ATTEMPT_KEYWORDS,
  INTELLECTUAL_ATTEMPTS_CONFIG: _INTELLECTUAL_ATTEMPTS_CONFIG,
  detectIntellectualAttempt,
  buildAttemptInstruction,
  inject,
};

// Browser: expose as IntellectualAttemptsEngine global
if (typeof window !== 'undefined') window.IntellectualAttemptsEngine = _iaExports;

// Node (pipeline) export
if (typeof module !== 'undefined') module.exports = _iaExports;
