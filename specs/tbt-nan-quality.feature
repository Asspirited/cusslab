Feature: TBT Nan quality mechanic
  As a player
  I want Nan's relationship dial to reflect the quality of visits, not just frequency
  So that I discover that presence alone is not enough to maintain the relationship

  Background:
    Given the TBT attribute engine is initialised

  Scenario Outline: nanQuality determines the Nan dial
    Given nanQuality is <score>
    Then the Nan dial is "<dial>"

    Examples:
      | score | dial  |
      | 9     | green |
      | 7     | green |
      | 6     | amber |
      | 5     | amber |
      | 4     | amber |
      | 3     | red   |
      | 0     | red   |

  Scenario: Greyed dial overrides nanQuality
    Given nanQuality is 9
    And the Nan dial is greyed
    Then the Nan dial is greyed

  Scenario: Quality-3 visit raises nanQuality by 3
    Given nanQuality is 5
    When the player makes a quality-3 visit to Nan
    Then nanQuality is 8
    And the Nan dial is green

  Scenario: Quality-2 visit raises nanQuality by 1
    Given nanQuality is 5
    When the player makes a quality-2 visit to Nan
    Then nanQuality is 6
    And the Nan dial is amber

  Scenario: Quality-1 visit does not change nanQuality
    Given nanQuality is 5
    When the player makes a quality-1 visit to Nan
    Then nanQuality is 5
    And the Nan dial is amber

  Scenario: Not visiting Nan reduces nanQuality by 1
    Given nanQuality is 5
    When the player does not visit Nan this turn
    Then nanQuality is 4

  Scenario: nanQuality does not fall below 0
    Given nanQuality is 0
    When the player does not visit Nan this turn
    Then nanQuality is 0

  Scenario: nanQuality does not exceed 9
    Given nanQuality is 9
    When the player makes a quality-3 visit to Nan
    Then nanQuality is 9

  Scenario: Quality-1 visits cannot build toward green
    Given nanQuality is 4
    When the player makes a quality-1 visit to Nan
    Then nanQuality is 4
    And the Nan dial is amber

  Scenario: Greyed dial is not restored by a quality-3 visit
    Given the Nan dial is greyed
    When the player makes a quality-3 visit to Nan
    Then the Nan dial is greyed

  Scenario: Visit quality is classified as 1 from cursory input
    Given it is a free evening
    When the player says "went round to Nan's"
    Then the activity is VISIT_NAN
    And the visit quality is 1

  Scenario: Visit quality is classified as 2 from conversation input
    Given it is a free evening
    When the player says "had a proper sit-down with Nan and a cup of tea"
    Then the activity is VISIT_NAN
    And the visit quality is 2

  Scenario: Visit quality is classified as 3 from tin engagement input
    Given it is a free evening
    When the player says "sat with Nan and looked through the biscuit tin"
    Then the activity is VISIT_NAN
    And the visit quality is 3

  Scenario: Visit quality is classified as 3 from grandfather story input
    Given it is a free evening
    When the player says "asked Nan about grandad and the old days"
    Then the activity is VISIT_NAN
    And the visit quality is 3

  Scenario: Turn summary notes a quality-3 visit
    Given nanQuality is 5
    When the player makes a quality-3 visit to Nan
    Then the turn summary includes a note about the grandfather story

  Scenario: Turn summary notes a quality-1 visit without engagement
    Given nanQuality is 5
    When the player makes a quality-1 visit to Nan
    Then the turn summary notes the visit without an engagement note

  Scenario: Red Nan dial contributes to lifeNoise
    Given nanQuality is 2
    When lifeNoise is calculated
    Then the Nan dial is red
    And lifeNoise contribution from Nan is 1

  Scenario: Amber Nan dial does not contribute to lifeNoise
    Given nanQuality is 5
    When lifeNoise is calculated
    Then lifeNoise contribution from Nan is 0

  Scenario: New game initialises nanQuality at 5
    Given a new TBT game is started
    Then nanQuality is 5
    And the Nan dial is amber
