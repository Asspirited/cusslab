// src/data/final-furlong-data.js
// Horse pool, race pool, and jockey profiles for The Final Furlong Race Simulation.
// Pure data — no functions, no DOM, no API.
// index.html loads this before the Racing IIFE.
// pipeline/gherkin-runner.js requires() this directly.

// ── HORSE POOL ────────────────────────────────────────────────────────────────
// tier: 'outsider' | 'mid-field' | 'second-favourite' | 'favourite'
// going_preference: 'firm' | 'good' | 'soft' | 'heavy' | 'any'
// distance: 'sprint' | 'mile' | 'middle' | 'staying' | 'marathon'
// personality: one-line character note used in prompt
// special_ability: mechanical effect on race score

const HORSE_POOL = [

  // ── HISTORIC ──────────────────────────────────────────────────────────────

  {
    name: 'Red Rum',
    era: 'historic', type: 'nh',
    tier: 'favourite',
    going_preference: 'good',
    distance: 'marathon',
    sp: '9/1',
    personality: 'Three-time Grand National winner. Knows Aintree intimately — the fences, the crowd, the run-in. Calm under pressure that would break lesser horses. He has been here before. He has won here before.',
    special_ability: 'AINTREE_SPECIALIST',
    special_note: 'At the Grand National: score bonus +2 on FINISH stage choice',
    trainer: 'Ginger McCain', jockey_association: 'Brian Fletcher / Tommy Stack',
  },
  {
    name: 'Arkle',
    era: 'historic', type: 'nh',
    tier: 'favourite',
    going_preference: 'any',
    distance: 'staying',
    sp: '1/3',
    personality: 'Three Cheltenham Gold Cups. Mill House thought he was the best horse alive until Arkle showed him he was wrong, twice. The crowd sang his name. He received fan mail. He answered none of it but is assumed to have been pleased.',
    special_ability: 'DOMINANCE',
    special_note: 'START stage choice quality upgraded by one grade regardless of pick',
    trainer: 'Tom Dreaper', jockey_association: 'Pat Taaffe',
  },
  {
    name: 'Desert Orchid',
    era: 'historic', type: 'nh',
    tier: 'favourite',
    going_preference: 'firm',
    distance: 'staying',
    sp: '5/2',
    personality: 'Grey. Flamboyant. Four King George VI Chases. The 1989 Gold Cup in testing ground that should have beaten him — it did not beat him. The crowd was enormous. He jumped the last like he invented jumping.',
    special_ability: 'CROWD_FAVOURITE',
    special_note: 'CROWD_SURGE special event gives +2 instead of -1',
    trainer: 'David Elsworth', jockey_association: 'Simon Sherwood / Richard Dunwoody',
  },
  {
    name: 'Shergar',
    era: 'historic', type: 'flat',
    tier: 'favourite',
    going_preference: 'good',
    distance: 'middle',
    sp: '10/11',
    personality: 'Ten lengths. The 1981 Epsom Derby by ten lengths. Walter Swinburn was 19. The winning margin remains the record. Shergar looked bored. He was not bored. He was simply that much better than the field.',
    special_ability: 'SURGE',
    special_note: 'MID stage: aggressive choice always generates GOOD outcome',
    trainer: 'Michael Stoute', jockey_association: 'Walter Swinburn',
  },
  {
    name: 'Seabiscuit',
    era: 'historic', type: 'flat',
    tier: 'second-favourite',
    going_preference: 'firm',
    distance: 'middle',
    sp: '4/1',
    personality: 'Depression-era American legend. Undersized, knobby-kneed, prone to sleeping and eating too much. Won anyway. Beat War Admiral. The public did not care that he was not built like a champion — he rode like one.',
    special_ability: 'COMEBACK',
    special_note: 'If score is below threshold at THREE_OUT: +3 bonus on FINISH choice',
    trainer: 'Tom Smith', jockey_association: 'Red Pollard / George Woolf',
  },
  {
    name: 'Nijinsky',
    era: 'historic', type: 'flat',
    tier: 'favourite',
    going_preference: 'good',
    distance: 'staying',
    sp: '11/8',
    personality: 'Last horse to win the English Triple Crown, 1970. Lester Piggott up. Magnificent, highly strung, required careful handling. When settled: unbeatable. When unsettled: a reminder that even the greatest horses are animals first.',
    special_ability: 'TEMPERAMENT',
    special_note: 'HIGH risk choices generate higher highs and lower lows than normal',
    trainer: 'Vincent O\'Brien', jockey_association: 'Lester Piggott',
  },
  {
    name: 'Golden Miller',
    era: 'historic', type: 'nh',
    tier: 'favourite',
    going_preference: 'soft',
    distance: 'staying',
    sp: '2/1',
    personality: 'Five consecutive Cheltenham Gold Cups (1932–1936) and the 1934 Grand National. No horse has won both in the same year before or since. He jumped everything in front of him as if fences were a personal affront.',
    special_ability: 'RELENTLESS',
    special_note: 'Score never drops below 6 regardless of choice quality',
    trainer: 'Basil Briscoe', jockey_association: 'Gerry Wilson',
  },

  // ── RECENT ────────────────────────────────────────────────────────────────

  {
    name: 'Enable',
    era: 'recent', type: 'flat',
    tier: 'favourite',
    going_preference: 'good',
    distance: 'staying',
    sp: '4/6',
    personality: 'Dettori\'s horse. Eleven wins. Two Arcs. The third Arc was lost by half a length. She retired without the chapter it deserved. In this race, she has something to prove — or perhaps she always did and the record simply catches up with the feeling.',
    special_ability: 'ENABLE_FACTOR',
    special_note: 'At the Arc: +3 bonus on FINISH choice. At any other race: standard.',
    trainer: 'John Gosden', jockey_association: 'Frankie Dettori',
  },
  {
    name: 'Frankel',
    era: 'recent', type: 'flat',
    tier: 'favourite',
    going_preference: 'good',
    distance: 'mile',
    sp: '1/10',
    personality: 'Undefeated. Fourteen races, fourteen wins. The Timeform rating of 147 is the highest ever assigned to a flat horse. Tom Queally up for most of them. Frankel did not lose because Frankel did not lose. This is a complete description of Frankel.',
    special_ability: 'UNBEATABLE',
    special_note: 'On good ground at a flat mile: PLACED result upgraded to WIN automatically',
    trainer: 'Henry Cecil', jockey_association: 'Tom Queally',
  },
  {
    name: 'Kauto Star',
    era: 'recent', type: 'nh',
    tier: 'favourite',
    going_preference: 'good',
    distance: 'staying',
    sp: '5/4',
    personality: 'Two Cheltenham Gold Cups (2007, 2009 — the reverse-chronological comeback). Five King George VI Chases. Walsh\'s horse. Kauto Star jumped fluently, raced enthusiastically, and occasionally made errors that would end other horses\' races. He recovered. Always.',
    special_ability: 'RECOVERY',
    special_note: 'EQUIPMENT_CHECK special event: score penalty halved',
    trainer: 'Paul Nicholls', jockey_association: 'Ruby Walsh',
  },
  {
    name: 'Denman',
    era: 'recent', type: 'nh',
    tier: 'favourite',
    going_preference: 'heavy',
    distance: 'staying',
    sp: '7/4',
    personality: 'The Tank. Won the 2008 Gold Cup pulling Kauto Star apart. A heart condition cost him years. He came back to finish second. Walsh said Denman was the better horse on the day in 2008. Denman was. He knew it.',
    special_ability: 'HEAVY_GROUND_BEAST',
    special_note: 'On heavy or soft going: +2 to all stage scores',
    trainer: 'Paul Nicholls', jockey_association: 'Ruby Walsh / Sam Thomas',
  },
  {
    name: 'Tiger Roll',
    era: 'recent', type: 'nh',
    tier: 'second-favourite',
    going_preference: 'soft',
    distance: 'marathon',
    sp: '5/1',
    personality: 'Two Grand Nationals (2018, 2019). Small. Stubborn. Won a cross-country chase at the Cheltenham Festival. Tiger Roll simply refuses to lose in the way that small, stubborn things sometimes refuse to lose. The crowd loves him because the crowd recognises something.',
    special_ability: 'STUBBORN_FINISH',
    special_note: 'FINISH stage conservative choice upgraded to GOOD outcome',
    trainer: 'Gordon Elliott', jockey_association: 'Davy Russell',
  },
  {
    name: 'Sprinter Sacre',
    era: 'recent', type: 'nh',
    tier: 'favourite',
    going_preference: 'good',
    distance: 'sprint',
    sp: '1/4',
    personality: 'The Champion Chase machine. Unbeaten over fences until a heart problem. Came back two years later and won it again. Barry Geraghty up. The crowd gave him a reception at Cheltenham that grown men found difficult to explain to other grown men.',
    special_ability: 'COMEBACK',
    special_note: 'If score is below threshold at THREE_OUT: +3 bonus on FINISH choice',
    trainer: 'Nicky Henderson', jockey_association: 'Barry Geraghty',
  },

  // ── FICTIONAL ─────────────────────────────────────────────────────────────

  {
    name: 'Iron Duchess',
    era: 'fictional', type: 'nh',
    tier: 'mid-field',
    going_preference: 'heavy',
    distance: 'staying',
    sp: '14/1',
    personality: 'A staying mare who has won twice in the mud at Wetherby and once at Haydock in conditions that resembled a ploughed field. She is not flashy. She is relentless in soft ground. On good ground she is ordinary. Conditions today will decide everything.',
    special_ability: 'MUDLARK',
    special_note: 'On heavy/soft: +2 to all stages. On firm: -1 to all stages.',
    trainer: null, jockey_association: null,
  },
  {
    name: 'The Wanderer',
    era: 'fictional', type: 'flat',
    tier: 'outsider',
    going_preference: 'any',
    distance: 'middle',
    sp: '33/1',
    personality: 'A front-runner who gets there early and holds on for grim death. Has won three races by establishing an improbable lead and running out of trouble. Has lost fifteen by going too fast too soon. The market knows this. The market prices it at 33/1 and is probably right.',
    special_ability: 'FRONT_RUNNER',
    special_note: 'START stage aggressive choice always generates EXCELLENT outcome. THREE_OUT aggressive choice always generates POOR outcome.',
    trainer: null, jockey_association: null,
  },
  {
    name: 'Midnight Judge',
    era: 'fictional', type: 'flat',
    tier: 'second-favourite',
    going_preference: 'firm',
    distance: 'mile',
    sp: '5/2',
    personality: 'A miler who has beaten some decent horses on fast ground at Newmarket and Goodwood. Needs to be in a good position turning for home. On firm, properly managed, he is a serious proposition. Ask him to do the work too early and he sulks. He actually sulks. It is visible.',
    special_ability: 'POSITION_SENSITIVE',
    special_note: 'MID stage conservative choice generates EXCELLENT. MID aggressive generates POOR.',
    trainer: null, jockey_association: null,
  },
  {
    name: 'Silver Clarion',
    era: 'fictional', type: 'nh',
    tier: 'mid-field',
    going_preference: 'good',
    distance: 'staying',
    sp: '8/1',
    personality: 'Consistent. Placed eleven times. Won four. Never disgraces himself. Never embarrasses the favourite. The type of horse that good trainers use to teach promising young jockeys, and experienced jockeys use when they cannot get on the better ones. Honest. Boring. Occasionally brilliant.',
    special_ability: 'CONSISTENCY',
    special_note: 'No choice generates EXCELLENT. No choice generates DISASTROUS. All outcomes one step toward GOOD.',
    trainer: null, jockey_association: null,
  },
  {
    name: 'The Publican',
    era: 'fictional', type: 'nh',
    tier: 'outsider',
    going_preference: 'soft',
    distance: 'marathon',
    sp: '25/1',
    personality: 'A staying chaser who races best in testing conditions over marathon trips. Has form at Aintree. Has no form anywhere else. Named by his owner after the pub he watches his horses in. The pub is called The Crown. It is unclear why the horse is called The Publican.',
    special_ability: 'MARATHON_SPECIALIST',
    special_note: 'At the Grand National on soft: tier upgraded to second-favourite for scoring purposes',
    trainer: null, jockey_association: null,
  },

];

