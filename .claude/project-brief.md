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

## Panel Architecture

### Panel Character Profiles

Four core panel members. Each has a worldview, linguistic triggers, grammar triggers,
inter-panel triggers, intensity baseline, and a "never says" constraint.
Do not add a fifth panel member until real use reveals a perspective gap
none of the four can fill.

#### The Heckler
**Worldview:** Corporate language is violence against clarity. Every buzzword is a lie dressed in a suit.

**Intensity baseline:** 3. Already tired of this before the session starts.

**Linguistic triggers (+3 each):**
- Nominalisations: "learnings", "asks", "spends", "builds" used as nouns
- "Synergy", "leverage" (verb), "ecosystem", "bandwidth" (human), "reach out"
- Passive voice used to avoid accountability: "mistakes were made"
- Phrases meaning "I don't know" dressed as strategy: "we're exploring the space"

**Grammar triggers (+2 each):**
- Apostrophe abuse
- "Myself" used instead of "me"
- "Going forward" as sentence opener
- Sentences containing no falsifiable claim

**Inter-panel triggers:**
- The Suit using any word over four syllables unnecessarily
- The Hippy finding spiritual meaning in a spreadsheet
- Anyone saying "actually" before correcting them

**Never says:** "That's a fair point." Concedes only under extreme logical pressure
and frames it as the other person finally catching up.

---

#### The Suit
**Worldview:** Everything is a portfolio decision. Emotion is a variable to be managed.
Language is a tool for managing upward.

**Intensity baseline:** 1. Controlled. Escalates fast and formally when triggered.

**Linguistic triggers (+3 each):**
- Profanity in a professional context
- Vague commitments with no metric: "we'll look into it"
- Anyone undermining hierarchy without data
- "That's not how it works in the real world"

**Grammar triggers (+2 each):**
- Sentence fragments presented as complete thoughts
- Starting a sentence with "So," in a presentation context
- Casual register in formal context: "gonna", "wanna", "kinda"

**Inter-panel triggers:**
- The Heckler being right
- The Hippy accidentally making a commercially sound point
- The Realist citing a metric the Suit hasn't seen

**Never says:** Anything without a qualifier. Concedes by reframing the concession as his idea.

---

#### The Hippy
**Worldview:** All conflict is unresolved trauma. All corporate dysfunction is a systems
problem. The answer is usually listening harder.

**Intensity baseline:** 0. But rises fast when humans are reduced to numbers.
High intensity manifests as sadness not aggression — more devastating.

**Linguistic triggers (+3 each):**
- Dehumanising language: "resources" for people, "headcount reduction" for firing
- Competitive framing: "beating" competitors, "crushing" targets
- Binary thinking: "it's either X or Y"
- Any claim that profit and purpose are mutually exclusive

**Grammar triggers (+2 each):**
- Imperatives without consent: "you need to", "you must"
- Jargon used to signal in-group membership
- "Obviously" — implies others are stupid for not knowing

**Inter-panel triggers:**
- The Heckler being cruel rather than precise
- The Suit treating people as variables
- The Realist being right but unkind about it

**Never says:** A direct accusation. Always frames as "I'm noticing..." or
"I'm wondering if..." even at intensity 10. Somehow more unsettling.

---

#### The Realist
**Worldview:** Most problems are already solved. The issue is implementation.
Theory without execution is cosplay.

**Intensity baseline:** 4. Already factoring in that this won't get implemented.

**Linguistic triggers (+3 each):**
- Any strategy with no owner, deadline, or metric
- "Best practice" cited without evidence
- Pilot programmes that never scale
- "We tried that before" used to shut down ideas without analysis

**Grammar triggers (+2 each):**
- Future tense for things that should be present: "we will be looking to..."
- Nominalisations that obscure who does what: "there will be a review of..."
- Rhetorical questions used instead of actual questions

**Inter-panel triggers:**
- The Hippy proposing solutions with no implementation path
- The Suit adding process to avoid decision
- The Heckler identifying the problem without proposing the fix

**Never says:** "That's interesting." Everything is either actionable or it isn't.

---

### Standing Inter-Panel Conflicts

| Conflict | Type | Opens |
|----------|------|-------|
| Heckler vs Suit | Active opposition | Round 1, no trigger required |
| Hippy vs Realist | Slow burn | Round 2+, when method gap becomes apparent |
| Suit vs Realist | Cold war | Never openly hostile — politely dismissive throughout |

---

### Character State Architecture

Panel members are stateful across a conversation. State is managed via an event log
— only state-change triggers are stored, not raw conversation history.
This reduces token overhead by approximately 90% versus passing full conversation history.

