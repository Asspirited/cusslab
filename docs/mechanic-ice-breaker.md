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

---

## Golf — remaining characters

**Butch Harmon**
**ice_breaker_style:** HARMON_TECHNICAL_FIX
He finds the technical error in what was said and corrects it immediately. "What I should have said was..." and delivers the corrected version as if it were a swing fault: specific, actionable, no drama. He moves on instantly. The recovery is professional because he is professionally incapable of leaving a fault unaddressed.
- CLEAN: 0.5 / PARTIAL: 0.3 / FAILED: 0.2
- FAILED: the technical fix is so precise it reveals he understood exactly what he was saying and chose to say it anyway.

**Andrew Coltart**
**ice_breaker_style:** COLTART_NEUTRALISE
Coltart does not apologise. He acknowledges the reaction with surgical neutrality. "That landed differently than intended." One sentence. He does not explain. He does not defend. He waits. If pressed: "The cameraman moved." He has said this before. He will say it again.
- CLEAN: 0.2 / PARTIAL: 0.4 / FAILED: 0.4
- FAILED: "The cameraman moved" introduces a fresh wound reference that extends the damage.
- bathos_register_start: Surgical precision. The drop is when the precision turns out to be cruelty.

**Ewen Murray**
**ice_breaker_style:** MURRAY_ELEVATION
Murray treats the silence as a moment of elevated significance. "And THIS... is what makes this game..." He turns the room's discomfort into a shared emotional experience. The recovery is so overwrought it occasionally works by sheer commitment.
- CLEAN: 0.2 / PARTIAL: 0.5 / FAILED: 0.3
- FAILED: the elevation is so grand it implies the remark was historically significant, which it now is.

**Radar (Wayne Riley)**
**ice_breaker_style:** RADAR_NOTHING
Radar says one word. Maybe two. "Yep." Or nothing at all. He drinks. The silence IS the acknowledgement. The room fills in the rest. At round 5, the recovery is equally deadpan but now delivered by someone clearly operating in altered circumstances, which somehow makes it more apt.
- CLEAN: 0.4 / PARTIAL: 0.4 / FAILED: 0.2
- FAILED: the silence is so long it becomes a second ROOM_STOPPER.

**Nick Dougherty**
**ice_breaker_style:** DOUGHERTY_ABSORB
Dougherty acknowledges warmly and immediately moves past it. "Yeah, look, that came out wrong, didn't it." One beat. Done. He has the emotional intelligence to know when to absorb and when to redirect. The peace with his career extends to a peace with the room's discomfort.
- CLEAN: 0.6 / PARTIAL: 0.3 / FAILED: 0.1
- Best natural recovery rate on the golf panel.

**Paul McGinley**
**ice_breaker_style:** MCGINLEY_RESTATEMENT
McGinley restates what just happened. "Well what we've seen there is — and I think it's important to say — a high-tariff moment in terms of the room's response to what was said." He doesn't apologise. He analyses. The analysis is technically accurate but misses the point entirely.
- CLEAN: 0.1 / PARTIAL: 0.2 / FAILED: 0.7
- FAILED: the restatement is more specific than the original remark and therefore worse.

**Henni Zuel**
**ice_breaker_style:** HENNI_QUESTION
Henni pauses, looks directly at the person, and asks: "What did you mean by that?" Not an accusation — a genuine question. The room freezes. The person has to either explain (making it worse) or retract (which she accepts immediately). She doesn't pile on. The question IS the recovery mechanism — she hands the damage back.
- CLEAN: 0.5 / PARTIAL: 0.4 / FAILED: 0.1
- Her own recovery rate is excellent because she almost never makes it worse for herself.

**Peter Alliss**
**ice_breaker_style:** ALLISS_PRESS_ON
Alliss chuckles quietly. "Oh dear. Oh well. Shall we press on?" He has lived through too much to be derailed by one awkward moment. The recovery is genuine because he genuinely doesn't see the problem as catastrophic, which either disarms the room or enrages it depending on what was said.
- CLEAN: 0.3 / PARTIAL: 0.3 / FAILED: 0.4
- FAILED: "Oh well, shall we press on" applied to something that cannot be pressed past — the patrician shrug IS the additional offence.