// ── RACE POOL ─────────────────────────────────────────────────────────────────
// going: 'firm' | 'good' | 'soft' | 'heavy' | 'variable'
// type: 'flat' | 'nh' | 'mixed'
// field_size: integer
// classic_runners: notable horses associated with this race (for flavour/commentary)

const RACE_POOL = [
  {
    name: 'The Grand National',
    course: 'Aintree', distance: '4m3.5f', going: 'good-soft', type: 'nh',
    field_size: 40, fences: 30,
    description: 'The greatest race in the world. Forty runners. Thirty fences. Most of them fall. Aintree on Grand National day. The crowd is enormous. The fences are enormous. The prize is permanent.',
    classic_runners: ['Red Rum', 'Desert Orchid', 'Tiger Roll', 'The Publican', 'Golden Miller'],
    stage_flavour: {
      START: 'The field streams over Becher\'s for the first time. Forty horses and forty jockeys each deciding how to survive the first circuit.',
      MID: 'The field is thinning. Fallen horses and remounted jockeys. The Canal Turn separates the careful from the careless.',
      THREE_OUT: 'The Chair is behind them. Valentine\'s. The Foinavon fence. The field is down to something manageable. The run-in begins to mean something.',
      FINISH: 'The elbow. The run-in. Two furlongs of flat after four miles of fences. The crowd is making a noise that has nothing to do with individual preference.',
    },
  },
  {
    name: 'The Cheltenham Gold Cup',
    course: 'Cheltenham', distance: '3m2.5f', going: 'soft', type: 'nh',
    field_size: 14, fences: 22,
    description: 'The championship of steeplechasing. Cheltenham in March. The hill at the finish. The crowd going up it with you. Three miles, two furlongs, and a hill that has ended more Gold Cup dreams than any fence.',
    classic_runners: ['Arkle', 'Desert Orchid', 'Kauto Star', 'Denman', 'Golden Miller'],
    stage_flavour: {
      START: 'Down the hill, first fence. Cheltenham takes no time to separate those who can jump from those who cannot.',
      MID: 'The back straight. The field settling. The pace honest. The horses telling the jockeys what they have left.',
      THREE_OUT: 'The last fence in the back straight. The turn in. Three to jump. Here is where the Gold Cup is won and lost.',
      FINISH: 'The last. The run-in. The hill. Everything that is left goes into the hill. The horse that has more left than the others wins.',
    },
  },
  {
    name: 'The Epsom Derby',
    course: 'Epsom', distance: '1m4f', going: 'good', type: 'flat',
    field_size: 16, fences: 0,
    description: 'The most important flat race in Britain. Epsom Downs in June. The camber, the hill, the undulations — Epsom rewards the adaptable and punishes the one-dimensional. The best three-year-olds in training.',
    classic_runners: ['Shergar', 'Nijinsky', 'Frankel', 'Midnight Judge'],
    stage_flavour: {
      START: 'The stalls. Tattenham Corner approaches. The first test of Epsom is whether the horse handles the camber.',
      MID: 'Tattenham Corner. Halfway. The field begins to spread. The camber is doing what the camber does.',
      THREE_OUT: 'Three furlongs out. Straight. The horses are going downhill and the hill is a factor.',
      FINISH: 'The final furlong. Epsom. The winning post. The crowd on the downs looking down at what is happening below them.',
    },
  },
  {
    name: "The Prix de l'Arc de Triomphe",
    course: 'Longchamp', distance: '1m4f', going: 'soft', type: 'flat',
    field_size: 18, fences: 0,
    description: 'Europe\'s championship. Longchamp in October. The best horses from France, Britain, Ireland, Japan, and occasionally the rest of the world. The Arc is the race that decides whether a horse is excellent or genuinely great.',
    classic_runners: ['Enable', 'Nijinsky', 'Seabiscuit', 'Frankel'],
    stage_flavour: {
      START: 'Longchamp. The straight course. The full field. The Arc tests whether a horse can handle being part of something international.',
      MID: 'The false straight. The pace building. The international field finding their positions.',
      THREE_OUT: 'The real straight. Longchamp opens up. Three furlongs of truth after a mile of preparation.',
      FINISH: 'The last furlong. The Arc. This is the one. The horse knows. Half a length can be everything.',
    },
  },
  {
    name: 'The Ascot Gold Cup',
    course: 'Royal Ascot', distance: '2m4f', going: 'good', type: 'flat',
    field_size: 12, fences: 0,
    description: 'The championship of the staying horses. Royal Ascot in June. Two miles and four furlongs of flat racing at the world\'s most glamorous course. The Gold Cup separates the genuine stayers from horses who stay until they don\'t.',
    classic_runners: ['Stradivarius', 'Iron Duchess', 'Silver Clarion'],
    stage_flavour: {
      START: 'Ascot. The long straight. The field is small by championship standards. The stayers know their job.',
      MID: 'Halfway. The Gold Cup is about pace management. Whoever goes too fast will pay. The question is when.',
      THREE_OUT: 'Three furlongs. The race sharpens. The horses are working. The jockeys making the decisions they can\'t unmake.',
      FINISH: 'The final furlong. Ascot. The stands. The staying breeds producing what staying breeds produce at the end.',
    },
  },
  {
    name: 'The King George VI Chase',
    course: 'Kempton', distance: '3m', going: 'good', type: 'nh',
    field_size: 10, fences: 18,
    description: 'Boxing Day at Kempton. The mid-season championship of chasing. Three miles on a flat, fair track that rewards jumping ability over course-knowledge. Kauto Star won it five times. Five times.',
    classic_runners: ['Kauto Star', 'Desert Orchid', 'Denman'],
    stage_flavour: {
      START: 'Kempton on Boxing Day. Flat. Fair. The field knowing each other well by this point in the season.',
      MID: 'The back straight. Three miles on a fair track rewards the horses who can jump and jump again.',
      THREE_OUT: 'Three out. Kempton gives you a long run to the last three fences. The race is being decided here.',
      FINISH: 'The last fence. The run-in. Kempton\'s finish is longer than it looks. The horses who jump well get here in time.',
    },
  },
  {
    name: 'The Champion Hurdle',
    course: 'Cheltenham', distance: '2m', going: 'soft', type: 'nh',
    field_size: 12, fences: 8,
    description: 'The championship of hurdling. Speed, jumping, and stamina compressed into two miles at Cheltenham. The Champion Hurdle rewards the quick and punishes the slow-jumping. Eight hurdles. Two miles. One winner.',
    classic_runners: ['Sprinter Sacre', 'Silver Clarion'],
    stage_flavour: {
      START: 'Two miles. Fast. The hurdle specialists go immediately. This is not a race for conserving energy.',
      MID: 'The back straight. The pace brutal. Cheltenham at its most unforgiving for the horse who cannot sustain speed.',
      THREE_OUT: 'Three out. Cheltenham\'s hill already in sight. The field down to those who will fight it out.',
      FINISH: 'The last hurdle. The hill. The Champion Hurdle finish. Everything spent. The winner is the horse that spends it last.',
    },
  },
  {
    name: 'The 2000 Guineas',
    course: 'Newmarket', distance: '1m', going: 'firm', type: 'flat',
    field_size: 18, fences: 0,
    description: 'The first Classic of the flat season. Newmarket in May. A mile on the straight Rowley Mile — no turns, no hills, just pace and talent. The Guineas reveals the best miler of a generation. Or at least of a crop.',
    classic_runners: ['Frankel', 'Nijinsky', 'Midnight Judge'],
    stage_flavour: {
      START: 'The Rowley Mile. Straight. Fast. The draw matters. Position matters. The field going straight and finding out what a mile actually requires.',
      MID: 'Halfway. The Dip is coming. Newmarket flatters some horses and exposes others. Half a mile to go.',
      THREE_OUT: 'The Dip. Newmarket\'s incline. The Dip takes something. What the horse has left determines everything from here.',
      FINISH: 'The final two furlongs. The Rowley Mile. The winning post. The first Classic of the year. Someone is about to become a Guineas winner.',
    },
  },
];

