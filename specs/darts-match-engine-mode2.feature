Feature: Darts match engine mode 2 — historic match UI
  Mode 2 replaces the free-form score panel with a structured historic match flow
  The user selects a real match, picks a side, and submits scores via bands
  The engine derives commentaryMode from remaining score and injects match context
  Classic era matches include ERA_LOCK so characters have no future knowledge
  AI opponent scoring is weighted to the match's ai_style description
  Match context is passed to callMoment via sessionStorage not form fields

  Background:
    Given the darts panel is open
    And mode 2 historic match engine is active

  # ─── Era toggle ──────────────────────────────────────────────────────────────

  Scenario: Era defaults to classic on load
    Then the era selector shows "CLASSIC" as active
    And only classic era matches are displayed

  Scenario: Toggling era switches to current matches
    When the user clicks the era toggle
    Then the era selector shows "CURRENT" as active
    And only current era matches are displayed

  Scenario: Toggling era again returns to classic
    Given the era is set to "CURRENT"
    When the user clicks the era toggle
    Then the era selector shows "CLASSIC" as active

  # ─── Match selection ─────────────────────────────────────────────────────────

  Scenario: Match list renders cards for the active era
    Given the era is set to "CLASSIC"
    Then at least one match card is displayed
    And each card shows the match title

  Scenario: Selecting a match highlights its card
    When the user clicks a match card
    Then that card receives the selected highlight
    And no other card is highlighted

  Scenario: Confirm match is disabled until a match is selected
    Then the "Select Match" button is disabled

  Scenario: Confirm match button enables after selection
    When the user clicks a match card
    Then the "Select Match" button is enabled

  Scenario: Confirming match moves to the side picker step
    Given the user has selected a match
    When the user clicks "Select Match"
    Then the match selection step is hidden
    And the side picker step is visible

  Scenario: Stage setter text is shown after match is confirmed
    Given the user has selected the match "botham-headingley-1981-ashes"
    When the user clicks "Select Match"
    Then the stage setter text for that match is displayed

  # ─── Side picker ─────────────────────────────────────────────────────────────

  Scenario: Side picker shows both players from the selected match
    Given the user has confirmed match "botham-headingley-1981-ashes"
    Then the side picker shows "England" and "Australia" as selectable options

  Scenario: Confirming a side moves to the score panel
    Given the user has confirmed a match
    When the user selects a side and clicks confirm
    Then the side picker step is hidden
    And the score panel step is visible

  Scenario: Selected side is stored in match state
    Given the user selects "England" as their side
    Then dtState.userSide is "England"

  # ─── Score bands ─────────────────────────────────────────────────────────────

  Scenario Outline: Score bands reflect the commentary zone for remaining score
    Given the user's remaining score is <remaining>
    Then the score bands shown are in the "<zone>" zone

    Examples:
      | remaining | zone              |
      | 501       | MOMENTUM          |
      | 171       | MOMENTUM          |
      | 170       | FINISH_TERRITORY  |
      | 100       | FINISH_TERRITORY  |
      | 61        | FINISH_TERRITORY  |
      | 60        | MAX_PRESSURE      |
      | 32        | MAX_PRESSURE      |
      | 2         | MAX_PRESSURE      |

  Scenario: MOMENTUM zone offers Ton Plus, Ton, Below Ton bands
    Given the user's remaining score is 280
    Then the available score bands include "Ton Plus"
    And the available score bands include "Ton"
    And the available score bands include "Below Ton"

  Scenario: MAX_PRESSURE zone offers finish and miss bands
    Given the user's remaining score is 40
    Then the available score bands include a checkout option
    And the available score bands include a miss option

  Scenario: Selecting a band enables the submit button
    Given the user's remaining score is 180
    When the user selects a score band
    Then the submit button is enabled

  Scenario: Submit is disabled until a band is selected
    Given the user's remaining score is 180
    Then the submit button is disabled

  # ─── commentaryMode derivation ───────────────────────────────────────────────

  Scenario Outline: commentaryMode is derived from remaining score at submit time
    Given the user's remaining score is <remaining>
    When the user submits a score band
    Then the commentaryMode passed to callMoment is "<mode>"

    Examples:
      | remaining | mode              |
      | 501       | MOMENTUM          |
      | 171       | MOMENTUM          |
      | 170       | FINISH_TERRITORY  |
      | 61        | FINISH_TERRITORY  |
      | 60        | MAX_PRESSURE      |
      | 2         | MAX_PRESSURE      |

  Scenario: commentaryMode is LEG_WON when remaining reaches zero
    Given the user's remaining score is 40
    When the user submits a band that reduces remaining to 0
    Then the commentaryMode passed to callMoment is "LEG_WON"

  # ─── ERA_LOCK ─────────────────────────────────────────────────────────────────

  Scenario: Classic era matches include ERA_LOCK in the system prompt
    Given the user has selected a classic era match with year "1981"
    When the user submits a score
    Then the system prompt sent to the worker contains "ERA LOCK"
    And the era_lock year in the prompt is "1981"

  Scenario: Current era matches do not include ERA_LOCK
    Given the user has selected a current era match
    When the user submits a score
    Then the system prompt sent to the worker does not contain "ERA LOCK"

  # ─── AI opponent scoring ──────────────────────────────────────────────────────

  Scenario: AI score is generated on each user submission
    When the user submits a score band
    Then an AI opponent score is generated and displayed on the scoreboard

  Scenario: AI score is context-sensitive to remaining score
    Given the AI opponent's remaining score is 170
    When an AI score is generated
    Then the AI score does not exceed the opponent's remaining score

  Scenario: AI scoring reflects the match ai_style description
    Given the user has selected match "botham-headingley-1981-ashes"
    And the match ai_style is "dominant, well-organised"
    When AI scores are generated over multiple legs
    Then the AI scoring pattern reflects disciplined, controlled play
    And scoring deteriorates when comeback triggers are active

  # ─── Hot triggers ─────────────────────────────────────────────────────────────

  Scenario: BIG_FISH_ON_BOARD badge appears when opponent remaining reaches 170
    Given the AI opponent's remaining score is 200
    When the AI opponent scores enough to reach exactly 170
    Then the "BIG FISH" context badge is displayed

  Scenario: NINE_DARTER_POSSIBLE badge appears after two 180 visits
    Given the user's remaining score is 501
    When the user submits a "180" band
    And the user's remaining score becomes 321
    And the user submits a "180" band again
    Then the "NINE DARTER" context badge is displayed

  Scenario: COMEBACK badge appears when user is trailing significantly
    Given the AI opponent has won 2 legs in the current match
    And the user has won 0 legs
    When the user submits any score
    Then the "COMEBACK" context badge is displayed

  # ─── sessionStorage handoff ───────────────────────────────────────────────────

  Scenario: Submitting a score writes match context to sessionStorage
    When the user submits a score band
    Then sessionStorage key "dt-match-ctx" contains a JSON object
    And the JSON includes matchId, commentaryMode, userSide, userRemaining, aiRemaining, legNum

  Scenario: callMoment reads and removes the sessionStorage context
    Given sessionStorage key "dt-match-ctx" contains a valid match context JSON
    When callMoment is invoked
    Then it reads the match context from sessionStorage
    And it removes "dt-match-ctx" from sessionStorage

  Scenario: callMoment falls back to form fields when sessionStorage is absent
    Given sessionStorage key "dt-match-ctx" is not present
    When callMoment is invoked
    Then it reads player names from the dt-p1 and dt-p2 form fields
    And it reads the moment type from the dt-moment form field

  Scenario: Stage setter text is injected into the system prompt at submission
    Given the user has selected match "botham-headingley-1981-ashes"
    When the user submits a score
    Then the system prompt contains the stage setter text for that match

  # ─── Direct entry ─────────────────────────────────────────────────────────────

  Scenario: User can enter an exact score directly instead of selecting a band
    Given the user's remaining score is 200
    When the user types "143" into the direct entry field
    Then the submitted score is 143
    And the commentaryMode is "MOMENTUM"

  Scenario: Direct entry score that busts is rejected
    Given the user's remaining score is 40
    When the user types "41" into the direct entry field and submits
    Then a bust is detected
    And the remaining score is restored to 40
