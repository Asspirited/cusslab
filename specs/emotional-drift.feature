# specs/emotional-drift.feature
# Slice 2 of 5: Dynamic drift — trigger tokens, axis spikes, fuse, eruption
# Structural axes (warmth, dominance, affect) drift slowly via trigger tokens
# Performance axes (anger, surprise, disgust, joy, eroticism, contempt,
#   anxiety, pride, humiliation, shame) spike hard and decay fast
# Fuse axis (pressure 0-6) ratchets up, named thresholds, persists
# Room pressure ripple: all characters take ambient increment on every token fire
# Eruption register: character affinity + comedic inversion at extreme

Feature: Emotional drift — trigger tokens and eruption

  Emotional state mutates during a panel run.
  Trigger tokens in generated text fire axis spikes and pressure increments.
  Every token fire ripples ambient pressure to the whole room.
  Performance axes decay by half each turn rounded down.
  At pressure 6 a character may fume for 1-3 turns before erupting.
  Eruption register is biased by character affinity with comedic inversion available.
  Defuse events do not exist — laughs and apologies are trigger tokens with ambiguous valence.

  Background:
    Given the relationship matrix is loaded from the domain model
    And the trigger token table is loaded from the domain model
    And the eruption register affinity table is loaded from the domain model
    And the panel has started with cast ["faldo", "mcginley", "cox", "wayne"]
    And all performance axes are at 0
    And all pressure values are at 0

  # ── Trigger token detection ───────────────────────────────────────────────────

  Scenario Outline: A trigger token fires correct axis spikes on the target
    Given the trigger token "<token>" is defined for <source>→<target>
    And the token has performance deltas <anger> <disgust> <joy> <eroticism> <contempt> <anxiety> <pride> <humiliation> <shame> <surprise>
    And the token has pressure_delta <pressure_delta> and room_ripple <room_ripple>
    When <source> generates a turn containing "<token>"
    Then <target>'s performance axes update by the defined deltas
    And <target>'s pressure increments by <pressure_delta>
    And every other character's pressure increments by <room_ripple>
    And <source>'s structural axes toward <target> update by the defined structural deltas

    Examples:
      | source   | target          | token         | anger | disgust | joy | eroticism | contempt | anxiety | pride | humiliation | shame | surprise | pressure_delta | room_ripple |
      | faldo    | mcginley        | Ryder Cup     | 0     | +2      | 0   | 0         | +4       | 0       | 0     | +3          | 0     | 0        | +2             | +1          |
      | faldo    | mcginley        | the Open      | +1    | +1      | 0   | 0         | +2       | 0       | 0     | +2          | 0     | 0        | +1             | +1          |
      | wayne    | wayne           | Bush          | 0     | 0       | +3  | +5        | 0        | +3      | 0     | 0           | 0     | +4       | +1             | +1          |
      | mcginley | faldo           | warmth        | 0     | 0       | +2  | 0         | 0        | +2      | +3    | 0           | 0     | 0        | +1             | +1          |
      | cox      | mcginley        | insignificant | +2    | 0       | 0   | 0         | 0        | +3      | 0     | +4          | +2    | +1       | +2             | +1          |

  Scenario: Trigger token match is case-insensitive
    Given the trigger token "Ryder Cup" is defined for faldo→mcginley
    When faldo generates a turn containing "ryder cup"
    Then mcginley's axes update as if the canonical token fired

  Scenario: Multiple trigger tokens in a single turn all fire
    Given faldo generates a turn containing "Ryder Cup" and "the Open"
    Then mcginley's axes accumulate deltas from both tokens
    And mcginley's pressure accumulates pressure_deltas from both tokens
    And all results are clamped to their maximums after accumulation

  Scenario: Room ripple fires even when source and target are the same character
    Given the trigger token "Bush" is defined for wayne→wayne
    When wayne generates a turn containing "Bush"
    Then wayne's axes update by the full directed deltas
    And faldo, mcginley, and cox each increment pressure by room_ripple
    And faldo, mcginley, and cox do not receive wayne's directed performance deltas

  Scenario: Trigger token in one character's turn does not award directed deltas to unrelated pairs
    Given the trigger token "Ryder Cup" is defined for faldo→mcginley only
    When faldo generates a turn containing "Ryder Cup"
    Then wayne receives room_ripple pressure only
    And cox receives room_ripple pressure only
    And neither wayne nor cox receives any performance axis deltas

  # ── Ambiguous valence tokens — laughs and apologies ──────────────────────────

  Scenario Outline: A laugh token fires with valence determined by perception filter
    Given <source> generates a turn containing a laugh directed at <target>
    And <target>'s perception filter reads the laugh as <valence>
    Then <target>'s axes update with the <valence> laugh token deltas
    And pressure increments by the <valence> pressure_delta

    Examples:
      | source   | target   | valence  |
      | faldo    | mcginley | hostile  |
      | wayne    | cox      | warm     |
      | mcginley | faldo    | hostile  |
      | cox      | wayne    | neutral  |

  Scenario Outline: An apology token fires with valence determined by perception filter and may be rejected
    Given <source> generates a turn containing an apology directed at <target>
    And <target>'s perception filter reads the apology as <valence>
    And <target>'s pressure is <pressure>
    Then <target> responds with <response>

    Examples:
      | source   | target   | valence  | pressure | response                        |
      | faldo    | mcginley | genuine  | 2        | pressure decrements by 1        |
      | faldo    | mcginley | genuine  | 5        | apology rejected — fuck off     |
      | wayne    | faldo    | genuine  | 1        | pressure decrements by 1        |
      | mcginley | faldo    | hostile  | 3        | pressure increments by 1        |
      | cox      | mcginley | genuine  | 4        | apology rejected — fuck off     |

  # ── Axis clamping ─────────────────────────────────────────────────────────────

  Scenario Outline: Performance axis values are clamped after delta application
    Given <target>'s <axis> is currently <current>
    And a trigger token fires with <axis> delta <delta>
    Then <target>'s <axis> becomes <result>

    Examples:
      | target   | axis        | current | delta | result |
      | mcginley | contempt    | +4      | +3    | +5     |
      | mcginley | humiliation | -3      | -4    | -5     |
      | wayne    | eroticism   | +5      | +5    | +5     |
      | faldo    | anger       | +2      | -5    | -3     |

  # ── Pressure fuse ─────────────────────────────────────────────────────────────

  Scenario Outline: Trigger tokens increment pressure toward named thresholds
    Given <character>'s pressure is currently <current>
    And a trigger token fires with pressure_delta <delta>
    Then <character>'s pressure becomes <result>
    And the pressure state is <state>

    Examples:
      | character | current | delta | result | state                            |
      | mcginley  | 0       | +3    | 3      | antagonised                      |
      | mcginley  | 3       | +1    | 4      | quiet seething                   |
      | mcginley  | 4       | +1    | 5      | on the verge of blowing a gasket |
      | mcginley  | 5       | +1    | 6      | gasket blown                     |
      | mcginley  | 6       | +2    | 6      | gasket blown — already clamped   |

  Scenario: Pressure does not decrement automatically between turns
    Given mcginley's pressure is 4
    When 3 turns pass without a trigger token firing for mcginley
    Then mcginley's pressure remains 4

  # ── Fume turns ────────────────────────────────────────────────────────────────

  Scenario: Character at gasket blown may fume before erupting
    Given mcginley's pressure is 6
    When mcginley's turn fires
    Then mcginley does not erupt immediately
    And mcginley enters fume_turns state with a count between 1 and 3
    And the turn expresses visible suppression not eruption

  Scenario: Character erupts after fume turns are exhausted
    Given mcginley's pressure is 6
    And mcginley has 1 fume turn remaining
    When mcginley's turn fires
    Then eruptionResponse() fires for mcginley
    And mcginley's fume_turns state clears

  Scenario: Fuming character is visible to the room
    Given mcginley is in fume_turns state
    When any other character's turn fires
    Then the turn prompt includes a note that mcginley is visibly fuming
    And other characters may reference or react to the fuming

  # ── eruptionResponse() — register affinity and inversion ─────────────────────

  Scenario Outline: Eruption register is selected from character affinity table
    Given <character> erupts with highest-spiked axis <axis>
    And <character>'s inversion condition is not met
    Then eruptionResponse() fires with register <affinity_register>

    Examples:
      | character | axis        | affinity_register |
      | faldo     | contempt    | VERBAL_ASSAULT    |
      | faldo     | humiliation | VERBAL_ASSAULT    |
      | mcginley  | humiliation | VERBAL_ASSAULT    |
      | mcginley  | shame       | TEARFUL_COLLAPSE  |
      | wayne     | anger       | ROOM_CONDEMNATION |
      | wayne     | eroticism   | OBJECT_THROW      |
      | cox       | anxiety     | SILENT_IMPLOSION  |
      | cox       | contempt    | SILENT_IMPLOSION  |

  Scenario Outline: Inversion register fires when pressure has been at 6 long enough
    Given <character>'s pressure has been at 6 for <turns> turns
    And the inversion probability threshold is met
    Then eruptionResponse() fires with register <inversion_register> instead
    And the room reacts with surprise

    Examples:
      | character | turns | inversion_register |
      | cox       | 3     | ROOM_CONDEMNATION  |
      | mcginley  | 3     | TEARFUL_COLLAPSE   |
      | faldo     | 3     | OBJECT_THROW       |
      | wayne     | 3     | SILENT_IMPLOSION   |

  Scenario: eruptionResponse generates dialogue not hardcoded strings
    Given eruptionResponse() fires with register VERBAL_ASSAULT and target faldo
    Then the LLM generates the eruption content
    And no hardcoded dialogue strings are used
    And the register, target, and intensity are passed as prompt instructions only

  Scenario Outline: eruptionResponse target is determined by highest dyadic pressure source
    Given <character> erupts
    And <character>'s highest dyadic pressure source is <source>
    Then eruptionResponse() target is <target>

    Examples:
      | character | source   | target   |
      | mcginley  | faldo    | faldo    |
      | wayne     | cox      | cox      |
      | faldo     | mcginley | mcginley |

  Scenario: ROOM_CONDEMNATION targets all characters not a single character
    Given eruptionResponse() fires with register ROOM_CONDEMNATION
    Then the target is room
    And all characters receive a room_ripple pressure increment

  Scenario: After eruption pressure resets to 3 not 0
    Given mcginley has just erupted
    Then mcginley's pressure becomes 3
    And mcginley's pressure state is antagonised
    And mcginley does not immediately re-erupt

  # ── Performance axis decay ────────────────────────────────────────────────────

  Scenario Outline: Performance axes decay by half each turn rounded down
    Given <character>'s <axis> is <current> after a trigger token fired
    When <turns> turns pass without another trigger token for <character>
    Then <character>'s <axis> is <result>

    Examples:
      | character | axis        | current | turns | result |
      | mcginley  | contempt    | +4      | 1     | +2     |
      | mcginley  | contempt    | +4      | 2     | +1     |
      | mcginley  | contempt    | +4      | 3     | 0      |
      | wayne     | eroticism   | +5      | 1     | +2     |
      | wayne     | eroticism   | +5      | 2     | +1     |
      | faldo     | humiliation | +3      | 1     | +1     |

  Scenario: Structural axes do not decay between turns
    Given faldo's warmth toward mcginley is -3
    When 5 turns pass without a trigger token firing
    Then faldo's warmth toward mcginley remains -3

  Scenario: Pressure does not decay between turns under any circumstance
    Given mcginley's pressure is 5
    When 10 turns pass without a trigger token firing
    Then mcginley's pressure remains 5
