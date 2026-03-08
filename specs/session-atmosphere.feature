
Feature: Session atmosphere — pre-session and mid-session pressure control
  As a user running a sports panel session
  I want to set and adjust the session atmosphere before and during play
  So that I can control the starting pressure, hostility, and mechanic firing rates

  Background:
    Given a sports panel is open
    And the session has not yet started

  # ── ATMOSPHERE STRIP ──────────────────────────────────────────────────────

  Scenario: Atmosphere strip is visible before session starts
    Then the atmosphere strip is visible
    And the strip displays schema "NORMAL"
    And the strip pressure fill is at its minimum width

  Scenario: Clicking the atmosphere strip opens the drawer
    When I click the atmosphere strip
    Then the atmosphere drawer is open

  Scenario: Closing the drawer hides it without applying changes
    Given the atmosphere drawer is open
    And schema "POWDER_KEG" is selected but not applied
    When I click the drawer close button
    Then the atmosphere drawer is closed
    And the active schema remains "NORMAL"

  # ── SCHEMA SELECTION ──────────────────────────────────────────────────────

  Scenario Outline: Selecting a schema highlights its card
    Given the atmosphere drawer is open
    When I click the "<schema>" schema card
    Then the "<schema>" card has the active class
    And no other schema card has the active class

    Examples:
      | schema         |
      | NORMAL         |
      | SIMMERING      |
      | POWDER_KEG     |
      | CHAOS_MODE     |
      | BLOODBATH      |
      | FUNNY_PECULIAR |
      | DEEP_WOUNDS    |

  Scenario Outline: Selecting a schema syncs the advanced sliders
    Given the atmosphere drawer is open
    When I click the "<schema>" schema card
    Then the tension slider value is <tension>
    And the hostility slider value is <hostility>
    And the chaos slider value is <chaos>

    Examples:
      | schema         | tension | hostility | chaos |
      | NORMAL         | 20      | 20        | 30    |
      | SIMMERING      | 55      | 40        | 25    |
      | POWDER_KEG     | 85      | 65        | 35    |
      | BLOODBATH      | 100     | 100       | 40    |
      | FUNNY_PECULIAR | 20      | 10        | 80    |

  # ── ADVANCED SLIDERS ──────────────────────────────────────────────────────

  Scenario: Advanced sliders are hidden by default
    Given the atmosphere drawer is open
    Then the advanced sliders section is not visible

  Scenario: Advanced toggle shows the sliders
    Given the atmosphere drawer is open
    When I click the Advanced toggle
    Then the advanced sliders section is visible
    And the toggle arrow points right

  Scenario: Moving a slider deselects the active schema preset
    Given the atmosphere drawer is open
    And schema "SIMMERING" is selected
    When I move the tension slider to 75
    Then no schema card has the active class

  # ── APPLY — ADDITIVE PRESSURE MODEL ──────────────────────────────────────

  Scenario: NORMAL schema injects zero pressure delta
    Given the atmosphere drawer is open
    And all characters are at pressure tier "SWALLOW"
    When I click the "NORMAL" schema card
    And I click Inject Into Session
    Then all characters remain at pressure tier "SWALLOW"

  Scenario: SIMMERING schema injects one pressure tier additively
    Given the atmosphere drawer is open
    And all characters are at pressure tier "SWALLOW"
    When I click the "SIMMERING" schema card
    And I click Inject Into Session
    Then all characters are at pressure tier "LAUGH_OFF"

  Scenario: POWDER_KEG schema injects two pressure tiers additively
    Given the atmosphere drawer is open
    And all characters are at pressure tier "SWALLOW"
    When I click the "POWDER_KEG" schema card
    And I click Inject Into Session
    Then all characters are at pressure tier "PASSIVE_AGGRESSIVE"

  Scenario: BLOODBATH schema injects three pressure tiers additively
    Given the atmosphere drawer is open
    And all characters are at pressure tier "SWALLOW"
    When I click the "BLOODBATH" schema card
    And I click Inject Into Session
    Then all characters are at pressure tier "FULL_CRACK"

  Scenario: Pressure never exceeds FULL_MONTY regardless of delta
    Given all characters are at pressure tier "FULL_CRACK"
    And the atmosphere drawer is open
    When I click the "BLOODBATH" schema card
    And I click Inject Into Session
    Then all characters are at pressure tier "FULL_MONTY"
    And no character exceeds FULL_MONTY

  Scenario: Mid-session apply adds to existing pressure, never resets
    Given all characters are at pressure tier "LAUGH_OFF"
    And the atmosphere drawer is open
    When I click the "SIMMERING" schema card
    And I click Inject Into Session
    Then all characters are at pressure tier "PASSIVE_AGGRESSIVE"

  # ── SESSION STORAGE ───────────────────────────────────────────────────────

  Scenario: Applying a schema writes atmosphere context to sessionStorage
    Given the atmosphere drawer is open
    When I click the "POWDER_KEG" schema card
    And I click Inject Into Session
    Then sessionStorage key "hc_atmosphere" exists
    And the stored schema is "POWDER_KEG"
    And the stored tension is 85
    And the stored hostility is 65

  Scenario: Applying a custom slider configuration writes correct values
    Given the atmosphere drawer is open
    And the Advanced toggle is open
    When I move the tension slider to 70
    And I move the hostility slider to 50
    And I click Inject Into Session
    Then sessionStorage key "hc_atmosphere" exists
    And the stored tension is 70
    And the stored hostility is 50

  # ── PROMPT PREFIX ─────────────────────────────────────────────────────────

  Scenario: buildAtmospherePromptPrefix returns all seven dimensions
    Given atmosphere context with schema "CHAOS_MODE" is stored
    When buildAtmospherePromptPrefix is called
    Then the result contains "tension"
    And the result contains "hostility"
    And the result contains "chaos"
    And the result contains "bathos"
    And the result contains "premonition"
    And the result contains "bleed"
    And the result contains "CHAOS_MODE"

  Scenario: High hostility prompt routes to OUTRIGHT_INSULT
    Given atmosphere context with hostility 90 is stored
    When buildAtmospherePromptPrefix is called
    Then the result contains "OUTRIGHT_INSULT"

  Scenario: Low hostility prompt routes to SUBTLY_UNDERMINING only
    Given atmosphere context with hostility 20 is stored
    When buildAtmospherePromptPrefix is called
    Then the result contains "SUBTLY_UNDERMINING"
    And the result does not contain "OUTRIGHT_INSULT"
