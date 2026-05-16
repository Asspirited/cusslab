Feature: Panel turn-order — anchor + slot structure, Slice 1 (BL-167)
  As a panel architect
  I want each panel to open and close every round with a fixed anchor
  character with the non-anchor cast in the middle slots
  So that the round has a consistent shape with a fixed opener and closer
  and is no longer locked to the same speaker in the same slot every round

  Background:
    Given the Golf panel Q&A section of index.html is loaded

  Scenario: The Golf ORDER places the anchor at slot 1
    Then the Golf ORDER construction places the anchor at the first slot

  Scenario: The Golf ORDER places the anchor at slot N
    Then the Golf ORDER construction places the anchor at the final slot

  Scenario: The Golf anchor closer prompt includes a ROUND SO FAR block
    Then the Golf discuss function includes an "ANCHOR_CLOSER MODE" prompt block
    And the ANCHOR_CLOSER block contains "ROUND SO FAR"

  Scenario: The Golf anchor opener prompt does not include a ROUND SO FAR block
    Then the Golf discuss function includes an "ANCHOR_OPENER MODE" prompt block
    And the ANCHOR_OPENER block does not contain "ROUND SO FAR"

  Scenario: Each shipped panel has a configured anchor
    Then the Golf panel config declares anchor "murray"
    And the Boardroom panel config declares anchor "harold"
    And the Football panel config declares anchor "souness"
    And the ComedyRoom panel config declares anchor "gervais"
    And the LongRoom panel config declares anchor "blofeld"
    And the Racing panel config declares anchor "brazil"
    And the Snooker panel config declares anchor "jimmy_white"
    And the HipHop panel config declares anchor "eminem"

  Scenario: The Golf middle cast excludes the anchor
    Then the Golf middle cast list does not contain "murray"

  Scenario: Each Golf non-anchor character appears in the middle cast at most once
    Then the Golf middle cast list contains each member id at most once
