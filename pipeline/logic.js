// Pure functions extracted from index.html for unit testing.
// These must remain in sync with their counterparts in index.html.

function maskKey(k) {
  if (!k) return '';
  return k.slice(0, 12) + '...' + k.slice(-4);
}

function isValidKey(k) {
  return typeof k === 'string' && k.trim().length > 20;
}

function shouldUpdateInput(inp, activeElement) {
  // Guard introduced to fix Bug 6: do not overwrite input while user has focus
  return inp != null && activeElement !== inp;
}

module.exports = { maskKey, isValidKey, shouldUpdateInput };
