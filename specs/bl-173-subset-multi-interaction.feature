Feature: selectSlots subset + multi-interaction + relevance (BL-173)
  As a panel engineer
  I want speaker selection to draw a smaller subset of characters who
  each speak multiple times per round, chosen by relevance to the user's
  question
  So that panels go deeper (fewer voices, more back-and-forth) instead
  of broad-and-shallow (every character once)

  Background:
    Given the file "src/logic/panel-discuss-engine.js" exists

  Scenario: Backwards compatibility — without subsetSize selectSlots returns the full middle cast in original order
    Then selectSlots without subsetSize returns the full middle cast in original order

  Scenario: subsetSize trims the middle to that many unique characters
    Then selectSlots with subsetSize 3 from a 5-character middleCast returns exactly 3 unique non-anchor characters in the middle

  Scenario: turnsPerCharacter expands each subset member to that many turns
    Then selectSlots with subsetSize 3 and turnsPerCharacter 3 returns 9 middle slots total

  Scenario: Round-robin interleave — subset members spread across the middle, not clustered
    Then selectSlots with subsetSize 3 turnsPerCharacter 3 and asymmetric scores returns middle slots in round-robin order

  Scenario: Wound-trigger relevance boosts characters with matches into the subset
    Then selectSlots with userInput containing a wound trigger places that character in the subset ahead of zero-score candidates

  Scenario: Zero-score characters still selectable when subset is not filled by high-score
    Then selectSlots with userInput having no wound matches still returns subsetSize characters drawn from the middle cast

  Scenario: The engine does not verify accuracy of the wound match
    Then selectSlots scores a candidate for any substring match of their wound words regardless of context

  Scenario: Anchor still bookends regardless of subset selection
    Then selectSlots with subsetSize 3 and turnsPerCharacter 3 returns 11 total slots with anchor at index 0 and the final index

  Scenario: Golf passes subsetSize, turnsPerCharacter, userInput, and wounds to selectSlots
    Then the Golf discuss function calls PanelDiscussEngine.selectSlots with subsetSize and turnsPerCharacter and userInput and wounds keys
