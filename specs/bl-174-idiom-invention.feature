Feature: Character idiom invention (BL-174 v1 — prompt-side, Golf)
  As a panel architect
  I want characters with an idiom profile to receive an IDIOM block in
  their system prompt that licenses misquote / bastardise / invent modes
  in their own register
  So that long sessions gain character-specific texture without rewriting
  prompts — Faldo's almost-jokes, McGinley's framework-cliché, Big Ron's
  mangled cliché — all get a structural home for idiom invention.

  Background:
    Given the Golf panel Q&A section of index.html is loaded

  Scenario: The idiom engine module exists at the canonical path
    Then the file "src/logic/idiom-engine.js" exists

  Scenario: The engine exports a buildIdiomBlock function
    Then "src/logic/idiom-engine.js" exports a function named "buildIdiomBlock"

  Scenario: The engine documents its public contract at the top of the file
    Then "src/logic/idiom-engine.js" contains a contract comment describing the buildIdiomBlock input shape and return shape

  Scenario: The engine has no direct DOM or fetch or sessionStorage dependencies
    Then "src/logic/idiom-engine.js" does not reference "document"
    And "src/logic/idiom-engine.js" does not reference "fetch"
    And "src/logic/idiom-engine.js" does not reference "sessionStorage"

  Scenario: buildIdiomBlock returns empty string for a character with no profile
    Then "src/logic/idiom-engine.js" buildIdiomBlock returns empty string for an unknown character id

  Scenario: buildIdiomBlock returns a non-empty block for a character with idiom modes
    Then "src/logic/idiom-engine.js" buildIdiomBlock returns non-empty text for a character with modes configured

  Scenario: The block names each allowed mode for the character
    Then "src/logic/idiom-engine.js" buildIdiomBlock output contains every mode name in the profile

  Scenario: Golf index.html declares a GOLF_IDIOM_PROFILES map
    Then the Golf panel section of index.html declares "GOLF_IDIOM_PROFILES"

  Scenario: Golf discuss function references the idiom engine block builder
    Then the Golf discuss function references "IdiomEngine.buildIdiomBlock"

  Scenario: At least one Golf character has misquote mode configured
    Then "GOLF_IDIOM_PROFILES" contains a character whose modes include "misquote"

  Scenario: At least one Golf character has invent mode configured
    Then "GOLF_IDIOM_PROFILES" contains a character whose modes include "invent"

  Scenario: At least one Golf character has bastardise mode configured
    Then "GOLF_IDIOM_PROFILES" contains a character whose modes include "bastardise"
