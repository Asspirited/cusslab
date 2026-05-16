Feature: Shared PanelDiscuss engine — Slice 0: selectSlots (BL-162)
  As a panel engineer
  I want speaker selection lifted out of each panel's discuss() function
  and into a shared engine module that takes declarative panel data
  So that adding a new selection mechanic (anchor, trigger weighting,
  mid-round interjection) touches one engine file, not eight panel IIFEs

  Background:
    Given the Golf panel Q&A section of index.html is loaded

  Scenario: The engine module exists at the canonical path
    Then the file "src/logic/panel-discuss-engine.js" exists

  Scenario: The engine exports a selectSlots function
    Then "src/logic/panel-discuss-engine.js" exports a function named "selectSlots"

  Scenario: The engine documents its public contract at the top of the file
    Then "src/logic/panel-discuss-engine.js" contains a contract comment describing the selectSlots input shape and return shape

  Scenario: The engine places the anchor at slot 0
    Then the selectSlots function source places the anchor at the first returned slot

  Scenario: The engine places the anchor at the final slot
    Then the selectSlots function source places the anchor at the final returned slot

  Scenario: Golf's discuss function delegates speaker selection to the engine
    Then the Golf discuss function references "PanelDiscussEngine.selectSlots"
    And the Golf discuss function does not construct ORDER inline

  Scenario: selectSlots returns the canonical Golf order when given Golf panel data without the don
    Then selectSlots returns the canonical Golf order without the don

  Scenario: selectSlots inserts Alliss after the opening anchor when includeTheDon is true
    Then selectSlots inserts alliss after the opening anchor when the don is included

  Scenario: The engine has no direct DOM or fetch or sessionStorage dependencies
    Then "src/logic/panel-discuss-engine.js" does not reference "document"
    And "src/logic/panel-discuss-engine.js" does not reference "fetch"
    And "src/logic/panel-discuss-engine.js" does not reference "sessionStorage"
