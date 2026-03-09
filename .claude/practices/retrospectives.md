# Retrospectives — Practices
# Heckler and Cox
# Last updated: 2026-03-09
# Structure: Derby & Larsen — Agile Retrospectives: Making Good Teams Great (2006)
# Additional: Tom Roden & Tracey Williams — Fifty Quick Ideas to Improve Your Retrospectives (2015)
# Principles: see .claude/principles/lean.md, systems-thinking.md

---

## Triggers

**Mandatory — every session:**
Depth scales with what happened. A clean session gets a brief retro.
A session with Rod-caught bugs gets a full retro with 5 Whys in Phase 3.

**Mandatory — after any Rod-caught bug:**
Run 5 Whys (see `.claude/practices/5-whys.md`) within the same session.
Include findings in Phase 3 of the session retro.

**Triggered — metric trending wrong 2+ sessions:**
If change failure rate, lead time, or pending scenario count trend wrong
for two consecutive sessions: full retro, all 5 phases in full.

**Triggered — process theatre detected:**
If a session produces only standards improvements and no working product change:
name it in Phase 1 (Set the Stage) and use Phase 3 to find the blocker.

---

## Sources Library — Standing Reference for All Phases

These are not optional lenses — they are the standing reference for every retro. Apply them in Phase 2 (what does the data say against this framework?), Phase 3 (what does this framework reveal about the root cause?), and Phase 4 (what would this framework prescribe as an experiment?).

| Source | Domain | Apply when |
|---|---|---|
| **Derby & Larsen** — *Agile Retrospectives* (2006) | Retrospective structure | Sequencing phases; choosing activities; avoiding anti-patterns |
| **Roden & Williams** — *Fifty Quick Ideas to Improve Your Retrospectives* (2015) | Retro techniques | Choosing phase activities; avoiding retro fatigue |
| **Lean / Muda (Ohno / Poppendieck)** | Waste elimination, flow | Identifying the 7 wastes; value stream blockages; batch size |
| **Reinertsen** — *Principles of Product Development Flow* | Cost of Delay, queue | Prioritisation failure; queue build-up; WIP creep |
| **Fowler / Beck** — Clean Code, Refactoring, XP | Technical debt, simplicity | Code quality signals; test discipline; four rules of simple design |
| **DDD (Evans)** | Domain model, language | Ubiquitous language drift; model misalignment; bounded context blur |
| **DORA / Accelerate (Forsgren, Humble, Kim)** | Four key metrics | Deployment frequency, lead time, change failure rate, MTTR |
| **DevOps Three Ways (Kim)** | Flow, feedback, learning | Handoff delays; slow feedback loops; missing learning from failure |
| **Agile Manifesto + 12 Principles** | Delivery values | Process-over-product drift; batch size; working software cadence |
| **Design Thinking / JTBD** | User value | Are we solving the right problem? Does the feature do the job? |
| **hypothesis-driven.md** | Product bets | Are experiments falsifiable? Do we know what "wrong" looks like? |

---

## The 5-Phase Sequence (Derby & Larsen)

Run these in order. Do not skip phases. Do not merge Phase 2 and Phase 3.
The most common failure mode is jumping from data straight to solutions — that is Phase 2 → Phase 4 without Phase 3. It produces actions that don't address root causes.

---

### Phase 1 — Set the Stage

State:
- Trigger condition (mandatory / rod-caught / metric-trend / process-theatre)
- Focus for this retro — one sentence: "This retro focuses on X"
- Working agreement for this retro (e.g. "no blame, system lens only")
- Duration signal: brief (clean session) / full (bug, trend, theatre)

Anti-pattern: skipping this and diving into data. Without a stated focus the retro drifts.

---

### Phase 2 — Gather Data

**Facts only. No interpretation. No "I think this happened because..."**

Pull from actual sources — not memory:
- `metrics/builds.jsonl` — deployment frequency, coverage, step results
- `metrics/defects.jsonl` — Rod-caught vs pipeline-caught, lead times
- `.claude/practices/waste-log.md` — WL entries opened/closed this session
- `.claude/reports/session-log.jsonl` — planned vs delivered
- Gherkin pending count from pipeline report

Report format (copy the numbers, no commentary yet):

