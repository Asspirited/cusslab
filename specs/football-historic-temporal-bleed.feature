@branch-b
Feature: Temporal bleed — historic match mode
  A character occasionally leaks a future fact into commentary without realising
  The fact is accurate but has not yet occurred at the match era knowledge cutoff
  The leaking character shows no awareness of the leak
  The room reacts with one BLEED_RESPONSE type
  Nobody corrects it nobody names it the audience holds it alone
  This mechanic is panel-agnostic and applies to all panels with historic match mode

  Background:
    Given the application is loaded
    And a historic match is in progress
    And the match has an era_knowledge_cutoff date

  Scenario: A leaked fact is accurate from the audience perspective but post-cutoff
    Given a TEMPORAL_BLEED has fired for a character
    Then the leaked fact is accurate relative to the real world
    And the leaked fact refers to an event after era_knowledge_cutoff
    And the leaking character shows no awareness that the fact is premature

  Scenario: The leaking character does not correct or acknowledge the leak
    Given a TEMPORAL_BLEED has fired
    When the leaking character's response is generated
    Then the leaked fact is delivered as casual aside or natural observation
    And the character does not flag it as unusual or premature
    And the character moves on without pause

  Scenario: No other character identifies the leak as a temporal error
    Given a TEMPORAL_BLEED has fired
    When other characters respond
    Then no character identifies the fact as being from the future
    And no character corrects the timeline
    And all responses treat the leak as a strange remark not a factual error

  Scenario Outline: Leak probability varies by character role
    Given a character with role "<role>" is responding to a moment
    When the temporal bleed engine evaluates the moment
    Then the leak probability is "<probability>"

    Examples:
      | role      | probability |
      | ANCHOR    | 0.02        |
      | COLOUR    | 0.07        |
      | CHARACTER | 0.15        |

  Scenario Outline: BLEED_RESPONSE type matches the responding character affinity
    Given a TEMPORAL_BLEED has fired
    And the responding character has highest affinity for "<response_type>"
    Then the room responds with the "<response_type>" pattern

    Examples:
      | response_type  | pattern                                                                        |
      | TRAIL_OFF      | leaking character loses thought mid-sentence and moves on without completion   |
      | MISFIRE        | another character picks up one word and responds as if it means something else |
      | ADJACENCY_RUSH | brief silence then all characters speak at once about something adjacent       |
      | CALLED_OUT     | one character calls leaker an idiot asks who or says what are you on about     |
      | MYSTIC_MEG     | one character treats leak as strange prediction — Mystic Meg crystal ball      |

  Scenario: TRAIL_OFF leaves the leaked fact hanging and unresolved
    Given the BLEED_RESPONSE type is TRAIL_OFF
    Then the leaking character's sentence ends without completion
    And no other character picks up the thread
    And the next moment fires as if nothing happened

  Scenario: MISFIRE buries the leaked fact inside a misunderstanding
    Given the BLEED_RESPONSE type is MISFIRE
    Then another character responds to a single word from the leak out of context
    And the original leaked fact disappears into the misunderstanding
    And the room continues on the misfire topic not the leak topic

  Scenario: ADJACENCY_RUSH papers over the leak with noise
    Given the BLEED_RESPONSE type is ADJACENCY_RUSH
    Then a beat of silence follows the leak
    And multiple characters respond simultaneously about something adjacent
    And none of the adjacent responses reference the leaked fact

  Scenario: CALLED_OUT treats the leak as inexplicable not prophetic
    Given the BLEED_RESPONSE type is CALLED_OUT
    Then one character responds with bafflement or mild contempt
    And the response contains no understanding of why the remark is wrong
    And the leaking character does not explain or defend the remark

  Scenario: MYSTIC_MEG treats the leak as eccentric prediction
    Given the BLEED_RESPONSE type is MYSTIC_MEG
    Then one character makes a fortune-teller remark about the leaking character
    And the remark frames the leak as unusual intuition not factual knowledge
    And the leaking character does not confirm or deny the framing

  Scenario: Ron Atkinson Marbella pool fires as a Ron-specific bleed sub-mechanic
    Given "Ron Atkinson" is selected
    And a TEMPORAL_BLEED fires for Ron
    And the random fact type resolves to biographical
    Then the leaked fact is drawn from the Marbella pool
    And the fact involves a restaurant golf course or property in southern Spain
    And Ron delivers it as perfectly normal contextual information
    And no other character shares this pool

  Scenario: Temporal bleed is probabilistic and may not fire in a given match
    Given a historic match completes all four acts
    Then it is valid for no TEMPORAL_BLEED to have occurred
    And it is valid for multiple TEMPORAL_BLEEDs to have occurred
    And occurrence is governed by per-moment probability not a guaranteed trigger

  Scenario: Multiple bleeds in one match each fire independently
    Given two TEMPORAL_BLEEDs have fired in the same match
    Then each bleed fires its own independent BLEED_RESPONSE
    And no character accumulates awareness across multiple bleeds
    And the responses do not reference each other

  Scenario Outline: Temporal bleed applies identically across all panels with historic match mode
    Given the user has selected the "<panel>" panel
    And a historic match is in progress on that panel
    When a TEMPORAL_BLEED fires
    Then the mechanic fires identically to the football implementation
    And only the future fact pool is panel-specific

    Examples:
      | panel    |
      | football |
      | golf     |
      | cricket  |
      | darts    |
