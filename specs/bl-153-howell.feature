Feature: BL-153 — Golf panel: add "Howling Mad David" — David Howell

  Background:
    Given the Golf panel Q&A section of index.html is loaded

  Scenario: Howell is included in the Golf panel MEMBERS array
    Then the prompt for Golf character "howell" contains "David Howell"

  Scenario: Howell's postureType is narrative
    Then the Golf character "howell" has a postureType field
    And the prompt for Golf character "howell" contains "narrative"

  Scenario: Howell has a NARRATIVE POSTURE block in his prompt
    Then the prompt for Golf character "howell" contains a narrative posture block

  Scenario: Howell's prompt contains The Firewood mechanic
    Then the prompt for Golf character "howell" contains "Firewood" or "wrong word" or "wrong name"

  Scenario: Howell's prompt contains The Stall mechanic
    Then the prompt for Golf character "howell" contains "stall" or "trail off" or "loses the thread"

  Scenario: Howell's wound is present in his prompt
    Then the prompt for Golf character "howell" contains "back" or "2006" or "No. 9"
