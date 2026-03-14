Feature: Panel rating buttons coverage — BL-094
  Rating buttons must appear in all main conversation panels
  so user feedback reaches the self-training store from every panel.

  # ── Panels confirmed present before BL-094 ─────────────────────

  Scenario Outline: Pre-existing panels have rating buttons
    Then the "<panel>" panel has a panelRating feedback row

    Examples:
      | panel                 |
      | comedyroom            |
      | football              |
      | golf                  |
      | darts                 |
      | cricket               |
      | racing                |
      | snooker               |
      | hardmen               |
      | souness-cat           |
      | suntzu                |
      | philsopoly            |
      | premise-interrogation |
      | hip_hop               |

  # ── Panels added by BL-094 ──────────────────────────────────────

  Scenario Outline: BL-094 panels now have rating buttons
    Then the "<panel>" panel has a panelRating feedback row

    Examples:
      | panel          |
      | boardroom      |
      | roastroom      |
      | writingroom    |
      | housenameoracle|
      | ironic         |
      | professionals  |
