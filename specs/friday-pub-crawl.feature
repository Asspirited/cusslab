Feature: Friday Pub Crawl Misadventure — Mode B engine
  As a player navigating a Friday night pub crawl
  I want scene-based play with choice-driven pressure and advisor responses
  So that each pub is a distinct tactical problem with real consequences

  # ── Scene data ───────────────────────────────────────────────────────────────

  Scenario: All 8 pub scenes exist and have required fields
    When I load all pub crawl scenes
    Then there are exactly 8 scenes
    And each scene has an id, name, location, description, and beats
    And each beat has exactly 4 choices
    And each choice has a label and a pressure cost

  Scenario: Each scene has a scene-specific worst outcome
    When I load all pub crawl scenes
    Then each scene has a worst outcome description

  # ── Scene initialisation ─────────────────────────────────────────────────────

  Scenario: Starting a pub crawl scene resets pressure and beat
    Given the pub scene "rising-sun-basingstoke"
    When I initialise the pub crawl at that scene
    Then the crawl pressure is 0
    And the crawl beat is 0
    And the crawl is not over

  Scenario: Starting a pub crawl shuffles the advisor order
    Given the pub scene "rising-sun-basingstoke"
    When I initialise the pub crawl at that scene
    Then the advisor order contains Sun Tzu, Nostradamus, Chuck Norris, and Buddha
    And the advisor order is 4 advisors long

  # ── Choice resolution ────────────────────────────────────────────────────────

  Scenario: Resolving a choice increases pressure by that choice's cost
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When I resolve pub crawl choice index 0 on beat 0
    Then the crawl pressure is the pressure cost of beat 0 choice 0
    And the crawl beat is 1

  Scenario: Resolving 4 beats ends the scene
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When I resolve pub crawl choice index 0 on each of 4 beats
    Then the crawl is over

  # ── Outcome determination ────────────────────────────────────────────────────

  Scenario: Pressure 0-4 results in clean escape
    Given a completed pub crawl with total pressure 4
    When I determine the pub crawl outcome
    Then the pub crawl outcome is "escape"

  Scenario: Pressure 5-8 results in ejection
    Given a completed pub crawl with total pressure 7
    When I determine the pub crawl outcome
    Then the pub crawl outcome is "ejected"

  Scenario: Pressure 9-12 results in scene-specific worst outcome
    Given a completed pub crawl with total pressure 10
    When I determine the pub crawl outcome
    Then the pub crawl outcome is "worst"

  Scenario: Pressure 13 or above results in legendary disaster
    Given a completed pub crawl with total pressure 14
    When I determine the pub crawl outcome
    Then the pub crawl outcome is "legendary"

  # ── Advisor rotation ─────────────────────────────────────────────────────────

  Scenario: First active advisor is the first in the shuffled order
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When I ask for the active pub crawl advisor with no topic
    Then the active pub crawl advisor is the first in the advisor order

  Scenario: Physical topic triggers Chuck Norris regardless of order
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When I ask for the active pub crawl advisor with topic "physical"
    Then the active pub crawl advisor is "chuck-norris"

  Scenario: Philosophical topic triggers Buddha regardless of order
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When I ask for the active pub crawl advisor with topic "philosophical"
    Then the active pub crawl advisor is "buddha"

  Scenario: Strategic topic triggers Sun Tzu regardless of order
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When I ask for the active pub crawl advisor with topic "strategic"
    Then the active pub crawl advisor is "sun-tzu"

  Scenario: Outcome topic triggers Nostradamus regardless of order
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When I ask for the active pub crawl advisor with topic "outcome"
    Then the active pub crawl advisor is "nostradamus"

  # ── Advisor prompt building ───────────────────────────────────────────────────

  Scenario: Advisor prompt includes the scene location
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When I build the pub crawl advisor prompt for "sun-tzu" after choosing "Order at the bar"
    Then the pub crawl advisor prompt includes "Rising Sun"

  Scenario: Advisor prompt includes the choice made
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When I build the pub crawl advisor prompt for "sun-tzu" after choosing "Order at the bar"
    Then the pub crawl advisor prompt includes "Order at the bar"

  Scenario: Each advisor prompt includes their character voice
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When I build the pub crawl advisor prompt for "nostradamus" after choosing "Order at the bar"
    Then the pub crawl advisor prompt includes "Nostradamus"

  # ── Lederhosen ───────────────────────────────────────────────────────────────

  Scenario: Lederhosen is not active at scene start
    Given an initialised pub crawl at "hofbrau-oktoberfest"
    Then pub crawl lederhosen is not active

  Scenario: Lederhosen activates in Oktoberfest when pressure threshold is reached
    Given an initialised pub crawl at "hofbrau-oktoberfest"
    When the pub crawl pressure is set to 8
    Then pub crawl lederhosen is active

  Scenario: Lederhosen does not activate from pressure alone outside Oktoberfest
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When the pub crawl pressure is set to 8
    Then pub crawl lederhosen is not active

  Scenario: Typing "wear lederhosen" activates lederhosen in any scene
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When I check pub crawl lederhosen with input "wear lederhosen"
    Then pub crawl lederhosen is active

  Scenario: Typing "put on lederhosen" activates lederhosen in any scene
    Given an initialised pub crawl at "mcsorleys-nyc"
    When I check pub crawl lederhosen with input "put on lederhosen"
    Then pub crawl lederhosen is active

  Scenario: Lederhosen state is included in the advisor prompt when active
    Given an initialised pub crawl at "hofbrau-oktoberfest"
    And pub crawl lederhosen is manually activated
    When I build the pub crawl advisor prompt for "chuck-norris" after choosing "Order another Maß"
    Then the pub crawl advisor prompt includes "lederhosen"

  # ── Pressure feedback and game-goal clarity (BL-128) ─────────────────────────

  Scenario: A pressure explainer is visible during a scene
    Given the pub crawl panel is active
    Then the pressure explainer element is present
    And the pressure explainer text mentions lower pressure or escape

  Scenario: Pressure bar has zone threshold markers
    Given the pub crawl panel is active
    Then the pressure bar zone markers element is present
    And it has a marker labelled "ESCAPE"
    And it has a marker labelled "EJECTED"
    And it has a marker labelled "WORST"

  Scenario: A pressure delta element exists in the active scene
    Given the pub crawl panel is active
    Then the pressure delta element is present in the active scene

  Scenario: Pressure zone status label exists
    Given the pub crawl panel is active
    Then the pressure zone label element is present

  Scenario: The pressure zone label reflects the escape zone at low pressure
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When the pub crawl pressure is set to 2
    Then the pressure zone label reflects the escape zone

  Scenario: The pressure zone label reflects the danger zone at high pressure
    Given an initialised pub crawl at "rising-sun-basingstoke"
    When the pub crawl pressure is set to 10
    Then the pressure zone label reflects the danger zone
