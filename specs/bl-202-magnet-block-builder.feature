Feature: P11 Topic Magnets — engine buildMagnetBlock helper (BL-202)
  As a panel engineer
  I want a shared buildMagnetBlock(memberId, magnetMap) helper in the engine
  So that all panels inject P11 magnet data the same way — adding a new panel's
  magnets is a data change not a code change, and the Golf gfMagnetBlock inline
  template is not copy-pasted per panel

  Background:
    Given the Golf panel Q&A section of index.html is loaded
    And the file "src/logic/panel-discuss-engine.js" exists

  Scenario: The engine exports a buildMagnetBlock function
    Then "src/logic/panel-discuss-engine.js" exports a function named "buildMagnetBlock"

  Scenario: buildMagnetBlock returns empty string for a character not in the map
    Then buildMagnetBlock with an unknown character returns an empty string

  Scenario: buildMagnetBlock returns a formatted block for a known character
    Then buildMagnetBlock with a known character returns a string containing "TOPIC MAGNETS"

  Scenario: No panel discuss function uses the inline magnet template
    Then the Golf discuss function does not contain the inline "YOUR TOPIC MAGNETS THIS TURN" template
    And the Football discuss function does not contain the inline "YOUR TOPIC MAGNETS THIS TURN" template
