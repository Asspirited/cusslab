Feature: Sun Tzu General Advisory Mode
  As a user with any question
  I want Sun Tzu to apply his framework to it
  So that any situation — not just pub predicaments — receives tactical clarity

  Background:
    Given "suntzu" is in the consultant skin tabs
    And "suntzu" is registered in the nav group map

  Scenario: Panel is wired into the Little Misadventure nav group
    Then "suntzu" is registered in the nav group map

  Scenario: Panel has a free-text input field
    Then the Sun Tzu advisory panel has a text input

  Scenario: Submit button is disabled when input is empty
    Then the Sun Tzu advisory submit button is disabled

  Scenario: Submit button is enabled when input has text
    Given the user has entered text in the Sun Tzu advisory input
    Then the Sun Tzu advisory submit button is enabled

  Scenario: buildSunTzuAdvisoryPrompt includes the user question
    Given a user question "Should I confront my manager?"
    When buildSunTzuAdvisoryPrompt is called
    Then the Sun Tzu advisory prompt includes the question text

  Scenario: buildSunTzuAdvisoryPrompt instructs principle, application, and warning
    Given a user question "Should I confront my manager?"
    When buildSunTzuAdvisoryPrompt is called
    Then the Sun Tzu advisory prompt instructs principle, application, and warning

  Scenario: buildSunTzuAdvisoryPrompt does not constrain topic to pub situations
    Given a user question "Should I confront my manager?"
    When buildSunTzuAdvisoryPrompt is called
    Then the Sun Tzu advisory prompt does not mention pub situations
