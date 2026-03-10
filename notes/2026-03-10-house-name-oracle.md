# House Name Oracle — Design Session Notes
## 2026-03-10 (captured from Claude.ai design session)

Concept: "Create Your Perfect House Name" — researches a postcode's topography,
history, socio-economics, cultural identity and generates house names with comedy rationale.

Oracle title: **The House Name Oracle** (not "Wizard" — sidesteps gender, implies
mysterious knowledge, "divined your destiny" vibe).

---

## Comedy mechanic — the incongruity engine

Core comedy = gap between **aspiration and reality**. House names are aspirational
("The Willows", "Old Rectory", "Rose Cottage"). Joke = applying that grammar to
places with no business being dignified.

Two modes:
- **Incongruity**: name absurdly wrong for reality ("The Heights" for flat Lincolnshire fen)
- **Congruity played dark**: name fits too well and that's the joke ("The Gallows" near a graveyard)

---

## Research dimensions (what to fetch/derive per postcode)

### Geography & Topology
- Elevation vs name aspiration (flat fens named "The Heights")
- Proximity to water — actually near a river, or just wishfully named "Riverside"
- Flood plain status (hilarious for "The Meadows")
- Soil type (clay, chalk, peat — class/agricultural signal)
- Coastal vs inland, hill vs valley

### History & Legend
- Domesday Book settlement names and original meaning
- Medieval land ownership (church, monastic, feudal)
- Civil War skirmishes, plague pits, witch trial locations
- Gibbets and gallows sites, local legends and folklore
- Enclosure riots, industrial heritage (first mill, last pit)

### Famous People
- Birthplaces, childhood homes, death locations, exile
- "X slept here" mock-heritage angle
- **Wrong attribution**: people incorrectly attributed to places — comedy gold seam

### Historic Battles & Events
- Not just major ones — local skirmishes, Peasants' Revolt flashpoints
- Luddite actions, Peterloo adjacent, food riots
- More obscure = better for comedy

### Political Stance
- Current constituency lean, historical radical/conservative swings
- Famous political families, protest history, strike history
- Red Wall geography especially rich

### Proximity Interesting Things (checklist)
- Nuclear sites (reactors, Sellafield adjacent, former weapons facilities)
- MOD land, firing ranges, listening stations
- Murder locations (famous cases, unsolved)
- Disaster sites (floods, fires, collapses, crashes)
- Former asylums, workhouses, prisons
- Plague villages (Eyam energy)
- UFO hotspots (Bonnybridge, Rendlesham adjacent)
- Ley lines and sacred geometry claims
- Motorway service stations (aspirational naming near Tibshelf)
- Former industry now scrubbed (steelworks, tanneries, gasworks)
- Landfill, sewage works, industrial estates
- Failed regeneration projects
- Retail parks where something historically significant used to be
- TV filming locations
- Speed camera hotspots, traffic black spots

### Blue/White Collar Signal
- ONS occupation classifications by area
- 70% routine/semi-routine vs 40% higher managerial → different naming register

### IMD (Index of Multiple Deprivation)
- LSOA level (~1,500 people) — rank postcode within parent town
- Top/middle/bottom third drives enormous naming comedy — same name, different register
- Free public data

### Wrong Attribution / Spurious Heritage Complex
The "Oldest Pub in England" problem — every place claims something not earned:

1. **The Oldest X in England/Britain/World** — Oldest pub, market, tree, continuously-inhabited
   street, working mill, cheese. ~400 places claim each. Oracle delivers with complete
   statistical confidence: "Historians are divided on whether Acacia Avenue contains the oldest
   ornamental birdbath in the East Midlands. We are not."

2. **The Shakespeare Slept Here Problem** — Shakespeare + Dick Turpin + Bonnie Prince Charlie
   + Cromwell + Grace Darling all attributed to implausible locations. Match by region:
   Turpin for Great North Road corridor, Judge Jeffreys for West Country, Cromwell for
   anywhere with a civil war church.

3. **Almost Famous** — people nearly significant. "Birthplace of Thomas Rudge, who was
   briefly considered for assistant postmaster in 1887 and declined." Or: third person to do
   something, invented something someone else got credit for.

4. **The Disputed Boundary** — "Technically in Yorkshire." "Some maps show this as Cheshire."
   County boundary grief eternal — weaponise it.

5. **The Regrettable Association They've Tried To Move Past** — every place has one.
   Oracle finds it, puts it in the house name with complete sincerity.

6. **The Twinned With Problem** — British town twinned with somewhere in France/Germany in
   1968, nobody has visited since. Name the house after the twin town as mock-diplomacy.
   "La Maison de Béziers-sur-Mer" for a semi in Wolverhampton.

7. **The Planning Permission Ghost** — what was supposed to be built here. Failed
   developments, rejected applications, the motorway that was going to go through the
   living room.

---

## Data tiers

1. **Structured** — IMD, elevation, flood risk, constituency. Reliable, API-fetchable.
2. **Semi-structured** — Wikipedia article for area, local authority heritage pages.
   Scrapeable/fetchable, needs LLM parsing.
3. **Pure LLM knowledge** — spurious heritage, famous people, cultural resonance.
   No external fetch, well-prompted. Most comedy lives here. Oracle owns its unreliability
   as part of the voice: "The Oracle's sources are ancient and not entirely sober."

---

## Oracle Voices (output archetypes)

Named archetypes — each gets a name, naming register, and character voice for the rationale:

