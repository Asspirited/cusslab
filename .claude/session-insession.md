# In-Session Protocol — Heckler and Cox
# Trigger map and delivery discipline
# Last updated: 2026-03-10
# Sources: Evans (DDD), Martin (Clean Code, SOLID), Fowler (Refactoring),
#          Meszaros (xUnit Patterns), Smart (BDD in Action),
#          Adzic/Evans (Fifty Quick Ideas to Improve Your Tests),
#          Adzic & Evans — Fifty Quick Ideas to Improve Your User Stories (2014),
#          Cohn — User Stories Applied (2004),
#          Wake — INVEST model (XP123, 2003),
#          Jeffries — Three C's (Card, Conversation, Confirmation),
#          Nielsen (10 Usability Heuristics), SUS, WCAG 2.1 AA,
#          DORA metrics, OWASP,
#          Beck — Extreme Programming Explained (2nd ed, 2004),
#          Poppendieck & Poppendieck — Lean Software Development (2003),
#          Womack & Jones — Lean Thinking (1996),
#          Meadows — Thinking in Systems (2008),
#          Senge — The Fifth Discipline (1990),
#          Norman — The Design of Everyday Things (2013),
#          Krug — Don't Make Me Think (2014),
#          Christensen — Jobs to Be Done

## TRIGGER MAP

### TRIGGER: "new feature" / "new panel" / "new mechanic" / "new character"
→ Run: FEATURE SEQUENCE

### TRIGGER: "write the tests" / "unit tests" / "make it fail"
→ Run: TDD SEQUENCE

### TRIGGER: "implement" / "wire it up" / "build it"
→ Check: Gherkin approved? Unit tests red? DDD RED done? If not — stop and say why.
→ If yes: Run: IMPLEMENTATION SEQUENCE

### TRIGGER: "commit" / "push" / "ship it"
→ Run: COMMIT SEQUENCE

### TRIGGER: "character file" / "write the character" / "build [name]"
→ Check: domain-model.md read this session? If not — fetch it first.
→ Check: Gherkin approved for this character? If not — Gherkin first.
→ Run: CHARACTER SEQUENCE

### TRIGGER: "run the panel" / "let's hear them" / "test it live"
→ Check: domain-model.md read this session? If not — stop.
→ Check: pipeline green? If not — stop.
→ Proceed.

### TRIGGER: "research" / "find out about" / "who is"
→ Run: CHARACTER RESEARCH PROTOCOL

### TRIGGER: "something just went wrong" / "that's broken" / "wtf" / "live bug" / pipeline RED
→ Run: INVESTIGATE AND RESOLVE SEQUENCE
→ Source: Poppendieck — build quality in, not inspect in after the fact

### TRIGGER: any new persistent artefact (code, config, script, doc, test, report)
→ Run: DEVOPS DESIGN CHECK before writing it

### RULE: Automatic waste logging — always on
Any time a bug, broken flow, missing behaviour, or quality gap is discovered — log a WL entry immediately, regardless of where in the session it surfaces. Do not wait for closedown.

**Report timing:**
- **Immediately** if the issue blocks current work or is user-visible (broken feature, crash, wrong output)
- **At the end of each TDD/BDD/DDD cycle** (after BDD CLOSE or DDD CLEAN): report any waste found during that cycle
- **At each forcing function checkpoint** (every 3 BL items closed or 5 pipeline runs): summarise open waste logged since last checkpoint
- **At session closedown**: full waste log review as per existing step 2

**Discovery triggers for automatic logging:**
- Pipeline failure (any check going RED mid-session)
- TDD GAP CHECK reveals untested export
- BDD CLOSE reveals scenario drift or missing scenarios
- DDD CLEAN reveals domain model gaps
- TDD CLEAN / refactor checklist finds duplication, magic numbers, or SRP violations
- Rod mentions something broken in passing
- Any feature found broken while reading code for a different task (e.g. WL-096 Bespoke Material)

Do not filter or defer. Log it, assign the next WL number, report it. Return to current work.

### TRIGGER: any new idea surfaces (Rod or Claude) — CAPTURE IMMEDIATELY to ideas.md + Downloads
Signal: Rod says "what if…" / "could we…" / "one day…" / "I wonder if…"
        OR Claude spots a concept that is interesting but not yet scoped enough for a BL item
        OR something emerges in conversation that doesn't have a clear "so that" clause yet
→ Add to `.claude/practices/ideas.md` UNREVIEWED section — one sentence minimum, date + source.
→ Write snapshot to `/mnt/c/Users/roden/Downloads/idea-[slug]-[YYYY-MM-DD].md` immediately.
  Format: one-paragraph description, source, open questions, status "UNREVIEWED — not yet a BL item".
  Reason: ideas raised mid-session are not in the current session-ref.md — Claude.ai cannot see them
  until the next session start. The Downloads file lets Rod upload it to Claude.ai in the same session.
