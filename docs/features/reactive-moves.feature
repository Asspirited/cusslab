@claude
Feature: Reactive moves — behavioural definitions, no literal labels
  As a panel architect
  I want the seven reactive moves to be defined as structural guidance
  And for the model never to output the label as turn-opening text
  So that character voice is preserved and turns feel reactive not instructed

  Background:
    Given Golf, Football, or Comedy Room panel is running
    And TURN_RULES is prepended to every system prompt
    And CONVERSATION MECHANICS is appended to every system prompt

  # ─── RULE 4 PRESENCE ─────────────────────────────────────────────────────────

  Scenario: TURN_RULES contains RULE 4 for all three panels
    Given a turn is constructed for Golf, Football, or Comedy Room
    Then the system prompt contains RULE 4 — REACTIVE MOVES
    And RULE 4 lists all seven moves with descriptions
    And RULE 4 states "Never name the move. Never open with the label."

  Scenario: CONVERSATION MECHANICS reactive line uses plain language
    Given the mechanics block is constructed
    Then the reactive line reads "Agree and build, agree but undermine,
      contradict, refuse, take the piss, insult them properly, or mimic
      them until it falls apart"
    And the line does not contain "yes-and", "yes-but", "yes-no",
      or "no-fuck-no"

  Scenario: User-facing prompt uses plain language
    Given it is a non-first turn
    When the user prompt is constructed
    Then the prompt reads "Agree and build, agree but undermine,
      contradict, refuse, take the piss, insult them properly, or
      mimic them until it falls apart"
    And the prompt does not contain "Yes-and", "yes-but", "yes-no",
      or "no-fuck-no"

  # ─── SEVEN MOVES ─────────────────────────────────────────────────────────────

  Scenario: Agree and build adds something true that makes it worse
    Given a character uses agree-and-build
    Then the character confirms the previous point
    And adds a specific observation that escalates its implication
    And does not open with the words "yes and" or "agree and build"

  Scenario: Agree but undermine confirms surface, destroys substance
    Given a character uses agree-but-undermine
    Then the character appears to validate the previous speaker
    And a subsequent clause removes the ground from under it
    And does not open with "yes but" or "agree but undermine"

  Scenario: Contradict names what was wrong and why
    Given a character uses contradict
    Then the character identifies the specific error in the previous turn
    And names it directly
    And does not open with "yes-no" or "contradict"

  Scenario: Flat refusal is one sentence and the refusal is the content
    Given a character uses flat refusal
    Then the turn is one sentence
    And the sentence refuses to engage with the premise
    And does not open with "no-fuck-no" or "flat refusal"

  Scenario: Light-hearted pisstake punctures with affection
    Given a character uses pisstake
    Then the turn deflates the previous speaker without genuine hostility
    And is shorter than a full-blooded insult
    And does not open with "pisstake" or "light-hearted"

  Scenario: Full-blooded insult lands on real wound
    Given a character uses full-blooded insult
    Then the turn uses strong language
    And targets something specific to the recipient — a wound, a failure,
      a known indiscretion
    And does not open with "full-blooded insult" or "insult"

  Scenario: Mimic repeats in own register until ridiculous
    Given a character uses mimic at intensity below 3
    Then the turn verbally echoes or parodies the previous speaker
    And uses the character's own voice register, not the target's

  Scenario: Mimic at intensity 3 or above briefly becomes the target
    Given a character uses mimic at intensity 3 or above
    Then the character briefly speaks in the target's register
    And loses the thread mid-sentence
    And does not open with "mimic" or any label

  # ─── NO LABEL IN OUTPUT ──────────────────────────────────────────────────────

  Scenario: No turn opens with a reactive move label
    Given any panel run produces output
    Then no turn begins with "yes-and", "yes-but", "yes-no",
      "no-fuck-no", "agree and build", "agree but undermine",
      "contradict", "flat refusal", "pisstake", or "mimic"
    And reactive structure is visible in the content, not the label
