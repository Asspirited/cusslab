// golf-service/chaos-injector-service.js
// Player-specific chaos injectors — BL-030
// Pure function dispatcher. No DOM. No API calls.
// apply(playerId, event) → additionalDelta (number)
// event: { diff, streak, composure, isRyder }

const ChaosInjectorService = (() => {

  // Injector map: playerId → (event) => additionalDelta
  const INJECTORS = {

    // Poulter: birdie run ≥2 in Ryder Cup gives +1 (big-match intensity)
    poulter: ({ diff, streak, isRyder }) => {
      if (diff < 0 && streak >= 2 && isRyder) return 1;
      return 0;
    },

    // Garcia: birdie when composure ≤3 gives +1 (never-say-die at the edge)
    garcia: ({ diff, composure }) => {
      if (diff < 0 && composure <= 3) return 1;
      return 0;
    },

    // Seve: birdie when composure ≤3 gives +1 extra (recovery reflex)
    seve_ballesteros: ({ diff, composure }) => {
      if (diff < 0 && composure <= 3) return 1;
      return 0;
    },

    // Tiger: birdie run ≥3 gives +1 (dominance mode)
    tiger_woods: ({ diff, streak }) => {
      if (diff < 0 && streak >= 3) return 1;
      return 0;
    },

    // Montgomerie: bogey in Ryder Cup gives -1 extra (crowd amplification)
    montgomerie: ({ diff, isRyder }) => {
      if (diff > 0 && isRyder) return -1;
      return 0;
    },
  };

  function apply(playerId, event) {
    const injector = INJECTORS[playerId];
    if (!injector) return 0;
    return injector(event);
  }

  return { apply };

})();

if (typeof module !== 'undefined') module.exports = { ChaosInjectorService };
