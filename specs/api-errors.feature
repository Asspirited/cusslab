Feature: API error messages — user sees specific, actionable feedback

  Background:
    Given the application is loaded
    And a valid API key is stored

  Scenario: 401 Unauthorized shows key-rejection message
    Given I am on the Ask The Panel tab
    When an API call returns status 401
    Then I should see "API key rejected — check your key in ⚙️ Settings"

  Scenario: 400 Bad Request shows invalid-key message
    Given I am on the Ask The Panel tab
    When an API call returns status 400
    Then I should see "Bad request — your API key may be invalid. Check ⚙️ Settings"

  Scenario: 429 Too Many Requests shows rate-limit message
    Given I am on the Ask The Panel tab
    When an API call returns status 429
    Then I should see "Too many requests — wait a moment and try again"

  Scenario: 500 Server Error shows retry message
    Given I am on the Ask The Panel tab
    When an API call returns status 500
    Then I should see "Anthropic server error — try again shortly"

  Scenario: No API key shows setup prompt
    Given no API key is stored
    And I am on the Ask The Panel tab
    When I attempt to use the panel
    Then I should see "No API key — go to ⚙️ Settings to add one"