→ Do NOT interrupt current work. Do NOT raise a BL item yet.
→ Do NOT add to backlog without a "so that" clause and informal Three Amigos.
→ Announce: "Added to ideas board: [name] — idea file in Downloads" — one line — then continue.
The ideas board has zero barrier to entry. Capture first, judge at session start review.
Source: Lean — pull system; options have value before they are exercised (Reinertsen)

### TRIGGER: RAISE NEW WORK — fires on any of these signals:
- I spot a bug, gap, or quality issue while reading, implementing, or refactoring
- Pipeline fails and reveals a structural gap
- Rod mentions something in passing ("we should...", "that could be better...", "annoying that...")
- A review (closedown standards review, retro, BDD CLOSE, DDD CLEAN) surfaces an improvement
- An INVESTIGATE AND RESOLVE step reveals a pattern or class of defects
- Any observation that, if unrecorded, will be WL-001 all over again
→ Run: RAISE NEW WORK SEQUENCE — immediately, before returning to current work

### RULE: Epic decomposition — characters and deliverables are first-class BL items
When a new epic is raised that involves multiple characters, panels, or distinct deliverables
(Author Epilogue with 18 authors, Oracle with 8 archetypes, Ryder Cup with multiple tournaments, etc.):
- **Each character is a separate BL item.** Each deliverable is a separate BL item.
- The epic label groups them — it is never itself a BL item with a number.
- **Raise the decomposed items at the time the epic is raised, or at the start of the first session
  working on it** — not deferred until implementation begins. Unfiled characters = invisible work.
- Batch size target: each BL item should be completable within a single session (one Gherkin → red → green → clean → push cycle).
- Reason: lean batching, smaller commits, faster feedback loops, session-sized work, no WIP pile-up.
- Splitting pattern: apply SPIDR (Spike/Paths/Interface/Data/Rules) to decompose — see `.claude/practices/user-stories.md`.
  Walking skeleton rule: first story in an epic always delivers the thinnest end-to-end slice.
  Each subsequent story adds flesh — never build depth before breadth is proven.
- Source: Poppendieck — Lean Software Development (small batch size); Reinertsen — Product Development Flow (WIP limits);
  Cohn — User Stories Applied (SPIDR splitting); Adzic & Evans — Fifty Quick Ideas (vertical slices, survivable experiments)

### RULE: Gherkin automation — @claude tag policy (persistent, always enforced)
1. **Never apply the `@claude` tag to a new Gherkin scenario** unless the step genuinely cannot be automated — i.e., it requires human eyes, live browser interaction, or LLM output that cannot be mechanically verified. The `@claude` tag causes the scenario to be skipped by the pipeline. If it's skipped, it's not a gate.
2. **When writing new Gherkin as part of any BL item**: scan the feature file for any existing `@claude`-tagged scenarios that relate to the same feature or mechanic. Ask: can this now be automated given the new step defs or code paths? If yes → raise a BL item to automate it (remove @claude tag, write step defs, get GREEN). This check is mandatory — do it at BDD CLOSE.
3. **At each BDD CLOSE**: count the @claude-tagged scenarios in the feature file. If the count did not decrease, and there were candidates for automation, flag it.
- Reason: @claude-tagged scenarios are dark spots in the pipeline gate. Accumulated over time, they degrade confidence. Every scenario that can be automated should be automated.

### RULE: CONTINUE — message queue handling
When Rod sends messages while I am mid-task:
- **Default behaviour:** queue them in order, work through them after the current task completes.
  Do not interrupt mid-sequence to address a new message.
- **Override signals** — Rod uses these to break queue order:
  - `INTERRUPT` / `THIS 1st` / `FIRST` / `STOP` → address THAT message before finishing the current task.
    The override signal may appear in the same message as the priority item, or in the message before it.
- When I return to the queue after an interrupt, say "Returning to queue:" and list the remaining items.
- Never silently drop a queued message — if I finish the session without addressing it, flag it at closedown.

### TRIGGER: user pastes a Claude.ai conversation or design transcript
→ FIRST ACTION before anything else: extract all design decisions, character specs,
  named mechanics, and proposed BL items to a notes file.
→ Write to: `/notes/YYYY-MM-DD-[topic].md` in the relevant repo (cusslab or RIA)
→ Announce: "Capturing [topic] design session to notes/[filename]" before proceeding
→ Then address the user's actual request.
→ Log WL item if context would have been lost without the paste (cross-Claude sync gap).
Failure to do this = WL-095 pattern. The paste is a capture event, not just context.

### RULE: claude.ai → Claude Code communication
Never print large instruction blocks to chat for copy-paste.
Always write to a file using the computer tool, present it to Rod,
Rod downloads and pastes to Claude Code.
Threshold: any instruction >20 lines goes to a file.
This applies to: character files, feature files, config blocks,
multi-step instructions, any code to be written by Claude Code.

