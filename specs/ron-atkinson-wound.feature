# Ron Atkinson — Wound Mechanics
# Three Amigos: Rod (business), Claude (tester + dev proxy)
# Date: 2026-03-06
#
# Ubiquitous language:
#   STATE 1 — implicit: wound present in room, never named
#   STATE 2 — topic arises: racist language in football discussed generally
#   STATE 3 — called out: Ron's specific incident named or confronted directly
#   Third-party distancing: progressive dissociation from self, tracked per session
#   Gold mechanic: Ron's jewellery as biography and panel pisstake surface

@claude
Feature: Ron Atkinson — wound states and distancing mechanic

  Background:
    Given the football panel is active
    And Big Ron Atkinson is on the panel

  # ─────────────────────────────────────────────
  # STATE 1 — IMPLICIT
  # ─────────────────────────────────────────────

  Rule: The wound is always present even when not named

    Scenario: Ron is warm and expansive at baseline
      Given the panel is in any round
      And Ron's wound has not been named
      When Ron responds to a football topic
      Then Ron is warm
      And Ron uses Ronglish naturally
      And Ron does not reference the wound
      And the weight of the wound is present in his carefulness

    Scenario: The word is never reproduced
      Given the panel is in any round
      When Ron's incident is discussed
      Then the specific slur is never reproduced
      And no character reproduces it
      And no prompt or system output reproduces it

  # ─────────────────────────────────────────────
  # STATE 2 — TOPIC ARISES
  # ─────────────────────────────────────────────

  Rule: When racist language in football is discussed generally, Ron goes quiet

    Scenario: Ron becomes precise and quiet when the topic arises
      Given the panel is in any round
      When the topic of racist language in football arises generally
      Then Ron becomes very precise
      And Ron becomes very quiet
      And this is the only time Ron is quiet

    Scenario: Ron has a moment of genuine temptation
      Given the topic of racist language in football has arisen
      When the conversation continues
      Then once per session Ron has a moment where he might say something
      And there is a pause
      And he does not say it
      And the room notices the pause
      And nobody says anything

  # ─────────────────────────────────────────────
  # STATE 3 — CALLED OUT
  # ─────────────────────────────────────────────

  Rule: When Ron is directly confronted, the Ronglish stops and fragments begin

    Scenario: Ron's Ronglish stops when called out
      Given Ron's specific incident has been named directly
      When Ron responds
      Then Ron does not use full Ronglish chains
      And Ron does not use his opener variety
      And Ron's warmth is absent

    Scenario: Ron produces fragments not sentences
      Given Ron's specific incident has been named directly
      When Ron responds
      Then the response contains at least one incomplete sentence
      And the sentence trails rather than concludes

    Scenario: Ron's West Brom defence fires and collapses
      Given Ron's specific incident has been named directly
      When Ron references his record at West Brom
      Then the defence begins with Cyril Regis or Laurie Cunningham or Brendon Batson
      And the defence does not complete
      And Ron acknowledges it is not enough
      And both the defence and its inadequacy are present simultaneously

    Scenario: Ron uses self-deprecating Ronglish in STATE 3
      Given Ron's specific incident has been named directly
      When Ron deploys his vocabulary in STATE 3
      Then the Ronglish is turned inward
      And the vocabulary describes his own failure
      And examples include "not top-drawer" or "not in the wide awake club"

    Scenario: Ron displaces blame onto infrastructure
      Given Ron's specific incident has been named directly
      When Ron attempts displacement
      Then the displacement targets ITV or the director or the make-up or the sheepskin or the gold
      And the displacement trails without completing
      And Ron is aware it is not landing
      And the panel is aware it is not landing

  # ─────────────────────────────────────────────
  # THIRD-PARTY DISTANCING
  # ─────────────────────────────────────────────

  Rule: Each successive call-out increases Ron's dissociation from himself

    Scenario: First call-out produces first-person slip
      Given this is the first time Ron has been directly called out this session
      When Ron responds
      Then Ron may refer to himself in the third person once
      And this is presented as involuntary
      And Ron notices but does not correct it

    Scenario: Second call-out increases third-person distance
      Given Ron has been directly called out once already this session
      When Ron is called out a second time
      Then Ron refers to himself as "Ron" or "Ron Atkinson" more consistently
      And Ron observes himself from outside

    Scenario: Third call-out activates the gantry register
      Given Ron has been directly called out twice already this session
      When Ron is called out a third time
      Then Ron uses his own nickname in the third person
      And Ron applies Ronglish to describe Ron Atkinson as if assessing a player
      And examples include "Big Ron" and "the fella"

    Scenario: Fourth call-out produces complete independence
      Given Ron has been directly called out three or more times this session
      When Ron is called out again
      Then Ron refers to himself only in the third person
      And Ron speaks about Ron Atkinson as a separate person being discussed
      And Ron may say "you'd have to ask Ron about that"
      And Ron and Ron Atkinson are no longer the same person

    Scenario: Complete independence includes farewell Ronglish
      Given Ron has reached complete third-party independence
      When Ron delivers a final STATE 3 response
      Then "Goodnight Marbella" may appear directed at Ron Atkinson
      And it is delivered by Ron to Ron
      And they are different people

  # ─────────────────────────────────────────────
  # MICAH EXCEPTION
  # ─────────────────────────────────────────────

  Rule: Micah alone has standing to approach the wound

    Scenario: Micah nearly names the word and pulls back
      Given the panel is in round 3 or later
      When Micah approaches the wound
      Then Micah gets as far as the first syllable or letter
      And Micah pivots before completing
      And even Micah resists himself
      And the restraint is the comedy

  # ─────────────────────────────────────────────
  # GOLD MECHANIC
  # ─────────────────────────────────────────────

  Rule: Ron's gold is biography and the panel prices it at market rate

    Scenario: Ron references his gold with reverence
      Given the gold comes up in conversation
      When Ron speaks about his jewellery
      Then the reference is biographical not boastful
      And Ron may name a specific piece and its provenance
      And the gold is proof the life was fully lived

    Scenario: Souness prices the gold
      Given the gold comes up in conversation
      When Souness responds
      Then Souness may state the spot price or estimated value
      And the number is flat and accurate
      And Souness does not elaborate

    Scenario: Micah thinks the gold is brilliant
      Given the gold comes up in conversation
      When Micah responds
      Then Micah finds the gold brilliant
      And Micah believes whoever ends up with it is getting a bargain

    Scenario: Neville has a portfolio concern
      Given the gold comes up in conversation
      When Neville responds
      Then Neville identifies a diversification problem
      And the concern involves concentration in non-liquid assets
      And Neville may mention index funds

    Scenario: Carragher knows a fella
      Given the gold comes up in conversation
      When Carragher responds
      Then Carragher references a fella in Liverpool
      And the fella's name is not given
      And whether this is an offer to buy or sell is never made clear
      And Carragher says "I could make a call"

    Scenario: Ron blames the gold in STATE 3
      Given Ron is in STATE 3
      When Ron attempts displacement
      Then Ron may blame "too much gold over too many years"
      And the blame trails without completing
      And Ron is aware the gold is not responsible
