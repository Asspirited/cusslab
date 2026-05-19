# Cusslab — Model Architecture

Living document. Refreshed at every session close (step 6c of `.claude/session-closedown.md`) if drift detected.

Two views:
1. **Conversation panel model** — what fires when a user asks a panel a question
2. **Session files & workflow** — what gets read/written when Rod assigns a task

Mermaid blocks render in GitHub preview, VS Code Mermaid extension, or paste into https://mermaid.live.

---

## 1. The Conversation Panel Model

### 1a. Domain model — the pieces

```mermaid
classDiagram
    class Panel {
        PANEL_CONFIG (anchor, rageEnabled)
        MEMBERS[] (the cast)
        ORDER (anchor at slot 0 and slot N)
        TURN_RULES (panel-local mimic patterns)
        PANEL_EXEMPLARS (BL-191 — planned)
        PRE_EXISTING wounds (cold-start relationships)
    }
    class Character {
        id, name, icon, colour, bg
        prompt (P1-P17 character schema)
        signature phrases / openers
        food / marmite / hypochondria profile
        P11 topic magnets
        cross-wound awareness
    }
    class RelationshipState {
        per-character temperatures
        wound ledger (NAMEMAP-resolved)
        +init(ORDER, PRE_EXISTING)
        +update(member, response)
        +buildBlock(member) returns YOUR_STATE
    }
    class ConspireEngine {
        pair profiles (added per panel)
        arc stages
        +reset()
        +addPairProfile(a, b, profile)
        +check(relState, ORDER)
        +advanceStage(resetValvePriority)
        +getArcInstructions(member)
    }
    class LieEngine {
        per-panel lie state
        +applyWound(member, response)
        +buildBlock(member)
        +saveState(panel)
    }
    class PremonitionEngine {
        ledger (commits + aftermath + RC holder)
        +load(key)
        +maybeCommit(member, response)
        +assignRC(member)
        +resolveCommits(momentType, ledger, hitMap, missMap)
        +buildBlock() / +buildStatus()
    }
    class IntellectualAttempts {
        +detect(input) returns iaType
        +inject(panel, member, baseSystem, iaType)
    }
    class AtmosphereState {
        schema (NORMAL / hostile / chaotic / ...)
        tension, hostility, chaos
        bathos, premonition, bleed
    }
    Panel "1" --> "many" Character : MEMBERS
    Panel --> RelationshipState : init
    Panel --> ConspireEngine : reset + addPairProfile
    Panel --> LieEngine
    Panel --> PremonitionEngine
    Panel --> AtmosphereState : roundNote
    RelationshipState ..> Character : tracks state per
    ConspireEngine ..> Character : pair profiles
    IntellectualAttempts ..> Panel : wraps systemPrompt
```

### 1b. Process flow — what fires when a question is asked

```mermaid
flowchart TD
    Q[User submits question to a panel] --> Init[discuss starts the round]

    Init --> RSInit[RelationshipState.init<br/>seeded with PRE_EXISTING wounds]
    Init --> CEReset[ConspireEngine.reset<br/>+ addPairProfile for known pairs]
    Init --> LELoad[LieEngine.getState]
    Init --> PELoad[PremonitionEngine.load]
    Init --> AtmLoad[Atmosphere read from sessionStorage]

    RSInit --> Loop{For each member in ORDER<br/>anchor → middle slots → anchor}
    CEReset --> Loop
    LELoad --> Loop
    PELoad --> Loop
    AtmLoad --> Loop

    Loop --> Compose[Compose system prompt<br/>per member, per turn]

    Compose --> TR[TURN_RULES<br/>panel-local mimic patterns]
    Compose --> YS[RelationshipState.buildBlock<br/>YOUR_STATE for this member]
    Compose --> Mem[member.prompt<br/>full P1-P17 voice]
    Compose --> Mech[mechanics block<br/>length / reactive / drift / innuendo]
    Compose --> Atm2[roundNote<br/>tension/hostility/chaos/bathos]
    Compose --> IB[iceBreakBlock]
    Compose --> FB[foodBlock / marmiteBlock / hypoBlock]
    Compose --> PB[premonitionBlock / lieBlock]
    Compose --> Arc[ConspireEngine.getArcInstructions]
    Compose --> EM[Engine meta-blocks<br/>idiom / consensus / parody /<br/>incongruent / reverent absurdity<br/>cross-character q/refs]
    Compose --> IA[IntellectualAttempts.inject<br/>if iaType detected]

    Compose --> Call[API.call → Anthropic via Cloudflare Worker]
    Call --> Resp[Response text]

    Resp --> RSUpd[RelationshipState.update<br/>extract wounds, update temperatures]
    Resp --> CECheck[ConspireEngine.check<br/>+ advanceStage]
    Resp --> LEApply[LieEngine.applyWound<br/>if lie pattern detected]
    Resp --> PECommit[PremonitionEngine.maybeCommit<br/>if predictive statement]

    RSUpd --> NextSlot{More members<br/>in ORDER?}
    CECheck --> NextSlot
    LEApply --> NextSlot
    PECommit --> NextSlot

    NextSlot -->|yes| Loop
    NextSlot -->|no| Save[LieEngine.saveState<br/>PremonitionEngine.save<br/>HCSession.logPanelRun]
    Save --> Render[Render responses to UI]
```

