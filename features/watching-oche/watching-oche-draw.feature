Feature: Watching the Oche — panel draw
  As a user of the Watching the Oche darts panel
  I want 5 panel members drawn randomly from the pool of 7 each session
  So that each session has fresh character collisions

  Background:
    Given the Watching the Oche cast pool contains exactly 7 panel members
    And the cast pool members are "Mardle, Bristow, Taylor, Lowe, George, Waddell, Part"

  Scenario: Five panel members are drawn for a session
    When a new Watching the Oche session begins
    Then exactly 5 panel members are selected
    And all 5 selected members are drawn from the cast pool
    And no panel member appears more than once in the selection

  Scenario: Draw produces a different selection across sessions
    When a Watching the Oche session begins
    And another Watching the Oche session begins
    Then the two selections are not guaranteed to be identical

  Scenario Outline: Frankenstein wound activates when both Bristow and Taylor are drawn
    Given the session draw includes "<member_a>"
    And the session draw includes "<member_b>"
    When the panel is initialised
    Then the Frankenstein wound flag is active
    And both panel members have elevated baseline intensity

    Examples:
      | member_a | member_b |
      | Bristow  | Taylor   |
      | Taylor   | Bristow  |

  Scenario: Frankenstein wound does not activate when only one is drawn
    Given the session draw includes "Bristow"
    And the session draw does not include "Taylor"
    When the panel is initialised
    Then the Frankenstein wound flag is inactive

  Scenario: Frankenstein wound does not activate when only one is drawn
    Given the session draw includes "Taylor"
    And the session draw does not include "Bristow"
    When the panel is initialised
    Then the Frankenstein wound flag is inactive

  Scenario Outline: Dead-in-panel-world members do not acknowledge death
    Given "<member>" is included in the session draw
    And a panel member references "<member>'s death"
    When the panel responds
    Then "<member>" does not acknowledge the reference
    And "<member>" continues in their established register

    Examples:
      | member  |
      | Bristow |
      | Waddell |
