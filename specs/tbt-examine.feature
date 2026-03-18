Feature: TBT EXAMINE tin objects

  Scenario: Player EXAMINEs the match stub
    Given the opening scene has completed
    When the player types EXAMINE STUB or similar
    Then the soft dog-eared quality is described — carried not kept
    And the date and ground are legible: THE OVAL, AUGUST 1948
    And no score is written on it
    And the final line notes he wanted to remember he was there

  Scenario: Player EXAMINEs the Eagle comic
    Given the opening scene has completed
    When the player types EXAMINE EAGLE or LOOK AT COMIC or similar
    Then the Mekon detail renders — cold contempt, flying saucer
    And the colours being still bright is noted — the tin kept the light out
    And the player's honest reaction is present — a bit naff, kept anyway

  Scenario: Player EXAMINEs the button
    Given the opening scene has completed
    When the player types EXAMINE BUTTON or similar
    Then a single short response renders
    And no explanation is offered for what it was from

  Scenario: Player EXAMINEs the coin
    Given the opening scene has completed
    When the player types EXAMINE COIN or similar
    Then the worn smooth quality is noted — wording gone
    And the crest is described as half-legible
    And it is not identified — semi-final or final, unknown
