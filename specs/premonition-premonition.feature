Feature: Premonition Engine PREMONITION mode
  A commentator commits to an instinctive atmospheric call
  with no evidence cited before a high-tension moment
  The call resolves when the tension moment concludes
  The commentator carries the aftermath for the rest of the session

  Background:
    Given the application is loaded
    And a darts match is in progress
    And the "Watching the Oche" tab is active

  Scenario: PREMONITION commit fires when a character with affinity enters a high-tension moment
    Given "Sid Waddell" is selected
    And the match state is a high-tension moment
    When the premonition engine evaluates the moment
    Then a PREMONITION commit is generated for "Sid Waddell"
    And the commit is recorded in session state

  Scenario: PREMONITION commit contains no cited evidence
    Given a PREMONITION commit has fired for "Sid Waddell"
    Then the commit response expresses instinct or atmosphere
    And the commit response does not cite statistics or match data

  Scenario Outline: PREMONITION affinity determines which characters can commit
    Given "<character>" is selected
    And the match state is a high-tension moment
    When the premonition engine evaluates the moment
    Then PREMONITION commit eligibility for "<character>" is "<eligible>"

    Examples:
      | character    | eligible |
      | Sid Waddell  | true     |
      | Jocky Wilson | true     |
      | Stuart Pyke  | true     |
      | Wayne Mardle | true     |
      | John Lowe    | false    |
      | John Part    | false    |

  Scenario Outline: PREMONITION resolution applies the correct aftermath state
    Given a PREMONITION commit is active for "Sid Waddell"
    When the moment resolves as "<resolution>"
    Then Waddell's aftermath state is "<aftermath>"

    Examples:
      | resolution   | aftermath      |
      | EXACT        | GLORY          |
      | TRANSCENDENT | GLORY          |
      | PARTIAL      | PARTIAL_CREDIT |
      | MISS         | HAUNTED        |

  Scenario: GLORY aftermath generates unprompted callbacks at 0.4 probability
    Given "Sid Waddell" is in GLORY aftermath state
    When any subsequent moment type fires involving "Sid Waddell"
    Then there is a 0.4 probability Waddell references the earlier call

  Scenario: HAUNTED aftermath forces character to respond when peers reference the miss
    Given "Sid Waddell" is in HAUNTED aftermath state
    And a peer references Waddell's earlier miss
    Then Waddell must respond to the reference
    And Waddell cannot ignore it

  Scenario: HAUNTED aftermath clears when character makes a subsequent successful commit
    Given "Sid Waddell" is in HAUNTED aftermath state
    When Waddell makes a new PREMONITION commit that resolves as EXACT
    Then Waddell's aftermath state transitions from HAUNTED to GLORY

  Scenario Outline: PREMONITION resolution window varies by match context
    Given a PREMONITION commit is active
    And the match context is "<context>"
    Then the resolution window is "<window>"

    Examples:
      | context               | window          |
      | nine-darter possible  | NEXT_3          |
      | final set approaching | END_OF_SEQUENCE |
      | pressure climax       | NEXT_3          |
