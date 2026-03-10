Feature: Ryder Cup — 5-session structure, team score, user match in totals (BL-112)
  The Ryder Cup restructures from 3 days to 5 sessions:
    Session 0: Day 1 Morning — Foursomes
    Session 1: Day 1 Afternoon — Fourballs
    Session 2: Day 2 Morning — Fourballs
    Session 3: Day 2 Afternoon — Foursomes
    Session 4: Day 3 — Singles
  Players absent from a session have matchPlaySessions[n].format === "ABSENT".
  Team score accumulates across all sessions.
  User's match is always counted in session team totals regardless of parallelMatches.

  Background:
    Given the MatchPlayService module is loaded

  # ── Session structure ────────────────────────────────────────────────────────

  Scenario: Ryder Cup tournament session labels cover all 5 sessions
    Given a Ryder Cup tournament with sessionLabels
    Then the ryder session label 0 is "Day 1 Morning — Foursomes"
    And the ryder session label 1 is "Day 1 Afternoon — Fourballs"
    And the ryder session label 2 is "Day 2 Morning — Fourballs"
    And the ryder session label 3 is "Day 2 Afternoon — Foursomes"
    And the ryder session label 4 is "Day 3 — Singles"

  # ── firstActiveSession ───────────────────────────────────────────────────────

  Scenario Outline: Ryder Cup firstActiveSession returns first non-ABSENT session index
    Given a ryder player with matchPlaySessions formats "<formats>"
    When ryder firstActiveSession is called
    Then the ryder firstActiveSession result is <expected>

    Examples:
      | formats                                           | expected |
      | FOURSOMES,FOURBALLS,FOURBALLS,FOURSOMES,SINGLES   | 0        |
      | ABSENT,FOURBALLS,FOURBALLS,FOURSOMES,SINGLES      | 1        |
      | ABSENT,ABSENT,FOURBALLS,FOURSOMES,SINGLES         | 2        |
      | ABSENT,ABSENT,ABSENT,ABSENT,SINGLES               | 4        |
      | ABSENT,FOURBALLS,ABSENT,ABSENT,SINGLES            | 1        |

  Scenario: Ryder Cup firstActiveSession returns 0 when player has no matchPlaySessions
    Given a ryder player with no matchPlaySessions
    When ryder firstActiveSession is called
    Then the ryder firstActiveSession result is 0

  # ── isSessionAbsent ──────────────────────────────────────────────────────────

  Scenario Outline: Ryder Cup isSessionAbsent returns true only for ABSENT sessions
    Given a ryder player with matchPlaySessions formats "<formats>"
    When ryder isSessionAbsent is called for session <session>
    Then the ryder isSessionAbsent result is <expected>

    Examples:
      | formats                                         | session | expected |
      | ABSENT,FOURBALLS,ABSENT,ABSENT,SINGLES          | 0       | true     |
      | ABSENT,FOURBALLS,ABSENT,ABSENT,SINGLES          | 1       | false    |
      | ABSENT,FOURBALLS,ABSENT,ABSENT,SINGLES          | 2       | true     |
      | ABSENT,FOURBALLS,ABSENT,ABSENT,SINGLES          | 4       | false    |
      | FOURSOMES,FOURBALLS,FOURBALLS,FOURSOMES,SINGLES | 0       | false    |

  # ── Team score accumulation ──────────────────────────────────────────────────

  Scenario: Ryder Cup addSessionToTeamScore adds session result to running total
    Given a ryder team score of EUR 2.5 USA 1.5
    When ryder addSessionToTeamScore is called with EUR 2 USA 1
    Then the ryder team score EUR is 4.5
    And the ryder team score USA is 2.5

  Scenario: Ryder Cup addSessionToTeamScore handles half points from halved matches
    Given a ryder team score of EUR 0 USA 0
    When ryder addSessionToTeamScore is called with EUR 1.5 USA 1.5
    Then the ryder team score EUR is 1.5
    And the ryder team score USA is 1.5

  Scenario: Ryder Cup addSessionToTeamScore is additive not replacing
    Given a ryder team score of EUR 3 USA 5
    When ryder addSessionToTeamScore is called with EUR 0 USA 3
    Then the ryder team score EUR is 3
    And the ryder team score USA is 8

  # ── User match in session totals (WL-109 fix) ────────────────────────────────

  Scenario: Ryder Cup buildEndOfSessionLeaderboard counts user match even when not in parallelMatches
    Given a Ryder Cup session with 3 parallel matches not including Ian Poulter
    And I am playing as Ian Poulter (EUR) with matchPlayScore 1 holesLeft 0
    When ryder buildEndOfSessionLeaderboard is called
    Then 4 ryder match rows are returned
    And exactly one ryder match row has isUser true
    And ryder EUR total is 1 more than the sum of the 3 parallel match EUR points

  Scenario: Ryder Cup buildEndOfSessionLeaderboard user loss counted for USA
    Given a Ryder Cup session with 3 parallel matches not including Ian Poulter
    And I am playing as Ian Poulter (EUR) with matchPlayScore -2 holesLeft 0
    When ryder buildEndOfSessionLeaderboard is called
    Then ryder USA total is 1 more than the sum of the 3 parallel match USA points

  Scenario: Ryder Cup buildEndOfSessionLeaderboard halved user match adds 0.5 to each team
    Given a Ryder Cup session with 3 parallel matches not including Ian Poulter
    And I am playing as Ian Poulter (EUR) with matchPlayScore 0 holesLeft 0
    When ryder buildEndOfSessionLeaderboard is called
    Then ryder EUR total includes 0.5 from the user match
    And ryder USA total includes 0.5 from the user match

  Scenario: Ryder Cup buildEndOfSessionLeaderboard with null playerName returns only parallelMatch rows
    Given a Ryder Cup session with 3 parallel matches not including Ian Poulter
    When ryder buildEndOfSessionLeaderboard is called with no player name
    Then 3 ryder match rows are returned
    And 0 ryder match rows have isUser true

  # ── Rest screen for ABSENT sessions ──────────────────────────────────────────

  Scenario: Ryder Cup buildRestScreenData returns session label and match rows
    Given a Ryder Cup session 2 with 3 parallel matches and session label "Day 2 Morning — Fourballs"
    When ryder buildRestScreenData is called for session 2
    Then the ryder rest screen title is "Day 2 Morning — Fourballs"
    And the ryder rest screen match row count is 3
    And 0 ryder rest screen rows have isUser true

  Scenario: Ryder Cup buildRestScreenData includes EUR and USA totals from parallel matches
    Given a Ryder Cup session 2 with parallel matches:
      | match                         | scores    | teamA |
      | Westwood/Donald vs Watson/Sim | [0, 1, 1] | EUR   |
      | Molinari/Garcia vs Dufner/Joh | [1, 1, 2] | EUR   |
      | Rose/Kaymer vs Woods/Kuchar   | [0, 0, 1] | EUR   |
    When ryder buildRestScreenData is called for session 2
    Then the ryder rest screen EUR total is 3
    And the ryder rest screen USA total is 0
