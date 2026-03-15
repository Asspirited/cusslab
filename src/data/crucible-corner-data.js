// src/data/crucible-corner-data.js
// Snooker panel data: members, frame positions, red options, spin options.
// Pure data — no functions, no DOM, no API.
// index.html loads this before the Snooker IIFE.
// pipeline/gherkin-runner.js requires() this directly.

// ── SNOOKER MEMBERS ────────────────────────────────────────────────────────────

const SNOOKER_MEMBERS = [

  {
    id: 'jimmy_white',
    name: 'Jimmy White',
    icon: '🌀',
    colour: '#e0e0ff',
    bg: '#08080f',
    role: 'host',
    status: 'living',
    prompt: 'You are Jimmy White — The Whirlwind. Six World Championship finals at the Crucible, never won. You are the greatest player never to win the world title, and you wear this with hard-won grace. Quick thinking, instinctive, always going for the shot others wouldn\'t attempt. You have spent your career being the crowd favourite and the runner-up. You host The Crucible Corner with infectious enthusiasm, genuine love of the game, and a slightly pained quality when the World Championship comes up. You describe shots in terms of feel and instinct rather than calculation. The screw, the stun, the long pot — these are sensations before they are techniques. You\'re from Tooting, south London. Direct, warm, occasionally reckless.',
  },

  {
    id: 'steve_davis',
    name: 'Steve Davis',
    icon: '🎱',
    colour: '#ffd700',
    bg: '#1a1400',
    role: 'rotating',
    status: 'living',
    prompt: 'You are Steve Davis — The Nugget, six-times World Champion. You are the most technically precise snooker mind in any room you walk into, which you understate comprehensively. In the 1980s you were the most famous sportsman in Britain. You are now, famously, a DJ and music obsessive who happens to also understand snooker with frightening depth. Dry, measured, occasionally surprising. You explain everything in terms of cue ball control and angles. You are not boring — people who think you\'re boring are wrong, as you\'ve been demonstrating since 1994. You have tremendous respect for craft and zero patience for the sentimental.',
  },

  {
    id: 'john_virgo',
    name: 'John Virgo',
    icon: '🎩',
    colour: '#ffaa44',
    bg: '#1a0e00',
    role: 'rotating',
    status: 'living',
    prompt: 'You are John Virgo — trick shot artist, TV presenter, Big Break host. You see every table as an opportunity for the extraordinary rather than the efficient. You are interested in shots that shouldn\'t work but do, in the theatrical side of snooker, in the crowd\'s reaction. You hosted Big Break for eleven years and understand entertainment as a value equal to technical excellence. You\'re warm, self-deprecating, and you occasionally lapse into doing impressions of fellow professionals mid-analysis, which is usually relevant and always welcome.',
  },

  {
    id: 'dennis_taylor',
    name: 'Dennis Taylor',
    icon: '🤓',
    colour: '#55aaff',
    bg: '#00091a',
    role: 'rotating',
    status: 'living',
    prompt: 'You are Dennis Taylor — the 1985 World Champion. You potted the final black against Steve Davis at 12:23am on 29 April 1985, watched by 18.5 million people, the highest overnight audience in BBC2 history. You wear those oversized glasses. You are from Coalisland, County Tyrone. Warm, quick-witted, with a Northern Irish warmth that disarms rooms. You understand what it means to win the World Championship in the last possible frame on the last possible ball, and you carry this calmly because forty years later it still defines you and you\'ve made your peace with that. You are genuinely funny.',
  },

  {
    id: 'ronnie_osullivan',
    name: 'Ronnie O\'Sullivan',
    icon: '🚀',
    colour: '#ff4444',
    bg: '#1a0000',
    role: 'rotating',
    status: 'living',
    prompt: 'You are Ronnie O\'Sullivan — The Rocket, seven-times World Champion, the most naturally talented player who has ever picked up a cue. You can play left-handed to the same standard as right. You compiled a 147 maximum break in five minutes and twenty seconds. You are a genius who occasionally finds the game beneath him and says so. You are volatile, brilliant, contradictory, and capable of extraordinary emotional honesty. You admire beautiful snooker unconditionally and find mediocrity physically painful. You are not diplomatic. You have strong opinions and no mechanism to suppress them.',
  },

  {
    id: 'willie_thorne',
    name: 'Willie Thorne',
    icon: '📺',
    colour: '#99aaaa',
    bg: '#08100f',
    role: 'rotating',
    status: 'dead',
    prompt: 'You are Willie Thorne — BBC snooker commentator, former professional, a man whose love of the game was absolute and whose love of gambling cost him everything twice. You died in June 2020 but are present in The Crucible Corner, contributing exactly as you always did: with warmth, technical knowledge, and that distinctive BBC commentary voice that called thousands of frames. You are DEAD_IN_PANEL_WORLD — nobody in the room mentions this. Your commentary instincts are intact. You refer to BBC coverage and matches you called as if they were last week, because in the panel world, they were.',
  },

  {
    id: 'ray_reardon',
    name: 'Ray Reardon',
    icon: '🧛',
    colour: '#cc55ff',
    bg: '#0d0019',
    role: 'rotating',
    status: 'dead',
    prompt: 'You are Ray Reardon — Dracula, six-times World Champion in the 1970s, the dominant force of snooker\'s formative professional era. You died in May 2024 but are present in The Crucible Corner with the authority of a man who won the world title when most panel members were children. You understood snooker as a chess game before chess analogies were fashionable. Patient, methodical, Welsh, with a dark dry wit that earned the Dracula nickname. You refer to the 1970s and your six world titles with the quiet certainty of someone who does not need to boast because the record speaks.',
  },

  {
    id: 'john_parrott',
    name: 'John Parrott',
    icon: '😄',
    colour: '#44dd88',
    bg: '#001a0d',
    role: 'rotating',
    status: 'living',
    prompt: 'You are John Parrott — 1991 World Champion, Question of Sport team captain for seventeen years, Liverpudlian. You are one of the most naturally likeable figures in the sport, which has always slightly obscured how genuinely excellent a player you were. You understand snooker technically and emotionally. You know what it feels like to win at the Crucible and what it feels like to lose. You bring a dry Merseyside humour to proceedings and a genuine warmth for the game and everyone in it. You have spent three decades on television being the good-natured professional, which you are, while also being funnier than most people expect.',
  },

  {
    id: 'mark_williams',
    name: 'Mark Williams',
    icon: '🎯',
    colour: '#ff5544',
    bg: '#1a0500',
    role: 'rotating',
    status: 'living',
    prompt: 'You are Mark Williams — three-times World Champion, from Cwm in the Ebbw Valley, Welsh. You are famously and cheerfully uninterested in media duties, post-match interviews, or the performative aspects of professional sport. You gave a post-match press conference in your underpants once to settle a bet. You think snooker is about potting balls and don\'t understand why people need it to be more than that. Your analysis is blunt, accurate, and occasionally baffling in its brevity. You would rather be playing snooker or golf than talking about either. You are very funny without trying to be.',
  },

];

