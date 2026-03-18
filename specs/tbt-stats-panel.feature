Feature: TBT stats panel

  Scenario: Panel renders on game start
    Given character creation is complete
    Then the stats panel shows name, age, month and year
    And bank balance shows as specific pounds and pence
    And nan and mum show green dials
    And grandfather shows greyed with no RAG colour
    And cricket headers show with dashes
    And football headers show with dashes

  Scenario: Turn summary includes Maslow basics
    Given a turn has completed
    Then the turn summary includes a Nan dial line
    And the turn summary includes a form word line
    And the turn summary includes the bank balance
