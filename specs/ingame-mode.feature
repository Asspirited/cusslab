Feature: In-game mode shared function across all panels
  In-game mode tracks live match state and routes moment types to characters
  3 minimum and 4 maximum characters selected for in-game mode
  At least 1 selected character must have the ANCHOR commentary role
  Setting is derived from match state never chosen by the user
  ANCHOR introduces moments COLOUR reacts technically CHARACTER reacts personally
  Characters respond across three time horizons

  Background:
    Given the application is loaded
    And the user has selected the "darts" panel
    And the "Watching the Oche" tab is active

  Scenario: In-game mode cannot start without at least one ANCHOR selected
    Given 3 characters are selected
    And none of the selected characters have the ANCHOR commentary role
    When the user attempts to start the match
    Then no match is started
    And the error message "Select at least one anchor commentator" is displayed

  Scenario: In-game mode cannot start with fewer than 3 characters selected
    Given 2 characters are selected including 1 ANCHOR
    When the user attempts to start the match
    Then no match is started
    And the error message "Select 3 or 4 pundits for the commentary booth" is displayed

  Scenario: ANCHOR introduces moment before COLOUR or CHARACTER responds
    Given the selected characters include 1 ANCHOR and 2 COLOUR
    When any moment type fires
    Then the ANCHOR responds first with scene-setting
    And COLOUR or CHARACTER responds after

  Scenario Outline: Moment type routes to primary instigator when selected
    Given the selected characters include "<primary>"
    When the moment type "<moment_type>" fires
    Then "<primary>" responds as colour or character after the ANCHOR introduction

    Examples:
      | moment_type          | primary      |
      | ONE_EIGHTY           | Sid Waddell  |
      | HIGH_SCORE           | Wayne Mardle |
      | STANDARD             | Wayne Mardle |
      | CHECKOUT_HIT         | Eric Bristow |
      | CHECKOUT_BUST        | John Lowe    |
      | CHECKOUT_ATTEMPT     | John Lowe    |
      | NINE_DARTER_POSSIBLE | Sid Waddell  |
      | NINE_DARTER_BLOWN    | John Lowe    |
      | MATCH_WON            | Sid Waddell  |

  Scenario Outline: Moment type routes to fallback when primary is not selected
    Given the selected characters do not include "<primary>"
    And the selected characters include "<fallback>"
    When the moment type "<moment_type>" fires
    Then "<fallback>" responds as colour or character after the ANCHOR introduction

    Examples:
      | moment_type      | primary      | fallback       |
      | ONE_EIGHTY       | Sid Waddell  | Wayne Mardle   |
      | HIGH_SCORE       | Wayne Mardle | Rod Harrington |
      | STANDARD         | Wayne Mardle | John Lowe      |
      | CHECKOUT_HIT     | Eric Bristow | John Lowe      |
      | CHECKOUT_BUST    | John Lowe    | Eric Bristow   |
      | CHECKOUT_ATTEMPT | John Lowe    | Wayne Mardle   |
      | NINE_DARTER_BLOWN| John Lowe    | Eric Bristow   |

  Scenario Outline: Moment type routes to weighted random when neither primary nor fallback selected
    Given the selected characters do not include the primary for "<moment_type>"
    And the selected characters do not include any fallback for "<moment_type>"
    When the moment type "<moment_type>" fires
    Then the responding character is selected by affinity weighting from the selected pool

    Examples:
      | moment_type      |
      | ONE_EIGHTY       |
      | HIGH_SCORE       |
      | STANDARD         |
      | CHECKOUT_HIT     |
      | CHECKOUT_BUST    |
      | CHECKOUT_ATTEMPT |

  Scenario: NINE_DARTER_POSSIBLE silences all but ANCHOR and one eligible character
    Given the selected characters have affinity 0.0 for "NINE_DARTER_POSSIBLE"
    When the moment type "NINE_DARTER_POSSIBLE" fires
    Then no colour or character responds
    And the crowd pressure state is set to "BEDLAM"
    And the ANCHOR delivers one word only

  Scenario: MATCH_WON is a full panel moment all selected characters respond
    When the moment type "MATCH_WON" fires
    Then all selected characters respond
    And the ANCHOR opens
    And the highest affinity character for "MATCH_WON" responds first among colour and character
    And the derived setting shifts to "Players Lounge"

  Scenario Outline: Setting is derived from match state for each panel
    Given the user has selected the "<panel>" panel
    And the "<ingame_tab>" tab is active
    And the match state is "<match_state>"
    Then the derived setting is "<expected_setting>"

    Examples:
      | panel    | ingame_tab              | match_state     | expected_setting       |
      | golf     | Out on the Fairways...  | hole 1 tee shot | 1st Tee                |
      | golf     | Out on the Fairways...  | hole 18 final   | 18th Green             |
      | football | Up in the Gantry        | kick off        | Desk by the Cornerflag |
      | football | Up in the Gantry        | half time       | Pitch Side             |
      | football | Up in the Gantry        | full time       | Press Conference       |
      | cricket  | Test Match Very Special | between overs   | Commentary Box         |
      | cricket  | Test Match Very Special | wicket fallen   | Pavilion Steps         |
      | darts    | Watching the Oche       | mid-leg         | At the Oche            |
      | darts    | Watching the Oche       | match complete  | Players Lounge         |

  Scenario: Switching panels mid-match preserves match state on return
    Given a darts match is in progress with score "2 sets to 1"
    When the user switches to the "golf" panel
    And the user switches back to the "darts" panel
    Then the match state still shows "2 sets to 1"
    And the match continues from where it left off
