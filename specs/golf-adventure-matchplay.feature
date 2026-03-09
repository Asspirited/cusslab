Feature: Golf Adventure — MatchPlayService
  MatchPlayService owns all Ryder Cup match-play domain logic.
  No DOM. No API. Pure functions: score formatting, context building,
  situation text, in-flight leaderboard, commentary addendum.

  Background:
    Given the MatchPlayService module is loaded

  # ── Score formatting ──────────────────────────────────────────────────────

  Scenario Outline: formatLive renders match standing for mid-game HUD
    When formatLive is called with score <score>
    Then the MPS result is "<expected>"

    Examples:
      | score | expected    |
      | 0     | All Square  |
      | 1     | 1 UP        |
      | 3     | 3 UP        |
      | -1    | 1 DOWN      |
      | -4    | 4 DOWN      |

  Scenario Outline: formatResult renders final match outcome
    When formatResult is called with score <score> and holesLeft <holesLeft>
    Then the MPS result is "<expected>"

    Examples:
      | score | holesLeft | expected |
      | 0     | 0         | Halved   |
      | 1     | 0         | 1 UP     |
      | 3     | 0         | 3 UP     |
      | 2     | 1         | 2&1      |
      | 3     | 2         | 3&2      |
      | 4     | 3         | 4&3      |
      | -2    | 1         | 2&1      |

  # ── Context building ──────────────────────────────────────────────────────

  Scenario: buildContext returns null for non-Ryder tournaments
    Given a game state with tournament type "major"
    When buildContext is called
    Then the MPS result is null

  Scenario: buildContext returns null when player has no matchPlayDays
    Given a Ryder Cup game state with a player with no matchPlayDays
    When buildContext is called
    Then the MPS result is null

  Scenario: buildContext returns full match context for Ryder Cup foursomes day
    Given a Ryder Cup game state on day 0 with matchPlayDays:
      | day | format    | partner           | opponent                        | historicalResult       | team |
      | 0   | FOURSOMES | Miguel Angel Jimenez | Phil Mickelson / Tom Lehman  | Olazabal & Jimenez lost 1 DOWN | EUR  |
    And the match play score is 0
    And 1 hole has been played today
    When buildContext is called
    Then the context format is "FOURSOMES"
    And the context partner is "Miguel Angel Jimenez"
    And the context opponent is "Phil Mickelson / Tom Lehman"
    And the context historicalResult is "Olazabal & Jimenez lost 1 DOWN"
    And the context team is "EUR"
    And the context liveLine is "All Square"
    And the context holesPlayed is 1
    And the context holesLeft is 2

  Scenario: buildContext returns singles context with no partner
    Given a Ryder Cup game state on day 2 with matchPlayDays:
      | day | format  | opponent        | historicalResult       | team |
      | 2   | SINGLES | Justin Leonard  | Leonard won 1 UP on 17 | EUR  |
    And the match play score is -1
    When buildContext is called
    Then the context format is "SINGLES"
    And the context partner is null
    And the context liveLine is "1 DOWN"

  # ── Situation text ────────────────────────────────────────────────────────

  Scenario: buildSituation returns null for non-Ryder tournaments
    Given a game state with tournament type "major"
    When buildSituation is called
    Then the MPS result is null

  Scenario: buildSituation includes tournament name not hardcoded string
    Given a Ryder Cup game state with tournament name "The Battle of Brookline"
    And the player is in SINGLES on day 2 against "Justin Leonard"
    When buildSituation is called
    Then the MPS result contains "The Battle of Brookline"
    And the MPS result does not contain "Miracle at Medinah"

  Scenario: buildSituation includes format label for foursomes
    Given a Ryder Cup game state with format "FOURSOMES" and partner "Jimenez"
    When buildSituation is called
    Then the MPS result contains "foursomes (alternate shot)"
    And the MPS result contains "Jimenez"

  Scenario: buildSituation includes historical result when present
    Given a Ryder Cup game state with historicalResult "Leonard won 1 UP on 17"
    When buildSituation is called
    Then the MPS result contains "Leonard won 1 UP on 17"

  Scenario: buildSituation uses team to set team note for European player
    Given a Ryder Cup game state with player team "EUR"
    When buildSituation is called
    Then the MPS result contains "Europe needs every point"

  Scenario: buildSituation uses team to set team note for USA player
    Given a Ryder Cup game state with player team "USA"
    When buildSituation is called
    Then the MPS result contains "USA needs every point"

  # ── In-flight leaderboard ─────────────────────────────────────────────────

  Scenario: buildInflightLeaderboard returns null when no parallelMatches defined
    Given a Ryder Cup tournament with no parallelMatches data
    When buildInflightLeaderboard is called for day 0 holeIdx 0
    Then the MPS result is null

  Scenario: buildInflightLeaderboard returns rows for each parallel match
    Given a Ryder Cup tournament with parallelMatches on day 2:
      | match                          | scores      | teamA |
      | Faldo vs Couples               | [1, 0, -1]  | EUR   |
      | Montgomerie vs Hoch            | [0, 1, 2]   | EUR   |
      | Woosnam vs Azinger             | [-1, -1, 0] | EUR   |
    When buildInflightLeaderboard is called for day 2 holeIdx 1
    Then 3 rows are returned
    And the first row match is "Faldo vs Couples"
    And the first row score is 0
    And the first row label is "AS"

  # ── Commentary addendum ───────────────────────────────────────────────────

  Scenario: buildCommentaryAddendum returns empty string when mpCtx is null
    When buildCommentaryAddendum is called with null mpCtx
    Then the MPS result is ""

  Scenario: buildCommentaryAddendum includes format and opponent
    Given an mpCtx with format "FOURBALLS" partner "Garcia" opponent "Love / Maggert" and score 1 holesLeft 2
    When buildCommentaryAddendum is called
    Then the MPS result contains "Fourballs"
    And the MPS result contains "Love / Maggert"

  Scenario: buildCommentaryAddendum includes historical result when present
    Given an mpCtx with historicalResult "Leonard won 1 UP on 17"
    When buildCommentaryAddendum is called
    Then the MPS result contains "Leonard won 1 UP on 17"

  Scenario: buildCommentaryAddendum omits historical result block when absent
    Given an mpCtx with no historicalResult
    When buildCommentaryAddendum is called
    Then the MPS result does not contain "HISTORICAL MATCH RESULT"
