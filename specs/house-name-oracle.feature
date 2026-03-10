Feature: House Name Oracle — Comedy Room Mode 2

  Background:
    Given the user is on the Comedy Room
    And the Oracle mode is active

  # ─── INPUT VALIDATION ───────────────────────────────────────────

  Scenario Outline: Valid location codes are accepted
    When the user enters "<code>" in the Oracle location field
    Then the code is accepted as a valid input
    Examples:
      | code |
      | SW1A |
      | LS1  |
      | M1   |
      | EH1  |
      | BT1  |
      | D02  |
      | A65  |

  Scenario Outline: Invalid inputs are rejected
    When the user enters "<invalid>" in the Oracle location field
    Then an error is shown explaining the accepted format
    Examples:
      | invalid |
      | 12345   |
      | ABCDEFG |
      |         |

  # ─── ARCHETYPE GATE (mandatory) ─────────────────────────────────

  Scenario: User cannot submit without selecting an archetype
    Given the user has entered a valid location code
    And no Oracle voice archetype is selected
    When the user attempts to submit to the Oracle
    Then the archetype selector is highlighted as required
    And no generation occurs

  Scenario: Submission proceeds when archetype is selected
    Given the user has entered a valid location code
    And the user has selected an Oracle voice archetype
    When the user submits to the Oracle
    Then the Oracle conversation is generated

  # ─── OUTPUT STRUCTURE ────────────────────────────────────────────

  Scenario: All three characters appear in every Oracle conversation
    Given a valid Oracle submission has completed
    Then Phil Spencer's response is present
    And Kirstie Allsopp's response is present
    And Dion Dublin's response is present

  Scenario: Oracle output contains three house names in distinct registers
    Given a valid Oracle submission has completed
    Then three house names are presented
    And one name is in the Dignified register
    And one name is in the Knowing register
    And one name is in the Unhinged register
    And each name includes a one-line Oracle rationale

  # ─── CHARACTER MECHANICS ─────────────────────────────────────────

  Scenario: Phil translates Oracle findings to market value language
    Given the Oracle has surfaced a research finding for the location
    When Phil Spencer's response is generated
    Then his response includes the phrase "what we're really talking about here"
    And the finding is reframed in property market terms

  Scenario: Kirstie reframes any negative finding as aspirational
    Given the Oracle has surfaced a negative characteristic of the location
    When Kirstie Allsopp's response is generated
    Then her response reframes the characteristic as a positive
    And the reframe is completed within two sentences

  Scenario: Dion Dublin's response moves through all four drift stages
    Given the Oracle has surfaced any research finding
    When Dion Dublin's response is generated
    Then his response contains The Bridge stage
    And his response contains The Departure stage
    And his response contains The Wander stage
    And his response contains The Accidental Summit stage
    And his response returns to the property at the end

  # ─── ARCHETYPE VOICE ─────────────────────────────────────────────

  Scenario Outline: Selected archetype shapes the Oracle rationale register
    Given the user selects the "<archetype>" Oracle voice
    When the Oracle rationale is generated
    Then the rationale reflects the "<register>" register
    Examples:
      | archetype  | register                                      |
      | Elegist    | mournful, past-focused                        |
      | Rogue      | innuendo and double entendre                  |
      | DarkOracle | sincere delivery of grim historical facts     |
      | Booster    | relentlessly positive framing of grim reality |
      | Snob       | aspirational, slightly too effortful          |
      | Anarchist  | political, angry, accurate                    |
      | Mystic     | ley lines, ancient energies, UFO-confident    |
      | Local      | hyper-specific, assumes insider knowledge     |
