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
**Status:** closed — labels removed; behavioural definitions added to all panels (COMMIT 1, 924c40c)

---

### WL-012
**Item:** No user metrics instrumentation from day one
**Symptom:** Cannot answer basic questions — how many users, which features used, is quality improving, what do users think
**Suspected cause:** Product built feature-first with no measurement layer. AARRR framework was discussed early (session ~2026-02-25) but never implemented beyond concept.
**Session:** Identified ~2026-03-03
**Time lost:** Unknown — every session since launch has been flying blind on user behaviour
**Cost impact:** High — product decisions made without data; no way to prioritise features by actual usage
**Delay:** Metrics layer implementation now queued; estimated 1-2 sessions to implement properly
**Tags:** `#knowledge-loss` `#false-progress` `#save-rod-money`
**Status:** closed — HCSession module, turd buttons, Plausible, AARRR snapshot implemented (COMMIT 9, 2745f87)

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

### WL-013
**Item:** docs/ character files drift from index.html inline prompts
**Symptom:** docs/ files describe character prompts correctly; index.html member.prompt strings are independent hardcoded copies. A docs/ change does NOT propagate to the live app without a separate explicit wiring commit.
**Suspected cause:** Single-file architecture (index.html) means there's no import mechanism. docs/ was built as a design reference, not a runtime source. No process enforces sync.
**Session:** 2026-03-03
**Time lost:** Unknown — any docs/ edit made in confidence it was "live" was silently ineffective
**Cost impact:** Medium — character voice improvements made to docs/ are invisible until separately wired
**Delay:** Any docs/ edit needs a companion index.html edit to ship
**Tags:** `#knowledge-loss` `#false-progress` `#save-rod-money`
**Status:** open — no automatic sync; manual wiring required per character update

---

