# specs/souness-cat-relationships.feature
# PRE_EXISTING relationship seeds for RelationshipState.init()
# These are starting conditions only — state evolves during discussion

Feature: Souness's Cat — Pre-existing Relationship Seeds

  Background:
    Given the Souness's Cat panel is loaded
    And RelationshipState is initialised with PRE_EXISTING before the first turn

  Scenario: All character pairs have a defined relationship seed
    Then every pair combination across the six scientists has an entry in PRE_EXISTING
    And no pair is missing a tone and a note

  Scenario: Relationship state evolution
    Given PRE_EXISTING seeds are loaded
    When characters interact during a discussion
    Then RelationshipState may diverge from the seed tone by discussion end
    And the seed tone is never overwritten — only the live state updates

  Scenario: Seeds are re-applied at the start of each new discussion
    Given a previous discussion has completed
    And RelationshipState has evolved from its seeds
    When the user submits a new topic
    Then RelationshipState is reinitialised from PRE_EXISTING before the first turn

  Scenario: Tesla has no warmth or solidarity seeds with any character
    Then no PRE_EXISTING entry involving tesla has tone warmth
    And no PRE_EXISTING entry involving tesla has tone solidarity
    And no PRE_EXISTING entry involving tesla has tone kinship

  Scenario: Hawking-Turing attraction is mutual and symmetrical
    Then the relationship between hawking and turing has tone attraction
    And the relationship between turing and hawking has tone attraction

  Scenario: Franklin enters every discussion with at least one contempt seed active
    Then the relationship between franklin and darwin has tone contempt
    And no other franklin seed neutralises or overrides the contempt direction

  Scenario Outline: Each relationship seed has the correct tone
    Then the relationship between <character-a> and <character-b> has tone <tone>

    Examples:
      | character-a | character-b | tone        |
      | feynman     | hawking     | rivalry     |
      | feynman     | franklin    | respect     |
      | feynman     | turing      | kinship     |
      | feynman     | darwin      | warmth      |
      | franklin    | turing      | solidarity  |
      | franklin    | darwin      | contempt    |
      | franklin    | tesla       | irritation  |
      | franklin    | hawking     | neutral     |
      | darwin      | hawking     | kinship     |
      | darwin      | turing      | empathy     |
      | darwin      | tesla       | unease      |
      | hawking     | turing      | attraction  |
      | hawking     | tesla       | cool        |
      | tesla       | feynman     | friction    |
      | tesla       | turing      | isolation   |

  Scenario: Relationship seeds are directionally consistent
    Then no pair has conflicting tones defined in opposite directions
    And tesla-darwin and darwin-tesla resolve to the same seed
