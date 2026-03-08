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
