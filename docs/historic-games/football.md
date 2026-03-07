# Historic Football Games Canon
**Panel:** Football
**Schema:** See `_schema.md`
**Count:** 20 games
**Status:** STUB — game selection complete, mechanics design session needed before building engine

---

## DESIGN SESSION NEEDED BEFORE BUILD
The following need resolving before the football engine can be implemented:

1. **User input model** — does the user enter: (a) goals scored per half, (b) individual goal events with minute, (c) just final score, (d) something else?
2. **Event granularity** — red cards, penalties, own goals: does user trigger these or does AI generate them from context?
3. **Substitution mechanic** — do subs affect AI scoring tendency or is this flavour only?
4. **Extra time / penalties** — automatic if drawn after 90, or optional?
5. **COMEBACK trigger** — threshold: trailing by 2+ goals at half time? At 70 mins?

Games below are fully specified to schema. `ai_style` describes what the engine needs to simulate once the input model is resolved.

---

## man-utd-bayern-1999-ucl-final
- panel: football
- competition: UEFA Champions League Final
- tier: ELITE
- year: 1999
- participants: [Manchester United, Bayern Munich]
- era: 1999
- dramatic_weight: 10
- special_triggers: [LAST_MINUTE_GOAL, COMEBACK]
- ai_style: Bayern — disciplined, defensive, efficient. They scored first and defended. Weight toward holding shape and conceding only under extreme late pressure.
- context_notes: United scored twice in injury time. Sheringham 90+1, Solskjaer 90+3. Bayern had hit the woodwork twice. Treble winners.

> Camp Nou, Barcelona, 26 May 1999. Bayern Munich have been winning this match for eighty-nine minutes and have struck the woodwork twice, which is the universe suggesting something without quite saying it. Manchester United are about to play injury time. The trophy has already been engraved with Bayern's name. Gary Lineker is in the commentary box, which is relevant mainly because of what he is about to watch.

---

## arsenal-man-utd-1999-fa-cup-sf-replay
- panel: football
- competition: FA Cup Semi-Final Replay
- tier: MAJOR
- year: 1999
- participants: [Arsenal, Manchester United]
- era: 1999
- dramatic_weight: 10
- special_triggers: [LAST_MINUTE_GOAL, PENALTY_SHOOTOUT, RED_CARD_DECISIVE, COMEBACK]
- ai_style: Arsenal — organised, physical, Vieira driving, Adams commanding. Weight toward disciplined defending and clinical counter-attack.
- context_notes: Giggs' solo goal after Roy Keane's red card and Bergkamp's missed penalty. Considered one of the greatest FA Cup moments. Villa Park.

> Villa Park, 14 April 1999. Roy Keane has just been sent off. Dennis Bergkamp has just missed a penalty. Arsenal and Manchester United are level at ten men each in extra time. The match has already contained more incident than most matches contain across an entire season. Ryan Giggs picks up the ball in his own half. The next twelve seconds will be replayed for as long as football is played.

---

## england-west-germany-1966-wc-final
- panel: football
- competition: FIFA World Cup Final
- tier: ELITE
- year: 1966
- participants: [England, West Germany]
- era: 1966
- dramatic_weight: 10
- special_triggers: [LAST_MINUTE_GOAL, COMEBACK]
- ai_style: West Germany — technically excellent, never beaten until they are. Weight toward organised pressure and a late equaliser that should not have been allowed to happen.
- context_notes: The Geoff Hurst hat-trick. The line debate. "Some people are on the pitch." England's only major tournament win. ERA_LOCK means characters cannot reference England's subsequent performance in major tournaments.

> Wembley, 30 July 1966. England lead West Germany 3-2 in the World Cup Final with minutes remaining. Then they don't. Then they do again, except this time Geoff Hurst hits the crossbar and the ball lands somewhere near the line and the linesman from Azerbaijan makes a decision that will be disputed until everyone involved is dead and possibly after that.

---

