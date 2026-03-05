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

  Scenario Outline: All verdict types map to correct display label
    Given I am on the Isn't It Ironic tab
    When the irony checker returns verdict "<verdict>" with irony score <score>
    Then the verdict card shows "<label>"

    Examples:
      | verdict              | score | label               |
      | actually_ironic      | 91    | Actually Ironic     |
      | expected_outcome     | 8     | Completely Expected |
      | coincidence          | 45    | Just a Coincidence  |
      | bad_luck             | 22    | Just Bad Luck       |
      | meatloaf_zone        | 67    | The Meatloaf Zone   |
      | pure_alanis          | 55    | Pure Alanis         |

  Scenario: alanis_score above 70 renders with warning styling
    Given I am on the Isn't It Ironic tab
    When the irony checker returns verdict "pure_alanis" with irony score 55 and alanis score 85
    Then the alanis score label renders with warning colour

  Scenario: alanis_score at or below 70 renders with standard styling
    Given I am on the Isn't It Ironic tab
    When the irony checker returns verdict "actually_ironic" with irony score 91 and alanis score 70
    Then the alanis score label renders with standard colour

  Scenario: Unparseable AI response shows an error and does not crash
    Given I am on the Isn't It Ironic tab
    When the irony checker returns an unparseable response
    Then I should see an error message
    And the panel should remain usable

  Scenario: Expert panel shows all three named experts
    Given I am on the Isn't It Ironic tab
    When the irony checker returns verdict "actually_ironic" with irony score 91
    Then I should see a response from "Hicks"
    And I should see a response from "Carlin"
    And I should see a response from "Gervais"

  Scenario: Verdict label is displayed not the raw verdict key
    Given I am on the Isn't It Ironic tab
    When the irony checker returns verdict "expected_outcome" with irony score 8
    Then the verdict card shows "Completely Expected"
    And the verdict card does not show "expected_outcome"