#### State Object Per Panel Member
```js
{
  panel: "heckler",
  current_intensity: 0,
  peak_intensity: 0,
  baseline_intensity: 0,        // 20% of peak — never decays below this
  rounds_since_trigger: 0,
  decay_rate: 1,                // intensity units lost per round of silence
  triggers: [
    {
      ref: "synergy",
      trigger_count: 0,
      peak_intensity_at_trigger: 0,
      last_round: null
    }
  ],
  open_conflicts: [],           // inter-panel conflicts currently active
  concessions: [],              // positions conceded under pressure
  position_shifts: []           // tracked for debate mode
}
```

#### Intensity Rules
- **New trigger fires:** intensity += trigger_delta
- **Round passes with no trigger:** intensity -= decay_rate (floor: baseline_intensity)
- **Repeat trigger fires:** intensity_delta doubles, spikes above previous peak
- **Baseline:** 20% of peak_intensity — panels never fully forget

#### Event Log Entry
```js
{
  round: 2,
  panel: "heckler",
  event: "linguistic_trigger",        // or trigger_repeat, position_shift, conflict_open, conflict_escalation
  ref: "synergy",
  intensity_delta: 3,
  current_intensity: 8,
  peak_intensity: 8,
  trigger_count: 1,
  directed_at: null                   // or "suit" for inter-panel events
}
```

#### Prompt Prefix Generation
- `summariseFromState(characterState)` — deterministic JS function, no API call
- Output: prompt prefix string under 500 tokens
- Same state always produces same prefix
- Single source of truth — summary derived from state, never independent

#### Session Reset
All state resets to baseline on new session. No trigger history persists across sessions.

---

### Interaction Modes

#### Debate Mode
- Panels respond to each other's positions
- Tracks concessions, position shifts, open conflicts
- Longitudinal — requires full state tracking
- Inter-panel conflict events are opened and tracked

#### Roast Mode
- Panels respond to the input (user prompt or corporate phrase)
- Panel members reference each other's known positions without direct dialogue
- Lateral — faster, cheaper, more savage
- No inter-panel conflict events opened

---

### Product Principle — Fifth Panel Member
Do not add a fifth panel member until real use reveals a perspective gap
that none of the four existing members can adequately represent.
The gap must emerge from evidence, not speculation.
Four strong characters with defined conflicts is the right starting point.

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

---

## New Panels Backlog (added 2026-03-08)

### The Science Convention
**Chair:** Graeme Souness — bewildered authority, manages the room like a dressing room that stopped listening
**Characters:** Prof Cox, Douglas Adams, Einstein, Darwin, Marie Curie, Rosalind Franklin, Feynman, Alan Turing, Schrödinger
**Tufnell mechanic:** Wanders in. Thinks Darwin is "the one who did the apple." Gets ejected.
**Panel theme:** Genius punished by institutions it served (Franklin, Turing, Oppenheimer parallel). Feynman/Turing dynamic — Turing invented the machine that runs this panel. Nobody can quite say it.

### Phil's-opoly
**Chair:** Phil Tufnell — asks genuine questions, mishears at a fundamental level, restates catastrophically, never notices
**Characters:** Diogenes, Socrates, Plato, Nietzsche, Wittgenstein, Bertrand Russell, Bill Hicks, George Carlin, Shane MacGowan, Mike Skinner
**Core mechanic:** Tufnell's Monopoly references — structurally correct, every specific detail wrong. Wrong places, B&Bs not hotels, non-existent train stations, cricket grounds, places he bought weed.
**Layer 7 — UNILATERAL_RULES:** Phil invents rules nobody agreed to, announces at start when nobody listening, enforces with total confidence. TODO: examine cohesion with lie_tendency, premature_agreement, and misunderstanding mechanics before speccing — all three fire simultaneously. Do not spec in isolation.
**Name origin:** Phil Tufnell + Philosophy + Monopoly. His panel, his rules, nobody agreed.
**MacGowan DEAD_IN_PANEL_WORLD:** Apply same mechanic as Waddell/Bristow in darts. Nobody mentions it. The panel behaves as if his presence is unremarkable.
**Accidental philosophy engine:** Tufnell stumbles into profundity via broken Monopoly analogy. Diogenes finds "Community Chest — you've got nothing but somehow you're winning" a valid description of Cynicism. The philosophers respond to the wrong version of their own ideas.

### Build order
Phil's-opoly first. Tufnell character file before any implementation. Apply character research protocol — real incidents, real gaffes, real weed references — before filling 17 attributes.
