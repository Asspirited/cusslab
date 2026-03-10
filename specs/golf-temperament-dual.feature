Feature: Dual temperament profiles (TemperamentService.applyHoleResultDual)
  Each player has a primary and secondary temperamentProfile.
  composureDelta = primaryDelta + Math.trunc(secondaryDelta / 2)
  Truncation toward zero: secondary delta of ±1 contributes 0 — "some of the properties."
  newStreak is determined by the hole outcome — identical regardless of secondary profile.
  applyHoleResultDual(primary, secondary, diff, streak, ego) → { composureDelta, newStreak }

  Background:
    Given the TemperamentService module is loaded

  # ── Core mechanic ────────────────────────────────────────────────────────────

  Scenario Outline: Combined delta is primary plus half secondary truncated toward zero
    When applyHoleResultDual is called with primary "<primary>" secondary "<secondary>" diff <diff> streak <streak> ego <ego>
    Then the temperament composureDelta is <delta>
    And the temperament newStreak is <newStreak>

    Examples:
      | primary     | secondary   | diff | streak | ego | delta | newStreak |
      | COMBUSTIBLE | COMBUSTIBLE | -2   | 0      | 5   | 4     | 1         |
      | COMBUSTIBLE | COMBUSTIBLE | 2    | 0      | 5   | -6    | -1        |
      | STREAKY     | STREAKY     | -1   | 2      | 5   | 4     | 3         |
      | PEAKER      | PEAKER      | -2   | 0      | 5   | 3     | 1         |

  # ── Amplifying pairs — secondary exaggerates the primary response ─────────────

  Scenario Outline: An amplifying secondary produces a larger swing than primary alone
    When applyHoleResultDual is called with primary "<primary>" secondary "<secondary>" diff <diff> streak <streak> ego <ego>
    Then the temperament composureDelta is <delta>

    Examples:
      | primary     | secondary   | diff | streak | ego | delta |
      | COMBUSTIBLE | PEAKER      | -2   | 0      | 5   | 4     |
      | PEAKER      | COMBUSTIBLE | -2   | 0      | 5   | 3     |

  # ── Dampening pairs — secondary does not compound the primary ────────────────

  Scenario Outline: A dampening secondary holds the combined delta at primary-only level
    When applyHoleResultDual is called with primary "<primary>" secondary "<secondary>" diff <diff> streak <streak> ego <ego>
    Then the temperament composureDelta is <delta>

    Examples:
      | primary     | secondary   | diff | streak | ego | delta |
      | COMBUSTIBLE | LEVELHEADED | 1    | 0      | 5   | -2    |
      | COMBUSTIBLE | DEFENSIVE   | 2    | 0      | 5   | -4    |
      | STREAKY     | DEFENSIVE   | 1    | -2     | 5   | -3    |

  # ── Zero secondary contribution ──────────────────────────────────────────────

  Scenario Outline: When secondary does not react to the hole result the combined equals primary alone
    When applyHoleResultDual is called with primary "<primary>" secondary "<secondary>" diff <diff> streak <streak> ego <ego>
    Then the temperament composureDelta is <delta>

    Examples:
      | primary | secondary | diff | streak | ego | delta |
      | PEAKER  | ICEBERG   | -1   | 0      | 5   | 1     |
      | STREAKY | ICEBERG   | -1   | 2      | 5   | 3     |

  # ── newStreak independent of secondary ───────────────────────────────────────

  Scenario Outline: newStreak is the hole outcome and does not vary by secondary profile
    When applyHoleResultDual is called with primary "<primary>" secondary "<secondary>" diff <diff> streak <streak> ego 5
    Then the temperament newStreak is <newStreak>

    Examples:
      | primary     | secondary   | diff | streak | newStreak |
      | COMBUSTIBLE | LEVELHEADED | -1   | 3      | 4         |
      | STREAKY     | ICEBERG     | 1    | -2     | -3        |
      | PEAKER      | DEFENSIVE   | 0    | 2      | 0         |
