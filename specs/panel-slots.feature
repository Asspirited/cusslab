@panel-slots
Feature: Panel slot assignments
  Panel members are assigned a primary_slot and optional secondary_slot.
  Slots govern routing priority, turn-taking weight, and commentary role tax.
  Slots are read by COMMENTARY_ROLE_TAX (p2) — they are not defined by it.
  Valid slots: anchor, engine, grievance, exotic, liar.
  Every panel must have exactly one anchor.
  A character may have a secondary_slot that activates under defined conditions.

  Background:
    Given the panel slot table is loaded
    And each character has a primary_slot
    And secondary_slot is optional and may be null

  # --- FOOTBALL PANEL ---

  @football
  Scenario Outline: Football panel member has correct slot assignment
    Given the football panel is active
    When I look up the slot for "<character>"
    Then their primary_slot is "<primary_slot>"
    And their secondary_slot is "<secondary_slot>"

    Examples:
      | character  | primary_slot | secondary_slot |
      | cox        | anchor       | exotic         |
      | souness    | grievance     |                |
      | neville    | engine       | anchor         |
      | carragher  | engine       | grievance      |
      | micah      | engine       | exotic         |
      | bigron     | liar         | exotic         |

  @football
  Scenario: Football panel has exactly one primary anchor
    Given the football panel is active
    When I count panel members with primary_slot "anchor"
    Then the count is 1
    And that member is "cox"

  @football
  Scenario: Neville activates anchor secondary slot when cox is absent
    Given the football panel is active
    And "cox" is not in the current session draw
    When the anchor slot is evaluated
    Then "neville" assumes anchor routing priority
    And "neville" secondary_slot "anchor" is active

  # --- BOARDROOM PANEL ---

  @boardroom
  Scenario Outline: Boardroom panel member has correct slot assignment
    Given the boardroom panel is active
    When I look up the slot for "<character>"
    Then their primary_slot is "<primary_slot>"
    And their secondary_slot is "<secondary_slot>"

    Examples:
      | character  | primary_slot | secondary_slot |
      | harold     | anchor       |                |
      | sebastian  | engine       | anchor         |
      | roy        | engine       | grievance      |
      | ben        | engine       | exotic         |
      | cox        | exotic       |                |
      | partridge  | liar         | exotic         |
      | mystic     | exotic       | liar           |

  @boardroom
  Scenario: Boardroom panel has exactly one primary anchor
    Given the boardroom panel is active
    When I count panel members with primary_slot "anchor"
    Then the count is 1
    And that member is "harold"

  @boardroom
  Scenario: Sebastian activates anchor secondary slot when harold is absent
    Given the boardroom panel is active
    And "harold" is not in the current session draw
    When the anchor slot is evaluated
    Then "sebastian" assumes anchor routing priority
    And "sebastian" secondary_slot "anchor" is active

  # --- CROSS-PANEL INVARIANTS ---

  @football @boardroom
  Scenario Outline: Every panel has exactly one anchor
    Given the "<panel>" panel is active
    When I count panel members with primary_slot "anchor"
    Then the count is 1

    Examples:
      | panel      |
      | football   |
      | boardroom  |

  @football @boardroom
  Scenario Outline: No panel member holds two primary slots
    Given the "<panel>" panel is active
    When I inspect all panel member slot assignments
    Then no character has more than one primary_slot

    Examples:
      | panel      |
      | football   |
      | boardroom  |

  @football @boardroom
  Scenario Outline: Secondary slot is only active when a defined condition is met
    Given the "<panel>" panel is active
    And "<character>" has secondary_slot "<secondary_slot>"
    When no activation condition is met
    Then "<character>" routes as primary_slot only

    Examples:
      | panel     | character | secondary_slot |
      | football  | neville   | anchor         |
      | football  | carragher | grievance      |
      | football  | micah     | exotic         |
      | football  | bigron    | exotic         |
      | boardroom | sebastian | anchor         |
      | boardroom | roy       | grievance      |
      | boardroom | ben       | exotic         |
      | boardroom | partridge | exotic         |
      | boardroom | mystic    | liar           |
