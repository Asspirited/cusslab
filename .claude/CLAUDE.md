# CLAUDE.md — Heckler and Cox
# Last updated: 2026-02-28

---

## Session Start (mandatory, before any code)

Read `.claude/session-startup.md` — follow its sequence in full before doing anything else.
It covers: auth check, pipeline, recent waste, backlog, retro findings, product context,
character rules, ways of working, principles, practices, and project separation.
Do not skip steps. Do not reorder. Do not start work until the sequence is complete.

---

## Backlog — Auto-Capture Rule (MANDATORY)

Whenever a scope enhancement, tech debt fix, bug, or idea surfaces — in conversation, in code review, in pipeline output — add it to `.claude/practices/backlog.md` immediately. Do not wait until session end. Do not batch them up.

Schema for new items:
```
### BL-NNN — Short title
- Description: what and why
- CD3: UBV=N TC=N RR=N → CoD=N, Dur=N, **CD3=N.N**
- Status: OPEN
```

CD3 = (User Business Value + Time Criticality + Risk Reduction) / Duration.
Scores 1–10 each. Sort open items by CD3 descending after adding.
Reference: Black Swan Farming / Reinertsen approach. RIA has working implementation.

---

## Session End (mandatory, before closing)

1. Review session for any insights flagged "worth a conversation" or "unactioned"
2. Run `cd /home/rodent/cusslab && node pipeline/metrics-report.js && npm test` — report final DORA stats and coverage. Flag any regression from session-start numbers.
3. Review for any decisions made but not yet implemented
4. Review for any regression or unexpected behaviour observed
5. Review for any friction that cost tokens or time
6. Commit any new entries to .claude/practices/waste-log.md and backlog.md
7. Push — no session ends without waste-log and backlog committed and pushed

---

## Principles Files (read to think about problems correctly)

These files govern HOW to think before designing or implementing anything.

- .claude/principles/ddd.md — bounded contexts, ubiquitous language, domain events, aggregates
- .claude/principles/xp.md — simplicity, feedback, courage, four rules of simple design
- .claude/principles/lean.md — eliminate waste, optimise the whole, defer commitment
- .claude/principles/systems-thinking.md — feedback loops, emergence, unintended consequences
- .claude/principles/ux.md — jobs to be done, Norman's principles, Krug's law

---

## Practices Files (read to implement correctly)

These files govern HOW to do the work at each step of the cycle.

- .claude/practices/auth-ops.md — Worker URL, Cloudflare account ID, key rotation procedure, canary diagnosis
- .claude/practices/bdd.md — Gherkin gate, Given-When-Then, done conditions
- .claude/practices/tdd.md — 7-step cycle, four isolation levels, state factories
- .claude/practices/solid.md — SOLID applied to our codebase, clean code rules, refactoring triggers
- .claude/practices/5-whys.md — root cause analysis procedure, our bug log
- .claude/practices/ci-cd.md — pipeline steps, push rule, recovery playbook, scorecard format
- .claude/practices/dora.md — four metrics, how to measure, metrics file formats
- .claude/practices/retrospectives.md — triggers, format, lenses, anti-patterns
- .claude/practices/domain-model.md — our domain model, bounded contexts, ubiquitous language
- .claude/practices/ux-decisions.md — design decisions log, personas, UX review checklist
- .claude/practices/architecture-review.md — extraction order, seam inventory, testing pyramid, SOLID/Feathers/Beck/Newman applied

---

## Standards Files

- .claude/standards/references.md — all authoritative sources

---

## The Integrated Delivery Cycle
Every feature. Every bug fix. Every session. No exceptions.

### Step 1 — Three Amigos (BDD)
Read: principles/ddd.md, principles/ux.md
Rod and Claude agree the behaviour in plain language.
What does the user see? What job does this serve? What domain concept does this touch?

### Step 2 — Gherkin (BDD Gate — enforced)
Read: practices/bdd.md
Write scenario in Given-When-Then. Then:
1. Output COMPLETE literal text of every new or modified scenario
2. Print: "WAITING FOR ROD'S APPROVAL — do not proceed until Rod confirms"
3. STOP. Do not run pipeline. Do not fix code. Do not commit.
4. Wait for Rod to explicitly type "approved" or give feedback
5. Only proceed after explicit written approval in this session

Previous session approval does not count.

**BDD GHERKIN QUALITY GATE — run this before outputting any feature file for approval:**

1. **Scenario Outline first** — if two or more scenarios share the same step structure with different data, they MUST be a Scenario Outline + Examples table. Never write individual scenarios for tabular data.
2. **Merge opportunity check** — after drafting all outlines, ask: do any two outlines share the same Given/When with only the Examples data different? If yes, merge unless the Then steps are materially different.
3. **Examples table scope** — an Examples table represents one dimension of variation only. Characters × modules = two separate outlines, not one combined table.
4. **Scenario count discipline** — if count exceeds 12, review for redundancy before adding more. Every scenario must assert a distinct behaviour not covered elsewhere.
5. **Background audit** — if three or more scenarios share the same Given, it belongs in Background, not repeated per scenario.
6. **No scenario for constants** — if an assertion is true by definition, it is one tightly named Scenario, not an outline. Do not iterate over constants.

