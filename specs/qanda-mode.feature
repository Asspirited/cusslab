Feature: QandA mode
  Users ask questions of the panel from a setting derived from match state
  The user name is required and persists until changed
  Name is pre-filled from the last session if available
  Up to 6 characters can be selected to respond
  In QandA mode the ANCHOR COLOUR CHARACTER distinction dissolves

  Background:
    Given the application is loaded
    And the user has selected the "darts" panel
    And the "At the Oche" tab is active

  Scenario: Name field is pre-filled from last session when available
    Given the user previously entered the name "Dave" in a prior session
    Then the name field contains "Dave"

  Scenario: Name field is empty on first ever use
    Given no prior session name exists
    Then the name field is empty
    And the name field has placeholder text "Your name..."

  Scenario: Name persists across multiple questions within a session
    Given the user has entered their name "Dave"
    And the user has submitted the question "Who's the greatest?"
    When the user submits a second question "What about van Gerwen?"
    Then the name field still contains "Dave"
    And both responses are visible in the conversation

  Scenario: User can edit their name at any time and new name takes effect immediately
    Given the user has entered their name "Dave"
    And the user has submitted a question
    When the user changes their name to "Sharon"
    And the user submits another question
    Then the second response addresses "Sharon"
    And the first response is still visible addressing "Dave"

  Scenario Outline: Submission is blocked when required input is missing
    Given the submission state is "<state>"
    When the user attempts to submit
    Then no API call is made
    And the error message "<error>" is displayed

    Examples:
      | state                                | error                      |
      | no name entered                      | Enter your name            |
      | name entered no characters selected  | Select at least one pundit |
      | name and characters empty question   | Enter a question           |

  Scenario: Up to 6 characters can be selected for QandA mode
    Given all 11 darts characters are available
    When the user selects 6 characters
    Then all 6 are marked as selected
    And no further characters can be selected
    And a hint "Max 6 pundits" is visible

  Scenario Outline: Setting is derived from match state across all panels
    Given the user has selected the "<panel>" panel
    And the match state is "<state>"
    Then the derived setting is "<setting>"
    And the setting label "<setting>" is visible in the interface

    Examples:
      | panel    | state                   | setting                |
      | golf     | no round in progress    | Driving Range          |
      | golf     | hole 1 tee shot pending | 1st Tee                |
      | golf     | hole 18 final round     | 18th Green             |
      | football | pre-match               | Desk by the Cornerflag |
      | football | half time               | Pitch Side             |
      | football | full time               | Press Conference       |
      | cricket  | between overs           | Commentary Box         |
      | cricket  | wicket just fallen      | Pavilion Steps         |
      | darts    | no match in progress    | At the Oche            |
      | darts    | mid-leg                 | At the Oche            |
      | darts    | match complete          | Players Lounge         |
