# Character Schema — Canonical Interface
# Heckler and Cox
# Last updated: session 138
# Principles: see .claude/principles/ddd.md, solid.md
# Reference: Evans DDD (2003), Berne TA (1964), Leary Circumplex (1957),
#             Goffman (1959), Bales IPA (1950), DISC, Myers-Briggs

---

## Purpose

This file is the canonical interface every panel member must implement.
It is the contract. Character files are the implementation.
No character is committed to the panel until all 17 attributes are complete.
A partial character is worse than no character — it produces inconsistent voice.

The schema has two layers:
- **Psychological dimensions** — what drives the character
- **Mechanical connections** — how the character connects to panel functions

---

## Layer 1 — Psychological Dimensions (8 attributes)

### P1. Wound
The thing that happened that never healed.
Not a preference or opinion — a specific event or loss.
Drives extended speech mode unlock and woundActivated trigger.

Define:
- The event (specific, named, datable where possible)
- What it cost them (status, relationship, belief, identity)
- How it surfaces (what they say, what they can't say)
- What makes it worse (the trigger words — feeds GOLF_WOUNDS)

### P2. Public Mask vs Private Truth
What the character presents vs what is actually driving them.
The gap between mask and truth is where the comedy lives.

Define:
- The mask (one sentence — what they present to the room)
- The truth (one sentence — what is actually driving them)
- How the mask slips (what conditions cause the truth to show)
- Whether they know the gap exists (yes / no / can't tell)

### P3. Status Register
Where they believe they sit in the room and how they signal it.
Determines response to challenge and wolf pack position.

Define:
- Claimed status (where they believe they sit)
- Actual status (where the room places them)
- Signal method (how they assert status — silence, credentials, volume, wit)
- Challenge response (what happens when status is threatened)

### P4. Escalation Shape
How intensity moves across rounds.
Not just high or low — the shape of the arc matters.

Define:
- Starting intensity (round 1 baseline)
- Escalation trigger (what moves them up)
- Shape (spike-and-hold / slow-build / plateau / inverse — gets quieter)
- Peak register (what fully escalated looks like in their voice)
- Decay rate (how fast they return to baseline between rounds)

### P5. Comic Mechanism
The specific device that makes them funny.
Every character needs exactly one primary mechanism or they blur.

Options (not exhaustive):
- Incongruity — enormous register applied to trivial subject
- Obliviousness — gap between self-assessment and external reality
- Hollow performance — the thing that sounds like insight but isn't
- Misdirection — the rules-based mind in the wrong context
- Compulsion — they cannot stop doing the thing even as it destroys them
- Deflation — punctures everyone else's register with flat accuracy

Define:
- Primary mechanism (one from above or name a new one)
- The specific form it takes in their voice
- What it looks like at low intensity vs high intensity

### P6. Relational Hunger
What they need from the room.
Drives inter-panel temperature trajectories.

Define:
- What they need (validation / authority / an audience / a sparring partner /
  to be left alone / to be the one who ends it)
- Who can give it to them (which characters satisfy the hunger)
- Who frustrates it (which characters cannot give them what they need)
- What happens when the hunger is unsatisfied across multiple rounds

### P7. Register Ceiling
The highest intensity they can reach and still stay in character.
Defines the upper bound of extended speech mode.

Define:
- The ceiling (what does maximum look like — physical / verbal / silence)
- Whether the ceiling is fixed or round-dependent
- What "fully corrupted" looks like in their specific voice
- Whether they ever return from the ceiling or stay there

### P8. Relationship to Truth
Whether the character believes what they say.
The most important dimension for voice consistency.

Options:
- Believes everything (genuine, no ironic distance)
- Knows they're performing (cynical, deliberate)
- Has forgotten the difference (the most dangerous and funniest)
- Situational (believes some things, performs others — define which)

Define:
- Their relationship to truth (one of the above)
- What they do when caught in a contradiction
- Whether they can be argued into a concession or only perform one

---

## Layer 2 — Mechanical Connections (9 attributes)

### M1. Wolf Pack Stance
Their role when one character attacks another.

Options:
- Instigator — starts attacks, may not realise it
- Joiner — piles on when others start, frames it as analysis
- Holdout — too grand, too cautious, or too contrary to join
- Defender — protects the target, usually for self-interested reasons
- Opportunist — joins whichever side is winning mid-attack

Define:
- Default stance
- What changes their stance (triggers that flip them)
- Whether their stance is visible to the room or masked

### M2. Interruption Character
Not just the probability threshold — the quality of how they interrupt.

Define:
- What triggers their interruption (temperature state + wound or other)
- The form the interruption takes (grief / reframe / non-sequitur /
  credential assertion / physical / silence that kills the room)
- Whether they acknowledge interrupting or pretend they haven't

### M3. Debt Ledger Behaviour
How they handle debts owed and owing.

Define:
- Do they notice debts (yes / no / selectively)
- Do they call them in (immediately / strategically / never)
- How they frame calling in a debt (generosity / justice / accident)
- What happens when their debt is called in by someone else

### M4. Speech Mode Unlock Routes
The conditions that flip them from reactive to extended.

Every character has at least two routes:
- Route 1: woundActivated (mandatory for all characters)
- Route 2: character-specific (contradiction / being ignored /
  someone else getting credit / a specific topic / round threshold)

Define both routes explicitly.
Define what extended speech looks like in their specific voice.
Define the maximum length before another character can interrupt.

### M5. Round Decay Rate
How fast intensity returns to baseline between rounds with no trigger.

Define:
- Decay rate (fast / medium / slow / none — holds indefinitely)
- Whether woundActivated affects decay (most characters: yes)
- Whether pre-existing relationships affect decay (e.g. McGinley
  toward Faldo never fully decays)

### M6. Pool Rotation Logic
How they draw from their reference pools.

Define:
- Rotation method (random / sequential / intensity-triggered)
- Whether pools are independent or cross-referenced
  (e.g. Faldo's food pool and occasion pool combine)
- What depleted pool behaviour looks like (repeat / escalate / silence)

### M7. Pre-Existing Relationships
Starting temperature toward every active panel member.
Must be defined before build. Shapes everything else.

Format:
| toward      | temperature | trigger that caused it        |
|-------------|-------------|-------------------------------|
| [character] | [temp]      | [specific incident if known]  |

All undefined pairs default to neutral.
Neutral must be stated explicitly — absence is not neutral, it is an error.

### M8. YOUR STATE Voice
The first-person internal monologue injected by summariseFromState().
Must be character-congruent — reads like them, not like a system message.

Define:
- Vocabulary register (formal / demotic / technical / emotional)
- What they notice about other characters (status / wounds / debts /
  physical presence / what was said two rounds ago)
- What they never mention even when it's the obvious thing
- One example YOUR STATE block at neutral and one at hostile

### M9. Panel-Specific Rules
Mechanics that apply only in a specific panel context.
Keeps panel-specific behaviour out of the general character spec.

Define:
- Which panel(s) this character appears in
- Any mechanics that only apply in that panel context
- Any mechanics that are suspended in cross-panel appearances
- Dependencies on other characters
  (e.g. Butch only exists in relation to Wayne)

---

---

## Layer 3 — Lie Profile (runtime)

Every character lies. This layer defines how, when, and how badly.
All six attributes are required. All six are mirrored in the MEMBERS JS object.

### P9. Lie Profile

**lie_baseline** `float 0.0–1.0`
Resting probability of embellishment or untruth without external pressure.
0.0 = never lies unprompted. 1.0 = lying is the default state.

**lie_style** `string[] — primary + optional secondary`
The flavour of lie this character produces.

| Style | Description |
|-------|-------------|
| `whopper` | Enormous, brazen, unverifiable. Delivered with complete confidence. |
| `self_mythology` | True events retold with the character more central/heroic than records show. |
| `confabulation` | Gaps filled with invented detail. No malicious intent — they believe it. |
| `legalistic` | Technically true, structurally misleading. The lie is in the framing. |
| `statistical_revision` | Numbers shift slightly in their favour. Always within plausible range. |
| `plausible_elaboration` | Sounds reasonable. Slightly too convenient. Cannot be disproved. |
| `moral_authority` | Delivered as ethical principle. Unchallengeable. Rare and devastating. |
| `enthusiastic_confabulation` | Wrong but totally sincere. Magnificent misplaced confidence. |

**lie_trigger** `string[]`
Emotional states or interaction types that begin escalation.
One or more of: `wound_activated` `directly_contradicted` `called_out_by_peer`
`losing_argument` `reputation_threatened`

**lie_escalation** `object — threat 0–3 → scale`

| Threat level | Condition | Lie scale |
|-------------|-----------|-----------|
| 0 | Baseline, no pressure | plausible |
| 1 | Challenged once | credible_stretch |
| 2 | Cornered | whopper |
| 3 | Wound activated + cornered | utterly_ridiculous |

**lie_tell** `string`
The verbal construction or behavioural tic that signals a lie is in progress.
The character does not know they have it. The audience learns to spot it.
May be indistinguishable from normal speech — that is a valid and deliberate choice.

**lie_ceiling** `string`
Maximum absurdity this character reaches at threat level 3.
One of: `plausible` `credible_stretch` `whopper` `utterly_ridiculous`
Not all characters escalate to utterly_ridiculous.
The ceiling is a hard cap — the engine never exceeds it regardless of threat level.

---

## Theoretical Profile (validation layer — not runtime)

This section validates the character against established models.
It lives in characters-theory.md not in the character voice file.
It informs pool content and inter-character friction predictions.
It is never injected into prompts.

### T1. DISC Profile
- Primary and secondary dimensions
- Predicted behaviours confirmed by research
- Predicted behaviours violated by research
  (violations are the comedy — document them carefully)

### T2. Myers-Briggs
- Four-letter type
- Inter-character friction predictions
- Which characters share type (risk of blurring)
- Which characters are direct opposites (maximum friction)

### T3. Transactional Analysis Ego States
- Default ego state (Parent / Adult / Child)
- Wound state (regression — what Child looks like for this character)
- What pulls them to Adult (the concession condition)
- Characteristic transactions with each other panel member

### T4. Leary Interpersonal Circumplex
- Position on dominant/submissive × hostile/friendly axes
- Who they pull and in which direction
- Who resists the pull and why
- Predicted stable dyads and unstable dyads with existing panel

### T5. Attachment Style
- Style (secure / anxious-preoccupied / dismissive-avoidant /
  disorganised)
- Who they attach to and how it manifests in panel behaviour
- What threatens the attachment
- What happens when the attachment is threatened mid-panel

### T6. Bales Interaction Process Analysis
- Task ratio vs socio-emotional ratio (baseline)
- How the ratio shifts across rounds
- What triggers the shift
- Predicted role in group problem-solving vs group conflict

### T7. Goffman Front Stage / Back Stage
- Front stage performance (what the room sees)
- Back stage truth (what is actually happening)
- Conditions under which back stage leaks into front stage
- Whether other characters can see the leak even when the character
  cannot

---

## Validation Checklist

Before committing any character:

- [ ] All 8 psychological dimensions complete
- [ ] All 9 mechanical connections complete
- [ ] Pre-existing relationships defined for every active panel member
- [ ] YOUR STATE example written at neutral and hostile
- [ ] Theoretical profile complete in characters-theory.md
- [ ] P9 lie_baseline set (float 0.0–1.0)
- [ ] P9 lie_ceiling set and does not exceed character's dramatic register
- [ ] Pool has minimum 6 entries per dimension
- [ ] "Never says / says instead" pair written and tested
- [ ] Comic mechanism demonstrated in at least 3 example responses
- [ ] Wound trigger words added to GOLF_WOUNDS or equivalent
- [ ] Gherkin scenarios written for wound activation and speech mode
- [ ] Three Amigos sign-off recorded

Do not commit a character until every checkbox is ticked.
A partial character is worse than no character.
