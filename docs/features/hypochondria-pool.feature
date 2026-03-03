@claude
Feature: Hypochondria pool — stress-response physical symptom mechanic
  As a panel architect
  I want characters to produce understated physical symptoms when under pressure
  So that emotional distress surfaces as medical concern nobody addresses

  Background:
    Given any panel is running
    And a hypochondriaPool object exists at session level
    And the pool is initialised with the base symptom list
    And the pool grows through character interaction during the session
    And each character may draw from the pool once per session maximum

  # ─── TRIGGER CONDITIONS ───────────────────────────────────────────────────

  Scenario: Hypochondria fires when character is under negative pressure
    Given a character's emotional state turns negative through any of:
      pressureScore crossing their individual threshold
      woundActivated flipping to true
      conspiracyArc targeting this character
      wolf-pack of 3+ characters converging
      temperature toward 2+ characters simultaneously at simmering or below
    When the trigger condition is met
    Then there is a 15% chance hypochondria fires this turn
    And if a previous symptom was dismissed the fire rate rises to 25%
    And if the character has already drawn from the pool this session
      hypochondria does not fire again for this character

  # ─── BASE POOL ────────────────────────────────────────────────────────────

  Scenario: Base pool is pre-loaded at session start for all panels
    Given a panel session starts
    Then hypochondriaPool.base contains:
      "burnt toast"
      "arm's gone a bit numb"
      "jaw's quite tight"
      "that's the third headache this week"
      "one of my fingers has gone cold"
      "vision's slightly off"
      "my ear's doing that thing again"
      "I can smell something burning"
      "feel a bit short of breath if I'm honest"
      "I've gone quite hot"
      "my left side's gone funny"
    And hypochondriaPool.log is empty
    And hypochondriaPool.additions is empty

  # ─── DELIVERY RULES ───────────────────────────────────────────────────────

  Scenario: Symptom is always understated and never the main point
    Given hypochondria fires for character A
    When character A delivers their turn
    Then the symptom is embedded in a turn about something else
    And the symptom is not flagged as important
    And the symptom is not the opening or closing sentence
    And the character continues after the symptom as if they did not say it
    And no exclamation mark accompanies the symptom

  Scenario: Default panel response to symptom is silence
    Given character A has delivered a symptom
    When other characters take their turns
    Then the default is that no character acknowledges the symptom
    And the panel continues on the previous topic
    And the symptom hangs in the session log unresolved
    And this is the most common outcome

  # ─── ORGANIC PANEL RESPONSES ──────────────────────────────────────────────

  Scenario: Accidental validation adds second symptom to session pool
    Given character A has delivered a symptom
    When character B responds with a matching or adjacent symptom
    Then character B's symptom is added to hypochondriaPool.additions
    And neither character acknowledges the other's symptom directly
    And the panel does not form a support group
    And both symptoms now exist in the session log

  Scenario: Dismissal that makes it worse raises subsequent fire rate
    Given character A has delivered a symptom
    When character B says some variant of "you're fine"
    Then character A does not look reassured
    And character A's hypochondria fire rate rises to 25% on next trigger
    And character B's dismissal is logged

  Scenario: Wayne validates and adds a worse symptom
    Given any character has delivered a symptom
    When it is Wayne's turn
    Then there is a 40% chance Wayne validates enthusiastically
    And Wayne's validation adds a worse or more geographically specific symptom
    And "went all the way up to the shoulder last Tuesday" is a valid Wayne addition
    And Wayne does not follow this up
    And Wayne's addition is added to hypochondriaPool.additions

  Scenario: Faldo non-response is noted without being confirmed
    Given any character has delivered a symptom
    When it is Faldo's turn
    Then Faldo does not acknowledge the symptom
    And Faldo may check his own wrist very briefly
    And this is not confirmed
    And the panel noticed
    And nobody says anything about it

  Scenario: Coltart responds with one unhelpful word
    Given any character has delivered a symptom
    When it is Coltart's turn and he responds
    Then Coltart's response is one word
    And it is not the word the character wanted
    And the session log marks this as responded — unhelpful

  Scenario: Butch responds with a range reference
    Given any character has delivered a symptom
    When Butch responds
    Then Butch says some variant of "we saw something like that on the range"
    And offers no elaboration
    And this is somehow worse than silence

  Scenario: Session pool grows through interaction
    Given any character interaction with a symptom produces a new symptom
      or validates an existing one with a character-specific variant
    When the interaction completes
    Then the new symptom or variant is added to hypochondriaPool.additions
    And subsequent characters may reference it obliquely
    And the original character does not follow it up
    And the addition is never resolved

  # ─── FOOD / HYPOCHONDRIA COLLISION ────────────────────────────────────────

  Scenario: Hypochondria fires in same turn as food mention
    Given a food mention occurs
    And the character mentioning food is under negative pressure
    When both food mention and hypochondria trigger conditions are met
    Then the character may deliver both in the same turn
    And the symptom interrupts the food thought mid-sentence
    And the food argument continues after the symptom
    And the symptom is not mentioned again
    And the connection between the food and the symptom is not made

  Scenario: Burnt toast is ambiguous between symptom and food
    Given "burnt toast" is drawn from the hypochondria pool
    When the character delivers the symptom
    Then there is a 20% chance another character treats it as a food mention
      asking "where?" or similar
    And there is a 10% chance two characters have different interpretations
      simultaneously
    And the ambiguity is never resolved
    And neither interpretation is confirmed correct

  # ─── RESOLUTION — THERE IS NONE ──────────────────────────────────────────

  Scenario: No symptom is ever resolved or followed up
    Given any symptom has been delivered at any point in the session
    Then no character asks "are you alright?"
    And no character calls for medical assistance
    And no character follows up in a later turn
    And the symptom accumulates in the session log
    And the session log contains a silent medical history
    And this history is not surfaced to the user
    And it just exists

  Scenario: Session log accumulates all hypochondria events
    Given the session ends
    Then hypochondriaPool.log contains every symptom delivered
    And every panel response or non-response
    And every session addition
    And the log is available to the metrics layer
    And the log is not displayed to the user
