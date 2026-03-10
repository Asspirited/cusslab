Feature: Self-Training: panel ratings reach the persistent store
  panelRating() calls HCSession.logTurdRating (session memory) but must also
  write to the self-training persistent store so every panel thumbs-up/down
  counts toward the 5-rating threshold.

  Scenario: panelRating bridges to the self-training persistent store
    Given the training store has 0 ratings
    When panelRating is called with panelType "comedy" and emoji "😂"
    Then the training store has 1 rating
    And the rating has feature "comedy"
    And the rating has score 3

  Scenario: Panel rating increments toward the 5-rating threshold
    Given the training store has 4 ratings
    When panelRating is called with panelType "golf" and emoji "🤣"
    Then the training store has 5 ratings
    And the 5-rating threshold is met

  Scenario: logPanelRating is exported from the Training module
    Then Training.logPanelRating is a function
