# Retrospectives — Heckler and Cocks

*Fifty Quick Ideas to Improve Your Retrospectives — Roden & Williams (2015)*
*Rod Roden is co-author.*

---

## Purpose

Continuous improvement of the delivery system, not ceremony.
The system: Rod's intent → Claude.ai → Claude Code → pipeline → deployed product.

The fundamental risk: running the same format repeatedly until it becomes ritual.
The format is not the retrospective. The quality of thinking and honesty is.
The format is just a prompt.

---

## Trigger

- **Every session** (mandatory) — no exceptions
- Depth scales with what happened: quiet session = short retro, incident session = full retro
- Immediately after any Rod-caught bug: include 5 Whys in that session's retro

---

## Applied Principles

**Prepare with evidence — don't walk in cold**
Pull actual data before the retrospective. Start with what the numbers say,
not impressions. Rod-caught trend, DORA metrics, pipeline green rate,
pending Gherkin movement.

**Focus on outcomes, not activities**
"Did we follow the process?" is the wrong question.
"Did the process produce the right outcomes?" is the right question.
Compliance theatre is not improvement.

**Generate insights, not problem lists**
Bad: "we should write Gherkin first" (already in standards — useless output)
Good: "Claude Code skipped the checklist on 3 of 4 sessions because the
handoff instruction didn't require output to be shown to Rod before proceeding"
— that's an insight that leads to a specific file change.

**Max three specific changes per retrospective**
Each maps to a file. Vague outcomes are waste.
- Vague: "be more disciplined"
- Specific: "add X sentence to CLAUDE.md Gherkin gate section"

**Vary the lens — keep it fresh**
- Session N+5:  DORA trend — is lead time improving?
- Session N+10: Gherkin quality — Rod's language or the machine's?
- Session N+15: Pipeline effectiveness — what did it catch vs what Rod found?
- Session N+20: Standards compliance — which followed, which worked around?

**Psychological safety applies even here**
Most at-risk suppressed truth: "the AI skipped a step and I didn't notice."
Rod-caught metric and 5 Whys log exist to surface this without blame.
Both failures get logged. Neither gets hidden.

**It is the mark of a good action that it appears inevitable in retrospect**
Right process changes feel obvious in hindsight. Forced or bureaucratic
additions are wrong. The Three Amigos Gherkin gate felt inevitable after
Bug 6. That is the signal that it was the right change.

**Treat improvements as experiments, not mandates**
"Try" in the format is intentional. Not "do this" — "run this experiment
and report back at the next retrospective."

---

## Format

```
RETROSPECTIVE — Session [N] — [date]
──────────────────────────────────────────────────
EVIDENCE (from metrics reports — no guessing):
  Rod-caught count this period:     N  (trend: ↑↓→)
  Pipeline-caught count:            N
  False greens this period:         N  (must be 0)
  Avg build time:                   Xs (trend: ↑↓→)
  Lead time improvement:            yes / no
  Pending Gherkin movement:         +N / -N
  Standards violations this period: [list or "none"]

INSIGHTS (root causes, not event descriptions):
  1. [What the data reveals about the system]
  2. [...]

SPECIFIC CHANGES (max 3, each maps to a file):
  1. [File] → [exact change — one sentence]
  2. [File] → [exact change]
  3. [File] → [exact change]

STOP:   [one thing to stop doing]
KEEP:   [one thing that is working]
TRY:    [one experiment for next period]
──────────────────────────────────────────────────
```

---

## Output

Committed to `retrospectives/session-N.md` in the repo.
Version-controlled alongside the code.
Not a conversation — a document.
Referenced in the next session's Pipeline Report under "Last retrospective findings".