### 1c. Trigger inter-actions — how responses cycle back into state

```mermaid
flowchart LR
    Resp[Member response] --> WoundEx[Wound extracted<br/>via panel WoundDetector]
    Resp --> ConsCheck[Conspiracy trigger check]
    Resp --> LieDetect[Lie pattern detection]
    Resp --> PremDetect[Premonition commit detection]
    Resp --> MagSurf[P11 Topic Magnet surface check]

    WoundEx --> RSDelta[RelationshipState delta<br/>NAMEMAP-resolved target<br/>temperature shift]
    ConsCheck --> ConsStage[ConspireEngine arc stage advances<br/>new pairs may be added]
    LieDetect --> LieLedger[LieEngine ledger updated]
    PremDetect --> PremLedger[PremonitionEngine ledger:<br/>commit / RC assignment]
    MagSurf --> MagState[Magnet fired this turn<br/>vary next turn]

    RSDelta -.feeds.-> NextYS[Next member's YOUR_STATE block]
    ConsStage -.feeds.-> NextArc[Next member's arcInstructions]
    LieLedger -.feeds.-> NextLie[Next member's lieBlock]
    PremLedger -.feeds.-> NextPrem[Next member's premonitionBlock]
    MagState -.feeds.-> NextMag[Subsequent magnet-surface rules]
```

### 1d. Invariants to keep in mind

- **Each round is fresh.** `RelationshipState.init` and `ConspireEngine.reset` fire at the START of every `discuss()` call. Cross-round state lives in `sessionStorage` (atmosphere), `LieEngine.saveState`, `PremonitionEngine.save`.
- **Cross-panel state is per-panel.** Football's RelationshipState ≠ Golf's RelationshipState. No bleed by design.
- **The leaky surface** (open as of 2026-05-19, fix planned in BL-191): `src/logic/panel-discuss-engine.js` meta-blocks (idiom invention, panel consensus, cross-character parody, incongruent register, reverent absurdity) bake **golf-pundit example names** into the prompt for **every** panel that enables them. BL-191 replaces hardcoded examples with per-panel `PANEL_EXEMPLARS` slot substitution.
- **Intended cross-pollination** lives in `ConspireEngine` and the cross-character question/parody/reference mechanics — character-aware behaviours, not engine source bleed.

---

## 2. Cusslab Session — Files & Workflow

### 2a. File map — what lives where

