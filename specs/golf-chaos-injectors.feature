Feature: Player-specific chaos injectors (ChaosInjectorService.apply)
  Per-player pure function that adds an additional composureDelta on top of
  the temperament archetype. apply(playerId, event) → additionalDelta
  event: { diff, streak, composure, isRyder }
  Returns 0 for players with no injector or when conditions are not met.

  Background:
    Given the ChaosInjectorService module is loaded

  # ── Poulter — Ryder Cup birdie run bonus ─────────────────────────────────

  Scenario Outline: Poulter gets extra composure on birdie runs in Ryder Cup
    When ChaosInjectorService is applied for player "poulter" with diff <diff> streak <streak> composure <comp> isRyder <ryder>
    Then the chaos additionalDelta is <delta>

    Examples:
      | diff | streak | comp | ryder | delta |
      | -1   | 2      | 5    | true  | 1     |
      | -1   | 3      | 5    | true  | 1     |
      | -1   | 1      | 5    | true  | 0     |
      | -1   | 2      | 5    | false | 0     |
      | 1    | 2      | 5    | true  | 0     |

  # ── Garcia — EGO spike/crash and low-composure birdie bonus ──────────────

  Scenario Outline: Garcia gets birdie bonus when composure is critically low
    When ChaosInjectorService is applied for player "garcia" with diff <diff> streak <streak> composure <comp> isRyder <ryder>
    Then the chaos additionalDelta is <delta>

    Examples:
      | diff | streak | comp | ryder | delta |
      | -1   | 0      | 3    | true  | 1     |
      | -1   | 0      | 4    | true  | 0     |
      | -1   | 0      | 3    | false | 1     |
      | 1    | 0      | 3    | true  | 0     |

  # ── Seve — recovery reflex: birdie when composure ≤ 3 gives double return ─

  Scenario Outline: Seve gets amplified birdie bonus at critically low composure
    When ChaosInjectorService is applied for player "seve_ballesteros" with diff <diff> streak <streak> composure <comp> isRyder <ryder>
    Then the chaos additionalDelta is <delta>

    Examples:
      | diff | streak | comp | ryder | delta |
      | -1   | 0      | 3    | true  | 1     |
      | -1   | 0      | 2    | true  | 1     |
      | -1   | 0      | 4    | true  | 0     |
      | 1    | 0      | 3    | true  | 0     |

  # ── Tiger — dominant run bonus ────────────────────────────────────────────

  Scenario Outline: Tiger gets additional composure when on a birdie run of 3 or more
    When ChaosInjectorService is applied for player "tiger_woods" with diff <diff> streak <streak> composure <comp> isRyder <ryder>
    Then the chaos additionalDelta is <delta>

    Examples:
      | diff | streak | comp | ryder | delta |
      | -1   | 3      | 5    | false | 1     |
      | -1   | 4      | 5    | false | 1     |
      | -1   | 2      | 5    | false | 0     |
      | 1    | 3      | 5    | false | 0     |

  # ── Montgomerie — Ryder Cup bogey amplification ───────────────────────────

  Scenario Outline: Montgomerie loses extra composure on bogey in Ryder Cup
    When ChaosInjectorService is applied for player "montgomerie" with diff <diff> streak <streak> composure <comp> isRyder <ryder>
    Then the chaos additionalDelta is <delta>

    Examples:
      | diff | streak | comp | ryder | delta |
      | 1    | 0      | 5    | true  | -1    |
      | 2    | 0      | 5    | true  | -1    |
      | 1    | 0      | 5    | false | 0     |
      | -1   | 0      | 5    | true  | 0     |

  # ── Unknown player returns zero ───────────────────────────────────────────

  Scenario: Unknown player ID returns zero additional delta
    When ChaosInjectorService is applied for player "unknown_player" with diff -1 streak 0 composure 5 isRyder false
    Then the chaos additionalDelta is 0
