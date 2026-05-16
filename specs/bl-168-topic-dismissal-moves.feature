Feature: Topic-dismissal moves — peers call out off-topic tangents (BL-168)
  As a panel architect
  I want a non-anchor character, when responding after another speaker
  drifted off the user's question, to lead with a flavoured dismissal —
  politely, coldly, or with full piss-take — depending on their current
  state toward the drifter, before returning to the actual question
  So that panels stop adopting one character's hobbyhorse and the real
  question keeps coming back into focus

  Background:
    Given the Golf panel Q&A section of index.html is loaded

  Scenario: The Golf non-anchor system prompt contains a TOPIC-DISMISSAL block
    Then the Golf non-anchor system prompt contains a "TOPIC-DISMISSAL" block

  Scenario: The block conditions dismissal on the previous speaker having drifted
    Then the Golf TOPIC-DISMISSAL block instructs the model to recognise when the previous speaker drifted from the user's question
    And the Golf TOPIC-DISMISSAL block instructs the model to apply a dismissal only when drift is recognised

  Scenario: The block requires returning to the user's question after the dismissal beat
    Then the Golf TOPIC-DISMISSAL block instructs the model to return to the user's original question after the dismissal
    And the Golf TOPIC-DISMISSAL block forbids extending the drifted topic past the dismissal beat

  Scenario: The block maps relationship temperature to dismissal flavour
    Then the Golf TOPIC-DISMISSAL block ties "warm" temperature to "polite-but-funny" flavour
    And the Golf TOPIC-DISMISSAL block ties "neutral" temperature to "cold dismissal" flavour
    And the Golf TOPIC-DISMISSAL block ties "hostile" temperature to "piss-take" flavour

  Scenario: The block includes a literal example for each flavour
    Then the Golf TOPIC-DISMISSAL block contains the polite-but-funny example "yeah, more luke warm ginsters Nick, great"
    And the Golf TOPIC-DISMISSAL block contains the cold-dismissal example "No not like Ginsters Nick"
    And the Golf TOPIC-DISMISSAL block contains the piss-take example "yeah, exactly, like a fucking warm ginsters Nick you stupid one-exampled idiot"

  Scenario: The block exempts tangent-prone characters from leading with a dismissal
    Then the Golf TOPIC-DISMISSAL block names tangent-prone characters whose responses do not lead with a dismissal
    And the Golf TOPIC-DISMISSAL block exemption list includes the character "Faldo"

  Scenario: The dismissal block is absent from anchor opener and closer prompts
    Then the Golf anchor opener prompt does not contain the TOPIC-DISMISSAL block
    And the Golf anchor closer prompt does not contain the TOPIC-DISMISSAL block