// ── JOCKEY PROFILES ───────────────────────────────────────────────────────────
// style: description of riding approach
// going_bonus: going type that gives +1 to all stage scores
// special_trait: id of the mechanical effect
// risk_profile: 'conservative' | 'balanced' | 'aggressive'
// Each profile modifies RIDING CHOICES available at each stage —
// conservative profiles unlock low-risk options, aggressive unlock high-risk.

const JOCKEY_PROFILES = [
  {
    id: 'lester_piggott',
    name: 'Lester Piggott',
    nickname: 'The Long Fellow',
    years: '1948–1994 (with returns)',
    titles: '11 Jockeys\' Championships',
    going_bonus: 'firm',
    risk_profile: 'conservative',
    style: 'Ice-cold hold-up. Save everything for the final furlong. Clinical, minimal, ice. Piggott does not waste movement. Piggott does not panic. Piggott waits.',
    special_trait: 'ICE_COLD_FINISH',
    special_note: 'FINISH stage: conservative choice generates EXCELLENT outcome (instead of GOOD)',
    strengths: 'Flat racing, Classic distances, big-field navigation',
    weakness: 'Does not suit front-runners who need early commitment',
    quote: 'I didn\'t say much. The horse didn\'t need me to.',
  },
  {
    id: 'pat_eddery',
    name: 'Pat Eddery',
    nickname: 'The Machine',
    years: '1969–2003',
    titles: '11 Jockeys\' Championships',
    going_bonus: 'any',
    risk_profile: 'balanced',
    style: 'Relentless and adaptable. Eddery could ride any style on any going. No going penalty. No distance penalty. The textbook jockey — if the textbook were written by someone who had won eleven championships.',
    special_trait: 'VERSATILE',
    special_note: 'No going or distance penalties apply. Special events: moderate choice always generates GOOD outcome.',
    strengths: 'All ground, all distances, consistent in big fields',
    weakness: 'No specific bonus — the versatility is the trade',
    quote: 'Whatever the horse needs. Work backwards from that.',
  },
  {
    id: 'willie_carson',
    name: 'Willie Carson',
    nickname: 'The Pocket Rocket',
    years: '1962–1996',
    titles: '5 Jockeys\' Championships',
    going_bonus: 'good',
    risk_profile: 'aggressive',
    style: 'Animated, pumping, front-running where possible. Carson rides with visible effort — the arms going, the whole body in it. Galloping tracks. Big fields. He wants to be in front. He is usually right to want this.',
    special_trait: 'FRONT_RUNNER_BONUS',
    special_note: 'START stage aggressive choice: +2 bonus (instead of +1). FINISH stage: aggressive choice generates EXCELLENT.',
    strengths: 'Front-running horses, galloping tracks, fast going',
    weakness: 'Hold-up horses are harder — conservative choices give lower ceilings',
    quote: 'Get to the front. Stay there. Let them come past you if they can.',
  },
  {
    id: 'ruby_walsh',
    name: 'Ruby Walsh',
    nickname: 'The Calculator',
    years: '1998–2019',
    titles: '8 NH Champion Jockey (Ireland)',
    going_bonus: 'soft',
    risk_profile: 'balanced',
    style: 'Reads the race. Saves ground. Knows where the pace is wrong before the horses do. NH specialist. Walsh arrives at fences correctly because Walsh thought about the fence three fences back.',
    special_trait: 'PACE_READER',
    special_note: 'TRAFFIC_PROBLEM special event: no penalty. MID stage: moderate choice upgraded to GOOD.',
    strengths: 'NH racing, soft-to-heavy going, staying races, pace judgment',
    weakness: 'Flat racing at sprint distances is outside his best register',
    quote: 'The pace was wrong from the start. I knew it. The horse knew it. We waited.',
  },
  {
    id: 'frankie_dettori',
    name: 'Frankie Dettori',
    nickname: 'The Entertainer',
    years: '1986–2023',
    titles: '11 UK Champion Jockey, 500+ Group 1 wins',
    going_bonus: 'good',
    risk_profile: 'aggressive',
    style: 'The crowd favourite. Big-occasion specialist. Exuberant, effective, and always aware that the crowd is watching. The flying dismount is coming whatever happens. Better make it a winner.',
    special_trait: 'CROWD_PLEASER',
    special_note: 'At championship venues (Ascot, Cheltenham, Longchamp): +1 to all stage scores. CROWD_SURGE special event: +3 instead of standard.',
    strengths: 'Flat racing, championship venues, big occasions, large fields',
    weakness: 'Smaller venues without crowd energy give no bonus — standard scoring',
    quote: 'Madonna. This horse. This horse is the best I have ever sat on.',
  },
  {
    id: 'gordon_richards',
    name: 'Sir Gordon Richards',
    nickname: 'The Champion',
    years: '1920–1954',
    titles: '26 Jockeys\' Championships',
    going_bonus: 'any',
    risk_profile: 'conservative',
    style: 'Pure consistency. Twenty-six championships. The most reliable jockey who ever rode. Richards doesn\'t win by brilliance — he wins by never losing the advantage. The horse is always in the right place at the right time.',
    special_trait: 'CONSISTENCY_CHAMPION',
    special_note: 'All stage outcomes upgraded by one grade (POOR → NEUTRAL, NEUTRAL → GOOD, GOOD → EXCELLENT). No DISASTROUS outcomes possible.',
    strengths: 'All going, all distances, consistency across all stages',
    weakness: 'Maximum outcome is EXCELLENT, not transcendent — steady is the style',
    quote: 'I didn\'t ride the race brilliantly. I rode it correctly. There\'s a difference.',
  },
  {
    id: 'AP_McCoy',
    name: 'A.P. McCoy',
    nickname: 'The Iron Man',
    years: '1994–2015',
    titles: '20 consecutive NH Champion Jockey',
    going_bonus: 'heavy',
    risk_profile: 'aggressive',
    style: 'Twenty consecutive championships. Rides in pain. Rides injured. Rides the horse that nobody else wants to ride and gets it placed. McCoy is the argument that will alone constitutes horsemanship. It does not constitute horsemanship. But in McCoy\'s case, it helps.',
    special_trait: 'IRON_WILL',
    special_note: 'EQUIPMENT_CHECK special event: no penalty, score bonus +1. LAST-placed horse: always finishes at least MID_FIELD.',
    strengths: 'NH racing, testing conditions, problem horses, big fields',
    weakness: 'Flat racing specialists on fast ground are outside his optimal territory',
    quote: 'I rode every horse like it was the last horse I\'d ever ride. Because it might have been.',
  },
  {
    id: 'barry_geraghty',
    name: 'Barry Geraghty',
    nickname: 'The Cheltenham King',
    years: '1998–2020',
    titles: '43 Cheltenham Festival winners',
    going_bonus: 'soft',
    risk_profile: 'balanced',
    style: 'Forty-three Cheltenham Festival winners. Geraghty reads Cheltenham like a local — the hill, the fences, the turns. In any other venue he is very good. At Cheltenham he is at his best. He knows where the race is won.',
    special_trait: 'CHELTENHAM_SPECIALIST',
    special_note: 'At Cheltenham Gold Cup or Champion Hurdle: +2 to all stage scores. THREE_OUT stage: moderate choice generates EXCELLENT.',
    strengths: 'Cheltenham, NH racing, soft going, championship-level horses',
    weakness: 'His specialist bonus doesn\'t apply outside Cheltenham — standard scoring',
    quote: 'Cheltenham. The hill. You know it\'s coming. You prepare for it. Some horses don\'t. The jockey\'s job is to make sure they do.',
  },
];

