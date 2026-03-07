# Historic Golf Games Canon
**Panel:** Golf (19th Hole)
**Schema:** See `_schema.md`
**Count:** 15 games
**Status:** STUB — game selection complete, mechanics design session needed before building engine

---

## DESIGN SESSION NEEDED BEFORE BUILD
The following need resolving before the golf engine can be implemented:

1. **User input model** — does the user enter: (a) score per hole (number of shots), (b) score relative to par per hole (eagle/birdie/par/bogey/double), (c) score band, or (d) something else?
2. **Player vs player vs leaderboard** — do we model head-to-head (Ryder Cup, playoff) or player-vs-leaderboard (Major final round)? Both need different input models.
3. **Ryder Cup structure** — foursomes/fourballs/singles: do we model all three or singles only?
4. **Hole-by-hole commentary** — does commentary fire per hole or per decision point (birdie opportunity, par save, bunker)?
5. **Shot quality model** — does the user declare shot outcome, or just score? A double bogey with a hole-in-one attempt is different from a double bogey from a shank.

Games below fully specified to schema. `ai_style` describes the AI opponent's tendencies.

**Golf panel characters (see memory for full profiles):** Faldo, McGinley, Riley/Radar, Roe, Coltart, Henni, Dougherty, Murray. Character wounds and mechanics are all live.

---

## euro-usa-2012-ryder-cup-medinah
- panel: golf
- competition: Ryder Cup
- tier: ELITE
- year: 2012
- participants: [Europe, USA]
- era: 2012
- dramatic_weight: 10
- special_triggers: [RYDER_CUP_CLINCHER, FINAL_HOLE_DECIDER, COMEBACK]
- ai_style: USA — led 10-4 after two days. Weight toward controlled, dominant play on the front nine, then progressive collapse from the 14th hole onward as Europe win eight of the final twelve singles matches.
- context_notes: Europe trailed 10-4 going into Sunday singles. Won 8.5 points from 12 to retain the cup. Ian Poulter's Saturday performance. Martin Kaymer's winning putt. Rory McIlroy's taxi incident. The Miracle of Medinah.

> Medinah Country Club, Illinois, 30 September 2012. Europe trail the United States 10-4 going into the final day of the Ryder Cup. In the history of the competition, no team has recovered from a deficit this large. The American players are experienced, motivated, and playing at home. Paul Azinger is their captain. José María Olazábal has mentioned Seve Ballesteros by name in every team meeting. The mathematics are not in Europe's favour and the mathematics do not seem to be aware that Ian Poulter is standing on the first tee.

---

## faldo-norman-1996-masters-final
- panel: golf
- competition: The Masters — Final Round
- tier: ELITE
- year: 1996
- participants: [Nick Faldo, Greg Norman]
- era: 1996
- dramatic_weight: 10
- special_triggers: [FINAL_HOLE_DECIDER, EAGLE_OPPORTUNITY]
- ai_style: Norman — led by six shots entering the final round. Weight toward progressive collapse from the 9th hole onward. Faldo plays steady, brilliant, error-free golf. The gap closes inexorably.
- context_notes: Norman led by six. Shot 78. Faldo shot 67. The greatest back-nine collapse in major championship history. Faldo's arm around Norman's shoulder on 18. A genuine act of grace from a man not known for them.

> Augusta National, Georgia, 14 April 1996. Greg Norman tees off on the final day of The Masters leading by six shots, which is the largest 54-hole lead in Masters history. He has three green jackets in his sights. Nick Faldo, who has won this tournament twice, is four groups behind him and playing the kind of golf that requires no miracles, only patience. The patience turns out to be the terrifying part.

---

## woods-2000-us-open-pebble
- panel: golf
- competition: US Open — Final Round
- tier: ELITE
- year: 2000
- participants: [Tiger Woods, Ernie Els]
- era: 2000
- dramatic_weight: 10
- special_triggers: [FINAL_HOLE_DECIDER, EAGLE_OPPORTUNITY]
- ai_style: Els — genuinely excellent, one of the best in the world. Weight toward a respectable performance that happens to be fifteen shots away from first place, because Tiger Woods played the US Open at Pebble Beach in 2000.
- context_notes: Woods won by fifteen shots. The largest margin of victory in a major championship. He was twenty-four. He finished at 12-under. Second place was at 3-over.

