// src/data/pub-crawl-scenes.js
// Scene data for Friday Pub Crawl Misadventure (BL-110).
// 8 pub locations, 4 beats each, 4 choices per beat.
// Pressure costs: 1 (sensible) → 4 (catastrophic).

const PUB_CRAWL_SCENES = [
  {
    id: 'rising-sun-basingstoke',
    name: 'The Rising Sun, Chapel Hill',
    location: 'Basingstoke',
    description: 'Known terrain. Personal history. Dave is behind the bar. You have context here, which means you also have expectations — and expectations are pressure waiting to happen.',
    worstOutcome: 'The landlord Dave — who has known you since 2003 — bans you. By name. In front of everyone.',
    beats: [
      {
        situation: 'Someone is in your usual seat. They don\'t know it\'s your usual seat.',
        choices: [
          { id: 'a', label: 'Politely check if the seat is taken', pressure: 1 },
          { id: 'b', label: 'Head to the bar first, stake claim later', pressure: 2 },
          { id: 'c', label: 'Sit at the edge and transmit signals', pressure: 3 },
          { id: 'd', label: 'Announce to the room that this is your seat', pressure: 4 },
        ],
      },
      {
        situation: 'At the bar. Dave squints at you. It could mean anything.',
        choices: [
          { id: 'a', label: 'Usual, Dave. He appreciates this.', pressure: 1 },
          { id: 'b', label: 'Ask for something they might not have', pressure: 2 },
          { id: 'c', label: 'Pay by card for a £3 drink', pressure: 3 },
          { id: 'd', label: 'Ask if the quiz is still on — it hasn\'t been on for two years', pressure: 4 },
        ],
      },
      {
        situation: 'Someone from school appears. You haven\'t seen them since 2004.',
        choices: [
          { id: 'a', label: 'Acknowledge warmly, keep it brief', pressure: 1 },
          { id: 'b', label: 'Pretend you haven\'t seen them', pressure: 2 },
          { id: 'c', label: 'Wave them over to the table', pressure: 3 },
          { id: 'd', label: 'Use their old nickname. Loudly.', pressure: 4 },
        ],
      },
      {
        situation: 'Last orders. It\'s your round.',
        choices: [
          { id: 'a', label: 'Simple round — everyone gets what they had', pressure: 1 },
          { id: 'b', label: 'One cocktail request. You deal with it.', pressure: 2 },
          { id: 'c', label: 'Someone wants shots. You enable this.', pressure: 3 },
          { id: 'd', label: 'Request a lock-in with complete confidence', pressure: 4 },
        ],
      },
    ],
  },

  {
    id: 'scotia-bar-glasgow',
    name: 'The Scotia Bar, Stockwell Street',
    location: 'Glasgow',
    description: 'Established 1792. The oldest pub in Glasgow. Something here predates you. Something here may predate the pub. The barman has seen everything. So has the man at the end of the bar who hasn\'t moved.',
    worstOutcome: 'The barman asks you to leave. Not unkindly. He says "some people aren\'t welcome here." You\'re not entirely sure if he means you or the other one.',
    beats: [
      {
        situation: 'You walk in. Something feels off. The air is different.',
        choices: [
          { id: 'a', label: 'Find a seat, order a drink, say nothing', pressure: 1 },
          { id: 'b', label: 'Ask the barman if this place has history', pressure: 2 },
          { id: 'c', label: 'Pull out your phone to look up the address', pressure: 3 },
          { id: 'd', label: 'Say "it\'s a bit cold in here" to no one in particular', pressure: 4 },
        ],
      },
      {
        situation: 'A man at the bar hasn\'t moved since you arrived. He\'s been there a while.',
        choices: [
          { id: 'a', label: 'Ignore him. This is Glasgow. Many people are still.', pressure: 1 },
          { id: 'b', label: 'Offer to buy him a drink', pressure: 2 },
          { id: 'c', label: 'Ask him directly if he\'s alright', pressure: 3 },
          { id: 'd', label: 'Ask the barman who that man is', pressure: 4 },
        ],
      },
      {
        situation: 'The barman brings your round but doesn\'t mention the charge.',
        choices: [
          { id: 'a', label: 'Leave what feels right on the bar', pressure: 1 },
          { id: 'b', label: 'Ask for a receipt', pressure: 2 },
          { id: 'c', label: 'Pay by card', pressure: 3 },
          { id: 'd', label: 'Ask if the round was complimentary. It wasn\'t.', pressure: 4 },
        ],
      },
      {
        situation: 'The man at the bar is no longer there. You didn\'t see him leave.',
        choices: [
          { id: 'a', label: 'Leave promptly, saying nothing', pressure: 1 },
          { id: 'b', label: 'Mention this to someone — calmly', pressure: 2 },
          { id: 'c', label: 'Ask the barman where he went', pressure: 3 },
          { id: 'd', label: 'Ask for a photo of the bar for Instagram', pressure: 4 },
        ],
      },
    ],
  },

  {
    id: 'horseshoe-bar-glasgow',
    name: 'The Horseshoe Bar, Drury Street',
    location: 'Glasgow',
    description: 'Established 1884. The longest continuous bar in Britain. This is not a metaphor. It is 104 feet of operational frontage. You will need a strategy.',
    worstOutcome: 'You\'re still at the bar. You\'ve been there 45 minutes. You\'ve ordered three times but the drinks keep being for other people. This is the longest bar in Britain. This is how it ends.',
    beats: [
      {
        situation: 'The bar stretches in both directions. You need to position yourself.',
        choices: [
          { id: 'a', label: 'Find a tactical position with clear sightlines to staff', pressure: 1 },
          { id: 'b', label: 'Head to the nearest section', pressure: 2 },
          { id: 'c', label: 'Walk the full length to assess the terrain', pressure: 3 },
          { id: 'd', label: 'Stand in the middle and turn slowly', pressure: 4 },
        ],
      },
      {
        situation: 'Three bartenders. One is clearly faster than the others.',
        choices: [
          { id: 'a', label: 'Wait for the fast one', pressure: 1 },
          { id: 'b', label: 'Order from whoever reaches you first', pressure: 2 },
          { id: 'c', label: 'Try to make eye contact with all three simultaneously', pressure: 3 },
          { id: 'd', label: 'Call out "excuse me" to the room', pressure: 4 },
        ],
      },
      {
        situation: 'Someone ahead of you has ordered a round of nine. You\'re waiting.',
        choices: [
          { id: 'a', label: 'Wait. This is the cost of the Horseshoe.', pressure: 1 },
          { id: 'b', label: 'Signal you only need two drinks', pressure: 2 },
          { id: 'c', label: 'Offer to help carry', pressure: 3 },
          { id: 'd', label: 'Audibly sigh', pressure: 4 },
        ],
      },
      {
        situation: 'You have your drinks. The table you picked is now occupied.',
        choices: [
          { id: 'a', label: 'Find another table — there are many', pressure: 1 },
          { id: 'b', label: 'Ask if you can share', pressure: 2 },
          { id: 'c', label: 'Stand with the drinks making pointed eye contact', pressure: 3 },
          { id: 'd', label: 'Announce you were "just at that table"', pressure: 4 },
        ],
      },
    ],
  },

  {
    id: 'drunken-duck-lake-district',
    name: 'The Drunken Duck, Barngates',
    location: 'Lake District',
    description: 'Everyone here is having a lovely time. This is, somehow, unsettling. The beer is good, the views are spectacular, there are actual ducks. You are the highest-pressure thing in the room.',
    worstOutcome: 'You ask about buying one of the ducks. One at first. Then, after some wine, the whole pond. The landlord is polite about it. You are asked to leave while still negotiating the price of a duck.',
    beats: [
      {
        situation: 'Everyone is happy. Genuinely happy. This requires a response.',
        choices: [
          { id: 'a', label: 'Settle in, order something local', pressure: 1 },
          { id: 'b', label: 'Ask what\'s good on tap — they explain each one at length', pressure: 2 },
          { id: 'c', label: 'Ask if there\'s a beer garden — there is, it\'s spectacular', pressure: 3 },
          { id: 'd', label: 'Take a photo of the ducks and show someone who didn\'t ask', pressure: 4 },
        ],
      },
      {
        situation: 'A couple nearby starts talking to you. They\'re on holiday. They\'re happy about it.',
        choices: [
          { id: 'a', label: 'Chat briefly — they\'re lovely', pressure: 1 },
          { id: 'b', label: 'Tell them about the area — you\'ve done some reading', pressure: 2 },
          { id: 'c', label: 'Accept their walking recommendation without asking for it', pressure: 3 },
          { id: 'd', label: 'Ask if they\'re here for the beer or the views, then push them on the answer', pressure: 4 },
        ],
      },
      {
        situation: 'You\'ve ordered a second. The landlord asks if you\'re staying for food.',
        choices: [
          { id: 'a', label: 'Yes. The menu is seasonal and impressive.', pressure: 1 },
          { id: 'b', label: 'Maybe later — he accepts this graciously', pressure: 2 },
          { id: 'c', label: 'Ask what time the kitchen closes', pressure: 3 },
          { id: 'd', label: 'Ask if they can do something not on the menu', pressure: 4 },
        ],
      },
      {
        situation: 'It\'s time to go. This was, genuinely, a good pub.',
        choices: [
          { id: 'a', label: 'Leave graciously with a good tip', pressure: 1 },
          { id: 'b', label: 'Buy a round for the bar — it\'s that kind of night', pressure: 2 },
          { id: 'c', label: 'Ask about the ducks — their names, their history', pressure: 3 },
          { id: 'd', label: 'Ask if you can buy one of the ducks', pressure: 4 },
        ],
      },
    ],
  },

  {
    id: 'slug-lettuce-canary-wharf',
    name: 'Slug & Lettuce / Henry Addington',
    location: 'Canary Wharf',
    description: 'It\'s 6pm on a Thursday. Everyone is in a suit. Someone is explaining their Q3 performance to their phone at full volume. The bar is expensive. The prawn sandwiches are £14.',
    worstOutcome: 'You are escorted from the building by two men in lanyards. You\'re not sure exactly what you said. It was something about the prawn sandwiches. Roy Keane would be proud of you.',
    beats: [
      {
        situation: 'The bar is full of people in suits. You need a drink.',
        choices: [
          { id: 'a', label: 'Order whatever they have on tap', pressure: 1 },
          { id: 'b', label: 'Order craft beer — you know what you like', pressure: 2 },
          { id: 'c', label: 'Ask for the wine list', pressure: 3 },
          { id: 'd', label: 'Order a bottle of champagne and explain why', pressure: 4 },
        ],
      },
      {
        situation: 'Someone is talking loudly about their bonus. To their phone.',
        choices: [
          { id: 'a', label: 'Find somewhere else to stand', pressure: 1 },
          { id: 'b', label: 'Make eye contact with the barman — a moment of solidarity', pressure: 2 },
          { id: 'c', label: 'Join the peripheral conversation — you have opinions', pressure: 3 },
          { id: 'd', label: 'Ask — sincerely — what their role is', pressure: 4 },
        ],
      },
      {
        situation: 'A round is ordered. Someone produces a corporate card.',
        choices: [
          { id: 'a', label: 'Accept. That\'s how it works.', pressure: 1 },
          { id: 'b', label: 'Offer to get the next one — this is noted', pressure: 2 },
          { id: 'c', label: 'Ask if this is expenses — make a joke — it doesn\'t land', pressure: 3 },
          { id: 'd', label: 'Order something that wasn\'t on the round', pressure: 4 },
        ],
      },
      {
        situation: 'Someone suggests moving on to a bar with a DJ.',
        choices: [
          { id: 'a', label: 'Come along. This is fine.', pressure: 1 },
          { id: 'b', label: 'Politely decline — you have somewhere to be', pressure: 2 },
          { id: 'c', label: 'Suggest a better bar — they\'ve never heard of it', pressure: 3 },
          { id: 'd', label: 'Say "I\'ll come if we can go somewhere decent" out loud', pressure: 4 },
        ],
      },
    ],
  },

  {
    id: 'daves-bar-marbella',
    name: 'Dave\'s Bar',
    location: 'Marbella',
    description: 'It\'s a World Cup semi-final. The bar is at capacity. The screen is life. Everyone here has the same stake in the next 90 minutes. Some of them are better at managing it than others.',
    worstOutcome: 'You\'re found at 4am in a beach chair explaining the 4-4-2 to a stray dog. Dave\'s closed two hours ago. The dog leaves first.',
    beats: [
      {
        situation: 'It\'s the 89th minute. England are drawing. The bar is at capacity.',
        choices: [
          { id: 'a', label: 'Find a spot. Any spot.', pressure: 1 },
          { id: 'b', label: 'Get to the bar — you need a drink for this', pressure: 2 },
          { id: 'c', label: 'Stand at the back for a strategic overview', pressure: 3 },
          { id: 'd', label: 'Push to the front — the screen is life', pressure: 4 },
        ],
      },
      {
        situation: 'Penalty shootout. Someone next to you is making noise on every kick.',
        choices: [
          { id: 'a', label: 'Manage this internally', pressure: 1 },
          { id: 'b', label: 'The camaraderie is the point — join them', pressure: 2 },
          { id: 'c', label: 'Ask them to calm down — this fails immediately', pressure: 3 },
          { id: 'd', label: 'Start making noise yourself — it escalates', pressure: 4 },
        ],
      },
      {
        situation: 'It\'s over. The bar knows what happened.',
        choices: [
          { id: 'a', label: 'Accept the result with dignity', pressure: 1 },
          { id: 'b', label: 'One commiseration drink — everyone does this', pressure: 2 },
          { id: 'c', label: 'Stay for the analysis — Dave puts Sky Sports on', pressure: 3 },
          { id: 'd', label: 'Challenge someone\'s tactical assessment', pressure: 4 },
        ],
      },
      {
        situation: 'Last orders. Marbella continues outside.',
        choices: [
          { id: 'a', label: 'Head back to the hotel — sound decision', pressure: 1 },
          { id: 'b', label: 'One more. Just one.', pressure: 2 },
          { id: 'c', label: 'Agree to go to the next place', pressure: 3 },
          { id: 'd', label: 'Suggest the next place — as if it was your idea', pressure: 4 },
        ],
      },
    ],
  },

  {
    id: 'mcsorleys-nyc',
    name: 'McSorley\'s Old Ale House',
    location: 'New York City',
    description: 'Established 1854. Light or dark. That\'s the menu. That\'s all of it. The place has been here longer than most countries\' constitutions. The sawdust on the floor may be original.',
    worstOutcome: 'You ask for a cocktail. Not aggressively. Curiously. The barman puts down his cloth. Looks at you. Looks at the door. The door is opened for you. Light or dark. That was the choice.',
    beats: [
      {
        situation: 'A man arrives at your table. "Light or dark?" That\'s it.',
        choices: [
          { id: 'a', label: 'Light. This is correct.', pressure: 1 },
          { id: 'b', label: 'Dark. Also correct.', pressure: 1 },
          { id: 'c', label: 'Ask what the difference is — he waits', pressure: 3 },
          { id: 'd', label: 'Ask what else they have', pressure: 4 },
        ],
      },
      {
        situation: 'They serve in pairs. Two mugs arrive. This is the system.',
        choices: [
          { id: 'a', label: 'Accept the system', pressure: 1 },
          { id: 'b', label: 'Ask for one mug — this is attempted, it fails', pressure: 2 },
          { id: 'c', label: 'Pay for two, drink one — a donation to the tradition', pressure: 2 },
          { id: 'd', label: 'Try to order a third — the maths is against you', pressure: 4 },
        ],
      },
      {
        situation: 'The bar has been here since 1854. You feel this.',
        choices: [
          { id: 'a', label: 'Sit quietly — some things earn quiet', pressure: 1 },
          { id: 'b', label: 'Try to start a conversation with the barman', pressure: 2 },
          { id: 'c', label: 'Read the walls — there\'s a lot on them', pressure: 2 },
          { id: 'd', label: 'Ask to see the kitchen', pressure: 4 },
        ],
      },
      {
        situation: 'You\'ve been here long enough. Something has shifted.',
        choices: [
          { id: 'a', label: 'Leave respectfully — the city is outside', pressure: 1 },
          { id: 'b', label: 'Order one more round before you go', pressure: 2 },
          { id: 'c', label: 'Ask about the history — a specific question', pressure: 2 },
          { id: 'd', label: 'Ask if they have Wi-Fi', pressure: 4 },
        ],
      },
    ],
  },

  {
    id: 'hofbrau-oktoberfest',
    name: 'Hofbräu Tent, Oktoberfest',
    location: 'Munich',
    description: 'The tent seats 10,000 people. The beer comes in one-litre vessels. The band has been playing since 1810. Everything here operates at a scale that defeats personal strategy. Sun Tzu is rattled.',
    worstOutcome: 'You wake up on a bench. You are wearing lederhosen. You did not arrive in lederhosen. The tent is being cleaned around you. This is, statistically, how most legends begin.',
    beats: [
      {
        situation: 'The tent seats 10,000 people. You are one of them. For now.',
        choices: [
          { id: 'a', label: 'Find a table and secure it', pressure: 1 },
          { id: 'b', label: 'Head to the serving area immediately — priorities', pressure: 2 },
          { id: 'c', label: 'Take in the scale — one full rotation', pressure: 3 },
          { id: 'd', label: 'Try to find a table near the band', pressure: 4 },
        ],
      },
      {
        situation: 'A Maß arrives. One litre. The traditional vessel.',
        choices: [
          { id: 'a', label: 'Drink it — this is what it\'s for', pressure: 1 },
          { id: 'b', label: 'Pace yourself — the tent is a marathon', pressure: 1 },
          { id: 'c', label: 'Raise it in the traditional gesture — people respond', pressure: 2 },
          { id: 'd', label: 'Ask for a smaller glass', pressure: 4 },
        ],
      },
      {
        situation: 'The table has accumulated strangers. This is normal here.',
        choices: [
          { id: 'a', label: 'Accept it — strangers are guests at Oktoberfest', pressure: 1 },
          { id: 'b', label: 'Establish communication — most have German', pressure: 2 },
          { id: 'c', label: 'Join whatever is happening at the table', pressure: 2 },
          { id: 'd', label: 'Explain British pub culture to a Bavarian. At length.', pressure: 4 },
        ],
      },
      {
        situation: 'The evening has reached a critical juncture.',
        choices: [
          { id: 'a', label: 'Start making your way to the exit', pressure: 1 },
          { id: 'b', label: 'One more — the tent demands it', pressure: 2 },
          { id: 'c', label: 'Buy something from the merchandise stall', pressure: 3 },
          { id: 'd', label: 'Learn the song. All of it.', pressure: 4 },
        ],
      },
    ],
  },
];

const _pubCrawlScenesExports = { PUB_CRAWL_SCENES };

if (typeof window !== 'undefined') window.PubCrawlScenes = _pubCrawlScenesExports;
if (typeof module !== 'undefined') module.exports = _pubCrawlScenesExports;