### RULE: Tool auto-approval — do not prompt for routine operations
Most Bash operations (git, bash, node, cat, ls, grep, python3 etc.) are auto-approved
via .claude/settings.local.json. If a prompt appears for a routine operation it means
the allow list needs updating — add the pattern to settings.local.json and commit.
Do NOT ask Rod to approve routine reads, writes, git commands, or pipeline runs.

### RULE: Ship after every BL close — always, no batching

Every time a BL item reaches DDD CLEAN: run COMMIT SEQUENCE immediately.
Do not finish two BL items then commit. One item closed = one commit + push.
This is non-negotiable. "Going fast" does not mean batching commits.

Signal: DDD CLEAN completes → COMMIT SEQUENCE fires automatically, no prompting needed.
Why: batched commits obscure causality, inflate blast radius of a bad push, and make
     session-close harder. One item, one commit, one hash. Always.
Source: DORA — deployment frequency; Humble/Farley — Continuous Delivery (small batches)

---

### SEQUENCE: Proactive session close — never let auto-compact fire
Auto-compact is a system event, not a rule I can enforce. What I CAN control:
watching for clean natural separations and closing there before the limit hits.

FORCING FUNCTIONS — observable checkpoints (WL-082, WL-084, WL-087):
Stop at whichever comes first:
- After 3 BL items closed in a single session → clean stop at next seam
- After 5 or more pipeline runs in a single session → clean stop at next seam
- Any time Rod says "pause" / "stop there" / "let's take stock" → clean stop immediately

WHAT IS A CLEAN SEAM:
A clean stop is only valid at a natural boundary — never mid-sequence.
Valid seams (in priority order):
  1. After COMMIT SEQUENCE completes (pipeline green, pushed, hash confirmed)
  2. After a BDD CLOSE or DDD CLEAN step
  3. After Rod confirms a decision but before the next sequence starts
  4. After a BL item is fully closed (not in the middle of TDD or Gherkin)
If a forcing function fires mid-sequence: finish the current atomic step, then close at the next seam above.
Never stop mid-Gherkin, mid-TDD, mid-investigation, mid-commit.

CLOSE SEQUENCE when a seam is reached:
1. Run session closedown: pipeline → waste log → backlog → shared-session-state → commit → push
2. Say: "Forcing function reached — clean stop here. Start a new session to continue."
3. New session picks up from shared-session-state.md — no context lost.

The cost of a clean stop is 2 min. The cost of a reactive compact is 15+ min (WL-082, WL-084).
Auto-compact firing = process failure. A clean seam stop = process working.

### RULE: Windows Downloads folder is accessible
Rod's Downloads folder is always available at /mnt/c/Users/roden/Downloads/
NEVER ask Rod to paste file contents — always read directly:
  cat "/mnt/c/Users/roden/Downloads/<filename>" > /tmp/out.txt && cat /tmp/out.txt
If Rod provides a Windows path (C:\Users\roden\...) convert to /mnt/c/Users/roden/...
Failure to check this before asking Rod to paste = WL-071 pattern, waste log entry.

---

## THE LOOPS — how they nest

Four levels. Each asks a different question at a different timescale.

PRODUCT FEEDBACK LOOP (outermost — weeks to months)
  Did what we built produce the intended outcome? Should we keep going in this direction?
  Tools: Impact Mapping → Hypothesis Card → CD3 → AARRR → Pivot/Persevere
  Sources: Adzic, Reinertsen, McClure, Ries, Gilb, Hubbard
  Read: .claude/practices/hypothesis-driven.md when scoping any new feature

Inside that, Lean and Systems Thinking are the session-level philosophical frame.
They are not steps — they are the lens through which all activity is evaluated:
  LEAN:             Is value flowing? Is this the highest-value thing we can do?
                    Does this eliminate waste or create it? Quality built in or inspected in?
  SYSTEMS THINKING: What stocks are at risk? What feedback loops are active?
                    What will this make impossible? What second-order effects will it create?
Sources: Poppendieck/Womack — Lean Software Development / Lean Thinking
         Meadows — Thinking in Systems; Senge — The Fifth Discipline

Inside that frame, three delivery loops nest:

DDD is the design loop (domain coherence, outside-in).
BDD is the contract loop (behaviour specification).
TDD is the inner loop (implementation discipline).

LEAN / SYSTEMS THINKING ─────────────────────────────────────────────────────────────
│                                                                                     │
│  DDD RED ──────────────────────────────────────────────────► DDD CLEAN             │
│  │                                                               ▲                 │
│  ▼                                                               │                 │
│  BDD (Gherkin written + approved)                      BDD CLOSE ─┘                │
│  │                                                       ▲                         │
│  ▼                                                       │                         │
│  TDD RED → TDD GREEN → TDD CLEAN ───────────────────────►─┘                       │
│                                                                                     │
LEAN / SYSTEMS THINKING ─────────────────────────────────────────────────────────────

