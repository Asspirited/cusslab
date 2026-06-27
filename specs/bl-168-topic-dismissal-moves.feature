Feature: Topic-dismissal moves — peers call out off-topic tangents (BL-168 + BL-194)
  As a panel architect
  I want a non-anchor character, when responding after another speaker
  drifted off the user's question, to lead with a flavoured dismissal —
  politely, coldly, or with full piss-take — depending on their current
  state toward the drifter, before returning to the actual question
  So that panels stop adopting one character's hobbyhorse and the real
  question keeps coming back into focus
  BL-194 extends this to per-character dismissal pools — character-specific
  phrases rather than generic examples, with session-level anti-repeat tracking.

  Background:
    Given the Golf panel Q&A section of index.html is loaded

  Scenario: The Golf non-anchor system prompt contains a TOPIC-DISMISSAL block
    Then the Golf panel defines GOLF_DISMISSAL_POOLS with per-character entries
    And the engine buildDismissalBlock function produces a TOPIC-DISMISSAL block

  Scenario: The block conditions dismissal on the previous speaker having drifted
    Then the engine buildDismissalBlock instructs the model to recognise when the previous speaker drifted from the user's question
    And the engine buildDismissalBlock instructs the model to apply a dismissal only when drift is recognised

  Scenario: The block requires returning to the user's question after the dismissal beat
    Then the engine buildDismissalBlock instructs the model to return to the user's original question after the dismissal
    And the engine buildDismissalBlock forbids extending the drifted topic past the dismissal beat

  Scenario: The block maps relationship temperature to dismissal flavour
    Then the engine buildDismissalBlock ties "warm" temperature to "polite-but-funny" flavour
    And the engine buildDismissalBlock ties "neutral" temperature to "cold dismissal" flavour
    And the engine buildDismissalBlock ties "hostile" temperature to "piss-take" flavour

  Scenario: The Golf pools include per-character examples for each available flavour
    Then GOLF_DISMISSAL_POOLS includes polite-but-funny entries for "murray"
    And GOLF_DISMISSAL_POOLS includes cold-dismissal entries for "mcginley"
    And GOLF_DISMISSAL_POOLS includes piss-take entries for "radar"

  Scenario: The block exempts tangent-prone characters from leading with a dismissal
    Then GOLF_DISMISSAL_POOLS does not include an entry for "faldo"
    And GOLF_DISMISSAL_POOLS does not include an entry for "dougherty"

  Scenario: The dismissal block is absent from anchor opener and closer prompts
    Then the Golf anchor opener prompt does not contain the TOPIC-DISMISSAL block
    And the Golf anchor closer prompt does not contain the TOPIC-DISMISSAL block
