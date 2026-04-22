#!/usr/bin/env node
/**
 * build-wall-walkers.js
 * Reads wall-walkers.html and embeds it into worker.js as a template literal.
 * Handles all escaping automatically — no more manual escape hell.
 *
 * Usage: node build-wall-walkers.js
 * Run before wrangler deploy.
 */

const fs = require('fs');
const path = require('path');

const WORKER_PATH = path.join(__dirname, 'worker.js');
const HTML_PATH = path.join(__dirname, 'wall-walkers.html');

// Read files
const worker = fs.readFileSync(WORKER_PATH, 'utf8');
const html = fs.readFileSync(HTML_PATH, 'utf8');

// Escape the HTML for embedding in a JS template literal:
// 1. Escape backticks: ` → \`
// 2. Escape ${: ${ → \${
// 3. Backslashes in the HTML that aren't already escaped stay as-is
//    (the template literal will interpret \n, \t etc. but that's fine for HTML)
const escaped = html
  .replace(/\\/g, '\\\\')  // escape backslashes first
  .replace(/`/g, '\\`')     // escape backticks
  .replace(/\$\{/g, '\\${'); // escape template expressions

// Find and replace the existing WALL_WALKERS const in worker.js
const START_MARKER = 'const SURVIVAL_SCHOOL_WALL_WALKERS = `';
const END_MARKER = '`;\n\nexport default {';

const startIdx = worker.indexOf(START_MARKER);
const endIdx = worker.indexOf(END_MARKER, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('ERROR: Could not find SURVIVAL_SCHOOL_WALL_WALKERS boundaries in worker.js');
  process.exit(1);
}

const newWorker = worker.substring(0, startIdx) +
  'const SURVIVAL_SCHOOL_WALL_WALKERS = `' + escaped + '`;\n\nexport default {' +
  worker.substring(endIdx + END_MARKER.length);

fs.writeFileSync(WORKER_PATH, newWorker);
console.log('wall-walkers.html embedded into worker.js (' + html.length + ' chars, ' + escaped.length + ' escaped)');
