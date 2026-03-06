Feature: Panel Slot System
  As a user
  I want panels assembled with balanced character roles
  So that every panel has tonal range, conflict potential, and a functioning liar

  Background:
    Given the panel slot definitions are loaded from "panel-slots.md"
    And the Long Room character roster is available with the following slot assignments:
      | character | primary_slot | secondary_slot |
      | holding   | anchor       |                |
      | boycott   | anchor       | grievance      |
      | botham    | engine       | liar           |
      | bumble    | engine       | liar           |
      | kp        | grievance    | liar           |
      | gower     | grievance    | exotic         |
      | warne     | exotic       | liar           |
      | blofeld   | exotic       | liar           |

  # --- 5-person panel (default) ---

  Scenario: Default random panel contains one character per slot
    When a random 5-person Long Room panel is assembled
    Then the panel should contain exactly 1 anchor
    And the panel should contain exactly 1 engine
    And the panel should contain exactly 1 grievance
    And the panel should contain exactly 1 exotic
    And the panel should contain exactly 1 liar
    And the panel should contain exactly 5 characters

  Scenario: Secondary slot satisfies slot requirement
    When a random 5-person panel is assembled
    And "botham" is selected as the engine
    Then "botham" also satisfies the liar slot
    And no additional liar needs to be drawn

  Scenario: Random panel varies across multiple generations
    When 10 random 5-person panels are assembled
    Then no two panels should be identical

  # --- 4-person panel (EXP-001 variant A) ---

  Scenario: 4-person panel drops exotic slot first
    When a random 4-person Long Room panel is assembled
    Then the panel should contain exactly 1 anchor
    And the panel should contain exactly 1 engine
    And the panel should contain exactly 1 grievance
    And the panel should contain exactly 1 liar
    And the panel should contain exactly 4 characters
    And the panel should not require an exotic slot

  Scenario: 4-person panel never drops anchor or engine
    When 20 random 4-person panels are assembled
    Then every panel should contain at least 1 anchor
    And every panel should contain at least 1 engine

  # --- 6-person panel (EXP-001 variant B) ---

  Scenario: 6-person panel doubles engine slot
    When a random 6-person Long Room panel is assembled
    Then the panel should contain exactly 2 engines
    And the panel should contain exactly 1 anchor
    And the panel should contain exactly 1 grievance
    And the panel should contain exactly 1 exotic
    And the panel should contain exactly 1 liar
    And the panel should contain exactly 6 characters

  Scenario: 6-person panel never doubles anchor
    When 20 random 6-person panels are assembled
    Then no panel should contain 2 anchors

  # --- Conflict weighting ---

  Scenario: Panel assembly prefers characters with pre-existing tension
    Given the following conflict pairs exist:
      | character_a | character_b | tension_level |
      | botham      | boycott     | high          |
      | kp          | boycott     | medium        |
      | bumble      | boycott     | low           |
    When 20 random panels are assembled containing "boycott"
    Then "botham" should appear alongside "boycott" more often than "bumble"
    And "botham" should appear alongside "boycott" in at least 60% of panels

  Scenario: Conflict weighting does not guarantee conflict pair always selected
    When 20 random panels are assembled containing "boycott"
    Then "botham" should not appear in every panel

  # --- User selection ---

  Scenario: User can manually select any 3 to 5 characters
    When the user selects characters "boycott" "botham" "holding" "gower"
    Then the panel should contain exactly those 4 characters
    And slot validation should be skipped for manual selection

  Scenario: User selecting 6 characters triggers quality warning
    When the user selects 6 characters
    Then a warning should be displayed: "Panels of 6 may reduce individual character contribution"
    And the panel should still be assembled with those 6 characters

  Scenario: User cannot select fewer than 3 characters
    When the user selects 2 characters
    Then an error should be displayed: "Minimum panel size is 3"
    And the panel should not be assembled

  Scenario: User cannot select more than 6 characters
    When the user selects 7 characters
    Then an error should be displayed: "Maximum panel size is 6"
    And the panel should not be assembled

  # --- Cross-panel portability ---

  Scenario Outline: Slot system works for all panels
    Given the "<panel>" character roster is loaded with slot assignments
    When a random 5-person panel is assembled
    Then the panel should contain exactly 1 anchor
    And the panel should contain exactly 1 engine
    And the panel should contain exactly 1 grievance
    And the panel should contain exactly 1 exotic
    And the panel should contain exactly 1 liar

    Examples:
      | panel       |
      | long_room   |
      | 19th_hole   |
      | football    |
