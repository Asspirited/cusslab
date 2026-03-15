Feature: The Spit Shelter — Hip-Hop Panel
  As a user interested in hip-hop
  I want a panel of opinionated, technically rigorous, and occasionally dead MCs
  So that any prompt, question, or battle brief is handled with authority and friction

  Background:
    Given "hip_hop" is in the consultant skin tabs
    And "hip_hop" is registered in the nav group map under "comedy"

  # ── NAV AND ROUTING ────────────────────────────────────────────

  Scenario: Hip-hop panel is wired into the comedy nav group
    Then "hip_hop" is registered in the nav group map

  Scenario: Hip-hop panel tab is labelled "The Spit Shelter"
    Then the hip_hop panel tab text is "The Spit Shelter"

  Scenario: Comedy landing page includes The Spit Shelter tile
    Given the user has clicked the "comedy" nav group
    Then the landing page includes a tile for "The Spit Shelter"

  # ── PANEL MEMBERS ──────────────────────────────────────────────

  Scenario: Hip-hop panel includes all 17 members
    Then the hip_hop panel includes "eminem"
    And the hip_hop panel includes "dr_dre"
    And the hip_hop panel includes "biggie"
    And the hip_hop panel includes "tupac"
    And the hip_hop panel includes "missy_elliott"
    And the hip_hop panel includes "jcc"
    And the hip_hop panel includes "ice_cube"
    And the hip_hop panel includes "ice_t"
    And the hip_hop panel includes "snoop_dogg"
    And the hip_hop panel includes "lauryn_hill"
    And the hip_hop panel includes "kendrick"
    And the hip_hop panel includes "gil_scott_heron"
    And the hip_hop panel includes "stormzy"
    And the hip_hop panel includes "skepta"
    And the hip_hop panel includes "plan_b"
    And the hip_hop panel includes "dave"
    And the hip_hop panel includes "mike_skinner"

  Scenario: Eminem is the anchor and always opens discussion
    Given a hip_hop panel discussion is triggered
    Then the first hip_hop speaker is "eminem"

  Scenario: Four rotating members speak after Eminem
    Given a hip_hop panel discussion is triggered
    Then exactly 4 hip_hop members from the rotating pool speak after Eminem
    And all 4 are drawn from the 16 non-anchor hip_hop panel members

  Scenario: DEAD_IN_PANEL_WORLD — Biggie, Tupac, and Gil Scott-Heron are present
    Then "biggie" is present in the hip_hop panel member list
    And "tupac" is present in the hip_hop panel member list
    And "gil_scott_heron" is present in the hip_hop panel member list

  Scenario: DEAD_IN_PANEL_WORLD — turn rules prohibit mention of deaths
    Then the hip_hop turn rules include a hard rule against mentioning panel member deaths

  # ── MEMBER DATA ─────────────────────────────────────────────────

  Scenario Outline: Each hip-hop panel member has required character fields
    Given the hip_hop panel member "<member>"
    Then their hip_hop entry has a non-empty "name"
    And their hip_hop entry has a non-empty "prompt"

    Examples:
      | member          |
      | eminem          |
      | dr_dre          |
      | biggie          |
      | tupac           |
      | missy_elliott   |
      | jcc             |
      | ice_cube        |
      | ice_t           |
      | snoop_dogg      |
      | lauryn_hill     |
      | kendrick        |
      | gil_scott_heron |
      | stormzy         |
      | skepta          |
      | plan_b          |
      | dave            |
      | mike_skinner    |

  Scenario: Eminem prompt references Detroit and technical construction
    Given the hip_hop panel member "eminem"
    Then his hip_hop prompt mentions Detroit or syllable

  Scenario: Biggie prompt references Brooklyn or storytelling
    Given the hip_hop panel member "biggie"
    Then his hip_hop prompt mentions Brooklyn or storytelling

  Scenario: Tupac prompt references Shakur or conscience
    Given the hip_hop panel member "tupac"
    Then his hip_hop prompt mentions Shakur or conscience

  Scenario: JCC prompt references Salford or bluesologist
    Given the hip_hop panel member "jcc"
    Then his hip_hop prompt mentions Salford or bluesologist

  # ── MODE 1 — Q&A ────────────────────────────────────────────────

  Scenario: Hip-hop panel defaults to Q&A mode on load
    Given the hip_hop panel is active
    Then the hip_hop Q&A mode view is visible
    And the hip_hop Rap Battle mode view is hidden

  Scenario: Hip-hop Q&A suggestion tray is visible on load
    Given the hip_hop panel is in qanda mode
    Then the hip_hop suggestion tray is visible

  Scenario: Hip-hop suggestion pool has at least 10 entries (supports 5-cap with refresh variety)
    Given the hip_hop panel is in qanda mode
    Then the hip_hop suggestion tray contains at least 10 cards

  Scenario: Hip-hop suggestion pool covers required categories
    Given the hip_hop panel is in qanda mode
    Then at least one hip_hop suggestion card has category "roast"
    And at least one hip_hop suggestion card has category "craft"
    And at least one hip_hop suggestion card has category "beef"
    And at least one hip_hop suggestion card has category "legacy"

  Scenario: Hip-hop suggestion display is capped at 5 cards
    Given the hip_hop panel is in qanda mode
    Then the hip_hop _buildSuggestions function caps display at 5

  Scenario: A refresh button is created by hip_hop _buildSuggestions
    Given the hip_hop panel is in qanda mode
    Then the hip_hop _buildSuggestions function creates a refresh button

  # ── MODE 2 — RAP BATTLE ─────────────────────────────────────────

  Scenario: Hip-hop panel can be switched to Rap Battle mode
    Given the hip_hop panel is active
    When the user clicks the "Rap Battle" mode tab
    Then the hip_hop Rap Battle mode view is visible
    And the hip_hop Q&A mode view is hidden

  Scenario: Rap Battle mode shows the battle setup UI
    Given the hip_hop panel is in battle mode
    Then the battle setup panel is visible
    And the battle brief input is present
    And the start battle button exists

  Scenario: Rap Battle requires a brief before submission
    Given the hip_hop panel is in battle mode
    And the battle brief input is empty
    Then the start battle button is disabled

  Scenario: Rap Battle selects two combatants from the panel pool
    Given the hip_hop panel is in battle mode
    And the user has entered a battle brief
    When the user clicks start battle
    Then two hip_hop combatants are selected
    And both combatants are distinct

  Scenario: Each combatant delivers one rap response to the brief
    Given a hip_hop battle is underway with two combatants
    Then the first combatant delivers a rap response
    And the second combatant delivers a rap response
    And both responses reference the battle brief

  Scenario: Panel delivers verdict on the battle
    Given both combatants have delivered their responses
    Then the hip_hop panel delivers a verdict response
    And the verdict is attributed to Eminem

  Scenario: Rap Battle data has at least 5 battle brief prompts
    Then the hip_hop battle brief pool has at least 5 entries

  # ── ANCHOR READBACK ──────────────────────────────────────────────

  Scenario: Eminem voices the anchor readback in Q&A mode
    Given a hip_hop panel Q&A discussion has completed
    Then the hip_hop anchor readback is attributed to Eminem

  # ── MODULE EXPORT ────────────────────────────────────────────────

  Scenario: Hip-hop IIFE exports the required panel functions
    Then the HipHop module exports "discuss"
    And the HipHop module exports "switchMode"
    And the HipHop module exports "nextRound"
    And the HipHop module exports "startBattle"
    And the HipHop module exports "selectCombatants"
