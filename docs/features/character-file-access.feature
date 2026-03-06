Feature: Character File Access
  As the panel engine
  I want character definitions loaded once at session start and state maintained during the session
  So that mid-round and between-round behaviour is consistent and performant

  Background:
    Given the character roster for "long_room" is defined in the MEMBERS array
    And each MEMBERS entry contains the following attributes:
      | attribute      | source                        |
      | wound          | characters-schema.md P1       |
      | lie_baseline   | characters-schema.md P9       |
      | lie_style      | characters-schema.md P9       |
      | lie_trigger    | characters-schema.md P9       |
      | lie_escalation | characters-schema.md P9       |
      | lie_tell       | characters-schema.md P9       |
      | lie_ceiling    | characters-schema.md P9       |
      | slots          | panel-slots.md                |

  # --- Pre-session load ---

  Scenario: All character attributes are available before first round
    Given a 5-person panel has been assembled
    When the panel session is initialised
    Then every character in the panel should have a loaded lie_baseline
    And every character in the panel should have a loaded lie_ceiling
    And every character in the panel should have a loaded wound
    And every character in the panel should have a loaded lie_tell

  Scenario: Character attributes are loaded exactly once per session
    Given a panel session is initialised
    When 5 rounds are completed
    Then the MEMBERS array should have been read exactly once

  Scenario: Missing attribute raises error at load time not at turn time
    Given a MEMBERS entry is missing "lie_baseline"
    When the panel session is initialised
    Then an initialisation error should be raised: "Missing required attribute: lie_baseline"
    And the panel should not start

  # --- Mid-round state read ---

  Scenario: LieEngine reads current threat level from CharacterState each turn
    Given character "botham" has threat level 2 in CharacterState
    When a turn is generated for "botham"
    Then LieEngine should read threat_level from CharacterState
    And the lie scale should be "whopper"

  Scenario: CharacterState is read not re-initialised mid-round
    Given character "boycott" has threat level 1 after turn 2
    When turn 3 is generated for "boycott"
    Then the threat level should still be 1 at the start of turn 3
    And it should not have reset to 0

  Scenario: Emotional state affects lie trigger evaluation each turn
    Given character "kp" has emotional_state "defensive" in CharacterState
    When a turn is generated containing a challenge to kp's reputation
    Then the trigger "reputation_threatened" should be detected
    And the threat level for "kp" should increase by 1

  # --- Between-round state update ---

  Scenario: Threat level persists from round end to next round start by default
    Given character "botham" ends round 2 at threat level 2
    When round 3 begins
    Then character "botham" should start round 3 at threat level 2

  Scenario: Threat level resets if wound de-activates between rounds
    Given character "boycott" ends round 2 with wound_activated true
    And the wound cools between rounds
    When round 3 begins
    Then the threat level for "boycott" should reset to 0

  Scenario: Relationship state updated between rounds affects next round conflict weighting
    Given "botham" and "boycott" had a direct confrontation in round 2
    When round 3 begins
    Then the tension_level between "botham" and "boycott" should be "high"
    And the conflict weighting should favour further exchanges between them

  Scenario: All CharacterState fields are preserved between rounds
    Given a panel is in round 3
    When the between-round state update runs
    Then lie_baseline should be unchanged
    And lie_ceiling should be unchanged
    And lie_tell should be unchanged
    And threat_level should reflect end-of-round-2 value
    And wound_activated should reflect end-of-round-2 value

  # --- Schema sync validation ---
  # NOTE: these scenarios are known-red until a build step exists that reads .md files
  # and generates JS MEMBERS objects. They document the sync debt, not a passing state.

  Scenario: JS MEMBERS object contains all attributes defined in characters-schema.md P9
    Given the characters-schema.md P9 section defines 6 lie attributes
    When the MEMBERS array is validated at session start
    Then every character entry should have all 6 lie attributes present
    And a warning should be logged for any missing attribute

  Scenario Outline: Character file and JS object stay in sync for lie attributes
    Given character "<character>" has lie_baseline "<value>" in their .md file
    When the MEMBERS JS object for "<character>" is checked
    Then the lie_baseline in MEMBERS should equal "<value>"

    Examples:
      | character | value |
      | botham    | 0.7   |
      | holding   | 0.1   |
      | blofeld   | 0.6   |
      | boycott   | 0.3   |
