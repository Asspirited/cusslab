# Heckler & Cox — Waste Log

> Lean waste tracking. Every entry: item, symptom, suspected cause, tags, status.
> **Mandatory:** Claude Code commits a new entry at every session end, even on disconnect.
> Location in repo: `.claude/practices/waste-log.md`

---

## Schema

| Field | Description |
|---|---|
| **Item** | What was lost, wasted, or went wrong |
| **Symptom** | How we noticed |
| **Suspected cause** | Root cause hypothesis |
| **Session** | Approximate date |
| **Time lost** | Estimated session time consumed (minutes / hours) |
| **Cost impact** | Token cost estimate or relative rating: `Low` / `Medium` / `High` |
| **Delay** | Features or deliverables pushed, and by how many sessions |
| **Tags** | For filtering and correlation |
| **Status** | `open` / `mitigated` / `closed` |

---

## Tag Taxonomy

`#knowledge-loss` — insight or decision not persisted to repo
`#conways-law` — friction from claude.ai / Claude Code product boundary
`#false-progress` — work appeared complete but contained hidden bugs
`#regression` — working feature broken by subsequent change
`#context-recovery` — session time spent reconstructing prior work
`#summarisation-loss` — detail lost in claude.ai lossy session summaries
`#repeated-work` — same work done more than once
`#yak-shaving` — tooling/infrastructure work instead of product work
`#api-friction` — Anthropic product/billing issues consuming session time
`#character-loss` — character profile dropped between sessions
`#save-rod-money` — any waste that costs tokens unnecessarily

---

## Entries

---

### WL-001
**Item:** Ivan/Bales IPA insight lost between sessions
**Symptom:** Flagged as "unactioned, worth a conversation" in session notes; unrecoverable at next session start despite search
**Suspected cause:** Conversational insights not committed to repo. Lived only in transcript, which gets lossy summarisation. No persistent insight store existed.
**Session:** ~2026-03-03
**Time lost:** ~20 min (search attempts + reconstruction)
**Cost impact:** Medium — multiple search tool calls + reconstruction tokens
**Delay:** 1 session — Bales/Ivan metric work pushed to next session
**Tags:** `#knowledge-loss` `#summarisation-loss` `#save-rod-money`
**Status:** mitigated — waste-log.md now exists; session-end commit rule added

---

### WL-002
**Item:** Professor Cox and Butch Harmon character profiles lost
**Symptom:** Profiles had to be reconstructed from conversation search at session start, consuming significant tokens and time
**Suspected cause:** Character profiles existed only in conversation history, not committed to repo files. Summarisation dropped detail.
**Session:** ~2026-03-02
**Time lost:** ~45 min (search + reconstruction + verification)
**Cost impact:** High — repeated conversation_search calls, full profile regeneration
**Delay:** ~1 session of feature work lost to recovery
**Tags:** `#character-loss` `#conways-law` `#repeated-work` `#save-rod-money`
**Status:** mitigated — character profiles now in repo; domain-model.md is source of truth

---

### WL-003
**Item:** Save Rod Money Protocol created reactively rather than proactively
**Symptom:** Multiple sessions of token waste before the protocol was formalised
**Suspected cause:** No upfront working agreement about session hygiene. Waste accumulated until frustration triggered a fix.
**Session:** ~2026-03-02
**Time lost:** Unknown — distributed across multiple sessions before identification
**Cost impact:** High — cumulative across all pre-protocol sessions
**Delay:** Estimated 2-3 sessions of feature work displaced by recovery work
**Tags:** `#save-rod-money` `#knowledge-loss` `#repeated-work`
**Status:** mitigated — protocol in memory and repo

---

### WL-004
**Item:** JSDOM migration broke live application
**Symptom:** End of session: live app non-functional. Required git archaeology and revert at start of next session.
**Suspected cause:** Architectural change (mock runner → JSDOM) made without sufficient BDD coverage of existing behaviour. False confidence from passing mocks.
**Session:** ~2026-02-27
**Time lost:** ~2 hours (end of session + full following session recovery)
**Cost impact:** High — full session consumed on revert and archaeology
**Delay:** 1 full session of feature work lost
**Tags:** `#regression` `#false-progress` `#yak-shaving`
**Status:** closed — reverted; BDD-first rule now mandatory

---

### WL-005
**Item:** Bug 6 — API key save revert
**Symptom:** Users' pasted API keys reverted to showing old masked key after saving. Multiple fix attempts failed before root cause found.
**Suspected cause:** Mock-based test runner could not test real DOM state. Tests were green against mocks while real behaviour was broken. False progress.
**Session:** ~2026-02-27
**Time lost:** ~90 min across multiple fix attempts
**Cost impact:** High — repeated debugging cycles, each generating significant tokens
**Delay:** Unblocked only after root cause found; contributed to JSDOM migration (which caused WL-004)
**Tags:** `#false-progress` `#regression`
**Status:** closed — root cause identified; JSDOM mandate introduced (then itself caused regression — see WL-004)

