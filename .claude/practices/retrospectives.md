# Retrospectives — Practices
# Heckler and Cox
# Last updated: 2026-02-28
# Principles: see .claude/principles/lean.md, systems-thinking.md
# Reference: Tom Roden & Tracey Williams — Fifty Quick Ideas to Improve Your Retrospectives (2015)

---

## Triggers

**Mandatory — every session:**
Depth scales with what happened. A clean session gets a brief retro.
A session with Rod-caught bugs gets a full retro with 5 Whys.

**Mandatory — after any Rod-caught bug:**
Run 5 Whys (see .claude/practices/5-whys.md) within the same session.
Include findings in the session retro.

**Triggered — metric trending wrong 2+ sessions:**
If change failure rate, lead time, or pending scenario count trend wrong
for two consecutive sessions: full retrospective with root cause analysis.

**Triggered — process theatre detected:**
If a session produces only standards improvements and no working product change:
name it in the retro and identify what prevented product progress.

---

## Evidence First

Pull actual data before forming any opinion.
Not: "I think we're getting better at..."
Yes: "Change failure rate this session: n%. Last session: n%. Trend: improving/degrading."

Evidence sources:
- metrics/builds.jsonl — deployment frequency, coverage, step results
- metrics/defects.jsonl — Rod-caught vs pipeline-caught, lead times
- Gherkin pending count — from pipeline report
- Session log — what was planned vs what was delivered

---

## Format

```
SESSION RETROSPECTIVE — YYYY-MM-DD
Trigger: [mandatory/rod-caught/metric-trend/process-theatre]

EVIDENCE
Rod-caught this session: n
Pipeline-caught this session: n
False greens: n
Change failure rate: n%
Lead time: n
Pending scenarios: n (↑/↓/= from last session)
Coverage: statements n%, branches n%
Planned: [what was planned]
Delivered: [what was actually shipped]

INSIGHTS (root causes, not event descriptions)
- [insight 1]
- [insight 2]

SPECIFIC CHANGES (max 3, each maps to a file)
1. [change] → [file]
2. [change] → [file]
3. [change] → [file]

STOP / KEEP / TRY
Stop: [one thing]
Keep: [one thing]
Try: [one experiment]
```

---

## Lenses — Vary Each Session

Rotate through these lenses to avoid retrospective fatigue:
- **DORA trend** — are the four metrics improving?
- **Gherkin quality** — are scenarios testing behaviour or implementation?
- **Pipeline effectiveness** — is the pipeline catching what Rod would catch?
- **Standards compliance** — were all steps followed in order?
- **Waste audit** — which of the 7 wastes appeared this session?
- **Systems lens** — which feedback loop dominated this session?

---

## Output

File: `retrospectives/session-retro-YYYY-MM-DD.md`
Referenced in next session's pipeline scorecard under "Last retrospective findings."
Max 3 specific changes per retro — each maps to a named file.
Changes not mapped to a file are intentions, not commitments.

---

## Anti-Patterns to Avoid

**Blame** — the 5 Whys always ends at a system or process, never a person.
**Vagueness** — "we should communicate better" maps to no file and changes nothing.
**Too many actions** — more than 3 actions per retro means none will be done.
**Skipping evidence** — opinions without data are just feelings. Feelings don't improve systems.
**Process theatre** — a retro that produces a standards file but no product change is itself process theatre.
