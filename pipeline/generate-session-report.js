#!/usr/bin/env node
// pipeline/generate-session-report.js
// Reads .claude/reports/session-log.jsonl → writes .claude/reports/session-report.html
// Single responsibility: render trend dashboard from append-only session log.
// Run: node pipeline/generate-session-report.js

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT    = path.join(__dirname, '..');
const LOG     = path.join(ROOT, '.claude/reports/session-log.jsonl');
const OUT     = path.join(ROOT, '.claude/reports/session-report.html');

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8')
    .split('\n').filter(l => l.trim())
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
}

const sessions = readJsonl(LOG);

if (!sessions.length) {
  console.error('No session log entries found — run write-session-log.sh first');
  process.exit(1);
}

const latest = sessions[sessions.length - 1];

function statusDot(val) {
  if (val === 'green' || val === 'OK' || val === 'GREEN') return '<span class="dot green"></span>';
  if (val === 'red'   || val === 'RED')                   return '<span class="dot red"></span>';
  return '<span class="dot amber"></span>';
}

function trend(arr, key) {
  if (arr.length < 2) return '→';
  const prev = arr[arr.length - 2][key];
  const curr = arr[arr.length - 1][key];
  if (curr > prev) return '↑';
  if (curr < prev) return '↓';
  return '→';
}

const failureTrend  = trend(sessions, s => s.dora?.failure_rate);
const gherkinTrend  = trend(sessions, s => s.pipeline?.gherkin);
const unitTrend     = trend(sessions, s => s.pipeline?.unit);

function sparkline(values, colour) {
  if (values.length < 2) return '';
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = Math.round((i / (values.length - 1)) * 160);
    const y = Math.round(40 - ((v - min) / range) * 35);
    return `${x},${y}`;
  }).join(' ');
  return `<svg width="160" height="44" viewBox="0 0 160 44">
    <polyline points="${pts}" fill="none" stroke="${colour}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

const failureRates  = sessions.map(s => Math.round((s.dora?.failure_rate || 0) * 100));
const gherkinCounts = sessions.map(s => s.pipeline?.gherkin || 0);
const unitCounts    = sessions.map(s => s.pipeline?.unit || 0);
const openCounts    = sessions.map(s => s.backlog?.open || 0);

const rows = sessions.slice(-10).reverse().map(s => `
  <tr>
    <td>${s.session_date}</td>
    <td>${s.session || '—'}</td>
    <td>${s.commit}</td>
    <td>${statusDot(s.pipeline?.status)} ${s.pipeline?.status || '—'}</td>
    <td>${s.pipeline?.unit || 0}</td>
    <td>${s.pipeline?.gherkin || 0}</td>
    <td>${statusDot(s.pipeline?.canary)} ${s.pipeline?.canary || '—'}</td>
    <td>${Math.round((s.dora?.failure_rate || 0) * 100)}%</td>
    <td>${s.backlog?.open || 0}</td>
  </tr>`).join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Heckler and Cox — Session Dashboard</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0d1117; color: #e6edf3; padding: 24px; }
  h1 { font-size: 1.4rem; font-weight: 600; margin-bottom: 4px; }
  .sub { color: #8b949e; font-size: 0.85rem; margin-bottom: 24px; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .card { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 16px; }
  .card .label { font-size: 0.75rem; color: #8b949e; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 6px; }
  .card .value { font-size: 1.8rem; font-weight: 700; }
  .card .spark { margin-top: 8px; }
  .green  { color: #3fb950; }
  .red    { color: #f85149; }
  .amber  { color: #d29922; }
  .dot    { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
  .dot.green { background: #3fb950; }
  .dot.red   { background: #f85149; }
  .dot.amber { background: #d29922; }
  h2 { font-size: 1rem; margin-bottom: 12px; color: #8b949e; text-transform: uppercase; letter-spacing: .05em; }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  th { text-align: left; padding: 8px 12px; border-bottom: 1px solid #30363d; color: #8b949e; font-weight: 500; }
  td { padding: 8px 12px; border-bottom: 1px solid #21262d; font-family: 'Courier New', monospace; }
  tr:last-child td { border-bottom: none; }
  .loops { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 32px; }
  .loop  { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 14px; text-align: center; }
  .loop .name { font-size: 0.7rem; text-transform: uppercase; letter-spacing: .1em; color: #8b949e; margin-bottom: 6px; }
  .loop .status { font-size: 1rem; font-weight: 700; }
  section { margin-bottom: 32px; }
</style>
</head>
<body>
<h1>Heckler and Cox — Session Dashboard</h1>
<div class="sub">Latest: ${latest.session_date} · commit ${latest.commit} · session ${latest.session || '—'} · ${sessions.length} sessions logged</div>

<section>
<h2>Four Loops — Latest Session</h2>
<div class="loops">
  <div class="loop"><div class="name">TDD</div><div class="status ${latest.loops?.tdd === 'green' ? 'green' : 'red'}">${(latest.loops?.tdd || '—').toUpperCase()}</div></div>
  <div class="loop"><div class="name">BDD</div><div class="status ${latest.loops?.bdd === 'green' ? 'green' : 'red'}">${(latest.loops?.bdd || '—').toUpperCase()}</div></div>
  <div class="loop"><div class="name">DDD</div><div class="status amber">${(latest.loops?.ddd || '—').toUpperCase()}</div></div>
  <div class="loop"><div class="name">HDD</div><div class="status amber">${(latest.loops?.hdd || '—').toUpperCase()}</div></div>
</div>
</section>

<section>
<h2>Trend Cards</h2>
<div class="cards">
  <div class="card">
    <div class="label">Unit Tests</div>
    <div class="value green">${latest.pipeline?.unit || 0}</div>
    <div class="spark">${sparkline(unitCounts, '#3fb950')}</div>
  </div>
  <div class="card">
    <div class="label">Gherkin Scenarios</div>
    <div class="value green">${latest.pipeline?.gherkin || 0}</div>
    <div class="spark">${sparkline(gherkinCounts, '#58a6ff')}</div>
  </div>
  <div class="card">
    <div class="label">Pipeline Failure Rate</div>
    <div class="value ${failureRates[failureRates.length-1] > 20 ? 'red' : 'green'}">${failureRates[failureRates.length-1]}%</div>
    <div class="spark">${sparkline(failureRates, '#f85149')}</div>
  </div>
  <div class="card">
    <div class="label">Backlog Open</div>
    <div class="value amber">${latest.backlog?.open || 0}</div>
    <div class="spark">${sparkline(openCounts, '#d29922')}</div>
  </div>
</div>
</section>

<section>
<h2>Last 10 Sessions</h2>
<table>
  <thead><tr>
    <th>Date</th><th>Session</th><th>Commit</th><th>Pipeline</th>
    <th>Unit</th><th>Gherkin</th><th>Canary</th><th>Fail%</th><th>Backlog</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
</section>

</body>
</html>`;

fs.writeFileSync(OUT, html, 'utf8');
console.log(`OK: session-report.html written (${sessions.length} sessions)`);
