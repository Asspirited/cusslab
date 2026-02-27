// pipeline/metrics-report.js — Reads metrics JSONL files and prints summary
// Run standalone: node pipeline/metrics-report.js
// Also called automatically at the end of every pipeline run by run-all.js

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT         = path.join(__dirname, '..');
const METRICS_DIR  = path.join(ROOT, 'metrics');
const BUILDS_FILE  = path.join(METRICS_DIR, 'builds.jsonl');
const DEFECTS_FILE = path.join(METRICS_DIR, 'defects.jsonl');

// ── JSONL reader ──────────────────────────────────────────────────────────────

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8')
    .split('\n')
    .filter(l => l.trim())
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
}

// ── Load data ─────────────────────────────────────────────────────────────────

const builds  = readJsonl(BUILDS_FILE);
const defects = readJsonl(DEFECTS_FILE);

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

// ── DEFECT TRENDS ─────────────────────────────────────────────────────────────

const totalDefects    = defects.length;
const rodCaught       = defects.filter(d => d.discoveredBy === 'rod').length;
const pipelineCaught  = defects.filter(d => d.discoveredBy === 'pipeline').length;
const openDefects     = defects.filter(d => d.fixedSession === null);
const closedDefects   = defects.filter(d => d.fixedSession !== null);

const leadTimes = closedDefects.map(d => d.fixedSession - d.discoveredSession);
const avgLeadTime = leadTimes.length ? (leadTimes.reduce((a,b)=>a+b,0)/leadTimes.length).toFixed(1) : 'n/a';

// ── CRITICALITY BREAKDOWN ─────────────────────────────────────────────────────

const critCounts = { high: 0, medium: 0, low: 0 };
defects.forEach(d => { if (critCounts[d.criticality] !== undefined) critCounts[d.criticality]++; });

// ── ROOT CAUSE PATTERNS ───────────────────────────────────────────────────────

const rcMap = {};
defects.forEach(d => {
  const key = `${d.rootCause?.category} / ${d.rootCause?.subcategory}`;
  rcMap[key] = (rcMap[key] || 0) + 1;
});
const rcEntries = Object.entries(rcMap).sort((a, b) => b[1] - a[1]);
const RECUR_THRESHOLD = 3; // taxonomy validationRules.recurrenceFlag

// ── PROCESS FAILURES ──────────────────────────────────────────────────────────

const pfMap = {};
defects.forEach(d => (d.processFailures || []).forEach(pf => {
  pfMap[pf] = (pfMap[pf] || 0) + 1;
}));
const pfEntries = Object.entries(pfMap).sort((a, b) => b[1] - a[1]);

// ── FALSE GREENS ──────────────────────────────────────────────────────────────

const totalFalseGreens = defects.reduce((sum, d) => sum + (d.falseGreens || 0), 0);

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
console.log('\n  Defect Trends');
console.log(`  ${D}`);
if (totalDefects === 0) {
  console.log('  No defect records yet.');
} else {
  console.log(`  Total bugs logged:         ${totalDefects}`);
  console.log(`  Rod-caught:                ${pct(rodCaught, totalDefects)}  (${rodCaught}/${totalDefects})`);
  console.log(`  Pipeline-caught:           ${pct(pipelineCaught, totalDefects)}  (${pipelineCaught}/${totalDefects})`);
  console.log(`  Open:                      ${openDefects.length}${openDefects.length ? '  (' + openDefects.map(d=>d.id).join(', ') + ')' : ''}`);
  console.log(`  Avg lead time (closed):    ${avgLeadTime} session${avgLeadTime !== '1.0' && avgLeadTime !== 'n/a' ? 's' : ''}`);
}

// Criticality Breakdown
console.log('\n  Criticality Breakdown');
console.log(`  ${D}`);
console.log(`  high:      ${critCounts.high}`);
console.log(`  medium:    ${critCounts.medium}`);
console.log(`  low:       ${critCounts.low}`);

// Root Cause Patterns
console.log('\n  Root Cause Patterns');
console.log(`  ${D}`);
if (!rcEntries.length) {
  console.log('  No defect records yet.');
} else {
  for (const [key, count] of rcEntries) {
    const flag = count >= RECUR_THRESHOLD ? '  [recurring ▲]' : '';
    console.log(`  ${key}:  ${count}${flag}`);
  }
}

// Process Failures
if (pfEntries.length) {
  console.log('\n  Process Failures');
  console.log(`  ${D}`);
  for (const [pf, count] of pfEntries) {
    console.log(`  ${pf}:  ${count}`);
  }
}

// False Greens
console.log('\n  False Greens');
console.log(`  ${D}`);
console.log(`  Total false green runs:    ${totalFalseGreens}${totalFalseGreens > 0 ? '  ⚠ pipeline passed but rod-caught bug was untested' : '  ✓ none recorded'}`);

console.log(`\n${H}\n`);
