# Golf Adventure Game — Gherkin Specification
# Feature: specs/golf-adventure.feature
# Panel: golfadventure
# Cross-panel characters: characters/cox.md, characters/souness.md
# Golf cast: characters/faldo.md, characters/mcginley.md, characters/radar.md etc.
# Mechanics: Shot Engine, Dice Roll, Fighting Fantasy Events, Commentator Reactions
# Domain model: .claude/practices/domain-model.md (read before implementation)
# BDD/TDD enforced — no implementation without this spec. No exceptions.

@golf-adventure
Feature: Golf Adventure Game

  The player competes in real golf tournaments and Ryder Cups at real venues.
  Each hole presents shot choices of varying risk. A simulated dice roll determines outcome.
  The 19th Hole commentators react, roast each other, and occasionally intervene.
  Cox narrates cosmologically. Souness appears as an unpredictable wildcard NPC.
  Fighting Fantasy events fire probabilistically — the course is alive.

  ---

  ## Panel Registration

  @registration
  Scenario: golfadventure panel is registered in consultant skin tab
    Given the application has loaded
    When the UI audit runs
    Then the "golfadventure" panel is present in a consultant skin tab
    And the "golfadventure" tab is registered in NAV_GROUP_MAP
    And the pipeline UI audit passes 10/10 checks

  ---

  ## Tournament Selection

  @tournament-select
  Scenario: Player selects a tournament to play
    Given the golf adventure panel is active
    When the player views the tournament lobby
    Then they see a list of available tournaments
    And each tournament shows: name, year, venue, par, and a difficulty rating
    And at least one Ryder Cup is available in addition to stroke play events

  @tournament-select
  Scenario Outline: Tournament lobby shows correct venue data
    Given the golf adventure panel is active
    When the player selects "<tournament>"
    Then the venue shown is "<venue>"
    And the par shown is <par>
    And the era shown is "<era>"

    Examples:
      | tournament                  | venue                        | par | era       |
      | 1996 Masters                | Augusta National             | 72  | historic  |
      | 2019 Open Championship      | Royal Portrush               | 71  | historic  |
      | 2006 Ryder Cup              | K Club, Ireland              | 72  | historic  |
      | 1997 Ryder Cup              | Valderrama                   | 71  | historic  |
      | Current Season Tour Event   | Generated venue              | 72  | current   |

  ---

  ## Commentator Assignment

  @commentator-assignment
  Scenario: Golf adventure loads commentators from character files
    Given the golf adventure panel is active
    And the tournament has been selected
    When the commentator panel initialises
    Then commentators are loaded from "characters/faldo.md", "characters/mcginley.md", "characters/radar.md"
    And "characters/cox.md" is loaded as cross-panel narrator
    And "characters/souness.md" is loaded as wildcard NPC
    And no commentator attributes are loaded from memory — files are the only source of truth

  @commentator-assignment
  Scenario: Commentator roles are assigned per domain model
    Given the golf adventure commentators are loaded
    When commentary roles are assigned
    Then Faldo is assigned role COLOUR
    And McGinley is assigned role ANCHOR
    And Radar is assigned role CHARACTER
    And Cox is assigned role NARRATOR — cross-panel, not bound by standard role rules
    And Souness is assigned role WILDCARD — fires on event trigger only

  ---

  ## Hole Initialisation

  @hole-init
  Scenario: Player begins a hole
    Given the player has selected a tournament
    And they are on hole <hole_number>
    When the hole initialises
    Then the hole data shows: hole number, par, distance in yards, and a course description
    And the tee shot choice panel is displayed
    And the commentators deliver a hole introduction

  @hole-init
  Scenario Outline: Hole introduction tone matches par type
    Given the player is starting hole <hole_number> with par <par>
    When the hole introduction fires
    Then the introduction register is "<register>"

    Examples:
      | hole_number | par | register                              |
      | 1           | 4   | cautious optimism, first tee tension  |
      | any         | 3   | precision anxiety, wind reading       |
      | any         | 5   | ambition, risk calibration            |
      | 18          | 4   | final hole weight, tournament stakes  |

  ---

  ## Shot Choice Engine

  @shot-choice
  Scenario: Player is presented with shot choices on the tee
    Given the player is on the tee
    When the shot choice panel renders
    Then they see at least 3 options
    And each option has: a label, a risk level, a success probability, and a yardage outcome range
    And the risk levels available include SAFE, STANDARD, AGGRESSIVE, and HERO

  @shot-choice
  Scenario Outline: Shot probability ranges by risk level
    Given the player selects a "<risk_level>" shot
    Then the success probability displayed is between <min_prob>% and <max_prob>%
    And a failure outcome is described

    Examples:
      | risk_level | min_prob | max_prob |
      | SAFE       | 85       | 95       |
      | STANDARD   | 65       | 80       |
      | AGGRESSIVE | 40       | 60       |
      | HERO       | 15       | 35       |

  @shot-choice
  Scenario: Approach shot choices differ from tee shot choices
    Given the player is playing an approach shot
    When the shot choice panel renders
    Then the options include: GO_FOR_PIN, MIDDLE_OF_GREEN, LAYUP, PUNCH_OUT
    And each option reflects the lie: fairway, rough, bunker, or trees

  @shot-choice
  Scenario: Putting choices are distinct from full shot choices
    Given the player is on the green
    When the shot choice panel renders
    Then the options are: AGGRESSIVE_LINE, SAFE_LINE, LAG_PUTT
    And the green speed and slope are described in the hole context

  ---

  ## Dice Roll Engine

  @dice-roll
  Scenario: Player rolls the dice for a shot outcome
    Given the player has selected a shot
    When the dice roll fires
    Then a value between 1 and 6 is generated
    And the outcome is determined by combining: dice value, selected risk level, lie, and player skill modifier
    And the outcome is one of: GREAT, GOOD, AVERAGE, POOR, DISASTER

  @dice-roll
  Scenario Outline: Dice value maps to outcome by risk level
    Given the player selected risk level "<risk_level>"
    And the dice rolled "<dice_value>"
    Then the shot outcome is "<outcome>"

    Examples:
      | risk_level | dice_value | outcome  |
      | SAFE       | 5          | GREAT    |
      | SAFE       | 2          | AVERAGE  |
      | SAFE       | 1          | POOR     |
      | STANDARD   | 6          | GREAT    |
      | STANDARD   | 3          | AVERAGE  |
      | STANDARD   | 1          | DISASTER |
      | AGGRESSIVE | 6          | GREAT    |
      | AGGRESSIVE | 4          | AVERAGE  |
      | AGGRESSIVE | 2          | POOR     |
      | AGGRESSIVE | 1          | DISASTER |
      | HERO       | 6          | GREAT    |
      | HERO       | 5          | GOOD     |
      | HERO       | 3          | POOR     |
      | HERO       | 1          | DISASTER |

  @dice-roll
  Scenario: Dice roll is animated before result reveals
    Given the player has selected a shot
    When the dice roll fires
    Then a dice animation plays for at least 800ms
    And the result is hidden until the animation completes
    And commentators react after the result is revealed — not during the animation

  ---

  ## Commentator Reaction Engine

  @commentator-reaction
  Scenario: Commentators react to shot outcome
    Given a shot has been resolved with outcome "<outcome>"
    When the commentary fires
    Then at least 2 commentators respond
    And each response reflects the commentator's character and wound state
    And the responses are sequenced — not simultaneous

  @commentator-reaction
  Scenario Outline: Commentator tone maps to outcome
    Given Faldo is active
    And the shot outcome is "<outcome>"
    When Faldo's commentary fires
    Then his response register is "<register>"

    Examples:
      | outcome  | register                                          |
      | GREAT    | grudging approval, technical justification        |
      | GOOD     | qualified praise, immediate reservation           |
      | AVERAGE  | polite disappointment, sandwich metaphor eligible |
      | POOR     | diagnosis, dissection, mild contempt              |
      | DISASTER | clinical detachment masking savage enjoyment      |

  @commentator-reaction
  Scenario: McGinley performs warmth that hollow analyst engine undermines
    Given McGinley is active
    And the shot outcome is POOR
    When McGinley's commentary fires
    Then his opening line performs warmth and encouragement
    And his second sentence contradicts it with hollow analysis
    And "Shut up, Paul" endpoint probability is elevated

  @commentator-reaction
  Scenario: Radar escalates hat angle after DISASTER
    Given Radar is active
    And the shot outcome is DISASTER
    When Radar's commentary fires
    Then his hat angle increments by at least 5 degrees in character state
    And his Australian colloquialisms escalate one tier
    And he references an appropriate Australian cultural authority unprompted

  @commentator-reaction
  Scenario: Cox situates shot outcome cosmologically
    Given Cox is active as narrator
    And a shot outcome has resolved
    When Cox's commentary fires
    Then he situates the outcome on at least one of: cosmic timescale, ancestral timescale, or current round timescale
    And his build-to-speech arc advances by one step
    And he returns to the current hole with "But yes. Hole <n>. Quite." or equivalent

  @commentator-reaction
  Scenario: Cox D:Ream wound activates when triggered
    Given Cox is active
    And a trigger word from Cox's wound list appears in the game context
    When Cox's commentary fires
    Then his deflection register activates
    And in rounds 1-3 he situates it cosmologically
    And in rounds 7+ the deflection stops working and the wound is exposed

  @commentator-reaction
  Scenario: Collective D:Ream singing protocol fires when conditions met
    Given Cox has irritated 3 or more commentators in a single round
    When the collective attack mechanic evaluates
    Then Stage 1 fires: one commentator begins quietly — "Brian Cox... Brian Cox..."
    And Stage 2 fires: a second commentator joins, melody becomes clearer
    And Stage 3 fires when Cox attempts to interject: volume increases, final syllable elongated
    And Stage 4 fires: Cox situates the attack cosmologically
    And woundActivated resets after Cox's physics response
    And temperature toward singing characters raises by one step — not lowers

  ---

  ## Souness Wildcard NPC

  @souness-wildcard
  Scenario: Souness does not appear in early holes
    Given the golf adventure is in holes 1-3
    When each hole resolves
    Then Souness does not appear
    And the SOUNESS_TRIGGER flag is false

  @souness-wildcard
  Scenario: Souness appears as wildcard NPC from hole 4 onwards
    Given the golf adventure is in hole 4 or later
    And a DISASTER outcome has just resolved
    When the Souness trigger evaluates
    Then there is a non-zero probability Souness appears
    And his appearance is announced as an intrusion — not a scheduled commentator turn
    And his character file "characters/souness.md" is loaded fresh at point of appearance

  @souness-wildcard
  Scenario: Souness departure is as abrupt as his arrival
    Given Souness has appeared as wildcard NPC
    When his contribution resolves
    Then he exits without ceremony
    And no commentator acknowledges the exit directly
    And the SOUNESS_TRIGGER flag resets

  ---

  ## Fighting Fantasy Events

  @ff-events
  Scenario: Fighting Fantasy event pool exists
    Given the golf adventure is initialised
    When the FF event pool loads
    Then it contains at least 12 named event types
    And each event has: a trigger condition, a dice check, a success outcome, and a failure outcome

  @ff-events
  Scenario Outline: Fighting Fantasy events fire based on trigger conditions
    Given the player is in a round
    And the trigger condition "<trigger>" is met
    When the FF event evaluates
    Then the event "<event_name>" fires with probability <fire_probability>

    Examples:
      | trigger                        | event_name              | fire_probability |
      | First tee, round 1             | FIRST_TEE_NAUSEA        | 0.25             |
      | Troll spotted near water hazard | TROLL_NEGOTIATION      | 0.15             |
      | Crowd size > 50 in context     | CROWD_MEMBER_FLIRTATION | 0.10             |
      | Any bunker shot                | BEAST_IN_BUNKER         | 0.08             |
      | Caddy interaction eligible     | CADDY_BETRAYAL          | 0.12             |
      | Rules official nearby          | OFFICIAL_BRIBERY        | 0.10             |
      | Score 3+ over par              | PATRON_PITY_OFFER       | 0.20             |
      | Score 3+ under par             | HUBRIS_INTERVENTION     | 0.15             |
      | Any par 3                      | WIND_SPIRIT_APPEARS     | 0.08             |
      | Ryder Cup context              | OPPOSING_CAPTAIN_CURSE  | 0.12             |
      | Any shot near water            | WATER_BEAST_EMERGES     | 0.10             |
      | Final hole                     | GALLERY_MUTINY          | 0.18             |

  @ff-events
  Scenario: FIRST_TEE_NAUSEA event plays out
    Given the player is on the first tee of round 1
    And FIRST_TEE_NAUSEA triggers
    When the player rolls the dice for composure
    Then on a roll of 4+ they compose themselves and tee off normally
    And on a roll of 1-3 they are visibly sick on the first tee
    And the commentators react in character — Radar with escalating hat angle, Faldo with clinical sympathy
    And the outcome is logged in the adventure session state

  @ff-events
  Scenario: TROLL_NEGOTIATION event plays out
    Given a troll has been spotted near a water hazard
    When TROLL_NEGOTIATION fires
    Then the player is offered: BEFRIEND, BRIBE, IGNORE, or FIGHT
    And BEFRIEND requires a dice roll of 4+
    And BRIBE costs one shot penalty but always succeeds
    And IGNORE has a 0.4 chance of troll interference on next shot
    And FIGHT requires dice roll of 5+ and failure adds two penalty shots
    And the troll outcome is delivered in commentator voices

  @ff-events
  Scenario: CADDY_BETRAYAL event resolves
    Given CADDY_BETRAYAL has triggered
    When the player resolves the caddy event
    Then on success the caddy provides a +1 dice modifier for the next three shots
    And on failure the caddy gives actively wrong yardage for the next shot
    And Radar has elevated probability of referencing the caddy in his next turn

  @ff-events
  Scenario: Fighting Fantasy event does not interrupt a dice roll in progress
    Given the player is mid-shot resolution
    When a FF trigger condition is met during that resolution
    Then the FF event is queued
    And fires after the shot outcome is delivered and commentary completes

  ---

  ## Score Tracking

  @score-tracking
  Scenario: Score is tracked hole by hole
    Given the player has completed a hole
    When the scorecard updates
    Then the hole score is recorded as shots taken vs par
    And the running total is displayed as over/under par
    And the commentators reference the score in subsequent holes

  @score-tracking
  Scenario Outline: Score label maps to running total
    Given the player's running total is "<total>"
    When the score display renders
    Then the label shown is "<label>"

    Examples:
      | total   | label          |
      | -5      | -5 (very hot)  |
      | -1      | -1             |
      | E       | Level par      |
      | +3      | +3             |
      | +8      | +8 (struggling)|

  @score-tracking
  Scenario: Cox references the score cosmologically at the turn
    Given the player has completed hole 9
    When Cox's turn-commentary fires
    Then he situates the nine-hole score against a cosmic or ancestral reference
    And returns to "But yes. The back nine. Quite." or equivalent

  ---

  ## Ryder Cup Mode

  @ryder-cup
  Scenario: Ryder Cup mode differs from stroke play
    Given the player has selected a Ryder Cup tournament
    When the match initialises
    Then the format is matchplay not strokeplay
    And the player is paired against a named CPU opponent
    And the score display shows holes up/down not over/under par
    And the commentators reference the team context — Europe vs USA

  @ryder-cup
  Scenario: CPU opponent is drawn from real Ryder Cup rosters for the selected year
    Given the 2006 Ryder Cup at K Club is selected
    When the CPU opponent is assigned
    Then the opponent is drawn from the 2006 USA team roster
    And the opponent has a named difficulty rating
    And the commentators reference real Ryder Cup history for that year

  @ryder-cup
  Scenario: McGinley has elevated presence in 2004 Ryder Cup context
    Given the 2004 Ryder Cup at Oakland Hills is selected
    When McGinley commentates
    Then his winning putt wound activates — he cannot stop referencing it
    And his hollow analyst engine fires at elevated frequency
    And "Shut up, Paul" endpoint probability is at maximum

  ---

  ## Session Persistence

  @session-persistence
  Scenario: Adventure game state persists across holes
    Given the player has completed hole 6
    When hole 7 initialises
    Then character wound states are preserved from previous holes
    And Cox's build-to-speech arc step is preserved
    And Radar's hat angle is preserved
    And FF event outcomes that modified modifiers are preserved
    And Souness trigger state is preserved

  @session-persistence
  Scenario: Adventure game state does not leak into other panels
    Given the player exits the golf adventure mid-round
    When they switch to another panel
    Then the golf adventure state is held in sessionStorage under key "hc_golf_adventure"
    And no other panel reads or writes that key
    And returning to golf adventure restores the state from sessionStorage

  ---

  ## Temporal Bleed (Historic Tournaments)

  @temporal-bleed
  Scenario: Temporal bleed fires in historic tournament mode
    Given the player is competing in a historic tournament
    And a character has temporal_bleed_affinity defined per domain model
    When a commentary moment resolves
    Then the character may leak a post-era fact at their defined leak_probability
    And the room responds with one BLEED_RESPONSE type
    And nobody names what happened
    And the audience holds it alone

  @temporal-bleed
  Scenario: Radar temporal bleed references Australian cultural futures
    Given the player is in a historic tournament pre-2000
    When Radar's temporal bleed fires
    Then the leaked fact references an Australian sporting or cultural event post the tournament era
    And Radar shows no awareness he has said anything unusual
    And one other commentator delivers a MISFIRE or CALLED_OUT response

  ---

  ## Premonition Engine Integration

  @premonition
  Scenario: Commentators commit predictions before dice rolls
    Given a shot choice has been made but dice not yet rolled
    When the Premonition Engine evaluates
    Then a commentator may COMMIT to a shot outcome prediction
    And the COMMIT is logged in session state
    And after the dice resolves the RESOLUTION fires: EXACT, PARTIAL, MISS, or TRANSCENDENT
    And the AFTERMATH state updates accordingly

  @premonition
  Scenario: Faldo and McGinley enter COLLECTIVE_CALL on prediction
    Given both Faldo and McGinley have elevated premonition_affinity for the current shot
    When COLLECTIVE_CALL fires
    Then both commit publicly to different outcomes
    And both receive AFTERMATH states after resolution
    And neither acknowledges the other's prediction directly

  ---

  ## Skin Tab and Navigation

  @skin-tab
  Scenario: Golf adventure is accessible from main navigation
    Given the application has loaded
    When the player navigates to the golf adventure tab
    Then the golfadventure panel becomes active
    And all other panels become inactive
    And the panel renders without errors

  @skin-tab
  Scenario: Golf adventure tab label is correct
    Given the application has loaded
    When the nav tabs render
    Then the golf adventure tab displays the label "Golf Adventure" or configured equivalent
    And the tab is positioned within the golf panel group
