# Golf Adventure — Data Extraction Characterisation
# Feature: specs/golf-adventure-data.feature
# PR: feat/golf-adventure-architecture — Step 1: data extraction
# Purpose: lock down data shapes before extraction so regression is detectable
# Reference: Feathers — characterisation tests; Adzic — concrete examples

@golf-adventure-data
Feature: Golf Adventure Data Integrity

  The game data lives in four modules: characters, tournaments, events, shots.
  Each module must satisfy a minimum shape contract.
  These tests lock down what exists now. Any extraction that breaks them is a regression.

  Background:
    Given the golf adventure data modules are loaded

  ---

  ## Characters

  @data-characters
  Scenario: Every character has the required identity fields
    When the character registry is inspected
    Then every character has a non-empty "id"
    And every character has a non-empty "name"
    And every character has a non-empty "role"
    And every character has a non-empty "panel"

  @data-characters
  Scenario: Every character has a persona and wound
    When the character registry is inspected
    Then every character has a non-empty "persona_full"
    And every character has a non-empty "wound"

  @data-characters
  Scenario: Every character declares golf knowledge level
    When the character registry is inspected
    Then every character has a "golf_knowledge" field
    And the value is one of: "high", "medium", "low", "none"

  @data-characters
  Scenario Outline: Named commentator is present in the registry
    When the character registry is inspected
    Then a character with id "<id>" exists
    And their name is "<name>"

    Examples:
      | id        | name                |
      | faldo     | Sir Nick Faldo      |
      | mcginley  | Paul McGinley       |
      | riley     | Wayne Riley         |
      | markroe   | Mark Roe            |
      | henni     | Henni Zuel          |
      | butch     | Butch Harmon        |
      | brian_cox | Prof Brian Cox      |
      | souness   | Graeme Souness      |
      | pietersen | Kevin Pietersen     |

  ---

  ## Tournaments

  @data-tournaments
  Scenario: Every tournament has the required fields
    When the tournament catalogue is inspected
    Then every tournament has a non-empty "id"
    And every tournament has a numeric "year"
    And every tournament has a non-empty "name"
    And every tournament has a non-empty "course"
    And every tournament has a non-empty "lore"
    And every tournament has a "players" array with at least one entry
    And every tournament has a "holes" array with at least one entry

  @data-tournaments
  Scenario: Every player has historical scores
    When the tournament catalogue is inspected
    Then every player in every tournament has a non-empty "name"
    And every player has a "historicalScores" array
    And every historicalScores entry is a number

  @data-tournaments
  Scenario: Every hole has the required fields
    When the tournament catalogue is inspected
    Then every hole has a non-empty "id"
    And every hole has a numeric "par"
    And every hole has a numeric "yards"
    And every hole has a non-empty "hazard"

  @data-tournaments
  Scenario Outline: Named tournament is present in the catalogue
    When the tournament catalogue is inspected
    Then a tournament with id "<id>" exists
    And its year is <year>
    And its course contains "<course>"

    Examples:
      | id               | year | course    |
      | duel_sun         | 1977 | Turnberry |
      | muirfield_1972   | 1972 | Muirfield |
      | vandervelde_1999 | 1999 | Carnoustie |
      | tiger_2005       | 2005 | Augusta   |
      | medinah_2012     | 2012 | Medinah   |

  ---

  ## Events

  @data-events
  Scenario: Every event has the required fields
    When the events pool is inspected
    Then every event has a non-empty "id"
    And every event has a numeric "triggerChance" between 0 and 1
    And every event has a non-empty "header"
    And every event has a non-empty "text"
    And every event has a "choices" array with at least one entry

  @data-events
  Scenario: Every event choice has a label
    When the events pool is inspected
    Then every choice in every event has a non-empty "label"

  @data-events
  Scenario Outline: Named event is present in the pool
    When the events pool is inspected
    Then an event with id "<id>" exists
    And its triggerChance is greater than 0

    Examples:
      | id                  |
      | first_tee_announce  |
      | king_brown_approach |
      | adder_rough         |
      | feel_wind_on_neck   |
      | smell_hot_dog       |
      | vandervelde_18th    |
      | trevino_moment      |

  ---

  ## Shots

  @data-shots
  Scenario: All four shot categories are present
    When the shot types are inspected
    Then a "tee" category exists
    And an "approach" category exists
    And a "par3" category exists
    And a "putt" category exists

  @data-shots
  Scenario: Every shot has risk and threshold
    When the shot types are inspected
    Then every shot in every category has a numeric "risk"
    And every shot in every category has a numeric "thresh"
    And every shot has a non-empty "label"

  @data-shots
  Scenario: Each category contains exactly four risk levels
    When the shot types are inspected
    Then the "tee" category has 4 shots
    And the "approach" category has 4 shots
    And the "par3" category has 4 shots
    And the "putt" category has 4 shots

  ---

  ## Module Independence

  @data-independence
  Scenario: Data modules load without the game engine
    When only the data modules are loaded
    And the game engine is not initialised
    Then CHARACTERS is accessible and non-empty
    And TOURNAMENTS is accessible and non-empty
    And EVENTS is accessible and non-empty
    And SHOTS is accessible and non-empty

  @data-independence
  Scenario: Extracting data to separate files does not change observable game behaviour
    Given the data modules are loaded from external files
    When the golf adventure setup screen renders
    Then the tournament grid shows 5 selectable tournaments
    And the character panel shows 10 selectable commentators
    And the atmosphere options are unchanged
