Feature: HCSession.logPanelRun() data observable
  logPanelRun writes cumulative panel stats to a stable localStorage key.
  Stats are readable by any code and by pipeline checks via pure function tests.

  Scenario: First run for a panel type creates a stats entry
    Given no panel stats exist
    When panel stats are accumulated for boardroom with turn count 4
    Then the stats contain boardroom with runs 1 and totalDepth 4

  Scenario: Second run for the same panel increments runs and depth
    Given boardroom stats with runs 1 and totalDepth 4
    When panel stats are accumulated for boardroom with turn count 6
    Then the stats contain boardroom with runs 2 and totalDepth 10

  Scenario: Different panels accumulate independently
    Given no panel stats exist
    When panel stats are accumulated for boardroom with turn count 4
    And panel stats are accumulated for comedy with turn count 3
    Then the stats contain boardroom with runs 1 and totalDepth 4
    And the stats contain comedy with runs 1 and totalDepth 3

  Scenario: Average depth is computed correctly
    Given boardroom stats with runs 2 and totalDepth 10
    Then the average depth for boardroom is 5.0

  Scenario: Average depth rounds to one decimal place
    Given boardroom stats with runs 3 and totalDepth 10
    Then the average depth for boardroom is 3.3

  Scenario: Average depth for unknown panel is 0
    Given no panel stats exist
    Then the average depth for golf is 0.0

  Scenario: accumulatePanelStats does not mutate the input object
    Given boardroom stats with runs 1 and totalDepth 4
    When panel stats are accumulated for boardroom with turn count 2
    Then the original stats object is unchanged
