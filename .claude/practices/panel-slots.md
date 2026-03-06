# Panel Slot System
# Last updated: 2026-03-06
# Applies to: all panels (Long Room, 19th Hole, Football, future panels)

---

## Purpose

Random panel generation and user panel selection use a slot system to ensure
tonal balance. A well-formed panel needs representation across role types.
Without this, panels collapse into pure chaos (all Engines) or paralysis
(all Anchors).

---

## The Five Slots

| Slot | Function | Risk if absent |
|------|----------|----------------|
| **Anchor** | Moral or technical gravity. Speaks less, lands harder. Keeps panel from flying apart. | Panel becomes pure noise. No stakes. |
| **Engine** | High energy. Wound fires early. Activates others. High Ivan metric. | Panel never ignites. |
| **Grievance** | Institutional exile. Was wronged by the game or its administration. Produces friction with Anchor. | Panel too comfortable. No structural tension. |
| **Exotic** | Different register. Linguistic oddity, dead, operating on a different plane, or guest. | Panel feels like four people who agree on the rules. |
| **Liar** | Highest lie_baseline. Escalates fastest under threat. Introduces unreliable narrator dynamic. | Panel too honest. Audience trusts everything. |

**Note:** ALL characters lie (see P9 — Lie Profile in characters-schema.md).
The Liar slot is the character whose lie_baseline is highest AND whose
lie_ceiling is `whopper` or `utterly_ridiculous`. Not the only liar —
the most committed one at baseline.

A character with a secondary slot satisfies both slots. No additional
draw needed for the secondary slot.

---

## Panel Generation Rules

### 5-person panel (default — EXP-001 hypothesis)
Draw one character per slot. All five slots filled.
Secondary slots count — do not draw again for the secondary.

### 4-person panel (EXP-001 variant A)
Drop Exotic first. If no standalone Exotic available, drop second Liar.
Never drop Anchor or Engine — panel collapses without them.

### 6-person panel (EXP-001 variant B)
Double Engine slot. Two Engine characters increase collision, not noise.
Never double Anchor — two Anchors kills pace.

### Conflict weighting
When randomly selecting within a slot, prefer characters with pre-existing
tension over characters with warmth. Documented feuds are worth more than
neutral pairings. Minimum 60% frequency threshold for high-tension pairs
to appear together when both are in the eligible pool.

### User selection
- Minimum 3 characters. Below 3: error, panel not assembled.
- Maximum 6 characters. Above 6: error, panel not assembled.
- 6 characters: display warning "Panels of 6 may reduce individual character contribution"
- Manual selection bypasses slot validation — user takes responsibility for balance.

---

## Long Room — Slot Assignments

| Character | Primary slot | Secondary slot | lie_ceiling | Notes |
|-----------|-------------|----------------|-------------|-------|
| holding | anchor | — | credible_stretch | Purest anchor. Moral weight. Economy of words. |
| boycott | anchor | grievance | whopper | Curmudgeon variant. Grievance calcified into authority. |
| botham | engine | liar | utterly_ridiculous | Wound fires early. Lies improve with each retelling. |
| bumble | engine | liar | whopper | Activates everyone. Enthusiastic confabulation. |
| kp | grievance | liar | whopper | Institutional exile. Legalistic lie style. |
| gower | grievance | exotic | credible_stretch | Different register. Elegance as moral position. |
| warne | exotic | liar | whopper | Dead. Operates as if still active. Self-mythology. |
| blofeld | exotic | liar | utterly_ridiculous | ⚠️ blofeld.md MISSING — file needs creating before panel use |

### Long Room standing conflicts (conflict weighting applies)
| Pair | Tension | Source |
|------|---------|--------|
| botham / boycott | high | Christchurch 1978 run-out |
| kp / boycott | medium | Selection philosophy, management culture |
| botham / kp | low-warm | Generational mirror — both found ECB airless |
| warne / boycott | neutral | Craft respect, off-field chaos incomprehension |

---

## 19th Hole — Slot Assignments

| Character | Primary slot | Secondary slot | Notes |
|-----------|-------------|----------------|-------|
| faldo | anchor | exotic | Six majors, swing reconstruction authority, dry register |
| butch | anchor | — | Coach's eye. Calm absolute authority. Fixes everything in 40 minutes. |
| murray | engine | — | Historic gravity. Everything will be remembered. |
| radar | engine | liar | Wayne Riley. Chaos monkey. Bush Tucker Man wound underneath the hat. Intoxication arc. |
| mcginley | engine | grievance | Gobshite framing, credibility bids, validation hunger. Three engines possible in golf. |
| dougherty | grievance | liar | Nearly-man wound. Defeatism. Excuse-making. |
| coltart | grievance | — | Valderrama 1997. Never played. Most extreme grievance wound on any panel. |
| henni | exotic | — | Warm, precise. Asks what nobody else will. Follow-up always prepared. |
| roe | exotic | grievance | Guest. Sheffield. Says what everyone's thinking at wrong volume. DQ wound. |

### 19th Hole notes
- Three Engine characters (murray, radar, mcginley) means 6-person panels risk
  all three firing simultaneously. Conflict weighting should prefer
  radar + one of murray/mcginley, not all three together.
- roe is a guest character — exotic register, different panel rules may apply.
  Confirm guest mechanic before implementing slot draw for roe.
- faldo's exotic secondary reflects the Jesus register and sandwich metaphor
  system — operates on a different plane when fully activated.

### 19th Hole standing conflicts (conflict weighting applies)
| Pair | Tension | Source |
|------|---------|--------|
| faldo / mcginley | high | Faldo finds McGinley's warmth performed. McGinley needs Faldo's validation. |
| radar / butch | medium | Chaos vs authority. Wayne's hat angle vs Butch's straight line. |
| coltart / faldo | medium | Valderrama. Faldo was there. Coltart wasn't. |
| dougherty / radar | low | Dougherty's defeatism vs Radar's aggression. Different failure modes. |

---

## Football Panel — Slot Assignments
[To be completed — souness.md, micah.md, neville.md, carragher.md,
ron-atkinson.md exist in repo. Remaining characters to be confirmed
from index.html MEMBERS array before writing.]

---

## Boardroom — Slot Assignments
[To be completed — cox.md exists. Remaining characters to be confirmed
from index.html MEMBERS array before writing.]
