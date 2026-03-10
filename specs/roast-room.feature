Feature: The Roast Room — literary authors roast any title
  Five randomly selected authors each write a short roast of a user-submitted title.
  All five appear on screen together. Re-roll replaces them with a different five.

  Scenario: The Roast Room tab is present in the Comedy Room
    Given the Comedy Room is open
    Then a "The Roast Room" tab is visible alongside the other Comedy Room tabs

  Scenario: Submitting a title triggers five author roasts
    Given the user is on The Roast Room tab
    And the user enters "Hello magazine" as the title
    When the user clicks the Roast It button
    Then five author responses are displayed
    And each response shows the author's name
    And each response is between 50 and 200 words

  Scenario: Empty title cannot be submitted
    Given the user is on The Roast Room tab
    And the title input is empty
    Then the Roast It button is disabled

  Scenario: Five distinct authors are selected from the pool
    Given the roast room selects authors for a submission
    Then 5 authors are selected from AUTHORS_POOL
    And no author appears more than once in the selection

  Scenario: Re-roll button replaces the current five authors
    Given five author roasts are displayed for "Hello magazine"
    When the user clicks the Re-roll button
    Then a new set of five author roasts is displayed
    And the Re-roll button is visible after any roast is displayed

  Scenario: buildRoastPrompt includes author voice and title
    Given an author voice for "hemingway"
    And a title "Hello magazine"
    When buildRoastPrompt is called
    Then the prompt includes the author's voiceSignature
    And the prompt includes "Hello magazine"
    And the prompt instructs the author not to admit ignorance of the title
    And the prompt specifies a word count ceiling of 150 words

  Scenario: selectRoastAuthors returns the requested count without repeats
    Given AUTHORS_POOL has at least 5 entries
    When selectRoastAuthors is called with count 5
    Then 5 authors are returned
    And all returned authors are distinct
    And all returned authors exist in AUTHORS_POOL
