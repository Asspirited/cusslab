# Golf Adventure — Module Wiring Characterisation
# Feature: specs/golf-adventure-wiring.feature
# PR: feat/golf-adventure-architecture — Step 4: wire modules into golf-adventure.html
# Purpose: structural gate — confirms modules loaded and duplicate logic removed
# Reference: Feathers — sprout and replace; Beck — refactoring contract (green before, green after)

@golf-adventure-wiring
Feature: Golf Adventure Module Wiring

  golf-adventure.html must load all extracted modules as script tags.
  Duplicate logic removed from inline script — delegated to extracted modules.
  This is the structural gate confirming wiring before live-site verification.

  Background:
    Given golf-adventure.html is parsed as text

  ---

  ## Script tags

  @wiring-scripts
  Scenario: golf-adventure.html loads all extracted data modules
    Then it has a script tag for "golf-data/characters.js"
    And it has a script tag for "golf-data/tournaments.js"
    And it has a script tag for "golf-data/events.js"
    And it has a script tag for "golf-data/shots.js"

  @wiring-scripts
  Scenario: golf-adventure.html loads the game engine module
    Then it has a script tag for "golf-engine/game-engine.js"

  @wiring-scripts
  Scenario: golf-adventure.html loads the commentary service module
    Then it has a script tag for "golf-service/commentary-service.js"

  ---

  ## Duplicate logic removed

  @wiring-logic
  Scenario: golf-adventure.html does not contain duplicate processRoll threshold logic
    Then the inline script does not contain "shot.thresh + pen"

  @wiring-logic
  Scenario: golf-adventure.html does not contain duplicate buildShotPrompt logic
    Then the inline script does not contain "You are generating live TV golf commentary"
