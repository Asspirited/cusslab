Feature: Migrate Football panel to PanelDiscussEngine.buildSystemPrompt (BL-193 Tier 1 — panel 4 of 5)
  As a panel architect
  I want Football to assemble its turn system prompt through
  PanelDiscussEngine.buildSystemPrompt(ctx) rather than inline string
  concatenation
  So that all 15 engine mechanics fire in Football panel turns and
  future engine work lands in one place

  Background:
    Given the file "src/logic/panel-discuss-engine.js" exists
    And the Golf panel section of index.html calls "PanelDiscussEngine.buildSystemPrompt"

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
