Feature: TBT Nan dial — life noise reactivity
  As a player
  I want Nan's dial to reflect life pressure, not just visit frequency
  So that missing her while the bank is empty feels different to just being busy

  Background:
    Given the TBT attribute engine is initialised

  Scenario: Bank critical applies a nanQuality penalty on a no-visit turn
    Given nanQuality is 7
    And the player's bank is at or below the critical threshold
    When the player does not visit Nan this turn
    Then nanQuality is 5

  Scenario: Bank critical stacks with a quality-1 visit
    Given nanQuality is 7
    And the player's bank is at or below the critical threshold
    When the player makes a quality-1 visit to Nan
    Then nanQuality is 6

  Scenario: Quality-3 visit outweighs bank pressure
    Given nanQuality is 7
    And the player's bank is at or below the critical threshold
    When the player makes a quality-3 visit to Nan
    Then nanQuality is 9

  Scenario: No bank pressure when bank is healthy
    Given nanQuality is 7
    And the player's bank is above the critical threshold
    When the player does not visit Nan this turn
    Then nanQuality is 6

  Scenario Outline: nanQuality and dial after one turn with bank pressure
    Given nanQuality is <startQuality>
    And the player's bank is at or below the critical threshold
    When the turn resolves with <activity>
    Then nanQuality is <endQuality>
    And the Nan dial is "<dial>"

    Examples:
      | startQuality | activity  | endQuality | dial  |
      | 7            | no-visit  | 5          | amber |
      | 7            | quality-1 | 6          | amber |
      | 7            | quality-2 | 7          | green |
      | 7            | quality-3 | 9          | green |
      | 5            | no-visit  | 3          | red   |
      | 4            | no-visit  | 2          | red   |