> Pebble Beach, California, 18 June 2000. Tiger Woods is playing the US Open in a manner that suggests the US Open is not entirely the right level of competition for what he is doing this week. The leaderboard is not a contest so much as a document of what happens when one man plays at a level that others can observe but not reach. Ernie Els is excellent. The gap between excellence and what Tiger Woods is doing is, at this moment, fifteen shots.

---

## europe-usa-1985-ryder-cup-belfry
- panel: golf
- competition: Ryder Cup
- tier: ELITE
- year: 1985
- participants: [Europe, USA]
- era: 1985
- dramatic_weight: 10
- special_triggers: [RYDER_CUP_CLINCHER, FINAL_HOLE_DECIDER]
- ai_style: USA — the dominant force for decades, not accustomed to losing. Weight toward controlled American golf that is gradually undone by a European team playing above themselves for the first time as a unit.
- context_notes: Europe's first Ryder Cup victory since 1957. Sam Torrance's winning putt. Andy North missed a putt that would have halved the match. Seve Ballesteros as emotional figurehead. The beginning of the modern Ryder Cup era.

> The Belfry, Sutton Coldfield, 15 September 1985. Europe have not won the Ryder Cup since 1957, when it was still a Britain-vs-USA affair and the Americans let them win occasionally. This is a different Europe — continent-wide, with Ballesteros, Langer, Woosnam and Faldo. Sam Torrance is about to walk up the 18th fairway needing one putt to win the Ryder Cup for Europe for the first time in twenty-eight years. His trousers are worth noting.

---

## mickelson-winged-foot-2006-us-open
- panel: golf
- competition: US Open — Final Round
- tier: ELITE
- year: 2006
- participants: [Phil Mickelson, Geoff Ogilvy]
- era: 2006
- dramatic_weight: 9
- special_triggers: [FINAL_HOLE_DECIDER]
- ai_style: Ogilvy — playing solid, disciplined golf. Weight toward patient, error-free performance that wins because the man ahead of him makes a mistake on the 18th hole that will be studied in golf psychology courses.
- context_notes: Mickelson needed par on 18 to win the US Open. He doubled it. He said "I am such an idiot" in the scorer's tent. Geoff Ogilvy won.

> Winged Foot Golf Club, New York, 18 June 2006. Phil Mickelson needs a par on the final hole to win the United States Open Championship. He has been in contention all week. He is the favourite. His caddy has a number in his head. Mickelson hits a driver. The subsequent series of decisions will be the subject of a conversation Mickelson has with journalists immediately afterwards, in which he uses a phrase about himself that golf commentators will repeat for the next fifteen years.

---

## watson-2009-open-turnberry
- panel: golf
- competition: The Open Championship — Final Round
- tier: ELITE
- year: 2009
- participants: [Tom Watson, Stewart Cink]
- era: 2009
- dramatic_weight: 10
- special_triggers: [FINAL_HOLE_DECIDER, HOLE_IN_ONE_POSSIBLE]
- ai_style: Cink — solid, professional, playing excellent golf. Weight toward patient accumulation. The match is a formality until it suddenly isn't.
- context_notes: Watson, aged 59, led going into the 18th and needed par to win. He left his approach short. The putt that would have made him the oldest major winner ran past. He lost in the playoff. Tom Watson at 59.

> Turnberry, Scotland, 19 July 2009. Tom Watson is fifty-nine years old and is about to win The Open Championship, which he has won five times before, except that he isn't. He is standing on the 18th fairway of Turnberry leading the tournament by one shot. Stewart Cink is in the clubhouse at 2-under. Watson's approach shot lands where approaches land when they are slightly misjudged by a fraction that will matter very much. The putt will not fall. The scoreboard will not lie.

---

## els-2012-open-lytham
- panel: golf
- competition: The Open Championship — Final Round
- tier: ELITE
- year: 2012
- participants: [Ernie Els, Adam Scott]
- era: 2012
- dramatic_weight: 9
- special_triggers: [FINAL_HOLE_DECIDER, COMEBACK]
- ai_style: Scott — led by four with four to play. Weight toward collapse: bogey-bogey-bogey-bogey from the 15th. Els in the clubhouse watching. The scoreboard ticking.
- context_notes: Scott led by four with four holes to play and bogeyed all four. Els, watching on the clubhouse screen, won his second Open by one shot having thought he was done.

> Royal Lytham and St Annes, 22 July 2012. Ernie Els is in the clubhouse at 7-under. He has finished his round. He believes he is going to finish second. Adam Scott leads by four shots with four holes to play. Ernie Els orders a drink and watches the leaderboard from the scorer's area. The leaderboard begins doing something that Ernie Els decides to watch very carefully.

