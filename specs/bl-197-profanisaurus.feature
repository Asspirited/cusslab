Feature: Profani-saurus per-character swear profiles (BL-197)
  As a panel engineer
  I want per-character swear pools wired into Golf and Football panels via buildSwearBlock
  So that each character uses their own vocabulary, wound state changes the pool,
  and session anti-repeat prevents the same phrase twice in a row

  Background:
    Given the Golf panel Q&A section of index.html is loaded
    And the file "src/logic/panel-discuss-engine.js" exists

  Scenario: The engine exports a buildSwearBlock function
    Then "src/logic/panel-discuss-engine.js" exports a function named "buildSwearBlock"

  Scenario: buildSwearBlock returns empty string when no pools defined for character
    Then buildSwearBlock with no pool for a character returns an empty string

  Scenario: buildSwearBlock returns a PROFANITY ONE-SHOT block for a known character
    Then buildSwearBlock with a known character returns a string containing "PROFANITY ONE-SHOT"

  Scenario: Football panel declares FOOTBALL_SWEAR_POOLS
    Then the Football section of index.html declares "FOOTBALL_SWEAR_POOLS"

  Scenario: Football panel wires fbSwearBlock into panelStateBlocks
    Then the Football discuss function passes "fbSwearBlock" in panelStateBlocks

  Scenario: Golf panel declares GOLF_SWEAR_POOLS
    Then the Golf section of index.html declares "GOLF_SWEAR_POOLS"

  Scenario: Golf panel wires gfSwearBlock into panelStateBlocks
    Then the Golf discuss function passes "gfSwearBlock" in panelStateBlocks
