// lint-steps.js — detect duplicate regex patterns in step definition arrays
// Contract: specs/gherkin-lint.feature
// Pure function — no side effects, no I/O

'use strict';

/**
 * lintStepDuplicates(steps)
 * @param {Array} steps - array of [RegExp, Function] pairs
 * @returns {Array<{pattern: string, count: number}>} collisions where count > 1
 */
function lintStepDuplicates(steps) {
  const counts = new Map();
  for (const [regex] of steps) {
    const key = regex.source;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const collisions = [];
  for (const [pattern, count] of counts) {
    if (count > 1) collisions.push({ pattern, count });
  }
  return collisions;
}

module.exports = { lintStepDuplicates };
