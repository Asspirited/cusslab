Feature: Session atmosphere selector — all panels
  The atmosphere selector lets users tune the room's emotional temperature
  before a session. One selection applies across all panels via sessionStorage.
  Introduced on Golf Q&A; now replicated to Football, Darts Q&A, and LongRoom Q&A.

  Background:
    Given index.html is parsed

  # ── Shared schema object ──────────────────────────────────────────────────────

  Scenario: PANEL_SCHEMAS shared constant is defined
    Then index.html contains "const PANEL_SCHEMAS"
    And index.html contains "SIMMERING"
    And index.html contains "POWDER_KEG"
    And index.html contains "CHAOS_MODE"
    And index.html contains "BLOODBATH"
    And index.html contains "FUNNY_PECULIAR"
    And index.html contains "DEEP_WOUNDS"

  # ── Selector HTML presence ────────────────────────────────────────────────────

  Scenario: Atmosphere selector container exists in Football Q&A view
    Then index.html contains "fb-atmo-cards"

  Scenario: Atmosphere selector container exists in Darts Q&A view
    Then index.html contains "dt-atmo-cards"

  Scenario: Atmosphere selector container exists in LongRoom Q&A view
    Then index.html contains "lr-atmo-cards"

  Scenario: Golf atmosphere selector container still exists
    Then index.html contains "gf-atmo-cards"

  # ── Shared render and select functions ───────────────────────────────────────

  Scenario: renderAllAtmoSelectors is defined
    Then index.html contains "function renderAllAtmoSelectors"

  Scenario: selectAtmo saves to sessionStorage
    Then index.html contains "function selectAtmo"
    And index.html contains "hc_atmosphere"

  # ── discuss() injection — structural ─────────────────────────────────────────

  Scenario: Football discuss() reads hc_atmosphere and injects roundNote
    Then index.html contains "hc_atmosphere"
    And the Football IIFE contains "roundNote"

  Scenario: Darts discuss() reads hc_atmosphere and injects roundNote
    Then index.html contains "hc_atmosphere"
    And the Darts IIFE contains "roundNote"

  Scenario: LongRoom discuss() reads hc_atmosphere and injects roundNote
    Then index.html contains "hc_atmosphere"
    And the LongRoom IIFE contains "roundNote"

  # ── Behavioural — manual ─────────────────────────────────────────────────────

  @claude
  Scenario: BLOODBATH atmosphere produces noticeably more hostile output
    Given sessionStorage "hc_atmosphere" is set to "BLOODBATH"
    When a question is submitted to any panel
    Then the panel responses are measurably more hostile and intense
    Than the same question submitted under "NORMAL" atmosphere

  @claude
  Scenario: FUNNY_PECULIAR atmosphere redirects aggression sideways
    Given sessionStorage "hc_atmosphere" is set to "FUNNY_PECULIAR"
    When a question is submitted to Football
    Then characters deflect into absurdity rather than direct conflict

  @claude
  Scenario: Atmosphere selection persists visually across panels in same session
    Given the user selects "Powder Keg" on the Golf panel
    When the user navigates to the Football panel Q&A
    Then the Football atmosphere selector shows "Powder Keg" as active
