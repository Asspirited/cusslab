Feature: Sports panel suggestion cards
  As a user of a sports panel Q&A mode
  I want to see suggestion cards above the textarea
  So that I have prompts to get started without a blank page

  # ── FOOTBALL ──────────────────────────────────────────────────

  Scenario: Football Q&A mode shows suggestion cards on load
    Given the Football panel is in qanda mode
    Then the football suggestion tray is visible
    And the football suggestion tray contains at least 10 cards
    And at least one football suggestion card has category "match"
    And at least one football suggestion card has category "big"
    And at least one football suggestion card has category "contemporary"
    And at least one football suggestion card has category "absurd"

  Scenario: Clicking a football suggestion card fills the football textarea
    Given the Football panel is in qanda mode
    When the user clicks a football suggestion card
    Then the football textarea contains the card text

  # ── DARTS ─────────────────────────────────────────────────────

  Scenario: Darts Q&A mode shows suggestion cards on load
    Given the Darts panel is in qanda mode
    Then the darts suggestion tray is visible
    And the darts suggestion tray contains at least 10 cards
    And at least one darts suggestion card has category "darts"
    And at least one darts suggestion card has category "big"
    And at least one darts suggestion card has category "contemporary"
    And at least one darts suggestion card has category "absurd"

  Scenario: Clicking a darts suggestion card fills the darts textarea
    Given the Darts panel is in qanda mode
    When the user clicks a darts suggestion card
    Then the darts textarea contains the card text

  # ── LONG ROOM ─────────────────────────────────────────────────

  Scenario: Long Room Q&A mode shows suggestion cards on load
    Given the Long Room panel is in qanda mode
    Then the long room suggestion tray is visible
    And the long room suggestion tray contains at least 10 cards
    And at least one long room suggestion card has category "cricket"
    And at least one long room suggestion card has category "big"
    And at least one long room suggestion card has category "contemporary"
    And at least one long room suggestion card has category "absurd"

  Scenario: Clicking a long room suggestion card fills the long room textarea
    Given the Long Room panel is in qanda mode
    When the user clicks a long room suggestion card
    Then the long room textarea contains the card text

  # ── SHARED MECHANIC ───────────────────────────────────────────

  Scenario: Suggestion cards are shuffled — order differs from pool order
    Given the Football panel is in qanda mode
    Then the football suggestion tray contains at least 10 cards
    And the football suggestion cards are not in fixed pool order
