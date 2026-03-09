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

## WL-039
- **Item:** Panel verbosity regression — "3-4 paragraphs" in user prompt contradicted "Speeches are failure" in system prompt
- **Symptom:** Ask The Panel returning enormous blocks of text on first live test after worker was fixed
- **Suspected cause:** Prompt written without checking against existing CONVERSATION MECHANICS constraint; regression not caught by pipeline (no LLM output assertion)
- **Session:** 2026-03-05
- **Time lost:** ~15 mins diagnosis + Rod's API credits wasted on verbose responses
- **Cost impact:** Medium — every verbose response costs more tokens than necessary
- **Delay:** Minor
- **Tags:** verbosity, prompt, regression, panel, token-waste, permanent-constraint-violated
- **Status:** Closed — user prompt changed to "2-3 sentences, no speeches"; PERMANENT rule: never set paragraph counts in user prompts that contradict system prompt length constraints

## WL-040
- **Item:** ironic.feature written without reading it first in Three Amigos — caused duplicate/conflicting scenario risk
- **Symptom:** claude.ai had to ask Claude Code to paste the existing feature file before Three Amigos could proceed; middle two bands (Meatloaf Zone, Pure Alanis) have zero scenario coverage despite being implemented
- **Suspected cause:** 6 missing scenarios were noted in retro but never written; Three Amigos started from memory not from the actual file
- **Session:** 2026-03-05
- **Time lost:** ~10 mins
- **Cost impact:** Low
- **Delay:** Minor
- **Tags:** three-amigos, gherkin, ironic, feature-file, read-first
- **Status:** Logged — PERMANENT: always read the existing feature file at the start of Three Amigos before proposing any new scenarios

## WL-041
- **Item:** Mobile/tablet UI — nav tabs not prominent enough, users missing panels on banner scroll
- **Symptom:** Users not finding panels on small screens; left-hand nav pattern not present on mobile
- **Session:** 2026-03-06
- **Tags:** ux, mobile, tablet, navigation, three-amigos-pending
- **Status:** OPEN — Three Amigos required. Options: sticky sidebar (≥768px), bottom nav bar (mobile), larger tap targets. No code changes until Three Amigos completed.

## WL-043
- **Item:** blofeld.md missing from repo
- **Symptom:** git add of 9 character files — Claude Code flagged blofeld.md not present
- **Suspected cause:** file written in previous session but never committed, or lost during JSDOM migration git archaeology
- **Session:** 2026-03-06 Long Room character build
- **Time lost:** 0 — caught by Claude Code, not at runtime
- **Cost impact:** low — but Long Room panel will fail if Blofeld selected before file created
- **Delay:** blocks any panel run featuring Blofeld
- **Tags:** missing-file, character, blofeld, long-room
- **Status:** closed — blofeld-reference.md and blofeld-review-log.md created (60aa828)

## WL-044
- **Item:** claude.ai attempted 19th Hole slot assignments from memory instead of reading files
- **Symptom:** three "medium confidence" assignments for Henni, Coltart, Roe — requested grep to verify
- **Suspected cause:** egress proxy blocks raw.githubusercontent.com so character files not readable in claude.ai; claude.ai fell back to guessing
- **Session:** 2026-03-06 panel slots session
- **Time lost:** 1 exchange minimum, more if grep confirms guesses were wrong
- **Cost impact:** direct — Rod correctly called this out immediately
- **Delay:** blocks panel-slots.md 19th Hole table until files confirmed
- **Tags:** guessing, character-files, 19th-hole, slots, egress-proxy
- **Status:** CLOSED — fix confirmed: always grep index.html MEMBERS array for character data, never guess from memory

## WL-042
- **Item:** domain-model.md fetch blocked by egress proxy
- **Symptom:** PERMISSIONS_ERROR — URL not in allowed domains when attempting web_fetch of raw.githubusercontent.com in claude.ai session
- **Suspected cause:** Egress proxy whitelist does not include raw.githubusercontent.com
- **Session:** 2026-03-06 Long Room character build session
- **Time lost:** 1 exchange
- **Cost impact:** minimal
- **Delay:** none (Rod pasted file section; Claude Code had already updated the file directly)
- **Tags:** infrastructure, egress, domain-model
- **Status:** KNOWN LIMITATION — workaround is Rod pastes the file section, or Claude Code reads it directly via Read tool in Claude Code sessions

---

WL-045
Date: 2026-03-06
Type: Paste failure — placeholder not replaced
Cost: 2 exchanges
Description: Claude Code received the alliss.md commit paste twice with placeholder text ([paste the full alliss.md content here]) instead of actual content. File did not exist until third attempt when full content was provided inline. Root cause: claude.ai generated a paste instruction referencing content from earlier in the conversation rather than reproducing it explicitly. Fix: always reproduce file content inline in the paste, never reference it by pointer.

WL-019
Item: Session 475 — no waste
Symptom: N/A
Suspected cause: N/A
Session: 475
Time lost: 0
Cost impact: 0
Delay: 0
Tags: clean-session
Status: closed
Notes: Watching the Oche panel fully specced and committed in one session.
domain-model.md → Gherkin → 7 character files, in order, no drift.
Ron Atkinson Football panel wound specced and committed to domain-model.md.
Frankenstein wound (Bristow/Taylor), Crowd Pressure mechanic, dead-in-panel-world
rule (Bristow, Waddell) all in Gherkin before any implementation.

WL-030
Item: Plausible analytics — verification failure, two token swaps
Symptom: Plausible reports "We couldn't detect Plausible on your site"
Suspected cause: Domain registered as asspirited.cusslab.io (wrong), then re-registered as
  asspirited.github.io (correct host, wrong path). Plausible crawls the domain root;
  script lives at asspirited.github.io/cusslab/ (subpath). Auto-verification cannot work
  without a custom domain pointed at the subpath.
Session: 475
Time lost: 0.25
Cost impact: low
Delay: none — tracking still fires, verification is cosmetic
Tags: analytics, plausible, github-pages, subpath, config-error
Status: partially closed
Notes: Script is correctly installed and will track visitors. Auto-verification will always
  fail until a custom domain is added to the GitHub Pages repo and registered in Plausible.
  Root fix: add custom domain (e.g. cusslab.io), point GitHub Pages to it, re-register in
  Plausible against that domain. Until then: ignore verification warning, check dashboard
  for live data instead.
  Prevention: before touching analytics tokens, confirm the live URL and whether Plausible
  supports the path structure. Subpath GitHub Pages sites cannot be auto-verified.

---

