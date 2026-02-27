Feature: Historian — translate a phrase through historical eras

  The Profani-Historian translates a phrase into the profanity of selected historical eras.
  Each selected era produces one row showing the era icon, era name, and translated phrase.
  Translated phrases begin with "↳ What was actually said:".

  Background:
    Given the app is loaded
    And a valid API key is saved
    And the Historian panel is open

  Scenario: Selecting one era and travelling returns a translated row
    Given I type "blimey guv" into the phrase input
    And I check the "Victorian" era
    When I click TRAVEL THROUGH TIME
    Then I see a row for "Victorian"
    And the "Victorian" row shows a phrase beginning with "↳ What was actually said:"

  Scenario: Selecting multiple eras returns one row per era
    Given I type "blimey guv" into the phrase input
    And I check the "Victorian" era
    And I check the "Medieval" era
    When I click TRAVEL THROUGH TIME
    Then I see a row for "Victorian"
    And I see a row for "Medieval"

  Scenario: Era icon appears even when the AI returns a lowercase era name
    # The spec explicitly requires case-insensitive icon lookup.
    # If the AI returns "victorian" instead of "Victorian", the icon must still appear.
    Given I type "blimey guv" into the phrase input
    And I check the "Victorian" era
    And the API will return the era name as "victorian"
    When I click TRAVEL THROUGH TIME
    Then the "Victorian" row shows an era icon