Self-review against this checklist before printing "WAITING FOR ROD'S APPROVAL". Never skip.

**OUTPUT SIZE RULE — non-negotiable**
Never print large blocks of text (code, feature files, character files, config) to the chat for copy-paste. Always write directly to file then commit. If output would exceed ~20 lines, it goes to a file. This applies in both Claude Code and Claude.ai sessions.

### Step 3 — Outside-In Design (SOLID)
Read: principles/ddd.md, practices/solid.md, principles/systems-thinking.md
Design the public interface before writing any code or test.
- SRP: one reason to change?
- OCP: extends or modifies?
- LSP: interchangeable?
- ISP: minimal interface?
- DIP: depends on abstraction?
- Second-order effects: what does this make impossible?

### Step 4 — Failing Test (TDD Gate — enforced)
Read: practices/tdd.md
Write the unit test against the interface from Step 3.
Run it. Confirm: (1) it fails, (2) it fails for the RIGHT reason.
Do not proceed until both confirmed.

### Step 5 — Minimum Implementation (TDD)
Read: practices/solid.md (clean code rules)
Write least code required to pass the test.
No gold plating. No future-proofing. No "while I'm here".

### Step 6 — Refactor (TDD + SOLID)
Read: practices/solid.md (refactoring triggers), principles/xp.md (four rules)
Run tests — confirm green. Then apply refactoring checklist.
Run tests again — must still be green.

### Step 7 — Pipeline (BDD living documentation)
Read: practices/ci-cd.md
Run npm run pipeline. All 5 steps must pass. A partial green is a red.
Coverage ≥70% statements, ≥70% branches.

### Step 8 — Push
Read: practices/ci-cd.md (push rule)
GREEN = commit + push = auto-deploy. Rod verifies in browser.

### Step 9 — Retro Trigger Check
Read: practices/retrospectives.md, practices/5-whys.md, practices/dora.md
- Rod caught something? → 5 Whys + retro this session
- False green? → retro this session
- Pending count increased? → explain, get approval
- All good? → log metrics, continue

---

## Non-Negotiable Rules

### PUSH Rule
npm run pipeline after any change to index.html, pipeline/, bug fix, or feature.
GREEN = commit + push. Never push red.

### SINGLE FILE Rule
One index.html at repo root only. Before any file operation:
```bash
find . -name "index.html" | grep -v node_modules
```
More than one result = stop, flag, do not proceed.

### REVERT Rule
Before reverting: check if pipeline/ changed in the commit.
pipeline/ and index.html must stay in sync.
See practices/ci-cd.md for full procedure.

---

## Architecture Rules

- Single index.html — all HTML, CSS, JS in one file
- Module pattern: `const ModuleName = (() => { ... })();`
- No framework, no build step, no bundler
- API calls via Cloudflare Worker only — never directly to api.anthropic.com
- No API key ever in frontend code or browser storage

## KNOWN RECURRING FAILURE — Cloudflare Worker secret update (WL-060)
**DO NOT suggest `wrangler login` — it opens a browser that always shows the wrong Google account.**
To update the Worker's ANTHROPIC_API_KEY secret, use an API token instead:
1. Go to dash.cloudflare.com (logged in as leanspirited@gmail.com)
2. My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template
3. Copy the token
4. Run: `cd /home/rodent/cusslab && CLOUDFLARE_API_TOKEN=<token> wrangler secret put ANTHROPIC_API_KEY`
5. Paste the Anthropic key (sk-ant-...) when prompted
This has wasted time across 5+ sessions. Never use browser OAuth flow for this.
- summariseFromState() must be deterministic — same input, same output, always

---

## Approved Gherkin Awaiting Code (as of 2026-03-08)

Cloudflare Worker: DONE — worker.feature 10/10 passing, API module implemented.

Remaining approved scenarios:
1. Irony Authenticity (11 scenarios) — 12th dimension + Isn't It Ironic tab (ironic.feature 11/11 passing — Three Amigos needed to confirm 12th dimension scope)
2. Panel Character State (10 scenarios) — event log, intensity, decay, spike
3. Six panel member profiles (1 scenario) — Harold, Sebastian, Roy, Hicks, Partridge, Mystic

NOTE: Panel character state scenarios written for 4 panels. Need new scenarios for Hicks,
Partridge, and Mystic before implementation. Three Amigos required.

Full scenario text: retrospectives/session-retro-2026-02-28.md

---

## Yak Shaving Rule
Current task drifted from original goal? Name it. 20-minute limit.
Not resolved in 20 minutes: revert, ask a better question.