## liverpool-man-utd-1977-fa-cup-final
- panel: football
- competition: FA Cup Final
- tier: MAJOR
- year: 1977
- participants: [Liverpool, Manchester United]
- era: 1977
- dramatic_weight: 8
- special_triggers: [LAST_MINUTE_GOAL]
- ai_style: Liverpool — dominant, possession-based, clinical. Bob Paisley's machine. Weight toward controlled football and clinical finishing.
- context_notes: United won 2-1, denying Liverpool the treble. Jimmy Greenhoff's deflection. Wembley.

> Wembley, 21 May 1977. Liverpool need to win this match to complete a league, European Cup and FA Cup treble. Manchester United need to win it because it is the FA Cup Final and that is the point. Jimmy Greenhoff will shortly do something with his chest that was not entirely intentional and which will become one of the most analysed deflections in English football history.

---

## arsenal-liverpool-1989-title-decider
- panel: football
- competition: First Division — final day title decider
- tier: ELITE
- year: 1989
- participants: [Arsenal, Liverpool]
- era: 1989
- dramatic_weight: 10
- special_triggers: [LAST_MINUTE_GOAL]
- ai_style: Liverpool — playing at home, expected to hold. Weight toward controlled defending and containing Arsenal until the last possible moment.
- context_notes: Arsenal needed to win by two goals at Anfield on the last day of the season. Michael Thomas in injury time. Brian Moore: "It's up for grabs now."

> Anfield, 26 May 1989. Arsenal have come to Liverpool on the last night of the season needing to win by two goals to take the title. The previous week Liverpool were at Hillsborough. What has happened since has happened. Liverpool lead the league. The football season, against all reason, is still going. Michael Thomas is running through on goal.

---

## greece-portugal-2004-euro-final
- panel: football
- competition: UEFA European Championship Final
- tier: ELITE
- year: 2004
- participants: [Greece, Portugal]
- era: 2004
- dramatic_weight: 9
- special_triggers: []
- ai_style: Portugal — technically gifted, Figo, Ronaldo (young), playing at home. Weight toward possession and pressure but failing to convert. Frustrated.
- context_notes: Greece won. The greatest international tournament upset of the modern era. Otto Rehhagel. Angelos Charisteas. Portugal were favourites, hosts, and lost.

> Estádio da Luz, Lisbon, 4 July 2004. Portugal are playing Greece in the final of the European Championship. Portugal are the hosts, the favourites, and have Luís Figo and a seventeen-year-old called Ronaldo. Greece have won every match they have played in this tournament, which was not supposed to happen in any of them. Angelos Charisteas is about to do something with his head that nobody predicted.

---

## man-city-qpr-2012-title-decider
- panel: football
- competition: Premier League — final day title decider
- tier: ELITE
- year: 2012
- participants: [Manchester City, QPR]
- era: 2012
- dramatic_weight: 10
- special_triggers: [LAST_MINUTE_GOAL, COMEBACK, RED_CARD_DECISIVE]
- ai_style: QPR — fighting relegation, Joey Barton red card, Mackie equaliser. Weight toward defensive chaos and set-piece threats. They had genuine reasons to win.
- context_notes: Aguerooooo. City needed to win. QPR went ahead. Joey Barton was sent off. Dzeko 90+2. Aguero 90+6. Sergio Agüero. Martin Tyler.

> Etihad Stadium, 13 May 2012. Manchester City need to beat Queens Park Rangers to win their first league title in forty-four years. They are losing 2-1 with five minutes of normal time remaining. Joey Barton has been sent off for QPR, which means QPR are playing with ten men and somehow still winning, which is the kind of detail that makes the universe seem like it has a sense of humour.

---

## liverpool-ac-milan-2005-ucl-final
- panel: football
- competition: UEFA Champions League Final
- tier: ELITE
- year: 2005
- participants: [Liverpool, AC Milan]
- era: 2005
- dramatic_weight: 10
- special_triggers: [COMEBACK, PENALTY_SHOOTOUT]
- ai_style: Milan — Kaka, Shevchenko, Crespo, technically superior. Weight toward dominant first-half display and then increasing desperation as Liverpool equalise.
- context_notes: 3-0 down at half time. Gerrard, Smicer, Alonso. Dudek's wobble in the shootout. Istanbul.