```
GATHER DATA
Rod-caught this session:    n
Pipeline-caught:            n
False greens:               n
Change failure rate:        n%
Lead time (median):         n commits
Pending scenarios:          n (↑/↓/= from session start)
Coverage: statements n%, branches n%
Planned:   [what was planned at session start]
Delivered: [what was actually pushed]
WL entries opened:  n  (WL-NNN, WL-NNN, ...)
WL entries closed:  n
```

**Stop at the data. Do not interpret yet.**

---

### Phase 3 — Generate Insights

Now interpret. Look for patterns across the data, not just this session's events.
Draw on the **Sources Library** above — vary which sources you lead with each session to avoid fatigue. Every source should be considered; which one leads the analysis rotates.

Specific questions to ask per source type:
- **Lean / Reinertsen:** Where did waste, queue, or WIP accumulate? What delayed flow?
- **DORA / DevOps Three Ways:** Which of the four metrics moved? Why? Which way?
- **Fowler / Beck / DDD:** Where did the code or model drift from simple? What debt was incurred?
- **Agile Manifesto:** Did any process step exist to serve process rather than delivery?
- **Design Thinking / JTBD:** Did what we shipped do the job the user needed done?

**5 Whys:** for any Rod-caught bug or repeated pattern, run 5 Whys here. Root causes always end at a system or process, never at a person.

Output: bullet list of insights — root causes, patterns, systemic observations. Not event descriptions.

```
GENERATE INSIGHTS
- [insight — systemic, not anecdotal]
- [insight]
```

---

### Phase 4 — Decide What to Do

**Max 3 improvement experiments.** More than 3 means none will be done.

Frame each as a **hypothesis**, not a task. An action without a prediction is just intent — it doesn't tell you whether it worked. See `.claude/practices/hypothesis-driven.md` for the full pattern.

Format:

```
DECIDE WHAT TO DO
1. [STOP/KEEP/TRY] [what we will do] → [file]
   Hypothesis: If we [do X], then [observable outcome] because [root cause from Phase 3].
   Falsifier:  We will know we were wrong if [specific counter-signal] by [next retro / next session].

2. [STOP/KEEP/TRY] [what we will do] → [file]
   Hypothesis: ...
   Falsifier:  ...

3. (only if 2 is not enough)
```

STOP / KEEP / TRY vocabulary:
- **STOP** — something actively harmful to delivery or quality
- **KEEP** — something working well; make it explicit so it doesn't erode
- **TRY** — a time-boxed experiment; assess at next retro

Rules:
- Each experiment maps to a named file — no file, no commitment
- Hypothesis must be falsifiable — if you can't state what "wrong" looks like, it's not a hypothesis
- Source library justification required — which source (Lean, DORA, Beck, etc.) prescribes this experiment and why?

---

### Phase 5 — Close the Retrospective

Two mandatory checks:

**1. Meta-retro (15 seconds):**
Was this retro itself useful? Would any phase have been better with a different lens?
Note it in one line — not in the action list, just as a signal for future retros.

**2. Process theatre check:**
Did this session's retro produce a standards file but no product action?
If yes: name it. The retro itself is a symptom. Add a WL entry.

**3. Commit and carry forward:**
Actions from Phase 4 that touch `.claude/` files → write them now before closing.
Actions deferred to next session → carry forward in `session-startup.md` and `shared-session-state.md`.

---

## Output

File: `retrospectives/session-retro-YYYY-MM-DD.md`
Structure: follow the 5 phases in order — label each phase clearly.
Referenced in next session's pipeline scorecard under "Last retrospective findings."
Max 3 specific changes per retro — each maps to a named file.

---

## Anti-Patterns (per phase)

| Phase | Anti-pattern | Why it fails |
|---|---|---|
| Set the Stage | No focus stated | Retro drifts; actions don't connect |
| Gather Data | Pulling from memory not sources | Confirmation bias; false data |
| Gather Data | Interpreting while gathering | Phase 2 and 3 collapse; root causes missed |
| Generate Insights | Jumping straight to solutions | Actions without root causes don't fix systems |
| Generate Insights | Blame | 5 Whys always ends at system, never person |
| Decide What to Do | More than 3 actions | None will be done; diffusion of effort |
| Decide What to Do | Actions not mapped to a file | Intentions, not commitments |
| Decide What to Do | Vague actions ("communicate better") | Not SMART; not observable; not a commitment |
| Close | Skipping meta-retro | Retro process itself never improves |
| Close | Writing standards files but no product action | Process theatre — flag it as a WL entry |
