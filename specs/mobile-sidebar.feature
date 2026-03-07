@claude
Feature: Mobile sidebar navigation
  On small screens the sidebar is hidden behind a hamburger button
  Tapping the button opens a full-height drawer from the left
  Nav groups inside the drawer behave as an accordion — one open at a time
  Selecting a tab closes the drawer and navigates to the panel
  On desktop the sidebar is always visible and the hamburger is hidden

  Background:
    Given the application is loaded

  Scenario: Hamburger button is visible on mobile and hidden on desktop
    Given the viewport width is 768px or less
    Then the hamburger button is visible in the header
    And the sidebar drawer is not visible by default

  Scenario: Desktop sidebar is always visible
    Given the viewport width is greater than 768px
    Then the hamburger button is not visible in the header
    And the sidebar is visible without interaction

  Scenario: Tapping the hamburger button opens the drawer
    Given the viewport width is 768px or less
    When the user taps the hamburger button
    Then the sidebar drawer slides into view from the left
    And a backdrop overlay appears behind the drawer

  Scenario: Tapping the backdrop closes the drawer
    Given the viewport width is 768px or less
    And the sidebar drawer is open
    When the user taps the backdrop overlay
    Then the sidebar drawer is hidden
    And the backdrop is no longer visible

  Scenario: The active nav group is expanded when the drawer opens
    Given the viewport width is 768px or less
    And the user is on the "darts" panel
    When the user taps the hamburger button
    Then the "sports" nav group is expanded
    And all other nav groups are collapsed

  Scenario: Tapping a nav group header expands it and collapses others
    Given the viewport width is 768px or less
    And the sidebar drawer is open
    And the "comedy" nav group is expanded
    When the user taps the "sports" nav group header
    Then the "sports" nav group is expanded
    And the "comedy" nav group is collapsed

  Scenario: Only one nav group is open at any time
    Given the viewport width is 768px or less
    And the sidebar drawer is open
    When the user taps the "play" nav group header
    And the user taps the "boardroom" nav group header
    Then the "boardroom" nav group is expanded
    And the "play" nav group is collapsed
    And no other nav groups are expanded

  Scenario: Tapping an already open group header collapses it
    Given the viewport width is 768px or less
    And the sidebar drawer is open
    And the "sports" nav group is expanded
    When the user taps the "sports" nav group header
    Then the "sports" nav group is collapsed
    And no nav groups are expanded

  Scenario: Selecting a tab closes the drawer and navigates
    Given the viewport width is 768px or less
    And the sidebar drawer is open
    When the user selects the "football" tab from the drawer
    Then the sidebar drawer is hidden
    And the "football" panel is active

  Scenario: Drawer closes on any tab selection regardless of group
    Given the viewport width is 768px or less
    And the sidebar drawer is open
    And the "play" nav group is expanded
    When the user selects the "roastbattle" tab from the drawer
    Then the sidebar drawer is hidden
    And the "roastbattle" panel is active

  Scenario: Drawer can be reopened after closing
    Given the viewport width is 768px or less
    And the sidebar drawer has been opened and closed
    When the user taps the hamburger button
    Then the sidebar drawer slides into view from the left

  Scenario: Body scroll is locked while drawer is open
    Given the viewport width is 768px or less
    And the sidebar drawer is open
    Then the body overflow is set to hidden

  Scenario: Body scroll is restored when drawer closes
    Given the viewport width is 768px or less
    And the sidebar drawer has been opened and closed
    Then the body overflow is restored to its default
