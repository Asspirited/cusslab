
Feature: Watching the Oche — Mode 1, Ask the Panel
  As a user of the Watching the Oche darts panel
  I want to submit questions to the commentary panel
  So that I get in-character responses from darts pundits

  Background:
    Given the darts panel is open
    And mode 1 ask the panel is active

  # ── NAME STRIP ────────────────────────────────────────────────────────────

  Scenario: Name strip is visible before first submission
    Then the name strip input is visible
    And the name strip placeholder text is present
    And the submit button is disabled

  Scenario: Submit button remains disabled when name is empty
    Given the name strip input is empty
    When I type a question into the question textarea
    Then the submit button is disabled

  Scenario: Submit button becomes enabled when both name and question are present
    When I type "Dave" into the name strip
    And I type "Who was the greatest ever?" into the question textarea
    Then the submit button is enabled

  Scenario: Name strip persists across submissions within a session
    Given I have typed "Dave" into the name strip
    And I have submitted a question
    When the response is returned
    Then the name strip still displays "Dave"

  Scenario: Empty name on submit triggers error pulse on name strip
    Given the name strip input is empty
    And I have typed a question into the textarea
    When I click the submit button directly
    Then the name strip input has the error-pulse class

  Scenario: Name is saved to localStorage key hc_golf_username on input
    When I type "Sandra" into the name strip
    Then localStorage key "hc_golf_username" contains "Sandra"

  Scenario: Name strip pre-fills from localStorage on panel load
    Given localStorage key "hc_golf_username" contains "Sandra"
    When the darts panel loads
    Then the name strip displays "Sandra"

  # ── ANCHOR READ-BACK ──────────────────────────────────────────────────────

  Scenario: Anchor read-back fires immediately on submit before API response
    Given the name strip contains "Dave"
    And the question textarea contains "Who throws the best 180?"
    When I click submit
    Then the anchor read-back element is visible
    And the anchor read-back is visible before the API response arrives

  Scenario: Ewen Murray is used as anchor when active in panel
    Given the character "murray" is active in the current panel
    When I submit a question
    Then the anchor read-back element has class "murray"
    And the anchor read-back does not have class "dougherty"

  Scenario: Nick Dougherty is used as anchor when Murray is not active
    Given the character "murray" is not active in the current panel
    And the character "dougherty" is active in the current panel
    When I submit a question
    Then the anchor read-back element has class "dougherty"

  Scenario: Anchor template addresses the user by name
    Given the name strip contains "Dave"
    When I submit a question
    Then the anchor read-back text contains "Dave"

  # ── SUGGESTION CARDS ─────────────────────────────────────────────────────

  Scenario: Suggestion cards tray is visible on panel load
    Then the suggestion cards tray is visible
    And at least 10 suggestion cards are present

  Scenario: Suggestion cards are shuffled on panel load
    Given I note the current order of suggestion cards
    When the panel is reloaded
    Then the suggestion card order has changed

  Scenario: Clicking a suggestion card populates the question textarea
    When I click a suggestion card
    Then the question textarea contains the suggestion card text
    And the textarea is editable after population

  Scenario: Suggestion cards are grouped by category
    Then suggestion cards with category "golf" have the gold colour class
    And suggestion cards with category "absurd" have the blush colour class

  Scenario Outline: Suggestion card categories are all represented
    Then at least one suggestion card has category "<category>"

    Examples:
      | category    |
      | golf        |
      | big         |
      | contemporary|
      | absurd      |

  # ── PROMPT CONSTRUCTION ───────────────────────────────────────────────────

  Scenario: buildPromptPrefix includes user name and question
    Given name "Dave" and question "Who was the greatest ever?" are submitted
    When buildPromptPrefix is called
    Then the result contains "Dave"
    And the result contains "Who was the greatest ever?"

  Scenario: buildPromptPrefix instructs panel to address user directly
    Given name "Dave" is submitted
    When buildPromptPrefix is called
    Then the result contains "Address Dave directly at least once"

  Scenario: buildPromptPrefix references Ewen Murray anchor
    When buildPromptPrefix is called
    Then the result contains "Ewen Murray has just read the question"
