# specs/premise-interrogation.feature
# BL-116 — Premise Interrogation
# Panel ID: premise-interrogation | UI prefix: pi
# Two modes: Mode 1 (frameworks, user-selected) | Mode 2 (panel: Cox, Adams, Feynman, Russell)
# Lives under Boardroom section in nav, alongside Present to the Board

Feature: Premise Interrogation — BL-116
  As a comedy writer
  I want to interrogate a premise through philosophical frameworks and a character panel
  So that I can validate, sharpen, and stress-test it before committing to it

  Background:
    Given the Premise Interrogation panel is active under Boardroom

  # ── SHARED INPUT ──────────────────────────────────────────────────────────────

  Scenario: Premise input required before Mode 1 runs
    Given no premise has been entered
    When the user triggers Mode 1
    Then a toast warns "State your premise first."
    And no API call is made

  Scenario: Premise input required before Mode 2 runs
    Given no premise has been entered
    When the user triggers Mode 2
    Then a toast warns "State your premise first."
    And no API call is made

  Scenario: Same premise input drives both modes
    Given a premise "Everyone is slightly relieved when plans get cancelled"
    When the user runs Mode 1 with selected frameworks
    And then switches to Mode 2 without changing the input
    Then Mode 2 uses the same premise text

  # ── MODE 1 — FRAMEWORKS ───────────────────────────────────────────────────────

  Scenario: Framework config contains all ten canonical frameworks
    When I load the premise interrogation framework config
    Then it contains exactly 10 frameworks
    And the framework ids are "socratic", "popper", "black-hat", "kahneman", "premortem", "five-whys", "made-to-stick", "voss", "inversion", "steel-man"

  Scenario: Framework selector displays all ten options with descriptions
    Given the Premise Interrogation panel is loaded
    Then the framework selector displays all ten framework options
    And each framework has a name and a one-line description

  Scenario: User must select at least one framework before running Mode 1
    Given a premise has been entered
    And no frameworks are selected
    When the user triggers Mode 1
    Then a toast warns "Select at least one framework."
    And no API call is made

  Scenario: Each selected framework produces one API call and one output block
    @claude
    Given a premise "Everyone is slightly relieved when plans get cancelled"
    And the user has selected "Popper — Falsifiability" and "Pre-mortem"
    When the user runs Mode 1
    Then exactly two API calls are made
    And the output contains one block labelled "Popper — Falsifiability"
    And the output contains one block labelled "Pre-mortem"
    And each block contains a text response addressing the premise

  Scenario: Framework blocks render sequentially as each call completes
    @claude
    Given the user has selected three frameworks
    When the user runs Mode 1
    Then the first block appears before the second
    And the second block appears before the third

  # ── MODE 2 — PANEL ────────────────────────────────────────────────────────────

  Scenario: Default panel contains exactly four characters
    When I load the premise interrogation panel config
    Then the default panel contains exactly 4 characters
    And the panel includes "cox"
    And the panel includes "adams"
    And the panel includes "feynman"
    And the panel includes "russell"

  Scenario: Panel character list supports up to six characters
    When I load the premise interrogation panel config
    Then the panel max capacity is 6

  Scenario: CANONICAL_CHARS contains specs for Cox, Adams, and Russell
    When I load CANONICAL_CHARS
    Then CANONICAL_CHARS has an entry for "cox"
    And CANONICAL_CHARS has an entry for "adams"
    And CANONICAL_CHARS has an entry for "russell"
    And each entry has a prompt, name, icon, colour, and bg

  Scenario: Mode 2 runs all active panel characters sequentially
    @claude
    Given a premise "Everyone is slightly relieved when plans get cancelled"
    When the user runs Mode 2
    Then responses are fetched for all characters in the active panel
    And each character response is rendered with name, icon, and colour
    And responses render sequentially as each completes

  Scenario: Later characters receive prior responses as context
    @claude
    Given Mode 2 has run with at least two characters
    Then later characters receive prior responses as context
    And relationship dynamics from character specs inform the interactions

  Scenario: Character responses reflect canonical voice
    @claude
    Given Mode 2 has run on any premise
    Then Cox situates the premise in cosmic or geological time
    And Adams contains a subordinate clause before the main landing
    And Feynman strips the premise to its simplest form
    And Russell identifies at least one word doing undisclosed work

  # ── UI BEHAVIOUR ──────────────────────────────────────────────────────────────

  Scenario: Mode toggle has two labelled options
    @claude
    Given the panel is loaded
    Then a mode toggle shows "FRAMEWORKS" and "PANEL" options
    And the active mode is visually distinguished

  Scenario: Switching modes clears previous output
    @claude
    Given Mode 1 has produced output
    When the user switches to Mode 2
    Then Mode 1 output is hidden
    And Mode 2 output area is shown empty until run

  Scenario: Loading state shown while responses are being fetched
    @claude
    Given the user triggers Mode 1 or Mode 2
    Then a loading indicator is shown until the first response arrives

  Scenario: Feedback row present after either mode produces output
    @claude
    Given Mode 1 or Mode 2 has produced output
    Then a feedback row with emoji ratings is visible

  Scenario: Panel appears under Boardroom section in navigation
    When I inspect the nav group for boardroom
    Then it contains "Premise Interrogation"
