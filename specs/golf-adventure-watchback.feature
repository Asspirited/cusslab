Feature: Watch Back — sofa commentary strip for panel members present at tournament

  Background:
    Given the golf adventure data modules are loaded

  Scenario: Sofa strip activates when a panel member was present at the tournament
    Given GOLF_PANEL_MEMBER_IDS contains "coltart_97"
    And the tournament "valderrama_1997" has a player with id "coltart_97"
    When getSofaCommentator is called with the tournament and GOLF_PANEL_MEMBER_IDS
    Then the result is "coltart_97"

  Scenario: Sofa strip does not activate when no panel member was present
    Given the tournament "pebble_beach_2000" has no players matching GOLF_PANEL_MEMBER_IDS
    When getSofaCommentator is called with the tournament and GOLF_PANEL_MEMBER_IDS
    Then the result is null

  Scenario Outline: Reaction mode selected based on historical divergence after a hole
    When getHistoricalDivergence is called with playerScore <player> and historicalScore <historical>
    Then the divergence is "<divergence>"
    And selectReactionMode returns "<reaction_mode>"

    Examples:
      | player | historical | divergence | reaction_mode  |
      | -5     | -5         | MATCH      | CONFIRMATION   |
      | -8     | -5         | BETTER     | ENDORSEMENT    |
      | -4     | -5         | SLIGHT     | PERTURBED      |
      | -2     | -5         | CLEAR      | BEWILDERMENT   |
      | 0      | -5         | EXTREME    | IGNORANCE      |

  Scenario: Coltart's sofa pool references watching from the side at Valderrama
    Given COLTART_SOFA_POOLS contains entries for tournament "valderrama_1997"
    When any reaction mode line is retrieved for "coltart_97" at "valderrama_1997"
    Then the line does not describe Coltart as having played in a match
