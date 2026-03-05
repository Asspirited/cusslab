# specs/round-state-persistence.feature
# Slice 3 of 5: Round state persistence — snapshot, reload, axis behaviours
# Snapshot fires at explicit round end before next round opens
# Structural axes persist as-is
# Pressure fuse persists as-is — no decay ever
# Performance axes: DECAY / ESCALATE / DRIFT — per axis per character
# ESCALATE at +5 clamp feeds pressure fuse +1 per turn held

Feature: Round state persistence — snapshot and reload

  Emotional state snapshots at round end.
  The snapshot is the cold start for the next round.
  Structural axes and pressure persist unchanged.
  Performance axes behaviour is per-axis per-character: DECAY, ESCALATE, or DRIFT.
  An ESCALATE axis clamped at +5 feeds pressure +1 per turn it stays there.
  Snapshot fires at explicit round close — not lazily at next round's first turn.

  Background:
    Given the relationship matrix is loaded from the domain model
    And the performance axis behaviour table is loaded from the domain model
    And the panel has started with cast ["faldo", "mcginley", "cox", "wayne"]

  # ── Snapshot timing ───────────────────────────────────────────────────────────

  Scenario: Snapshot fires at explicit round close not at next round open
    Given round 1 has completed all turns
    When the round loop closes
    Then a state snapshot is taken immediately
    And the snapshot is available before round 2's first turn is built
    And no turn in round 2 is built before the snapshot exists

  Scenario: Snapshot contains all emotional state for all characters
    Given round 1 has completed
    When the snapshot fires
    Then the snapshot contains structural axes for every character pair
    And the snapshot contains pressure for every character
    And the snapshot contains all performance axes for every character
    And the snapshot contains fume_turns state for any character in fume_turns

  Scenario: Round 2 loads snapshot as its baseline not the original cold start
    Given a snapshot exists from round 1
    When round 2 initialises
    Then round 2 baseline is the round 1 snapshot
    And the original domain model cold start values are not used for round 2

  # ── Structural axis persistence ───────────────────────────────────────────────

  Scenario Outline: Structural axes persist unchanged across round boundary
    Given <character_a>'s <axis> toward <character_b> is <value> at round end
    When the round boundary snapshot fires
    Then <character_a>'s <axis> toward <character_b> in round 2 is <value>

    Examples:
      | character_a | character_b | axis      | value |
      | faldo       | mcginley    | warmth    | -4    |
      | mcginley    | faldo       | affect    | -4    |
      | wayne       | cox         | dominance | -3    |
      | cox         | faldo       | warmth    | 0     |

  # ── Pressure fuse persistence ─────────────────────────────────────────────────

  Scenario Outline: Pressure persists unchanged across round boundary
    Given <character>'s pressure is <value> at round end
    When the round boundary snapshot fires
    Then <character>'s pressure in round 2 is <value>
    And the pressure state is <state>

    Examples:
      | character | value | state                            |
      | mcginley  | 5     | on the verge of blowing a gasket |
      | faldo     | 3     | antagonised                      |
      | wayne     | 6     | gasket blown                     |
      | cox       | 0     | neutral                          |

  Scenario: Character in fume_turns at round end continues fuming in round 2
    Given mcginley is in fume_turns state with 2 turns remaining at round end
    When the round boundary snapshot fires
    Then mcginley enters round 2 still in fume_turns state with 2 turns remaining
    And mcginley's first turn in round 2 expresses visible suppression

  # ── Performance axis DECAY behaviour ─────────────────────────────────────────

  Scenario Outline: DECAY axis halves each turn within a round
    Given <character>'s <axis> behaviour is DECAY
    And <character>'s <axis> is <start> at turn start
    When 1 turn passes
    Then <character>'s <axis> is <after_one_turn>

    Examples:
      | character | axis     | start | after_one_turn |
      | faldo     | contempt | +4    | +2             |
      | faldo     | contempt | +3    | +1             |
      | cox       | contempt | +4    | +2             |
      | wayne     | anger    | +5    | +2             |

  Scenario Outline: DECAY axis takes an extra halving step at round boundary
    Given <character>'s <axis> behaviour is DECAY
    And <character>'s <axis> is <value> at round end
    When the round boundary snapshot fires
    Then <character>'s <axis> in round 2 is <after_boundary>

    Examples:
      | character | axis     | value | after_boundary |
      | faldo     | contempt | +4    | +2             |
      | faldo     | contempt | +2    | +1             |
      | faldo     | contempt | +1    | 0              |
      | cox       | contempt | +3    | +1             |

  # ── Performance axis ESCALATE behaviour ──────────────────────────────────────

  Scenario Outline: ESCALATE axis grows by increment each turn within a round
    Given <character>'s <axis> behaviour is ESCALATE with increment <increment>
    And <character>'s <axis> is <start> at turn start
    When 1 turn passes without the axis being actively modified by a trigger token
    Then <character>'s <axis> is <after_one_turn>

    Examples:
      | character | axis        | increment | start | after_one_turn |
      | mcginley  | humiliation | +1        | +2    | +3             |
      | mcginley  | humiliation | +1        | +4    | +5             |
      | mcginley  | shame       | +1        | +1    | +2             |
      | faldo     | humiliation | +1        | +3    | +4             |
      | cox       | anxiety     | +1        | +2    | +3             |

  Scenario Outline: ESCALATE axis holds end-of-round value across round boundary
    Given <character>'s <axis> behaviour is ESCALATE
    And <character>'s <axis> is <value> at round end
    When the round boundary snapshot fires
    Then <character>'s <axis> in round 2 is <value>

    Examples:
      | character | axis        | value |
      | mcginley  | humiliation | +4    |
      | mcginley  | shame       | +3    |
      | cox       | anxiety     | +5    |
      | faldo     | humiliation | +2    |

  Scenario Outline: ESCALATE axis clamped at +5 feeds pressure fuse each turn
    Given <character>'s <axis> behaviour is ESCALATE
    And <character>'s <axis> is +5 and has been for <turns> turns
    Then <character>'s pressure has incremented by <turns>

    Examples:
      | character | axis        | turns |
      | mcginley  | humiliation | 1     |
      | mcginley  | humiliation | 3     |
      | cox       | anxiety     | 2     |
      | faldo     | humiliation | 1     |

  Scenario: ESCALATE axis feeding fuse can trigger gasket blown with no new token
    Given mcginley's humiliation is +5 and has been escalating for 3 turns
    And mcginley's pressure was 3 before the escalation began
    Then mcginley's pressure is now 6
    And mcginley enters fume_turns state
    And no trigger token fired during those 3 turns

  # ── Performance axis DRIFT behaviour ─────────────────────────────────────────

  Scenario Outline: DRIFT axis moves ±1 randomly each turn
    Given <character>'s <axis> behaviour is DRIFT
    And <character>'s <axis> is <start>
    When 1 turn passes
    Then <character>'s <axis> is one of <possible_values>
    And the result is clamped to -5 to +5

    Examples:
      | character | axis      | start | possible_values |
      | wayne     | eroticism | +3    | +2, +4          |
      | wayne     | eroticism | +5    | +4, +5          |
      | wayne     | eroticism | -5    | -5, -4          |
      | wayne     | eroticism | 0     | -1, +1          |

  Scenario: DRIFT axis takes one random step at round boundary
    Given wayne's eroticism behaviour is DRIFT
    And wayne's eroticism is +3 at round end
    When the round boundary snapshot fires
    Then wayne's eroticism in round 2 is one of +2 or +4
    And the result is clamped to -5 to +5

  Scenario: DRIFT axis movement is independent of trigger token state
    Given wayne's eroticism behaviour is DRIFT
    And no trigger token fired this turn
    When 1 turn passes
    Then wayne's eroticism still drifts by ±1

  # ── Performance axis behaviour table ─────────────────────────────────────────

  Scenario Outline: Each character axis has a defined behaviour loaded from domain model
    Given the performance axis behaviour table is loaded
    Then <character>'s <axis> behaviour is <behaviour>

    Examples:
      | character | axis        | behaviour |
      | faldo     | contempt    | DECAY     |
      | faldo     | humiliation | ESCALATE  |
      | mcginley  | humiliation | ESCALATE  |
      | mcginley  | shame       | ESCALATE  |
      | mcginley  | joy         | DECAY     |
      | cox       | contempt    | DECAY     |
      | cox       | anxiety     | ESCALATE  |
      | wayne     | eroticism   | DRIFT     |
      | wayne     | anger       | DECAY     |

  # ── Snapshot integrity ────────────────────────────────────────────────────────

  Scenario: Snapshot is immutable once written — round 2 cannot modify round 1 snapshot
    Given a round 1 snapshot exists
    When round 2 mutates mcginley's humiliation
    Then the round 1 snapshot value of mcginley's humiliation is unchanged
    And round 2 operates on its own mutable copy

  Scenario: Missing snapshot at round 2 open throws a hard error
    Given no round 1 snapshot exists
    When round 2 attempts to initialise
    Then initialisation fails with error "Missing round snapshot: round 1"
    And no turns are generated in round 2