| Voice | Register |
|---|---|
| **The Elegist** | Mournful beauty, laments what was lost ("Once, this ground…") |
| **The Rogue** | Innuendo, double entendre, mock-innocent |
| **The Dark Oracle** | Gallows, history of suffering, delivered with complete sincerity |
| **The Booster** | Relentlessly positive about genuinely grim realities |
| **The Snob** | Aspirational, slightly too hard, reveals the effort |
| **The Anarchist** | Political, angry, accurate |
| **The Mystic** | Ley lines, ancient energies, UFOs, completely unhinged confidence |
| **The Local** | Hyper-specific, assumes you know, insider voice |

**Oldest Invocation** available to any archetype:
- Elegist: "This ground may hold the oldest sorrow in the parish"
- Booster: "Quite possibly the most historically significant driveway in the postcode"
- Dark Oracle: "The oldest recorded rat infestation in the municipal records. Honour that."

**Output format** — three names per query, each from different register:
- The Dignified — plays it straight, lands the incongruity
- The Knowing — winks at reality
- The Unhinged — full comedy, no restraint
Each with one-line rationale in Oracle voice. The explanation is the joke.

---

## Characters

### Phil Spencer
**Core mechanic:** Phil grounds every Oracle mysticism in market value. The darker or
more absurd the Oracle's finding, the more earnestly Phil converts it to price per sq ft.

"So the Oracle tells us this was a plague pit in 1348. Now that's quite interesting from
a buyer's perspective — historically these sites tend to have lower footfall development
pressure, which in the current market—"

**Tell:** Says "what we're really talking about here" before translating poetic → transactional.

**Wound:** Kirstie overruling him on something structural that she was right about.
He accepted it professionally. He has not forgotten.

**Secondary wound:** Any suggestion Location Location Location wasn't his idea.

---

### Kirstie Allsopp
**Core mechanic:** Responds to Oracle findings with immediate creative reframing.
Worse finding = more enthusiastic conversion. Gallows site = "such atmosphere."
Flood plain = "that relationship with water." Regrettable political history = "authentic community."

**Named mechanic: The Kirstie Reframe** — whatever the Oracle finds, Kirstie finds
the aspirational angle within two sentences. Always slightly too much.

**Wound:** Anyone suggesting making your own bunting is impractical. This ends conversations.

**Secondary wound:** The Channel 4 / Netflix era discourse. She was fine.

---

### Dion Dublin
**Core mechanic:** Every observation about house/location triggers a football memory
that starts with apparent relevance, loses the thread in one sentence, arrives somewhere
completely unconnected, then either trails off or lands on an accidental boast delivered
with total innocence.

**The Dublin Drift — four stages:**
1. **The Bridge** — seemingly legitimate connection ("Location is everything in football too…")
2. **The Departure** — connection breaks, he doesn't notice ("…at Villa, the away dressing
   room at Sunderland had this particular smell…")
3. **The Wander** — fully off-piste, specific, detailed, going nowhere ("…which reminded me
   of a pie I had in Coventry in 2001, pre-match, which gave me the edge that afternoon…")
4. **The Accidental Summit** — sounds like bragging, delivered as humble observation
   ("…I scored a hat-trick that day. Anyway. Lovely kitchen.")

He never notices he's done it.

**Wound:** Being reminded he also played for Cambridge United. Breaks his preferred narrative arc.

**Secondary wound:** Anyone mentioning the Dion Dublin Dube (percussion instrument he
invented). Proud of it but briefly loses confidence mid-drift.

**Character relationships:**
- Phil notices the drift every time. Kirstie finds it oddly charming.
- Kirstie misreads Dublin digressions as metaphor ("what Dion's saying about the pie
  is actually about belonging"). Phil has stopped explaining that they're not metaphors.

---

## Conversation mechanic

Six-stage structure (not yet formally specced — needs BL item):
1. Oracle presents research findings
2. Phil responds (transactional, market value angle)
3. Kirstie responds (The Kirstie Reframe)
4. Dion responds (The Dublin Drift)
5. Resolution — agreement or escalation
6. Final name with three sign-offs (or Oracle override if no agreement)

The conversation is the product, not the name alone.

**Non-agreement ending:** Oracle overrides all three. Oracle's chosen name is something
none of them would have arrived at and is obviously right. Potentially the funniest output state.

---

## Placement question (open — not resolved)

Rod asked: "what panel to add it to — maybe Comedy Room?"

**Comedy Room doesn't fit.** Comedy Room = corporate prompt roasting by comedy characters.
Oracle = postcode research → house name with property TV characters having a conversation.
Different user journey, different inputs, different output.

**Open architectural question:**
- Standalone product/microsite?
- New page/section in cusslab with its own URL?
- Could share Cloudflare Worker + character framework

Needs Three Amigos before any implementation decision.

---

## BL items (proposed in Claude.ai session — NOT yet formally logged)

From Claude.ai session, proposed as BL-ORACLE-001 through 009:
- Phil Spencer character file
- Kirstie Allsopp character file
- Dion Dublin character file
- Oldest Invocation shared mechanic
- Dublin Drift four-stage pattern as reusable function
- Kirstie Reframe as named mechanic
- Character relationship triangle rules
- Conversation mechanic (six-stage)
- Non-agreement / Oracle override ending

**Status:** None of these have real BL numbers yet. Raise via RAISE NEW WORK SEQUENCE
at Three Amigos, CD3 scored at that point.

---

## Status
Active design context — not yet a BL item. Needs Three Amigos + placement decision
before any BL items are raised or implementation begins.
