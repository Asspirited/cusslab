Feature: App shell — navigation and panel registration

  The app loads with all 10 panels registered and navigable from the sidebar.
  Exactly one panel is visible at a time.
  Clicking a nav item switches to that panel.

  Background:
    Given the app is loaded

  Scenario: App loads and shows the Localiser panel by default
    Then the Localiser panel is visible
    And 10 nav items are shown in the sidebar

  Scenario: Clicking a nav item shows that panel and hides the previous one
    When I click the Generator nav item
    Then the Generator panel is visible
    And the Localiser panel is not visible

  Scenario: The clicked nav item is highlighted as active
    When I click the Generator nav item
    Then the Generator nav item is highlighted as active
    And the Localiser nav item is not highlighted

  Scenario Outline: Every panel is reachable by its nav item
    When I click the <panel> nav item
    Then the <panel> panel is visible

    Examples:
      | panel            |
      | Localiser        |
      | Generator        |
      | Historian        |
      | Trumps           |
      | IT Consultant    |
      | Sentence Builder |
      | Polls            |
      | Quiz             |
      | Leaderboard      |
      | Settings         |
