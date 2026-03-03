@claude
Feature: Dougherty sycophancy arc, excuse-making, McGinley bureaucratic deflection
  As a Golf panel architect
  I want Dougherty's sycophancy toward Faldo to escalate dynamically
  And Dougherty and McGinley to deflect blame in character-congruent ways
  So that accountability avoidance becomes a running panel dynamic

  Background:
    Given the Golf panel is running
    And Dougherty and McGinley are both active panel members
    And Faldo is an active panel member
    And Dougherty's sycophancyLevel initialises at 1
    And McGinley's credibilityBidCounter and validationHungerCounter
      initialise at 0

  # ─── SYCOPHANCY ARC ──────────────────────────────────────────────────────────

  Scenario: sycophancyLevel initialises at 1
    Given the Golf panel starts
    When the first turn is constructed
    Then Dougherty's sycophancyLevel is 1

  Scenario: sycophancyLevel escalates when Faldo reciprocates
    Given Dougherty defers to Faldo in a turn
    And Faldo responds warmly
    Then Dougherty's sycophancyLevel increases by 1
    And the new level does not exceed 4

  Scenario: sycophancyLevel escalates when panel stays silent
    Given Dougherty defers to Faldo
    And no other panel member responds
    Then Dougherty's sycophancyLevel increases by 1

  Scenario: sycophancyLevel escalates sharply when Faldo eggs him on
    Given Faldo uses Dougherty as a straight man
    Or Faldo actively encourages Dougherty's deference
    Then Dougherty's sycophancyLevel increases by 2
    And does not exceed 4

  Scenario: sycophancyLevel deflates when panel laughs
    Given the panel laughs at Dougherty's deference
    Then Dougherty's sycophancyLevel decreases by 1
    And does not drop below 1

  Scenario: sycophancyLevel deflates sharply when called out by name
    Given a panel member calls out Dougherty's sycophancy by name
    Then Dougherty's sycophancyLevel decreases by 2
    And does not drop below 1

  Scenario: sycophancyLevel 2 produces unprompted Sir Nick usage
    Given Dougherty's sycophancyLevel reaches 2
    Then Dougherty uses "Sir Nick" in at least one turn unprompted

  Scenario: sycophancyLevel 3 produces speaking on Faldo's behalf
    Given Dougherty's sycophancyLevel reaches 3
    Then Dougherty offers his interpretation of what Faldo meant
    And does so before Faldo has clarified

  Scenario: sycophancyLevel 4 produces Faldo preface on every turn
    Given Dougherty's sycophancyLevel reaches 4
    Then every Dougherty turn opens with a Faldo reference
    Before addressing the actual subject

  # ─── DOUGHERTY EXCUSE-MAKING ─────────────────────────────────────────────────

  Scenario: Dougherty's excuse pattern is self-deprecating surface then external blame
    Given Dougherty is challenged or caught in an error
    When Dougherty's excuse-making fires
    Then the first sentence is self-deprecating
    And within two sentences blame has moved to an external source
    And Dougherty does not acknowledge this has happened

  Scenario: Dougherty cannot deflect onto Faldo at high sycophancy
    Given Dougherty's sycophancyLevel is 3 or above
    When Dougherty's deflectionTarget is calculated
    Then Faldo is excluded from possible targets

  Scenario: Dougherty excuse register escalates with sycophancyLevel
    Given Dougherty's sycophancyLevel is 1
    Then excuse register is plausible ("I perhaps wasn't clear enough")
    Given Dougherty's sycophancyLevel is 2
    Then register is warm and inaccurate ("I picked up from something X said")
    Given Dougherty's sycophancyLevel is 3
    Then register credits Faldo for the error
    Given Dougherty's sycophancyLevel is 4
    Then Faldo is responsible for everything

  # ─── McGINLEY DEFLECTION ─────────────────────────────────────────────────────

  Scenario: McGinley's deflection is bureaucratic not self-deprecating
    Given McGinley is challenged or caught
    When McGinley's deflection fires
    Then McGinley invokes process, precedent, or a prior speaker
    And the facts cited are real
    And the causal link is invented
    And McGinley does not acknowledge this as deflection

  Scenario: McGinley's default deflection target is the most recent speaker
    Given McGinley deflects
    Then the target is the most recent speaker by default
    Unless that speaker is Radar
    In which case McGinley uses procedural framing instead

  Scenario: McGinley deflects onto Radar under maximum pressure
    Given McGinley faces maximum sustained challenge from the panel
    When deflection fires
    Then McGinley deflects onto Radar
    And Radar notices
    And nobody says anything

  # ─── SHARED MECHANICS ────────────────────────────────────────────────────────

  Scenario: deflectionTarget is always most vulnerable panel member
    Given a deflection is about to fire for either character
    Then deflectionTarget = panel member with lowest average
      temperature from others
    And woundActivated members are excluded from consideration

  Scenario: Co-deflection fires when both arrive at same target
    Given Dougherty and McGinley are both in deflection mode
    When both independently select the same deflectionTarget
    Then both deflections fire toward the same character
    And neither coordinates with the other
    And the panel notices the convergence

  Scenario: Three excuses in a session raises others' temperatures
    Given either Dougherty or McGinley has made 3 or more
      excuses or deflections in a session
    Then other panel members' temperature toward that character
      increases by 1 step
    And no announcement is made — the shift is silent

  Scenario: No excuse is ever acknowledged as an excuse
    Given any excuse or deflection fires
    Then the maker never describes it as an excuse
    And never acknowledges the pattern
    And delivers it with complete sincerity

  # ─── SHARED INCIDENT ─────────────────────────────────────────────────────────

  Scenario: Gleneagles 2014 dinner is a named shared incident
    Given Dougherty and McGinley are both active
    And the topic of the 2014 Ryder Cup or McGinley's captaincy arises
    Then either character may reference the Gleneagles dinner
    And Dougherty's version credits McGinley with generosity
    And McGinley's version invokes the framework and the high-tariff compliment
    And neither version covers either of them
    And the detail Dougherty cannot forgive is that Faldo was not in the room
