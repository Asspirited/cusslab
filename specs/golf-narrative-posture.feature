Feature: BL-143 — Narrative Move Model: Golf panel walking skeleton

  Background:
    Given the Golf panel Q&A section of index.html is loaded

  Scenario: Golf TURN_RULES no longer mandates reaction to the previous speaker
    Then the Golf TURN_RULES does not contain "REACTIVITY OBLIGATION"
    And the Golf TURN_RULES does not contain "Every response must open by reacting to the previous speaker's last sentence"

  Scenario: Golf TURN_RULES RULE 2 instructs characters to lead with their own angle
    Then the Golf TURN_RULES contains "OWN ANGLE"
    And the Golf TURN_RULES contains "own position"

  Scenario Outline: Each Golf panel member has a narrative posture block in their prompt
    Then the prompt for Golf character "<characterId>" contains a narrative posture block
    Examples:
      | characterId |
      | radar       |
      | faldo       |
      | mcginley    |
      | coltart     |
      | roe         |
      | murray      |
      | dougherty   |
      | henni       |
      | butch       |

  Scenario: Radar's narrative posture includes lying behaviour
    Then the prompt for Golf character "radar" contains "lie"

  Scenario: Coltart's narrative posture includes going to unexpected places
    Then the prompt for Golf character "coltart" contains "unexpected" or "tangent" or "weird"

  Scenario: No Golf character narrative posture instructs reaction to previous speaker
    Then no Golf character narrative posture block contains "react to"
    And no Golf character narrative posture block contains "previous speaker"
