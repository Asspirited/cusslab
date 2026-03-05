# specs/behaviour-triggers.feature
# Slice 5 of 5: Behaviour triggers — interrupts, wolfpack, fight/flight/freeze, storm off
# Interrupts fire mid-generation — current speaker truncated
# Wolfpack: ringleader initiates, others join weighted by hostility + ringleader relationship
# Victim response: FIGHT / FLIGHT / FREEZE (fight/flight/freeze)
# STORM_OFF is an eruption register AND a FLIGHT response
# Panel continues with N-1 characters after permanent exit
# SHUT_UP ends interrupt loop — fires from third character

Feature: Behaviour triggers — interrupts, wolfpack, fight/flight/freeze, storm off

  Behaviour triggers bridge emotional state numbers and turn-structure events.
  Interrupts fire mid-generation — the current speaker's text is visibly truncated.
  Wolfpack requires a ringleader; others join based on hostility and ringleader relationship.
  Victims respond via fight, flight, or freeze depending on active axes.
  STORM_OFF is permanent — character exits with state preserved in snapshot.
  Panel continues with reduced cast after exit.
  SHUT_UP fires from a third character to end interrupt loops.

  Background:
    Given the relationship matrix is loaded from the domain model
    And the behaviour trigger table is loaded from the domain model
    And the panel has started with cast ["faldo", "mcginley", "cox", "wayne"]
    And all pressure values are at their cold start

  # ── Interrupt — mid-generation ────────────────────────────────────────────────

  Scenario Outline: Interrupt fires mid-generation when interrupter pressure clears threshold
    Given <interrupter>'s pressure is <pressure>
    And <speaker> is currently generating a turn
    And the interrupt threshold is <threshold>
    When the interrupt roll clears
    Then <speaker>'s generated text is truncated at the interrupt point
    And <interrupter>'s turn begins immediately
    And <speaker> carries a humiliation spike of <humiliation_spike>
    And <speaker>'s pressure increments by 1

    Examples:
      | interrupter | speaker  | pressure | threshold | humiliation_spike |
      | faldo       | mcginley | 4        | 3         | +2                |
      | wayne       | cox      | 5        | 3         | +2                |
      | mcginley    | faldo    | 6        | 3         | +3                |
      | wayne       | faldo    | 4        | 3         | +2                |

  Scenario: Truncated speaker text is visibly incomplete in the panel output
    Given mcginley is generating a turn and is interrupted by faldo
    Then mcginley's output ends mid-sentence
    And the panel output marks the truncation point
    And faldo's turn begins on the next line

  Scenario Outline: Interrupted speaker recovery attempt probability weighted by dominance
    Given <speaker> was interrupted by <interrupter>
    And <speaker>'s dominance toward <interrupter> is <dominance>
    Then <speaker>'s recovery_attempt_probability is <probability>

    Examples:
      | speaker  | interrupter | dominance | probability |
      | faldo    | mcginley    | +5        | 0.90        |
      | faldo    | wayne       | +4        | 0.80        |
      | mcginley | faldo       | -4        | 0.20        |
      | cox      | wayne       | +3        | 0.60        |
      | wayne    | faldo       | -2        | 0.35        |

  Scenario: Interrupt loop continues until SHUT_UP fires or one party yields
    Given faldo interrupted mcginley
    And mcginley attempts recovery
    And faldo interrupts again
    Then the interrupt loop is active
    And each loop iteration increments both characters' pressure by 1
    And the loop continues until a SHUT_UP event fires or one character yields

  Scenario: SHUT_UP fires from third character to end interrupt loop
    Given an interrupt loop is active between faldo and mcginley
    And wayne's patience threshold is crossed after 2 loop iterations
    When wayne's SHUT_UP turn fires
    Then the interrupt loop ends immediately
    And speaker rotation resets to the next scheduled character
    And faldo and mcginley both carry a humiliation spike of +1
    And wayne carries a pride spike of +2

  Scenario Outline: SHUT_UP probability grows with interrupt loop iteration count
    Given an interrupt loop has been active for <iterations> iterations
    And <observer>'s patience_threshold is <threshold>
    Then <observer>'s shut_up_probability is <probability>

    Examples:
      | observer | iterations | threshold | probability |
      | wayne    | 1          | 2         | 0.10        |
      | wayne    | 2          | 2         | 0.50        |
      | wayne    | 3          | 2         | 0.90        |
      | cox      | 1          | 4         | 0.05        |
      | cox      | 4          | 4         | 0.50        |
      | cox      | 6          | 4         | 0.90        |

  # ── Wolfpack — initiate and join ─────────────────────────────────────────────

  Scenario Outline: Ringleader initiates wolfpack when hostility threshold crossed
    Given <ringleader>'s affect toward <target> is <affect>
    And <ringleader>'s pressure is <pressure>
    And the wolfpack initiation threshold is affect <= -3 AND pressure >= 4
    Then <ringleader> initiates a wolfpack targeting <target>
    And <ringleader> carries a pride spike of +2

    Examples:
      | ringleader | target   | affect | pressure |
      | faldo      | mcginley | -4     | 4        |
      | mcginley   | faldo    | -4     | 5        |
      | faldo      | wayne    | -3     | 4        |
      | cox        | mcginley | -3     | 4        |

  Scenario Outline: Other characters join wolfpack weighted by hostility and ringleader relationship
    Given <ringleader> has initiated a wolfpack targeting <target>
    And <joiner>'s affect toward <target> is <joiner_affect>
    And <joiner>'s warmth toward <ringleader> is <joiner_warmth>
    Then <joiner>'s join_probability is <probability>

    Examples:
      | ringleader | target   | joiner   | joiner_affect | joiner_warmth | probability |
      | faldo      | mcginley | wayne    | -1            | +3            | 0.60        |
      | faldo      | mcginley | cox      | 0             | 0             | 0.15        |
      | mcginley   | faldo    | wayne    | -1            | +3            | 0.55        |
      | faldo      | wayne    | mcginley | +2            | +3            | 0.10        |
      | faldo      | mcginley | wayne    | -3            | +3            | 0.80        |

  Scenario: Joiner carries joy spike on joining wolfpack
    Given wayne joins faldo's wolfpack targeting mcginley
    Then wayne carries a joy spike of +2
    And wayne's turn targets mcginley explicitly
    And mcginley's pressure increments by 1 per joining character

  Scenario: Wolfpack victim pressure spikes from each joining character
    Given faldo has initiated a wolfpack targeting mcginley
    And wayne joins the wolfpack
    And cox joins the wolfpack
    Then mcginley's pressure increments by 3
    And mcginley's humiliation spikes by +2 per joining character
    And mcginley's effective_misread_probability increases

  # ── Victim response — fight / flight / freeze ─────────────────────────────────

  Scenario Outline: Victim response determined by dominant active axes
    Given <victim> is being wolfpacked
    And <victim>'s dominant axis is <axis> at value <value>
    And <victim>'s dominance toward ringleader is <dominance>
    Then <victim>'s response mode is <mode>

    Examples:
      | victim   | axis        | value | dominance | mode   |
      | mcginley | humiliation | +5    | -4        | FLIGHT |
      | mcginley | shame       | +4    | -4        | FREEZE |
      | mcginley | anger       | +4    | -4        | FIGHT  |
      | faldo    | anger       | +5    | +5        | FIGHT  |
      | faldo    | humiliation | +5    | +5        | FIGHT  |
      | cox      | anxiety     | +5    | +3        | FREEZE |
      | wayne    | anger       | +5    | -2        | FIGHT  |
      | wayne    | shame       | +4    | -2        | FLIGHT |

  Scenario: FIGHT response — victim shouts back and may trigger counter-wolfpack
    Given mcginley's response mode is FIGHT
    When mcginley's turn fires
    Then mcginley's turn contains explicit verbal abuse toward ringleader
    And mcginley's anger spikes by +2
    And a counter-wolfpack initiation roll fires for mcginley's allies
    And each ally above hostility threshold toward ringleader rolls to join

  Scenario: Counter-wolfpack ally join probability weighted by ally hostility toward ringleader
    Given mcginley has triggered counter-wolfpack initiation
    And wayne's affect toward faldo is -1
    And wayne's warmth toward mcginley is +3
    Then wayne's counter_join_probability is 0.55
    And if wayne joins mcginley's pressure decrements by 1
    And faldo's pressure increments by 1

  Scenario: FLIGHT response — victim attempts STORM_OFF
    Given mcginley's response mode is FLIGHT
    When mcginley's turn fires
    Then a STORM_OFF roll fires for mcginley
    And if STORM_OFF clears mcginley exits the panel permanently
    And if STORM_OFF does not clear mcginley attempts verbal retreat instead

  Scenario: FREEZE response — victim goes silent and pressure feeds fuse
    Given mcginley's response mode is FREEZE
    When mcginley's turn fires
    Then mcginley produces no verbal output
    And the panel output marks mcginley as visibly frozen
    And mcginley's pressure increments by 1
    And mcginley's fume_turns counter increments by 1
    And other characters may reference or exploit the silence

  # ── STORM_OFF — permanent exit ────────────────────────────────────────────────

  Scenario Outline: STORM_OFF fires from eruptionResponse or FLIGHT response
    Given <character>'s dominant condition is <condition>
    Then STORM_OFF is available via <source>

    Examples:
      | character | condition                              | source                        |
      | mcginley  | pressure 6 AND humiliation +5          | eruptionResponse() register   |
      | mcginley  | FLIGHT response during wolfpack        | fight/flight/freeze           |
      | faldo     | pressure 6 AND inversion condition met | eruptionResponse() inversion  |
      | wayne     | FLIGHT response after FIGHT fails      | fight/flight/freeze           |
      | cox       | pressure 6 AND inversion condition met | eruptionResponse() inversion  |

  Scenario: STORM_OFF exit is permanent — character does not return in current panel
    Given mcginley has fired STORM_OFF
    Then mcginley is removed from the active cast immediately
    And the panel continues with remaining cast
    And mcginley's emotional state is preserved in the round snapshot
    And mcginley's state is the cold start for the next panel session

  Scenario: Panel continues gracefully with reduced cast after STORM_OFF
    Given mcginley has exited via STORM_OFF
    And the remaining cast is ["faldo", "cox", "wayne"]
    Then speaker rotation continues with remaining cast only
    And no turn is generated for mcginley
    And relationship matrix entries for mcginley are preserved but inactive
    And the panel does not error on missing mcginley turns

  Scenario Outline: Remaining cast reaction to STORM_OFF depends on relationship
    Given mcginley has exited via STORM_OFF
    And <character>'s warmth toward mcginley is <warmth>
    Then <character>'s immediate reaction is <reaction>

    Examples:
      | character | warmth | reaction                                      |
      | wayne     | +3     | distressed — joy drops, anxiety spikes        |
      | faldo     | -3     | satisfied — affect toward mcginley increments |
      | cox       | 0      | notes the absence cosmically, continues       |

  Scenario: STORM_OFF character arrives at next panel carrying exit state
    Given mcginley exited via STORM_OFF with pressure 6 and humiliation +5
    When the next panel session initialises
    Then mcginley's cold start pressure is 6
    And mcginley's cold start humiliation is +5
    And mcginley's structural axes are unchanged from exit state
    And mcginley does not reset to domain model cold start values

  # ── Behaviour trigger table ───────────────────────────────────────────────────

  Scenario Outline: Each behaviour trigger has defined threshold conditions
    Given the behaviour trigger table is loaded
    Then <behaviour> fires when <condition>

    Examples:
      | behaviour     | condition                                                              |
      | INTERRUPT     | pressure >= 4 AND interrupt roll clears                                |
      | SILENCE       | pressure >= 4 AND dominance toward current speaker <= -2               |
      | WOLFPACK_LEAD | affect toward target <= -3 AND pressure >= 4                           |
      | WOLFPACK_JOIN | affect toward target <= -2 AND join roll clears weighted probability    |
      | STORM_OFF     | eruptionResponse STORM_OFF register OR FLIGHT response clears          |
      | SHUT_UP       | interrupt loop active AND shut_up_probability clears patience threshold |
      | FREEZE        | shame >= +4 OR anxiety >= +4 AND dominance toward attacker <= 0        |
      | FIGHT         | anger >= +4 AND dominance toward attacker >= 0                         |
