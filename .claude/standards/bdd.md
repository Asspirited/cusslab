# BDD Standards — Heckler and Cocks

*Non-negotiable. Applies to every feature, every session, every bug fix.*

---

## Where BDD came from

Dan North coined BDD in 2006, born from TDD being misunderstood. The core insight:
the word "test" was causing confusion. Replace "test" with "behaviour" and the
questions dissolve. What to name your test? A sentence describing the next behaviour.
How much to test? You can only describe so much behaviour in one sentence.

Given-When-Then came from North and Chris Matts applying this to requirements —
a ubiquitous language that analysts, testers, developers, and the business all share
without translation. A scenario's acceptance criteria IS its behaviour.

Gojko Adzic's 2020 survey of 514 teams found teams using examples as acceptance
criteria were nearly 3x more likely to rate product quality as "great" (22% vs 8%).
Automating those examples doubled it to 26%. This is not ceremony — it is the
highest-leverage quality practice available.

**The most important warning** (Seb Rose, quoted in Gojko's survey):
"I see far more people using G/W/T for test automation than to support BDD.
The BDD acronym has become synonymous with G/W/T powered tests — our BDDs are broken."
The formula does not do the work. The conversations do.

Rod Roden is co-author of Fifty Quick Ideas to Improve Your Tests (Adzic, Evans, Roden)
and Fifty Quick Ideas to Improve Your Retrospectives (Roden, Williams), and was quoted
in Gojko's 2020 survey as one of the practitioners who identified the G/W/T ritual problem.
These standards represent his views, applied to this project.

---

## ⛔ GHERKIN REVIEW GATE

**Before running the pipeline on any new or modified scenario:**

1. Output COMPLETE literal text of NEW and MODIFIED scenarios only
2. Do NOT show unchanged existing scenarios — state how many skipped
3. Format: "NEW/MODIFIED SCENARIOS FOR APPROVAL — [N] total, [N] unchanged and skipped:"
4. Print: "WAITING FOR ROD'S APPROVAL — do not proceed until Rod confirms"
5. STOP. Do not run pipeline. Do not fix code. Do not commit.
6. Wait for Rod to explicitly type "approved" or give feedback
7. Only proceed after explicit written approval in this session

Unchanged scenarios from previous sessions do not need re-approval.
If ALL scenarios are unchanged, state this and proceed without stopping.

---

## The 8 BDD Principles

**1. Collaboration (Three Amigos)**
Every scenario agreed between dev (Claude Code), product (Rod), QA (pipeline)
before implementation. Rod is the business stakeholder. A scenario Rod hasn't
seen is not valid. The conversation producing the scenario is more valuable
than the scenario itself.

**2. Ubiquitous Language**
Use Rod's words, not code words.
"Save API key" not "setKey()". "Ask The Panel" not "callAPI()".
If a scenario reads like code, rewrite it.
Rod must understand it without explanation.

**3. Behaviour Over Implementation**
Scenarios describe what the user sees and does, never how the code achieves it.
A scenario referencing function names describes implementation, not behaviour.
The implementation is free to change. The behaviour is the contract.

**4. Given-When-Then — mandatory**
- Given  — initial context (what is already true)
- When   — single action taken (one action per scenario only)
- Then   — expected result (what the user observes)
The formula is a structure to stimulate good thinking, not a guarantee of it.
A badly written Given-When-Then is worse than no scenario — it creates false confidence.

**5. Living Documentation**
Scenarios are the source of truth for what the product does.
Updated when behaviour changes — NEVER deleted to make the pipeline pass.
Deleting a failing scenario to get to green is the single most destructive act
in this codebase.

**6. Outside-In Development**
Start from user-facing behaviour (what Rod sees), work inward to implementation.
The scenario defines the contract. The code fulfils it. Never the other way around.
Gherkin is the FIRST artefact — not a test written after the fact.

**7. One Scenario, One Behaviour**
Single, independent, clear behaviour per scenario.
If it needs "and also" to describe what it tests — split it.
Compound scenarios hide failures and make root cause analysis harder.

**8. Iterative and Incremental**
Small scenarios, rapid feedback, continuous delivery.
A scenario taking more than one session to pass is too large — split it.

---

## Good vs Bad Scenarios

```gherkin
# GOOD — Rod's language, observable behaviour, single action
Scenario: User sees actionable message when API key is rejected
  Given an invalid API key is saved
  When I click Ask The Panel
  Then I should see "API key rejected — check your key in Settings"
  And I should not see "unavailable"

# BAD — code internals, not user behaviour
Scenario: setKey() validates key length
  When setKey() is called with a string shorter than 20 chars
  Then it should return false
```

---

## Feature file structure

```gherkin
Feature: [capability in Rod's language]

  Background:
    Given the application is loaded with a clean state
    And [any other universal precondition for this feature]

  Scenario: [happy path — what works]
    Given [specific context beyond background]
    When [single user action]
    Then [observable result]

  Scenario: [failure path — what doesn't work]
    Given [context]
    When [action that should fail]
    Then [observable error message or state]
```

---

## Done conditions — a feature is not done until

- At least one Gherkin scenario passes
- Happy path covered
- At least one failure/error path covered
- Scenario existed BEFORE the code
- Rod has read the literal scenario text in this session
- Rod has explicitly typed "approved"
- Pipeline is GREEN

---

## Pending scenarios are debt

Count must decrease each session. Never increase without a plan.
Pending is not a placeholder. It is unfinished work.

---

## From Fifty Quick Ideas to Improve Your Tests

Key ideas most applicable to Gherkin quality:

- **Focus on key examples** — one happy path, one failure, one edge case is usually enough. More than five scenarios for a single feature is a smell.
- **Contrast with counter-examples** — for every "this works" scenario, write "this fails".
- **Describe what, not how** — THE most important rule. Observable outcomes only.
- **Avoid mathematical formulas** — scenarios must be readable by Rod without decoding logic.
- **Explore capabilities, not features** — "User can save API key and it persists" is a capability. "setKey() stores to localStorage" is not.
- **Test benefit as well as implementation** — if Rod wouldn't notice it breaking, question whether the test adds value.

The meta-principle: tests are not a safety net bolted on after development.
They are the primary communication tool between what the product should do
and what it actually does. When written after code, that channel is broken.
Every session must move one step closer to tests that specify, not confirm.
