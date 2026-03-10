# The Author's Epilogue — Design Notes
# Last updated: 2026-03-10
# BL-058

---

## The Concept

At the end of any game or session with a narrative arc, a randomly selected literary author is summoned to write a short prose summary of events in their inimitable style. The comedy is entirely in the collision between the literary register and the subject matter.

A golf adventure narrated by Cormac McCarthy. A darts match summarised by Jane Austen. A 2008 Ryder Cup epilogue from the desk of J.K. Rowling.

---

## Trigger and UX

- **Trigger:** end of game / final score shown
- **Button:** "The Author's Account 📖" — opt-in, one press
- **Selection:** random from pool each press. No author repeats until pool exhausted (sessionStorage shuffle).
- **Output length:** 250–400 words. Enough to establish the voice. Not so long it becomes a bit.
- **Re-roll:** "Another Author 🎲" button — summons a different one

---

## What the author receives (context for prompt)

- Panel type (golf / football / darts / cricket / oracle)
- Outcome summary (who won, key moments, score, character interactions)
- Any wound activations or notable character moments
- The mood at the end (triumphant / disastrous / ambiguous)

---

## Author Pool

### Already have (existing panel characters)

| Author | Panel name | Voice in current system |
|---|---|---|
| Enid Blyton | Slightly Squiffy Blyton | Famous Five. The rough is a secret passage. Everyone is jolly or a villain. Has had a couple. |
| Oscar Wilde | Wildest of Oscars | Every shot is an epigram. Suffering is bad taste. The ball knows it's being watched. |

### New authors needed

| Author | Register | The comedy |
|---|---|---|
| **Leo Tolstoy** | Vast, philosophical, suffering as meaning | War and golf. The birdie at the 7th is a microcosm of the human condition. One round = 600 pages. |
| **Isaac Asimov** | Rational, systematic, Three Laws applied to sport | Three Laws of Golf. The caddie is a robot. It cannot harm a golfer except through incorrect club selection. |
| **J.R.R. Tolkien** | Mythic scope, Elvish, appendices, ancestral lineage | The course is named in Elvish. One chip shot has three pages of backstory. There is an appendix about the bunker. |
| **Charlotte Brontë** | Gothic, moors, passion, unspoken feeling | The rough is the moors. Someone brooding is in the bunker. It begins to rain with intent. |
| **Jane Austen** | Social comedy, manners, sly observation | "It is a truth universally acknowledged that a golfer in possession of a good handicap must be in want of a birdie." |
| **John le Carré** | Paranoid, espionage, nobody is who they say | Everyone at the club is working for someone else. The caddie has a past. The scorecard was a message. |
| **Wilbur Smith** | Adventure, vast scale, raw masculinity, Africa | Impossible distances. Someone is hunting something. The game takes place across a continent. |
| **James Patterson** | Short chapters, everything DRAMATIC, pace pace pace | Chapter 1. He lined up the putt. Chapter 2. He missed. Chapter 3. "Damn," he said. The novel has 94 chapters. |
| **J.K. Rowling** | Wizarding lens + extended author commentary on themes | The course is Hogwarts. Everyone is sorted. The game is inadvertently problematic on several levels she would like to address at length. |
| **Cormac McCarthy** | No punctuation, biblical register, dust, nihilism | No quotation marks. The ball rolled. Everything was dust. The sun did not care about the outcome. |
| **Raymond Chandler** | Hardboiled, noir, Los Angeles similes, private eye | The green was as smooth as a lie told by a man who'd told better ones. He putted. She watched from the clubhouse. |
| **Ernest Hemingway** | Short sentences, iceberg theory, masculine stoicism | He putted. He missed. The sun was hot. Tomorrow he would try again. It would be the same sun. |
| **Agatha Christie** | Suspects everywhere, Poirot, the reveal | Everyone in the clubhouse is a suspect. Poirot examines the divot. He already knows. He's been watching the 9th all afternoon. |
| **Terry Pratchett** | Footnotes, Death plays (annoyingly well), satire, truth | *A FOOTNOTE ON THE PHYSICS OF GOLF BALLS AND WHY THEY DON'T CARE.* Death plays off scratch. Nobody will acknowledge this. |
| **Dan Brown** | Every sentence a cliffhanger, symbols, codes, the Vatican | The symbol on the scorecard was not a birdie. It was a warning. The caddie knew about the Priory of the Tee. |
| **P.G. Wodehouse** | Jeeves, gentle chaos, upper-class incompetence, Drones Club | Bertie Wooster is hopeless at golf. Jeeves, however, is not. The situation deteriorates pleasantly over nine holes. |
| **Hunter S. Thompson** | Gonzo, paranoid, political, Fear and Loathing | We were somewhere around the 7th hole when the drugs began to take hold. The caddie was no longer human. |
| **Jeffrey Archer** | Shameless, self-aggrandising, economical with truth | He had never lost a round of golf, he told himself. This was not entirely true. It was not true at all. |
| **Barbara Cartland** | Romance, heaving bosoms, pastel, eternal love | Her heart fluttered as he approached the 18th hole. His grip was masterful. His handicap was seven, which she found irresistible. |

---

## Prompt design notes

Each author needs:
1. **Voice signature** — the defining register (3–5 sentences describing style, not personality)
2. **Structural tell** — the thing they always do (Tolkien: appendix. Pratchett: footnote. Patterson: chapter numbers. Christie: the reveal. Hemingway: the silence between sentences.)
3. **Wound** — the thing that derails the prose briefly before returning to the summary (Rowling: can't not address the discourse. McCarthy: briefly attempts punctuation, gives up. Archer: inserts himself. Wodehouse: Bertie wanders in uninvited.)
4. **The inevitable closing line** — every author has a closing register

---

## Implementation phases

- **Phase 1:** Golf Adventure — natural end point, score exists, character arc, wound history available
- **Phase 2:** Football Moment, Darts, Cricket Long Room
- **Phase 3:** Oracle conversation (author summarises the Phil/Kirstie/Dion conversation), Boardroom session

---

## Comedy calibration

The shorter the piece, the harder the register has to work. Hemingway is funnier in 8 sentences than 40. Patterson is funnier in 6 chapters of two sentences each. Tolkien's appendix should be longer than the summary itself.

The author is not trying to be funny. That's the whole thing.