DDD RED fires before Gherkin and before implementation.
BDD CLOSE fires after TDD CLEAN — Gherkin retrospective against real implementation.
DDD CLEAN fires after BDD CLOSE — harvest new concepts into domain model.

---

## SEQUENCES

### FEATURE SEQUENCE — DDD RED + BDD first gate
0. OUTER LOOP CHECK — before anything else:

   PRODUCT HYPOTHESIS (read hypothesis-driven.md in full if new feature):
   - Does this item have a hypothesis card? If not — write one before proceeding.
   - Which AARRR stage does this target? Are we fixing the right stage?
   - What would falsify this hypothesis? Is that falsifier observable?
   - Source: Ries — Lean Startup; McClure — AARRR; Adzic — Impact Mapping

   COMBINED CD3 TRIAGE — run at the start of each DDD outer loop (when selecting what to work on):
   - Pull all OPEN items from backlog.md AND waste-log.md
   - Rank by CD3 (backlog items) or urgency/blocker status (waste-log items)
   - Waste-log OPEN items surface as blockers alongside backlog CD3 scores
   - Present the ranked list before committing to a work item
   - Source: Reinertsen — Product Development Flow (Cost of Delay, CD3)

   LEAN CHECK:
   - Is this the highest-value thing we can do right now? (Combined CD3 triage confirms?)
   - What is the constraint today — is this on the critical path or adjacent to it?
   - What waste would working on this create? (partially done work, task switching, gold plating)
   - Source: Poppendieck — Lean Software Development; Reinertsen — Product Development Flow

   JOBS TO BE DONE:
   - What job is Rod hiring this feature to do? Does the design serve that job directly?
   - Source: Christensen — Jobs to Be Done; Norman — Design of Everyday Things
1. Confirm scope — what behaviour are we specifying?
   Apply INVEST if not already checked at RAISE NEW WORK (see `.claude/practices/user-stories.md`).
   If the story fails **Small** — split before writing Gherkin (SPIDR patterns in user-stories.md).
   If the story fails **Valuable** — run Three Amigos to surface the outcome before proceeding.
   Walking skeleton rule: if this is the first slice of an epic, build the thinnest end-to-end
   slice first (input → logic → output) — prove it works before adding complexity.
2. DEVOPS DESIGN CHECK — for every new artefact this feature will create:
   Run the check (see below). Single responsibility, bounded interface, detectable failure,
   reuse over reinvention, small and deployable, right location.
   Do not start DDD RED until the artefact design is settled.
4. DDD RED — run before writing a single line of Gherkin:
   - Fetch and read domain-model.md if not read this session
   - Check: does this feature introduce new domain concepts?
   - Check: does anything conflict with existing bounded contexts?
   - Check: is the ubiquitous language defined for all new terms?
   - Flag: any ambiguity or conflict to Rod before proceeding
   - Flag: any business/product AND technical conflicts — they are the same thing
   - Source: Evans — Domain-Driven Design, bounded contexts + ubiquitous language
5. PRE-IMPLEMENTATION REVIEW — run checklist (see below)
6. Draft Gherkin to specs/ — apply 6-point BDD quality gate (see CLAUDE.md):
   - **Scenario vs Scenario Outline** — if two or more scenarios share the same step structure
     with different data, use Scenario Outline + Examples table. Never write individual
     scenarios for tabular data. This is rule 1 of the quality gate.
   - **Merge check** — after drafting all outlines, ask: do any share the same Given/When
     with only Examples data different? If yes, merge unless Then steps are materially different.
   - **Background audit** — if 3+ scenarios share the same Given, it belongs in Background.
   - **Count discipline** — if count >12, review for redundancy before adding more.
   - **Formula verification (mandatory for numeric assertions)** — before writing any `Then` that asserts a number derived from a formula (runs, wickets, scores, averages, bonuses), run `node -e "..."` to compute the expected value. Never write numeric Gherkin assertions from mental arithmetic alone. Source: WL-150, WL-152 — recurring Gherkin red on first run.
7. Present for approval — do not proceed until Rod says yes
8. On approval → TDD SEQUENCE

### PRE-IMPLEMENTATION REVIEW CHECKLIST
Run before any implementation. Report findings. Propose design. Await Rod approval.

**DDD:**
- [ ] All new concepts named in ubiquitous language
- [ ] No bounded context violations
- [ ] Single responsibility per new function/module
- [ ] Gold standard pattern exists? If yes — copy, don't invent
- Source: Evans — Domain-Driven Design

**SOLID:**
- [ ] Single Responsibility — one reason to change per module
- [ ] Open/Closed — extend, don't modify existing working code
- [ ] Liskov — no surprises when substituting implementations
- [ ] Interface Segregation — no forced dependencies on unused interfaces
- [ ] Dependency Inversion — depend on abstractions not concretions
- Source: Martin — Agile Software Development

