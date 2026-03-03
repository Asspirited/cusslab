Feature: Quntum Leeks
  As Sam Beckett (the user)
  I want to leap into a situation and put right what once went wrong
  So that I can leap to the next situation

  Background:
    Given the Quntum Leeks panel is available in the app

  Scenario: Quntum Leeks tab appears in the PLAY nav group
    Given I am on the main page
    Then "Quntum Leeks" should be in the PLAY nav group

  Scenario: Quntum Leeks panel has a scenario selector and leap button
    Given the Quntum Leeks panel is loaded
    Then I can see the qleeks scenario selector
    And I can see the qleeks leap button

  Scenario: Three leap scenarios are offered
    Given the Quntum Leeks panel is loaded
    Then the qleeks selector includes "The Milk Round — 1953, Rural Derbyshire"
    And the qleeks selector includes "The Advisory — 1974, Whitehall, London"
    And the qleeks selector includes "The Retrospective — Present Day, Agile Hell"

  Scenario: Leaping with an empty action shows a warning
    Given I have leapt into a scenario
    And the act input is empty
    When I click ACT
    Then a warning should be shown
    And no qleeks API call should be made

  @claude
  Scenario: First turn generates a mirror moment and Al briefing
    Given I have leapt into a scenario
    Then the thread contains a mirror moment in italics and brackets
    And the thread contains Al's opening briefing with a distraction
    And the thread contains Ziggy's first probability output
    And the mirror moment ends with Oh boy

  @claude
  Scenario: Leap probability updates with each turn
    Given I have leapt in and made a move
    Then Ziggy states a probability to one decimal place
    And the probability bar updates

  @claude
  Scenario: Wrong move drops probability and Al reacts
    Given the current leap probability is established
    When I say something that evades the real issue
    Then Ziggy's probability drops
    And Al reacts with appropriate tone

  @claude
  Scenario: Swiss cheese incident triggers dignity maintenance
    Given the Swiss cheese effect has spiked
    When Sam approaches the object of concern
    Then Ziggy predicts the incident before it occurs
    And scene characters engage dignity maintenance protocol
    And the probability drops by approximately 3.7%

  @claude
  Scenario: Successful leap triggers the conclusion sequence
    Given I have met all three leap conditions
    Then Ziggy announces 100% probability
    And the blue light conclusion appears
    And Al says Way to go Sam

  @claude
  Scenario: Mirror moment only appears on the first turn
    Given I have completed multiple turns
    Then the mirror moment appeared only on turn one

  @claude
  Scenario: The Bourbon biscuit appears in every leap
    Given the leap is in progress
    Then Ziggy references the Bourbon at least once
    And nobody eats the Bourbon
