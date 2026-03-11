Feature: Bespoke Material — panel delivers character-voiced material from user profile
  As a user who has provided personal details
  I want each Boardroom panel member to deliver one piece of bespoke material
  So that the comedy is specific to me, not generic

  # ── Profile building ──────────────────────────────────────────────────────

  Scenario: Full profile produces a profile description with all fields
    Given a bespoke material profile with:
      | profession    | middle manager    |
      | location      | Slough            |
      | relationship  | Unhappily married |
      | age           | 46-55             |
      | hobby         | birdwatching      |
    When I build the bespoke profile description
    Then the profile description includes "middle manager"
    And the profile description includes "Slough"
    And the profile description includes "Unhappily married"
    And the profile description includes "46-55"
    And the profile description includes "birdwatching"

  Scenario: Partial profile omits blank fields
    Given a bespoke material profile with:
      | profession    | nurse |
      | location      |       |
      | relationship  |       |
      | age           |       |
      | hobby         |       |
    When I build the bespoke profile description
    Then the profile description includes "nurse"
    And the profile description does not include "location"
    And the profile description does not include "age"

  # ── Validation ────────────────────────────────────────────────────────────

  Scenario: Profile with profession is valid
    Given a bespoke material profile with profession "project manager"
    When I validate the bespoke material profile
    Then the bespoke material profile is valid

  Scenario: Profile with no profession is invalid
    Given a bespoke material profile with no profession
    When I validate the bespoke material profile
    Then the bespoke material profile is invalid

  Scenario: Profile with blank profession is invalid
    Given a bespoke material profile with profession "   "
    When I validate the bespoke material profile
    Then the bespoke material profile is invalid

  # ── Character prompts ─────────────────────────────────────────────────────

  Scenario: Prompts are built for all 6 Boardroom characters
    Given a bespoke material profile with profession "accountant"
    And the selected bespoke themes are "Self-deprecating"
    When I build prompts for all bespoke material characters
    Then prompts exist for sebastian, harold, roy, partridge, mystic, and hicks

  Scenario: Each character prompt includes the user profile
    Given a bespoke material profile with profession "accountant" and location "Leeds"
    And the selected bespoke themes are "Boss insult"
    When I build the bespoke material prompt for character "roy"
    Then the prompt includes "accountant"
    And the prompt includes "Leeds"
    And the prompt includes "Boss insult"

  Scenario: Character prompts carry distinct voice signatures
    Given a bespoke material profile with profession "accountant"
    When I build the bespoke material prompt for character "harold"
    And I build the bespoke material prompt for character "mystic"
    Then the harold prompt and mystic prompt are different
