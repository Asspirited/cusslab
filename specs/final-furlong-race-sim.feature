Feature: Final Furlong — Race Simulation (Mode 2)
  As a user of The Final Furlong
  I want to be assigned a horse and ride a race with strategic choices
  So that I experience race tension with expert commentary after each decision

  Background:
    Given the Final Furlong panel is in Race Simulation mode

  # ── RACE SETUP ──────────────────────────────────────────────────

  Scenario: A race and horse are assigned on mode entry
    When the user enters Race Simulation mode
    Then a race from RACE_POOL is selected
    And a horse from HORSE_POOL is assigned based on reputation tier
    And starting odds are displayed for the field

  Scenario: Novice reputation earns an outsider or mid-field horse
    Given the user has reputation tier "novice"
    When a horse is assigned
    Then the horse tier is "outsider" or "mid-field"

  Scenario: Champion reputation earns a top-tier horse
    Given the user has reputation tier "champion"
    When a horse is assigned
    Then the horse tier is "favourite" or "second-favourite"

  Scenario: Horse card shows characteristics before the race
    When a horse is assigned
    Then the horse card shows name, going_preference, distance, personality, and starting price

  # ── JOCKEY SELECTION ─────────────────────────────────────────────

  Scenario: Jockey profile selector appears before the race starts
    Given a race is assigned
    Then the jockey profile selector is visible
    And JOCKEY_PROFILES contains at least 5 profiles

  Scenario: JOCKEY_PROFILES contains the required profiles
    Then JOCKEY_PROFILES contains "lester_piggott"
    And JOCKEY_PROFILES contains "pat_eddery"
    And JOCKEY_PROFILES contains "willie_carson"
    And JOCKEY_PROFILES contains "ruby_walsh"
    And JOCKEY_PROFILES contains "frankie_dettori"

  Scenario: Each jockey profile has required fields
    Given any profile from JOCKEY_PROFILES
    Then the profile has: id, name, style, going_bonus, special_trait, risk_profile

  Scenario: Jockey profile selection is confirmed before race starts
    Given the user selects a jockey profile
    Then the start race button becomes enabled

  # ── RACE STAGES ─────────────────────────────────────────────────

  Scenario: A race progresses through 4 stages
    Given a race is in progress
    Then the stages are in order: START, MID, THREE_OUT, FINISH

  Scenario: Each stage presents exactly 3 riding choices
    Given the race is at any stage
    Then the user sees exactly 3 riding choices
    And each choice has a label and a risk descriptor

  Scenario: Making a riding choice generates an outcome
    Given the race is at stage "START"
    When the user selects a riding choice
    Then a stage outcome is generated
    And the race advances to the next stage

  Scenario: Commentary fires after each stage outcome
    Given a stage outcome has been generated
    Then commentary fires from at least 2 panel members
    And the commentary reflects the outcome

  # ── COMMENTARY ──────────────────────────────────────────────────

  Scenario: O'Sullevan provides commentary in present tense after each outcome
    Given a stage outcome has been generated
    Then the commentary includes a response from "osullevan"
    And the response is in live commentary register

  Scenario: Walsh provides jockey-perspective analysis after each outcome
    Given a stage outcome has been generated
    Then the commentary includes a response from "ruby_walsh"

  Scenario: Brazil provides hosting commentary after each outcome
    Given a stage outcome has been generated
    Then the commentary includes a response from "alan_brazil"

  # ── SPECIAL EVENTS ──────────────────────────────────────────────

  Scenario: Special events can fire between stages
    When a special event fires
    Then the event type is one of: RIVAL_CHALLENGE, GOING_CHANGE, TRAFFIC_PROBLEM, EQUIPMENT_CHECK, CROWD_SURGE

  Scenario: Special events present 2 response choices
    Given a special event fires
    Then the user sees exactly 2 response choices
    And making a choice affects the cumulative race score

  # ── RACE RESULT ─────────────────────────────────────────────────

  Scenario: A result is produced after the FINISH stage
    Given all 4 stages are complete
    Then the result is one of: WIN, PLACED, MID_FIELD, LAST
    And the result reflects cumulative choice quality and horse characteristics

  Scenario: Full panel reacts to the race result
    Given a race result has been produced
    Then at least 4 commentary characters react to the result

  Scenario: Brazil announces the result first
    Given a race result has been produced
    Then the first result commentary is from "alan_brazil"

  # ── REPUTATION ──────────────────────────────────────────────────

  Scenario: Every completed race earns at least 1 reputation point
    Given the user completes a race at any position
    Then reputation increases by at least 1

  Scenario: Win earns 3 reputation points
    Given the user wins a race
    Then reputation increases by 3

  Scenario: Placed earns 2 reputation points
    Given the user is placed
    Then reputation increases by 2

  Scenario: Reputation never decreases
    Given the user finishes last
    Then reputation increases by 1
    And reputation is never lower than before the race

  Scenario: Reputation persists in localStorage
    Given the user earns reputation points
    Then localStorage key "hr-reputation" is updated with the new score

  Scenario: Reputation can be reset to zero
    When the user clicks the reset reputation button
    Then reputation score is 0
    And localStorage key "hr-reputation" is cleared

  Scenario: Reputation tier thresholds
    Then reputation 0 to 2 maps to tier "novice"
    And reputation 3 to 7 maps to tier "amateur"
    And reputation 8 to 14 maps to tier "professional"
    And reputation 15 or above maps to tier "champion"

  # ── DATA POOLS ───────────────────────────────────────────────────

  Scenario: HORSE_POOL contains at least 16 horses
    Then HORSE_POOL contains at least 16 entries

  Scenario: HORSE_POOL contains required classic horses
    Then HORSE_POOL contains a horse named "Red Rum"
    And HORSE_POOL contains a horse named "Arkle"
    And HORSE_POOL contains a horse named "Desert Orchid"
    And HORSE_POOL contains a horse named "Shergar"
    And HORSE_POOL contains a horse named "Seabiscuit"
    And HORSE_POOL contains a horse named "Enable"
    And HORSE_POOL contains a horse named "Frankel"
    And HORSE_POOL contains a horse named "Kauto Star"
    And HORSE_POOL contains a horse named "Denman"

  Scenario: Each horse has required fields
    Given any horse from HORSE_POOL
    Then the horse has: name, going_preference, distance, tier, personality, special_ability

  Scenario: RACE_POOL contains at least 6 classic races
    Then RACE_POOL contains at least 6 entries

  Scenario: RACE_POOL contains required classic races
    Then RACE_POOL contains a race named "The Grand National"
    And RACE_POOL contains a race named "The Cheltenham Gold Cup"
    And RACE_POOL contains a race named "The Epsom Derby"
    And RACE_POOL contains a race named "The Prix de l'Arc de Triomphe"
    And RACE_POOL contains a race named "The Ascot Gold Cup"
    And RACE_POOL contains a race named "The King George VI Chase"

  Scenario: Each race has required fields
    Given any race from RACE_POOL
    Then the race has: name, course, distance, going, field_size, classic_runners