// ── RIDING CHOICES ────────────────────────────────────────────────────────────
// Per stage, 3 choices with risk levels and base score modifiers.
// Jockey profile risk_profile modifies which choices are optimal.

const RIDING_CHOICES = {
  START: [
    { id: 'push_forward', label: 'Push forward — establish position early', risk: 'HIGH',   base_delta: 0,   jockey_modifier: { aggressive: +2, balanced: +1, conservative: -1 } },
    { id: 'settle_mid',   label: 'Settle mid-pack, let the race come',      risk: 'MEDIUM', base_delta: +1,  jockey_modifier: { aggressive: 0,  balanced: +1, conservative: +1 } },
    { id: 'hold_back',    label: 'Track the rear, conserve everything',      risk: 'LOW',    base_delta: +2,  jockey_modifier: { aggressive: -1, balanced: 0,  conservative: +2 } },
  ],
  MID: [
    { id: 'press_leaders', label: 'Press the leaders — move up 3 positions', risk: 'HIGH',   base_delta: 0,   jockey_modifier: { aggressive: +2, balanced: +1, conservative: -1 } },
    { id: 'hold_rhythm',   label: 'Hold rhythm, maintain position',           risk: 'MEDIUM', base_delta: +1,  jockey_modifier: { aggressive: 0,  balanced: +2, conservative: +1 } },
    { id: 'check_horse',   label: 'Check the horse\'s response, adjust',     risk: 'LOW',    base_delta: +2,  jockey_modifier: { aggressive: 0,  balanced: +1, conservative: +2 } },
  ],
  THREE_OUT: [
    { id: 'commit_now',    label: 'Make your move — commit fully',           risk: 'HIGH',   base_delta: 0,   jockey_modifier: { aggressive: +3, balanced: +1, conservative: -1 } },
    { id: 'outside_run',   label: 'Challenge on the outside',                risk: 'MEDIUM', base_delta: +1,  jockey_modifier: { aggressive: +1, balanced: +2, conservative: +1 } },
    { id: 'wait_for_gap',  label: 'Wait for the gap — trust the finish',     risk: 'LOW',    base_delta: +2,  jockey_modifier: { aggressive: -1, balanced: +1, conservative: +3 } },
  ],
  FINISH: [
    { id: 'full_push',     label: 'Full push — everything you have',         risk: 'HIGH',   base_delta: 0,   jockey_modifier: { aggressive: +3, balanced: +2, conservative: 0  } },
    { id: 'hands_heels',   label: 'Hands and heels — find the stride',       risk: 'MEDIUM', base_delta: +2,  jockey_modifier: { aggressive: +1, balanced: +3, conservative: +2 } },
    { id: 'protect_place', label: 'Protect the placing — conserve',          risk: 'LOW',    base_delta: +3,  jockey_modifier: { aggressive: 0,  balanced: +1, conservative: +3 } },
  ],
};

