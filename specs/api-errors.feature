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

  Scenario: Out of API credits shows billing message not key error
    Given no API key is stored
    And I am on the Ask The Panel tab
    When an API call returns status 400 with message "credit balance is too low"
    Then I should see "Out of API credits — add billing at console.anthropic.com."

  Scenario: 429 Too Many Requests shows rate-limit message
    Given I am on the Ask The Panel tab
    When an API call returns status 429
    Then I should see "Too many requests — wait a moment and try again"

  Scenario: 500 Server Error shows retry message
    Given I am on the Ask The Panel tab
    When an API call returns status 500
    Then I should see "Anthropic server error — try again shortly"

  Scenario: App responds without a saved API key using shared connection
    Given no API key is stored
    And I am on the Ask The Panel tab
    When I attempt to use the panel
    Then I should not see "No API key"

  Scenario: User with own key uses it instead of shared connection
    Given a valid API key is stored
    And I am on the Ask The Panel tab
    When an API call returns status 401
    Then I should see "API key rejected — check your key in ⚙️ Settings"

  @claude
  Scenario: Hung fetch times out after 30 seconds and shows error message
    Given I am on the Ask The Panel tab
    When a fetch request never resolves within 30 seconds
    Then I should see "Request timed out — please try again."
    And the panel placeholder is replaced with the timeout message
    And the panel does not hang indefinitely

  @claude
  Scenario: Darts panel continues to next character when one fetch times out
    Given I am on the darts panel
    And the first character's fetch times out
    When the timeout error is caught
    Then the first character's placeholder shows "Request timed out — please try again."
    And the panel does not hang indefinitely
