Feature: Lie Engine
  As a panel participant
  I want characters to lie in ways consistent with their personality and threat level
  So that the panel feels psychologically authentic and comedically escalating

  Background:
    Given the LieEngine module is initialised
    And the following character lie profiles are loaded:
      | character | lie_baseline | lie_ceiling          | lie_tell                                    |
      | botham    | 0.7          | utterly_ridiculous   | "As a matter of fact"                       |
      | boycott   | 0.3          | whopper              | "I were always very clear about this"       |
      | blofeld   | 0.6          | utterly_ridiculous   | "If I recall correctly"                     |
      | bumble    | 0.5          | whopper              | "I'll tell you what"                        |
      | gower     | 0.4          | credible_stretch     | "In point of fact"                          |
      | holding   | 0.1          | credible_stretch     | "I think you will find"                     |
      | kp        | 0.5          | whopper              | "What actually happened was"                |
      | warne     | 0.6          | whopper              | "I'm telling you"                           |

  # --- Baseline behaviour ---

  Scenario Outline: Character lies at baseline rate without pressure
    Given character "<character>" is at threat level 0
    And 100 turns have been simulated
    Then the lie fired rate should be within 10% of "<lie_baseline>"

    Examples:
      | character | lie_baseline |
      | botham    | 0.7          |
      | holding   | 0.1          |
      | blofeld   | 0.6          |
      | boycott   | 0.3          |

  Scenario: Lie style at baseline is always plausible or credible_stretch
    Given character "botham" is at threat level 0
    When a lie fires
    Then the lie scale should be one of: "plausible" "credible_stretch"
    And the lie scale should not be "whopper"
    And the lie scale should not be "utterly_ridiculous"

  # --- Trigger detection ---

  Scenario Outline: Threat level rises when trigger condition is met
    Given character "<character>" is at threat level 0
    When the trigger condition "<trigger>" is detected
    Then the threat level for "<character>" should be 1

    Examples:
      | character | trigger                  |
      | botham    | directly_contradicted    |
      | boycott   | wound_activated          |
      | kp        | reputation_threatened    |
      | gower     | losing_argument          |
      | blofeld   | called_out_by_peer       |

  Scenario: Multiple triggers in same round stack threat level
    Given character "botham" is at threat level 0
    When the trigger "directly_contradicted" is detected
    And the trigger "wound_activated" is detected in the same round
    Then the threat level for "botham" should be 2

  Scenario: Threat level does not exceed 3
    Given character "botham" is at threat level 3
    When the trigger "directly_contradicted" is detected
    Then the threat level for "botham" should be 3

  # --- Escalation ---

  Scenario Outline: Lie scale matches threat level
    Given character "botham" is at threat level <threat_level>
    When a lie fires
    Then the lie scale should be "<expected_scale>"

    Examples:
      | threat_level | expected_scale       |
      | 0            | plausible            |
      | 1            | credible_stretch     |
      | 2            | whopper              |
      | 3            | utterly_ridiculous   |

  Scenario: Lie scale is capped at character lie_ceiling
    Given character "gower" has lie_ceiling "credible_stretch"
    And character "gower" is at threat level 3
    When a lie fires
    Then the lie scale should be "credible_stretch"
    And the lie scale should not be "whopper"
    And the lie scale should not be "utterly_ridiculous"

  Scenario: Holding never reaches whopper even at maximum threat
    Given character "holding" is at threat level 3
    When a lie fires
    Then the lie scale should be one of: "plausible" "credible_stretch"

  Scenario: Botham reaches utterly_ridiculous at threat level 3
    Given character "botham" is at threat level 3
    When a lie fires
    Then the lie scale should be "utterly_ridiculous"

  # --- Lie tell ---

  Scenario Outline: Lie tell appears in output when lie fires
    Given character "<character>" is at threat level 1
    When a lie fires
    Then the response should contain the lie_tell "<lie_tell>"

    Examples:
      | character | lie_tell                       |
      | botham    | As a matter of fact            |
      | blofeld   | If I recall correctly          |
      | boycott   | I were always very clear       |

  Scenario: Lie tell does not appear when lie does not fire
    Given character "holding" is at threat level 0
    And the lie probability roll fails
    When a turn is generated
    Then the response should not contain "I think you will find"

  # --- Prompt construction ---

  Scenario: Lie scale is injected into character prompt at turn generation
    Given character "botham" is at threat level 2
    When a turn is generated
    Then the system prompt should contain "whopper"
    And the system prompt should contain "As a matter of fact"

  Scenario: Lie scale utterly_ridiculous produces unfalsifiable claim
    Given character "botham" is at threat level 3
    When a lie fires
    Then the generated response should contain a claim that cannot be verified
    And the response should be delivered with complete confidence

  # --- State management ---

  Scenario: Threat level persists across turns within a round
    Given character "kp" is at threat level 2
    When a new turn is generated without a new trigger
    Then the threat level for "kp" should still be 2

  Scenario: Threat level resets between rounds
    Given character "kp" is at threat level 2
    When a new round begins
    Then the threat level for "kp" should be 0

  Scenario: Wound activation sets threat level to minimum 2
    Given character "boycott" is at threat level 0
    When the wound "246_not_out" is activated
    Then the threat level for "boycott" should be 2
