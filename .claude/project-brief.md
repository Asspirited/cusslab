# Project Brief — Heckler and Cocks

**asspirited.cusslab.io** | Phase 1: Single File | Owner: Rod Roden

Last updated: 2026-02-28

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
- Cloudflare Worker proxy — users need no API key (shared connection)
- Anthropic API key optionally saved locally in browser (overrides shared)
- "Isn't It Ironic?" — panel classifies ironic vs non-ironic statements

---

## Tech Stack

- **Frontend:** Single HTML file — vanilla JS, no framework, no build step
- **AI:** Anthropic Claude API (`claude-sonnet-4-6`)
- **API proxy:** Cloudflare Worker — `https://cusslab-api.leanspirited.workers.dev`
- **Hosting:** GitHub Pages — `https://asspirited.github.io/cusslab`
  - Custom domain `asspirited.cusslab.io` NOT configured — never direct Rod there
- **Repo:** github.com/Asspirited/cusslab
- **Pipeline:** Node.js scripts in /pipeline
- **Tests:** Jest unit tests + custom Gherkin runner + coverage

---

## Architecture — Phase 1 (Current)

Single `index.html` — all HTML, CSS, and JS in one file (~8,500 lines).
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

### Cloudflare Worker (worker.js)
Proxies requests to Anthropic API. Uses `ANTHROPIC_API_KEY` secret (set via wrangler).
If caller supplies `x-api-key` header, that key is used instead (user's own key takes priority).
Deployed at: `https://cusslab-api.leanspirited.workers.dev`

### Settings Panel
Hidden from nav. Accessible at `/#settings` hash URL only.
`_applySkin()` override prevented by removing 'settings' from both skin tab arrays.
Hash listener added after `App.init()` — bypasses `switchTab()` to avoid null evt errors.

### Known Architectural Issues (active)
- `_applySkin` violates Single Responsibility — needs splitting
- Prompt strings are magic literals — need extracting to constants
- ~8,500 lines — approaching single-file limit

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
| 0 UI Audit | pipeline/ui-audit.js | 8 structural checks |
| 1 Browser Sim | pipeline/browser-sim.js | 6 behaviour checks |
| 2 Unit Tests | pipeline/unit-runner.js | 17 unit tests |
| 3 Gherkin/BDD | pipeline/gherkin-runner.js | 25 scenarios |
| 4 Coverage | pipeline/coverage.js | Stmt ≥40%, Branch ≥30% |

GREEN = all pass = auto-commit and push = GitHub Pages deploys.
No manual deployment steps. Ever.

### Fast check (during development)
```bash
npm run check   # ui-audit + browser-sim only, <5 seconds
```

---

## Open Items

### Bugs
- **Bug 5:** Confirm Anthropic HTTP status code from console (open — blocked by zero credits)

### Blocked
- **Anthropic credits:** Zero balance. Billing page throwing Stripe `setupintent` error.
  Anthropic support rejects Gmail addresses. Rod to retry billing in fresh incognito window
  or contact Anthropic support via non-Gmail address.
  App code is correct — blocker is external.

### Infrastructure
- JSDOM refactor of gherkin-runner.js — reverted, queued for clean restart
- Pipeline parallelisation (queued)
- Git pre-push hook (queued)
- Sentry error tracking (queued)
- Shell fix: every Claude Code bash command needs NVM prefix —
  `export NVM_DIR="/home/rodent/.nvm" && \. "/home/rodent/.nvm/nvm.sh" && cd /home/rodent/cusslab &&`

### Architecture
- Split `_applySkin` (Single Responsibility)
- Extract prompt strings to constants
- AWS Budget alert £20/month

---

## Architectural Decisions Log

| Date | Decision | Why |
|------|----------|-----|
| 2026-02-27 | Full rebuild of index.html from scratch | Broken beyond incremental repair |
| 2026-02-27 | Install JSDOM for Gherkin runner | Mock runner cannot test real DOM — Bug 6 false greens x3 |
| 2026-02-27 | Shell NVM prefix required for Claude Code | Shell context resets to Windows system32 between commands |
| 2026-02-27 | Reverted JSDOM refactor (commits 9116b12, 99c05f1) | DOMContentLoaded fires async — 19/54 scenarios passing, broken state |
| 2026-02-28 | Cloudflare Worker proxy deployed | Users need no API key — shared connection via worker secret |
| 2026-02-28 | Settings panel hidden from nav, hash-only access | Users don't need settings; advanced users can reach via /#settings |
| 2026-02-28 | Model ID updated to claude-sonnet-4-6 | Previous ID (claude-sonnet-4-20250514) returning 400 errors |
| 2026-02-28 | Credit balance error path added to _userMessage() | Anthropic returns 400 for zero credits — needs distinct message from invalid key |
| 2026-02-28 | GHERKIN BEFORE CODE gate added to CLAUDE.md | Repeated failure: implementation started before scenarios written or approved |
| 2026-02-28 | TDD red-green-refactor cycle added to CLAUDE.md | Explicit rule: failing test before implementation, always |

---

## Pending Gherkin Scenarios

Count must decrease each session. Never increase without a plan.

Current gaps:
- Ask The Panel happy path (all panels respond)
- Cultural calibration — region changes output
- Scoring display — all 11 dimensions shown
- Error handling — network failure

Closed this session:
- ~~Error handling — API key rejected~~ ✓ (api-errors.feature)
- ~~Error handling — credit balance~~ ✓ (api-errors.feature)
- ~~Bug 6 — key paste UX~~ ✓ (settings.feature)
- ~~Isn't It Ironic feature~~ ✓ (ironic.feature)

---

## Working Agreements

### Collaboration Model
Rod and Claude are peers with different skill sets. Rod brings lived experience, taste, judgment,
and authority to say "that's wrong, start again." Claude brings breadth, tirelessness, and
cross-domain synthesis.

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
