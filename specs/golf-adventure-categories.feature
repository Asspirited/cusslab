Feature: Golf Adventure tournament selector category split
  As a player
  I want tournaments grouped into labelled categories
  So that I can find what I want as the list grows

  Background:
    Given the golf adventure panel is loaded
    And the tournament selector is visible

  # ── Category rendering ──────────────────────────────────────────────────────

  Scenario Outline: Category section renders when it has entries
    Given TOURNAMENTS contains at least one entry with type "<type>"
    When the tournament selector renders
    Then the "<label>" section heading is visible
    And the section contains those tournament entries

    Examples:
      | type     | label          |
      | major    | Majors         |
      | collapse | Majors         |
      | ryder    | Ryder Cup      |
      | historic | Other Historic |

  Scenario Outline: Category section is hidden when it has no entries
    Given TOURNAMENTS contains no entries with type "<type>"
    When the tournament selector renders
    Then the "<label>" section heading is not visible

    Examples:
      | type     | label          |
      | ryder    | Ryder Cup      |
      | historic | Other Historic |

  # ── Section ordering ─────────────────────────────────────────────────────────

  Scenario: Sections render in fixed order regardless of data order
    Given TOURNAMENTS contains entries of type major, ryder, and historic
    When the tournament selector renders
    Then the Majors section appears before the Ryder Cup section
    And the Ryder Cup section appears before the Other Historic section

  # ── Visual separator ─────────────────────────────────────────────────────────

  Scenario: Each visible section has a visual separator above it
    Given TOURNAMENTS contains entries of type major and ryder
    When the tournament selector renders
    Then the Majors section has a visual separator
    And the Ryder Cup section has a visual separator

  # ── Tournament assignment ─────────────────────────────────────────────────────

  Scenario Outline: Tournament lands in correct section by type
    Given TOURNAMENTS contains "<tournament>" with type "<type>"
    When the tournament selector renders
    Then "<tournament>" appears in the "<label>" section

    Examples:
      | tournament       | type     | label     |
      | duel_sun         | major    | Majors    |
      | tiger_2005       | major    | Majors    |
      | vandervelde_1999 | collapse | Majors    |
      | medinah_2012     | ryder    | Ryder Cup |

  # ── Unknown type fallback ────────────────────────────────────────────────────

  Scenario: Tournament with unrecognised type falls through to Majors
    Given TOURNAMENTS contains a tournament with type "unknown"
    When the tournament selector renders
    Then that tournament appears in the Majors section

  # ── Selection behaviour unchanged ───────────────────────────────────────────

  Scenario: Selecting a tournament from any category works correctly
    Given the tournament selector has rendered with categories
    When the player clicks a tournament in the Ryder Cup section
    Then that tournament is selected
    And the adventure begins with that tournament's data

  # ── Empty state ──────────────────────────────────────────────────────────────

  Scenario: Selector shows no category headers when TOURNAMENTS is empty
    Given TOURNAMENTS is empty
    When the tournament selector renders
    Then no section headings are visible
    And the empty state message is shown
