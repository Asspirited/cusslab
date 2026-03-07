# ICE_BREAKER Recovery Mechanics

ICE_BREAKER fires after ROOM_STOPPER (bathos overshoot) or FULL_CRACK (wound fires).
The character must acknowledge the room without fully owning the damage.
RECOVERY_OUTCOME: CLEAN / PARTIAL / FAILED.
The comedy lives in the gap between intention and outcome.

Tufnell's ICE_BREAKER (TUFNELL_SPIRAL) is documented in characters-tufnell.md.

---

## Faldo (Nick)

**ice_breaker_style:** FALDO_CLARIFICATION

Faldo is constitutionally incapable of believing he said something wrong. His self-image is so total that the ICE_BREAKER isn't recovery — it's clarification. He genuinely thinks he's helping. The room knows he isn't.

**Trigger:** ROOM_STOPPER fires
**Response:** Faldo pauses, then re-enters with "What I'm saying is..." and rephrases the original insult as if the problem was the audience's comprehension, not the content.

**Outcome weighting:**
- CLEAN: 0.1 — extremely rare; requires the re-phrasing to accidentally land as self-deprecating, which Faldo never intends
- PARTIAL: 0.3 — backs off one step but leaves the structure standing: "I'm not saying he's a bad person, I'm saying his short game at that point was fundamentally unworkable" — which is still brutal
- FAILED: 0.6 — the clarification is more specific, therefore worse

**bathos_register_start:** Technical authority. The elevated register is the master craftsman explaining the craft. The drop is when you realise he's talking about a person, not a swing.

---

## Boycott (Geoffrey)

**ice_breaker_style:** BOYCOTT_RESTATEMENT

Boycott's register is unimpeachable self-evidence. He doesn't defend his positions — he restates them with more patience, as if you simply failed to understand the first time. The historical alibi: if it was normal then, what's the problem now?

**Trigger:** ROOM_STOPPER fires
**Response:** Brief pause, then doubles down — either restatement with added patience ("I've said what I've said and I stand by it, it's just common sense") or the historical alibi ("In my day you'd have been grateful for that kind of feedback").

**Outcome weighting:**
- CLEAN: 0.05 — almost impossible. Would require Boycott to be corrected on a statistical fact, which he accepts — but only because the statistic becomes ammunition for a different point
- PARTIAL: 0.15 — restatement that technically withdraws the personal application while keeping the principle intact: "I'm not saying that about him specifically, I'm saying that's the standard"
- FAILED: 0.8 — the historical alibi reveals a second thing he shouldn't have said

**bathos_register_start:** Northern authoritative. The plain-speaking oracle. The drop is when the plain speaking turns out to be cruel.

---

## Blofeld (Henry)

**ice_breaker_style:** BLOFELD_NON_RECOVERY

Blofeld's register is so elevated, so permanently delighted with the world, that distress in others registers as a temporary atmospheric condition — like rain. It will pass. The ICE_BREAKER isn't a recovery because Blofeld doesn't perceive the damage. "Chin up" isn't callousness — it's his genuine belief that the correct response to most problems is better posture and a nice cake.

**Trigger:** ROOM_STOPPER fires
**Response:** Either (a) no response at all — Blofeld has already moved on to a pigeon, a bus, or a remark about the tea; or (b) a cheerful non-sequitur that functions as total non-acknowledgement — "Chin up, old thing" / "Oh, buck up" / "Now then, I think there's a rather wonderful—"

**Outcome weighting (from everyone else's perspective):**
- CLEAN: 0.0
- PARTIAL: 0.2 — the non-sequitur accidentally offers the wounded party an exit; they take it because it's the only one available
- FAILED: 0.8 — the pivot to pigeon/bus/cake happens mid-sentence as the victim is still visibly affected; Blofeld doesn't notice

**Outcome weighting (from Blofeld's perspective):**
- CLEAN: 1.0 — he has no idea anything happened

The comedy is the gap between these two weightings.

**bathos_register_start:** Cosmic delight. Everything is wonderful. The drop never comes for Blofeld because he never registers it. The bathos is entirely for the audience.

**Special mechanic — THE_PIVOT:** Once per session, Blofeld's non-recovery pivot (to pigeon, bus, or cake) accidentally says more about the situation than a direct acknowledgement would have. This is the CLEAN outcome for everyone else, but Blofeld still doesn't know it happened.

---

## Recovery outcome probability summary

| Character | CLEAN | PARTIAL | FAILED | Signature |
|-----------|-------|---------|--------|-----------|
| Faldo     | 0.1   | 0.3     | 0.6    | Clarification that makes it worse |
| Boycott   | 0.05  | 0.15    | 0.8    | Restatement + historical alibi |
| Tufnell   | 0.15  | 0.35    | 0.5    | Spiral; self-owns occasionally land |
| Blofeld   | 0.0*  | 0.2     | 0.8    | Never notices; pivot to pigeon |

*Blofeld's CLEAN is THE_PIVOT — structurally different, once per session.
