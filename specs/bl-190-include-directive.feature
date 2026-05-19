Feature: Cross-panel character include directive (BL-190 v1 — The Don)
  As the panel author
  I want to type `>include the don` in any panel question and have Peter
  Alliss appear in that round — as anchor by default, or as a panellist
  via a `panel` suffix
  So that I can summon a Golf-native character into any panel for one
  round of comedy without permanent roster changes

  Background:
    Given the Heckler and Cox panel system is loaded
    And the file "characters/alliss.md" exists

  # ── Parser ─────────────────────────────────────────────────────────────────

  Scenario: Bare directive parses as anchor with handle the don
    Then parsing ">include the don" yields handle "the don" and mode "anchor"

  Scenario: Explicit anchor suffix parses as anchor
    Then parsing ">include the don anchor" yields handle "the don" and mode "anchor"

  Scenario: Explicit panel suffix parses as panel slot
    Then parsing ">include the don panel" yields handle "the don" and mode "panel"

  Scenario: Parser is case-insensitive on the directive prefix
    Then parsing ">INCLUDE THE DON" yields handle "the don" and mode "anchor"

  Scenario: Parser strips the directive from the question before model send
    Then a question "What is the worst club in the bag? >include the don" sent to a panel produces a model input that does not contain ">include the don"

  Scenario: Question without a directive parses as no include
    Then parsing "What is the worst club in the bag?" yields no include directive

  Scenario: Malformed suffix parses as no include directive
    Then parsing ">include the don sideways" yields no include directive

  # ── Handle map ─────────────────────────────────────────────────────────────

  Scenario: The handle map registers the don as Alliss
    Then the include handle map resolves "the don" to character id "alliss"

  Scenario: Unknown handle resolves to null
    Then the include handle map resolves "tiger" to null

  # ── Anchor mode effect ────────────────────────────────────────────────────

  Scenario: Anchor mode places Alliss at the anchor opener slot for that round
    Given the Football panel is the host panel
    When a question is asked with directive ">include the don"
    Then Alliss appears at slot 0 in the round MEMBERS order

  Scenario: Anchor mode places Alliss at the anchor closer slot for that round
    Given the Football panel is the host panel
    When a question is asked with directive ">include the don"
    Then Alliss appears at the final slot in the round MEMBERS order

  Scenario: Anchor mode displaces the host panel's existing anchor for that round
    Given the Football panel is the host panel with anchor "souness"
    When a question is asked with directive ">include the don anchor"
    Then "souness" does not appear at slot 0 or the final slot in that round

  # ── Panel mode effect ─────────────────────────────────────────────────────

  Scenario: Panel mode places Alliss in a non-anchor slot for that round
    Given the Football panel is the host panel with anchor "souness"
    When a question is asked with directive ">include the don panel"
    Then Alliss appears in the round MEMBERS order but not at slot 0 or the final slot

  Scenario: Panel mode keeps the host panel's existing anchor in place
    Given the Football panel is the host panel with anchor "souness"
    When a question is asked with directive ">include the don panel"
    Then "souness" still appears at slot 0 and the final slot in that round

  # ── Persistence ───────────────────────────────────────────────────────────

  Scenario: The include effect lasts one question only
    Given the Football panel ran a round with directive ">include the don"
    When the next question is asked without an include directive
    Then Alliss does not appear in the new round's MEMBERS order
    And "souness" appears at slot 0 and the final slot of the new round

  # ── Cross-panel ───────────────────────────────────────────────────────────

  Scenario: Include works in the Football panel
    Given the Football panel is the host panel
    When a question is asked with directive ">include the don"
    Then Alliss appears in that round's MEMBERS order

  Scenario: Include works in the Cricket panel
    Given the LongRoom panel is the host panel
    When a question is asked with directive ">include the don"
    Then Alliss appears in that round's MEMBERS order

  Scenario: Include works in the Boardroom panel
    Given the Boardroom panel is the host panel
    When a question is asked with directive ">include the don"
    Then Alliss appears in that round's MEMBERS order

  # ── Voice and exemplars ──────────────────────────────────────────────────

  Scenario: Alliss uses his own character-file voice
    Then the Alliss prompt sent to the model is sourced from "characters/alliss.md"

  Scenario: Guest Alliss inherits the host panel's exemplars not Golf's
    Given the Football panel is the host panel
    When a question is asked with directive ">include the don"
    Then the system prompt for Alliss in that round contains Football PANEL_EXEMPLARS
    And the system prompt for Alliss in that round does not contain Golf PANEL_EXEMPLARS

  # ── Privacy gate ──────────────────────────────────────────────────────────

  Scenario: Include trigger requires the Alliss test flag
    Given localStorage "hc_allow_alliss_test" is unset
    When a question is asked with directive ">include the don"
    Then Alliss does not appear in that round's MEMBERS order
    And the host panel's normal MEMBERS order is used unchanged

  Scenario: Include trigger fires when the Alliss test flag is set
    Given localStorage "hc_allow_alliss_test" is "1"
    When a question is asked with directive ">include the don"
    Then Alliss appears in that round's MEMBERS order
