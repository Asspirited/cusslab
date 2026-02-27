Feature: Localiser — localise a phrase to a regional dialect

  The Profani-Localiser translates a phrase into regional profanity.
  Both phrase and region are required — missing either fires Hippo's Law.
  Output includes a localised phrase, 7 score bars, a bell meter, and emoji feedback.

  Background:
    Given the app is loaded
    And the Localiser panel is open

  Scenario: Localising a phrase with a region set returns a result with scores
    Given a valid API key is saved
    When I type "bloody hell" into the phrase input
    And I select "Yorkshire, UK" from the region dropdown
    And I click LOCALISE IT
    Then a localised phrase is displayed
    And I see 7 score bars labelled "Impactful", "Insulting", "Creative", "Bizarre", "Tuneful", "Rhythmical", "Comedy"
    And the bell meter displays a label

  Scenario: Missing phrase triggers Hippo's Law
    When I select "Yorkshire, UK" from the region dropdown
    And I click LOCALISE IT
    Then the Hippo's Law banner shows "🦛 HIPPO'S LAW: Don't be a Cunt"

  Scenario: Missing region triggers Hippo's Law
    When I type "bloody hell" into the phrase input
    And I click LOCALISE IT
    Then the Hippo's Law banner shows "🦛 HIPPO'S LAW: Don't be a Cunt"

  Scenario: Hippo's Law banner disappears after 5 seconds
    When I click LOCALISE IT
    And 5 seconds pass
    Then the Hippo's Law banner is not visible

  Scenario: Selecting an emoji shows the acknowledgement message
    When I click the 😂 emoji feedback button
    Then I see "Noted. We'll ignore it."
    And the 😂 emoji feedback button is highlighted in gold

  Scenario: Selecting a different emoji deselects the previous one
    When I click the 💩 emoji feedback button
    And I click the 😂 emoji feedback button
    Then the 😂 emoji feedback button is highlighted in gold
    And the 💩 emoji feedback button is not highlighted
