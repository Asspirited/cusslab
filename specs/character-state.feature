Feature: Character State — intensity, decay, spike, event log, YOUR STATE block

  Background:
    Given the application is loaded

  Scenario Outline: Intensity initialises at baseline on cold start
    Given a character with peak intensity <peak>
    When the character state is initialised
    Then their current intensity is <baseline>

    Examples:
      | peak | baseline |
      | 5    | 1        |
      | 10   | 2        |
      | 3    | 1        |

  Scenario Outline: Baseline is always 20% of peak rounded down
    Given a character with peak intensity <peak>
    Then their baseline intensity is <baseline>

    Examples:
      | peak | baseline |
      | 5    | 1        |
      | 10   | 2        |
      | 7    | 1        |
      | 20   | 4        |

  Scenario Outline: Linguistic trigger fires — intensity increments by 1
    Given a character with current intensity <before> and peak intensity <peak>
    When a linguistic trigger fires for that character
    Then their current intensity is <after>

    Examples:
      | before | peak | after |
      | 2      | 5    | 3     |
      | 1      | 5    | 2     |
      | 4      | 10   | 5     |

  Scenario Outline: Intensity cannot exceed peak
    Given a character with current intensity <peak> and peak intensity <peak>
    When a linguistic trigger fires for that character
    Then their current intensity is <peak>

    Examples:
      | peak |
      | 5    |
      | 10   |
      | 3    |

  Scenario Outline: Round passes with no trigger — intensity decrements by 1
    Given a character with current intensity <before> and peak intensity <peak>
    When a round passes with no trigger for that character
    Then their current intensity is <after>

    Examples:
      | before | peak | after |
      | 3      | 5    | 2     |
      | 4      | 10   | 3     |
      | 2      | 5    | 1     |

  Scenario Outline: Intensity cannot go below baseline
    Given a character with current intensity <baseline> and peak intensity <peak>
    When a round passes with no trigger for that character
    Then their current intensity is <baseline>

    Examples:
      | peak | baseline |
      | 5    | 1        |
      | 10   | 2        |
      | 3    | 1        |

  Scenario Outline: Event log records state transitions
    Given a character with current intensity <before> and peak intensity 5
    When <event> occurs for that character
    Then the event log contains an entry with type "<type>" and intensity change <before>→<after>

    Examples:
      | before | event                          | type                     | after |
      | 2      | a linguistic trigger fires     | linguistic_trigger_fired | 3     |
      | 3      | a round passes with no trigger | intensity_decayed        | 2     |

  Scenario: YOUR STATE block contains intensity values
    Given a character with current intensity 3, peak intensity 5, and baseline intensity 1
    When the YOUR STATE block is built for that character
    Then the block contains "Intensity: 3/5 (baseline: 1)"

  Scenario: YOUR STATE block contains recent events
    Given a character with current intensity 3 and peak intensity 5
    And the event log has an entry "intensity_decayed (4→3)"
    When the YOUR STATE block is built for that character
    Then the block contains "intensity_decayed (4→3)"

  Scenario Outline: CharacterState is independent per character
    Given two characters each with current intensity <start> and peak intensity <peak>
    When a linguistic trigger fires for the first character only
    Then the first character's current intensity is <after>
    And the second character's current intensity is <start>

    Examples:
      | start | peak | after |
      | 2     | 5    | 3     |
      | 1     | 10   | 2     |
