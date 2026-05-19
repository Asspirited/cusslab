# Cusslab — Model Architecture

Living document. Refreshed at every session close (step 6c of `.claude/session-closedown.md`) if drift detected.

Two views:
1. **The room when a question lands** — in our ubiquitous language (wounds, anchors, mimic, premonitions, lies, conspiracies)
2. **Session files & workflow** — what gets read/written when Rod assigns a task

Plus **Appendix A** — the same panel model in engine/internals language for code work.

Mermaid blocks render in GitHub preview, VS Code Mermaid extension, or paste into https://mermaid.live.

---

## 1. The Room When a Question Lands

This is the model in **shared language** — the way Rod and the panel itself would describe what's happening. The internals view (engines, state objects, function calls) lives in Appendix A at the bottom.

### 1a. What's in the room before the question

The **Room** holds a fixed cast and a live state. Nothing here is invented at question-time — it all carries from the room's history and pre-existing relationships.

```mermaid
flowchart TB
    Room([The Room])

    Room --> Cast[The Cast<br/>named characters with voices,<br/>wounds, magnets, food profiles,<br/>marmite triggers, hypochondria responses]

    Room --> Anchor[The Anchor<br/>the one who opens and closes<br/>every round]

    Room --> Rels[Pre-existing relationships<br/>warm / cold / wounded<br/>who knows what about whom]

    Room --> Atm[The Atmosphere<br/>tension · hostility · chaos<br/>bathos · premonition · bleed]

    Room --> LieLed[The Lie Ledger<br/>things said earlier the room may remember]

    Room --> PremLed[The Premonition Ledger<br/>predictions still pending resolution]

    Cast -.-> P1[Each character carries<br/>P1-P17: wound · mask · topic magnets ·<br/>signature openers · cross-wound awareness]
```

### 1b. A question lands — what the room does

```mermaid
flowchart TD
    Q([A question lands in the Room])

    Q --> Anchor[The ANCHOR opens<br/>setting the frame — their lens on the question]

    Anchor --> T1[Panellist 1 takes a TURN]
    T1 --> T2[Panellist 2 takes a TURN]
    T2 --> Tdots[...middle panellists in order...]
    Tdots --> Close[The ANCHOR closes<br/>tops and tails the bullshit — the round's last word]

    Close --> Carry[What carries to the next question]
```

### 1c. Inside a single turn

What each panellist actually does — and what can fire — when their slot arrives.

```mermaid
flowchart TD
    Turn([A panellist's turn begins])

    Turn --> Shape{Shaped by}

    Shape --> Voice[Their own voice<br/>signature openers, register,<br/>food profile, hypochondria]
    Shape --> Rel[Their relationship with the others<br/>warm or cold; wounded or not]
    Shape --> Wound[Their own wounds<br/>what they cannot help reacting to]
    Shape --> Magnet[Their topic magnets<br/>subjects they keep being pulled back to]
    Shape --> Atm[The Atmosphere right now<br/>how tense / chaotic / bathetic the room is]
    Shape --> Last[What the last speaker just said<br/>and any cross-wound it landed on]

    Shape --> Move{They choose a REACTIVE MOVE}

    Move --> M1[1 · Agree and build<br/>add something true that makes it worse]
    Move --> M2[2 · Agree but undermine<br/>confirm the surface, destroy the substance]
    Move --> M3[3 · Contradict<br/>name what was wrong and why]
    Move --> M4[4 · Flat refusal<br/>one sentence, refusal is the content]
    Move --> M5[5 · Light-hearted pisstake<br/>puncture with affection]
    Move --> M6[6 · Full-blooded insult<br/>strongest language, lands on a real wound]
    Move --> M7[7 · Mimic<br/>Echo · Substitution · Sustained Impression]

    M1 --> Fire{And one or more of these may also fire}
    M2 --> Fire
    M3 --> Fire
    M4 --> Fire
    M5 --> Fire
    M6 --> Fire
    M7 --> Fire

    Fire --> F1[A TOPIC MAGNET surfaces<br/>the subject they keep returning to]
    Fire --> F2[A MARMITE TRIGGER fires<br/>and divides the room]
    Fire --> F3[They make a PREMONITION<br/>a prediction the room will hold them to]
    Fire --> F4[They LIE<br/>the lie ledger remembers]
    Fire --> F5[They INVENT AN IDIOM<br/>misquote · bastardise · invent]
    Fire --> F6[They CROSS-REFERENCE another<br/>question · parody · reference]
    Fire --> F7[They use the DISGUISE MOVE<br/>hostile-as-warm or warm-as-hostile]
    Fire --> F8[A REVERENT ABSURDITY lands<br/>sincere answer to an absurd premise]
    Fire --> F9[They join a PANEL CONSENSUS<br/>the chorus forms around a target]
    Fire --> F10[They get EGGED ON<br/>solicited escalation toward a memorable quote]

    F1 --> End[The turn ends]
    F2 --> End
    F3 --> End
    F4 --> End
    F5 --> End
    F6 --> End
    F7 --> End
    F8 --> End
    F9 --> End
    F10 --> End
```

