Feature: Trigger-weighted middle selection — Slice 2 of BL-167
  As a panel architect
  I want middle-slot candidates scored by what just got said in the prior turn —
  positive (enthusiasm primer) and negative (wound) signals weighted equally —
  with a floor probability so cold candidates remain occasionally selectable
  So that a character who is lit up by the previous speaker's drift is more
  likely to fire next, and the panel reacts to the person not the topic
  (Principle 2 of .claude/principles/panel-design.md)

  Background:
    Given the Golf panel Q&A section of index.html is loaded

  # ── Locked contract (Rod 2026-05-16) — runner-skipped, kept verbatim ────────

  @claude
  Scenario: A turn that hits a candidate's wound trigger raises that candidate's score
    Given candidate B has wound trigger words W
    And the previous turn contains a word from W
    When the trigger score for B is computed
    Then B's score includes the wound-trigger weight

  @claude
  Scenario: A turn that overlaps a candidate's enthusiasm primer raises that candidate's score
    Given candidate B has an enthusiasm primer P
    And the previous turn contains a word or topic from P
    When the trigger score for B is computed
    Then B's score includes the enthusiasm-primer weight

  @claude
  Scenario: Positive and negative triggers contribute equally to selection probability
    Given candidate B's only score contribution is a wound-trigger hit
    And candidate C's only score contribution is an enthusiasm-primer hit
    When the two candidates' scores are compared
    Then B's score equals C's score

  @claude
  Scenario: The engine does not verify accuracy of a candidate's trigger
    Then the selection function does not call any fact-check or accuracy routine
    And a candidate whose enthusiasm primer matches a misreading of the previous turn is eligible for selection at the full enthusiasm-primer weight

  @claude
  Scenario: A cold candidate retains a floor probability of being selected
    Given candidate C has score zero against the previous turn
    And other candidates have positive scores
    When the selection runs many rounds
    Then C is selected at a rate no lower than the floor probability pmin

  @claude
  Scenario: When every candidate scores zero, selection is uniform random
    Given every non-anchor candidate has score zero against the previous turn
    And there are M non-anchor candidates
    When the selection runs many rounds
    Then each candidate's selection rate converges toward 1/M

  # ── Runner-executable assertions — source-code-parsing ──────────────────────

  Scenario: The trigger-score engine module exists at the canonical path
    Then the file "src/logic/trigger-score-engine.js" exists

  Scenario: The engine exports a score function
    Then "src/logic/trigger-score-engine.js" exports a function named "score"

  Scenario: The engine exports a selectNext function
    Then "src/logic/trigger-score-engine.js" exports a function named "selectNext"

  Scenario: The engine documents its public contract at the top of the file
    Then "src/logic/trigger-score-engine.js" contains a contract comment describing the score input shape and weights

  Scenario: The engine has no direct DOM or fetch or sessionStorage dependencies
    Then "src/logic/trigger-score-engine.js" does not reference "document"
    And "src/logic/trigger-score-engine.js" does not reference "fetch"
    And "src/logic/trigger-score-engine.js" does not reference "sessionStorage"

  Scenario: The engine does not call any fact-check or accuracy routine
    Then "src/logic/trigger-score-engine.js" does not reference "factCheck"
    And "src/logic/trigger-score-engine.js" does not reference "verifyAccuracy"
    And "src/logic/trigger-score-engine.js" does not reference "validateClaim"

  Scenario: The wound and enthusiasm-primer weights are equal (locked scenario 9)
    Then "src/logic/trigger-score-engine.js" declares wound and enthusiasm-primer weights as equal

  Scenario: The engine declares a floor probability pmin
    Then "src/logic/trigger-score-engine.js" declares a default pmin value greater than zero and less than one