> Atatürk Olympic Stadium, Istanbul, 25 May 2005. Liverpool are 3-0 down to AC Milan at half time in the Champions League Final. In the dressing room, Steven Gerrard is deciding something. The second half of this match is either impossible or about to happen. Rafa Benítez, who does not appear to be a man visited by panic, is talking. The players are listening. Six minutes of the second half will either resolve or compound everything.

---

## tottenham-ajax-2019-ucl-sf
- panel: football
- competition: UEFA Champions League Semi-Final
- tier: MAJOR
- year: 2019
- participants: [Tottenham, Ajax]
- era: 2019
- dramatic_weight: 10
- special_triggers: [LAST_MINUTE_GOAL, COMEBACK]
- ai_style: Ajax — dominant, young, playing brilliant football. De Ligt, De Jong, van de Beek. Weight toward controlled possession and clinical finishing until the last possible moment.
- context_notes: Spurs were 3-0 down on aggregate at half time of the second leg. Lucas Moura hat-trick. 96th minute. The away goals rule. Mauricio Pochettino on his knees.

> Tottenham Hotspur Stadium, 8 May 2019. Ajax lead this Champions League semi-final 3-0 on aggregate at half time of the second leg. Tottenham need three goals. Ajax are young, brilliant, and appear entirely untroubled. Lucas Moura has scored twice. It is still probably over. The ninety-sixth minute has not yet happened.

---

## england-argentina-1986-wc-qf
- panel: football
- competition: FIFA World Cup Quarter-Final
- tier: MAJOR
- year: 1986
- participants: [England, Argentina]
- era: 1986
- dramatic_weight: 10
- special_triggers: [RED_CARD_DECISIVE]
- ai_style: Argentina — Maradona is the entire game. Weight toward Maradona-driven moments. Everything runs through him. The AI is essentially simulating one man.
- context_notes: Hand of God and Goal of the Century in the same match. Four years after the Falklands. Bobby Robson. Peter Reid. Peter Shilton. Alibi unavailable.

> Azteca Stadium, Mexico City, 22 June 1986. England face Argentina four years after the Falklands War, in a World Cup quarter-final, in Mexico, in the heat. Maradona is on the pitch. The referee is from Tunisia. In the fifty-first minute something will happen with Maradona's left hand that he will subsequently describe as the hand of God, which is one interpretation, and Peter Shilton's is different.

---

## forest-liverpool-1978-lc-final
- panel: football
- competition: League Cup Final
- tier: MAJOR
- year: 1978
- participants: [Nottingham Forest, Liverpool]
- era: 1978
- dramatic_weight: 7
- special_triggers: []
- ai_style: Liverpool — dominant European force, expected to win comfortably. Weight toward technical superiority and quiet assumption of inevitability that turns out to be wrong.
- context_notes: Clough's first major trophy. John Robertson. Forest were newly promoted. Liverpool were European champions. Forest won.

> Old Trafford, 22 March 1978 (replay). Brian Clough has brought Nottingham Forest, who were in the Second Division two years ago, to a League Cup Final against Liverpool, who are European champions. This is either a remarkable achievement or an unremarkable one depending on what you think is about to happen. Liverpool think they know what is about to happen.

---

## chelsea-barcelona-2012-ucl-sf
- panel: football
- competition: UEFA Champions League Semi-Final
- tier: MAJOR
- year: 2012
- participants: [Chelsea, Barcelona]
- era: 2012
- dramatic_weight: 9
- special_triggers: [RED_CARD_DECISIVE, COMEBACK, LAST_MINUTE_GOAL]
- ai_style: Barcelona — tiki-taka peak, Messi, Xavi, Iniesta. Weight toward possession domination and sustained pressure. They should be winning this. They are.
- context_notes: Chelsea had ten men for most of the match. Ramires' chip. Torres' late breakaway. The Messi penalty miss. Roberto Di Matteo's Chelsea somehow went through.