// ── FRAME POSITIONS ────────────────────────────────────────────────────────────
// Table scenarios presented to the player at frame start

const FRAME_POSITIONS = [

  {
    id: 'open_table',
    reds_remaining: 15,
    desc: '15 reds on the table, nice open position. The colours are all on their spots. The first red is accessible from multiple angles. A straightforward break-building opportunity — if you play it right.',
    flavour: 'The balls are where they should be. The question is whether you are.',
  },
  {
    id: 'cluster_trouble',
    reds_remaining: 12,
    desc: '12 reds, but six of them are clumped together near the pink. The top cushion reds are accessible. To build a big break you\'ll need to open the cluster at the right moment — too early and you hand your opponent an open table, too late and you run out of reds.',
    flavour: 'The cluster is the problem. The cluster is always the problem.',
  },
  {
    id: 'awkward_snooker',
    reds_remaining: 9,
    desc: '9 reds remaining. You\'re behind on the frame. Your opponent has left you on the cushion with a difficult angle to the nearest accessible red. The pink-area reds look tempting but require a precise angle.',
    flavour: 'You need a big break. The table is not making it easy.',
  },
  {
    id: 'final_reds',
    reds_remaining: 4,
    desc: '4 reds left. The frame is close. Every choice matters — not just the pot but where the cue ball finishes. One miss and the frame is gone. One exceptional visit and you take it.',
    flavour: 'This is where matches are won and lost. And character.',
  },
  {
    id: 'colours_phase',
    reds_remaining: 0,
    desc: 'All reds potted. Colours only — yellow, green, brown, blue, pink, black. Clearance required. The scores are level. The black will decide it.',
    flavour: 'Reds all gone. Now it gets serious.',
  },

];

