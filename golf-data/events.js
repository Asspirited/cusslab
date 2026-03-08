const EVENTS = [
  // ── WILDLIFE EVENTS ──
  {
    id: "king_brown_approach", triggerChance: 0.12,
    hasImage: true,
    header: "A KING BROWN SNAKE HAS APPEARED ON THE FAIRWAY",
    text: `It is between you and your ball. It is not moving. Approximately 1.8 metres long and appears to be having a perfectly good morning that you have now interrupted.`,
    riley_activates: true,
    choices: [
      { label: "Wait for it to move on naturally", cost: 0 },
      { label: "Walk a wide arc around it", cost: 1 },
      { label: "Relocate it — Steve Irwin style", cost: 0, death_chance: 0.35, death_type: "king_brown" },
      { label: "Ask Riley — he's already moving toward it", cost: 0, special: "riley_takes_over" }
    ], danger: false
  },
  {
    id: "adder_rough", triggerChance: 0.10,
    hasImage: true,
    header: "THERE IS AN ADDER IN THE ROUGH",
    text: `British. Venomous. Technically protected under the Wildlife and Countryside Act 1981. Your ball is next to it. The rulebook does not cover this adequately.`,
    riley_note: "Riley is dismissive. 'That's not a snake.'",
    choices: [
      { label: "Take an unplayable lie — the snake wins", cost: 0 },
      { label: "Play the shot — it probably won't move toward you", cost: 1, death_chance: 0.08, death_type: "adder" },
      { label: "Ask the referee for a ruling", cost: 1 },
      { label: "Let Riley handle it", cost: 0, special: "riley_takes_over" }
    ], danger: false
  },
  {
    id: "funnel_web_bag", triggerChance: 0.08,
    riley_activates: true,
    hasImage: true,
    header: "A FUNNEL-WEB SPIDER HAS APPEARED IN YOUR BAG",
    text: `Your caddy has opened the bag for your 7-iron and taken three steps backward without explanation. You can see why.`,
    choices: [
      { label: "Request a club from the outside of the bag", cost: 0 },
      { label: "Firmly close the bag — use what's in your hand", cost: 1 },
      { label: "Locate it before playing — carefully", cost: 0, death_chance: 0.15, death_type: "funnel_web" },
      { label: "Ask Riley — he has gone very still", cost: 2 }
    ], danger: false
  },
  {
    id: "alligator_water", triggerChance: 0.15,
    tournament_only: ["tiger_2005"],
    hasImage: true,
    header: "THERE IS AN ALLIGATOR IN THE WATER HAZARD",
    text: `Augusta National's water management system connects to local wetlands. This is not normally relevant. Today it is relevant.`,
    choices: [
      { label: "Take the drop on the far side", cost: 0 },
      { label: "Play from where you are — it hasn't moved", cost: 1, death_chance: 0.2, death_type: "alligator" },
      { label: "Wait for the alligator wrangler — apparently there is one", cost: 0 },
      { label: "Attempt to befriend it — Riley says it worked in Florida once", cost: 0, death_chance: 0.4, death_type: "alligator" }
    ], danger: true
  },
  {
    id: "honey_badger", triggerChance: 0.03,
    hasImage: true,
    header: "A HONEY BADGER HAS EMERGED FROM THE ROUGH",
    text: `It is not large. This is not reassuring. It has assessed the situation and appears to have made a decision. The decision involves you specifically.`,
    riley_activates: true,
    choices: [
      { label: "Back away slowly — no eye contact", cost: 1 },
      { label: "Stand completely still and hope", cost: 0, death_chance: 0.25, death_type: "honey_badger" },
      { label: "Distract it with a golf glove", cost: 0, death_chance: 0.15, death_type: "honey_badger" },
      { label: "Ask Riley — Riley is already in a tree", cost: 2 }
    ], danger: true
  },
  // ── ITEM AND SENSORY EVENTS ──
  {
    id: "caddy_water", triggerChance: 0.18,
    hasImage: true,
    header: "YOUR PLAYING PARTNER'S CADDY OFFERS YOU WATER",
    text: `He's smiling. Sealed bottle. Probably. You've been on the course three hours and it's warm. Your own caddy is 40 yards ahead.`,
    isItemEvent: true,
    choices: [
      { label: "Accept and drink it", outcomes: [
        { result: 'composure_up',   chance: 0.25, desc: "Clean, cold, perfect. Composure +2." },
        { result: 'fortune',        chance: 0.15, desc: "Lucozade Sport. Fortune active." },
        { result: 'nothing',        chance: 0.20, desc: "Fine. Just water." },
        { result: 'composure_loss', chance: 0.10, desc: "Slightly too fizzy. Mild belch on the backswing." },
        { result: 'illness',        chance: 0.15, desc: "Something was wrong with that water." },
        { result: 'lost_clothing',  chance: 0.05, desc: "It was a laxative. Something has to come off." },
        { result: 'death', chance: 0.10, death_type: 'poisoned_water', desc: "It was not water." }
      ]},
      { label: "Decline politely", outcomes: [{ result: 'nothing', chance: 1.0 }] },
      { label: "Accept but don't drink", outcomes: [
        { result: 'fortune',        chance: 0.15 },
        { result: 'lost_accessory', chance: 0.30, desc: "It leaked on your rangefinder." },
        { result: 'nothing',        chance: 0.55 }
      ]},
      { label: "Ask what's in it", outcomes: [
        { result: 'composure_loss', chance: 0.50, desc: "The caddy's expression is difficult to read." },
        { result: 'fortune',        chance: 0.30, desc: "He says electrolytes. You believe him." },
        { result: 'disqualified',   chance: 0.20, desc: "The referee overhears. The answer involves a banned substance that isn't yours." }
      ]}
    ], danger: false
  },
  {
    id: "hip_flask", triggerChance: 0.12,
    hasImage: true,
    header: "A SPECTATOR HAS OFFERED YOU SOMETHING FROM A FLASK",
    text: `He's been following you since the 4th. He seems friendly. The flask is silver. Engraved. It says something in Latin.`,
    isItemEvent: true,
    choices: [
      { label: "One sip", outcomes: [
        { result: 'fortune',        chance: 0.30 },
        { result: 'skill_up',       chance: 0.20 },
        { result: 'composure_up',   chance: 0.20 },
        { result: 'illness',        chance: 0.20 },
        { result: 'death', chance: 0.10, death_type: 'flask' }
      ]},
      { label: "Full swig", outcomes: [
        { result: 'skill_up',       chance: 0.15 },
        { result: 'fortune',        chance: 0.10 },
        { result: 'lost_clothing',  chance: 0.25, desc: "Something happens over the next two holes that is difficult to explain." },
        { result: 'illness',        chance: 0.30 },
        { result: 'death', chance: 0.20, death_type: 'flask' }
      ]},
      { label: "Decline", outcomes: [{ result: 'nothing', chance: 1.0 }] },
      { label: "Ask what it is", outcomes: [
        { result: 'composure_loss', chance: 0.40 },
        { result: 'nothing',        chance: 0.60 }
      ]}
    ], danger: false
  },
  {
    id: "marshals_pie", triggerChance: 0.14,
    hasImage: true,
    header: "A MARSHAL HAS OFFERED YOU A PIE",
    text: `He's been carrying it since the 1st. It's still warm. He seems very keen for you to have it.`,
    isItemEvent: true,
    choices: [
      { label: "Accept — eat it now", outcomes: [
        { result: 'composure_up',   chance: 0.20 },
        { result: 'fortune',        chance: 0.10 },
        { result: 'nothing',        chance: 0.20 },
        { result: 'threshold_up',   chance: 0.20, desc: "Pastry in the hands. One shot." },
        { result: 'illness',        chance: 0.20 },
        { result: 'death', chance: 0.10, death_type: 'pie' }
      ]},
      { label: "Accept — save it", outcomes: [
        { result: 'lost_accessory', chance: 0.40, desc: "Something is now covered in gravy." },
        { result: 'fortune',        chance: 0.30 },
        { result: 'nothing',        chance: 0.30 }
      ]},
      { label: "Decline", outcomes: [
        { result: 'nothing',        chance: 0.70 },
        { result: 'composure_loss', chance: 0.30, desc: "The marshal looks devastated. You think about this for two holes." }
      ]}
    ], danger: false
  },
  {
    id: "found_glove", triggerChance: 0.10,
    hasImage: true,
    header: "YOU FIND A GLOVE IN THE ROUGH",
    text: `Clean. Good condition. Your size, approximately. Your own glove has been uncomfortable since the 3rd.`,
    isItemEvent: true,
    choices: [
      { label: "Put it on", outcomes: [
        { result: 'skill_up',       chance: 0.30 },
        { result: 'nothing',        chance: 0.30 },
        { result: 'lost_accessory', chance: 0.20, desc: "Your original glove falls out of your pocket." },
        { result: 'illness',        chance: 0.10, desc: "Something on the glove. Your hand is itching." },
        { result: 'death', chance: 0.10, death_type: 'glove_spider' }
      ]},
      { label: "Leave it", outcomes: [{ result: 'nothing', chance: 1.0 }] },
      { label: "Hand it to the caddy", outcomes: [
        { result: 'fortune',        chance: 0.30 },
        { result: 'nothing',        chance: 0.50 },
        { result: 'composure_loss', chance: 0.20, desc: "The caddy is offended by the implication." }
      ]}
    ], danger: false
  },
  {
    id: "lost_trousers", triggerChance: 0.06,
    header: "YOUR TROUSERS HAVE BECOME PROBLEMATIC",
    text: `The belt buckle failed on the 11th. You've been managing. You can no longer manage.`,
    isItemEvent: true,
    choices: [
      { label: "Play through — dignity is a choice", outcomes: [
        { result: 'fortune',        chance: 0.10 },
        { result: 'composure_loss', chance: 0.50 },
        { result: 'lost_clothing',  chance: 0.40, desc: "They're gone. You're playing in your shorts." }
      ]},
      { label: "Request replacement from the pro shop", outcomes: [
        { result: 'stroke_penalty', chance: 0.50 },
        { result: 'fortune',        chance: 0.30, desc: "The replacement trousers are significantly better." },
        { result: 'nothing',        chance: 0.20 }
      ]},
      { label: "Ask the marshal for a spare belt", outcomes: [
        { result: 'nothing',        chance: 0.40 },
        { result: 'composure_up',   chance: 0.30, desc: "He has one. He's pleased to help." },
        { result: 'lost_clothing',  chance: 0.30, desc: "The marshal's belt doesn't fit." }
      ]}
    ], danger: false
  },
  {
    id: "crowd_cheer_name", triggerChance: 0.20,
    header: "THE CROWD CHEER YOUR NAME",
    text: `Unprompted. Genuine. Someone started it and the gallery picked it up. Your name, repeated, growing.`,
    isItemEvent: true,
    choices: [
      { label: "Acknowledge it — tip the cap", outcomes: [
        { result: 'crowd_cheer',    chance: 0.60 },
        { result: 'composure_loss', chance: 0.20, desc: "The kindness breaks something briefly." },
        { result: 'nothing',        chance: 0.20 }
      ]},
      { label: "Stay in process — don't look up", outcomes: [
        { result: 'fortune',        chance: 0.40 },
        { result: 'composure_up',   chance: 0.40 },
        { result: 'nothing',        chance: 0.20 }
      ]},
      { label: "Drink it in — take a moment", outcomes: [
        { result: 'crowd_cheer',    chance: 0.40 },
        { result: 'fortune',        chance: 0.30 },
        { result: 'composure_loss', chance: 0.30, desc: "Too long. The moment passed." }
      ]},
      { label: "Point at the crowd — you're feeling it", outcomes: [
        { result: 'fortune',        chance: 0.30 },
        { result: 'crowd_cheer',    chance: 0.30 },
        { result: 'composure_loss', chance: 0.40, desc: "Someone shouts something back. Not the vibe anymore." }
      ]}
    ], danger: false
  },
  {
    id: "urine_smell", triggerChance: 0.10,
    hasImage: true,
    header: "YOU HAVE SMELLED SOMETHING",
    text: `Undeniable. Unlocatable. The wind has shifted and brought something that is absolutely not the sea, the gorse, or the cut grass.`,
    isItemEvent: true,
    choices: [
      { label: "Say nothing — play through", outcomes: [
        { result: 'composure_loss', chance: 0.50, desc: "It's still there." },
        { result: 'nothing',        chance: 0.30 },
        { result: 'illness',        chance: 0.20, desc: "It gets worse. Much worse." }
      ]},
      { label: "Investigate the source — briefly", outcomes: [
        { result: 'composure_loss', chance: 0.60, desc: "You found the source. You wish you hadn't." },
        { result: 'stroke_penalty', chance: 0.20, desc: "Slow play. Also you found the source." },
        { result: 'nothing',        chance: 0.20, desc: "It has passed. You will never know." }
      ]},
      { label: "Ask the caddy if he can smell it", outcomes: [
        { result: 'nothing',        chance: 0.40, desc: "He cannot. This is somehow worse." },
        { result: 'composure_loss', chance: 0.40, desc: "He can. You both stand in it together." },
        { result: 'fortune',        chance: 0.20, desc: "He identifies the source and resolves it. You don't ask how." }
      ]},
      { label: "Move your mark — play from slightly left", outcomes: [
        { result: 'nothing',        chance: 0.50 },
        { result: 'stroke_penalty', chance: 0.30, desc: "Incorrect procedure. The referee also smells it and doesn't care." },
        { result: 'composure_up',   chance: 0.20, desc: "You are upwind. Golf is sometimes about wind management." }
      ]}
    ], danger: false
  },
  {
    id: "mashed_potato", triggerChance: 0.15,
    hasImage: true,
    header: "SOMEONE HAS SHOUTED 'MASHED POTATO'",
    text: `Mid-backswing. Clear as a bell. Right at the top. 'MASHED POTATO.' You know the tradition. You do not endorse the tradition.`,
    isItemEvent: true,
    choices: [
      { label: "Say nothing — finish the shot", outcomes: [
        { result: 'anger',          chance: 0.40 },
        { result: 'nothing',        chance: 0.40 },
        { result: 'fortune',        chance: 0.20, desc: "The anger focused you." }
      ]},
      { label: "Turn and locate the shouter", outcomes: [
        { result: 'anger',          chance: 0.60 },
        { result: 'composure_loss', chance: 0.40 }
      ]},
      { label: "Acknowledge it — you're above this", outcomes: [
        { result: 'crowd_cheer',    chance: 0.30, desc: "The gallery appreciates the grace." },
        { result: 'nothing',        chance: 0.40 },
        { result: 'anger',          chance: 0.30, desc: "You're not above this. The wave was a lie." }
      ]},
      { label: "Shout something back", outcomes: [
        { result: 'composure_up',   chance: 0.20, desc: "It landed. The gallery is with you." },
        { result: 'anger',          chance: 0.30 },
        { result: 'disqualified',   chance: 0.10, desc: "The referee heard what you said. So did the microphone." },
        { result: 'fortune',        chance: 0.10 },
        { result: 'composure_loss', chance: 0.30, desc: "It did not land. You're the villain now." }
      ]}
    ], danger: false
  },

  // ══════════════════════════════════════════
  // SENSORY POOL — PATCH F
  // ══════════════════════════════════════════

  // ── HEAR ──
  {
    id: "hear_wrong_name", triggerChance: 0.08,
    channel: "HEAR",
    header: "👂 SOMEONE HAS CALLED THE WRONG NAME",
    text: `Clear as a bell. Not your name. Someone else's name. Possibly your playing partner's. Possibly a name that hasn't been in a major since 1987. The gallery doesn't correct it.`,
    isItemEvent: true,
    choices: [
      { label: "Ignore it completely", outcomes: [
        { result: 'nothing',        chance: 0.60 },
        { result: 'composure_loss', chance: 0.30, desc: "It's still there. Renting space." },
        { result: 'fortune',        chance: 0.10, desc: "The anonymity was clarifying." }
      ]},
      { label: "Look up — locate the source", outcomes: [
        { result: 'composure_loss', chance: 0.50 },
        { result: 'anger',          chance: 0.30 },
        { result: 'nothing',        chance: 0.20 }
      ]},
      { label: "Answer to it anyway", outcomes: [
        { result: 'fortune',        chance: 0.40, desc: "The crowd accepted this. You are briefly someone else. It helps." },
        { result: 'composure_loss', chance: 0.60, desc: "The crowd realised. You are you again. Worse." }
      ]}
    ], danger: false
  },
  {
    id: "hear_wrong_advice", triggerChance: 0.10,
    channel: "HEAR",
    header: "👂 SOMEONE IN THE GALLERY HAS SHOUTED ADVICE",
    text: `Specific advice. Technically detailed. Completely wrong. Delivered with absolute confidence. Your caddy has heard it. He's making a face.`,
    isItemEvent: true,
    choices: [
      { label: "Block it out", outcomes: [
        { result: 'nothing',        chance: 0.50 },
        { result: 'composure_loss', chance: 0.30, desc: "You can't stop thinking about the grip adjustment they suggested." },
        { result: 'fortune',        chance: 0.20 }
      ]},
      { label: "Try it — just briefly", outcomes: [
        { result: 'threshold_up',   chance: 0.60, desc: "It was wrong. Completely wrong. You knew it was wrong." },
        { result: 'fortune',        chance: 0.20, desc: "It was wrong but it broke your existing pattern. Accidentally correct." },
        { result: 'death',          chance: 0.20, death_type: 'cardiac', desc: "Your body rejected the adjustment at the cellular level." }
      ]},
      { label: "Make eye contact with the caddy — you both know", outcomes: [
        { result: 'composure_up',   chance: 0.40, desc: "Shared contempt is briefly bonding. Composure +1." },
        { result: 'nothing',        chance: 0.40 },
        { result: 'anger',          chance: 0.20 }
      ]}
    ], danger: false
  },
  {
    id: "hear_someone_crying", triggerChance: 0.06,
    channel: "HEAR",
    header: "👂 SOMEONE IN THE GALLERY IS CRYING",
    text: `Not quietly. Not discretely. Full, genuine grief. Three rows back. The marshal has noticed. No one is doing anything. This is not about golf — something has happened in this person's life today and they are here at a golf tournament and they are crying.`,
    isItemEvent: true,
    choices: [
      { label: "Focus — this is not your business", outcomes: [
        { result: 'composure_loss', chance: 0.50, desc: "You focused. But." },
        { result: 'nothing',        chance: 0.30 },
        { result: 'fortune',        chance: 0.20, desc: "The perspective was clarifying. Everything else is just golf." }
      ]},
      { label: "Pause — a moment of human acknowledgment", outcomes: [
        { result: 'fortune',        chance: 0.50, desc: "The gallery saw it. They're with you now in a different way." },
        { result: 'composure_loss', chance: 0.30, desc: "You paused too long. Now you're thinking about it." },
        { result: 'stroke_penalty', chance: 0.20, desc: "Slow play. The referee was not moved." }
      ]},
      { label: "Ask the marshal to help them", outcomes: [
        { result: 'composure_up',   chance: 0.40, desc: "The marshal helped. You helped indirectly. Composure +2." },
        { result: 'stroke_penalty', chance: 0.30, desc: "Slow play. The marshal was also crying by this point." },
        { result: 'nothing',        chance: 0.30 }
      ]}
    ], danger: false
  },
  {
    id: "hear_phone_ringtone", triggerChance: 0.12,
    channel: "HEAR",
    hasImage: true,
    header: "👂 A PHONE HAS RUNG MID-BACKSWING",
    text: `Full volume. A ringtone that was briefly popular in 2009 and should not have survived. The owner is now the most hated person on this fairway.`,
    isItemEvent: true,
    choices: [
      { label: "Step away and reset", outcomes: [
        { result: 'composure_loss', chance: 0.40, desc: "The reset helped mechanically. The ringtone is still in your head." },
        { result: 'nothing',        chance: 0.40 },
        { result: 'fortune',        chance: 0.20, desc: "The interruption broke a tension you'd been building for three holes." }
      ]},
      { label: "Play through — already committed", outcomes: [
        { result: 'threshold_up',   chance: 0.50, desc: "Mid-backswing. The damage is done." },
        { result: 'nothing',        chance: 0.30 },
        { result: 'fortune',        chance: 0.20, desc: "Fury golf. The ringtone became fuel." }
      ]},
      { label: "Locate the owner — deal with this", outcomes: [
        { result: 'anger',          chance: 0.50 },
        { result: 'fortune',        chance: 0.20, desc: "The gallery agreed with you. They applauded. The owner apologised." },
        { result: 'stroke_penalty', chance: 0.30, desc: "Slow play. The referee was also distracted by the ringtone." }
      ]}
    ], danger: false
  },
  {
    id: "hear_commentator_earpiece", triggerChance: 0.07,
    channel: "HEAR",
    header: "👂 YOU CAN HEAR THE TV COMMENTARY THROUGH SOMEONE'S EARPIECE",
    text: `Three feet away. A spectator with one earpiece in. The commentator is discussing your swing. In detail. The spectator has realised you can hear. They are not removing the earpiece.`,
    isItemEvent: true,
    choices: [
      { label: "Listen — what are they saying?", outcomes: [
        { result: 'fortune',        chance: 0.25, desc: "They said something genuinely useful. Accidentally." },
        { result: 'composure_loss', chance: 0.50, desc: "They said something about your hip rotation that you cannot now un-know." },
        { result: 'anger',          chance: 0.25, desc: "They named someone you don't like as having a better technique." }
      ]},
      { label: "Move away from the spectator", outcomes: [
        { result: 'nothing',        chance: 0.60 },
        { result: 'composure_up',   chance: 0.40, desc: "Distance was the correct answer." }
      ]},
      { label: "Ask the spectator what they're saying", outcomes: [
        { result: 'fortune',        chance: 0.20 },
        { result: 'anger',          chance: 0.40, desc: "The spectator repeated it. Direct. No filter." },
        { result: 'composure_loss', chance: 0.40 }
      ]}
    ], danger: false
  },
  {
    id: "hear_premonition_sound", triggerChance: 0.05,
    channel: "HEAR",
    header: "👂 YOU HEAR YOUR OWN SHOT — BEFORE YOU'VE PLAYED IT",
    text: `The click of impact. The flight. The crowd's reaction. All of it, three seconds ahead of reality. Your caddy hands you the club. You know exactly what's about to happen. You're not sure if that's good.`,
    isItemEvent: true,
    choices: [
      { label: "Trust it — play the shot you heard", outcomes: [
        { result: 'fortune',        chance: 0.50, desc: "It happened exactly as you heard it. The caddy looks unsettled." },
        { result: 'threshold_down', chance: 0.30, desc: "Certainty reduced the threshold. You'd already played this." },
        { result: 'composure_loss', chance: 0.20, desc: "You heard something different the second time." }
      ]},
      { label: "Step away — reset completely", outcomes: [
        { result: 'nothing',        chance: 0.50 },
        { result: 'composure_loss', chance: 0.30, desc: "The premonition followed you." },
        { result: 'fortune',        chance: 0.20 }
      ]},
      { label: "Tell the caddy what you heard", outcomes: [
        { result: 'composure_loss', chance: 0.50, desc: "The caddy's expression is not reassuring." },
        { result: 'fortune',        chance: 0.30, desc: "The caddy said 'good — play that'. You did. It worked." },
        { result: 'anger',          chance: 0.20, desc: "The caddy told you to stop talking and hit the ball." }
      ]}
    ], danger: false
  },

  // ── SEE ──
  {
    id: "see_child_copying", triggerChance: 0.10,
    channel: "SEE",
    header: "👁️ A CHILD IS COPYING YOUR STANCE",
    text: `Front row. Approximately six years old. Has found a stick. Is adopting your exact pre-shot routine, beat for beat. The parents are filming it. The child is not joking — this is sincere mimicry.`,
    isItemEvent: true,
    choices: [
      { label: "Acknowledge the child — nod", outcomes: [
        { result: 'crowd_cheer',    chance: 0.50, desc: "The gallery erupted. The child nodded back. Something happened." },
        { result: 'fortune',        chance: 0.30 },
        { result: 'composure_loss', chance: 0.20, desc: "The child then immediately hit a better shot than you with their stick." }
      ]},
      { label: "Give the child your tee", outcomes: [
        { result: 'crowd_cheer',    chance: 0.60 },
        { result: 'fortune',        chance: 0.30 },
        { result: 'lost_accessory', chance: 0.10, desc: "You gave away your last good tee. You didn't check." }
      ]},
      { label: "Focus — use it as fuel", outcomes: [
        { result: 'fortune',        chance: 0.40, desc: "You played for the child. The child deserved better but got this." },
        { result: 'nothing',        chance: 0.40 },
        { result: 'composure_loss', chance: 0.20, desc: "The child copied your exact hesitation. The gallery laughed." }
      ]}
    ], danger: false
  },
  {
    id: "see_scoreboard_wrong", triggerChance: 0.09,
    channel: "SEE",
    header: "👁️ THE SCOREBOARD HAS YOUR SCORE WRONG",
    text: `Two shots worse than you actually are. The manual scoreboard operator is looking at the wrong sheet. Half the gallery thinks you're in trouble you're not in.`,
    isItemEvent: true,
    choices: [
      { label: "Ignore it — you know your score", outcomes: [
        { result: 'nothing',        chance: 0.50 },
        { result: 'composure_loss', chance: 0.30, desc: "You can't stop looking at it." },
        { result: 'fortune',        chance: 0.20, desc: "Playing without expectation. The pressure was on the wrong player." }
      ]},
      { label: "Signal to the operator", outcomes: [
        { result: 'nothing',        chance: 0.40, desc: "It's corrected. The gallery shifts." },
        { result: 'stroke_penalty', chance: 0.30, desc: "Slow play. The operator took a while. Also the referee is now involved." },
        { result: 'fortune',        chance: 0.30, desc: "The correction caused a ripple. The gallery reaction to your real score was enormous." }
      ]},
      { label: "Play to the wrong scoreboard — use the pressure", outcomes: [
        { result: 'fortune',        chance: 0.40, desc: "Extra pressure activated something. Your body didn't know it was fake." },
        { result: 'threshold_up',   chance: 0.40, desc: "Extra pressure was just extra pressure." },
        { result: 'anger',          chance: 0.20 }
      ]}
    ], danger: false
  },
  {
    id: "see_flash_of_light", triggerChance: 0.08,
    channel: "SEE",
    header: "👁️ A FLASH OF LIGHT AT THE TOP OF YOUR BACKSWING",
    text: `Camera flash. Watch reflection. Phone screen. The sun off a hospitality tent. Something. Right at the top. The ball is in motion.`,
    isItemEvent: true,
    choices: [
      { label: "Commit — the shot is gone, go with it", outcomes: [
        { result: 'nothing',        chance: 0.40 },
        { result: 'fortune',        chance: 0.20, desc: "Fury and commitment produced something extraordinary." },
        { result: 'threshold_up',   chance: 0.40, desc: "The flash interrupted something that can't be recovered mid-swing." }
      ]},
      { label: "Abort — step away and reset", outcomes: [
        { result: 'composure_loss', chance: 0.30, desc: "The abort was clean. The rhythm isn't." },
        { result: 'nothing',        chance: 0.50 },
        { result: 'fortune',        chance: 0.20, desc: "The reset was the reset you needed anyway." }
      ]}
    ], danger: false
  },
  {
    id: "see_playing_partner_tells", triggerChance: 0.09,
    channel: "SEE",
    header: "👁️ YOU'VE SPOTTED YOUR PLAYING PARTNER'S TELL",
    text: `The left hand tightens on long putts. The shoulder drops before a pull. Three holes of data. You now know something about their game they don't know you know.`,
    isItemEvent: true,
    choices: [
      { label: "File it — say nothing", outcomes: [
        { result: 'fortune',        chance: 0.60, desc: "Information is composure. You're calmer." },
        { result: 'nothing',        chance: 0.40 }
      ]},
      { label: "Discard it — not your business", outcomes: [
        { result: 'nothing',        chance: 0.70 },
        { result: 'composure_up',   chance: 0.30, desc: "Clean mind. The ethical clarity helped." }
      ]},
      { label: "Let them know, casually, that you noticed", outcomes: [
        { result: 'anger',          chance: 0.50, desc: "They did not appreciate this." },
        { result: 'fortune',        chance: 0.30, desc: "They appreciated it. An unusual camaraderie developed." },
        { result: 'composure_loss', chance: 0.20, desc: "They pointed out one of yours in return." }
      ]}
    ], danger: false
  },
  {
    id: "see_your_own_shadow", triggerChance: 0.06,
    channel: "SEE",
    header: "👁️ YOUR SHADOW IS DOING SOMETHING YOUR BODY ISN'T",
    text: `Late afternoon light. Long shadow. The shadow's backswing is wrong — too steep, early extension. You've been compensating for this for years. You've never seen it from the outside before.`,
    isItemEvent: true,
    choices: [
      { label: "Look away immediately — this is not useful now", outcomes: [
        { result: 'nothing',        chance: 0.50 },
        { result: 'composure_loss', chance: 0.30, desc: "Too late. The shadow is in your head." },
        { result: 'fortune',        chance: 0.20 }
      ]},
      { label: "Make a minor adjustment based on what you saw", outcomes: [
        { result: 'skill_up',       chance: 0.30, desc: "The adjustment was correct. Two holes only — it won't last." },
        { result: 'threshold_up',   chance: 0.40, desc: "Mid-round swing change. The textbooks are clear on this." },
        { result: 'fortune',        chance: 0.30, desc: "Sometimes you need to see it once. Just once." }
      ]},
      { label: "Tell the caddy what you saw", outcomes: [
        { result: 'composure_up',   chance: 0.30, desc: "He'd noticed. He was waiting for you to notice. Composure +2." },
        { result: 'composure_loss', chance: 0.40, desc: "He'd noticed. He said he'd been going to mention it after the round." },
        { result: 'anger',          chance: 0.30, desc: "He'd noticed and had not said anything in six holes." }
      ]}
    ], danger: false
  },

  // ── SMELL ──
  {
    id: "smell_hot_dog", triggerChance: 0.12,
    channel: "SMELL",
    hasImage: true,
    header: "👃 HOT DOG",
    text: `From the concession stand behind the 8th green. Onions. Possibly mustard. You haven't eaten since 6am. It is now 1:17pm. This is not a distraction. This is a structural problem.`,
    isItemEvent: true,
    choices: [
      { label: "Focus — you're a professional", outcomes: [
        { result: 'nothing',        chance: 0.40 },
        { result: 'composure_loss', chance: 0.40, desc: "You're thinking about the hot dog. You're still thinking about it." },
        { result: 'fortune',        chance: 0.20, desc: "Hunger sharpened something. The body prioritised survival." }
      ]},
      { label: "Ask the caddy if he has anything", outcomes: [
        { result: 'composure_up',   chance: 0.30, desc: "He had a cereal bar from 2022. It was fine. Composure +1." },
        { result: 'lost_accessory', chance: 0.30, desc: "He had something but it went into the bag pocket that also has the spare glove. The glove is now flavoured." },
        { result: 'nothing',        chance: 0.40, desc: "He had nothing. You both knew this. The asking made it worse." }
      ]},
      { label: "Acquire a hot dog between shots", outcomes: [
        { result: 'fortune',        chance: 0.20, desc: "The hot dog was magnificent. Worth every second. Composure +3." },
        { result: 'stroke_penalty', chance: 0.40, desc: "Slow play. Worth it." },
        { result: 'illness',        chance: 0.20, desc: "The hot dog was not magnificent." },
        { result: 'composure_up',   chance: 0.20, desc: "The hot dog was fine. Adequate. The problem is solved." }
      ]}
    ], danger: false
  },
  {
    id: "smell_aftershave", triggerChance: 0.09,
    channel: "SMELL",
    header: "👃 SOMEONE IS WEARING AN AFTERSHAVE YOU RECOGNISE",
    text: `Your father. Your first coach. An ex-partner. Someone from the past who is not here. The olfactory system does not understand time. You are briefly somewhere else entirely.`,
    isItemEvent: true,
    choices: [
      { label: "Let the memory pass — return to the present", outcomes: [
        { result: 'fortune',        chance: 0.30, desc: "The memory passed and left something useful behind." },
        { result: 'composure_loss', chance: 0.40, desc: "It didn't fully pass." },
        { result: 'nothing',        chance: 0.30 }
      ]},
      { label: "Stay in the memory — briefly", outcomes: [
        { result: 'fortune',        chance: 0.40, desc: "The person in the memory would have loved this. Play for them." },
        { result: 'composure_loss', chance: 0.40, desc: "You stayed too long." },
        { result: 'skill_up',       chance: 0.20, desc: "Their voice came back. Something specific and correct." }
      ]},
      { label: "Locate the source — who is wearing this?", outcomes: [
        { result: 'composure_loss', chance: 0.60, desc: "It was nobody from your past. A stranger. The gap between expectation and reality was significant." },
        { result: 'fortune',        chance: 0.20 },
        { result: 'nothing',        chance: 0.20 }
      ]}
    ], danger: false
  },
  {
    id: "smell_petrol", triggerChance: 0.07,
    channel: "SMELL",
    header: "👃 YOU CAN SMELL PETROL",
    text: `On a golf course. No obvious source. The greenkeeper's machinery is 400 yards away. The marshal's buggy passed three minutes ago. The smell is here. It is specifically here.`,
    isItemEvent: true,
    choices: [
      { label: "Note it and continue", outcomes: [
        { result: 'nothing',        chance: 0.50 },
        { result: 'composure_loss', chance: 0.30, desc: "The not-knowing is worse than knowing." },
        { result: 'death',          chance: 0.20, death_type: 'greenkeeper', desc: "There was a reason for the petrol smell." }
      ]},
      { label: "Move away from the area quickly", outcomes: [
        { result: 'nothing',        chance: 0.70 },
        { result: 'fortune',        chance: 0.30, desc: "You moved. Nothing happened. The relief was enormous." }
      ]},
      { label: "Investigate — where is it coming from?", outcomes: [
        { result: 'nothing',        chance: 0.40, desc: "A small spill from the buggy. Nothing more." },
        { result: 'stroke_penalty', chance: 0.30, desc: "Slow play. The investigation took time." },
        { result: 'fortune',        chance: 0.20, desc: "The investigation revealed something unrelated but useful." },
        { result: 'death',          chance: 0.10, death_type: 'greenkeeper' }
      ]}
    ], danger: false
  },
  {
    id: "smell_sunscreen", triggerChance: 0.08,
    channel: "SMELL",
    header: "👃 THE SMELL OF SUNSCREEN FROM THE GALLERY",
    text: `Coconut. It's a cool, overcast day in Scotland. Someone in the front row has applied factor 50. They are not wrong to do this but you are now in Ibiza.`,
    isItemEvent: true,
    choices: [
      { label: "Lean into it — play with warmth", outcomes: [
        { result: 'fortune',        chance: 0.40, desc: "The warmth was real. The birdie was also real." },
        { result: 'nothing',        chance: 0.40 },
        { result: 'composure_loss', chance: 0.20, desc: "The warmth was not appropriate to this situation." }
      ]},
      { label: "Ignore it — you are in Scotland", outcomes: [
        { result: 'nothing',        chance: 0.70 },
        { result: 'composure_loss', chance: 0.30, desc: "You are now thinking about Ibiza. You have not been to Ibiza." }
      ]}
    ], danger: false
  },

  // ── TASTE ──
  {
    id: "taste_borrowed_tee", triggerChance: 0.07,
    channel: "TASTE",
    header: "👅 YOU HAVE ACCIDENTALLY PUT A BORROWED TEE IN YOUR MOUTH",
    text: `Habit. Pre-shot routine. You put it between your teeth without thinking. Then you thought about whose tee it was. The thinking has not helped.`,
    isItemEvent: true,
    choices: [
      { label: "Remove it immediately — reset the routine", outcomes: [
        { result: 'composure_loss', chance: 0.40, desc: "The routine is now broken and you know why." },
        { result: 'nothing',        chance: 0.40 },
        { result: 'fortune',        chance: 0.20, desc: "The break in routine was the break in pattern you needed." }
      ]},
      { label: "Continue the routine — you're committed now", outcomes: [
        { result: 'nothing',        chance: 0.30 },
        { result: 'illness',        chance: 0.40, desc: "Something about the tee. The caddy's face when you showed him suggests it was the tee." },
        { result: 'fortune',        chance: 0.30, desc: "You committed fully to the routine and the shot. The tee was fine." }
      ]}
    ], danger: false
  },
  {
    id: "taste_sea_air", triggerChance: 0.10,
    channel: "TASTE",
    header: "👅 THE SEA AIR HAS BECOME VERY PRESENT",
    text: `Turnberry. Carnoustie. Muirfield. The sea is there and now you can taste it — salt, iodine, the particular mineral quality of Scottish coastal air that either focuses people or makes them want to sit down.`,
    isItemEvent: true,
    tournament_only_courses: ["turnberry","carnoustie","muirfield"],
    choices: [
      { label: "Breathe it in — this is golf", outcomes: [
        { result: 'fortune',        chance: 0.40, desc: "The sea was with you." },
        { result: 'composure_up',   chance: 0.40, desc: "Composure +2. The coast." },
        { result: 'composure_loss', chance: 0.20, desc: "The coast suggested the scale of things. Briefly too large." }
      ]},
      { label: "Focus on the shot — the sea is not playing", outcomes: [
        { result: 'nothing',        chance: 0.50 },
        { result: 'fortune',        chance: 0.30 },
        { result: 'composure_loss', chance: 0.20 }
      ]}
    ], danger: false
  },
  {
    id: "taste_blood", triggerChance: 0.05,
    channel: "TASTE",
    header: "👅 YOU CAN TASTE BLOOD",
    text: `Bitten your cheek. Lip. Something. No obvious cause. Just the copper. Unmistakable. Your caddy hasn't noticed. The shot is still waiting.`,
    isItemEvent: true,
    choices: [
      { label: "Ignore it — play through", outcomes: [
        { result: 'nothing',        chance: 0.40 },
        { result: 'anger',          chance: 0.30, desc: "The blood activated something primitive." },
        { result: 'fortune',        chance: 0.30, desc: "The copper taste cut through everything. Pure signal." }
      ]},
      { label: "Investigate — something is wrong", outcomes: [
        { result: 'composure_loss', chance: 0.50 },
        { result: 'nothing',        chance: 0.30, desc: "Minor. Nothing. You are fine." },
        { result: 'illness',        chance: 0.20 }
      ]}
    ], danger: false
  },

  // ── FEEL / GET FELT ──
  {
    id: "feel_wind_on_neck", triggerChance: 0.10,
    channel: "FEEL",
    header: "🤚 A COLD WIND ON THE BACK OF YOUR NECK AT ADDRESS",
    text: `Sudden. Specific. Coming from behind you. The flag was not moving before you addressed the ball. It is moving now. Your caddy is watching the flag with an expression you cannot interpret.`,
    isItemEvent: true,
    choices: [
      { label: "Step away — the wind has changed", outcomes: [
        { result: 'nothing',        chance: 0.50, desc: "It settled. New read. Proceed." },
        { result: 'fortune',        chance: 0.30, desc: "The wind change revealed the correct line." },
        { result: 'stroke_penalty', chance: 0.20, desc: "Slow play." }
      ]},
      { label: "Play the original shot — commit", outcomes: [
        { result: 'threshold_up',   chance: 0.40, desc: "The wind was real and it mattered." },
        { result: 'nothing',        chance: 0.30 },
        { result: 'fortune',        chance: 0.30, desc: "The wind changed back. The read was right." }
      ]},
      { label: "Ask the caddy what he's seeing", outcomes: [
        { result: 'fortune',        chance: 0.40, desc: "He'd already switched clubs. He was waiting for you." },
        { result: 'composure_loss', chance: 0.30, desc: "He wasn't sure either. This was the wrong answer." },
        { result: 'nothing',        chance: 0.30 }
      ]}
    ], danger: false
  },
  {
    id: "feel_caddy_elbow", triggerChance: 0.07,
    channel: "FEEL",
    header: "🤚 THE CADDY'S ELBOW — MID-BACKSWING",
    text: `He was handing you something. The timing was wrong. Contact was made. Clean, accidental, unintentional. You are both pretending it didn't happen.`,
    isItemEvent: true,
    choices: [
      { label: "Continue — this didn't happen", outcomes: [
        { result: 'nothing',        chance: 0.40 },
        { result: 'threshold_up',   chance: 0.40, desc: "It happened. The body registered it." },
        { result: 'fortune',        chance: 0.20, desc: "The interruption was a reset. Accidentally optimal." }
      ]},
      { label: "Step away — acknowledge, reset", outcomes: [
        { result: 'composure_loss', chance: 0.30, desc: "The acknowledgment made it real." },
        { result: 'nothing',        chance: 0.50 },
        { result: 'fortune',        chance: 0.20 }
      ]},
      { label: "Look at the caddy", outcomes: [
        { result: 'nothing',        chance: 0.40, desc: "He's looking at a tree. This is handled." },
        { result: 'anger',          chance: 0.30, desc: "He's also looking at you. There's a conversation happening silently." },
        { result: 'composure_up',   chance: 0.30, desc: "He mouthed 'sorry'. It was enough." }
      ]}
    ], danger: false
  },
  {
    id: "feel_child_hand", triggerChance: 0.05,
    channel: "FEEL",
    header: "🤚 A CHILD HAS GRABBED YOUR HAND",
    text: `Front row. Small hand. Complete confidence. They're not asking for an autograph — they're just holding your hand. The gallery has noticed. You have a shot to play.`,
    isItemEvent: true,
    choices: [
      { label: "Gently free your hand and acknowledge the child", outcomes: [
        { result: 'crowd_cheer',    chance: 0.60 },
        { result: 'fortune',        chance: 0.30 },
        { result: 'composure_loss', chance: 0.10, desc: "The child looked sad. You're thinking about it." }
      ]},
      { label: "Play one-handed — the child stays", outcomes: [
        { result: 'threshold_up',   chance: 0.50, desc: "This was not a good idea technically." },
        { result: 'crowd_cheer',    chance: 0.40, desc: "The gallery lost their minds. The shot was fine." },
        { result: 'fortune',        chance: 0.10 }
      ]},
      { label: "Sign something for the child first — then play", outcomes: [
        { result: 'stroke_penalty', chance: 0.30, desc: "Slow play." },
        { result: 'fortune',        chance: 0.40, desc: "The gallery was completely with you for the next three holes." },
        { result: 'crowd_cheer',    chance: 0.30 }
      ]}
    ], danger: false
  },
  {
    id: "feel_something_in_rough", triggerChance: 0.08,
    channel: "FEEL",
    hasImage: true,
    header: "🤚 SOMETHING IN THE ROUGH BRUSHED YOUR LEG",
    text: `You were walking through rough to your ball. Something made contact with your lower leg. Fast. Gone. You looked down. Nothing visible. The caddy was looking the other way.`,
    isItemEvent: true,
    choices: [
      { label: "Continue — it was nothing", outcomes: [
        { result: 'nothing',        chance: 0.50 },
        { result: 'composure_loss', chance: 0.30, desc: "It was nothing. But you're checking every step now." },
        { result: 'death',          chance: 0.05, death_type: 'adder', desc: "It was not nothing." },
        { result: 'fortune',        chance: 0.15 }
      ]},
      { label: "Stop and look carefully before proceeding", outcomes: [
        { result: 'nothing',        chance: 0.60, desc: "Grass. Just grass. Probably grass." },
        { result: 'composure_loss', chance: 0.20, desc: "You looked carefully. You found something. You wish you hadn't looked carefully." },
        { result: 'fortune',        chance: 0.20, desc: "You found your provisional ball from the 6th. Useful." }
      ]},
      { label: "Tell the caddy — loudly", outcomes: [
        { result: 'nothing',        chance: 0.40 },
        { result: 'composure_loss', chance: 0.30, desc: "The caddy made a noise that was not reassuring." },
        { result: 'anger',          chance: 0.20, desc: "The caddy said 'probably fine' in a way that wasn't." },
        { result: 'fortune',        chance: 0.10 }
      ]}
    ], danger: false
  },
  {
    id: "feel_blister", triggerChance: 0.08,
    channel: "FEEL",
    header: "🤚 A BLISTER HAS ANNOUNCED ITSELF",
    text: `Right hand. Grip hand. It's been building since the 5th and has now decided this is the moment. Thirteen holes of golf remaining. The caddy has plasters in the bag — probably. You've never asked.`,
    isItemEvent: true,
    choices: [
      { label: "Play through — it's fine", outcomes: [
        { result: 'nothing',        chance: 0.40 },
        { result: 'threshold_up',   chance: 0.40, desc: "It's not fine. The grip has shifted." },
        { result: 'composure_loss', chance: 0.20 }
      ]},
      { label: "Ask the caddy for a plaster", outcomes: [
        { result: 'fortune',        chance: 0.30, desc: "He had one. The right size. Composure restored." },
        { result: 'lost_accessory', chance: 0.30, desc: "He had one. Application disturbed something in the bag." },
        { result: 'stroke_penalty', chance: 0.20, desc: "Slow play. The plaster took time." },
        { result: 'nothing',        chance: 0.20, desc: "He had one. The plaster worked. This is manageable now." }
      ]},
      { label: "Retape the grip entirely", outcomes: [
        { result: 'skill_up',       chance: 0.30, desc: "Fresh tape. The grip feels right for two holes." },
        { result: 'stroke_penalty', chance: 0.50, desc: "Slow play. The retaping took the full allotted time plus thirty seconds." },
        { result: 'composure_up',   chance: 0.20, desc: "The ritual of retaping was the reset you needed." }
      ]}
    ], danger: false
  },

  // ── 6TH SENSE ──
  {
    id: "sixth_deja_vu", triggerChance: 0.06,
    channel: "SIXTH_SENSE",
    header: "🔮 DÉJÀ VU — YOU HAVE PLAYED THIS EXACT SHOT BEFORE",
    text: `Not similar. This exact shot. This exact light, this exact lie, this exact distance, this exact crowd noise. You know what you did last time. You're not sure if that's the same as knowing what to do now.`,
    isItemEvent: true,
    choices: [
      { label: "Play the same shot as last time", outcomes: [
        { result: 'fortune',        chance: 0.50, desc: "The memory was accurate and the shot was right. Déjà vu as instruction manual." },
        { result: 'threshold_up',   chance: 0.30, desc: "The memory was accurate. The shot was wrong last time too." },
        { result: 'composure_loss', chance: 0.20, desc: "The memory was wrong. You've confused two shots." }
      ]},
      { label: "Play the opposite of what you remember doing", outcomes: [
        { result: 'fortune',        chance: 0.40, desc: "The correction of the remembered mistake was the correct instinct." },
        { result: 'threshold_up',   chance: 0.40, desc: "The opposite was also wrong." },
        { result: 'nothing',        chance: 0.20 }
      ]},
      { label: "Ignore the déjà vu — play fresh", outcomes: [
        { result: 'nothing',        chance: 0.50 },
        { result: 'fortune',        chance: 0.30 },
        { result: 'composure_loss', chance: 0.20, desc: "The déjà vu didn't go away." }
      ]}
    ], danger: false
  },
  {
    id: "sixth_certainty", triggerChance: 0.05,
    channel: "SIXTH_SENSE",
    header: "🔮 ABSOLUTE CERTAINTY — YOU KNOW THIS IS GOING IN",
    text: `Before you've struck it. Complete, total, physical certainty. Not confidence — certainty. The kind that is either correct or humiliating. There is no third option.`,
    isItemEvent: true,
    choices: [
      { label: "Commit fully — trust it", outcomes: [
        { result: 'fortune',        chance: 0.60, desc: "It went in. The certainty was correct. The gallery." },
        { result: 'threshold_down', chance: 0.20, desc: "The certainty was correct. Something aligned." },
        { result: 'composure_loss', chance: 0.20, desc: "The certainty was wrong. This is a specific kind of wrong." }
      ]},
      { label: "Doubt it — recalibrate", outcomes: [
        { result: 'nothing',        chance: 0.50 },
        { result: 'composure_loss', chance: 0.30, desc: "You recalibrated away from the correct answer." },
        { result: 'fortune',        chance: 0.20 }
      ]}
    ], danger: false
  },
  {
    id: "sixth_watched", triggerChance: 0.07,
    channel: "SIXTH_SENSE",
    hasImage: true,
    header: "🔮 YOU ARE BEING WATCHED BY SOMEONE WHO ISN'T THERE",
    text: `Your old coach. A parent. Someone who shaped your game and is no longer present in the world. The feeling is not unpleasant. It is specific. They are watching from where they always watched — slightly left of the fairway, three back.`,
    isItemEvent: true,
    choices: [
      { label: "Play for them", outcomes: [
        { result: 'fortune',        chance: 0.50, desc: "The shot was for them. They would have approved." },
        { result: 'crowd_cheer',    chance: 0.30, desc: "Something in your demeanour reached the gallery." },
        { result: 'composure_loss', chance: 0.20, desc: "You looked toward where they were watching. Nothing there. You knew nothing was there." }
      ]},
      { label: "Stay in the technical present — just golf", outcomes: [
        { result: 'nothing',        chance: 0.40 },
        { result: 'fortune',        chance: 0.40 },
        { result: 'composure_loss', chance: 0.20 }
      ]},
      { label: "Acknowledge it briefly — then play", outcomes: [
        { result: 'fortune',        chance: 0.40 },
        { result: 'composure_up',   chance: 0.40, desc: "The acknowledgment was sufficient. The feeling settled." },
        { result: 'composure_loss', chance: 0.20 }
      ]}
    ], danger: false
  },
  {
    id: "sixth_bad_feeling", triggerChance: 0.07,
    channel: "SIXTH_SENSE",
    header: "🔮 SOMETHING IS WRONG AND YOU DON'T KNOW WHAT",
    text: `Address the ball. Everything looks correct. Everything is correct. And yet. Something is wrong. The body knows something the brain hasn't processed yet. The caddy is fine. The lie is fine. The wind is manageable. Something is wrong.`,
    isItemEvent: true,
    choices: [
      { label: "Trust the feeling — step away", outcomes: [
        { result: 'nothing',        chance: 0.30, desc: "Nothing was wrong. The feeling was wrong." },
        { result: 'fortune',        chance: 0.40, desc: "Something was wrong. You avoided it by stepping away." },
        { result: 'stroke_penalty', chance: 0.30, desc: "Slow play. Nothing was wrong. This time." }
      ]},
      { label: "Override it — play the shot", outcomes: [
        { result: 'nothing',        chance: 0.40 },
        { result: 'threshold_up',   chance: 0.30, desc: "Something was wrong." },
        { result: 'fortune',        chance: 0.20, desc: "Nothing was wrong. Trusting the override." },
        { result: 'death',          chance: 0.10, death_type: 'bunker_rake', desc: "Something was wrong." }
      ]}
    ], danger: false
  },

  // ── UMAMI ──
  // UMAMI does not appear in the normal event pool.
  // It fires from checkUmami() called in advancePhase() when:
  //   - composure >= 7
  //   - last shot quality was 'solid' or 'miracle'
  //   - Math.random() < 0.04 (4% chance per qualifying shot)
  // It is never a choice event — it simply happens and is reported.
  {
    id: "umami_moment", triggerChance: 0.0, // controlled externally
    channel: "UMAMI",
    header: "✨ UMAMI",
    text: `The shot before this one was exactly right. Not spectacular — right. The weight, the contact, the flight. The sound. You knew it before you looked up. The caddy knew it. The ball knew it. This happens perhaps once in a tournament.`,
    isItemEvent: true,
    choices: [
      { label: "Carry this forward", outcomes: [
        { result: 'fortune',        chance: 1.0 },
      ]}
    ],
    // Note: applyOutcome also runs checkUmamiBonus() which sets:
    // G.fortuneActive = true, G.tempThresholdMod = -2, G.tempThresholdHoles = 1
    danger: false
  },
  // ── CORE EVENTS ──
  {id:"first_tee_announce", triggerChance:0.9, holeIdx:0,
   header:"🎙️ THE SCORER IS ANNOUNCING YOUR NAME",
   text:"Your name. Your country. The gallery numbers in the thousands. Something has happened in your stomach.",
   choices:[{label:"Breathe through it",cost:0},{label:"Acknowledge the crowd",cost:0},{label:"Take too long at address",cost:1},{label:"Practice swing goes wrong",cost:2}], danger:false},
  {id:"wind_gusts", triggerChance:0.3,
   header:"💨 THE WIND HAS CHANGED DIRECTION",
   text:"Your caddy called it offshore. It is now crosswind. The flag is moving in a way that requires recalculation.",
   choices:[{label:"Take one more club, aim left",cost:0},{label:"Stick with original choice",cost:1},{label:"Ask caddy — he hesitates",cost:1},{label:"Decide entirely by feel",cost:2}], danger:false},
  {id:"gallery_distraction", triggerChance:0.2,
   header:"📸 A CAMERA CLICKED MID-BACKSWING",
   text:"Right at the top. Clear as a rifle shot. You've already started down.",
   choices:[{label:"Abort — step away and reset",cost:1},{label:"Commit to the shot in motion",cost:0},{label:"Finish and glare at the gallery",cost:2},{label:"Finish and say nothing",cost:0}], danger:false},
  {id:"wasp", triggerChance:0.18,
   header:"🐝 A WASP HAS LANDED ON YOUR BALL",
   text:"It is making itself comfortable. Your playing partner has noticed. The referee is approaching with the expression of a man who has seen this before.",
   choices:[{label:"Wait it out patiently",cost:0},{label:"Blow gently",cost:1},{label:"Swat — decisively",cost:2},{label:"Play through it. It's a wasp.",cost:3}], danger:false},
  {id:"fox", triggerChance:0.12,
   header:"🦊 A FOX HAS SAT DOWN IN YOUR FAIRWAY",
   text:"Centre of your intended line. It appears comfortable. It is looking at you with mild contempt.",
   choices:[{label:"Walk around it with dignity",cost:1},{label:"Stare it down",cost:0},{label:"Make a sudden noise",cost:2},{label:"Ask the referee",cost:1}], danger:false},
  {id:"historic_moment", triggerChance:0.55,
   header:"📡 THE TV COMMENTARY HAS MENTIONED THE HISTORICAL VERSION",
   text:"The broadcast is referencing what happened here. The gallery knows the story. You are standing in the exact spot where history happened or didn't.",
   choices:[{label:"Use the history as fuel",cost:0},{label:"Try to forget it completely",cost:0},{label:"Acknowledge it to your caddy",cost:0},{label:"Think about it too long",cost:2}], danger:false},
  {id:"gallery_enormous", triggerChance:0.4,
   header:"👥 THE GALLERY IS THE LARGEST YOU'VE SEEN",
   text:"They came for the history. They're getting it regardless of what you do.",
   choices:[{label:"Feed off the energy",cost:0},{label:"Narrow focus to the ball",cost:0},{label:"Make eye contact with someone who looks like your father",cost:2},{label:"Tip your cap",cost:1}], danger:false},
  {id:"vandervelde_18th", triggerChance:0.9, holeIdx:2, tournamentOnly:["vandervelde_1999"],
   header:"🏌️ YOU ARE ON THE 18TH TEE — THREE SHOTS CLEAR",
   text:"You need a double bogey to win The Open Championship. The intelligent play is a 3-iron. The gallery are all thinking: just use the 3-iron. Your driver is in your hand. The caddy hasn't said anything.",
   danger:true,
   choices:[{label:"3-iron — take the double bogey",cost:0},{label:"Driver — same as all week",cost:2},{label:"Ask the caddy directly",cost:0},{label:"Driver — you've been hitting it well",cost:3}]},
  {id:"chip_from_rough", triggerChance:0.6, holeIdx:2, tournamentOnly:["tiger_2005"],
   header:"⛳ YOU ARE IN THE ROUGH ABOVE THE 16TH PIN",
   text:"The chip has to land precisely on the slope and funnel toward the hole. Too hard — off the green. Too soft — doesn't reach. There is, historically, a third option.",
   danger:false,
   choices:[{label:"Chip conservatively — guarantee par",cost:0},{label:"Play the slope — aim for the flag line",cost:0},{label:"The exactly correct pace and line",cost:0},{label:"Go firm at the hole",cost:1}]},
  {id:"trevino_moment", triggerChance:0.8, holeIdx:2, tournamentOnly:["muirfield_1972"],
   header:"😐 TREVINO'S BALL IS ROLLING TOWARD THE FLAG",
   text:"His chip from off the green is rolling. It looks like it's going past. Then it hits the flagstick. Then it drops. The gallery makes a sound you've never heard before. Jacklin is watching.",
   danger:false,
   choices:[{label:"Stay focused — putt your own ball",cost:0},{label:"Wait for the crowd noise to subside",cost:1},{label:"Look at the scoreboard",cost:2},{label:"Try to forget what you just saw",cost:1}]},
  {id:"false_security", triggerChance:0.6, holeIdx:0, tournamentOnly:["vandervelde_1999"],
   header:"😊 YOU ARE PLAYING SOME OF THE BEST GOLF OF YOUR LIFE",
   text:"Three shots clear with three to play. The leaderboard shows your name at the top. The commentators are starting to call you champion. Your caddy is smiling.",
   danger:false,
   choices:[{label:"Stay in the process — one shot at a time",cost:0},{label:"Enjoy this moment",cost:0},{label:"Allow yourself to think about the trophy",cost:2},{label:"Start mentally writing your speech",cost:3}]},
  {id:"crowd_hostile", triggerChance:0.5, tournamentOnly:["medinah_2012"],
   header:"🇺🇸 THE AMERICAN CROWD IS VERY LOUD",
   text:"Medinah is a home crowd for the USA and they are making themselves known. Someone near the tee has shouted something. Everyone heard it.",
   danger:false,
   choices:[{label:"Channel it — use it as motivation",cost:0},{label:"Ignore it completely",cost:0},{label:"Look toward the sound",cost:1},{label:"Respond — with your golf",cost:0}]}
];

if (typeof module !== 'undefined') module.exports = { EVENTS };
