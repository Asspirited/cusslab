# Hypothesis-Driven Development — Outer Product Feedback Loop
# Heckler and Cox
# Last updated: 2026-03-08
# Sources: Ries — The Lean Startup (2011)
#          Adzic — Impact Mapping (2012)
#          Reinertsen — Principles of Product Development Flow (2009)
#          McClure — AARRR Pirate Metrics (2007)
#          Gilb — Competitive Engineering / Planguage (2005)
#          Hubbard — How to Measure Anything (2014)
#          O'Reilly / Fichtner — Hypothesis-Driven Development
# Practices: see CD3 scoring in backlog.md; DORA in dora.md

---

## The Core Insight

The inner delivery loops (DDD/BDD/TDD) answer: "Are we building this correctly?"
The outer product feedback loop answers a prior question: "Did what we built produce
the intended outcome — and should we keep building in this direction?"

Without the outer loop, the pipeline can be permanently green while the product
drifts from what users actually need. "Plausible" is not validated learning.
Vanity metrics (it seems funny, it felt good to ship) are not evidence.

---

## The Loop Structure

Every feature sits inside one full outer loop cycle:

  DEFINE     →  PRIORITISE  →  INSTRUMENT  →  DELIVER  →  LEARN
  (Impact Map)  (CD3)          (Gilb/Hubbard)  (DDD/BDD/TDD)  (Ries)
      └──────────────────────────────────────────────────────────┘
                           (feedback into domain model + backlog)

---

## AARRR — Product Measurement Vocabulary (McClure)

Every hypothesis must target one of these stages. "Improve the product generally"
is not a hypothesis. "Improve Activation" is.

| Stage       | Definition for Heckler and Cox                            |
|-------------|-----------------------------------------------------------|
| Acquisition | User discovers the app (organic search, share, word of mouth) |
| Activation  | First panel run produces output worth reading / sharing   |
| Retention   | User returns — runs another panel in a later session      |
| Referral    | User shares panel output or links to the app              |
| Revenue     | Subscription / freemium conversion (future)               |

Current measurement gap: all five stages are currently untracked. HCSession.logPanelRun()
captures run data but it is not observable outside the session. BL-018 tracks this.

---

## Hypothesis Card Format

Every BL item that represents a product bet (not pure tech debt) should carry a card:

  Actor:       [who must change behaviour]
  Assumption:  [what we believe they will do differently]
  AARRR stage: [Acquisition / Activation / Retention / Referral / Revenue]
  Signal:      [what moves — specific, observable, not qualitative]
  Baseline:    [current value or "unknown — measure first"]
  Target:      [what "success" looks like in the same units as signal]
  Window:      [how many sessions / days before we assess]
  Falsifier:   [what result would tell us we were wrong]

A hypothesis without a falsifier is a wish, not a hypothesis.

---

## Prioritisation — CD3 + Cost of Delay (Reinertsen)

CD3 scoring already in use (backlog.md). Two additions from the outer loop:

1. EVPI check (Hubbard): before investing in measurement infrastructure for a
   hypothesis, ask — "How much would the decision change if we knew the true value?"
   If the answer is "not much", don't build the measurement. Measure only where
   uncertainty is expensive.

2. Hypothesis-first ordering: if two items have similar CD3 scores, prefer the one
   whose hypothesis is more falsifiable. Unfalsifiable bets compound uncertainty;
   falsifiable bets reduce it.

---

## Gilb Measurement Check — Before Writing a Hypothesis

Planguage requires every quality attribute to have:
  - Scale:     what are we measuring? (share rate, return sessions, discussion depth)
  - Benchmark: current measured value (or "unmeasured")
  - Target:    what value constitutes success
  - Constraint: floor below which we must not fall

If you cannot define the scale, you cannot test the hypothesis.
If the scale is currently unmeasured, the first task is to measure the baseline —
not to ship the feature.

---

## The Seven Questions (in sequence)

Run these in order before any FEATURE SEQUENCE begins:

1. IMPACT MAP (Adzic)
   Who must change their behaviour for the product goal to be achieved?
   What impact do we need from them?
   Does this feature trace directly to that impact, or is it a guess?

2. MEASURABILITY (Gilb / Hubbard)
   Can we define a scale for what this feature claims to improve?
   Is that scale currently measured? If not — is measuring it worth the EVPI?

3. PRIORITISATION (Reinertsen / CD3)
   What is the weekly cost of not shipping this?
   Does CD3 confirm this is the highest-value hypothesis to test right now?