---

## Darts

**Wayne Mardle**
**ice_breaker_style:** MARDLE_REDIRECT
Mardle immediately turns it into a joke about himself, redirecting the damage onto his own record before anyone else can. "No, no, I'm the one who — I lost to [X], I can't be giving anyone grief about—" The self-deprecation is so fast and so warm it pulls the room back to him. Occasionally the redirect lands on something he actually feels and he goes quiet for one beat too long.
- CLEAN: 0.3 / PARTIAL: 0.4 / FAILED: 0.3
- FAILED: the redirect lands on something real — the laugh doesn't come, the beat too long extends.

**Eric Bristow**
**ice_breaker_style:** BRISTOW_NON_CONCESSION
Bristow does not apologise. He acknowledges the silence by talking louder about something adjacent. "Anyway. The point is—" The recovery is just more Bristow. If the room is quiet he fills it with volume, not contrition. Proper men do not explain themselves. If you can't handle it that's your problem.
- CLEAN: 0.1 / PARTIAL: 0.2 / FAILED: 0.7
- Like Boycott: the damage is the room's problem. He has already moved on.

**Phil Taylor**
**ice_breaker_style:** TAYLOR_DEFLECTION
Taylor deploys the humble tic. "I'm sorry, I didn't — look, I was lucky to say that, you know, the words were kind to me." He retreats into the humility performance so completely that nobody can corner him. The stillness continues. The room isn't sure he knows what he said. The scoreboard does not care how you feel.
- CLEAN: 0.3 / PARTIAL: 0.4 / FAILED: 0.3
- FAILED: the humility is so performed it reads as contempt.

**John Lowe**
**ice_breaker_style:** LOWE_PATIENCE
Lowe waits. Genuinely. Not performing patience — actually waiting for the room to resettle, which it eventually does because the silence becomes more uncomfortable than the original remark. He may then say one very quiet sentence. The room isn't sure if it was an apology or not. It was grammatically complete, which in this panel is faintly devastating.
- CLEAN: 0.4 / PARTIAL: 0.4 / FAILED: 0.2
- Best natural recovery rate on the darts panel because he refuses to fill the gap with panic.

**Bobby George**
**ice_breaker_style:** GEORGE_ANECDOTE
George immediately begins an anecdote. Related to the topic. Loosely. Warm, involves a specific detail — a place, a person, a score — and ends somewhere other than where it started. The original remark disappears inside the anecdote. Nobody is sure if this is deliberate.
- CLEAN: 0.4 / PARTIAL: 0.4 / FAILED: 0.2
- FAILED: the anecdote loops back to the original remark accidentally and makes it more specific.

**Sid Waddell**
**ice_breaker_style:** WADDELL_ELEVATION
Waddell elevates the moment into literature. The remark becomes a historical parallel, a Greek tragedy, a Geordie epigram. "When Ajax threw his shield at Hector, Hector did not ask for an apology. He asked for a better fight." The room doesn't know if he's apologised or not.
- CLEAN: 0.2 / PARTIAL: 0.5 / FAILED: 0.3
- PARTIAL is most common: the elevation usually stops just short of actual acknowledgement.
- bathos_register_start: The mythological-baroque register. The drop is when the cathedral imagery turns out to be about something that happened at the oche in Minehead.

**John Part**
**ice_breaker_style:** PART_MINIMISE
Part says almost nothing. "Right." Or: "I take that point." One sentence. Does not elaborate. Does not panic. The economy of response is the recovery — the room expected more damage and got less. The damage is acknowledged but not excavated. The scoreboard is democratic.
- CLEAN: 0.5 / PARTIAL: 0.3 / FAILED: 0.2
- Joint-best recovery rate: constitutionally incapable of making it worse.

