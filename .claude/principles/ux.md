# User-Centric Design — Principles
# Heckler and Cox
# Last updated: 2026-02-28
# Reference: Don Norman — The Design of Everyday Things (2013)
# Reference: Steve Krug — Don't Make Me Think (2014)
# Reference: Clayton Christensen — Jobs to Be Done
# Practices: see .claude/practices/ux-decisions.md

---

## The Core Insight

People don't use products. They hire products to do a job.
Understanding the job determines every design decision.
A feature that serves no job is waste, however well implemented.

---

## Jobs to Be Done (Christensen)

Users hire Heckler and Cox to feel understood.
To have someone say what they cannot say in the meeting.
To puncture pomposity with precision and wit.

**Primary job:** "When I'm drowning in buzzwords, help me feel sane again."
**Secondary job:** "Give me something genuinely funny to share with my team."

Every feature either serves these jobs or it doesn't belong.

---

## Norman's Design Principles

**Affordances** — what an object suggests it can do.
Good affordances need no instruction. Bad affordances need documentation.
If it needs a tooltip, the label is wrong.

**Feedback** — the system communicates what it is doing.
Every action must produce an immediate, observable response.
Silent failures are the worst UX failure. No swallowed errors. No spinning forever.

**Constraints** — limit what can go wrong.
The best constraint prevents a class of errors from being possible.
Removing the API key input field is a constraint. Users cannot enter a wrong key
because there is no field to enter it in.

**Mapping** — controls relate naturally to their effects.
Left-to-right from safe to unsafe for profanity modes.
Regional flags map to cultural calibration. No translation required.

**Discoverability** — users can find all features without instruction.
The test: can a new user discover the core value in under 60 seconds?

---

## Krug's First Law

"Don't make me think."

Every moment a user spends puzzling over the interface is a UX failure.
Clever design that requires explanation is not clever — it is expensive.
The best interface is the one the user never notices.

---

## The Norman Door Test

A Norman Door is a door you push when you should pull, or pull when you should push.
It is well-made but poorly designed. The design contradicts the affordance.

Ask of every UI element: is this a Norman Door?
Does it look like it does one thing but do another?
Does it require the user to remember something rather than recognise it?

---

## Principle of Least Surprise

The system should always do what the user expects.
If it surprises the user, the model is wrong.
Surprises that delight are features. Surprises that confuse are bugs.

---

## Why UX Is Not a Phase

UX is not something applied to a finished product.
It is present in every architectural decision, every error message, every label.
"Users entering API keys is absolutely horrific" (Rod, 2026-02-27) is a UX principle expressed as a gut reaction.
The Cloudflare Worker is the UX solution.
The gut reaction came first because good UX instinct precedes good UX reasoning.