> Camp Nou, 24 April 2012. Chelsea have nine men. Lionel Messi has missed a penalty. Barcelona have had sixty-three percent possession and are losing. José Bosingwa is playing right back. This is objectively not how this was supposed to go, and yet here we are, watching Fernando Torres run through on goal in the ninety-second minute of a Champions League semi-final in a way that makes no logical sense.

---

## ireland-england-1988-euros
- panel: football
- competition: UEFA European Championship Group Stage
- tier: STANDARD
- year: 1988
- participants: [Republic of Ireland, England]
- era: 1988
- dramatic_weight: 7
- special_triggers: [LAST_MINUTE_GOAL]
- ai_style: England — technically superior, favourites. Weight toward possession and pressure that doesn't quite convert. Repeated frustration.
- context_notes: Ray Houghton. Six minutes. Jack Charlton's Ireland. The debut of the long ball and the hope it might be enough. It was.

> Neckarstadion, Stuttgart, 12 June 1988. Jack Charlton has told his Republic of Ireland players to do something specific with the ball when they get it, which does not involve keeping it for long. England are the favourites. Ray Houghton has other plans. The match is six minutes old. There will be eighty-four minutes of subsequent defensive organisation that will either be heroic or deeply tedious depending on your nationality.

---

## forest-hamburg-1980-ecf-final
- panel: football
- competition: European Cup Final
- tier: ELITE
- year: 1980
- participants: [Nottingham Forest, Hamburg]
- era: 1980
- dramatic_weight: 9
- special_triggers: []
- ai_style: Hamburg — Kevin Keegan, European quality, expected to push Forest hard. Weight toward technical challenge that Forest absorbs and neutralises.
- context_notes: Forest's second European Cup. John Robertson. One goal. Clough in the dugout. The least glamorous great team in English football history.

> Bernabéu, Madrid, 28 May 1980. Nottingham Forest are in their second consecutive European Cup Final. They got here from the City Ground, which backs onto a river, via a management philosophy that involved Brian Clough saying things in public that other managers would only think in private. Hamburg have Kevin Keegan. Forest have John Robertson, who does not look like an elite European footballer until he is standing over a dead ball.

---

## west-ham-preston-1964-fa-cup-final
- panel: football
- competition: FA Cup Final
- tier: MAJOR
- year: 1964
- participants: [West Ham, Preston North End]
- era: 1964
- dramatic_weight: 7
- special_triggers: [COMEBACK, LAST_MINUTE_GOAL]
- ai_style: Preston — organised, dangerous, lead at half time. Weight toward defensive solidity and set-piece threat. Ron Wylie. Howard Kendall.
- context_notes: Geoff Hurst and Martin Peters both played. West Ham came from behind. Ron Boyce's winner. Wembley. The beginning of something.

> Wembley, 2 May 1964. West Ham are losing at half time to Preston North End, who have Howard Kendall playing for them, which is worth noting because of where that leads eventually. Geoff Hurst is on the pitch. Martin Peters is on the pitch. Ron Boyce is on the pitch and will shortly do something decisive with his right foot. The 1966 World Cup squad is being assembled in real time, which nobody knows yet.

---

## arsenal-valencia-2001-ucl-qf
- panel: football
- competition: UEFA Champions League Quarter-Final
- tier: MAJOR
- year: 2001
- participants: [Arsenal, Valencia]
- era: 2001
- dramatic_weight: 7
- special_triggers: [COMEBACK]
- ai_style: Valencia — technically excellent, well-organised, European experience. Weight toward clinical efficiency and controlled defending.
- context_notes: Arsenal went out on away goals. Henry was magnificent. The away goals rule and the cruelty it contains.

