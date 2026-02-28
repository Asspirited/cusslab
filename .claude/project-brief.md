# Project Brief — Heckler and Cocks

**asspirited.cusslab.io** | Phase 1: Single File | Owner: Rod Roden

Last updated: 2026-02-27

---

## What Is This Product?

A profanity-themed consulting toolkit that roasts corporate buzzwords and
management speak with wit, cultural intelligence, and a sliding scale from
"boardroom appropriate" to "absolutely unhinged."

The AI panel members (Heckler, The Suit, The Hippy, The Realist, and others)
each respond to corporate prompts with their own distinct voice and cultural
calibration. The product is opinionated, funny, and genuinely useful for
teams drowning in jargon.

**Tagline:** *We say what you're thinking.*

---

## Core Features (Phase 1)

- Multi-panel AI responses to corporate prompts
- 11 scoring dimensions including Hippo's Law, Buzzword Density, Synergy Index
- Cultural calibration across 6 regions
- Profanity optimisation modes (Boardroom / Water Cooler / Unhinged)
- Single HTML file deployment via GitHub Pages
- Anthropic API key saved locally in browser

---

## Tech Stack

- **Frontend:** Single HTML file — vanilla JS, no framework, no build step
- **AI:** Anthropic Claude API (claude-sonnet-4-5 or equivalent)
- **Hosting:** GitHub Pages — https://asspirited.github.io/cusslab (custom domain asspirited.cusslab.io not yet configured)
- **Repo:** github.com/Asspirited/cusslab
- **Pipeline:** Node.js scripts in /pipeline
- **Tests:** Jest unit tests + custom Gherkin runner + coverage

---

## Architecture — Phase 1 (Current)

Single `index.html` — all HTML, CSS, and JS in one file.
Constraint is intentional — defers backend complexity until needed.

### Module Pattern (within single file)
```javascript
const ModuleName = (() => {
  // private
  return { publicMethod };
})();
```

### Core Scoring Functions
- `computeF(text)` — primary profanity score
- `cultureScore(text, region)` — regional calibration
- `_applySkin(panel, culture)` — applies panel personality

### Known Architectural Issues (active)
- `_applySkin` violates Single Responsibility — needs splitting
- Prompt strings are magic literals — need extracting to constants
- 7000+ lines — approaching single-file limit

---

## Architecture — Phase 2 (Planned)

Serverless backend on AWS when Phase 1 hits limits.
- Lambda + API Gateway for Claude API calls
- DynamoDB for usage tracking
- Budget alert: £20/month before any AWS work begins
- TruffleHog to CI before credentials touch repo
- Terraform for infrastructure

---

## CI/CD Pipeline

```
npm run pipeline
```

Five steps — all must pass. Zero tolerance.

| Step | Command | Checks |
|------|---------|--------|
| 0 UI Audit | pipeline/ui-audit.js | 10 structural checks |
| 1 Browser Sim | pipeline/browser-sim.js | 15 behaviour checks |
| 2 Unit Tests | pipeline/unit-runner.js | All unit tests |
| 3 Gherkin/BDD | pipeline/gherkin-runner.js | All scenarios |
| 4 Coverage | pipeline/coverage.js | Stmt ≥70%, Branch ≥70% |

GREEN = all pass = auto-commit and push = GitHub Pages deploys.
No manual deployment steps. Ever.

### Fast check (during development)
```bash
npm run check   # ui-audit + browser-sim only, <5 seconds
```

---

## Open Items

### Bugs
- **Bug 6:** API key save reverts input field — root cause confirmed: mock Gherkin runner cannot test real DOM state. JSDOM refactor attempted and reverted (DOMContentLoaded async issues). Real browser symptom under investigation: UI may show old key after save due to textarea paste UX or silent localStorage failure.
- **Bug 5:** Confirm Anthropic HTTP status code from console

### Infrastructure
- JSDOM refactor of gherkin-runner.js — reverted (DOMContentLoaded fires async, runScripts:'dangerously' insufficient for inline handlers), queued for clean restart
- Pipeline parallelisation (queued)
- Build metrics collection (queued)
- Git pre-push hook (queued)
- Sentry error tracking
- Shell fix: every Claude Code bash command needs NVM prefix — `export NVM_DIR="/home/rodent/.nvm" && \. "/home/rodent/.nvm/nvm.sh" && cd /home/rodent/cusslab &&`

### Architecture
- Split `_applySkin` (Single Responsibility)
- Extract prompt strings to constants
- AWS Budget alert £20/month

### Standards
- Add retrospectives/ directory and session-1.md after first retrospective
- Sync updated project-brief.md and CLAUDE.md to repo after this session

---

## Architectural Decisions Log

| Date | Decision | Why |
|------|----------|-----|
| 2026-02-27 | Full rebuild of index.html from scratch | Broken beyond incremental repair |
| 2026-02-27 | Install JSDOM for Gherkin runner | Mock runner cannot test real DOM — Bug 6 false greens x3 |
| 2026-02-27 | Shell NVM prefix required for Claude Code | Shell context resets to Windows system32 between commands |
| 2026-02-27 | Reverted JSDOM refactor (commits 9116b12, 99c05f1) | DOMContentLoaded fires async — 19/54 scenarios passing, broken state |

---

## Pending Gherkin Scenarios

Count must decrease each session. Never increase without a plan.

Current gaps:
- Ask The Panel happy path (all panels respond)
- Cultural calibration — region changes output
- Scoring display — all 11 dimensions shown
- Error handling — API key rejected
- Error handling — network failure

---

## Working Agreements

### Collaboration Model
Rod and Claude are peers with different skill sets. Rod brings lived experience, taste, judgment, and authority to say "that's wrong, start again." Claude brings breadth, tirelessness, and cross-domain synthesis.

- Claude challenges Rod's thinking freely — expected, not exceptional
- Explicit permission unlocks better reasoning — "be candid" is a signal to drop hedging
- Diversity of thought is a tool — Claude should bring adjacent domain sources when relevant
- Mistakes are fine. Retro, forgive, learn, improve. Good intentions assumed always.

### Session Start (2 minutes before any code)
1. Re-sync on working relationship and last session lessons
2. Read CLAUDE.md and standards
3. Run pipeline — produce scorecard
4. Only then: work

### Yak Shaving Rule
When debugging pipeline or tooling, stop and ask: **"Is this the same problem as the original goal?"**
If not — name the yak, decide consciously, set 20-minute limit.
Don't conflate "pipeline RED" with "bug still present" — they can be different problems.
Either Rod or Claude can call it.

### Process Theatre Warning
If a session produces only standards improvements and no working product change — name it.
The pipeline exists to serve the product, not the other way around.

---

## Phase 2 Trigger Conditions

Move to serverless when any of:
- Single file exceeds comfortable editing in one Claude Code context
- API key security becomes a concern (real users)
- Usage tracking needed
- £ cost justifies infrastructure

---

## How This File Is Used

- Uploaded to Claude Project (replaces previous version each session)
- Committed to repo at `.claude/project-brief.md`
- Read by Claude Code at session start via CLAUDE.md index
- Updated at end of each session with decisions and open item changes