### WL-014
**Item:** Cross-character wound awareness deeply asymmetric across panels
**Suspected cause:** Characters built at different times with different levels of cross-referencing. Golf characters built later (Dougherty, McGinley) have rich named cross-references; earlier characters (Roy, Radar) have none. Boardroom Roy has zero named character references in his inline prompt.
**Symptom:** Roy responds to wound-bait with generic precision rather than named counter-attacks. Radar similarly thin. Layer 2 (character knowing the other characters' wounds) not implemented for early-built characters.
**Session:** 2026-03-03
**Time lost:** Unknown — quality ceiling on these panels until fixed
**Cost impact:** Medium — requires careful prompt editing per character, high risk of voice regression
**Delay:** Deferred — B1 relationship state implemented first as Layer 1 foundation
**Tags:** `#character-loss` `#false-progress` `#save-rod-money`
**Status:** closed — CROSS-WOUND AWARENESS blocks implemented for all 7 characters: Radar, Coltart, Murray, Henni (Golf) + Harold, Sebastian, Roy (Boardroom)

---

### WL-015
**Item:** B1 implementation session — context-loss mid-implementation (summary triggered during pipeline fix)
**Symptom:** Summary triggered while diagnosing @claude tag pipeline failure. Correct root cause (zero-indent @claude required at file level) identified in transcript but not acted on before context reset.
**Suspected cause:** Long session with large index.html edits consumed context window. Transcript preserved correct analysis so recovery was fast (one read of gherkin-runner.js to confirm fix).
**Session:** 2026-03-03
**Time lost:** ~10 min recovery at session resumption
**Cost impact:** Low — transcript preserved; fix was straightforward
**Delay:** None — B1 shipped in same session
**Tags:** `#summarisation-loss` `#context-recovery` `#save-rod-money`
**Status:** closed — pipeline green; B1 committed (6985455)

---

### WL-016
**Item:** ConspireEngine absent at launch — six-panel sessions ran with no conspiracy detection
**Symptom:** Roe/Coltart pair, Radar/Faldo asymmetry, Montgomerie pre-loads all existed as design intent but no arc ever triggered. Panels behaved as if relationships were flat.
**Suspected cause:** Character mechanics designed before infrastructure. ConspireEngine was queued as "next sprint" but the queue had no enforcement mechanism.
**Session:** 2026-03-03
**Time lost:** Unknown — all sessions prior to this one ran without conspiracy arcs
**Cost impact:** Medium — character tension mechanics were present in prompts but structurally inert
**Delay:** Conspiracy arc shipped this session (COMMIT 7a, 8898c92)
**Tags:** `#false-progress` `#character-loss` `#save-rod-money`
**Status:** closed — ConspireEngine implemented and wired to Golf discuss() (8898c92); Roe/Coltart pair profile added (2915213)

---

### WL-017
**Item:** Butch Harmon absent from Golf panel at launch — coaching eye, schooling, wind-up mechanics never ran
**Symptom:** Golf panel was described as having Butch from early sessions; he appeared in docs/characters-sports.md with full profile. His member.prompt in index.html was a stub with no mechanic definitions.
**Suspected cause:** Character profile in docs/ never wired to index.html inline prompt (see WL-013 — docs/index drift). Butch was "present" in docs but mechanically absent in the live panel.
**Session:** 2026-03-03
**Time lost:** Unknown — all Golf sessions ran without coaching eye, Murray schooling, or Faldo wind-up
**Cost impact:** Medium — significant character depth missing from every Golf run
**Delay:** Full Butch mechanics shipped this session (COMMIT 8, 4453488)
**Tags:** `#character-loss` `#false-progress` `#knowledge-loss` `#save-rod-money`
**Status:** closed — pre-loaded diagnoses, Murray schooling, Faldo wind-up, renewable laugh all implemented (4453488)

---

### WL-018
**Item:** Numbering gap — entry never written
**Symptom:** Log jumps from WL-017 to WL-019. No WL-018 exists.
**Suspected cause:** Numbering error during session 2026-03-03 — WL-019 was likely written as the immediate follow-on to WL-017 and misnumbered.
**Status:** Gap documented. Sequence continues from WL-021.

---

### WL-019
**Item:** Faldo chuckle spec incorrectly described as scheduled trigger
**Symptom:** Chuckle mechanic written as firing on any panel banter — should only fire on genuine surprise, specific topics (food), or reliable named triggers (Guinness World Record entry)
**Suspected cause:** Over-specification in claude.ai session, not validated against character truth before writing
**Session:** 2026-03-03
**Time lost:** 1 exchange
**Cost impact:** Low — caught before implementation
**Delay:** None — corrected in same session
**Tags:** `#character-loss` `#false-progress`
**Status:** closed — corrected in COMMIT 6 spec

---

### WL-020
**Item:** Roe/Radar wound 3 contained invented detail ("blank him tomorrow")
**Symptom:** Character wound included exaggerated user paraphrase as if it were documented fact
**Suspected cause:** Claude did not flag uncertainty about source material, accepted user framing uncritically
**Session:** 2026-03-03
**Time lost:** 1 exchange
**Cost impact:** Low — caught before implementation
**Delay:** None — corrected same session
**Tags:** `#character-loss` `#confabulation`
**Status:** closed — corrected before COMMIT 4 paste

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

### WL-021
- **Item:** Claude Code output always collapsing — repeated across session
- **Symptom:** grep/find/search results returned as collapsible blocks, requiring ctrl+o which only works once and is nested — Rod cannot read output
- **Suspected cause:** Claude.ai repeatedly giving bare grep/find commands instead of piping to file and catting. Claude Code search tool used instead of bash. No persistent memory of this rule between sessions.
- **Session:** 138
- **Time lost:** ~20 mins this session
- **Cost impact:** Direct — wasted API calls and Rod's time
- **Delay:** Blocked reading @claude tag coverage analysis
- **Tags:** process-failure, tooling, claude-code-commands
- **Status:** Rule added to memory. All future commands must pipe to /tmp/out.txt and cat.

## WL-022
- **Item:** Claude Code ignoring bash commands, defaulting to search tool
- **Symptom:** grep/find commands executed as search not bash — output collapsed, unreadable, blocks all file content work
- **Suspected cause:** New Claude Code release broken on Windows — bash tool not executing correctly
- **Session:** 138
- **Time lost:** ~30 mins
- **Cost impact:** Direct — blocked @claude tag analysis, blocked Gherkin planning
- **Delay:** New Gherkin files deferred to next session
- **Tags:** process-failure, tooling, claude-code-release, windows
- **Status:** Open — Claude Code bash execution broken, no workaround available tonight

## WL-023
- **Item:** Claude Code bash execution broken — search tool used instead of terminal throughout session
- **Symptom:** Every grep/find command executed as search, returning collapsed unreadable output. Prefix "Run this as a bash command" ignored. Multiple retries wasted per command.
- **Suspected cause:** New Claude Code release broken on Windows — bash tool not executing correctly in this version
- **Session:** 176
- **Time lost:** ~45 mins
- **Cost impact:** Direct — blocked @claude tag analysis, multiple failed attempts per command, Rod had to use WSL terminal directly
- **Delay:** Quantum Leeks diagnosis delayed ~30 mins, @claude tag coverage analysis never completed via Claude Code
- **Tags:** process-failure, tooling, claude-code-release, windows
- **Status:** Open — Claude Code bash execution broken, workaround is WSL terminal directly

## WL-024
- **Item:** Rod caught waste and asked for log entry — should have been proactive
- **Symptom:** Two separate occasions this session where Rod had to explicitly ask for waste to be logged
- **Suspected cause:** Claude not applying proactive waste identification rule consistently
- **Session:** 176
- **Time lost:** ~5 mins
- **Cost impact:** Minor direct, major trust
- **Delay:** None
- **Tags:** process-failure, claude-behaviour
- **Status:** Rule reinforced in memory. Must not recur.

## WL-025
- **Item:** Claude Code committed twice without pushing — changes sat local only
- **Symptom:** App appeared unchanged on live site after two commits. git log showed origin/main 2 commits behind HEAD.
- **Suspected cause:** Claude Code violated the PUSH rule — pipeline GREEN = commit + push. Committed 130a777 and 4b68f5b without pushing either.
- **Session:** 176
- **Time lost:** ~10 mins debugging apparent non-fix
- **Cost impact:** Direct — wasted diagnosis time, unnecessary web search
- **Delay:** Quantum Leeks fix not live until manual push from WSL
- **Tags:** process-failure, push-rule, claude-code
- **Status:** Pushed manually. Rule already in CLAUDE.md — Claude Code not applying it.

## WL-026
- **Item:** Claude Code committed without pushing — again
- **Symptom:** Commit 8c9bc3d local only until manual WSL push
- **Suspected cause:** Same as WL-025 — Claude Code not applying PUSH rule after green pipeline
- **Session:** 176
- **Time lost:** ~5 mins
- **Cost impact:** Direct
- **Delay:** Fix not live until manual push
- **Tags:** process-failure, push-rule, claude-code, recurring
- **Status:** Pushed manually. Recurring — needs escalating to Claude Code instruction set

## WL-027
- **Item:** Round state not injected into golf panel prompts
- **Symptom:** Characters had no knowledge of which round they were in; 5-round arcs were dead code
- **Suspected cause:** Round tracking built for roast battle never extended to golf panel
- **Session:** golf-round-tracker
- **Time lost:** ~20 mins investigation
- **Cost impact:** Low — discovery was systematic not accidental
- **Delay:** Round-based escalation non-functional since golf panel built
- **Tags:** golf, round-state, prompt-injection, dead-code
- **Status:** Fixed — af6cde3

## WL-028
- **Item:** Claude lost project context mid-session
- **Symptom:** Rod had to re-explain Heckler and Cox project state, characters, and recent work at session start
- **Suspected cause:** Memory system has recency bias and may not have captured last session's outputs; recent_chats not run or failed to surface relevant context
- **Session:** 2026-03-05
- **Time lost:** ~5 mins
- **Cost impact:** Wasted API calls re-establishing context
- **Delay:** Yes
- **Tags:** context-loss, memory, session-start-protocol
- **Status:** Mitigated by mandatory session-start protocol — ensure recent_chats is always run first

## WL-029
- **Item:** Claude lost project context and repeated canonical spelling error
- **Symptom:** Claude called project "Quantum Leaps" and "Quantum Leeks" multiple times in session despite explicit corrections; had to re-establish project context from scratch; Claude Code also missed renaming specs/quantum-leeks.feature when renaming all other files
- **Suspected cause:** Memory system recency bias failing to surface recent_updates; Claude defaulting to training data pattern ("Quantum Leap" TV show) overriding explicit memory entries; Claude Code rename sweep incomplete
- **Session:** 2026-03-05
- **Time lost:** ~1.5 hours cumulative (1hr spelling, 0.5hr context re-establishment)
- **Cost impact:** High — repeated re-explanation, wasted tokens, incomplete file rename requiring manual fix
- **Delay:** Yes
- **Tags:** naming, memory-failure, repeat-error, canonical-spelling, context-loss, session-start-protocol, file-rename
- **Status:** Open — canonical spelling logged as CRITICAL FAILURE in memory; session-start protocol must include recent_chats before any work

## WL-030
- **Item:** Claude Code collapsing output behind ctrl+o
- **Symptom:** git push output, file reads, and command results hidden in collapsible blocks — claude.ai cannot read them, Rod has to relay manually
- **Suspected cause:** Claude Code defaulting to collapsed display for long output despite CLAUDE CODE OUTPUT RULE in STANDARDS.md
- **Session:** 2026-03-05
- **Time lost:** ~20 mins this session
- **Cost impact:** Medium — repeated relay requests, broken flow
- **Delay:** Yes
- **Tags:** output, claude-code, collapsible, waste, standards-violation
- **Status:** Open — CLAUDE CODE OUTPUT RULE must be reinforced at session start with Claude Code explicitly

## WL-031
- **Item:** Gherkin produced without scenario outlines — had to be rewritten
- **Symptom:** First pass used flat scenarios with no Examples tables — Rod caught it immediately
- **Suspected cause:** Pattern-matched "write Gherkin" and skipped skill check; also failed to apply scenario outline structure despite per-character variation being obvious from the domain model
- **Session:** 2026-03-05
- **Time lost:** ~15 mins rewrite
- **Cost impact:** Low-medium
- **Delay:** Yes
- **Tags:** gherkin, bdd, waste, skill-check, standards-violation
- **Status:** Closed — rewritten with scenario outlines and Examples tables per character

## WL-034
- **Item:** Feature file content missing from Claude Code paste — behaviour-triggers.feature
- **Symptom:** Claude Code received domain-model append but not the feature file content — one extra round trip required
- **Suspected cause:** Large paste split at claude.ai message boundary — feature file content referenced as "above" but did not arrive
- **Session:** Emotional model slices 1–5
- **Time lost:** ~5 minutes
- **Cost impact:** 1 wasted exchange
- **Delay:** Minor
- **Tags:** paste-boundary, claude-ai-to-claude-code, large-paste
- **Status:** Logged — always include feature file content inline not by reference

## WL-035
- **Item:** 90-minute waste session — new Claude Code instance didn't realise it was Claude Code in WSL
- **Symptom:** The instance behaved as if it were claude.ai chat — suggested Python heredocs and sed commands for the user to run manually instead of using its own file editing tools; kept proposing shell one-liners with broken escaping; user had to stop the session and open a fresh instance
- **Suspected cause:** Unclear session initialisation — the instance did not identify itself as Claude Code with WSL filesystem access; defaulted to advisory/chat mode instead of acting as an agent
- **Session:** 2026-03-05
- **Time lost:** ~90 minutes
- **Cost impact:** High — entire session wasted
- **Delay:** Yes
- **Tags:** claude-code, wsl, agent-mode, session-startup, waste
- **Status:** Logged — always open Claude Code from WSL with `cd ~/cusslab && claude`; verify at session start that the instance can read files directly (use Read tool, not ask user to paste)

## WL-036
- **Item:** Worker proxying OpenAI not Anthropic — never tested, never noticed
- **Symptom:** All AI tab calls returning 400 for months; worker.js comment said "proxies requests to OpenAI API"; secret was OPENAI_API_KEY not ANTHROPIC_API_KEY
- **Suspected cause:** worker.js generated incorrectly at some point and deployed without a live test
- **Session:** 2026-03-05
- **Time lost:** ~30 mins diagnosis
- **Cost impact:** Medium — Rod bought $5 credits unnecessarily early in diagnosis
- **Delay:** Yes
- **Tags:** worker, cloudflare, openai, anthropic, untested-deploy
- **Status:** Closed — worker rewritten to proxy Anthropic directly; live tested via curl before commit

## WL-037
- **Item:** Two different Cloudflare accounts causing wrong worker URL in index.html
- **Symptom:** Wrangler CLI deployed to cusslab.workers.dev; dashboard showed leanspirited.workers.dev; secret set on cusslab account; index.html pointed at leanspirited — mismatch caused auth failures
- **Suspected cause:** Wrangler logged into different Cloudflare account than browser session; never verified post-deploy URL against index.html ENDPOINT constant
- **Session:** 2026-03-05
- **Time lost:** ~20 mins
- **Cost impact:** Low — one wasted API key rotation
- **Delay:** Yes
- **Tags:** cloudflare, wrangler, url-mismatch, accounts
- **Status:** Closed — always curl-test the worker URL after deploy before updating index.html; confirm wrangler and dashboard are same account

## WL-038
- **Item:** 33 hours total lost to authentication and API access friction — not a code problem
- **Symptom:** ~30 hours early in project: SSH setup, API key procurement, Anthropic unresponsive to emails and tweets, account verification delays. Additional 3 hours this session: wrong worker URL, wrong proxy target, key rotation, billing confusion.
- **Suspected cause:** Anthropic's onboarding and support is poor for independent developers. No acknowledgement of support requests. API key/billing system has no grace period or clear error messages. Cloudflare wrangler account isolation not surfaced until runtime.
- **Session:** Ongoing — 2026-02-xx through 2026-03-05
- **Time lost:** ~33 hours total (30 hours early project + 3 hours this session)
- **Cost impact:** High — significant lost momentum at project start; $5 credits purchased before diagnosis complete
- **Delay:** Yes — blocked feature delivery across multiple sessions
- **Tags:** authentication, api-keys, anthropic, ssh, cloudflare, onboarding, support-failure
- **Status:** Logged — no fix available; Anthropic support unresponsive; document as known project risk