### WL-022
**Item:** Quality tools panel (ACC, FMEA, 5 Whys, Ishikawa, PDCA, VSM, DORA + 4 backlog stubs) built into wrong project
**Symptom:** Rod asked for a side panel with quality tools. Claude Code fetched cusslab structure without confirming which project, assumed cusslab, built everything there. User intended RIA (risk-and-impact-assessor). Full session of work in wrong repo.
**Suspected cause:** No project confirmation step at feature request. When user described quality tools in a cusslab session, Claude assumed the work belonged there. Should have asked "which project?" before opening any file.
**Session:** 2026-03-06
**Time lost:** ~3 hours (nav groups, 7 wizard panels, 7 JS modules, 60 Gherkin scenarios, UI audit extension, skin tab fixes, sync script updates — all in wrong project)
**Cost impact:** High — full session of build work needs reverting from cusslab and redoing in RIA
**Delay:** RIA quality tools feature pushed by at least 1 session. Cusslab now carries dead code until unpicked.
**Tags:** `#wrong-project` `#repeated-work` `#save-rod-money`
**Status:** closed — cusslab fully unpicked (GREEN pipeline, 498/498), quality tools built correctly in RIA and committed (bb92809)
**Prevention:** Before building any feature, confirm which project/repo. Project separation rule now in Claude Code memory: RIA = risk/RAID/quality tools; Cusslab = comedy/characters/panels. If ambiguous, flag before touching any file. Two windows simultaneously is fine — losing track of active project is not.

---

### WL-023
**Item:** Panel tabs (comedyroom, boardroom, football, golf, darts) hidden after skin toggle — live site broken
**Symptom:** User reported "can't select any object" in UI panels on live site. Toggling the skin (consultant → science → consultant) called `_applySkin('consultant')` which hid any tab not in `SKIN_CONFIGS.consultant.tabs`. Those five panel tabs were missing from the array, so they disappeared after any skin toggle.
**Suspected cause:** Panel tabs were added to the nav (HTML) and `_NAV_GROUP_MAP` incrementally across multiple commits, but `SKIN_CONFIGS.consultant.tabs` was never updated to include them. No test existed to enforce the invariant that nav-linked panels must appear in the skin config.
**Session:** 2026-03-07
**Time lost:** ~1 hour (diagnosis across wrong project, diff analysis, fix, new tests)
**Cost impact:** Medium
**Delay:** Panel selection broken on live site until fix deployed
**Tags:** `#missing-test` `#false-green` `#regression` `#incremental-drift`
**Status:** closed — two bugs fixed: (1) Prof Cox inserted outside football members array (syntax error — full JS non-functional); (2) panel tabs missing from consultant skin config (hidden after skin toggle). Both committed and pushed.
**Prevention:** ui-audit.js now (a) enforces all `_NAV_GROUP_MAP` keys in consultant skin tabs, (b) syntax-checks the main script block via `new Function()`. Gherkin scenarios in panel-init.feature assert panel tab visibility. Root cause of "nothing works": syntax error in faeb105 went undetected because pipeline only tests src/ modules, not index.html script block. The syntax guard closes that gap.

---

### WL-046
**Item:** OPENER VARIETY and MIMIC rollout — 7 commits, zero regressions, clean delivery
**Symptom:** (no failure — logging as positive pattern)
**Session:** 2026-03-07
**Time lost:** 0
**Cost impact:** 0
**Delay:** 0
**Tags:** clean-session, character-mechanics, opener-variety, mimic
**Status:** closed
**Notes:** Full OPENER VARIETY rollout across all 5 panels (44 characters), MIMIC three-type expansion across all 5 panels with panel-specific character target patterns. 7 commits, each preceded by green pipeline (10/10 + 6/6 + 86/86 + 500/500). Session continued cleanly from summary after context compaction — no context-recovery waste.

---

### WL-047 — Cross-Project Analysis (Cusslab + RIA)
**Item:** Recurring failure modes across both projects — FMEA summary
**Session:** 2026-03-07
**Status:** analysis complete — logged for action tracking

| Failure Mode | Projects | Severity (1-5) | Frequency (1-5) | Detection (1-5) | RPN | Root Cause (5 Whys) |
|---|---|---|---|---|---|---|
| Work in wrong project/directory | Both | 5 | 3 | 1 | 15 | No project-confirmation step before any file open |
| Context/knowledge loss between sessions | Both | 4 | 5 | 2 | 40 | Insights live in conversation, not repo; session-end commit rule not always followed |
| Docs drift from live code | Cusslab | 3 | 4 | 1 | 12 | No runtime link between docs/ and index.html; single-file architecture has no import mechanism |
| Pipeline GREEN but feature broken | Cusslab | 5 | 3 | 2 | 30 | Pipeline tests src/ modules only, not inline script block; solved by syntax guard |
| Missing Gherkin coverage | Both | 4 | 3 | 2 | 24 | Feature built before spec; BDD-first rule not enforced consistently |
| Wrong implementation (ACC, OpenAI vs Anthropic) | Both | 4 | 2 | 3 | 24 | Memory not read at session start; training data overrides explicit memory |
| Session-start protocol skipped | Both | 4 | 4 | 1 | 16 | No hard gate enforcing protocol before first file touch |

**Top RPN — context/knowledge loss (40):** 5 Whys — (1) insight flagged as "worth a conversation"; (2) not committed to repo; (3) session-end commit rule not followed; (4) no enforcement — rule is advisory; (5) no machine-checkable gate exists at session close.
**Action:** session-end waste-log entry is the closest enforcement we have. Keep it mandatory.

**Second RPN — pipeline GREEN but feature broken (30):** Now closed by syntax guard in ui-audit.js. Monitor for new classes of false-green.

**Cross-project shared root cause:** both projects suffer from "work started before context verified". Prevention: session-start protocol (read CLAUDE.md → run pipeline → read recent waste entries) before any file is opened. This is already in memory — enforce it.

---

### WL-048 — Darts panel frozen after first speaker (DARTS_VOICE_FMT bug)
**Item:** All darts characters from position 2 onwards silently hanging at "Waiting..." state. User reported as "Sid Waddell doesn't answer."
**Symptom:** User report — character placeholder stuck in Waiting... state indefinitely. Panel appeared to work (first character responded) then silently froze.
**Suspected cause:** `DARTS_VOICE_FMT` contained plain strings. `RelationshipState.buildBlock` at line 8946 calls `fmt(nonNeutral, ...)` as a function. After the first speaker's turn, subsequent characters develop non-neutral state ('cooling') → `buildBlock` reaches the `fmt` call → `TypeError: fmt is not a function` → thrown outside try-catch in `discuss()` → async function exits → all remaining placeholders stuck in "Waiting..." forever. All characters at positions 2–5 affected, not just Waddell.
**Session:** 2026-03-07
**Time lost:** ~30 min diagnosis + fix
**Cost impact:** Medium (user-facing, silent failure, no error shown)
**Delay:** None — hotfix same session
**Tags:** `#false-progress` `#regression`
**Status:** closed

**5 Whys:**
1. Why did Waddell hang? → The `API.call()` for position 2+ was never reached — a TypeError was thrown before it.
2. Why was a TypeError thrown? → `DARTS_VOICE_FMT` entries were plain strings; `buildBlock` called the string as a function.
3. Why were strings used instead of functions? → Other panels (golf, cricket) have proper formatter functions. When darts was built, the strings were typed as labels/descriptions, not as formatters. The value type was wrong from the start.
4. Why wasn't this caught by the pipeline? → `buildBlock` is not extracted to `logic.js`. The Gherkin runner uses mock state that never reaches non-neutral temperature for darts. Unit tests had no coverage of `DartsVoiceFmt` or `dartsBuildBlock`.
5. Why was there no coverage? → No test was written for this code path. Tests were written for WoundDetector (extracted to logic.js) but not for VoiceFmt formatters, which were left as unverified inline code.

