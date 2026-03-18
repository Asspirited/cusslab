Feature: TBT first cricket match

  Background:
    Given the TBT attribute engine is initialised

  Scenario Outline: FORM band determines scoring range
    Given form score is <form>
    And skill is <skill>
    When the match is resolved with roll <roll>
    Then the score is between <min> and <max>

    Examples:
      | form | skill | roll | min | max |
      | 17   | 5     | 0.50 | 50  | 554 |
      | 13   | 5     | 0.50 | 30  | 224 |
      | 9    | 5     | 0.50 | 1   | 124 |
      | 5    | 5     | 0.50 | 1   | 29  |
      | 2    | 5     | 0.50 | 1   | 14  |

  Scenario: Low roll produces a duck regardless of FORM
    Given form score is 17
    And skill is 5
    When the match is resolved with roll 0.03
    Then the score is 0
    And the duck type is duck

  Scenario: Very low roll produces a golden duck
    Given form score is 13
    And skill is 5
    When the match is resolved with roll 0.01
    Then the score is 0
    And the duck type is golden duck

  Scenario: Near-zero roll produces a platinum duck
    Given form score is 2
    And skill is 1
    When the match is resolved with roll 0.00
    Then the score is 0
    And the duck type is platinum duck

  Scenario: Match result updates cricket stats
    Given cricket stats are at zero
    When a match result of 35 runs is applied
    Then cricket matches is 1
    And cricket innings is 1
    And cricket runs is 35
    And cricket highest score is 35
    And cricket average is 35.0

  Scenario: Highest score updates when beaten
    Given cricket stats show 1 match 35 runs hs 35
    When a match result of 52 runs is applied
    Then cricket highest score is 52
    And cricket average is 43.5

  Scenario: Duck still updates matches and innings
    Given cricket stats show 1 match 35 runs hs 35
    When a match result of 0 runs is applied
    Then cricket matches is 2
    And cricket innings is 2
    And cricket runs is 35
    And cricket average is 17.5

  Scenario: First match fires the opening scene
    Given it is the player's first match
    When the match begins
    Then the scene includes the pavilion

  Scenario: Turn summary includes the score
    Given form score is 9
    And skill is 5
    When the match is resolved with roll 0.50
    Then the match turn summary includes the runs scored
