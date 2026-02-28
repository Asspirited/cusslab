Feature: Cloudflare Worker proxy — routing, settings access, key priority

  Background:
    Given the application is loaded

  Scenario: Settings nav tab is hidden from main navigation
    Then the Settings nav tab should be hidden

  Scenario: Settings panel becomes visible via hash navigation
    When I navigate to "#settings"
    Then the Settings panel should be active

  Scenario: Keyless user sees no no-key error — Worker provides shared connection
    Given no API key is stored
    When I attempt to use the panel
    Then I should not see "No API key"

  Scenario: 403 Forbidden shows permission error not key error
    Given no API key is stored
    When an API call returns status 403
    Then I should see "API key doesn't have permission for this request."

  Scenario: Stored key is sent with API calls
    Given a valid API key is stored
    When I attempt to use the panel
    Then the request should include the stored key

  Scenario: No stored key results in keyless request to Worker
    Given no API key is stored
    When I attempt to use the panel
    Then the request should not include a user key

  Scenario: 400 with credit message shows billing prompt not key error
    Given no API key is stored
    When an API call returns status 400 with message "credit balance is too low"
    Then I should see "Out of API credits — add billing at console.anthropic.com."

  Scenario: 401 with stored key shows key-rejection not generic error
    Given a valid API key is stored
    When an API call returns status 401
    Then I should see "API key rejected — check your key in ⚙️ Settings"

  Scenario: 429 with no stored key shows rate-limit message
    Given no API key is stored
    When an API call returns status 429
    Then I should see "Too many requests — wait a moment and try again"

  Scenario: 500 with no stored key shows server error message
    Given no API key is stored
    When an API call returns status 500
    Then I should see "Anthropic server error — try again shortly"
