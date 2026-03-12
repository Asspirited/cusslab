Feature: Phil's-opoly — Comedy Room Philosophy Panel — BL-121

  Background:
    Given the application is loaded

  Scenario: Phil's-opoly is a registered Comedy Room panel
    Then "philsopoly" is in the consultant skin tabs
    And "philsopoly" is registered in the nav group map

  Scenario: Panel shows the full available character roster
    Given the Phil's-opoly panel is visible
    Then I see a character selection area
    And the roster includes "Phil Tufnell"
    And the roster includes "Diogenes"
    And the roster includes "Shane MacGowan"
    And the roster includes "Mike Skinner"
    And the roster includes "Nostradamus"
    And the roster includes "Bertrand Russell"

  Scenario: User must select between 2 and 5 characters
    Given the Phil's-opoly panel is visible
    When the user selects 4 Phil's-opoly characters
    Then the Phil's-opoly character selection is valid

  Scenario: Submit is blocked with fewer than 2 characters selected
    Given the Phil's-opoly panel is visible
    When the user selects 1 Phil's-opoly character
    Then the Phil's-opoly submit button remains disabled

  Scenario: Submit is blocked with more than 5 characters selected
    Given the Phil's-opoly panel is visible
    When the user selects 6 Phil's-opoly characters
    Then the 6th Phil's-opoly selection is rejected

  Scenario: Panel shows suggestion cards
    Given the Phil's-opoly panel is visible
    Then I see at least 3 Phil's-opoly suggestion cards
    And each Phil's-opoly suggestion card has a topic label

  Scenario: Submit button is disabled until topic is entered
    Given the Phil's-opoly panel is visible
    And 4 Phil's-opoly characters are selected
    Then the Phil's-opoly submit button is disabled
    When the user enters a topic in the Phil's-opoly text field
    Then the Phil's-opoly submit button is enabled

  Scenario: Clicking a suggestion card populates the text field
    Given the Phil's-opoly panel is visible
    When the user clicks a Phil's-opoly suggestion card
    Then the Phil's-opoly text field is populated

  Scenario: Submitting makes one API call per selected character
    Given the Phil's-opoly panel is visible
    And the user has selected 4 Phil's-opoly characters
    And the user has entered a Phil's-opoly topic
    When the user submits the Phil's-opoly topic
    Then 4 Phil's-opoly API calls are made
    And the Phil's-opoly response area becomes visible
