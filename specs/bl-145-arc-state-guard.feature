Feature: BL-145 — Narrative Move Model: arc state guard (Golf panel)

  Background:
    Given the Golf panel Q&A section of index.html is loaded

  Scenario Outline: Each Golf panel member has a postureType field
    Then the Golf character "<characterId>" has a postureType field
    Examples:
      | characterId |
      | radar       |
      | faldo       |
      | mcginley    |
      | coltart     |
      | roe         |
      | murray      |
      | dougherty   |
      | henni       |
      | butch       |
      | howell      |

  Scenario: Golf discuss() initialises a recentMoves array before the panel runs
    Then the Golf discuss function initialises a recentMoves array

  Scenario: Golf discuss() records each character's postureType to recentMoves after their response
    Then the Golf discuss function appends postureType to recentMoves after each API response

  Scenario: When the last 3 recentMoves share the same register, a break instruction is injected
    Then the Golf discuss function checks recentMoves for three consecutive same-register moves
    And the Golf system prompt construction includes a break-register block

  Scenario: Break-register block is conditional and does not fire for fewer than 3 moves
    Then the Golf break-register block is guarded by a recentMoves length check
