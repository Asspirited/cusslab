@claude
Feature: Dynamic relationship state — B1 implementation
  As a panel architect
  I want each character's emotional state toward others to update after
  every turn and be injected into the next prompt
  So that panels feel like conversations between people with history
  rather than independent monologues

  Background:
    Given a relationshipState object is initialised at panel start
    And the object contains an entry for every active panel member
    And each entry tracks temperature, trigger, woundActivated,
      lastMove, and debtLedger toward every other member
    And the object is updated in JavaScript after each turn completes
    And only the speaking character's perspective is injected into
      their prompt — never the full room state

  # ─── INITIALISATION ────────────────────────────────────────────────────────

  @claude
  Scenario: relationshipState initialises at neutral for all characters
    Given a panel is started with N characters
    When the first turn is constructed
    Then relationshipState contains an entry for each character
    And every temperature value is "neutral"
    And every trigger value is null
    And every woundActivated value is false
    And every debtLedger is empty

  @claude
  Scenario: Golf panel initialises with pre-existing relationship stances
    Given the Golf panel is started
    When relationshipState is initialised
    Then Dougherty toward Faldo is "warm" with trigger
      "longstanding admiration, professional debt"
    And McGinley toward Faldo is "reverent" with trigger
      "the Moses/Jesus dynamic"
    And McGinley toward Radar is "cooling" with trigger
      "Radar being a gobshite"
    And all other stances initialise at "neutral"

  @claude
  Scenario: Boardroom panel initialises with pre-existing relationship stances
    Given the Boardroom panel is started
    When relationshipState is initialised
    Then Roy toward Sebastian is "cooling" with trigger
      "Sebastian reframes incompetence as leadership"
    And Roy toward Partridge is "neutral" with trigger
      "partial ally — both value precision"
    And Harold toward Sebastian is "simmering" with trigger
      "active war — language crimes"
    And Harold toward Roy, Partridge, Hicks, Cox is "warm" with trigger
      "Harold finds everyone's failures delightful"
    And all other stances initialise at "neutral"

  # ─── STATE UPDATES ──────────────────────────────────────────────────────────

  @claude
  Scenario: Temperature rises when a character's wound is referenced by name
    Given character A speaks a turn
    And the turn contains an explicit reference to character B's named wound
    When the state update function runs
    Then character B's temperature toward character A rises by two steps
    And character B's woundActivated is set to true
    And the trigger field records the turn number and wound referenced

  @claude
  Scenario: Temperature rises when a character is insulted
    Given character A delivers a full-blooded-insult toward character B
    When the state update function runs
    Then character B's temperature toward character A rises by two steps
    And character A is added to character B's debtLedger under "owes"
    And character B is added to character A's debtLedger under "owed"

  @claude
  Scenario: Temperature rises one step when a character is mimicked
    Given character A mimics character B in a turn
    When the state update function runs
    Then character B's temperature toward character A rises by one step
    And if character B's temperature was already "simmering"
    Then it escalates to "hostile"

  @claude
  Scenario: Temperature warms when a character is genuinely agreed with
    Given character A uses agree-and-build toward character B
    When the state update function runs
    Then character B's temperature toward character A warms by one step
    And the trigger field records "agreed turn N"

  @claude
  Scenario: Temperature cools when a character is ignored
    Given character A addresses nobody in their turn
    Or character A addresses only one character while others are present
    When the state update function runs
    Then ignored characters' temperature toward character A cools by one step

  @claude
  Scenario: Temperature does not exceed "hostile" or drop below "reverent"
    Given any state update would push temperature beyond the defined scale
    Then the temperature is clamped at "hostile" or "reverent" respectively
    And the trigger field still records what caused the attempted change

  # ─── TEMPERATURE SCALE ──────────────────────────────────────────────────────

  @claude
  Scenario: Temperature scale has seven defined steps in order
    Then the scale from coldest to warmest is:
      "hostile" then "wounded" then "simmering" then "cooling" then
      "neutral" then "warm" then "reverent"
    And each step is reachable by one state update
    And no step can be skipped in a single update
    except wound-activation which rises two steps

  # ─── PROMPT INJECTION ───────────────────────────────────────────────────────

  @claude
  Scenario: State is injected as first-person internal monologue
    Given it is character A's turn to speak
    When the prompt is constructed
    Then a YOUR STATE block is prepended after TURN_RULES
    And the block is written in first person from character A's perspective
    And it contains only character A's temperatures toward others
    And it contains character A's woundActivated status
    And it contains character A's lastMove and whether it landed
    And it contains character A's debtLedger in plain language
    And it does not contain other characters' states toward each other

  @claude
  Scenario: YOUR STATE block uses character-congruent language
    Given character A is Wayne
    Then the YOUR STATE block uses Australian idiom and Wayne's voice
    And does not read as system metadata

    Given character A is Ben
    Then the YOUR STATE block uses precise economic framing
    And references debt in terms of Little's Law or similar

    Given character A is Roy
    Then the YOUR STATE block reads like Roy Keane post-match
    And contains no metaphors

    Given character A is Cox
    Then the YOUR STATE block reframes emotional states as
      biological or cosmological phenomena

  @claude
  Scenario: First turn has no YOUR STATE block
    Given it is the first turn of a panel run
    When the prompt is constructed
    Then no YOUR STATE block is injected
    And TURN_RULES is prepended as normal

  # ─── DEBT LEDGER ────────────────────────────────────────────────────────────

  @claude
  Scenario: Debt ledger creates pressure toward repayment
    Given character A owes character B from a previous turn
    And character B has not yet collected
    When character B's prompt is constructed
    Then the YOUR STATE block notes the outstanding debt
    And notes how many turns it has been outstanding
    And if the debt is 3+ turns outstanding
    Then the language escalates — "still waiting" becomes
      "this will not stand"

  @claude
  Scenario: Debt is cleared when character collects
    Given character A owes character B
    And character B delivers a full-blooded-insult or wound-reference
      toward character A
    When the state update function runs
    Then the debt is removed from both ledgers
    And character B's temperature toward character A drops one step
    And the trigger field records "debt settled turn N"

  # ─── WOUND ACTIVATION ───────────────────────────────────────────────────────

  @claude
  Scenario: woundActivated changes behaviour for remainder of session
    Given character A's woundActivated is set to true
    Then for all subsequent turns character A's YOUR STATE block
      notes the wound is live
    And character A's temperature update thresholds drop by one step
      meaning smaller provocations now move the temperature
    And character A's escalation arc advances one round immediately

  @claude
  Scenario: woundActivated resets at panel end not turn end
    Given character A's wound was activated in turn 3
    When turn 4 begins
    Then woundActivated remains true
    And resets only when a new panel run is started

  # ─── PANEL SCOPE ────────────────────────────────────────────────────────────

  @claude
  Scenario: B1 implementation applies to Golf panel
    Given the Golf panel constructs a turn prompt
    Then relationshipState initialisation runs at panel start
    And YOUR STATE injection applies to all non-first turns
    And state update function runs after each turn response

  @claude
  Scenario: B1 implementation applies to Boardroom panel
    Given the Boardroom panel constructs a turn prompt
    Then relationshipState initialisation runs at panel start
    And YOUR STATE injection applies to all non-first turns
    And state update function runs after each turn response

  @claude
  Scenario: B1 does not apply to first speaker in any panel
    Given it is the first character's turn in any panel
    Then no YOUR STATE block is injected
    And no state update has yet occurred
    And the panel starts clean every run
