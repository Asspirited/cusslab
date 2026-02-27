Feature: Leaderboard — see all-time and today's quiz scores

  The Leaderboard shows quiz scores in descending order.
  Top 3 scores get medal icons. Perfect scores (5/5) are highlighted in gold.
  Today view filters to today's scores only.
  An empty leaderboard shows a helpful message.

  Background:
    Given the app is loaded
    And the Leaderboard panel is open

  Scenario: All-Time view shows entries sorted by score with medals on the top 3
    Given the leaderboard has scores of 5, 3, and 1
    Then the entries are shown in order: 5, 3, 1
    And the top entry shows 🥇
    And the second entry shows 🥈
    And the third entry shows 🥉

  Scenario: A perfect score of 5 is highlighted in gold
    Given the leaderboard has a score of 5
    Then the score of 5 is highlighted in gold

  Scenario: Today view shows only today's scores
    Given the leaderboard has a score from today and a score from yesterday
    When I click the Today tab
    Then I see the score from today
    And I do not see the score from yesterday

  Scenario: Empty leaderboard shows a helpful message
    Given no scores have been recorded
    Then I see a helpful message

  Scenario: Completing a quiz adds the score to the leaderboard
    Given I have completed the quiz with a score of 4 out of 5
    When I navigate to the Leaderboard panel
    Then I see a score of 4 in the leaderboard
