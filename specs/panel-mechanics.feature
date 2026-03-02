Feature: Panel mechanics — Boardroom, Comedy Room, Football, Golf

  Background:
    Given the application is loaded

  # ── Nav registration ──────────────────────────────────────────────────────

  Scenario: Boardroom panel is registered in the BOARDROOM nav group
    Then "Present to the Boardroom" should be in the BOARDROOM nav group

  Scenario: Comedy Room panel is registered in the COMEDY ROOM nav group
    Then "The Comedy Room" should be in the COMEDY ROOM nav group

  Scenario: Football panel is registered in the 19TH HOLE nav group
    Then "The Pub After The Match" should be in the 19TH HOLE nav group

  Scenario: Golf panel is registered in the 19TH HOLE nav group
    Then "The 19th Hole" should be in the 19TH HOLE nav group

  # ── Empty input guards ────────────────────────────────────────────────────

  Scenario: Boardroom empty input shows warning and makes no API call
    Given I am on the Boardroom tab
    When I submit empty input to the boardroom panel
    Then a warning should be shown
    And no API call should be made

  Scenario: Comedy Room empty input shows warning and makes no API call
    Given I am on the Comedy Room tab
    When I submit empty input to the comedy room panel
    Then a warning should be shown
    And no API call should be made

  Scenario: Football empty input shows warning and makes no API call
    Given I am on the Football tab
    When I submit empty input to the football panel
    Then a warning should be shown
    And no API call should be made

  Scenario: Golf empty input shows warning and makes no API call
    Given I am on the Golf tab
    When I submit empty input to the golf panel
    Then a warning should be shown
    And no API call should be made

  # ── Valid input fires the correct number of API calls ─────────────────────

  Scenario: Boardroom valid input fires 6 member responses
    Given I am on the Boardroom tab
    When I submit "Leverage our learnings going forward" to the boardroom panel
    Then API calls should be made
    And 6 panel members should respond

  Scenario: Comedy Room valid input fires 8 member responses
    Given I am on the Comedy Room tab
    When I submit "Everything happens for a reason" to the comedy room panel
    Then API calls should be made
    And 8 panel members should respond

  Scenario: Football valid input fires 4 member responses
    Given I am on the Football tab
    When I submit "Was that a red card?" to the football panel
    Then API calls should be made
    And 4 panel members should respond

  Scenario: Golf valid input fires 8 member responses
    Given I am on the Golf tab
    When I submit "Can he win from here?" to the golf panel
    Then API calls should be made
    And 8 panel members should respond

  # ── Round selectors ───────────────────────────────────────────────────────

  Scenario: Comedy Room panel has a round selector with 10 rounds
    Given I am on the Comedy Room tab
    Then the comedy room round selector offers 10 rounds

  # ── Boardroom interactive discussion ──────────────────────────────────────

  Scenario: Boardroom reply input appears after initial presentation
    Given I am on the Boardroom tab
    When I submit "Leverage our learnings going forward" to the boardroom panel
    And the panel has responded
    Then the reply input area is visible
    And the reply textarea is present
    And the reply button is present
    And the reset button is present

  Scenario: Boardroom reply input is hidden before first presentation
    Given I am on the Boardroom tab
    And no presentation has been submitted
    Then the reply input area is not visible

  Scenario: Boardroom reset clears the thread and hides the reply area
    Given I am on the Boardroom tab
    And the board has responded to a presentation
    When I click the reset button
    Then the conversation thread is cleared
    And the reply input area is hidden
    And the presentation input is cleared
