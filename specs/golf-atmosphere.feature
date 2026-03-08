
Feature: Golf panel — session atmosphere selector
  As a user of The 19th Hole golf panel
  I want to select and change the session atmosphere before and between rounds
  So that I can control how the panel behaves without it being chosen for me

  Background:
    Given the golf panel is open in Q&A mode

  # ── SELECTOR VISIBILITY ──────────────────────────────────────────────────

  Scenario: Atmosphere selector is visible before first submission
    Then the atmosphere selector is visible
    And the "NORMAL" schema is selected by default

  Scenario: Selector remains visible after a submission
    Given the user has submitted a question
    Then the atmosphere selector is visible

  # ── SCHEMA SELECTION ─────────────────────────────────────────────────────

  Scenario Outline: Clicking a schema card selects it
    When I click the "<schema>" atmosphere card
    Then the "<schema>" card is active
    And no other atmosphere card is active

    Examples:
      | schema         |
      | NORMAL         |
      | SIMMERING      |
      | POWDER_KEG     |
      | CHAOS_MODE     |
      | BLOODBATH      |
      | FUNNY_PECULIAR |
      | DEEP_WOUNDS    |

  # ── PERSISTENCE ──────────────────────────────────────────────────────────

  Scenario: Selecting a schema writes to sessionStorage
    When I click the "POWDER_KEG" atmosphere card
    Then sessionStorage key "hc_atmosphere" exists
    And the stored schema is "POWDER_KEG"

  Scenario: Schema selection persists across submissions in a session
    Given I have selected the "BLOODBATH" atmosphere
    When the user submits a question
    Then the stored schema is still "BLOODBATH"

  Scenario: User can change schema between rounds
    Given I have selected the "SIMMERING" atmosphere
    And the user has submitted a question
    When I click the "CHAOS_MODE" atmosphere card
    Then the stored schema is "CHAOS_MODE"
    And the "CHAOS_MODE" card is active

  # ── PROMPT INJECTION ─────────────────────────────────────────────────────

  Scenario: Golf discuss reads atmosphere schema and injects it into prompt
    Given I have selected the "POWDER_KEG" atmosphere
    When Golf.discuss builds the prompt
    Then the prompt contains "POWDER_KEG"
    And the prompt contains "tension"
    And the prompt contains "hostility"

  Scenario: NORMAL schema produces restrained prompt note
    Given I have selected the "NORMAL" atmosphere
    When Golf.discuss builds the prompt
    Then the prompt contains "NORMAL"

  Scenario: BLOODBATH schema produces full escalation prompt note
    Given I have selected the "BLOODBATH" atmosphere
    When Golf.discuss builds the prompt
    Then the prompt contains "BLOODBATH"

  # ── AUTO-ROUND REMOVAL ───────────────────────────────────────────────────

  Scenario: The auto-incrementing round counter is not shown
    Given the user has submitted a question
    Then the round indicator is not visible

