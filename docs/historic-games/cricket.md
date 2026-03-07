# Historic Cricket Games Canon
**Panel:** Cricket (Long Room)
**Schema:** See `_schema.md`
**Count:** 15 games
**Status:** STUB — game selection complete, mechanics design session needed before building engine

---

## DESIGN SESSION NEEDED BEFORE BUILD
The following need resolving before the cricket engine can be implemented:

1. **User input model** — does the user control: (a) batting (scoring runs per over/ball), (b) bowling (wickets/economy per over), (c) either side, or (d) whole innings score in bands?
2. **Session structure** — do we model per-over, per-session (morning/afternoon/evening), or per-innings?
3. **Follow-on mechanic** — does the engine handle it? Automatic or user-triggered?
4. **Tail-wagging trigger** — last wicket stand tracking: how many runs crossed triggers commentary escalation?
5. **Weather/light** — does bad light and rain feature in the engine or is it flavour only?

Games below fully specified to schema. `ai_style` describes opposition tendencies the engine must simulate once the input model is resolved.

**Commentary register note (see memory):** Cricket panel operates with elevated register as atmospheric baseline. Characters perform warmth and mutual admiration. Underneath they are contemptuous of each other. Bathos fires constantly. The warmest things they say are the most cutting.

---

## botham-headingley-1981-ashes
- panel: cricket
- competition: Ashes — 3rd Test
- tier: ELITE
- year: 1981
- participants: [England, Australia]
- era: 1981
- dramatic_weight: 10
- special_triggers: [LAST_WICKET_STAND, TAIL_WAGGING, COMEBACK]
- ai_style: Australia — dominant, well-organised, had made England follow on. Weight toward controlled bowling that unravels when Botham arrives. Lillee and Alderman are accurate until they are not.
- context_notes: England followed on. 500-1 against. Botham 149*. Willis 8-43. The match. The greatest Ashes comeback. Ladbrokes had stopped taking bets on England.

> Headingley, Leeds, 1981. England have followed on. The bookmakers have stopped taking bets on them. The scoreboard says things about England's position that are technically accurate and yet insufficient as descriptions of what is about to happen. Ian Botham is padded up in the dressing room, recently relieved of the captaincy, with nothing left to lose. Bob Willis will require separate consideration.

---

## laker-1956-ashes-manchester
- panel: cricket
- competition: Ashes — 4th Test
- tier: ELITE
- year: 1956
- participants: [England, Australia]
- era: 1956
- dramatic_weight: 10
- special_triggers: [HAT_TRICK_POSSIBLE]
- ai_style: Australia — good batting lineup dismantled entirely by one man. Weight toward wickets falling in ways that suggest something unprecedented is happening. The AI is simulating capitulation.
- context_notes: Jim Laker. 19 wickets in the match. 10-53 in the second innings. The greatest individual bowling performance in Test history. His partner Tony Lock took one.

> Old Trafford, Manchester, 1956. Jim Laker is bowling for England. He has taken nine wickets in Australia's second innings, which would be the achievement of a lifetime in any other match. The score is in the nineties. One wicket remains. Nobody in the history of Test cricket has ever taken all ten in a single innings. This is not technically relevant. It is about to become relevant.

---

## flintoff-harmison-2005-edgbaston
- panel: cricket
- competition: Ashes — 2nd Test
- tier: ELITE
- year: 2005
- participants: [England, Australia]
- era: 2005
- dramatic_weight: 10
- special_triggers: [LAST_WICKET_STAND, COMEBACK]
- ai_style: Australia — Warne and Lee, genuinely capable of winning from this position. Weight toward a last-wicket partnership that goes further than anyone expects, and then doesn't.
- context_notes: England won by two runs. The narrowest possible Ashes victory. Last wicket pair of Lee and Kasprowicz. Harmison. Kasprowicz gloved one behind. Jones caught it.