**Root cause:** Architecture gap — `DARTS_VOICE_FMT` was untestable inline code with no extracted unit. The wrong type (string vs function) was undetectable by existing tests.
**Corrective action:** (1) Extracted `DartsVoiceFmt` and `dartsBuildBlock` to `logic.js`. (2) Added 17 unit tests covering type and return value. (3) Added 8 Gherkin scenarios in `specs/darts-voice-fmt.feature`. (4) Fixed `DARTS_VOICE_FMT` in `index.html` — strings replaced with proper formatter functions.

---

### WL-049 — Darts discuss() unguarded pre-API code + no fetch timeout
**Item:** After WL-048 fix, darts characters at position 2+ could still silently hang. Two structural issues identified: (1) try-catch in `discuss()` only wrapped the `API.call()` line — all prompt-building code (15+ lines) was unguarded; (2) `API.call` had no `AbortController` timeout — a hung fetch waits forever with no error shown.
**Symptom:** Placeholder stuck at "Waiting..." indefinitely. Identical symptom to WL-048, so initially hard to distinguish. After DARTS_VOICE_FMT fix, if a JS error occurred in prompt-building OR if the network fetch hung, the loop still exited silently or waited forever.
**Suspected cause:** Try-catch scope was too narrow — written to catch API errors only, but the build-up code (RelationshipState.buildBlock, CharacterState.buildBlock, FoodWeather.* calls) was placed outside it. Additionally, `API.call` used bare `await fetch(...)` with no signal or timeout.
**Session:** 2026-03-07
**Time lost:** ~30 min investigation + fix (second pass on same bug)
**Cost impact:** Medium (user-facing silent failure; same symptom as prior bug made root cause ambiguous)
**Delay:** None — hotfix same session
**Tags:** `#error-handling` `#silent-failure` `#network-resilience`
**Status:** closed

**5 Whys:**
1. Why did position-2 character hang after WL-048 fix? → Either a JS exception in pre-try-catch code escaped to unhandled rejection, or the fetch for the second API call hung indefinitely.
2. Why did a JS exception escape? → The try-catch only started at `API.call()` — all prompt-building code above it was unguarded. Any throw there propagates to the async function level, exits the loop, and leaves placeholders filled.
3. Why was try-catch placed so late? → The try-catch was written to guard API errors specifically. Pre-API code was assumed safe and left unguarded. Assumption not validated.
4. Why did a network hang produce no error? → `API.call` had no `AbortController` — `await fetch(...)` blocks forever if the server never responds. No catch is ever reached. No `_fill` is called.
5. Why was there no timeout? → `API.call` was built for correctness, not resilience. No timeout was specified because it was never explicitly required.

**Root cause:** Structural — try-catch scope too narrow + missing fetch timeout. Both errors individually cause the identical user-visible symptom.
**Corrective action:** (1) Extended try-catch in `discuss()` to cover all pre-API prompt-building code. (2) Added `AbortController` with 30-second timeout to `API.call` — timeout throws `AbortError`, caught, surfaced as "Request timed out — please try again."

---

### WL-MODE-001 — Mode tabs and match engine designed without In-Game UI audit
**Item:** Full QandA/In-Game mode tab architecture and darts match engine specified and Gherkin-written as design-only, with no prior audit of what mode/tab UI structure already exists in `index.html`.
**Symptom:** After writing all 5 feature files in branch 1, a codebase grep revealed no existing mode tab structure in index.html — meaning the spec assumes a greenfield implementation against a codebase that has no equivalent scaffold. Risk: implementation session will discover structural blockers that the design session did not surface.
**Suspected cause:** Design-first session proceeded without a "what already exists?" scan. The instruction was "design-only, no implementation" which is correct — but a lightweight codebase audit (grep for existing tab/mode structure) was not performed before writing specs.
**Session:** 2026-03-07
**Time lost:** ~15 min risk — not lost yet; risk materialises at implementation
**Cost impact:** Low (design sessions are cheap; implementation rework is expensive)
**Delay:** Potential 1-session delay if implementation discovers structural conflicts
**Tags:** `#knowledge-loss` `#missing-audit` `#design-risk`
**Status:** open

**5 Whys:**
1. Why is there a risk of implementation blockers? → Specs assume a UI structure that may not match what index.html can accommodate without significant refactor.
2. Why wasn't the existing structure checked? → Session was framed as "design-only" — the implicit assumption was that implementation details were deferred, including what the codebase currently has.
3. Why was the assumption not challenged? → "Design-only" instruction correctly excluded implementation — but it should not exclude a read-only codebase audit to ground the design.
4. Why is "design-only" conflated with "no codebase reading"? → No rule or practice distinguishes the two. The session-start protocol says "run pipeline, report scorecard" — it does not say "grep for relevant structure before writing specs."
5. Why is that missing from protocol? → Protocol was written for code-change sessions, not design sessions. Design sessions have no equivalent "look before you write" gate.

**Root cause:** Session-start protocol has no design-session variant. "Design-only" sessions skip implementation but should not skip the codebase audit.
**Corrective action:** Before any design session that will produce specs: grep codebase for relevant structural hooks. Add to CLAUDE.md as a design-session protocol step. At implementation time, read relevant index.html sections before writing any code.

---

### WL-MODE-002 — Open character debt: Rod Harrington, Bobby George, Andy Fordham
**Item:** Three darts characters identified as candidates for full character profiles (md files) during the design session — Rod Harrington, Bobby George (full profile, not just wound data), Andy Fordham — but not written this session. Debt carried forward.
**Symptom:** Characters are referenced in specs and wound data but have no `docs/characters-*.md` profile. Any future prompt-writing or panel tuning for these characters will require research from scratch.
**Suspected cause:** Session ran out of context. The design phase (mode tabs, match engine, Premonition Engine — 10 feature files) consumed the bulk of session capacity. Character profiles were explicitly listed as pending but not reached.
**Session:** 2026-03-07
**Time lost:** 0 this session — pure debt, no rework yet
**Cost impact:** Low now; Medium if implementation session needs character voice accuracy and profiles are missing
**Delay:** Deferred to next session that touches darts characters
**Tags:** `#character-debt` `#knowledge-loss`
**Status:** open

**Characters owed:**
- **Rod Harrington** — darts referee/MC, not commentator; precise, formal, occasionally sardonic; wound TBD
- **Bobby George** — full md profile (wound data exists in DARTS_WOUNDS_DATA as "george"; full voice/comedy profile not written)

**Action:** Next session touching darts characters: write both before any new code. Pattern established by characters-studd.md and characters-pyke.md.

