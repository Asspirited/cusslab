Feature: Profani-saurus engine integration (BL-169)
  As a panel architect
  I want a character-authentic profanity instruction block emitted into
  the system prompt so each character swears in their own register
  (Souness terse-Glasgow, Boyle surgical-dark, Murray almost-never)
  rather than generic improvised filler
  So that profanity is craft per Principle 5 — never weapon, never filler,
  always earned through one of the five purposes

  Background:
    Given the file "src/logic/panel-discuss-engine.js" exists

  Scenario: buildSystemPrompt with profanityEnabled emits the block
    Then buildSystemPrompt with profanityEnabled true contains "PROFANITY REGISTER"

  Scenario: Block instructs the five purposes
    Then the PROFANITY block in engine source includes "off-air" and "phonetic"
    And the PROFANITY block in engine source includes "intensifier" and "climax"
    And the PROFANITY block in engine source includes "emotional"

  Scenario: Block forbids weapon-not-craft register
    Then the PROFANITY block in engine source includes "never weapon"

  Scenario: Block notes rich variety over volume
    Then the PROFANITY block in engine source includes "variety"

  Scenario: Block notes character-authentic constraint
    Then the PROFANITY block in engine source includes "your character" and "own register"

  Scenario: Block references the canonical profani-saurus location
    Then the PROFANITY block in engine source includes "profani-saurus"

  Scenario: Block is absent when profanityEnabled false or omitted
    Then buildSystemPrompt without profanityEnabled does not contain "PROFANITY REGISTER"
