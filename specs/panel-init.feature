Feature: Application initialisation — modules load and key status renders

  Background:
    Given the application is loaded

  Scenario: Settings tab shows empty input when no key is stored
    Given no API key is stored
    When I navigate to the Settings tab
    Then the key input shows ""

  Scenario: Settings tab shows masked key when key is stored
    Given API key "sk-ant-api03-INITKEYABCDEFGHIJKLMNO1234" is stored
    When I navigate to the Settings tab
    Then the key input shows "sk-ant-api03...1234"

  Scenario: Header indicator reflects stored key presence
    Given API key "sk-ant-api03-INITKEYABCDEFGHIJKLMNO1234" is stored
    When the key status is updated
    Then the header indicator state is "key-present"

  Scenario: Header indicator reflects absent key
    Given no API key is stored
    When the key status is updated
    Then the header indicator state is "no-key"