**Clean Code:**
- [ ] Names reveal intent — no abbreviations, no mystery variables
- [ ] Functions do one thing
- [ ] No dead code, no commented-out code
- [ ] No magic numbers — named constants only
- Source: Martin — Clean Code

**DevOps / DORA:**
- [ ] Change is small and deployable independently
- [ ] Pipeline will stay green
- [ ] No new environment dependencies without flagging
- [ ] Trunk-based — no long-lived branches
- Source: DORA metrics; .claude/STANDARDS.md

**Usability & UX:**
- [ ] Nielsen Heuristic 1: Visibility of system status
- [ ] Nielsen Heuristic 4: Consistency and standards
- [ ] Nielsen Heuristic 6: Recognition over recall
- [ ] Nielsen Heuristic 8: Aesthetic and minimalist design
- [ ] SUS implications considered for any new UI element
- Source: Nielsen 10 Usability Heuristics; System Usability Scale

**Non-functional:**
- [ ] Accessibility: WCAG 2.1 AA — any new UI element keyboard navigable?
- [ ] Security: no API keys client-side, no secrets in code
- [ ] Performance: no synchronous blocking in UI thread
- [ ] Source: WCAG 2.1 AA; OWASP; .claude/STANDARDS.md

**XP — Simple Design (Beck/Jeffries — in priority order):**
- [ ] Passes all tests — this is always rule 1, never traded for anything below it
- [ ] Reveals intention — can Rod read this function name and know immediately what it does?
- [ ] No duplication — single source of truth; if it appears twice, it belongs in one place
- [ ] Fewest elements — is there a simpler design that passes the same tests?
- Source: Beck — XP Explained; Jeffries — Four Rules of Simple Design

**Systems Thinking — Consequences (Meadows/Senge):**
- [ ] What does this change make impossible that is currently possible?
- [ ] What feedback loops does this affect — reinforcing or balancing?
- [ ] What does this incentivise that we don't want? (e.g. mock-based tests → false greens)
- [ ] What is the second-order effect in 3 sessions' time?
- Source: Meadows — Thinking in Systems; Senge — The Fifth Discipline

**Norman/Krug — Usability at the seam:**
- [ ] Does this UI element do what it looks like it does? (Norman Door test)
- [ ] Does the user need to remember anything, or can they recognise? (recognition over recall)
- [ ] What is the job the user is hiring this feature to do? Does the design serve that job?
- Source: Norman — The Design of Everyday Things; Krug — Don't Make Me Think;
          Christensen — Jobs to Be Done

### INVESTIGATE AND RESOLVE SEQUENCE — DMAIC within PDCA

Structure: PDCA (Deming) is the outer cycle. DMAIC (Six Sigma) marshals the investigation.
PLAN = Define + Measure + Analyze. DO = Improve. CHECK = verify. ACT = Control + prevent.

**D — DEFINE (confirm and bound the defect)**
1. Reproduce it. Can you make it happen consistently? If not — characterise the conditions.
2. State the defect precisely: "When [X], [Y] happens instead of [Z]."
3. Waste log entry NOW — not at session end. WL number logged before any investigation.
   Include: symptom, suspected cause (hypothesis), tags, Status: Open.
4. Source: Juran — Project-by-Project Quality Improvement; Pyzdek — Six Sigma Handbook

**M — MEASURE (quantify impact and blast radius)**
1. How often does this occur? Always / sometimes / edge case?
2. Which users / flows / data does it affect?
3. What is the cost? (Rod play time lost, pipeline trust, hidden debt)
4. Are there related WL entries (pattern matching)?
5. Source: Reinertsen — Cost of Delay (measure before acting); DORA — change failure rate

**A — ANALYZE (root cause — pick the right tool)**
Use the appropriate root cause tool from the standards library:
- **5 Whys** (`.claude/practices/5-whys.md`): default for simple linear cause chains
- **Fishbone / Ishikawa**: when multiple independent cause branches are possible
  (Machine, Method, Material, Man, Measurement, Environment)
- **Fault Tree Analysis (FTA)**: when failure requires multiple conditions to coincide
  (AND/OR logic trees — useful for intermittent bugs)
- **Systems Thinking (Meadows)**: when the bug is a symptom of a feedback loop or
  structural incentive in the design, not just a code error

The fifth why always ends at a system, process, or structural gap — never at a person.
Source: Ohno — Toyota Production System; Meadows — Thinking in Systems

**I — IMPROVE (frame as hypothesis, not just a fix)**
1. Form an improvement hypothesis (see `.claude/practices/hypothesis-driven.md`):
   "If we [do X], then [observable outcome] because [root cause from Analyze]."
