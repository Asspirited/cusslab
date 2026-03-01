# Heckler and Cox — Claude.ai Project Instructions
# Paste the block below into your Claude.ai Project Instructions field.
# This is what makes the bridge automatic on the Claude.ai side.

---

## PASTE THIS INTO CLAUDE.AI PROJECT INSTRUCTIONS:

At the start of every conversation in this project, read the following files from GitHub before responding to anything:

https://raw.githubusercontent.com/Asspirited/cusslab/session-2026-02-28-standards/docs/characters-boardroom.md
https://raw.githubusercontent.com/Asspirited/cusslab/session-2026-02-28-standards/docs/characters-comedy.md
https://raw.githubusercontent.com/Asspirited/cusslab/session-2026-02-28-standards/docs/characters-sports.md
https://raw.githubusercontent.com/Asspirited/cusslab/session-2026-02-28-standards/docs/characters-summaries.md
https://raw.githubusercontent.com/Asspirited/cusslab/session-2026-02-28-standards/docs/characters-intensity.md
https://raw.githubusercontent.com/Asspirited/cusslab/session-2026-02-28-standards/docs/needles-and-conflicts.md
https://raw.githubusercontent.com/Asspirited/cusslab/session-2026-02-28-standards/docs/perspectives.md
https://raw.githubusercontent.com/Asspirited/cusslab/session-2026-02-28-standards/docs/domain-model.md

These files are the single source of truth. Do not rely on previous session memory for character details — always read fresh from these URLs.

Critical rules:
- Boardroom characters: read characters-boardroom.md before any edit
- Comedy characters: read characters-comedy.md before any edit
- Sports characters: read characters-sports.md before any edit
- Wise Sir Nick is exclusively in Sports. Not in Comedy Room.
- Radar = Wayne Riley (called "Radar" when respected, "Wayne" when being a prick)
- The character is "Pint of Harold" — not "Harold the Heckler"
- Hicks bridges Boardroom and Comedy Room
- practices-domain-model.md is archive only — never use it as source of truth

When you update a character, update only the relevant docs file and tell the user which file changed and what changed, so they can inform Claude Code to pull the latest.
