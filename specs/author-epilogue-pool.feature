Feature: Author Epilogue — pool mechanics
  Random author selection, re-roll, no-repeat until pool exhausted.
  Skeleton graduates from hardcoded Hemingway to pool-based selection.

  Scenario: AUTHORS_POOL contains hemingway and mccarthy
    When the author pool is loaded
    Then the pool contains the "hemingway" author
    And the pool contains the "mccarthy" author

  Scenario: shufflePool returns all pool elements
    Given a pool ["hemingway", "mccarthy", "tolkien"]
    When shufflePool is called on the pool
    Then the result contains 3 authors
    And the result contains all authors from the original pool

  Scenario Outline: selectNextAuthorFromQueue returns the correct result
    Given an author queue <queue>
    When selectNextAuthorFromQueue is called
    Then the result is <result>

    Examples:
      | queue                    | result   |
      | ["mccarthy","hemingway"] | mccarthy |
      | []                       | null     |

  Scenario: Another Author button is visible after an epilogue is displayed
    Given an epilogue has been displayed
    Then an "Another Author 🎲" button is visible

  Scenario: Clicking Another Author picks the next author from the queue
    Given an author queue ["mccarthy", "hemingway"]
    And the current author was "hemingway"
    When the user clicks the Another Author button
    Then the selected author is "mccarthy"

  Scenario: Queue resets when all pool authors have been used
    Given all pool authors have been used
    When the next author is requested
    Then the queue is rebuilt from the full pool
