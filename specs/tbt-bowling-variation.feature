Feature: TBT bowling variation — overlapping bands and surprise mechanic

  Background:
    Given the TBT attribute engine is initialised

  Scenario Outline: FORM band determines bowling outcome range (overlapping)
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

  Scenario: Out-of-Form bowler can take a wicket (overlap into Scratchy range)
    Given form score is 5
    And bowling skill is 5
    When the bowling is resolved with roll 0.85
    Then the wickets taken is between 0 and 2
    And the runs conceded is between 40 and 85

  Scenario: Nowhere bowler can produce a tight spell (overlap into Out-of-Form range)
    Given form score is 2
    And bowling skill is 5
    When the bowling is resolved with roll 0.80
    Then the wickets taken is between 0 and 1
    And the runs conceded is between 50 and 90

  Scenario: Roll at 0.90 triggers one-band surprise
    Given form score is 5
    And bowling skill is 5
    When the bowling is resolved with roll 0.90
    Then the wickets taken is between 0 and 3
    And the runs conceded is between 30 and 85

  Scenario: Roll at 0.95 triggers two-band surprise
    Given form score is 5
    And bowling skill is 5
    When the bowling is resolved with roll 0.95
    Then the wickets taken is between 0 and 4
    And the runs conceded is between 20 and 85

  Scenario: Surprise from Nowhere reaches Out-of-Form territory at 0.90
    Given form score is 2
    And bowling skill is 5
    When the bowling is resolved with roll 0.90
    Then the wickets taken is between 0 and 2
    And the runs conceded is between 40 and 90

  Scenario: Surprise from Nowhere reaches Scratchy territory at 0.95
    Given form score is 2
    And bowling skill is 5
    When the bowling is resolved with roll 0.95
    Then the wickets taken is between 0 and 3
    And the runs conceded is between 30 and 90

  Scenario: Flying cannot jump beyond top band
    Given form score is 17
    And bowling skill is 5
    When the bowling is resolved with roll 0.95
    Then the wickets taken is between 2 and 6
    And the runs conceded is between 10 and 45

  Scenario: Surprise does not trigger below threshold
    Given form score is 5
    And bowling skill is 5
    When the bowling is resolved with roll 0.89
    Then the wickets taken is between 0 and 2
    And the runs conceded is between 40 and 85
