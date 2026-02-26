# CLAUDE.md — Cuss Lab Project Brief

## What this project is
Cuss Lab is a culturally-calibrated compound profanity impact analyser.
It scores words across 10 linguistic dimensions (acoustic impact, scalar
flexibility, moral condemnation, visual/absurdist image, cross-cultural
portability, originality, grammatical flexibility, class/social signalling,
comic potential, emotional range) and applies culture-specific modifier
layers for AU, NZ, UK, US, IE, CA, ZA, IN, SG.

The product also has:
- AI word generation via Anthropic API (claude-sonnet-4-20250514)
- Community ratings with persistent storage
- A leaderboard of scored words
- A deploy guide for GitHub Pages

## Architecture
Phase 1: Single self-contained HTML file (index.html). No build step,
no dependencies, no backend. Everything — scoring engine, UI, data — lives
in one file. This is intentional for easy iteration and free static hosting.

## Core scoring logic
- computeF(word) → returns {scores, source:'database'|'computed'}
- totalScore(scores) → sum of 10 dimensions (max 100)
- cultureScore(scores, cultureId) → applies culture modifiers, returns 0-100
- DB object: known words with hand-tuned scores
- Algorithmic fallback for unknown words using phonological analysis

## Code conventions
- Always use TDD and BDD
- Always apply clean coding principles
- Always apply SOLID development principles
- Vanilla JS only — no frameworks, no npm dependencies in Phase 1
- CSS custom properties (variables) for theming — never hard-code colours
- Font stack: Bebas Neue (display), Space Mono (code/labels), DM Sans (body)
- Colour palette: --accent #ff3c00, --accent2 #ffd600, --accent3 #00e5ff
- All culture data lives in the CULTURES object — never scatter culture logic
- All word data lives in the DB object — never add scoring exceptions elsewhere
- Comments in English, terse

## What to preserve
- The four-tab navigation (Analyser / AI Suggest / Leaderboard / Deploy Guide)
- The dark theme and overall visual identity
- The DIMS array order — changing it breaks existing scores
- The CULTURES object structure — {name, flag, dims:{}, bias}

## Current hosting
GitHub Pages — static, free, auto-deploys on push to main.
Target URL: https://asspirited.github.io/cusslab

## Commit convention
Conventional Commits: feat:, fix:, docs:, chore:, refactor:
Examples: "feat: add Welsh culture modifier"
          "fix: mobile layout overflow on small screens"
          "chore: expand word database with 20 new entries"

## Roadmap (Phase 2 — not yet started)
- Extract scoring engine to src/js/scoring.js (testable)
- AWS Lambda for server-side AI suggestions (hides API key from frontend)
- DynamoDB for ratings (replace window.storage)
- GitHub Actions CI/CD pipeline
- Jest unit tests for scoring engine
