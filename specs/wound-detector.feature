Feature: WoundDetector Abstraction
  As the panel orchestrator
  I want wound detection behind a shared interface
  So that each panel uses the same contract without duplicating logic

  # ─────────────────────────────────────────────────────────────
  # GOLF WOUND DETECTOR
  # ─────────────────────────────────────────────────────────────

  Scenario Outline: GolfWoundDetector.check() triggers on known wound words
    Given the GolfWoundDetector is loaded
    When GolfWoundDetector.check() is called with character "<character>" and text containing "<wound_word>"
    Then the result has triggered true
    And the result has word "<wound_word>"

    Examples:
      | character  | wound_word  |
      | coltart    | valderrama  |
      | coltart    | brookline   |
      | mcginley   | gobshite    |
      | faldo      | d:ream      |
      | dougherty  | give up     |
      | roe        | parnevik    |
      | roe        | painkillers |
      | murray     | not important |
      | henni      | skip that   |

  Scenario: GolfWoundDetector.check() returns triggered false for non-wound text
    Given the GolfWoundDetector is loaded
    When GolfWoundDetector.check() is called with character "coltart" and text "great shot today"
    Then the result has triggered false

  Scenario: GolfWoundDetector.check() returns triggered false for unknown character
    Given the GolfWoundDetector is loaded
    When GolfWoundDetector.check() is called with character "unknown_character" and text "valderrama"
    Then the result has triggered false

  # ─────────────────────────────────────────────────────────────
  # SHARED INTERFACE
  # ─────────────────────────────────────────────────────────────

  Scenario: GolfWoundDetector satisfies the WoundDetector interface
    Given the GolfWoundDetector is loaded
    Then it exposes a check() method
    And check() accepts characterId and text arguments
    And check() returns an object with triggered and word properties

  Scenario: BoardroomWoundDetector satisfies the WoundDetector interface
    Given the BoardroomWoundDetector is loaded
    Then it exposes a check() method
    And check() accepts characterId and text arguments
    And check() returns an object with triggered and word properties

  # ─────────────────────────────────────────────────────────────
  # CASE INSENSITIVITY
  # ─────────────────────────────────────────────────────────────

  Scenario: WoundDetector.check() is case-insensitive
    Given the GolfWoundDetector is loaded
    When GolfWoundDetector.check() is called with character "coltart" and text "He mentioned VALDERRAMA in passing"
    Then the result has triggered true
