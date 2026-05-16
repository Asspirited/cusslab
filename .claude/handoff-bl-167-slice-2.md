# BL-167 Slice 2 — Cross-Claude Handoff
# Source session: 2026-05-16, primary Claude Code at /home/rodent/cusslab/
# Audience: parallel Claude Code session picking up Slice 2 work

---

## 0. STOP — read these before anything else

Non-negotiable pre-flight (you have NOT done startup):

1. Read `/home/rodent/cusslab/.claude/session-startup.md` in full and run the pre-flight `cat` at step 0.
2. Read `/home/rodent/leanspirited-standards/standards/character-schema.md` in full — every character must implement the 17-attribute canonical schema. Slice 2 adds attributes; conformance gates apply.
3. Read `/home/rodent/cusslab/.claude/CLAUDE.md` ways-of-working (Three Amigos → Gherkin gate → outside-in → failing test → minimum impl → pipeline → commit).
4. Read this file's section 1 (split / scope) before reading any code.

Do not skip. WL-080 was caused by skipping this; do not repeat it.

---

## 1. Cross-Claude split — who owns what

This session (primary) is shipping in the following order:

1. **BL-168 — Topic-dismissal moves** (v1, pure prompt). Adds a TOPIC-DISMISSAL block to the non-anchor system prompt with three flavoured dismissals selected by relationshipState temperature. Composes with everything below. CD3=20.0 (highest).
2. **BL-167 Slice 1 — Anchor mechanic + slot structure**. Anchor opens slot 1, anchor closes slot N (with ROUND SO FAR block), middle slots drawn from non-anchor cast in current fixed order. Per-panel `PANEL_CONFIG.anchor` field. Existing host panels (Long Room, Final Furlong, Crucible Corner, Spit Shelter) gain a closer slot for their hosts. No trigger-weighting yet.

You (parallel session) own:

3. **BL-167 Slice 2 — Trigger-weighted middle selection** + new `*_ENTHUSIASM` per-panel data + subset selection + floor probability. Makes Gherkin scenarios 7–12 of BL-167 pass. You also extend BL-168 with per-character dismissal-flavour profiles if useful (a v2 of BL-168 sits naturally inside your scope).

**Hard rule:** do NOT start implementation of Slice 2 until BL-168 and BL-167 Slice 1 are pushed and pipeline-green on `main`. You CAN do Three Amigos, Gherkin, outside-in design, and failing tests against the future state — just do not commit implementation that conflicts with the in-flight Slice 1.

How you'll know Slice 1 landed: `.claude/shared-session-state.md` will say so at session close from the primary; `git log --oneline | head -20` will show `BL-167` and `BL-168` commits. If not yet there, design and pend.

---

## 2. Scope — what Slice 2 must deliver

The approved BL-167 Gherkin (12 scenarios total) is split between the two slices:

- **Slice 1 makes pass:** scenarios 1, 2, 3, 4, 5, 6 (anchor mechanic + slot pool)
- **Slice 2 (your scope) makes pass:** scenarios 7, 8, 9, 10, 11, 12 (trigger scoring)

### Slice 2 scenarios (verbatim, approved by Rod 2026-05-16)

```gherkin
@claude
Scenario: A turn that hits a candidate's wound trigger raises that candidate's score
  Given candidate B has wound trigger words W
  And the previous turn contains a word from W
  When the trigger score for B is computed
  Then B's score includes the wound-trigger weight

@claude
Scenario: A turn that overlaps a candidate's enthusiasm primer raises that candidate's score
  Given candidate B has an enthusiasm primer P
  And the previous turn contains a word or topic from P
  When the trigger score for B is computed
  Then B's score includes the enthusiasm-primer weight

@claude
Scenario: Positive and negative triggers contribute equally to selection probability
  Given candidate B's only score contribution is a wound-trigger hit
  And candidate C's only score contribution is an enthusiasm-primer hit
  When the two candidates' scores are compared
  Then B's score equals C's score

@claude
Scenario: The engine does not verify accuracy of a candidate's trigger
  Then the selection function does not call any fact-check or accuracy routine
  And a candidate whose enthusiasm primer matches a misreading of the previous turn is eligible for selection at the full enthusiasm-primer weight

@claude
Scenario: A cold candidate retains a floor probability of being selected
  Given candidate C has score zero against the previous turn
  And other candidates have positive scores
  When the selection runs many rounds
  Then C is selected at a rate no lower than the floor probability pmin

@claude
Scenario: When every candidate scores zero, selection is uniform random
  Given every non-anchor candidate has score zero against the previous turn
  And there are M non-anchor candidates
  When the selection runs many rounds
  Then each candidate's selection rate converges toward 1/M
```

