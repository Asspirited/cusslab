Feature: TBT cricket bowling resolution

  Background:
    Given the TBT attribute engine is initialised

  Scenario Outline: FORM band determines bowling outcome range
    Given form score is <form>
    And bowling skill is <skill>
    When the bowling is resolved with roll <roll>
    Then the wickets taken is between <min_wkts> and <max_wkts>
    And the runs conceded is between <min_runs> and <max_runs>

    Examples:
      | form | skill | roll | min_wkts | max_wkts | min_runs | max_runs |
      | 17   | 5     | 0.50 | 2        | 6        | 10       | 45       |
      | 13   | 5     | 0.50 | 1        | 4        | 20       | 60       |
      | 9    | 5     | 0.50 | 0        | 3        | 30       | 75       |
      | 5    | 5     | 0.50 | 0        | 2        | 40       | 85       |
      | 2    | 5     | 0.50 | 0        | 1        | 50       | 90       |

  Scenario: Low roll produces a wicketless economy spell
    Given form score is 17
    And bowling skill is 5
    When the bowling is resolved with roll 0.10
    Then the wickets taken is 0
    And the runs conceded is between 10 and 45

  Scenario: Bowling result updates bowling stats
    Given bowling stats are at zero
    When a bowling result of 2 wickets 28 runs is applied
    Then bowling matches is 1
    And bowling wickets is 2
    And bowling runs conceded is 28
    And bowling best figures is 2 for 28
    And bowling average is 14.0

  Scenario: Best figures updates when beaten
    Given bowling stats show 1 match 2 wickets 28 runs best 2 for 28
    When a bowling result of 3 wickets 35 runs is applied
    Then bowling best figures is 3 for 35
    And bowling average is 12.6

  Scenario: Best figures does not update on worse performance
    Given bowling stats show 1 match 2 wickets 28 runs best 2 for 28
    When a bowling result of 1 wicket 40 runs is applied
    Then bowling best figures is 2 for 28

  Scenario: Bowling average is n/a when no wickets taken
    Given bowling stats are at zero
    When a bowling result of 0 wickets 30 runs is applied
    Then bowling average is n/a

  Scenario: Bowling average recovers once a wicket is taken
    Given bowling stats show 1 match 0 wickets 30 runs best 0 for 30
    When a bowling result of 1 wicket 25 runs is applied
    Then bowling average is 55.0

  Scenario: Bowling note is included in turn summary
    Given form score is 13
    And bowling skill is 5
    When the bowling is resolved with roll 0.50
    Then the bowling turn summary includes the wickets taken
    And the bowling turn summary includes the runs conceded

  Scenario: Bowling note carries era and setting flavour
    Given form score is 17
    And bowling skill is 5
    When the bowling is resolved with roll 0.80
    Then the bowling turn summary is not empty