WL-044
Date: 2026-03-07
Type: Missing step definition — pipeline red at session start
Symptom: 76 Gherkin scenarios failing, all in darts-match-engine-mode2.feature
Cause: Background step "Given the darts panel is open" written without step definition
Time lost: ~15 mins archaeology to identify root cause
Fix: Two step definitions added to existing step file
Tags: gherkin, step-definitions, pipeline-red
Status: CLOSED

WL-045
Date: 2026-03-07
Type: Feature file path assumption
Symptom: Claude.ai referenced features/ directory; file was in specs/
Cause: Path not confirmed before referencing — memory assumption overrode reality
Time lost: 1 exchange
Fix: Always grep for file location before referencing it
Tags: path, assumption, save-rod-money
Status: CLOSED

---

### WL-050 — mode2 commentaryMode derived after deduction, not at submit time
**Item:** Step def for `the user submits a score band` applied the band deduction BEFORE deriving commentaryMode. Scenarios for remaining=171, 61, 60, 2 all failed — 4 scenarios.
**Symptom:** Pipeline RED: "Expected commentaryMode MOMENTUM but got FINISH_TERRITORY" etc. Four failures in commentaryMode outline. The step also triggered a secondary bug: default band=100 reduced small remaining values to 0, which then fired the LEG_WON override and masked the actual error.
**Suspected cause:** Step def logic written without running through the boundary cases mentally. The scenario name says "derived from remaining score at submit time" — the pre-deduction semantics were in the name and were still missed.
**Session:** 2026-03-08
**Time lost:** ~20 min (diagnosis + two fix attempts — first fix removed band deduction, second removed the LEG_WON override)
**Cost impact:** Low-Medium
**Delay:** None — fixed same session
**Tags:** `#false-progress` `#repeated-work`
**Status:** closed

**5 Whys:**
1. Why did 4 scenarios fail? → commentaryMode computed from post-deduction remaining, not pre-deduction.
2. Why was deduction applied first? → Step def was written to simulate the full action rather than the isolated assertion.
3. Why wasn't this caught on first write? → No mental walkthrough of boundary values (171, 61, 60, 2) before committing the step def.
4. Why no walkthrough? → Step defs written in bulk to pass pipeline quickly; review discipline not applied.
5. Why no review discipline on step defs? → Step defs treated as scaffolding, not production logic. Same rigour not applied as to app code.

**Root cause:** Step defs written for speed, not correctness. Boundary value analysis not applied before writing.
**Corrective action:** For any Scenario Outline with numeric boundary examples, walk the step def logic against the min/max/boundary rows before committing.

---

### WL-051 — mode2 step def missing patterns: "selected match" alias and "band again"
**Item:** Two missing step def patterns caused 3 scenarios to fail: `the user has selected match "..."` (without "the") and `the user submits a "180" band again`. Both written in the feature file; neither handled in gherkin-runner.js.
**Symptom:** Pipeline: "No step definition for: the user has selected match..." and "No step definition for: the user submits a '180' band again". AI scoring and NINE_DARTER scenarios failed.
**Suspected cause:** Step def for `selected the match` was written with "the" in the regex; feature file uses both forms. "band again" was a natural-language variant not anticipated when writing the hot trigger scenarios.
**Session:** 2026-03-08
**Time lost:** ~10 min
**Cost impact:** Low
**Delay:** None — fixed same session
**Tags:** `#false-progress`
**Status:** closed

---

### WL-052 — premonition bar still visible in mode 2 after dtSubmitScore fix
**Item:** Previous session fixed `dtSubmitScore()` to stop leaking internal match state into `dt-premonition-status`. But `callMoment()` also updates the same element (legitimate premonition mechanic for Q&A mode) — and this code ran unconditionally in mode 2, showing premonition state after every submission.
**Symptom:** User reported "premonition bars at the top of the in-game darts match" after the fix was already in production. Fix was incomplete — one code path closed, sibling path not checked.
**Suspected cause:** Fix was surgical on `dtSubmitScore()` only. `callMoment()` was not audited for the same element access. The element is shared between Q&A and mode 2 but the guard was only added in one place.
**Session:** 2026-03-08
**Time lost:** ~15 min (user report → audit → fix)
**Cost impact:** Low
**Delay:** None — fixed same session. But bug shipped to production.
**Tags:** `#regression` `#false-progress`
**Status:** closed

**5 Whys:**
1. Why was the premonition bar still showing? → `callMoment()` sets `statusEl.style.display = 'block'` unconditionally after every round.
2. Why was this path not fixed in the previous session? → Previous fix targeted the explicit leak in `dtSubmitScore()`. `callMoment()`'s own premonition update was legitimate behaviour (for Q&A mode) and was not reviewed.
3. Why wasn't `callMoment()` reviewed? → Fix was scoped to "remove the leak" — the implicit assumption was that only `dtSubmitScore()` was the source.
4. Why was the assumption not tested? → No end-to-end mode 2 test exercises the full `callMoment()` response cycle. The fix was structural, not tested.
5. Why no end-to-end test? → Mode 2 callMoment tests are `@claude` skipped — step defs not written.

**Root cause:** Incomplete fix scope. When fixing a symptom in one function, sibling functions accessing the same element were not audited.
**Corrective action:** When fixing a DOM element visibility bug, grep for all reads/writes to that element ID before closing the fix.

## WL-053
- Item: Phantom file names in memory (blofeld.md, blofeld-switch.feature)
- Symptom: Session queue item pointing to files that never existed
- Suspected cause: Memory entry written from incomplete session summary
- Session: 2026-03-08
- Time lost: ~5 min
- Cost impact: Low
- Tags: memory, phantom
- Status: Closed — grep confirmed, memory corrected

## WL-054
- Item: Large WSL output requested as paste instead of file upload
- Symptom: Rod asked to manually copy large terminal block into chat
- Suspected cause: Large output rule not yet in memory
- Session: 2026-03-08
- Time lost: ~10 min
- Cost impact: Low
- Tags: process, output, tooling
- Status: Closed — rule added to memory #4

## WL-055
- Item: Step def file generated in claude.ai filesystem, unreachable by Claude Code
- Symptom: Extra round-trip to deliver insertion — node script approach needed
- Suspected cause: claude.ai outputs/ dir not mounted in WSL
- Session: 2026-03-08
- Time lost: ~15 min
- Cost impact: Medium
- Tags: tooling, filesystem, step-defs
- Status: Closed — use node -e insertion script directly next time

## WL-056
- Item: Step def regex serving two roles — dice validation vs outcome setter
- Symptom: `the shot outcome is "GREAT"` fired the dice map check in commentator scenarios where ctx._gaRiskLevel was undefined; also missing unquoted variant for POOR/DISASTER
- Suspected cause: Same natural-language step used in two different scenario contexts (dice-roll and commentator-reaction); should have checked both usages before writing
- Session: 2026-03-08
- Time lost: ~5 min
- Cost impact: Low
- Tags: step-defs, gherkin, regex
- Status: Closed — added guard (only validate when riskLevel+diceValue both set), added unquoted variant