These six scenarios are **approved by Rod in this session and locked**. Treat them as the contract for Slice 2.

---

## 3. Design — trigger-score engine

A pure function. Lives at `src/logic/trigger-score-engine.js` (new — same pattern as `src/logic/rage-o-meter-engine.js` from BL-160).

### Signature

```js
// Returns a non-negative number. Higher = more likely to be selected.
score(candidateId, prevTurnContent, ctx) → number
```

where `ctx` carries:

```js
{
  prevSpeakerId,
  wounds:       { id: [keyword, ...] },        // existing GOLF_WOUNDS shape
  enthusiasms:  { id: [keyword/topic, ...] },  // NEW — per-panel, see section 4
  relState,                                    // existing RelationshipState object
  recentMoves,                                 // existing arcLog / postureType log
  weights,                                     // { w1..w7 } — see below
}
```

### Components (Rod approved 2026-05-16)

Positive and negative components are **equally weighted** (Rod was explicit). The engine does NOT verify accuracy — misunderstood-but-eager is a feature (P9 `enthusiastic_confabulation`).

**Negative pulls:**
- `+w1` wound trigger-word match in `prevTurnContent` against `wounds[candidateId]`
- `+w2` candidate holds an outstanding debt against `prevSpeakerId` (debtLedger.owed)
- `+w3` candidate's current temperature toward `prevSpeakerId` is `simmering` / `hot`
- `+w4` `prevSpeakerId`'s recent posture/domain contradicted candidate's (from `recentMoves`)

**Positive pulls (equal weight):**
- `+w5` `prevTurnContent` overlaps `enthusiasms[candidateId]` (enthusiasm primer match)
- `+w6` candidate's current temperature toward `prevSpeakerId` is `warm` / `reverent`
- `+w7` `prevTurnContent` contains a topic the candidate claims as their territory (claimed expertise; accuracy irrelevant)

**Floor:** when `score(candidate) === 0`, candidate still selectable at probability `pmin`. Default `pmin = 0.10` (10%) — confirm with Rod.

**Uniform fallback:** when every candidate scores zero, selection is uniform random (1/M).

### Weight defaults — propose to Rod before locking

Suggested starting values (these are tuning parameters, not behaviour — Gherkin is weight-agnostic):
- `w1 (wound)` = 3 (strongest pull)
- `w2 (debt)`   = 2
- `w3 (hostile temp)` = 2
- `w4 (posture contradiction)` = 1
- `w5 (enthusiasm primer)` = 3 (equal to wound — Rod approved equal positive/negative)
- `w6 (warm temp)` = 2
- `w7 (claimed territory)` = 1

Tune in product after launch.

---

## 4. New data — per-panel enthusiasm primers

`GOLF_WOUNDS` lives at `index.html:14725–14733`. Slice 2 adds a parallel `GOLF_ENTHUSIASM` map alongside, then equivalents per panel.

### Shape (mirror of GOLF_WOUNDS)

```js
const GOLF_ENTHUSIASM = {
  // characterId: [topics/keywords that light them up, accuracy irrelevant]
  faldo: [...],
  butch: [...],
  ...
};
```

### CRITICAL — Rod input required

**Do NOT guess enthusiasm primers from character files.** Rod's the voice of truth here. The character file's P5/P6 attributes (comic mechanism, tics) inform the primer but they don't define it. Rod knows which words / topics make a character lean in like a dog that heard "walk".

**Action for Slice 2 startup:**

