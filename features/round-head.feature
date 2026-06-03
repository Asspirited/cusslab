# The Round Head — Behaviour Specification
# Three Amigos: Rod (business), Claude (tester + dev proxy) — Rod pre-approved for this session
# Date: 2026-06-03
# Mode 1 only — Mode 2 (user as 4th guest) deferred
#
# Ubiquitous language:
#   Round Head      — the panel itself; named after the Ricky Gervais Show animation
#   Karl-channel    — user takes Karl Pilkington's seat; speaks as Karl would
#   Reaction turn   — one Ricky response immediately followed by one Stephen response
#   Question bank   — pool of Karl-style opening prompts (window.ROUND_HEAD_QUESTIONS.allQuestions)
#   Thread          — the ordered list of turns in the current conversation
#   Soft cap        — turn count after which the UI nudges the user to consider stopping
#
# Mechanics in plain English:
#   1. A random question is presented to the user.
#   2. The user responds AS Karl would (channelling).
#   3. Ricky reacts in character (laugh-marker prefixes).
#   4. Stephen reacts in character (measured, dry).
#   5. The user may keep responding. Each response triggers one Ricky + one Stephen turn.
#   6. After 12 user+character turns, a soft-cap nudge appears asking if the user wants to continue.
#   7. The user can request a new question at any time, which resets the thread.