## WL-057
- Item: CSS font stripe fix required 3 attempts — wrong root cause each time
- Symptom: "darker lines running through font text" — initially diagnosed as CRT scanline overlay, then as opacity not being applied, finally identified as Playfair Display weight-900 thick/thin stroke contrast rendering on Windows
- Root cause: No visual diagnostic before fixing. Assumed CSS overlay was the cause without ruling out font rendering. Should have asked "what does the text look like" and identified the font's inherent stroke contrast as the likely culprit on first pass.
- Prevention rule: When a visual rendering complaint arrives, identify the element and its font-family FIRST before touching overlays or opacity. High-contrast serif fonts (Playfair Display, Didot, Bodoni) at heavy weights produce visible stripe artefacts on Windows ClearType rendering — this is a known failure mode.
- Session: 2026-03-08
- Time lost: ~15 min
- Cost impact: Low-medium (3 deploy cycles)
- Tags: css, typography, font-rendering, diagnosis
- Status: Closed — Bebas Neue (uniform stroke) replaces Playfair Display in masthead h1

## WL-058
- Item: Visual bug fix applied 3 times to feature branch while live site served main
- Symptom: Rod reported "still exactly the same" after each fix — because none reached the live site
- 5 Whys:
  1. Opacity set to 0 but body::after still composited → should have removed element
  2. Font change deployed to feature branch → live site serves main, not feature branch
  3. No deploy-chain check before starting visual fixes
  4. When Rod said "still broken", went straight to next fix instead of asking "did this reach the live site?"
  5. No 5 Whys triggered on second failure — rule not applied
- Root cause: Missing pre-fix check — "which branch is live?" must be answered before any visual fix
- Prevention rule: Before fixing any live-site visual bug, verify: (1) which branch GitHub Pages deploys from, (2) confirm fix is committed to THAT branch. If working on a feature branch, either merge first or cherry-pick the fix to main.
- Session: 2026-03-08
- Time lost: ~20 min
- Cost impact: Medium (5 deploy cycles, 3 wrong fix attempts)
- Tags: deployment, branch, live-site, 5-whys, process
- Status: Closed — merged feature branch to main; prevention rule added

## WL-060
- Item: Cloudflare wrangler login repeatedly sends user to browser OAuth which only shows the wrong Google account
- Symptom: `wrangler login` opens browser, only leanspirited's other Google account appears, not leanspirited@gmail.com — cannot authenticate, cannot update Worker secret
- Suspected cause: Browser is logged into wrong Google account; wrangler has no CLI-only token flow by default; no documented workaround ever retained between sessions; Claude keeps re-suggesting the same broken flows
- Session: 2026-03-08
- Time lost: ~30-60 min across 5-6 sessions (recurring)
- Cost impact: High (blocking live site fixes, repeated session time)
- Delay: Worker secret updates blocked every time
- Tags: #cloudflare #auth #recurring #high-cost
- Status: CLOSED — 2026-03-08. Root cause identified and fix documented.
- **ROOT CAUSE:** wrangler has a stale cached account ID (`7721964c...`) that differs from the real account (`ce5ebfc99d1b37a7537a039d0b09d0b6`). Every auth attempt hits the wrong account → auth error → wrangler suggests login → browser loop. Nothing to do with Google account switching — it's a local cache mismatch.
- **PERMANENT FIX:** `echo "sk-ant-..." | CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6 npx wrangler secret put ANTHROPIC_API_KEY` — must pass CLOUDFLARE_ACCOUNT_ID explicitly every time. Token must use "Edit Cloudflare Workers" template (not custom — needs secrets write permission). See MEMORY.md for full command.

## WL-061
- Item: IntellectualAttempts extraction caused total live-site JS failure — all sports panel buttons broken
- Symptom: After extracting IntellectualAttempts to src/ layer, `const IntellectualAttempts = { detect: IntellectualAttemptsEngine.detectIntellectualAttempt, ... }` evaluated at module load time. If external script fails to load for any reason, throws TypeError and kills ALL subsequent JS — Football, Golf, Darts, LongRoom all undefined, all buttons broken.
- Suspected cause: Eager property access on external global at module-load time. No defensive guard. If the src/ script 404s or throws, the whole page dies silently.
- Secondary bug: Football, Golf, LongRoom `callMoment()` routed through `discuss()` which disables the mode 1 button only — mode 2 button (fb-moment-btn, gf-moment-btn, lr-moment-btn) never disabled, allowing double-clicks during API calls.
- Root cause: No test verifies that (a) the page survives an external script failure, (b) mode 2 buttons are disabled during API calls.
- Prevention rule: Any global accessed at module load time (not inside a function) MUST be guarded: `typeof X !== 'undefined'`. Eager access to externally-loaded globals is always a live-site kill risk.
- Test gap: Need Gherkin: "if an external script fails, the panel still loads" and "mode 2 button is disabled during API call".
- Session: 2026-03-08
- Time lost: ~45 min diagnosis
- Cost impact: Medium — live site broken, multiple rounds of investigation
- Tags: #live-site #js-fatal #external-script #button-enablement #retest-fail
- Status: Closed — IntellectualAttempts made defensive (lazy IIFE with typeof guard); callMoment() async + disable/enable own button for Football, Golf, LongRoom

## WL-059
- Item: Phantom scenario descriptions in CLAUDE.md — "Magnus loading state" and "brand error messages" referenced as 9 approved Cloudflare Worker scenarios
- Symptom: Neither Rod nor Claude can source these descriptions. Not in any .feature file, retro, or session transcript.
- Suspected cause: CLAUDE.md updated mid-session with descriptions that were never formalised into scenario text. Knowledge evaporated between sessions.
- Session: 2026-03-08
- Time lost: ~10 min
- Cost impact: Low
- Tags: #knowledge-loss #phantom
- Status: Closed — entries removed from CLAUDE.md, worker.feature confirmed complete (10/10 passing)

---

## WL-062
- Item: Worker ANTHROPIC_API_KEY secret invalid again — live site returning 401 "API key rejected"
- Symptom: Rod opens live site, all panel calls return 401. "Fixed for good" claim from previous session was wrong — process fix (API token auth flow) was confused with root cause fix.
- Suspected cause: Architecture flaw — Rod was relying on the worker secret as primary auth for his own use. Worker secrets are ephemeral (revocable, expirable). Design intention was always: worker secret = unauthenticated demo fallback only; Settings key = Rod's normal operating mode. Mental model was never corrected.
- Session: 2026-03-08
- Time lost: ~30 min this session + 60 min across 5 prior sessions (WL-060)
- Cost impact: High (recurring live-site breakage)
- Delay: None to features — but recurring trust damage
- Tags: #api-friction #recurring #architecture-flaw #live-site #high-cost
- Status: Mitigated — Rod saving own key in Settings (bypasses worker secret entirely). Worker canary added to pipeline to warn on stale secret at session start. Worker secret remains as demo fallback only.
- **5 Whys root cause:** The architecture assumes a worker secret is permanent. It isn't. True fix is not rotating the secret faster — it is not depending on it for Rod's own use.

---