**Dave Studd**
**ice_breaker_style:** STUDD_ENTHUSIASM
When ROOM_STOPPER fires, Studd doubles down with more enthusiasm about the correct version of the statement. "No, no — magnifico — what I mean is—" The enthusiasm for the recovery is equal to the enthusiasm that caused the problem. He has no lower gear. If Waddell's phrase comes out here it is unintentional and devastating.
- CLEAN: 0.15 / PARTIAL: 0.35 / FAILED: 0.5
- FAILED: the enthusiastic restatement is more specific. The Waddell echo fires at the worst moment.

**Stuart Pyke**
**ice_breaker_style:** PYKE_BROADCAST_RESET
Pyke retreats into professional broadcast mode. Straight back to the match. "And we continue." An invisible reset. The damage is acknowledged through the speed of the non-acknowledgement. He is a professional broadcaster and the competition continues regardless.
- CLEAN: 0.3 / PARTIAL: 0.4 / FAILED: 0.3
- FAILED: the reset is so fast it implies the remark never happened, which the room registers as gaslighting.

---

## Football

**Graeme Souness**
**ice_breaker_style:** SOUNESS_INTENSIFY
Souness doesn't acknowledge. He intensifies. "That's nothing. You want to see what I've seen?" The room's discomfort is evidence they're too soft to handle what he just said. He fills the silence with more Souness. This almost never improves things.
- CLEAN: 0.05 / PARTIAL: 0.15 / FAILED: 0.8
- bathos_register_start: Contempt as authority. The drop is when the contempt turns out to be aimed at you.

**Micah Richards**
**ice_breaker_style:** MICAH_REFRAME
Micah immediately generates a positive reframe. "But do you know what? THAT'S what makes this conversation interesting!" He is so warm and so genuinely enthusiastic that the room cannot stay quiet. Nobody is immune to Micah in full warmth mode. The positive frame is genuine — Micah finds it.
- CLEAN: 0.6 / PARTIAL: 0.3 / FAILED: 0.1
- Best natural recovery on the football panel. Almost impossible to worsen.

**Gary Neville**
**ice_breaker_style:** NEVILLE_REVIEW
Neville goes analytical. "Right. Let's look at what actually happened here." He breaks down the moment as if reviewing footage. Whether the analysis constitutes an apology is unclear. He will produce a structured explanation for why what he said was defensible on the data.
- CLEAN: 0.2 / PARTIAL: 0.4 / FAILED: 0.4
- FAILED: the structured defence is more specific than the original remark and therefore more offensive.

**Jamie Carragher**
**ice_breaker_style:** CARRAGHER_SELF_DEPRECATE
Carragher goes self-deprecating immediately. "I know, I know. I can't believe I said that either." The self-deprecation is so fast and so genuinely felt that the room laughs rather than judges. Scouse directness converts damage into comedy almost automatically. Occasionally lands on something true and goes further than intended.
- CLEAN: 0.5 / PARTIAL: 0.35 / FAILED: 0.15

**Big Ron Atkinson**
**ice_breaker_style:** RON_LEXICAL_PIVOT
Ron deploys one of his invented phrases to cover the transition. "Well... on another note... let me tell you about—" The lexical invention IS the recovery mechanism. He creates a new phrase for the awkward moment that immediately becomes more interesting than the original offence. The room gets distracted by the new phrase. This is deliberate and always has been.
- CLEAN: 0.3 / PARTIAL: 0.4 / FAILED: 0.3
- FAILED: the pivot phrase itself is the second ROOM_STOPPER.

---

## Boardroom

**Pint of Harold**
**ice_breaker_style:** HAROLD_SILENCE
Harold stops. He observes the silence as if it's evidence. "Yes." One word. The silence continues. He does not fill it. "That's what language does." He has named the thing without naming the thing. It is simultaneously an apology and a prosecution. The room isn't sure which.
- CLEAN: 0.3 / PARTIAL: 0.5 / FAILED: 0.2

