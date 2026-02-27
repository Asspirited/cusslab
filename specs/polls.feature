Feature: Polls — vote on a profanity poll

  Profani-Polls loads a question with 4 answer options when the panel opens.
  Voting reveals percentage bars. A vote cannot be changed once cast.
  Next Poll loads a fresh question.

  Background:
    Given the app is loaded
    And the Polls panel is open

  Scenario: A poll question with 4 answer options loads on panel open
    Then a poll question is shown
    And 4 answer options are shown

  Scenario: Voting on an answer reveals percentage bars
    When I click the first answer option
    Then percentage bars are shown for all 4 options

  Scenario: A cast vote cannot be changed
    Given I have voted for the first answer option
    When I click the second answer option
    Then the first answer option is still marked as voted

  Scenario: Next Poll loads a new question
    Given I have voted for the first answer option
    When I click Next Poll
    Then a new poll question is shown
