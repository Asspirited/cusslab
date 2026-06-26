// quiz-questions.js
// Question bank for "A Question of Sport, Hosted by Someone Who Actually Has a Personality"
// Anti-repetition: each question has a unique ID. Engine stores used IDs in localStorage key
// `quiz_used_questions` and filters them on selection.
//
// ROUND 1 — "Ok or Cheating Cunt?"
//   type: REAL_CHEATING | REAL_OK | INVENTED
//   Team decides: did this happen, and if so, was it ok or cheating?
//
// ROUND 2 — "What Happened Next"
//   Setup + answer. Team guesses. Reveal roasts the guess.
//
// ROUND 3 — "Name the Incident"
//   3 progressive clues. Team guesses after each. Earlier = more points.
//
// ROUND 4 — "Howzat?"
//   Person renamed. How did their career/life come to this end? 3 clues.

const QUIZ_QUESTIONS = {

  // ── ROUND 1 ──────────────────────────────────────────────────────────────
  round1: [

    // REAL_CHEATING
    {
      id: 'r1-001',
      sport: 'football',
      description: 'In the 1986 World Cup quarter-final, Diego Maradona claimed a goal scored entirely with his fist was scored with "a little of the hand of Maradona and a little of the hand of God."',
      type: 'REAL_CHEATING',
      reveal: 'Entirely real. The referee was standing four feet away. Maradona was five foot five. The ball went in off his knuckle. He was then named Player of the Tournament.',
      hostNote: 'The hand in question was at shoulder height. God\'s hands are, traditionally, larger.'
    },
    {
      id: 'r1-002',
      sport: 'athletics',
      description: 'Rosie Ruiz won the 1980 Boston Marathon women\'s race with the third fastest female time in history. She appeared completely fresh at the finish line.',
      type: 'REAL_CHEATING',
      reveal: 'Real. She had taken the subway. She joined the race approximately a mile from the finish. Her fresh appearance was noted. So was the fact she had no race splits.',
      hostNote: 'Nobody clocked the absence of sweat. Nobody clocked the absence of any memory of her running past them. Eight miles of marathon runners failed to notice.'
    },
    {
      id: 'r1-003',
      sport: 'athletics',
      description: 'At the 1904 St. Louis Olympics, Fred Lorz won the marathon, accepted the gold medal, had his photograph taken with Alice Roosevelt, and was about to be given the gold when officials intervened.',
      type: 'REAL_CHEATING',
      reveal: 'Real. He had been driven in a car for 11 of the 26 miles. The car broke down. He walked the rest. He claimed it was a joke. The AAU banned him for life. The ban lasted one year.',
      hostNote: 'The actual winner, Thomas Hicks, had been given strychnine and brandy by his handlers. He hallucinated. He won. This was legal.'
    },
    {
      id: 'r1-004',
      sport: 'athletics',
      description: 'Ben Johnson crossed the line in 9.79 seconds at the 1988 Seoul Olympics 100m final. The world record. The gold medal. The greatest performance in sprint history at that point.',
      type: 'REAL_CHEATING',
      reveal: 'Real. He tested positive for stanozolol three days later. The gold went to Carl Lewis. Of the eight finalists, six have since been linked to doping at some point. The 100m final is sometimes called "the dirtiest race in history."',
      hostNote: 'Six out of eight. The stadium full of people applauding a race in which two-thirds of the participants were pharmacologically enhanced. Clean sport.'
    },
    {
      id: 'r1-005',
      sport: 'cycling',
      description: 'Lance Armstrong won the Tour de France seven consecutive times between 1999 and 2005, having survived testicular cancer. He was considered the greatest endurance athlete of his generation.',
      type: 'REAL_CHEATING',
      reveal: 'Real, and the most industrially organised doping programme in sporting history. EPO, blood transfusions, HGH, testosterone. He sued and won against people who told the truth about him for years. He admitted it to Oprah Winfrey in 2013.',
      hostNote: 'He wrote a book called "It\'s Not About the Bike." It was, to a meaningful extent, about the drugs.'
    },
    {
      id: 'r1-006',
      sport: 'figure-skating',
      description: 'Tonya Harding\'s associate arranged for her rival Nancy Kerrigan to be struck on the knee with a retractable baton six weeks before the 1994 Winter Olympics.',
      type: 'REAL_CHEATING',
      reveal: 'Real. Jeff Gillooly organised it. The attacker was Shane Stant. Harding claimed she found out about it after the fact. She was banned from figure skating for life. Kerrigan won silver at the Olympics. Harding finished eighth.',
      hostNote: 'The attack was described at the time as "an assault on the kneecap." The kneecap survived. Harding\'s career did not.'
    },
    {
      id: 'r1-007',
      sport: 'cricket',
      description: 'Australian captain Greg Chappell instructed his brother Trevor to bowl the final ball of a 1981 ODI underarm along the ground to prevent New Zealand needing a six to tie.',
      type: 'REAL_CHEATING',
      reveal: 'Real. New Zealand needed six off the last ball. Trevor bowled it rolling along the ground. It was technically legal. The New Zealand prime minister called it "an act of cowardice." The Australian PM agreed. It was made illegal two weeks later.',
      hostNote: 'The batsman, Brian McKechnie, dropped his bat and walked off. He said: "Thanks Greg." The broadcast commentator said: "I\'ve never been so disgusted in my life."'
    },
    {
      id: 'r1-008',
      sport: 'cricket',
      description: 'Steve Smith, David Warner, and Cameron Bancroft orchestrated a plan to use sandpaper to rough up one side of a cricket ball during the third Test against South Africa in 2018.',
      type: 'REAL_CHEATING',
      reveal: 'Real. Bancroft was caught on camera. Smith admitted it in a press conference. Warner was identified as the architect. All three received bans. Smith cried. Warner did not.',
      hostNote: 'Bancroft concealed the sandpaper in his trousers. When spotted by a camera, he pulled out a yellow piece of tape instead. The camera then showed him putting the tape in his pocket and pulling something else from his trousers. This sequence of events was watched by approximately forty million people in real time.'
    },
    {
      id: 'r1-009',
      sport: 'rugby',
      description: 'Harlequins director of rugby Dean Richards arranged for a blood capsule to be smuggled onto the pitch during a European Cup quarter-final in 2009, so a player could fake an injury and allow a specialist kicker to return to the field.',
      type: 'REAL_CHEATING',
      reveal: 'Real. Tom Williams bit the capsule, left the field appearing to bleed. Dean Richards was banned from rugby for three years. The physio who facilitated it was banned from medicine for a year. Williams was banned, then appealed successfully after cooperating.',
      hostNote: 'This is known as Bloodgate. The blood was real, in the sense that it was blood. It was not, in the sense that it came from a capsule rather than Tom Williams\' face. The distinction mattered to the European Rugby Cup.'
    },
    {
      id: 'r1-010',
      sport: 'boxing',
      description: 'Muhammad Ali knocked out Sonny Liston in the first round of their 1965 rematch. The punch that floored Liston was so quick almost nobody in the arena saw it land.',
      type: 'REAL_CHEATING',
      reveal: 'Real event, disputed outcome. The punch exists on film. Liston went down from it. Whether it was sufficient to floor him — or whether Liston took a dive — is one of boxing\'s great unsettled arguments. The timekeeper failed to count correctly. Ali was declared winner by first-round knockout.',
      hostNote: 'The referee, Jersey Joe Walcott, became confused during the count and stopped the fight while Liston was still on the floor. Ali was never sure whether he\'d been cheated out of a cleaner win, or Liston had been cheated into a staged loss. Both positions have been argued with considerable vigour for sixty years.'
    },
    {
      id: 'r1-011',
      sport: 'baseball',
      description: 'Eight members of the 1919 Chicago White Sox, known thereafter as the Black Sox, agreed with gamblers to deliberately lose the World Series.',
      type: 'REAL_CHEATING',
      reveal: 'Real. They were paid between $5,000 and $10,000 each. They lost the Series to the Cincinnati Reds. All eight were acquitted at trial in 1921 after key documents disappeared. All eight were banned from baseball for life by Commissioner Kenesaw Mountain Landis.',
      hostNote: 'Among them was Shoeless Joe Jackson, who hit .375 in the series. His defenders argue he was trying to win. His detractors note he accepted $5,000 and did not tell anyone.'
    },
    {
      id: 'r1-012',
      sport: 'american-football',
      description: 'The New England Patriots were fined and docked a first-round draft pick after their staff was caught videotaping the New York Jets\' defensive coordinator\'s signals during a 2007 game.',
      type: 'REAL_CHEATING',
      reveal: 'Real. Spygate. Bill Belichick was fined $500,000 — the maximum allowed. The team was fined $250,000. The draft pick went. It later emerged this practice had been going on for years. Belichick called it a "misinterpretation of the rules."',
      hostNote: 'The NFL destroyed all the tapes. All of them. Thoroughly. This is the kind of destruction of evidence that looks exactly like what it is.'
    },
    {
      id: 'r1-013',
      sport: 'cricket',
      description: 'England captain Mike Atherton was fined after television cameras caught him applying dirt from his pocket to the ball during the first Test against South Africa in 1994.',
      type: 'REAL_CHEATING',
      reveal: 'Real. He told the match referee he had dirt in his pocket to dry his hands. The match referee fined him £2,000. The TCCB chairman later said Atherton had been less than candid. Atherton played on for another decade.',
      hostNote: 'He described the dirt as "sweat and grit." He did not describe it as "illegal ball-tampering" because that would have been more accurate and therefore less useful.'
    },
    {
      id: 'r1-014',
      sport: 'cricket',
      description: 'Pakistani trio Mohammad Amir, Mohammad Asif, and Salman Butt deliberately bowled no-balls at pre-arranged moments in a 2010 Test match at Lord\'s, having agreed to do so with a News of the World journalist.',
      type: 'REAL_CHEATING',
      reveal: 'Real. Mazhar Majeed arranged it. The journalist paid £150,000. The story ran with video evidence of the no-balls landing exactly where predicted. All three were banned. Amir was 18. He served his ban and played for Pakistan again.',
      hostNote: 'The no-balls were arranged for specific overs and deliveries, specified in advance. The bowlers delivered them with precision. It was, in a narrow technical sense, the most accurate bowling any of them produced all series.'
    },
    {
      id: 'r1-015',
      sport: 'motor-racing',
      description: 'Michael Schumacher deliberately steered his Ferrari into Damon Hill\'s car on the final lap of the 1994 Australian Grand Prix, taking both cars out of the race and winning the World Championship by one point.',
      type: 'REAL_CHEATING',
      reveal: 'Real. Or at minimum, very strongly suspected and never satisfactorily explained. Schumacher drove onto a wall, Hill moved to overtake, Schumacher turned into him. Hill\'s suspension broke. Schumacher limped to the pits. Schumacher won the championship. The stewards took no action.',
      hostNote: 'Schumacher did the same thing to Jacques Villeneuve in 1997, was found guilty of an unsportsmanlike act, and was excluded from the championship retrospectively. This was noted. The 1994 incident was not retrospectively reconsidered.'
    },

    // REAL_OK (weird but legal)
    {
      id: 'r1-016',
      sport: 'athletics',
      description: 'Dick Fosbury won the 1968 Olympic high jump gold medal by going over the bar backwards, head first, arching his back. Every previous Olympic champion had gone over face-down.',
      type: 'REAL_OK',
      reveal: 'Real, and entirely legal. He had invented this technique himself. Nobody else used it at the time. The technique is now called the Fosbury Flop and is used by every high jumper at every level. He was a 21-year-old engineering student.',
      hostNote: 'He thought of it in high school in Oregon. The fact that going over head-first and landing on your neck had been dismissed as dangerous and idiotic by coaches for decades turned out to be an oversight.'
    },
    {
      id: 'r1-017',
      sport: 'swimming',
      description: 'Eric "The Eel" Moussambani swam the 100m freestyle at the Sydney 2000 Olympics in 1 minute 52.72 seconds — more than twice the qualifying time — and was cheered to the finish by the entire stadium.',
      type: 'REAL_OK',
      reveal: 'Real. He was from Equatorial Guinea and had learned to swim eight months before the Olympics, in a hotel pool with no lane markers. His two heat opponents were both disqualified for false starts, leaving him to swim alone. The crowd went insane.',
      hostNote: 'His time was faster than the world record — the world record of 1900. He finished the race. The stadium gave him a standing ovation. He did not qualify for the final.'
    },
    {
      id: 'r1-018',
      sport: 'athletics',
      description: 'Cliff Young, a 61-year-old Australian potato farmer wearing overalls and rubber gumboots, entered the 1983 Sydney to Melbourne ultramarathon and won it.',
      type: 'REAL_OK',
      reveal: 'Real. The race was 875km. Professional athletes laughed at him at the start. He ran in a shuffling style without sleeping, covering distances at night while his competitors slept. He crossed the finish line 10 hours ahead of the next finisher. He gave the entire prize money away.',
      hostNote: 'He said he had chased sheep on the farm for days at a time without sleeping. This turned out to be relevant. Elite ultramarathon runners now use his shuffle technique. It is called the Cliffy Young Shuffle.'
    },
    {
      id: 'r1-019',
      sport: 'shooting',
      description: 'Hungarian shooter Karoly Takacs won the Olympic rapid-fire pistol event in 1948 and 1952. He had trained with his non-dominant hand for ten years after his dominant hand was blown off by a grenade.',
      type: 'REAL_OK',
      reveal: 'Real. His right hand was destroyed in 1938 by a faulty grenade during army training. He was the world champion with that hand. He spent ten years teaching himself to shoot with his left. He won gold in London 1948 and Helsinki 1952.',
      hostNote: 'He did not mention the hand at the 1938 world championships. He arrived, was told competitors with one hand were not allowed, and left. He came back ten years later, with the other hand, and won.'
    },
    {
      id: 'r1-020',
      sport: 'cricket',
      description: 'Robbie Fowler celebrated scoring against Everton in 1999 by getting on his hands and knees and appearing to snort the touchline.',
      type: 'REAL_OK',
      reveal: 'Real, and it was football not cricket — Fowler was a Liverpool striker. He was protesting a newspaper story accusing him of cocaine use. UEFA fined him £900 for the gesture. He considered it worth it.',
      hostNote: 'The gesture was about cocaine. The fine was for the gesture. Fowler went on to score the second goal. Liverpool won 3-2. Everton had no comment on the touchline\'s purity.'
    },
    {
      id: 'r1-021',
      sport: 'football',
      description: 'Sunderland manager Gus Poyet was sacked while appearing live on Match of the Day. He learned about his dismissal from a statement read to him on air.',
      type: 'REAL_OK',
      reveal: 'Real. A Sunderland statement was released during the interview. The presenter read it to him. He sat in silence for a moment. He then continued discussing Sunderland\'s form.',
      hostNote: 'He had been manager for 18 months. His last game was a 0-4 loss to Aston Villa. The statement was read to him on national television. He took this with more composure than most people would manage.'
    },
    {
      id: 'r1-022',
      sport: 'football',
      description: 'A Premier League match in 1997 was abandoned in the second half when the floodlights failed at Upton Park. This subsequently led to an FA inquiry about match-fixing.',
      type: 'REAL_CHEATING',
      reveal: 'Real. West Ham vs Crystal Palace. The lights failed at 2-2 in the 64th minute. A Malaysian betting syndicate had placed large bets on the match not completing. Three people were eventually convicted of conspiracy to corrupt. The betting was the point. The lights were the mechanism.',
      hostNote: 'The mechanism was someone going to a switchbox and turning it off. The sophistication of the operation is perhaps overstated.'
    },
    {
      id: 'r1-023',
      sport: 'football',
      description: 'Eric Cantona reacted to being sent off against Crystal Palace in 1995 by leaping over the advertising hoardings and kung-fu kicking a fan who had been shouting abuse at him.',
      type: 'REAL_CHEATING',
      reveal: 'Real. The fan, Matthew Simmons, had run down twenty-two rows of seats to get closer. The kick landed. Cantona was banned for nine months, charged with common assault, and ordered to do community service coaching schoolchildren. He described the fan as a "hooligan." Simmons was subsequently banned from football for a year after assaulting a referee.',
      hostNote: 'He kicked him in the chest. In front of approximately twenty-seven thousand people and seventeen cameras. He then punched him. He then sat down. He then composed himself and walked away with what can only be described as dignity.'
    },

    // INVENTED
    {
      id: 'r1-024',
      sport: 'cricket',
      description: 'Phil Tufnell was once asked to leave a county championship match at Lord\'s after falling asleep in the deep mid-wicket position between deliveries, during play.',
      type: 'INVENTED',
      reveal: 'Made up — but Phil Tufnell was sent home from the 1991-92 Ashes tour for what were described as "attitude and discipline problems." He also spent time in a psychiatric unit during the 1994-95 tour of Australia. Sleeping at Lord\'s specifically is, so far as records show, unverified.',
      hostNote: 'Not real. Phil Tufnell\'s actual history is sufficiently extraordinary that this feels real, which is itself a notable achievement.'
    },
    {
      id: 'r1-025',
      sport: 'golf',
      description: 'A golfer at the 2003 US Open successfully petitioned for a free drop after claiming that a bee had flown into his left ear at the precise moment of impact, altering his swing path. The rules official confirmed the relief.',
      type: 'INVENTED',
      reveal: 'Made up. There is no provision in the Rules of Golf for bees. There is provision for "natural objects including insects" as loose impediments if on the putting green, but not during the backswing.',
      hostNote: 'Not real. Though the rulebook\'s relationship with insects is genuinely complicated and a full reading is not recommended before bedtime.'
    },
    {
      id: 'r1-026',
      sport: 'snooker',
      description: 'A World Championship qualifier in Sheffield was interrupted in 2014 when a competitor\'s dog walked onto the table during a break of 134, scattering three of the remaining red balls.',
      type: 'INVENTED',
      reveal: 'Made up. Dogs are not permitted in the Crucible, or in the qualifying venue. The table is also elevated.',
      hostNote: 'Not real. The detail about the three reds is doing heavy lifting. A dog with good positioning could theoretically improve the table for the player. This has not been tested.'
    },
    {
      id: 'r1-027',
      sport: 'athletics',
      description: 'A competitor in the 2019 Chicago Marathon was disqualified after it emerged he had been drafting directly behind a peloton of cyclists for seventeen kilometres.',
      type: 'INVENTED',
      reveal: 'Made up. There are no cyclists in the Chicago Marathon. There is a race director, several pace vehicles, and approximately forty-five thousand runners. None of them are on bikes.',
      hostNote: 'Not real. The image of a man running behind a peloton for seventeen kilometres — visibly, in broad daylight, in front of two million spectators — and being caught only after the race is, however, very satisfying.'
    },
    {
      id: 'r1-028',
      sport: 'tennis',
      description: 'A player at the 2007 Australian Open requested that a line judge hold their racquet for thirty seconds during a service game on the grounds that the handle was excessively warm and affecting their grip.',
      type: 'INVENTED',
      reveal: 'Made up. There is no provision in ITF rules for racquet-temperature delegation. The line judge\'s duties do not include thermal racquet management.',
      hostNote: 'Not real. Though the Australian sun does reach temperatures at which this request would be understandable. The line judge, however, has other responsibilities.'
    },
    {
      id: 'r1-029',
      sport: 'football',
      description: 'Wayne Rooney submitted a written grievance to the Football Association in 2008 about an offside decision made against Manchester United in 1994, citing "ongoing psychological injury." The FA acknowledged receipt.',
      type: 'INVENTED',
      reveal: 'Made up. Wayne Rooney was eight years old in 1994. He has not, to public knowledge, submitted retrospective grievances to the FA regarding matches predating his senior career.',
      hostNote: 'Not real. Though it does capture something accurate about Wayne Rooney\'s relationship with officials and with time.'
    },
    {
      id: 'r1-030',
      sport: 'cycling',
      description: 'A team in the 2016 Tour de France successfully argued in a post-stage protest that gravity constituted outside assistance during their lead rider\'s crash on Col du Tourmalet, requesting a time adjustment.',
      type: 'INVENTED',
      reveal: 'Made up. Gravity is not recognised by UCI regulations as "outside assistance." It is, however, universally present and makes no exceptions for Tour de France riders.',
      hostNote: 'Not real. The lawyers who would have to argue this case in front of the UCI stewards deserve some sympathy. The argument is not without internal logic.'
    },
    {
      id: 'r1-031',
      sport: 'basketball',
      description: 'NBA referee Tim Donaghy bet on games he was officiating, including games in which his own calls directly affected the outcome, from 2005 to 2007.',
      type: 'REAL_CHEATING',
      reveal: 'Real. He pleaded guilty to federal charges in 2007. He was sentenced to fifteen months in prison. He also provided information about referee culture across the league. David Stern called it "the worst thing that has ever happened" to the NBA.',
      hostNote: 'He bet on games he was refereeing. He then refereed them. He then bet on more games. He was caught after two years. The NBA\'s internal systems did not catch him. The FBI did.'
    },
    {
      id: 'r1-032',
      sport: 'motor-racing',
      description: 'Nelson Piquet Jr. deliberately crashed his Renault at the 2008 Singapore Grand Prix on instructions from his team manager, triggering a safety car that benefited his team-mate Fernando Alonso.',
      type: 'REAL_CHEATING',
      reveal: 'Real. Crashgate. Piquet Jr. confessed after being dropped by Renault. Flavio Briatore, the team principal, was banned from Formula One for life (later overturned on legal grounds). Pat Symonds was banned for five years. Alonso kept the win.',
      hostNote: 'He drove into a wall on purpose. The team had identified the exact wall and the exact lap. Alonso won. It later emerged Alonso may not have known. He benefited regardless.'
    },
    {
      id: 'r1-033',
      sport: 'figure-skating',
      description: 'At the 2002 Salt Lake City Winter Olympics, a French judge voted for the Russian pair in ice dancing despite scoring them below the Canadian pair, after pressure from the Russian skating federation. The French Olympic Committee later admitted the fix.',
      type: 'REAL_CHEATING',
      reveal: 'Real. Marie-Reine Le Gougne admitted she had been pressured. The Russian pair Sale and Pelletier received gold. The Canadians were awarded a duplicate gold after the scandal broke. The French judge was suspended. The Russian federation denied everything.',
      hostNote: 'She said she had been pressured before the event to vote a certain way. She then voted that way. She then cried. The Russians won. The Canadians also won. Two sets of gold medals were awarded. Figure skating revised its entire judging system.'
    },
    {
      id: 'r1-034',
      sport: 'football',
      description: 'Roy Keane tackled Alf-Inge Haaland in a 2001 Manchester derby, causing a knee injury that ended Haaland\'s career, and later wrote in his autobiography that he had planned the tackle deliberately as revenge for a previous incident.',
      type: 'REAL_CHEATING',
      reveal: 'Real. Keane wrote about it openly. He was fined £150,000 and banned for five games after the autobiography was published, retroactively, two years later. He expressed no particular regret.',
      hostNote: 'He wrote about it in his autobiography. This is the sporting equivalent of confessing to a crime and then publishing the confession. He was punished for the autobiography, not the tackle. The autobiography sold very well.'
    },
    {
      id: 'r1-035',
      sport: 'football',
      description: 'Zinedine Zidane headbutted Marco Materazzi in the chest in the 110th minute of the 2006 World Cup final, resulting in a red card in what proved to be the last act of his professional career.',
      type: 'REAL_CHEATING',
      reveal: 'Real. Materazzi had said something. Multiple lip-readers and Materazzi himself eventually confirmed it was a reference to Zidane\'s sister. Zidane said: "I do not regret it at all." France lost on penalties. Zidane received the Golden Ball as tournament\'s best player anyway.',
      hostNote: 'He headbutted a man in the chest. In the World Cup final. In his last professional match. He was voted the tournament\'s best player. Zidane walked off, retired, managed Real Madrid, won the Champions League three times. Materazzi is remembered for something he said.'
    },
    {
      id: 'r1-036',
      sport: 'boxing',
      description: 'Mike Tyson bit off a piece of Evander Holyfield\'s ear during the third round of their WBA Heavyweight Championship rematch in 1997.',
      type: 'REAL_CHEATING',
      reveal: 'Real. He bit off approximately one inch of Holyfield\'s right ear. He spat it onto the canvas. The piece was recovered and reportedly kept in a jar. Tyson was disqualified. Holyfield\'s ear required surgery.',
      hostNote: 'He bit it. Spat it out. Kept fighting. The referee, Mills Lane, stopped the fight. Tyson then attempted to bite Holyfield\'s other ear. The Nevada State Athletic Commission revoked his licence and fined him $3 million. The ear is still missing one inch.'
    },
    {
      id: 'r1-037',
      sport: 'football',
      description: 'Diego Costa was once booked for winking at a defender, the wink being deemed to constitute provocation under UEFA conduct rules.',
      type: 'INVENTED',
      reveal: 'Made up. Diego Costa was booked for many things. Winking is not currently listed as a bookable offence under Law 12, though "provoking an opponent" is. The wink itself has never been separately cited.',
      hostNote: 'Not real. Diego Costa\'s actual booking record is long enough that adding a wink charge would barely register.'
    },
    {
      id: 'r1-038',
      sport: 'darts',
      description: 'Phil "The Power" Taylor was found guilty of sexual assault in 2000 and given a conditional discharge. He continued to play professionally and won the World Championship again twice.',
      type: 'REAL_CHEATING',
      reveal: 'Real — the conviction is real. He was convicted in 2000. He received a conditional discharge. He did continue playing. He won the 2002 and 2004 World Championships after the conviction. This is largely absent from his BDO/PDC highlights packages.',
      hostNote: 'The PDC continued to call him "The Power" throughout. The trophy presentations continued. The crowds chanted. This information is real and not widely discussed in darts coverage.'
    },
    {
      id: 'r1-039',
      sport: 'football',
      description: 'Paul Gascoigne, while in Japan playing for Middlesbrough in 1995, reported to training two hours late, claiming he had been attacked by a "large luminous alien" near his apartment. The club fined him.',
      type: 'INVENTED',
      reveal: 'Made up. Paul Gascoigne was never at Middlesbrough in Japan in 1995; he joined Middlesbrough from Rangers in 1998. The alien detail is also invented. His actual documented incidents in Japan are non-existent as he never played there.',
      hostNote: 'Not real. The structure of it, however — Gazza, lateness, alien, fine — requires no suspension of belief.'
    },
    {
      id: 'r1-040',
      sport: 'cricket',
      description: 'South African wicketkeeper Mark Boucher sustained a career-ending eye injury during a fielding drill in 2012 when a bail flew off and struck his eye.',
      type: 'REAL_OK',
      reveal: 'Real. It was during a warm-up match before the first Test in Sri Lanka. A bail flew from the stumps during a practice session and struck his eye. He had emergency surgery. He never played Test cricket again. He was 35.',
      hostNote: 'A bail. During a warm-up. He had played 147 Tests. His career ended on a Wednesday afternoon in Sri Lanka during a drill no one was watching.'
    },
    {
      id: 'r1-041',
      sport: 'football',
      description: 'Luis Suárez bit Branislav Ivanović on the arm during a Premier League match in 2013, Giorgio Chiellini on the shoulder at the 2014 World Cup, and Otman Bakkal in 2010, making it three separate international biting incidents across four years.',
      type: 'REAL_CHEATING',
      reveal: 'Real. All three. Ivanović in April 2013 (10-match ban). Chiellini in June 2014 (9-match ban, banned from all football-related activities for four months). Bakkal in November 2010 (7-match ban). He said after each one that it would not happen again.',
      hostNote: 'Three bites. Three international incidents. Three press conferences. Each ban slightly longer than the previous one, as if there were a tariff. The trajectory suggests a fourth incident would require exile.'
    },
    {
      id: 'r1-042',
      sport: 'football',
      description: 'An FA Cup qualifying match in 2016 was abandoned after one of the goal nets was found to have been secretly cut at the back, causing multiple goals to be disallowed before the sabotage was discovered.',
      type: 'INVENTED',
      reveal: 'Made up. There is no record of a net-cutting sabotage in FA Cup qualifying. Net integrity is checked by officials before kickoff.',
      hostNote: 'Not real. The level of premeditation required — arriving at a ground, cutting a net, leaving, returning to watch the resulting chaos — is ambitious for non-league football. Though not impossible.'
    },
    {
      id: 'r1-043',
      sport: 'football',
      description: 'An Argentine football club\'s official scorer was banned for three seasons after it emerged he had been routinely crediting his nephew with goals that television replays showed were own goals.',
      type: 'INVENTED',
      reveal: 'Made up. Goal attribution disputes exist at club level, but a three-season ban for a scorer in this context is not documented.',
      hostNote: 'Not real. The beautiful detail is the nephew. This is not ambitious corruption. This is family.'
    },
    {
      id: 'r1-044',
      sport: 'cricket',
      description: 'During the 1932-33 Ashes "Bodyline" series, England captain Douglas Jardine specifically instructed Harold Larwood to bowl short-pitched deliveries at the Australian batsmen\'s bodies, causing such a diplomatic crisis that it threatened Anglo-Australian relations.',
      type: 'REAL_CHEATING',
      reveal: 'Real. The Australian board cabled the MCC calling it "unsportsmanlike." The MCC replied that they had "utmost confidence" in their captain. Four Australian batsmen were injured. Australia\'s Don Bradman averaged 56 for the series instead of his normal 99. England won. It was technically legal at the time. It was made illegal afterward.',
      hostNote: 'The MCC\'s cable in reply said they were "unable to recognise" that Bodyline was unsportsmanlike. They then quietly changed the rules. This is diplomacy in action.'
    },
    {
      id: 'r1-045',
      sport: 'football',
      description: 'Juventus, AC Milan, Fiorentina, Lazio, and Reggina were all found to have influenced referee appointments in Italy\'s Calciopoli match-fixing scandal in 2006, resulting in Juventus being relegated to Serie B.',
      type: 'REAL_CHEATING',
      reveal: 'Real. Wiretap recordings of club officials calling the refereeing body. Juventus were stripped of their 2004-05 and 2005-06 titles and relegated. Milan, Fiorentina, and Lazio received points deductions. Several officials were banned.',
      hostNote: 'Juventus were stripped of two consecutive league titles. They then won Serie B, returned to Serie A, and won nine consecutive Serie A titles. The lesson drawn from this sequence of events is not entirely clear.'
    },

  ],

  // ── ROUND 2 ──────────────────────────────────────────────────────────────
  round2: [

    {
      id: 'r2-001',
      sport: 'football',
      setup: 'In the 1999 Ryder Cup at Brookline, Justin Leonard had just holed a 45-foot putt on the 17th to put the USA in a match-winning position. The US players were celebrating on the green. What happened next?',
      answer: 'José María Olazábal still had a putt of similar length to extend the match. The US players had run onto the green before he took it, trampling the putting line. Olazábal missed. The USA won the Ryder Cup. The European team complained about sportsmanship. The handshakes were tense.',
      hostNote: 'Seventeen players, their caddies, their wives, and various officials ran across the green while Olazábal had still to putt. When he missed, the USA\'s captain Ben Crenshaw said: "I\'m a big believer in fate." The European captain Mark James said other things.',
      teamBait: 'Keegan will say the Americans were just excited. Souness will call it an affront. Cox will explain that in terms of the linear distance between Olazábal\'s ball and the cup, the emotional disruption was a statistically meaningful factor.'
    },
    {
      id: 'r2-002',
      sport: 'cricket',
      setup: 'Ian Botham came to the crease for England at Headingley in 1981, with England following on, 135-7 in their second innings. England were still 92 behind. The match was expected to be over by lunch. What happened next?',
      answer: 'Botham scored 149 not out in approximately four hours, including 27 fours and one six. England declared. Bob Willis then took 8-43 bowling downhill into the wind. England won by 18 runs. Ladbrokes had been offering 500-1 against an England win the previous day. Several England players had checked out of their hotel.',
      hostNote: 'The odds were 500-1 the day before. A first-class cricketer — Dennis Lillee, as it turned out — put a tenner on England. The bookmakers initially refused to pay.',
      teamBait: 'Keegan will claim he was there. He was not there. Botham will come up in every cricket question and most non-cricket ones.'
    },
    {
      id: 'r2-003',
      sport: 'athletics',
      setup: 'At the 1992 Barcelona Olympics, British 400m runner Derek Redmond tore his hamstring in the semifinal with around 250 metres to go. He fell, got back up, and began hobbling to the finish. What happened next?',
      answer: 'His father, Jim Redmond, broke through security from the stands, ran onto the track, put his arm around his son, and helped him complete the race together. The crowd of 65,000 gave them a standing ovation. Derek crossed the line in tears. The time did not count. He has been asked about that race approximately once a week for thirty years.',
      hostNote: 'His father had watched him miss three previous Olympics through injury. He waited until his son was on the home straight, then made his decision. Security attempted to stop him. He outran them.',
      teamBait: 'Peterson will reframe this as a philosophical question about completion versus competition. Attenborough will narrate it.'
    },
    {
      id: 'r2-004',
      sport: 'swimming',
      setup: 'At the 2008 Beijing Olympics, Michael Phelps was attempting to win his eighth gold medal of the Games in the 100m butterfly. Entering the final turn, he was in seventh place. What happened next?',
      answer: 'He won by one hundredth of a second. His goggles had filled with water at the turn and he was swimming blind. He had counted his strokes and timed his final surge. Cavic touched the wall a fraction after Phelps. The photo showed it. Phelps won his eighth gold.',
      hostNote: 'His goggles filled with water and he swam the second half of the race blind. He counted strokes. He was in seventh at the turn. The one hundredth of a second difference was determined by a photo of wall-touches.',
      teamBait: 'Cox will note that the difference between first and second at this scale is quantum mechanical rather than athletic.'
    },
    {
      id: 'r2-005',
      sport: 'football',
      setup: 'Sunderland goalkeeper Jimmy Montgomery made a double save in the 1973 FA Cup final against Leeds United, first from Trevor Cherry\'s header and immediately after from Peter Lorimer\'s follow-up shot, which was at point-blank range. What happened next?',
      answer: 'Sunderland, Second Division, beat Leeds United, First Division champions, 1-0. It remains one of the greatest FA Cup final upsets in history. The save is considered one of the greatest ever made. Montgomery himself has said he still doesn\'t know how he got to Lorimer\'s shot.',
      hostNote: 'He dived, parried, got up, and somehow got a hand to the rebound. Leeds United won the title that year. They did not win the cup. A second-tier goalkeeper stopped them with his right hand from approximately three feet.',
      teamBait: 'Keegan: "unbelievable." Souness: specific technical analysis of the first parry. Cox: the physics of the second parry are inconsistent with reaction time.'
    },
    {
      id: 'r2-006',
      sport: 'golf',
      setup: 'At the 2016 Masters, Jordan Spieth entered the back nine of the final round with a five-shot lead. He then reached the 12th hole at Augusta. What happened next?',
      answer: 'He hit his tee shot into Rae\'s Creek. He re-teed and hit it into the creek again. He made a quadruple bogey seven on the par-3, taking the drop from an unusual position after discussions with officials while the world watched. Danny Willett won the Masters. Spieth shot 73.',
      hostNote: 'Five shots clear. Par three. Short hole. He put two balls in the water. The second ball went in from the re-tee. He then dropped from the wrong position, had a discussion with officials, and took a penalty. He finished tied second. Willett, who had been playing on another part of the course, won.',
      teamBait: 'Faldo will have technical opinions about the drop zone discussion. Cox will recalibrate the statistical improbability.'
    },
    {
      id: 'r2-007',
      sport: 'cycling',
      setup: 'Chris Froome was descending the Col de Peyresourde in the 2016 Vuelta a España when his bike broke. He had no spare bike. The team car was caught behind a crash. What happened next?',
      answer: 'He ran up the mountain in his cycling shoes, pushing other riders out of the way. He ran approximately one kilometre in cleated cycling shoes, uphill, in the race. He finished the stage. He won the Vuelta.',
      hostNote: 'He ran on cleats. Uphill. In a race. In cycling shoes. He finished. He won the overall race. The image of Chris Froome running up a mountain in his cycling kit is among the more bizarre in recent sporting history.',
      teamBait: 'Grylls will know exactly how far a person can run in cycling shoes. The answer will be higher than expected.'
    },
    {
      id: 'r2-008',
      sport: 'snooker',
      setup: 'Ronnie O\'Sullivan was 10 frames to 9 ahead of Peter Ebdon in the 2005 World Championship quarter-final. Ebdon took 25 minutes to play one frame. The match was taking a very long time. What happened next?',
      answer: 'O\'Sullivan lost his composure, made multiple errors under the deliberate slow play, and ultimately lost the match 13-11. He described it as "like being put through a mangle." Ebdon\'s average shot time was measured. O\'Sullivan later questioned what snooker was for. Ebdon went on to lose the semifinal.',
      hostNote: 'One frame took 25 minutes. O\'Sullivan visibly disintegrated. He said afterward: "He knows what he\'s doing." He was not wrong.',
      teamBait: 'Cox will calculate the number of possible shot permutations in snooker and note that 25 minutes is technically within normal decision-making parameters.'
    },
    {
      id: 'r2-009',
      sport: 'football',
      setup: 'In the 2005 Champions League Final in Istanbul, AC Milan led Liverpool 3-0 at half time. Liverpool manager Rafael Benítez went to the dressing room. What happened next?',
      answer: 'Liverpool scored three goals in six minutes in the second half — Gerrard, Smicer, Alonso from a rebound — to make it 3-3. The match went to extra time. AC Milan hit the post. Liverpool won on penalties. It is known as the Miracle of Istanbul.',
      hostNote: 'Three goals in six minutes. From 3-0 down. In a European Cup final. Dietmar Hamann, who had started on the bench, was brought on at half-time and played a central role. Half the AC Milan squad appeared to be operating in a state of confusion for the entire second half.',
      teamBait: 'Keegan will say it was the greatest comeback in football history. Souness will say it shouldn\'t have been necessary.'
    },
    {
      id: 'r2-010',
      sport: 'athletics',
      setup: 'Paula Radcliffe was on world record pace during the 2004 Athens Olympic marathon, the race she had been preparing for her entire career. At approximately the 36km mark, she stopped. What happened next?',
      answer: 'She sat by the roadside and cried. She had been suffering from quadriceps problems. She could not continue. She did not finish. She won no medal. She then won the 2004 New York Marathon three months later in a course record.',
      hostNote: 'She sat down on the pavement on a main road in Athens and cried while the race continued past her. She had been the favourite. She did not finish. Three months later she ran 2:23:10 in New York.',
      teamBait: 'Peterson will frame this as an existential choice between pain and completion.'
    },
    {
      id: 'r2-011',
      sport: 'cricket',
      setup: 'South Africa needed 1 run to win off 13 balls in the 1999 Cricket World Cup semifinal. Lance Klusener hit a boundary. South Africa needed 0 runs to win off 8 balls. What happened next?',
      answer: 'Klusener hit a single, called for a run, his partner Allan Donald failed to run initially, then ran, was caught short of his ground, and South Africa tied the match. Australia went through on run rate. South Africa were eliminated. Donald had not picked up his bat at the start of the run.',
      hostNote: 'One to win. Eight balls left. A boundary. Then a tie. Then out. Donald started running, stopped, dropped his bat, started running again, and was run out. Australia progressed to the final on run rate. South Africa have not been in a World Cup final since.',
      teamBait: 'Cox will attempt to calculate the probability of this sequence of events occurring.'
    },
    {
      id: 'r2-012',
      sport: 'athletics',
      setup: 'At the 2016 Rio Olympics, runner Abbey D\'Agostino fell during the 5000m heat and injured her knee. Her competitor Nikki Hamblin had also fallen. D\'Agostino stopped to help Hamblin up. D\'Agostino then found she could not run. What happened next?',
      answer: 'Hamblin turned back and helped D\'Agostino to the finish line. Both finished. Both were eliminated from the competition. Both received the Pierre de Coubertin Medal for sportsmanship. D\'Agostino\'s injury was diagnosed as a torn ACL. She had run 2km on it.',
      hostNote: 'She stopped to help someone else up. She then needed help herself. She ran two kilometres with a torn ACL. She did not qualify. She received the sportsmanship medal. The sportsmanship medal was the correct outcome. It is the correct outcome almost never.',
      teamBait: 'Grylls will note that running two kilometres on a torn ACL is technically possible. Attenborough will narrate the moment of mutual assistance.'
    },
    {
      id: 'r2-013',
      sport: 'football',
      setup: 'Middlesbrough manager Aitor Karanka left the training ground in 2016 during a crisis of confidence and was absent for 48 hours. The squad continued to train without him. What happened next?',
      answer: 'The players voted to back him, sent a delegation to speak with him, and he returned. Middlesbrough went on to win the Championship and were promoted to the Premier League. Karanka was sacked the following season.',
      hostNote: 'He walked off. The squad voted. He came back. They won the league. He was then sacked for reasons that had nothing to do with the walk-off. The walk-off is still, arguably, his best tactical decision at the club.',
      teamBait: 'Keegan will not mention his own Newcastle walk-off. He never mentions it.'
    },
    {
      id: 'r2-014',
      sport: 'cricket',
      setup: 'Brian Johnston, BBC cricket commentator, was given a chocolate cake by a listener during a live Test Match Special broadcast. He was attempting to describe play and eat cake simultaneously. What happened next?',
      answer: 'He collapsed into extended uncontrollable laughter on air when Jonathan Agnew described how Ian Botham had "just failed to get his leg over" the stumps trying to avoid a run out. The phrase combined with the cake was too much. Johnston laughed for approximately ninety seconds without being able to broadcast. The audio is among the most replayed moments in BBC radio history.',
      hostNote: 'The "leg over" incident. Ninety seconds. On national radio. During a Test Match. He was eating a cake. Agnew started laughing too. Peter Baxter, the producer, considered intervening.',
      teamBait: 'Attenborough and Brian Johnston are from the same era. Attenborough will have an opinion.'
    },
    {
      id: 'r2-015',
      sport: 'football',
      setup: 'Charlton Athletic goalkeeper Sam Bartram stood in his penalty area in thick fog during a wartime league match in 1937. The fog had descended rapidly. He continued to guard his goal. He waited for the ball to arrive. What happened next?',
      answer: 'A policeman appeared out of the fog and informed him the match had been abandoned fifteen minutes earlier. All the other players and both teams had left the pitch. He had been standing alone in the fog for fifteen minutes, waiting.',
      hostNote: 'Fifteen minutes. Alone. In fog. He waited. A policeman came to tell him the match was over. The opposition had scored. His own team had left. Nobody told him.',
      teamBait: 'Cox will find something in this about the nature of observable reality. Grylls: survival-relevant — a goalkeeper in fog is a textbook disorientation scenario.'
    },
    {
      id: 'r2-016',
      sport: 'boxing',
      setup: 'Buster Douglas was a 42-1 underdog against Mike Tyson in February 1990. In the eighth round, Tyson knocked Douglas down with an uppercut. Douglas got up at the count of nine. What happened next?',
      answer: 'Douglas won. In the tenth round, he knocked Tyson down with a four-punch combination. Tyson tried to put his mouthguard back in using his gloves. He could not get up at ten. Douglas won by KO. Don King immediately protested the knockdown count had been slow. The protest was rejected.',
      hostNote: 'He got up at nine. He then knocked out the most feared heavyweight in history. Tyson was on the canvas trying to put his mouthguard back in. It was the biggest upset in heavyweight boxing history. Don King\'s first action was to contest the slow count from the previous round.',
      teamBait: 'Cox: "The probability of this outcome was not actually 42-1." Tufnell: "unbelievable." Keegan: "I said he could do it." He did not say he could do it.'
    },
    {
      id: 'r2-017',
      sport: 'football',
      setup: 'Manchester City goalkeeper Bert Trautmann played the last fifteen minutes of the 1956 FA Cup Final against Birmingham City despite taking a collision that left him in significant pain. Manchester City won 3-1. What happened next?',
      answer: 'Three days later, an X-ray revealed that Trautmann had broken his neck. He had played fifteen minutes of an FA Cup final with a broken neck. He had made several key saves during that time. He was voted Footballer of the Year that year.',
      hostNote: 'Broken neck. Fifteen minutes. Final. Won. Voted Player of the Year. The collision had dislocated a vertebra. He had pushed it back into alignment by moving his head. He thought he had cricked his neck.',
      teamBait: 'Grylls will have a technical view on spinal injuries and continued athletic performance. The view will involve something about adrenaline.'
    },
    {
      id: 'r2-018',
      sport: 'tennis',
      setup: 'John McEnroe was serving to stay in the fourth set against Ivan Lendl at the 1984 French Open final. He was two sets to one up and serving to stay in the match. What happened next?',
      answer: 'He double-faulted on set point. He then lost the match, 3-6, 2-6, 6-4, 7-5, 7-5. It remains one of the greatest collapses in Grand Slam history. He was widely considered the best player in the world that year. He never won the French Open.',
      hostNote: 'He double-faulted. On set point. With the lead. In the French Open final. He had been two sets up against the only opponent who could beat him on clay. He never reached another French Open final.',
      teamBait: 'Cox: statistical analysis of double fault probability under pressure. Amstell: the McEnroe wound is very well documented.'
    },
    {
      id: 'r2-019',
      sport: 'cricket',
      setup: 'During a World Cup match between England and Bangladesh in 2011, England were chasing 226 runs and appeared to be progressing well. With 2 balls remaining, England needed 2 runs to win. What happened next?',
      answer: 'Shakib Al Hasan conceded only 1 run in 2 balls. England needed 2 off the last, got 1, and tied the match. Bangladesh won by 1 run on Duckworth-Lewis. England were eliminated from the group stage. It became known as one of the most embarrassing cricket results in England\'s history.',
      hostNote: 'Two runs. Two balls. England needed two. They got one. Bangladesh beat England at a World Cup. England went home.',
      teamBait: 'Tufnell: he played in the era when this would have been unthinkable and is fully aware the world has changed.'
    },
    {
      id: 'r2-020',
      sport: 'football',
      setup: 'In the 2012 Premier League season, Manchester City and Manchester United were level on points going into the last day of the season. City needed to beat QPR at home to win the title. At 90 minutes, City were losing 2-1. What happened next?',
      answer: 'Edin Džeko scored in the 92nd minute. Sergio Agüero scored in the 94th minute. City won 3-2. United had finished their game against Swindon. City won the Premier League title on goal difference. The commentator Martin Tyler shouted "Agueroooo" for approximately six seconds. City had not won the league since 1968.',
      hostNote: 'Two goals. Added time. Against QPR. While United were watching. 44 years. Sergio Agüero. The celebrations lasted longer than the goals.',
      teamBait: 'Keegan was involved with Manchester City. He will have feelings. Souness: QPR should have held on. Cox: the probability of two goals in the final two minutes was — significant.'
    },
    {
      id: 'r2-021',
      sport: 'golf',
      setup: 'Jean van de Velde needed only a double bogey at the 18th hole of the 1999 Open Championship at Carnoustie to win. The hole is a par four. He stood on the tee with a three-shot lead. What happened next?',
      answer: 'He hit his drive into the rough. He hit his second shot, which bounced off the grandstand railing and went into deep rough. He then waded into the Barry Burn water hazard in his trousers and appeared to consider playing from the water. He decided not to play from the water. He took a drop. He made a triple bogey and tied. He lost the playoff to Paul Lawrie. Lawrie had been ten shots back at the start of the final round.',
      hostNote: 'He took off his shoes. He waded in. He considered it. He decided against it. He dropped. He made seven. Paul Lawrie, who had not led the tournament at any point during the week, won the Claret Jug.',
      teamBait: 'Faldo will have strong views. He always has strong views about Open collapses. Especially ones that are not about Nick Faldo.'
    },
    {
      id: 'r2-022',
      sport: 'athletics',
      setup: 'In the 1908 London Olympic marathon, Italian runner Dorando Pietri entered the Olympic Stadium first, in first place, on the final stretch. He had 385 yards to run. What happened next?',
      answer: 'He collapsed four times in the stadium. Officials helped him to his feet each time and assisted him across the finish line. He was disqualified because the officials had touched him. John Hayes, the American who was second, was awarded gold. Queen Alexandra gave Pietri a special gold cup the next day for courage. The marathon distance of 26.2 miles was partly set to allow the race to finish in front of the Royal Box, accounting for these last 385 yards.',
      hostNote: 'Four falls. Officials carried him. Disqualified for receiving assistance. The Americans protested. The gold went to America. The Queen gave him a cup. The 26.2 mile distance exists partly because of where the Royal Box was in 1908.',
      teamBait: 'Cox: the marathon distance is technically arbitrary. Attenborough: observational.'
    },
    {
      id: 'r2-023',
      sport: 'football',
      setup: 'Eric Cantona was walking to the changing room at Selhurst Park in January 1995 after being sent off for a kick at Crystal Palace\'s Richard Shaw. The referee had asked him to leave. He was walking along the touchline. What happened next?',
      answer: 'A Crystal Palace supporter named Matthew Simmons ran down twenty-two rows of seats and shouted abuse at Cantona. Cantona leaped over the advertising hoardings and kick-punched him twice. He was banned for nine months, fined, sentenced to community service, and given a press conference at which he said only: "When the seagulls follow the trawler, it is because they think sardines will be thrown into the sea."',
      hostNote: 'The kung-fu kick. Followed by the most famous press conference statement in football history. He attended the press conference in a suit, said one sentence, stood up, and left. The room took approximately forty-five seconds to realise it was over.',
      teamBait: 'Keegan: "the fans shouldn\'t have said what they said." Souness: "you cannot do that, whatever is said to you." Cox: the sardine line is technically a complete non sequitur and also correct.'
    },
    {
      id: 'r2-024',
      sport: 'cricket',
      setup: 'England needed 1 run off the last ball to tie the 1987 Cricket World Cup final against Australia. Mike Gatting was on strike. He was facing Allan Border. What happened next?',
      answer: 'Gatting attempted a reverse sweep, got an edge onto his shoulder, and the ball was caught. Australia won by 7 runs. Gatting had not needed to play an expansive shot to win or tie the match. The reverse sweep has been cited ever since as one of the worst shot selections in World Cup history.',
      hostNote: 'England needed one. One run. Off the last ball. He played a reverse sweep. A reverse sweep. To win the World Cup. It went to his shoulder and was caught.',
      teamBait: 'Tufnell: he played in the era directly after this. It is still talked about.'
    },
    {
      id: 'r2-025',
      sport: 'athletics',
      setup: 'In the 1976 Montreal Olympics, Japanese gymnast Shun Fujimoto sustained a fractured kneecap during the floor exercise. The Japanese team were in contention for the gold medal. What happened next?',
      answer: 'He did not tell anyone about the fracture. He then performed on the pommel horse, the rings, and — knowing the dismount would cause him severe injury — dismounted from the rings with a full twist. He stuck the landing, scoring 9.7. He then collapsed. Japan won the gold medal. He did not compete again at the Games.',
      hostNote: 'Broken kneecap. Dismount from rings with a full twist. Stuck it. Collapsed. Gold medal. He did not tell his coach because the team needed the score.',
      teamBait: 'Grylls: the operational logic here is sound. If you\'re going to do it, land it. Peterson: the stoicism is structurally correct.'
    },
    {
      id: 'r2-026',
      sport: 'rugby',
      setup: 'England rugby player Matt Dawson chipped ahead during the 2003 World Cup final in Sydney with only seconds of normal time remaining. England needed a drop goal from Jonny Wilkinson. The clock was over 100 minutes. What happened next?',
      answer: 'Wilkinson received the ball, dropped it onto his right foot — his weaker foot — and put it through the posts with twenty seconds remaining. England won 20-17 in extra time. It was Wilkinson\'s first drop goal attempt of the match.',
      hostNote: 'His weaker foot. Twenty seconds remaining. After 100 minutes. In Australia. Against Australia. He says he can\'t explain why it went right foot. It went between the posts.',
      teamBait: 'Tufnell: he watched this. Grylls: the drop goal decision matrix under pressure.'
    },
    {
      id: 'r2-027',
      sport: 'boxing',
      setup: 'Rocky Marciano had never been knocked down in his professional career. In 1953, Jersey Joe Walcott landed a left hook in their world title fight that knocked Marciano to the canvas for the first time in his career. What happened next?',
      answer: 'Marciano got up, charged Walcott, and knocked him out with a single right hand in the same round, the thirteenth. The punch is called "The Suzie Q." Walcott\'s trainer threw in the towel while Walcott was still falling.',
      hostNote: 'Knocked down for the first time in his career, round thirteen. Got up. Knocked Walcott out with a single punch. The trainer threw in the towel before the referee could count. Marciano finished his career 49-0.',
      teamBait: 'Cox: probability. Keegan: "what a fighter." Grylls: physical recovery time analysis.'
    },
    {
      id: 'r2-028',
      sport: 'football',
      setup: 'During a Liverpool v Arsenal match in 1989, Arsenal were away at Anfield needing to win by two goals to win the First Division title. With one minute of the 90 remaining, Arsenal were 1-0 up. What happened next?',
      answer: 'Michael Thomas scored in the last minute of the last match of the season to give Arsenal a 2-0 win and the title on goal difference. The commentary from Brian Moore included "It\'s up for grabs now!" followed by Thomas scoring. Liverpool manager Kenny Dalglish was standing in the Anfield technical area as Arsenal celebrated.',
      hostNote: 'The last minute. The last match. Of the last day. At Anfield. Arsenal scored to win the title by a goal difference. The Liverpool manager watched it happen from ten metres away.',
      teamBait: 'Keegan: extremely specific Liverpool feelings. Souness: he played for Liverpool. Also has feelings.'
    },
    {
      id: 'r2-029',
      sport: 'skiing',
      setup: 'Franz Klammer was in last place starting position at the 1976 Innsbruck Olympics downhill, with the home crowd expecting him to win gold. He was behind the leader\'s time at several checkpoints. What happened next?',
      answer: 'He threw caution away completely, skiing on the absolute limit of control — many observers thought he was about to crash for most of the run — and won gold by 33 hundredths of a second. It is considered the greatest Olympic downhill run in history.',
      hostNote: 'He appeared to be out of control for most of the run. He was not quite out of control. The margin is very small. He won by a third of a second from nearly crashing six times.',
      teamBait: 'Grylls: close to his area. The decision to accelerate when you appear to be crashing is counterintuitive and correct. Cox: a fascinating case of controlled chaos.'
    },
    {
      id: 'r2-030',
      sport: 'athletics',
      setup: 'Norway\'s Grete Waitz entered the 1978 New York Marathon as her first-ever marathon, not knowing how far a marathon was. She had never run further than 12 miles in training. At the 20-mile mark, she was in the lead. What happened next?',
      answer: 'She finished, set a world record, and immediately told her husband she would never run another marathon because her body was in such pain. She ran the New York Marathon eight more times. She won nine of them.',
      hostNote: 'She won it. She said never again. She won it eight more times. She set the world record in her first marathon, having not known the distance in advance.',
      teamBait: 'Cox: the decision-making process of "never again" followed by nine repetitions is worth modelling. Peterson: this is the correct outcome of the right commitment architecture.'
    },

  ],

  // ── ROUND 3 ──────────────────────────────────────────────────────────────
  round3: [

    {
      id: 'r3-001',
      incident: 'The Hand of God',
      sport: 'football',
      year: 1986,
      clue1: 'A goal that ended an international football team\'s World Cup in Mexico City, in June 1986. The scorer later described it as having two authors.',
      clue2: 'The two authors named were: a divine figure, and a man who was five foot five and had just won a tackle he shouldn\'t have. The referee was standing close enough to see both of them clearly.',
      clue3: 'The method was a fist. The direction was upward. The ball entered the net. The referee gave the goal. England were eliminated.',
      answer: 'The Hand of God — Maradona v England, 1986 World Cup quarter-final.',
      hostNote: 'The phrase "the hand of God" has been used to describe fourteen other sporting events since 1986. None of them involve God\'s hand.'
    },
    {
      id: 'r3-002',
      incident: 'The Rumble in the Jungle',
      sport: 'boxing',
      year: 1974,
      clue1: 'A heavyweight championship fight in 1974, held in a country that no longer exists under that name, between two men who did not need surnames to be identified.',
      clue2: 'One man was universally expected to win by destruction. The other had won a gold medal at the 1960 Rome Olympics and had not lost since. The one expected to win was twenty-five.',
      clue3: 'The underdog spent eight rounds absorbing punishment on the ropes, allowing his opponent to exhaust himself, then knocked him out in the eighth. He had been 8-1 against. He had planned every second.',
      answer: 'The Rumble in the Jungle — Muhammad Ali defeats George Foreman in Kinshasa, Zaire. The rope-a-dope.',
      hostNote: 'He told no one about the rope-a-dope. He told his corner to let him absorb the punches. His corner thought he had lost his mind. He had not.'
    },
    {
      id: 'r3-003',
      incident: 'Botham\'s Ashes / Headingley 1981',
      sport: 'cricket',
      year: 1981,
      clue1: 'A Test match in Leeds in 1981 in which England were required to follow on, had odds quoted against them of 500-1, and in which several members of the England team checked out of their hotel.',
      clue2: 'A single innings of 149 not out, including 27 fours, changed the course of the match. The scorer had been dropped from the captaincy three weeks earlier and had scored 0 and 0 in his previous two innings.',
      clue3: 'The next morning, a bowler took 8-43 bowling downhill with the wind. England won by 18 runs. The Ladbrokes odds were printed on the scoreboard during the match.',
      answer: 'Botham\'s Ashes — Headingley 1981. Ian Botham 149 not out, Bob Willis 8-43.',
      hostNote: 'The bookmakers offered 500-1. A player bet on his own side. Several people made money. The Ashes were retained.'
    },
    {
      id: 'r3-004',
      incident: 'The Miracle of Istanbul',
      sport: 'football',
      year: 2005,
      clue1: 'A Champions League final in which a team was losing 3-0 at half time and their manager went to the dressing room and made a tactical change involving a player who had not started.',
      clue2: 'Three goals were scored in six minutes in the second half to level the match. The first came from a header at a set piece. The last came from a penalty rebound. None of the three goal-scorers were the team\'s recognised striker.',
      clue3: 'The match ended 3-3 after extra time. The winning team saved three penalties. The losing team hit the post. The match is known by a city name.',
      answer: 'The Miracle of Istanbul — Liverpool 3-3 AC Milan (Liverpool win on penalties), Champions League Final 2005.',
      hostNote: 'Hamann came on at half-time. Gerrard, Smicer, Alonso. Liverpool had been beaten comfortably for 45 minutes. They then scored three times in six minutes.'
    },
    {
      id: 'r3-005',
      incident: 'Bloodgate',
      sport: 'rugby',
      year: 2009,
      clue1: 'A sporting scandal from 2009 involving a player leaving the field with an injury that turned out to have been faked, to allow a different player to return to the field.',
      clue2: 'The mechanism was a blood capsule. A physio was involved in supplying it. A player bit down on it. The European Rugby Cup reviewed footage and found no original wound corresponding to the injury.',
      clue3: 'The club was Harlequins. The match was a European Cup quarter-final. The director of rugby was subsequently banned for three years. The player who bit the capsule was called Tom Williams.',
      answer: 'Bloodgate — Harlequins v Leinster, April 2009. Dean Richards banned for three years.',
      hostNote: 'The wound was a capsule. The physio made a cut to try to cover the capsule, during the review. The cut was discovered. This made things considerably worse.'
    },
    {
      id: 'r3-006',
      incident: 'Sandpapergate',
      sport: 'cricket',
      year: 2018,
      clue1: 'A ball-tampering scandal during a Test match in South Africa in 2018 in which a player was caught on camera concealing something in his trousers, having used it on the ball.',
      clue2: 'The item was sandpaper. The player was the team\'s opening batsman. The captain admitted at a press conference that the leadership group had devised the plan. The vice-captain was named as the architect.',
      clue3: 'Three players were banned. Two senior players each received twelve-month bans. The junior player received nine months. The coach resigned. The captain cried. The vice-captain did not.',
      answer: 'Sandpapergate — Australia v South Africa, Cape Town, March 2018. Steve Smith, David Warner, Cameron Bancroft.',
      hostNote: 'Bancroft concealed the sandpaper in his trousers when he noticed the camera. He then pulled out a yellow piece of tape instead. The camera showed both actions in sequence to approximately 40 million viewers.'
    },
    {
      id: 'r3-007',
      incident: 'The Battle of the Beanfield',
      sport: 'not-sport',
      year: 1985,
      clue1: 'A confrontation in 1985 in Wiltshire between police and a group of travelling people attempting to reach a monument for a free festival. Not a sporting event.',
      type: 'decoy',
      reveal: 'Not a sporting incident. The team gets points for correctly identifying this as a decoy — not a sporting moment. If they gave a sporting answer, no points.',
      hostNote: 'Use occasionally as a decoy round — presented without sport label. Tests whether team defaults to sport assumption.'
    },
    {
      id: 'r3-008',
      incident: 'The Rumble in the Jungle / The Thriller in Manila / The Thrilla in Manila',
      sport: 'boxing',
      year: 1975,
      clue1: 'A boxing match known by a three-word name in 1975, in which both fighters declared afterward that it was the closest they had come to death.',
      clue2: 'The fight went to the fourteenth round. One fighter\'s corner stopped the match to prevent their man going out for the last round, believing his eye was badly damaged. The other fighter said afterward he had wanted to quit at the same moment.',
      clue3: 'Both fighters were named Ali and Frazier. One threw in the towel. The other said he felt "next to death." He won. The city it was named after is in the Philippines.',
      answer: 'The Thrilla in Manila — Muhammad Ali vs Joe Frazier III, 1975.',
      hostNote: 'Ali said he was next to death. Frazier\'s corner stopped the fight. Both men were damaged. Ali won. He said the fight was "the closest thing to dying I know of."'
    },
    {
      id: 'r3-009',
      incident: 'Crashgate',
      sport: 'motor-racing',
      year: 2008,
      clue1: 'A Formula One race in 2008 in which a driver deliberately crashed his car into a barrier at a specific location on the circuit, triggering a safety car that benefited his team.',
      clue2: 'The crash was ordered by the team\'s management to allow the other team driver to pit at an advantageous time. The crashing driver later confessed after being dropped by the team.',
      clue3: 'The race was in Singapore. The driver was Piquet Jr. The team principal was Flavio Briatore. The driver who benefited was Fernando Alonso. The race was the first Singapore Grand Prix.',
      answer: 'Crashgate — 2008 Singapore Grand Prix. Renault. Piquet Jr. crashes deliberately to help Alonso win.',
      hostNote: 'The safety car came out at exactly the right time. Alonso was the only driver who had pitted. He won. The timing was exact. The subsequent investigation produced emails and evidence the team found it difficult to explain.'
    },
    {
      id: 'r3-010',
      incident: 'The Miracle on Ice',
      sport: 'ice-hockey',
      year: 1980,
      clue1: 'A team of college-age amateurs in 1980 defeated a professional team that had won the previous four Olympic gold medals and had not lost an Olympic game since 1968.',
      clue2: 'The game was played at the Lake Placid Winter Olympics. The favourites had beaten the underdogs 10-3 in an exhibition match a week before. At the start of the third period, the underdogs led 3-2.',
      clue3: 'The underdogs were Americans. The favourites were Soviet. The final score was 4-3. The American coach\'s name was Herb Brooks. It is named after a religious concept.',
      answer: 'The Miracle on Ice — USA 4-3 USSR, 1980 Lake Placid Winter Olympics.',
      hostNote: 'The Soviets had beaten them 10-3 one week before. The Americans were amateur. The Soviets were the best hockey team in the world. The Americans scored twice in the third period.'
    },
    {
      id: 'r3-011',
      incident: 'The Agony of Defeat / Val\'s Crash',
      sport: 'skiing',
      year: 1970,
      clue1: 'A ski jump fall so spectacular it became the opening image of a weekly American sports television programme for decades, used to illustrate the concept of sporting failure.',
      clue2: 'The skier was Vinko Bogataj, a Yugoslavian. The fall happened in 1970 at a World Cup event in Oberstdorf, Germany. He was not badly injured.',
      clue3: 'The programme was ABC\'s Wide World of Sports. Its opening narration included "the thrill of victory and the agony of defeat" over footage of his crash. He became famous in America. He had never been to America.',
      answer: 'Vinko Bogataj\'s fall — ABC Wide World of Sports opening sequence, "the agony of defeat."',
      hostNote: 'He became the most recognised sporting failure in America for thirty years. He had not watched the programme until he was invited to appear on it in 1981. He was completely fine after the fall.'
    },
    {
      id: 'r3-012',
      incident: 'Black Sox Scandal',
      sport: 'baseball',
      year: 1919,
      clue1: 'A sporting scandal from 1919 in which eight members of a professional team were paid to lose the sport\'s most important series. The team was named for a colour of hosiery.',
      clue2: 'The payment was arranged through a gambler named Arnold Rothstein. The amounts ranged from $5,000 to $10,000 per player. The players were acquitted at trial after key documents disappeared.',
      clue3: 'The team was the Chicago White Sox. The series was the World Series. All eight were banned for life. The most famous of them hit .375 in the series and his supporters argue he was trying to win. His name was Shoeless Joe Jackson.',
      answer: 'The Black Sox Scandal — 1919 World Series fix.',
      hostNote: 'Eight men. Acquitted. Then banned for life. The commissioner banned them even after the acquittal. His name was Kenesaw Mountain Landis. Nobody has had a better name for a sports administrator.'
    },
    {
      id: 'r3-013',
      incident: 'The Bodyline Series',
      sport: 'cricket',
      year: 1932,
      clue1: 'A Test cricket series from 1932-33 in which England\'s bowling strategy caused a diplomatic incident between two countries and led to a change in the laws of cricket.',
      clue2: 'The strategy was to bowl short-pitched deliveries at the body of the batsmen, with fielders positioned on the leg side to catch the defensive shots. The primary target was a player who averaged 99.94 in Tests.',
      clue3: 'The Australian board cabled the MCC calling the tactic "unsportsmanlike." The MCC replied with confidence in their captain. England won the Ashes. The tactic was made illegal. The captain was Douglas Jardine. The primary bowler was Harold Larwood.',
      answer: 'The Bodyline Series — England v Australia, 1932-33 Ashes. Douglas Jardine, Harold Larwood, Don Bradman.',
      hostNote: 'The MCC said they had utmost confidence in the captain. The captain\'s tactic was then made illegal. This is the cricketing version of "mistakes were made".'
    },
    {
      id: 'r3-014',
      incident: 'The Battle of Santiago',
      sport: 'football',
      year: 1962,
      clue1: 'A football match at the 1962 World Cup between two nations that had been engaged in a public war of words via newspapers in the days before the game. The referee was English.',
      clue2: 'In the first 12 minutes: one player was sent off, another had his nose broken, a player was kneed, and the police entered the field once. The BBC commentator described the match as "the most stupid, appalling, disgusting, and disgraceful exhibition of football."',
      clue3: 'The match was between Chile and Italy, in Chile. Chile won 2-0. The match is known by a city name that is also the site of a different famous battle. Two Italians were sent off.',
      answer: 'The Battle of Santiago — Chile v Italy, 1962 World Cup group stage.',
      hostNote: 'The BBC commentator said "disgraceful" four times in the same sentence. The referee allowed the match to continue for the full ninety minutes. Chile advanced.'
    },
    {
      id: 'r3-015',
      incident: 'The Underarm Incident',
      sport: 'cricket',
      year: 1981,
      clue1: 'A cricket incident from 1981 in which a captain instructed his brother to bowl the final ball of a one-day match in a way that was technically legal but led to immediate rule changes and a diplomatic incident.',
      clue2: 'The method was bowling the ball along the ground, underarm. New Zealand needed six runs off the last ball to tie. The New Zealand prime minister called it an act of cowardice. The Australian prime minister agreed.',
      clue3: 'The captain was Greg Chappell. The bowler was his brother Trevor. The batsman was Brian McKechnie, who dropped his bat and walked off. The match was a one-day international between Australia and New Zealand in Melbourne.',
      answer: 'The Underarm Incident — Greg Chappell, MCG, February 1981.',
      hostNote: 'The Australian prime minister condemned his own country\'s cricket captain. The ball rolled along the ground. McKechnie dropped his bat. The crowd booed. The rule was changed two weeks later.'
    },
    {
      id: 'r3-016',
      incident: 'The Battle of Stamford Bridge (football version)',
      sport: 'football',
      year: 'various',
      clue1: 'The name of a football ground in west London also shared by a Viking battle site in Yorkshire where King Harold defeated the Norwegian King Harald Hardrada in 1066, three weeks before the Battle of Hastings.',
      type: 'decoy',
      reveal: 'Historical/geography decoy. Stamford Bridge the football ground and Stamford Bridge the Viking battle are different places entirely. The team gets no sport points for identifying the Viking battle.',
      hostNote: 'Decoy. History masquerading as sport. Useful for testing whether the team distinguishes between the two.'
    },
    {
      id: 'r3-017',
      incident: 'The Thrilla in Manila',
      sport: 'boxing',
      year: 1975,
      clue1: 'A boxing match between two fighters who had each already beaten the other once, held in a city known for heat, humidity, and a local leader who attended ringside.',
      clue2: 'After thirteen rounds, one fighter\'s trainer stopped the fight to save his man from further punishment, despite that man\'s wishes. The man who won said afterward he had nearly quit at exactly the same moment.',
      clue3: 'The fight was the third between Muhammad Ali and Joe Frazier. It was held in Manila in 1975. Ali won. Both men said it was the hardest they\'d ever been hit. Ali described the experience as "next to death."',
      answer: 'The Thrilla in Manila — Ali v Frazier III, Philippines, 1975.',
      hostNote: 'This is a different fight from the Rumble in the Jungle. Both appear in this round. Teams that confuse them get no points. The difference: jungle = Foreman in Zaire; Manila = Frazier in Philippines.'
    },
    {
      id: 'r3-018',
      incident: '\'Shoegate\' / Fergie\'s Boot',
      sport: 'football',
      year: 2003,
      clue1: 'A post-match dressing room incident in 2003 in which a manager\'s reaction to a defeat caused an injury to a player that required stitches above his eye.',
      clue2: 'The mechanism was a boot. The boot was kicked. The boot hit a player rather than a surface. The player was one of the most famous players in the world at the time. He wore the injury publicly within days.',
      clue3: 'The manager was Sir Alex Ferguson. The player was David Beckham. The boot was aimed at laundry or the floor. It struck Beckham above the eye. Beckham appeared at a press conference showing the injury. He left Manchester United for Real Madrid at the end of that season.',
      answer: 'Shoegate — Sir Alex Ferguson kicks boot, hits David Beckham, Manchester United dressing room, February 2003.',
      hostNote: 'Ferguson said the boot "just flew up and hit him." Beckham went to his next public appearance with a cut above his eye and a carefully tilted fringe. He then moved to Madrid.'
    },
    {
      id: 'r3-019',
      incident: 'The 1994 World Cup Penalty Final',
      sport: 'football',
      year: 1994,
      clue1: 'A World Cup final in 1994 that ended with the most famous player of his generation missing a penalty to decide the tournament, in front of 90,000 people, after 120 goalless minutes.',
      clue2: 'The final score after 120 minutes was 0-0. No team had ever scored. The match was decided on penalties. The last penalty, which would have won the tournament for his country, was struck over the crossbar.',
      clue3: 'The player was Roberto Baggio. His country was Italy. The match was against Brazil. He skied his penalty over the bar. Italy lost. He stood with his hands on his hips. The image is one of the most famous in football history.',
      answer: 'The 1994 World Cup Final — Brazil v Italy, penalties. Roberto Baggio misses. Brazil win.',
      hostNote: 'He had scored five goals in the tournament. He had almost single-handedly got Italy to the final. He missed. He has been asked about the penalty in every interview he has given since 1994.'
    },
    {
      id: 'r3-020',
      incident: 'The Hurricane Higgins incident / Higgins threatens to have O\'Sullivan shot',
      sport: 'snooker',
      year: 2010,
      clue1: 'A snooker incident at a major tournament in 2010 in which a former world champion was heard making a threat involving a physical act against another player\'s family member.',
      clue2: 'The threat was overheard at a players\' meeting at the World Snooker Championship. The recipient was the reigning world number one. The threat was to bring someone to the venue and have harm done to a specific person.',
      clue3: 'The former world champion was Alex "Hurricane" Higgins. He said he would have Ronnie O\'Sullivan\'s father shot. O\'Sullivan\'s father was in prison at the time. Higgins was banned for the rest of the season and fined £20,000.',
      answer: 'Alex Higgins threatens to have Ronnie O\'Sullivan\'s father shot, World Snooker Championship 2010.',
      hostNote: 'Higgins said it out loud. At a meeting. He was 61. O\'Sullivan\'s father, who was serving a life sentence for murder, was unavailable for comment. Higgins died the following year.'
    },
    {
      id: 'r3-021',
      incident: 'Calciopoli',
      sport: 'football',
      year: 2006,
      clue1: 'A match-fixing scandal in 2006 in which telephone wiretaps revealed that multiple football clubs had been influencing referee appointments in Italy\'s top division.',
      clue2: 'Five clubs were found to be involved. The most successful club in Italian football history was relegated for the first time in their existence. The scandal broke in the same summer Italy won the World Cup.',
      clue3: 'Juventus were relegated to Serie B, stripped of two consecutive league titles, and docked points. AC Milan, Fiorentina, Lazio, and Reggina received smaller penalties. The scandal is called Calciopoli.',
      answer: 'Calciopoli — Italian football match-fixing scandal, 2006. Juventus relegated.',
      hostNote: 'Juventus were relegated. They won Serie B. They came back. They won nine consecutive Serie A titles. The question of whether this represented an appropriate level of consequence has been raised by several parties.'
    },
    {
      id: 'r3-022',
      incident: 'The Battle of Prenton Park',
      sport: 'football',
      year: 'invented',
      type: 'decoy',
      clue1: 'A fractious lower-league FA Cup match in 1987 in which seventeen players received yellow cards and the referee required a police escort from the pitch.',
      clue2: 'The trouble began after a disputed penalty in the 78th minute. A second referee was summoned from the crowd, having attended as a spectator.',
      clue3: 'The Football Association issued a joint censure letter. Both clubs denied instructing their players. The second referee\'s decisions were deemed invalid. The match was replayed.',
      reveal: 'Made up. Decoy. No such event at Prenton Park in 1987. Points for identifying this as invented.',
      hostNote: 'Not real. Prenton Park is Tranmere Rovers\' ground. Something like this may well have happened at some point. This specific incident did not.'
    },
    {
      id: 'r3-023',
      incident: 'Operation Puerto',
      sport: 'cycling',
      year: 2006,
      clue1: 'A doping investigation in 2006 that uncovered a systematic blood doping programme operated by a Spanish doctor, implicating riders from multiple cycling teams across Europe.',
      clue2: 'The investigation found over 200 blood bags. Riders were referred to by codenames in the doctor\'s files. Several leading riders were withdrawn from the Tour de France by their teams before the race began. The doctor was Eufemiano Fuentes.',
      clue3: 'Jan Ullrich and Ivan Basso were among those implicated. The Tour de France was won that year by a rider who tested positive three years later. The Spanish courts eventually ruled the blood bags had to be destroyed rather than used as evidence.',
      answer: 'Operation Puerto — Spanish blood doping scandal, 2006. Dr. Fuentes, Jan Ullrich, Ivan Basso implicated.',
      hostNote: 'The courts ordered the blood bags destroyed. Not tested. Not used as evidence. Destroyed. They were not destroyed. They were kept. The case continued for years. Floyd Landis won the 2006 Tour and was subsequently stripped of it.'
    },
    {
      id: 'r3-024',
      incident: 'Agassi\'s wig',
      sport: 'tennis',
      year: 2009,
      clue1: 'A confession in a 2009 autobiography in which a Grand Slam champion revealed he had been wearing a hairpiece during a major period of his career, and was terrified it would fall off during a match.',
      clue2: 'The player revealed he had once played an entire Grand Slam match in mortal fear that the hairpiece would detach. He lost the match. He described this in his memoir.',
      clue3: 'The player was Andre Agassi. The book was "Open." He wore a hairpiece with bobby pins. It shifted during a match at the 1990 French Open final. He lost to Stefan Edberg. He has said the fear of the wig was a factor in his performance.',
      answer: 'Andre Agassi\'s hairpiece — French Open 1990, revealed in autobiography "Open," 2009.',
      hostNote: 'He wore it with pins. It moved. He lost. He wrote about it nineteen years later. The book is extremely good and also extremely candid in ways the reader does not always expect.'
    },
    {
      id: 'r3-025',
      incident: 'The FA Cup giant killing — Bradford City v Chelsea 2015',
      sport: 'football',
      year: 2015,
      clue1: 'A fourth-round FA Cup upset in January 2015 in which a League One team beat a team that finished third in the Premier League the previous season, after being 2-0 down at half time.',
      clue2: 'The League One team scored four goals in the second half to win 4-2. The Premier League team had cost significantly more than the entire wage bill of their opponents. One of the four goals was scored in injury time.',
      clue3: 'Bradford City beat Chelsea at Valley Parade. Bradford were managed by Phil Parkinson. Chelsea\'s manager was José Mourinho. Chelsea\'s squad value was approximately £400 million. Bradford\'s matchday attendance was 24,990.',
      answer: 'Bradford City 4-2 Chelsea, FA Cup fourth round, January 2015.',
      hostNote: 'Chelsea were the fourth most expensive squad in world football. Bradford were in the third tier. Four goals in the second half. Mourinho\'s team went out in the fourth round to a League One club.'
    },

  ],

  // ── ROUND 4 ──────────────────────────────────────────────────────────────
  round4: [

    {
      id: 'r4-001',
      codename: 'The Yorkshire Tormentor',
      sport: 'cricket',
      clue1: 'This cricketer played for his county and England across four decades, was known for his sharp wit and sharper opinions, became one of broadcasting\'s most distinctive voices, and ended his career in a dispute with a governing body that lasted several years.',
      clue2: 'He left England\'s commentary team in circumstances that were never fully agreed upon by both parties. He had been with the BBC for over thirty years. He continued to work, write, and opine.',
      clue3: 'He is Geoffrey Boycott. He was found guilty of assault by a French court in 1998 after an incident with a girlfriend. He received a suspended sentence. He was not dropped from the BBC commentary team until 1999. He was brought back. He was knighted in 2019.',
      answer: 'Geoffrey Boycott — career and life\'s notable controversies.',
      hostNote: 'The knighthood is the part of this that generates the most discussion. He has said the conviction was wrong. He says this frequently.'
    },
    {
      id: 'r4-002',
      codename: 'The Belgian Bullet',
      sport: 'cycling',
      clue1: 'This cyclist won five Tours de France and was considered the greatest stage racer of his era. He tested positive for a banned substance at one of those Tours.',
      clue2: 'He admitted publicly in 1997 to using EPO. He did so voluntarily, after retiring. He was not stripped of his title. The UCI accepted his confession. His Tour win stands.',
      clue3: 'He is Bjarne Riis. He won the 1996 Tour de France. His admission is sometimes listed in brackets after his name in official records as "admitted EPO use." The Tour de France eventually listed his name with an asterisk-equivalent note.',
      answer: 'Bjarne Riis — 1996 Tour de France winner, admitted EPO use in 1997.',
      hostNote: 'He handed his yellow jersey back to the UCI. They refused to accept it. The win was eventually removed from the official Tour records, then reinstated with an annotation. The jersey is somewhere in Denmark.'
    },
    {
      id: 'r4-003',
      codename: 'The Texas Tornado',
      sport: 'athletics',
      clue1: 'This athlete won the 100m gold medal at a major international athletics championship with a world record time, setting a mark that stood for three years.',
      clue2: 'Three days after the competition, he was stripped of the gold after testing positive for stanozolol. He said the drug had been given to him without his knowledge.',
      clue3: 'He is Ben Johnson. Seoul, 1988, 9.79 seconds. The gold went to Carl Lewis. Johnson was banned for two years. He tested positive again in 1993 and was banned for life.',
      answer: 'Ben Johnson — Seoul 1988 Olympic 100m. Positive for stanozolol.',
      hostNote: 'The second positive was for a different substance. He was banned for life. He trained clients privately in Canada for several years. He briefly appeared as an agent for Diego Maradona.'
    },
    {
      id: 'r4-004',
      codename: 'The Postal Worker',
      sport: 'cycling',
      clue1: 'This cyclist won the same major stage race seven consecutive times, all after surviving a serious illness that had given him less than a 50% chance of survival.',
      clue2: 'He denied doping in dozens of press conferences and sued journalists who suggested otherwise, winning several of those cases. He admitted to systematic use of EPO, testosterone, and blood transfusions in a 2013 interview with a television presenter.',
      clue3: 'He is Lance Armstrong. He won the Tour de France 1999-2005. He was stripped of all seven titles. He admitted the doping to Oprah Winfrey. His foundation raised over $500 million for cancer research. The titles have not been reallocated.',
      answer: 'Lance Armstrong — Tour de France 1999-2005. Stripped of titles 2012.',
      hostNote: 'The titles have not been given to second-place finishers. Of the top ten finishers in those years, the majority have doping connections. There is no clean version of those Tours to restore.'
    },
    {
      id: 'r4-005',
      codename: 'The White Tornado',
      sport: 'snooker',
      clue1: 'This former World Snooker Champion became one of the sport\'s most charismatic and volatile figures, winning the world title twice and becoming as known for his personal life and behaviour as for his game.',
      clue2: 'He arrived at the 1992 World Championship visibly unwell, played in that state, and was censured. He was also noted for his relationship with a bottle of Smirnoff at various public appearances. He threatened to have a fellow professional\'s father harmed in 2010.',
      clue3: 'He is Alex "Hurricane" Higgins. He was banned from snooker\'s remaining events in 2010 after the threat. He died in July 2010. He had been diagnosed with throat cancer and was extremely unwell in his final years.',
      answer: 'Alex Higgins — died July 2010. Aged 61. Throat cancer.',
      hostNote: 'He was found dead in his flat in Belfast. He weighed less than six stone. He had sold his personal effects to buy cigarettes. He was, by many accounts, one of the most genuinely gifted snooker players who ever played.'
    },
    {
      id: 'r4-006',
      codename: 'The Barnet Cat',
      sport: 'cricket',
      clue1: 'This England cricketer is most famous for sleeping. He was also a very good bowler. He appeared in over forty Test matches for England, touring in conditions that suited neither his sleeping habits nor his temperament.',
      clue2: 'His cricket career ended at the end of the 1990s. He subsequently appeared on Celebrity Big Brother, which he won. He became a television presenter. He hosted A Question of Sport for a decade.',
      clue3: 'He is Phil Tufnell. Left-arm spin. Middlesex. 42 Tests. The Cat. AQoS captain 2008-2018. CBB winner 2003. Currently in this quiz.',
      answer: 'Phil Tufnell — not dead. This is how Howzat works: the career, not the man.',
      hostNote: 'He is not dead. He is, if anything, present. This is the Howzat version of his career\'s second life after cricket. Which is sometimes more successful than the career itself.'
    },
    {
      id: 'r4-007',
      codename: 'The Sheffield Sharpshooter',
      sport: 'snooker',
      clue1: 'This snooker player was ranked number one in the world for many years and is considered one of the sport\'s greatest-ever practitioners. He has never won the World Championship at the Crucible.',
      clue2: 'He won his first ranking event in 1993. By the early 2000s he was universally considered the most talented snooker player alive. He reached the World Championship final in 1996 and lost to Stephen Hendry. He has never won it.',
      clue3: 'He is Ronnie O\'Sullivan. He has five World Championship titles as of 2022. The clue was wrong — he has won it. He was referred to as the Sheffield Sharpshooter as a decoy (he is from Wordsley, West Midlands, but associated with the Crucible).',
      answer: 'Decoy on the codename — O\'Sullivan is from Wordsley. He has won the World Championship. Five times.',
      hostNote: 'The Sheffield Sharpshooter is a trap. Ronnie O\'Sullivan is not from Sheffield. He has also won the World Championship. Both details are wrong. Points for catching either.'
    },
    {
      id: 'r4-008',
      codename: 'The Flying Scotsman',
      sport: 'cycling',
      clue1: 'This Scottish cyclist set a new world hour record in 1993, riding 51.596km in one hour. He had been diagnosed with multiple sclerosis the year before. He did not tell anyone about the diagnosis until after the record.',
      clue2: 'He retired, then came back from retirement, then retired again. He competed in the Tour de France in his late thirties. He wrote openly about his MS diagnosis and its relationship to his performance.',
      clue3: 'He is Graeme Obree. He built his own bicycle, partly from washing machine parts. He set the hour record twice. His riding position was banned by the UCI twice. He designed a new position each time.',
      answer: 'Graeme Obree — hour record 1993, MS diagnosis, two banned riding positions.',
      hostNote: 'Banned twice for the same innovation: designing a riding position. He designed a different one. It was banned too. He built his bike from a washing machine. He set the world hour record. Both things are true.'
    },
    {
      id: 'r4-009',
      codename: 'The White Featherweight',
      sport: 'boxing',
      clue1: 'This fighter won a gold medal at a major international championship but was later found to have an advantage over his opponents that was not disclosed at the time of the competition.',
      clue2: 'The advantage was biological. It related to testosterone levels. An investigation was launched after the fights. The result was contested.',
      clue3: 'This is a reference to the Imane Khelif controversy at the 2024 Paris Olympics. She won gold in the 66kg boxing category. The IBA had previously excluded her under disputed testosterone testing. The IOC allowed her to compete. The outcome remains contested.',
      answer: 'Imane Khelif — Paris 2024 Olympics, 66kg boxing gold medal, IBA exclusion history.',
      hostNote: 'Use carefully. The facts are documented but the framing of the controversy remains active and contested. The IBA\'s testing methodology has been questioned. The IOC\'s position is that she met their eligibility criteria.'
    },
    {
      id: 'r4-010',
      codename: 'The Godfather of the Green',
      sport: 'snooker',
      clue1: 'This player dominated snooker for over a decade, winning the World Championship eight times and eighteen ranking titles. He retired in 2012. He was largely uncontroversial.',
      clue2: 'He was so dominant during his peak years that younger players have spoken about how his presence damaged their development — they could reach a high level and still lose to him reliably enough to cause significant discouragement.',
      clue3: 'He is Stephen Hendry. He returned from retirement in 2021 via a wildcard at the Crucible. He was beaten in the first round. He has been asked if he regrets coming back. He says no.',
      answer: 'Stephen Hendry — 7 World Championship titles (not eight — correction: seven), retired 2012, returned 2021.',
      hostNote: 'He won seven World Championships, not eight. If the team says eight, dock them points. He is the most successful snooker player in history by title count. He came back after nine years. He lost in the first round to Marcus Campbell. He said he did not regret it.'
    },
    {
      id: 'r4-011',
      codename: 'The Iceman of Belfast',
      sport: 'boxing',
      clue1: 'This boxer won a world heavyweight championship, was considered the hardest puncher in the sport\'s history by several metrics, and had his personal life become public to a degree unusual even for heavyweight champions.',
      clue2: 'He bit a chunk of an opponent\'s ear off in 1997. He served prison time for a rape conviction in 1992. He fought professionally until the age of 38. He remains recognisable for a face tattoo obtained in 2003.',
      clue3: 'He is Mike Tyson. The ear was Holyfield\'s. The tattoo is a Māori-inspired face tattoo. He has a one-man show about his life. He fought Jake Paul in 2024.',
      answer: 'Mike Tyson — career, conviction, ear bite (1997), face tattoo (2003), continued cultural presence.',
      hostNote: 'He fought Jake Paul at 58. The promotional material described it as a boxing match. The state of Texas sanctioned it. Tyson won some rounds. Paul won the decision. Boxing does not have a firm view on what constitutes a boxing match.'
    },
    {
      id: 'r4-012',
      codename: 'The Wizard of Oz',
      sport: 'cricket',
      clue1: 'This cricketer played Test cricket for Australia, was considered the greatest leg-spin bowler of his era, and possibly in cricket history. He was also found to have used a banned substance.',
      clue2: 'He tested positive for a diuretic before the 2003 Cricket World Cup. He said he had taken a pill given to him by his mother for weight loss. He was banned for one year.',
      clue3: 'He is Shane Warne. The substance was hydrochlorothiazide. He served the ban. He returned. He took 708 Test wickets, second most in history. He died in March 2022 of a suspected heart attack in Thailand, aged 52.',
      answer: 'Shane Warne — 708 Test wickets, 2003 doping ban (diuretic), died March 2022 aged 52.',
      hostNote: 'The pill was from his mother. He said this. It was still a banned substance. The ban was one year. He came back and took further wickets. He died on the first day of a holiday in Thailand. He was 52.'
    },
    {
      id: 'r4-013',
      codename: 'The Troll Under the Bridge',
      sport: 'football',
      clue1: 'This footballer was voted among the greatest players of his generation, known for pace, skill, and directness. He was also found to have made multiple financial payments to a former girlfriend to prevent details of their relationship becoming public.',
      clue2: 'The injunction he obtained prevented British newspapers from naming him. His identity was widely known and freely published outside the UK. He was eventually named in parliament under privilege.',
      clue3: 'He is Ryan Giggs. He was named by the MP John Hemming in the House of Commons in 2011. The injunction had prevented UK publication. The story involved his relationship with his brother\'s wife, among others.',
      answer: 'Ryan Giggs — super-injunction, named in parliament by John Hemming, 2011.',
      hostNote: 'He had obtained the injunction to prevent naming. Parliament named him. That is how parliamentary privilege works. He had won 13 Premier League titles. He later became Wales manager. He resigned following a trial involving an allegation of assault against his partner.'
    },
    {
      id: 'r4-014',
      codename: 'The Philosopher King',
      sport: 'football',
      clue1: 'This footballer won a domestic league title, a European trophy, and a World Cup. He was known for his elegance, vision, and distance from the game\'s conventional culture. His playing career ended conventionally.',
      clue2: 'After playing, he became a football manager. He took a national team to a major tournament. He left without significant controversy. He then gave a TED talk and wrote a book.',
      clue3: 'He is Clarence Seedorf. Ajax, Milan, Real Madrid. Champions League with three different clubs (the only player to do so). He managed Shakhtar Donetsk, Deportivo, Cameroon. The TED talk is real.',
      answer: 'Clarence Seedorf — Champions League with Ajax, Real Madrid, AC Milan. Manager, Cameroon. TED talk.',
      hostNote: 'Three Champions League titles. Three clubs. The TED talk is about leadership and mental agility. Cox will find this relevant to his own work.'
    },
    {
      id: 'r4-015',
      codename: 'The Scarecrow',
      sport: 'cricket',
      clue1: 'This English cricketer was extremely tall, bowled fast, and had a run-up of notable length. His career ended due to injury rather than form. After cricket, he became a television commentator.',
      clue2: 'He toured with England in the 1980s and 1990s. He was known for celebrating wickets exuberantly. He was not always regarded as the most reliable performer under pressure by all of his captains.',
      clue3: 'He is Devon Malcolm. He took 9 wickets for 57 runs against South Africa in 1994 after being hit on the helmet by a bouncer, saying to the fielders: "You guys are history." This is one of the greatest individual bowling spells in Test history.',
      answer: 'Devon Malcolm — 9/57 vs South Africa 1994. "You guys are history." 108 Test wickets.',
      hostNote: '"You guys are history." He then took nine wickets. He has been asked about the sentence almost as often as Tufnell has been asked about sleeping.'
    },
    {
      id: 'r4-016',
      codename: 'The Golden Fist',
      sport: 'boxing',
      clue1: 'This boxer won an Olympic gold medal at the 1960 Rome Games. He went on to become world heavyweight champion. He was stripped of his world title for refusing to be inducted into the US military.',
      clue2: 'He was convicted of draft evasion and sentenced to five years. The Supreme Court overturned the conviction unanimously in 1971. He had missed four years of his prime. He won the heavyweight title twice more.',
      clue3: 'He is Muhammad Ali. He won the gold medal, threw it in the Ohio River after being refused service at a whites-only restaurant (according to his own account), beat Sonny Liston twice, was stripped of the title, and won it back twice more.',
      answer: 'Muhammad Ali — Rome 1960, Liston x2, draft refusal, Supreme Court overturns conviction, two more world titles.',
      hostNote: 'He threw the gold medal in the river. This is disputed. He said it happened. In 1996 Atlanta he was given a replacement gold medal. The river\'s medal, if it exists, has not been recovered.'
    },
    {
      id: 'r4-017',
      codename: 'The Prince of Darkness',
      sport: 'football',
      clue1: 'This football manager won multiple domestic league titles in England, is associated with a particular style of direct, physical football, and left one club in circumstances that involved a mutual agreement with the owners.',
      clue2: 'He was sacked, reinstated, sacked again, managed internationally, returned to club management, and was sacked again, at different clubs. He also wrote a column in a newspaper. The column was noted for its opinions.',
      clue3: 'He is Sam Allardyce. He managed England for 67 days before resigning after a newspaper sting operation, having apparently offered advice on how to circumvent FA rules on player transfers. He was found not to have broken any rules.',
      answer: 'Sam Allardyce — England manager for 67 days, resigned September 2016 following newspaper sting.',
      hostNote: 'He managed England for one game. They won. He then gave an interview to undercover reporters. He resigned before he could be sacked. He then managed more clubs.'
    },
    {
      id: 'r4-018',
      codename: 'The Philosopher\'s Cue',
      sport: 'snooker',
      clue1: 'This snooker player is the highest break scorer in the game\'s history and one of only a small number of players to have made a 147 maximum break in World Championship conditions.',
      clue2: 'He has also been candid about mental health difficulties, time spent in a psychiatric facility, and his complex relationship with the sport. He has indicated retirement multiple times.',
      clue3: 'He is Ronnie O\'Sullivan. Five (as of 2022) World Championship titles. Multiple maximum breaks. Publicly candid about mental health. At one point trained for long-distance running as an alternative career.',
      answer: 'Ronnie O\'Sullivan — World Champion (multiple), maximum breaks, mental health transparency, near-retirement.',
      hostNote: 'He ran a half marathon in under 80 minutes while actively competing on the professional tour. He was, at the time, ranked number one in the world.'
    },
    {
      id: 'r4-019',
      codename: 'The Quiet Tiger',
      sport: 'golf',
      clue1: 'This golfer won fourteen major championships and was the dominant force in world golf for over a decade, redefining the physical requirements of the sport and its broadcast appeal.',
      clue2: 'His personal life became public in 2009 after a collision involving a fire hydrant and a car. Multiple accounts of infidelity were subsequently published. He divorced. His game suffered.',
      clue3: 'He is Tiger Woods. Fourteen majors. Married Elin Nordegren in 2004, divorced 2010. Car accident 2021 in California required leg reconstruction surgery. He returned to professional play.',
      answer: 'Tiger Woods — 14 majors, 2009 scandal, 2021 car accident, multiple comebacks.',
      hostNote: 'The fire hydrant is the most famous tree-adjacent vehicle incident in professional golf. He won the 2019 Masters after his personal and physical recoveries. It was his first major in eleven years.'
    },
    {
      id: 'r4-020',
      codename: 'The Viking',
      sport: 'football',
      clue1: 'This Scandinavian manager won league titles in multiple countries, managed England\'s national team, and was criticised for giving a press conference in which he appeared to suggest disabled people were good at football because of a specific attribute.',
      clue2: 'The press conference was in 2000. He said there were more disabled people in England than other countries, which was why England produced more great football players who had to "practise more." He apologised.',
      clue3: 'He is Sven-Göran Eriksson. He managed England 2001-2006. He was also the subject of a newspaper sting where a fake sheikh suggested he might be interested in leaving England for Aston Villa. He also had a relationship with FA secretary Faria Alam, which became public.',
      answer: 'Sven-Göran Eriksson — England manager 2001-2006. Fake sheikh sting. Faria Alam. Press conference.',
      hostNote: 'The fake sheikh sting, the Faria Alam story, and the disability press conference all happened. He remained England manager for five years. England reached the quarter-finals at every tournament he managed. They lost on penalties each time.'
    },

  ]

};

