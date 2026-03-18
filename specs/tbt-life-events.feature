Feature: TBT life events — injury, illness, and tenacity drift
  As a player
  I want fitness and fatigue to create real consequences
  So that managing my body matters as much as managing my time

  Background:
    Given the TBT attribute engine is initialised

  # ── Injury risk ──────────────────────────────────────────────────────────

  Scenario: Low physique and low freshness produce higher injury risk
    Then injury risk with physique 3 freshness 1 is higher than with physique 7 freshness 4

  Scenario: Injury risk is always a low probability
    Then injury risk with physique 3 freshness 1 does not exceed 0.20

  # ── Injury application ───────────────────────────────────────────────────

  Scenario: MINOR injury reduces physique by 1 and sets 1 week recovery
    Given life state physique is 5
    When a MINOR injury is applied
    Then life state physique is 4
    And injury weeks remaining is 1

  Scenario: MODERATE injury reduces physique by 2 and sets 3 weeks recovery
    Given life state physique is 5
    When a MODERATE injury is applied
    Then life state physique is 3
    And injury weeks remaining is 3

  Scenario: SEVERE injury reduces physique by 3 and sets 6 weeks recovery
    Given life state physique is 5
    When a SEVERE injury is applied
    Then life state physique is 2
    And injury weeks remaining is 6

  # ── Injury recovery ──────────────────────────────────────────────────────

  Scenario: NETS does not change physique while injured
    Given life state physique is 4
    And the player has an injury with 2 weeks remaining
    When the player goes to nets this turn
    Then life state physique is 4

  Scenario: Injury weeks remaining decrements each turn
    Given the player has an injury with 2 weeks remaining
    When a life turn passes
    Then injury weeks remaining is 1

  Scenario: Injury clears when weeks remaining reaches zero
    Given the player has an injury with 1 week remaining
    When a life turn passes
    Then the player has no injury

  # ── Illness risk ─────────────────────────────────────────────────────────

  Scenario: Low freshness produces higher illness risk
    Then illness risk with freshness 1 is higher than with freshness 5

  Scenario: Illness risk is always a low probability
    Then illness risk with freshness 1 does not exceed 0.15

  # ── Illness application ──────────────────────────────────────────────────

  Scenario: Illness collapses freshness and sets the illness flag
    Given life state freshness is 4
    When illness is applied
    Then life state freshness is 1
    And the player is marked as ill

  Scenario: NETS is blocked while the player is ill
    Given the player is ill this turn
    When the player attempts nets while ill
    Then the activity is blocked with an illness note

  Scenario: MATCH is blocked while the player is ill
    Given the player is ill this turn
    When the player attempts a match while ill
    Then the activity is blocked with an illness note

  Scenario: Illness clears after one turn
    Given the player is ill this turn
    When a life turn passes
    Then the player is no longer ill

  # ── Tenacity drift ───────────────────────────────────────────────────────

  Scenario: Three consecutive good-form turns raise tenacity by 1
    Given life state tenacity is 5
    And the form streak is 2 good
    When the form word this turn is "Flying"
    Then life state tenacity is 6
    And the form streak is reset

  Scenario: Three consecutive bad-form turns lower tenacity by 1
    Given life state tenacity is 5
    And the form streak is 2 bad
    When the form word this turn is "Struggling"
    Then life state tenacity is 4
    And the form streak is reset

  Scenario: Shaky resets the form streak
    Given the form streak is 2 good
    When the form word this turn is "Shaky"
    Then the form streak is reset

  Scenario: Good form following bad resets and starts a positive streak
    Given the form streak is 2 bad
    When the form word this turn is "Decent"
    Then the form streak is 1 good

  Scenario: Tenacity does not drift below its minimum
    Given life state tenacity is at its minimum
    And the form streak is 2 bad
    When the form word this turn is "Struggling"
    Then life state tenacity is at its minimum
