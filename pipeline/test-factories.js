'use strict';

// pipeline/test-factories.js
// Named state objects for Given steps.
// Never construct state inline inside a step definition — use these instead.

const STORAGE_KEY_API    = 'heckler-api-key';
const STORAGE_KEY_SCORES = 'heckler-scores';
const STORAGE_KEY_POLLS  = 'heckler-poll-index';

function seedStorage(localStorage, data) {
  Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, String(v)));
}

const STATE = {

  // No data in storage — clean install
  cleanInstall: () => ({}),

  // A valid API key saved
  withApiKey: (key = 'sk-ant-test-valid-key-abc123') => ({
    [STORAGE_KEY_API]: key
  }),

  // Scores — array of { score, date, id }
  withScores: (scores) => ({
    [STORAGE_KEY_SCORES]: JSON.stringify(
      scores.map((score, i) => ({
        score,
        date: new Date().toISOString(),
        id:   `score-${i}`
      }))
    )
  }),

  // Mixed-date scores: one from today, one from yesterday
  withMixedDateScores: (todayScore, yesterdayScore) => {
    const today     = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      [STORAGE_KEY_SCORES]: JSON.stringify([
        { score: todayScore,     date: today.toISOString(),     id: 'today-entry' },
        { score: yesterdayScore, date: yesterday.toISOString(), id: 'yesterday-entry' }
      ])
    };
  },

  // Single quiz result added to scores
  withQuizResult: (score) => ({
    [STORAGE_KEY_SCORES]: JSON.stringify([
      { score, date: new Date().toISOString(), id: 'quiz-result' }
    ])
  })

};

// Mock API response builders — passed into ctx.mockApiResponse
const MOCK_API = {

  localiserResult: (bellScore = 75, phrase = 'Aye, tha's a reet numpty') => ({
    ok: true,
    status: 200,
    json: async () => ({
      content: [{ text: JSON.stringify({
        phrase,
        scores: {
          Impactful: 80, Insulting: 70, Creative: 65,
          Bizarre: 60, Tuneful: 55, Rhythmical: 50, Comedy: 75
        },
        bellScore
      })}]
    })
  }),

  generatorResult: (phrase = 'A rancid badger of a Monday') => ({
    ok: true,
    status: 200,
    json: async () => ({
      content: [{ text: JSON.stringify({
        phrase,
        scores: {
          Impactful: 70, Insulting: 65, Creative: 80,
          Bizarre: 75, Tuneful: 45, Rhythmical: 50, Comedy: 85
        }
      })}]
    })
  }),

  historianResult: (eraName = 'Victorian', phrase = 'A most improper utterance') => ({
    ok: true,
    status: 200,
    json: async () => ({
      content: [{ text: JSON.stringify({
        eras: [{ era: eraName, phrase: `↳ What was actually said: ${phrase}`, icon: '🎩' }]
      })}]
    })
  }),

  historianResultLowercase: (eraName = 'victorian', phrase = 'A most improper utterance') => ({
    ok: true,
    status: 200,
    json: async () => ({
      content: [{ text: JSON.stringify({
        eras: [{ era: eraName, phrase: `↳ What was actually said: ${phrase}`, icon: '🎩' }]
      })}]
    })
  }),

  trumpsResult: (playerPhrase, aiPhrase, winner) => ({
    ok: true,
    status: 200,
    json: async () => ({
      content: [{ text: JSON.stringify({ playerPhrase, aiPhrase, winner }) }]
    })
  }),

  trumpsDraw: (playerPhrase = 'bloody nora', aiPhrase = 'crikey blimey') => ({
    ok: true,
    status: 200,
    json: async () => ({
      content: [{ text: JSON.stringify({
        playerPhrase, aiPhrase, winner: 'draw'
      })}]
    })
  }),

  itResult: (output = 'We must synergise our core competency stack') => ({
    ok: true,
    status: 200,
    json: async () => ({
      content: [{ text: JSON.stringify({ output }) }]
    })
  }),

  sentenceResult: (sentence = 'As a knackered accountant from Leeds on a Monday...') => ({
    ok: true,
    status: 200,
    json: async () => ({
      content: [{ text: JSON.stringify({ sentence }) }]
    })
  }),

  quizQuestions: () => ({
    ok: true,
    status: 200,
    json: async () => ({
      content: [{ text: JSON.stringify({
        questions: [
          { q: 'Q1', options: ['A','B','C','D'], answer: 'A' },
          { q: 'Q2', options: ['A','B','C','D'], answer: 'B' },
          { q: 'Q3', options: ['A','B','C','D'], answer: 'C' },
          { q: 'Q4', options: ['A','B','C','D'], answer: 'A' },
          { q: 'Q5', options: ['A','B','C','D'], answer: 'D' }
        ]
      })}]
    })
  }),

  error: (status = 401) => ({
    ok: false,
    status,
    json: async () => ({})
  })

};

module.exports = { STATE, MOCK_API, seedStorage, STORAGE_KEY_API, STORAGE_KEY_SCORES };
