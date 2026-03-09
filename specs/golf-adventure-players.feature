# Golf Adventure — Ryder Cup Player Selection
# Feature: specs/golf-adventure-players.feature
# BL-022: Be Any Player mode — expanded roster + player attributes
# Three Amigos approved: 2026-03-09

@golf-adventure-players
Feature: Ryder Cup Player Selection

  Players can be selected from an expanded roster for each Ryder Cup tournament.
  Every selectable player has matchPlayDays for all 3 days and 8 displayed attributes.
  4 skill attributes (DRIVING, IRONS, SHORT GAME, PUTTING) + 4 comedy attributes (BOTTLE, SPITE, SHAME, EGO).
  Internal-only attributes (recovery, bunkers, course_management, shot_variation) drive future mechanics.
  A day where the player sat out team matches uses format "ABSENT" — no opponent required.

  Background:
    Given the golf adventure data modules are loaded

  ---

  ## Data shape — displayed attributes

  @players-data
  Scenario: Every Ryder Cup player has all 4 displayed skill attributes
    When the tournament catalogue is inspected
    Then every player in every Ryder Cup tournament has a numeric "driving" attribute between 1 and 10
    And every player in every Ryder Cup tournament has a numeric "irons" attribute between 1 and 10
    And every player in every Ryder Cup tournament has a numeric "short_game" attribute between 1 and 10
    And every player in every Ryder Cup tournament has a numeric "putting" attribute between 1 and 10

  @players-data
  Scenario: Every Ryder Cup player has all 4 comedy attributes
    When the tournament catalogue is inspected
    Then every player in every Ryder Cup tournament has a numeric "bottle" attribute between 1 and 10
    And every player in every Ryder Cup tournament has a numeric "spite" attribute between 1 and 10
    And every player in every Ryder Cup tournament has a numeric "shame" attribute between 1 and 10
    And every player in every Ryder Cup tournament has a numeric "ego" attribute between 1 and 10

  @players-data
  Scenario: Every Ryder Cup player has all 4 internal skill attributes
    When the tournament catalogue is inspected
    Then every player in every Ryder Cup tournament has a numeric "recovery" attribute between 1 and 10
    And every player in every Ryder Cup tournament has a numeric "bunkers" attribute between 1 and 10
    And every player in every Ryder Cup tournament has a numeric "course_management" attribute between 1 and 10
    And every player in every Ryder Cup tournament has a numeric "shot_variation" attribute between 1 and 10

  ---

  ## Data shape — matchPlayDays

  @players-data
  Scenario: Every Ryder Cup player has matchPlayDays for all 3 days
    When the tournament catalogue is inspected
    Then every player in every Ryder Cup tournament has a "matchPlayDays" array with exactly 3 entries
    And every matchPlayDay has a non-empty "format"
    And every active matchPlayDay has a non-empty "opponent"
    And every active matchPlayDay has a non-empty "historicalResult"

  @players-data
  Scenario: ABSENT matchPlayDay has no opponent required
    When the tournament catalogue is inspected
    Then matchPlayDays with format "ABSENT" do not require an opponent field

  @players-data
  Scenario: Every Ryder Cup player has a team assignment
    When the tournament catalogue is inspected
    Then every player in every Ryder Cup tournament has a "team" field of "EUR" or "USA"

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
      | tournament     | player_id      | team |
      | medinah_2012   | poulter        | EUR  |
      | medinah_2012   | garcia         | EUR  |
      | medinah_2012   | rose           | EUR  |
      | medinah_2012   | mcilroy        | EUR  |
      | medinah_2012   | kaymer         | EUR  |
      | medinah_2012   | donald         | EUR  |
      | medinah_2012   | molinari       | EUR  |
      | medinah_2012   | westwood_12    | EUR  |
      | medinah_2012   | tiger_12       | USA  |
      | medinah_2012   | mickelson_12   | USA  |
      | kiawah_1991    | langer_91      | EUR  |
      | kiawah_1991    | seve_91        | EUR  |
      | kiawah_1991    | faldo_91       | EUR  |
      | kiawah_1991    | monty_91       | EUR  |
      | kiawah_1991    | irwin_91       | USA  |
      | kiawah_1991    | calcavecchia   | USA  |
      | kiawah_1991    | couples_91     | USA  |
      | brookline_1999 | olazabal_99    | EUR  |
      | brookline_1999 | clarke_99      | EUR  |
      | brookline_1999 | westwood_99    | EUR  |
      | brookline_1999 | monty_99       | EUR  |
      | brookline_1999 | leonard        | USA  |
      | brookline_1999 | mickelson_99   | USA  |

  ---

  ## UI — player picker display (@claude — manual verification)

  @claude
  Scenario: Ryder Cup player picker groups players by team
    Given the player has selected a Ryder Cup tournament
    When the player grid renders
    Then players are grouped under a "EUROPE" heading and a "USA" heading
    And EUR players appear under "EUROPE"
    And USA players appear under "USA"

  @claude
  Scenario: Player card shows 4 skill attributes with labels and values
    Given the player has selected a Ryder Cup tournament
    When a player card renders
    Then the card shows "DRIVING" with a numeric value
    And the card shows "IRONS" with a numeric value
    And the card shows "SHORT GAME" with a numeric value
    And the card shows "PUTTING" with a numeric value

  @claude
  Scenario: Player card shows 4 comedy attributes with labels and values
    Given the player has selected a Ryder Cup tournament
    When a player card renders
    Then the card shows "BOTTLE" with a numeric value
    And the card shows "SPITE" with a numeric value
    And the card shows "SHAME" with a numeric value
    And the card shows "EGO" with a numeric value

  @claude
  Scenario: Player card shows team badge
    Given the player has selected a Ryder Cup tournament
    When a player card renders
    Then the card shows the player's team badge — "EUR" or "USA"

  @claude
  Scenario: Non-Ryder-Cup tournaments do not show team grouping or attributes
    Given the player has selected a stroke play tournament
    When the player grid renders
    Then players are shown in a flat grid with no team headings
    And no attribute rows are shown on player cards
