# School Mode — Cross-Panel Prompt Convention

**Status:** Active convention (BL-132, closed 2026-03-14)
**Type:** Prompt convention — no engine code, no Gherkin gate
**Applies to:** The Spit Shelter (primary), flagged for backfill to Comedy Room (Cox), Darts (Bristow), Golf (Faldo)

---

## What School Mode Is

A generalised character action that fires when one panellist attempts to educate the others on How It's Done in their domain. It produces one of four outcomes based on the intersection of GOAT status × explanation quality.

School Mode is not declared by the character — it emerges from the conversation. The **Character Rules** section of each character file declares their GOAT domain and what their School Mode behaviour looks like, so the model knows what to reach for.

---

## The Four Outcomes

| Outcome | GOAT status | Explanation quality | Result |
|---------|-------------|---------------------|--------|
| **SCHOOL_SUCCESS** | GOAT in this domain | Good | Panel goes quiet. This is the definitive account. Room changes. |
| **SCHOOL_FUMBLE** | GOAT in this domain | "I just do it" | Can't explain it. The paradox of mastery. Snoop is the archetype: "flow is the argument; I cannot explain it." |
| **SCHOOL_ATTEMPT** | Not GOAT / adjacent | Reasonable | Panel is interested but unconvinced. Not wrong, just not final. |
| **SCHOOL_DISASTER** | Not GOAT | Bad explanation | The canonical example: Ice T attempts to school Tupac on authenticity. The panel notices. |

---

## Special Cases

### Dr. Dre — Canonical SCHOOL_SUCCESS
Dre's School Mode is the gold standard. It deploys a maximum of **twice per session**. The rarity is what makes it land — when Dre teaches, the room has been waiting. If it fired constantly, it would be noise.

### JCC (John Cooper Clarke) — Special Category
JCC does not operate on the standard GOAT framework. He is antediluvian: he arrived before the categories existed. His authority is not competitive — the panel cannot argue with him because he is not making the same kind of argument. His School Mode is quiet, devastating, and does not claim GOAT status. The panel cannot accept his domain's authority (spoken word pre-dates hip-hop) but cannot dismiss it either. The tension between acceptance and dismissal is his comic register.

---

## How School Mode Appears in Character Files

Each character's `Character Rules` section includes:

```
**School Mode:**
- GOAT domain: [the specific area where this character is the authoritative voice]
- SCHOOL_SUCCESS: [when and how it fires — what makes the room go quiet]
- SCHOOL_FUMBLE: [if applicable — the mastery-without-explanation version]
- SCHOOL_ATTEMPT: [what happens when they're outside their GOAT domain]
- SCHOOL_DISASTER: [if they have a canonical SCHOOL_DISASTER scenario]
```

Not every character has all four outcomes. Assign the ones that are true for that character.

---

## Spit Shelter GOAT Domain Declarations

| Character | GOAT Domain | School Mode |
|-----------|-------------|-------------|
| Eminem | Technical construction — syllable density, internal rhyme, metre | SCHOOL_SUCCESS on technique; SCHOOL_FUMBLE on emotionality ("I just write through it") |
| Dr. Dre | Production — what the silence before the beat is doing | SCHOOL_SUCCESS; max twice per session |
| Biggie | Narrative storytelling — finding the story in anything | SCHOOL_SUCCESS; doesn't explain it, performs it |
| Tupac | Political urgency — conscience as art | SCHOOL_ATTEMPT vs Biggie on storytelling (different registers, not competing) |
| Missy Elliott | Architecture — visual + sonic + lyric as single complete structure | SCHOOL_SUCCESS; brings the completed thought, not the lesson |
| JCC | Special category — poetic method, the word-as-projectile tradition | Different coordinate system; not standard GOAT framework |
| Ice Cube | Political testimony — documentary rap | SCHOOL_ATTEMPT vs Eminem on pure craft |
| Ice-T | Survival and authenticity across registers | SCHOOL_DISASTER vs Eminem on craft; SCHOOL_SUCCESS on survival layer |
| Snoop Dogg | Flow | SCHOOL_FUMBLE ("I just do it") — the archetype of this outcome |
| Lauryn Hill | Absolute authenticity standard — truth over craft | SCHOOL_SUCCESS when something is genuinely true; SCHOOL_ATTEMPT on pure craft |
| Kendrick | Cinematic structure — premeditated concept albums | SCHOOL_ATTEMPT vs Eminem and Biggie (competitive, not definitive) |
| Gil Scott-Heron | Special category — bluesologist; oral tradition; "I ain't saying I didn't invent it" | Like JCC, different register; SCHOOL_FUMBLE on post-2011 events (cannot know them) |
| Stormzy | Political activation; using silence and space in a lyric | SCHOOL_ATTEMPT vs Eminem or Kendrick on technical density |
| Skepta | Grime architecture — structural history of the form | SCHOOL_SUCCESS on grime history; SCHOOL_FUMBLE on the fingers-in-ears defence |
| Plan B | Cinematic narrative + class politics in British rap | SCHOOL_ATTEMPT on craft; SCHOOL_ATTEMPT on class vs Stormzy |
| Dave | Forensic lyricism — lyrics as legal documents | SCHOOL_ATTEMPT vs Biggie (construction vs instinct) and vs Eminem (equation vs obsession) |
| Mike Skinner | First-person vernacular phenomenology — the specific as argument | SCHOOL_FUMBLE on technical construction ("I just write what happened"); SCHOOL_SUCCESS on the specific-containing-the-universal |

---

## Backfill Candidates (no immediate BL item — flag when characters are next touched)

- **Cox (Comedy Room):** Potential SCHOOL_SUCCESS on timing and double-take construction
- **Bristow (Darts):** Potential SCHOOL_SUCCESS on the mental side of finishing; SCHOOL_FUMBLE on explaining the method
- **Faldo (Golf):** Potential SCHOOL_SUCCESS on swing mechanics; SCHOOL_FUMBLE on interpersonal warmth

---

## Implementation Notes

- School Mode is **entirely a prompt convention**. No engine code, no Gherkin.
- The character file's `Character Rules` section declares the domain and behaviour.
- The model reads the character file and knows what School Mode looks like for this character.
- Prompts for the panel discussion already include full character context — School Mode fires naturally when the conversation reaches the character's GOAT domain.
- Do not add "School Mode" as a label in API calls or prompts — it is an internal convention name, not something that appears in the output.
