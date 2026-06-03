# The Round Head — Behaviour Specification
# Three Amigos: Rod (business), Claude (tester + dev proxy) — Rod pre-approved for this session
# Date: 2026-06-03
# Modes: Mode 1 ("15 Minutes of Fame") AND Mode 2 ("4th Guest")
#
# Ubiquitous language:
#   Round Head       — the panel itself; named after the Ricky Gervais Show animation
#   Karl-channel     — user takes Karl Pilkington's seat; speaks as Karl would (Mode 1)
#   4th Guest        — user joins as themselves at a table with Karl, Ricky and Stephen (Mode 2)
#   Reaction turn    — one round of character responses to a user turn
#                       (Mode 1: Ricky → Stephen | Mode 2: Karl → Ricky → Stephen)
#   Question bank    — pool of Karl-style opening prompts (Mode 1 only)
#   Thread           — the ordered list of turns in the current conversation
#   Soft cap         — turn count after which the UI nudges the user to consider stopping
#   Mode toggle      — top-of-page selector that switches between Mode 1 and Mode 2
#
# Mode 1 mechanics in plain English:
#   1. A random question is presented to the user.
#   2. The user responds AS Karl would (channelling).
#   3. Ricky reacts in character (laugh-marker prefixes).
#   4. Stephen reacts in character (measured, dry).
#   5. The user may keep responding. Each response triggers one Ricky + one Stephen turn.
#   6. After 12 user+character turns, a soft-cap nudge appears asking if the user wants to continue.
#   7. The user can request a new question at any time, which resets the thread.
#
# Mode 2 mechanics in plain English:
#   1. No question is pinned. The user submits an opening turn (a thought, observation, or question).
#   2. Karl reacts first (he is the gravity well — he sets the tangent).
#   3. Ricky reacts (cackling, badgering Karl, dragging Stephen in).
#   4. Stephen reacts (measured, dry, probing).
#   5. The user may re-enter with reactions, follow-ups, or fresh observations.
#   6. Each user turn triggers one Karl + one Ricky + one Stephen turn in that fixed order.
#   7. Same 12-turn soft cap applies.
#   8. The user can start a new conversation at any time, which resets the thread.
#
# Cross-mode mechanics:
#   - The mode toggle at the top of the page switches between the two modes.
#   - Switching modes clears the thread (each mode starts fresh).
#   - The mode choice is persisted in localStorage so refresh remembers it.

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
    And baked-in Karl, Ricky and Stephen character prompts are used

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

