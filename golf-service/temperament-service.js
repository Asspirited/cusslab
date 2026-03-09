// golf-service/temperament-service.js
// Temperament profile archetype mechanics — BL-029
// Pure function. No DOM. No API calls.

const TemperamentService = (() => {

  // Compute next streak value based on hole direction.
  // Positive streak = consecutive birdies/eagles; negative = consecutive bogeys+.
  // Par always resets to 0. Direction change resets to ±1.
  function nextStreak(diff, streak) {
    if (diff < 0)      return (streak > 0 ? streak : 0) + 1;
    else if (diff > 0) return (streak < 0 ? streak : 0) - 1;
    else               return 0;
  }

  // Apply hole result to composure based on temperamentProfile.
  // Returns { composureDelta: number, newStreak: number }
  //   profile: 'ICEBERG' | 'STREAKY' | 'LEVELHEADED' | 'PEAKER' | 'DEFENSIVE' | 'COMBUSTIBLE'
  //   diff:    hole score vs par (negative=eagle/birdie, 0=par, positive=bogey+)
  //   streak:  current consecutive run (+birdie / -bogey)
  //   ego:     player ego attribute (1–10), used by STREAKY and COMBUSTIBLE
  function applyHoleResult(profile, diff, streak, ego) {
    const e = ego || 5;
    const newStreak = nextStreak(diff, streak);
    let composureDelta = 0;

    switch (profile) {
      case 'ICEBERG':
        if (diff <= -2)      composureDelta = 1;
        else if (diff >= 2)  composureDelta = -1;
        break;

      case 'STREAKY': {
        const mult = Math.min(Math.abs(newStreak), 3);
        if (diff < 0)       composureDelta = mult + (e >= 7 ? 1 : 0);
        else if (diff > 0)  composureDelta = -mult;
        break;
      }

      case 'LEVELHEADED':
        if (diff <= -2)     composureDelta = 1;
        else if (diff >= 1) composureDelta = -1;
        break;

      case 'PEAKER':
        if (diff <= -2)      composureDelta = 2;
        else if (diff === -1) composureDelta = 1;
        else if (diff === 1)  composureDelta = -2;
        else if (diff === 2)  composureDelta = -3;
        else if (diff >= 3)   composureDelta = -4;
        break;

      case 'DEFENSIVE':
        if (diff <= -2)     composureDelta = 1;
        else if (diff >= 2) composureDelta = -1;
        break;

      case 'COMBUSTIBLE':
        if (diff <= -2)      composureDelta = 3 + (e >= 7 ? 1 : 0);
        else if (diff === -1) composureDelta = 1;
        else if (diff === 1)  composureDelta = -2 - (e <= 3 ? 1 : 0);
        else if (diff >= 2)   composureDelta = -4;
        break;

      default:
        composureDelta = 0;
    }

    return { composureDelta, newStreak };
  }

  return { applyHoleResult };

})();

if (typeof module !== 'undefined') module.exports = { TemperamentService };
