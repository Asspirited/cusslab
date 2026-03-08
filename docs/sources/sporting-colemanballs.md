# Sporting Colemanballs — Source Material
# Last updated: 2026-03-08
# Purpose: Reference and seed material for INTELLECTUAL_ATTEMPTS character behaviour class
# Sources: Private Eye Colemanballs, Yogi Berra, BBC Sport, prohumorist.com, wikipedia

---

## The INTELLECTUAL_ATTEMPTS Behaviour Class

Characters (across all panels) occasionally attempt to deploy sophisticated rhetorical or
grammatical devices — irony, tautology, oxymoron, metaphor, paradox, "literally" — and
usually get them catastrophically wrong. Occasionally, accidentally, they get them right.

This is the single funniest thing sports pundits and boardroom types actually do.

### The Usage Pattern (consistent across all types)

```
INTELLECTUAL_ATTEMPT = {
  type:     ATTEMPT_IRONY | ATTEMPT_LITERALLY | ATTEMPT_TAUTOLOGY |
            ATTEMPT_OXYMORON | ATTEMPT_METAPHOR | ATTEMPT_PARADOX,
  degree:   catastrophic_miss | plausible_miss | almost_correct | correct (rare, funny),
  delivery: ridiculous | lying | plausible | confident_wrongness | accidental_profundity
}
```

### Triggers

- **Keyword trigger**: user mentions the device name ("irony", "literally", "paradox", etc.)
- **Opportunistic**: character spots something they decide (wrongly) qualifies
- **Performative**: character wants to sound intelligent, deploys the device regardless

### Degrees of Success

| Degree | Description |
|---|---|
| catastrophic_miss | Not even in the right postcode. Confident. |
| plausible_miss | Wrong, but you have to think about it for a second. |
| almost_correct | Actually defensible. Character doesn't realise this. |
| correct (rare) | Nails it perfectly. Everybody surprised, including them. |

### Delivery Modes

| Delivery | Description |
|---|---|
| ridiculous | The example is patently absurd but delivered with total conviction |
| lying | Invents an anecdote to illustrate the point. The anecdote is false. |
| plausible | Sounds credible. Isn't. |
| confident_wrongness | Wrong on every level but absolutely certain |
| accidental_profundity | Tries to be clever, accidentally says something genuinely insightful |

---

## TYPE: ATTEMPT_IRONY

### What irony actually is

Irony requires "the very thing" — the outcome must be produced by the very element that
should have prevented it, or must contradict the very thing it was supposed to embody.

**Actually ironic:**
- A fire station burns down
- A seatbelt salesman dies in a car crash (because he forgot to wear one)
- An anti-gambling campaigner wins the lottery
- A dietitian dies from choking on a carrot