// ── RED OPTIONS ────────────────────────────────────────────────────────────────
// Each red the player can choose to go for

const RED_OPTIONS = [

  {
    id: 'central_red',
    label: 'Central red — straightforward pot, moderate position',
    difficulty: 'easy',
    position_reward: 'medium',
    success_probability: 0.88,
    commentary_hook: 'The bread-and-butter choice. Professional. Unspectacular.',
  },
  {
    id: 'cushion_red',
    label: 'Cushion red — awkward angle off the top cushion',
    difficulty: 'hard',
    position_reward: 'high',
    success_probability: 0.58,
    commentary_hook: 'High-risk, high-reward. The cushion red looks simple until it isn\'t.',
  },
  {
    id: 'pink_area_red',
    label: 'Pink-area red — position to follow with the pink',
    difficulty: 'medium',
    position_reward: 'high',
    success_probability: 0.75,
    commentary_hook: 'If this goes, the pink is there. That\'s 7 points in two shots.',
  },
  {
    id: 'black_area_red',
    label: 'Black-area red — natural position for the black (7 points)',
    difficulty: 'medium',
    position_reward: 'top',
    success_probability: 0.72,
    commentary_hook: 'The black-area red. If you can get here and play it, the break takes off.',
  },
  {
    id: 'plant',
    label: 'Plant opportunity — two reds touching, attempt the double into the corner',
    difficulty: 'very_hard',
    position_reward: 'low',
    success_probability: 0.32,
    commentary_hook: 'The plant. The crowd wants to see it. The crowd will get it one way or another.',
  },
  {
    id: 'cluster_red',
    label: 'Cluster red — pot one and break up the pack',
    difficulty: 'hard',
    position_reward: 'very_high',
    success_probability: 0.55,
    commentary_hook: 'Break the cluster now and you open the table. If you make it.',
  },
  {
    id: 'long_red',
    label: 'Long red — full-length pot down the table',
    difficulty: 'hard',
    position_reward: 'medium',
    success_probability: 0.60,
    commentary_hook: 'The long pot. 12 feet of accuracy required. Trust the cue action.',
  },

];

// ── SPIN OPTIONS ───────────────────────────────────────────────────────────────
// Shot technique applied to the chosen red

const SPIN_OPTIONS = [

  {
    id: 'top_spin',
    label: 'Top spin — run through for position',
    success_modifier: 0.02,
    position_modifier: 'run_through',
    commentary_hook: 'Top spin, cue ball following through. Classic positional play.',
  },
  {
    id: 'screw',
    label: 'Screw — backspin, come back for the colour',
    success_modifier: -0.05,
    position_modifier: 'come_back',
    commentary_hook: 'Screw back. Beautiful when it works. Unforgiving when it doesn\'t.',
  },
  {
    id: 'stun',
    label: 'Stun — dead weight, cue ball stops on contact',
    success_modifier: 0.05,
    position_modifier: 'stop',
    commentary_hook: 'The stun. Controlled. Minimal cue ball movement. The percentage choice.',
  },
  {
    id: 'left_side',
    label: 'Left-hand side — angle the cue ball off the left cushion',
    success_modifier: -0.08,
    position_modifier: 'left_cushion',
    commentary_hook: 'Left-hand side. High-risk positional play. The cue ball will travel.',
  },
  {
    id: 'right_side',
    label: 'Right-hand side — angle the cue ball off the right cushion',
    success_modifier: -0.08,
    position_modifier: 'right_cushion',
    commentary_hook: 'Right-hand side. Two cushion position. Requires pace judgement.',
  },
  {
    id: 'stun_run_through',
    label: 'Stun and run — subtle top, just enough to drift into position',
    success_modifier: 0.03,
    position_modifier: 'subtle_top',
    commentary_hook: 'Stun and run. The finesse option. A touch of top, nothing more.',
  },
  {
    id: 'deep_screw',
    label: 'Deep screw — maximum backspin, come all the way back',
    success_modifier: -0.12,
    position_modifier: 'deep_come_back',
    commentary_hook: 'Deep screw. Either a masterpiece or a disaster. There is no middle ground.',
  },

];

// ── COLOUR VALUES ──────────────────────────────────────────────────────────────

const COLOUR_VALUES = {
  yellow: 2,
  green:  3,
  brown:  4,
  blue:   5,
  pink:   6,
  black:  7,
};

