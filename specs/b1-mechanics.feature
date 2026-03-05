Feature: B1 Interrupt Mechanics
  As the panel orchestrator
  I want the B1 interrupt rule applied correctly per panel
  So that interruptions are deterministic and panel-specific

  Scenario: B1 implementation applies to Golf panel
    Given the golf panel is running
    And a character's interrupt probability exceeds the threshold
    When the orchestrator evaluates interruption
    Then the B1 rule is applied

  Scenario: B1 implementation applies to Boardroom panel
    Given the boardroom panel is running
    And a character's interrupt probability exceeds the threshold
    When the orchestrator evaluates interruption
    Then the B1 rule is applied

  Scenario: B1 does not apply to first speaker in any panel
    Given any panel is running
    When the first speaker of a round is selected
    Then the B1 interrupt check is skipped
    And the first speaker always completes their turn