// ── SPECIAL EVENTS ────────────────────────────────────────────────────────────
// fire_probability: 0–1 chance per stage transition
// score_impact: applied before jockey modifier

const SPECIAL_EVENTS = [
  {
    id: 'RIVAL_CHALLENGE',
    label: 'Rival Challenge',
    description: 'A rival horse pushes hard alongside. You can feel the jockey asking questions.',
    choices: [
      { label: 'Fight — match the challenge stride for stride', score_delta: +1, risk: 'HIGH'   },
      { label: 'Wait — let the rival lead, stay in your rhythm', score_delta: +2, risk: 'LOW'   },
    ],
    fire_probability: 0.3,
  },
  {
    id: 'GOING_CHANGE',
    label: 'Going Change',
    description: 'The going has changed — softer patches in the back straight. Your horse responds differently to what you expected.',
    choices: [
      { label: 'Push through it — the horse can adapt', score_delta: 0,  risk: 'HIGH'   },
      { label: 'Ride to the changed conditions', score_delta: +1, risk: 'MEDIUM' },
    ],
    fire_probability: 0.25,
  },
  {
    id: 'TRAFFIC_PROBLEM',
    label: 'Traffic Problem',
    description: 'Blocked on the rails. The gap you wanted has closed.',
    choices: [
      { label: 'Go inside — force the gap',         score_delta: +1, risk: 'HIGH'   },
      { label: 'Switch outside — lose a length, gain clear air', score_delta: +2, risk: 'MEDIUM' },
    ],
    fire_probability: 0.3,
  },
  {
    id: 'EQUIPMENT_CHECK',
    label: 'Horse Stumbles',
    description: 'The horse takes an awkward stride. Nothing serious — but it cost you momentum.',
    choices: [
      { label: 'Push on immediately — don\'t let it settle',  score_delta: 0,  risk: 'HIGH'   },
      { label: 'Steady — let the horse find its rhythm',       score_delta: +1, risk: 'LOW'    },
    ],
    fire_probability: 0.2,
  },
  {
    id: 'CROWD_SURGE',
    label: 'Crowd Surge',
    description: 'The crowd erupts as the leaders come clear. The noise is extraordinary. Your horse\'s ears go back.',
    choices: [
      { label: 'Ride into it — use the energy',               score_delta: +2, risk: 'MEDIUM' },
      { label: 'Steady the horse — protect against spooking',  score_delta: +1, risk: 'LOW'    },
    ],
    fire_probability: 0.2,
  },
];

