Feature: Author Epilogue — Football integration (BL-082)
  The Author's Account button appears after a Football Moment response
  so the author pool is accessible from the football panel.

  Scenario: Author epilogue button present in football output structure
    When the football panel HTML is loaded
    Then the football output area contains an author epilogue button
    And the author epilogue button calls the football author epilogue function

  Scenario: buildFootballAuthorContext produces context string
    Given a football moment with type "penalty" and topic "Rooney at the World Cup"
    When buildFootballAuthorContext is called
    Then the context includes "penalty"
    And the context includes "Rooney"

  Scenario: buildFootballAuthorEpiloguePrompt uses shared author voice
    Given an author voice for "twain"
    And a football context "penalty: Rooney at the World Cup"
    When buildFootballAuthorEpiloguePrompt is called
    Then the prompt includes "Mark Twain"
    And the prompt includes "penalty"

  Scenario: Football author epilogue is exported from logic
    Then logic exports buildFootballAuthorContext
    And logic exports buildFootballAuthorEpiloguePrompt
