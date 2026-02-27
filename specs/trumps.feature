Feature: Trumps — battle a profane phrase against the AI

  The Profani-Trumps panel pits a phrase against an AI-generated challenger.
  The player phrase is optional — leaving it empty auto-generates both sides.
  The winner is determined by the selected battle dimension.

  Background:
    Given the app is loaded
    And a valid API key is saved
    And the Trumps panel is open

  Scenario: Player phrase battles the AI and a winner is declared
    Given I type "bloody nora" into the player phrase input
    And I select "Overall" as the battle dimension
    When I click CHALLENGE!
    Then the player phrase "bloody nora" is shown
    And an AI challenger phrase is shown
    And a winner verdict is displayed

  Scenario: Empty player phrase results in both phrases being auto-generated
    Given the player phrase input is empty
    And I select "Overall" as the battle dimension
    When I click CHALLENGE!
    Then two phrases are shown
    And a winner verdict is displayed

  Scenario: A draw shows the honourable outcome message
    Given I type "bloody nora" into the player phrase input
    And I select "Overall" as the battle dimension
    And the API will return a draw result
    When I click CHALLENGE!
    Then I see "🤝 A DRAW — THE ONLY HONOURABLE OUTCOME"