### 1d. What the turn changes

After a panellist speaks, the Room is different:

```mermaid
flowchart LR
    Turn([The turn just ended]) --> Changes{What changes}

    Changes --> Temp[Relationship temperatures shift<br/>warmer or cooler toward specific others]
    Changes --> NewW[A new wound may be applied<br/>someone has been hurt — they remember]
    Changes --> Conspire[A CONSPIRACY ARC advances<br/>when two characters start ganging up]
    Changes --> LieG[The Lie Ledger grows<br/>lies will return]
    Changes --> PremG[A new PREMONITION is committed<br/>the room is now on the hook to resolve it]
    Changes --> MagFire[A magnet fire is recorded<br/>vary the next one]
    Changes --> AtmShift[The Atmosphere may shift<br/>tension rises, chaos spikes, bathos returns]

    Temp -.feeds.-> Next[The next panellist sees<br/>the updated room — and reacts]
    NewW -.feeds.-> Next
    Conspire -.feeds.-> Next
    LieG -.feeds.-> Next
    PremG -.feeds.-> Next
    MagFire -.feeds.-> Next
    AtmShift -.feeds.-> Next
```

### 1e. What carries to the next question

When the round ends:

| What resets | What carries forward |
|---|---|
| Relationship temperatures (each round starts from the pre-existing baseline) | The **Atmosphere** (still tense / chaotic / bathetic) |
| Conspiracy arcs (each round opens fresh pair profiles) | The **Lie Ledger** (lies still remembered) |
| Per-round NAMEMAPs | The **Premonition Ledger** (still-pending commits awaiting resolution) |
|   | Pre-existing wounds (these are part of who they are, not what happened today) |

### 1f. The character comedy this enables (Rod's favourite moments)

The mechanics above exist to serve specific kinds of comedy:

- **Characters lying / exaggerating / calling each other out while being unreliable** — Lie Ledger + Cross-Reference + Panel Consensus
- **Signature moves landing at exactly the right (or wrong) moment** — Magnet + Move + Cross-Character Parody, fired only on relevance-adds-weight or incongruity-displaces-context
- **The chuckle that runs two beats too long** — Cross-Wound Awareness + Reactive Move 5 (pisstake)
- **The peroration that gets one-worded into rubble** — Anchor Opener + Substitution Mimic
- **The promise that gets remembered four turns later** — Premonition + RC + resolution
- **The disguise — hostile-as-warm, warm-as-hostile** — Disguise Move (incongruent register)
- **The sincere absurd answer (Henni, the rook)** — Reverent Absurdity

These are the targets. Every mechanic above is in service of one of them.

---

## 1-Tech (Appendix A). The Engine View

The same model in engine / internals language — useful when working on code, not for shared design language. See `### 1a. Domain model — the pieces` heading below for the class diagram and `### 1b. Process flow` for the build-prompt sequence.

### 1-Tech-a. Domain model — the pieces

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

### 1-Tech-b. Process flow — what fires when a question is asked

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

### 1-Tech-c. Trigger inter-actions — how responses cycle back into state

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

### 1-Tech-d. Invariants to keep in mind

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
| 1a-1f room model (user language) | a new in-turn mechanic is named (something like "panel consensus" is added to ubiquitous language); a new carry-forward state is introduced; Rod-favourite-moments list changes |
| 1-Tech-a domain model | new engine added/removed in `src/logic/*.js`; new state aggregate introduced |
| 1-Tech-b process flow | `discuss()` per-panel build-prompt order changes; new compose-prompt block added/removed |
| 1-Tech-c trigger inter-actions | new response-side detector added (e.g. a new ledger); existing detector removed |
| 1-Tech-d invariants | leak surface fixed (BL-191 closes — strike the leaky-surface bullet); per-round reset semantics change |
| 2a file map | new file in `.claude/practices/`, `.claude/principles/`, `src/logic/`, `src/data/`, `pipeline/`; new top-level dir |
| 2b session lifecycle | `session-startup.md` or `session-closedown.md` adds/removes a numbered step |
| 2c trust spine | new canonical file (e.g. new standards/ doc); a consult point changes file |
| 2d cross-Claude handoff | handoff mechanism changes |

If nothing drifted: write one line in session summary — "Architecture diagram: no drift" — and skip the edit.

---

*Refresh policy: step 6c of `.claude/session-closedown.md`. Last refreshed: 2026-05-19.*
