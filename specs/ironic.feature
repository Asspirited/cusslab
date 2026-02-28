Feature: Isn't It Ironic — panel correctly classifies ironic vs non-ironic statements

  Background:
    Given the application is loaded

  Scenario: Isn't It Ironic tab appears in the nav
    Then I should see "Isn't It Ironic?" in THE PANEL nav group

  Scenario: Submitting an empty input shows a warning and makes no API call
    Given I am on the Isn't It Ironic tab
    When I click "IS IT IRONIC?" with no input
    Then I should see a warning message
    And no API call should be made

  Scenario: Valid input triggers the panel and returns a verdict
    Given I am on the Isn't It Ironic tab
    When I submit "A fire station caught fire"
    Then I should see a verdict card
    And I should see responses from at least one panel expert

  Scenario: Non-ironic statement returns a low irony score
    Given I am on the Isn't It Ironic tab
    When the irony checker returns verdict "expected_outcome" with irony score 8
    Then the verdict card shows "Completely Expected"
    And the irony score bar reflects a low score

  Scenario: Actually ironic statement returns a high irony score
    Given I am on the Isn't It Ironic tab
    When the irony checker returns verdict "actually_ironic" with irony score 91
    Then the verdict card shows "Actually Ironic"
    And the irony score bar reflects a high score
