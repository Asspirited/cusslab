Feature: Comedy Room mode switcher — Into The Room / The House Name Oracle

  # ─── MODE TABS ────────────────────────────────────────────────────────────────

  Scenario: Comedy Room has two mode tabs
    Given the user is on the Comedy Room
    Then a mode tab labelled "Into The Room" is present
    And a mode tab labelled "The House Name Oracle" is present

  Scenario: Standard mode is active by default
    Given the user is on the Comedy Room
    Then the "Into The Room" tab is active
    And the standard Comedy Room input is visible
    And the Oracle input is not visible

  Scenario: Switching to Oracle mode shows Oracle inputs
    Given the user is on the Comedy Room
    When the user selects the "The House Name Oracle" mode
    Then the Oracle location field is visible
    And the Oracle archetype selector is visible
    And the standard Comedy Room input is not visible

  Scenario: Switching back to standard mode restores standard input
    Given the user is on the Comedy Room
    And the user has selected the "The House Name Oracle" mode
    When the user selects the "Into The Room" mode
    Then the standard Comedy Room input is visible
    And the Oracle input is not visible

  # ─── ARCHETYPE SELECTOR ───────────────────────────────────────────────────────

  Scenario: Oracle archetype selector lists all eight voices
    Given the user is on the Comedy Room
    And the user has selected the "The House Name Oracle" mode
    Then the archetype selector contains "Elegist"
    And the archetype selector contains "Rogue"
    And the archetype selector contains "DarkOracle"
    And the archetype selector contains "Booster"
    And the archetype selector contains "Snob"
    And the archetype selector contains "Anarchist"
    And the archetype selector contains "Mystic"
    And the archetype selector contains "Local"

  Scenario: Oracle archetype selector is marked as required
    Given the user is on the Comedy Room
    And the user has selected the "The House Name Oracle" mode
    Then the archetype selector has a required indicator
