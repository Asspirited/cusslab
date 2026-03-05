Feature: Temperature Value Object
  As the panel orchestrator
  I want Temperature to be an immutable value object
  So that invalid temperatures are impossible not just unlikely

  # ─────────────────────────────────────────────────────────────
  # RAISE
  # ─────────────────────────────────────────────────────────────

  Scenario Outline: Temperature.raise() moves one step up the scale
    When Temperature.raise() is called with "<current>"
    Then the result is "<raised>"

    Examples:
      | current   | raised    |
      | hostile   | wounded   |
      | wounded   | simmering |
      | simmering | cooling   |
      | cooling   | neutral   |
      | neutral   | warm      |
      | warm      | reverent  |
      | reverent  | reverent  |

  # ─────────────────────────────────────────────────────────────
  # LOWER
  # ─────────────────────────────────────────────────────────────

  Scenario Outline: Temperature.lower() moves one step down the scale
    When Temperature.lower() is called with "<current>"
    Then the result is "<lowered>"

    Examples:
      | current   | lowered   |
      | reverent  | warm      |
      | warm      | neutral   |
      | neutral   | cooling   |
      | cooling   | simmering |
      | simmering | wounded   |
      | wounded   | hostile   |
      | hostile   | hostile   |

  # ─────────────────────────────────────────────────────────────
  # FROMSTRING
  # ─────────────────────────────────────────────────────────────

  Scenario Outline: Temperature.fromString() accepts valid values
    When Temperature.fromString() is called with "<value>"
    Then the result is valid and equals "<value>"

    Examples:
      | value     |
      | hostile   |
      | wounded   |
      | simmering |
      | cooling   |
      | neutral   |
      | warm      |
      | reverent  |

  Scenario: Temperature.fromString() rejects an invalid string
    When Temperature.fromString() is called with "furious"
    Then the result is an error

  Scenario: Temperature.fromString() rejects an empty string
    When Temperature.fromString() is called with ""
    Then the result is an error

  # ─────────────────────────────────────────────────────────────
  # INTERRUPTRATE
  # ─────────────────────────────────────────────────────────────

  Scenario Outline: Temperature.interruptRate() returns correct probability
    When Temperature.interruptRate() is called with "<temperature>"
    Then the result is <rate>

    Examples:
      | temperature | rate |
      | hostile     | 0.45 |
      | wounded     | 0.30 |
      | simmering   | 0.20 |
      | cooling     | 0.08 |
      | neutral     | 0.04 |
      | warm        | 0.02 |
      | reverent    | 0.01 |
