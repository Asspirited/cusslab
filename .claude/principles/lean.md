# Lean Thinking — Principles
# Heckler and Cox
# Last updated: 2026-02-28
# Reference: Poppendieck & Poppendieck — Lean Software Development (2003)
# Reference: Womack & Jones — Lean Thinking (1996)
# Practices: see .claude/practices/waste-log.md, 5-whys.md, retrospectives.md

---

## The Core Insight

Value flows from concept to customer. Everything that impedes that flow is waste.
The job of the team is to identify and eliminate waste, continuously.
Waste does not announce itself — it hides in process, in waiting, in partial work.

---

## The 7 Principles (Poppendieck)

**1. Eliminate Waste**
If it does not add value to the user, it is waste. Name it. Remove it.
Categories: see .claude/practices/waste-log.md

**2. Build Quality In**
Quality cannot be inspected in after the fact. It must be designed in from the start.
A Gherkin scenario written after the code is not quality built in — it is quality theatre.

**3. Amplify Learning**
Every failure is information. Every retrospective is learning compounded.
The 5 Whys practice exists to amplify learning from defects.
Standards files encode learning so it does not have to be rediscovered.

**4. Defer Commitment**
Make decisions at the last responsible moment — when you have the most information.
Building Phase 2 features in Phase 1 is premature commitment.
The fifth panel member is deferred until real use provides the information to decide.

**5. Deliver Fast**
Speed is a quality indicator, not a risk. Slow delivery is a symptom of accumulated waste.
Short lead times mean fast feedback. Fast feedback means fast learning.

**6. Respect People**
People are not resources. They are the source of all value.
Rod's frustration when process fails is a signal, not a complaint.
A session that produces only infrastructure fixes is process disrespecting Rod's time.

**7. Optimise the Whole**
Local optimisation that creates global waste is not improvement.
Fixing test speed while missing scenarios is local optimisation.
The goal is end-to-end flow from idea to deployed feature.

---

## The 7 Wastes of Software (Poppendieck)

| Waste | Definition | Our Instance |
|-------|-----------|--------------|
| Partially done work | Work started but not deployable | 28 approved scenarios awaiting code |
| Extra processes | Process that does not add value | Standards that document rather than enforce |
| Extra features | Code not required by a failing test | Any gold plating |
| Task switching | Context lost between sessions | Rebuilding context each session start |
| Waiting | Blocked work | Billing bug blocking deployment |
| Motion | Searching for information | Hunting for project context |
| Defects | Bugs, rework, false greens | All bugs to date — same root cause |

---

## The Lean Mental Model for This Project

Every session: what is the constraint?
Today's constraint was billing. Not code quality. Not test coverage.
Applying TDD discipline to a billing-blocked session is local optimisation.
The right response was what we did: design work that compounds when the constraint lifts.

Tomorrow's constraint will be something else. Name it at session start.
The pipeline scorecard tells you what the constraint is.
