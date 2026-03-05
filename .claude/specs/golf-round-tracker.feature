Feature: Golf panel round tracker with Defcon labels

  Background:
    Given the user is on The 19th Hole tab

  Scenario: Round indicator is hidden before first submission
    When the user has not yet submitted a topic
    Then the round indicator div is not visible

  Scenario: Round counter displays on first submission
    When the user submits a topic for the first time in a session
    Then the round indicator shows "ROUND 1 — Sober and Watching"
    And "Round 1 of 5" is injected into each character system prompt

  Scenario: Round label escalates through five Defcon levels
    Given the user has submitted topics in sequence
    Then the labels appear as:
      | Round | Label                          |
      | 1     | Sober and Watching             |
      | 2     | First Drink. Hat Tilting.      |
      | 3     | Properly On It                 |
      | 4     | The Hat Is Now A Statement     |
      | 5     | Wayne. Full Corruption.        |

  Scenario: Round caps at 5
    Given the user has submitted 5 or more topics
    When they submit another topic
    Then the round displayed remains "ROUND 5 — Wayne. Full Corruption."
    And the prompt injection remains "Round 5 of 5"

  Scenario: Round resets on page reload
    Given the user reloads the page
    Then the round indicator is hidden
    And sessionStorage key golf-round is absent or zero
