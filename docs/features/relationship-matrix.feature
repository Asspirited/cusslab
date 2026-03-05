# features/relationship-matrix.feature
# Slice 1 of 4: Static relationship matrix — cold start weights per character pair
# Axes: warmth (-5 to +5), dominance (-5 to +5), affect (-5 to +5)
# These are caricature baselines, not psychological simulations.
# High values = comic exaggeration. Drift happens in Slice 2.

Feature: Relationship matrix — static starting weights

  The panel loads a relationship matrix at conversation start.
  Each character pair has three axes: warmth, dominance, affect.
  Values are intentionally exaggerated caricatures.
  The matrix is directional — A→B is not necessarily the same as B→A.
  All values are integers in the range -5 to +5.

  Background:
    Given the relationship matrix is loaded from the domain model
    And the panel has not yet started

  # ── Schema validation ────────────────────────────────────────────────────────

  Scenario: Matrix contains a directional entry for every character pair
    Given the panel cast is ["faldo", "mcginley", "cox", "wayne"]
    Then the matrix contains a directional entry for every ordered pair
    And no entry is missing any of the axes "warmth", "dominance", "affect"

  Scenario: All axis values are integers within the valid range
    Given the relationship matrix is loaded
    Then every axis value is an integer
    And every axis value is between -5 and +5 inclusive

  Scenario: Directional entries are not assumed to be symmetric
    Given the matrix entry faldo→mcginley has warmth -3
    Then the matrix entry mcginley→faldo may have a different warmth value
    And the system does not mirror or average directional values

  # ── Baseline caricature weights ───────────────────────────────────────────────

  Scenario Outline: Each character pair has canonical starting weights
    Given the matrix entry <source>→<target>
    Then warmth is <warmth>
    And dominance is <dominance>
    And affect is <affect>

    Examples:
      | source   | target          | warmth | dominance | affect | note                                             |
      | faldo    | mcginley        | -3     | +5        | -2     | cold dominance, active contempt                  |
      | mcginley | faldo           | +2     | -4        | -3     | performed warmth, actual misery                  |
      | faldo    | cox             | -1     | +2        | -1     | mild irritation, doesn't understand him          |
      | cox      | faldo           | 0      | +3        | 0      | cosmic indifference                              |
      | cox      | mcginley        | 0      | +3        | 0      | cosmic indifference                              |
      | cox      | wayne           | 0      | +3        | 0      | cosmic indifference                              |
      | wayne    | bush_tucker_man | +5     | -5        | +5     | maximum everything, character wound              |
      | wayne    | faldo           | +3     | -2        | +3     | genuinely likes him, no reason                   |
      | wayne    | mcginley        | +2     | -1        | +2     | warm, mildly baffled                             |
      | wayne    | cox             | +1     | -3        | +1     | doesn't follow a word, finds it exciting         |
      | mcginley | wayne           | +3     | +1        | +2     | genuine warmth, rare for McGinley                |
      | faldo    | wayne           | -1     | +4        | -1     | tolerates him, slightly appalled                 |

  # ── Self-regard ───────────────────────────────────────────────────────────────

  Scenario Outline: Each character has a self-entry reflecting their self-regard
    Given the matrix entry <character>→<character>
    Then warmth is <warmth>
    And dominance is <dominance>
    And affect is <affect>

    Examples:
      | character | warmth | dominance | affect | note                                             |
      | faldo     | 0      | 0         | 0      | neutral self-regard                              |
      | mcginley  | 0      | 0         | 0      | neutral self-regard                              |
      | cox       | +3     | +1        | +2     | performed warmth, latent dominance, self-delight |
      | wayne     | 0      | 0         | 0      | neutral self-regard                              |

  # ── Matrix loading ────────────────────────────────────────────────────────────

  Scenario: Matrix loads cleanly at panel initialisation
    When the panel initialises
    Then the relationship matrix is available in memory before the first turn
    And no API call is made to load the matrix

  Scenario Outline: Missing or invalid matrix entries throw hard errors
    Given the matrix entry <source>→<target> has <problem>
    When the panel attempts to initialise
    Then initialisation fails with error "<error>"
    And no turns are generated

    Examples:
      | source   | target   | problem               | error                                                  |
      | faldo    | mcginley | entry absent          | Missing relationship matrix entry: faldo→mcginley      |
      | wayne    | cox      | affect value of 6     | Axis value out of range: wayne→cox.affect = 6          |
      | faldo    | cox      | warmth value of -6    | Axis value out of range: faldo→cox.warmth = -6         |
      | mcginley | wayne    | dominance non-integer | Axis value non-integer: mcginley→wayne.dominance = 2.5 |

  # ── Cast flexibility ──────────────────────────────────────────────────────────

  Scenario Outline: Partial cast only requires matrix entries for present characters
    Given the panel cast is <cast>
    Then the matrix requires exactly the entries for all ordered pairs within <cast>
    And absent entries for characters outside <cast> do not cause errors

    Examples:
      | cast                          | note                                                     |
      | ["faldo", "cox"]              |                                                          |
      | ["mcginley", "wayne"]         |                                                          |
      | ["faldo", "mcginley", "cox"]  |                                                          |
      | ["wayne"]                     | BTM referenced-only — no outward matrix entries required |
