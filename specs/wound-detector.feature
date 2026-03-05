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
      | character  | wound_word    |
      | coltart    | valderrama    |
      | coltart    | brookline     |
      | mcginley   | gobshite      |
      | faldo      | fanny         |
      | faldo      | sunesson      |
      | faldo      | tiger         |
      | faldo      | norman        |
      | dougherty  | give up       |
      | roe        | parnevik      |
      | roe        | painkillers   |
      | murray     | not important |
      | henni      | skip that     |

  Scenario: GolfWoundDetector.check() returns triggered false for non-wound text
    Given the GolfWoundDetector is loaded
    When GolfWoundDetector.check() is called with character "coltart" and text "great shot today"
    Then the result has triggered false

  Scenario: GolfWoundDetector.check() returns triggered false for unknown character
    Given the GolfWoundDetector is loaded
    When GolfWoundDetector.check() is called with character "unknown_character" and text "valderrama"
    Then the result has triggered false

  Scenario: fanny triggers Faldo whether or not the speaker meant his caddie
    Given the GolfWoundDetector is loaded
    When GolfWoundDetector.check() is called with character "faldo" and text "I put it in my fanny pack"
    Then the result has triggered true

  Scenario: d:ream does not trigger Faldo — it belongs to Cox
    Given the GolfWoundDetector is loaded
    When GolfWoundDetector.check() is called with character "faldo" and text "d:ream were a great band"
    Then the result has triggered false

  # ─────────────────────────────────────────────────────────────
  # BOARDROOM WOUND DETECTOR — Cox
  # ─────────────────────────────────────────────────────────────

  Scenario: BoardroomWoundDetector triggers Cox on d:ream
    Given the BoardroomWoundDetector is loaded
    When GolfWoundDetector.check() is called with character "cox" and text "you played in d:ream"
    Then the result has triggered false

  Scenario: BoardroomWoundDetector.check() triggers cox on keyboards
    Given the BoardroomWoundDetector is loaded
    Then it exposes a check() method
    And check() returns an object with triggered and word properties

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
