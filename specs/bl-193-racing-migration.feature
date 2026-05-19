Feature: Migrate Racing (Final Furlong) panel to PanelDiscussEngine.buildSystemPrompt (BL-193 Tier 1 — panel 2 of 5)
  As a panel architect
  I want Racing to assemble its turn system prompt through
  PanelDiscussEngine.buildSystemPrompt(ctx) rather than inline string
  concatenation
  So that all 15 engine mechanics fire in Racing panel turns and
  future engine work lands in one place

  Background:
    Given the file "src/logic/panel-discuss-engine.js" exists
    And the Golf panel section of index.html calls "PanelDiscussEngine.buildSystemPrompt"

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