> Mestalla, Valencia, 18 April 2001. Arsenal need to score in Valencia to go through to the Champions League semi-final. Thierry Henry is playing. The away goals rule exists and will shortly matter very much. Arsenal will play well enough to deserve better and not get it, which is a sentence that has been written about Arsenal at various points across several decades.

---

## scotland-england-1967-wembley
- panel: football
- competition: British Home Championship
- tier: STANDARD
- year: 1967
- participants: [Scotland, England]
- era: 1967
- dramatic_weight: 8
- special_triggers: []
- ai_style: England — World Champions, favourites, technically superior, not particularly motivated by the Home Championship. Weight toward controlled performance with inexplicable vulnerability.
- context_notes: Scotland won 3-2 against the world champions. The Scottish fans subsequently declared themselves "unofficial world champions." Jim Baxter's keepy-uppies. Denis Law.

> Wembley, 15 April 1967. England are World Champions. Scotland have come to Wembley to express a specific opinion about that. Jim Baxter will shortly do keepy-uppies on the Wembley pitch while winning, which is either tactical sophistication or something else entirely. Denis Law is present. The concept of unofficial world champions has not yet been invented but is about to be.

---

## england-romania-1998-wc-group
- panel: football
- competition: FIFA World Cup Group Stage
- tier: STANDARD
- year: 1998
- participants: [England, Romania]
- era: 1998
- dramatic_weight: 7
- special_triggers: [LAST_MINUTE_GOAL]
- ai_style: Romania — technically organised, dangerous on the break. Dan Petrescu. Weight toward patient defending and a decisive late moment.
- context_notes: Dan Petrescu scored in the 90th minute to win it for Romania. England went out in the group stage. Michael Owen had scored earlier. Glenn Hoddle was the manager.

> Stade de Toulouse, 22 June 1998. England need a draw or better to progress from the group stage. Michael Owen has already shown the world something in this tournament. Romania have Dan Petrescu, who plays for Chelsea and therefore knows several England players well enough to understand how to hurt them. The ninetieth minute has not yet been reached.

---

## sunderland-leeds-1973-fa-cup-final
- panel: football
- competition: FA Cup Final
- tier: MAJOR
- year: 1973
- participants: [Sunderland, Leeds United]
- era: 1973
- dramatic_weight: 9
- special_triggers: []
- ai_style: Leeds — dominant, technically superior, Don Revie's machine. Weight toward controlled pressure that somehow doesn't convert. Montgomery's double save is coming.
- context_notes: Sunderland were Second Division. Leeds were favourites. Jim Montgomery's double save. Ian Porterfield. The greatest FA Cup upset of the 20th century.

> Wembley, 5 May 1973. Leeds United are the best team in England. Sunderland are in the Second Division. The FA Cup has been won by a Second Division team only twice before and both times were a long time ago. Don Revie, who is meticulous about everything, has prepared thoroughly. Jim Montgomery is in goal for Sunderland. Peter Lorimer is about to shoot from six yards.

---

## man-utd-arsenal-2003-battle-of-old-trafford
- panel: football
- competition: Premier League
- tier: STANDARD
- year: 2003
- participants: [Manchester United, Arsenal]
- era: 2003
- dramatic_weight: 8
- special_triggers: [RED_CARD_DECISIVE]
- ai_style: Arsenal — Invincibles era, Vieira, Henry, Bergkamp. Weight toward dominant technical football interrupted by physical confrontation that they also handle well.
- context_notes: The Battle of Old Trafford. Vieira sent off. Van Nistelrooy penalty miss. Arsenal players surrounding Van Nistelrooy. Martin Keown's face.

> Old Trafford, 21 September 2003. Manchester United and Arsenal have not been playing pleasant football together for approximately six years and are not going to start today. Patrick Vieira and Roy Keane are both on the pitch, which is the kind of scheduling decision that requires either courage or optimism. Ruud van Nistelrooy will shortly miss a penalty and Martin Keown's subsequent expression will become a famous photograph.