```mermaid
flowchart TB
    subgraph CrossSession[Cross-session memory — outside the repo]
        MemIndex[~/.claude/.../memory/MEMORY.md<br/>index of all auto-memories]
        MemEntries[memory/feedback_*.md<br/>memory/user_*.md<br/>memory/project_*.md<br/>memory/reference_*.md]
    end

    subgraph Session[.claude/ — session protocols and practice library]
        SS[session-startup.md<br/>session-insession.md<br/>session-closedown.md<br/>shared-session-state.md]
        CMD[CLAUDE.md — WoW spine]
        PB[project-brief.md — product context]

        subgraph Practices[practices/ — how to do the work]
            P1[bdd.md / tdd.md / solid.md / 5-whys.md]
            P2[backlog.md / waste-log.md / ideas.md]
            P3[auth-ops.md / ci-cd.md / dora.md]
            P4[testing-standards.md / test-design-techniques.md]
            P5[hypothesis-driven.md / retrospectives.md]
            P6[domain-model.md / architecture-review.md / panel-slots.md]
            P7[ux-decisions.md / school-mode-convention.md / user-stories.md / session-log.md]
        end

        subgraph Principles[principles/ — how to think about problems]
            Pr1[ddd.md / xp.md / lean.md]
            Pr2[systems-thinking.md / ux.md / panel-design.md]
        end

        Retros[retrospectives/]
        Scripts[scripts/append-section.sh<br/>scripts/pipeline-report.sh<br/>scripts/feature-report.sh<br/>scripts/write-session-log.sh]
    end

    subgraph Docs[docs/ — character canon and mechanic specs]
        DC[characters-boardroom.md<br/>characters-comedy.md<br/>characters-sports.md<br/>characters-summaries.md<br/>characters-cricket-research.md<br/>characters-oracle.md<br/>characters-intensity.md]
        DM[domain-model.md<br/>mechanic-ice-breaker.md<br/>oat-nft-principles.md<br/>needles-and-conflicts.md<br/>character-wandering.md<br/>model-architecture.md (this file)]
    end

    subgraph Chars[characters/ — full P1-P17 schema files]
        CFiles[TEMPLATE.md (schema reference)<br/>alliss.md / faldo.md / murray.md /<br/>souness.md / micah.md / neville.md /<br/>blofeld.md / botham.md / boycott.md /<br/>boyle.md / chappelle.md / etc.]
    end

    subgraph Standards[~/leanspirited-standards — cross-project canon]
        Std[standards/character-schema.md<br/>standards/profani-saurus.md<br/>protocols/new-project-start.md]
    end

    subgraph Code[Source]
        IH[index.html — main app + per-panel modules]
        Eng[src/logic/*.js — engines<br/>panel-discuss / lie / premonition /<br/>idiom / intellectual-attempts /<br/>ff / pub-navigator / quntum-leeks /<br/>rage-o-meter / trigger-score]
        Data[src/data/*.js — panel data<br/>crucible-corner / final-furlong /<br/>spit-shelter / pub-crawl-scenes /<br/>quntum-leeks-scenarios / etc.]
        Pipe[pipeline/*.js — gherkin runner, unit, e2e, audits]
        Specs[specs/*.feature — Gherkin]
        Notes[notes/ — unfiled concept notes]
    end
```

### 2b. Session lifecycle — what runs when you assign a task