**NOT ironic (what people always say):**
- Rain on your wedding day (bad luck / coincidence)
- A free ride when you've already paid (frustrating coincidence)
- A traffic jam when you're already late (just bad luck)
- "It's ironic that I bumped into you here" (no, that's just surprising)
- "Ironically, it all worked out in the end" (no, that's just fortunate)
- "Ironically, he was the last person you'd expect" (no, that's just surprising)

### The Alanis Test

Morissette's "Ironic" (1996) contains zero instances of actual irony. Every example in the
song is coincidence, bad luck, or frustration. This is so well-known it has become the
benchmark for irony misuse. Characters can reference it. Correctly or not.

### ATTEMPT_IRONY seed patterns (do NOT repeat verbatim — use as seeds)

**Catastrophic miss (pure coincidence called irony):**
- "And ironically, it rained on the day of the final."
- "Ironically, he was the last one you'd expect to score in that situation."
- "Ironically, the penalty hit the post — and that's the irony of it."
- "What's ironic is, we were just talking about this on the way here."

**Plausible miss (close but wrong — more like coincidence or hypocritical):**
- "The irony is, the team that spent the most on defending conceded the most goals."
  (This is almost ironic. It isn't. It's just counterproductive strategy.)
- "Ironically, the faster he tried to play, the slower the game became."
  (Cause and effect. Not irony.)

**Almost correct (genuinely defensible):**
- "And ironically, the man brought on specifically to stop him scored."
  (This is actually very close to ironic.)
- "The irony is, the club that sold him for nothing won nothing without him."

**Correct (rare — character doesn't realise they've got it right):**
- "Ironically, the injury prevention programme gave him the injury."
- "The full irony of it is, the referee who flagged him offside had been arguing for
   the last twenty minutes that the offside rule should be abolished."

---

## TYPE: ATTEMPT_LITERALLY

### What "literally" actually means

It means: in the most exact, non-figurative sense. The thing actually happened.
"He literally ran through a brick wall" means the wall is now rubble and he is bleeding.

### The misuse pattern

Used as pure intensifier — means nothing except "really" or "very".
Used to introduce metaphors, which defeats the entire purpose.

### ATTEMPT_LITERALLY seed patterns

**Catastrophic miss (introduces a metaphor with "literally"):**
- "He literally flew down the left wing."
- "She literally died when she heard the news."
- "He literally exploded out of the blocks."
- "They literally bottled it under pressure."
- "He literally carried this team on his back all season."
- "She literally walked on water in that first half."

**The escalation pattern (each more extreme):**
- Level 1: "He literally played out of his skin."
- Level 2: "He literally grew three inches in that second half."
- Level 3: "He literally became a different person after that substitution."
- Level 4: "He literally transcended the sport today."

**The sincere correction (character corrects themselves with another metaphor):**
- "He literally — and I don't use that word lightly — he moved mountains today."

**The self-aware miss (character knows what literally means, applies it wrong anyway):**
- "Now I know people say 'literally' when they don't mean it. But when I say he
   literally ran through their defence, I mean he literally did it."
  (He did not literally do it.)

---

## TYPE: ATTEMPT_TAUTOLOGY

### What tautology is

Saying the same thing twice in different words. Usually unintentional in colemanballs.
Occasionally used deliberately (badly) by someone trying to sound thorough.

### Classic real examples (Colemanballs — verbatim, for reference)

*David Coleman:*
- "Moses Kiptanui — the 19-year-old Kenyan, who turned 20 a few weeks ago."
- "Morcelli has four fastest 1500-metre times ever. And all those times are at 1500 metres."
- "Her time is about 4.33, which she's capable of."
- "There goes Juantorena down the back straight, opening his legs and showing his class."

*Murray Walker:*
- "The lead car is absolutely unique, except for the one behind it, which is identical."
- "We now have exactly the same situation as we had at the start of the race, only exactly the opposite."
- "With half the race gone, there is still half the race to go."
- "The gap between them is now nine-tenths of a second — that's less than a second."
- "There is nothing wrong with the car, apart from that it is on fire."

*Terry Venables:*
- "If history repeats itself, I should think we can expect the same thing again."

*Ron Atkinson:*
- "Well, either side could win it, or it could be a draw."

*John Arlott:*
- "Bill Frindal has done a bit of mental arithmetic with a calculator."

*David Acfield:*
- "Strangely, in slow motion replay, the ball seemed to hang in the air for even longer."

*Ian McNail:*
- "We actually got the winner three minutes from the end but then they equalized."

*Ron Atkinson:*
- "I would not say he is the best left winger in the Premiership, but there are none better."

### ATTEMPT_TAUTOLOGY seed patterns (characters who try to sound conclusive)

- "When all is said and done, at the end of the day, that's what it comes down to."
- "The thing is, fundamentally, at its core, essentially — he's good."
- "They defended badly in defence."
- "It was a game of two teams."
- "He's fast — and that pace makes him quick."
- "The scoreline tells you everything about the score."
- "He missed it, which is why it didn't go in."
- "The goal came at a crucial time — just when they needed a goal."
- "They need to score more goals than the other team if they want to win."

---

## TYPE: ATTEMPT_OXYMORON

### What an oxymoron is

A figure of speech combining contradictory terms for rhetorical effect.
Real examples: deafening silence, living dead, open secret, bittersweet.

### The misuse pattern

Characters deploy contradictory terms accidentally (thinking they're being profound)
or deliberately but getting the contradiction wrong (accidentally agreeing with themselves).

### ATTEMPT_OXYMORON seed patterns

**Accidental (didn't mean to):**
- "It was a controlled explosion of talent."
- "He was consistently inconsistent — but in a very consistent way."
- "It was a planned surprise."
- "The atmosphere was a deafening sort of quiet intensity."

**Deliberate but wrong (trying to sound clever):**
- "And that is, if you'll allow me, a classic modern tradition."
- "He's an experienced young player."
- "It was organised chaos — except it was neither."
- "This is clearly an unexpected inevitability."

**The Partridge (confidently wrong):**
- "And that's the oxymoron of it all — you can't be almost unique."
  (This is actually correct. Character doesn't know why.)
- "It's an oxymoron. Like jumbo shrimp. Or, um, healthy chips."

---

## TYPE: ATTEMPT_METAPHOR

### Mixed metaphors (the colemanballs staple)

Combining two incompatible metaphors. Usually on live television. Always confidently.

### Classic real examples (verbatim)

*Murray Walker:*
- "We now have exactly the same situation we had at the start, only exactly the opposite."

*Ron Atkinson:*
- "Beckenbauer really has gambled all his eggs."

*Peter Drury:*
- "The boot is on the other side of the coin."
- "It had to go in, but it didn't."

*Various:*
- "That's a real kick in the teeth for the jugular."
- "We're not going to throw the baby out with the bathwater and shoot ourselves in the foot."
- "He's burning bridges and burning the candle at both ends of the tunnel."
- "They've opened a can of worms which has come back to bite them."
- "She's skating on thin ice and drowning in a sea of opportunity."

### ATTEMPT_METAPHOR seed patterns

- "He's bitten off more than he can chew — and now he's going to have to swallow it."
- "They've opened the floodgates and now they're under the cosh."
- "That's the last nail in the coffin that broke the camel's back."
- "It's a double-edged blessing in disguise."
- "They need to hit the ground running before they start walking."
- "He's been the engine room — the heartbeat, if you will — of what makes the legs work."
- "At the end of the day, they've painted themselves into a corner and now they have to lie in it."

---

## TYPE: ATTEMPT_PARADOX

### Yogiisms — the gold standard of accidental paradox

Yogi Berra (baseball catcher, New York Yankees) produced a body of work that sounds like
deliberate Zen but was entirely sincere. These are the model for the ATTEMPT_PARADOX pattern.

### The full Yogiism set (verbatim — do not repeat directly, use as seeds)

*On logic:*
- "It ain't over 'til it's over."
- "It's like déjà vu all over again."
- "When you come to a fork in the road, take it."
- "Nobody goes there anymore. It's too crowded."
- "If the world were perfect, it wouldn't be."
- "Pair up in threes."
- "We were overwhelming underdogs."

*On time and prediction:*
- "The future ain't what it used to be."
- "It gets late early out there."
- "It's tough to make predictions, especially about the future."
- "Always go to other people's funerals, otherwise they won't come to yours."
- "I always thought that record would stand until it was broken."

*On knowledge:*
- "You can observe a lot by just watching."
- "I never said most of the things I said."
- "I didn't really say everything I said."
- "In baseball, you don't know nothing."

*On mathematics:*
- "Baseball is ninety percent mental. The other half is physical."
- "Ninety percent of this game is half mental."
- "We made too many wrong mistakes."

*On language:*
- "He hits from both sides of the plate. He's amphibious." (means ambidextrous)
- "Even Napoleon had his Watergate." (means Waterloo)
- "It ain't the heat, it's the humility." (means humidity)
- "Take it with a grin of salt." (means grain)

*Accidentally wise:*
- "If you don't know where you are going, you might wind up someplace else."
- "You've got to be careful if you don't know where you're going, 'cause you might not get there."
- "Why buy good luggage? You only use it when you travel."
- "I never blame myself when I'm not hitting. I just blame the bat."

### ATTEMPT_PARADOX seed patterns (for character use — Yogi-style)

- "At the end of the day, nothing's ever really over until it's finished."
- "The problem with football is that both teams are trying to win at the same time."
- "You can see a lot just by watching, but only if you're looking."
- "The key to consistency is doing it every time."
- "They need to score if they want to be ahead."
- "It's a game of two halves — which is exactly how many halves there are."
- "Tactically, you have to know what you're doing before you can do it differently."
- "He's definitely going to be a future legend, given time."
- "Nobody comes to see us anymore. We're too popular."
- "I may be wrong about that, and I could be right."

---

## Mixed Reference — Other Brilliant Real Gaffes (sorted by type)

### Self-contradiction / logical impossibility
- "For those of you watching who do not have television sets, live commentary is on Radio 2." (Coleman)
- "Don't tell those coming in the result, but let's just have another look at the winning goal." (Coleman)
- "For those of you watching in black and white, Spurs are in the all-yellow strip." (Motson)
- "Steve is going for the pink — and for those watching in black and white, the pink is next to the green." (Ted Lowe, snooker)
- "He's never won a race, and this will be his first." (horse racing)

### Malapropism (wrong word, sounds similar)
- "The racecourse is as level as a billiard ball." (Francombe — means billiard table)
- "I've never had major knee surgery on any other part of my body." (Bennett — means joint)
- "It was like being in a foreign country." (Ian Rush — on playing in Italy, a foreign country)
- "To play Holland, you have to play the Dutch." (Gullit)
- "Sure, there have been injuries and deaths in boxing — but none of them serious." (Minter)
- "I'd like to play for an Italian club, like Barcelona." (Draper)

### Non-sequitur / accidental profundity
- "Strangely, in slow motion replay, the ball seemed to hang in the air for even longer." (correct observation, odd that it's surprising)
- "He dribbles a lot and the opposition don't like it — you can see it all over their faces." (Ron Atkinson)
- "I think that was a moment of cool panic there." (Ron Atkinson)
- "What will you do when you leave football, Jack — will you stay in football?" (Stuart Hall)
- "Greg Norman: I owe a lot to my parents, especially my mother and father."

### Darts (Sid Waddell — deliberately poetic, accidentally absurd)
- "When Alexander of Macedonia was 33, he cried salt tears because there were no more worlds to conquer. Eric Bristow's only 27."
- "His face is sagging with tension."
- "He's as cool as a cucumber in a fridge in Iceland."

---

## Usage Notes for Character System

### Do NOT repeat verbatim
These are seeds. Claude should generate variations informed by the pattern, not quote them.

### Character-specific calibration

| Character | Preferred types | Typical degree | Typical delivery |
|---|---|---|---|
| Sebastian | ATTEMPT_IRONY, ATTEMPT_PARADOX | plausible_miss | confident_wrongness |
| Partridge | ATTEMPT_OXYMORON, ATTEMPT_LITERALLY | catastrophic_miss | ridiculous |
| Roy | ATTEMPT_TAUTOLOGY | catastrophic_miss | completely_sincere |
| Prof Cox | ATTEMPT_METAPHOR, ATTEMPT_PARADOX | almost_correct | accidental_profundity |
| Mystic | ATTEMPT_IRONY, ATTEMPT_PARADOX | catastrophic_miss + correct (both, simultaneously) | ridiculous |
| Pint of Harold | ATTEMPT_LITERALLY | catastrophic_miss | confident_wrongness |
| Faldo | ATTEMPT_TAUTOLOGY, ATTEMPT_IRONY | plausible_miss | lying |
| Radar | ATTEMPT_LITERALLY, ATTEMPT_OXYMORON | catastrophic_miss | ridiculous |
| Dougherty | ATTEMPT_PARADOX | almost_correct | accidental_profundity |
| Partridge (sports) | ATTEMPT_METAPHOR | catastrophic_miss | ridiculous |

### The Alanis Rule
If a character ATTEMPT_IRONYs and the user points out it wasn't ironic, the character
should double down (confident_wrongness) before eventually conceding (if intensity is low)
or escalating further (if intensity is high).

### The Yogi Rule
A character may accidentally produce a genuinely profound ATTEMPT_PARADOX.
When this happens, the other characters in the panel should ignore it entirely.

---

## File maintained by
Claude Code. Add entries as discovered — new real-world examples from broadcast,
Partridge-isms, fresh Yogi-style coinages. This is a growing resource.
