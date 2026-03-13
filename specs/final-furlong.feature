Feature: The Final Furlong — Horse Racing Panel
  As a user interested in horse racing
  I want a panel of informed, opinionated, and occasionally dead racing experts
  So that any race, horse, or question is handled with appropriate authority and bathos

  Background:
    Given "racing" is in the consultant skin tabs
    And "racing" is registered in the nav group map under "sports"

  # ── NAV AND ROUTING ────────────────────────────────────────────

  Scenario: Racing panel is wired into the sports nav group
    Then "racing" is registered in the nav group map

  Scenario: Racing panel tab is labelled "The Final Furlong"
    Then the racing panel tab text is "The Final Furlong"

  # ── PANEL MEMBERS ──────────────────────────────────────────────

  Scenario: Racing panel includes all 8 members
    Then the racing panel includes "alan_brazil"
    And the racing panel includes "mccririck"
    And the racing panel includes "mcgrath"
    And the racing panel includes "alastair_down"
    And the racing panel includes "osullevan"
    And the racing panel includes "ruby_walsh"
    And the racing panel includes "matt_chapman"
    And the racing panel includes "dettori"

  Scenario: Alan Brazil is the host and always opens discussion
    Given a racing panel discussion is triggered
    Then the first speaker is "alan_brazil"

  Scenario: Four rotating members speak after Brazil
    Given a racing panel discussion is triggered
    Then exactly 4 members from the rotating pool speak after Brazil
    And all 4 are drawn from the non-host panel members

  Scenario: DEAD_IN_PANEL_WORLD — McCririck and O'Sullevan are present
    Then "mccririck" is present in the racing panel member list
    And "osullevan" is present in the racing panel member list

  Scenario: DEAD_IN_PANEL_WORLD — turn rules prohibit mention of deaths
    Then the racing turn rules include a hard rule against mentioning panel member deaths

  # ── MEMBER DATA ────────────────────────────────────────────────

  Scenario Outline: Each racing panel member has required character fields
    Given the racing panel member "<member>"
    Then their entry has a non-empty "name"
    And their entry has a non-empty "prompt"

    Examples:
      | member        |
      | alan_brazil   |
      | mccririck     |
      | mcgrath       |
      | alastair_down |
      | osullevan     |
      | ruby_walsh    |
      | matt_chapman  |

  Scenario: Alan Brazil prompt references his football background
    Given the racing panel member "alan_brazil"
    Then his prompt mentions Ipswich or football

  Scenario: Alan Brazil prompt includes Mick Mills or Bobby Robson anecdote pool
    Given the racing panel member "alan_brazil"
    Then his prompt includes reference to anecdotes from his playing days

  Scenario: McCririck prompt references his Channel 4 betting ring role
    Given the racing panel member "mccririck"
    Then his prompt mentions the betting ring or tic-tac

  Scenario: O'Sullevan prompt references his BBC commentary career
    Given the racing panel member "osullevan"
    Then his prompt mentions BBC or commentary

  Scenario: Ruby Walsh prompt references his jockey experience
    Given the racing panel member "ruby_walsh"
    Then his prompt mentions riding or the saddle

  # ── MODE 1 — Q&A ───────────────────────────────────────────────

  Scenario: Racing panel defaults to Q&A mode on load
    Given the racing panel is active
    Then the Q&A mode view is visible
    And the Race Moment mode view is hidden

  Scenario: Racing Q&A suggestion tray is visible on load
    Given the racing panel is in qanda mode
    Then the racing suggestion tray is visible

  Scenario: Racing suggestion tray contains at least 10 cards
    Given the racing panel is in qanda mode
    Then the racing suggestion tray contains at least 10 cards

  Scenario: Racing suggestion cards cover required categories
    Given the racing panel is in qanda mode
    Then at least one racing suggestion card has category "race"
    And at least one racing suggestion card has category "big"
    And at least one racing suggestion card has category "contemporary"
    And at least one racing suggestion card has category "absurd"

  Scenario: Clicking a racing suggestion card fills the textarea
    Given the racing panel is in qanda mode
    When the user clicks a racing suggestion card
    Then the racing textarea contains the card text

  # ── MODE 2 — RACE MOMENT ───────────────────────────────────────

  Scenario: Racing panel can be switched to Race Moment mode
    Given the racing panel is active
    When the user clicks the "Race Moment" mode tab
    Then the Race Moment mode view is visible
    And the Q&A mode view is hidden

  Scenario: Race Moment selector contains exactly 6 moment types
    Given the racing panel is in ingame mode
    Then the race moment selector contains 6 options

  Scenario: Race Moment selector includes expected moment types
    Given the racing panel is in ingame mode
    Then the race moment selector includes "PHOTO_FINISH"
    And the race moment selector includes "STEWARDS_ENQUIRY"
    And the race moment selector includes "LAST_FENCE_FALL"
    And the race moment selector includes "SHOCK_WINNER"
    And the race moment selector includes "WITHDRAWAL"
    And the race moment selector includes "RECORD_TIME"

  Scenario: Race Moment button is disabled until a moment is selected
    Given the racing panel is in ingame mode
    And no moment type is selected
    Then the Race Moment button is disabled

  Scenario: Race Moment button enables when a moment is selected
    Given the racing panel is in ingame mode
    When the user selects "PHOTO_FINISH" from the moment selector
    Then the Race Moment button is enabled

  # ── ANCHOR READBACK ────────────────────────────────────────────

  Scenario: Alan Brazil voices the anchor readback in Q&A mode
    Given a racing panel Q&A discussion has completed
    Then the anchor readback is attributed to Alan Brazil

  # ── MODULE EXPORT ──────────────────────────────────────────────

  Scenario: Racing IIFE exports the required panel functions
    Then the Racing module exports "discuss"
    And the Racing module exports "callMoment"
    And the Racing module exports "switchMode"
    And the Racing module exports "nextRound"
