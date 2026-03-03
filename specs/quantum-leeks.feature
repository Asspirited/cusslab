Feature: Quntum Leeks
  As Sam Beckett (the user)
  I want to leap into a situation and put right what once went wrong
  So that I can leap to the next situation

  Background:
    Given the Quntum Leeks panel is available in the app
    And Al is present as a hologram only Sam can see
    And Ziggy is communicating via Al's handlink
    And the Swiss cheese effect is active

  Scenario: Quntum Leeks tab appears in the PLAY nav group
    Given I am on the main page
    Then the nav group "PLAY" contains a tab labelled "Quntum Leeks"

  Scenario: Quntum Leeks panel renders when tab is selected
    When I click the "Quntum Leeks" tab
    Then the panel with id "panel-qleeks" becomes active
    And I see a scenario selector with three options
    And I see a LEAP IN button

  Scenario: Three leap scenarios are available
    When I open the scenario selector
    Then I can select "The Milk Round — 1953, Rural Derbyshire"
    And I can select "The Advisory — 1974, Whitehall, London"
    And I can select "The Retrospective — Present Day, Agile Hell"

  Scenario: Leaping in generates a mirror moment and Al briefing
    Given I have selected a scenario
    When I click LEAP IN
    Then the leap probability bar appears
    And the thread contains a mirror moment in italics and brackets
    And the thread contains Al's opening briefing
    And the thread contains Ziggy's first output via handlink
    And an "Oh boy." appears in the mirror moment

  Scenario: Leap probability updates with each turn
    Given I have leapt in and the scene is active
    When I make a move as Sam
    Then the leap probability updates
    And Ziggy's output includes the new probability to one decimal place

  Scenario: Making a correct move raises probability
    Given the current leap probability is below 80%
    When I ask the right question of the right character
    Then Ziggy's probability reading rises
    And Al hints I am getting closer

  Scenario: Making a wrong move drops probability
    Given the current leap probability is above 30%
    When I say something that evades the real issue
    Then Ziggy's probability reading drops
    And Al winces in some fashion

  Scenario: Swiss cheese incident triggers dignity maintenance
    Given the Swiss cheese effect has spiked
    When I approach the object of concern for this leap
    Then Ziggy predicts the incident before it occurs
    And Al watches with appropriate expression
    And scene characters engage dignity maintenance protocol
    And leap probability drops by approximately 3.7%
    And Ziggy notes she predicted it

  Scenario: Al gets distracted mid-briefing
    Given Al is delivering his briefing
    Then Al gets distracted by someone in the scene
    And Sam has to recall him to the topic

  Scenario: Ziggy produces a completely irrelevant fact
    Given Al is reading from the handlink mid-crisis
    Then Ziggy's output includes at least one fact unrelated to the leap
    And Al reads it out anyway
    And the Bourbon biscuit is somewhere in the scene

  Scenario: Successful leap triggers conclusion
    Given I have met all three leap conditions for this scenario
    When the leap conditions are satisfied
    Then Ziggy announces 100% probability
    And Al says "Way to go, Sam"
    And the blue light conclusion appears
    And the reply area is hidden

  Scenario: Empty action field shows warning
    Given I have leapt in and the reply area is visible
    When I click ACT without entering anything
    Then a warning toast appears
    And no API call is made

  @claude
  Scenario: Al's five ex-wives are referenced at least once per two turns
    Given the leap is in progress
    Then across multiple turns Al references at least one ex-wife as wisdom or cautionary tale
    And the ex-wife's name and the lesson are specific

  @claude
  Scenario: Ziggy character assessments are devastating and delivered as data
    Given a scene character is being assessed
    Then Ziggy's assessment is a specific probability and a specific verdict
    And Al pauses before reading it
    And Al reads it anyway

  @claude
  Scenario: Al's hologram physics failures occur naturally
    Given Al is present and talking
    Then across multiple turns Al forgets he is a hologram at least once
    And he reaches through something or adjusts when passing through furniture
    And Sam notices

  @claude
  Scenario: The Retrospective scenario references Conway's Law
    Given I have selected The Retrospective scenario
    When the scene involves the broken team structure
    Then Al or Ziggy references Conway's Law
    And the connection to the org structure is made explicit

  @claude
  Scenario: Leap probability never reaches 100 until all conditions are met
    Given the leap is in progress and not all conditions have been met
    Then Ziggy's probability stays below 100%
    And the leaped flag is false

  @claude
  Scenario: Mirror moment appears only on the first turn
    Given I leap into a scenario
    Then the mirror moment appears in the first turn's output
    And subsequent turns do not contain a mirror moment
