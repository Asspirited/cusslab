Feature: Premonition Engine RUNNING COMMENTARY mode
  A commentator narrates a multi-step sequence step by step
  committing harder with each successful step
  The narration builds to a crescendo at the final step
  Abandoning mid-sequence is its own resolution type

  Background:
    Given the application is loaded
    And a darts match is in progress
    And the "Watching the Oche" tab is active

  Scenario: RUNNING COMMENTARY activates when a multi-step sequence begins
    Given "Wayne Mardle" is selected
    And a Big Fish sequence is in progress
    When player 1 hits T20 with dart one
    Then Mardle's RUNNING COMMENTARY state is ACTIVE
    And Mardle narrates dart one

  Scenario: Each successful step deepens the commitment
    Given Mardle's RUNNING COMMENTARY state is ACTIVE
    And player 1 has hit T20 with dart one
    When player 1 hits T20 with dart two
    Then Mardle narrates dart two with higher intensity than dart one
    And Mardle's commitment level increases

  Scenario: Final step narration fires at peak intensity with all others silent
    Given Mardle's RUNNING COMMENTARY state is ACTIVE
    And player 1 has successfully hit T20 T20
    When player 1 prepares to throw dart three at bull
    Then Mardle narrates the final step at maximum intensity
    And all other characters are silent during the narration

  Scenario: EXACT resolution fires when sequence completes successfully
    Given Mardle's RUNNING COMMENTARY state is ACTIVE
    When player 1 completes the Big Fish
    Then the resolution type is EXACT
    And Mardle's aftermath state is GLORY

  Scenario: MISS resolution fires when sequence fails at any step
    Given Mardle's RUNNING COMMENTARY state is ACTIVE
    And player 1 has hit T20 T20
    When player 1 misses the bull
    Then the resolution type is MISS
    And Mardle's aftermath state is HAUNTED
    And peers react to the miss

  Scenario: ABANDONED resolution fires when character stops narrating mid-sequence
    Given Mardle's RUNNING COMMENTARY state is ACTIVE
    And player 1 has hit T20 with dart one
    When Mardle stops narrating before the sequence concludes
    Then the resolution type is ABANDONED
    And peers note the abandonment
    And Mardle cannot re-enter RUNNING COMMENTARY for this sequence

  Scenario: Only one character can hold RUNNING COMMENTARY for a sequence
    Given "Wayne Mardle" has RUNNING COMMENTARY active
    When the premonition engine evaluates "Stuart Pyke" for the same sequence
    Then Pyke is not granted RUNNING COMMENTARY
    And Pyke responds reactively instead

  Scenario Outline: RUNNING COMMENTARY triggers across all panels
    Given the user has selected the "<panel>" panel
    And "<character>" is selected
    And the match sequence is "<sequence>"
    When the sequence begins
    Then RUNNING COMMENTARY activates for "<character>"

    Examples:
      | panel    | character    | sequence                       |
      | darts    | Wayne Mardle | Big Fish third dart pending    |
      | darts    | Sid Waddell  | nine-darter third visit        |
      | golf     | Wayne Mardle | chip-in attempt from off green |
      | cricket  | Stuart Pyke  | bowler on hat-trick third ball |
      | football | Stuart Pyke  | one-on-one with keeper         |

  Scenario Outline: RUNNING COMMENTARY intensity register is character-specific
    Given "<character>" has RUNNING COMMENTARY active
    When the sequence reaches its final step
    Then the narration register matches "<register>"

    Examples:
      | character    | register                                     |
      | Wayne Mardle | loud joyful building to shout                |
      | Sid Waddell  | quiet building to baroque literary explosion  |
      | Stuart Pyke  | warm building to genuine disbelief            |
      | Rod Studd    | measured building to one precise word         |
