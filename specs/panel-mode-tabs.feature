Feature: Panel mode tabs
  Each sports panel has two modes QandA and In-Game
  The modes are tabs within the panel not separate panels
  Switching tabs preserves the current panel session state
  Switching panels resets both mode states

  Background:
    Given the application is loaded
    And the user has selected the "darts" panel

  Scenario Outline: Each panel renders the correct mode tab labels
    Given the user has selected the "<panel>" panel
    Then I see a tab labelled "<qanda_tab>"
    And I see a tab labelled "<ingame_tab>"
    And the "<qanda_tab>" tab is active by default

    Examples:
      | panel    | qanda_tab              | ingame_tab              |
      | golf     | On the Course          | Out on the Fairways...  |
      | football | Desk by the Cornerflag | Up in the Gantry        |
      | cricket  | At the Crease          | Test Match Very Special |
      | darts    | At the Oche            | Watching the Oche       |

  Scenario Outline: Switching mode tabs renders the correct interface
    When I click the "<tab>" tab
    Then the "<visible>" interface is visible
    And the "<hidden>" interface is not visible

    Examples:
      | tab               | visible | hidden |
      | Watching the Oche | ingame  | qanda  |
      | At the Oche       | qanda   | ingame |

  Scenario: QandA session state is preserved when switching to In-Game and back
    Given the user has entered their name "Dave"
    And the user has asked a question
    When I click the "Watching the Oche" tab
    And I click the "At the Oche" tab
    Then the name field still contains "Dave"
    And the previous response is still visible

  Scenario: Switching panels resets both mode states
    Given the user has entered their name "Dave"
    And the user has asked a question on the "darts" panel
    When I switch to the "golf" panel
    And I switch back to the "darts" panel
    Then the name field is empty
    And no previous responses are visible
