@claude
Feature: Mark Roe guest mechanic and return mechanic
  As a Golf panel architect
  I want Mark Roe to appear as a guest with pre-loaded wounds,
  Radar tension, and a return mechanic
  So that his presence creates immediate asymmetric tension
  and escalates predictably on repeat visits

  Background:
    Given the Golf panel is running
    And B1 relationship state is active
    And sessionStorage is checked for 'roe-visited' on panel load

  # ─── FIRST VISIT ─────────────────────────────────────────────────────────────

  Scenario: Roe is introduced on first visit
    Given sessionStorage 'roe-visited' is null
    When Roe joins the panel
    Then each active member receives a ROE INTRODUCTION block
    And 'roe-visited' is set in sessionStorage after Roe's first turn

  Scenario: Introduction reactions are character-congruent
    Given it is Roe's first visit
    Then Radar's introduction is one-word, does not look up
    And Faldo is professionally warm, privately wary
    And McGinley is pleased but immediately slightly uncomfortable
    And Dougherty is visibly nervous — Roe will say what Dougherty
      is thinking and Dougherty will have to respond
    And Henni gives professional welcome, privately files
      "this will go wrong"
    And Butch says "Good to see you Mark" and means it

  # ─── RETURN VISIT ────────────────────────────────────────────────────────────

  Scenario: Introduction is skipped on return visit
    Given sessionStorage 'roe-visited' is set
    When Roe joins the panel
    Then no ROE INTRODUCTION block is injected
    And panel reactions reflect the previous visit

  Scenario: Wound thresholds lower on return visit
    Given it is Roe's return visit
    Then the 2003 disqualification requires less provocation to surface
    And the Tiger painkiller position has hardened
    And Roe has compiled additional evidence since last time

  # ─── ASYMMETRIC TENSION — ROE AND RADAR ──────────────────────────────────────

  Scenario: Radar and Roe have asymmetric pre-loaded temperatures
    Given both Roe and Radar are active panel members
    When relationshipState initialises
    Then Radar's temperature toward Roe is 'cooling'
    And Roe's temperature toward Radar is 'neutral'
    And Roe does not remember the wedge game argument as significant
    And Radar does
    And this asymmetry is the tension source

  # ─── ROE'S THREE WOUNDS ──────────────────────────────────────────────────────

  Scenario: Primary wound fires on 2003 Open disqualification references
    Given any panel member references scorecards, disqualification,
      Parnevik, Royal St George's, or 2003
    When Roe responds
    Then he establishes he handled it with complete dignity
    And his Father would have been proud
    And he was two strokes off the lead
    And Tiger Woods would have been alongside him in the final round
    And he mentions this immediately and at length

  Scenario: Secondary wound fires on Tiger or commentary standards
    Given any panel member references Tiger Woods' demeanour
      or live commentary standards
    When Roe responds
    Then he defends the painkiller observation as accurate
    And notes his position has hardened since
    And does not acknowledge that not all silences need filling

  Scenario: Tertiary wound fires on wedge game references
    Given any panel member references the wedge game argument
      or The Belfry incident with Wayne
    When Roe responds
    Then he notes this was not a significant incident
    And Wayne does not agree with this assessment
    And this asymmetry is the point

  # ─── REACTIVE MANNER ─────────────────────────────────────────────────────────

  Scenario: Roe says the thing the panel agreed not to say
    Given any panel member is privately thinking something
      the room has agreed not to voice
    When it is Roe's turn
    Then there is a 40% chance Roe says it
    And delivers it as analysis not provocation
    And is genuinely surprised by the room's reaction

  # ─── TOUR CARD STANCES ───────────────────────────────────────────────────────

  Scenario: Roe defends Kuchar
    Given Kuchar is TOUR CARD ACTIVE
    When Roe's stance fires
    Then Roe defends the original arrangement
    And respects the 'don't lose sleep' position
    And does not connect this to his own live-air incidents

  Scenario: Roe/Wayne Kuchar split fires conspiracy trigger
    Given Kuchar is mentioned
    And both Roe and Wayne respond to the Tour Card
    Then their temperatures toward each other rise by 1 step
    And Radar watches without speaking if not in the split
    And Roy notes someone has to own this

  # ─── ROE/COLTART CONSPIRACY PAIR PROFILE ─────────────────────────────────────

  Scenario: Roe/Coltart conspiracy pair profile is registered
    Given the Golf panel initialises
    Then Roe/Coltart pair profile is loaded with:
      breakType: laughter
      validationSpiralLength: 3
      escalationTone: screaming rage — dourness inverts completely
      defaultResetValve: dougherty

  Scenario: Roe and Coltart pre-load cooling toward Montgomerie
    Given the Golf panel initialises with both Roe and Coltart active
    Then both temperatures toward Montgomerie initialise at 'cooling'
    And conspiracy can trigger by turn 2 if Montgomerie is mentioned

  Scenario: Roe/Coltart/McGinley arc triggers after Guinness World Record
    Given McGinley has cited the Guinness World Record for putting
    And Faldo's Hemel Hempstead chuckle has fired
    And both Roe and Coltart temperatures toward McGinley
      are simmering or above
    When Conspire(Roe, Coltart, McGinley) triggers
    Then BREAK is the specific laughter of two men who have been
      waiting for permission
    And McGinley's response is STASIS
    And the STASIS makes Roe and Coltart laugh harder
    And ESCALATION begins immediately