@claude @round-head @mode-1
Feature: The Round Head — Mode 1 (Karl channel chat)

  As a Ricky Gervais Show fan
  I want to channel Karl Pilkington in response to a Karl-style question
  And get reacted to in character by Ricky and Stephen
  So that the conversation feels as exploratory and big as it does on the cartoon

  Background:
    Given the Round Head page is loaded
    And Mode 1 (Karl channel) is the active mode

  # ── OPENING QUESTION ───────────────────────────────────────────────────

  Scenario: A random question is presented on page load
    When the page loads
    Then a question is shown in the current-question card
    And the question is drawn from window.ROUND_HEAD_QUESTIONS.allQuestions when available
    And the question is drawn from the inline default pool when window.ROUND_HEAD_QUESTIONS is undefined

  Scenario: The question card identifies the question as being for Karl
    Then the question-card label reads "CURRENT QUESTION FOR KARL"
    And the question card includes a prompt instructing the user to respond as Karl would

  Scenario: The question is NOT a worker call
    When a question is selected
    Then no API request is made to the worker for question selection

  # ── USER RESPONSE AS KARL ──────────────────────────────────────────────

  Scenario: The user can submit a response
    Given the user types a response in the input box
    When the user clicks Send
    Then a turn is appended to the thread with speaker "user-as-karl"
    And the turn body matches the text the user typed
    And the input box is cleared

  Scenario: Empty user response is handled gracefully
    Given the input box is empty or whitespace-only
    Then the Send button is disabled
    And clicking Send does nothing

  Scenario: Submitting via Enter (without Shift) sends the response
    Given the input box has content
    When the user presses Enter
    Then the response is submitted
    But pressing Shift+Enter inserts a newline instead

  # ── REACTION TURNS ─────────────────────────────────────────────────────

  Scenario: Ricky reacts in character after a user submission
    Given the user has submitted a Karl-channel response
    When the reaction turn runs
    Then a turn with speaker "gervais" is appended to the thread
    And the worker is called with the Ricky character prompt
    And the worker request includes the full prior conversation as context

  Scenario: Stephen reacts in character after Ricky
    Given Ricky has reacted to the user's response
    Then a turn with speaker "merchant" is appended to the thread
    And the worker is called with the Stephen character prompt
    And the worker request includes the user response and Ricky's reaction as context

  Scenario: Reaction turns appear in fixed order — Ricky then Stephen
    When the user submits a Karl-channel response
    Then the very next turn in the thread is "gervais"
    And the turn after that is "merchant"

  Scenario: A loading placeholder shows while each reaction is generated
    When a reaction turn is in flight
    Then a placeholder turn with the loading class is shown
    And the placeholder is replaced with the model's response when it arrives

  Scenario: Reaction-turn failure does not break the thread
    Given the worker returns an error for a reaction turn
    Then the placeholder is replaced with a graceful error message naming the character
    And the user can continue the conversation

  # ── MULTI-ROUND CONVERSATION ───────────────────────────────────────────

  Scenario: Conversation continues for multiple rounds with state preserved
    Given the user has submitted one Karl-channel response
    And Ricky and Stephen have each reacted
    When the user submits a second Karl-channel response
    Then the thread now contains turns in this order: user-as-karl, gervais, merchant, user-as-karl, gervais, merchant
    And every reaction turn after the first round receives the full prior conversation as context

  Scenario: Soft cap nudges the user at 12 combined user+character turns
    Given the user has had a conversation totalling 12 user+character turns
    Then a cap-nudge banner appears asking "Are you still going?"
    And the banner offers a "Keep going" and a "New question" option
    But the cap-nudge does NOT block further input

  Scenario: The cap nudge appears at most once per question
    Given the cap nudge has appeared in the current thread
    Then no further cap nudges appear unless a new question is started

  # ── NEW QUESTION RESET ─────────────────────────────────────────────────

  Scenario: User can request a new question, resetting the thread
    Given a conversation has been underway
    When the user clicks the "New Question" button
    Then a different random question is presented in the current-question card
    And the thread is cleared of all turns
    And the input box is cleared

  Scenario: Requesting a new question while a reaction is in flight is blocked
    Given a reaction turn is currently being generated
    Then the New Question button is disabled
    And clicking it does nothing

  # ── DEPENDENCY SOURCING ────────────────────────────────────────────────

  Scenario: Question source prefers window.ROUND_HEAD_QUESTIONS when defined
    Given window.ROUND_HEAD_QUESTIONS.allQuestions is a non-empty array
    When a question is selected
    Then the question is one of window.ROUND_HEAD_QUESTIONS.allQuestions

  Scenario: Character prompts prefer window.ROUND_HEAD_CHARACTERS when defined
    Given window.ROUND_HEAD_CHARACTERS.gervais and window.ROUND_HEAD_CHARACTERS.merchant are provided
    Then the worker reaction calls use those prompts instead of the inline defaults

  Scenario: Inline defaults are used when no globals are present
    Given window.ROUND_HEAD_QUESTIONS is undefined
    And window.ROUND_HEAD_CHARACTERS is undefined
    Then a baked-in pool of at least 3 questions is available
    And baked-in Ricky and Stephen character prompts are used

  # ── VOICE REGISTER ─────────────────────────────────────────────────────

  Scenario: Ricky's character prompt directs laugh-marker prefixes
    Then the Ricky character prompt instructs the use of bracketed laugh markers such as "[laughs]"
    And the Ricky character prompt instructs in-character incredulous reactions to Karl
    And the Ricky character prompt forbids writing Karl's or Stephen's lines

  Scenario: Stephen's character prompt directs a measured, dry register
    Then the Stephen character prompt instructs a measured patient probing register
    And the Stephen character prompt forbids laugh-marker prefixes
    And the Stephen character prompt forbids writing Karl's or Ricky's lines

  # ── NAVIGATION ─────────────────────────────────────────────────────────

  Scenario: The Round Head is reachable from the Heckler & Cox PLAY nav group
    Given the user is on the Heckler & Cox index
    When the user opens the PLAY group
    Then a tab "The Round Head" is visible
    And clicking it opens round-head.html

  Scenario: A back link returns the user to the index
    Given the user is on the Round Head page
    Then a "← Heckler & Cox" back-link is visible
    And clicking it returns the user to index.html

  # ── MODE 2 PLACEHOLDER ─────────────────────────────────────────────────

  Scenario: Mode 2 is advertised as coming soon
    Then a Mode 2 placeholder note is visible reading "Mode 2: user as 4th guest — coming soon"
    And the Mode 2 button is disabled
