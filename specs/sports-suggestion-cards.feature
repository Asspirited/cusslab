Feature: Sports panel suggestion cards
  As a user of a sports panel Q&A mode
  I want to see suggestion cards above the textarea
  So that I have prompts to get started without a blank page

  # ── FOOTBALL ──────────────────────────────────────────────────

  Scenario: Football Q&A mode shows exactly 5 suggestion cards on load
    Given the Football panel is in qanda mode
    Then the football suggestion tray is visible
    And the football suggestion tray shows exactly 5 cards
    And the football pool includes at least one card with category "match"
    And the football pool includes at least one card with category "big"
    And the football pool includes at least one card with category "contemporary"
    And the football pool includes at least one card with category "absurd"

  Scenario: A refresh button is visible below the football suggestion tray
    Given the Football panel is in qanda mode
    Then a refresh button exists for the football panel

  Scenario: Clicking football refresh shows a new set of 5 cards from the pool
    Given the Football panel is in qanda mode
    When the football refresh button is clicked
    Then the football suggestion tray shows exactly 5 cards

  Scenario: Clicking a football suggestion card fills the football textarea
    Given the Football panel is in qanda mode
    When the user clicks a football suggestion card
    Then the football textarea contains the card text

  # ── DARTS ─────────────────────────────────────────────────────

  Scenario: Darts Q&A mode shows exactly 5 suggestion cards on load
    Given the Darts panel is in qanda mode
    Then the darts suggestion tray is visible
    And the darts suggestion tray shows exactly 5 cards
    And the darts pool includes at least one card with category "darts"
    And the darts pool includes at least one card with category "big"
    And the darts pool includes at least one card with category "contemporary"
    And the darts pool includes at least one card with category "absurd"

  Scenario: A refresh button is visible below the darts suggestion tray
    Given the Darts panel is in qanda mode
    Then a refresh button exists for the darts panel

  Scenario: Clicking darts refresh shows a new set of 5 cards from the pool
    Given the Darts panel is in qanda mode
    When the darts refresh button is clicked
    Then the darts suggestion tray shows exactly 5 cards

  Scenario: Clicking a darts suggestion card fills the darts textarea
    Given the Darts panel is in qanda mode
    When the user clicks a darts suggestion card
    Then the darts textarea contains the card text

  # ── LONG ROOM ─────────────────────────────────────────────────

  Scenario: Long Room Q&A mode shows exactly 5 suggestion cards on load
    Given the Long Room panel is in qanda mode
    Then the long room suggestion tray is visible
    And the long room suggestion tray shows exactly 5 cards
    And the long room pool includes at least one card with category "cricket"
    And the long room pool includes at least one card with category "big"
    And the long room pool includes at least one card with category "contemporary"
    And the long room pool includes at least one card with category "absurd"

  Scenario: A refresh button is visible below the long room suggestion tray
    Given the Long Room panel is in qanda mode
    Then a refresh button exists for the long room panel

  Scenario: Clicking long room refresh shows a new set of 5 cards from the pool
    Given the Long Room panel is in qanda mode
    When the long room refresh button is clicked
    Then the long room suggestion tray shows exactly 5 cards

  Scenario: Clicking a long room suggestion card fills the long room textarea
    Given the Long Room panel is in qanda mode
    When the user clicks a long room suggestion card
    Then the long room textarea contains the card text

  # ── HORSE RACING ──────────────────────────────────────────────

  Scenario: Horse Racing Q&A mode shows exactly 5 suggestion cards on load
    Given the racing panel is in qanda mode
    Then the racing suggestion tray is visible
    And the racing suggestion tray shows exactly 5 cards
    And the racing pool includes at least one card with category "race"
    And the racing pool includes at least one card with category "big"
    And the racing pool includes at least one card with category "contemporary"
    And the racing pool includes at least one card with category "absurd"

  Scenario: A refresh button is visible below the racing suggestion tray
    Given the racing panel is in qanda mode
    Then a refresh button exists for the racing panel

  Scenario: Clicking racing refresh shows a new set of 5 cards from the pool
    Given the racing panel is in qanda mode
    When the racing refresh button is clicked
    Then the racing suggestion tray shows exactly 5 cards

  Scenario: Clicking a racing suggestion card fills the racing textarea
    Given the racing panel is in qanda mode
    When the user clicks a racing suggestion card
    Then the racing textarea contains the card text

  # ── GOLF ──────────────────────────────────────────────────────

  Scenario: Golf Q&A mode shows exactly 5 suggestion cards on load
    Given the golf suggestion pool is loaded
    Then the golf suggestion tray shows exactly 5 cards
    And the golf pool includes at least one card with category "golf"
    And the golf pool includes at least one card with category "big"
    And the golf pool includes at least one card with category "contemporary"
    And the golf pool includes at least one card with category "absurd"

  Scenario: A refresh button is visible below the golf suggestion tray
    Given the golf suggestion pool is loaded
    Then a refresh button exists for the golf panel

  # ── SHARED MECHANIC ───────────────────────────────────────────

  Scenario: Suggestion cards are shuffled — displayed 5 are not always the first 5 in pool order
    Given the Football panel is in qanda mode
    Then the football suggestion tray shows exactly 5 cards
    And the football suggestion cards are not in fixed pool order
