# Domain-Driven Design — Principles
# Heckler and Cox
# Last updated: 2026-02-28
# Reference: Eric Evans — Domain-Driven Design (2003)
# Reference: Vaughn Vernon — Implementing Domain-Driven Design (2013)
# Practices: see .claude/practices/ubiquitous-language.md, bounded-contexts.md

---

## The Core Insight

Software complexity comes from the domain, not the technology.
The primary job of a developer is to model the domain accurately.
If the model is wrong, no amount of clean code fixes the product.

---

## Ubiquitous Language

A shared language between domain experts and developers, used in all communication —
conversations, Gherkin, code, documentation — without translation.

Rod is the domain expert. His words are the law.
When Rod says "panel member" the code says panel member.
When the code diverges from Rod's language, the model has drifted from the domain.

The test: can Rod read a function name and know immediately what it does?
If not, rename it.

---

## Bounded Contexts

A bounded context is a boundary within which a model is consistent and unambiguous.
The same word can mean different things in different contexts — that is not a problem,
it is a feature of a well-bounded system.

Each context has its own model, its own language, its own rules.
Contexts communicate through well-defined interfaces, never through shared state.

---

## Domain Events

Something meaningful that happened in the domain. Past tense. Observable.
Not "triggerFired" — "linguisticTriggerFired".
Not "stateUpdated" — "intensityDecayed".

Domain events are the vocabulary of what the system does, not how it does it.
They belong in the domain layer, not the infrastructure layer.

---

## Aggregates

A cluster of domain objects treated as a single unit for data changes.
One aggregate root controls access to everything inside it.
External objects hold references only to the root, never to internals.

Aggregates enforce invariants — rules that must always be true.
"Intensity never goes below baseline" is an invariant. The aggregate enforces it.

---

## Anti-Corruption Layer

A translation layer between your domain and external systems.
External systems have their own language (Anthropic API: messages, roles, tokens).
The anti-corruption layer translates — your domain never learns the external language.

---

## Why This Matters for Our Project

The panel conversation system is a domain problem, not a technical problem.
The scoring dimensions are domain concepts, not database columns.
The irony framework is a domain model, not an algorithm.

Getting the domain model right makes everything else simpler.
Getting it wrong means fighting the code every session.
