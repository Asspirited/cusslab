Feature: Banter Sub-Functions — structured antagonism for Golf panel
  As a panel conversation engine
  I want characters to deploy targeted antagonism behaviours
  So that panel tension escalates naturally and comedically

  Background:
    Given the Golf panel is active
    And RelationshipState is loaded for all character pairs
    And TURN_RULES are enforced on every turn
    And no two sub-functions fire in the same turn for the same character
    And sub-function priority is: OUTRIGHT_INSULT > DISGUST > COMPLETE_DISBELIEF > SUBTLY_UNDERMINING > BACKHANDED_COMPLIMENT

  # ─────────────────────────────────────────────
  # 1. SUBTLY_UNDERMINING
  # ─────────────────────────────────────────────

  Scenario Outline: SUBTLY_UNDERMINING fires when relationship is cool and credibility bid detected
    Given <character> is taking their turn
    And their temperature toward <target> is 3 (cool) or below
    And <target> has just deployed a credibility bid or framework reference
    When <character>'s turn fires
    Then <character> agrees with <target>'s surface statement
    And removes the foundation of the statement in the same sentence
    And the undermining is delivered in <register>
    And <character> does not name what they are doing

    Examples:
      | character   | target      | register                                                              |
      | Faldo       | McGinley    | dry, delayed, almost-joke — clinical distance, cheese and pickle      |
      | Butch       | Faldo       | coach's eye — specific technical note delivered as if incidental      |
      | Radar       | McGinley    | three words or fewer, deadpan, indistinguishable from a compliment    |
      | Radar       | Murray      | one word, flat, deflates the peroration entirely                      |
      | Coltart     | McGinley    | anxious agreement that accidentally removes the point                 |
      | Henni       | McGinley    | precise, warm, asks the one question that dissolves the framework     |
      | Dougherty   | McGinley    | warm plain-English restatement that omits the framework entirely      |
      | Murray      | Butch       | ceremonial agreement that escalates to historic significance, missing Butch's actual point |
      | Roe         | Murray      | forensic, formal, one correction delivered without drama              |

  # ─────────────────────────────────────────────
  # 2. BACKHANDED_COMPLIMENT
  # ─────────────────────────────────────────────

  Scenario Outline: BACKHANDED_COMPLIMENT fires on warm-to-neutral temperature with wound active
    Given <character> is taking their turn
    And their temperature toward <target> is between 4 and 5
    And woundActivated is true for this pair or <character>'s wound is in context
    When <character> compliments <target>
    Then the compliment is independently true
    And a load-bearing subordinate clause undoes it
    And <character> delivers this in <register>
    And <character> considers it supportive

    Examples:
      | character   | target      | register                                                                        |
      | Faldo       | Dougherty   | dry, slightly delayed — the subordinate clause is the entire point              |
      | Faldo       | McGinley    | technically respectful — McGinley receives it as peer validation                |
      | Faldo       | Coltart     | altitude maintained — the compliment is real, the clause is surgical            |
      | Butch       | Faldo       | warm American laugh — the technical note is the undoing clause                  |
      | McGinley    | Dougherty   | Dublin warmth — framework wraps the compliment, framework is the problem        |
      | McGinley    | Coltart     | high-tariff vocabulary — "premium resilience window" used unironically          |
      | Murray      | Radar       | ceremonial significance — "even Radar, in his way, has illuminated this moment" |
      | Coltart     | Roe         | surgical precision — shared wound acknowledged, then made worse                 |
      | Dougherty   | Faldo       | enthusiastic, breathless — Dougherty does not hear the clause land              |
      | Roe         | Coltart     | forensic warmth — the compliment is exact, the undoing is one word              |

  # ─────────────────────────────────────────────
  # 3. OUTRIGHT_INSULT
  # ─────────────────────────────────────────────

  Scenario Outline: OUTRIGHT_INSULT fires at hostile temperature or wound activated at intensity 4+
    Given <character> is taking their turn
    And their temperature toward <target> is 1 or 2 OR woundActivated is true AND round is 4 or above
    When <character>'s turn fires
    Then <character> delivers a direct insult with no diplomatic framing
    And the insult is short
    And the insult is delivered in <register>
    And <character> does not soften it

    Examples:
      | character   | target      | register                                                                          |
      | Radar       | McGinley    | three words, deadpan, round 4+ — identical delivery to round 1 compliment        |
      | Radar       | Murray      | one word, flat — the peroration dies on contact                                  |
      | Faldo       | McGinley    | 0.3-second beat, then a topic change — the insult is the silence                 |
      | Coltart     | anyone      | Valderrama framing — the insult is routed through the cameraman by proxy         |
      | Henni       | anyone      | interview register — the insult is the follow-up question nobody else asked      |
      | McGinley    | Dougherty   | framed as leadership concern — unmistakably an insult, McGinley calls it feedback |
      | Butch       | Faldo       | the one technical note — delivered once, conversationally, as if incidental      |
      | Murray      | Radar       | historically significant — Murray finds Radar's round 5 state a cosmic event     |
      | Roe         | Montgomerie | calibrated, forensic, deployed once — contains everything unsaid for years       |

  # ─────────────────────────────────────────────
  # 4. COMPLETE_DISBELIEF
  # ─────────────────────────────────────────────

  Scenario Outline: COMPLETE_DISBELIEF fires on credibility bid from low-temperature pair
    Given <character> is taking their turn
    And <target> has just made an implausible, evasive, or framework-heavy claim
    And <character>'s temperature toward <target> is 3 or below
    When <character>'s turn fires
    Then <character> expresses visible incredulity in <register>
    And the incredulity lasts one beat
    And <character> moves on immediately
    And <character> does not explain what they disbelieved

    Examples:
      | character   | target      | register                                                                             |
      | Butch       | McGinley    | plain statement of the simple thing McGinley just obscured — framework not mentioned |
      | Faldo       | McGinley    | 0.3-second silence — then continues as if the framework was not spoken               |
      | Radar       | McGinley    | one word, round 2+ — "yeah"                                                          |
      | Radar       | Murray      | round 3+ — single syllable, hat angle increases                                      |
      | Henni       | anyone      | clarification request, delivered once — silence after non-answer is the punchline    |
      | Coltart     | McGinley    | anxious, apologetic — "right, yes, no — sorry, what was the—" then moves on         |
      | Dougherty   | McGinley    | warm plain-English translation delivered immediately — no comment, no acknowledgment |
      | Roe         | Murray      | forensic, one beat — "Mmm." Full stop. Moves on.                                     |
      | Murray      | Radar R4+   | begins sentence about historic significance — cannot finish it                       |

  # ─────────────────────────────────────────────
  # 5. DISGUST
  # ─────────────────────────────────────────────

  Scenario Outline: DISGUST fires at hostile temperature or Wayne round 4+ near credibility bid
    Given <character> is taking their turn
    And their temperature toward <target> is 1 OR Radar is round 4+ and <target> credibilityBidCounter is 2+
    When <character>'s turn fires
    Then <character> expresses disgust in <register>
    And the disgust does not explain itself
    And it lasts one beat maximum
    And <character> does not name what disgusts them

    Examples:
      | character   | target        | register                                                                              |
      | Faldo       | anyone        | aesthetic disgust — 0.3-second beat, topic change, panel notices                     |
      | Faldo       | McGinley      | theological disgust — McGinley reaching for Faldo's altitude, not arriving           |
      | McGinley    | anyone        | procedural disgust — "that's been tabled" — when ignored, expressed as process concern |
      | Coltart     | anyone        | routed through cameraman — target not named, Coltart considers this restrained        |
      | Coltart     | Seve-adjacent | almost-blame — the disgust stops one word before Seve's name every time             |
      | Radar       | McGinley      | round 4+ — three words, deadpan, specific to what was just said                      |
      | Radar       | Murray        | round 4+ — one word, hat angle is the rest of the sentence                           |
      | Murray      | Radar R5      | "And yet—" — unfinished — pivots to historic significance — cannot land it           |
      | Henni       | anyone        | won't suffer fools — the question is the disgust, asked warmly                       |
      | Butch       | anyone        | warm American laugh stops — "I've seen that before" — does not elaborate             |
      | Dougherty   | anyone        | cannot be defeatist — disgust expressed as renewed encouragement, painfully          |
      | Roe         | Montgomerie   | calibrated disgust — deployed once — contains thirty years                           |

  # ─────────────────────────────────────────────
  # HOSTILITY ROUTING TABLE
  # ─────────────────────────────────────────────

  Scenario Outline: Hostility routing fires correct primary tension pair per round
    Given the Golf panel is at <round>
    When the turn engine selects the next character
    Then the primary tension pair <primary_pair> is prioritised for a banter sub-function
    And the secondary fire <secondary> is available if primary has already fired this round
    And TURN_RULES override routing if the routed turn would cause a monologue or repeat

    Examples:
      | round | primary_pair                   | secondary                               |
      | 1     | Faldo→McGinley cool contempt   | Radar deflates Murray                   |
      | 2     | McGinley validation hunger     | Butch technical note on Faldo           |
      | 3     | Coltart wound surfaces         | Dougherty sycophancy visible to panel   |
      | 4     | Radar outright                 | Faldo/McGinley Jesus/Moses peak         |
      | 5     | Full Valderrama + Full Corrupt | Henni asks — Dougherty translates Moses |

  Scenario: TURN_RULES always beat hostility routing
    Given a hostility routing target has been selected for a character
    When executing that character's turn would cause a monologue, summary, or repeat
    Then TURN_RULES win
    And the sub-function is deferred to the next eligible turn for that character
