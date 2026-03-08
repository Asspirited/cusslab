#!/usr/bin/env bash
# write-session-log.sh — appends one session record to .claude/reports/session-log.jsonl
# Called at session closedown (step 8 in session-closedown.md)
# Single responsibility: collect current session state, append one JSON line.

set -e

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
LOG="$REPO/.claude/reports/session-log.jsonl"
BUILDS="$REPO/metrics/builds.jsonl"
BACKLOG="$REPO/.claude/practices/backlog.md"

mkdir -p "$(dirname "$LOG")"

# ── Collect ───────────────────────────────────────────────────────────────────

SESSION_DATE=$(date +%Y-%m-%d)
COMMIT=$(git -C "$REPO" rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Latest build record from metrics/builds.jsonl
LAST_BUILD=$(tail -1 "$BUILDS" 2>/dev/null || echo "{}")

UNIT=$(echo "$LAST_BUILD" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); process.stdout.write(String(d.steps?.unitTests?.passed||0))")
GHERKIN=$(echo "$LAST_BUILD" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); process.stdout.write(String(d.steps?.gherkin?.passed||0))")
CANARY=$(echo "$LAST_BUILD" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); process.stdout.write(d.steps?.workerCanary?.status==='pass'?'OK':'RED')")
PIPELINE_STATUS=$(echo "$LAST_BUILD" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); process.stdout.write(d.overallStatus||'UNKNOWN')")
SESSION_NUM=$(echo "$LAST_BUILD" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); process.stdout.write(String(d.session||0))")

# DORA from metrics/builds.jsonl: failure rate
FAILURE_RATE=$(node -e "
const fs=require('fs');
const lines=fs.readFileSync('$BUILDS','utf8').split('\n').filter(l=>l.trim()).map(l=>{try{return JSON.parse(l)}catch{return null}}).filter(Boolean);
const red=lines.filter(b=>b.overallStatus==='RED').length;
const rate=lines.length?Math.round((red/lines.length)*100)/100:0;
process.stdout.write(String(rate));
")

# Backlog: count open items
OPEN_COUNT=$(grep -c "^- Status: OPEN" "$BACKLOG" 2>/dev/null || echo 0)
TOP_ITEM=$(grep -m1 "^### BL-" "$BACKLOG" | grep -v "CLOSED\|Status: CLOSED" | sed 's/^### //' | cut -c1-40 || echo "unknown")

# ── Write ─────────────────────────────────────────────────────────────────────

RECORD=$(node -e "
process.stdout.write(JSON.stringify({
  session_date: '$SESSION_DATE',
  session: $SESSION_NUM,
  commit: '$COMMIT',
  pipeline: { unit: $UNIT, gherkin: $GHERKIN, canary: '$CANARY', status: '$PIPELINE_STATUS' },
  dora: { failure_rate: $FAILURE_RATE, sessions: $SESSION_NUM },
  backlog: { open: $OPEN_COUNT },
  loops: {
    tdd: $UNIT > 0 ? 'green' : 'red',
    bdd: $GHERKIN > 0 ? 'green' : 'red',
    ddd: 'review-needed',
    hdd: 'open'
  }
}));
")

echo "$RECORD" >> "$LOG"
echo "OK: session log entry written — $SESSION_DATE $COMMIT (session $SESSION_NUM)"
