Feature: Gherkin step namespace lint
  As a developer
  I want duplicate step regex patterns to be detected
  So that silent step shadowing is visible before it causes false greens

  Scenario: No collisions in a clean step list
    Given a step list with no duplicate patterns
    When lintStepDuplicates is called
    Then the lint result is empty

  Scenario: One collision detected
    Given a step list where one pattern appears twice
    When lintStepDuplicates is called
    Then the lint result contains 1 collision
    And the collision pattern matches the duplicated regex

  Scenario: Multiple collisions detected
    Given a step list where two different patterns each appear twice
    When lintStepDuplicates is called
    Then the lint result contains 2 collisions

  Scenario: Three occurrences of the same pattern counts as one collision
    Given a step list where one pattern appears three times
    When lintStepDuplicates is called
    Then the lint result contains 1 collision
    And the collision count is 3