> Edgbaston, Birmingham, 7 August 2005. Australia need three runs to win. England need one wicket. Brett Lee and Michael Kasprowicz are batting. Simon Jones has just gone off injured. Andrew Flintoff, who has scored 68 and taken three wickets in this match, is standing at mid-on doing something with his hands that is difficult to interpret. The Ashes has not been competed for genuinely in eighteen years. This is being competed for genuinely.

---

## wg-grace-lords-1896
- panel: cricket
- competition: Ashes — 2nd Test
- tier: MAJOR
- year: 1896
- participants: [England, Australia]
- era: 1896
- dramatic_weight: 8
- special_triggers: []
- ai_style: Australia — Trott, Giffen, Jones. Weight toward aggressive batting that tests England's aging attack. Grace's presence on the field is the point. The cricket is secondary.
- context_notes: WG Grace. Forty-eight years old, still playing Test cricket. The fact that he existed is the dramatic fact. Lord's in 1896. The beard. The century he had already made famous.

> Lord's, London, 1896. W.G. Grace is forty-eight years old and is playing Test cricket for England. He has been doing this for twenty-two years. The Australian batting lineup is preparing to face a man who first played first-class cricket before some of them were born. The beard is real. The weight is real. The legend is also real, which makes it more complicated to be Australia in this specific match.

---

## harmison-sabina-2004-windies
- panel: cricket
- competition: West Indies vs England — 1st Test
- tier: MAJOR
- year: 2004
- participants: [England, West Indies]
- era: 2004
- dramatic_weight: 9
- special_triggers: [HAT_TRICK_POSSIBLE]
- ai_style: West Indies — Lara, Gayle, Sarwan. Weight toward resistance that crumbles under Harmison's extreme pace and bounce. Lara is the exception to everything.
- context_notes: Harmison took 7-12. West Indies dismissed for 47. The fastest bowling display on record. Sabina Park pitch was in extraordinary condition.

> Sabina Park, Kingston, Jamaica, 11 March 2004. Steve Harmison bowled his first ball of this match at a speed and trajectory that suggested the pitch was not entirely reliable. West Indies are about to be dismissed for 47. Seven wickets will fall to one man. Brian Lara is in the dressing room watching this and calculating what he will have to do in the second innings, which will not be enough.

---

## gavaskar-1971-lords
- panel: cricket
- competition: England vs India — 1st Test
- tier: MAJOR
- year: 1971
- participants: [India, England]
- era: 1971
- dramatic_weight: 8
- special_triggers: [TAIL_WAGGING]
- ai_style: England — Snow, Underwood, D'Oliveira. Weight toward disciplined bowling that is answered by technical excellence it did not expect from this opposition.
- context_notes: Gavaskar's first Test series. Debut at Port of Spain. The emergence of Indian batting as a genuinely world force. The series changed Indian cricket.

> Lord's Cricket Ground, 1971. Sunil Gavaskar has begun what will become the most statistically significant batting career India has produced. England, who are playing at home in front of a full Lord's, are discovering that the opposition's top order is more technically accomplished than the broader narrative about Indian batting suggested. John Snow is bowling. Gavaskar is watching the ball with the expression of a man who has been watching balls since before he could speak.

---

## warne-gatting-1993-ashes
- panel: cricket
- competition: Ashes — 1st Test
- tier: ELITE
- year: 1993
- participants: [England, Australia]
- era: 1993
- dramatic_weight: 9
- special_triggers: []
- ai_style: England — Gooch, Atherton, Smith. Weight toward competent batting that is dismantled by something they have not seen before and cannot prepare for.
- context_notes: The Ball of the Century. First ball Shane Warne bowled in an Ashes Test. Gatting LBW or bowled, depending on how you feel about leg breaks that turn a foot. The expression on Gatting's face.

> Old Trafford, Manchester, 3 June 1993. Shane Warne runs in to bowl the first ball of his first Ashes Test. Mike Gatting is the batsman. This ball will be discussed for as long as cricket is played because it pitches outside leg stump, turns sharply, and hits the off bail in a way that requires either physics or malice to explain. Gatting's expression as he walks off will be taught in Australian coaching academies. Not for technique. For the face.