---

### WL-006
**Item:** Cloudflare Workers implementation abandoned mid-session
**Symptom:** Rod created Cloudflare account then became too frustrated with unclear UI instructions to continue. Session ended without deliverable.
**Suspected cause:** Insufficient pre-session scoping. Implementation started without a clear step-by-step path. UI friction in Cloudflare dashboard not anticipated.
**Session:** ~2026-02-27
**Time lost:** ~45 min
**Cost impact:** Medium — session tokens spent with zero shipped output
**Delay:** API key security still unresolved; feature deferred indefinitely
**Tags:** `#yak-shaving` `#save-rod-money`
**Status:** open — Cloudflare Worker as API proxy still unimplemented; deferred pending product priority decision

---

### WL-007
**Item:** 3-4 hours of productive feature building followed by extended infrastructure-only sessions
**Symptom:** Rod explicitly noted "EVERY SINGLE INTERACTION since has been about fixing shit"
**Suspected cause:** Technical debt from false-progress sessions compounded. Each regression triggered a fix cycle that crowded out feature work.
**Session:** ~2026-02-27
**Time lost:** Estimated 4-6 hours across consecutive sessions
**Cost impact:** High — multiple full sessions consumed by infrastructure instead of features
**Delay:** Estimated 3-4 sessions of product work displaced
**Tags:** `#false-progress` `#regression` `#yak-shaving` `#save-rod-money`
**Status:** mitigated — BDD-first rule and pre-implementation checklist introduced

---

### WL-008
**Item:** Bush Tucker Man / Les Stroud confusion
**Symptom:** Wayne Riley's outback authority figure was written as Les Stroud (Survivorman, Canadian) rather than Bush Tucker Man (Les Hiddins, Australian army major)
**Suspected cause:** Claude confabulated a plausible but wrong answer rather than flagging uncertainty. Character wound detail not in domain-model.md at time of writing.
**Session:** Unknown — identified and corrected, now in memory
**Time lost:** Unknown — not caught immediately; correction cost unknown
**Cost impact:** Low (correction) but reputational risk to character integrity if shipped
**Delay:** None once identified — corrected in same session
**Tags:** `#character-loss` `#knowledge-loss` `#conways-law`
**Status:** closed — corrected in memory; rule added: never confuse these two

---

### WL-009
**Item:** Anthropic billing/support unresponsiveness consuming session energy
**Symptom:** Rod posted twice on Twitter/X and submitted in-app escalation with no response. Session time and emotional bandwidth consumed.
**Suspected cause:** External — Anthropic support responsiveness. Not within project control.
**Session:** ~2026-02-26
**Time lost:** ~1 hour across contact attempts and waiting
**Cost impact:** Medium — lost session momentum; Rod context-switched away
**Delay:** Unknown — session abandoned early
**Tags:** `#api-friction`
**Status:** open — external dependency

---

### WL-010
**Item:** Reactive framing clause labels (yes/and etc.) implemented as literal prompt words
**Symptom:** Characters begin turns with stilted or literal renderings of the clause labels, breaking voice consistency
**Suspected cause:** Implementation preceded proper design. Labels were structural instructions that got baked into prompts as surface text.
**Session:** ~2026-03-03 (identified, not yet fixed)
**Time lost:** Unknown — panels shipped with degraded voice quality for unknown number of runs
**Cost impact:** Medium — fix requires Gherkin + reimplementation across all character voice pools
**Delay:** Fix not yet started; 1 session minimum to implement properly
**Tags:** `#false-progress` `#character-loss` `#save-rod-money`
**Status:** open — fix designed this session, Gherkin not yet written

---

### WL-011
**Item:** Conversational insights routinely not committed to repo at session end
**Symptom:** Recurring pattern: insight flagged "worth a conversation later" → lost in summarisation → has to be reconstructed or is gone permanently
**Suspected cause:** No session-end commit checklist item for insights. Assumed summary would preserve them. It doesn't.
**Session:** Recurring across all sessions
**Time lost:** 20-45 min per occurrence (search + reconstruction or permanent loss)
**Cost impact:** High cumulative — affects every session
**Delay:** Each lost insight delays the work it would have informed by 1-2 sessions minimum
**Tags:** `#knowledge-loss` `#summarisation-loss` `#conways-law` `#save-rod-money`
**Status:** mitigated — this waste-log now exists; session-end rule: commit any unactioned insight here before closing

---

## Session-End Commit Rule

Claude Code MUST add a waste-log entry before every session closes, including on disconnect, covering:
- Any insight flagged "worth a conversation" or "unactioned"
- Any decision made but not yet implemented
- Any regression or unexpected behaviour observed
- Any friction that cost tokens or time

Entry format: copy schema above. Minimum viable entry is Item + Symptom + Tags + Status:open.

**File lives at:** `.claude/practices/waste-log.md`
**Committed to:** `origin/main` at session end, every session, no exceptions.
