// pipeline/run-all.js — Pipeline orchestrator with build telemetry
// Run: node pipeline/run-all.js  (replaces chained npm script)

'use strict';

const { spawnSync } = require('child_process');
const fs            = require('fs');
const path          = require('path');

const ROOT        = path.join(__dirname, '..');
const METRICS_DIR = path.join(ROOT, 'metrics');
const BUILDS_FILE = path.join(METRICS_DIR, 'builds.jsonl');
const COUNTER_FILE = path.join(METRICS_DIR, 'session-counter.txt');

// ── Ensure metrics directory exists ──────────────────────────────────────────

if (!fs.existsSync(METRICS_DIR)) fs.mkdirSync(METRICS_DIR, { recursive: true });

// ── Session counter (auto-increment, local only) ──────────────────────────────

let session = 1;
try {
  if (fs.existsSync(COUNTER_FILE)) {
    const n = parseInt(fs.readFileSync(COUNTER_FILE, 'utf8').trim(), 10);
    if (!isNaN(n)) session = n + 1;
  }
} catch { /* first run */ }
fs.writeFileSync(COUNTER_FILE, String(session));

// ── Pipeline steps ────────────────────────────────────────────────────────────

const STEPS = [
  { key: 'uiAudit',    label: 'UI Audit',    script: 'pipeline/ui-audit.js'    },
  { key: 'browserSim', label: 'Browser Sim', script: 'pipeline/browser-sim.js' },
  { key: 'unitTests',  label: 'Unit Tests',  script: 'pipeline/unit-runner.js' },
  { key: 'gherkin',    label: 'Gherkin',     script: 'pipeline/gherkin-runner.js' },
  { key: 'coverage',   label: 'Coverage',    script: 'pipeline/coverage.js'    },
];

// ── Parse per-step metrics from captured stdout ───────────────────────────────

function parseStepOutput(key, stdout) {
  if (key === 'uiAudit') {
    const m = stdout.match(/UI Audit:\s+(\d+)\/(\d+)/);
    if (m) return { violations: parseInt(m[2], 10) - parseInt(m[1], 10) };
    return { violations: 0 };
  }
  if (key === 'browserSim') {
    const m = stdout.match(/Browser Sim:\s+(\d+)\/(\d+)/);
    if (m) return { violations: parseInt(m[2], 10) - parseInt(m[1], 10) };
    return { violations: 0 };
  }
  if (key === 'unitTests') {
    const m = stdout.match(/Unit Tests:\s+(\d+)\/(\d+)/);
    if (m) {
      const pass = parseInt(m[1], 10), total = parseInt(m[2], 10);
      return { passed: pass, failed: total - pass };
    }
    return { passed: 0, failed: 0 };
  }
  if (key === 'gherkin') {
    const m = stdout.match(/Gherkin:\s+(\d+)\/(\d+)/);
    if (m) {
      const pass = parseInt(m[1], 10), total = parseInt(m[2], 10);
      return { passed: pass, failed: total - pass };
    }
    return { passed: 0, failed: 0 };
  }
  if (key === 'coverage') {
    const sm = stdout.match(/Statement coverage:\s+([\d.]+)%/);
    const bm = stdout.match(/Branch coverage:\s+([\d.]+)%/);
    return {
      statements: sm ? parseFloat(sm[1]) : 0,
      branches:   bm ? parseFloat(bm[1]) : 0,
    };
  }
  return {};
}

// ── Run each step, time it, collect results ───────────────────────────────────

const stepResults = {};
const pipelineStart = Date.now();
let overallPass = true;

for (const step of STEPS) {
  const bar = '─'.repeat(50);
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  Session ${session} — ${step.label}`);
  console.log(bar);

  const stepStart = Date.now();

  const proc = spawnSync('node', [path.join(ROOT, step.script)], {
    stdio: ['inherit', 'pipe', 'pipe'],
    encoding: 'utf8',
  });

  const durationMs = Date.now() - stepStart;
  const ok         = proc.status === 0;

  // Stream captured output to terminal
  if (proc.stdout) process.stdout.write(proc.stdout);
  if (proc.stderr) process.stderr.write(proc.stderr);

  const extra = parseStepOutput(step.key, proc.stdout || '');
  stepResults[step.key] = { durationMs, status: ok ? 'pass' : 'fail', ...extra };

  if (!ok) {
    overallPass = false;
    break; // fail fast — still write the build record below
  }
}

const totalDurationMs = Date.now() - pipelineStart;

// ── Write build record ────────────────────────────────────────────────────────

const record = {
  timestamp:      new Date().toISOString(),
  session,
  steps:          stepResults,
  totalDurationMs,
  overallStatus:  overallPass ? 'GREEN' : 'RED',
  caughtBy:       'pipeline',
};

try {
  fs.appendFileSync(BUILDS_FILE, JSON.stringify(record) + '\n');
} catch (e) {
  console.error(`  ! Could not write build record: ${e.message}`);
}

// ── Print summary banner ──────────────────────────────────────────────────────

console.log(`\n${'═'.repeat(50)}`);
console.log(`  Pipeline ${overallPass ? '✓ GREEN' : '✗ RED'}  — session ${session}  — ${totalDurationMs}ms`);
console.log(`${'═'.repeat(50)}\n`);

// ── Always run metrics report ─────────────────────────────────────────────────

const metricsScript = path.join(ROOT, 'pipeline', 'metrics-report.js');
if (fs.existsSync(metricsScript)) {
  const mr = spawnSync('node', [metricsScript], { stdio: 'inherit', encoding: 'utf8' });
  if (mr.stderr) process.stderr.write(mr.stderr);
}

process.exit(overallPass ? 0 : 1);
