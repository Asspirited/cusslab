Feature: TBT weekly cycle

  Scenario: Player chooses to visit Nan
    Given it is a free evening
    When the player expresses intent to visit Nan
    Then the Nan relationship dial stays green
    And the turn summary notes the visit
    And time advances

  Scenario: Player chooses nets
    Given it is a free evening
    When the player expresses intent to go to nets
    Then NETS costs physique and gains sharpness
    And the turn summary notes the practice

  Scenario: Player chooses work
    Given it is a free evening
    When the player expresses intent to work
    Then bank increases by the weekly wage amount
    And the turn summary notes the earnings

  Scenario: FORM word reflects numeric value
    Given FORM is at value 15
    Then the form word is Decent
    Given FORM is at value 5
    Then the form word is Nowhere
    Given FORM is at value 19
    Then the form word is Flying
