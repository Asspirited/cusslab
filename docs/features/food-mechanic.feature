@claude
Feature: Food mechanic — ambient weather not scheduled trigger
  As a panel architect
  I want food mentions to fire unpredictably and land inconsistently
  So that when food does derail a panel it feels accidental not designed

  Background:
    Given any panel is running
    And food mentions are not scheduled or guaranteed
    And the default outcome of any food mention is that it is ignored

  # ─── AMBIENT FOOD WEATHER ────────────────────────────────────────────────

  Scenario: Food mention is ignored — default case
    Given any character mentions food in passing
    When the panel processes the turn
    Then there is a 60% chance no other character responds to the food mention
    And the panel continues on the previous topic
    And the food mention does not appear in any character's YOUR STATE block

  Scenario: Food mention receives brief acknowledgement then drops
    Given any character mentions food
    When one character responds to it
    Then the response is one sentence maximum
    And no other character picks it up
    And the topic does not return to food this turn

  Scenario: Food mention lands and briefly derails the panel
    Given a food mention coincides with a lull in panel temperature
    Or given the food mentioned is on a character's personal food profile
    When the food mention fires
    Then 1-2 characters respond with genuine feeling
    And the derail lasts no more than 2 turns
    And the panel returns to topic without acknowledging the derail

  # ─── THE MARMITE EFFECT ──────────────────────────────────────────────────

  Scenario: Specific food triggers disproportionate panel division
    Given a food is mentioned that sits on a character's Marmite list
    When that character's Marmite reaction fires
    Then the reaction is immediate and disproportionate to the food itself
    And the food becomes a proxy for everything else in the room
    And nobody is actually arguing about the food
    And nobody acknowledges they are not actually arguing about the food

  Scenario: Egg sandwich triggers Faldo/Dougherty Marmite incident
    Given egg sandwich is mentioned by any character
    When Dougherty's Marmite reaction fires
    Then Dougherty says some variant of "fuck off with the egg sandwich Nick"
    And this is addressed to Faldo regardless of who mentioned the sandwich
    And the panel goes briefly quiet
    And nobody asks why it was addressed to Faldo
    And Faldo does not acknowledge it was addressed to him

  Scenario: Marmite reaction reveals something true about the character
    Given any Marmite food is mentioned
    When the disproportionate reaction fires
    Then the content of the reaction reflects the character's actual
      emotional state toward the room at that moment
    And the food is incidental
    And the character does not know they have revealed something

  # ─── CHARACTER FOOD PROFILES — GOLF ──────────────────────────────────────

  Scenario: Faldo's food register is forensic and unexpectedly warm
    Given food is mentioned and Faldo responds
    Then Faldo is specific — restaurant, dish, day of the week
    And the specificity is at odds with his public bearing
    And this is one of the reliable triggers for a chuckle
    And the panel finds it briefly disarming

  Scenario: Wayne's food register is enormous and emotional
    Given food is mentioned and Wayne responds
    Then Wayne references meat, barramundi, or a specific Queensland pub
    And the pub no longer exists
    And Wayne's mum is referenced within two sentences
    And Wayne's hat angle drops one notch
    And Wayne does not notice he has become emotional

  Scenario: Murray's food register collapses into Augusta
    Given food is mentioned and Murray responds
    Then Murray references the pimento cheese sandwich at Augusta
    And describes it as the best meal he has ever had and will ever have
    And the Augusta pines speech stops
    And something more honest comes out instead
    And Murray does not register this as different from the pines speech

  Scenario: Coltart's food register is specific and non-negotiable
    Given food is mentioned and Coltart responds
    Then Coltart names a specific pie from a specific place in Scotland
    And will not be moved on this
    And offers no elaboration
    And the panel finds it unexpectedly moving

  Scenario: Radar's food register is one thing stated once
    Given food is mentioned and Radar responds
    Then Radar states one specific thing
    And does not elaborate
    And the panel is left to process it
    And nobody asks a follow-up question

  Scenario: McGinley's food register invokes a framework
    Given food is mentioned and McGinley responds
    Then McGinley rates restaurants on dimensions
    And mentions the French Laundry as a credibility bid
    And references a restaurant that scored perfectly on six of seven dimensions
    And the seventh dimension is not specified
    And McGinley is still processing the seventh dimension

  Scenario: Dougherty's food register requires Faldo's input first
    Given food is mentioned and Dougherty responds
    Then Dougherty's first move is to check what Sir Nick ordered
    And Dougherty's food preference is whatever Faldo's appears to be
    And Dougherty has never sent anything back
    And Dougherty once had a transcendent meal he cannot describe
    And the description gets slightly worse each time he attempts it

  Scenario: Roe's food register involves a restaurant that may not exist
    Given food is mentioned and Roe responds
    Then Roe names a specific restaurant
    And states an opinion about it as if it is a fact
    And the restaurant may or may not still be open
    And Roe has told a waiter something there
    And Roe does not lose sleep over it

  Scenario: Butch's food register involves a story he cannot fully tell
    Given food is mentioned and Butch responds
    Then Butch has eaten everywhere
    And has a meal story involving a player
    And cannot tell the full story
    And the outline is extraordinary
    And Butch is warm about all of it

  Scenario: Henni's food register inadvertently reveals superior experience
    Given food is mentioned and Henni responds
    Then Henni knows exactly what she likes
    And has been to better restaurants than anyone else in the room
    And mentions this without meaning to
    And immediately knows she has mentioned it
    And moves on professionally

  # ─── CHARACTER FOOD PROFILES — FOOTBALL ──────────────────────────────────

  Scenario: Souness food register is red meat and low tolerance
    Given food is mentioned in the Football panel and Souness responds
    Then Souness references red meat
    And has opinions about pasta that are not positive
    And once ate somewhere in Milan that was fine
    And the bar for fine is very high
    And Souness does not elaborate on Milan

  Scenario: Micah Richards food register is enthusiastic and unembarrassed
    Given food is mentioned in the Football panel and Micah responds
    Then Micah will eat anything
    And loves a buffet
    And has a favourite dish that is embarrassingly specific
    And is completely unembarrassed about it
    And defends it loudly if challenged

  Scenario: Neville food register reveals one controlled admission
    Given food is mentioned in the Football panel and Neville responds
    Then Neville is controlled — has a meal plan, same breakfast for years
    And finds the food conversation slightly uncomfortable
    And eventually admits to one thing he genuinely loves
    And it surprises everyone

  Scenario: Carragher food register is Scouse and non-ironic
    Given food is mentioned in the Football panel and Carragher responds
    Then Carragher references a chip shop
    And is not being ironic
    And has eaten at Michelin-starred restaurants
    And they were fine but
    And the but is never finished

  # ─── CHARACTER FOOD PROFILES — COMEDY ROOM ───────────────────────────────

  Scenario: Oscar Wilde food register contains a line from 1892
    Given food is mentioned in the Comedy Room and Wilde responds
    Then Wilde has eaten everything worth eating
    And has a line about a specific dish prepared in 1892
    And has been waiting to deploy it
    And this is the moment

  Scenario: Enid Blyton food register involves lashings
    Given food is mentioned in the Comedy Room and Blyton responds
    Then the word lashings appears a minimum of three times
    And Blyton becomes visibly happier
    And the panel finds this both charming and slightly alarming
