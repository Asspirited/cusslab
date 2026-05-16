Feature: Anchor mid-round interjection (BL-170)
  As a panel architect
  I want the anchor to occasionally speak BETWEEN middle slots — not just
  at the bookends — to course-correct sustained off-piste drift or to
  amplify a wound moment, in their voice
  So that long rounds get gentle steering instead of unbroken middle-cast
  monologue, and the anchor's presence is felt mid-flight

  Background:
    Given the file "src/logic/panel-discuss-engine.js" exists

  Scenario: The engine exports a shouldAnchorInterject function
    Then "src/logic/panel-discuss-engine.js" exports a function named "shouldAnchorInterject"

  Scenario: shouldAnchorInterject with minimal valid input returns a boolean
    Then shouldAnchorInterject with minimal valid input returns a boolean

  Scenario: shouldAnchorInterject base rate is low when no boosts fire
    Then shouldAnchorInterject called 500 times with no boosts fires fewer than 200 times

  Scenario: shouldAnchorInterject fires almost always when wound activation is set
    Then shouldAnchorInterject called 50 times with woundActivated true fires more than 25 times

  Scenario: shouldAnchorInterject fires more often when recentMoves shows sustained same-posture
    Then shouldAnchorInterject called 200 times with three identical recentMoves fires more than the same-config baseline

  Scenario: buildSystemPrompt with interjectionMode true emits an ANCHOR_INTERJECTION block
    Then buildSystemPrompt for an anchor turn with interjectionMode true contains "ANCHOR_INTERJECTION MODE"

  Scenario: ANCHOR_INTERJECTION block is distinct from ANCHOR_OPENER and ANCHOR_CLOSER text
    Then the ANCHOR_INTERJECTION block in the engine source does not duplicate the ANCHOR_OPENER or ANCHOR_CLOSER template

  Scenario: TOPIC-DISMISSAL is suppressed for interjection turns
    Then buildSystemPrompt with interjectionMode true and topicDismissal set does not contain the topicDismissal string

  Scenario: Interjection block instructs short redirecting steering not blocking
    Then the ANCHOR_INTERJECTION block in the engine source includes "short" and "redirect"
    And the ANCHOR_INTERJECTION block in the engine source does not include "block"
