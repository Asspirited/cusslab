Feature: The Writing Room — literary authors discuss any topic in sequence
  Three randomly selected authors each respond to a user-submitted topic.
  Each author is aware of what the previous author said.
  All three responses appear on screen together. Re-roll replaces them.

  Scenario: The Writing Room tab is present in the Comedy Room
    Given the Comedy Room is open
    Then a "The Writing Room" tab is visible alongside the other Comedy Room tabs

  Scenario: Submitting a topic triggers three author responses
    Given the user is on The Writing Room tab
    And the user enters "a corporate away day" as the topic
    When the user clicks the Discuss It button
    Then three author responses are displayed
    And each response shows the author's name
    And each response is between 100 and 400 words

  Scenario: Empty topic cannot be submitted
    Given the user is on The Writing Room tab
    And the topic input is empty
    Then the Discuss It button is disabled

  Scenario: Three distinct authors are selected from the pool
    Given the writing room selects authors for a submission
    Then 3 authors are selected from AUTHORS_POOL
    And no author appears more than once in the selection

  Scenario: Re-roll button replaces the current three authors
    Given three author responses are displayed for "a corporate away day"
    When the user clicks the Re-roll button
    Then a new set of three author responses is displayed
    And the Re-roll button is visible after any response is displayed

  Scenario: buildWritingRoomPrompt includes author voice and topic
    Given an author voice for "hemingway"
    And a topic "a corporate away day"
    And no prior author context
    When buildWritingRoomPrompt is called
    Then the writing room prompt includes the author's voiceSignature
    And the writing room prompt includes "a corporate away day"
    And the writing room prompt specifies a word count between 150 and 300 words

  Scenario: buildWritingRoomPrompt includes prior author context when present
    Given an author voice for "pratchett"
    And a topic "a corporate away day"
    And prior context "Hemingway has already said his piece"
    When buildWritingRoomPrompt is called
    Then the writing room prompt includes the prior context
