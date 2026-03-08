Feature: pipeline-report script
  As a session participant
  I want a single reusable script that runs the pipeline and reports the scorecard
  So that pipeline status never requires copy-pasted commands in session chat

  Background:
    Given the NVM environment is available at "/home/rodent/.nvm"
    And the cusslab repo is at "/home/rodent/cusslab"

  Scenario: script exists and is executable
    Given the repo is checked out
    When I check for ".claude/scripts/pipeline-report.sh"
    Then the file exists and is executable

  Scenario: NVM bootstrap is self-contained
    Given NVM is not loaded in the calling shell
    When I run ".claude/scripts/pipeline-report.sh"
    Then the script loads NVM internally
    And the pipeline runs without "nvm: command not found" errors

  Scenario Outline: script is callable from session protocol files
    Given "<caller>" references the script as "bash .claude/scripts/pipeline-report.sh"
    When the script runs
    Then output is written to "/tmp/out.txt"
    And the scorecard is readable without uploading a file

    Examples:
      | caller                          |
      | .claude/session-startup.md      |
      | .claude/session-insession.md    |
      | .claude/session-closedown.md    |

  @claude
  Scenario: pipeline passes — green scorecard reported
    Given all tests and Gherkin scenarios are passing
    When I run ".claude/scripts/pipeline-report.sh"
    Then the script exits with code 0
    And stdout contains a line matching "Tests: N/N passing"
    And stdout contains a line matching "Gherkin: N/N scenarios passing"
    And stdout contains a line matching "Canary: OK"
    And stdout contains a line matching "Coverage: statements N% | branches N%"

  @claude
  Scenario: pipeline fails — exit code signals RED
    Given one or more tests are failing
    When I run ".claude/scripts/pipeline-report.sh"
    Then the script exits with code 1
    And stdout contains "PIPELINE RED"

  @claude
  Scenario: canary is RED — flagged in scorecard
    Given the worker canary returns a non-200 response
    When I run ".claude/scripts/pipeline-report.sh"
    Then the script exits with code 1
    And stdout contains "Canary: RED"
