Feature: Nav Group Landing Page
  As a user of Heckler and Cox
  I want to see a panel selection page when I click a nav group
  So that I can choose which sub-feature to enter rather than landing in the first one

  Background:
    Given the application is loaded

  # ── GROUP LANDING BEHAVIOUR ───────────────────────────────────────────────

  Scenario: Clicking a nav group shows the group landing page
    When the user clicks a nav group header
    Then the group landing page is visible
    And no panel content is shown

  Scenario: Landing page shows one tile per panel in the group
    Given the user has clicked the "sports" nav group
    Then the landing page shows a tile for each panel in the group

  Scenario: Clicking a panel tile enters that panel
    Given the group landing page is visible for "sports"
    When the user clicks the "Post Game Cunditry" tile
    Then the Football panel content is shown
    And the group landing page is hidden

  Scenario: All nav groups show a landing page
    Then clicking "sports" shows a landing page
    And clicking "comedy" shows a landing page
    And clicking "boardroom" shows a landing page
    And clicking "misadventure" shows a landing page

  # ── PANEL TILES ───────────────────────────────────────────────────────────

  Scenario: Sports landing shows all 5 sport panels
    Given the user has clicked the "sports" nav group
    Then the landing page includes a tile for "Post Game Cunditry"
    And the landing page includes a tile for "The 19th Hole"
    And the landing page includes a tile for "Watching the Oche"
    And the landing page includes a tile for "The Long Room"
    And the landing page includes a tile for "The Final Furlong"

  Scenario: Comedy landing shows all 4 comedy panels
    Given the user has clicked the "comedy" nav group
    Then the landing page includes a tile for "Into The Room"
    And the landing page includes a tile for "House Name Oracle"
    And the landing page includes a tile for "The Roast Room"
    And the landing page includes a tile for "The Writing Room"

  # ── BACK NAVIGATION ───────────────────────────────────────────────────────

  Scenario: Back button from panel returns to group landing
    Given the user is in a panel within the "sports" group
    When the user clicks the back button
    Then the group landing page is visible for "sports"
    And no panel content is shown

  # ── DESKTOP BEHAVIOUR ─────────────────────────────────────────────────────

  Scenario: toggleNavGroup fires on desktop as well as mobile
    Given the viewport is desktop width
    When the user clicks a nav group header
    Then the group landing page is shown
