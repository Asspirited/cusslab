// src/data/round-head-questions.js
// Round Head panel (RGS-format) seed question bank for Mode 1 MVP.
// Mode 1: question is read to USER, user answers AS KARL, Ricky+Stephen react.
// Pure data — no functions, no DOM, no API.
// index.html loads this before the RoundHead IIFE.
// pipeline/gherkin-runner.js requires() this directly.
//
// Patterns derived from Ricky Gervais Show / Guide To... canon.
// Research write-up: Downloads/cusslab-rgs-question-patterns-2026-06-03.md
// ASCII only. UK English in research doc, neutral English in data.

(function () {

  // -- PATTERNS -------------------------------------------------------------
  // Each pattern: id, name, description (what comedic mechanism it draws out),
  // examples (question strings to put to the user as Karl).

  var PATTERNS = [

    {
      id: 'hypothetical_animal',
      name: 'Hypothetical Animal You Would Be / Build',
      description: 'Karl assembles a creature by ignoring evolutionary logic and combining body parts on aesthetic preference, then defends the result against all biology-based objections. Gap is between Karl confidence and absence of system-thinking.',
      examples: [
        'If you could be any animal, what would it be and why?',
        'Design your perfect animal from scratch — head, body, legs, tail. Do not worry about whether it would actually work.',
        'If we were doing nature again from the start, what would you take out?',
        'Which animal would you most want to be reincarnated as, and what is the catch?',
        'You can give one animal one human ability. Which animal, which ability?',
        'Is there an animal you reckon is just badly designed? Which one and why?',
        'You can cross any two animals into one. What do you make and what does it eat?',
      ],
    },

    {
      id: 'wyr_body_bargain',
      name: 'Would You Rather — Body Bargain For Cash',
      description: 'Karl haggles. The horror is never in the act — it is in the per-foot, per-pant, per-photo rate. He treats his own body as a piecework rate-card.',
      examples: [
        'Would you shower with another bloke for a thousand pounds?',
        'Would you take Ricky\'s shoes and socks off for cash? Per foot rate?',
        'Would you swap pants with Steve for fifty quid, both in the room at the same time?',
        'Would you wear a nappy for a full day for a hundred?',
        'Would you pose nude for a charity calendar? Front cover or hidden inside?',
        'Would you take a punch from Ricky for a grand? Anywhere on the body?',
        'Would you let a monkey live in your flat for a year for ten grand?',
        'Would you eat a worm on live radio for fifty quid? What about a fiver?',
      ],
    },

    {
      id: 'body_mod_surgical',
      name: 'Body Modification — Transplant / Cyborg / Surgical',
      description: 'Karl evaluates a head transplant the way someone else might evaluate a new pair of trainers. He brings everyday consumer-grade reasoning to bioethical extremes.',
      examples: [
        'They reckon they can do head transplants now. Would you have someone else\'s body?',
        'If you could put your wife\'s brain in your head and live as two minds in one body, would you?',
        'Would you swap your face with a stranger so you would never be recognised again?',
        'If you could replace one organ with a better one — which organ, what improvement?',
        'They give you a robot arm but you do not find out what it does until it is fitted. Take it?',
        'Would you have a third eye fitted if it could see in the dark?',
        'Would you take a tail if it was useful but everyone could see it?',
        'They invent gills. Surgery is permanent. Are you doing it?',
      ],
    },

    {
      id: 'superpower_crap',
      name: 'Superpower Selection — But Crap',
      description: 'Karl\'s superpowers are either trivially useless, passive-aggressive, or domestically practical. He misses the genre by miles. Canonical answer: Bullshit Man.',
      examples: [
        'If you could have any superpower, what would it be?',
        'What would you do if you were invisible for a day?',
        'Pick a superpower that would actually be useful in your flat.',
        'Flight or telepathy — which one is more bother than it is worth?',
        'You can have any Marvel power but it only works on Wednesdays. Which one?',
        'Would you rather be super-strong or super-clever, and which one would get you sacked first?',
        'You can read minds but only of people directly behind you in a queue. Use it?',
        'Time-stop power. Lasts ten minutes. What is the boring thing you actually do with it?',
      ],
    },

    {
      id: 'science_wrong',
      name: 'Karl Explains Science Incorrectly',
      description: 'Karl is not stupid — he is confidently building a wrong model from first principles. Internally consistent, externally a disaster. The wrong model accidentally illuminates how shaky the right model is.',
      examples: [
        'Why are sea levels rising, in your own words?',
        'What was the Big Bang, and was it actually big or did it just seem big?',
        'Did humans and dinosaurs ever live at the same time?',
        'Why do we dream? What is the brain actually up to?',
        'Why does the moon not fall down?',
        'Explain how gravity works. No looking it up.',
        'What is electricity, really, when you think about it?',
        'Why do we get colds in winter when it is meant to be the cold that makes you ill?',
        'Why is the sky blue? Honestly, what do you reckon?',
      ],
    },

    {
      id: 'philosophy_wrong',
      name: 'Karl Explains Philosophy Incorrectly',
      description: 'Karl arrives at the genuinely interesting question without realising it, treats it as a household admin problem, and either solves it accidentally or breaks something nobody had noticed was load-bearing.',
      examples: [
        'Are you in charge of your brain, or is your brain in charge of you?',
        'If you met another version of yourself, how would you know which one was the real one?',
        'Is there such a thing as free will, or do you just do what your stomach tells you?',
        'If a tree falls in a forest and nobody is there — is that the tree\'s problem?',
        'Are we definitely all having the same Tuesday?',
        'Is the you of ten years ago the same you, or are you just claiming his stuff?',
        'Does a dog know it is a dog?',
        'If nobody remembers a thing happened, did it happen?',
      ],
    },

    {
      id: 'monkey_news',
      name: 'Monkey News Prompts',
      description: 'Karl believes the monkey story. Ricky and Steve interrogate it. The story does not survive but Karl never withdraws it. The monkey has dignity, the monkey has a job, the monkey is misunderstood.',
      examples: [
        'A monkey is doing a job that should be done by a person. What is the job, what is the monkey, and is it fair?',
        'A monkey is sent into space. What is the mission, what goes wrong, who is accountable?',
        'A monkey is the only witness to a crime. How does the court handle it?',
        'A monkey has been writing letters to a newspaper for two years and nobody noticed. What was the column about?',
        'A monkey took a driving test. What is the outcome?',
        'A monkey runs a small business. What is the business, and is HMRC involved?',
        'A monkey gets a job in a salon doing hair. How does the day go?',
        'A monkey has joined a football team as a sub. How does management handle it?',
      ],
    },

    {
      id: 'what_if_history',
      name: 'What If History Was Different',
      description: 'Karl is happy to revise world history on the basis of small, irrelevant changes. He treats the past as a system that could have gone better with one slight tweak — usually about logistics, food, or his own preference.',
      examples: [
        'What if Noah had not bothered saving everything?',
        'What if the moon had been a bit closer to us?',
        'What if Neil Armstrong had decided not to come back from the moon?',
        'What if the dinosaurs had not been wiped out — would they have got jobs?',
        'What if Jesus had been born in Manchester?',
        'What if Einstein had been thick? Would someone else have done the equation?',
        'What if we had skipped the Industrial Revolution and gone straight to phones?',
        'What if the Romans had stayed and built the M25 properly?',
        'What if cavemen had had Google?',
      ],
    },

    {
      id: 'ethical_trap',
      name: 'Ethical Trap — Lifeboat / Sacrifice Question',
      description: 'Karl\'s ethics are not selfish — they are parochial. He picks based on who he knows, what is nearby, and what would be least inconvenient. The result is a moral system that nobody could endorse but that contains, accidentally, real coherence.',
      examples: [
        'You are in a lifeboat with Ricky, Steve and a stranger. One has to go. Who?',
        'You can save a hundred strangers or one person you know. Who do you know, and does that change it?',
        'A runaway tram is heading for five people. You can pull a lever and divert it to one. What do you do?',
        'Would you let an old man die to save a young dog? Both? Neither?',
        'If you had to live with one of Ricky or Steve forever, which one and why?',
        'Would you grass on a mate to save a stranger? What if the stranger had a good job?',
        'You can press a button to make one bad person disappear forever, but you do not get to know who. Press it?',
        'A child is drowning and a Picasso is on fire. You can save one. Which?',
      ],
    },

    {
      id: 'sci_fi_premise',
      name: 'Sci-Fi Premise Karl Has To Live In',
      description: 'Karl reduces every sci-fi premise to its impact on his Tuesday. Aliens land — Karl wants to know if the bins still get collected. The genre breaks; the domestic survives.',
      examples: [
        'Aliens land tomorrow. Are they here for us, or just stopping for petrol?',
        'You can travel through time but only to Tuesdays. Where do you go?',
        'They have cloned you. The clone is slightly better at your job. What is your move?',
        'We are definitely in a simulation. Knowing this, what do you do differently?',
        'You get a robot servant but it is slightly judgemental. Do you keep it?',
        'They invent a pill that lets you skip Mondays. Would you take it forever?',
        'You can talk to one species of animal but they are all a bit boring. Which species do you pick?',
        'A teleporter has been invented but it gets your face slightly wrong each time. Use it daily?',
      ],
    },

    {
      id: 'invention_pitch',
      name: 'Karl\'s Inventions / Improvements To Civilisation',
      description: 'Karl\'s inventions are answers to questions nobody asked. The genius is in the conviction. Ricky and Steve dismantle the business case; Karl revises the spec; the spec gets worse.',
      examples: [
        'See-through skin so you can see what is wrong with you. Is that a good idea?',
        'Pitch an invention that solves a problem in your kitchen right now.',
        'Invent something for old people that everyone else would also want.',
        'What is an everyday object that has been done wrong since the start? Re-design it.',
        'A watch that counts down how long you have got left. Wear it?',
        'A new room for the house that nobody has thought of yet. What is it for?',
        'You can put a button on any household appliance. Which appliance, what does the button do?',
        'Pitch a new kind of biscuit. Sell it to the panel.',
      ],
    },

  ];

  // -- FLATTENED QUESTION LIST ----------------------------------------------
  // Convenience: every example across every pattern, with pattern_id tagged
  // so a Mode 1 picker can either filter by pattern or shuffle the lot.

  var ALL_QUESTIONS = [];
  for (var i = 0; i < PATTERNS.length; i++) {
    var p = PATTERNS[i];
    for (var j = 0; j < p.examples.length; j++) {
      ALL_QUESTIONS.push({
        pattern_id: p.id,
        pattern_name: p.name,
        question: p.examples[j],
      });
    }
  }

  var ROUND_HEAD_QUESTIONS = {
    patterns: PATTERNS,
    allQuestions: ALL_QUESTIONS,
  };

  // -- EXPORTS --------------------------------------------------------------

  if (typeof window !== 'undefined') {
    window.ROUND_HEAD_QUESTIONS = ROUND_HEAD_QUESTIONS;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ROUND_HEAD_QUESTIONS;
  }

})();