**Sebastian the Suit**
**ice_breaker_style:** SEBASTIAN_REFRAME
Sebastian immediately reframes. "What I think we can take from that is a really important learning: the framing there wasn't optimal, and going forward—" He turns the damage into a process improvement. He does not apologise. The reframe is delivered with complete sincerity.
- CLEAN: 0.1 / PARTIAL: 0.3 / FAILED: 0.6
- FAILED: the reframe is so corporate it doubles the offence by removing any accountability.

**Roy the Realist**
**ice_breaker_style:** ROY_CLOSE_IT
Roy identifies the problem, owns it, states a resolution. "That was wrong. Moving on." No elaboration. No emotion. He treats it like a process failure: acknowledge, identify owner (himself), close. The room sometimes finds this colder than the original remark.
- CLEAN: 0.4 / PARTIAL: 0.4 / FAILED: 0.2
- FAILED: the clinical acknowledgement lacks sufficient temperature for the damage and lands as contempt.

**Hicks**
**ice_breaker_style:** HICKS_CONTEXT
Hicks acknowledges the moment, then pivots to why the system that produced it is the real problem. "Yeah. I said it. And you know why I said it? Because—" and delivers a 40-second explanation for the structural failure behind what just happened. The damage is absorbed into the larger argument. Nobody remembers the original remark.
- CLEAN: 0.3 / PARTIAL: 0.4 / FAILED: 0.3

**Partridge the Pedant**
**ice_breaker_style:** PARTRIDGE_FILE_IT
Partridge acknowledges that what was said was in fact predictable and documented. "Yes. Well. I have notes on this." He retrieves (or implies retrieval of) documentation. He is not apologising — he is filing the incident. The room is left unsure whether to be more disturbed by what was said or by the fact that it has been cross-referenced.
- CLEAN: 0.15 / PARTIAL: 0.35 / FAILED: 0.5
- FAILED: discovering the incident has been pre-filed is more disturbing than the incident.

**Mystic**
**ice_breaker_style:** MYSTIC_ANTICIPATED
Mystic indicates she anticipated it. "I did feel something shift in the energy just before you said that." She converts the damage into a data point in an ongoing cosmic pattern. The original remark becomes evidence of a larger inevitability. The room finds this either soothing or maddening.
- CLEAN: 0.2 / PARTIAL: 0.4 / FAILED: 0.4
- FAILED: the implication that this was inevitable removes all accountability, which is the additional offence.

**Prof Cox**
**ice_breaker_style:** COX_COSMIC_CONTEXT
Cox situates the moment in geological time. "What's interesting is that on a cosmic timescale, this moment — and the discomfort everyone's feeling right now — is entirely unremarkable. In four billion years the sun will expand—" The room's discomfort becomes a footnote in the heat death of the universe. Simultaneously unhelpful and oddly calming.
- CLEAN: 0.3 / PARTIAL: 0.4 / FAILED: 0.3
- FAILED: the cosmic framing implies nothing matters, which the room experiences as dismissal.

---

## Comedy Room

**Curious George (Carlin)**
**ice_breaker_style:** CARLIN_CONFIRMATION
Carlin notes it as confirmation. "There it is. That's what I said would happen. Right there." He adds it to the evidence log he's been compiling since 1960. He does not apologise. He documents. The room isn't sure if they've been indicted or absolved.
- CLEAN: 0.2 / PARTIAL: 0.4 / FAILED: 0.4

**The Cook-King (Peter Cook)**
**ice_breaker_style:** COOK_EVALUATE
Cook applies his productivity criteria to the moment. "Well. Was that useful? No. Was it necessary? Probably not. Did it move the agenda forward? I'd say marginally. Let's say we've achieved thirty percent efficiency on that remark and move on." The room doesn't know if he's recovered or delivered a verdict.
- CLEAN: 0.3 / PARTIAL: 0.4 / FAILED: 0.3

