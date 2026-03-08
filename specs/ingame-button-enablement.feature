@claude
Feature: Mode 2 ingame submit button enablement
  Covers the recurring bug class: callMoment() on Football, Golf, and LongRoom
  routes through discuss() which disables the mode 1 button only.
  The mode 2 button must also be disabled while the API call is in progress
  and re-enabled immediately after, on both success and error paths.

  Background:
    Given the application is loaded

  Scenario Outline: Mode 2 ingame submit button is disabled while API call is in progress
    Given the user has selected the "<panel>" panel
    And the user is in ingame mode
    When the user triggers an ingame moment
    Then the ingame submit button is disabled during the API call
    And the ingame submit button is re-enabled after the call completes

    Examples:
      | panel    |
      | football |
      | golf     |
      | cricket  |

  Scenario Outline: Mode 2 ingame submit button is re-enabled even when API call fails
    Given the user has selected the "<panel>" panel
    And the user is in ingame mode
    When the user triggers an ingame moment
    And the API call returns an error
    Then the ingame submit button is re-enabled

    Examples:
      | panel    |
      | football |
      | golf     |
      | cricket  |

  Scenario: Mode 1 submit button is disabled while mode 1 API call is in progress
    Given the user has selected the "football" panel
    And the user is in qanda mode
    When the user submits a question
    Then the mode 1 submit button is disabled during the API call
    And the mode 1 submit button is re-enabled after the call completes
