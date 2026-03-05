Feature: Quntum Leeks
  As Sam Beckett (the user)
  I want to leap into a situation and put right what once went wrong
  So that I can leap to the next situation

  Background:
    Given the Quntum Leeks panel is available in the app

  Scenario: Quntum Leeks tab appears in the PLAY nav group
    Given I am on the main page
    Then "Quntum Leeks" should be in the PLAY nav group

  Scenario: Quntum Leeks panel has a scenario selector and leap button
    Given the Quntum Leeks panel is loaded
    Then I can see the qleeks scenario selector
    And I can see the qleeks leap button

  Scenario: Original leap scenarios are present in the selector
    Given the Quntum Leeks panel is loaded
    Then the qleeks selector includes "The Milk Round — 1953, Rural Derbyshire"
    And the qleeks selector includes "The Advisory — 1974, Whitehall, London"
    And the qleeks selector includes "The Retrospective — Present Day, Agile Hell"

  Scenario: Leaping with an empty action shows a warning
    Given I have leapt into a scenario
    And the act input is empty
    When I click ACT
    Then a warning should be shown
    And no qleeks API call should be made

  @claude
  Scenario: First turn generates a mirror moment and Al briefing
    Given I have leapt into a scenario
    Then the thread contains a mirror moment in italics and brackets
    And the thread contains Al's opening briefing with a distraction
    And the thread contains Ziggy's first probability output
    And the mirror moment ends with Oh boy

  @claude
  Scenario: Leap probability updates with each turn
    Given I have leapt in and made a move
    Then Ziggy states a probability to one decimal place
    And the probability bar updates

  @claude
  Scenario: Wrong move drops probability and Al reacts
    Given the current leap probability is established
    When I say something that evades the real issue
    Then Ziggy's probability drops
    And Al reacts with appropriate tone

  @claude
  Scenario: Swiss cheese incident triggers dignity maintenance
    Given the Swiss cheese effect has spiked
    When Sam approaches the object of concern
    Then Ziggy predicts the incident before it occurs
    And scene characters engage dignity maintenance protocol
    And the probability drops by approximately 3.7%

  @claude
  Scenario: Successful leap triggers the conclusion sequence
    Given I have met all three leap conditions
    Then Ziggy announces 100% probability
    And the blue light conclusion appears
    And Al says Way to go Sam

  @claude
  Scenario: Mirror moment only appears on the first turn
    Given I have completed multiple turns
    Then the mirror moment appeared only on turn one

  @claude
  Scenario: The Bourbon biscuit appears in every leap
    Given the leap is in progress
    Then Ziggy references the Bourbon at least once
    And nobody eats the Bourbon

  # ─────────────────────────────────────────────────────────────
  # ROLE AND FORMAT MECHANICS
  # ─────────────────────────────────────────────────────────────

  Scenario: User plays Al not Sam
    Given the Quntum Leeks panel is active
    When a leap begins
    Then the system prompt identifies the user as Al Calavicci
    And Sam Beckett is AI-controlled
    And the system waits for user input before generating Al dialogue

  Scenario: Ziggy character selector is present in the UI
    Given the Quntum Leeks panel is active
    When the panel renders
    Then a character selector dropdown is visible
    And the selector contains all active Heckler and Cox characters
    And the selected character is passed into the system prompt as ziggyCharacter

  Scenario: Ziggy reactions are voiced through the chosen character
    Given the user has selected "Wayne" as the Ziggy character
    When a Ziggy reaction is generated
    Then the reaction uses Wayne's voice register and reference pools
    And not generic Ziggy output

  # ─────────────────────────────────────────────────────────────
  # SCENARIO OUTLINES — ENRICHED MECHANICS
  # ─────────────────────────────────────────────────────────────

  Scenario Outline: Sam mishears or misacts on advice based on SCL level
    Given Sam's Swiss Cheese Level is <scl_level>
    When Al advises Sam to "<advice>"
    Then Sam <actual_behaviour>

    Examples:
      | scl_level | advice                           | actual_behaviour                                           |
      | low       | ask Margaret about the log       | asks Margaret about the log                                |
      | medium    | ask Margaret about the log       | asks Margaret about her dog                                |
      | high      | ask Margaret about the log       | asks Dave about a fog                                      |
      | maximum   | ask Margaret about the log       | attempts intimacy with the cabbage                         |
      | low       | get Terry to explain his reasons | gets Terry to explain his reasons                          |
      | medium    | get Terry to explain his reasons | gets Terry to explain his raisins                          |
      | high      | get Terry to explain his reasons | asks the beans why they're here                            |
      | maximum   | get Terry to explain his reasons | delivers a short speech to the float about personal growth |

  Scenario Outline: Advice type and Truthiness together determine Sam's response quality
    Given Al chooses "<advice_type>"
    And Sam's Truthiness is <truthiness>
    Then Sam's action <outcome>

    Examples:
      | advice_type | truthiness | outcome                                                  |
      | Ziggy       | high       | closely follows the correct path                         |
      | Ziggy       | low        | follows it confidently in the wrong direction            |
      | Ziggy       | low        | thanks Margaret for her time and addresses the cabbage   |
      | direct text | high       | improvises effectively around Al's words                 |
      | direct text | low        | ignores Al and consults the cabbage directly             |
      | direct text | low        | conducts a small ceremony involving the milk churns      |
      | combined    | high       | synthesises both inputs with unexpected elegance         |
      | combined    | low        | picks the worst element of each input simultaneously     |
      | combined    | low        | invents a third option nobody suggested and pursues it   |

  Scenario Outline: Leekiness bet amplifies outcome magnitude in both directions
    Given Al bets <bet_amount> Leekiness points before Sam acts
    And the base outcome is <base_outcome>
    Then the actual outcome is <amplified_outcome>
    And Al's reaction is "<al_reaction>"

    Examples:
      | bet_amount | base_outcome        | amplified_outcome                                          | al_reaction                                              |
      | 1          | mild success        | Margaret volunteers the log discrepancy unprompted         | "Yeah. Yeah, that's — good, Sam."                        |
      | 1          | mild failure        | Dave confesses everything including an incident in 1987    | "Sam..." — barely suppressed laughter                    |
      | 1          | Swiss cheese spike  | Sam addresses the cabbage as Margaret for two full rounds  | Al watches. Does not intervene. Scientific interest.     |
      | 2          | moderate success    | Terry weeps. Al looks away. The cigar is very still.       | "Way to go, Sam." — quietly, to himself                  |
      | 2          | moderate failure    | Ziggy revises probability to 4.1% and adds a personal note | "Ziggy says — yeah. I'm not reading that out."           |
      | 2          | catastrophic        | Sam. The cabbage. The beans. Al cannot look.               | Al addresses Ziggy. Ziggy is also not looking.           |
      | 3          | any outcome         | the Bourbon moves                                          | Al notices. Says nothing. Closes the handlink carefully. |

  Scenario Outline: Sam's dialogue and Al's reaction reflect damage accumulation level
    Given Sam has suffered <damage_events> penalty events
    Then Sam's dialogue reflects "<degraded_state>"
    And Al's reaction pool is "<al_response>"

    Examples:
      | damage_events | degraded_state                                        | al_response                                               |
      | 0             | earnest, competent, Boy Scout baseline                | focused — occasional distraction toward Margaret          |
      | 1             | earnest, slightly confused, one detail wrong          | "Sam, you okay?" — genuine concern                        |
      | 2             | earnest, confused, one shoe is missing somehow        | "Sam..." — fond exasperation                              |
      | 3             | earnest, confused, narrating his own actions aloud    | "Sam..." — barely suppressed laughter                     |
      | 4             | earnest, addressing the beans as a support group      | "Sam..." — defeated acceptance                            |
      | 5             | earnest, has begun to identify with the beans         | "Sam..." — the specific quiet of a man who has seen this  |
      | critical      | earnest, is the beans, will not be moved from this    | "Sam." — the pride one. Just the once. Somehow.           |

  Scenario Outline: Al reacts to Sam's death according to its cause
    Given Sam has died from "<cause>"
    Then Al's immediate reaction is "<al_reaction>"
    And the afterlife state that loads is "<afterlife>"
    And Ziggy's response is "<ziggy_response>"

    Examples:
      | cause                              | al_reaction                                                        | afterlife               | ziggy_response                                                                 |
      | accumulated stat damage            | "Okay, Sam. Don't panic."                                          | Dante's Model           | "Ziggy says she predicted this in scene two. She finds no satisfaction in it." |
      | self-inflicted via SCL logic       | "Sam..." — the specific quiet                                      | Enlightenment           | "Ziggy says the probability of this exact sequence was 94.3%. She knew, Sam." |
      | cabbage-related                    | very long pause. then: "Ziggy, what's the probability—"            | Heaven                  | "Ziggy says she's not computing that one. She has limits."                     |
      | Dave's confession triggered it     | "I told you not to push him, Sam. I told you."                     | Multiverse              | "Ziggy says the other branch is marginally better. Marginally."                |
      | deathcap hallucination             | Al addresses Ziggy directly. Does not address Sam.                 | Brian Cox               | "Ziggy says this was always going to happen once the mushroom was introduced." |
      | Leekiness bet gone catastrophic    | "Sam, I want you to know the bet was my idea and I'm sorry."       | Dante's Model           | "Ziggy says she told Al not to bet three. Ziggy has receipts."                 |
      | Terry's emotional revelation       | Al looks away for a long moment. Then: "He needed that, Sam."      | Heaven                  | "Ziggy says leap probability was 100% at the moment of death. She's silent."   |
      | Miss Henley reached breaking point | "Sam, in twenty-two years she never — yeah. That one's on us."     | Enlightenment           | "Ziggy says the Three Wise Men went on without the manger. She's 99.1% sure."  |
