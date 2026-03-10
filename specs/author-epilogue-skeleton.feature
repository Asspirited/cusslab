Feature: Author's Epilogue — walking skeleton
  A literary author narrates a completed Golf Adventure in their distinctive voice.
  Skeleton: Hemingway hardcoded, Golf Adventure only, button wired, output displayed.

  Scenario: Author voices include a valid Hemingway entry
    When the author voice definitions are loaded
    Then the hemingway voice has a voiceSignature property
    And the hemingway voice has a structuralTell property
    And the hemingway voice has a wound property

  Scenario Outline: buildAuthorEpiloguePrompt includes voice and game context
    Given the hemingway author voice
    And a game context with player "<player>", outcome "<outcome>", panel "golf"
    When buildAuthorEpiloguePrompt is called with the hemingway voice and the game context
    Then the prompt includes the voice signature
    And the prompt includes "<player>"
    And the prompt includes "<outcome>"
    And the prompt requests between 250 and 400 words

    Examples:
      | player        | outcome           |
      | Nick Faldo    | 3 over par        |
      | Tiger Woods   | 15 under par      |
      | Rocco Mediate | level par playoff |

  Scenario: Author's Account button is present after game ends
    Given a Golf Adventure game has ended
    When the final score screen is shown
    Then a button labelled "The Author's Account 📖" is visible
    And the epilogue output area is not visible

  Scenario: Clicking the button requests an epilogue via the Worker
    Given the final score screen is shown
    When the user clicks "The Author's Account 📖"
    Then an epilogue is requested from the Worker with the Hemingway prompt

  Scenario: The epilogue response is displayed when received
    Given an epilogue request has returned "He putted. He missed. The sun did not care."
    When the response is rendered
    Then the epilogue output area displays "He putted. He missed. The sun did not care."
