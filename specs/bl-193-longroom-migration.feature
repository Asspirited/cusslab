Feature: Migrate LongRoom (Cricket) panel to PanelDiscussEngine.buildSystemPrompt (BL-193 Tier 1 — panel 3 of 5)
  As a panel architect
  I want LongRoom to assemble its turn system prompt through
  PanelDiscussEngine.buildSystemPrompt(ctx) rather than inline string
  concatenation
  So that all 15 engine mechanics fire in LongRoom panel turns and
  future engine work lands in one place

  Background:
    Given the file "src/logic/panel-discuss-engine.js" exists
    And the Golf panel section of index.html calls "PanelDiscussEngine.buildSystemPrompt"

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
