# Skills Taxonomy v0.1 — pipeline-visible spec marker
# Canonical principle lives at: .claude/principles/skills-taxonomy.md
# Scope decision (Rod 2026-06-03): Option 2 — Comedy Room only at v0.1.
# Anti-bleed enforcement (§4.7, §7.11) is the WL-131 / BL-176 connection.
#
# These scenarios document the principle as testable behaviour. Step definitions
# may not exist yet for every scenario; the @claude tag marks the file for
# manual-verification pipeline visibility (per the round-head.feature precedent).
# When step definitions land, this file becomes an automated regression seed.

@claude
Feature: Skills Taxonomy v0.1 — Comedy Room cast validation

  Background:
    Given the canonical skills taxonomy at ".claude/principles/skills-taxonomy.md"
    And the Comedy Room cast as enumerated in "docs/characters-summaries.md" Skills Index
    And every Comedy Room character file under "characters/"

  Scenario: Every Comedy Room character file declares a Skills section
    When the file is read
    Then it contains a section titled "Skills (provisional taxonomy v0.1)"
    Or the canonical mapping in skills-taxonomy.md §5 covers the character

  Scenario: Every Comedy Room character has exactly one primary skill
    When the Skills section is parsed
    Then the "Primary" block names exactly one skill from the v0.1 inventory
    And the skill name is one of the 22 enums listed in skills-taxonomy.md §2

  Scenario: Every Comedy Room character declares non-empty anti-skills
    When the Skills section is parsed
    Then the "Anti-skills" block lists at least one skill from the v0.1 inventory
    And the skill name is one of the 22 enums listed in skills-taxonomy.md §2
    And no anti-skill overlaps with the primary skill

  Scenario: Anti-bleed — no two Comedy Room characters share a primary skill (WL-131 / BL-176)
    When all Comedy Room character primaries are collected
    Then each primary skill appears at most once across the cast
    Or the collision pair is documented in skills-taxonomy.md §7.11 with a shape-differentiator
    And the collision is flagged as PENDING THREE AMIGOS

  Scenario: Secondary skills are 2-3 entries (single-skill characters excepted)
    When the Skills section is parsed
    Then the "Secondary" block lists between 2 and 3 skills
    Or the character is documented as a "single-skill character" per skills-taxonomy.md §7.9

  Scenario: Skills travel with the character cross-panel (resolved §7.7)
    Given a character appears in multiple panels (e.g. Hicks Boardroom + Comedy Room; Cox Boardroom + Comedy Room; Pilkington Round Head + Comedy Room)
    When the character is selected in any panel
    Then their primary skill is the same primary skill defined in their canonical file
    And panel-specific overrides happen via M9 (panel-specific rules), not via skill-set swap

  Scenario: Skill enum is schema-locked (proposed §7.5)
    Given a new skill is required for a character
    When the character file is written or amended
    Then the skill name is drawn from the 22-entry v0.1 inventory
    And new skill enums require a BL item against skills-taxonomy.md

  Scenario: WL-131 mitigation — reactive opener is not the engine default
    Given a Comedy Room character whose primary skill is not Topical riffing or Callback
    When the engine prompts the character to take a turn
    Then the prompt directs the character to deploy their primary skill
    And the prompt does not obligate a reaction to the previous turn
    And reactive openers fire only when the previous turn genuinely triggers the character

  Scenario: Topical riffing as primary capped at one Comedy Room character (§7.6)
    When the Comedy Room cast's primary skills are surveyed
    Then at most one character carries Topical riffing as primary
    And secondary Topical riffing is capped at 2 characters per active panel selection

  Scenario: Skills taxonomy is canonical for the Comedy Room only at v0.1
    Given Rod 2026-06-03 Option 2 decision (skills-taxonomy.md §7.1 RESOLVED)
    When a non-Comedy-Room character file is read
    Then it is NOT required to carry a Skills section at v0.1
    And schema-wide promotion (backfill of remaining ~83 character files) is deferred to v0.2
    And v0.2 promotion is gated on at least one closed pipeline cycle proving WL-131 mitigation works
