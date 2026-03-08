# specs/souness-cat.feature
# Mode 1 only — discuss() wired to shared modules
# Panel ID: souness-cat | UI prefix: sc

Feature: Souness's Cat — Science Panel (Mode 1)

  Background:
    Given the Souness's Cat panel is loaded
    And all six scientists are available: Feynman, Franklin, Turing, Darwin, Hawking, Tesla

  # ── Input guard ──────────────────────────────────────────────────────────

  Scenario: Empty input is rejected
    When the user submits an empty prompt
    Then a warning toast displays "Give them something to discuss."
    And no API calls are made

  # ── Happy path ───────────────────────────────────────────────────────────

  Scenario: Valid prompt triggers full panel discussion
    Given the user enters a topic
    When they click the discuss button
    Then the sc-output panel becomes visible
    And the sc-btn is disabled during processing
    And exactly 6 character responses are rendered
    And the sc-btn is re-enabled after all responses complete

  # ── Speaker order ────────────────────────────────────────────────────────

  Scenario: Speaker order is randomised each discussion
    Given the user submits the same topic twice
    Then the speaker order is not guaranteed to be identical across both runs

  # ── Shared module initialisation ─────────────────────────────────────────

  Scenario Outline: Each shared module is initialised once per discussion
    Given the user enters a topic
    When they click the discuss button
    Then <module> is called exactly once before the character loop begins

    Examples:
      | module                   |
      | FoodWeather.createPool() |
      | LieEngine.getState()     |
      | RelationshipState.init() |
      | CharacterState.create()  |

  # ── Character prompt assembly ─────────────────────────────────────────────

  Scenario Outline: Each character's system prompt contains all required blocks
    Given the user enters a topic
    When the discussion runs
    Then <character>'s system prompt contains the TURN_RULES block
    And <character>'s system prompt contains the FoodWeather block
    And <character>'s system prompt contains the LieEngine block
    And <character>'s system prompt contains the RelationshipState block
    And <character>'s system prompt contains the CharacterState block
    And <character>'s system prompt contains their character-specific prompt

    Examples:
      | character |
      | Feynman   |
      | Franklin  |
      | Turing    |
      | Darwin    |
      | Hawking   |
      | Tesla     |

  # ── TURN_RULES integrity ──────────────────────────────────────────────────

  Scenario: Souness's Cat TURN_RULES are identical to the Football gold standard
    Given the Souness's Cat discuss() function
    Then the TURN_RULES block is byte-for-byte identical to the Football panel TURN_RULES

  # ── State updates between turns ───────────────────────────────────────────

  Scenario: RelationshipState is updated after each character turn
    Given a discussion is in progress
    When each character responds in turn
    Then RelationshipState reflects the updated state before the next character speaks

  Scenario: CharacterState decays after each character turn
    Given a discussion is in progress
    When a character has responded
    Then CharacterState.decay() is called for that character before the next turn

  # ── UI rendering ──────────────────────────────────────────────────────────

  Scenario: Character responses render progressively as they arrive
    Given a discussion is in progress
    When a character response is received from the API
    Then it is appended to sc-responses immediately
    And the user does not wait for all six before seeing any output

  Scenario: sc-responses is cleared at the start of each new discussion
    Given a previous discussion has rendered responses
    When the user submits a new topic
    Then sc-responses is emptied before any new responses are rendered