@claude @round-head @mode-2
Feature: The Round Head — Mode 2 (4th Guest)

  As a Ricky Gervais Show fan
  I want to join Karl, Ricky and Stephen at the table as a fourth voice
  And get them reacting to my observations AND to each other
  So that the conversation captures the classic Karl-Ricky-Stephen dynamic with me in it

  Background:
    Given the Round Head page is loaded
    And Mode 2 (4th Guest) is the active mode

  # ── MODE 2 PAGE SHELL ──────────────────────────────────────────────────

  Scenario: Mode 2 hides the pinned question card
    When Mode 2 is selected
    Then the current-question card is not shown
    And no question is pre-populated
    And the user is invited to submit the opening turn

  Scenario: Mode 2 input invites a user-led opening
    When Mode 2 is selected
    Then the input placeholder reads "Drop a thought, observation, or question — Karl, Ricky and Stephen will pick it up"

  Scenario: Mode 2 advertises four voices in the avatar strip
    When Mode 2 is selected
    Then avatars are shown for "You", "Karl", "Ricky", and "Stephen"

  Scenario: Mode 2 reset button is labelled "New Conversation"
    When Mode 2 is selected
    Then the reset button reads "New Conversation" (or equivalent reset label)
    And it does NOT read "New Question"

  # ── USER OPENS THE CONVERSATION ────────────────────────────────────────

  Scenario: User submits an opening turn — Karl, Ricky, Stephen each respond in order
    Given Mode 2 has just been entered with an empty thread
    When the user submits their opening turn
    Then a turn with speaker "user" is appended to the thread first
    And then a turn with speaker "karl" is appended
    And then a turn with speaker "gervais" is appended
    And then a turn with speaker "merchant" is appended
    And the three character turns appear in exactly that order

  Scenario: Karl is reacted to using the inline Karl character prompt in Mode 2
    Given Mode 2 is active
    When the user submits their opening turn
    Then the worker is called with a Karl character prompt
    And the Karl prompt instructs Karl-shaped sincere obliviousness in Manchester register
    And the Karl prompt references Karl's Topic Magnets (heads, monkey/animal stories, biscuits, hypotheticals, Manchester local detail)
    And the Karl prompt forbids writing Ricky's or Stephen's lines

  Scenario: Empty user turn handled gracefully
    Given the input box is empty or whitespace-only in Mode 2
    Then the Send button is disabled
    And clicking Send does nothing

  # ── MULTI-ROUND CONVERSATION (MODE 2) ──────────────────────────────────

  Scenario: Conversation continues for multiple rounds with state preserved
    Given the user has submitted one Mode 2 turn
    And Karl, Ricky and Stephen have each reacted
    When the user submits a second turn
    Then the thread now contains turns in this order: user, karl, gervais, merchant, user, karl, gervais, merchant
    And every character reaction after the first round receives the full prior conversation as context

  Scenario: Each round produces exactly three character turns per user turn
    Given Mode 2 is active
    When the user submits a turn
    Then exactly three character turns are appended (one Karl, one Ricky, one Stephen) before the user is prompted again

  Scenario: Soft cap nudges the user at 12 combined user+character turns
    Given the user has had a Mode 2 conversation totalling 12 user+character turns
    Then a cap-nudge banner appears asking "Are you still going?"
    And the banner offers a "Keep going" and a "New conversation" option
    But the cap-nudge does NOT block further input

  Scenario: The cap nudge appears at most once per conversation
    Given the cap nudge has appeared in the current Mode 2 thread
    Then no further cap nudges appear unless a new conversation is started

  # ── NEW CONVERSATION RESET ─────────────────────────────────────────────

  Scenario: User can start a new Mode 2 conversation, resetting the thread
    Given a Mode 2 conversation has been underway
    When the user clicks the "New Conversation" button
    Then the thread is cleared of all turns
    And the input box is cleared
    And no pinned question is shown

  # ── REACTION-TURN INFRASTRUCTURE (shared with Mode 1) ──────────────────

  Scenario: A loading placeholder shows while each Mode 2 reaction is generated
    When a Mode 2 reaction turn is in flight
    Then a placeholder turn with the loading class is shown
    And the placeholder is replaced with the model's response when it arrives

  Scenario: Mode 2 reaction failure does not break the thread
    Given the worker returns an error for a Mode 2 reaction turn
    Then the placeholder is replaced with a graceful error message naming the character
    And the user can continue the conversation

@claude @round-head @mode-toggle
Feature: The Round Head — Mode toggle and persistence

  As a Ricky Gervais Show fan
  I want a clean switch between Mode 1 and Mode 2 at the top of the page
  And my mode choice remembered across page reloads
  So that I can pick the experience I want without losing it on refresh

  # ── MODE SELECTOR UI ───────────────────────────────────────────────────

  Scenario: The mode selector is visible at the top of the page
    Given the Round Head page is loaded
    Then a mode selector with two buttons is visible near the header
    And one button is labelled "Mode 1" with the blurb "15 Minutes of Fame" / "you AS Karl"
    And the other button is labelled "Mode 2" with the blurb "4th Guest" / "you AS yourself, Karl present"

  Scenario: The active mode is visually indicated on the selector
    Given Mode 1 is the active mode
    Then the Mode 1 button is marked active and the Mode 2 button is not

  # ── SWITCHING MODES CLEARS THE THREAD ──────────────────────────────────

  Scenario: Switching from Mode 1 to Mode 2 clears the thread
    Given Mode 1 is active and the thread contains turns
    When the user clicks the Mode 2 button
    Then Mode 2 becomes the active mode
    And the thread is cleared of all turns
    And the pinned question card is hidden
    And the input is ready for a Mode 2 opening turn

  Scenario: Switching from Mode 2 to Mode 1 clears the thread
    Given Mode 2 is active and the thread contains turns
    When the user clicks the Mode 1 button
    Then Mode 1 becomes the active mode
    And the thread is cleared of all turns
    And a fresh question is pinned at the top
    And the input prompts the user to respond as Karl would

  Scenario: Switching mode while a reaction is in flight is blocked
    Given a reaction turn is currently being generated
    Then the mode toggle buttons are disabled
    And clicking them does nothing

  # ── PERSISTENCE (localStorage) ─────────────────────────────────────────

  Scenario: Mode choice persists across page reload
    Given the user has selected Mode 2
    When the page is reloaded
    Then Mode 2 is the active mode

  Scenario: Default mode for a first-time user is Mode 1
    Given localStorage has no stored mode choice
    When the page is loaded
    Then Mode 1 is the active mode

  Scenario: Reloading mid-conversation does not preserve the thread
    Given a Mode 2 conversation has been underway
    When the page is reloaded
    Then Mode 2 is still the active mode
    And the thread is empty (only mode preference persists, not thread state)
