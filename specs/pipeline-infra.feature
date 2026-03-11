Feature: Pipeline infrastructure — single source of truth

  Scenario: Gherkin runner derives consultant skin tabs from index.html at runtime
    Given the gherkin runner is loaded
    Then the consultant skin tab list is non-empty
    And the tab list includes "golfadventure"
    And the tab list includes "pubcrawl"
    And the tab list includes "boardroom"

  Scenario: Gherkin runner tab list matches the ui-audit source extraction
    Given the gherkin runner is loaded
    Then the consultant tab list matches the tabs in SKIN_CONFIGS in index.html
