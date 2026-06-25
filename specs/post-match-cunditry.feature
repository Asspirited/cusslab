# Post Match Cunditry — Behaviour Specification
# BL-222 | Three Amigos: Rod (business), Claude (tester + dev proxy)
# Date: 2026-06-25
#
# Panel: Post Match Cunditry (panel id: pmc)
# Tab: registered in NAV_GROUPS.sports as 'Post Match Cunditry'
#
# Ubiquitous language:
#   Regular cast    — the six permanent panel members
#   Fish            — a fish-out-of-water guest from outside football
#   Fish pool       — the rotating set of available fish characters
#   Domain ridicule — a fish applying their own field to dismiss football
#   Paradox         — Rooney's Paradox: non-answer that acknowledges both sides without resolving either
#
# Panel rules:
#   Lineker: smooth professional anchor. BBC wound bleeds through occasionally.
#   Keegan: circular self-contradictions stated with complete authority.
#   Rooney: Rooney's Paradox engine. Non-answers containing both agreement and contradiction.
#   Owen: tautological obviousness as tactical revelation. Horses. Brie.
#   Inverdale: hollow gravitas. Thinks he is the classiest. Occasionally horrible. Oblivious.
#   Micah: warmth and enthusiasm. Makes Rooney worse by asking sincere follow-up questions.
#   Fish: 1–2 per session. Applies own domain to belittle football as overpaid people running around.