---

## europe-usa-1999-ryder-brookline
- panel: golf
- competition: Ryder Cup
- tier: ELITE
- year: 1999
- participants: [Europe, USA]
- era: 1999
- dramatic_weight: 10
- special_triggers: [RYDER_CUP_CLINCHER, FINAL_HOLE_DECIDER, COMEBACK]
- ai_style: Europe — led 10-6 entering Sunday. Weight toward controlled play that erodes as the crowd and the American team's collective energy creates pressure that is genuinely uncomfortable.
- context_notes: Europe led 10-6 going into Sunday singles. USA won 8.5 from 12. Justin Leonard's putt. The American team and caddies ran onto the green before José María Olazábal had putted. The incident. Concorde flying home.

> The Country Club, Brookline, Massachusetts, 26 September 1999. Europe lead the Ryder Cup 10-6 entering the final day. The mathematics favour Europe. The crowd favour America to a degree that several European players will subsequently describe using words their mothers told them not to use. Justin Leonard needs to hole a 45-foot putt on the 17th green. If he does, José María Olazábal cannot concede defeat — he still has a putt. The American team do not appear to have factored this in.

---

## spieth-2016-masters-collapse
- panel: golf
- competition: The Masters — Final Round
- tier: ELITE
- year: 2016
- participants: [Jordan Spieth, Danny Willett]
- era: 2016
- dramatic_weight: 9
- special_triggers: [FINAL_HOLE_DECIDER, HOLE_IN_ONE_POSSIBLE]
- ai_style: Willett — playing steady, excellent golf. Weight toward consistent accumulation. He is winning because of what someone else is doing, not because of what he is doing, which is a specific kind of victory.
- context_notes: Spieth led by five going into the back nine. Quadruple-bogey on the 12th. Danny Willett won. Spieth's ball in Rae's Creek twice. The 12th hole at Augusta.

> Augusta National, Georgia, 10 April 2016. Jordan Spieth leads The Masters by five shots playing the back nine. He is twenty-two. He won here last year. The 12th hole at Augusta National is one hundred and fifty-five yards long. It plays over Rae's Creek. Spieth stands on the tee and goes through his routine. Danny Willett, three groups back, is watching the leaderboard between shots and beginning to experience a feeling he does not entirely trust yet.

---

## woods-2019-masters-final
- panel: golf
- competition: The Masters — Final Round
- tier: ELITE
- year: 2019
- participants: [Tiger Woods, Francesco Molinari]
- era: 2019
- dramatic_weight: 10
- special_triggers: [FINAL_HOLE_DECIDER, EAGLE_OPPORTUNITY, COMEBACK]
- ai_style: Molinari — the leader entering Sunday, playing disciplined, European-style golf. Weight toward controlled performance that is undone by the 12th hole and then by momentum shift.
- context_notes: Woods' fifth Masters, first major in eleven years, after back surgery and everything that had happened. Molinari led. Hit the water on 12. Woods was patient. The roars.

> Augusta National, Georgia, 14 April 2019. Tiger Woods has not won a major championship since 2008. He has had spinal fusion surgery. The tabloids have written the obituary of his career at least three times and he has objected by continuing to play golf. Francesco Molinari leads the Masters. The 12th hole at Augusta is one hundred and fifty-five yards. There is a pattern developing.

---

## woods-dimarco-2005-masters
- panel: golf
- competition: The Masters — Final Round
- tier: MAJOR
- year: 2005
- participants: [Tiger Woods, Chris DiMarco]
- era: 2005
- dramatic_weight: 9
- special_triggers: [FINAL_HOLE_DECIDER, HOLE_IN_ONE_POSSIBLE, EAGLE_OPPORTUNITY]
- ai_style: DiMarco — tough, competitive, grinding. Weight toward relentless pressure that forces a playoff. He makes Tiger work for everything. He does not make it easy.
- context_notes: Tiger's chip on the 16th. The ball hanging on the lip, Nike logo visible, then dropping. DiMarco forced a playoff. Tiger won on the first playoff hole. Verne Lundquist: "In your life, have you seen anything like that?"

> Augusta National, Georgia, 10 April 2005. Tiger Woods is standing over a chip shot on the 16th hole that is not straightforward. Chris DiMarco has played excellently and the match is close. The chip lands on the fringe of the green, rolls toward the hole, and does something that requires the laws of physics to cooperate. Verne Lundquist is in the television commentary box. He is about to say something that will be on every highlight reel of Augusta National golf for as long as Augusta National golf is played.

