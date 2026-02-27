Feature: Quiz — test your profanity knowledge

  The Profani-Quiz presents 5 questions with 4 answer options each.
  Progress is shown as "Question N of 5".
  Correct answers are highlighted in green. Wrong answers reveal the correct answer in green.
  After all 5 questions a results screen appears with a sarcastic score message.
  PLAY AGAIN resets all state.

  Background:
    Given the app is loaded
    And the Quiz panel is open

  Scenario: Quiz starts at Question 1 of 5
    Then I see "Question 1 of 5"

  Scenario: Selecting the correct answer highlights it in green
    When I select the correct answer for question 1
    Then the correct answer is highlighted in green

  Scenario: Selecting a wrong answer reveals the correct answer in green
    When I select a wrong answer for question 1
    Then the correct answer is shown in green

  Scenario: Answering all 5 questions shows the results screen
    Given I have answered all 5 questions
    Then the results screen is shown
    And I see a score message

  Scenario: PLAY AGAIN resets back to the beginning
    Given I have completed the quiz
    When I click PLAY AGAIN
    Then I see "Question 1 of 5"
