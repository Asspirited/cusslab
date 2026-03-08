// ── Premonition Engine — panel-agnostic ──────────────────────────────────────
// Exposes global: PremonitionEngine
// Each panel passes a `config` object:
//   { affinities: { charId: { premonition, prediction, running_commentary, retrospective_call, collective_call, truth_teller? } },
//     calculable: ['MOMENT_TYPE', ...],   // binary-outcome moments → PREDICTION mode
//     multiStep:  ['MOMENT_TYPE', ...] }  // sequence moments → RUNNING_COMMENTARY mode

const PremonitionEngine = (() => {

  function blank() {
    return { commits: [], aftermath: {}, rcHolder: null };
  }

  function load(storageKey) {
    try { return JSON.parse(sessionStorage.getItem(storageKey) || 'null') || blank(); }
    catch { return blank(); }
  }

  function save(storageKey, ledger) {
    sessionStorage.setItem(storageKey, JSON.stringify(ledger));
  }

  // Attempt a probabilistic commit for speakerId given the current moment type.
  function maybeCommit(speakerId, momentType, ledger, config) {
    const aff = (config.affinities || {})[speakerId] || {};
    const alreadyOpen = ledger.commits.some(c => c.speakerId === speakerId && !c.resolved);
    if (alreadyOpen) return;
    const isCalculable = (config.calculable || []).includes(momentType);
    const isMultiStep  = (config.multiStep  || []).includes(momentType);
    let mode, affScore;
    if (isCalculable)     { mode = 'PREDICTION';         affScore = aff.prediction        || 0; }
    else if (isMultiStep) { mode = 'RUNNING_COMMENTARY'; affScore = aff.running_commentary || 0; }
    else                  { mode = 'PREMONITION';        affScore = aff.premonition       || 0; }
    if (Math.random() < affScore * 0.7) {
      ledger.commits.push({ speakerId, mode, momentType, resolved: false });
    }
  }

  // Assign RUNNING_COMMENTARY holder to highest-affinity character in draw.
  function assignRC(draw, momentType, ledger, config) {
    const multiStep = config.multiStep || [];
    if (!multiStep.includes(momentType) || ledger.rcHolder) return;
    const aff = config.affinities || {};
    let best = null, bestScore = -1;
    for (const id of draw) {
      const score = (aff[id] || {}).running_commentary || 0;
      if (score > bestScore) { best = id; bestScore = score; }
    }
    ledger.rcHolder = best;
  }

  // Resolve open commits when a terminal moment fires.
  function resolveCommits(momentType, ledger, hitMap, missMap) {
    const hitTargets  = (hitMap  || {})[momentType] || [];
    const missTargets = (missMap || {})[momentType] || [];
    for (const c of ledger.commits) {
      if (c.resolved) continue;
      if (hitTargets.includes(c.momentType))       { c.resolved = true; ledger.aftermath[c.speakerId] = 'GLORY'; }
      else if (missTargets.includes(c.momentType)) { c.resolved = true; ledger.aftermath[c.speakerId] = 'HAUNTED'; }
    }
    if (ledger.rcHolder && (hitTargets.length || missTargets.length)) {
      ledger.aftermath[ledger.rcHolder] = missTargets.length ? 'HAUNTED' : 'GLORY';
      ledger.rcHolder = null;
    }
  }

  // Build the premonition context block for a character's system prompt.
  function buildBlock(speakerId, ledger, config) {
    const aff      = (config.affinities || {})[speakerId] || {};
    const aftermath  = ledger.aftermath[speakerId];
    const openCommit = ledger.commits.find(c => c.speakerId === speakerId && !c.resolved);
    const isRC = ledger.rcHolder === speakerId;
    const lines = [];
    if (aftermath) {
      const desc = {
        GLORY:          'You called it. The room knows. Reference it — once, without overselling it.',
        HAUNTED:        'You got one wrong. The room remembers. You carry it. Do not pretend it did not happen.',
        PARTIAL_CREDIT: 'You were close. Close enough to claim. Not close enough to gloat.',
      };
      lines.push(`AFTERMATH: ${aftermath} — ${desc[aftermath] || aftermath}`);
    }
    if (openCommit) {
      lines.push(`ACTIVE COMMIT: You went on record — ${openCommit.mode} on ${openCommit.momentType}. This is the moment it resolves. React.`);
    }
    if (isRC) {
      lines.push(`RUNNING COMMENTARY: You have the floor. The others are deferring. Build to the moment. This is yours.`);
    }
    if (aff.truth_teller) {
      const falseClaims = ledger.commits.filter(c =>
        !c.resolved && c.mode === 'RETROSPECTIVE_CALL' && c.speakerId !== speakerId
      );
      if (falseClaims.length) {
        const who = [...new Set(falseClaims.map(c => c.speakerId))].join(', ');
        lines.push(`TRUTH-TELLER: ${who} is claiming retrospective credit. You have no record of them calling it. You may call it out.`);
      }
    }
    return lines.length ? `PREMONITION ENGINE:\n${lines.join('\n')}\n\n` : '';
  }

  // Build a human-readable status string for UI display.
  function buildStatus(draw, ledger, memberPool) {
    const parts = [];
    for (const id of draw) {
      const m    = (memberPool || []).find(p => p.id === id);
      if (!m) continue;
      const a    = ledger.aftermath[id];
      const open = ledger.commits.find(c => c.speakerId === id && !c.resolved);
      const isRC = ledger.rcHolder === id;
      if (a)      parts.push(`${m.name}: ${a}`);
      else if (open) parts.push(`${m.name}: ${open.mode} active`);
      else if (isRC) parts.push(`${m.name}: RUNNING COMMENTARY`);
    }
    return parts.join(' · ');
  }

  return { blank, load, save, maybeCommit, assignRC, resolveCommits, buildBlock, buildStatus };
})();
