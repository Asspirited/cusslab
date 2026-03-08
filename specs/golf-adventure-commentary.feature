# Golf Adventure — Commentary Service Characterisation
# Feature: specs/golf-adventure-commentary.feature
# PR: feat/golf-adventure-architecture — Step 3: commentary service extraction
# Purpose: lock down prompt building and API contract before extraction
# Reference: Beck — TDD; Freeman/Pryce — consumer-driven contracts; Martin — DIP

@golf-adventure-commentary
Feature: Golf Adventure Commentary Service

  CommentaryService builds prompts and parses responses.
  No DOM. No real API calls. apiClient is a contract stub.

  Background:
    Given the commentary service is loaded

  ---

  ## Prompt building — shot

  @commentary-prompt
  Scenario: Shot prompt contains essential context
    Given a shot context for tournament "duel_sun", player "watson", quality "disaster", roll 1
    When the shot prompt is built
    Then the commentary prompt contains the tournament name "The Duel in the Sun"
    And the commentary prompt contains the player name "Tom Watson"
    And the commentary prompt contains "DISASTER"
    And the commentary prompt contains "DICE: 1"

  @commentary-prompt
  Scenario: Shot prompt does not specify paragraph counts
    Given a shot context for tournament "duel_sun", player "watson", quality "solid", roll 4
    When the shot prompt is built
    Then the commentary prompt does not contain "paragraph"

  @commentary-prompt
  Scenario: Shot prompt includes panel engagement context when panelState has nickname
    Given a shot context for tournament "duel_sun", player "watson", quality "solid", roll 4
    And the panelState has playerNickname "The Wobbler"
    When the shot prompt is built
    Then the commentary prompt contains "The Wobbler"

  ---

  ## Prompt building — day summary

  @commentary-prompt
  Scenario: Day summary prompt contains score vs history when behind
    Given a day summary context for tournament "duel_sun", player "watson", day 0, score -2, historical -1
    When the day prompt is built
    Then the commentary prompt contains "1 shot(s) BEHIND"

  @commentary-prompt
  Scenario: Day summary divergence alert fires when 3 or more shots ahead
    Given a day summary context for tournament "duel_sun", player "watson", day 0, score -5, historical -1
    When the day prompt is built
    Then the commentary prompt contains "DIVERGENCE ALERT"
    And the commentary prompt contains "4 shots AHEAD"

  ---

  ## Response parsing

  @commentary-parse
  Scenario: Valid JSON response is parsed to speaker lines
    Given a raw API response of '[{"speaker":"Nick Faldo","initials":"NF","text":"Technically appalling."}]'
    When the shot response is parsed
    Then the result has 1 line
    And line 0 has speaker "Nick Faldo"
    And line 0 has text "Technically appalling."

  @commentary-parse
  Scenario: Malformed JSON returns empty array without throwing
    Given a raw API response of 'not json at all'
    When the shot response is parsed
    Then the result has 0 lines

  @commentary-parse
  Scenario: Code-fenced JSON is unwrapped before parsing
    Given a raw API response of '```json\n[{"speaker":"Faldo","text":"Poor."}]\n```'
    When the shot response is parsed
    Then the result has 1 line

  ---

  ## API contract

  @commentary-contract
  Scenario: Shot call sends correct model and max_tokens to apiClient
    Given a shot context for tournament "duel_sun", player "watson", quality "solid", roll 4
    And a stub apiClient that records its call
    When CommentaryService.shot is called
    Then the apiClient received model "claude-sonnet-4-20250514"
    And the apiClient received max_tokens 1200

  @commentary-contract
  Scenario: API failure returns empty lines without throwing
    Given a shot context for tournament "duel_sun", player "watson", quality "solid", roll 4
    And a stub apiClient that throws
    When CommentaryService.shot is called
    Then the result has 0 lines

  ---

  ## Prompt helpers — pure functions

  @commentary-helpers
  Scenario: extractCharacterContext keeps wound voice and comic mechanism sections
    Given a character markdown with sections P1 wound, P2 mask, P3 voice, P4 escalation, P5 comic
    When extractCharacterContext is called
    Then the result contains section "P1"
    And the result contains section "P3"
    And the result contains section "P5"
    And the result does not contain section "P2"
    And the result does not contain section "P4"

  @commentary-helpers
  Scenario: extractCharacterContext caps output at 3000 characters
    Given a character markdown with 10000 characters of content
    When extractCharacterContext is called
    Then the result length is at most 3000
