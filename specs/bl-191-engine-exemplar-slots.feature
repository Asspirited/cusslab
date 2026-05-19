Feature: Panel-discuss engine exemplar slots (BL-191 — generalisation, no panel bleed)
  As a panel architect
  I want every leaky meta-block in src/logic/panel-discuss-engine.js to
  pull its worked examples from a per-panel PANEL_EXEMPLARS config rather
  than from golf-pundit names baked into the engine source
  So that a Football turn is taught with Football examples, a Cricket turn
  with Cricket examples, and so on — and no panel's prompt contains another
  panel's character names by accident

  Background:
    Given the file "src/logic/panel-discuss-engine.js" exists

  # ── Engine source — no hardcoded character names ──────────────────────────

  Scenario: Engine source does not name Faldo
    Then "src/logic/panel-discuss-engine.js" does not contain "Faldo"

  Scenario: Engine source does not name Murray
    Then "src/logic/panel-discuss-engine.js" does not contain "Murray"

  Scenario: Engine source does not name McGinley
    Then "src/logic/panel-discuss-engine.js" does not contain "McGinley"

  Scenario: Engine source does not name Souness
    Then "src/logic/panel-discuss-engine.js" does not contain "Souness"

  Scenario: Engine source does not name Sebastian
    Then "src/logic/panel-discuss-engine.js" does not contain "Sebastian"

  Scenario: Engine source does not name Bruce Lee
    Then "src/logic/panel-discuss-engine.js" does not contain "Bruce Lee"

  Scenario: Engine source does not contain the 19th Hole watershed reference
    Then "src/logic/panel-discuss-engine.js" does not contain "19th Hole watershed"

  # ── Engine accepts panelExemplars ─────────────────────────────────────────

  Scenario: buildSystemPrompt accepts a panelExemplars parameter
    Then "src/logic/panel-discuss-engine.js" buildSystemPrompt signature accepts a "panelExemplars" field on ctx

  Scenario: Engine substitutes exemplar slots in the IDIOM block
    Then the IDIOM INVENTION block uses a slot placeholder for misquote examples
    And the IDIOM INVENTION block uses a slot placeholder for bastardise examples
    And the IDIOM INVENTION block uses a slot placeholder for invent examples

  Scenario: Engine substitutes exemplar slots in the PANEL CONSENSUS block
    Then the PANEL CONSENSUS block uses a slot placeholder for the consensus chain examples

  Scenario: Engine substitutes exemplar slots in the CROSS-CHARACTER PARODY block
    Then the CROSS-CHARACTER PARODY block uses a slot placeholder for the parody worked example

  Scenario: Engine substitutes exemplar slots in the REVERENT ABSURDITY block
    Then the REVERENT ABSURDITY block uses a slot placeholder for the reference moment

  Scenario: Engine substitutes exemplar slots in the INCONGRUENT REGISTER block
    Then the INCONGRUENT REGISTER block uses a slot placeholder for the register exemplars

  # ── Per-panel PANEL_EXEMPLARS declarations ───────────────────────────────

  Scenario: Football declares PANEL_EXEMPLARS
    Then the Football panel section of index.html declares "FOOTBALL_PANEL_EXEMPLARS"

  Scenario: Golf declares PANEL_EXEMPLARS
    Then the Golf panel section of index.html declares "GOLF_PANEL_EXEMPLARS"

  Scenario: Cricket declares PANEL_EXEMPLARS
    Then the LongRoom panel section of index.html declares "CRICKET_PANEL_EXEMPLARS"

  Scenario: Darts declares PANEL_EXEMPLARS
    Then the Darts panel section of index.html declares "DARTS_PANEL_EXEMPLARS"

  Scenario: Snooker declares PANEL_EXEMPLARS
    Then the Snooker panel section of index.html declares "SNOOKER_PANEL_EXEMPLARS"

  Scenario: HipHop declares PANEL_EXEMPLARS
    Then the HipHop panel section of index.html declares "HIPHOP_PANEL_EXEMPLARS"

  Scenario: Racing declares PANEL_EXEMPLARS
    Then the Racing panel section of index.html declares "RACING_PANEL_EXEMPLARS"

  Scenario: ComedyRoom declares PANEL_EXEMPLARS
    Then the ComedyRoom panel section of index.html declares "COMEDY_PANEL_EXEMPLARS"

  Scenario: Boardroom declares PANEL_EXEMPLARS
    Then the Boardroom panel section of index.html declares "BOARDROOM_PANEL_EXEMPLARS"

  # ── PANEL_EXEMPLARS shape ────────────────────────────────────────────────

  Scenario: Each PANEL_EXEMPLARS declares all five required slot groups
    Then every PANEL_EXEMPLARS const declares keys for "idiomInvention", "panelConsensus", "crossCharacterParody", "reverentAbsurdity", and "incongruentRegister"

  Scenario: Football PANEL_EXEMPLARS contains no golf character names
    Then FOOTBALL_PANEL_EXEMPLARS does not contain "Faldo"
    And FOOTBALL_PANEL_EXEMPLARS does not contain "Murray"
    And FOOTBALL_PANEL_EXEMPLARS does not contain "McGinley"

  Scenario: Cricket PANEL_EXEMPLARS contains no golf character names
    Then CRICKET_PANEL_EXEMPLARS does not contain "Faldo"
    And CRICKET_PANEL_EXEMPLARS does not contain "Murray"
    And CRICKET_PANEL_EXEMPLARS does not contain "McGinley"

  Scenario: Golf PANEL_EXEMPLARS retains its own character names
    Then GOLF_PANEL_EXEMPLARS contains at least one of "Faldo", "Murray", or "McGinley"

  # ── Rendered prompts — no cross-panel bleed ──────────────────────────────

  Scenario: A Football turn system prompt contains no golf character names
    Then a built Football turn system prompt does not contain "Faldo"
    And a built Football turn system prompt does not contain "Murray"
    And a built Football turn system prompt does not contain "McGinley"

  Scenario: A Cricket turn system prompt contains no golf character names
    Then a built Cricket turn system prompt does not contain "Faldo"
    And a built Cricket turn system prompt does not contain "Murray"

  Scenario: A Darts turn system prompt contains no golf character names
    Then a built Darts turn system prompt does not contain "Faldo"
    And a built Darts turn system prompt does not contain "Murray"

  Scenario: A Golf turn system prompt still includes Golf exemplars (regression guard)
    Then a built Golf turn system prompt contains at least one of "Faldo", "Murray", or "McGinley"

  # ── Guest character (BL-190) inherits host exemplars ─────────────────────

  Scenario: Guest Alliss in Football uses Football exemplars not Golf
    Given the Football panel is the host panel
    And the include directive ">include the don" fires for the round
    Then Alliss's built system prompt for that round contains FOOTBALL_PANEL_EXEMPLARS examples
    And Alliss's built system prompt for that round does not contain GOLF_PANEL_EXEMPLARS examples