## WL-063
- Item: Settings & API Key tab hidden in sidebar on live site — `display:none` hardcoded, `settings` missing from `SKIN_CONFIGS.consultant.tabs`
- Symptom: Rod could not find the Settings tab to enter his API key — tab not visible in sidebar
- Suspected cause: Tab was deliberately hidden at some point (possibly when UI was being restructured). `display:none` was never removed. `settings` was omitted from `consultant.tabs` so the skin system never unhid it. The pipeline audit passes because it only checks that tabs *in* the skin array have panel elements — it does not check that `settings` is *in* the skin array.
- Session: 2026-03-08
- Time lost: ~10 min
- Cost impact: Low
- Tags: #live-site #ui #hidden-tab #regression
- Status: Closed — `settings` added to `SKIN_CONFIGS.consultant.tabs`; `display:none` removed from sidebar tab element

---

## WL-064
- Item: golf-adventure.html calling api.anthropic.com directly — 7 raw fetch calls, no API key, no CORS routing
- Symptom: Pundits silent during Golf Adventure game — commentary box showed nothing (or "Commentary signal lost."). Game advanced but all API calls failed silently.
- Suspected cause: golf-adventure.html was built as a standalone prototype without access to the main app's API client module (`src/integration/api-client.js`). Fetch calls were written directly to api.anthropic.com with no auth headers. CORS blocks browser-initiated requests to api.anthropic.com. The `claude-sonnet-4-20250514` model ID also needed updating to `claude-sonnet-4-6`.
- Session: 2026-03-08
- Time lost: User sessions of Golf Adventure broken for all users without the issue diagnosed — likely multiple sessions of confusion
- Cost impact: Medium (game fundamentally non-functional until fixed)
- Tags: #golf-adventure #api-routing #cors #architecture-gap #bl-015
- Fix: Added `golfFetch()` helper — routes through worker (`cusslab-api.cusslab.workers.dev`), picks up `hecklers_api_key` from localStorage if present (same key as main app). All 7 fetch calls replaced. Model updated to `claude-sonnet-4-6`.
- Status: Closed — 2026-03-08

## WL-028
- **Item:** grep redirect produced wrong file content
- **Symptom:** Command to grep index.html for atmosphere terms returned golf-adventure.html CSS content instead
- **Suspected cause:** Shell redirect or command construction error — grep may have failed silently and a previous file remained in out.txt
- **Session:** 2026-03-08
- **Time lost:** ~5 min
- **Cost impact:** Low
- **Delay:** Atmosphere schema replication blocked briefly
- **Tags:** bash, redirect, grep, shell
- **Status:** CLOSED — workaround was Claude Code honest read instead

## WL-065
- Item: Worker canary flagged as WARN (non-blocking) when it is session-blocking
- Symptom: Pipeline reported canary WARN, Claude said "not session-blocking" — session proceeded without fixing the Worker. Core product promise broken, users on shared key got nothing.
- Suspected cause: `warnOnly: true` in run-all.js and `process.exit(0)` in worker-canary.js. Canary was designed as a warning from day one. Wrong design decision never challenged.
- Root cause: Process failure — no standard that "canary WARN = stop everything". Claude reinforced the wrong behaviour by deprioritising it.
- Session: 2026-03-08
- Time lost: ~20 min + unknown time users spent with broken shared key
- Cost impact: High (product non-functional for users without own key)
- Tags: #canary #process-failure #pipeline #session-blocking
- Fix: worker-canary.js now exits 1 on 401/403/500. run-all.js warnOnly removed. Pipeline blocks until canary is green.
- Status: Closed — 2026-03-08

## WL-066
- Item: Wrong Worker URL in MEMORY.md and pipeline — recurring, previously seen and not fixed
- Symptom: worker-canary.js and MEMORY.md pointed to `cusslab-api.cusslab.workers.dev`. Actual deployed URL is `cusslab-api.leanspirited.workers.dev`. Canary always hit the wrong endpoint.
- Suspected cause: URL was set at initial deploy and never verified against wrangler deploy output. When URL was corrected previously it was not persisted to MEMORY.md or pipeline. Same error repeated multiple sessions.
- Root cause: Fix was applied in session context but not committed to persistent memory. Recurrence = knowledge-loss failure.
- Session: 2026-03-08
- Time lost: ~15 min this session + unknown prior sessions
- Cost impact: Medium (canary meaningless when hitting wrong URL)
- Tags: #worker-url #knowledge-loss #recurring #canary #memory
- Fix: ENDPOINT corrected in worker-canary.js. MEMORY.md updated with correct URL and note that cusslab.workers.dev is wrong.
- Status: Closed — 2026-03-08

## WL-067
- Item: Stale Anthropic key passed as "fresh" — required second key generation
- Symptom: User said "yep" to "do you have a fresh key?". Key pushed to Worker returned 401. Direct API test with same key also 401. User had to generate a second key.
- Suspected cause: User still had the stale key in clipboard/memory and pasted it believing it was new. Claude did not warn that the key about to be pushed was likely the same stale one already on the Worker.
- Root cause: Claude should have asked "is this a newly generated key or the one already on the Worker?" before pushing. Did not ask. Wasted a token rotation and a Cloudflare API token.
- Session: 2026-03-08
- Time lost: ~10 min
- Cost impact: Low (one extra key generation)
- Tags: #anthropic-key #canary #process #communication
- Fix: None in code. Process rule: always ask "is this a key you just generated now?" before pushing to Worker.
- Status: Closed — 2026-03-08

## WL-068
- **Item:** Claude Code Windows install bugs — recurring session friction
- **Symptom:** (1) Git not auto-detected on Windows — env var `CLAUDE_CODE_GIT_BASH_PATH` set but ignored on restart. (2) File picker throws "Class not registered" error blocking git.exe selection. (3) Same error blocks hidden file navigation. (4) No manual text entry in file picker as fallback.
- **Suspected cause:** New Claude Code release broken on Windows — bash tool and file picker not functioning correctly in affected versions
- **Session date:** 2026-03-08
- **Time lost:** ~2 hours across 2 sessions
- **Cost impact:** Medium — session startup blocked, workarounds required each time
- **Tags:** claude-code, windows, install, git, file-picker
- **Status:** Open — track at https://github.com/anthropics/claude-code/issues for "Class not registered" / "CLAUDE_CODE_GIT_BASH_PATH". File own issue if not already raised.

## WL-069
- **Item:** Python script used to patch gherkin-runner.js and tournaments.js during BL-017
- **Symptom:** python3 patch scripts used instead of direct edit instructions
- **Suspected cause:** Claude Code defaulting to Python for multi-line file edits when Edit tool would have sufficed
- **Session date:** 2026-03-08
- **Time lost:** ~5 min
- **Cost impact:** Low
- **Tags:** python-patch, waste, CLAUDE.md-violation
- **Status:** Open — add direct edit instruction pattern to Claude Code habits

## WL-070
- **Item:** Hardcoded tournament count in Gherkin step definition
- **Symptom:** Step broke when tournaments were added — count was magic number 5, not derived from data source
- **Suspected cause:** Test written against a count rather than asserting against actual TOURNAMENTS array
- **Session date:** 2026-03-08
- **Time lost:** ~10 min
- **Cost impact:** Low — but will recur every time a tournament is added
- **Tags:** test-design, magic-number, tdd-clean-candidate
- **Status:** Closed — refactored step to assert non-empty (`!ctx._gaData.TOURNAMENTS.length`) 2026-03-08

