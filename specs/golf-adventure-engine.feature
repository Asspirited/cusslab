# Golf Adventure — Game Engine Characterisation
# Feature: specs/golf-adventure-engine.feature
# PR: feat/golf-adventure-architecture — Step 2: engine extraction
# Purpose: lock down game rules as pure-function contracts before extraction
# Reference: Beck — TDD; Feathers — characterisation tests; Martin — Clean Architecture

@golf-adventure-engine
Feature: Golf Adventure Game Engine

  The game engine is a set of pure functions. No DOM. No API.
  Same inputs always produce the same outputs.
  These tests lock down the rules before extraction.

  Background:
    Given the golf adventure engine is loaded

  ---

  ## Starting a game

  @engine-start
  Scenario: Starting a game initialises state correctly
    When a game is started with tournament "duel_sun", player "watson", panel "faldo,mcginley", atmosphere "NORMAL"
    Then the state has composure 10
    And the state has yourScore 0
    And the state has day 0
    And the state has holeIdx 0
    And the state has phase "tee"

  ---

  ## Rolling the dice — outcome quality

  @engine-roll
  Scenario Outline: Roll outcome is determined by roll vs effective threshold
    Given a game state with composure <composure> on a par 4 hole
    And the current shot has risk <risk> and thresh <thresh>
    When the roll is <roll>
    Then the outcome quality is "<quality>"

    Examples:
      | composure | risk | thresh | roll | quality  |
      | 10        | 2    | 3      | 5    | solid    |
      | 10        | 2    | 3      | 2    | trouble  |
      | 10        | 3    | 4      | 1    | disaster |
      | 10        | 3    | 4      | 6    | miracle  |

  @engine-roll
  Scenario: Low composure adds threshold penalty
    Given a game state with composure 3 on a par 4 hole
    And the current shot has risk 2 and thresh 3
    When the roll is 4
    Then the effective threshold is 5
    And the outcome quality is "trouble"

  @engine-roll
  Scenario: Catastrophic outcome on roll 1 with high-risk shot regardless of threshold
    Given a game state with composure 10 on a par 4 hole
    And the current shot has risk 3 and thresh 4
    When the roll is 1
    Then the outcome quality is "disaster"

  ---

  ## Phase routing

  @engine-phase
  Scenario: Par 4 tee shot advances to approach
    Given a game state in "tee" phase on a par 4 hole
    When the shot resolves as "solid"
    Then the next phase is "approach"

  @engine-phase
  Scenario: Par 3 tee shot advances to par3 not approach
    Given a game state in "tee" phase on a par 3 hole
    When the shot resolves as "solid"
    Then the next phase is "par3"

  @engine-phase
  Scenario: Miracle on approach ends the hole immediately
    Given a game state in "approach" phase on a par 4 hole
    When the shot resolves as "miracle"
    Then the hole ends

  @engine-phase
  Scenario: Miracle on par3 phase ends the hole immediately
    Given a game state in "par3" phase on a par 3 hole
    When the shot resolves as "miracle"
    Then the hole ends

  @engine-phase
  Scenario: Trouble on putt ends the hole
    Given a game state in "putt" phase on a par 4 hole
    When the shot resolves as "trouble"
    Then the hole ends

  ---

  ## Hole scoring

  @engine-score
  Scenario: Birdie is scored correctly
    Given a game state with yourScore 0 on a par 4 hole with 3 strokes taken
    When endHole is called
    Then the hole score diff is -1
    And yourScore is -1

  @engine-score
  Scenario: Bogey is scored correctly
    Given a game state with yourScore 0 on a par 4 hole with 5 strokes taken
    When endHole is called
    Then the hole score diff is 1
    And yourScore is 1

  ---

  ## Field simulation

  @engine-field
  Scenario: Field simulation uses historical scores for other players on day 0
    Given a full game state for tournament "duel_sun", player "watson", day 0, yourScore -2
    When the field is simulated
    Then the player "watson" field score is -2
    And the other players have their day 0 historical scores