// Anti-repetition selector
// usage: getUnusedQuestion(QUIZ_QUESTIONS.round1)
function getUnusedQuestion(pool) {
  const usedRaw = localStorage.getItem('quiz_used_questions');
  const used = usedRaw ? JSON.parse(usedRaw) : [];
  const available = pool.filter(q => !used.includes(q.id));
  if (available.length === 0) {
    // Pool exhausted — reset and start again
    const freshUsed = used.filter(id => !pool.some(q => q.id === id));
    localStorage.setItem('quiz_used_questions', JSON.stringify(freshUsed));
    return pool[Math.floor(Math.random() * pool.length)];
  }
  const selected = available[Math.floor(Math.random() * available.length)];
  used.push(selected.id);
  localStorage.setItem('quiz_used_questions', JSON.stringify(used));
  return selected;
}

// Round-specific getters
function getOkOrCheatingQuestion() { return getUnusedQuestion(QUIZ_QUESTIONS.round1); }
function getWhatHappenedNextQuestion() { return getUnusedQuestion(QUIZ_QUESTIONS.round2); }
function getNameTheIncidentQuestion() { return getUnusedQuestion(QUIZ_QUESTIONS.round3); }
function getHowzatQuestion() { return getUnusedQuestion(QUIZ_QUESTIONS.round4); }

// Stats
function getQuizPoolStats() {
  const used = JSON.parse(localStorage.getItem('quiz_used_questions') || '[]');
  return {
    round1: { total: QUIZ_QUESTIONS.round1.length, used: used.filter(id => id.startsWith('r1-')).length },
    round2: { total: QUIZ_QUESTIONS.round2.length, used: used.filter(id => id.startsWith('r2-')).length },
    round3: { total: QUIZ_QUESTIONS.round3.length, used: used.filter(id => id.startsWith('r3-')).length },
    round4: { total: QUIZ_QUESTIONS.round4.length, used: used.filter(id => id.startsWith('r4-')).length },
  };
}
