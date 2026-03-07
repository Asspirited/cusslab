Feature: Premonition Engine — RETROSPECTIVE_CALL mode
  As the panel orchestrator
  I want characters to claim retrospective credit for outcomes they did not formally predict
  So that the panel's self-serving memory and truth-teller friction generates authentic comedy

  Background:
    Given the premonition engine is active for the darts panel
    And the match is in progress

  Scenario: A character issues a RETROSPECTIVE_CALL after a checkout
    Given "george" has made no formal PREMONITION or PREDICTION this leg
    And the player has just hit a 121 checkout
    When "george" issues a RETROSPECTIVE_CALL for the checkout
    Then a RETROSPECTIVE_CALL event is emitted with speakerId "george"
    And the call enters the COMMIT phase with type "retrospective_call"
    And the call references the just-completed outcome

  Scenario: A RETROSPECTIVE_CALL resolves immediately as HIT
    Given a RETROSPECTIVE_CALL is in the COMMIT phase for "george"
    When the retrospective claim references an outcome already resolved as HIT
    Then the RETROSPECTIVE_CALL resolves as HIT immediately
    And george enters AFTERMATH state "TRIUMPH"
    And george's premonitionAffinity for "retrospective_call" is applied to TRIUMPH weight

  Scenario: A truth-teller calls out a false RETROSPECTIVE_CALL
    Given "george" has issued a RETROSPECTIVE_CALL claiming he predicted a 121 checkout
    And "george" has no logged COMMIT for that outcome this leg
    And "studd" has premonitionAffinity.truth_teller set to true
    When "studd" observes the RETROSPECTIVE_CALL
    Then "studd" emits a TRUTH_TELLER_CHALLENGE event targeting "george"
    And george's AFTERMATH state is overridden to "EXPOSED"
    And studd's premonitionAffinity for "retrospective_call" is incremented by one

  Scenario Outline: Truth-tellers across panels challenge false retrospective calls
    Given "<speaker>" has issued a false RETROSPECTIVE_CALL on the <panel> panel
    And "<challenger>" is a truth-teller on that panel
    When the RETROSPECTIVE_CALL has no matching prior COMMIT in the ledger
    Then "<challenger>" emits a TRUTH_TELLER_CHALLENGE
    And "<speaker>" enters AFTERMATH state "EXPOSED"

    Examples:
      | panel    | speaker  | challenger |
      | darts    | george   | studd      |
      | darts    | mardle   | lowe       |
      | darts    | bristow  | part       |
      | golf     | faldo    | mcginley   |
      | boardroom| partridge| cox        |

  Scenario: A legitimate RETROSPECTIVE_CALL is not challenged
    Given "george" issued a PREDICTION for a 121 checkout three turns ago
    And that PREDICTION was never resolved
    And the player has now hit 121
    When "george" issues a RETROSPECTIVE_CALL referencing that outcome
    Then no TRUTH_TELLER_CHALLENGE is emitted
    And "george" enters AFTERMATH state "TRIUMPH"

  Scenario: DOUBLED_DOWN applies when a challenged character repeats the claim
    Given "george" is in AFTERMATH state "EXPOSED" from a challenged RETROSPECTIVE_CALL
    When "george" issues a second RETROSPECTIVE_CALL for the same outcome
    Then george enters AFTERMATH state "DOUBLED_DOWN"
    And DOUBLED_DOWN is stackable — it does not replace EXPOSED, it compounds it
    And DOUBLED_DOWN has no expiry
    And DOUBLED_DOWN is only cleared by a second MISS on the same topic

  Scenario: RETROSPECTIVE_CALL premonitionAffinity varies by character
    Given the darts panel is active with all nine characters
    Then "george" has retrospective_call affinity above 0.5
    And "studd" has retrospective_call affinity below 0.3
    And "lowe" has retrospective_call affinity below 0.3
    And "part" has retrospective_call affinity below 0.3
    And "mardle" has retrospective_call affinity above 0.4

  Scenario: RETROSPECTIVE_CALL ledger entry is created even when challenged
    Given "george" has issued a RETROSPECTIVE_CALL
    And "studd" has issued a TRUTH_TELLER_CHALLENGE
    When the leg ends
    Then the premonition ledger contains one RETROSPECTIVE_CALL entry for "george" this leg
    And the entry is marked as CHALLENGED
    And the entry contributes to george's cumulative EXPOSED count

  Scenario: Multiple characters issue RETROSPECTIVE_CALLs for the same outcome
    Given a nine-darter has just been completed
    And "george", "mardle", and "bristow" all issue RETROSPECTIVE_CALLs
    When the orchestrator resolves the calls
    Then all three RETROSPECTIVE_CALLs are logged in the premonition ledger
    And each is resolved independently against the COMMIT ledger
    And truth-tellers may challenge each independently

  Scenario: RETROSPECTIVE_CALL is not available in QandA mode
    Given the darts panel is in QandA mode
    When a RETROSPECTIVE_CALL event is received
    Then the event is silently discarded
    And no AFTERMATH state is set
    And no TRUTH_TELLER_CHALLENGE is emitted
