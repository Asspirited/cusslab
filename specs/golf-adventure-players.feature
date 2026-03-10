# Golf Adventure — Ryder Cup Player Selection
# Feature: specs/golf-adventure-players.feature
# BL-022: Be Any Player — expanded roster + two-tier live attributes + temperament profiles
# Three Amigos approved: 2026-03-09

@golf-adventure-players
Feature: Ryder Cup Player Selection

  Players can be selected from an expanded roster for each Ryder Cup tournament.
  Each player has two tiers of attributes, all shown on card and HUD, all live (base + in-game delta).

  A-tier (character): BOTTLE, EGO, TEMPERAMENT, SHAME (1–10, stored) + SKILL (0–100, derived).
  B-tier (golf): DRIVING, IRONS, SHORT GAME, PUTTING, RECOVERY, BUNKERS,
    COURSE MANAGEMENT, SHOT VARIATION (1–10, stored).
  SKILL = weighted average of all 8 B-tier stats scaled to 100. Updates when B-tier changes.

  Each player also has a temperamentProfile (enum) that governs how stats change
  during play. Profile archetype mechanics are defined in BL-029.
  Player-specific chaos injectors on top of archetype are defined in BL-030.

  A day where a player sat out team matches uses format ABSENT — no opponent required for that day.

  Background:
    Given the golf adventure data modules are loaded

  ---

  ## Data shape — stored A-tier attributes

  @players-data
  Scenario Outline: Every Ryder Cup player has a valid stored A-tier attribute
    When the tournament catalogue is inspected
    Then every player in every Ryder Cup tournament has a numeric "<attr>" between 1 and 10

    Examples:
      | attr        |
      | bottle      |
      | ego         |
      | temperament |
      | shame       |

  ---

  ## Data shape — temperament profile

  @players-data
  Scenario Outline: Every Ryder Cup player has a valid temperamentProfile
    When the tournament catalogue is inspected
    Then every player in every Ryder Cup tournament has a "temperamentProfile" field
    And the value is one of: ICEBERG, STREAKY, LEVELHEADED, PEAKER, DEFENSIVE, COMBUSTIBLE

  ---

  ## Data shape — B-tier attributes

  @players-data
  Scenario Outline: Every Ryder Cup player has a valid B-tier attribute
    When the tournament catalogue is inspected
    Then every player in every Ryder Cup tournament has a numeric "<attr>" between 1 and 10

    Examples:
      | attr              |
      | driving           |
      | irons             |
      | short_game        |
      | putting           |
      | recovery          |
      | bunkers           |
      | course_management |
      | shot_variation    |

  ---

  ## SKILL derivation

  @players-data
  Scenario: SKILL is not stored on the player — it is derived from B-tier
    When the tournament catalogue is inspected
    Then no player in any Ryder Cup tournament has a stored "skill" field

  @players-data
  Scenario: Computed SKILL is within valid range for all Ryder Cup players
    When SKILL is computed for every player in every Ryder Cup tournament
    Then every computed SKILL value is between 0 and 100

  ---

  ## Data shape — matchPlayDays

  @players-data
  Scenario: Every Ryder Cup player has matchPlaySessions for all 5 sessions
    When the tournament catalogue is inspected
    Then every player in every Ryder Cup tournament has a "matchPlaySessions" array with exactly 5 entries
    And every matchPlaySession has a non-empty "format"

  @players-data
  Scenario: Active matchPlayDays have opponent and historical result
    When the tournament catalogue is inspected
    Then every matchPlayDay where format is not "ABSENT" has a non-empty "opponent"
    And every matchPlayDay where format is not "ABSENT" has a non-empty "historicalResult"

  @players-data
  Scenario: Every Ryder Cup player has a team assignment
    When the tournament catalogue is inspected
    Then every player in every Ryder Cup tournament has a "team" of "EUR" or "USA"

  ---

  ## Player counts per tournament

  @players-data
  Scenario Outline: Ryder Cup tournament has minimum player count per team
    When the tournament catalogue is inspected
    Then tournament "<id>" has at least <eur_min> players with team "EUR"
    And tournament "<id>" has at least <usa_min> players with team "USA"

    Examples:
      | id             | eur_min | usa_min |
      | medinah_2012   | 6       | 2       |
      | kiawah_1991    | 3       | 2       |
      | brookline_1999 | 3       | 2       |

  ---

  ## Named players present

  @players-data
  Scenario Outline: Named player is present in the correct tournament with correct team
    When the tournament catalogue is inspected
    Then tournament "<tournament>" contains a player with id "<player_id>"
    And that player has team "<team>"

    Examples:
      | tournament     | player_id    | team |
      | medinah_2012   | poulter      | EUR  |
      | medinah_2012   | garcia       | EUR  |
      | medinah_2012   | rose         | EUR  |
      | medinah_2012   | mcilroy      | EUR  |
      | medinah_2012   | kaymer       | EUR  |
      | medinah_2012   | donald       | EUR  |
      | medinah_2012   | molinari     | EUR  |
      | medinah_2012   | westwood_12  | EUR  |
      | medinah_2012   | tiger_12     | USA  |
      | medinah_2012   | mickelson_12 | USA  |
      | kiawah_1991    | langer_91    | EUR  |
      | kiawah_1991    | seve_91      | EUR  |
      | kiawah_1991    | faldo_91     | EUR  |
      | kiawah_1991    | monty_91     | EUR  |
      | kiawah_1991    | irwin_91     | USA  |
      | kiawah_1991    | calcavecchia | USA  |
      | kiawah_1991    | couples_91   | USA  |
      | brookline_1999 | olazabal_99  | EUR  |
      | brookline_1999 | clarke_99    | EUR  |
      | brookline_1999 | westwood_99  | EUR  |
      | brookline_1999 | monty_99     | EUR  |
      | brookline_1999 | leonard      | USA  |
      | brookline_1999 | mickelson_99 | USA  |

  ---

  ## UI — player card (@claude — manual verification)

  @claude
  Scenario Outline: Ryder Cup player card shows A-tier attribute with label and value
    Given the player has selected a Ryder Cup tournament
    When a player card renders
    Then the card shows "<label>" with a numeric value

    Examples:
      | label       |
      | SKILL       |
      | BOTTLE      |
      | EGO         |
      | TEMPERAMENT |
      | SHAME       |

  @claude
  Scenario Outline: Ryder Cup player card shows B-tier attribute with label and value
    Given the player has selected a Ryder Cup tournament
    When a player card renders
    Then the card shows "<label>" with a numeric value

    Examples:
      | label             |
      | DRIVING           |
      | IRONS             |
      | SHORT GAME        |
      | PUTTING           |
      | RECOVERY          |
      | BUNKERS           |
      | COURSE MANAGEMENT |
      | SHOT VARIATION    |

  @claude
  Scenario: Ryder Cup player card shows team badge
    Given the player has selected a Ryder Cup tournament
    When a player card renders
    Then the card shows the player's team badge — "EUR" or "USA"

  @claude
  Scenario: Ryder Cup player picker groups players by team
    Given the player has selected a Ryder Cup tournament
    When the player grid renders
    Then players are grouped under a "EUROPE" heading and a "USA" heading

  @claude
  Scenario: Non-Ryder-Cup tournament shows flat player grid with no attributes
    Given the player has selected a stroke play tournament
    When the player grid renders
    Then players are shown in a flat grid with no team headings
    And no attribute rows are shown on player cards

  ---

  ## In-game HUD — live attributes (@claude — manual verification)

  @claude
  Scenario Outline: HUD shows current A-tier attribute value during Ryder Cup round
    Given the player is in a Ryder Cup round
    When the HUD renders
    Then the HUD shows "<label>" with a numeric value

    Examples:
      | label       |
      | SKILL       |
      | BOTTLE      |
      | EGO         |
      | TEMPERAMENT |
      | SHAME       |

  @claude
  Scenario Outline: HUD shows current B-tier attribute value during Ryder Cup round
    Given the player is in a Ryder Cup round
    When the HUD renders
    Then the HUD shows "<label>" with a numeric value

    Examples:
      | label             |
      | DRIVING           |
      | IRONS             |
      | SHORT GAME        |
      | PUTTING           |
      | RECOVERY          |
      | BUNKERS           |
      | COURSE MANAGEMENT |
      | SHOT VARIATION    |
