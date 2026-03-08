
Feature: Watching the Oche — character draw
  As a user of the Watching the Oche darts panel
  I want to select which commentators appear in my session
  So that I can control the panel composition before play begins

  Background:
    Given the darts panel is open
    And the full character pool contains 7 commentators

  # ── DRAW MECHANICS ────────────────────────────────────────────────────────

  Scenario: User can select between 3 and 5 commentators from the pool
    When I open the character selection screen
    Then I can select a minimum of 3 commentators
    And I can select a maximum of 5 commentators

  Scenario: Fewer than 3 selected disables the confirm button
    When I select 2 commentators
    Then the confirm draw button is disabled

  Scenario: More than 5 selected is prevented by the UI
    Given I have selected 5 commentators
    When I attempt to select a sixth commentator
    Then the sixth selection is rejected
    And the selection count remains 5

  Scenario: Confirm draw button is enabled with 3 to 5 selections
    When I select 4 commentators
    Then the confirm draw button is enabled

  Scenario Outline: Selection count within valid range enables confirm
    When I select <count> commentators
    Then the confirm draw button is <state>

    Examples:
      | count | state    |
      | 2     | disabled |
      | 3     | enabled  |
      | 4     | enabled  |
      | 5     | enabled  |

  # ── FRANKENSTEIN WOUND ────────────────────────────────────────────────────

  Scenario: Selecting both Bristow and Taylor activates the Frankenstein wound
    When I select "bristow" from the pool
    And I select "taylor" from the pool
    Then the Frankenstein wound indicator is visible
    And the indicator reads "BRISTOW + TAYLOR — Frankenstein wound active"

  Scenario: Frankenstein wound indicator is hidden when only one is selected
    When I select "bristow" from the pool
    And I do not select "taylor"
    Then the Frankenstein wound indicator is not visible

  Scenario: Frankenstein wound is passed to session context on confirm
    Given both "bristow" and "taylor" are selected
    When I confirm the draw
    Then dtState.frankensteinActive is true

  # ── POOL COMPOSITION ──────────────────────────────────────────────────────

  Scenario: All 7 pool members are shown in the selection screen
    When I open the character selection screen
    Then 7 character tiles are visible
    And each tile shows the character name

  Scenario: Selected characters are highlighted
    When I select "mardle" from the pool
    Then the "mardle" tile has the selected class

  Scenario: Deselecting a character removes the highlight
    Given "mardle" is selected
    When I click the "mardle" tile again
    Then the "mardle" tile does not have the selected class
    And the selection count decreases by 1

  # ── SESSION HANDOFF ───────────────────────────────────────────────────────

  Scenario: Confirmed draw sets dtState.activeCharacters
    Given I have selected "mardle", "bristow", and "lowe"
    When I confirm the draw
    Then dtState.activeCharacters contains exactly "mardle", "bristow", and "lowe"

  Scenario: Confirmed draw sets dtState.activeCharacters count to selection count
    Given I have selected 4 commentators
    When I confirm the draw
    Then dtState.activeCharacters has length 4
