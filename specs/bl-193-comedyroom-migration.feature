Feature: Migrate ComedyRoom panel to PanelDiscussEngine.buildSystemPrompt (BL-193 Tier 1 — panel 5 of 5, plus M-3 audit closeout)
  As a panel architect
  I want ComedyRoom to assemble its turn system prompt through
  PanelDiscussEngine.buildSystemPrompt(ctx) rather than inline string
  concatenation
  So that all 15 engine mechanics fire in ComedyRoom panel turns and
  the M-3 audit closes at 6 of 6 panels wired

  Background:
    Given the file "src/logic/panel-discuss-engine.js" exists
    And the Golf panel section of index.html calls "PanelDiscussEngine.buildSystemPrompt"

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
  Scenario: ComedyRoom declares its panelTemperature
    Then the ComedyRoom buildSystemPrompt call passes panelTemperature { intent: 0.4, congruence: -0.3 }

  @claude
  Scenario: ComedyRoom declares per-panel mechanic data consts
    Then the ComedyRoom section of index.html declares COMEDY_TOPIC_DISMISSAL, COMEDY_MAGNETS, COMEDY_ENTHUSIASM, and COMEDY_IDIOM_PROFILES

  @claude
  Scenario: M-3 audit closes at 6 of 6 panels wired
    Then the M-3 audit (pipeline/measurement/reacts-to-coverage.js) reports 6 of 6 panels wired
