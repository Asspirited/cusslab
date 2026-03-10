// pipeline/metrics-report.js — Reads metrics JSONL files and prints summary
// Run standalone: node pipeline/metrics-report.js
// Also called automatically at the end of every pipeline run by run-all.js

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT         = path.join(__dirname, '..');
const METRICS_DIR  = path.join(ROOT, 'metrics');
const BUILDS_FILE  = path.join(METRICS_DIR, 'builds.jsonl');
const WASTE_LOG    = path.join(ROOT, '.claude', 'practices', 'waste-log.md');

// ── JSONL reader ──────────────────────────────────────────────────────────────

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8')
    .split('\n')
    .filter(l => l.trim())
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
}

// ── Waste log bug reader ───────────────────────────────────────────────────────
// Reads WL entries tagged with "bug" from waste-log.md.
// Each entry: { id, rodCaught, pipelineCaught, open, falseGreen }

function readBugsFromWasteLog() {
  if (!fs.existsSync(WASTE_LOG)) return [];
  const lines = fs.readFileSync(WASTE_LOG, 'utf8').split('\n');
  const bugs = [];
  let current = null;

  for (const line of lines) {
    const wlMatch = line.match(/^## (WL-\d+)/);
    if (wlMatch) {
      if (current) bugs.push(current);
      current = { id: wlMatch[1], rodCaught: false, pipelineCaught: false, open: true, falseGreen: false };
      continue;
    }
    if (!current) continue;
    const tagsMatch = line.match(/\*\*Tags:\*\*\s*(.+)/);
    if (tagsMatch) {
      const tags = tagsMatch[1].toLowerCase();
      if (!tags.includes('bug')) { current = null; continue; } // not a bug entry — discard
      current.rodCaught      = tags.includes('rod-caught');
      current.pipelineCaught = tags.includes('pipeline-caught');
      current.falseGreen     = tags.includes('false-green');
    }
    if (line.match(/\*\*Status:\*\*.*Closed/i) && current) {
      current.open = false;
    }
  }
  if (current) bugs.push(current);
  return bugs.filter(b => b.rodCaught || b.pipelineCaught); // only confirmed bug entries
}

// ── Load data ─────────────────────────────────────────────────────────────────

const builds = readJsonl(BUILDS_FILE);
const bugs   = readBugsFromWasteLog();

// ── Helpers ───────────────────────────────────────────────────────────────────

function avg(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function pct(n, total) {
  if (!total) return '0%';
  return `${Math.round((n / total) * 100)}%`;
}

function trend(values) {
  if (values.length < 2) return '→';
  const first = values[0], last = values[values.length - 1];
  const delta = last - first;
  if (delta > first * 0.05) return '↑'; // >5% slower
  if (delta < -first * 0.05) return '↓'; // >5% faster
  return '→';
}

// ── BUILD STABILITY ───────────────────────────────────────────────────────────

const recent5   = builds.slice(-5);
const allTimes  = recent5.map(b => b.totalDurationMs).filter(Boolean);
const avgTime   = avg(allTimes);
const timeTrend = trend(allTimes);

// Slowest step average across all builds
const stepKeys  = ['uiAudit','browserSim','unitTests','gherkin','coverage'];
const stepAvgs  = stepKeys.map(k => {
  const times = builds.map(b => b.steps?.[k]?.durationMs).filter(Number.isFinite);
  return { key: k, avg: avg(times) };
});
const slowest   = stepAvgs.sort((a, b) => b.avg - a.avg)[0];

// Failure rate
const totalBuilds   = builds.length;
const failedBuilds  = builds.filter(b => b.overallStatus === 'RED').length;
const failRate      = pct(failedBuilds, totalBuilds);

// Flaky steps — failed more than once
const flaky = stepKeys.filter(k => {
  const fails = builds.filter(b => b.steps?.[k]?.status === 'fail').length;
  return fails > 1;
});

// ── DEFECT TRENDS — sourced from waste-log.md (tag: bug) ─────────────────────

const totalBugs       = bugs.length;
const rodCaught       = bugs.filter(b => b.rodCaught).length;
const pipelineCaught  = bugs.filter(b => b.pipelineCaught).length;
const openBugs        = bugs.filter(b => b.open);
const totalFalseGreens = bugs.filter(b => b.falseGreen).length;

// ── OUTPUT ────────────────────────────────────────────────────────────────────

const D  = '─'.repeat(50);
const H  = '═'.repeat(50);

console.log(`\n${H}`);
console.log('  METRICS SUMMARY');
console.log(H);

// Build Stability
console.log('\n  Build Stability');
console.log(`  ${D}`);
if (totalBuilds === 0) {
  console.log('  No build records yet — run the pipeline first.');
} else {
  console.log(`  Sessions recorded:         ${totalBuilds}`);
  console.log(`  Last 5 avg build time:     ${avgTime ? avgTime.toLocaleString() + ' ms' : 'n/a'}  ${timeTrend}`);
  console.log(`  Slowest step avg:          ${slowest?.key || 'n/a'}  (${slowest?.avg?.toLocaleString() || 0} ms)`);
  console.log(`  Pipeline failure rate:     ${failRate}  (${failedBuilds}/${totalBuilds} sessions RED)`);
  if (flaky.length) {
    console.log(`  ⚠ Flaky steps (>1 fail):  ${flaky.join(', ')}`);
  } else {
    console.log('  Flaky steps:               none');
  }
}

// Defect Trends
console.log('\n  Defect Trends  (source: waste-log.md — tag: bug)');
console.log(`  ${D}`);
if (totalBugs === 0) {
  console.log('  No bug entries in waste log yet.');
} else {
  console.log(`  Total bugs logged:         ${totalBugs}`);
  console.log(`  Rod-caught:                ${pct(rodCaught, totalBugs)}  (${rodCaught}/${totalBugs})`);
  console.log(`  Pipeline-caught:           ${pct(pipelineCaught, totalBugs)}  (${pipelineCaught}/${totalBugs})`);
  console.log(`  Open:                      ${openBugs.length}${openBugs.length ? '  (' + openBugs.map(b=>b.id).join(', ') + ')' : ''}`);
}

// False Greens
console.log('\n  False Greens');
console.log(`  ${D}`);
console.log(`  Total false green runs:    ${totalFalseGreens}${totalFalseGreens > 0 ? '  ⚠ pipeline passed but rod-caught bug was untested' : '  ✓ none recorded'}`);

console.log(`\n${H}\n`);
