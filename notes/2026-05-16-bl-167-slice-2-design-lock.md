# BL-167 Slice 2 — Design Lock Note
# 2026-05-16 — Slice 2 thread (Claude Code)
# Status: pure-design mode while Slice 1 + BL-168 land on main.
# Shared between Slice 2 thread and primary thread.

---

## Locked design (Rod 2026-05-16)

- **Scope:** FULL — all 7 weight components ship in Slice 2 (not just locked-Gherkin minimum).
- **Cadence:** per-slot rescoring. After each turn, score remaining middle cast against THAT turn, pick one, remove from pool, repeat.
- **Weights (defaults, run-and-tune):**
  - `w1 wound = 3`
  - `w2 debt = 2`
  - `w3 hostile temp = 2`
  - `w4 posture contradiction = 1`
  - `w5 enthusiasm primer = 3` (must equal w1 per locked scenario 9)
  - `w6 warm temp = 2`
  - `w7 claimed territory = 1`
- **Floor:** `pmin = 0.10` — individual cold candidate selected at rate ≥ pmin
- **Uniform fallback:** when Σscore == 0, P(i) = 1/M
- **Matcher:** reuse WoundDetector pattern (case-insensitive phrase match — proven on multi-word wounds)
- **Schema attribute:** "enthusiasm primer" stays as runtime data only — NOT promoted to canonical 17-attribute character schema yet
- **No accuracy verification:** engine has no fact-check routine; misread-but-eager allowed (Principle 3)
- **Panel-agnostic:** engine takes panel data as input (ctx.wounds, ctx.enthusiasms); does NOT hardcode Golf (Principle 1)

---

## GOLF_ENTHUSIASM — primer proposals (Rod to correct)

Purpose: lights-up keywords that, when found in the previous turn, raise this character's selection score (+w5). Distinct from GOLF_WOUNDS (which raise score via +w1). Engine never verifies accuracy — misread-but-eager allowed.

Murray is ANCHOR — never scored for middle selection. Including his primers anyway for data-shape symmetry with GOLF_WOUNDS. **Rod decision: include or omit?**

---

## faldo (8 proposed)

- `commitment`, `committed` — his entire frame; fires the school-volunteers monologue
- `sandwich`, `sandwiches` — food metaphor system entrypoint
- `preparation`, `prepared` — adjacent to commitment, fires almost-insight mode
- `augusta`, `1996` — his proudest major, no defensiveness
- `ginsters`, `pasty`, `garage` — BL-172 voice pool, his signature register
- `cortina`, `capri`, `cavalier` — cars pool
- `schools`, `volunteers`, `young people` — fires schools-commitment escalation
- `chuckle`, `guinness world record` — McGinley-warmth route

NOTE: wound words (`leadbetter`, `tuna`, `beef`, `ham`, `valhalla`, `2008`, `captaincy`, `pairings`, `poulter`, `fanny`, `sunesson`, `tiger`, `norman`) deliberately EXCLUDED from primers — they fire +w1 instead.

---

## mcginley (7 proposed)

- `ryder cup` — fires credibility bid (the source of his pride, not his wound)
- `captaincy`, `captain` — also wound for Faldo, primer for McGinley
- `gleneagles`, `2014` — his captaincy
- `belfry`, `2002`, `ten foot putt` — his most-cited bid
- `framework`, `frameworks` — his core mechanism
- `moses` — fires Moses register attempt
- `validation`, `agree`, `would you not agree` — fires validation hunger

NOTE: `gobshite`, `wheelhouse` excluded — those are wounds.

---

## coltart (8 proposed)

- `weather`, `sleet`, `horizontal sleet` — hardship pool
- `skelped`
- `school radiator`, `headmaster`
- `walking home`, `running home`, `32km`, `47km`, `57km`
- `pie` — Scottish food fond reference
- `documented`, `hole by hole` — his account-style fires
- `carnoustie` — dignity-recognising reference (Radar-warm)
- `ayrshire`, `scotland`

NOTE: `valderrama`, `seve`, `westwood`, `cameraman`, `three and two`, `3 and 2`, `brookline` excluded — those are wounds.

---

## dougherty (7 proposed)

- `love`, `what I love about` — his core frame
- `tempo` — Butch said his tempo was a gift, his proudest compliment
- `sir nick`, `nick faldo`, `faldo` — fires sycophancy arc
- `transcendent meal`, `transcendent`
- `engagement` — his Gleneagles re-framing
- `lancashire`
- `breathless`, `yeah`

NOTE: `can't improve`, `give up`, `defeatist`, `never get better` excluded — wounds.

---

## henni (6 proposed)

Primer = topics on her list that she's primed to ask about. When someone else raises them, she leans in to pursue the follow-up.

- `pimento cheese`, `pimento`, `concession stand` — Murray's wound, her list item
- `cameraman`, `cameraman incident` — Coltart's wound, her list item
- `seventh dimension`, `7th dimension` — McGinley's wound, her list item
- `scoring tent`, `parnevik` — Roe's wound, her list item
- `welwyn`, `welwyn garden city` — Faldo's wound, her list item
- `restaurant`, `restaurants`, `michelin` — restaurant pool

NOTE: `don't answer that`, `skip that`, `ignore that question` excluded — wounds.

---

## roe (7 proposed)

- `sheffield`
- `short game`, `short-game`, `coaching`, `coached`, `coach`
- `volume`, `wrong volume` — his self-aware tic
- `accurate`, `accurately`, `analysis`
- `father`, `father would have been proud`
- `rule 6-6b`, `royal st george`, `2003` (last two also wounds — engine adds both contributions)
- `tiger`, `painkillers` (also wounds — same dual-fire)

NOTE: wound list (`scorecard`, `disqualified`, `parnevik`, `royal st george`, `2003`, `painkillers`, `wedge game`, `norgaard`, `belfry`) — some overlap with primers above. Per Principle 3, engine adds both contributions; no conflict.

---

## murray (8 proposed — anchor, may not need)

- `history`, `historic`, `historically significant`, `historical`
- `the open`, `championship`, `championships`
- `1860`, `1933`, `vardon`, `morris`, `prestwick` (handoff illustrative)
- `remarkable`, `extraordinary`, `what a question`
- `pimento cheese`, `concession stand`, `augusta`
- `ceremonial`, `weight`
- `formation`, `medieval`, `crust`, `Caledonian`
- `peroration`

NOTE: `doesn't matter`, `not important`, `move on`, `insignificant` excluded — wounds.

---

## Open questions for Rod

1. **Include Murray (anchor) in GOLF_ENTHUSIASM map?** Symmetry with WOUNDS says yes; lean-engine-data says no.
2. **Phrase matching:** WoundDetector handles multi-word ("treble five"). EnthusiasmDetector reuses same? (Default: yes.)
3. **Case sensitivity:** WoundDetector is case-insensitive. Same for primers? (Default: yes.)
4. **Multi-character primer overlap:** `pimento cheese` fires both Murray AND Henni. Is that intended? (Probably yes — both lean in. Engine returns both as scored, selection picks one.)
5. **Quantity:** 6–10 per character per handoff. Any character feel light or excessive?
6. **Wound/primer overlap policy:** Some words appear in both (Roe `2003`/`tiger`, etc). Engine adds both contributions, that's by-design per Principle 3. Confirm or split.

---

## What I'm waiting on

Per pure-design mode: nothing else commits until Slice 1 lands green AND you've corrected this list.

When ready, give corrections inline or say "approved" / "approved with changes [list]". I'll roll into the canonical data once Slice 1 is in.
