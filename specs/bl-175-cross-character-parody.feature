Feature: Cross-character catchphrase parody (BL-175)
  As a panel architect
  I want panellists to occasionally redeploy another character's
  signature line ironically, redirected at a third target — the
  three-character comedy (speaker × victim-of-quote × target-of-jab)
  So that the panel rewards audience knowledge of canonical lines
  and lands the parody as humour, not flat repetition

  Background:
    Given the file "src/logic/panel-discuss-engine.js" exists

  Scenario: buildSystemPrompt with parodyEnabled emits the block
    Then buildSystemPrompt with parodyEnabled true contains "CROSS-CHARACTER PARODY"

  Scenario: Block is suppressed for anchor opener turns
    Then buildSystemPrompt for slot 0 anchor member with parodyEnabled true does not contain "CROSS-CHARACTER PARODY"

  Scenario: Block is suppressed for anchor closer turns
    Then buildSystemPrompt for final slot anchor member with parodyEnabled true does not contain "CROSS-CHARACTER PARODY"

  Scenario: Block is suppressed for interjection turns
    Then buildSystemPrompt with interjectionMode true and parodyEnabled true does not contain "CROSS-CHARACTER PARODY"

  Scenario: Block instructs deploying another character's signature line ironically
    Then the CROSS-CHARACTER PARODY block in engine source includes "signature" and "ironically"

  Scenario: Block instructs returning to own angle after the parody beat
    Then the CROSS-CHARACTER PARODY block in engine source includes "return" and "own angle"

  Scenario: Block sets a once-per-response cap
    Then the CROSS-CHARACTER PARODY block in engine source includes "once"

  Scenario: Block is absent when parodyEnabled is false or omitted
    Then buildSystemPrompt without parodyEnabled does not contain "CROSS-CHARACTER PARODY"
