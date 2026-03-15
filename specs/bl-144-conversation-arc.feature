Feature: BL-144 — Narrative Move Model: ConversationArc accumulation (Golf panel)

  Background:
    Given the Golf panel Q&A section of index.html is loaded

  Scenario: Golf discuss() initialises an empty arc log before the panel runs
    Then the Golf discuss function initialises an arcLog array

  Scenario: Golf discuss() appends a name-attributed arc entry after each response
    Then the Golf discuss function appends to arcLog after each API response
    And the arc entry format includes the character name and response content

  Scenario: First Golf character receives no arc block in their system prompt
    Then the Golf system prompt for the first character does not include "NARRATIVE ARC SO FAR"

  Scenario: Second and subsequent Golf characters receive the arc block in their system prompt
    Then the Golf system prompt for subsequent characters includes "NARRATIVE ARC SO FAR"

  Scenario: Arc block appears after the Previous block in the Golf system prompt
    Then the Golf system prompt contains "NARRATIVE ARC SO FAR" after "Previous:"
