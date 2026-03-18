Feature: TBT opening scene emotional engagement

  Scenario: Player reads the opening scene
    Given the player has entered DOB, grandfather's name, and their own name
    When the opening scene completes
    Then the player is presented with a cursor and no explicit instruction
    And the biscuit tin contents are established without over-explanation
    And the grandfather's name appears greyed in the relationships panel
    And the player's bank balance and domestic situation are visible
    And no cricket or football stats are shown — only empty headers with dashes

  Scenario: Player chooses to get on the bus
    Given the opening scene has completed
    When the player expresses any intent to go to Utley Cricket Club
    Then the game resolves their intent regardless of exact phrasing
    And a consequence scene renders at the club
    And the turn summary fires at scene end

  Scenario: Player chooses not to get on the bus
    Given the opening scene has completed
    When the player expresses intent to stay or do something else
    Then the game honours that choice without judgment
    And a different scene renders
    And the club remains available in future turns
