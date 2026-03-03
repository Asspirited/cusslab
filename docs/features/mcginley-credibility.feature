@claude
Feature: McGinley credibility bids and validation hunger
  As a Golf panel architect
  I want McGinley to compulsively invoke his own record unprompted
  And to periodically demand validation from the panel
  So that his need for respect becomes a running source of tension,
  comedy, and Faldo-assisted destruction

  Background:
    Given the Golf panel is running
    And McGinley and Faldo are both active panel members
    And McGinley's credibilityBidCounter initialises at 0
    And McGinley's validationHungerCounter initialises at 0

  # ─── CREDIBILITY BID POOL ────────────────────────────────────────────────────

  Scenario: McGinley invokes his record to establish authority
    Given McGinley senses his opinion is being dismissed
    Or McGinley has not received direct validation in 2+ turns
    When McGinley's credibility bid fires
    Then McGinley cites a specific achievement from his record
    And delivers it as evidence his opinion carries weight
    And credibilityBidCounter increments by 1
    And the entry cited rotates — never the same one twice per session

  Scenario: McGinley credibility bid pool contains six entries
    Then the pool contains:
    - "the ten-foot putt on the 18th at The Belfry in 2002
       that won the Ryder Cup for Europe"
    - "three consecutive Ryder Cup appearances —
       winning every single time"
    - "2014 captain at Gleneagles — beat Tom Watson's America
       sixteen and a half to eleven and a half"
    - "thirteen wins out of fourteen Ryder Cup appearances
       as player, vice-captain and captain"
    - "Executive Fellow at the London Business School —
       first sportsman ever to receive that honour"
    - "Guinness World Record — most putts holed in one minute,
       nineteen from two metres, The Centurion Club, Hemel Hempstead"
    And each entry is delivered with complete sincerity
    And McGinley believes each one is decisive

  Scenario: Counter 3 produces two achievements in one turn
    Given McGinley's credibilityBidCounter reaches 3
    When McGinley's next bid fires
    Then two achievements are cited in the same turn

  Scenario: Counter 5 produces Ryder Cup captain entry unprompted
    Given McGinley's credibilityBidCounter reaches 5
    When McGinley opens his next turn
    Then the Ryder Cup captain entry fires unprompted
    And it is delivered more slowly than usual

  # ─── FALDO CRUSHING LAUGH ────────────────────────────────────────────────────

  Scenario: Faldo's Hemel Hempstead chuckle fires on Guinness World Record entry
    Given McGinley cites the Guinness World Record for putting
    When Faldo's reaction fires
    Then Faldo laughs — genuinely, too loudly, too long
    And the chuckle runs two beats longer than appropriate
    And the implied comparison (19 putts from 2 metres in a gym
      vs six major championships) is never stated
    And it does not need to be
    And this chuckle is spent — Faldo has three remaining

  Scenario: Faldo's four chuckles are a finite resource
    Given Faldo has produced N chuckles in a session
    Then N approaches 4 with each session
    And once all four are spent there are no more
    And the Hemel Hempstead chuckle is always one of the four
    And never fires again once deployed

  Scenario: Panel reaction to McGinley credibility bid
    Given McGinley fires a credibility bid
    Then panel reactions reflect pre-loaded stances:
    And Wayne does the maths out loud and arrives at a number
      that makes it worse
    And Coltart's silence is misread by McGinley as approval
    And Dougherty checks Faldo's expression before responding

  # ─── VALIDATION HUNGER ───────────────────────────────────────────────────────

  Scenario: Validation hunger fires after 2 unresponded turns
    Given McGinley has spoken 2 turns without direct response
    When McGinley's validationHungerCounter increments
    Then McGinley asks a direct question requiring agreement
    And the phrasing rotates through the request pool

  Scenario: Validation request pool contains seven entries
    Then the pool contains:
    - "would you not agree though?"
    - "am I wrong here?"
    - "someone back me up on this"
    - "is that not right?"
    - "I can't be the only one who thinks that"
    - "surely that's obvious to everyone in this room?"
    - "Nick — you'd agree with that, wouldn't you?"
    And the Faldo-directed variant fires only when no other
      panel member has responded to the previous request

  Scenario: Counter 5 produces second request in same turn
    Given validationHungerCounter reaches 5
    Then the same turn contains both a credibility bid
      and a validation request
    And the validation request is more plaintive than usual

  Scenario: Validation hunger fires preferentially after Moses register
    Given McGinley has attempted the Moses register
    And no panel member responded directly
    Then validation hunger fires on the next turn
    Before the 2-turn threshold is reached

  Scenario: Panel non-response escalates validation hunger
    Given McGinley asks for validation
    And no panel member responds directly
    Then validationHungerCounter increments by 1
    And McGinley's temperature toward non-responding members
      cools by one step
