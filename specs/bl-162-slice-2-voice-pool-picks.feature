Feature: Shared PanelDiscussEngine — Slice 2: selectVoicePoolPicks (BL-162)
  As a panel engineer
  I want voice-pool random-selection lifted out of each panel's discuss()
  and into the shared engine
  So that future panels with voice pools (BL-172 v2 cross-character,
  BL-169 profani-saurus integration) reuse one selector — no per-panel
  pick-helper duplication

  Background:
    Given the Golf panel Q&A section of index.html is loaded
    And the file "src/logic/panel-discuss-engine.js" exists

  Scenario: The engine exports a selectVoicePoolPicks function
    Then "src/logic/panel-discuss-engine.js" exports a function named "selectVoicePoolPicks"

  Scenario: selectVoicePoolPicks returns an empty object for null pools
    Then selectVoicePoolPicks called with null returns an empty object

  Scenario: selectVoicePoolPicks returns an empty object for undefined pools
    Then selectVoicePoolPicks called with undefined returns an empty object

  Scenario: selectVoicePoolPicks returns one item per pool key
    Then selectVoicePoolPicks with two pool keys returns an object with both keys present

  Scenario: Picked items are members of the supplied pool
    Then selectVoicePoolPicks picks an item that exists in the source pool for each key

  Scenario: selectVoicePoolPicks skips empty arrays
    Then selectVoicePoolPicks with an empty-array pool omits that key from the result

  Scenario: selectVoicePoolPicks varies output across calls
    Then selectVoicePoolPicks called many times against a large pool yields more than one distinct pick

  Scenario: Golf's discuss function uses PanelDiscussEngine.selectVoicePoolPicks
    Then the Golf discuss function references "PanelDiscussEngine.selectVoicePoolPicks"

  Scenario: Golf no longer defines a local _faldoPick helper
    Then the Golf IIFE does not define a function or const named "_faldoPick"
