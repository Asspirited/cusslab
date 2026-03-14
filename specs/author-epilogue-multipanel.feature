Feature: Author Epilogue — multi-panel (BL-083/084/085/086)
  The Author's Account button appears after panel responses in Darts,
  Cricket, Oracle, and Boardroom so the author pool is accessible from
  every main panel.

  Scenario Outline: Author epilogue button present in panel output
    When the "<panel>" panel HTML is loaded
    Then the "<panel>" output area contains an author epilogue button
    And the author epilogue button calls the "<panel>" author epilogue function

    Examples:
      | panel     |
      | darts     |
      | cricket   |
      | oracle    |
      | boardroom |

  Scenario: Panel epilogue context functions are exported from logic
    Then logic exports buildDartsAuthorContext
    And logic exports buildCricketAuthorContext
    And logic exports buildOracleAuthorContext
    And logic exports buildBoardroomAuthorContext
