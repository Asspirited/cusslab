@claude
Feature: AARRR metrics instrumentation
  As the product owner
  I want a session object tracking panel runs, feature touches,
  turd ratings, and feedback
  So that I can answer basic questions about who uses the app
  and which features land

  Background:
    Given the page has loaded
    And HCSession module has initialised

  # ─── SESSION INITIALISATION ──────────────────────────────────────────────────

  Scenario: Session object initialises on page load
    When the page loads
    Then a unique sessionId is generated
    And startTime records the load timestamp
    And referrer is captured from document.referrer
    And hc-first-visit is written to localStorage if not present
    And hc-visit-count is incremented in localStorage
    And isReturn is true if visitCount > 1

  # ─── PANEL RUN EVENTS ────────────────────────────────────────────────────────

  Scenario: Panel run event fires on each panel run
    Given a panel run completes
    When the panel's discuss() function ends
    Then a panel run event is logged: panelType, turnCount, timestamp
    And the event is appended to session.panelRuns
    And sessionDepth increments
    And a Plausible panel_run event fires

  # ─── TURD BUTTON WIRING ──────────────────────────────────────────────────────

  Scenario: Turd buttons appear after Golf, Football, and Comedy Room panels
    Given a panel run has completed
    Then four rating buttons are visible below the responses:
      💩 (1), 😐 (2), 😂 (3), 🤣 (4)
    And an Ask us button appears alongside

  Scenario: Turd button click logs rating and animates
    Given a turd button is clicked
    When panelRating fires
    Then the rating is logged to session.turdRatings with panelType
    And the button briefly scales up (pulse animation)
    And a brief thank-you indicator appears (500ms)
    And a Plausible turd_rating event fires

  # ─── ASK US BUTTON ───────────────────────────────────────────────────────────

  Scenario: Ask us button prompts for message and stores it
    Given the Ask us button is clicked
    When the user submits a non-empty message
    Then the message is logged to session.feedback with timestamp and panelType
    And stored in localStorage under feedback:[timestamp]
    And a "Got it — thank you" toast appears

  # ─── EXPORT ──────────────────────────────────────────────────────────────────

  Scenario: Manual export button downloads session JSON
    Given the Export session data button is clicked
    When exportSessionData() fires
    Then a JSON file is downloaded: hc-session-[id]-[date].json
    And the file includes the full session object and AARRR snapshot

  Scenario: Session is saved to localStorage on page unload
    Given the user closes or navigates away
    When beforeunload fires
    Then the full session object is written to localStorage
      under session:[sessionId]

  # ─── AARRR SNAPSHOT ──────────────────────────────────────────────────────────

  Scenario: getAARRRSnapshot returns structured metrics
    When getAARRRSnapshot() is called
    Then it returns:
      acquisition: referrer and isNewSession
      activation: ranPanel, firstFeature, timeToFirstRun
      retention: isReturn, visitCount, daysSinceFirst
      revenue: isPowerUser (panelRuns >= 3), sessionDepth
      feedback: turdCount, avgRating, feedbackCount

  # ─── PLAUSIBLE INTEGRATION ───────────────────────────────────────────────────

  Scenario: Plausible script tag is present in head
    Then the page head contains the Plausible script tag
    And data-domain is "asspirited.cusslab.io"
    And the script is deferred

  Scenario: Plausible custom events fire on key actions
    Then panel_run fires with panelType property on each panel run
    And feature_touch fires with feature property on first use
    And turd_rating fires with rating property on each rating
