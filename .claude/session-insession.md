# In-Session Protocol — Heckler and Cox
# Trigger map and delivery discipline
# Last updated: 2026-03-08
# Sources: Evans (DDD), Martin (Clean Code, SOLID), Fowler (Refactoring),
#          Meszaros (xUnit Patterns), Smart (BDD in Action),
#          Adzic/Evans (Fifty Quick Ideas to Improve Your Tests),
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

### TRIGGER: "something just went wrong" / "that's broken" / "wtf" / pipeline RED
→ Waste log entry IMMEDIATELY — not at session end.
→ 5 Whys before any fix. Root cause first. See .claude/practices/5-whys.md
→ Source: Poppendieck — build quality in, not inspect in after the fact

### TRIGGER: any new persistent artefact (code, config, script, doc, test, report)
→ Run: DEVOPS DESIGN CHECK before writing it

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

### RULE: Stop before auto-compact — never let it fire reactively
When context is getting long and auto-compact is approaching:
STOP. Do not wait for it to fire.
1. Run session closedown (pipeline → waste log → backlog → shared-session-state → commit → push)
2. Tell Rod: "Context filling — clean stop here, start a new session"
3. New session picks up from shared-session-state.md — no context lost
Letting auto-compact fire mid-task wastes 10-20 min re-establishing state every time (WL-082).
Applies to both Claude Code and Claude.ai. Proactive stop > reactive compact.

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

### TDD SEQUENCE — red → green → clean
1. Identify unit assertions from approved Gherkin
2. Write unit tests to pipeline/unit-runner.js — red, do not implement yet
   (logic under test lives in pipeline/logic.js)
3. Run pipeline — confirm tests failing for the right reason
4. Report which tests are red and why
5. On Rod's go → IMPLEMENTATION SEQUENCE

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
pipeline/unit-runner.js            — all unit tests (403 assertions)
pipeline/logic.js                  — pure functions under test
pipeline/gherkin-runner.js         — Gherkin step definitions
.claude/practices/hypothesis-driven.md — outer loop: hypothesis card, AARRR, pivot/persevere
