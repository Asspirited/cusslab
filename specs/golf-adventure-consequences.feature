Feature: Tiered item event consequence system
  Item events replace hollow 'nothing' outcomes with tiered mechanical consequences.
  Consequences have a tier (LOW/MED/HIGH/NUTS), a direction (penalty/bonus),
  an amount, and a shot countdown. A HUD badge shows the active consequence.

  Background:
    Given a Golf Adventure game is in progress

  # --- Penalty direction ---

  Scenario: LOW penalty raises threshold by 1 for 1 shot
    When applyOutcome is called with a consequence outcome of tier LOW direction penalty
    Then G.tempThresholdMod is 1
    And G.tempThresholdHoles is 1

  Scenario: MED penalty raises threshold by 2 for 2 shots
    When applyOutcome is called with a consequence outcome of tier MED direction penalty
    Then G.tempThresholdMod is 2
    And G.tempThresholdHoles is 2

  Scenario: HIGH penalty raises threshold by 3 for 3 shots
    When applyOutcome is called with a consequence outcome of tier HIGH direction penalty
    Then G.tempThresholdMod is 3
    And G.tempThresholdHoles is 3

  Scenario: NUTS penalty raises threshold by 4 for 4 shots
    When applyOutcome is called with a consequence outcome of tier NUTS direction penalty
    Then G.tempThresholdMod is 4
    And G.tempThresholdHoles is 4

  # --- Bonus direction ---

  Scenario: LOW bonus lowers threshold by 1 for 1 shot
    When applyOutcome is called with a consequence outcome of tier LOW direction bonus
    Then G.tempThresholdMod is -1
    And G.tempThresholdHoles is 1

  Scenario: MED bonus activates fortune
    When applyOutcome is called with a consequence outcome of tier MED direction bonus
    Then G.fortuneActive is true

  Scenario: HIGH bonus raises composure by 2
    When applyOutcome is called with a consequence outcome of tier HIGH direction bonus
    Then G.composure increases by 2

  Scenario: NUTS bonus raises composure by 2 and activates fortune
    When applyOutcome is called with a consequence outcome of tier NUTS direction bonus
    Then G.composure increases by 2
    And G.fortuneActive is true

  # --- Countdown and expiry ---

  Scenario: Consequence countdown decrements on each shot taken
    Given a LOW penalty consequence is active with 1 shot remaining
    When a shot is resolved
    Then G.tempThresholdHoles is 0
    And G.tempThresholdMod is 0

  # --- Marshal's belt event ---

  Scenario: Marshal's belt LOW penalty outcome applies threshold +1 for 1 shot
    Given the marshal's belt item event fires
    When the player selects an outcome that resolves as consequence LOW penalty
    Then G.tempThresholdMod is 1
    And G.tempThresholdHoles is 1

  Scenario: No 'nothing' outcomes exist in marshal's belt event
    Given the marshal's belt item event definition
    Then no outcome has result 'nothing'

  # --- HUD ---

  Scenario: Consequence HUD badge appears when consequence activates
    When applyOutcome is called with a consequence outcome of tier MED direction penalty
    Then a consequence HUD indicator is visible showing "MED PENALTY — 2 shots remaining"

  Scenario: Consequence HUD badge is removed when countdown expires
    Given a consequence indicator is visible
    When G.tempThresholdHoles reaches 0
    Then the consequence indicator is removed from the HUD
