# BDD — Practices
# Heckler and Cox
# Last updated: 2026-02-28
# Principles: see .claude/principles/xp.md, ddd.md
# Reference: Gojko Adzic — BDD Books (2018-2021)
# Reference: Dan North — "Introducing BDD" (2006)
# Reference: Tom Roden et al — Fifty Quick Ideas to Improve Your Tests (2015)

---

## ⛔ GHERKIN REVIEW GATE — NON-NEGOTIABLE

Before running the pipeline on any new or modified scenario:
1. Output COMPLETE literal text of every new or modified scenario
2. Print: "WAITING FOR ROD'S APPROVAL — do not proceed until Rod confirms"
3. STOP. Do not run pipeline. Do not fix code. Do not commit.
4. Wait for Rod to explicitly type "approved" or give feedback
5. Only proceed after explicit written approval in this session

**Previous session approval does not count.**
**A scenario Rod has not read in this session has not been approved.**

---

## The 8 BDD Principles

1. **Collaboration** — every scenario agreed before implementation. Rod is the business stakeholder.
2. **Ubiquitous Language** — Rod's words, not code words. "Save API key" not "setKey()".
3. **Behaviour Over Implementation** — what the user sees, never how the code achieves it.
4. **Given-When-Then** — mandatory. One action per scenario only.
5. **Living Documentation** — never deleted to make the pipeline pass.
6. **Outside-In Development** — Gherkin is the FIRST artefact. Always.
7. **One Scenario, One Behaviour** — if it needs "and also", split it.
8. **Iterative and Incremental** — a scenario taking more than one session to pass is too large.

---

## Good Scenario vs Bad Scenario

**BAD — tests implementation:**
```gherkin
When setKey() is called with the input value
Then localStorage.setItem is called with "apiKey"
```

**GOOD — tests observable behaviour:**
```gherkin
When the user pastes a key and clicks Save
Then the key field shows the masked key on next load
```

The Then step must test what the user sees. Never what the code does internally.

---

## Done Conditions — A Feature Is Not Done Until

- Scenario existed BEFORE the code
- Rod has read the literal scenario text in this session
- Rod has explicitly typed "approved"
- Pipeline is GREEN with the scenario passing

---

## Pending Scenarios Are Debt

Count must decrease or hold each session.
It must never increase without explicit agreement.
A pending scenario is a promise to the product that has not been kept.

---

## Three Amigos — Who Does What

Rod: business stakeholder — defines what behaviour is needed and why
Claude: developer — challenges edge cases, flags technical constraints, writes the Gherkin
Both: agree the scenario text before Rod types "approved"

The Three Amigos conversation happens in plain language BEFORE Gherkin is written.
If you cannot explain the behaviour in plain language, you do not understand it yet.

---

## Scenario Template

```gherkin
Feature: [name from Rod's vocabulary]
  As a [role from domain]
  I want [observable behaviour]
  So that [business value]

  Background: (optional — shared setup only)
    Given [precondition]

  Scenario: [one specific behaviour]
    Given [context]
    When [one action]
    Then [observable outcome]
    And [additional observable outcome if needed]
```

---

## Approved Gherkin Awaiting Code (as of 2026-02-28)

28 scenarios approved across three features:
1. Cloudflare Worker (7) — full text in retrospectives/session-retro-2026-02-28.md
2. Irony Authenticity (11) — full text in retrospectives/session-retro-2026-02-28.md
3. Panel Character State (10) — full text in retrospectives/session-retro-2026-02-28.md