// ── REPUTATION CONFIG ─────────────────────────────────────────────────────────

const HR_REPUTATION_CONFIG = {
  STORAGE_KEY: 'hr-reputation',
  rewards: { WIN: 3, PLACED: 2, MID_FIELD: 1, LAST: 1 },
  tiers: [
    { min: 0,  max: 2,  id: 'novice',       label: 'Novice Jockey',      horse_tiers: ['outsider', 'mid-field'] },
    { min: 3,  max: 7,  id: 'amateur',      label: 'Amateur',            horse_tiers: ['mid-field', 'second-favourite'] },
    { min: 8,  max: 14, id: 'professional', label: 'Professional',       horse_tiers: ['second-favourite', 'favourite'] },
    { min: 15, max: Infinity, id: 'champion', label: 'Champion Jockey',  horse_tiers: ['favourite'] },
  ],
};

// ── RESULT THRESHOLDS ─────────────────────────────────────────────────────────
// Max possible score per stage: ~5 (base 3 + jockey bonus). 4 stages = max ~20.

const HR_RESULT_THRESHOLDS = {
  WIN:       14,  // ≥14
  PLACED:    10,  // 10–13
  MID_FIELD:  6,  // 6–9
  LAST:       0,  // <6
};

// ── MODULE EXPORTS (for gherkin-runner.js require) ────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HORSE_POOL, RACE_POOL, JOCKEY_PROFILES, RIDING_CHOICES, SPECIAL_EVENTS, HR_REPUTATION_CONFIG, HR_RESULT_THRESHOLDS };
}
