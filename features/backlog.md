# Golf Adventure — Feature Backlog

## Ryder Cup: Be Any Player

User can pick any of the 24 players available across all Ryder Cup tournaments and play as them for all 3 days, following whichever matches those players were actually in. The player picker on the setup screen should display all 24 options when a Ryder Cup tournament is selected, showing the player's team, role, and historical wound. The match schedule populates from the player's actual matchPlayDays data.

## 1997 Ryder Cup — Valderrama with Coltart

Add the 1997 Ryder Cup at Valderrama as a tournament (`valderrama_1997`). Seve Ballesteros captained Europe (he did not play). Andrew Coltart is a player option — notably he was picked for Sunday singles having not appeared in Friday or Saturday team matches, making him one of the least-used players in the history of the event. Also include Lee Westwood, Colin Montgomerie, and Jesper Parnevik. The tournament lore should focus on: Seve's captain's role, the unusual Sunday-only players, and Europe's eventual win (14.5–13.5).

---

## Other Historic category: Pro-Ams, Celebrity Golf, Curiosity TV

Expand the "Other Historic" category to cover the full range of televised golf oddities. Candidates:

- **Shell's Wonderful World of Golf** (1960s–70s) — head-to-head matches at exotic locations, impeccable commentary, genuinely great golf. Each episode is a self-contained matchplay game. Perfect format.
- **A Round with Alliss** (BBC, 1980s–90s) — Peter Alliss takes a celebrity/sportsperson around a course and narrates their suffering. Alliss's commentary as a character mechanic.
- **The Skins Game** — high-stakes, winner-takes-all, carries over. USA TV staple. Trevino, Player, Watson, Nicklaus formats ideal.
- **Pro-Am formats** — celebrity + pro pairing. The gap in quality between the amateur and the professional is its own comedy engine.
- **The Dunhill Links / Alfred Dunhill** — St Andrews, Carnoustie, Kingsbarns. Celebrities playing proper links with proper players alongside them.
- **TSL (The Smylie League)** / modern exhibition formats — modern era, big personalities, social media stakes.

Key design question: does the player play as the celebrity (fish-out-of-water comedy) or as the pro (babysitting a celebrity who keeps making disasters)?

---

## All Ryder Cups — Prioritised Rollout Plan

Add every Ryder Cup eventually, one by one, ordered by comedic and historic interest. Priority framework:

**Tier 1 — Europe wins, high drama, great characters:**
- 1985 The Belfry — Europe's first win in 28 years. Ballesteros, Langer, Woosnam. Sam Torrance holes on 18. Tony Jacklin captains.
- 1987 Muirfield Village — Europe wins on US soil for the first time. Ballesteros/Olazabal as a pairing. Tense throughout.
- 1995 Oak Hill — Faldo holes on 18 to beat Azinger. Woosnam, Gilford, Torrance. Bernard Gallacher's third attempt as captain, first win.
- 2006 K Club — Europe win 18.5–9.5. Woeful USA. Darren Clarke plays days after his wife Heather's death. Cannot be left out.
- 2010 Celtic Manor — first Ryder Cup in Wales, completed on Monday after rain. Graeme McDowell wins the decisive point.

**Tier 2 — USA wins, but rich in incident:**
- 1991 Kiawah (already in) — The War on the Shore. Langer's putt.
- 1999 Brookline (already in) — The Battle of Brookline. Leonard's putt. The green incident.
- 2016 Hazeltine — USA 17–11. Europe collapse. Rory visibly furious.
- 2021 Whistling Straits — USA 19–9. Biggest US win in 40 years. Patrick Reed vs Rory etc.

**Tier 3 — GB/Ireland era, pre-Europe (1927–1971):**
- 1969 Royal Birkdale — Jack Nicklaus concedes Tony Jacklin's putt on 18 to halve the match. The concession. Greatest sporting gesture in golf.
- 1953 Wentworth — Ben Hogan's only Ryder Cup. USA win easily but Hogan's presence alone is the story.
- 1933 Southport & Ainsdale — GB&I win (rare). Syd Easterbrook holes on the last.

**Tier 4 — Great Britain only era (1927–1929), curiosity value:**
- 1927 Worcester CC — the inaugural Ryder Cup. Walter Hagen captains USA. Ted Ray captains GB. Set the template.
- 1929 Moortown — GB win. Archie Compston beats Walter Hagen 6&4 in singles.

**Ordering note:** Prioritise Europe-wins tournaments more heavily in the rollout — the comedy engine works better when the player is fighting for something against the odds. GB&I/GB eras are worth doing but fewer of them, and framed as historical curiosity rather than partisan drama.

**Era styling note:** Each Ryder Cup needs its own era CSS class and broadcast aesthetic:
- Pre-1970: monochrome BBC, static cameras, sparse commentary
- 1970s–80s: Ceefax/teletext era, limited coverage, Alliss narrating
- 1991–99: late 90s ESPN/ABC style, high drama, crowd noise
- 2000s+: NBC/Sky Sports, graphics-heavy, team tables, constant scoreboard updates
