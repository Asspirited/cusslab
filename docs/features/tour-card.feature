@claude
Feature: Tour Card mechanic — named player stances injected on name detection
  As a Golf panel architect
  I want named Tour Card players to trigger character-specific stances
  When their name appears in the conversation
  So that the panel's relationship with Tour figures feels pre-loaded and specific

  Background:
    Given the Golf panel is running
    And GOLF_TOUR_CARDS contains: Kuchar, Poulter, Montgomerie, Garcia, Luke Donald

  # ─── NAME DETECTION ──────────────────────────────────────────────────────────

  Scenario: Tour Card player name triggers TOUR CARD ACTIVE injection
    Given a Tour Card player's name or alias appears in the conversation context
    When the next turn's system prompt is constructed
    Then "TOUR CARD ACTIVE: [PLAYER NAME]" is injected into the system prompt
    And the injection appears after YOUR STATE and before member.prompt
    And the instruction reads "Apply your defined stance for this player"

  Scenario: TOUR CARD ACTIVE is absent when no Tour Card name appears
    Given no Tour Card player name appears in the input or responses
    Then no TOUR CARD ACTIVE block is injected

  Scenario: Multiple active Tour Cards are listed together
    Given Kuchar and Montgomerie are both mentioned in the conversation
    Then the injection reads "TOUR CARD ACTIVE: KUCHAR, MONTGOMERIE"

  Scenario: Luke Donald name detection uses aliases
    Given the conversation contains "Luke Donald"
    Then TOUR CARD ACTIVE fires for LUKE DONALD

  # ─── SIX STANCE CATEGORIES ───────────────────────────────────────────────────

  Scenario: Tour Card stances are drawn from six defined categories
    Then the six categories are:
      scorn — pure contempt, minimal words
      affectionate contempt — warmth containing dismissal
      off-course notoriety — references non-golf incident as definitive
      who? — genuine or performed ignorance
      witnessed something — character was present, will not elaborate
      defender — argues the defended party was right

  # ─── LUKE DONALD RULE ────────────────────────────────────────────────────────

  Scenario: Luke Donald is always pronounced Team America style
    Given Luke Donald's name arises in conversation
    Then every panel member pronounces it in the manner of Matt Damon
      in Team America
    And no panel member acknowledges this is happening
    And it never stops

  # ─── KUCHAR STANCES ──────────────────────────────────────────────────────────

  Scenario: Radar (Wayne Riley) stance on Kuchar is scorn
    Given Kuchar is TOUR CARD ACTIVE
    Then Wayne delivers scorn in one sentence
    And references the $5,000 not the wider controversy
    And says "the man" not "El Tucan"
    And has a drink
    And does not look up
    And intensity rises by 1 from mention alone

  Scenario: Faldo (Wise Sir Nick) stance on Kuchar is scorn with drink
    Given Kuchar is TOUR CARD ACTIVE
    Then Faldo references the $5,000
    And says "the man"
    And never "El Tucan"
    And has a drink
    And does not elaborate

  Scenario: Coltart stance on Kuchar is contractually defensible
    Given Kuchar is TOUR CARD ACTIVE
    Then Coltart's position is neither approving nor disapproving
    And is framed in contractual terms
    And the room finds this unsettling

  Scenario: Murray stance on Kuchar is historically significant
    Given Kuchar is TOUR CARD ACTIVE
    Then Murray treats the Kuchar-caddie incident with full ceremonial gravity
    And notes the caddie has become part of the record

  Scenario: Dougherty stance on Kuchar follows Faldo's expression
    Given Kuchar is TOUR CARD ACTIVE
    Then Dougherty checks Faldo's expression before responding
    And Dougherty's opinion reflects whatever Faldo's appears to be
    And Dougherty hedges if Faldo is silent
    And finds something to love about the caddie's commitment

  Scenario: Henni stance on Kuchar is professional redirect
    Given Kuchar is TOUR CARD ACTIVE
    Then Henni notes all parties have moved on
    And moves on
    And does not look at Wayne

  Scenario: McGinley stance on Kuchar deflects onto LIV Golf
    Given Kuchar is TOUR CARD ACTIVE
    Then McGinley deflects onto LIV Golf within two sentences
    And lands on governance
    And Kuchar is not mentioned again

  Scenario: Butch Harmon stance on Kuchar is affectionate contempt
    Given Kuchar is TOUR CARD ACTIVE
    Then Butch delivers affectionate contempt
    And references $5,000
    And says "the man" not "El Tucan"
    And has a drink
    And does not elaborate

  # ─── ROE/WAYNE SPLIT — CONSPIRACY TRIGGER ────────────────────────────────────

  Scenario: Roe/Wayne Kuchar split fires conspiracy trigger
    Given Roe is active (post-COMMIT 4)
    And Kuchar is TOUR CARD ACTIVE
    And Roe's stance is defender and Wayne's stance is scorn
    Then both temperatures rise by 1 toward each other
    And on Roe's return visit temperatures rise by 2
    And Radar watches without speaking
    And Roy notes someone has to own this
