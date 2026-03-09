// golf-service/commentary-service.js
// Prompt building and API contract for golf commentary.
// No DOM. No real API calls — apiClient is injected.
// Reference: Martin — DIP; Freeman/Pryce — consumer-driven contracts; Beck — deterministic tests

const CommentaryService = (() => {

  const MODEL      = 'claude-sonnet-4-20250514';
  const MAX_TOKENS_SHOT    = 1200;
  const MAX_TOKENS_DAY     = 900;
  const MAX_TOKENS_NICK    = 30;
  const CHAR_FILE_BASE     = 'https://raw.githubusercontent.com/Asspirited/cusslab/main/characters/';
  const CHARACTER_FILE_MAP = { riley: 'radar', markroe: 'roe', brian_cox: 'cox' };

  // ── Pure helpers ───────────────────────────────────────────────────────────

  function extractCharacterContext(md) {
    const keep     = ['## P1', '## P3', '## P5', '## P6', '## P7', '## P8', '## P9'];
    const sections = md.split(/(?=^## )/m);
    const extracted = sections
      .filter(s => keep.some(h => s.startsWith(h)))
      .join('\n')
      .trim();
    return extracted.slice(0, 3000);
  }

  function buildCommentatorBlock(charId, char, fileContent) {
    if (!char) return '';
    let block = `COMMENTATOR — ${char.name} (${char.initials}):\n`;
    if (fileContent) {
      block += fileContent;
    } else {
      block += `Persona: ${char.persona_full}\nWound: ${char.wound}`;
    }
    if (char.golf_knowledge === 'none' || char.golf_knowledge === 'low') {
      block += `\nGolf knowledge: ${char.golf_knowledge === 'none' ? 'NONE' : 'LOW'}. ${char.golf_knowledge_note || ''}`;
      block += `\nIMPORTANT: ${char.name} must reflect their actual golf knowledge level. Cross-sport references mandatory.`;
    }
    return block;
  }

  function buildPanelEngagementContext(panelState) {
    if (!panelState) return '';
    let out = '';
    if (panelState.playerNickname) {
      out += `\nPLAYER NICKNAME (established, use it): "${panelState.playerNickname}"`;
    }
    if (panelState.runningJokes?.length > 0) {
      const recent = panelState.runningJokes.slice(-2);
      out += `\nRUNNING JOKES IN PLAY (call back to these): ${recent.map(j => j.setup).join(' | ')}`;
    }
    const atmoEscalationDesc = [
      'Professional. Sharp but measured.',
      'The gloves are slightly off. Still technically broadcast-safe.',
      "Characters are saying things they'd normally pull back from.",
      'The professional veneer has cracked. Direct personal attacks are occurring.',
      "Nobody is pretending anymore. This is a roast.",
      'Complete dissolution of professional standards. The producer has left the booth.',
    ][panelState.atmosphere_escalation || 0];
    out += `\nCOMMENTARY REGISTER: ${atmoEscalationDesc}`;
    if (panelState.atmosphere_escalation >= 2) {
      out += `\nATMOSPHERE ESCALATION LEVEL: ${panelState.atmosphere_escalation}/5 — commentators are increasingly willing to say things they shouldn't.`;
    }
    const feudPairs = Object.entries(panelState.panelFeuds || {}).filter(([, v]) => v > 0);
    if (feudPairs.length > 0) {
      out += `\nACTIVE PANEL FEUDS: ${feudPairs.map(([k, v]) => `${k} (intensity ${v}/3)`).join(', ')}`;
    }
    out += `\n\nROASTING RULES:
- The player is being watched by a room full of people who know golf and are not impressed yet.
- Characters should address the player directly at least once per hole.
- Characters should reference each other's previous comments — agree, contradict, escalate.
- Faldo: finds the technical flaw even in success. Never praises without qualification. Will address the player by surname only.
- McGinley: performs warmth. His warmth toward the player is hollow. His warmth toward Faldo is also hollow but in a different direction.
- Riley: has given the player a nickname by now. Uses it. Also has opinions on the caddy.
- Souness: has decided whether the player has bottle. This opinion was formed in hole 1 and has not changed.
- KP: is comparing the player's round to one of his innings. The comparison always flatters KP.
- Brian Cox: has worked out the statistical probability of the player's score. It was not high.
- Characters should occasionally talk directly to each other in their commentary lines — not just about the player.`;
    return out;
  }

  function parseShotResponse(raw) {
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (_) {
      return [];
    }
  }

  // ── Prompt builders ────────────────────────────────────────────────────────

  function buildShotPrompt(ctx) {
    const { tournament: t, player: p, hole, shot, quality, roll, desc,
            yourScore, day, composure, atmosphere, selectedPanel,
            panelState, characterFiles, characters, mpCtx } = ctx;

    const isRyder = t.type === 'ryder';

    const histScore  = p.historicalScores[day] || 0;
    const diff       = yourScore - histScore;
    const diffStr    = diff === 0
      ? `tracking history exactly`
      : diff < 0
        ? `${Math.abs(diff)} shot(s) AHEAD of what ${p.name} actually did`
        : `${diff} shot(s) BEHIND what ${p.name} actually did`;

    const atmoMap = {
      NORMAL:         'Normal professional atmosphere.',
      SIMMERING:      'Suppressed tension — small digs beginning.',
      POWDER_KEG:     'Volatile. Professional restraint barely holding.',
      CHAOS_MODE:     'All pretence dissolved.',
      DEEP_WOUNDS:    'Old wounds surfacing — commentary barely professional.',
      FUNNY_PECULIAR: 'Strange day — comedy and reality have blurred.',
    };
    const compNote = composure <= 3 ? 'Player is visibly crumbling.'
      : composure <= 6 ? 'Composure strain showing.'
      : 'Player appears composed.';

    const commentatorBlocks = selectedPanel
      .map(id => {
        const ch = (characters || []).find(c => c.id === id);
        return buildCommentatorBlock(id, ch, characterFiles?.[id]);
      })
      .join('\n\n');

    const speakerList = selectedPanel
      .map(id => {
        const ch = (characters || []).find(c => c.id === id);
        return `{"speaker":"${ch?.name || id}","initials":"${ch?.initials || '??'}","text":"commentary here"}`;
      })
      .join(',\n  ');

    // For Ryder Cup: inject match play context
    const ryderAddendum = (isRyder && mpCtx)
      ? (typeof MatchPlayService !== 'undefined'
          ? MatchPlayService.buildCommentaryAddendum(ctx, mpCtx)
          : '')
      : '';

    const preamble = isRyder
      ? `You are generating live TV commentary for GOLF ADVENTURE — a Ryder Cup match-play simulation. This is team golf. Every hole is its own contest. National pride, partisan crowds, and individual honour collide.`
      : `You are generating live TV golf commentary for GOLF ADVENTURE — a historic tournament simulation.`;

    const ryderRules = isRyder && mpCtx ? `
RYDER CUP COMMENTARY RULES:
- This is match play — one hole at a time. React to THIS hole's result immediately.
- Reference the match standing (${mpCtx.liveLine}) and its implications.
${mpCtx.historicalResult ? `- One commentator must note how this diverges from or matches the historical result: "${mpCtx.historicalResult}".` : ''}
- Comedy, roasting, and premonition are encouraged — but keep it short and specific.
- NO Augusta/Masters references. This is a Ryder Cup — national pride, team sport.` : '';

    return `${preamble}

TOURNAMENT: ${t.name} (${t.year}) — ${t.course}
PLAYER: ${p.name} — ${p.desc}
PLAYER WOUND: ${p.wound}
DAY: ${day + 1} of ${t.days} · HOLE: ${hole.name} — Par ${hole.par}, ${hole.yards}y
HAZARD: ${hole.hazard}
HISTORICAL SIGNIFICANCE:
${hole.incidents?.length ? hole.incidents.map((inc, i) => `${i + 1}. ${inc}`).join('\n') : 'Famous hole.'}
${ryderAddendum}
SHOT: ${shot.label} (risk ${shot.risk}/4) · DICE: ${roll} · QUALITY: ${quality.toUpperCase()}
DESCRIPTION: ${desc}
SCORE: ${yourScore === 0 ? 'Even' : yourScore > 0 ? '+' + yourScore : yourScore} vs par · ${diffStr}
${compNote}
ATMOSPHERE: ${atmoMap[atmosphere] || atmoMap.NORMAL}${hole.modifiers?.atmosphereNote ? `\nHOLE CONTEXT: ${hole.modifiers.atmosphereNote}` : ''}

YOUR COMMENTARY PANEL THIS SESSION:
${commentatorBlocks}

RULES:
- Each commentator speaks in their authentic voice
- Reference historical significance of the hole where genuine
- Non-golf characters MUST filter everything through their sport/domain — this is the joke
- Characters with no golf knowledge should misread or misunderstand what just happened technically, but may accidentally be right
- Characters with wounds should have those wounds influence their commentary
- If DISASTER: relish the horror
- If MIRACLE: grudging admiration or find fault anyway
${ryderRules}
SHOT COMMENTARY STYLE: One punchy line each. React to what just happened. Reference the last shot's outcome where relevant. Be quick, sharp, funny. Roast the player if warranted. Premonition is fine. Intellectual posturing is fine. NO waffle.
${buildPanelEngagementContext(panelState)}

Return ONLY a JSON array with one entry per commentator, no preamble:
[
  ${speakerList}
]`;
  }

  function buildDayPrompt(ctx) {
    const { tournament: t, player: p, day, yourScore, historicalScore,
            composure, holeResults, holesPerDay, selectedPanel,
            panelState, characterFiles, characters } = ctx;

    const hs       = historicalScore ?? (p.historicalScores[day] || 0);
    const diff     = yourScore - hs;
    const diffNote = diff === 0
      ? `exactly matching history`
      : diff < 0
        ? `${Math.abs(diff)} shot(s) AHEAD of where ${p.name} was historically`
        : `${diff} shot(s) BEHIND where ${p.name} was historically`;

    const absDiff = Math.abs(diff);
    const divergenceDrama = absDiff >= 3
      ? diff < 0
        ? `DIVERGENCE ALERT — ${absDiff} shots AHEAD of history. The panel must explicitly address the rewrite potential: ${p.name} is on course to beat what actually happened. Frame this as the central drama of the day.`
        : `DIVERGENCE ALERT — ${absDiff} shots BEHIND history. The panel must explicitly address the collapse narrative: ${p.name} is falling further from the legend. Frame this as a deterioration, not just a bad day.`
      : '';

    const commentatorBlocks = selectedPanel
      .map(id => {
        const ch = (characters || []).find(c => c.id === id);
        return buildCommentatorBlock(id, ch, characterFiles?.[id]);
      })
      .join('\n\n');

    const speakerList = selectedPanel
      .map(id => {
        const ch = (characters || []).find(c => c.id === id);
        return `{"speaker":"${ch?.name || id}","text":"end-of-day summary here"}`;
      })
      .join(',\n  ');

    const holes = t.holes.slice(0, holesPerDay || 3);
    const holeSummary = holes.map(h => {
      const r = (holeResults || []).find(hr => hr.holeId === h.id && hr.day === day);
      const incidentList = h.incidents?.length
        ? `\n   Historical: ${h.incidents.map((inc, j) => `${j + 1}. ${inc}`).join(' ')}`
        : '';
      const scoreName = r
        ? (['−3 Albatross', '−2 Eagle', '−1 Birdie', 'Par', '+1 Bogey', '+2 Double'][r.diff + 3] || `+${r.diff}`)
        : 'not played';
      return `${h.name}: ${scoreName}${incidentList}`;
    }).join('\n');

    return `End-of-day panel summary for GOLF ADVENTURE.

TOURNAMENT: ${t.name} (${t.year}) · Day ${day + 1} of ${t.days}
PLAYER: ${p.name} · Score: ${yourScore === 0 ? 'Even' : yourScore > 0 ? '+' + yourScore : yourScore} vs par
VS HISTORY: ${diffNote}
COMPOSURE: ${composure}/10
${divergenceDrama ? `\n${divergenceDrama}\n` : ''}
HOLES PLAYED:
${holeSummary}

YOUR PANEL:
${commentatorBlocks}

Each panellist gives a 2-3 sentence end-of-day take: what today revealed, what tomorrow holds. Non-golf characters relate it to their own domain as always. Reference the historical context — are they ahead or behind the legend?${divergenceDrama ? " The divergence must be the centrepiece of at least one panellist's contribution." : ''}

Return ONLY a JSON array:
[
  ${speakerList}
]`;
  }

  function buildNicknamePrompt(ctx) {
    const { player, yourScore, holeIdx, atmosphere, selectedPanel, characters } = ctx;
    const panel = selectedPanel
      .map(id => (characters || []).find(c => c.id === id)?.name)
      .join(', ');
    return `The commentary panel (${panel}) need to give this player a nickname.

Player: ${player?.name}
Performance so far: ${yourScore === 0 ? 'level par' : yourScore > 0 ? `+${yourScore}` : `${yourScore}`} after ${holeIdx + 1} holes.
Atmosphere: ${atmosphere}

Generate ONE nickname. It should be:
- Specific to this player's performance or a wound/characteristic
- Something the panel would genuinely use
- Slightly cruel but not vicious
- The kind of thing that sticks

Return ONLY the nickname as a plain string, no quotes, no explanation.`;
  }

  // ── API calls — apiClient injected ────────────────────────────────────────

  async function shot(ctx, apiClient) {
    const prompt   = buildShotPrompt(ctx);
    const messages = [...(ctx.history || []), { role: 'user', content: prompt }];
    try {
      const data = await apiClient.call({ model: MODEL, max_tokens: MAX_TOKENS_SHOT, messages });
      const raw  = (data.content?.[0]?.text || '[]').replace(/```json|```/g, '').trim();
      return parseShotResponse(raw);
    } catch (_) {
      return [];
    }
  }

  async function daySummary(ctx, apiClient) {
    const prompt   = buildDayPrompt(ctx);
    const messages = [...(ctx.history || []), { role: 'user', content: prompt }];
    try {
      const data = await apiClient.call({ model: MODEL, max_tokens: MAX_TOKENS_DAY, messages });
      const raw  = (data.content?.[0]?.text || '[]').replace(/```json|```/g, '').trim();
      return parseShotResponse(raw);
    } catch (_) {
      return [];
    }
  }

  async function nickname(ctx, apiClient) {
    const prompt = buildNicknamePrompt(ctx);
    try {
      const data = await apiClient.call({
        model: MODEL, max_tokens: MAX_TOKENS_NICK,
        messages: [{ role: 'user', content: prompt }],
      });
      const nick = data.content?.[0]?.text?.trim();
      return (nick && nick.length < 40) ? nick : null;
    } catch (_) {
      return null;
    }
  }

  // ── Character file loader (requires fetch) ─────────────────────────────────

  async function loadCharacterFiles(panel, fetcher) {
    const files = {};
    await Promise.all(panel.map(async charId => {
      const filename = CHARACTER_FILE_MAP[charId] || charId;
      try {
        const resp = await fetcher(CHAR_FILE_BASE + filename + '.md');
        if (resp.ok) {
          const text = await resp.text();
          files[charId] = extractCharacterContext(text);
        }
      } catch (_) {
        // silent — falls back to persona_full in buildCommentatorBlock
      }
    }));
    return files;
  }

  return {
    buildShotPrompt,
    buildDayPrompt,
    buildNicknamePrompt,
    parseShotResponse,
    extractCharacterContext,
    buildCommentatorBlock,
    buildPanelEngagementContext,
    shot,
    daySummary,
    nickname,
    loadCharacterFiles,
  };

})();

if (typeof module !== 'undefined') module.exports = { CommentaryService };