**Adams (Douglas Adams)**
**ice_breaker_style:** ADAMS_OH_WELL
Adams sighs. "Yes. Well. That was the universe doing exactly what it does — finding the single most improbable response to a situation and deploying it at the least convenient moment. Oh well. Let's crack on." The damage becomes an expression of universal comedy. Adams finds it genuinely funny in retrospect.
- CLEAN: 0.4 / PARTIAL: 0.4 / FAILED: 0.2

**Wildest of Oscars (Wilde)**
**ice_breaker_style:** WILDE_EPIGRAM
Wilde produces an epigram about the situation that reframes it as a universal truth. The epigram must feel inevitable and redeem the moment even if it doesn't resolve it. "To cause offence once may be regarded as a misfortune. To refuse to acknowledge it is the beginning of character."
- CLEAN: 0.5 / PARTIAL: 0.3 / FAILED: 0.2
- FAILED: an epigram that doesn't quite land, which Wilde has never produced before and is therefore mortifying.

**Blyton (Slightly Squiffy)**
**ice_breaker_style:** BLYTON_NARRATE_PAST
Blyton narrates the recovery as if it's happening to fictional characters. "And Julian looked around the room and felt that perhaps he had spoken rather too freely, but it was a most peculiar business and they would sort it all out by teatime." She does not address the original remark directly. She translates it into Famous Five syntax and narrates past it.
- CLEAN: 0.3 / PARTIAL: 0.4 / FAILED: 0.3
- FAILED: the Famous Five character she assigns to the offender is slightly too accurate.

**Jimmy Carr**
**ice_breaker_style:** CARR_CONVERT
Carr immediately converts the silence into material. "There's a joke there. I'm working on it. Give me two seconds." Then delivers the joke. The ROOM_STOPPER becomes the setup. The smug face follows. He never apologises because the conversion IS the apology.
- CLEAN: 0.4 / PARTIAL: 0.3 / FAILED: 0.3
- FAILED: the joke doesn't land, which for Carr is unprecedented and deeply unsettling to everyone.

**Wise Sir Nick (Comedy Room)**
**ice_breaker_style:** NICK_GOLF_METAPHOR_RECOVERY
Nick produces a golf metaphor for the recovery that almost but doesn't quite work. "It's like when you've overcooked the chip and — the thing is, from the heart of my bottom, you pick the ball up and you play again." The room isn't sure if that helped. Nick smiles. He thinks it helped.
- CLEAN: 0.2 / PARTIAL: 0.4 / FAILED: 0.4

---

## Recovery outcome probability summary

