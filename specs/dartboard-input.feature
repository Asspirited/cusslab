Feature: Dartboard input component
  The dartboard allows segment-by-segment score entry up to 3 darts per visit
  Each segment has single double and treble zones
  Undo removes the last dart and is disabled at 0 darts
  Preset buttons provide fast entry for common scores and outcomes

  Background:
    Given the dartboard input component is rendered
    And the current player's remaining score is 501

  Scenario: Dartboard renders all scoring segments
    Then segments 1 through 20 are visible
    And the bull segment is visible
    And the outer bull segment is visible

  Scenario: Each numbered segment has single double and treble zones
    When I inspect segment 20
    Then a single zone scoring 20 is present
    And a double zone scoring 40 is present
    And a treble zone scoring 60 is present

  Scenario Outline: Running total updates correctly after each dart entered
    Given I have entered <darts_entered> darts with a cumulative score of <cumulative>
    Then the running total displays "<display>"
    And <darts_entered> darts are recorded as thrown

    Examples:
      | darts_entered | cumulative | display               |
      | 1             | 60         | T20 = 60              |
      | 2             | 119        | T20 + T19 = 119       |
      | 3             | 141        | T20 + T19 + D12 = 141 |

  Scenario: Submit visit button is enabled only when at least one dart is entered
    Then the submit visit button is disabled
    When I click the treble zone of segment 20
    Then the submit visit button is enabled

  Scenario: A fourth click after 3 darts is ignored
    Given I have clicked 3 segment zones
    When I click another segment zone
    Then 3 darts are still recorded as thrown
    And the running total does not change

  Scenario Outline: Undo removes the last dart at any point in a visit
    Given I have entered <darts_before> darts
    When I click undo
    Then <darts_after> darts are recorded as thrown

    Examples:
      | darts_before | darts_after |
      | 3            | 2           |
      | 2            | 1           |
      | 1            | 0           |

  Scenario: Undo is disabled when no darts have been entered
    Given 0 darts have been entered
    Then the undo button is disabled

  Scenario Outline: Preset score buttons submit a visit directly
    When I click the preset button "<button_label>"
    Then the visit score <score> is submitted immediately
    And the running total is cleared
    And 0 darts are recorded as thrown

    Examples:
      | button_label | score |
      | 180          | 180   |
      | 140          | 140   |
      | 100          | 100   |
      | 60           | 60    |

  Scenario Outline: Preset outcome buttons fire moment types directly
    When I click the preset button "<button_label>"
    Then the moment type "<moment_type>" is fired immediately

    Examples:
      | button_label | moment_type  |
      | Checkout Hit | CHECKOUT_HIT |
      | Bust         | BUST         |
      | Leg Won      | LEG_WON      |

  Scenario: Submitting a visit clears the dartboard for the next visit
    Given I have entered a visit scoring 180 via the dartboard
    When I click submit visit
    Then the running total is cleared
    And 0 darts are recorded as thrown
    And the dartboard is ready for the next visit