## WL-071
- **Item:** Claude Code told user it couldn't access /mnt/c/Users/roden/Downloads/ — it can
- **Symptom:** Said "nothing has been pasted" when file was available at Windows path via /mnt/c/
- **Root cause:** Failed to check /mnt/c/ WSL mount before asking user to paste manually
- **Session date:** 2026-03-08
- **Time lost:** ~5 min (user had to clarify)
- **Cost impact:** Low but avoidable friction
- **Tags:** wsl-mount, /mnt/c, windows-path, claude-code-error
- **Status:** Closed — rule added to session-insession.md

## WL-072
- **Item:** Missing Background step definitions caused 5 Gherkin failures on pipeline-report.feature
- **Symptom:** "No step definition for: the NVM environment is available at..." — 5 scenarios RED
- **Root cause:** Background steps written in Gherkin but not implemented in gherkin-runner.js before running pipeline
- **Session date:** 2026-03-08
- **Time lost:** ~5 min
- **Cost impact:** Low
- **Tags:** gherkin, step-definitions, background, pipeline-report
- **Status:** Closed — Background step defs added for NVM path and repo path checks

## WL-073
- **Item:** Panel perceived-latency — sequential API calls per member
- **Symptom:** Boardroom/Comedy/Football/Golf panels take 6–12 seconds to respond — users perceive as broken
- **Suspected cause:** Sequential `for await` loop: each member awaits previous before starting, so they can read prior responses in the same round
- **Root cause:** Intentional design for inter-character reactivity, but no expectation-setting UI (no per-member streaming or progressive rendering)
- **Session date:** 2026-03-08
- **Time lost:** 0 (design cost, not a bug) — but user friction ongoing
- **Cost impact:** Medium — user perception of breakage even when working
- **Tags:** latency, panel, sequential-calls, ux, progressive-rendering
- **Status:** Open — consider streaming per-member placeholder reveal; structural change out of scope today

## WL-074
- **Item:** Die face dots in wrong positions in Golf Adventure
- **Symptom:** DFACES CSS grid places dots incorrectly — face 2 diagonal wrong, face 3 off-centre, face 5 centre dot not centred
- **Suspected cause:** Grid template areas used without a proper 3×3 reference to standard d6 dot positions
- **Root cause:** No visual regression test or screenshot comparison on die rendering; built by feel, not verified against real d6 specification
- **Session date:** 2026-03-08
- **Time lost:** Unknown (unreported until now)
- **Cost impact:** Low (cosmetic) but player trust in the die mechanic undermined
- **Tags:** golf-adventure, die, css-grid, dot-positions, cosmetic
- **Status:** Closed — fixed 2026-03-08 (2fdb440): proper 3×3 CSS grid, standard d6 layout

## WL-075
- **Item:** Commentary silently disappears after hole 1 in Golf Adventure
- **Symptom:** Loading spinner shows, then commentary area goes blank — no error, no "signal lost" message
- **Suspected cause:** API error response (`data.error` present, `data.content` absent) falls through `data.content?.[0]?.text || '[]'` → raw = `'[]'` → `parseShotResponse` returns `[]` → `feed.innerHTML=''` with nothing appended
- **Root cause:** Error-path not checked before treating response as content. Silent failure design: the fallback `|| '[]'` was meant to handle missing content, not API errors
- **Session date:** 2026-03-08
- **Time lost:** Unknown (unreported; player would just assume nothing happened)
- **Cost impact:** Medium — core game loop feedback broken from hole 2 onwards
- **Tags:** golf-adventure, commentary, silent-failure, api-error, error-handling
- **Status:** Closed — fixed 2026-03-08 (2fdb440): `data.error` guard added before treating response as content

## WL-076
- **Item:** Golf Adventure commentary bubbles unstyled — all identical, no gaps
- **Symptom:** All panel commentary lines render in the same colour/style — no per-character visual identity. Mode 1 panels have character accent colours; Golf Adventure does not.
- **Suspected cause:** `bubble` CSS class applied uniformly with no character colour attribute injected
- **Root cause:** Golf Adventure commentary renderer was written independently of Mode 1 panel renderer, without inheriting the character colour system
- **Session date:** 2026-03-08
- **Time lost:** Unknown
- **Cost impact:** Medium — character distinctiveness lost; user can't tell who said what without reading names
- **Tags:** golf-adventure, commentary, bubble-styling, character-colours, consistency
- **Status:** Closed — fixed 2026-03-08 (2fdb440): per-character colours added to commentary bubbles (border + avatar)

## WL-077
- **Item:** Fortune reroll offer shown but clicking Reroll does nothing
- **Symptom:** After a fortune event, "FORTUNE — REROLL?" UI appears. Clicking "Reroll" removes the offer but nothing happens — dice does not roll again
- **Suspected cause:** `acceptReroll()` calls `rollDice()` but after the first roll, `dice.className='dice off'`. `rollDice()` checks `if (dice.classList.contains('off')) return` — early exit
- **Root cause:** Reroll path added after the `off`-class guard was written; the guard was not relaxed in the reroll path
- **Session date:** 2026-03-08
- **Time lost:** Unknown — feature has shipped broken
- **Cost impact:** High — fortune mechanic completely non-functional
- **Tags:** golf-adventure, reroll, fortune, off-class, guard-order
- **Additional:** When reroll is accepted, shot-wrap should be restored so user can change risk type before re-rolling; dice should not auto-roll — user clicks when ready
- **Status:** Closed — fixed 2026-03-08 (2fdb440): `acceptReroll()` restores shot-wrap + dice state, no auto-roll

## WL-078
- **Item:** Dice perceived as biased toward low numbers
- **Symptom:** Player reports getting "way more 1s and 2s than is probabilistic." RNG audit confirms `Math.ceil(Math.random()*6)` is uniform (60,000 sample: each face 16.4–16.9%). Dice are fair.
- **Root cause:** Three contributing perception effects:
  1. Animation anchoring: 12 random frames shown during spin (55ms each) prime the player visually with the numbers they see — even though these frames don't affect the final result
  2. Composure feedback loop: composure degradation raises effective thresholds (+1 at ≤6, +2 at ≤3), so more failures occur at the same dice values as the round progresses
  3. Risk selection: hero shots (thresh 6) succeed only on a 6, so 5/6 outcomes "feel like a low roll" failing
- **Session date:** 2026-03-08
- **Time lost:** Low — investigation only
- **Cost impact:** Medium — trust in core mechanic undermined even though mechanic is fair
- **Tags:** golf-adventure, dice, rng, perception-bias, animation, composure-loop
- **Status:** Closed — fixed 2026-03-08 (2fdb440): animation cycles faces 1-6 deterministically (no anchoring); roll history added (toggleable, tracks session distribution)

