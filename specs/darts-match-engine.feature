Feature: Darts match engine
  The match engine tracks real match state sets legs visits scores
  It derives moment types from state transitions
  Characters respond across three time horizons
  It detects checkout opportunities and bust conditions
  It fires nine-darter and big fish alerts when conditions are met
  It fires CHECKOUT_ROUTE_OPINION on non-standard finish routes
  Note: these scenarios test the underlying Darts engine module
  Mode 2 historic match UI behaviours are in darts-match-engine-mode2.feature

  Background:
    Given a match is initialised with format "best of 5 sets, first to 3 legs"
    And player 1 is "Luke Littler"
    And player 2 is "Michael van Gerwen"

  Scenario: Match initialises with correct state
    Then each player's remaining score is 501
    And the current set is 1
    And the current leg is 1
    And the current visit is 1
    And the throwing player is player 1

  Scenario Outline: Visit score updates remaining correctly
    Given player 1's remaining score is <remaining_before>
    When player 1 throws a visit scoring <visit_score>
    Then player 1's remaining score is <remaining_after>

    Examples:
      | remaining_before | visit_score | remaining_after |
      | 501              | 180         | 321             |
      | 321              | 180         | 141             |
      | 141              | 100         | 41              |
      | 60               | 60          | 0               |

  Scenario Outline: Visit score fires the correct moment type
    When player 1 throws a visit scoring <score>
    Then the moment type "<moment_type>" is fired

    Examples:
      | score | moment_type |
      | 180   | ONE_EIGHTY  |
      | 140   | HIGH_SCORE  |
      | 141   | HIGH_SCORE  |
      | 139   | STANDARD    |
      | 60    | STANDARD    |
      | 1     | STANDARD    |

  Scenario Outline: STANDARD moment type carries all three commentary horizons
    Given the match has a recent visit history of "<recent_visits>"
    And the current match context is "<match_context>"
    When player 1 throws a visit scoring <score>
    Then the moment type "STANDARD" is fired
    And the commentary payload horizon H1 is "<this_visit>"
    And the commentary payload horizon H2 is "<recent_form>"
    And the commentary payload horizon H3 is "<match_context>"

    Examples:
      | score | recent_visits | match_context        | this_visit | recent_form      | match_context        |
      | 45    | 60,81,45      | sets 1-1 leg 2       | score:45   | last 3:60,81,45  | sets 1-1 leg 2       |
      | 100   | 45,26,100     | set 1 leg 3 need 240 | score:100  | last 3:45,26,100 | set 1 leg 3 need 240 |

  Scenario Outline: Checkout opportunity is detected correctly
    Given player 1's remaining score is <remaining>
    Then checkout possible is "<possible>"
    And checkout difficulty is "<difficulty>"

    Examples:
      | remaining | possible | difficulty |
      | 170       | true     | FILTHY     |
      | 167       | false    | N/A        |
      | 121       | true     | AWKWARD    |
      | 60        | true     | STANDARD   |
      | 2         | true     | STANDARD   |
      | 1         | false    | N/A        |

  Scenario: Throwing on a checkout opportunity fires CHECKOUT_ATTEMPT before darts land
    Given player 1's remaining score is 40
    When player 1 begins their visit
    Then the moment type "CHECKOUT_ATTEMPT" is fired before the visit score is submitted

  Scenario Outline: Invalid finish fires BUST and restores remaining score
    Given player 1's remaining score is <remaining>
    When player 1 throws a visit scoring <thrown>
    Then the moment type "BUST" is fired
    And player 1's remaining score is restored to <remaining>

    Examples:
      | remaining | thrown |
      | 40        | 41     |
      | 3         | 2      |
      | 32        | 33     |
      | 1         | 1      |

  Scenario: Finishing on a double fires CHECKOUT_HIT then LEG_WON
    Given player 1's remaining score is 40
    When player 1 throws a visit scoring 40 finishing on double 20
    Then the moment type "CHECKOUT_HIT" is fired
    Then the moment type "LEG_WON" is fired
    And player 1's leg count increases by 1

  Scenario Outline: Winning the required number of units fires the correct moment type
    Given player 1 has won <already_won> <unit>s in the current <parent>
    When player 1 wins another <unit>
    Then the moment type "<moment_type>" is fired
    And player 1's <unit> count increases by 1

    Examples:
      | unit | parent | already_won | moment_type |
      | leg  | set    | 2           | LEG_WON     |
      | set  | match  | 2           | SET_WON     |

  Scenario: MATCH_WON is a full panel moment all selected characters respond
    Given player 1 has won 2 sets
    When player 1 wins another set
    Then the moment type "MATCH_WON" is fired
    And the match state is "complete"
    And all selected characters respond
    And the highest affinity character for "MATCH_WON" responds first
    And the derived setting shifts to "Players Lounge"

  Scenario: Nine-darter alert fires after two maximum visits
    When player 1 throws 180
    And player 1 throws 180 again
    Then player 1's remaining score is 141
    And the moment type "NINE_DARTER_POSSIBLE" is fired

  Scenario Outline: Nine-darter resolution fires the correct moment type
    Given "NINE_DARTER_POSSIBLE" has been fired for player 1
    And player 1's remaining score is 141
    When player 1 throws a visit "<outcome>"
    Then the moment type "<moment_type>" is fired

    Examples:
      | outcome                         | moment_type          |
      | scoring 141 finishing on double | NINE_DARTER_COMPLETE |
      | not finishing on a double       | NINE_DARTER_BLOWN    |

  Scenario: BIG_FISH_OPPORTUNITY fires when remaining reaches 170
    When player 1's remaining score reaches 170
    Then the moment type "BIG_FISH_OPPORTUNITY" is fired
    And Mardle's big fish call state is set to "PENDING"

  Scenario: BIG_FISH_CALLED_CORRECT fires when player hits the 170
    Given Mardle's big fish call state is "PENDING"
    And "Wayne Mardle" is selected
    When player 1 throws T20 T20 bull to complete the 170
    Then the moment type "BIG_FISH_CALLED_CORRECT" is fired
    And Mardle's session flag "big_fish_glory" is true
    And the moment type "CHECKOUT_HIT" is also fired

  Scenario: BIG_FISH_CALLED_WRONG fires when player takes the safe route
    Given Mardle's big fish call state is "PENDING"
    And "Wayne Mardle" is selected
    When player 1 uses the third dart to leave a double rather than attempt bull
    Then the moment type "BIG_FISH_CALLED_WRONG" is fired
    And Mardle's session flag "big_fish_glory" is false

  Scenario Outline: Big fish response reflects character ownership and philosophy
    Given the moment type "BIG_FISH_CALLED_CORRECT" has fired
    And the character "<character>" is selected
    When "<character>" responds
    Then the response reflects "<reaction>"

    Examples:
      | character    | reaction                                             |
      | Wayne Mardle | insufferable self-congratulation references it again |
      | Rod Studd    | dry acknowledgement quiet ownership of the term      |
      | John Lowe    | mathematically correct observation no emotion        |
      | Eric Bristow | begrudging respect for going for it                  |

  Scenario: CHECKOUT_ROUTE_OPINION fires when player takes non-standard finish route
    Given player 1 is on a finish
    When player 1 takes a non-standard checkout route
    Then the moment type "CHECKOUT_ROUTE_OPINION" is fired

  Scenario Outline: Characters have distinct checkout route philosophies
    Given the moment type "CHECKOUT_ROUTE_OPINION" has fired
    And the character "<character>" is selected
    When "<character>" responds
    Then the response reflects "<philosophy>"

    Examples:
      | character    | philosophy                                                     |
      | Eric Bristow | aggression always go for the highest finish                    |
      | John Lowe    | mathematics there is a correct route and the player ignored it |
      | John Part    | professional respect defends the player's strategic choice     |
      | Wayne Mardle | frustration especially if player declined a Big Fish           |
      | Jocky Wilson | oblique story from Kirkcaldy apposite never obviously so       |

  Scenario: Throw alternates between players after each completed visit
    When player 1 completes their visit
    Then the throwing player becomes player 2
    When player 2 completes their visit
    Then the throwing player becomes player 1

  @backlog
  Scenario: Dart-by-dart crescendo builds when Big Fish third dart is pending
    Given Mardle's big fish call state is "PENDING"
    And player 1 has thrown T20 with dart one
    And player 1 has thrown T20 with dart two
    When player 1 prepares to throw dart three at bull
    Then the moment type "DART_THREE_PENDING" is fired
    And all characters except the primary are silent
    And the crowd pressure escalates to "BEDLAM"
