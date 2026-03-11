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
      | faldo      | tuna          |
      | faldo      | valhalla      |
      | faldo      | poulter       |
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
    When BoardroomWoundDetector.check() is called with character "cox" and text "you played in d:ream"
    Then the result has triggered true

  Scenario: BoardroomWoundDetector triggers Cox on keyboards
    Given the BoardroomWoundDetector is loaded
    When BoardroomWoundDetector.check() is called with character "cox" and text "he played the keyboards"
    Then the result has triggered true

  Scenario: BoardroomWoundDetector does not trigger Cox on unrelated text
    Given the BoardroomWoundDetector is loaded
    When BoardroomWoundDetector.check() is called with character "cox" and text "the universe is 13.8 billion years old"
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

  # ─────────────────────────────────────────────────────────────
  # DARTS WOUND DETECTOR
  # ─────────────────────────────────────────────────────────────

  Scenario Outline: DartsWoundDetector.check() triggers on known wound words
    Given the DartsWoundDetector is loaded
    When DartsWoundDetector.check() is called with character "<character>" and text containing "<wound_word>"
    Then the result has triggered true
    And the result has word "<wound_word>"

    Examples:
      | character | wound_word       |
      | mardle    | shepherd         |
      | mardle    | treble five      |
      | mardle    | mardle drift     |
      | mardle    | mumps            |
      | mardle    | donna            |
      | bristow   | dartitis         |
      | bristow   | wimps            |
      | bristow   | sixteen titles   |
      | taylor    | luck             |
      | taylor    | fortunate        |
      | lowe      | stoneface        |
      | lowe      | nine dart        |
      | george    | six nil          |
      | george    | 6-0              |
      | george    | 1994 final       |
      | waddell   | just commentary  |
      | waddell   | passed away      |
      | part      | no one knows     |
      | part      | unknown in canada|

  Scenario: DartsWoundDetector.check() returns triggered false for non-wound text
    Given the DartsWoundDetector is loaded
    When DartsWoundDetector.check() is called with character "mardle" and text "great throw tonight"
    Then the result has triggered false

  Scenario: DartsWoundDetector.check() returns triggered false for unknown character
    Given the DartsWoundDetector is loaded
    When DartsWoundDetector.check() is called with character "unknown_character" and text "shepherd"
    Then the result has triggered false

  Scenario: donna triggers Mardle regardless of context
    Given the DartsWoundDetector is loaded
    When DartsWoundDetector.check() is called with character "mardle" and text "I spoke to donna from accounts"
    Then the result has triggered true

  Scenario: six-nil does not trigger Taylor — it belongs to George
    Given the DartsWoundDetector is loaded
    When DartsWoundDetector.check() is called with character "taylor" and text "it finished six-nil"
    Then the result has triggered false

  Scenario: DartsWoundDetector satisfies the WoundDetector interface
    Given the DartsWoundDetector is loaded
    Then it exposes a check() method
    And check() accepts characterId and text arguments
    And check() returns an object with triggered and word properties

  Scenario: DartsWoundDetector.check() is case-insensitive
    Given the DartsWoundDetector is loaded
    When DartsWoundDetector.check() is called with character "bristow" and text "everyone knows about the DARTITIS"
    Then the result has triggered true