---

## lara-400-2004-eng
- panel: cricket
- competition: West Indies vs England — 4th Test
- tier: ELITE
- year: 2004
- participants: [West Indies, England]
- era: 2004
- dramatic_weight: 10
- special_triggers: [TAIL_WAGGING, DECLARATION]
- ai_style: England — Harmison, Flintoff, Jones. Weight toward genuine pressure at 300, 350, 375 that is overcome by individual genius. At 399 they know. At 400 there is nothing to do.
- context_notes: Brian Lara scored 400* — the highest individual score in Test match history. He had held the record at 375 before Matthew Hayden took it. He took it back.

> Antigua Recreation Ground, 12 April 2004. Brian Lara is batting. He has already made the highest Test score in history once before, and Matthew Hayden took that from him, which Lara has spent two years noting. England are bowling. At some point in the next few sessions, the number 400 will appear next to Lara's name, and everyone on the field will know what it means, and nobody will quite know what to do with knowing it.

---

## botham-old-trafford-1981-ashes
- panel: cricket
- competition: Ashes — 5th Test
- tier: MAJOR
- year: 1981
- participants: [England, Australia]
- era: 1981
- dramatic_weight: 9
- special_triggers: [TAIL_WAGGING, COMEBACK]
- ai_style: Australia — well-placed to win, Lillee dangerous. Weight toward pressure that Botham's innings renders irrelevant in a way that feels personal.
- context_notes: Botham 118 in 123 balls. The series after Headingley. He was doing it again. Lillee and Alderman again. Six sixes.

> Old Trafford, August 1981. Ian Botham has already done the thing at Headingley. He is now doing it again, which raises the question of whether what happened at Headingley was a miracle or a method, and neither answer is entirely reassuring for Australia. Dennis Lillee is bowling. Botham is watching the ball in the way a man watches something he intends to hit very hard.

---

## bradman-invincibles-1948-lords
- panel: cricket
- competition: Ashes — 2nd Test
- tier: ELITE
- year: 1948
- participants: [England, Australia]
- era: 1948
- dramatic_weight: 9
- special_triggers: []
- ai_style: The Invincibles — Bradman, Morris, Barnes. Weight toward the specific sensation of facing batting that has no apparent weakness. England bowl well. It doesn't matter.
- context_notes: Bradman's Invincibles. England had Bedser, who troubled Bradman. Bradman averaged 99.94 in the series anyway. The 1948 Australian side are still considered the greatest touring team in history.

> Lord's Cricket Ground, June 1948. The Australian touring party are undefeated and will remain so. Don Bradman is batting. Alec Bedser, who is the best bowler England have, has troubled Bradman more than anyone else in this series, which in practice means he has bowled deliveries that would get anyone else out and has watched Bradman score 38 from them. The crowd at Lord's is watching something that will not come again.

---

## anderson-2014-first-session-india
- panel: cricket
- competition: England vs India — 1st Test
- tier: MAJOR
- year: 2014
- participants: [England, India]
- era: 2014
- dramatic_weight: 8
- special_triggers: [HAT_TRICK_POSSIBLE]
- ai_style: India — Kohli, Dhawan, Pujara. Weight toward technically sound batting that is undermined by swing that wasn't in the forecast. Kohli is the exception to most things.
- context_notes: James Anderson's first session bowling at Trent Bridge. India 0-5 at lunch (having lost 5 wickets). Anderson's mastery of swing in English conditions. Kohli's subsequent response.

> Trent Bridge, Nottingham, 9 July 2014. India are 0-5 at lunch on the first day of the first Test. James Anderson bowled through the morning session in conditions that suited James Anderson, which is the most dangerous weather system an Indian batting order can encounter in England. Virat Kohli is watching this from the dressing room and developing opinions about it that he will express at length for the remainder of the series.

---

