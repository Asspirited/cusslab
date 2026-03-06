Feature: Watching the Oche — Crowd Pressure mechanic
  As a user of the Watching the Oche darts panel
  I want the ambient crowd state to influence panel energy
  So that the studio atmosphere feels live and reactive

  Background:
    Given a Watching the Oche session is in progress
    And the crowd pressure state is one of "QUIET, BUILDING, ROARING, CHAOS"

  Scenario: Crowd pressure state is initialised at session start
    When a new Watching the Oche session begins
    Then the crowd pressure state is set to "QUIET"

  Scenario Outline: Crowd pressure state is passed to each panel member prompt
    Given the current crowd pressure state is "<state>"
    When a round begins
    Then each active panel member receives the crowd pressure state in their prompt context

    Examples:
      | state    |
      | QUIET    |
      | BUILDING |
      | ROARING  |
      | CHAOS    |

  Scenario Outline: Panel members react to crowd pressure according to their character
    Given the current crowd pressure state is "<state>"
    And "<member>" is active in the session
    When "<member>" responds in this round
    Then their response reflects their character's relationship to crowd pressure

    Examples:
      | state   | member  |
      | ROARING | Mardle  |
      | ROARING | Lowe    |
      | CHAOS   | Waddell |
      | CHAOS   | Bristow |

  Scenario: Crowd pressure state can escalate across rounds
    Given the crowd pressure state is "BUILDING"
    When a crowd escalation trigger occurs
    Then the crowd pressure state advances to "ROARING"

  Scenario: Crowd pressure state does not exceed CHAOS
    Given the crowd pressure state is "CHAOS"
    When a crowd escalation trigger occurs
    Then the crowd pressure state remains "CHAOS"
