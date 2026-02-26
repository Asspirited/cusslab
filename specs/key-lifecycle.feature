Feature: API key lifecycle — storage, display, and clearing

  Background:
    Given the application is loaded

  Scenario: Clear key removes stored key and empties input
    Given API key "sk-ant-api03-STOREDKEYVALUE12345678901" is stored
    And I am on the Settings tab
    When I click "Clear Key"
    Then no key is stored
    And the key input shows ""

  Scenario: Header indicator shows no-key state after clear
    Given API key "sk-ant-api03-STOREDKEYVALUE12345678901" is stored
    And I am on the Settings tab
    When I click "Clear Key"
    Then the header indicator state is "no-key"

  Scenario: Saving a key persists it across status updates
    Given no API key is stored
    And I am on the Settings tab
    When I paste "sk-ant-api03-ABCDEFGHIJKLMNOPQRSTUVWXYZ12345" into the key input
    And I click "Save Key"
    And updateKeyStatus fires from an async API completion
    Then the stored key is "sk-ant-api03-ABCDEFGHIJKLMNOPQRSTUVWXYZ12345"
