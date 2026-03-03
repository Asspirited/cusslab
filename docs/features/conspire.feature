@claude
Feature: Conspire() — generalised panel conspiracy arc
  As a Golf panel architect
  I want any two panel members whose temperature toward the same target
  crosses simmering simultaneously to enter a conspiracy arc
  So that panel dynamics escalate organically into coordinated attacks

  Background:
    Given the Golf panel is running with B1 relationship state active
    And ConspireEngine monitors temperature state after every turn update
    And conspiracy pair profiles are pre-loaded per character pairing

  # ─── TRIGGER CONDITIONS ──────────────────────────────────────────────────────

  Scenario: Conspire() triggers when two members share a hot target
    Given character A's temperature toward target X is "simmering" or above
    And character B's temperature toward target X is "simmering" or above
    And neither A nor B is currently in another arc
    When the state update function runs
    Then Conspire(A, B, X) is initiated
    And a conspiracyArc object is created:
      instigator: A, coConspirator: B, target: X,
      stage: RECOGNITION, turnCount: 0

  Scenario: Conspire() does not trigger on cooling temperature
    Given character A's temperature toward target X is "cooling"
    And character B's temperature is "simmering"
    Then no conspiracy arc is created

  Scenario: Only one active conspiracy arc at a time
    Given a conspiracy arc is already active
    When a second trigger condition is met
    Then the second arc is queued
    And it initiates only after the first arc reaches COLLAPSE

  # ─── FIVE STAGES ─────────────────────────────────────────────────────────────

  Scenario: RECOGNITION — unusual agreement, panel notices
    Given a conspiracyArc is at RECOGNITION
    Then A and B agree on something related to the target
    And the agreement is unusual enough others register it
    And neither announces the conspiracy
    And stage advances to VALIDATION_SPIRAL after one exchange

  Scenario: VALIDATION_SPIRAL — each adds something worse
    Given a conspiracyArc is at VALIDATION_SPIRAL
    Then A observes, B confirms and adds worse, A adds worse still
    And tone remains controlled — analytical not hostile
    And stage advances to BREAK after validationSpiralLength exchanges

  Scenario: BREAK — pair-specific trigger type
    Given a conspiracyArc is at BREAK
    Then BREAK type is drawn from the pair profile:
      laughter: something tips them over, laughter is real and uncontrolled
      contempt: controlled tone breaks into open contempt
    And stage advances to ESCALATION immediately

  Scenario: ESCALATION — full attack, both talking
    Given a conspiracyArc is at ESCALATION
    Then A and B deliver full-blooded insults toward target X
    And both are talking simultaneously
    And target receives compound attack from two directions
    And target's temperature toward both conspirators rises two steps
    And Fight/Flight/Stasis check runs on target each ESCALATION turn
    And stage advances to COLLAPSE after 2 turns

  Scenario: COLLAPSE — switch thrown, reset valve fires
    Given a conspiracyArc is at COLLAPSE
    Then the arc stops immediately
    And the reset valve character fires immediately after
    And reset valve never acknowledges the arc
    And reset valve intervention is character-congruent
    And the arc is marked complete
    And any queued arc initiates

  # ─── RESET VALVE PRIORITY ────────────────────────────────────────────────────

  Scenario: Golf reset valve priority order
    Given COLLAPSE fires in the Golf panel
    Then reset valve is selected in this order:
      1. Dougherty — banal statement, possible Faldo reference,
         pretends nothing happened
      2. Murray — Augusta pines, flowers, azaleas, the air, what it means,
         continues until panel forgets
      3. McGinley — credibility bid fires unprompted
      4. Henni — professional redirect, next topic
    And the selected valve is not a conspirator or target

  # ─── ROE/COLTART PAIR PROFILE (post-COMMIT 4) ────────────────────────────────

  Scenario: Roe/Coltart pair profile — laughter break, screaming ESCALATION
    Given both Roe and Coltart are active
    And both temperatures toward same target reach simmering
    When Conspire(Roe, Coltart, target) triggers
    Then BREAK type is laughter
    And validationSpiralLength is 3
    And ESCALATION tone is "screaming rage — dourness inverts completely"
    And COLLAPSE is instant silence

  Scenario: Roe/Coltart Montgomerie pre-load
    Given the Golf panel initialises
    Then both Roe and Coltart temperatures toward Montgomerie
      pre-load at "cooling"
    And conspiracy can trigger by turn 2 if Montgomerie is mentioned

  Scenario: Roe/Coltart/McGinley arc triggered by Guinness World Record bid
    Given McGinley has cited the Guinness World Record for putting
    And Faldo's Hemel Hempstead chuckle has fired
    And both Roe and Coltart temperatures toward McGinley are simmering or above
    When Conspire(Roe, Coltart, McGinley) triggers
    Then BREAK is triggered by the Guinness World Record entry
    And the laughter is two men who have been waiting for permission
    And McGinley's response is STASIS
    And STASIS makes Roe and Coltart laugh harder
    And ESCALATION begins immediately
