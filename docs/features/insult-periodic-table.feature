Feature: Insult Periodic Table — element selection and synthesis via Worker

  Scenario: Synthesis request is routed to the Worker, not Anthropic directly
    Given insult-periodic-table.html source is examined
    Then the fetch URL is "https://cusslab-api.leanspirited.workers.dev"
    And the URL "https://api.anthropic.com" does not appear in the fetch call

  Scenario: Synthesis request uses haiku model
    Given insult-periodic-table.html source is examined
    Then the model field is "claude-haiku-4-5-20251001"
