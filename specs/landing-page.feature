Feature: Feature Discovery Landing Page — BL-117
  Replace Golf Adventure as the default panel with a landing page
  that showcases all feature groups so first-time users understand what is available.

  Background:
    Given the application is loaded

  Scenario: App opens on the landing page, not Golf Adventure
    Given a user opens the app
    Then the landing page panel is visible
    And the Golf Adventure panel is not the default on load

  Scenario: Landing page shows one tile per feature group
    Given the landing page is visible
    Then I see a tile for "Little Misadventure"
    And I see a tile for "The Boardroom"
    And I see a tile for "The Comedy Room"
    And I see a tile for "Sports"
    And I see a tile for "Play & Learn"

  Scenario: Each tile shows a name and description
    Given the landing page is visible
    Then each tile has a name
    And each tile has a description

  Scenario: Clicking a tile navigates to that group's panel
    Given the landing page is visible
    When I click the "The Boardroom" tile
    Then the Boardroom panel is visible
    And the landing page is no longer visible

  Scenario: Clicking Little Misadventure tile navigates to Golf Adventure
    Given the landing page is visible
    When I click the "Little Misadventure" tile
    Then the Golf Adventure panel is visible

  Scenario: Clicking Sports tile navigates to Football panel
    Given the landing page is visible
    When I click the "Sports" tile
    Then the Football panel is visible