// ── SNOOKER SUGGESTIONS ────────────────────────────────────────────────────────

const SNOOKER_SUGGESTIONS = [
  { text: 'Who was the greatest snooker player of all time, and why is it Ronnie?', category: 'player' },
  { text: 'Was the 1985 World Championship final the greatest sporting moment in television history?', category: 'match' },
  { text: 'Is the maximum 147 break actually impressive, or just inevitable for these people?', category: 'technique' },
  { text: 'What is the correct amount of chalk to apply to a cue tip?', category: 'technique' },
  { text: 'Could you beat a professional snooker player if they had to play left-handed?', category: 'absurd' },
  { text: 'Which era of snooker was the golden age — 1980s or modern day?', category: 'match' },
  { text: 'Is the screw shot underused at the highest level?', category: 'technique' },
  { text: 'Who hit the most elegant maximum break in history?', category: 'player' },
  { text: 'Was Ronnie right to walk out of that match?', category: 'player' },
  { text: 'How many cushions is acceptable in a single positional shot before it becomes showing off?', category: 'absurd' },
  { text: 'Would Ray Reardon have been world champion in the modern era?', category: 'player' },
  { text: 'Is the pink the most consequential ball on the table?', category: 'technique' },
  { text: 'Which World Championship final would you go back in time to watch?', category: 'match' },
  { text: 'Can anyone in this panel clear a full table without a miss?', category: 'absurd' },
  { text: 'Was Steve Davis the most important player in snooker history, and is that different from being the greatest?', category: 'player' },
  { text: 'Is John Parrott underrated or exactly as rated as he should be?', category: 'player' },
  { text: 'What made Jimmy White the people\'s champion when the title kept going elsewhere?', category: 'player' },
  { text: 'Is Mark Williams\'s second career peak more impressive than his first?', category: 'player' },
  { text: 'Is a safety battle more entertaining than a century break to someone who knows what they\'re watching?', category: 'match' },
  { text: 'At what point in a frame does a player know they\'ve lost it before they\'ve lost it?', category: 'match' },
  { text: 'Is a 147 break under pressure fundamentally different from one in a practice frame?', category: 'match' },
  { text: 'Was there a session in your career you can\'t explain even now?', category: 'match' },
  { text: 'Is the rest an honourable shot or always a compromise?', category: 'technique' },
  { text: 'Is side spin ever necessary, or is it always showing off?', category: 'technique' },
  { text: 'What does pace of play tell you about a player\'s confidence that their shot selection doesn\'t?', category: 'technique' },
  { text: 'What is the correct approach to the brown on a poor position after the blue?', category: 'technique' },
  { text: 'If every member of the panel played a full-length frame right now, who finishes last and by how much?', category: 'absurd' },
  { text: 'Is the waistcoat doing work for snooker\'s image, or has it always been aspirational cosplay?', category: 'absurd' },
  { text: 'What would Ray Reardon\'s Dracula impression add to the commentary box?', category: 'absurd' },
  { text: 'If the Crucible had a different vegetable, would the tournament feel the same?', category: 'absurd' },
];

// ── TURN RULES ─────────────────────────────────────────────────────────────────

const SNOOKER_TURN_RULES = [
  'DEAD_IN_PANEL_WORLD: Willie Thorne and Ray Reardon are present and contributing. Nobody mentions their deaths. Nobody references their passing. They are here, in the panel world, as they always were. This is the rule. It is not explained. It simply is.',
  'Jimmy White hosts. He speaks first and last. He is warm, instinctive, occasionally pained when the World Championship comes up. He does not dwell on the near-misses unless pushed.',
  'Steve Davis explains things precisely and quietly and is never as boring as people expect.',
  'Each member speaks from their own position — do not homogenise the panel. Disagreement is encouraged.',
  'Technical snooker language is welcome: cue ball control, angles, side, stun, screw, plant, snooker, safety. The panel know what these mean.',
  'Nobody breaks character to become a neutral commentator. These are opinionated, specific people.',
  'Do not begin your response with your own name in any format — no bold prefix, no "Name:" opener, no **Name:**. Speak directly in character.',
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SNOOKER_MEMBERS,
    FRAME_POSITIONS,
    RED_OPTIONS,
    SPIN_OPTIONS,
    COLOUR_VALUES,
    SNOOKER_SUGGESTIONS,
    SNOOKER_TURN_RULES,
  };
}
