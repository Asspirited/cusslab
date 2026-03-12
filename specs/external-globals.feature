Feature: Pipeline: runtime browser test for external-script window globals — BL-118
  External scripts set window globals that the pipeline cannot detect as missing
  using static analysis alone. If a script throws at load time, its global is never
  set — the app silently breaks. This check executes each script in a Node vm context
  and asserts the expected global is present afterward.

  Background:
    Given the external scripts are executed in a browser-like context

  Scenario: QuntumLeeksEngine global is set after script execution
    Then window.QuntumLeeksEngine is defined

  Scenario: FFEngine global is set after script execution
    Then window.FFEngine is defined

  Scenario: PubCrawlScenes global is set after script execution
    Then window.PubCrawlScenes is defined

  Scenario: PubNavigatorEngine global is set after script execution
    Then window.PubNavigatorEngine is defined

  Scenario: External scripts load in dependency order
    Then window.PubNavigatorEngine depends on window.PubCrawlScenes and window.FFEngine which are already defined
