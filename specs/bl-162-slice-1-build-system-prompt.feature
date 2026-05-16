Feature: Shared PanelDiscussEngine — Slice 1: buildSystemPrompt (BL-162)
  As a panel engineer
  I want prompt assembly lifted out of each panel's discuss() into the
  shared engine so universal prompt-block changes (anchor mechanic,
  TOPIC-DISMISSAL, voice pools, narrative arc) touch one engine file
  not eight panel IIFEs

  Background:
    Given the Golf panel Q&A section of index.html is loaded
    And the file "src/logic/panel-discuss-engine.js" exists

  Scenario: The engine exports a buildSystemPrompt function
    Then "src/logic/panel-discuss-engine.js" exports a function named "buildSystemPrompt"

  Scenario: buildSystemPrompt returns a non-empty string for minimal valid input
    Then buildSystemPrompt with minimal valid input returns a non-empty string

  Scenario: buildSystemPrompt places TURN_RULES first in the assembled output
    Then buildSystemPrompt output starts with the supplied turnRules string

  Scenario: TOPIC-DISMISSAL fires for non-anchor turns when topicDismissal is supplied
    Then buildSystemPrompt for a non-anchor member with topicDismissal set contains the topicDismissal string

  Scenario: TOPIC-DISMISSAL is suppressed for anchor opener
    Then buildSystemPrompt for slot 0 anchor member with topicDismissal set does not contain the topicDismissal string

  Scenario: TOPIC-DISMISSAL is suppressed for anchor closer
    Then buildSystemPrompt for the final slot anchor member with topicDismissal set does not contain the topicDismissal string

  Scenario: ANCHOR_OPENER MODE block fires for slot 0 anchor
    Then buildSystemPrompt for slot 0 anchor member contains "ANCHOR_OPENER MODE"

  Scenario: ANCHOR_CLOSER MODE block fires for final slot anchor with ROUND SO FAR
    Then buildSystemPrompt for the final slot anchor member contains "ANCHOR_CLOSER MODE" and "ROUND SO FAR"

  Scenario: Previous block appends when slot > 0 and prev is non-empty
    Then buildSystemPrompt for slot 1 with non-empty prev contains a "Previous:" block

  Scenario: Previous block is absent for slot 0
    Then buildSystemPrompt for slot 0 does not contain a "Previous:" block

  Scenario: NARRATIVE ARC SO FAR appends when arcLog is non-empty
    Then buildSystemPrompt with non-empty arcLog contains "NARRATIVE ARC SO FAR"

  Scenario: panelStateBlocks string is injected into the assembled output
    Then buildSystemPrompt with panelStateBlocks set contains the panelStateBlocks string

  Scenario: voicePoolBlock injects when supplied
    Then buildSystemPrompt with voicePoolBlock set contains the voicePoolBlock string

  Scenario: voicePoolBlock is absent when not supplied
    Then buildSystemPrompt with no voicePoolBlock omits any "VOICE POOL" injection from the engine

  Scenario: Golf's discuss function delegates prompt assembly to the engine
    Then the Golf discuss function references "PanelDiscussEngine.buildSystemPrompt"

  Scenario: panel-discuss-engine has no DOM or network or storage dependencies
    Then "src/logic/panel-discuss-engine.js" does not reference "document"
    And "src/logic/panel-discuss-engine.js" does not reference "fetch"
    And "src/logic/panel-discuss-engine.js" does not reference "sessionStorage"
