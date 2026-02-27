Feature: Generator — generate a profane phrase from categories

  The Profani-Generator creates a profane phrase from up to 3 categories and an intensity.
  Category 3 is optional — selecting None still generates successfully.
  The AGAIN button regenerates without resetting the selected categories.

  Background:
    Given the app is loaded
    And a valid API key is saved
    And the Generator panel is open

  Scenario: Generating a phrase from 3 categories shows a result with scores
    Given I select "Cheese" from the Cat1 dropdown
    And I select "Royalty" from the Cat2 dropdown
    And I select "Weather" from the Cat3 dropdown
    And "nuclear" is selected as the intensity
    When I click GENERATE
    Then a generated phrase is displayed
    And I see 7 score bars labelled "Impactful", "Insulting", "Creative", "Bizarre", "Tuneful", "Rhythmical", "Comedy"

  Scenario: Cat3 set to None still generates successfully
    Given I select "Animal" from the Cat1 dropdown
    And I select "Cheese" from the Cat2 dropdown
    And I select "None" from the Cat3 dropdown
    And "medium" is selected as the intensity
    When I click GENERATE
    Then a generated phrase is displayed

  Scenario: AGAIN regenerates without resetting the selected categories
    Given I select "Cheese" from the Cat1 dropdown
    And I select "Royalty" from the Cat2 dropdown
    And I select "Weather" from the Cat3 dropdown
    And "strong" is selected as the intensity
    And I click GENERATE
    When I click AGAIN
    Then a generated phrase is displayed
    And "Cheese" is still selected in the Cat1 dropdown
    And "Royalty" is still selected in the Cat2 dropdown
    And "Weather" is still selected in the Cat3 dropdown
