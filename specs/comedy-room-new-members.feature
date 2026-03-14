Feature: Comedy Room — Chappelle, Pryor, Louis CK (BL-133/134/135)
  The Comedy Room gains three new members so the panel has
  American stand-up voices alongside the existing ensemble.

  Scenario Outline: New Comedy Room member is present in the MEMBERS array
    Then the comedy room has a member with id "<id>"

    Examples:
      | id        |
      | chappelle |
      | pryor     |
      | louisk    |

  Scenario Outline: New Comedy Room member has required fields
    Then the comedy room member "<id>" has a name
    And the comedy room member "<id>" has a prompt
    And the comedy room member "<id>" has an icon
    And the comedy room member "<id>" has a colour

    Examples:
      | id        |
      | chappelle |
      | pryor     |
      | louisk    |
