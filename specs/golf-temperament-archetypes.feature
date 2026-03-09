Feature: Temperament profile archetype mechanics (TemperamentService.applyHoleResult)
  Each temperamentProfile defines how composure changes per hole result.
  applyHoleResult(profile, diff, streak, ego) → { composureDelta, newStreak }
  diff: negative=eagle/birdie, 0=par, positive=bogey/double/disaster
  streak: current run — positive=consecutive birdies, negative=consecutive bogeys

  Background:
    Given the TemperamentService module is loaded

  # ── ICEBERG — only extremes move composure; streak tracked but not amplified ──

  Scenario Outline: ICEBERG responds only to eagle or double-bogey-plus
    When applyHoleResult is called with profile "ICEBERG" diff <diff> streak <streak> ego 5
    Then the temperament composureDelta is <delta>
    And the temperament newStreak is <newStreak>

    Examples:
      | diff | streak | delta | newStreak |
      | -2   | 0      | 1     | 1         |
      | -1   | 0      | 0     | 1         |
      | -1   | 3      | 0     | 4         |
      | 0    | 0      | 0     | 0         |
      | 1    | 0      | 0     | -1        |
      | 1    | 3      | 0     | -1        |
      | 2    | 0      | -1    | -1        |

  # ── STREAKY — runs compound; EGO≥7 adds +1 on positive runs ───────────────────

  Scenario Outline: STREAKY composure compounds on consecutive same-direction holes
    When applyHoleResult is called with profile "STREAKY" diff <diff> streak <streak> ego <ego>
    Then the temperament composureDelta is <delta>
    And the temperament newStreak is <newStreak>

    Examples:
      | diff | streak | ego | delta | newStreak |
      | -1   | 0      | 5   | 1     | 1         |
      | -1   | 1      | 5   | 2     | 2         |
      | -1   | 2      | 5   | 3     | 3         |
      | -1   | 3      | 5   | 3     | 4         |
      | -1   | 1      | 8   | 3     | 2         |
      | 0    | 2      | 5   | 0     | 0         |
      | 1    | 0      | 5   | -1    | -1        |
      | 1    | -1     | 5   | -2    | -2        |

  # ── LEVELHEADED — dampened swings; bogey and worse all cost -1 ────────────────

  Scenario Outline: LEVELHEADED applies dampened fixed composure change
    When applyHoleResult is called with profile "LEVELHEADED" diff <diff> streak <streak> ego 5
    Then the temperament composureDelta is <delta>

    Examples:
      | diff | streak | delta |
      | -2   | 0      | 1     |
      | -1   | 0      | 0     |
      | -1   | 4      | 0     |
      | 0    | 0      | 0     |
      | 1    | 0      | -1    |
      | 2    | 0      | -1    |
      | 3    | 0      | -1    |

  # ── PEAKER — high highs, hard lows; no streak amplification ──────────────────

  Scenario Outline: PEAKER has outsized composure swings but streak does not amplify
    When applyHoleResult is called with profile "PEAKER" diff <diff> streak <streak> ego 5
    Then the temperament composureDelta is <delta>

    Examples:
      | diff | streak | delta |
      | -2   | 0      | 2     |
      | -1   | 0      | 1     |
      | -1   | 3      | 1     |
      | 0    | 0      | 0     |
      | 1    | 0      | -2    |
      | 2    | 0      | -3    |
      | 3    | 0      | -4    |

  # ── DEFENSIVE — single bogey is shrugged off; only doubles and worse hurt ─────

  Scenario Outline: DEFENSIVE resists single bogeys; composure gains are minimal
    When applyHoleResult is called with profile "DEFENSIVE" diff <diff> streak <streak> ego 5
    Then the temperament composureDelta is <delta>

    Examples:
      | diff | streak | delta |
      | -2   | 0      | 1     |
      | -1   | 0      | 0     |
      | 0    | 0      | 0     |
      | 1    | 0      | 0     |
      | 1    | -2     | 0     |
      | 2    | 0      | -1    |
      | 3    | 0      | -1    |

  # ── COMBUSTIBLE — extreme both ways; EGO amplifies up and down ───────────────

  Scenario Outline: COMBUSTIBLE produces extreme composure swings amplified by EGO
    When applyHoleResult is called with profile "COMBUSTIBLE" diff <diff> streak <streak> ego <ego>
    Then the temperament composureDelta is <delta>

    Examples:
      | diff | streak | ego | delta |
      | -2   | 0      | 5   | 3     |
      | -2   | 0      | 8   | 4     |
      | -1   | 0      | 5   | 1     |
      | 0    | 0      | 5   | 0     |
      | 1    | 0      | 5   | -2    |
      | 1    | 0      | 2   | -3    |
      | 2    | 0      | 5   | -4    |
      | 3    | 0      | 5   | -4    |

  # ── Streak direction reset ────────────────────────────────────────────────────

  Scenario Outline: Streak resets to opposite sign when hole direction changes
    When applyHoleResult is called with profile "STREAKY" diff <diff> streak <streak> ego 5
    Then the temperament newStreak is <newStreak>

    Examples:
      | diff | streak | newStreak |
      | -1   | -2     | 1         |
      | 1    | 3      | -1        |
      | 0    | 3      | 0         |
      | 0    | -3     | 0         |

  # ── Unknown profile falls back to zero delta ──────────────────────────────────

  Scenario: Unknown profile returns zero composure delta
    When applyHoleResult is called with profile "UNKNOWN" diff -1 streak 0 ego 5
    Then the temperament composureDelta is 0