4. HYPOTHESIS (Ries / HDD)
   State the hypothesis in card format (above).
   What would falsify it? Is the window realistic?

5. AARRR STAGE (McClure)
   Which funnel stage does this target?
   Are we over-indexing on one stage while another is leaking?
   (Building Retention features while Activation is broken = filling a leaking bucket)

6. DELIVERY HEALTH (DORA)
   Is deployment frequency and lead time low enough to observe the signal
   within the hypothesis window? If not, fix the delivery machinery first.

7. FEEDBACK PATH (DDD / BDD)
   When the result comes in, what changes in the domain model?
   Which BDD scenarios become redundant or need updating?
   Where does the learning land?

---

## Pivot or Persevere (Ries)

After the hypothesis window closes, assess against the falsifier:

  CONFIRMED:    impact on target AARRR metric as predicted
                → update domain model, close hypothesis, raise next
                → backlog: the validated capability is now a known good

  FALSIFIED:    metric did not move as predicted
                → distinguish: wrong assumption (pivot) vs wrong implementation (persevere)
                → pivot: revise impact map, new hypothesis
                → persevere: different approach to same hypothesis

  INCONCLUSIVE: signal too noisy or baseline unmeasured
                → first task: instrument before re-running experiment
                → do not interpret absence of signal as confirmation

Record the outcome on the BL item. Update session-startup.md if it affects top 3.

---

## Applied to Heckler and Cox — Current State

The most testable near-term hypothesis for each open panel:

SOUNESS'S CAT (just shipped):
  Actor:       Non-sports users who find Football/Golf commentary inaccessible
  Assumption:  Science panel dynamics produce more shareable outputs for this segment
  AARRR stage: Activation
  Signal:      Discussion depth (turns per session on sc panel vs fb panel)
  Baseline:    Unknown — HCSession.logPanelRun() data not yet observable
  Target:      sc avg turns ≥ fb avg turns within 10 sessions
  Window:      5 sessions after BL-018 (observability) ships
  Falsifier:   sc avg turns < fb avg turns after 10 sessions with n ≥ 5 sc runs

BL-008 (RIA ACC label fix):
  Actor:       New RIA users reading the ACC tool header
  Assumption:  Correct label reduces confusion about what ACC means
  AARRR stage: Activation
  Signal:      Time-on-tool (proxy for confusion) — currently unmeasured
  Baseline:    Unknown
  Target:      Qualitative: Rod no longer has to explain what ACC stands for
  Window:      Immediate — this is a label fix with obvious falsifier
  Falsifier:   User still asks "what does ACC stand for?" after fix

BL-095 (The Roast Room — shipped 2026-03-10):
  Actor:       Comedy Room users submitting a title (book, magazine, publication)
  Assumption:  Collision comedy (McCarthy on Hello magazine) is engaging enough to prompt re-rolls and shares
  AARRR stage: Activation
  Signal:      Re-roll clicks per session on roast-room tab (proxy for engagement / delight)
  Baseline:    0 — not yet shipped to users
  Target:      ≥ 1 re-roll per 3 roast submissions within first 10 user sessions
  Window:      10 sessions after deploy
  Falsifier:   Re-roll rate < 1 in 5 after 10 sessions (users don't find results compelling enough to retry)

BL-059 (The Writing Room — shipped 2026-03-10):
  Actor:       Comedy Room users submitting a topic (event, concept, premise)
  Assumption:  Sequential author awareness ("each author reads the previous") produces richer outputs than parallel monologues
  AARRR stage: Activation
  Signal:      Session time on writing-room tab vs roast-room tab (richer = longer read)
  Baseline:    0 — not yet observable
  Target:      Writing Room avg session time ≥ Roast Room avg session time within 10 sessions
  Window:      10 sessions after deploy
  Falsifier:   Writing Room session time consistently shorter than Roast Room (awareness mechanic adds no value)

---

## Reference Files

| File | When to read |
|---|---|
| `.claude/practices/backlog.md` | Hypothesis card fields on BL items |
| `.claude/practices/dora.md` | Delivery health check (question 6) |
| `.claude/practices/domain-model.md` | Feedback path (question 7) |
| `.claude/practices/retrospectives.md` | Pivot/persevere trigger |

---

## Trigger in session-insession.md

FEATURE SEQUENCE step 0 (LEAN CHECK) now includes the seven questions above.
Read this file in full when a new feature or new panel is being scoped.
Do not read it for bug fixes, ops work, or items inside a pre-agreed envelope.