1. Read each character file (`/home/rodent/cusslab/characters/*.md`) for tics, signature moves, and signature interests.
2. Propose ~6–10 enthusiasm primers per character.
3. Present the proposed list to Rod in a single batch per panel (Golf first since it's the worst-affected by Faldo Ginsters).
4. Rod corrects / adds / removes.
5. ONLY THEN write the data layer.

Example (Murray, anchor on Golf — illustrative, NOT canonical):
- Murray primers might be: `history`, `the open`, `1933`, `championship`, `the records`, `vardon`, `morris`, `prestwick` (anything letting him do the historical-peroration mode)

But again — DO NOT commit this. Rod's call per primer per character.

---

## 5. Composition with BL-168 and BL-167 Slice 1

By the time Slice 2 lands, the prompt-side dismissal (BL-168) and slot-side anchor (BL-167 Slice 1) are live. Slice 2 plugs into:

- **`discuss()` orchestrator at `index.html:14901–14907`** — replace the fixed middle order (Slice 1's interim) with `selectMiddleSlots(...)` driven by trigger scores. Slice 1 will have already moved `discuss()` to call a selection function; you replace its body.
- **TOPIC-DISMISSAL block (BL-168)** — once enthusiasm primers exist, BL-168 v2 can route dismissal flavour by primer overlap too (e.g., character gets piss-take flavour when speaker drifted ONTO their own claimed territory — "you don't get to talk about history, Faldo, I do that"). This is BL-168 v2, separate BL or in your scope — flag and let Rod decide.

---

## 6. Code seams — confirmed by architectural explore in primary session

| Aspect | Location | Notes |
|---|---|---|
| Speaker order | `index.html:14901–14907` | Fixed alternating array. Slice 1 replaces with `selectSpeakers()`. Slice 2 replaces the middle-selection body. |
| Prompt assembly | `index.html:14996–15033` | Concatenated blocks. Slice 1 adds anchor opener/closer modes. |
| RelationshipState API | `index.html:10031–10134` | `init`, `buildBlock`, `update` already exist. Use `state.characters[id].toward[other].temperature` for reads. |
| `GOLF_WOUNDS` | `index.html:14725–14733` | Existing shape `{ id: [keyword, ...] }`. Mirror it for ENTHUSIASM. |
| Gherkin runner | `pipeline/gherkin-runner.js` | Source-code-parsing only — assertions parse `index.html`. New scenarios use the same pattern. |
| Pure logic modules | `src/logic/*.js` | Pattern from BL-160 rage-o-meter. `trigger-score-engine.js` and any subset-selection helper live here. |

---

## 7. Approved register & design language (do not re-litigate)

These were settled in the primary session — do not reopen with Rod:

- Anchors per panel (locked 2026-05-16): Golf=Murray, Boardroom=Harold, Football=Souness, Comedy Room=Gervais, Phil's-opoly=Tufnell, Darts=Mardle, Long Room=Blofeld, Final Furlong=Brazil, Crucible Corner=Jimmy White, Spit Shelter=Eminem.
- BL-165 (triage tiers) **SUPERSEDED** by BL-167's anchor model.
- BL-163 register set: `endorsement | quiet_disagreement | silence_noted | deflation`. `builds_on` deliberately dropped (causes topic adoption). Do not add it back.
- Eligibility for BL-163 glances: mutual-knowledge pairs only (relationshipState non-neutral OR explicit known-wound). Cold pairs never glance.
- Trigger-score positive and negative components are **equally weighted**. Engine does NOT verify accuracy.
- Floor probability `pmin` exists so cold candidates remain occasionally selectable.

---

## 8. Open design decisions Slice 2 will need Rod to resolve

- Weight values `w1`–`w7` and `pmin` (propose, Rod tunes).
- Enthusiasm primer content per character (Rod-driven, panel by panel).
- BL-168 v2 — per-character dismissal-flavour profile attribute (Souness defaults piss-take, Murray defaults polite-but-funny, etc.). Worth its own BL after Slice 2 ships?
- Whether the "claimed territory" component (w7) is the same as enthusiasm primer (w5) or a separate signal. Rod's framing in conversation was loose; design call needed.

---

## 9. Coordination

- Read `.claude/shared-session-state.md` before any code change. It is the cross-session handoff.
- When you close your session, update `shared-session-state.md` with what you shipped, open WL, open BL, and any decisions made.
- Do NOT commit to `main` while the primary session is implementing Slice 1. Branch and rebase, or pend.
- Auth: see `.claude/practices/auth-ops.md`. NEVER `wrangler login`. Token via dash.cloudflare.com.

---

## 10. WL items to be aware of

| WL | Title | Why it matters |
|---|---|---|
| WL-149 | Panel topic adoption (Faldo Ginsters) | The thing Slice 2 + BL-168 together fully fix. Update WL-149 to Closed at completion. |
| WL-131 | Character opener bleeding | Related but different — phrase-level not topic-level. Out of scope. |
| WL-136 | UI audit IIFE return completeness | High urgency. Don't trip it: when extracting new IIFEs ensure return statements are complete. |
| WL-147 | backlog-report.js false-positive OPEN regex | Low. Ignore unless tripped. |

---

## End of handoff. Good hunting.
