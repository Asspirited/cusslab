Feature: FF shared engine — shared game primitives
  As the game engine infrastructure
  I want shared state management, history tracking, turn counting, and modifier formatting
  So that Quntum Leeks, Golf Adventure, and Pub Navigator all use the same proven core

  Scenario: Initialising a fresh game state with custom fields
    Given a game config with fields composure:10 and phase:"tee"
    When I call initGameState with that config
    Then the ff state has history: []
    And the ff state has turnCount: 0
    And the ff state has composure: 10
    And the ff state has phase: "tee"

  Scenario: Initialising a fresh game state with no custom fields
    When I call initGameState with no config
    Then the ff state has history: []
    And the ff state has turnCount: 0

  Scenario: Appending an entry to history
    Given a fresh ff game state
    When I append the entry "Al said: hello" to ff history with cap 10
    Then the ff history contains 1 entry
    And the first ff history entry is "Al said: hello"

  Scenario: Appending multiple entries preserves order
    Given a fresh ff game state
    When I append entries "first", "second", "third" to ff history with cap 10
    Then the ff history contains 3 entries in insertion order

  Scenario: History cap evicts the oldest entry when full
    Given a fresh ff game state
    And the ff history is at capacity with entries "one", "two", "three" and cap 3
    When I append the entry "newest" to ff history with cap 3
    Then the ff history contains 3 entries
    And the first ff history entry is "two"
    And the last ff history entry is "newest"

  Scenario: Incrementing the turn counter
    Given a fresh ff game state
    When I call incrementTurn 3 times
    Then the ff state has turnCount: 3

  Scenario: Building a modifier block with no modifiers
    When I call buildModifierBlock with an empty array
    Then the ff modifier result is an empty string

  Scenario: Building a modifier block with one modifier
    Given the ff modifier "Sam is in deathcap mode"
    When I call buildModifierBlock with that ff modifier
    Then the ff modifier result contains "ACTIVE MODIFIERS THIS TURN:"
    And the ff modifier result contains "Sam is in deathcap mode"

  Scenario: Building a modifier block with multiple modifiers
    Given the ff modifiers "Modifier A" and "Modifier B"
    When I call buildModifierBlock with those ff modifiers
    Then the ff modifier result contains "Modifier A"
    And the ff modifier result contains "Modifier B"
    And each ff modifier appears on its own line
