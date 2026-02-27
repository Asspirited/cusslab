Feature: Settings — API key management

  The Settings panel lets users save their Anthropic API key.
  After saving, the input must show the new key — not revert to the old one.
  The key must persist across panel navigation.

  Background:
    Given the app is loaded with no saved API key

  Scenario: Saving a valid API key shows a success confirmation
    Given the Settings panel is open
    When I type "sk-ant-test-abc123" into the API key input
    And I click Save
    Then I see "✓ Key saved! The panel is now connected."

  @bug6
  Scenario: After saving, the input shows the new key — not the old one
    # Bug 6: the old implementation reverted input.value to the previous key after save.
    # The Then step reads the observable input.value — the only thing Rod can see in the browser.
    Given "sk-ant-old-key-xyz" is already saved
    And the Settings panel is open
    When I type "sk-ant-new-key-abc" into the API key input
    And I click Save
    Then the API key input value is "sk-ant-new-key-abc"

  Scenario: Saving an empty key shows a validation error and no success message
    Given the Settings panel is open
    And the API key input is empty
    When I click Save
    Then I see a validation error
    And I do not see "✓ Key saved! The panel is now connected."

  Scenario: Settings panel shows the current key when one is already saved
    Given "sk-ant-existing-key-999" is already saved
    When I navigate to the Settings panel
    Then the API key input value is "sk-ant-existing-key-999"

  Scenario: Saved key persists after navigating away and back
    Given the Settings panel is open
    When I type "sk-ant-persist-key-456" into the API key input
    And I click Save
    And I click the Localiser nav item
    And I click the Settings nav item
    Then the API key input value is "sk-ant-persist-key-456"
