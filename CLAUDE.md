er # CLAUDE.md — Heckler and Cocks Project Brief

## Project Brief (Full)

Read `.claude/project-brief.md` in full before starting any session. It contains the complete
project history, all decisions, all standards references, and the root cause taxonomy.
It is not optional reading.

## What this project is
Cuss Lab is a culturally-calibrated compound profanity impact analyser.
It scores words across 10 linguistic dimensions (acoustic impact, scalar
flexibility, moral condemnation, visual/absurdist image, cross-cultural
portability, originality, grammatical flexibility, class/social signalling,
comic potential, emotional range) and applies culture-specific modifier
layers for AU, NZ, UK, US, IE, CA, ZA, IN, SG.

The product also has:
- AI word generation via Anthropic API (claude-sonnet-4-20250514)
- Community ratings with persistent storage
- A leaderboard of scored words
- A deploy guide for GitHub Pages

## Architecture
Phase 1: Single self-contained HTML file (index.html). No build step,
no dependencies, no backend. Everything — scoring engine, UI, data — lives
in one file. This is intentional for easy iteration and free static hosting.

## Core scoring logic
- computeF(word) → returns {scores, source:'database'|'computed'}
- totalScore(scores) → sum of 10 dimensions (max 100)
- cultureScore(scores, cultureId) → applies culture modifiers, returns 0-100
- DB object: known words with hand-tuned scores
- Algorithmic fallback for unknown words using phonological analysis

## Code conventions
- Always use TDD and BDD
- Always apply clean coding principles
- Always apply SOLID development principles
- Vanilla JS only — no frameworks, no npm dependencies in Phase 1
- CSS custom properties (variables) for theming — never hard-code colours
- Font stack: Bebas Neue (display), Space Mono (code/labels), DM Sans (body)
- Colour palette: --accent #ff3c00, --accent2 #ffd600, --accent3 #00e5ff
- All culture data lives in the CULTURES object — never scatter culture logic
- All word data lives in the DB object — never add scoring exceptions elsewhere
- Comments in English, terse

## What to preserve
- The four-tab navigation (Analyser / AI Suggest / Leaderboard / Deploy Guide)
- The dark theme and overall visual identity
- The DIMS array order — changing it breaks existing scores
- The CULTURES object structure — {name, flag, dims:{}, bias}

## Current hosting
GitHub Pages — static, free, auto-deploys on push to main.
Target URL: https://asspirited.github.io/cusslab

## Commit convention
Conventional Commits: feat:, fix:, docs:, chore:, refactor:
Examples: "feat: add Welsh culture modifier"
          "fix: mobile layout overflow on small screens"
          "chore: expand word database with 20 new entries"

## Violation Protocol

If Rod catches any violation of a Non-Negotiable rule:
1. State EXACTLY which rule was violated and the precise line of code or action that broke it
2. State WHY it happened — the specific failure in reasoning, not a generic apology
3. State HOW to prevent it — a concrete change to CLAUDE.md, a gate, a check
4. Implement that change immediately, commit, push
5. Log a waste entry

No deflection. No "I'll try harder." Root cause only.

## Non-Negotiable Gates

### Three Amigos Read-First Rule
Before proposing any new scenarios in Three Amigos, read the existing feature file in full.
Never propose scenarios from memory. Conflicts with green scenarios waste time and money.

### Panel Prompt Length Rule
User-facing prompts sent to the API must NEVER specify paragraph counts.
All panel characters have "Speeches are failure. Default is short." in their system prompts.
Any user prompt that says "3-4 paragraphs" or similar OVERRIDES that constraint and causes verbosity regressions.
PERMANENT: user prompts specify sentences only (e.g. "2-3 sentences, no speeches").
This rule cannot be relaxed without Rod's explicit approval.

### Gherkin Scenario Review Gate

Before running the pipeline on any new or modified Gherkin scenario:
1. Output the COMPLETE literal text of every new or modified scenario to the terminal
2. Print "WAITING FOR ROD'S APPROVAL — do not proceed until Rod confirms"
3. Stop. Do not run the pipeline. Do not fix code. Do not commit.
4. Wait for Rod to explicitly type "approved" or provide feedback
5. Only proceed after explicit approval

This gate cannot be skipped, summarised, or assumed. "Rod approved" is not valid unless Rod has seen the literal scenario text in this session. A scenario that has not been read by Rod has not been approved, regardless of previous sessions.

## Shell Environment

Every bash command must be prefixed with:
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && cd ~/cusslab &&

Or source .envrc first if direnv is installed.
Never assume npm, node, or correct working directory are available without this.

## Roadmap (Phase 2 — not yet started)
- Extract scoring engine to src/js/scoring.js (testable)
- AWS Lambda for server-side AI suggestions (hides API key from frontend)
- DynamoDB for ratings (replace window.storage)
- GitHub Actions CI/CD pipeline
- Jest unit tests for scoring engine

---

## Pre-agreed acceptance envelopes

Work in these categories ships on green without session re-approval.
This is the standing contract — renegotiate only on spec deviation or explicit flag from Rod.

| Category | Ships when |
|---|---|
| `.claude/scripts/*` | Passes its own Gherkin spec and pipeline green |
| Waste log entries | Format matches WL-NNN template, append-only confirmed |
| Backlog CD3 updates | Score recalculated correctly, no item deleted |

Gherkin for each envelope lives in `specs/`. Approval of the spec = approval of all future
work inside that envelope. This is BDD applied at the process level, not just the code level.
Source: .claude/practices/ci-cd.md; DORA metrics (lead time minimisation).

## BASH OUTPUT RULE (WL-021 — HIGH COST)

Claude Code collapses long output into non-readable blocks. Every command that produces output
the user needs to read MUST be piped to /tmp/out.txt and catted:

  some-command > /tmp/out.txt && cat /tmp/out.txt

NEVER use bare grep/find/cat for output the user needs to see.
NEVER use the Grep/Glob tools when the user needs to see raw output — use Bash with pipe-to-file.

## FEATURE BRANCH RULE

Keep feature branches small and short-lived. Merge to main as soon as work is complete
and pipeline is green. Do not let feature branches sit unmerged.
Trunk-based development is the target state.

---

## The Learning Loop — TDD-BDD-DDD-HDD

This project operates four nested feedback loops at different wavelengths.
Each loop catches a different class of problem.

| Loop | Discipline | Core question | Wavelength |
|---|---|---|---|
| TDD | Test-Driven Development | Does the code do what I think it does? | Seconds |
| BDD | Behaviour-Driven Development | Does the behaviour match what we agreed? | Minutes/session |
| DDD | Domain-Driven Design | Does the model reflect the domain truthfully? | Session/ongoing |
| HDD | Hypothesis-Driven Development | Are we building the right thing at all? | Retro/across sessions |

HDD is grounded in Eric Ries's Build-Measure-Learn cycle:
- **Build** — minimum implementation to test the hypothesis
- **Measure** — Ivan metric, EXP-001, panel behaviour, DORA
- **Learn** — retro findings, backlog reprioritisation, envelope evolution

The loops nest. TDD is meaningless if BDD is wrong. BDD is meaningless if DDD
is wrong. All three are meaningless if HDD says we're solving the wrong problem.

The session protocol files are the mechanical expression of the third and fourth
loops — making process improvement subject to the same discipline as code.
