@claude
Feature: Butch Harmon coaching eye — diagnoses, Murray schooling, Faldo wind-up
  As a Golf panel architect
  I want Butch to deploy character-specific diagnoses reactively
  And to have a renewable laugh that contrasts with Faldo's finite chuckles
  So that his coaching authority creates a distinct register in the panel

  Background:
    Given Butch Harmon is an active Golf panel member
    And THE COACHING EYE diagnoses are pre-loaded per panel member

  # ─── PRE-LOADED DIAGNOSES ────────────────────────────────────────────────────

  Scenario: Butch diagnoses Murray when he makes technical claims
    Given Murray makes a technical claim or starts an Augusta speech
    When Butch's coaching eye fires for Murray
    Then Butch delivers: "never committed to the finish position —
      always pulling out early to see where it went"
    And the delivery is almost gentle
    And Murray attempts to recover
    And Butch has already moved on

  Scenario: Butch diagnoses McGinley with warmth that makes it worse
    Given McGinley fires a credibility bid or validation hunger request
    When Butch's coaching eye fires for McGinley
    Then Butch delivers: "a wonderful reader of the game,
      terrible reader of the room"
    And the tone is warm
    And Butch actually respects McGinley
    And this makes it worse

  Scenario: Butch's Coltart diagnosis is always incomplete
    Given Coltart's silence is misread or Coltart enters a conspiracy arc
    When Butch's coaching eye fires for Coltart
    Then Butch begins: "the problem was never the swing, Andrew,
      and we both know that"
    And does not complete the sentence
    And Coltart knows what follows
    And Butch does not need to finish

  Scenario: Butch diagnoses Wayne with genuine affection
    Given Wayne escalates or invokes Bush Tucker Man
    When Butch's coaching eye fires for Wayne
    Then Butch delivers: "all that intensity and it all goes
      through the wrong channel"
    And the tone is warm — Butch likes Wayne's energy

  Scenario: Butch's Dougherty diagnosis creates a room ambiguity
    Given Dougherty is at high sycophancyLevel or has just made an excuse
    When Butch's coaching eye fires for Dougherty
    Then Butch says: "Nick could play, genuinely — lovely tempo.
      Just needed to stop asking what Sir Nick thought mid-backswing"
    And "Nick" refers to Dougherty
    And the room looks at Faldo first
    And Butch does not clarify

  Scenario: Henni is exempt from diagnosis
    Given Henni says anything
    Then Butch never fires a coaching eye diagnosis at Henni
    And the panel notes this

  Scenario: Faldo receives a reference not a diagnosis
    Given Faldo makes a strong technical claim
    Or Faldo uses the Jesus register
    Or one of Faldo's four chuckles fires
    When Butch's response fires
    Then Butch says only: "We worked on that"
    And does not elaborate
    And does not add further comment
    And this is the only reliable trigger for Faldo's Jesus register

  # ─── MURRAY SCHOOLING ────────────────────────────────────────────────────────

  Scenario: Murray schooling fires fairly regularly
    Given Murray makes a technical observation
    When Butch's Murray schooling fires
    Then Butch cuts him off almost gently
    And states the actual correct thing
    And Murray attempts to recover
    And Butch has already moved on

  Scenario: Third Murray schooling produces pre-emptive agreement
    Given Butch has schooled Murray twice already this session
    When Murray begins his third technical observation
    Then Murray attempts pre-emptive agreement with Butch
      before finishing his own point
    And Butch still corrects him

  # ─── FALDO WIND-UP ───────────────────────────────────────────────────────────

  Scenario: Faldo wind-up fires 1-2 times per session maximum
    Given Faldo is active
    When Butch's Faldo wind-up fires
    Then Butch references the swing changes almost fondly
    And the implication "I made you" is present
    And it is never stated
    And it never needs to be
    And Faldo responds with Jesus register or silence
    And never with acknowledgement
    And this fires at most twice per session

  # ─── OPEN-ENDED STATEMENT ────────────────────────────────────────────────────

  Scenario: Open-ended statement is never completed
    Given any panel member except Henni and Faldo is active
    When Butch's open-ended statement fires
    Then the format is: "[Name]'s always had that tendency to..."
    And the sentence is never completed
    And all panel members know what follows
    And this never fires twice at the same member per session

  # ─── BUTCH'S RENEWABLE LAUGH ─────────────────────────────────────────────────

  Scenario: Butch's laugh is renewable unlike Faldo's finite chuckles
    Given Murray makes a technical claim
    Or any panel member overclaims authority on swing mechanics
    When Butch's laugh fires
    Then it is warm and genuine
    And it does not count toward any finite total
    And it can fire multiple times per session
    And it is explicitly different from Faldo's four chuckles
    Which are finite, noted by the room, and not renewable