---

## europe-usa-2004-ryder-cup-oakland
- panel: golf
- competition: Ryder Cup
- tier: ELITE
- year: 2004
- participants: [Europe, USA]
- era: 2004
- dramatic_weight: 9
- special_triggers: [RYDER_CUP_CLINCHER, FINAL_HOLE_DECIDER]
- ai_style: USA — Mickelson, Woods, Furyk. Weight toward technically excellent golf that is collectively outperformed by a European team at the peak of their powers.
- context_notes: Europe won 18.5-9.5. The largest margin of victory in Ryder Cup history (at the time). Bernhard Langer as captain. The European team were playing as a unit. Hal Sutton paired Tiger and Phil in the foursomes and they lost both matches.

> Oakland Hills Country Club, Michigan, 19 September 2004. Bernhard Langer is Europe's Ryder Cup captain. His players are: Monty, Darren Clarke, Lee Westwood, Sergio Garcia, Padraig Harrington, Ian Poulter and others who constitute the most formidable European team assembled since the competition became genuinely competitive. Hal Sutton has paired Tiger Woods and Phil Mickelson in the foursomes, which is a bold decision. The foursomes have started.

---

## nicklaus-1986-masters-back9
- panel: golf
- competition: The Masters — Final Round
- tier: ELITE
- year: 1986
- participants: [Jack Nicklaus, Greg Norman]
- era: 1986
- dramatic_weight: 10
- special_triggers: [FINAL_HOLE_DECIDER, EAGLE_OPPORTUNITY, COMEBACK]
- ai_style: Norman — leading late, weight toward a collapse that is not his fault, that anyone could have suffered, that happens to happen to him again at Augusta.
- context_notes: Nicklaus was 46. Shot 30 on the back nine. Six birdies and an eagle from the 9th. Norman needed a birdie on 18 to tie, needed par to finish second. He bogeyed. The Golden Bear.

> Augusta National, Georgia, 13 April 1986. Jack Nicklaus is forty-six years old. He has won the Masters five times. He is not expected to win it today. He is four behind the leaders as he walks to the 9th tee. In the next nine holes, something will happen that CBS Sports will show at the beginning of every Masters broadcast for the next thirty years, because it is the thing that happened, and things that happen like that don't stop having happened.

---

## mcilroy-2011-masters-collapse
- panel: golf
- competition: The Masters — Final Round
- tier: ELITE
- year: 2011
- participants: [Rory McIlroy, Charl Schwartzel]
- era: 2011
- dramatic_weight: 9
- special_triggers: [FINAL_HOLE_DECIDER]
- ai_style: Schwartzel — methodical, South African, birdied the last four holes. Weight toward invisible excellence that emerges from the background while the story is happening to someone else.
- context_notes: McIlroy led by four going into Sunday, shot 80, hit his tee shot into the cabins on 10. Schwartzel birdied the last four holes to win. McIlroy was twenty-one.

> Augusta National, Georgia, 10 April 2011. Rory McIlroy is twenty-one years old and leads The Masters by four shots going into the final round. He has played three rounds of extraordinary golf. Charl Schwartzel is six shots back and nobody is especially discussing Charl Schwartzel. The 10th hole at Augusta National has a row of spectator cabins to the left. Rory McIlroy's driver is in his hands on the 10th tee. He goes through his routine.

---

## europe-usa-2023-ryder-rome
- panel: golf
- competition: Ryder Cup
- tier: ELITE
- year: 2023
- participants: [Europe, USA]
- era: 2023
- dramatic_weight: 9
- special_triggers: [RYDER_CUP_CLINCHER, FINAL_HOLE_DECIDER]
- ai_style: USA — Scheffler, Koepka, Clark. Weight toward individual brilliance that cannot overcome European collective momentum. The best players in the world, losing together.
- context_notes: Europe won 16.5-11.5. Luke Donald as captain. Rory McIlroy and Tommy Fleetwood at their peak. Viktor Hovland. Jon Rahm before his LIV announcement. Rome.

> Marco Simone Golf Club, Rome, 1 October 2023. The United States have the world's best player (Scottie Scheffler), a major champion who retired and came back (Brooks Koepka), and a collection of extraordinary individual talents assembled into a team that Europe regard as a collection of extraordinary individual talents. Europe have Luke Donald as captain, which is either unremarkable or deliberately calming depending on your perspective. The first tee is in Rome. The crowd knows which side they prefer.
