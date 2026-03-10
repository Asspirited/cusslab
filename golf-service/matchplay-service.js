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
    const session = state.session ?? state.day;
    const mpDay = state.player.matchPlaySessions?.[session] ?? state.player.matchPlayDays?.[session];
    if (!mpDay || mpDay.format === 'ABSENT') return null;

    const holesPlayed = state.holeResults.filter(r => (r.session ?? r.day) === session).length;
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

    const session = state.session ?? state.day;
    const sessionLabel = state.tournament.sessionLabels?.[session] || `Day ${(state.day ?? session) + 1}`;
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

    return `${state.player.name}. ${sessionLabel} of ${state.tournament.name} — ${fmtLabel}${partnerNote} against ${ctx.opponent}. ${ctx.liveLine}${holesNote}. ${teamNote}${histNote}${atmoAdd}`;
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

  // Parse a historicalResult string to 'EUR' | 'USA' | 'HALVED'
  // playerSurname: surname of the player whose matchPlayDay entry this string lives on
  // playerTeam: 'EUR' or 'USA'
  function parseHistoricalResult(str, playerSurname, playerTeam) {
    if (!str) return 'HALVED';
    if (/halved/i.test(str)) return 'HALVED';
    const opposite = playerTeam === 'EUR' ? 'USA' : 'EUR';
    if (/\blost\b/i.test(str)) return opposite;
    // "won" — player's own surname in the winning subject means playerTeam won
    if (playerSurname && new RegExp(playerSurname, 'i').test(str)) return playerTeam;
    return opposite;
  }

  // Build end-of-day points table for a Ryder Cup day.
  // Returns { eurTotal, usaTotal, matches: [{ pair, result, winner, isUser }] }
  function buildEndOfDayLeaderboard(tournament, day, userMatchScore, holesLeft, playerName, playerTeam) {
    if (!tournament || tournament.type !== 'ryder') return null;
    const pm = tournament.parallelMatches?.[day];
    if (!pm || !pm.length) return null;

    const playerSurname = (playerName || '').split(' ').pop();
    let eurTotal = 0, usaTotal = 0;

    const matches = pm.map(m => {
      const isUser = !!playerSurname && new RegExp(playerSurname, 'i').test(m.match);
      let winner, result;

      if (isUser) {
        if (userMatchScore === 0 && holesLeft === 0) {
          winner = 'HALVED'; result = 'Halved';
        } else {
          result = formatResult(userMatchScore, holesLeft);
          winner = userMatchScore > 0 ? playerTeam : (playerTeam === 'EUR' ? 'USA' : 'EUR');
        }
      } else {
        const allPlayers = tournament.players || [];
        const matched = allPlayers.find(p => {
          const mpd = p.matchPlayDays?.[day];
          if (!mpd || mpd.format === 'ABSENT') return false;
          const sur = p.name.split(' ').pop();
          return new RegExp(sur, 'i').test(m.match);
        });

        if (matched) {
          const mpd = matched.matchPlayDays[day];
          const sur = matched.name.split(' ').pop();
          winner = parseHistoricalResult(mpd.historicalResult, sur, matched.team || 'EUR');
          result = mpd.historicalResult || 'Halved';
        } else {
          const lastScore = m.scores?.[m.scores.length - 1] ?? 0;
          const teamA = m.teamA || 'EUR';
          const teamB = teamA === 'EUR' ? 'USA' : 'EUR';
          if (lastScore === 0) { winner = 'HALVED'; result = 'Halved'; }
          else if (lastScore > 0) { winner = teamA; result = formatResult(lastScore, 0); }
          else { winner = teamB; result = formatResult(Math.abs(lastScore), 0); }
        }
      }

      if (winner === 'HALVED') { eurTotal += 0.5; usaTotal += 0.5; }
      else if (winner === 'EUR') eurTotal += 1;
      else usaTotal += 1;

      return { pair: m.match, result, winner, isUser };
    });

    return { eurTotal, usaTotal, matches };
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

  // Return the index of the first matchPlayDay that is not ABSENT.
  // Returns 0 if the player has no matchPlayDays (normal stroke-play fallback).
  function firstActiveDay(player) {
    const days = player.matchPlayDays;
    if (!days || !days.length) return 0;
    const idx = days.findIndex(d => d.format !== 'ABSENT');
    return idx === -1 ? 0 : idx;
  }

  // Returns true if the player's matchPlayDays entry for this day is ABSENT.
  function isDayAbsent(player, day) {
    return player.matchPlayDays?.[day]?.format === 'ABSENT';
  }

  // ── BL-112: 5-session structure ──────────────────────────────────────────────

  // Return the index of the first matchPlaySession that is not ABSENT.
  // Returns 0 if the player has no matchPlaySessions.
  function firstActiveSession(player) {
    const sessions = player.matchPlaySessions;
    if (!sessions || !sessions.length) return 0;
    const idx = sessions.findIndex(s => s.format !== 'ABSENT');
    return idx === -1 ? 0 : idx;
  }

  // Returns true if the player's matchPlaySessions entry for this session is ABSENT.
  function isSessionAbsent(player, session) {
    return player.matchPlaySessions?.[session]?.format === 'ABSENT';
  }

  // Add a session's EUR/USA points to a running team score object.
  // teamScore: { EUR: number, USA: number } — mutated in place, also returned.
  function addSessionToTeamScore(teamScore, sessionEUR, sessionUSA) {
    teamScore.EUR += sessionEUR;
    teamScore.USA += sessionUSA;
    return teamScore;
  }

  // Build end-of-session points table for a Ryder Cup session.
  // User's match is always added as an explicit row (not detected by name in pm).
  // If playerName is null, only parallelMatches rows are returned (rest screen use).
  // Returns { eurTotal, usaTotal, matches: [{ pair, result, winner, isUser }] }
  function buildEndOfSessionLeaderboard(tournament, session, userMatchScore, holesLeft, playerName, playerTeam) {
    if (!tournament || tournament.type !== 'ryder') return null;
    const pm = tournament.parallelMatches?.[session];
    if (!pm || !pm.length) return null;

    let eurTotal = 0, usaTotal = 0;

    // All rows from parallelMatches are other matches (not the user's)
    const matches = pm.map(m => {
      const allPlayers = tournament.players || [];
      const sessionKey = 'matchPlaySessions';
      const dayKey = 'matchPlayDays';
      const matched = allPlayers.find(p => {
        const mpd = p[sessionKey]?.[session] || p[dayKey]?.[session];
        if (!mpd || mpd.format === 'ABSENT') return false;
        const sur = p.name.split(' ').pop();
        return new RegExp(sur, 'i').test(m.match);
      });

      let winner, result;
      if (matched) {
        const mpd = matched.matchPlaySessions?.[session] || matched.matchPlayDays?.[session];
        const sur = matched.name.split(' ').pop();
        winner = parseHistoricalResult(mpd.historicalResult, sur, matched.team || 'EUR');
        result = mpd.historicalResult || 'Halved';
      } else {
        const lastScore = m.scores?.[m.scores.length - 1] ?? 0;
        const teamA = m.teamA || 'EUR';
        const teamB = teamA === 'EUR' ? 'USA' : 'EUR';
        if (lastScore === 0) { winner = 'HALVED'; result = 'Halved'; }
        else if (lastScore > 0) { winner = teamA; result = formatResult(lastScore, 0); }
        else { winner = teamB; result = formatResult(Math.abs(lastScore), 0); }
      }

      if (winner === 'HALVED') { eurTotal += 0.5; usaTotal += 0.5; }
      else if (winner === 'EUR') eurTotal += 1;
      else usaTotal += 1;

      return { pair: m.match, result, winner, isUser: false };
    });

    // Add user's own match as explicit row
    if (playerName) {
      let userWinner, userResult;
      if (userMatchScore === 0 && holesLeft === 0) {
        userWinner = 'HALVED'; userResult = 'Halved';
      } else if (userMatchScore === 0 && holesLeft > 0) {
        // match still in progress — treat as halved for leaderboard
        userWinner = 'HALVED'; userResult = formatLive(userMatchScore);
      } else {
        userResult = formatResult(userMatchScore, holesLeft);
        userWinner = userMatchScore > 0 ? playerTeam : (playerTeam === 'EUR' ? 'USA' : 'EUR');
      }
      if (userWinner === 'HALVED') { eurTotal += 0.5; usaTotal += 0.5; }
      else if (userWinner === 'EUR') eurTotal += 1;
      else usaTotal += 1;
      matches.push({ pair: playerName, result: userResult, winner: userWinner, isUser: true });
    }

    return { eurTotal, usaTotal, matches };
  }

  // Build rest-screen data for a session the player is ABSENT from.
  // Uses the final hole score from each parallel match's scores array.
  // Returns { title, eurTotal, usaTotal, matches: [{ pair, result, winner, isUser: false }] }
  function buildRestScreenData(tournament, session) {
    if (!tournament || tournament.type !== 'ryder') return null;
    const pm = tournament.parallelMatches?.[session];
    if (!pm || !pm.length) return null;
    const title = tournament.sessionLabels?.[session] || `Session ${session + 1}`;

    let eurTotal = 0, usaTotal = 0;
    const matches = pm.map(m => {
      const lastScore = m.scores?.[m.scores.length - 1] ?? 0;
      const teamA = m.teamA || 'EUR';
      const teamB = teamA === 'EUR' ? 'USA' : 'EUR';
      let winner, result;
      if (lastScore === 0) { winner = 'HALVED'; result = 'Halved'; }
      else if (lastScore > 0) { winner = teamA; result = formatResult(lastScore, 0); }
      else { winner = teamB; result = formatResult(Math.abs(lastScore), 0); }
      if (winner === 'HALVED') { eurTotal += 0.5; usaTotal += 0.5; }
      else if (winner === 'EUR') eurTotal += 1;
      else usaTotal += 1;
      return { pair: m.match, result, winner, isUser: false };
    });

    return { title, eurTotal, usaTotal, matches };
  }

  return {
    formatLive,
    formatResult,
    buildContext,
    buildSituation,
    buildInflightLeaderboard,
    buildCommentaryAddendum,
    parseHistoricalResult,
    buildEndOfDayLeaderboard,
    firstActiveDay,
    isDayAbsent,
    // BL-112 session API
    firstActiveSession,
    isSessionAbsent,
    addSessionToTeamScore,
    buildEndOfSessionLeaderboard,
    buildRestScreenData,
  };

})();

if (typeof module !== 'undefined') module.exports = { MatchPlayService };