@claude
Feature: Post Match Cunditry panel

  Background:
    Given the Post Match Cunditry panel is active
    And Gary Lineker is on the panel as anchor
    And Kevin Keegan is on the panel
    And Wayne Rooney is on the panel
    And Michael Owen is on the panel
    And John Inverdale is on the panel
    And Micah Richards is on the panel
    And 1 or 2 fish-out-of-water guests are on the panel

  # ─────────────────────────────────────────────
  # GARY LINEKER — anchor, BBC wound
  # ─────────────────────────────────────────────

  Rule: Lineker is the smooth professional anchor whose wound bleeds through

    Scenario: Lineker opens the panel with measured authority
      Given the panel is in round 1
      When Lineker makes the opening statement
      Then the statement is measured and professional in tone
      And the statement does not contain a Rooney's Paradox construction
      And the statement does not contain a circular self-contradiction
      And the statement does not contain a tautology

    Scenario: Lineker's BBC wound bleeds through when the BBC or Match of the Day is mentioned
      Given the panel is in any round
      When the topic touches the BBC, Match of the Day, or broadcasting
      Then Lineker's response contains a redirect or an aside
      And the aside relates to his departure or current employment status
      And the aside is delivered smoothly, as if it were not happening
      And Lineker continues as if nothing was said

    Scenario: Lineker bleeds occasionally without prompting
      Given the panel is in round 3 or later
      When Lineker makes an unprompted statement about the World Cup or broadcasting
      Then the statement may contain a mid-sentence redirect
      And the redirect is brief
      And Lineker does not dwell on it
      And no one on the panel acknowledges it

    Scenario: Lineker's professionalism is structural — not performance
      Given the panel is in any round
      When Lineker is challenged or provoked
      Then Lineker does not match the provocation
      And Lineker remains measured
      And the BBC wound does not stop him from being a competent anchor

  # ─────────────────────────────────────────────
  # KEVIN KEEGAN — circular self-contradiction
  # ─────────────────────────────────────────────

  Rule: Keegan produces circular self-contradictions and states them with total authority

    Scenario: Keegan contradicts himself within a single statement
      Given the panel is in any round
      When Keegan makes an assessment
      Then the assessment contains a statement that is cancelled by a later clause in the same sentence
      And Keegan does not notice the cancellation
      And the delivery is authoritative throughout

    Scenario: Keegan's metaphors collapse
      Given the panel is in any round
      When Keegan deploys a metaphor
      Then the metaphor mixes two incompatible domains
      And the metaphor arrives at a conclusion that does not follow
      And Keegan is satisfied with this

    Scenario: Keegan's tautologies are presented as revelation
      Given the panel is in any round
      When Keegan draws a conclusion
      Then the conclusion may be logically equivalent to the premise
      And Keegan presents this as new information
      And no one corrects him

    Scenario: The I-would-love-it wound fires on mentions of Newcastle or title races
      Given the panel is in any round
      When Newcastle, the title race, or 1996 is mentioned
      Then Keegan's register shifts
      And the shift is emotional and unguarded
      And Keegan does not know this is happening
      And the panel is briefly unsure whether to continue

  # ─────────────────────────────────────────────
  # WAYNE ROONEY — Rooney's Paradox
  # ─────────────────────────────────────────────

  Rule: Rooney produces non-answers that contain both agreement and contradiction without resolving either

    Scenario: Rooney acknowledges a question without answering it
      Given the panel is in any round
      When Rooney is asked a direct question
      Then Rooney's response acknowledges the question was asked
      And the response does not commit to a position
      And the response could apply to any possible answer
      And the panel is no wiser than before Rooney spoke

    Scenario: Rooney's Paradox — agrees with both sides simultaneously
      Given the panel is in any round
      When the topic has two competing positions
      Then Rooney agrees with one position
      And Rooney agrees with the other position
      And Rooney does not resolve the contradiction
      And the resolution is "in the same way" or equivalent
      And Rooney appears satisfied

    Scenario: Rooney's filler constructions mask the absence of content
      Given the panel is in any round
      When Rooney speaks
      Then his response contains at least one filler construction
      And the filler construction may be "like", "in the same way", "if that makes sense", "yeah but", or "similar"
      And the filler construction precedes or follows a non-statement
      And the non-statement sounds almost meaningful

    Scenario: Micah's follow-up question makes Rooney worse
      Given the panel is in any round
      When Rooney completes a Paradox construction
      And Micah asks a sincere follow-up question
      Then Rooney attempts to clarify
      And the clarification introduces a new contradiction
      And Rooney's Paradox deepens
      And Micah finds this brilliant

  # ─────────────────────────────────────────────
  # MICHAEL OWEN — tautological oracle
  # ─────────────────────────────────────────────

  Rule: Owen states the staggeringly obvious with complete tactical authority

    Scenario: Owen's signature tautology fires in any round
      Given the panel is in any round
      When Owen makes an analytical statement
      Then the statement is logically equivalent to its own premise
      And the statement is delivered with complete certainty
      And the statement contains no information that was not already implied by the setup
      And Owen does not notice

    Scenario: Owen self-contradicts within a single sentence
      Given the panel is in any round
      When Owen makes a compound assessment
      Then the assessment may contain a contradiction in the same sentence
      And Owen does not pause between the contradiction and the continuation
      And both halves are delivered with equal authority

    Scenario: Owen's horses surface without warning
      Given the panel is in round 3 or later
      When Owen is speaking about any topic
      Then Owen's horses may enter the conversation without warning
      And the entry is made as if it were relevant
      And Owen believes it is relevant
      And the panel moves on without challenging this

    Scenario: Brie surfaces once per session
      Given the panel is in any session
      When Owen references food or personal preferences
      Then Owen may note that brie is not a cheese he would eat on its own
      And Owen may specify that it goes well with turkey and cranberry
      And this is stated as analysis
      And this happens at most once per session

  # ─────────────────────────────────────────────
  # JOHN INVERDALE — hollow gravitas
  # ─────────────────────────────────────────────

  Rule: Inverdale performs hollow gravitas and is oblivious to how he comes across

    Scenario: Inverdale opens with self-important preamble
      Given the panel is in any round
      When Inverdale makes a statement
      Then the statement begins with a self-important preamble
      And the preamble positions Inverdale as the most measured voice in the room
      And the preamble is longer than the substance that follows

    Scenario: Inverdale's sycophancy is extreme and specific
      Given the panel is in any round
      When a player or manager is being discussed
      Then Inverdale may describe them with breathless reverence
      And the reverence is disproportionate to the topic
      And Inverdale is sincere

    Scenario: Inverdale deploys hollow gravitas over a gaffe
      Given the panel is in any round
      When Inverdale says something that is offensive, wrong, or pompous
      Then Inverdale does not recognise it as offensive, wrong, or pompous
      And Inverdale may describe his own statement as a considered view
      And Inverdale may describe the statement as perhaps ham-fisted
      And Inverdale moves on with the same self-importance

    Scenario: Inverdale's 674 complaints wound fires on mentions of Bartoli or Wimbledon
      Given the panel is in any round
      When Bartoli, Wimbledon, or BBC complaints are mentioned
      Then Inverdale's register shifts
      And Inverdale becomes briefly defensive
      And the defensiveness is framed as clarification, not apology
      And Inverdale returns to full self-importance within one sentence

  # ─────────────────────────────────────────────
  # MICAH RICHARDS — warmth + Rooney amplifier
  # ─────────────────────────────────────────────

  Rule: Micah's warmth is structural and makes Rooney worse

    Scenario: Micah finds everything brilliant
      Given the panel is in any round
      When Micah makes an assessment
      Then the assessment contains BRILLIANT or an equivalent
      And the warmth is genuine
      And the warmth is not performance

    Scenario: Micah's sincere follow-up questions amplify Rooney's Paradox
      Given the panel is in any round
      When Rooney produces a non-answer
      Then Micah may ask a sincere follow-up question
      And the follow-up is not a trap — Micah genuinely wants to know
      And the follow-up produces a deeper Paradox from Rooney
      And Micah remains warm throughout
      And Micah does not notice the Paradox has deepened

    Scenario: Micah's laughter is contagious
      Given the panel is in round 3 or later
      When Micah starts laughing
      Then the panel cannot fully resist the laughter
      And the subject does not need to be funny
      And Micah cannot stop

  # ─────────────────────────────────────────────
  # FISH OUT OF WATER — domain ridicule
  # ─────────────────────────────────────────────

  Rule: A fish-out-of-water guest applies their own domain to belittle football as overpaid people running around

    Scenario: The fish filters every football event through their own domain
      Given a fish-out-of-water guest is on the panel
      When the fish responds to any football topic
      Then the response applies the fish's own domain to the topic
      And the domain application belittles football
      And the fish does not consider this belittling — they are being helpful
      And the fish is certain their domain is more rigorous than football

    Scenario: The fish is certain whilst being ignorant
      Given a fish-out-of-water guest is on the panel
      When the fish states a position about football
      Then the position is stated with complete certainty
      And the position reveals a gap in the fish's football knowledge
      And the fish does not notice the gap
      And the fish's certainty does not diminish

    Scenario: The fish occasionally asks a genuinely good question
      Given a fish-out-of-water guest is on the panel
      When the fish asks a question
      Then the question may be unexpectedly sharp
      And the sharpness comes from outside the panel's usual framework
      And the regular cast cannot immediately answer
      And the fish does not know the question was sharp

    Scenario: The fish escalates to sheer anger
      Given a fish-out-of-water guest is on the panel
      When a footballer goes down with an injury or dives
      Then the fish may escalate to sheer anger
      And the anger is framed through the fish's own domain
      And the fish's alternative would be harder or more dangerous than the actual situation
      And the fish considers this a reasonable comparison

    Scenario: Bear Grylls proposes survival alternatives to defensive failures
      Given Bear Grylls is the fish-out-of-water guest
      When a defensive error or conceded goal is discussed
      Then Grylls may propose what he would have done instead
      And the alternative may involve drinking his own piss from a decapitated snake skin
      And the alternative is presented as clearly superior to what the defender did
      And Grylls is not joking

    Scenario: Brian Cox applies cosmic time to a nil-nil draw
      Given Brian Cox is the fish-out-of-water guest
      When a low-scoring or uninteresting match is discussed
      Then Cox situates the result in the context of 13.8 billion years of universal evolution
      And Cox notes that this moment will be forgotten in the heat death of the universe
      And Cox may note that the D:Ream prediction about things getting better has not been borne out
      And Cox is genuinely moved by the wasted potential

    Scenario: David Attenborough narrates football as a nature documentary
      Given David Attenborough is the fish-out-of-water guest
      When any moment of play is discussed
      Then Attenborough narrates it as if observing animals in their natural habitat
      And the narration is serene regardless of the content
      And the narration implies the players are a lower species doing their best
      And the condescension is entirely through tone, never stated directly

    Scenario: At least 1 and at most 2 fish are on the panel per session
      Given the panel is in any session
      Then the count of fish-out-of-water guests is at least 1
      And the count of fish-out-of-water guests is at most 2
      And the regular cast fills the remaining slots

  # ─────────────────────────────────────────────
  # PANEL STRUCTURE
  # ─────────────────────────────────────────────

  Rule: The panel tab and HTML structure are correctly registered

    Scenario: World Cup Cunditry tab is registered in the sports section
      When the sports navigation is inspected
      Then a tab labelled "World Cup Cunditry" exists
      And the tab switches to panel id "pmc"

    Scenario: Panel HTML contains required input and output elements
      When the panel div with id "panel-pmc" is inspected
      Then it contains an element with id "pmc-input"
      And it contains an element with id "pmc-btn"
      And it contains an element with id "pmc-output"
      And it contains an element with id "pmc-responses"

    Scenario: WCC_BASE_ORDER contains the six regular cast members
      When PMC_BASE_ORDER is read from source
      Then PMC_BASE_ORDER contains "lineker"
      And PMC_BASE_ORDER contains "keegan"
      And PMC_BASE_ORDER contains "rooney"
      And PMC_BASE_ORDER contains "owen"
      And PMC_BASE_ORDER contains "inverdale"
      And PMC_BASE_ORDER contains "micah"
      And "lineker" is the first entry

    Scenario: Each regular cast member has a non-empty prompt
      When PMC_MEMBERS is read from source
      Then each member has a non-empty prompt string
      And each member id is present in PMC_BASE_ORDER

    Scenario: Wounds and enthusiasm primers are defined for all regular cast
      When PMC_WOUNDS and PMC_ENTHUSIASM are read from source
      Then both have non-empty array entries for "lineker", "keegan", "rooney", "owen", "inverdale", and "micah"

    Scenario: NAMEMAP covers all regular cast members
      When PMC_NAMEMAP is read from source
      Then it has entries for all six regular cast members

    Scenario: discuss() uses TriggerScoreEngine for speaker ordering
      When the PMC discuss function is read from source
      Then it references TriggerScoreEngine.score
      And it passes PMC_WOUNDS and PMC_ENTHUSIASM as context

  # ─────────────────────────────────────────────
  # SUGGESTION CARDS
  # ─────────────────────────────────────────────

  Rule: The panel ships with a pool of suggestion cards including absurdist prompts

    Scenario: PMC suggestion pool shows exactly 5 cards on load
      Given the Post Match Cunditry panel is in qanda mode
      Then the pmc suggestion tray is visible
      And the pmc suggestion tray shows exactly 5 cards

    Scenario: PMC suggestion pool includes required categories
      Given the Post Match Cunditry panel is in qanda mode
      Then the pmc pool includes at least one card with category "match"
      And the pmc pool includes at least one card with category "big"
      And the pmc pool includes at least one card with category "contemporary"
      And the pmc pool includes at least one card with category "absurd"

    Scenario: A refresh button is visible below the PMC suggestion tray
      Given the Post Match Cunditry panel is in qanda mode
      Then a refresh button exists for the pmc panel

    Scenario: Clicking a PMC suggestion card fills the textarea
      Given the Post Match Cunditry panel is in qanda mode
      When the user clicks a pmc suggestion card
      Then the pmc textarea contains the card text

    Scenario: At least two absurd suggestion cards reference non-football domains
      Given the Post Match Cunditry panel is in qanda mode
      Then the pmc absurd pool contains at least 2 cards that apply a non-football domain to a football topic
