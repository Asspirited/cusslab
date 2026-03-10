Feature: Pub Navigator — Mode A advisory panel
  As a user facing a Friday night pub predicament
  I want to select a situation and receive Sun Tzu's tactical advice
  So that I approach the evening with strategic clarity

  Background:
    Given the user is on the Pub Navigator panel

  Scenario: Five pub situations are presented on load
    Then five pub situation cards are visible

  Scenario: Selecting a pub situation displays Sun Tzu's advice
    When the user selects a pub situation
    Then a Sun Tzu advisory response is displayed

  Scenario: Selecting again after a previous response shows fresh advice
    Given the user has already received a Sun Tzu response
    When the user selects a pub situation
    Then a Sun Tzu advisory response is displayed

  Scenario: buildPubAdvicePrompt includes the selected situation
    Given a pub situation "The bar is three deep. You need a drink."
    When buildPubAdvicePrompt is called
    Then the pub advice prompt includes the situation text

  Scenario: buildPubAdvicePrompt instructs Sun Tzu's voice pattern
    Given a pub situation "The bar is three deep. You need a drink."
    When buildPubAdvicePrompt is called
    Then the pub advice prompt instructs principle, application, and warning
