Feature: Settings panel — API key management

  Background:
    Given the application is loaded

  Scenario: Save key shows masked value in input on success
    Given no API key is stored
    And I am on the Settings tab
    When I paste "sk-ant-api03-ABCDEFGHIJKLMNOPQRSTUVWXYZ12345" into the key input
    And I click "Save Key"
    Then the key input shows "sk-ant-api03...2345"
    And the save message reads "✓ Key saved! The panel is now connected."
    And the stored key is "sk-ant-api03-ABCDEFGHIJKLMNOPQRSTUVWXYZ12345"

  Scenario: Save fails gracefully on input shorter than 21 characters
    Given no API key is stored
    And I am on the Settings tab
    When I paste "short-key" into the key input
    And I click "Save Key"
    Then the save message reads "✗ That key looks too short. Make sure you copied the whole thing."
    And no key is stored

  Scenario: Key input shows masked stored key when Settings tab opens
    Given API key "sk-ant-api03-STOREDKEYVALUE12345678901" is stored
    When I navigate to the Settings tab
    Then the key input shows "sk-ant-api03...8901"

  Scenario: Async status update does not overwrite input while user is focused on it
    Given API key "sk-ant-api03-OLDKEYABCDEFGHIJKLMNO0000" is stored
    And I am on the Settings tab with the key input focused
    When I clear the input and type "sk-ant-api03-NEWKEYABCDEFGHIJKLMNO9999"
    And updateKeyStatus fires from an async API completion
    Then the key input still contains "sk-ant-api03-NEWKEYABCDEFGHIJKLMNO9999"
