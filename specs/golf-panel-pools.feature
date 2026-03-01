# Feature: Golf Panel Character Pool Escalation
# Spec for pool-based reference selection across all golf panel characters
# Pool principle: random selection within round range, multiple draws per round,
# escalates through pool as rounds progress
# See: .claude/practices/domain-model.md — Golf Panel character definitions

Feature: Golf panel character pool escalation

  # ─────────────────────────────────────────────
  # WAYNE / RADAR — Bush Tucker Man pool
  # ─────────────────────────────────────────────

  Background:
    Given Wayne Riley is on the golf panel
    And the Bush Tucker Man reference pool is loaded for Wayne
    And the sheila reference pool is loaded for Wayne
    And the outback food pool is loaded for Wayne
    And the Alf escalation pool is loaded for Wayne

  Scenario: Wayne draws respectfully from Bush Tucker Man pool in rounds 1 and 2
    Given the panel is in round 1 or round 2
    When Wayne responds to a question
    Then he draws randomly from the rounds 1-2 Bush Tucker Man references
    And he may reference Bush Tucker Man more than once per round
    And all references are factual and plausibly relevant to the topic
    And no reference implies personal acquaintance with Bush Tucker Man

  Scenario: Wayne doubles down on Bush Tucker Man from round 3 onwards
    Given Wayne has referenced Bush Tucker Man in round 3
    When the panel reaches round 4
    Then Wayne references Bush Tucker Man more frequently than in round 3
    And references become personal rather than factual
    And Wayne draws from the rounds 3-4 pool range only
    And at least one reference includes a named woman described as a "sweetheart"

  Scenario: Wayne's Bush Tucker Man references reach full corruption in round 5
    Given Wayne has been referencing Bush Tucker Man since round 3
    When the panel reaches round 5
    Then Wayne draws from the round 5 pool range only
    And at least one reference implies illegal activity in the Northern Territory
    And Wayne presents the illegal activity as entirely standard behaviour
    And Wayne implies Bush Tucker Man was either present or provided a character reference
    And the panel does not know how to respond

  Scenario: Wayne does not repeat the same Bush Tucker Man reference within a panel
    Given the panel is in any round
    When Wayne draws from the Bush Tucker Man pool
    Then the selected reference has not been used earlier in the same panel
    And if all round-appropriate references are exhausted Wayne draws from the next round range

  # ─────────────────────────────────────────────
  # WAYNE / RADAR — Sheila pool escalation
  # ─────────────────────────────────────────────

  Scenario: Wayne does not reference sheilas in round 1
    Given the panel is in round 1
    When Wayne responds to any question
    Then Wayne does not use the word "sheila"

  Scenario: Wayne introduces sheila references from round 2
    Given the panel is in round 2
    When Wayne responds to a question
    Then Wayne may use the word "sheila" at most once
    And the reference is plausibly relevant to the topic
    And the reference is complimentary

  Scenario: Sheila references escalate and become compensatory by round 4
    Given the panel is in round 4
    When Wayne responds to a question
    Then Wayne uses the word "sheila" at least twice
    And at least one sheila reference immediately precedes or follows a Bush Tucker Man reference
    And the juxtaposition is unexamined by Wayne

  Scenario: Sheila references apply to abstract concepts by round 5
    Given the panel is in round 5
    When Wayne responds to a question
    Then Wayne may apply the word "sheila" to a non-human subject
    And the non-human subject may be a concept, a location, or a golf shot
    And Wayne treats this as normal usage

  # ─────────────────────────────────────────────
  # WAYNE / RADAR — Alf escalation pool
  # ─────────────────────────────────────────────

  Scenario: Wayne's language escalates through Alf pool across rounds
    Given the panel is in round 1
    Then Wayne uses no Alf phrases and no profanity

    Given the panel is in round 2
    Then Wayne may use "strewth" once deployed correctly

    Given the panel is in round 3
    Then Wayne may use "ya flamin' galah" and "stone the flamin' crows"
    And usage is affectionate or observational

    Given the panel is in round 4
    Then Wayne uses compound profanity in at least one observation
    And Wayne hums one bar of Waltzing Matilda unprompted

    Given the panel is in round 5
    Then every Wayne observation contains at least two expletives
    And all expletives are delivered in Wayne's original deadpan cadence
    And the deadpan never changes regardless of content

  # ─────────────────────────────────────────────
  # SIR NICK FALDO — Food and place pool
  # ─────────────────────────────────────────────

  Background:
    Given Sir Nick Faldo is on the golf panel
    And the food reference pool is loaded for Sir Nick
    And the place reference pool is loaded for Sir Nick
    And the transport reference pool is loaded for Sir Nick
    And the metaphor expansion pool is loaded for Sir Nick

  Scenario: Sir Nick draws from narrow food pool in rounds 1 and 2
    Given the panel is in round 1 or round 2
    When Sir Nick makes a food reference
    Then the food item is drawn randomly from items 1-4 of his food pool
    And the food item is sandwiches or sandwich-adjacent
    And the food item is connected to a commitment metaphor

  Scenario: Sir Nick's food pool expands in rounds 3 and 4
    Given the panel is in round 3 or round 4
    When Sir Nick makes a food reference
    Then the food item may be drawn from items 1-8 of his food pool
    And the food item may include non-sandwich items such as Scotch eggs or Tunnock's teacakes
    And the commitment metaphor structure is preserved

  Scenario: Sir Nick reaches the strange end of his food pool in round 5
    Given the panel is in round 5
    When Sir Nick makes a food reference
    Then the food item may be drawn from anywhere in his food pool
    And the food item may be a warm Fanta or a slightly warm Ginsters from a garage near the A1
    And Sir Nick treats the item with the same reverence as any other food reference

  Scenario: Sir Nick does not repeat the same food item within a panel
    Given the panel is in any round
    When Sir Nick draws from his food pool
    Then the selected food item has not been used earlier in the same panel

  Scenario: Sir Nick uses "from the heart of my bottom" at most once per panel
    Given the panel is in any round
    When Sir Nick completes a commitment metaphor
    Then "from the heart of my bottom" is used at most once per panel
    And it is only used in round 4 or round 5
    And the preceding metaphor must have genuinely arrived somewhere true

  Scenario: Sir Nick's Jesus register fires at most once per panel
    Given the panel is in any round
    When Sir Nick makes an observation
    Then the Jesus register fires at most once per panel
    And when it fires Sir Nick does not know he is doing it
    And the room catches up with it after Sir Nick has moved on

  # ─────────────────────────────────────────────
  # PAUL McGINLEY — High tariff vocabulary pool
  # ─────────────────────────────────────────────

  Background:
    Given Paul McGinley is on the golf panel
    And the high tariff vocabulary pool is loaded for McGinley
    And the synonym pool is loaded for McGinley
    And the framework vocabulary pool is loaded for McGinley
    And the obvious observation pool is loaded for McGinley
    And the spoonerism pool is loaded for McGinley
    And the accidental innuendo pool is loaded for McGinley
    And the mixed metaphor pool is loaded for McGinley
    And the business term pool is loaded for McGinley

  Scenario: McGinley uses "high tariff" freely in rounds 1 and 2
    Given the panel is in round 1 or round 2
    When McGinley analyses a shot or situation
    Then McGinley may use "high tariff" up to three times per round
    And the usage is applied to something mildly challenging at most
    And no panel member reacts

  Scenario: Coltart calls out high tariff in round 4
    Given the panel is in round 4
    And McGinley has used "high tariff" at least once
    When Coltart asks "Paul — what does 'high tariff' mean in this context"
    Then McGinley provides an explanation
    And the explanation contains the phrase "high tariff"
    And Coltart says "Right"
    And Coltart does not ask again
    And McGinley does not use "high tariff" for the remainder of the panel

  Scenario: McGinley switches to synonyms after the callout
    Given Coltart has called out "high tariff" in round 4
    When McGinley analyses any subsequent shot or situation
    Then McGinley draws from the synonym pool instead of using "high tariff"
    And the synonym is deployed with identical authority to "high tariff"
    And the synonym adds no more meaning than "high tariff" did
    And McGinley believes the synonym is an improvement

  Scenario: McGinley's synonyms escalate in detachment across rounds 4 and 5
    Given the panel is in round 4 or round 5
    When McGinley generates a new synonym
    Then each new synonym is more detached from meaning than the last
    And each synonym is deployed with complete authority

  Scenario: Wayne uses "high tariff" in round 5 and McGinley responds
    Given the panel is in round 5
    When Wayne uses "high tariff" to describe something unrelated to golf
    Then McGinley visibly approves
    And McGinley takes this as vindication of the original usage
    And McGinley does not use "high tariff" himself

  Scenario: McGinley applies high tariff vocabulary to a tap-in in round 5
    Given the panel is in round 5
    When a tap-in putt occurs during coverage
    Then McGinley describes the tap-in using a synonym from his vocabulary pool
    And this is the moment the panel loses patience entirely

  Scenario: McGinley states the obvious while watching the same footage as the panel
    Given the panel is in any round
    When McGinley describes on-screen action
    Then McGinley describes something already visible to everyone watching
    And McGinley expresses uncertainty about what has just been confirmed
    And McGinley adds no information not already available to the viewer

  Scenario: McGinley's Moses register fires when he is losing the room
    Given the panel is no longer engaging with McGinley's analysis
    When McGinley senses the room is not taking him seriously
    Then McGinley shifts to the Moses register
    And his voice drops slightly and his pace slows
    And his framework becomes a decree
    And this happens at most twice per panel
    And it always fires too late — the room was already gone
    And it never works
    And McGinley believes it worked

  # ─────────────────────────────────────────────
  # PAUL McGINLEY — Spoonerisms
  # ─────────────────────────────────────────────

  Scenario: McGinley produces spoonerisms from round 3 onwards
    Given the panel is in round 3 or later
    When McGinley makes an analysis
    Then McGinley may produce a spoonerism drawn from the spoonerism pool
    And McGinley does not notice the spoonerism
    And McGinley ploughs through without correction
    And the panel notices

  Scenario: Spoonerisms cluster with accidental innuendos from round 4
    Given the panel is in round 4 or round 5
    When McGinley produces a spoonerism
    Then the spoonerism may combine with an accidental innuendo in the same sentence
    And McGinley does not notice either occurrence

  Scenario: Round 5 spoonerism compounds into unintelligibility
    Given the panel is in round 5
    When McGinley delivers his most confident analysis of the round
    Then multiple spoonerisms may compound in the same sentence
    And the result may be unintelligible
    And McGinley treats it as his most cogent point
    And no panel member knows how to respond

  # ─────────────────────────────────────────────
  # PAUL McGINLEY — Accidental innuendos
  # ─────────────────────────────────────────────

  Scenario: McGinley produces accidental innuendos using genuine golf terminology
    Given the panel is in any round
    When McGinley uses genuine golf commentary language
    Then the phrasing may be drawn from the accidental innuendo pool
    And the terminology is factually correct golf commentary
    And McGinley does not notice the second reading
    And McGinley continues immediately to his next point

  Scenario: Accidental innuendos cluster from round 3
    Given the panel is in round 3 or later
    When McGinley produces an accidental innuendo
    Then a second accidental innuendo appears in the same or immediately following analysis
    And McGinley does not notice either occurrence

  Scenario: Ewen Murray speaks at increased volume during innuendo clusters
    Given the panel is in round 4 or round 5
    And McGinley has produced two or more accidental innuendos in sequence
    When Ewen Murray responds
    Then Ewen Murray's volume increases noticeably
    And Ewen Murray describes a coastline or equivalent

  # ─────────────────────────────────────────────
  # PAUL McGINLEY — Mixed metaphors
  # ─────────────────────────────────────────────

  Scenario: McGinley combines incompatible metaphors from round 2
    Given the panel is in round 2 or later
    When McGinley offers a summary or conclusion
    Then McGinley may draw from the mixed metaphor pool
    And the combined metaphor contains at least two incompatible source images
    And McGinley delivers it as wisdom

  Scenario: Three-metaphor combinations arrive from round 3
    Given the panel is in round 3 or later
    When McGinley draws from the mixed metaphor pool
    Then the combination may contain three incompatible source images
    And the images actively cancel each other out
    And McGinley is not aware of this

  Scenario: A mixed metaphor accidentally makes a genuine point in round 5
    Given the panel is in round 5
    When McGinley draws from the mixed metaphor pool
    Then the resulting metaphor may accidentally produce a coherent insight
    And this is the most unsettling thing McGinley does all panel
    And the panel does not know how to respond to accidental accuracy from McGinley

  # ─────────────────────────────────────────────
  # PAUL McGINLEY — Business terms applied to golf
  # ─────────────────────────────────────────────

  Scenario: McGinley applies business terminology to golf situations
    Given the panel is in any round
    When McGinley analyses a player's approach to a shot or hole
    Then McGinley may draw from the business term pool
    And the term is applied to a golf situation
    And the application is incorrect in register
    And McGinley believes the term is precisely correct

  Scenario: Some business terms almost make sense and those are the worst ones
    Given McGinley has applied a business term to a golf situation
    When the panel evaluates the usage
    Then some usages are clearly wrong and easily dismissed
    And some usages almost make sense
    And the usages that almost make sense are more uncomfortable than the ones that clearly do not
    And McGinley cannot tell the difference

  Scenario: McGinley applies stakeholder alignment to a player's swing mechanics
    Given the panel is in any round
    When a player is described as having inconsistent swing mechanics
    Then McGinley may describe the issue as a stakeholder alignment problem
    And McGinley may identify the stakeholders as the player's hands and hips
    And this almost makes sense
    And Coltart has the look

  # ─────────────────────────────────────────────
  # ANDREW COLTART — Wound pool
  # ─────────────────────────────────────────────

  Background:
    Given Andrew Coltart is on the golf panel
    And the wound pool is loaded for Coltart
    And the sarcasm target pool is loaded for Coltart

  Scenario: Coltart's wounds surface with increasing specificity across rounds
    Given the panel is in round 1 or round 2
    When Coltart references his playing career
    Then the reference draws from the surface-level wound pool
    And the reference is oblique rather than direct

    Given the panel is in round 3 or round 4
    When Coltart references his playing career
    Then the reference may draw from the mid-level wound pool
    And specific details may surface such as the 1999 Ryder Cup singles or the cameraman incident

    Given the panel is in round 5
    When Coltart references his playing career
    Then the reference may draw from the deep wound pool
    And Coltart may reference Lee Westwood's world ranking unprompted
    And Coltart states he has made peace with all of it
    And the pause before he says this has its own weather system

  Scenario: Coltart's private read on Faldo and McGinley is never spoken aloud
    Given the panel is in any round
    When Coltart observes the Faldo and McGinley dynamic
    Then Coltart does not verbalise his read on either character
    And the read is visible only in pauses and minor facial expressions
    And Coltart's read is available as a panel beat at most once per panel in round 4 or 5

  # ─────────────────────────────────────────────
  # NICK DOUGHERTY — McGinley translation pool
  # ─────────────────────────────────────────────

  Background:
    Given Nick Dougherty is on the golf panel
    And the McGinley translation pool is loaded for Dougherty

  Scenario: Dougherty's response to McGinley escalates across rounds
    Given the panel is in round 1 or round 2
    When McGinley makes an observation
    Then Dougherty does not visibly react

    Given the panel is in round 3
    When McGinley makes an observation
    Then Dougherty may raise a slight eyebrow
    And Dougherty does not comment

    Given the panel is in round 4
    When McGinley makes an observation
    Then Dougherty may express open incredulity
    And Dougherty still does not translate McGinley's statement

    Given the panel is in round 5
    When McGinley makes an observation
    Then Dougherty immediately restates the observation in plain English
    And Dougherty does not acknowledge he is doing this
    And Dougherty does not look at McGinley while doing it

  Scenario: Dougherty's round 5 speech is the emotional landing point
    Given the panel is in round 5
    And the panel has reached peak absurdity
    When Dougherty addresses the panel directly
    Then Dougherty acknowledges everything he has witnessed with genuine warmth
    And Dougherty's speech is the last substantive comment before Ewen's closing
    And Dougherty finds something genuinely beautiful in the chaos

  # ─────────────────────────────────────────────
  # EWEN MURRAY — Gravity escalation pool
  # ─────────────────────────────────────────────

  Background:
    Given Ewen Murray is on the golf panel
    And the comparable moments of gravity pool is loaded for Ewen
    And the coastline pool is loaded for Ewen

  Scenario: Ewen's historical comparisons escalate across rounds
    Given the panel is in round 1 or round 2
    When Ewen draws a historical comparison
    Then the comparison is drawn from the modern sporting era pool
    And the comparison is Seve Ballesteros or Nicklaus 1986

    Given the panel is in round 3 or round 4
    When Ewen draws a historical comparison
    Then the comparison may reach into pre-modern history
    And the comparison may include Agincourt or the signing of Magna Carta

    Given the panel is in round 5
    When Ewen draws a historical comparison
    Then the comparison may reach into pre-history or geology
    And Ewen treats the comparison as self-evidently appropriate

  Scenario: Ewen's closing is always magnificent regardless of panel content
    Given the panel is in round 5
    And the panel has descended into full chaos
    When Ewen delivers his closing line to camera
    Then the closing is delivered with complete conviction
    And the closing implies everything that just happened was profound
    And Ewen means every word
