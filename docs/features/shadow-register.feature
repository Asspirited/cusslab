Feature: Shadow Register
  As a panel engine
  I want characters to briefly manifest an alter ego under specific conditions
  So that panels contain moments of unexpected identity shift that reward close attention

  Background:
    Given the ShadowRegister module is initialised
    And the following shadow profiles are loaded:
      | character | shadow_id          | earliest_round | max_per_panel | self_aware | panel_aware |
      | blofeld   | Ernst Stavro       | 4              | 1             | false      | false       |

  # --- Trigger detection ---

  Scenario Outline: Shadow activates when trigger condition is met after earliest round
    Given character "<character>" has reached round <round>
    And the shadow trigger "<trigger>" is detected
    When a turn is generated for "<character>"
    Then the shadow "<shadow_id>" should be active
    And the response should use the shadow register not the primary register

    Examples:
      | character | round | trigger                    | shadow_id     |
      | blofeld   | 4     | world_domination_mentioned | Ernst Stavro  |
      | blofeld   | 4     | talked_over_two_turns      | Ernst Stavro  |
      | blofeld   | 4     | cat_mentioned              | Ernst Stavro  |

  Scenario: Shadow does not activate before earliest round
    Given character "blofeld" is in round 2
    And the shadow trigger "world_domination_mentioned" is detected
    When a turn is generated for "blofeld"
    Then the shadow "Ernst Stavro" should not be active
    And the response should use the primary register

  Scenario: Shadow does not activate without trigger even after earliest round
    Given character "blofeld" has reached round 4
    And no shadow trigger has been detected
    When a turn is generated for "blofeld"
    Then the shadow "Ernst Stavro" should not be active

  # --- Register switch ---

  Scenario: Shadow register is distinct from primary register
    Given character "blofeld" shadow is active
    When a turn is generated
    Then the response should not contain "my dear old thing"
    And the response should contain language consistent with "architectural menace"
    And the response should not contain exclamations of delight

  Scenario: Shadow register uses primary character's normal tics transformed
    Given character "blofeld" shadow "Ernst Stavro" is active
    When a turn is generated referencing pigeons
    Then the response should reference pigeons as surveillance assets
    And the response should not reference pigeons as charming distractions

  Scenario: Shadow arrives mid-sentence without announcement
    Given character "blofeld" shadow tell is "none"
    When the shadow activates
    Then the response should not contain phrases like "suddenly" or "switching to"
    And the shadow should be present from the start of the turn

  # --- Acknowledgement rules ---

  Scenario: Character with self=false does not reference the switch
    Given character "blofeld" has shadow_acknowledged.self = false
    And the shadow "Ernst Stavro" was active in the previous turn
    When blofeld's next turn is generated
    Then blofeld should not reference what happened in the previous turn
    And blofeld should return to primary register as if nothing occurred

  Scenario: Panel with panel=false does not react to the switch
    Given character "blofeld" has shadow_acknowledged.panel = false
    And the shadow "Ernst Stavro" was active
    When other panel members' turns are generated
    Then no panel member should reference the switch
    And the panel should continue as if the switch did not occur

  Scenario: Panel with panel=true reacts to the switch
    Given a character has shadow_acknowledged.panel = true
    And the shadow is active
    When other panel members' turns are generated
    Then at least one panel member should register the shift
    And no panel member should name or explain it directly

  # --- Return conditions ---

  Scenario Outline: Shadow resolves when return condition is met
    Given character "blofeld" shadow "Ernst Stavro" is active
    When the return condition "<condition>" occurs in the panel
    Then blofeld should return to primary register on the next turn
    And the return should be mid-sentence without announcement

    Examples:
      | condition              |
      | pigeon_mentioned       |
      | cake_mentioned         |
      | my_dear_old_thing_said |

  Scenario: Shadow resolves automatically if return condition not met within 2 turns
    Given character "blofeld" shadow "Ernst Stavro" is active
    And 2 turns have passed without a return condition
    When the third turn is generated
    Then blofeld should return to primary register
    And no announcement should accompany the return

  # --- Frequency cap ---

  Scenario: Shadow does not activate a second time after max_per_panel reached
    Given character "blofeld" has max_per_panel = 1
    And the shadow "Ernst Stavro" has already activated once this panel
    When a shadow trigger is detected again
    Then the shadow should not activate
    And blofeld should respond in the primary register

  Scenario: Shadow frequency resets between panel sessions
    Given character "blofeld" used the shadow in the previous panel session
    When a new panel session begins
    Then the shadow activation count should be 0
    And the shadow should be eligible to activate again

  # --- Prompt construction ---

  Scenario: Shadow register is injected into system prompt when active
    Given character "blofeld" shadow is active
    When the turn prompt is constructed
    Then the system prompt should contain the shadow_register description
    And the system prompt should not contain the primary character register
    And the system prompt should contain shadow_acknowledged instructions

  Scenario: Primary register is restored in system prompt after shadow resolves
    Given character "blofeld" shadow has just resolved
    When the next turn prompt is constructed
    Then the system prompt should contain the primary character register
    And the system prompt should not contain the shadow register

  # --- General portability ---

  Scenario Outline: Shadow register works for any character with P10 defined
    Given character "<character>" has a shadow profile loaded
    And the shadow trigger "<trigger>" is detected after round "<earliest_round>"
    When a turn is generated
    Then the shadow "<shadow_id>" should be active
    And the response should use the shadow register

    Examples:
      | character | shadow_id        | trigger                    | earliest_round |
      | blofeld   | Ernst Stavro     | world_domination_mentioned | 4              |

  Scenario: Character without P10 defined never triggers a shadow
    Given character "holding" has no shadow profile
    When any trigger condition is detected
    Then no shadow should activate for "holding"
    And holding should always respond in primary register