## devon-malcolm-lords-1994
- panel: cricket
- competition: England vs South Africa — 1st Test
- tier: MAJOR
- year: 1994
- participants: [England, South Africa]
- era: 1994
- dramatic_weight: 8
- special_triggers: [LAST_WICKET_STAND]
- ai_style: England — Atherton, Thorpe, Stewart. Weight toward accumulation under pressure, defensive discipline, and the specific patience that Test batting requires over a fifth day.
- context_notes: Devon Malcolm. His response to being bounced. "You guys are history." South Africa's second Test since readmission. The atmosphere of the whole series.

> Lord's Cricket Ground, July 1994. Devon Malcolm, who does not consider himself primarily a batsman, has been hit on the helmet. He has said something to the South African fielders about what this means for them. South Africa's bowlers, who did not take the comment entirely seriously, are about to discover whether Devon Malcolm means it. This is South Africa's second Test match since readmission to international cricket. The previous Test was fine.

---

## flintoff-ashes-edgbaston-2009
- panel: cricket
- competition: Ashes — 2nd Test
- tier: MAJOR
- year: 2009
- participants: [England, Australia]
- era: 2009
- dramatic_weight: 9
- special_triggers: [LAST_WICKET_STAND, HAT_TRICK_POSSIBLE]
- ai_style: Australia — Ponting, Hussey, Clarke. Weight toward resistance that nearly succeeds. The last wicket pair occupies enough time to feel like it might work before it doesn't.
- context_notes: England won by eight wickets but the final day was tense. Collingwood's catch off Ponting. The Ashes regained. Andrew Flintoff's final Ashes.

> Edgbaston, Birmingham, 3 August 2009. Andrew Flintoff is playing what might be his last Ashes Test, which he does not confirm and which the crowd treat as confirmed anyway. England need wickets. Ricky Ponting is batting with the expression of a man who has decided that if England are going to win, it will cost them something. Freddie runs in. The fifth day has started and the Ashes are close.

---

## pakistan-1992-wc-final
- panel: cricket
- competition: Cricket World Cup Final
- tier: ELITE
- year: 1992
- participants: [Pakistan, England]
- era: 1992
- dramatic_weight: 9
- special_triggers: [TAIL_WAGGING, COMEBACK]
- ai_style: England — Graham Gooch, Neil Fairbrother, Robin Smith. Weight toward decent batting that is undone by Wasim Akram's famous reverse swing in the final overs.
- context_notes: Imran Khan. Wasim Akram's two-wicket over. Pakistan won from an unlikely position. Imran's "cornered tigers" speech. Melbourne Cricket Ground.

> Melbourne Cricket Ground, 25 March 1992. Pakistan have 249 to defend. Imran Khan has made a speech about cornered tigers that the team have decided to take seriously. Wasim Akram has been bowling throughout this tournament at a level that suggests he does not experience the match situation as pressure so much as information. England need the runs. The last ten overs remain. Wasim is about to bowl back-to-back deliveries that will be discussed in Pakistani households for the next thirty years.

---

## england-westindies-lords-2000
- panel: cricket
- competition: England vs West Indies — 2nd Test
- tier: STANDARD
- year: 2000
- participants: [England, West Indies]
- era: 2000
- dramatic_weight: 7
- special_triggers: [TAIL_WAGGING, LAST_WICKET_STAND]
- ai_style: West Indies — Brian Lara era, quality but no longer dominant. Weight toward brief brilliance from Lara punctuating a declining side's resistance.
- context_notes: The transition era for West Indies. England winning more frequently. The Long Room atmosphere at Lord's in a Test where the result is becoming clear but the dignity of the contest is maintained.

> Lord's Cricket Ground, London, 2000. West Indies are batting in a Test match at Lord's, which means the Long Room is full of people watching in a particular way. The West Indies side that once made watching them bat feel like a theological experience have become, gently, a side that tries very hard. Brian Lara is still Brian Lara, which means the score can still become anything while he is at the crease. He is at the crease.