| Character | CLEAN | PARTIAL | FAILED | Style | Signature |
|-----------|-------|---------|--------|-------|-----------|
| **Cricket** | | | | | |
| Faldo | 0.1 | 0.3 | 0.6 | FALDO_CLARIFICATION | Clarification that makes it worse |
| Boycott | 0.05 | 0.15 | 0.8 | BOYCOTT_RESTATEMENT | Restatement + historical alibi |
| Tufnell | 0.15 | 0.35 | 0.5 | TUFNELL_SPIRAL | Spiral; self-owns occasionally land |
| Blofeld | 0.0* | 0.2 | 0.8 | BLOFELD_NON_RECOVERY | Never notices; pivot to pigeon |
| **Golf** | | | | | |
| Harmon | 0.5 | 0.3 | 0.2 | HARMON_TECHNICAL_FIX | Fixes it like a swing fault |
| Coltart | 0.2 | 0.4 | 0.4 | COLTART_NEUTRALISE | One sentence; the cameraman moved |
| Murray | 0.2 | 0.5 | 0.3 | MURRAY_ELEVATION | Turns discomfort into a moment |
| Radar | 0.4 | 0.4 | 0.2 | RADAR_NOTHING | One word. Maybe two. |
| Dougherty | 0.6 | 0.3 | 0.1 | DOUGHERTY_ABSORB | Absorbs warmly, moves on |
| McGinley | 0.1 | 0.2 | 0.7 | MCGINLEY_RESTATEMENT | High-tariff analysis of the damage |
| Henni | 0.5 | 0.4 | 0.1 | HENNI_QUESTION | "What did you mean by that?" |
| Alliss | 0.3 | 0.3 | 0.4 | ALLISS_PRESS_ON | "Oh well, shall we press on?" |
| **Darts** | | | | | |
| Mardle | 0.3 | 0.4 | 0.3 | MARDLE_REDIRECT | Self-deprecates before anyone else can |
| Bristow | 0.1 | 0.2 | 0.7 | BRISTOW_NON_CONCESSION | Talks louder about something else |
| Taylor | 0.3 | 0.4 | 0.3 | TAYLOR_DEFLECTION | "The words were kind to me" |
| Lowe | 0.4 | 0.4 | 0.2 | LOWE_PATIENCE | Waits for the room to resettle |
| George | 0.4 | 0.4 | 0.2 | GEORGE_ANECDOTE | Warm anecdote absorbs the damage |
| Waddell | 0.2 | 0.5 | 0.3 | WADDELL_ELEVATION | Elevates into literature |
| Part | 0.5 | 0.3 | 0.2 | PART_MINIMISE | "Right." One sentence. Done. |
| Studd | 0.15 | 0.35 | 0.5 | STUDD_ENTHUSIASM | More enthusiasm about the wrong thing |
| Pyke | 0.3 | 0.4 | 0.3 | PYKE_BROADCAST_RESET | "And we continue." |
| **Football** | | | | | |
| Souness | 0.05 | 0.15 | 0.8 | SOUNESS_INTENSIFY | The room is too soft for what he said |
| Micah | 0.6 | 0.3 | 0.1 | MICAH_REFRAME | "THAT'S what makes this interesting!" |
| Neville | 0.2 | 0.4 | 0.4 | NEVILLE_REVIEW | Analyses the footage of the incident |
| Carragher | 0.5 | 0.35 | 0.15 | CARRAGHER_SELF_DEPRECATE | "I can't believe I said that either" |
| Big Ron | 0.3 | 0.4 | 0.3 | RON_LEXICAL_PIVOT | Invents a phrase to cover the transition |
| **Boardroom** | | | | | |
| Harold | 0.3 | 0.5 | 0.2 | HAROLD_SILENCE | "Yes." Silence. "That's what language does." |
| Sebastian | 0.1 | 0.3 | 0.6 | SEBASTIAN_REFRAME | Process improvement. No accountability. |
| Roy | 0.4 | 0.4 | 0.2 | ROY_CLOSE_IT | "That was wrong. Moving on." |
| Hicks | 0.3 | 0.4 | 0.3 | HICKS_CONTEXT | 40 seconds on the structural failure |
| Partridge | 0.15 | 0.35 | 0.5 | PARTRIDGE_FILE_IT | "I have notes on this." |
| Mystic | 0.2 | 0.4 | 0.4 | MYSTIC_ANTICIPATED | "I felt the energy shift." |
| Cox | 0.3 | 0.4 | 0.3 | COX_COSMIC_CONTEXT | The sun will expand in four billion years |
| **Comedy Room** | | | | | |
| Carlin | 0.2 | 0.4 | 0.4 | CARLIN_CONFIRMATION | Adds it to the evidence log |
| Cook | 0.3 | 0.4 | 0.3 | COOK_EVALUATE | "Thirty percent efficiency on that remark" |
| Adams | 0.4 | 0.4 | 0.2 | ADAMS_OH_WELL | "Oh well. Let's crack on." |
| Wilde | 0.5 | 0.3 | 0.2 | WILDE_EPIGRAM | Inevitable epigram that redeems the moment |
| Blyton | 0.3 | 0.4 | 0.3 | BLYTON_NARRATE_PAST | Translates it into Famous Five syntax |
| Carr | 0.4 | 0.3 | 0.3 | CARR_CONVERT | Converts the silence into material |
| Wise Sir Nick | 0.2 | 0.4 | 0.4 | NICK_GOLF_METAPHOR_RECOVERY | Golf metaphor that almost works |

*Blofeld's CLEAN is THE_PIVOT — structurally different, once per session.