## WL-079
- **Item:** Death screen doesn't clearly explain why the player died or what choice caused it
- **Symptom:** Player chose "Stand your ground" with the flagstick event, was killed, but could not tell from the death screen that their choice caused the death. Death banner ("THE FLAGSTICK") is evocative but not causally explicit.
- **Root cause:** Death screen shows flavor text (dtype.description) and pallbearers but no "what you chose → what happened" link. The choice label is discarded after resolveEvent() and not threaded to triggerDeath(). Nielsen heuristics violated: #1 (system status visibility), #6 (recognition over recall — user must infer causation from flavor text), #9 (error diagnosis).
- **Session date:** 2026-03-08
- **Time lost:** 0 — reported by user
- **Cost impact:** Medium — player confusion about game state; death feels arbitrary, not consequential
- **Tags:** golf-adventure, death-screen, usability, Nielsen, causation, choice-label
- **Status:** Closed — fixed 2026-03-08 (2fdb440): choice label threaded via `G.lastChoiceLabel`; "YOU CHOSE:" block added to death screen

## WL-080
- **Item:** Full session protocol bypassed — no DDD RED, no Gherkin gate, no TDD RED
- **Symptom:** MatchPlayService, dice outcomes display, in-flight leaderboard, commentary changes, and two bug fixes all implemented directly from user chat with no Gherkin written, no failing tests, no domain model check, no session-startup sequence followed
- **Root cause:** Session started mid-conversation on Golf Adventure fixes. User said "go" to a list of bugs/features; went straight to implementation via agent. This is exactly the pattern flagged as top STOP item in retro 2026-02-28.
- **Consequence:** MatchPlayService has zero pipeline coverage (no unit tests, no Gherkin step definitions). Pipeline passes only because the new service isn't checked yet. New behaviour is untested at the contract level.
- **Session date:** 2026-03-09
- **Time lost:** ~0 additional (work done) but test debt incurred; Gherkin now owed before next touch
- **Cost impact:** Medium — technical debt; any MatchPlayService regression will be invisible until manual play
- **Tags:** golf-adventure, session-protocol, gherkin-gate, tdd, ddd-red, process
- **Status:** Closed — 2026-03-09 (7d0e35d): 28 Gherkin scenarios written and green; MEMORY.md hard stop rule added; cross-Claude sync mechanism shipped

## WL-081
- **Item:** Backlog written to wrong file — `features/backlog.md` instead of `.claude/practices/backlog.md`
- **Symptom:** New backlog items (Be Any Player, 1997 Valderrama, Ryder Cup rollout plan, Other Historic, Pro-Ams etc.) landed in `features/backlog.md` — outside the session protocol, no BL-NNN numbering, no CD3 scores, invisible to session-startup.md pre-flight
- **Root cause:** Agent told to create `features/backlog.md` without checking where the canonical backlog lives. Should have read `.claude/practices/backlog.md` first.
- **Consequence:** Two backlog files now exist. Proper one missed these items. `features/backlog.md` is being deleted after migration.
- **Session date:** 2026-03-09
- **Time lost:** ~15 min to migrate + score
- **Cost impact:** Low (correctable) but systemic — split-brain backlog undermines the session protocol pre-flight
- **Tags:** backlog, session-protocol, wrong-location, artefact-placement
- **Status:** Closed — migrated to .claude/practices/backlog.md; features/backlog.md deleted

## WL-082
- **Item:** Auto-compact fires mid-session — context lost, time wasted re-establishing state
- **Symptom:** Claude Code auto-compacts conversation when context fills. Both Claude Code and Claude.ai then spend significant time reconstructing where they were, re-reading files, re-running pipeline. Happens across both Claudes and wastes the same time every session it occurs.
- **Root cause:** No rule existed to stop before auto-compact and start a fresh session proactively. The compact happens reactively (system-triggered) rather than at a clean stopping point chosen by the developer.
- **Session date:** 2026-03-09
- **Time lost:** Estimated 10-20 min per occurrence across both Claudes — re-reading session state, re-running pipeline, re-establishing context
- **Cost impact:** Medium — recurring, predictable waste; compounds across every long session
- **Tags:** session-protocol, auto-compact, context-window, claude-code, claude-ai, process
- **Fix:** Rule added to session-insession.md — stop and start new session before auto-compact, not after
- **Status:** Closed — rule added 2026-03-09

## WL-083
- **Item:** Golf panel Mode 1 "Next Round" fires Mode 2 "Select a moment first" alert
- **Symptom:** Clicking NEXT ROUND in The 19th Hole (Mode 1) shows Chrome alert "Select a moment first." instead of calling discuss()
- **Root cause:** `nextRound()` reads `sessionStorage.getItem('gf-mode')` to decide whether to call `discuss()` or `callMoment()`. If Mode 2 (ingame) was used earlier in the session, `gf-mode` is `'ingame'` in sessionStorage and persists — so returning to Mode 1 and clicking Next Round still routes to callMoment()
- **Fix:** Check current DOM state (is `gf-ingame-view` visible?) instead of sessionStorage
- **Session date:** 2026-03-09
- **Time lost:** Reported by user — unknown play time lost
- **Tags:** golf-panel, mode1, nextRound, sessionStorage, stale-state
- **Status:** Closed — fixed 2026-03-09: nextRound() reads DOM visibility instead of sessionStorage

## WL-084
- **Item:** Auto-compact fired mid-session despite WL-082 rule being written
- **Symptom:** Session compacted mid-task (BL-031 + BL-033 pipeline not yet run, not committed). Conversation summary reconstructed from transcript. Time lost re-establishing state at session start.
- **Root cause (5 Whys):**
  1. Why did compact fire? Context window filled during a long BL-031/033/034 session.
  2. Why didn't the rule prevent it? Claude Code didn't monitor context fill level proactively — no internal signal surfaces until compaction is imminent or already happening.
  3. Why was there no proactive stop? Rule says "when context is getting long" — but "long" is not defined. No observable checkpoint triggers the stop. It's a judgement call with no forcing function.
  4. Why is there no observable checkpoint? Rule was written as a heuristic, not tied to a measurable state (e.g. after N commits, or after N items closed in a session).
  5. Root cause: The rule is a reminder, not a constraint. It requires self-awareness of an opaque internal metric (context size) that neither Claude Code nor Rod can easily observe in real time.
- **Fix (strengthened rule):** Add concrete forcing functions to session-insession.md:
  - After 3 BL items closed in a single session → clean stop checkpoint
  - After any session lasting >90 min subjective time → clean stop checkpoint
  - If pipeline run count ≥5 this session → clean stop checkpoint
  - These are observable, not opaque — they don't require monitoring context size
- **Session date:** 2026-03-09
- **Time lost:** ~15 min (summary reconstruction + context re-read at session start)
- **Cost impact:** Medium — same pattern as WL-082; rule existed but lacked teeth
- **Tags:** session-protocol, auto-compact, context-window, rule-without-constraint, process
- **Status:** Closed — forcing functions added to session-insession.md 2026-03-09: stop after 3 BL items, after 5 pipeline runs, or on "pause"/"stop there"/"let's take stock"
