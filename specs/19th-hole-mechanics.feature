Feature: 19th Hole Panel Mechanics
  As a golf panel consumer
  I want characters to speak in tight reactive exchanges by default
  But escalate to extended speech when wounds are triggered
  And be interruptible by sufficiently activated characters
  So that the panel feels like a real conversation not a sequence of monologues

  Scenario Outline: Wound keyword sets woundActivated for the correct character
    Given the golf panel is running
    When the word "<wound_trigger>" appears in any speaker's output
    Then "<character>"'s woundActivated flag is set to true
    And "<character>"'s interrupt probability receives the +0.15 wound bonus

    Examples:
      | character  | wound_trigger   |
      | coltart    | valderrama      |
      | coltart    | brookline       |
      | mcginley   | gobshite        |
      | faldo      | d:ream          |
      | dougherty  | give up         |
      | roe        | parnevik        |
      | roe        | painkillers     |
      | murray     | not important   |
      | henni      | skip that       |

  Scenario Outline: Wound activation sets character speech_mode to extended
    Given "<character>"'s woundActivated is true
    When the orchestrator evaluates "<character>"'s speech_mode
    Then "<character>"'s speech_mode is set to "extended"
    And their prompt instruction permits more than two sentences

    Examples:
      | character  |
      | coltart    |
      | mcginley   |
      | faldo      |
      | dougherty  |
      | roe        |
      | murray     |
      | henni      |

  Scenario: Wayne Riley escalation is round-based not wound-based
    Given Wayne Riley is in the panel
    And the current golf-round is 4 or higher
    When the orchestrator evaluates Wayne's speech_mode
    Then Wayne's speech_mode is set to "extended"
    And this is not driven by woundActivated

  Scenario Outline: High-temperature character interrupts extended speech
    Given "<speaker>" is in extended speech mode
    And "<interrupter>"'s temperature toward "<speaker>" is "<temperature>"
    When the orchestrator checks for interruption before completing "<speaker>"'s turn
    Then interruption fires at the correct probability
    And "<interrupter>" becomes the next speaker

    Examples:
      | speaker    | interrupter | temperature |
      | faldo      | mcginley    | reverent    |
      | mcginley   | coltart     | hostile     |
      | roe        | radar       | cooling     |
      | dougherty  | faldo       | warm        |

  Scenario: woundActivated raises interruption probability by 0.15
    Given a character's base interrupt probability is determined by temperature
    And that character's woundActivated flag is true
    When the orchestrator computes interrupt probability
    Then the result equals base_temperature_rate + 0.15

  Scenario Outline: Each character contributes minimum turns before round exhaustion
    Given a round begins with <character_count> active panel members
    And no character's temperature is "hostile"
    When the round loop runs
    Then each panel member contributes at least <min_contributions> times
    And the round is not marked exhausted until that threshold is met

    Examples:
      | character_count | min_contributions |
      | 3               | 2                 |
      | 4               | 2                 |
      | 6               | 2                 |

  Scenario: Hostile temperature between two characters increases contributions in that pairing
    Given McGinley's temperature toward Coltart is "hostile"
    When a round runs
    Then McGinley and Coltart contribute at least 3 times each
    Before the round is marked exhausted
