Feature: Cross-character questions (BL-171)
  As a panel architect
  I want panellists to occasionally direct questions to each other rather
  than only responding to the user — the addressed character may answer,
  may ignore, may hijack the question for their own point
  So that panels feel like a room of people interacting, not a queue of
  speakers each responding to one host independently

  Background:
    Given the file "src/logic/panel-discuss-engine.js" exists

  Scenario: buildSystemPrompt with crossCharacterQuestionsEnabled emits the block
    Then buildSystemPrompt with crossCharacterQuestionsEnabled true contains "CROSS-CHARACTER QUESTIONS"

  Scenario: Block is suppressed for anchor opener turns
    Then buildSystemPrompt for slot 0 anchor member with crossCharacterQuestionsEnabled true does not contain "CROSS-CHARACTER QUESTIONS"

  Scenario: Block is suppressed for anchor closer turns
    Then buildSystemPrompt for final slot anchor member with crossCharacterQuestionsEnabled true does not contain "CROSS-CHARACTER QUESTIONS"

  Scenario: Block is suppressed for interjection turns
    Then buildSystemPrompt with interjectionMode true and crossCharacterQuestionsEnabled true does not contain "CROSS-CHARACTER QUESTIONS"

  Scenario: Block instructs addressing by name
    Then the CROSS-CHARACTER QUESTIONS block in engine source includes "address" and "name"

  Scenario: Block notes the addressed panellist may ignore the question
    Then the CROSS-CHARACTER QUESTIONS block in engine source includes "ignore"

  Scenario: Block is absent when crossCharacterQuestionsEnabled is false or omitted
    Then buildSystemPrompt without crossCharacterQuestionsEnabled does not contain "CROSS-CHARACTER QUESTIONS"