2. State the falsifier: "We will know we were wrong if [counter-signal]."
3. **Fix order — impact first, cosmetic last.** When multiple issues are identified, fix in order of impact — not discovery order, not ease. A broken sync file outranks a stale comment count. A broken game flow outranks a misnamed variable. Never fix the easy thing first just because it's easy.
4. Apply the minimum fix — no gold-plating around a bug fix (Beck — XP; Poppendieck — Lean).
5. If new behaviour is introduced: Gherkin gate applies.
   If fix restores existing contract only: guard + WL closure sufficient.
6. Source: Beck — XP (simplest thing that works); Fowler — Refactoring (change safely)

**C — CHECK (verify the fix)**
1. Pipeline green before any commit. No exceptions.
2. Confirm the original defect is no longer reproducible.
3. Confirm no regressions — all existing Gherkin still passing.
4. If a new code path was added: Gherkin scenario added and green.
5. Source: DORA — change failure rate; Fowler — Continuous Delivery

**A — ACT (control and prevent recurrence)**
1. WL entry: update Status to Closed with fix commit hash.
2. Ask: could a pipeline check have caught this earlier? If yes — add it.
3. Ask: does this reveal a class of similar defects? If yes — backlog item for the pattern.
4. Ask: does the root cause suggest a process gap? If yes — update session-insession.md
   or closedown.md (using the standards review step 4b at session close).
5. Source: Deming — PDCA; Juran — Control Phase; Reinertsen — Cost of Delay (prevent recurrence)

### RAISE NEW WORK SEQUENCE — file it before it evaporates

**RULE: never let new work live only in conversation.** If it matters, it gets a number now.
No sub-items. No BL-NNN-X. Every item is a first-class BL or WL entry with its own number.

**Step 1 — Classify:**
- **WL** if something already went wrong: waste, rework, bug experienced, time lost, trust damaged.
  (If raised during INVESTIGATE AND RESOLVE, the Define step already opens the WL entry — do not duplicate.)
- **BL** if it is new capability, improvement, or content not yet built.

**Step 2 — Assign the next number:**
- Read backlog.md or waste-log.md to find the current highest number.
- Assign next available BL-NNN or WL-NNN. Never reuse. Never sub-number.

**Step 3 — Write the minimum viable entry immediately:**
- **WL entry minimum:** Item + Symptom + Suspected cause + Tags + Status: Open
- **BL entry minimum:** Name (one line) + CD3 score (UBV / TC / RR / CoD / Dur / CD3) + Feature label + Epic (if part of a group) + Status: OPEN
- **Feature label (mandatory):** Set `Feature:` on every BL item using the canonical labels in backlog.md header. TBT items use `tbt`. Check the canonical list — do not invent new labels without adding them to the header first. Observable: `bash .claude/scripts/feature-report.sh` must show no `(unlisted)` items.

**Step 3b — Story quality check (BL items only):**
Before finalising the BL entry, apply INVEST (see `.claude/practices/user-stories.md`):
- **Independent** — can it be shipped without an unfinished story blocking it?
- **Negotiable** — is it a placeholder for Three Amigos, not a fixed spec?
- **Valuable** — does the "so that" clause name a user or product outcome?
- **Estimable** — is scope clear enough to score Dur?
- **Small** — completable in one session (one Gherkin → red → green → clean → push)?
- **Testable** — can Gherkin describe the acceptance condition right now?

If it fails **Small**: split now using SPIDR (user-stories.md). Each split gets its own BL number.
If it fails **Valuable**: reframe until the outcome is named, or flag for Three Amigos first.
If it fails **Estimable**: raise a spike story (Dur=1, output=decision) before the delivery story.
If it's an epic (multiple characters, panels, deliverables): apply the epic decomposition sequence in user-stories.md.

Source: Cohn — User Stories Applied; Wake — INVEST; Adzic & Evans — Fifty Quick Ideas to Improve Your User Stories

**Step 4 — Announce it:**
- Say: "Raised as BL-NNN: [name]" or "Raised as WL-NNN: [symptom]"
- Then return to the current work without losing thread.

**Epic label rule:**
- If this item belongs to a set of related items (same tournament series, same feature theme), add: `Epic: [label]`
- The epic is a label only — never a backlog item itself, never numbered as BL-NNN.
- Example: Epic: "Modern Majors Tier 2", Epic: "Ryder Cup Rollout"

**Epic decomposition rule:**
- If the item being raised IS an epic (multiple characters, multiple panels, multiple distinct deliverables):
  immediately decompose it into individual BL items — one per character, one per deliverable.
- Do this at the time of raising, not at the start of implementation.
- Each decomposed item should be session-sized: one Gherkin → red → green → clean → push.
- The parent epic item (e.g. BL-058 Author Epilogue) becomes the design/discovery item.
  Its children (BL-060 Author: Tolkien, BL-061 Author: McCarthy, etc.) are the delivery items.
- Unfiled characters = invisible WIP = waste.
- Source: Poppendieck — Lean (small batch size, WIP limits); Reinertsen — Product Development Flow

**Source:** WL-001, WL-081 — unrecorded work is the primary source of knowledge loss.

