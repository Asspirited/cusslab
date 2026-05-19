Feature: Migrate SounessCat panel to PanelDiscussEngine.buildSystemPrompt (BL-193 Tier 1 — panel 1 of 5)
  As a panel architect
  I want SounessCat to assemble its turn system prompt through
  PanelDiscussEngine.buildSystemPrompt(ctx) rather than inline string
  concatenation
  So that all 15 engine mechanics fire in SounessCat panel turns and
  future engine work lands in one place

  Background:
    Given the file "src/logic/panel-discuss-engine.js" exists
    And the Golf panel section of index.html calls "PanelDiscussEngine.buildSystemPrompt"

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

  @claude
  Scenario: Golf wiring is unchanged after SounessCat migration (regression guard)
    Then the Golf discuss function still calls "PanelDiscussEngine.buildSystemPrompt"
    And the Golf buildSystemPrompt call still passes panelTemperature { intent: -0.6, congruence: 0.0 }
