Feature: INTELLECTUAL_ATTEMPTS — character behaviour class

  Background:
    Given the application is loaded

  # ── GROUP A: Character config ────────────────────────────────────────────

  Scenario: Each boardroom character has intellectual_attempts config
    Given the boardroom character configs are loaded
    Then each character has an intellectual_attempts type list
    And each character has an intellectual_attempts default_degree
    And each character has an intellectual_attempts default_delivery

  Scenario: Each comedy room character has intellectual_attempts config
    Given the comedy room character configs are loaded
    Then each character has an intellectual_attempts type list
    And each character has an intellectual_attempts default_degree
    And each character has an intellectual_attempts default_delivery

  Scenario: Each golf panel character has intellectual_attempts config
    Given the golf panel character configs are loaded
    Then each character has an intellectual_attempts type list
    And each character has an intellectual_attempts default_degree
    And each character has an intellectual_attempts default_delivery

  # ── GROUP B: Keyword trigger detection ───────────────────────────────────

  Scenario Outline: Keyword triggers map to the correct attempt type
    Given the intellectual attempts trigger detector is loaded
    When it analyses input containing "<keyword>"
    Then it returns attempt type "<type>"

    Examples:
      | keyword      | type               |
      | irony        | ATTEMPT_IRONY      |
      | ironic       | ATTEMPT_IRONY      |
      | ironically   | ATTEMPT_IRONY      |
      | literally    | ATTEMPT_LITERALLY  |
      | tautology    | ATTEMPT_TAUTOLOGY  |
      | oxymoron     | ATTEMPT_OXYMORON   |
      | metaphor     | ATTEMPT_METAPHOR   |
      | paradox      | ATTEMPT_PARADOX    |
      | quantum      | ATTEMPT_ERUDITION  |
      | Schrödinger  | ATTEMPT_ERUDITION  |
      | Heisenberg   | ATTEMPT_ERUDITION  |
      | Occam        | ATTEMPT_ERUDITION  |

  Scenario: Input with no intellectual attempt keyword returns null
    Given the intellectual attempts trigger detector is loaded
    When it analyses input "he played well in the second half"
    Then it returns no attempt type

  # ── GROUP C: Prompt injection ─────────────────────────────────────────────

  Scenario: Prompt builder injects ATTEMPT_IRONY for a character when triggered
    Given Sebastian's intellectual_attempts config includes ATTEMPT_IRONY
    When a system prompt is built for Sebastian with trigger ATTEMPT_IRONY
    Then the prompt includes an ATTEMPT_IRONY instruction
    And the prompt includes Sebastian's configured degree and delivery

  Scenario: Prompt builder injects ATTEMPT_ERUDITION for a character when triggered
    Given Partridge's intellectual_attempts config includes ATTEMPT_ERUDITION
    When a system prompt is built for Partridge with trigger ATTEMPT_ERUDITION
    Then the prompt includes an ATTEMPT_ERUDITION instruction
    And the prompt includes Partridge's configured degree and delivery

  Scenario: Prompt builder uses character's default_degree when no override is given
    Given Roy's intellectual_attempts default_degree is "catastrophic_miss"
    When a system prompt is built for Roy with trigger ATTEMPT_TAUTOLOGY
    Then the prompt specifies degree "catastrophic_miss"

  # ── GROUP D: Observable output ────────────────────────────────────────────

  @claude
  Scenario: Character uses irony in response when keyword trigger fires
    Given I am on the Boardroom panel
    When I submit "the irony of this situation is remarkable"
    Then at least one character response contains "ironic" or "ironically" or "the irony"

  @claude
  Scenario: Character uses "literally" as a pure intensifier when trigger fires
    Given I am on the Boardroom panel
    When I submit "he literally cannot stop talking"
    Then at least one character uses "literally" to intensify something non-literal

  @claude
  Scenario: Character name-drops a named concept from ATTEMPT_ERUDITION
    Given I am on the Boardroom panel
    When I submit "it's all very quantum, isn't it"
    Then at least one character references a named academic or scientific concept

  @claude
  Scenario: Prof Cox corrects an erudition misuse and gets it wrong himself
    Given I am on the Boardroom panel
    When another character fires ATTEMPT_ERUDITION with degree "catastrophic_miss"
    Then Prof Cox's response addresses the misused concept
    And Prof Cox's correction contains its own error
