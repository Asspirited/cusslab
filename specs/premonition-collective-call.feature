Feature: Premonition Engine — COLLECTIVE_CALL mode
  As the panel orchestrator
  I want multiple characters to converge on the same premonition simultaneously
  So that rare moments of unanimous panel agreement carry comic and dramatic weight

  Background:
    Given the premonition engine is active for the darts panel
    And the match is in progress

  Scenario: A COLLECTIVE_CALL forms when three or more characters commit the same premonition
    Given "george", "waddell", and "mardle" each independently emit a PREMONITION for a nine-darter
    And all three COMMITs reference the same outcome type "NINE_DARTER_POSSIBLE"
    When the orchestrator detects three matching COMMITs within the same turn window
    Then a COLLECTIVE_CALL event is emitted
    And the COLLECTIVE_CALL contains the participant list: ["george", "waddell", "mardle"]
    And the COLLECTIVE_CALL enters the COMMIT phase with type "collective_call"

  Scenario: A COLLECTIVE_CALL requires a minimum of three participants
    Given "george" and "waddell" both emit a PREMONITION for a nine-darter
    And no other character commits the same outcome
    When the orchestrator evaluates the COMMITs
    Then no COLLECTIVE_CALL is emitted
    And each character's PREMONITION is handled individually

  Scenario: A COLLECTIVE_CALL resolves as HIT when the outcome occurs
    Given a COLLECTIVE_CALL for "NINE_DARTER_POSSIBLE" is in the COMMIT phase
    And the participants are ["george", "waddell", "mardle"]
    When the nine-darter is completed
    Then the COLLECTIVE_CALL resolves as HIT
    And all three participants enter AFTERMATH state "TRIUMPH"
    And a COLLECTIVE_TRIUMPH event is emitted
    And the panel voice reflects unanimous vindication

  Scenario: A COLLECTIVE_CALL resolves as MISS when the outcome does not occur
    Given a COLLECTIVE_CALL for "NINE_DARTER_POSSIBLE" is in the COMMIT phase
    And the participants are ["george", "waddell", "mardle"]
    When the leg ends without a nine-darter
    Then the COLLECTIVE_CALL resolves as MISS
    And all three participants enter AFTERMATH state "DEFLATED"
    And a COLLECTIVE_MISS event is emitted
    And characters outside the COLLECTIVE_CALL may comment on the shared collapse

  Scenario: Characters outside a COLLECTIVE_CALL gain schadenfreude rights on MISS
    Given a COLLECTIVE_CALL has resolved as MISS
    And "bristow" was not a participant
    And "studd" was not a participant
    When COLLECTIVE_MISS is emitted
    Then "bristow" and "studd" are eligible to comment on the collective collapse
    And their premonitionAffinity for "collective_call" is applied to comment weighting
    And "lowe" comments with restraint — one beat, no gloating

  Scenario Outline: COLLECTIVE_CALL minimum threshold across panels
    Given the <panel> panel is active in In-Game mode
    And <count> characters commit the same premonition outcome
    Then a COLLECTIVE_CALL <is_or_is_not> emitted

    Examples:
      | panel    | count | is_or_is_not |
      | darts    | 2     | is not       |
      | darts    | 3     | is           |
      | darts    | 4     | is           |
      | golf     | 2     | is not       |
      | golf     | 3     | is           |
      | boardroom| 2     | is not       |
      | boardroom| 3     | is           |
      | football | 2     | is not       |
      | football | 3     | is           |

  Scenario: A truth-teller may abstain from a COLLECTIVE_CALL
    Given "george", "mardle", and "bristow" are forming a COLLECTIVE_CALL for "BIG_FISH"
    And "lowe" has premonitionAffinity.truth_teller set to true
    When "lowe" is invited to join the COLLECTIVE_CALL
    Then "lowe" may abstain if his individual COMMIT confidence is below threshold
    And the COLLECTIVE_CALL proceeds with three participants without lowe
    And if the call resolves as MISS, lowe is eligible for schadenfreude commentary

  Scenario: A COLLECTIVE_CALL supersedes individual PREMONITIONs for the same outcome
    Given "george" has an individual PREMONITION in COMMIT phase for "NINE_DARTER_POSSIBLE"
    When a COLLECTIVE_CALL forms for the same outcome including george
    Then george's individual PREMONITION is absorbed into the COLLECTIVE_CALL
    And george's individual COMMIT is marked as superseded in the ledger
    And only the COLLECTIVE_CALL entry is resolved

  Scenario: COLLECTIVE_CALL TRIUMPH weight is higher than individual TRIUMPH
    Given a COLLECTIVE_CALL has resolved as HIT for three darts participants
    And an individual PREMONITION has resolved as HIT for one darts participant in the same leg
    When AFTERMATH states are computed
    Then the COLLECTIVE_CALL TRIUMPH carries a higher narrative weight than the individual TRIUMPH
    And the panel orchestrator prioritises COLLECTIVE_TRIUMPH commentary in the turn order

  Scenario: DOUBLED_DOWN applies when a participant denies the COLLECTIVE_MISS
    Given a COLLECTIVE_CALL has resolved as MISS
    And "george" is in AFTERMATH state "DEFLATED"
    When "george" issues a RETROSPECTIVE_CALL claiming he never endorsed the collective prediction
    Then "george" enters AFTERMATH state "DOUBLED_DOWN"
    And a TRUTH_TELLER_CHALLENGE is eligible from any truth-teller present
    And the ledger records george's DEFLATED and DOUBLED_DOWN states as compounded

  Scenario: COLLECTIVE_CALL premonitionAffinity varies by character
    Given the darts panel is active with all nine characters
    Then "george" has collective_call affinity above 0.5
    And "waddell" has collective_call affinity above 0.5
    And "mardle" has collective_call affinity above 0.4
    And "lowe" has collective_call affinity below 0.3
    And "part" has collective_call affinity below 0.3
    And "studd" has collective_call affinity above 0.4

  Scenario: COLLECTIVE_CALL is not available in QandA mode
    Given the darts panel is in QandA mode
    When three characters emit COMMITs for the same outcome
    Then no COLLECTIVE_CALL is emitted
    And each COMMIT is silently discarded
    And no AFTERMATH states are set
