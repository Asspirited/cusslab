Feature: QUNTUM_LEEKS_ENGINE — data and pure logic layer

  Background:
    Given the quntum-leeks scenarios are loaded
    And the quntum-leeks engine is loaded

  # ── GROUP A: Scenario data structure ─────────────────────────────────────

  Scenario: Every scenario has the required fields
    Then each scenario has a name
    And each scenario has a period
    And each scenario has a host
    And each scenario has a mirror
    And each scenario has a situation
    And each scenario has an al_note
    And each scenario has an object
    And each scenario has leap_questions
    And each scenario has characters

  Scenario: There are at least 10 scenarios
    Then the scenario count is at least 10

  Scenario: Random selection always returns a valid scenario key
    When a random scenario is selected 20 times
    Then every selection is a valid scenario key

  # ── GROUP B: State initialisation ────────────────────────────────────────

  Scenario: initState returns correct defaults
    When initState is called
    Then state.history is empty
    And state.turnCount is 0
    And state.leaped is false
    And state.probability is 50
    And state.samDamage is 0
    And state.samStats.truthiness is 70
    And state.samStats.bottiness is 60
    And state.samStats.leekiness is 3
    And state.samStats.swissCheeseLevel is 20
    And state.leekinessSpend is false
    And state.leekinessBet is 0
    And state.selectedZiggyOpt is -1

  # ── GROUP C: Bet and spend mechanics ─────────────────────────────────────

  Scenario: betLeekiness deducts from leekiness
    Given state with leekiness 3
    When betLeekiness is called with 2
    Then state.leekinessBet is 2
    And state.samStats.leekiness is 1

  Scenario: betLeekiness is capped at 3
    Given state with leekiness 3
    When betLeekiness is called with 5
    Then state.leekinessBet is 3

  Scenario: betLeekiness is rejected when leekiness is insufficient
    Given state with leekiness 1
    When betLeekiness is called with 2
    Then the bet is rejected
    And state.leekinessBet is 0
    And state.samStats.leekiness is 1

  Scenario: spendLeekiness sets the spend flag
    Given state with leekiness 2
    When spendLeekiness is called
    Then state.leekinessSpend is true

  Scenario: spendLeekiness does nothing when leekiness is 0
    Given state with leekiness 0
    When spendLeekiness is called
    Then state.leekinessSpend is false

  # ── GROUP D: Turn effect processing ──────────────────────────────────────

  Scenario: Probability increase awards 1 leekiness
    Given a state with probability 50 and leekiness 3
    When processTurnEffects is called with probability 60
    Then state.samStats.leekiness is 4

  Scenario: Probability drop of more than 10 increases samDamage
    Given a state with probability 70 and samDamage 0
    When processTurnEffects is called with probability 55
    Then state.samDamage is 1

  Scenario: Probability drop of 10 or less does not increase samDamage
    Given a state with probability 70 and samDamage 0
    When processTurnEffects is called with probability 60
    Then state.samDamage is 0

  Scenario: Accurate Ziggy advice reduces swissCheeseLevel
    Given a state with swissCheeseLevel 40 and truthiness 70 and selectedZiggyOpt 0
    When processTurnEffects is called with any probability
    Then state.samStats.swissCheeseLevel is 38

  Scenario: swissCheeseLevel at or above 80 activates deathcap
    Given a state with swissCheeseLevel 80
    When processTurnEffects is called with any probability
    Then state.deathcapActive is true

  Scenario: Bet and spend flags reset after processTurnEffects
    Given a state with leekinessSpend true and leekinessBet 2 and selectedZiggyOpt 1
    When processTurnEffects is called with any probability
    Then state.leekinessSpend is false
    And state.leekinessBet is 0
    And state.selectedZiggyOpt is -1

  # ── GROUP E: Prompt modifier building ────────────────────────────────────

  Scenario: buildModifiers returns empty string for clean state
    Given a clean state with no active modifiers
    When buildModifiers is called
    Then the modifiers result is empty

  Scenario: buildModifiers includes leekinessSpend modifier
    Given a state with leekinessSpend true
    When buildModifiers is called
    Then the modifiers result contains "pushing his luck"

  Scenario: buildModifiers includes bet amount when leekinessBet is set
    Given a state with leekinessBet 2
    When buildModifiers is called
    Then the modifiers result contains "2 Leekiness points"

  Scenario: buildModifiers includes DEATHCAP when swissCheeseLevel is 80 or above
    Given a state with swissCheeseLevel 85
    When buildModifiers is called
    Then the modifiers result contains "DEATHCAP MODE ACTIVE"

  Scenario: buildModifiers includes damage warning when samDamage is 4 or above
    Given a state with samDamage 4
    When buildModifiers is called
    Then the modifiers result contains "4 damage events"
