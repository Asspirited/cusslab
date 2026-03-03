@claude
Feature: Fight / Flight / Stasis — conspiracy arc target response
  As a Golf panel architect
  I want the conspiracy target's response to be determined by their
  temperature relative to baseline
  So that FIGHT, FLIGHT, and STASIS produce distinct and readable outcomes

  Background:
    Given a conspiracyArc has reached ESCALATION
    And target X is an active panel member
    And Fight/Flight/Stasis check runs after every ESCALATION turn

  # ─── DETERMINATION ───────────────────────────────────────────────────────────

  Scenario: Response is determined by temperature vs neutral baseline
    Given target X's average temperature toward conspirators is compared
      against neutral
    Then: current hotter than neutral → FIGHT
    And:  current cooler than neutral → FLIGHT
    And:  current equals neutral      → STASIS

  # ─── FIGHT ───────────────────────────────────────────────────────────────────

  Scenario: FIGHT — target interrupts and escalates
    Given target X's response is FIGHT
    Then X interrupts during ESCALATION
    And X addresses both conspirators directly
    And ESCALATION ends after one turn instead of two
    And both conspirators' temperatures toward X rise one step
    And X's wound activates if not already active

  # ─── FLIGHT ──────────────────────────────────────────────────────────────────

  Scenario: FLIGHT — target withdraws
    Given target X's response is FLIGHT
    Then X goes quiet during ESCALATION
    And X's next turn after COLLAPSE addresses anyone except the conspirators
    And character-specific exits apply:
      Wayne: invokes Bush Tucker Man
      Dougherty: makes an excuse
      Roy: nods
      McGinley: fires a credibility bid
      Coltart: silence

  # ─── STASIS ──────────────────────────────────────────────────────────────────

  Scenario: STASIS — target freezes
    Given target X's response is STASIS
    Then X remains present but does not respond during ESCALATION
    And the panel notices the stillness
    And the stillness is worse than fight or flight
    And other panel members' temperatures toward X shift unpredictably

  Scenario: STASIS is more likely for characters with neutral baseline
    Given target X has not been directly addressed in 3+ turns
    And target X's wound has not been activated
    And target X's pre-loaded relationship stances toward conspirators
      are both neutral
    Then any conspiracy targeting X produces STASIS

  Scenario: STASIS accelerates ESCALATION
    Given target X's response is STASIS
    Then ESCALATION extends by one additional turn
    And both conspirators' laughter or intensity increases
    And COLLAPSE follows naturally
