Feature: Darts panel voice format — callable formatters
  As the panel orchestrator
  I want each darts character's VOICE_FMT entry to be a callable formatter function
  So that RelationshipState.buildBlock can inject YOUR STATE blocks without throwing

  Scenario Outline: DARTS_VOICE_FMT entry for <id> is a callable formatter function
    Given the darts panel voice format map is loaded
    When the entry for "<id>" is retrieved
    Then the entry is a function
    And calling it with a non-neutral state returns a non-empty string

    Examples:
      | id      |
      | mardle  |
      | bristow |
      | taylor  |
      | lowe    |
      | george  |
      | waddell |
      | part    |

  Scenario: dartsBuildBlock does not throw when darts character has non-neutral state
    Given the darts panel voice format map is loaded
    And a non-neutral state with temperature "cooling" is constructed for "waddell"
    When dartsBuildBlock is called for "waddell" with that state
    Then no TypeError is thrown
    And the result is a non-empty string
