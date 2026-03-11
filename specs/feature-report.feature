Feature: Feature activity report script

  Scenario: script exists and is executable
    Given the repo is checked out
    When I check for ".claude/scripts/feature-report.sh"
    Then the file exists and is executable

  Scenario: script exits 0 and produces output when run against real files
    Given the repo is checked out
    When I run the feature report
    Then the exit code is 0
    And the output contains "Feature Activity Report"
    And the output contains "ALL TIME"
    And the output contains "LATEST SESSION"

  Scenario: script output includes at least one known feature label
    Given the repo is checked out
    When I run the feature report
    Then the output contains "golf-adventure"

  Scenario: unlabelled items are reported separately
    Given the repo is checked out
    When I run the feature report
    Then the output contains "unlabelled"
