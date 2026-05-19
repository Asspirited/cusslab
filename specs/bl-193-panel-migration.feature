Feature: Migrate 5 panels to PanelDiscussEngine.buildSystemPrompt (BL-193 — Tier 1 / M-3 finding)
  As a panel architect
  I want every panel to assemble its turn system prompt through
  PanelDiscussEngine.buildSystemPrompt(ctx) rather than inline string
  concatenation
  So that the 15 engine mechanics (idiom invention, panel consensus,
  reverent absurdity, cross-character parody / questions / references,
  topic magnets, invented expert interpretation, hang/shutdown/egging
  modes, panel temperature, profanity register, topic dismissal, and
  incongruent register) fire across every panel — not only Golf — and
  future engine work lands in one place rather than six

  Background:
    Given the file "src/logic/panel-discuss-engine.js" exists
    And the Golf panel section of index.html calls "PanelDiscussEngine.buildSystemPrompt"

  # ── M-3 audit baseline ─────────────────────────────────────────────────────

  @claude
  Scenario: M-3 audit reports six panels wired after migration
    Then the M-3 audit (pipeline/measurement/reacts-to-coverage.js) reports 6 of 6 panels wired

  # ── Per-panel: ComedyRoom ─────────────────────────────────────────────────

  @claude
  Scenario: ComedyRoom discuss calls PanelDiscussEngine.buildSystemPrompt
    Then the ComedyRoom discuss function in index.html calls "PanelDiscussEngine.buildSystemPrompt"

  @claude
  Scenario: ComedyRoom no longer builds the system prompt inline
    Then the ComedyRoom discuss function in index.html does not contain inline TURN_RULES string concatenation

  @claude
  Scenario: ComedyRoom wires every engine flag to true
    Then the ComedyRoom buildSystemPrompt call sets every engine flag to true: crossCharacterQuestionsEnabled, parodyEnabled, profanityEnabled, reverentAbsurdityEnabled, topicMagnetsEnabled, inventedExpertInterpretationEnabled, hangModeEnabled, shutdownModeEnabled, eggingOnEnabled, panelConsensusEnabled, incongruentRegisterEnabled, crossCharacterReferencesEnabled, idiomInventionEnabled

  @claude
  Scenario: ComedyRoom declares its panelTemperature per Lever 5
    Then the ComedyRoom buildSystemPrompt call passes panelTemperature { intent: 0.4, congruence: -0.3 }

  @claude
  Scenario: ComedyRoom declares per-panel mechanic data consts
    Then the ComedyRoom section of index.html declares COMEDY_TOPIC_DISMISSAL, COMEDY_MAGNETS, COMEDY_ENTHUSIASM, and COMEDY_IDIOM_PROFILES

  # ── Per-panel: Football ───────────────────────────────────────────────────

  @claude
  Scenario: Football discuss calls PanelDiscussEngine.buildSystemPrompt
    Then the Football discuss function in index.html calls "PanelDiscussEngine.buildSystemPrompt"

  @claude
  Scenario: Football no longer builds the system prompt inline
    Then the Football discuss function in index.html does not contain inline TURN_RULES string concatenation

  @claude
  Scenario: Football wires every engine flag to true
    Then the Football buildSystemPrompt call sets every engine flag to true: crossCharacterQuestionsEnabled, parodyEnabled, profanityEnabled, reverentAbsurdityEnabled, topicMagnetsEnabled, inventedExpertInterpretationEnabled, hangModeEnabled, shutdownModeEnabled, eggingOnEnabled, panelConsensusEnabled, incongruentRegisterEnabled, crossCharacterReferencesEnabled, idiomInventionEnabled

  @claude
  Scenario: Football declares its panelTemperature
    Then the Football buildSystemPrompt call passes panelTemperature { intent: -0.6, congruence: 0.0 }

  @claude
  Scenario: Football declares per-panel mechanic data consts
    Then the Football section of index.html declares FOOTBALL_TOPIC_DISMISSAL, FOOTBALL_MAGNETS, FOOTBALL_ENTHUSIASM, and FOOTBALL_IDIOM_PROFILES

  # ── Per-panel: LongRoom (Cricket) ────────────────────────────────────────

  @claude
  Scenario: LongRoom discuss calls PanelDiscussEngine.buildSystemPrompt
    Then the LongRoom discuss function in index.html calls "PanelDiscussEngine.buildSystemPrompt"

  @claude
  Scenario: LongRoom no longer builds the system prompt inline
    Then the LongRoom discuss function in index.html does not contain inline TURN_RULES string concatenation

  @claude
  Scenario: LongRoom wires every engine flag to true
    Then the LongRoom buildSystemPrompt call sets every engine flag to true: crossCharacterQuestionsEnabled, parodyEnabled, profanityEnabled, reverentAbsurdityEnabled, topicMagnetsEnabled, inventedExpertInterpretationEnabled, hangModeEnabled, shutdownModeEnabled, eggingOnEnabled, panelConsensusEnabled, incongruentRegisterEnabled, crossCharacterReferencesEnabled, idiomInventionEnabled

  @claude
  Scenario: LongRoom declares its panelTemperature
    Then the LongRoom buildSystemPrompt call passes panelTemperature { intent: 0.3, congruence: 0.0 }

  @claude
  Scenario: LongRoom declares per-panel mechanic data consts
    Then the LongRoom section of index.html declares CRICKET_TOPIC_DISMISSAL, CRICKET_MAGNETS, CRICKET_ENTHUSIASM, and CRICKET_IDIOM_PROFILES

  # ── Per-panel: Racing (Final Furlong) ────────────────────────────────────

  @claude
  Scenario: Racing discuss calls PanelDiscussEngine.buildSystemPrompt
    Then the Racing discuss function in index.html calls "PanelDiscussEngine.buildSystemPrompt"

  @claude
  Scenario: Racing no longer builds the system prompt inline
    Then the Racing discuss function in index.html does not contain inline TURN_RULES string concatenation

  @claude
  Scenario: Racing wires every engine flag to true
    Then the Racing buildSystemPrompt call sets every engine flag to true: crossCharacterQuestionsEnabled, parodyEnabled, profanityEnabled, reverentAbsurdityEnabled, topicMagnetsEnabled, inventedExpertInterpretationEnabled, hangModeEnabled, shutdownModeEnabled, eggingOnEnabled, panelConsensusEnabled, incongruentRegisterEnabled, crossCharacterReferencesEnabled, idiomInventionEnabled

  @claude
  Scenario: Racing declares its panelTemperature
    Then the Racing buildSystemPrompt call passes panelTemperature { intent: 0.2, congruence: 0.0 }

  @claude
  Scenario: Racing declares per-panel mechanic data consts
    Then the Racing section of index.html declares RACING_TOPIC_DISMISSAL, RACING_MAGNETS, RACING_ENTHUSIASM, and RACING_IDIOM_PROFILES

  # ── Per-panel: SounessCat ────────────────────────────────────────────────

  @claude
  Scenario: SounessCat discuss calls PanelDiscussEngine.buildSystemPrompt
    Then the SounessCat discuss function in index.html calls "PanelDiscussEngine.buildSystemPrompt"

  @claude
  Scenario: SounessCat no longer builds the system prompt inline
    Then the SounessCat discuss function in index.html does not contain inline TURN_RULES string concatenation

  @claude
  Scenario: SounessCat wires every engine flag to true
    Then the SounessCat buildSystemPrompt call sets every engine flag to true: crossCharacterQuestionsEnabled, parodyEnabled, profanityEnabled, reverentAbsurdityEnabled, topicMagnetsEnabled, inventedExpertInterpretationEnabled, hangModeEnabled, shutdownModeEnabled, eggingOnEnabled, panelConsensusEnabled, incongruentRegisterEnabled, crossCharacterReferencesEnabled, idiomInventionEnabled

  @claude
  Scenario: SounessCat declares its panelTemperature
    Then the SounessCat buildSystemPrompt call passes panelTemperature { intent: -0.4, congruence: -0.2 }

  @claude
  Scenario: SounessCat declares per-panel mechanic data consts
    Then the SounessCat section of index.html declares SC_TOPIC_DISMISSAL, SC_MAGNETS, SC_ENTHUSIASM, and SC_IDIOM_PROFILES

  # ── Regression — Golf wiring still intact ────────────────────────────────

  @claude
  Scenario: Golf wiring is unchanged after migration (regression guard)
    Then the Golf discuss function still calls "PanelDiscussEngine.buildSystemPrompt"
    And the Golf buildSystemPrompt call still passes panelTemperature { intent: -0.6, congruence: 0.0 }
