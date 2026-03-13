Feature: The Crucible Corner — Snooker Panel
  As a user interested in snooker
  I want a panel of informed, opinionated, and occasionally dead snooker experts
  So that any match, player, or question is handled with authority and bathos

  Background:
    Given "snooker" is in the consultant skin tabs
    And "snooker" is registered in the nav group map under "sports"

  # ── NAV AND ROUTING ────────────────────────────────────────────

  Scenario: Snooker panel is wired into the sports nav group
    Then "snooker" is registered in the nav group map

  Scenario: Snooker panel tab is labelled "The Crucible Corner"
    Then the snooker panel tab text is "The Crucible Corner"

  # ── PANEL MEMBERS ──────────────────────────────────────────────

  Scenario: Snooker panel includes all 9 members
    Then the snooker panel includes "jimmy_white"
    And the snooker panel includes "steve_davis"
    And the snooker panel includes "john_virgo"
    And the snooker panel includes "dennis_taylor"
    And the snooker panel includes "ronnie_osullivan"
    And the snooker panel includes "willie_thorne"
    And the snooker panel includes "ray_reardon"
    And the snooker panel includes "john_parrott"
    And the snooker panel includes "mark_williams"

  Scenario: Jimmy White is the host and always opens discussion
    Given a snooker panel discussion is triggered
    Then the first snooker speaker is "jimmy_white"

  Scenario: Four rotating members speak after White
    Given a snooker panel discussion is triggered
    Then exactly 4 snooker members from the rotating pool speak after White
    And all 4 are drawn from the 8 non-host snooker panel members

  Scenario: DEAD_IN_PANEL_WORLD — Thorne and Reardon are present
    Then "willie_thorne" is present in the snooker panel member list
    And "ray_reardon" is present in the snooker panel member list

  Scenario: DEAD_IN_PANEL_WORLD — turn rules prohibit mention of deaths
    Then the snooker turn rules include a hard rule against mentioning panel member deaths

  # ── MEMBER DATA ─────────────────────────────────────────────────

  Scenario Outline: Each snooker panel member has required character fields
    Given the snooker panel member "<member>"
    Then their snooker entry has a non-empty "name"
    And their snooker entry has a non-empty "prompt"

    Examples:
      | member           |
      | jimmy_white      |
      | steve_davis      |
      | john_virgo       |
      | dennis_taylor    |
      | ronnie_osullivan |
      | willie_thorne    |
      | ray_reardon      |
      | john_parrott     |
      | mark_williams    |

  Scenario: Jimmy White prompt references the Whirlwind and near-misses
    Given the snooker panel member "jimmy_white"
    Then his snooker prompt mentions Whirlwind or World Championship

  Scenario: Dennis Taylor prompt references the 1985 final
    Given the snooker panel member "dennis_taylor"
    Then his snooker prompt mentions 1985 or black ball

  Scenario: Willie Thorne prompt references his BBC commentary career
    Given the snooker panel member "willie_thorne"
    Then his snooker prompt mentions BBC or commentary

  Scenario: Ray Reardon prompt references his dominance in the 1970s
    Given the snooker panel member "ray_reardon"
    Then his snooker prompt mentions 1970s or world champion

  Scenario: Ronnie O'Sullivan prompt references his genius and volatility
    Given the snooker panel member "ronnie_osullivan"
    Then his snooker prompt mentions genius or volatile

  # ── MODE 1 — Q&A ───────────────────────────────────────────────

  Scenario: Snooker panel defaults to Q&A mode on load
    Given the snooker panel is active
    Then the snooker Q&A mode view is visible
    And the snooker Frame Simulation mode view is hidden

  Scenario: Snooker Q&A suggestion tray is visible on load
    Given the snooker panel is in qanda mode
    Then the snooker suggestion tray is visible

  Scenario: Snooker suggestion tray contains at least 10 cards
    Given the snooker panel is in qanda mode
    Then the snooker suggestion tray contains at least 10 cards

  Scenario: Snooker suggestion cards cover required categories
    Given the snooker panel is in qanda mode
    Then at least one snooker suggestion card has category "match"
    And at least one snooker suggestion card has category "player"
    And at least one snooker suggestion card has category "technique"
    And at least one snooker suggestion card has category "absurd"

  # ── MODE 2 — FRAME SIMULATION ───────────────────────────────────

  Scenario: Snooker panel can be switched to Frame Simulation mode
    Given the snooker panel is active
    When the user clicks the "Frame Simulation" mode tab
    Then the snooker Frame Simulation mode view is visible
    And the snooker Q&A mode view is hidden

  Scenario: Frame Simulation mode shows the frame setup UI
    Given the snooker panel is in frame mode
    Then the snooker frame setup panel is visible
    And the start frame button exists

  Scenario: Frame setup includes a table position description
    Given the snooker panel is in frame mode
    Then the snooker frame position description element is present

  Scenario: Each red option has required data fields
    Then each snooker red option has a label, difficulty, and position_reward

  Scenario: Each spin option has required data fields
    Then each snooker spin option has a label, success_modifier, and position_modifier

  Scenario: Frame Simulation data has at least 3 table positions
    Then the snooker frame positions pool has at least 3 entries

  Scenario: Frame Simulation data has at least 5 red options
    Then the snooker red options pool has at least 5 entries

  Scenario: Frame Simulation data has at least 5 spin options
    Then the snooker spin options pool has at least 5 entries

  # ── ANCHOR READBACK ─────────────────────────────────────────────

  Scenario: Jimmy White voices the anchor readback in Q&A mode
    Given a snooker panel Q&A discussion has completed
    Then the snooker anchor readback is attributed to Jimmy White

  # ── MODULE EXPORT ───────────────────────────────────────────────

  Scenario: Snooker IIFE exports the required panel functions
    Then the Snooker module exports "discuss"
    And the Snooker module exports "switchMode"
    And the Snooker module exports "nextRound"
    And the Snooker module exports "startFrame"
    And the Snooker module exports "selectRed"
    And the Snooker module exports "selectSpin"
    And the Snooker module exports "selectColour"
