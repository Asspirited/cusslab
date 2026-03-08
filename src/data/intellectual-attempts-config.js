// src/data/intellectual-attempts-config.js
// Canonical config for the IntellectualAttempts behaviour class.
// Pure data — no functions, no DOM, no API.
// Load order: before src/logic/intellectual-attempts.js

const ATTEMPT_KEYWORDS = {
  'irony':        'ATTEMPT_IRONY',
  'ironic':       'ATTEMPT_IRONY',
  'ironically':   'ATTEMPT_IRONY',
  'literally':    'ATTEMPT_LITERALLY',
  'tautology':    'ATTEMPT_TAUTOLOGY',
  'oxymoron':     'ATTEMPT_OXYMORON',
  'metaphor':     'ATTEMPT_METAPHOR',
  'paradox':      'ATTEMPT_PARADOX',
  'quantum':      'ATTEMPT_ERUDITION',
  'schrödinger':  'ATTEMPT_ERUDITION',
  'schrodinger':  'ATTEMPT_ERUDITION',
  'heisenberg':   'ATTEMPT_ERUDITION',
  'occam':        'ATTEMPT_ERUDITION',
};

const INTELLECTUAL_ATTEMPTS_CONFIG = {
  boardroom: {
    sebastian: { types: ['ATTEMPT_IRONY', 'ATTEMPT_ERUDITION', 'ATTEMPT_PARADOX'],    default_degree: 'plausible_miss',      default_delivery: 'confident_wrongness'   },
    roy:       { types: ['ATTEMPT_TAUTOLOGY'],                                          default_degree: 'catastrophic_miss',   default_delivery: 'completely_sincere'    },
    partridge: { types: ['ATTEMPT_OXYMORON', 'ATTEMPT_LITERALLY', 'ATTEMPT_ERUDITION'], default_degree: 'catastrophic_miss',  default_delivery: 'ridiculous'            },
    cox:       { types: ['ATTEMPT_ERUDITION', 'ATTEMPT_METAPHOR', 'ATTEMPT_PARADOX'],  default_degree: 'almost_correct',      default_delivery: 'accidental_profundity' },
    mystic:    { types: ['ATTEMPT_IRONY', 'ATTEMPT_PARADOX', 'ATTEMPT_ERUDITION'],     default_degree: 'catastrophic_miss',   default_delivery: 'ridiculous'            },
    harold:    { types: ['ATTEMPT_LITERALLY'],                                          default_degree: 'catastrophic_miss',   default_delivery: 'confident_wrongness'   },
  },
  comedyroom: {
    hicks:     { types: ['ATTEMPT_IRONY', 'ATTEMPT_PARADOX'],                          default_degree: 'almost_correct',      default_delivery: 'confident_wrongness'   },
    partridge: { types: ['ATTEMPT_OXYMORON', 'ATTEMPT_LITERALLY', 'ATTEMPT_ERUDITION'], default_degree: 'catastrophic_miss',  default_delivery: 'ridiculous'            },
    carlin:    { types: ['ATTEMPT_IRONY', 'ATTEMPT_PARADOX'],                          default_degree: 'correct',             default_delivery: 'confident_wrongness'   },
    gervais:   { types: ['ATTEMPT_IRONY', 'ATTEMPT_OXYMORON'],                         default_degree: 'plausible_miss',      default_delivery: 'plausible'             },
    cox:       { types: ['ATTEMPT_ERUDITION', 'ATTEMPT_METAPHOR'],                     default_degree: 'almost_correct',      default_delivery: 'accidental_profundity' },
    eccles:    { types: ['ATTEMPT_PARADOX', 'ATTEMPT_TAUTOLOGY'],                      default_degree: 'catastrophic_miss',   default_delivery: 'ridiculous'            },
  },
  golf: {
    faldo:     { types: ['ATTEMPT_TAUTOLOGY', 'ATTEMPT_IRONY', 'ATTEMPT_ERUDITION'],   default_degree: 'plausible_miss',      default_delivery: 'lying'                 },
    radar:     { types: ['ATTEMPT_LITERALLY', 'ATTEMPT_OXYMORON', 'ATTEMPT_ERUDITION'], default_degree: 'catastrophic_miss',  default_delivery: 'ridiculous'            },
    dougherty: { types: ['ATTEMPT_PARADOX', 'ATTEMPT_ERUDITION'],                      default_degree: 'almost_correct',      default_delivery: 'accidental_profundity' },
    mcginley:  { types: ['ATTEMPT_METAPHOR', 'ATTEMPT_IRONY'],                         default_degree: 'plausible_miss',      default_delivery: 'confident_wrongness'   },
    coltart:   { types: ['ATTEMPT_TAUTOLOGY', 'ATTEMPT_LITERALLY'],                    default_degree: 'catastrophic_miss',   default_delivery: 'completely_sincere'    },
    harmon:    { types: ['ATTEMPT_METAPHOR', 'ATTEMPT_ERUDITION'],                     default_degree: 'plausible_miss',      default_delivery: 'plausible'             },
    nick:      { types: ['ATTEMPT_IRONY', 'ATTEMPT_TAUTOLOGY'],                        default_degree: 'plausible_miss',      default_delivery: 'confident_wrongness'   },
    cox:       { types: ['ATTEMPT_ERUDITION', 'ATTEMPT_PARADOX'],                      default_degree: 'almost_correct',      default_delivery: 'accidental_profundity' },
  },
};

// Browser: expose as globals
if (typeof window !== 'undefined') {
  window.ATTEMPT_KEYWORDS           = ATTEMPT_KEYWORDS;
  window.INTELLECTUAL_ATTEMPTS_CONFIG = INTELLECTUAL_ATTEMPTS_CONFIG;
}

// Node (pipeline) export
if (typeof module !== 'undefined') module.exports = { ATTEMPT_KEYWORDS, INTELLECTUAL_ATTEMPTS_CONFIG };
