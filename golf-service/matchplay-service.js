// golf-service/matchplay-service.js
// Ryder Cup match-play domain — context, scoring, formatting, leaderboard.
// No DOM. No API calls.

const MatchPlayService = (() => {

  // Format a match play score for mid-game display ("1 UP", "2 DOWN", "All Square")
  function formatLive(score) {
    if (score === 0) return 'All Square';
    return score > 0 ? `${score} UP` : `${Math.abs(score)} DOWN`;
  }

  // Format final match result ("2&1", "1 UP", "Halved")
  function formatResult(score, holesLeft) {
    if (score === 0) return 'Halved';
    const abs = Math.abs(score);
    if (holesLeft === 0) return abs === 1 ? '1 UP' : `${abs} UP`;
    // Won with holes remaining: e.g. 3&2 means 3 up with 2 to play
    return `${abs}&${holesLeft}`;
  }

  // Build match play context for a given state
  function buildContext(state) {
    if (!state.tournament || state.tournament.type !== 'ryder') return null;
    const mpDay = state.player.matchPlayDays?.[state.day];
    if (!mpDay) return null;

    const holesPlayed = state.holeResults.filter(r => r.day === state.day).length;
    const holesLeft = state.holesPerDay - holesPlayed;

    return {
      format: mpDay.format || 'SINGLES',
      partner: mpDay.partner || null,
      opponent: mpDay.opponent,
      opponentHoleScores: mpDay.opponentHoleScores,
      historicalResult: mpDay.historicalResult || null,
      score: state.matchPlayScore,
      holesPlayed,
      holesLeft,
      liveLine: formatLive(state.matchPlayScore),
      team: state.player.team || 'EUR',
    };
  }

  // Build a Ryder Cup situation string (replaces the inline code in golf-adventure.html buildSituation)
  function buildSituation(state) {
    const ctx = buildContext(state);
    if (!ctx) return null;

    const dayWords = ['first', 'second', 'third'];
    const fmtLabel = ctx.format === 'FOURSOMES' ? 'foursomes (alternate shot)'
      : ctx.format === 'FOURBALLS' ? 'fourballs (best ball)'
      : 'singles';
    const partnerNote = ctx.format !== 'SINGLES' && ctx.partner ? ` alongside ${ctx.partner}` : '';
    const holesNote = ctx.holesLeft > 0 ? ` with ${ctx.holesLeft} to play` : '';
    const teamNote = ctx.team === 'EUR' ? 'Europe needs every point.' : 'USA needs every point.';
    const histNote = ctx.historicalResult ? ` Historical result: ${ctx.historicalResult}.` : '';

    const atmoMap = {
      SIMMERING: ' Something is building.',
      POWDER_KEG: ' The atmosphere is incendiary.',
      CHAOS_MODE: ' Nothing today has gone to plan.',
      DEEP_WOUNDS: ' Old wounds are bleeding into this match.',
      FUNNY_PECULIAR: ' Things have taken a strange turn.',
    };
    const atmoAdd = atmoMap[state.atmosphere] || '';

    return `${state.player.name}. ${dayWords[state.day] || 'Day ' + (state.day + 1)} of ${state.tournament.name} — ${fmtLabel}${partnerNote} against ${ctx.opponent}. ${ctx.liveLine}${holesNote}. ${teamNote}${histNote}${atmoAdd}`;
  }

  // Build in-flight leaderboard across all parallel matches for a Ryder Cup day
  // parallelMatches format: array of { match: "Player A vs Player B", scores: [scoreAfterHole1, scoreAfterHole2, scoreAfterHole3] }
  // score = match play score from perspective of first-named player (+n = first player up, -n = second player up, 0 = AS)
  function buildInflightLeaderboard(tournament, day, holeIdx, userMatchScore, playerName) {
    const pm = tournament.parallelMatches?.[day];
    if (!pm || !pm.length) return null;

    const rows = pm.map(m => {
      const score = m.scores[holeIdx] !== undefined ? m.scores[holeIdx] : 0;
      const label = score === 0 ? 'AS' : score > 0 ? `${score} UP` : `${Math.abs(score)} DN`;
      const cls = score === 0 ? '' : score > 0 ? 'pos' : 'neg'; // from perspective of European/first player
      return { match: m.match, score, label, cls, teamA: m.teamA || 'EUR' };
    });

    return rows;
  }

  // Build the commentary context extension for Ryder Cup shots
  function buildCommentaryAddendum(state, mpCtx) {
    if (!mpCtx) return '';
    const histNote = mpCtx.historicalResult
      ? `\nHISTORICAL MATCH RESULT: ${mpCtx.historicalResult} — the player is altering (or repeating) history.`
      : '';
    const fmtLabel = mpCtx.format === 'FOURSOMES' ? 'Foursomes (alternate shot)'
      : mpCtx.format === 'FOURBALLS' ? 'Fourballs (best ball)'
      : 'Singles';
    return `\nMATCH PLAY CONTEXT:
FORMAT: ${fmtLabel}${mpCtx.partner ? ` — ${state.player.name} & ${mpCtx.partner} vs ${mpCtx.opponent}` : ` — ${state.player.name} vs ${mpCtx.opponent}`}
MATCH STANDING: ${mpCtx.liveLine} with ${mpCtx.holesLeft} hole${mpCtx.holesLeft !== 1 ? 's' : ''} to play${histNote}
TEAM: ${mpCtx.team} — this point matters for the overall Cup.`;
  }

  return {
    formatLive,
    formatResult,
    buildContext,
    buildSituation,
    buildInflightLeaderboard,
    buildCommentaryAddendum,
  };

})();

if (typeof module !== 'undefined') module.exports = { MatchPlayService };