### TDD SEQUENCE — red → green → clean
1. Identify unit assertions from approved Gherkin
2. Write unit tests to pipeline/unit-runner.js — red, do not implement yet
   (logic under test lives in pipeline/logic.js)
3. Run pipeline — confirm tests failing for the right reason
4. Report which tests are red and why
5. On Rod's go → IMPLEMENTATION SEQUENCE
6. **GAP CHECK** — after tests green, before BDD CLOSE:
   Scan all exports in pipeline/logic.js. For each export, ask: is there at least one
   behavioral test in unit-runner.js that would fail if this function's behaviour changed?
   "Is a function" and "returns a string" are not behavioral tests — they test type, not output.
   Add missing behavioral tests now, before moving on. Do not defer gap-fill to a later session.

### IMPLEMENTATION SEQUENCE — green the tests
1. Write minimum implementation to green the unit tests
2. Run pipeline — confirm unit tests green
3. Write Gherkin step definitions to pipeline/gherkin-runner.js — red
4. Wire implementation to steps — Gherkin green
5. Run pipeline — full green
6. TDD CLEAN — run refactor checklist (see below)
7. → BDD CLOSE

### TDD CLEAN — REFACTOR CHECKLIST
Run after unit tests green, before BDD CLOSE. Report findings. Only write when
something real needs changing — forced refactor every cycle is noise.

- [ ] Does any function do more than one thing? Extract it.
- [ ] Are any names unclear or inconsistent with ubiquitous language? Rename.
- [ ] Is there duplication? Extract to shared function in logic.js.
- [ ] Are there magic numbers or hardcoded strings? Extract to named constants.
- [ ] Is any module longer than it needs to be? Single responsibility check.
- [ ] Does the gold standard pattern still apply? If we've drifted — align.
- [ ] Are tests testing behaviour or implementation? If implementation — rewrite.
- [ ] Are all new exports in logic.js pure functions? If not — extract.
- [ ] LEAN: Does this refactor eliminate waste (duplication, obscurity, complexity) or create it?
      If the refactor exists only to satisfy a checklist — it is waste. Only write when real.
- Source: Fowler — Refactoring (2nd ed); Martin — Clean Code
- Source: Meszaros — xUnit Patterns (behaviour not implementation)
- Source: Poppendieck — build quality in, not inspect in after

### BDD CLOSE — Gherkin retrospective
Run after TDD CLEAN. Closes the BDD loop against real implementation.

1. All Gherkin scenarios passing against real implementation — not stubs,
   not mocks, not hardcoded step returns
2. Step definitions are calling real logic — verify
3. Scenario drift check: does each scenario description still accurately
   describe the actual behaviour? If not — update the spec consciously,
   never silently
4. Redundancy check: did any scenarios become redundant during implementation?
   Flag for removal with reason
5. Coverage check: did implementation reveal missing scenarios? Add and get
   approval before closing
6. Run pipeline — full green
7. → DDD CLEAN

### DDD CLEAN — domain model harvest
Run after BDD CLOSE. Closes the DDD outer loop. Only when something real has emerged.

1. Review all new concepts introduced this cycle
2. Are any new concepts not yet in domain-model.md? Add them.
3. Are any new patterns general enough to serve other panels/features? Name them.
4. Are any new functions candidates for single-responsibility extraction? Flag.
5. Raise backlog items for any generalisation opportunities identified
6. Update domain-model.md — ubiquitous language section first, then model
7. SYSTEMS THINKING: did any second-order effects emerge during this cycle?
   New coupling introduced? Feedback loop affected? Stock changed (trust, quality, debt)?
   Flag now — do not carry unexamined consequences into the next cycle.
8. → COMMIT SEQUENCE
- Source: Evans — Domain-Driven Design, strategic and tactical patterns
- Source: Meadows — Thinking in Systems (stocks, flows, unintended consequences)

### COMMIT SEQUENCE — never skip
1. Run pipeline — must be green: `bash .claude/scripts/pipeline-report.sh > /tmp/out.txt && cat /tmp/out.txt`
2. Write to file if any output > 20 lines — never paste to chat
3. git add → git commit (descriptive message) → git push
4. Confirm origin/main updated — report hash
5. Append waste log entry if anything went wrong this session

### DEVOPS DESIGN CHECK — for every new persistent artefact
Run before writing any new file, script, module, doc, or report that will live in the repo.
The question: does this artefact behave like a well-designed service?

**Single Responsibility**
- Does it do exactly one thing? Name it in one sentence. If you need "and", it does too much.
- Source: Martin — Clean Code; SOLID

**Well-bounded interface**
- What goes in? What comes out? What are the failure modes?
- Can it be called, tested, and replaced independently of everything else?
- Source: Evans — DDD bounded contexts; Martin — Interface Segregation

