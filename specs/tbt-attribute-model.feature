Feature: Hidden attribute model composing FORM
  As a player
  I want FORM to reflect my physical, technical, mental and character state
  So that I discover what drives performance through play, not instruction

  Background:
    Given the TBT attribute engine is initialised

  Scenario Outline: FORM word is derived from computed score
    Given core attributes physique=<physique> skill=<skill> confidence=<confidence> tenacity=<tenacity>
    And weekly modifiers sharpness=<sharpness> freshness=<freshness>
    And lifeNoise=<noise>
    When FORM is computed
    Then the FORM word is "<word>"

    Examples:
      | physique | skill | confidence | tenacity | sharpness | freshness | noise | word    |
      | 0        | 0     | 0          | 0        | 0         | 0         | 0     | Nowhere       |
      | 2        | 2     | 2          | 2        | 0         | 0         | 0     | Nowhere       |
      | 4        | 4     | 4          | 4        | 0         | 0         | 0     | Out-of-Form   |
      | 6        | 6     | 6          | 6        | 0         | 0         | 0     | Scratchy      |
      | 8        | 8     | 8          | 8        | 0         | 0         | 0     | Ticking Along |
      | 10       | 10    | 10         | 10       | 0         | 0         | 0     | Flying        |
      | 8        | 8     | 8          | 8        | 2         | 2         | 0     | Flying        |
      | 5        | 5     | 5          | 5        | 0         | 0         | 3     | Out-of-Form   |

  Scenario: FORM score is clamped to 0 when formula produces negative
    Given core attributes physique=0 skill=0 confidence=0 tenacity=0
    And weekly modifiers sharpness=0 freshness=0
    And lifeNoise=3
    When FORM is computed
    Then the FORM word is "Nowhere"

  Scenario: FORM score is clamped to 20 when formula exceeds maximum
    Given core attributes physique=10 skill=10 confidence=10 tenacity=10
    And weekly modifiers sharpness=2 freshness=2
    And lifeNoise=0
    When FORM is computed
    Then the FORM word is "Flying"

  Scenario: lifeNoise accumulates from multiple dial states
    Given Nan dial is "red"
    And bank balance is below critical threshold
    And HOME dial is "red"
    When lifeNoise is calculated
    Then lifeNoise is 3

  Scenario: lifeNoise is zero when all dials are stable
    Given Nan dial is "green"
    And bank balance is above critical threshold
    And HOME dial is "green"
    When lifeNoise is calculated
    Then lifeNoise is 0

  Scenario: NETS activity costs physique and gains sharpness
    Given physique is 5
    And sharpness is 0
    And the player has 0 practice sessions this cycle
    When the player does NETS
    Then physique delta is -1
    And sharpness delta is 2
    And practice sessions delta is 1

  Scenario: REST activity raises physique and freshness
    Given physique is 4
    And freshness is 0
    When the player does REST
    Then physique delta is 2
    And freshness delta is 2

  Scenario: skill does not increment on first practice session
    Given the player has 0 practice sessions this cycle
    When the player does NETS
    Then practice sessions delta is 1

  Scenario: skill increments after sustained NETS pattern
    Given the player has 3 practice sessions this cycle
    When the player does NETS
    Then skill delta is 1
    And practice sessions delta is -3

  Scenario: new game initialises with core attributes
    Given a new TBT game is started
    Then physique is 5
    And skill is 3
    And confidence is 5
    And tenacity is 5
    And sharpness is 1
    And freshness is 2
    And practice sessions this cycle is 0
