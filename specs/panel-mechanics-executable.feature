Feature: Panel Speech Mechanics — Executable
  As the panel orchestrator
  I want speech mode and turn density to be deterministic
  So that conversation rhythm is testable without LLM output

  Scenario: Short reactive exchange is the default speech mode
    Given a panel member has no active wound trigger
    And no other character's temperature toward them exceeds "simmering"
    When the orchestrator evaluates their speech_mode
    Then their speech_mode is "reactive"
    And their prompt instruction limits output to two sentences maximum

  Scenario: Monologue is earned not default
    Given a panel member's woundActivated is false
    And their intensity is below the monologue threshold
    When the orchestrator evaluates their speech_mode
    Then their speech_mode is not "extended"

  Scenario: Characters build on each other within a round
    Given a round begins with 4 active panel members
    When the round loop runs
    Then each panel member's contribution references the previous speaker's content
    And no panel member speaks without a prior speaker to react to after turn 1
