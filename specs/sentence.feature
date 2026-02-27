Feature: Sentence Builder — build a personalised profane sentence

  The Profani-Sentence Builder creates a sentence from personal details and a theme.
  Profession is required. All other fields are optional but contribute to the output.
  Only one theme chip can be selected at a time.

  Background:
    Given the app is loaded
    And a valid API key is saved
    And the Sentence Builder panel is open

  Scenario: Building a sentence with profession and optional fields shows an output
    Given I type "accountant" into the profession input
    And I type "Leeds" into the location input
    And I select "Boss insult" as the theme
    When I click BUILD IT
    Then a built sentence is displayed

  Scenario: Missing profession shows a validation error
    Given the profession input is empty
    And I select "Monday morning" as the theme
    When I click BUILD IT
    Then I see a validation error

  Scenario: Selecting a second theme chip deselects the first
    Given I select "Self-deprecating" as the theme
    When I select "Existential dread" as the theme
    Then the "Existential dread" theme chip is selected
    And the "Self-deprecating" theme chip is not selected
