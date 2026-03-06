Feature: Quality Tools — ACC, FMEA, 5 Whys, Ishikawa, PDCA, VSM, DORA wizards

  Background:
    Given the application is loaded

  # ── Nav ─────────────────────────────────────────────────────────────────────

  Scenario: QUALITY TOOLS nav group is visible in the sidebar
    Then I should see a nav group with id "ng-quality"

  Scenario Outline: All seven quality tool tabs are present in the nav
    Then I should see a tab linking to panel "<panel>"

    Examples:
      | panel     |
      | acc       |
      | fmea      |
      | fivewhys  |
      | ishikawa  |
      | pdca      |
      | vsm       |
      | dora      |

  Scenario Outline: All four backlog tabs are present in the nav
    Then I should see a tab linking to panel "<panel>"

    Examples:
      | panel        |
      | cynefin      |
      | toc          |
      | sevenwastes  |
      | dmaic        |

  Scenario: ON THE BACKLOG nav group is visible in the sidebar
    Then I should see a nav group with id "ng-backlog"

  Scenario: Clicking a quality tool tab activates the ng-quality nav group
    When I click the tab for panel "acc"
    Then the nav group "ng-quality" should have class "active"

  Scenario: Clicking a backlog tab activates the ng-backlog nav group
    When I click the tab for panel "cynefin"
    Then the nav group "ng-backlog" should have class "active"

  # ── ACC ─────────────────────────────────────────────────────────────────────

  Scenario: ACC panel renders title and description
    Given I am on the ACC Analysis tab
    Then I should see the panel title "ACC Analysis"

  Scenario: ACC submit with no input shows a warning and makes no API call
    Given I am on the ACC Analysis tab
    When I click "RUN ACC ANALYSIS" with no input
    Then I should see a warning message
    And no API call should be made

  Scenario: ACC valid input shows loading state then output
    Given I am on the ACC Analysis tab
    When I enter "Cloud migration" in "acc-title"
    And I enter "Moving billing to AWS" in "acc-desc"
    And the API returns a valid ACC result
    And I click "RUN ACC ANALYSIS"
    Then the "acc-output" element should be visible
    And the "acc-loading" element should be hidden

  Scenario: ACC output renders three sections
    Given I am on the ACC Analysis tab
    When the ACC wizard returns a result with assumptions, constraints, and concerns
    Then I should see the heading "ASSUMPTIONS"
    And I should see the heading "CONSTRAINTS"
    And I should see the heading "CONCERNS"

  Scenario: ACC risk tags render with correct colour coding
    Given I am on the ACC Analysis tab
    When the ACC wizard returns an assumption with risk "high"
    Then the assumption card should display the "HIGH" tag

  Scenario: ACC reset clears inputs and hides output
    Given I am on the ACC Analysis tab
    And the ACC output is visible
    When I click "CLEAR"
    Then the "acc-output" element should be hidden
    And the "acc-title" input should be empty

  Scenario: ACC unparseable response shows error and panel remains usable
    Given I am on the ACC Analysis tab
    When I enter "test" in "acc-title"
    And the API returns an unparseable response
    And I click "RUN ACC ANALYSIS"
    Then I should see an error message
    And the panel should remain usable

  # ── FMEA ────────────────────────────────────────────────────────────────────

  Scenario: FMEA panel renders title
    Given I am on the FMEA tab
    Then I should see the panel title "FMEA"

  Scenario: FMEA submit with no input shows a warning and makes no API call
    Given I am on the FMEA tab
    When I click "RUN FMEA" with no input
    Then I should see a warning message
    And no API call should be made

  Scenario: FMEA output renders failure mode cards
    Given I am on the FMEA tab
    When the FMEA wizard returns 5 failure mode items
    Then I should see 5 failure mode cards in "fmea-result"
    And each card should display Severity, Occurrence, and Detection scores

  Scenario: FMEA item with RPN >= 200 shows CRITICAL flag
    Given I am on the FMEA tab
    When the FMEA wizard returns an item with severity 8, occurrence 6, detectability 5
    Then the RPN displays as 240
    And the card shows the "CRITICAL" label

  Scenario: FMEA item with RPN below 200 does not show CRITICAL flag
    Given I am on the FMEA tab
    When the FMEA wizard returns an item with severity 3, occurrence 3, detectability 3
    Then the RPN displays as 27
    And the card does not show the "CRITICAL" label

  Scenario: FMEA reset clears inputs and hides output
    Given I am on the FMEA tab
    And the FMEA output is visible
    When I click "CLEAR"
    Then the "fmea-output" element should be hidden

  # ── 5 Whys ──────────────────────────────────────────────────────────────────

  Scenario: 5 Whys panel renders title
    Given I am on the 5 Whys tab
    Then I should see the panel title "5 Whys"

  Scenario: 5 Whys submit with no problem shows a warning and makes no API call
    Given I am on the 5 Whys tab
    When I click "DIG IN" with no input
    Then I should see a warning message
    And no API call should be made

  Scenario: 5 Whys output renders all five levels
    Given I am on the 5 Whys tab
    When the 5 Whys wizard returns a complete chain
    Then I should see level indicators 1 through 5 in "fivewhys-result"

  Scenario: 5 Whys output renders root cause block
    Given I am on the 5 Whys tab
    When the 5 Whys wizard returns a complete chain
    Then I should see the heading "ROOT CAUSE"
    And I should see the heading "CORRECTIVE ACTION"
    And I should see the heading "PREVENTIVE ACTION"

  Scenario: 5 Whys reset clears inputs and hides output
    Given I am on the 5 Whys tab
    And the 5 Whys output is visible
    When I click "CLEAR"
    Then the "fivewhys-output" element should be hidden
    And the "fivewhys-problem" input should be empty

  # ── Ishikawa ─────────────────────────────────────────────────────────────────

  Scenario: Ishikawa panel renders title
    Given I am on the Ishikawa tab
    Then I should see the panel title "Ishikawa"

  Scenario: Ishikawa submit with no effect shows a warning and makes no API call
    Given I am on the Ishikawa tab
    When I click "BUILD FISHBONE" with no input
    Then I should see a warning message
    And no API call should be made

  Scenario: Ishikawa output renders all six bones
    Given I am on the Ishikawa tab
    When the Ishikawa wizard returns a populated fishbone
    Then I should see the bone "PEOPLE"
    And I should see the bone "PROCESS"
    And I should see the bone "EQUIPMENT"
    And I should see the bone "MATERIALS"
    And I should see the bone "ENVIRONMENT"
    And I should see the bone "MANAGEMENT"

  Scenario: Ishikawa output renders the effect header
    Given I am on the Ishikawa tab
    When the Ishikawa wizard returns a populated fishbone with effect "High defect rate"
    Then I should see "High defect rate" in the effect header

  Scenario: Ishikawa output renders top suspects section
    Given I am on the Ishikawa tab
    When the Ishikawa wizard returns a result with top suspects
    Then I should see the heading "TOP SUSPECTS"

  Scenario: Ishikawa reset clears inputs and hides output
    Given I am on the Ishikawa tab
    And the Ishikawa output is visible
    When I click "CLEAR"
    Then the "ishikawa-output" element should be hidden
    And the "ishikawa-effect" input should be empty

  # ── PDCA ────────────────────────────────────────────────────────────────────

  Scenario: PDCA panel renders title
    Given I am on the PDCA tab
    Then I should see the panel title "PDCA"

  Scenario: PDCA submit with no goal shows a warning and makes no API call
    Given I am on the PDCA tab
    When I click "BUILD PDCA CYCLE" with no input
    Then I should see a warning message
    And no API call should be made

  Scenario: PDCA output renders all four phase headings
    Given I am on the PDCA tab
    When the PDCA wizard returns a complete cycle
    Then I should see the heading "PLAN"
    And I should see the heading "DO"
    And I should see the heading "CHECK"
    And I should see the heading "ACT"

  Scenario: PDCA output renders the hypothesis block
    Given I am on the PDCA tab
    When the PDCA wizard returns a complete cycle with a hypothesis
    Then I should see the heading "HYPOTHESIS"

  Scenario: PDCA reset clears inputs and hides output
    Given I am on the PDCA tab
    And the PDCA output is visible
    When I click "CLEAR"
    Then the "pdca-output" element should be hidden
    And the "pdca-goal" input should be empty

  # ── VSM ─────────────────────────────────────────────────────────────────────

  Scenario: VSM panel renders title
    Given I am on the Value Stream Map tab
    Then I should see the panel title "Value Stream Map"

  Scenario: VSM submit with no input shows a warning and makes no API call
    Given I am on the Value Stream Map tab
    When I click "MAP THE STREAM" with no input
    Then I should see a warning message
    And no API call should be made

  Scenario: VSM output renders summary stats block
    Given I am on the Value Stream Map tab
    When the VSM wizard returns a result with estimated waste
    Then I should see "ESTIMATED WASTE" in "vsm-result"
    And I should see "VALUE-ADD STEPS" in "vsm-result"

  Scenario: VSM output renders step cards tagged as value-add or waste
    Given I am on the Value Stream Map tab
    When the VSM wizard returns steps including a non-value-add step
    Then I should see a step card tagged "WASTE" in "vsm-result"

  Scenario: VSM output renders improvement opportunities
    Given I am on the Value Stream Map tab
    When the VSM wizard returns improvements
    Then I should see the heading "IMPROVEMENT OPPORTUNITIES"

  Scenario: VSM reset clears inputs and hides output
    Given I am on the Value Stream Map tab
    And the VSM output is visible
    When I click "CLEAR"
    Then the "vsm-output" element should be hidden

  # ── DORA ────────────────────────────────────────────────────────────────────

  Scenario: DORA panel renders title
    Given I am on the DORA Metrics tab
    Then I should see the panel title "DORA Metrics"

  Scenario: DORA submit with incomplete dropdowns shows a warning and makes no API call
    Given I am on the DORA Metrics tab
    When I click "ASSESS MY DORA BAND" with no dropdowns selected
    Then I should see a warning message
    And no API call should be made

  Scenario: DORA submit with all dropdowns selected triggers the API
    Given I am on the DORA Metrics tab
    When I select all four DORA metric dropdowns
    And the API returns a valid DORA result
    And I click "ASSESS MY DORA BAND"
    Then the "dora-output" element should be visible

  Scenario Outline: DORA overall band renders with the correct label
    Given I am on the DORA Metrics tab
    When the DORA wizard returns overall band "<band>"
    Then I should see the band label "<label>" in "dora-result"

    Examples:
      | band   | label  |
      | elite  | ELITE  |
      | high   | HIGH   |
      | medium | MEDIUM |
      | low    | LOW    |

  Scenario: DORA output renders all four metric cards
    Given I am on the DORA Metrics tab
    When the DORA wizard returns a complete result
    Then I should see "DEPLOYMENT FREQUENCY" in "dora-result"
    And I should see "LEAD TIME FOR CHANGES" in "dora-result"
    And I should see "CHANGE FAILURE RATE" in "dora-result"
    And I should see "TIME TO RESTORE" in "dora-result"

  Scenario: DORA output renders the top action block
    Given I am on the DORA Metrics tab
    When the DORA wizard returns a complete result with a top action
    Then I should see "SINGLE MOST IMPORTANT ACTION" in "dora-result"

  Scenario: DORA reset clears dropdowns and hides output
    Given I am on the DORA Metrics tab
    And the DORA output is visible
    When I click "CLEAR"
    Then the "dora-output" element should be hidden
    And the "dora-df" dropdown should be reset to empty
