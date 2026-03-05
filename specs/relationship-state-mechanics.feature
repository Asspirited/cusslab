Feature: Relationship State Mechanics
  As the panel orchestrator
  I want character temperatures to change deterministically based on events
  So that inter-character dynamics are testable without LLM output

  Scenario Outline: Golf panel pre-existing relationships initialise correctly
    Given the golf panel is initialised
    Then "<character>"'s temperature toward "<other>" is "<temperature>"

    Examples:
      | character  | other        | temperature |
      | dougherty  | faldo        | warm        |
      | mcginley   | faldo        | reverent    |
      | mcginley   | radar        | cooling     |
      | radar      | roe          | cooling     |
      | roe        | montgomerie  | cooling     |
      | coltart    | montgomerie  | cooling     |
      | faldo      | coltart      | neutral     |
      | roe        | henni        | neutral     |
      | murray     | dougherty    | neutral     |
      | henni      | faldo        | neutral     |
      | coltart    | dougherty    | neutral     |
      | radar      | faldo        | neutral     |

  Scenario: Temperature scale has seven defined steps in order
    Given the temperature scale is defined
    Then the steps in ascending order are:
      | hostile   |
      | wounded   |
      | simmering |
      | cooling   |
      | neutral   |
      | warm      |
      | reverent  |

  Scenario: Temperature does not drop below hostile
    Given a character's temperature is "hostile"
    When an event would lower temperature further
    Then the temperature remains "hostile"

  Scenario: Temperature does not rise above reverent
    Given a character's temperature is "reverent"
    When an event would raise temperature further
    Then the temperature remains "reverent"

  Scenario Outline: Temperature rises when a character's wound is referenced
    Given "<character>"'s temperature toward the speaker is "<before>"
    And "<character>"'s wound trigger "<wound_trigger>" appears in the speaker's output
    When the orchestrator processes the temperature change
    Then "<character>"'s temperature toward the speaker becomes "<after>"
    And "<character>"'s woundActivated flag is set to true

    Examples:
      | character  | wound_trigger  | before    | after     |
      | coltart    | valderrama     | neutral   | simmering |
      | coltart    | brookline      | simmering | wounded   |
      | mcginley   | gobshite       | cooling   | wounded   |
      | faldo      | d:ream         | neutral   | simmering |
      | roe        | parnevik       | neutral   | simmering |
      | roe        | painkillers    | simmering | wounded   |
      | dougherty  | give up        | neutral   | simmering |
      | murray     | not important  | neutral   | simmering |

  Scenario Outline: Temperature rises when a character is insulted directly
    Given "<character>"'s temperature toward the speaker is "<before>"
    When the speaker directly insults "<character>"
    Then "<character>"'s temperature toward the speaker becomes "<after>"

    Examples:
      | character  | before  | after     |
      | faldo      | neutral | simmering |
      | mcginley   | cooling | simmering |
      | coltart    | warm    | neutral   |

  Scenario Outline: Temperature rises one step when a character is mimicked
    Given "<character>"'s temperature toward the speaker is "<before>"
    When the speaker mimics "<character>"
    Then "<character>"'s temperature toward the speaker becomes "<after>"

    Examples:
      | character  | before  | after     |
      | faldo      | neutral | simmering |
      | murray     | cooling | simmering |

  Scenario Outline: Temperature warms when a character is genuinely agreed with
    Given "<character>"'s temperature toward the speaker is "<before>"
    When the speaker genuinely agrees with "<character>"
    Then "<character>"'s temperature toward the speaker becomes "<after>"

    Examples:
      | character  | before    | after   |
      | mcginley   | neutral   | warm    |
      | dougherty  | cooling   | neutral |
      | faldo      | simmering | cooling |

  Scenario Outline: Temperature cools one step when a character is ignored
    Given "<character>"'s temperature toward the speaker is "<before>"
    When the speaker ignores "<character>" for two consecutive turns
    Then "<character>"'s temperature toward the speaker becomes "<after>"

    Examples:
      | character  | before    | after   |
      | mcginley   | simmering | cooling |
      | roe        | neutral   | cooling |

  Scenario: woundActivated persists for remainder of session
    Given coltart's woundActivated is set to true in round 2
    When rounds 3 and 4 run
    Then coltart's woundActivated remains true in round 3
    And coltart's woundActivated remains true in round 4

  Scenario: woundActivated resets at panel end not turn end
    Given coltart's woundActivated is true
    When the panel session ends
    Then coltart's woundActivated resets to false

  Scenario: Debt ledger creates pressure toward repayment
    Given mcginley owes faldo a debt from round 1
    Then mcginley's debtLedger.owes contains "faldo"
    And faldo's debtLedger.owed contains "mcginley"

  Scenario: Debt is cleared when character collects
    Given mcginley owes faldo a debt
    When mcginley calls in the debt in round 3
    Then mcginley's debtLedger.owes no longer contains "faldo"
    And faldo's debtLedger.owed no longer contains "mcginley"

  Scenario: State is injected as first-person internal monologue
    Given mcginley's temperature toward faldo is "reverent"
    When summariseFromState() generates mcginley's prompt prefix
    Then the YOUR STATE block uses first-person language
    And the language is congruent with mcginley's voice

  Scenario: First turn has no YOUR STATE block
    Given the panel has just been initialised
    When summariseFromState() generates any character's prompt prefix for round 1
    Then no YOUR STATE block is present in the prefix
