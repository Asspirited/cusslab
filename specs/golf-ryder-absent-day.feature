Feature: Ryder Cup ABSENT day handling (MatchPlayService)
  Players who were not selected for a session are marked ABSENT in matchPlayDays.
  The game must skip ABSENT days and start on the first active day.
  firstActiveDay(player) → index of first non-ABSENT matchPlayDay, or 0 if none
  isDayAbsent(player, day) → true if matchPlayDays[day].format is "ABSENT"

  Background:
    Given the MatchPlayService module is loaded

  Scenario Outline: firstActiveDay returns the first day with an active format
    Given a ryder player with matchPlayDays formats "<formats>"
    When firstActiveDay is called on the player
    Then the firstActiveDay result is <expected>

    Examples:
      | formats                     | expected |
      | ABSENT,ABSENT,SINGLES       | 2        |
      | ABSENT,FOURBALLS,SINGLES    | 1        |
      | FOURSOMES,FOURBALLS,SINGLES | 0        |
      | FOURSOMES,ABSENT,SINGLES    | 0        |

  Scenario: firstActiveDay returns 0 when player has no matchPlayDays
    Given a ryder player with no matchPlayDays
    When firstActiveDay is called on the player
    Then the firstActiveDay result is 0

  Scenario Outline: isDayAbsent returns true only for ABSENT format
    Given a ryder player with matchPlayDays formats "<formats>"
    When isDayAbsent is called for day <day>
    Then the isDayAbsent result is <expected>

    Examples:
      | formats                     | day | expected |
      | ABSENT,ABSENT,SINGLES       | 0   | true     |
      | ABSENT,ABSENT,SINGLES       | 1   | true     |
      | ABSENT,ABSENT,SINGLES       | 2   | false    |
      | FOURSOMES,FOURBALLS,SINGLES | 0   | false    |
