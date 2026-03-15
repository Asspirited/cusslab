Feature: BL-152 — Narrative posture roll-out to Comedy Room, Science Convention, Darts, Long Room

  Background:
    Given the index.html source is loaded

  Scenario: Comedy Room TURN_RULES no longer mandates reaction to the previous speaker
    Then the Comedy Room TURN_RULES does not contain "REACTIVITY OBLIGATION"
    And the Comedy Room TURN_RULES contains "OWN ANGLE"

  Scenario: Science Convention TURN_RULES no longer mandates reaction to the previous speaker
    Then the Science Convention TURN_RULES does not contain "REACTIVITY OBLIGATION"
    And the Science Convention TURN_RULES contains "OWN ANGLE"

  Scenario: Darts TURN_RULES no longer mandates reaction to the previous speaker
    Then the Darts TURN_RULES does not contain "REACTIVITY OBLIGATION"
    And the Darts TURN_RULES contains "OWN ANGLE"

  Scenario: Long Room TURN_RULES no longer mandates reaction to the previous speaker
    Then the Long Room TURN_RULES does not contain "REACTIVITY OBLIGATION"
    And the Long Room TURN_RULES contains "OWN ANGLE"

  Scenario: Football TURN_RULES is unchanged (A/B test baseline preserved)
    Then the Football TURN_RULES does not contain "REACTIVITY OBLIGATION"
    And the Football TURN_RULES contains "OWN ANGLE"
