# Historic Games Canon — Schema

All panel game files (`darts.md`, `football.md`, `cricket.md`, `golf.md`) are instances of this schema.
If a field definition changes, change it here first.

---

## Field definitions

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | slug | yes | Globally unique. Format: `{name1}-{name2}-{year}-{competition-short}`. e.g. `taylor-bristow-1994-wc-sf` |
| `panel` | enum | yes | `darts` / `football` / `cricket` / `golf` |
| `competition` | string | yes | Full competition name |
| `tier` | enum | yes | See tier table below |
| `year` | int | yes | Year of the match/event |
| `participants` | array[2] | yes | Exactly two: players (darts/golf) or teams (football/cricket). These are the user's choice options. |
| `era` | int | yes | ERA_LOCK cutoff. Characters cannot reference events after this year. Usually = year of match. |
| `dramatic_weight` | int 1–10 | yes | Computed from tier base + modifiers. See formula below. |
| `stage_setter` | paragraph | yes | One paragraph. Sets tension AND comedy register simultaneously. Names the occasion, the stakes, one real historical detail. Does not narrate the comedy — leaves that to the characters. |
| `ai_style` | string | yes | How the AI generates scores/events for the non-user participant. Describes the real player/team's tendencies. |
| `special_triggers` | array | yes | Which event triggers are live in this game. See trigger list below. Empty array if none. |
| `context_notes` | string | no | Anything the engine needs to know that doesn't fit elsewhere. Era quirks, venue details, rivalry history. |

---

## Tier table

| Tier | Base dramatic weight | Examples |
|---|---|---|
| `ELITE` | 8 | World Championship final, World Cup final, Masters final round |
| `MAJOR` | 6 | Major semi-final, FA Cup final, Ryder Cup deciding session |
| `STANDARD` | 4 | League match, tour event, Test match |
| `MINOR` | 2 | Early round, league cup, qualifier |
| `FULL_ENGLISH` | 1 | Simod Cup, Associate Members Cup, Anglo-Italian Cup, regional qualifier nobody remembers |

---

## Dramatic weight formula

Start from tier base. Apply modifiers. Cap at 10, floor at 1.

| Modifier | Value | Condition |
|---|---|---|
| Final or decisive match | +1 | Match determines a winner/champion |
| Last-leg / last-set / last-hole comeback | +1 | Trailing participant wins from behind |
| Extra time / sudden death / playoff | +1 | Match required additional period |
| Defining individual performance | +1 | One participant dominant (9-darter, hat-trick, 147, 10-under) |
| Major upset | +1 | Lower-ranked/seeded participant wins |
| Rivalry of record | +1 | Documented historic antagonism between participants |
| High scoring / extreme scoreline | +1 | Goals > 5, average > 100, score > 600 in cricket |
| Red card / disqualification / walkout | +1 | Match-altering disciplinary event |

---

## Special triggers (per panel)

### Universal (all panels)
- `COMEBACK` — a participant trailing significantly recovers to draw level or win. Commentary shifts from elegies to chaos. Panel characters react according to their registered response to reversal. Fires regardless of sport. All characters have COMEBACK response patterns.

### Darts
- `NINE_DARTER_POSSIBLE` — when a player is on track, commentary locks in
- `BIG_FISH_ON_BOARD` — 170 remaining, BIG_FISH_CALL mechanic activates
- `CHECKOUT_PRESSURE` — ≤170 remaining, commentary shifts to finish territory
- `BUST` — player scores more than remaining, turn lost
- `MATCH_DART` — player has a dart at a double to win the match
- `MAXIMUMS_RUN` — three or more 180s in sequence

### Football
- `LAST_MINUTE_GOAL` — goal in 85th minute or later
- `RED_CARD_DECISIVE` — red card affects match outcome
- `PENALTY_SHOOTOUT` — match decided on penalties

### Cricket
- `LAST_WICKET_STAND` — final wicket pair batting
- `HAT_TRICK_POSSIBLE` — bowler has taken two consecutive wickets
- `TAIL_WAGGING` — number 10 or 11 making significant runs
- `DECLARATION` — captain declares innings closed

### Golf
- `FINAL_HOLE_DECIDER` — match or title decided on 18th
- `HOLE_IN_ONE_POSSIBLE` — par 3, commentary anticipates
- `RYDER_CUP_CLINCHER` — point that wins or retains the cup
- `EAGLE_OPPORTUNITY` — player in position to make eagle

---

## Stage setter guidelines

The stage setter is written in second person or present tense. It should:
- Name the occasion specifically (venue, year, what was at stake)
- Include one real historical detail that is true and adds texture
- Generate genuine tension — the reader should feel the stakes
- Leave a gap for comedy — the situation contains absurdity the characters will find
- Not exceed 80 words
- Not tell the user what to feel — show the situation

**Good:** Names facts, creates pressure, implies what the characters will do with it.
**Bad:** Explains the game, describes the commentary team, tells the user this is exciting.

---

## AI style guidelines

The `ai_style` field tells the engine how to generate the non-user participant's scores/events.
It should name:
- The participant's real historical tendencies (scoring average, typical patterns)
- Any characteristic behaviours (slow starter, strong finisher, volatile)
- The modal outcome the AI should weight toward

Keep under 40 words.

---

## File format per panel

Each panel file contains a YAML-style list of game records.
No actual YAML parser required — these are reference documents read by Claude at session start.

```
## {id}
- panel: {panel}
- competition: {competition}
- tier: {tier}
- year: {year}
- participants: [{participant_1}, {participant_2}]
- era: {year}
- dramatic_weight: {1-10}
- special_triggers: [{trigger}, ...]
- ai_style: {string}
- context_notes: {string} (optional)

> {stage_setter paragraph}
```
