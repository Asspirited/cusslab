Feature: Premonition Engine PREDICTION mode
  A commentator commits to a specific evidence-based prediction
  naming a precise outcome before it occurs
  The prediction resolves immediately on the next action
  Truth-teller characters call out false retrospective claims on this mode

  Background:
    Given the application is loaded
    And a match is in progress

  Scenario Outline: PREDICTION affinity determines which characters can commit
    Given "<character>" is selected
    And the match presents a calculable outcome situation
    When the premonition engine evaluates the moment
    Then PREDICTION commit eligibility for "<character>" is "<eligible>"

    Examples:
      | character      | eligible |
      | John Lowe      | true     |
      | John Part      | true     |
      | Rod Studd      | true     |
      | Rod Harrington | true     |
      | Sid Waddell    | false    |

  Scenario: PREDICTION commit names a specific outcome with cited basis
    Given "John Lowe" is selected
    And player 1 is on a checkout finish
    When a PREDICTION commit fires for "John Lowe"
    Then the commit response names a specific checkout route
    And the commit response cites the mathematical basis

  Scenario Outline: PREDICTION resolves immediately on the next action
    Given a PREDICTION commit is active for "John Lowe"
    And Lowe predicted "<predicted_route>"
    When the player takes "<actual_route>"
    Then the resolution type is "<resolution>"

    Examples:
      | predicted_route | actual_route    | resolution |
      | T20 D18 for 96  | T20 D18 for 96  | EXACT      |
      | T20 D18 for 96  | T19 D20 for 96  | PARTIAL    |
      | T20 D18 for 96  | single 18 leave | MISS       |

  Scenario Outline: PREDICTION resolution applies the correct aftermath state
    Given a PREDICTION commit resolves as "<resolution>"
    Then the character's aftermath state is "<aftermath>"

    Examples:
      | resolution | aftermath      |
      | EXACT      | GLORY          |
      | PARTIAL    | PARTIAL_CREDIT |
      | MISS       | HAUNTED        |

  Scenario Outline: Cross-panel PREDICTION triggers by sport
    Given the user has selected the "<panel>" panel
    And the match state is "<condition>"
    When the premonition engine evaluates the moment
    Then a PREDICTION commit opportunity is available

    Examples:
      | panel    | condition                             |
      | darts    | player on checkout finish             |
      | darts    | player on 170 with three darts        |
      | golf     | player facing 15ft putt               |
      | golf     | player choosing club on tight fairway |
      | football | penalty awarded                       |
      | football | free kick in shooting range           |
      | cricket  | DRS review triggered                  |
      | cricket  | tail-ender facing short ball          |

  Scenario: Two conflicting PREDICTION commits escalate to COLLECTIVE_CALL
    Given "John Lowe" has made a PREDICTION commit
    And "Wayne Mardle" is selected
    And Mardle's prediction conflicts with Lowe's
    When the premonition engine evaluates Mardle's eligibility
    Then the mode escalates to COLLECTIVE_CALL
    And both commits are linked in session state
