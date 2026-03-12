Feature: Hardmen Reaction Panel
  As a user facing a pub predicament
  I want Roy Keane, Vinny Jones, and Nostradamus to react in sequence
  So that the situation is assessed, resolved, and confirmed as inevitable

  Background:
    Given "hardmen" is in the consultant skin tabs
    And "hardmen" is registered in the nav group map

  Scenario: Panel is wired into the Little Misadventure nav group
    Then "hardmen" is registered in the nav group map

  Scenario: Five pub situations are present in the Hardmen module
    Then the hardmen situation list contains 5 entries

  Scenario: All three characters are present in the Hardmen module
    Then the hardmen panel includes "Roy Keane"
    And the hardmen panel includes "Vinny Jones"
    And the hardmen panel includes "Nostradamus"

  Scenario: Keane prompt instructs his voice pattern
    Given a pub situation "The bar is three deep. You need a drink."
    When buildHardmenPrompt is called for "keane"
    Then the Keane prompt instructs clipped sentences and controlled fury

  Scenario: Vinny prompt includes prior Keane response for context
    Given a pub situation "The bar is three deep. You need a drink."
    And a prior Keane response "Find your terrain."
    When buildHardmenPrompt is called for "vinny"
    Then the Vinny prompt includes the prior Keane response

  Scenario: Nostradamus prompt includes prior Keane and Vinny responses
    Given a pub situation "The bar is three deep. You need a drink."
    And a prior Keane response "Find your terrain."
    And a prior Vinny response "Get in there."
    When buildHardmenPrompt is called for "nostradamus"
    Then the Nostradamus prompt includes both prior responses

  Scenario: Nostradamus prompt instructs the five-movement structure
    Given a pub situation "The bar is three deep. You need a drink."
    When buildHardmenPrompt is called for "nostradamus"
    Then the Nostradamus prompt instructs quatrain, attribution, interpretation, timing qualification, and resigned acceptance
