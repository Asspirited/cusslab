Feature: IT Consultant — consultify a corporate phrase

  The Profani-IT Consultant rewrites corporate speak through a chosen persona.
  Five personas are available, each producing distinct language.
  The devastation level controls output intensity.

  Background:
    Given the app is loaded
    And a valid API key is saved
    And the IT Consultant panel is open

  Scenario: Consultifying a phrase shows an output
    Given I type "we need to leverage our synergies" into the corporate phrase input
    And I select "The Wilde Consultant" as the persona
    And I select "Nuclear" as the devastation level
    When I click CONSULTIFY
    Then a consultified output is displayed

  Scenario Outline: All 5 personas can be selected and produce an output
    Given I type "we need to leverage our synergies" into the corporate phrase input
    And I select "<persona>" as the persona
    When I click CONSULTIFY
    Then a consultified output is displayed

    Examples:
      | persona               |
      | The Wilde Consultant  |
      | The Agile Evangelist  |
      | The LinkedIn Guru     |
      | The McKinsey Man      |
      | The Startup Bro       |