```mermaid
flowchart TD
    Start([You start a Cusslab session]) --> SU[Read .claude/session-startup.md IN FULL]
    SU --> PreFlight[0. Pre-flight: cat startup + shared-state +<br/>practices/domain-model + backlog + ideas + waste-log<br/>→ Downloads/session-ref.md]
    PreFlight --> Auth[1. Auth canary: curl Worker → 200]
    Auth --> Pipe[2. Pipeline: bash .claude/scripts/pipeline-report.sh → GREEN]
    Pipe --> Notes[2b. Notes scan: ls notes/ → log count]
    Notes --> Shared[3. Read shared-session-state.md<br/>+ waste-log OPEN items]
    Shared --> Backlog[4. Top 3 BL by CD3<br/>4b. Ideas board scan<br/>4c. Combined BL+WL table]
    Backlog --> Retro[5. Last retro findings carry forward]
    Retro --> Ready[Ready for work]

    Ready --> Ask([You assign a task])

    Ask --> Triage{Type of task?}

    Triage -->|new feature| TA[Three Amigos:<br/>plain language behaviour]
    Triage -->|bug| FW[5-whys root cause]
    Triage -->|character work| CharRead[Read docs/characters-*.md<br/>+ characters/TEMPLATE.md<br/>+ leanspirited-standards/character-schema.md]

    TA --> Gherk[Write Gherkin in specs/*.feature<br/>per practices/bdd.md]
    CharRead --> TA
    FW --> Gherk

    Gherk --> Gate{Gherkin approved<br/>in THIS session?}
    Gate -->|no — WAITING| Stop1[STOP — no code, no tests]
    Gate -->|yes — approved| OutIn[Outside-in design<br/>per practices/solid.md]

    OutIn --> Test[Failing test first<br/>per practices/tdd.md]
    Test --> Impl[Minimum implementation<br/>in index.html / src/logic / src/data]
    Impl --> PipeChk[Pipeline GREEN<br/>bash .claude/scripts/pipeline-report.sh]
    PipeChk --> Commit[Commit + push<br/>small, frequent]

    Commit --> Raise{New work surfaced<br/>mid-session?}
    Raise -->|yes| RNW[RAISE NEW WORK SEQUENCE<br/>BL-NNN or WL-NNN<br/>append via .claude/scripts/append-section.sh]
    RNW --> Ready
    Raise -->|no| Cont{Continue session?}
    Cont -->|yes| Ask
    Cont -->|no| Close[session-closedown.md FULL<br/>writes shared-session-state.md<br/>+ refreshes this architecture doc if drifted<br/>for next Claude]

    Close --> End([Session ends — pushed clean])
```

### 2c. Trust spine — what gets consulted at which decision

| Moment in the session | File consulted |
|---|---|
| You name a project | `MEMORY.md` HARD STOP block → routes to `<project>/.claude/session-startup.md` |
| Auth feels off | `practices/auth-ops.md` — never trust memory for auth |
| Before any test is written | `practices/testing-standards.md` + `practices/bdd.md` |
| Before any character is touched | `leanspirited-standards/character-schema.md` (canonical) + relevant `docs/characters-*.md` + `characters/<id>.md` |
| Before a design decision | `principles/xp.md`, `principles/ddd.md`, `principles/panel-design.md` |
| Estimating effort / priority | `practices/backlog.md` CD3 + `practices/hypothesis-driven.md` |
| Something broke | `practices/5-whys.md` → root cause → `practices/waste-log.md` entry |
| Wrapping up | `session-closedown.md` (writes `shared-session-state.md` + refreshes this doc) |

### 2d. Cross-Claude handoff

```mermaid
flowchart LR
    ClaudeA[Claude session A] -->|writes at close| Shared[shared-session-state.md]
    Shared -->|read at step 3 of startup| ClaudeB[Claude session B]
    ClaudeB -->|cats into Downloads/session-ref.md| ClaudeAI[Claude.ai picks up<br/>via uploaded session-ref.md]
```

`shared-session-state.md` carries what the other Claude did last, what's open, what was skipped. `Downloads/session-ref.md` is the one-file context bundle for Claude.ai when working in parallel.

---

## Refresh triggers

At session close, refresh sections that have drifted. Drift indicators:

| Section | Refresh when |
|---|---|
| 1a domain model | new engine added/removed in `src/logic/*.js`; new state aggregate introduced |
| 1b process flow | `discuss()` per-panel build-prompt order changes; new compose-prompt block added/removed |
| 1c trigger inter-actions | new response-side detector added (e.g. a new ledger); existing detector removed |
| 1d invariants | leak surface fixed (BL-191 closes — strike the leaky-surface bullet); per-round reset semantics change |
| 2a file map | new file in `.claude/practices/`, `.claude/principles/`, `src/logic/`, `src/data/`, `pipeline/`; new top-level dir |
| 2b session lifecycle | `session-startup.md` or `session-closedown.md` adds/removes a numbered step |
| 2c trust spine | new canonical file (e.g. new standards/ doc); a consult point changes file |
| 2d cross-Claude handoff | handoff mechanism changes |

If nothing drifted: write one line in session summary — "Architecture diagram: no drift" — and skip the edit.

---

*Refresh policy: step 6c of `.claude/session-closedown.md`. Last refreshed: 2026-05-19.*
