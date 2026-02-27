Feature: Scoring — bell meter thresholds and score bar rendering

  The scoring engine maps AI-returned numbers to labelled score bars
  and a threshold-based bell meter label.
  All scoring output is observed through the Localiser panel.

  Background:
    Given the app is loaded
    And a valid API key is saved
    And the Localiser panel is open
    And the phrase input contains "test phrase"
    And "Yorkshire, UK" is selected in the region dropdown

  Scenario Outline: Bell meter shows the correct label for each score range
    Given the API will return a bell score of <score>
    When I click LOCALISE IT
    Then the bell meter shows "<label>"

    Examples:
      | score | label            |
      | 10    | Wet lettuce      |
      | 35    | Barely offensive |
      | 60    | Getting there    |
      | 75    | On fire          |
      | 90    | MAXIMUM BELL!    |

  Scenario: All 7 score bars are shown after a result
    Given the API will return scores for all dimensions
    When I click LOCALISE IT
    Then I see score bars for "Impactful", "Insulting", "Creative", "Bizarre", "Tuneful", "Rhythmical", and "Comedy"