**Detectable failure**
- What does failure look like? Does the failure signal exit code 1? Write to stderr? Throw?
- Can the pipeline detect it? If not — add a pipeline check now, not later.
- Example: pipeline-report.sh exits 1 on RED; browser-sim.js throws on stale URL.
- Source: DORA — change failure rate; Fowler — Continuous Delivery

**Reuse over reinvention**
- Does something equivalent already exist? If yes — extend it, don't duplicate.
- New script doing what an existing script already does = waste (Poppendieck).
- Check: .claude/scripts/, pipeline/, src/ before creating anything new.

**Small and deployable independently**
- Can this artefact be shipped without depending on unreleased work elsewhere?
- If not — what is the seam that decouples it?
- Source: DORA — deployment frequency; Humble/Farley — Continuous Delivery

**Persistence decision**
- Where does this live? docs/ (character files), specs/ (Gherkin), pipeline/ (checks),
  .claude/scripts/ (ops), src/ (app logic). Wrong location = motion waste later.
- If it has no natural home — does it need to exist at all?

Apply this check to: scripts, practice files, character files, pipeline checks,
reports, docs, config blocks, any new directory. Not just code.
Source: DORA metrics; Martin (SOLID); Evans (DDD); Poppendieck (Lean)

### CHARACTER SEQUENCE — research → Gherkin → file
1. Run CHARACTER RESEARCH PROTOCOL
2. Draft character summary — wounds, voice, comedy engine
3. Gherkin for character behaviour if needed — apply BDD quality gate
4. Write character .md to docs/ — never inline in index.html
5. Wire into MEMBERS array
6. → COMMIT SEQUENCE

### CHARACTER RESEARCH PROTOCOL
Search in order:
  1. "[name] controversy"
  2. "[name] quotes"
  3. "[name] feud"
  4. "[name] incident"
  5. "[name] [co-panellist] relationship"
Real incidents always funnier than invented ones.
Compile: wounds, voice, comedy engine, panel fit before writing anything.
Source: .claude/practices/domain-model.md — character builder section

---

## DESIGN PRINCIPLES SUMMARY — one-line per principle

OUTER PHILOSOPHICAL FRAME — applies at every stage, not just pre-implementation:
Lean: value flows or it doesn't — eliminate what blocks it — Poppendieck / Womack
Systems Thinking: systems produce the results they're designed for — fix the system, not the symptom — Meadows / Senge

DELIVERY LOOPS:
DDD: domain model is the bounded context — Evans
SOLID: single responsibility first, always — Martin
Clean Code: names reveal intent, functions do one thing — Martin
Refactoring: improve structure without changing behaviour — Fowler
XP: simplest thing that passes all tests, reveals intention, no duplication — Beck / Jeffries
Test design: test behaviour not implementation — Meszaros / Smart / Adzic
DevOps: small changes, pipeline green, trunk-based — DORA

USER / PRODUCT LAYER:
Usability: recognition over recall, consistency, visibility — Nielsen / SUS
Accessibility: WCAG 2.1 AA minimum — every new UI element
Jobs to be done: users hire products; design serves the job, not the feature — Christensen / Norman / Krug
Security: no keys client-side, ever — OWASP

---

## OUTER LOOP PRINCIPLES SUMMARY — one-line per framework

Product Feedback Loop: did it work? pivot or persevere — Ries / Lean Startup
Impact Mapping: who changes behaviour → what impact → what to build — Adzic
Hypothesis-Driven Dev: write the falsifier before writing the code — O'Reilly / Fichtner
AARRR: locate where value is leaking in the funnel — McClure
CD3 + Cost of Delay: weekly cost of not shipping this, now — Reinertsen
Measurement: if you can't define the scale, you can't test the hypothesis — Gilb / Hubbard
DORA: delivery health is the prerequisite for a fast outer loop — Forsgren / Kim / Humble

---

## REFERENCE FILES — fetch when trigger fires, not before
.claude/practices/domain-model.md  — character/panel work + ubiquitous language
.claude/CLAUDE.md                  — ways of working, BDD quality gate
.claude/practices/waste-log.md     — append after mistakes
.claude/practices/auth-ops.md      — auth/deploy work
specs/                             — all Gherkin lives here
docs/                              — all character files live here
pipeline/unit-runner.js            — all unit tests (count live: run pipeline)
pipeline/logic.js                  — pure functions under test
pipeline/gherkin-runner.js         — Gherkin step definitions
.claude/practices/hypothesis-driven.md — outer loop: hypothesis card, AARRR, pivot/persevere
.claude/practices/user-stories.md     — work decomposition: INVEST, Three C's, SPIDR splitting, epic decomposition
.claude/practices/ideas.md            — ideas board: unvalidated concepts, raw captures, pre-backlog holding area
.claude/practices/test-design-techniques.md — EP, BVA, decision tables, state transition, mutation, property-based, SBET, pairwise, risk-based — read when designing test cases or choosing Gherkin examples
