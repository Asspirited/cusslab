// Cloudflare Worker — Survival School + Cusslab proxy

// SS-059 — Social Dynamics Engine: shared instruction block (module-level, used in all pages).
const SOCIAL_DYNAMICS_ENGINE = `
SOCIAL DYNAMICS ENGINE (SS-059) — fires independently on ~35% of responses:
Characters have documented history with each other and with their own records.
They are unreliable narrators of their own competence. They do not lie — they rationalise.

When this engine fires, select one type:
- wound_reference: a character invokes their documented real incident as credential or deflection
- lie: a character embellishes, omits, or quietly protects their reputation
- callout: another character (directly or obliquely) notes the discrepancy — once, briefly
- wolf_pack: two or more characters pile on the same subject without coordinating
- none: characters respond independently (baseline — makes the others land harder)

Rules:
- This engine is independent of CONTRADICTION ENGINE. Both may fire in the same response (wave interference).
- When 'lie' fires: the lie is sincere. The character is not performing. They have reframed the incident.
- When 'callout' fires: it is oblique, not a speech. One sentence. The subject does not acknowledge it.
- When 'wolf_pack' fires: characters do not reference each other — they independently arrive at the same pile-on.
- 'none' is valid and important — the restraint makes other instances land harder.

OUTPUT field (always present, even when type is 'none'):
"panel_tension":{"type":"wound_reference|lie|callout|wolf_pack|none","subject":"<charId or empty string>","by":["<charId>"],"note":"<one line — what is happening, or empty string for none>"}`;

// ── Composure Engine (SS-088) ─────────────────────────────────────────────────
// Per-character emotional profiles. Composure 0–10.
// State computed server-side, returned to client, sent back on next request.
// Tiers: HIGH 7-10 (baseline), STEADY 4-6 (shifting), RATTLED 2-3 (pressure active), GONE 0-1 (collapse)

const COMPOSURE_PROFILES = {
  ray:     { baseline: 8, pressure: 'quieter — shorter sentences, more specific, stops offering solutions',   tell: 'becomes very precise about small details; asks a clarifying question he already knows the answer to' },
  fox:     { baseline: 9, pressure: 'colder — drops all explanation, just threat vectors and exit routes',    tell: 'shorter sentences only; no context offered; just the assessment' },
  bear:    { baseline: 7, pressure: 'defensive — starts referencing expeditions that went fine, name-drops',  tell: 'mentions a past trip without prompting; the trip was fine; this is also fine' },
  hales:   { baseline: 8, pressure: 'fewer words — two words, maybe one; drops the Aboriginal knowledge',     tell: 'just the verdict; no citation; may not finish the sentence' },
  cody:    { baseline: 6, pressure: 'feet escalating — feet become more relevant; the better option closer',  tell: 'getting more precise about exactly how close the better option was; the number shrinks each round' },
  stroud:  { baseline: 7, pressure: 'withdrawn — stops referencing the group; camera was rolling',            tell: 'talks about what he would have done alone; the group is no longer mentioned' },
  stevens: { baseline: 9, pressure: 'mystical — starts addressing a snake that may or may not be present',   tell: 'the snake is past, future, or theoretical; the register is the same regardless' },
  cox:     { baseline: 5, pressure: 'retreating to physics — full napkin deployment',                         tell: 'the equations are on the napkin; he is showing you the napkin; this is not about the napkin' },
  faldo:   { baseline: 6, pressure: 'wrong golf increasingly specific — names the hole, names the year',      tell: 'wind direction, grip pressure, pin position; the analogy is more detailed and more wrong' },
  jim:     { baseline: 3, pressure: 'liar liar — cannot stop stating actual severity, does not want to',     tell: 'his face is doing something; he is aware it is doing something; it does not stop' },
  jeremy:  { baseline: 8, pressure: 'full fish — nothing registers that is not a species or a river',        tell: 'has quietly stopped processing the conversation; the notebook is open' },
};

function initComposureState() {
  const state = {};
  for (const [id, p] of Object.entries(COMPOSURE_PROFILES)) {
    state[id] = p.baseline;
  }
  return state;
}

function computeComposureDeltas(current, panelTension) {
  const next = Object.assign({}, current);
  for (const [id, p] of Object.entries(COMPOSURE_PROFILES)) {
    if (next[id] === undefined) next[id] = p.baseline;
  }
  const targeted = [];
  if (panelTension && panelTension.type !== 'none') {
    const subject = panelTension.subject;
    const by = panelTension.by || [];
    if (panelTension.type === 'wound_reference' && subject && next[subject] !== undefined) {
      next[subject] = Math.max(0, next[subject] - 1);
      targeted.push(subject);
    } else if (panelTension.type === 'lie') {
      by.forEach(id => { if (next[id] !== undefined) { next[id] = Math.max(0, next[id] - 1); targeted.push(id); } });
    } else if (panelTension.type === 'callout' && subject && next[subject] !== undefined) {
      next[subject] = Math.max(0, next[subject] - 2);
      targeted.push(subject);
    } else if (panelTension.type === 'wolf_pack' && subject && next[subject] !== undefined) {
      next[subject] = Math.max(0, next[subject] - 3);
      targeted.push(subject);
      by.forEach(id => targeted.push(id));
    }
  }
  for (const id of Object.keys(next)) {
    if (!targeted.includes(id) && COMPOSURE_PROFILES[id]) {
      const cap = COMPOSURE_PROFILES[id].baseline;
      next[id] = Math.min(cap, parseFloat((next[id] + 0.5).toFixed(1)));
    }
  }
  return next;
}

function composureTier(val) {
  if (val >= 7) return 'HIGH';
  if (val >= 4) return 'STEADY';
  if (val >= 2) return 'RATTLED';
  return 'GONE';
}

function buildComposureInjection(composureState, panelCharIds) {
  if (!composureState) return '';
  const chars = (panelCharIds || Object.keys(COMPOSURE_PROFILES)).filter(id => COMPOSURE_PROFILES[id]);
  const shifted = chars.filter(id => composureTier(composureState[id] ?? COMPOSURE_PROFILES[id].baseline) !== 'HIGH');
  const ordered = [...chars].sort((a, b) =>
    (composureState[a] ?? COMPOSURE_PROFILES[a].baseline) - (composureState[b] ?? COMPOSURE_PROFILES[b].baseline)
  );
  const lines = shifted.map(id => {
    const p = COMPOSURE_PROFILES[id];
    const val = Math.round(composureState[id] ?? p.baseline);
    const tier = composureTier(val);
    const name = id.toUpperCase();
    if (tier === 'STEADY')  return `${name} [STEADY ${val}/10]: register shifting. ${p.tell}.`;
    if (tier === 'RATTLED') return `${name} [RATTLED ${val}/10]: pressure active — ${p.pressure}. ${p.tell}.`;
    if (tier === 'GONE')    return `${name} [GONE ${val}/10]: ${p.pressure}. ${p.tell}. No recovery mid-response.`;
    return '';
  }).filter(Boolean);

  let injection = `\nCOMPOSURE STATE (overrides PANEL TRIAGE ORDER — lowest composure speaks first):\nSpeaking sequence: ${ordered.join(' → ')}`;
  if (lines.length) injection += `\n${lines.join('\n')}`;
  return injection + '\n';
}



const SURVIVAL_SCHOOL_HOME = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@700&family=Barlow:wght@400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <!-- SS-044 tiled homepage -->
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:           #0f1209;
      --surface:      #181d10;
      --surface2:     #1e2514;
      --green:        #7aad3a;
      --green-bright: #a0d050;
      --bark:         #8B6040;
      --text:         #e8edd8;
      --text-muted:   #7a8a60;
      --blood:        #cc1111;
      --border:       rgba(122,173,58,0.18);
      --border-strong:rgba(122,173,58,0.32);
      --radius:       6px;
      --radius-lg:    10px;
    }

    body {
      font-family: 'Barlow', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ── HEADER ─────────────────────────────────────────────────────────── */
    header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 24px;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .logo-mark { height: 22px; width: auto; flex-shrink: 0; }

    .logo-text {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 26px;
      letter-spacing: 3px;
      line-height: 1;
      color: var(--text);
    }
    .logo-text .s-blood { color: var(--blood); }
    .logo-text .logo-school { color: #BA7517; }

    .logo-sub {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      letter-spacing: 2px;
      color: var(--text-muted);
      margin-top: 3px;
      text-transform: uppercase;
      height: 14px;
      overflow: hidden;
      position: relative;
    }

    .tagline-track {
      position: absolute;
      top: 0; left: 0;
      display: flex;
      flex-direction: column;
    }

    .tagline-track span {
      display: block;
      height: 14px;
      line-height: 14px;
      opacity: 0;
      animation: tagline-fade 28s infinite;
    }

    .tagline-track span:nth-child(1) { animation-delay: 0s; }
    .tagline-track span:nth-child(2) { animation-delay: 3.5s; }
    .tagline-track span:nth-child(3) { animation-delay: 7s; }
    .tagline-track span:nth-child(4) { animation-delay: 10.5s; }
    .tagline-track span:nth-child(5) { animation-delay: 14s; }
    .tagline-track span:nth-child(6) { animation-delay: 17.5s; }
    .tagline-track span:nth-child(7) { animation-delay: 21s; }
    .tagline-track span:nth-child(8) { animation-delay: 24.5s; }

    @keyframes tagline-fade {
      0%    { opacity: 0; }
      2%    { opacity: 1; }
      10.5% { opacity: 1; }
      12.5% { opacity: 0; }
      100%  { opacity: 0; }
    }

    /* ── TILE GRID ───────────────────────────────────────────────────────── */
    main {
      flex: 1;
      padding: 36px 24px 48px;
    }

    .section-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      letter-spacing: 2.5px;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 12px;
      margin-top: 32px;
    }

    .section-label:first-child { margin-top: 0; }

    .tile-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      max-width: 920px;
    }

    .tile {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-decoration: none;
      color: inherit;
      transition: border-color 0.14s, background 0.14s;
      min-height: 130px;
    }

    .tile:hover {
      border-color: var(--border-strong);
      background: var(--surface2);
    }

    .tile.soon {
      opacity: 0.4;
      pointer-events: none;
    }

    .tile-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2px;
    }

    .tile-cat {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 8px;
      letter-spacing: 1.5px;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .tile-badge {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 8px;
      padding: 2px 6px;
      border-radius: 20px;
      letter-spacing: 0.5px;
    }

    .badge-live {
      background: rgba(122,173,58,0.2);
      color: var(--green-bright);
    }

    .badge-soon {
      background: rgba(122,138,96,0.1);
      color: var(--text-muted);
    }

    .tile-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 20px;
      letter-spacing: 1px;
      color: var(--text);
      line-height: 1.1;
    }

    .tile-desc {
      font-family: 'Barlow', sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: var(--text-muted);
      flex: 1;
      margin-top: 2px;
    }

    /* ── MOBILE ──────────────────────────────────────────────────────────── */
    @media (max-width: 700px) {
      .tile-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 480px) {
      header { flex-direction: column; align-items: flex-start; padding: 10px 16px; gap: 6px; }
      .logo-mark { height: 18px; width: auto; }
      main { padding: 20px 14px 32px; }
      .tile-grid { grid-template-columns: 1fr; gap: 8px; }
    }
  </style>
</head>
<body>

<header>
  <!-- Bowie knife logo — SS-023 -->
  <svg class="logo-mark" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Handle — dark wood -->
    <rect x="0" y="9" width="13" height="6" rx="2" fill="#3d2010"/>
    <line x1="3"  y1="10" x2="3"  y2="14" stroke="#251008" stroke-width="0.8" stroke-linecap="round"/>
    <line x1="6"  y1="10" x2="6"  y2="14" stroke="#251008" stroke-width="0.8" stroke-linecap="round"/>
    <line x1="9"  y1="10" x2="9"  y2="14" stroke="#251008" stroke-width="0.8" stroke-linecap="round"/>
    <line x1="11" y1="10" x2="11" y2="14" stroke="#251008" stroke-width="0.8" stroke-linecap="round"/>
    <!-- Crossguard -->
    <rect x="13" y="7" width="3" height="10" rx="1" fill="#706050"/>
    <!-- Blade body -->
    <path d="M16 10.5 L65 7.5 L75 12 L65 15.5 L16 13.5 Z" fill="#7a8878"/>
    <!-- Spine highlight -->
    <path d="M16 10.5 L65 7.5 L75 12" stroke="#9aaa98" stroke-width="0.7" fill="none"/>
    <!-- Edge shadow -->
    <path d="M16 13.5 L65 15.5 L75 12" stroke="#5a6858" stroke-width="0.4" fill="none"/>
    <!-- Blood drip at tip -->
    <path d="M75 12 Q76.5 13.5 76 16 Q75.8 17.5 75.5 18.5" stroke="#cc1111" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.9"/>
  </svg>
  <div>
    <div class="logo-text"><span class="s-blood">S</span>URVIVAL <span class="logo-school">SCHOOL</span></div>
    <div class="logo-sub">
      <div class="tagline-track">
        <span>ask them... before you bleed out.</span>
        <span>just (don't) do it.</span>
        <span>is it too late? find out fast.</span>
        <span>no fear?&trade; good. you need some.</span>
        <span>probably the best panel in the world.</span>
        <span>think different. or don't think at all.</span>
        <span>finger lickin' fatality. FINISH HIM.</span>
        <span>the panel knows more than you.</span>
      </div>
    </div>
  </div>
</header>

<main>

  <div class="section-label">The Doors</div>
  <div class="tile-grid">

    <a class="tile" href="/survival-school/rooms">
      <div class="tile-top">
        <span class="tile-cat">The Corridor</span>
        <span class="tile-badge badge-live">LIVE</span>
      </div>
      <div class="tile-title">The Doors</div>
      <div class="tile-desc">Six doors. One guide. You don't know what's behind them until it's too late.</div>
    </a>

  </div>

  <div class="section-label">Assessment</div>
  <div class="tile-grid">

    <a class="tile" href="/survival-school/app">
      <div class="tile-top">
        <span class="tile-cat">Survival</span>
        <span class="tile-badge badge-live">LIVE</span>
      </div>
      <div class="tile-title">How Screwed Am I?</div>
      <div class="tile-desc">Your situation. The panel's verdict. Survival probability and what to do next.</div>
    </a>

    <a class="tile" href="/survival-school/fact-checker">
      <div class="tile-top">
        <span class="tile-cat">Verification</span>
        <span class="tile-badge badge-live">LIVE</span>
      </div>
      <div class="tile-title">Bear Fact-Checker</div>
      <div class="tile-desc">Bear's field claims. Independently verified. Panel agrees or doesn't.</div>
    </a>

    <a class="tile" href="/survival-school/coyote">
      <div class="tile-top">
        <span class="tile-cat">Pain Scale</span>
        <span class="tile-badge badge-live">LIVE</span>
      </div>
      <div class="tile-title">The Coyote Index</div>
      <div class="tile-desc">Coyote Peterson rates your incident. Rigorously. Panel reacts to the number.</div>
    </a>

    <a class="tile" href="/survival-school/eat">
      <div class="tile-top">
        <span class="tile-cat">Field Decisions</span>
        <span class="tile-badge badge-live">LIVE</span>
      </div>
      <div class="tile-title">Will You Eat It?</div>
      <div class="tile-desc">Threat assessment before you commit your mouth. Panel delivers a verdict.</div>
    </a>

    <a class="tile soon" href="#">
      <div class="tile-top">
        <span class="tile-cat">Infiltration</span>
        <span class="tile-badge badge-soon">SOON</span>
      </div>
      <div class="tile-title">One Man In</div>
      <div class="tile-desc">Fit. Alone. Compromised. Craighead runs the brief. No chain of command.</div>
    </a>

    <a class="tile" href="/survival-school/panel-qa">
      <div class="tile-top">
        <span class="tile-cat">Open Q</span>
        <span class="tile-badge badge-live">LIVE</span>
      </div>
      <div class="tile-title">Panel Q&amp;A</div>
      <div class="tile-desc">Ask the panel anything about survival. Six answers. None of them agree on fire.</div>
    </a>

  </div>

  <div class="section-label">Scenarios</div>
  <div class="tile-grid">

    <a class="tile" href="/survival-school/worst">
      <div class="tile-top">
        <span class="tile-cat">Already Bitten</span>
        <span class="tile-badge badge-live">LIVE</span>
      </div>
      <div class="tile-title">I've Been Bit, Guys</div>
      <div class="tile-desc">Already compromised. You've made a decision. Panel reacts to what you did.</div>
    </a>

    <a class="tile" href="/survival-school/mundane">
      <div class="tile-top">
        <span class="tile-cat">Mundane Emergency</span>
        <span class="tile-badge badge-live">LIVE</span>
      </div>
      <div class="tile-title">Mundane Mode</div>
      <div class="tile-desc">The panel treats your Monday morning as a wilderness emergency. They don't know this.</div>
    </a>

    <a class="tile" href="/survival-school/deathmatch">
      <div class="tile-top">
        <span class="tile-cat">The Colosseum</span>
        <span class="tile-badge badge-live">LIVE</span>
      </div>
      <div class="tile-title">Animal Deathmatch</div>
      <div class="tile-desc">Two animals. One outcome. Attenborough narrates. Panel disagrees with the result.</div>
    </a>

    <a class="tile live" href="/survival-school/irwin-memorial">
      <div class="tile-top">
        <span class="tile-cat">Irwin Memorial</span>
        <span class="tile-badge badge-live">LIVE</span>
      </div>
      <div class="tile-title">You're alright mate...</div>
      <div class="tile-desc">Describe an animal encounter. Steve finds the animal. Panel rates your nerve.</div>
    </a>

  </div>

</main>

</body>
</html>
`;
const SURVIVAL_SCHOOL_APP  = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>How Screwed Am I? — Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0f1209;
      --surface: #181d10;
      --surface2: #1e2514;
      --border: rgba(120,160,60,0.15);
      --border-strong: rgba(120,160,60,0.3);
      --green: #7aad3a;
      --green-dim: #4a7020;
      --green-bright: #a0d050;
      --amber: #BA7517;
      --amber-dim: #5c3a08;
      --bark: #8B6040;
      --bark-dim: #3d2008;
      --text: #e8edd8;
      --text-muted: #7a8a60;
      --blood: #cc1111;
      --blood-dim: #3a0808;
    }

    body {
      font-family: 'Barlow', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
    }

    #app {
      max-width: 680px;
      margin: 0 auto;
      padding: 1.5rem 1rem 3rem;
    }

    .header {
      text-align: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 0.5px solid var(--border);
    }

    .title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 40px;
      letter-spacing: 3px;
      line-height: 1;
    }

    .title span { color: var(--blood); }

    .subtitle {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 1.5px;
      margin-top: 5px;
    }

    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 1.25rem;
    }

    .tab {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      letter-spacing: 1px;
      padding: 7px 14px;
      border: 0.5px solid var(--border);
      border-radius: 6px;
      cursor: pointer;
      background: var(--surface);
      color: var(--text-muted);
      transition: all 0.15s;
    }

    .tab.active { background: var(--blood); color: white; border-color: var(--blood); }

    .input-panel { display: none; }
    .input-panel.active { display: block; }

    .field-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 1.5px;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 6px;
      margin-top: 14px;
    }

    .field-label:first-child { margin-top: 0; }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 8px;
    }

    .chip {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      padding: 5px 10px;
      border: 0.5px solid var(--border-strong);
      border-radius: 5px;
      cursor: pointer;
      background: none;
      color: var(--text-muted);
      transition: all 0.15s;
      white-space: nowrap;
      user-select: none;
    }

    .chip:hover, .chip.sel { border-color: var(--green); color: var(--green); }

    input[type="text"], textarea {
      width: 100%;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      padding: 9px 12px;
      border: 0.5px solid var(--border-strong);
      border-radius: 6px;
      background: var(--surface);
      color: var(--text);
      outline: none;
      transition: border-color 0.15s;
    }

    input[type="text"]:focus, textarea:focus { border-color: var(--green); }
    textarea { resize: vertical; }

    .btn-row { display: flex; gap: 8px; margin-top: 14px; }

    .btn-assess {
      flex: 1;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 11px;
      background: var(--green);
      color: var(--bg);
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: opacity 0.15s;
    }

    .btn-assess:hover { opacity: 0.88; }
    .btn-assess:disabled { opacity: 0.4; cursor: not-allowed; }

    .btn-clear {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      letter-spacing: 1px;
      padding: 11px 16px;
      border: 0.5px solid var(--border-strong);
      border-radius: 6px;
      background: none;
      cursor: pointer;
      color: var(--text-muted);
      transition: color 0.15s, border-color 0.15s;
    }

    .btn-clear:hover { color: var(--text); border-color: var(--green); }

    /* Results */
    .results { display: none; margin-top: 1.5rem; }
    .results.show { display: block; }

    .loading {
      padding: 2rem;
      text-align: center;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      color: var(--text-muted);
      letter-spacing: 1px;
    }

    .dots::after {
      content: '';
      animation: dots 1.5s steps(3, end) infinite;
    }

    @keyframes dots {
      0%   { content: '.'; }
      33%  { content: '..'; }
      66%  { content: '...'; }
      100% { content: ''; }
    }

    .verdict-bar {
      border: 0.5px solid var(--border);
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 1rem;
      background: var(--surface);
    }

    .verdict-top {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .verdict-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 2px;
      color: var(--text-muted);
    }

    .pct {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 52px;
      color: var(--blood);
      line-height: 1;
      transition: color 0.5s;
    }

    .pct.ok  { color: var(--green); }
    .pct.mid { color: var(--amber); }

    .meter {
      height: 4px;
      background: var(--border);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .meter-fill {
      height: 100%;
      background: var(--blood);
      border-radius: 2px;
      transition: width 1.2s ease, background 0.5s;
    }

    .meter-fill.ok  { background: var(--green); }
    .meter-fill.mid { background: var(--amber); }

    .att-verdict {
      font-family: 'Barlow', sans-serif;
      font-weight: 300;
      font-style: italic;
      font-size: 14px;
      line-height: 1.7;
      color: var(--text-muted);
    }

    .panel-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 2px;
      color: var(--text-muted);
      margin-bottom: 10px;
    }

    .char-card {
      border: 0.5px solid var(--border);
      border-radius: 10px;
      margin-bottom: 8px;
      overflow: hidden;
      background: var(--surface);
    }

    .char-card.death-card { border-color: var(--blood); }
    .char-card.char-bear { background: rgba(120,134,107,0.15); }
    .char-card.char-ray { background: rgba(85,107,47,0.15); }
    .char-card.char-fox { background: rgba(74,74,74,0.2); }
    .char-card.char-hales { background: rgba(200,134,10,0.12); }
    .char-card.char-cody { background: rgba(139,115,85,0.15); }
    .char-card.char-stroud { background: rgba(47,79,79,0.2); }
    .char-card.char-attenborough { background: rgba(27,58,45,0.2); }
    .char-card.char-oshea { background: rgba(139,69,19,0.15); }
    .char-card.char-stevens { background: rgba(122,92,30,0.15); }
    .char-card.char-gordon { background: rgba(201,150,42,0.12); }
    .char-card.char-billy { background: rgba(107,39,55,0.15); }
    .char-card.char-ollie { background: rgba(61,90,107,0.15); }
    .char-card.char-craighead { background: rgba(139,115,85,0.12); }
    .char-card.char-coyote { background: rgba(204,85,0,0.12); }

    .card-head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      background: var(--surface2);
      border-bottom: 0.5px solid var(--border);
    }

    .avatar {
      width: 30px; height: 30px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }

    .av-green  { background: var(--green-dim);  color: var(--green-bright); }
    .av-bark   { background: var(--bark-dim);   color: var(--bark); }
    .av-amber  { background: var(--amber-dim);  color: var(--amber); }
    .av-blue   { background: #0c1f3a;           color: #5a9fd4; }
    .av-gray   { background: #1e1e1c;           color: #7a8a70; }

    .char-name {
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.5px;
      color: var(--text);
    }

    .char-role {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: var(--text-muted);
    }

    .card-body {
      padding: 11px 14px;
      font-family: 'Barlow', sans-serif;
      font-size: 14px;
      line-height: 1.7;
      color: var(--text);
      font-weight: 400;
    }

    .death-note {
      margin-top: 8px;
      padding: 7px 11px;
      background: var(--blood-dim);
      border-left: 3px solid var(--blood);
      border-radius: 0 4px 4px 0;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--blood);
      font-weight: 500;
    }

    .fact-check {
      margin-top: 6px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      border-top: 0.5px solid var(--border);
      padding-top: 6px;
      opacity: 0.7;
    }

    /* Attenborough bookends */
    .att-bookend {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 10px 14px;
      background: var(--surface);
      border: 0.5px solid var(--border);
      border-radius: 8px;
    }

    .att-avatar {
      width: 26px; height: 26px;
      background: #1e1e1c;
      color: #7a8a70;
      border-radius: 50%;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 9px;
      letter-spacing: 0.5px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .att-text {
      font-family: 'Barlow', sans-serif;
      font-weight: 300;
      font-style: italic;
      font-size: 14px;
      line-height: 1.7;
      color: var(--text-muted);
    }

    #att-opening { margin-bottom: 12px; }

    #att-verdict {
      margin-top: 12px;
      opacity: 0;
      transition: opacity 0.8s ease;
    }

    #att-verdict.visible { opacity: 1; }

    /* Inline turn bookends (reaction loop) */
    .att-turn-header {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      padding: 8px 0 4px;
    }

    .att-turn-verdict {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      padding: 8px 0 4px;
      margin-top: 4px;
    }

    .att-turn-verdict.att-fade {
      opacity: 0;
      transition: opacity 0.8s ease;
    }

    .att-turn-verdict.att-fade.visible { opacity: 1; }

    .att-mini-avatar {
      width: 20px; height: 20px;
      background: #1e1e1c;
      color: #7a8a70;
      border-radius: 50%;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 8px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      margin-top: 3px;
    }

    .att-mini-text {
      font-family: 'Barlow', sans-serif;
      font-weight: 300;
      font-style: italic;
      font-size: 13px;
      line-height: 1.7;
      color: var(--text-muted);
    }

    /* Interaction */
    #interaction-block { display: none; margin-top: 1rem; }

    .decision-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .decision-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 2px;
      color: var(--green);
    }

    .turn-pct {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
    }

    .action-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 10px;
    }

    .action-chip {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      padding: 5px 11px;
      border: 0.5px solid var(--border-strong);
      border-radius: 5px;
      cursor: pointer;
      color: var(--text-muted);
      background: none;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .action-chip:hover, .action-chip.sel {
      border-color: var(--green);
      color: var(--green);
      background: var(--surface2);
    }

    .decision-input-row {
      display: flex;
      gap: 8px;
    }

    .btn-decide {
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 1.5px;
      padding: 9px 16px;
      background: var(--green);
      color: var(--bg);
      border: none;
      border-radius: 6px;
      cursor: pointer;
      white-space: nowrap;
      transition: opacity 0.15s;
    }

    .btn-decide:hover { opacity: 0.88; }

    /* Turn history */
    .turn-divider {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 3px;
      color: var(--green-dim);
      text-align: center;
      padding: 10px 0 6px;
      border-top: 0.5px solid var(--border);
      margin-top: 8px;
    }

    .situation-update {
      font-family: 'Barlow', sans-serif;
      font-weight: 300;
      font-style: italic;
      font-size: 13px;
      color: var(--text-muted);
      padding: 8px 0;
      margin-top: 4px;
    }

    /* Terminal */
    .terminal {
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      margin-bottom: 12px;
    }

    .terminal-dead {
      background: var(--blood-dim);
      border: 0.5px solid var(--blood);
    }

    .terminal-alive {
      background: var(--green-dim);
      border: 0.5px solid var(--green);
    }

    .terminal-label {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      letter-spacing: 3px;
      color: var(--text);
      margin-bottom: 6px;
    }

    .terminal-sub {
      font-family: 'Barlow', sans-serif;
      font-weight: 300;
      font-style: italic;
      font-size: 13px;
      color: var(--text-muted);
    }

    .reset-row { margin-top: 1rem; text-align: center; }

    .btn-reset {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      background: none;
      border: 0.5px solid var(--border-strong);
      border-radius: 6px;
      padding: 7px 16px;
      cursor: pointer;
      letter-spacing: 1px;
      transition: all 0.15s;
    }

    .btn-reset:hover { color: var(--text); border-color: var(--green); }

    /* ── Cascade steps (SS-043) ─────────────────────────────────────────── */
    .step.hidden { display: none; }
    .step-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; margin-top: 14px; }
    .step-head .field-label { margin: 0; }
    .btn-skip { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1px; color: var(--text-muted); background: none; border: none; cursor: pointer; padding: 2px 0; transition: color 0.15s; }
    .btn-skip:hover { color: var(--green); }
    .group-nav { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
    .group-btn { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1px; padding: 4px 9px; border: 0.5px solid var(--border); border-radius: 4px; cursor: pointer; background: none; color: var(--text-muted); transition: all 0.15s; white-space: nowrap; }
    .group-btn.active { border-color: var(--green); color: var(--green); }
    .absurdity-divider { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--green-dim); margin: 10px 0 6px; text-align: center; }
    .ctx-section { margin-top: 10px; }
    .ctx-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 1.5px; color: var(--green-dim); margin-bottom: 5px; text-transform: uppercase; }
  </style>
</head>
<body>
<div id="app">

  <div class="header">
    <div class="title">HOW <span>SCREWED</span> AM I?</div>
    <div class="subtitle">the panel will be honest with you. you may not enjoy it.</div>
  </div>

  <div class="tabs">
    <div class="tab active" id="tab-guided" onclick="onTabClick('guided')">GUIDED</div>
    <div class="tab" id="tab-free" onclick="onTabClick('free')">FREETEXT</div>
  </div>

  <div class="input-panel active" id="panel-guided">

    <!-- STEP 1: LOCATION -->
    <div class="step" id="step-loc">
      <div class="field-label">01 — WHERE ARE YOU?</div>
      <div class="group-nav" id="group-nav"></div>
      <div class="chips" id="loc-chips"></div>
      <input type="text" id="loc-input" placeholder="or describe your location..." oninput="onLocFree(this.value)"/>
    </div>

    <!-- STEP 2: CONDITIONS -->
    <div class="step hidden" id="step-cond">
      <div class="step-head">
        <div class="field-label">02 — CONDITIONS</div>
        <button class="btn-skip" onclick="skipTo('evt')">SKIP →</button>
      </div>
      <div class="chips" id="cond-chips"></div>
      <input type="text" id="cond-input" placeholder="or describe conditions..." oninput="onCondFree(this.value)"/>
    </div>

    <!-- STEP 3: EVENTS -->
    <div class="step hidden" id="step-evt">
      <div class="step-head">
        <div class="field-label">03 — WHAT'S HAPPENING</div>
        <button class="btn-skip" onclick="skipTo('ctx')">SKIP →</button>
      </div>
      <div class="chips" id="evt-chips"></div>
      <div class="absurdity-divider">— ALSO POSSIBLE —</div>
      <div class="chips" id="absurdity-chips"></div>
      <input type="text" id="evt-input" placeholder="or describe what's happening..." oninput="onEvtFree(this.value)"/>
    </div>

    <!-- STEP 4: CONTEXT -->
    <div class="step hidden" id="step-ctx">
      <div class="step-head">
        <div class="field-label">04 — CONTEXT</div>
        <button class="btn-skip" onclick="updateAssessBtn()">SKIP →</button>
      </div>
      <div class="ctx-section">
        <div class="ctx-label">TIME OF DAY</div>
        <div class="chips" id="ctx-time"></div>
      </div>
      <div class="ctx-section">
        <div class="ctx-label">MENTAL STATE</div>
        <div class="chips" id="ctx-mental"></div>
      </div>
      <div class="ctx-section">
        <div class="ctx-label">KIT</div>
        <div class="chips" id="ctx-kit"></div>
      </div>
      <div class="ctx-section">
        <div class="ctx-label">COMPANY</div>
        <div class="chips" id="ctx-company"></div>
      </div>
    </div>

    <div class="ctx-section" id="complicating-section">
      <div class="ctx-label">COMPLICATING FACTORS (optional)</div>
      <div class="chips" id="chips-complicating">
        <div class="chip chip-complicating" data-factor="Bear is your lead advisor. He was recently seen at a Travelodge 400m from the filming location.">Bear: the Travelodge</div>
        <div class="chip chip-complicating" data-factor="The panel's snake expert has been wearing the snake. Specifically, a belt and wallet set made from the species he claims to protect.">wearing the species</div>
        <div class="chip chip-complicating" data-factor="Your survival advisor Cody Lundin just threw the only fire-making equipment into a swimming pool rather than demonstrate what he considers bad technique.">Cody: spear in the pool</div>
        <div class="chip chip-complicating" data-factor="One of the panel members has been sleeping in a snake pit for 107 days and considers this normal research methodology. His colleagues have written papers about him. He has not read them.">Stevens: the snake pit</div>
        <div class="chip chip-complicating" data-factor="The panel's herpetologist forgot a venomous snake was in his bag, put his hand back in, and got bitten again. His mate Doug poured beer on him and urinated on his head. He survived.">Gordon: the bag incident</div>
        <div class="chip chip-complicating" data-factor="Prof Brian Cox is on the panel. He has a napkin and is explaining the thermodynamics of your death with genuine enthusiasm. The physics is correct. It is not helping.">Cox: the napkin</div>
      </div>
    </div>

    <div class="btn-row" style="margin-top:14px">
      <button class="btn-assess" id="btn-guided" onclick="onAssess('guided')" disabled>ASSESS MY SITUATION ↗</button>
      <button class="btn-clear" onclick="onClear()">CLEAR</button>
    </div>
  </div>

  <div class="input-panel" id="panel-free">
    <div class="field-label">Describe your situation</div>
    <textarea id="free-input" rows="5"
      placeholder="I'm on Dartmoor, it's October, phone at 4%, no map, dusk in 90 minutes, wearing trainers..."
      oninput="onFreeInput(this.value)"></textarea>

    <div class="ctx-section" id="complicating-section-free" style="margin-top:12px">
      <div class="ctx-label">COMPLICATING FACTORS (optional)</div>
      <div class="chips" id="chips-complicating-free">
        <div class="chip chip-complicating" data-factor="Bear is your lead advisor. He was recently seen at a Travelodge 400m from the filming location.">Bear: the Travelodge</div>
        <div class="chip chip-complicating" data-factor="The panel's snake expert has been wearing the snake. Specifically, a belt and wallet set made from the species he claims to protect.">wearing the species</div>
        <div class="chip chip-complicating" data-factor="Your survival advisor Cody Lundin just threw the only fire-making equipment into a swimming pool rather than demonstrate what he considers bad technique.">Cody: spear in the pool</div>
        <div class="chip chip-complicating" data-factor="One of the panel members has been sleeping in a snake pit for 107 days and considers this normal research methodology. His colleagues have written papers about him. He has not read them.">Stevens: the snake pit</div>
        <div class="chip chip-complicating" data-factor="The panel's herpetologist forgot a venomous snake was in his bag, put his hand back in, and got bitten again. His mate Doug poured beer on him and urinated on his head. He survived.">Gordon: the bag incident</div>
        <div class="chip chip-complicating" data-factor="Prof Brian Cox is on the panel. He has a napkin and is explaining the thermodynamics of your death with genuine enthusiasm. The physics is correct. It is not helping.">Cox: the napkin</div>
      </div>
    </div>

    <div class="btn-row" style="margin-top:12px">
      <button class="btn-assess" id="btn-free" onclick="onAssess('free')">ASSESS MY SITUATION ↗</button>
    </div>
  </div>

  <div class="results" id="results">
    <div class="loading" id="loading">
      <span>PANEL CONVENING</span><span class="dots"></span>
    </div>
    <div id="verdict-block" style="display:none">
      <div class="att-bookend" id="att-opening" style="display:none">
        <div class="att-avatar">DA</div>
        <div class="att-text"></div>
      </div>
      <div class="verdict-bar">
        <div class="verdict-top">
          <div class="verdict-label">SURVIVAL PROBABILITY</div>
          <div class="pct" id="surv-pct">0%</div>
        </div>
        <div class="meter">
          <div class="meter-fill" id="pct-fill" style="width:0%"></div>
        </div>
      </div>
      <div class="panel-label">PANEL ASSESSMENT</div>
      <div id="cards-out"></div>
      <div class="att-bookend" id="att-verdict" style="display:none">
        <div class="att-avatar">DA</div>
        <div class="att-text"></div>
      </div>
    </div>
    <div id="interaction-block"></div>
  </div>

</div>

<script>
// === characters.js ===

// characters.js — v2 with Jason Fox and interaction loop support
// Anti-Corruption Layer. Single source of truth for all character data.

const CHARACTERS = {
  ray: {
    id: 'ray', name: 'Ray Mears', role: 'Bushcraft',
    av: 'RM', avClass: 'av-green',
    deathLine: 'You could be dead within the hour.',
    voice: \`RAY MEARS — Bushcraft, 30+ years field experience.
Cerebral, warm, loves the land. Great storyteller. Chubby survivalist —
kebab van just off camera, never mentioned, always implied.
Delivers five-minute meditation on interconnectedness then roasts it with evident satisfaction.
VOICE: Never dramatic. Brevity is power. "Don't." is a complete sentence.
Silence more eloquent than anything about Bear. Stories build slowly to a point.
SKILLS: Fire 99, Shelter 97, Tool-making 98, Plant Knowledge 88, Navigation 90.\`
  },
  bear: {
    id: 'bear', name: 'Bear Grylls', role: 'Former SAS',
    av: 'BG', avClass: 'av-bark',
    deathLine: 'If you get this wrong, you will not make it out of here alive.',
    voice: \`BEAR GRYLLS — Former SAS. Genuine SAS credentials. Also drinks own urine when Londis is forty yards away.
Gets ill eating things he didn't need to eat. Idiocy is sincere, not performed.
Comedy engine: gap between SAS credentials and Londis forty yards away.
Genuinely believes dramatic version IS the technique. No ironic distance whatsoever.
VOICE: Urgent, evangelical, slightly breathless. Personal anecdote always — abroad, fine in the end.
"Hydration?" unprompted every third response. Fact-checker footnote fires on factual claims.
SKILLS: Psychology 92, Endurance 95, Navigation 80, Fire 70.\`
  },
  cody: {
    id: 'cody', name: 'Cody Lundin', role: 'Primitive Skills',
    av: 'CL', avClass: 'av-green',
    deathLine: 'I have watched people make this mistake. They are no longer with us.',
    voice: \`CODY LUNDIN — Aboriginal Living Skills School, Prescott Arizona. Barefoot on glaciers.
Threw fire-making supplies into pool rather than demonstrate bad technique. Chose integrity over career.
Comedy engine: always knows better option that was right there. "Cattails. Thirty feet away."
VOICE: Patient, quiet, certain. Mentions feet/footwear when relevant. Never dramatic.
Cody Override fires when asked to endorse wrong survival advice — refuses.
SKILLS: Fire 97, Plant Knowledge 96, Tool-making 95, Psychology 95, Endurance 93.\`
  },
  hales: {
    id: 'hales', name: 'Les Hiddins', role: 'Bush Tucker Man',
    av: 'LH', avClass: 'av-amber',
    deathLine: 'Have a look at that.',
    voice: \`LES HIDDINS — Major, Australian Army. Bush Tucker Man. Vietnam veteran.
Walked 2,500km of remote northern Australia cataloguing food sources with the energy of a man doing light admin.
Witchetty grubs taste like almonds raw, roast chicken cooked. He says this as a statement of fact, not a boast.
CATCHPHRASE: "Have a look at this." — his most reliable opener, delivered like show-and-tell.
FOOD VERDICT: "Not too bad — a bit starchy." is his highest compliment. Never performs disgust or enthusiasm.
KNOWLEDGE: Cites Aboriginal survival practices constantly and with genuine respect. "The Aboriginal people have been eating this for 40,000 years." This is not filler — it's his point.
VOICE: Understated, educational, unhurried. Treats eating anything unusual or dangerous as practically interesting.
Australian idiom used naturally: "She'll be right." "Have a crack at it." "That'll do the job."
NEVER three-word responses — he has vocabulary and uses it with measured calm.
Frowns slightly if called tough. Never heard of Bear Grylls. Finds survival genuinely fascinating rather than heroic.
SKILLS: Plant Knowledge 95, Psychology 95, Endurance 90, Water 90.\`
  },
  fox: {
    id: 'fox', name: 'Jason Fox', role: 'Special Boat Service',
    av: 'JF', avClass: 'av-green',
    deathLine: 'That is not a recoverable position.',
    voice: \`JASON FOX — Foxy. Royal Marines at 16. SBS from 2001. "Like the SAS but better."
Demolitions expert, combat swimmer, dog handler, jungle survival expert.
Warm, self-deprecating, genuinely funny. Absolute killing machine. No contradiction in his mind.
Comedy engine: tactical reframe of everything. Panel talks shelter. Fox assesses defensibility,
lines of sight, exit routes, what is available as improvised incendiary. Not doing it to be funny.
VOICE PATTERNS:
1. Flat deflation — remarkable things delivered as admin. "Needed to pay bills, there we go."
2. Calls it what it is, moves on — "gobshite. But he'd love it." One word, then useful info.
3. Logical framework for feelings — emotions as problems to diagnose and resolve.
4. Tactical reframe — threat assessment, lines of sight, entry/exit, improvised weapons.
5. Self-deprecating then immediately competent.
"Is that a dog walker or a contact?" is the template register. Swears naturally, matter-of-fact.
NEVER make mental health a punchline. Ever.
SKILLS: Navigation 96, Endurance 97, Terrain/Weather 92, Tool-making 88, Psychology 90.\`
  },
  attenborough: {
    id: 'attenborough', name: 'David Attenborough', role: 'Natural World',
    av: 'DA', avClass: 'av-gray',
    deathLine: 'And so the story ends. As so many do. Quietly. And entirely predictably.',
    voice: \`DAVID ATTENBOROUGH — 97 years watching things die. Your mistake is a Holocene footnote.
Comedy engine: geological calm applied to your specific predicament.
VOICE: Never gives survival advice — observes, describes, delivers verdict.
Gaps matter as much as words. "Fascinating" always genuine. Narrates as nature documentary.
Attenborough Eulogy closes every death state — one paragraph, never comedic in register, always in effect.
SKILLS: Animal Encounters 95, Psychology 85. Everything practical: 0. Has a crew for this.\`
  },
  stroud: {
    id: 'stroud', name: 'Les Stroud', role: 'Survivorman',
    av: 'LS', avClass: 'av-blue',
    deathLine: '',
    voice: \`LES STROUD — Survivorman. Canadian. Entirely alone — no crew, films himself.
Refused producer demands to fake survival. Walked away from money for authenticity.
One harmonica note is a complete response sometimes.
VOICE: Mild, slightly distant, genuine. "That didn't work." on camera and means it.
Wears shoes — Cody has feelings about this.
SKILLS: Endurance 90, Shelter 90, Water 88, Psychology 85, Navigation 85.\`
  }
};

const SHARED_CONTEXT = \`
RELATIONSHIPS:
- Bear/Ray: Ray never says Bear is wrong. Silence and contrast do the work.
- Bear/Fox: Fox finds Bear broadly fine. Thinks Bear would have passed selection. Doesn't say this.
- Fox/Cody: Both genuinely competent, neither performs it. Fox finds barefoot thing tactically suboptimal.
- Fox/Hales: Fox finds Hales immediately credible. "Yeah he's good." Full endorsement.
- Fox/Attenborough: Non-threatening, high-value, zero tactical utility. Treats him with warmth.
- Cody/Stroud: Stroud wears shoes. One long look. Silence.
- Attenborough/everyone: Closes every scene.

PANEL CONVERSATION — characters are in the same room. They hear each other. Use this:
- Later characters may react briefly to what an earlier character said — a short phrase, a contradiction, a pointed silence made text. One or two cross-references per response, never more.
- Bear says something dramatic: Cody's opening may be "He's not wrong, but—" or "The alternative was right there."
- Ray says something measured: Bear agrees with evangelical energy in a way that suggests partial comprehension.
- Fox will call out Bear's overstatement with one flat sentence. "That's not accurate."
- Hales can validate or gently contradict with three words. "He's not wrong." "Not quite right."
- Stroud speaks last or near-last. Quiet acknowledgement of the room, then his own conclusion.
- Direct address is allowed: "What Ray said—", "Bear's right on one thing.", "I wouldn't do what Bear did."
- Keep it brief. Conversation is texture, not the point. Never more than one sentence of cross-reference.

DEATH COMMENTARY: Earned — not wallpaper. Fires on clearly wrong call, dire situation (under 35%), or panel disagreement.

FOUNDING PHILOSOPHY: Real knowledge. Genuine consequence. No performance. Comedy earned by knowledge being real.\`;


// Panel characters (excludes Attenborough — he does bookends, not panel cards)
const PANEL_IDS = ['ray', 'bear', 'cody', 'hales', 'fox', 'stroud'];

function buildSystemPrompt(mode = 'assessment') {
  const chars = Object.values(CHARACTERS)
    .map(c => \`=== \${c.name.toUpperCase()} ===\\n\${c.voice}\`)
    .join('\\n\\n');

  if (mode === 'reaction') {
    return \`You are the Survival School panel reaction engine. A user has made a survival decision. React to that specific choice in character.

\${chars}

\${SHARED_CONTEXT}

ATTENBOROUGH BOOKEND STRUCTURE — Attenborough does NOT appear in the panel array. He bookends the whole response:
- attenborough_opening: one sentence, nature documentary register, frames what this decision is about to cause. Observational, slightly ominous.
- attenborough_verdict: one sentence, geological calm, no appeal, the turn's conclusion. He already knew.

PANEL TRIAGE ORDER (SS-034) — follow this sequence:
1. IMMEDIATE (Ray, Fox): What to do RIGHT NOW. Clinical. Ray: craft-based action. Fox: threat still active? exit options?
2. COMEDY/OBSERVATION (Bear, Hales, Cody, Stroud): Once the immediate has landed. Bear: anecdote, hydration. Hales: three words. Cody: better option. Stroud: quiet verdict.
The comedy only works after the immediate layer. Do not mix the order.

Panel characters (no Attenborough): Ray, Bear, Cody, Hales, Fox, Stroud.
- Ray: IMMEDIATE — technically correct? Craft judgement. Goes first.
- Fox: IMMEDIATE — threat still active? lines of sight, exit options. Goes second.
- Bear: COMEDY — anecdote somewhere exotic, fine in the end, hydration unprompted.
- Hales: COMEDY — three words. Maximum. Understated. Cites Aboriginal knowledge.
- Cody: OBSERVATION — better option that was right there. "Cattails. Thirty feet away."
- Stroud: VERDICT — quiet, measured. Slight melancholy.

Survival probability shifts:
- Good decision: +10 to +20
- Neutral: no change
- Poor: -15 to -25
- Catastrophic: -30 to -50

Generate 3 specific next actions the user could take from here.
If probability reaches 0 or situation fully resolves, set is_terminal to true.

ATTENBOROUGH EULOGY (SS-014): When is_terminal is true AND survival_probability is 0 (death), include attenborough_eulogy — one paragraph, geological calm, never comedic in register, always comedic in effect. References specific details from this specific situation. He does not console. He observes. The comedy comes from the precision and the calm, not from any attempt at comedy.

${SOCIAL_DYNAMICS_ENGINE}

OUTPUT — valid JSON only, no markdown:
{"survival_probability":<integer>,"attenborough_opening":"<one sentence, nature doc, frames what the decision is about to cause>","situation_update":"<one sentence what changed>","panel":[{"charId":"ray","text":"<2-3 sentences>"},{"charId":"fox","text":"<2-3 sentences>"},{"charId":"bear","text":"<2-3 sentences>","fact_check":"<optional>"},{"charId":"hales","text":"<1-2 sentences>"},{"charId":"cody","text":"<2-3 sentences>"},{"charId":"stroud","text":"<1-2 sentences>"}],"attenborough_verdict":"<one sentence, geological calm, turn conclusion, he already knew>","next_actions":["<action>","<action>","<action>"],"is_terminal":<bool>,"attenborough_eulogy":"<one paragraph, death only, geological calm, never comic in register, always in effect — omit if not terminal death>","panel_tension":{"type":"wound_reference|lie|callout|wolf_pack|none","subject":"<charId or empty>","by":["<charId>"],"note":"<one line or empty string>"}}\`;
  }

  if (mode === 'mundane') {
    return \`You are the Survival School panel. The user has described a MUNDANE, EVERYDAY problem. Apply full survival gravity. This is the joke — the greater the gravity, the funnier.

\${chars}

\${SHARED_CONTEXT}

MUNDANE MODE: The situation is not a survival emergency. The panel doesn't know this.
They assess with the same weight they would give a man trapped on Dartmoor in October.

ATTENBOROUGH BOOKEND STRUCTURE — Attenborough does NOT appear in the panel array. He bookends:
- attenborough_opening: one sentence, introduces the mundane situation as if it's a wildlife encounter. "And here, in the fluorescent ecology of the Wetherspoons, a specimen faces a challenge that, while modest in geological terms, carries its own quiet urgency."
- attenborough_verdict: one sentence, geological calm. Final verdict. He always knew.

PANEL TRIAGE ORDER (SS-034) — responses must follow this sequence:
1. IMMEDIATE (Ray, Fox): Stakes first. Ray identifies the real risks in the mundane situation. Fox assesses exit routes and lines of sight. Both are genuinely concerned.
2. COMEDY/OBSERVATION (Bear, Hales, Cody, Stroud): Once the immediate has landed. Bear has done something similar abroad, fine in the end. Hales: three words maximum. Cody: better option that was right there. Stroud: quiet verdict.
The comedy only works after the immediate layer has established that the situation is being taken seriously.

Panel characters (no Attenborough): Ray, Fox, Bear, Hales, Cody, Stroud.
- Ray: IMMEDIATE — identifies the real risks in the mundane. Genuinely concerned. Goes first.
- Fox: IMMEDIATE — tactical assessment. Exit routes from the post office queue. Lines of sight. Goes second.
- Bear: COMEDY — has done something similar, abroad, fine in the end.
- Hales: COMEDY — understated, educational. 1-2 sentences. "Have a look at this." Cites Aboriginal knowledge.
- Cody: OBSERVATION — points out the better option that was right there. "The bus stop. Fifty yards away."
- Stroud: VERDICT — quiet, measured. Slightly melancholy.

Survival probability: 0-100. For mundane scenarios this is usually 40-85% — they're not great situations, but survivable with the right mindset. A truly catastrophic mundane scenario (printer has run out of ink, presentation in 10 minutes) may drop lower.

${SOCIAL_DYNAMICS_ENGINE}

OUTPUT — valid JSON only, no markdown:
{"survival_probability":<integer 0-100>,"attenborough_opening":"<one sentence, nature documentary, introduces mundane situation as wildlife encounter>","panel":[{"charId":"ray","text":"<2-3 sentences>"},{"charId":"fox","text":"<2-3 sentences>"},{"charId":"bear","text":"<2-3 sentences>","fact_check":"<optional>"},{"charId":"hales","text":"<1-2 sentences>"},{"charId":"cody","text":"<2-3 sentences>"},{"charId":"stroud","text":"<1-2 sentences>"}],"attenborough_verdict":"<one sentence, geological calm, final verdict>","panel_tension":{"type":"wound_reference|lie|callout|wolf_pack|none","subject":"<charId or empty>","by":["<charId>"],"note":"<one line or empty string>"}}\`;
  }

  return \`You are the Survival School panel assessment engine.

\${chars}

\${SHARED_CONTEXT}

ATTENBOROUGH BOOKEND STRUCTURE — Attenborough does NOT appear in the panel array. He bookends the whole assessment:
- attenborough_opening: one sentence, nature documentary register, introduces the situation as if it's a wildlife encounter. Sets the stakes. Slightly ominous.
- attenborough_verdict: one sentence, geological calm, no appeal. The documentary's conclusion. He already knew.

PANEL TRIAGE ORDER (SS-034) — responses must follow this sequence:
1. IMMEDIATE (Ray, Fox): What to do RIGHT NOW. Clinical, no drama. Ray: craft-based action, technically correct. Fox: threat still active? lines of sight, exit options.
2. COMEDY/OBSERVATION (Bear, Hales, Cody, Stroud): Once the immediate has landed. Bear: anecdote, somewhere exotic, fine in the end, hydration unprompted. Hales: three words. Cody: better option that was right there. Stroud: quiet verdict.
The comedy only works if the immediate layer has set the stakes first. Do not mix the order.

Panel characters (no Attenborough): Ray, Fox, Bear, Hales, Cody, Stroud.
- Ray: IMMEDIATE — is it technically correct? Craft judgement. Brief. Goes first.
- Fox: IMMEDIATE — threat still active? lines of sight, exit options, what's available. Goes second.
- Bear: COMEDY — anecdote, somewhere exotic, fine in the end, hydration unprompted.
- Hales: COMEDY — three words. Maximum. Understated. Educational.
- Cody: OBSERVATION — was there a better option right there? "Cattails. Thirty feet away."
- Stroud: VERDICT — quiet, measured. Slight melancholy.

Generate initial assessment. Also produce 3 specific suggested first actions.

${SOCIAL_DYNAMICS_ENGINE}

OUTPUT — valid JSON only, no markdown:
{"survival_probability":<integer 0-100>,"attenborough_opening":"<one sentence, nature doc, introduces situation as wildlife encounter, slightly ominous>","panel":[{"charId":"ray","text":"<2-4 sentences>"},{"charId":"fox","text":"<2-4 sentences>"},{"charId":"bear","text":"<2-4 sentences>","fact_check":"<optional>"},{"charId":"hales","text":"<2-3 sentences>"},{"charId":"cody","text":"<2-4 sentences>"},{"charId":"stroud","text":"<1-2 sentences>"}],"attenborough_verdict":"<one sentence, geological calm, no appeal, the documentary's conclusion>","next_actions":["<action>","<action>","<action>"],"panel_tension":{"type":"wound_reference|lie|callout|wolf_pack|none","subject":"<charId or empty>","by":["<charId>"],"note":"<one line or empty string>"}}\`;
}



// === scenarios.js (inlined) ===

const LOCATION_GROUPS = [
  { group: 'Wilderness', locations: [
    { id: 'amazon', label: 'Amazon basin', conditions: ['rainy season — rivers rising','dry season, midday, 40\u00b0C','river at dusk','jungle night — zero visibility'], events: ['jaguar','anaconda','Brazilian wandering spider','caiman','piranha (in water)','bullet ant colony','flash flood','lost — no canopy GPS signal','river crossing gone wrong','quicksand'] },
    { id: 'scottish_highlands', label: 'Scottish Highlands', conditions: ['October gale, exposed ridge','midwinter dawn, -10\u00b0C','haar fog — visibility 5m','unexpected sunshine (still dangerous)'], events: ['red deer (rutting stag)','adder','highland cattle','golden eagle (aggressive — nest nearby)','exposure — core temperature dropping','bog — submerged to knee','ankle on scree, 3 miles from car','white-out — no horizon'] },
    { id: 'serengeti', label: 'Serengeti / Maasai Mara', conditions: ['migration season — wildebeest everywhere','dry season, midday, 42\u00b0C','dusk — predators active','night — no torch'], events: ['lion (pride, with cubs)','leopard (tree, above you)','cape buffalo','black mamba','elephant (mock charge, unclear if mock)','pack of spotted hyenas','hippo (out of water)','vehicle broken down — on foot now'] },
    { id: 'sonoran_desert', label: 'Sonoran Desert, Arizona', conditions: ['midday, 46\u00b0C, no shade','dawn, 4\u00b0C, dropping','dusk, flash storm incoming','night, clear, -2\u00b0C'], events: ['diamondback rattlesnake','Gila monster','bark scorpion (in shoe)','coyote (pack, closing in)','dehydration — 1 litre left','flash flood (arroyo, no warning)','lost — GPS dead, sun at zenith'] },
    { id: 'himalayas', label: 'Himalayan approach, above 4,000m', conditions: ['altitude sickness setting in','whiteout — storm in 20 minutes','clear, -20\u00b0C, wind chill -35\u00b0C','monsoon season — trail gone'], events: ['snow leopard','yak (loose, annoyed)','avalanche — small but enough','crevasse — one leg through','HACE symptoms beginning','partner incapacitated','tent destroyed — bivouac only'] },
    { id: 'antarctic_station', label: 'Antarctic research station (winter-over)', conditions: ['polar night — 3 months of dark','white-out, -55\u00b0C wind chill','inside station — something is wrong','outside, tether lost'], events: ['leopard seal (fell through ice)','equipment failure — heating gone','colleague behaving strangely (The Thing rules apply)','supply drop missed — 6 months to next','frostbite, fingers, early stage','fire in the station (only warmth for miles)'] },
    { id: 'north_sea', label: 'North Sea, small boat', conditions: ['force 8, January, nightfall','fog — visibility 20m, shipping lane','engine failure, drifting','calm, but that means nothing out here'], events: ['overboard — water temp 6\u00b0C','hull breach, taking on water','container ship, not seeing you','flare kit — one left','someone unconscious below deck','orca (rare, but they do this now)'] },
  ]},
  { group: 'Dangerous Jobs', locations: [
    { id: 'comms_tower', label: 'Replacing bulb on 600m comms tower', conditions: ['two-thirds up, wind picking up','equipment malfunction at the top','clear day — the view is not helping','ice on rungs, discovered at 400m'], events: ['harness clip failure','wind gust, lateral, significant','hand cramp — both hands','colleague below not answering radio','bird of prey — nesting, directly above target','forgot the bulb'] },
    { id: 'chernobyl', label: 'Chernobyl exclusion zone', conditions: ['1986, liquidator deployment, day 1','modern tourist — guide has wandered off','night — dosimeter behaving unusually','rain — ground contamination mobilised'], events: ['dosimeter reading unexpected','structure unstable underfoot','wolf pack (thriving, unfortunately)','guide says "this is fine" — it is not fine'] },
    { id: 'rnli', label: 'RNLI lifeboat, force 9, 3am', conditions: ['force 9 gusting 10, black water','casualty vessel sinking — minutes left','crew member overboard','engine at 60%, radio intermittent'], events: ['casualty in water, hypothermic','second vessel, unlit, approaching','wave pooped the boat','casualty panicking, fighting rescue','fuel situation becoming relevant'] },
    { id: 'saturation_diver', label: 'Saturation diver, North Sea, 300m', conditions: ['bell cut off from surface — briefly','visibility zero, current significant','decompression schedule disrupted','something outside the bell'], events: ['umbilical snagged','dive partner unresponsive','surface comms gone — both channels','pressure anomaly in the bell','something large, unidentified, nearby'] },
  ]},
  { group: 'Work & Commuting', locations: [
    { id: 'm25_breakdown', label: 'M25 contraflow, broken down, lane 1', conditions: ['rush hour, lorries at 56mph, 2m gap','rain, visibility poor, hazards on','night, no hard shoulder','AA ETA: 90 minutes'], events: ['lorry not moving over','phone at 4%','passenger needs the toilet','tyre completely flat — spare is also flat','van driver shouting, unclear if at you'] },
    { id: 'london_underground', label: 'London Underground, rush hour', conditions: ['Jubilee line, 8:47am, signal failure ahead','stopped in tunnel — no announcement','Victoria line, someone eating a full McDonald\\'s','Northern line, air con non-functional, July'], events: ['door closing on your bag','man with saxophone, unasked','someone crying, everyone pretending not to notice','mice on the track — more than usual','announcement: "we are being held"'] },
    { id: 'pret_a_manger', label: 'Pret a Manger — queue incident', conditions: ['lunchtime, 12:47, one item left of the thing you want','man behind you already too close','barista has called your name wrong three times','card machine down — cash only sign appeared after you ordered'], events: ['someone pushes in — directly, no ambiguity','your order given to someone else who takes it','heated disagreement at the condiments station','you are the one who caused the queue','almond milk situation, not your fault, everyone thinks it is'] },
    { id: 'open_plan_office', label: 'Open-plan office, 3pm', conditions: ['post-lunch, everyone watching','all-hands meeting in 8 minutes, you are presenting','hot desk — your usual spot taken','someone microwaved fish'], events: ['eating something loud — unavoidable','Teams call, camera on, cat is doing something','printer jammed — you touched it last','sneezing, repeatedly, during silence','your screen reflected in the window behind you'] },
  ]},
  { group: 'Holiday Destinations', locations: [
    { id: 'all_inclusive', label: 'All-inclusive resort, pool bar', conditions: ['11am, swim-up bar, ice situation developing','peak afternoon, every sunbed taken, you left yours','buffet opens in 4 minutes, position critical','entertainment team have noticed you'], events: ['sunbed reserved with towel — disputed claim','swim-up bar run out of your drink','entertainment staff approaching with microphone','wasp — singular, purposeful','your wristband stopped working'] },
    { id: 'safari_vehicle', label: 'Safari vehicle — engine won\\'t start', conditions: ['dusk, predators active, 6km from camp','dawn, lion pride crossed the road 40m back','midday, 44\u00b0C, no shade outside the vehicle','guide has gone to look at something'], events: ['lion approaching vehicle — curious','elephant broadside, not moving','guide has been gone 12 minutes','radio battery dead','someone in the group wants to get out for a photo'] },
    { id: 'budget_airline', label: 'Budget airline, middle seat, 9 hours', conditions: ['taxiing — you need the toilet immediately','3 hours in, no sign of trolley','turbulence — moderate, sustained','landing approach, person reclined fully'], events: ['window seat person asleep — you need out','tray table broken — meal on lap','child directly behind, consistent','your entertainment screen only works sideways','overhead locker: your bag not there'] },
  ]},
  { group: 'Airports & Transport Hubs', locations: [
    { id: 'heathrow_t5', label: 'Heathrow Terminal 5 — bag on wrong belt', conditions: ['gate closing in 9 minutes, bag on reclaim belt','security queue: 40 minutes, flight: 35 minutes','passport control, e-gate rejected, 3 times','transfer, different terminal, no one told you'], events: ['bag arrived — someone has taken it','flight not on the board','security confiscated your water — refill station closed','moving walkway stopped, both of them','wrong terminal — shuttle bus: 18 minutes'] },
    { id: 'last_train', label: 'Train station — last train, platform unannounced', conditions: ['23:47, last train, board says "See Staff"','platform announced — wrong end of station','train delayed — replacement bus. Bus not there.','last train cancelled — email sent earlier today'], events: ['running for it — decision required now','taxi app: surge 4.8x','person ahead of you also running — collision risk','ticket barrier won\\'t open','train doors closing — you are at the gap'] },
  ]},
  { group: 'Civil & Institutional', locations: [
    { id: 'ikea', label: 'IKEA — unspecified area', conditions: ['Sunday afternoon, full capacity','marketplace, lost, no map, phone dying','car park, 5:45pm, trolley situation','restaurant, tray full, no seats visible'], events: ['separated from group — no signal inside','item out of stock, assembly started at home','shortcut attempt — back in the bedroom section','trolley wheel failure — structural','argument about the meatballs, not yours, spreading','staff member: cannot help, different department'] },
    { id: 'ae_saturday', label: 'A&E, Saturday night, triage', conditions: ['11pm, full waiting room, 4-hour wait sign','2am, triage nurse has seen everything','nobody is sure what triage order means here','the overhead lights are the wrong colour'], events: ['person next to you may be contagious','your stated reason for attending sounds worse out loud','someone more dramatic arrives, queue resets','you have been here 3 hours, number not called','the thing you came in for has, worryingly, stopped hurting'] },
    { id: 'estate_agent', label: 'Estate agent — viewing a "cosy" flat', conditions: ['second viewing, you\\'ve already told people','agent 8 minutes late, you\\'ve been outside','seller is still in the flat','offer deadline: today, 5pm'], events: ['"cosy" means something specific here','damp patch — agent has positioned themselves in front of it','neighbour audible through wall — at rest','previous viewer\\'s notes visible on agent\\'s clipboard','you are starting to talk yourself into it'] },
  ]},
  { group: 'Operations', locations: [
    { id: 'bravo_two_zero', label: 'Bravo Two Zero — Western Iraq, 1991', conditions: ['compromised — goat herder has seen you, patrol split','tab to Syria, 300km, one chocolate bar, January, alone','Vince is falling behind — exposure setting in','TACBE beacon activated — no response from Riyadh'], events: ['McNab\\'s account and Ryan\\'s account do not agree — which do you believe','the patrol is deciding whether to move at night or risk daylight','Iraqi military patrol, 400m, closing','two men have mild hypothermia, one is denying it','compromise inevitable — do you wait for contact or initiate exfil now'] },
    { id: 'operation_nimrod', label: 'Iranian Embassy — Operation Nimrod, 1980', conditions: ['Day 6 — negotiators exhausted, one hostage executed inside','frame charges set — entry in 47 seconds on go signal','Tak is on the rope — window team not yet in position','fire spreading from stun grenades — hostages still inside'], events: ['who gave the order to go — accounts differ','a hostage is running — you cannot confirm they are not a threat','blue-on-blue risk — team entering from the wrong side','the rope team is exposed — go early or hold the plan'] },
  ]},
];

const UNIVERSAL_EVENTS = [
  'ghost (confirmed, visible, interactive)',
  'drone swarm (civilian or military — panel will debate)',
  'military incursion (unspecified nation, organised)',
  'alien contact (first contact, intent unclear)',
  'sentient weather (it is making decisions)',
  'spontaneous medieval re-enactment (no one else alarmed)',
  'the floor is lava (panel takes this literally)',
  'time loop (you are the only one who knows)',
  'everyone has forgotten who you are',
  'bees — just bees, but the panel treats this with full gravity',
];

const CONTEXT_DATA = {
  time_of_day: ['dawn — just light enough to make bad decisions','midday — maximum exposure','dusk — predators know something you don\\'t','night — full dark'],
  mental_state: ['calm — possibly worryingly so','panicking, but quietly','mildly concussed','convinced I am fine','have made one decision already and it was wrong'],
  kit: ['nothing at all','phone at 4%','basic first aid kit','full survival pack','something completely inappropriate for this situation'],
  company: ['alone','with children','with a dog (helpful)','with someone useless','with someone who is making it worse','with someone calmer than they should be'],
};

// === state.js ===

// state.js — v2 with interaction loop state
// Single responsibility: all state management. No DOM. No API.

const DEFAULT_STATE = {
  mode: 'guided',
  cascade: { locationId: null, locationLabel: '', conditions: [], events: [], context: [], freeConditions: '', freeEvents: '' },
  free: { text: '' },
  status: 'idle',
  situation: null,
  probability: null,
  turnCount: 0,
  history: [],
  composureState: null
};

let _state = JSON.parse(JSON.stringify(DEFAULT_STATE));

const getState = () => JSON.parse(JSON.stringify(_state));
const setMode = (mode) => { _state.mode = mode; };
const setFreeText = (text) => { _state.free.text = text; };
const setStatus = (status) => { _state.status = status; };
const setCascade = (field, value) => { _state.cascade[field] = value; };

function setProbability(p) {
  _state.probability = Math.max(0, Math.min(100, p));
}

function setSituation(s) {
  _state.situation = s;
}

function recordDecision(decision, newProbability, situationUpdate) {
  _state.history.push({
    decision,
    probability: newProbability,
    situationUpdate
  });
  _state.turnCount++;
  setProbability(newProbability);
}

function setComposureState(cs) {
  _state.composureState = cs;
}

function reset() {
  _state = JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function buildSituation() {
  if (_state.mode === 'free') return _state.free.text.trim() || null;
  const c = _state.cascade;
  const locLabel = c.locationLabel || (document.getElementById('loc-input') ? document.getElementById('loc-input').value.trim() : '');
  if (!locLabel) return null;
  const parts = ['Location: ' + locLabel];
  const conds = c.conditions.concat(c.freeConditions ? [c.freeConditions] : []);
  const evts = c.events.concat(c.freeEvents ? [c.freeEvents] : []);
  if (conds.length) parts.push('Conditions: ' + conds.join(', '));
  if (evts.length) parts.push('Situation: ' + evts.join(', '));
  if (c.context.length) parts.push('Context: ' + c.context.join(', '));
  return parts.join('\\n');
}

const State = {
  getState, setMode, setCascade, setFreeText,
  setStatus, setProbability, setSituation, recordDecision,
  setComposureState, reset, buildSituation
};


// === ui.js ===

// ui.js — v2 with interaction loop rendering
// Single responsibility: DOM manipulation and rendering only.


// Tabs
function switchTab(mode) {
  ['guided', 'free'].forEach(t => {
    document.getElementById(\`tab-\${t}\`).classList.toggle('active', t === mode);
    document.getElementById(\`panel-\${t}\`).classList.toggle('active', t === mode);
  });
}

// Chips
function pickChip(el, field) {
  document.querySelectorAll(\`#chips-\${field} .chip\`).forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
}

function clearChips(field) {
  document.querySelectorAll(\`#chips-\${field} .chip\`).forEach(c => c.classList.remove('sel'));
}

// SS-115 — Complicating factor chip toggle (multi-select)
function toggleComplicating(el) {
  el.classList.toggle('sel');
}
function getComplicatingFactors() {
  const factors = [];
  document.querySelectorAll('.chip-complicating.sel').forEach(c => {
    factors.push(c.dataset.factor);
  });
  return factors;
}

function clearAll() {
  // Clear cascade inputs and chips
  ['loc', 'cond', 'evt'].forEach(f => {
    const el = document.getElementById(\`\${f}-input\`);
    if (el) el.value = '';
  });
  ['loc-chips','cond-chips','evt-chips','absurdity-chips','ctx-time','ctx-mental','ctx-kit','ctx-company'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.querySelectorAll('.chip').forEach(c => c.classList.remove('sel'));
  });
  // Clear complicating factor chips
  document.querySelectorAll('.chip-complicating').forEach(c => c.classList.remove('sel'));
  // Reset cascade steps — hide steps 2-4
  ['step-cond','step-evt','step-ctx'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  // Reset group nav active state
  const groupBtns = document.querySelectorAll('.group-btn');
  groupBtns.forEach(b => b.classList.remove('active'));
  const allBtn = document.querySelector('.group-btn[data-group="all"]');
  if (allBtn) allBtn.classList.add('active');
  document.querySelectorAll('#loc-chips .chip').forEach(c => c.classList.remove('sel'));
  // Clear freetext tab
  const free = document.getElementById('free-input');
  if (free) free.value = '';
  // Disable assess button
  const btn = document.getElementById('btn-guided');
  if (btn) btn.disabled = true;
}

// Loading / error
function showLoading(msg = 'PANEL CONVENING') {
  document.getElementById('results').classList.add('show');
  const loading = document.getElementById('loading');
  loading.style.display = 'block';
  loading.innerHTML = \`<span>\${msg}</span><span class="dots"></span>\`;
  document.getElementById('verdict-block').style.display = 'none';
  document.getElementById('interaction-block').style.display = 'none';
}

function showError(msg) {
  document.getElementById('loading').innerHTML =
    \`<span style="color:var(--blood)">\${msg}</span>\`;
}

// Probability meter
function updateProbability(pct, animate = true) {
  const cls = pct >= 70 ? 'ok' : pct >= 40 ? 'mid' : '';
  const pctEl = document.getElementById('surv-pct');
  const fill = document.getElementById('pct-fill');
  pctEl.className = 'pct' + (cls ? ' ' + cls : '');
  fill.className = 'meter-fill' + (cls ? ' ' + cls : '');
  if (animate) {
    fill.style.width = '0%';
    pctEl.textContent = '0%';
    setTimeout(() => {
      fill.style.width = pct + '%';
      pctEl.textContent = pct + '%';
    }, 100);
  } else {
    fill.style.width = pct + '%';
    pctEl.textContent = pct + '%';
  }
}

// Render panel cards
function renderCards(panelData, container, startDelay = 0) {
  (panelData || []).forEach((r, i) => {
    const char = CHARACTERS[r.charId] || Object.values(CHARACTERS)[i];
    if (!char) return;

    const card = document.createElement('div');
    card.className = 'char-card' + (r.death ? ' death-card' : '') + (r.charId ? ' char-' + r.charId : '');
    card.style.opacity = '0';
    card.style.transform = 'translateY(7px)';
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    card.innerHTML = \`
      <div class="card-head">
        <div class="avatar \${char.avClass}">\${char.av}</div>
        <div>
          <div class="char-name">\${char.name}</div>
          <div class="char-role">\${char.role}</div>
        </div>
      </div>
      <div class="card-body">
        \${r.text}
        \${r.death && char.deathLine ? \`<div class="death-note">\${char.deathLine}</div>\` : ''}
        \${r.fact_check ? \`<div class="fact-check">&#10033; \${r.fact_check}</div>\` : ''}
      </div>\`;

    container.appendChild(card);
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, startDelay + 80 + i * 100);
  });
}

// Attenborough bookend helpers
function showAttOpening(text) {
  const el = document.getElementById('att-opening');
  if (!el || !text) return;
  el.querySelector('.att-text').textContent = text;
  el.style.display = 'flex';
}

function showAttVerdict(text, delayMs = 0) {
  const el = document.getElementById('att-verdict');
  if (!el || !text) return;
  el.querySelector('.att-text').textContent = text;
  el.style.display = 'flex';
  el.classList.remove('visible');
  setTimeout(() => el.classList.add('visible'), delayMs + 50);
}

// Initial assessment results
function showResults(data, onDecision) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('verdict-block').style.display = 'block';

  showAttOpening(data.attenborough_opening);
  updateProbability(data.survival_probability);

  const container = document.getElementById('cards-out');
  container.innerHTML = '';
  renderCards(data.panel, container);

  const cardDelay = (data.panel?.length || 0) * 100 + 400;
  showAttVerdict(data.attenborough_verdict, cardDelay);

  showDecisionInput(data.next_actions, data.survival_probability, onDecision);
}

// Decision input after initial assessment
function showDecisionInput(nextActions, currentProbability, onDecision) {
  const block = document.getElementById('interaction-block');
  block.style.display = 'block';

  const actionsHtml = (nextActions || []).map(a =>
    \`<div class="action-chip" onclick="window._onActionChip(this, '\${a.replace(/'/g, "\\\\'")}')">\${a}</div>\`
  ).join('');

  block.innerHTML = \`
    <div class="decision-header">
      <div class="decision-label">WHAT DO YOU DO?</div>
      <div class="turn-pct">Currently: <span style="color:\${currentProbability < 40 ? 'var(--blood)' : currentProbability < 70 ? 'var(--amber)' : 'var(--green)'}">\${currentProbability}%</span></div>
    </div>
    <div class="action-chips">\${actionsHtml}</div>
    <div class="decision-input-row">
      <input type="text" id="decision-input" placeholder="or describe your decision..." />
      <button class="btn-decide" id="btn-decide" onclick="window._onDecide()">GO ↗</button>
    </div>\`;

  window._onActionChip = (el, val) => {
    document.querySelectorAll('.action-chip').forEach(c => c.classList.remove('sel'));
    el.classList.add('sel');
    document.getElementById('decision-input').value = val;
  };

  window._onDecide = () => {
    const val = document.getElementById('decision-input').value.trim();
    if (!val) return;
    onDecision(val);
  };

  document.getElementById('decision-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') window._onDecide();
  });
}

// Reaction results — appended below existing cards
function showReaction(data, turnCount, onDecision) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('verdict-block').style.display = 'block';
  document.getElementById('interaction-block').style.display = 'none';

  updateProbability(data.survival_probability);

  const cardsOut = document.getElementById('cards-out');

  // Remove previous att-verdict (will re-append new one)
  const prevVerdict = cardsOut.querySelector('.att-turn-verdict');
  if (prevVerdict) prevVerdict.remove();

  // Attenborough opening — frames what this decision caused
  if (data.attenborough_opening) {
    const opening = document.createElement('div');
    opening.className = 'att-turn-header';
    opening.innerHTML = \`
      <div class="att-mini-avatar">DA</div>
      <div class="att-mini-text">\${data.attenborough_opening}</div>\`;
    cardsOut.appendChild(opening);
  }

  // Divider
  const divider = document.createElement('div');
  divider.className = 'turn-divider';
  divider.textContent = \`TURN \${turnCount}\`;
  cardsOut.appendChild(divider);

  // Situation update
  if (data.situation_update) {
    const banner = document.createElement('div');
    banner.className = 'situation-update';
    banner.textContent = data.situation_update;
    cardsOut.appendChild(banner);
  }

  // New panel cards
  const startCount = cardsOut.querySelectorAll('.char-card').length;
  renderCards(data.panel, cardsOut, 0);

  // Attenborough verdict after cards
  if (data.attenborough_verdict) {
    const cardDelay = (data.panel?.length || 0) * 100 + 400;
    setTimeout(() => {
      const verdict = document.createElement('div');
      verdict.className = 'att-turn-verdict att-fade';
      verdict.innerHTML = \`
        <div class="att-mini-avatar">DA</div>
        <div class="att-mini-text">\${data.attenborough_verdict}</div>\`;
      cardsOut.appendChild(verdict);
      setTimeout(() => verdict.classList.add('visible'), 50);
    }, cardDelay);
    const nextDelay = (data.panel?.length || 0) * 100 + 900;
    if (data.is_terminal) {
      setTimeout(() => showTerminal(data.survival_probability, data.attenborough_eulogy), nextDelay);
    } else {
      setTimeout(() => showDecisionInput(data.next_actions, data.survival_probability, onDecision), nextDelay);
    }
  } else {
    if (data.is_terminal) {
      showTerminal(data.survival_probability, data.attenborough_eulogy);
    } else {
      setTimeout(() => showDecisionInput(data.next_actions, data.survival_probability, onDecision), 800);
    }
  }
}

// Terminal state (SS-014: eulogy added)
function showTerminal(probability, eulogy) {
  const block = document.getElementById('interaction-block');
  block.style.display = 'block';

  if (probability <= 0) {
    const eulogyHtml = eulogy
      ? \`<div class="att-bookend" style="margin-top:14px;opacity:0;transition:opacity 1.2s ease;" id="eulogy-block">
           <div class="att-avatar">DA</div>
           <div class="att-text">\${eulogy}</div>
         </div>\`
      : '';
    block.innerHTML = \`
      <div class="terminal terminal-dead">
        <div class="terminal-label">YOU DID NOT SURVIVE</div>
      </div>
      \${eulogyHtml}
      <div class="reset-row"><button class="btn-reset" onclick="window._onReset()">TRY AGAIN</button></div>\`;
    if (eulogy) {
      setTimeout(() => {
        const el = document.getElementById('eulogy-block');
        if (el) el.style.opacity = '1';
      }, 800);
    }
  } else {
    block.innerHTML = \`
      <div class="terminal terminal-alive">
        <div class="terminal-label">YOU SURVIVED</div>
        <div class="terminal-sub">Improbably. The panel is as surprised as you are.</div>
      </div>
      <div class="reset-row"><button class="btn-reset" onclick="window._onReset()">NEW SITUATION</button></div>\`;
  }
}

function hideResults() {
  document.getElementById('results').classList.remove('show');
  document.getElementById('verdict-block').style.display = 'none';
  document.getElementById('interaction-block').style.display = 'none';
  document.getElementById('loading').style.display = 'block';
  document.getElementById('loading').innerHTML = '<span>PANEL CONVENING</span><span class="dots"></span>';
  document.getElementById('cards-out').innerHTML = '';
  document.getElementById('surv-pct').textContent = '0%';
  document.getElementById('pct-fill').style.width = '0%';
  const opening = document.getElementById('att-opening');
  if (opening) { opening.style.display = 'none'; opening.classList.remove('visible'); }
  const verdict = document.getElementById('att-verdict');
  if (verdict) { verdict.style.display = 'none'; verdict.classList.remove('visible'); }
}

function setButtonState(mode, disabled) {
  const btn = document.getElementById(\`btn-\${mode}\`);
  if (btn) btn.disabled = disabled;
}

const UI = {
  switchTab, pickChip, clearChips, clearAll,
  showLoading, showError, showResults, showReaction,
  showTerminal, hideResults, setButtonState, updateProbability,
  showAttOpening, showAttVerdict
};


// === api.js ===

// api.js — v2 with reaction mode support
// Single responsibility: Worker integration and API calls.


const WORKER_ENDPOINT = 'https://cusslab-api.leanspirited.workers.dev/survival-school/assess';
const HSA_PANEL_CHARS = ['ray','fox','bear','hales','cody','stroud'];

async function assess(situation) {
  const s = State.getState();
  const response = await fetch(WORKER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: buildSystemPrompt('assessment'),
      situation,
      composureState: s.composureState,
      panelCharIds: HSA_PANEL_CHARS
    })
  });
  if (!response.ok) throw new Error(\`Worker \${response.status}\`);
  const data = await response.json();
  if (!data.panel || !Array.isArray(data.panel)) throw new Error('Invalid response');
  if (data.composureState) State.setComposureState(data.composureState);
  return data;
}

async function assessWorst(situation, systemPrompt) {
  const response = await fetch(WORKER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: systemPrompt, situation })
  });
  if (!response.ok) throw new Error(\`Worker \${response.status}\`);
  const data = await response.json();
  if (!data.panel || !Array.isArray(data.panel)) throw new Error('Invalid response');
  return data;
}

async function react(situation, decision, currentProbability) {
  const s = State.getState();
  const context = \`ORIGINAL SITUATION:\\n\${situation}\\n\\nCURRENT SURVIVAL PROBABILITY: \${currentProbability}%\\n\\nUSER'S DECISION: \${decision}\`;
  const response = await fetch(WORKER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: buildSystemPrompt('reaction'),
      situation: context,
      composureState: s.composureState,
      panelCharIds: HSA_PANEL_CHARS
    })
  });
  if (!response.ok) throw new Error(\`Worker \${response.status}\`);
  const data = await response.json();
  if (!data.panel || !Array.isArray(data.panel)) throw new Error('Invalid response');
  if (data.composureState) State.setComposureState(data.composureState);
  return data;
}

const API = { assess, assessWorst, react };


// === main ===



  // ── Cascade helpers ──────────────────────────────────────────────────────
  function findLocation(locId) {
    for (const g of LOCATION_GROUPS) {
      const loc = g.locations.find(l => l.id === locId);
      if (loc) return loc;
    }
    return null;
  }

  function makeChip(label, onClick, multi) {
    const el = document.createElement('div');
    el.className = 'chip';
    el.textContent = label;
    el.onclick = onClick;
    return el;
  }

  function updateAssessBtn() {
    const c = State.getState().cascade;
    const locInput = document.getElementById('loc-input');
    const hasLoc = c.locationLabel || (locInput && locInput.value.trim());
    const btn = document.getElementById('btn-guided');
    if (btn) btn.disabled = !hasLoc;
  }

  window.updateAssessBtn = updateAssessBtn;

  function showStep(stepId) {
    const el = document.getElementById(stepId);
    if (el) el.classList.remove('hidden');
  }

  window.skipTo = (stepId) => {
    showStep('step-' + stepId);
    if (stepId === 'ctx') populateContext();
  };

  function filterGroup(group) {
    document.querySelectorAll('.group-btn').forEach(b => b.classList.remove('active'));
    const active = document.querySelector('[data-group="' + group + '"]');
    if (active) active.classList.add('active');
    document.querySelectorAll('#loc-chips .chip').forEach(chip => {
      chip.style.display = (group === 'all' || chip.dataset.group === group) ? '' : 'none';
    });
  }
  window.filterGroup = filterGroup;

  function initCascade() {
    // Build group nav
    const groupNav = document.getElementById('group-nav');
    const allBtn = document.createElement('button');
    allBtn.className = 'group-btn active';
    allBtn.textContent = 'ALL';
    allBtn.dataset.group = 'all';
    allBtn.onclick = () => filterGroup('all');
    groupNav.appendChild(allBtn);

    LOCATION_GROUPS.forEach(g => {
      const btn = document.createElement('button');
      btn.className = 'group-btn';
      btn.textContent = g.group.toUpperCase();
      btn.dataset.group = g.group;
      btn.onclick = () => filterGroup(g.group);
      groupNav.appendChild(btn);
    });

    // Build location chips
    const locChips = document.getElementById('loc-chips');
    LOCATION_GROUPS.forEach(g => {
      g.locations.forEach(loc => {
        const el = makeChip(loc.label, function() {
          document.querySelectorAll('#loc-chips .chip').forEach(c => c.classList.remove('sel'));
          el.classList.add('sel');
          document.getElementById('loc-input').value = '';
          State.setCascade('locationId', loc.id);
          State.setCascade('locationLabel', loc.label);
          State.setCascade('conditions', []);
          State.setCascade('events', []);
          State.setCascade('context', []);
          populateConditions(loc.id);
          populateEvents(loc.id);
          showStep('step-cond');
          updateAssessBtn();
        });
        el.dataset.group = g.group;
        locChips.appendChild(el);
      });
    });

    // Populate context (always same)
    populateContext();
  }

  function populateConditions(locId) {
    const loc = findLocation(locId);
    const container = document.getElementById('cond-chips');
    container.innerHTML = '';
    if (!loc) return;
    loc.conditions.forEach(cond => {
      const el = makeChip(cond, function() {
        el.classList.toggle('sel');
        const c = State.getState().cascade;
        const arr = c.conditions.slice();
        const idx = arr.indexOf(cond);
        if (idx === -1) arr.push(cond); else arr.splice(idx, 1);
        State.setCascade('conditions', arr);
        showStep('step-evt');
        updateAssessBtn();
      });
      container.appendChild(el);
    });
  }

  function populateEvents(locId) {
    const loc = findLocation(locId);
    const evtContainer = document.getElementById('evt-chips');
    const absContainer = document.getElementById('absurdity-chips');
    evtContainer.innerHTML = '';
    absContainer.innerHTML = '';

    (loc ? loc.events : []).forEach(evt => {
      const el = makeChip(evt, function() {
        el.classList.toggle('sel');
        const c = State.getState().cascade;
        const arr = c.events.slice();
        const idx = arr.indexOf(evt);
        if (idx === -1) arr.push(evt); else arr.splice(idx, 1);
        State.setCascade('events', arr);
        showStep('step-ctx');
        updateAssessBtn();
      });
      evtContainer.appendChild(el);
    });

    UNIVERSAL_EVENTS.forEach(evt => {
      const el = makeChip(evt, function() {
        el.classList.toggle('sel');
        const c = State.getState().cascade;
        const arr = c.events.slice();
        const idx = arr.indexOf(evt);
        if (idx === -1) arr.push(evt); else arr.splice(idx, 1);
        State.setCascade('events', arr);
        showStep('step-ctx');
        updateAssessBtn();
      });
      absContainer.appendChild(el);
    });
  }

  function populateContext() {
    const map = { 'ctx-time': 'time_of_day', 'ctx-mental': 'mental_state', 'ctx-kit': 'kit', 'ctx-company': 'company' };
    Object.entries(map).forEach(([domId, dataKey]) => {
      const container = document.getElementById(domId);
      if (!container || container.children.length) return; // already populated
      (CONTEXT_DATA[dataKey] || []).forEach(val => {
        const el = makeChip(val, function() {
          el.classList.toggle('sel');
          const c = State.getState().cascade;
          const arr = c.context.slice();
          const idx = arr.indexOf(val);
          if (idx === -1) arr.push(val); else arr.splice(idx, 1);
          State.setCascade('context', arr);
          updateAssessBtn();
        });
        container.appendChild(el);
      });
    });
  }

  // Freetext handlers for cascade steps
  window.onLocFree = (val) => {
    State.setCascade('locationLabel', val);
    State.setCascade('locationId', null);
    document.querySelectorAll('#loc-chips .chip').forEach(c => c.classList.remove('sel'));
    if (val.trim()) {
      showStep('step-cond');
      showStep('step-evt');
      populateEvents(null); // show only universal events when freetext loc
      showStep('step-ctx');
    }
    updateAssessBtn();
  };
  window.onCondFree = (val) => { State.setCascade('freeConditions', val); showStep('step-evt'); updateAssessBtn(); };
  window.onEvtFree = (val) => { State.setCascade('freeEvents', val); showStep('step-ctx'); updateAssessBtn(); };

  // Tab / input handlers
  window.onTabClick = (mode) => { State.setMode(mode); UI.switchTab(mode); };
  window.onFreeInput = (val) => State.setFreeText(val);
  window.onClear = () => { State.reset(); UI.clearAll(); };

  // Init cascade on load
  initCascade();

  // Initial assessment
  window.onAssess = async (mode) => {
    State.setMode(mode);
    const situation = State.buildSituation();
    if (!situation) { alert('Tell us something about your situation first.'); return; }

    State.setSituation(situation);
    UI.setButtonState(mode, true);
    UI.showLoading();

    try {
      const data = await API.assess(situation);
      State.setProbability(data.survival_probability);
      UI.showResults(data, handleDecision);
    } catch (e) {
      UI.showError('Panel unavailable. They may already know how this ends.');
    } finally {
      UI.setButtonState(mode, false);
    }
  };

  // Decision loop
  async function handleDecision(decision) {
    const s = State.getState();
    UI.showLoading('PANEL REACTING');

    try {
      const data = await API.react(s.situation, decision, s.probability);
      State.recordDecision(decision, data.survival_probability, data.situation_update);
      UI.showReaction(data, s.turnCount + 1, handleDecision);
    } catch (e) {
      UI.showError('Panel unavailable.');
    }
  }

  // Reset
  window._onReset = () => {
    State.reset();
    UI.hideResults();
    UI.clearAll();
    ['guided','free'].forEach(m => UI.setButtonState(m, false));
  };

</script>

</body>
</html>

`;

const SURVIVAL_SCHOOL_WORST = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>I've Been Bit, Guys — Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0f1209;
      --surface: #181d10;
      --surface2: #1e2514;
      --border: rgba(120,160,60,0.15);
      --border-strong: rgba(120,160,60,0.3);
      --green: #7aad3a;
      --green-dim: #4a7020;
      --green-bright: #a0d050;
      --amber: #BA7517;
      --amber-dim: #5c3a08;
      --bark: #8B6040;
      --bark-dim: #3d2008;
      --text: #e8edd8;
      --text-muted: #7a8a60;
      --blood: #cc1111;
      --blood-dim: #3a0808;
    }

    body {
      font-family: 'Barlow', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
    }

    #app {
      max-width: 680px;
      margin: 0 auto;
      padding: 1.5rem 1rem 3rem;
    }

    .header {
      text-align: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 0.5px solid var(--border);
    }

    .title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 40px;
      letter-spacing: 3px;
      line-height: 1;
    }

    .title span { color: var(--blood); }

    .subtitle {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 1.5px;
      margin-top: 5px;
    }

    .field-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 1.5px;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 6px;
      margin-top: 16px;
    }

    .field-label:first-child { margin-top: 0; }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 8px;
    }

    .chip {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      padding: 5px 10px;
      border: 0.5px solid var(--border-strong);
      border-radius: 5px;
      cursor: pointer;
      background: none;
      color: var(--text-muted);
      transition: all 0.15s;
      white-space: nowrap;
      user-select: none;
    }

    .chip:hover, .chip.sel { border-color: var(--blood); color: var(--blood); }

    input[type="text"], textarea {
      width: 100%;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      padding: 9px 12px;
      border: 0.5px solid var(--border-strong);
      border-radius: 6px;
      background: var(--surface);
      color: var(--text);
      outline: none;
      transition: border-color 0.15s;
    }

    input[type="text"]:focus, textarea:focus { border-color: var(--blood); }

    .btn-row { display: flex; gap: 8px; margin-top: 16px; }

    .btn-assess {
      flex: 1;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 11px;
      background: var(--blood);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: opacity 0.15s;
    }

    .btn-assess:hover { opacity: 0.88; }
    .btn-assess:disabled { opacity: 0.4; cursor: not-allowed; }

    .btn-clear {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      letter-spacing: 1px;
      padding: 11px 16px;
      border: 0.5px solid var(--border-strong);
      border-radius: 6px;
      background: none;
      cursor: pointer;
      color: var(--text-muted);
      transition: color 0.15s, border-color 0.15s;
    }

    .btn-clear:hover { color: var(--text); border-color: var(--blood); }

    /* Results */
    .results { display: none; margin-top: 1.5rem; }
    .results.show { display: block; }

    .loading {
      padding: 2rem;
      text-align: center;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      color: var(--text-muted);
      letter-spacing: 1px;
    }

    .dots::after {
      content: '';
      animation: dots 1.5s steps(3, end) infinite;
    }

    @keyframes dots {
      0%   { content: '.'; }
      33%  { content: '..'; }
      66%  { content: '...'; }
      100% { content: ''; }
    }

    /* Doom meter */
    .verdict-bar {
      border: 0.5px solid var(--border);
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 1rem;
      background: var(--surface);
    }

    .verdict-top {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .verdict-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 2px;
      color: var(--text-muted);
    }

    /* Doom: red=bad, amber=mid, green=fine — inverted from survival probability */
    .pct.doom { color: var(--blood); }
    .pct.doom.mid { color: var(--amber); }
    .pct.doom.ok  { color: var(--green); }

    .pct {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 52px;
      line-height: 1;
      transition: color 0.5s;
    }

    .meter {
      height: 4px;
      background: var(--border);
      border-radius: 2px;
      overflow: hidden;
    }

    .meter-fill {
      height: 100%;
      background: var(--blood);
      border-radius: 2px;
      transition: width 1.2s ease, background 0.5s;
    }

    .meter-fill.mid { background: var(--amber); }
    .meter-fill.ok  { background: var(--green); }

    /* Panel cards */
    .panel-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 2px;
      color: var(--text-muted);
      margin-bottom: 10px;
      margin-top: 1rem;
    }

    .char-card {
      border: 0.5px solid var(--border);
      border-radius: 10px;
      margin-bottom: 8px;
      overflow: hidden;
      background: var(--surface);
    }

    .char-card.death-card { border-color: var(--blood); }
    .char-card.char-bear { background: rgba(120,134,107,0.15); }
    .char-card.char-ray { background: rgba(85,107,47,0.15); }
    .char-card.char-fox { background: rgba(74,74,74,0.2); }
    .char-card.char-hales { background: rgba(200,134,10,0.12); }
    .char-card.char-cody { background: rgba(139,115,85,0.15); }
    .char-card.char-stroud { background: rgba(47,79,79,0.2); }
    .char-card.char-attenborough { background: rgba(27,58,45,0.2); }
    .char-card.char-oshea { background: rgba(139,69,19,0.15); }
    .char-card.char-stevens { background: rgba(122,92,30,0.15); }
    .char-card.char-gordon { background: rgba(201,150,42,0.12); }
    .char-card.char-billy { background: rgba(107,39,55,0.15); }
    .char-card.char-ollie { background: rgba(61,90,107,0.15); }
    .char-card.char-craighead { background: rgba(139,115,85,0.12); }
    .char-card.char-coyote { background: rgba(204,85,0,0.12); }

    .char-card.cody-card {
      border-color: var(--green-dim);
      background: #131a0d;
    }

    .card-head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      background: var(--surface2);
      border-bottom: 0.5px solid var(--border);
    }

    .cody-card .card-head {
      background: var(--green-dim);
      border-bottom-color: rgba(120,160,60,0.25);
    }

    .avatar {
      width: 30px; height: 30px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }

    .av-green  { background: var(--green-dim);  color: var(--green-bright); }
    .av-bark   { background: var(--bark-dim);   color: var(--bark); }
    .av-amber  { background: var(--amber-dim);  color: var(--amber); }
    .av-blue   { background: #0c1f3a;           color: #5a9fd4; }
    .av-gray   { background: #1e1e1c;           color: #7a8a70; }

    .char-name {
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.5px;
      color: var(--text);
    }

    .char-role {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: var(--text-muted);
    }

    .card-body {
      padding: 11px 14px;
      font-family: 'Barlow', sans-serif;
      font-size: 14px;
      line-height: 1.7;
      color: var(--text);
      font-weight: 400;
    }

    .death-note {
      margin-top: 8px;
      padding: 7px 11px;
      background: var(--blood-dim);
      border-left: 3px solid var(--blood);
      border-radius: 0 4px 4px 0;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--blood);
      font-weight: 500;
    }

    .fact-check {
      margin-top: 6px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      border-top: 0.5px solid var(--border);
      padding-top: 6px;
      opacity: 0.7;
    }

    /* Cody action line */
    .action-line {
      margin-top: 10px;
      padding: 8px 12px;
      background: var(--green-dim);
      border-left: 3px solid var(--green);
      border-radius: 0 4px 4px 0;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      color: var(--green-bright);
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .reset-row { margin-top: 1rem; text-align: center; }

    .btn-reset {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      background: none;
      border: 0.5px solid var(--border-strong);
      border-radius: 6px;
      padding: 7px 16px;
      cursor: pointer;
      letter-spacing: 1px;
      transition: all 0.15s;
    }

    .btn-reset:hover { color: var(--text); border-color: var(--blood); }

    /* Attenborough bookends */
    .att-bookend {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 10px 14px;
      background: var(--surface);
      border: 0.5px solid var(--border);
      border-radius: 8px;
    }

    .att-avatar {
      width: 26px; height: 26px;
      background: #1e1e1c;
      color: #7a8a70;
      border-radius: 50%;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 9px;
      letter-spacing: 0.5px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .att-text {
      font-family: 'Barlow', sans-serif;
      font-weight: 300;
      font-style: italic;
      font-size: 14px;
      line-height: 1.7;
      color: var(--text-muted);
    }

    #att-opening { margin-bottom: 12px; }

    #att-verdict {
      margin-top: 12px;
      opacity: 0;
      transition: opacity 0.8s ease;
    }

    #att-verdict.visible { opacity: 1; }
  </style>
</head>
<body>
<div id="app">

  <div class="header">
    <div class="title">I'VE BEEN <span>BIT</span>, GUYS</div>
    <div class="subtitle">the panel will tell you exactly how worried to be.</div>
  </div>

  <div class="field-label">Classic incidents</div>
  <div class="chips" id="chips-scenario">
    <div class="chip" onclick="onScenario(this,'bitten by king cobra 45 minutes ago','king cobra','jungle, alone, 45 minutes from help')">cobra bite</div>
    <div class="chip" onclick="onScenario(this,'grizzly bear charging me on a trail','grizzly bear','Montana wilderness, 3 miles from car, no phone signal')">grizzly charge</div>
    <div class="chip" onclick="onScenario(this,'great white shark circling me in the water','great white shark','surfing, 400 metres from shore')">shark circling</div>
    <div class="chip" onclick="onScenario(this,'Brazilian wandering spider is on my chest and I have not moved','Brazilian wandering spider','3am, in bed, urban, ambulance available')">spider on chest</div>
    <div class="chip" onclick="onScenario(this,'three spotted hyenas closing in, I am alone on foot','pack of spotted hyenas','open savannah, nightfall in 40 minutes, no vehicle')">hyena pack</div>
    <div class="chip" onclick="onScenario(this,'struck by lightning for the seventh time in my life','lightning strike','outdoors, fully conscious somehow, confused bystanders')">lightning (7th)</div>
    <div class="chip" onclick="onScenario(this,'Komodo dragon bit my ankle 20 minutes ago, wound is not clotting','Komodo dragon','Komodo Island, 2 hours from hospital, basic first aid kit')">komodo bite</div>
    <div class="chip" onclick="onScenario(this,'I have been injured by a manatee and require assistance','manatee','coastal water, near shore, witnesses present, explanation required')">manatee incident</div>
    <div class="chip" onclick="onScenario(this,'being attacked by a swan and cannot leave the area','swan','canal towpath, urban, witnesses unable to help')">swan attack</div>
    <div class="chip" onclick="onScenario(this,'72 days, all food is gone, there are options on the ground','none','Andes mountains, 16 survivors, decision cannot be delayed')">andes decision</div>
  </div>

  <div class="field-label">Or describe what happened...</div>
  <input type="text" id="event-input" placeholder="describe what happened..." oninput="onFieldInput('event',this.value)"/>

  <div class="field-label">The animal or hazard</div>
  <input type="text" id="animal-input" placeholder="name the animal or hazard..." oninput="onFieldInput('animal',this.value)"/>

  <div class="field-label">Circumstances</div>
  <input type="text" id="circ-input" placeholder="describe your circumstances..." oninput="onFieldInput('circ',this.value)"/>

  <div class="btn-row">
    <button class="btn-assess" id="btn-assess" onclick="onAssess()">I'VE BEEN BIT, GUYS ↗</button>
    <button class="btn-clear" onclick="onClear()">CLEAR</button>
  </div>

  <div class="results" id="results">
    <div class="loading" id="loading">
      <span>PANEL CONVENING</span><span class="dots"></span>
    </div>
    <div id="verdict-block" style="display:none">
      <div class="att-bookend" id="att-opening" style="display:none">
        <div class="att-avatar">DA</div>
        <div class="att-text"></div>
      </div>
      <div class="verdict-bar">
        <div class="verdict-top">
          <div class="verdict-label">DOOM PERCENTAGE</div>
          <div class="pct doom" id="doom-pct">0%</div>
        </div>
        <div class="meter">
          <div class="meter-fill" id="doom-fill" style="width:0%"></div>
        </div>
      </div>
      <div class="panel-label">PANEL ASSESSMENT</div>
      <div id="cards-out"></div>
      <div class="att-bookend" id="att-verdict" style="display:none">
        <div class="att-avatar">DA</div>
        <div class="att-text"></div>
      </div>
      <div class="reset-row">
        <button class="btn-reset" onclick="onClear()">NEW INCIDENT</button>
      </div>
    </div>
  </div>

</div>

<script>
// === characters-worst.js ===

// characters-worst.js — How Bad Is This? panel
// 8 characters: Ray, Fox, O'Shea, Stevens, Bear, Hales, Attenborough, Cody — fixed order

const CHARACTERS_WORST = {
  ray: {
    id: 'ray', name: 'Ray Mears', role: 'Bushcraft',
    av: 'RM', avClass: 'av-green',
    deathLine: 'You could be dead within the hour.',
    voice: \`RAY MEARS — Bushcraft, 30+ years field experience.
Cerebral, warm, loves the land. Great storyteller. Never dramatic. Brevity is power.
VOICE: First response — immediate triage, what to do right now. Craft-based. No panic.
"Don't." is a complete sentence. Silence more eloquent than anything about Bear.
SKILLS: Fire 99, Shelter 97, Tool-making 98, Plant Knowledge 88, Navigation 90.\`
  },
  fox: {
    id: 'fox', name: 'Jason Fox', role: 'Special Boat Service',
    av: 'JF', avClass: 'av-green',
    deathLine: 'That is not a recoverable position.',
    voice: \`JASON FOX — Foxy. Royal Marines at 16. SBS from 2001. Demolitions expert, combat swimmer, jungle survival expert.
Warm, self-deprecating, genuinely funny. Absolute killing machine. No contradiction in his mind.
VOICE: Tactical assessment — is the threat still active? Exit routes? What's available as improvised weapon?
Flat delivery on alarming information. "Is that a dog walker or a contact?" register.
Self-deprecating then immediately competent. Emotions processed as tactical problems to resolve.
NEVER make mental health a punchline. Ever.
SKILLS: Navigation 96, Endurance 97, Terrain 92, Tool-making 88, Psychology 90.\`
  },
  oshea: {
    id: 'oshea', name: "Mark O'Shea", role: 'Herpetology',
    av: 'MO', avClass: 'av-amber',
    deathLine: 'I have the academic paper on exactly this mechanism of death.',
    voice: \`MARK O'SHEA MBE — Professor of Herpetology, University of Wolverhampton. WHO consultant on snakebite. Has published more on venomous snakes than almost anyone alive. Has also been bitten by more venomous snakes than almost anyone alive.
Named his king cobra "Sleeping Beauty." Was bitten by it. This surprised him. It should not have.
Book: Blood, Sweat and Snakebites. The title is autobiography, not metaphor.
The Golden Rule of herpetology: No Set-ups. O'Shea articulated this rule. O'Shea violated this rule. O'Shea's body is a footnote to this rule.
Ready Steady Cook alumnus. This is true. It has never made sense.
VOICE: Academically precise, slightly barbed — Fawlty Towers energy: technically correct about everything, perpetually done in by circumstances he's personally responsible for. References his own published work while the animal on his arm ignores it.
ON STEVENS: Quiet, sustained professional contempt. Stevens is "theatrical." The bites are "self-inflicted and frankly predictable." O'Shea has published peer-reviewed literature on why Austin Stevens should not still be alive. He doesn't say this. You can tell he's thinking it.
COMEDY ENGINE: The gap between WHO credentials and personal bite count. Every time an animal bites him it is a data point he had already modelled. He just assumed the model would protect him.\`
  },
  stevens: {
    id: 'stevens', name: 'Austin Stevens', role: 'Snake Master',
    av: 'AS', avClass: 'av-bark',
    deathLine: 'The snake has completed its lesson.',
    voice: \`AUSTIN STEVENS — South African wildlife photographer and "snake master." Spent 107 days in a cage with 36 of Africa's most venomous snakes for a world record. Was bitten by a cobra on day 96. Did not leave. Completed the full 107 days. Framed this as spiritual victory. The cobra had no comment.
On Animal Planet, on camera, bitten by a cobra: delivered the news to his crew with the casual energy of someone reporting a mild headache. "I've been bit, guys." This became the feature's name.
Also bitten by: puff adder, boomslang (venom causes the body to stop clotting — this is the bad one), king cobra, and various others across his Animal Planet series. Each one described as meaningful.
Juggled a sleeping Amazon Tree Boa. Prodded a docile boomslang until it wasn't. Picked up a puff adder he'd spotted doing nothing wrong.
VOICE: Grandiose, mystical, completely unbothered by evidence. Slight South African accent. Every bite is communion. Every near-death is an initiation. Speaks of snakes with the reverence other men reserve for god or a very good wine.
"Was there a snake?" fires immediately when the incident doesn't involve one. If no snake, he has nothing to add and will say so.
The snake didn't bite him — it recognised him, chose to share its venom, and departed with respect.
ON O'SHEA: Acknowledges the credentials but finds the energy academic. O'Shea understands snakes intellectually. Stevens understands them spiritually. These are not the same thing. Stevens has the bite scars to prove his method works. That he continues to accumulate them does not register as a counterargument.
COMEDY ENGINE: The snake always disagrees. The gap between his spiritual certainty and the body count of his own body parts.\`
  },
  bear: {
    id: 'bear', name: 'Bear Grylls', role: 'Former SAS',
    av: 'BG', avClass: 'av-bark',
    deathLine: 'If you get this wrong, you will not make it out of here alive.',
    voice: \`BEAR GRYLLS — Former SAS. Genuine SAS credentials. Also drinks own urine when Londis is forty yards away.
Gets ill eating things he didn't need to eat. Idiocy is sincere, not performed.
VOICE: Urgent, evangelical, slightly breathless. Personal anecdote always — abroad, fine in the end.
"Hydration?" unprompted. Fact-checker footnote fires on factual claims.
SKILLS: Psychology 92, Endurance 95, Navigation 80, Fire 70.\`
  },
  hales: {
    id: 'hales', name: 'Les Hiddins', role: 'Bush Tucker Man',
    av: 'LH', avClass: 'av-amber',
    deathLine: 'Have a look at that.',
    voice: \`LES HIDDINS — Major, Australian Army. Bush Tucker Man. Vietnam veteran.
Walked 2,500km of remote northern Australia cataloguing food sources.
CATCHPHRASE: "Have a look at this." — opener for anything, dangerous or edible.
"Not too bad — a bit starchy." is his highest compliment. "She'll be right." is a complete plan.
Cites Aboriginal practices constantly: "They've been doing this for 40,000 years."
VOICE: Understated, educational, unhurried. Never performs fear. Never heard of Bear Grylls.
SKILLS: Plant Knowledge 95, Psychology 95, Endurance 90, Water 90.\`
  },
  cody: {
    id: 'cody', name: 'Cody Lundin', role: 'Primitive Skills',
    av: 'CL', avClass: 'av-green',
    deathLine: 'I have watched people make this mistake. They are no longer with us.',
    voice: \`CODY LUNDIN — Aboriginal Living Skills School, Prescott Arizona. Barefoot on glaciers.
Threw fire-making supplies into pool rather than demonstrate bad technique. Chose integrity over career.
VOICE: Patient, quiet, certain. Always last. The practical close.
Cody's action line: a single, specific imperative — what to do RIGHT NOW.
Cody Override fires when asked to endorse wrong survival advice — refuses.
Comedy: always knows the better option that was right there. "Cattails. Thirty feet away."
SKILLS: Fire 97, Plant Knowledge 96, Tool-making 95, Psychology 95, Endurance 93.\`
  }
};

function buildWorstSystemPrompt() {
  const chars = Object.values(CHARACTERS_WORST)
    .map(c => \`=== \${c.name.toUpperCase()} ===\\n\${c.voice}\`)
    .join('\\n\\n');

  return \`You are the Survival School HOW BAD IS THIS? panel. The user has experienced an incident — an animal encounter, bite, sting, or dangerous situation. Assess the severity and advise.

\${chars}

PANEL ORDER — fixed: Ray, Fox, O'Shea, Stevens, Bear, Hales, Cody.
ATTENBOROUGH BOOKENDS — he does NOT appear in the panel array. He opens and closes.

ATTENBOROUGH BOOKEND STRUCTURE:
- attenborough_opening: one sentence, nature documentary register, introduces the incident as if it's a wildlife encounter. "And here, the specimen has made contact with one of nature's more emphatic advisors." Slightly ominous.
- attenborough_verdict: one sentence, geological calm, no appeal. He always knew.

PANEL RESPONSE LOGIC:
- Ray: immediate triage. What to do right now. Craft-based. Brief, no drama. On O'Shea and Stevens: silent professional respect for the credentials, quiet private dismay at the application.
- Fox: tactical — is the threat still active? Exit routes? What does the user have available? On Stevens: treats him as a recurring case study in entering a known threat corridor without an exit plan.
- O'Shea: medical/herpetological expertise. References chapter numbers. fact_check fires when Stevens says anything factually wrong (frequently). Genuinely cannot believe Stevens is still alive. Does not say this. Face says it.
- Stevens: spiritual interpretation. Only fully engaged if snake or venomous creature involved — "Was there a snake?" fires if not. When snake IS involved: deeply invested, cites own bite history as relevant precedent. "My cobra in Namibia, day 96..."
- Bear: personal anecdote, somewhere exotic, fine in the end. Hydration check. Slightly competitive with Stevens about who has had the more meaningful near-death experience.
- Hales: understated, educational. "Have a look at this." "Not too bad — a bit starchy." 1-2 sentences. Never dramatic. On Stevens: "She bit him, then." That's the whole analysis.
- Cody: verdict + ACTION LINE — a single, specific imperative sentence. What to do RIGHT NOW. On Stevens: "He went back for it. The option not to was right there."

O'SHEA / STEVENS DYNAMIC — the cold war:
O'Shea views Stevens as theatrical, reckless, and statistically improbable. He has written peer-reviewed literature that models exactly why Stevens's methods produce bites. Stevens views O'Shea as technically correct but spiritually hollow — he understands the snakes, O'Shea only understands the venom. Both are partially right. The snakes are neutral parties.
When both comment on the same incident, O'Shea's fact_check fires on anything Stevens attributes to spiritual connection.

PANEL CONVERSATION — characters are in the same room. They hear each other. Use this:
- Later characters may react briefly to what an earlier character said. One cross-reference per response, never more.
- O'Shea on Stevens: fact_check fires on Stevens's spiritual claims. Cold, precise, no drama.
- Stevens on O'Shea: acknowledges the academic framework but finds it spiritually limited. One sentence maximum.
- Cody on Bear: "The alternative was right there." fires if Bear recommends something unnecessary.
- Ray: says something measured. Bear agrees in a way that suggests partial comprehension.
- Hales: three words max. Can validate or contradict the room. "He's not wrong." "Not quite right."
- Direct address allowed: "What O'Shea said—", "Ray's right.", "I wouldn't do what Bear did."
- Conversation is texture. Not the point. Keep it brief.

DOOM PERCENTAGE: 0 = you're fine, 100 = certain death.
Scale reference:
- Comedy scenario (manatee, swan, seagull chip theft): 5–15%
- Minor bite/sting, treatment available soon: 15–35%
- Serious envenomation, hospital within 2hrs: 35–60%
- Serious envenomation, remote, no treatment: 60–85%
- Certainly fatal combination: 85–100%

Death commentary (death: true): fires when doom > 65% OR clearly unrecoverable.
Stevens's death line only fires for snake/venom incidents.

OUTPUT — valid JSON only, no markdown:
{"doom_percentage":<integer 0-100>,"attenborough_opening":"<one sentence, nature doc, introduces incident as wildlife encounter>","panel":[{"charId":"ray","text":"<2-3 sentences>","death":<bool>},{"charId":"fox","text":"<2-3 sentences>"},{"charId":"oshea","text":"<2-3 sentences>","fact_check":"<optional — O'Shea only>"},{"charId":"stevens","text":"<2-3 sentences>"},{"charId":"bear","text":"<2-3 sentences>","fact_check":"<optional>"},{"charId":"hales","text":"<max 3 words>"},{"charId":"cody","text":"<2-3 sentences>","action":"<single imperative sentence — what to do RIGHT NOW>"}],"attenborough_verdict":"<one sentence, geological calm, no appeal>"}\`;
}



// === state-worst.js ===

// state-worst.js — How Bad Is This? state management
// Single responsibility: state only. No DOM. No API.

const DEFAULT_STATE = {
  event: '',
  animal: '',
  circumstances: '',
  status: 'idle'   // idle | loading | results
};

let _state = JSON.parse(JSON.stringify(DEFAULT_STATE));

const getState = () => JSON.parse(JSON.stringify(_state));
const setEvent = (v) => { _state.event = v; };
const setAnimal = (v) => { _state.animal = v; };
const setCircumstances = (v) => { _state.circumstances = v; };
const setStatus = (s) => { _state.status = s; };

function buildSituation() {
  const parts = [];
  if (_state.event)         parts.push(\`INCIDENT: \${_state.event}\`);
  if (_state.animal)        parts.push(\`ANIMAL / HAZARD: \${_state.animal}\`);
  if (_state.circumstances) parts.push(\`CIRCUMSTANCES: \${_state.circumstances}\`);
  return parts.length ? parts.join('\\n') : null;
}

function reset() {
  _state = JSON.parse(JSON.stringify(DEFAULT_STATE));
}

const State = { getState, setEvent, setAnimal, setCircumstances, setStatus, buildSituation, reset };


// === ui-worst.js ===

// ui-worst.js — How Bad Is This? rendering
// Single responsibility: DOM manipulation only.


function clearChips(field) {
  document.querySelectorAll(\`#chips-\${field} .chip\`).forEach(c => c.classList.remove('sel'));
}

function clearAll() {
  ['event', 'animal', 'circ'].forEach(f => {
    clearChips(f);
    const el = document.getElementById(\`\${f}-input\`);
    if (el) el.value = '';
  });
  clearChips('scenario');
}

function showLoading() {
  document.getElementById('results').classList.add('show');
  document.getElementById('loading').style.display = 'block';
  document.getElementById('loading').innerHTML = '<span>PANEL CONVENING</span><span class="dots"></span>';
  document.getElementById('verdict-block').style.display = 'none';
}

function showError(msg) {
  document.getElementById('loading').innerHTML =
    \`<span style="color:var(--blood)">\${msg}</span>\`;
}

// Doom meter — inverted: 0=green (fine), 100=red (dead)
function updateDoom(pct, animate = true) {
  const cls = pct <= 30 ? 'ok' : pct <= 65 ? 'mid' : '';
  const pctEl = document.getElementById('doom-pct');
  const fill  = document.getElementById('doom-fill');
  pctEl.className = 'pct doom' + (cls ? ' ' + cls : '');
  fill.className  = 'meter-fill' + (cls ? ' ' + cls : '');
  if (animate) {
    fill.style.width = '0%';
    pctEl.textContent = '0%';
    setTimeout(() => {
      fill.style.width = pct + '%';
      pctEl.textContent = pct + '%';
    }, 100);
  } else {
    fill.style.width = pct + '%';
    pctEl.textContent = pct + '%';
  }
}

function renderResults(data) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('verdict-block').style.display = 'block';

  // Attenborough opening — above doom meter
  const openingEl = document.getElementById('att-opening');
  if (openingEl && data.attenborough_opening) {
    openingEl.querySelector('.att-text').textContent = data.attenborough_opening;
    openingEl.style.display = 'flex';
  }

  updateDoom(data.doom_percentage);

  const container = document.getElementById('cards-out');
  container.innerHTML = '';

  (data.panel || []).forEach((r, i) => {
    const char = CHARACTERS_WORST[r.charId];
    if (!char) return;

    const isCody = r.charId === 'cody';
    const card = document.createElement('div');
    card.className = 'char-card' +
      (r.death ? ' death-card' : '') +
      (isCody ? ' cody-card' : '') +
      (r.charId ? ' char-' + r.charId : '');
    card.style.opacity = '0';
    card.style.transform = 'translateY(7px)';
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    card.innerHTML = \`
      <div class="card-head">
        <div class="avatar \${char.avClass}">\${char.av}</div>
        <div>
          <div class="char-name">\${char.name}</div>
          <div class="char-role">\${char.role}</div>
        </div>
      </div>
      <div class="card-body">
        \${r.text}
        \${r.death && char.deathLine ? \`<div class="death-note">\${char.deathLine}</div>\` : ''}
        \${r.fact_check ? \`<div class="fact-check">&#10033; \${r.fact_check}</div>\` : ''}
        \${isCody && r.action ? \`<div class="action-line">&#9658; \${r.action}</div>\` : ''}
      </div>\`;

    container.appendChild(card);
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 80 + i * 100);
  });

  // Attenborough verdict — below cards, delayed
  if (data.attenborough_verdict) {
    const cardDelay = (data.panel?.length || 0) * 100 + 400;
    const verdictEl = document.getElementById('att-verdict');
    if (verdictEl) {
      setTimeout(() => {
        verdictEl.querySelector('.att-text').textContent = data.attenborough_verdict;
        verdictEl.style.display = 'flex';
        setTimeout(() => verdictEl.classList.add('visible'), 50);
      }, cardDelay);
    }
  }
}

function hideResults() {
  document.getElementById('results').classList.remove('show');
  document.getElementById('verdict-block').style.display = 'none';
  document.getElementById('loading').style.display = 'block';
  document.getElementById('loading').innerHTML = '<span>PANEL CONVENING</span><span class="dots"></span>';
  document.getElementById('cards-out').innerHTML = '';
  document.getElementById('doom-pct').textContent = '0%';
  document.getElementById('doom-fill').style.width = '0%';
  const opening = document.getElementById('att-opening');
  if (opening) { opening.style.display = 'none'; }
  const verdict = document.getElementById('att-verdict');
  if (verdict) { verdict.style.display = 'none'; verdict.classList.remove('visible'); }
}

function setButtonState(disabled) {
  const btn = document.getElementById('btn-assess');
  if (btn) btn.disabled = disabled;
}

const UI = { clearChips, clearAll, showLoading, showError, renderResults, hideResults, setButtonState };


// === api.js ===

// api.js — v2 with reaction mode support
// Single responsibility: Worker integration and API calls.


const WORKER_ENDPOINT = 'https://cusslab-api.leanspirited.workers.dev/survival-school/assess';

async function assess(situation) {
  const response = await fetch(WORKER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: buildSystemPrompt('assessment'),
      situation
    })
  });
  if (!response.ok) throw new Error(\`Worker \${response.status}\`);
  const data = await response.json();
  if (!data.panel || !Array.isArray(data.panel)) throw new Error('Invalid response');
  return data;
}

async function assessWorst(situation, systemPrompt) {
  const response = await fetch(WORKER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: systemPrompt, situation })
  });
  if (!response.ok) throw new Error(\`Worker \${response.status}\`);
  const data = await response.json();
  if (!data.panel || !Array.isArray(data.panel)) throw new Error('Invalid response');
  return data;
}

async function react(situation, decision, currentProbability) {
  const context = \`ORIGINAL SITUATION:\\n\${situation}\\n\\nCURRENT SURVIVAL PROBABILITY: \${currentProbability}%\\n\\nUSER'S DECISION: \${decision}\`;
  const response = await fetch(WORKER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: buildSystemPrompt('reaction'),
      situation: context
    })
  });
  if (!response.ok) throw new Error(\`Worker \${response.status}\`);
  const data = await response.json();
  if (!data.panel || !Array.isArray(data.panel)) throw new Error('Invalid response');
  return data;
}

const API = { assess, assessWorst, react };


// === main ===



  window.onScenario = (el, eventVal, animalVal, circVal) => {
    document.querySelectorAll('#chips-scenario .chip').forEach(c => c.classList.remove('sel'));
    el.classList.add('sel');
    State.setEvent(eventVal);
    State.setAnimal(animalVal);
    State.setCircumstances(circVal);
    document.getElementById('event-input').value = eventVal;
    document.getElementById('animal-input').value = animalVal;
    document.getElementById('circ-input').value = circVal;
  };

  window.onChip = (el, field, val) => {
    document.querySelectorAll(\`#chips-\${field} .chip\`).forEach(c => c.classList.remove('sel'));
    el.classList.add('sel');
    if (field === 'event')  { State.setEvent(val); document.getElementById('event-input').value = val; }
    if (field === 'animal') { State.setAnimal(val); document.getElementById('animal-input').value = val; }
    if (field === 'circ')   { State.setCircumstances(val); document.getElementById('circ-input').value = val; }
  };

  window.onFieldInput = (field, val) => {
    UI.clearChips(field);
    if (field === 'event')  State.setEvent(val);
    if (field === 'animal') State.setAnimal(val);
    if (field === 'circ')   State.setCircumstances(val);
  };

  window.onClear = () => {
    State.reset();
    UI.clearAll();
    UI.hideResults();
    UI.setButtonState(false);
  };

  window.onAssess = async () => {
    const situation = State.buildSituation();
    if (!situation) { alert('Tell us something about your incident first.'); return; }

    UI.setButtonState(true);
    UI.showLoading();

    try {
      const data = await API.assessWorst(situation, buildWorstSystemPrompt());
      UI.renderResults(data);
    } catch (e) {
      UI.showError('Panel unavailable. They may already know how this ends.');
    } finally {
      UI.setButtonState(false);
    }
  };

</script>

</body>
</html>

`;

const SURVIVAL_SCHOOL_MUNDANE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mundane Mode — Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0f1209;
      --surface: #181d10;
      --surface2: #1e2514;
      --border: rgba(120,160,60,0.15);
      --border-strong: rgba(120,160,60,0.3);
      --green: #7aad3a;
      --green-dim: #4a7020;
      --green-bright: #a0d050;
      --amber: #BA7517;
      --amber-dim: #5c3a08;
      --bark: #8B6040;
      --bark-dim: #3d2008;
      --text: #e8edd8;
      --text-muted: #7a8a60;
      --blood: #cc1111;
      --blood-dim: #3a0808;
    }

    body {
      font-family: 'Barlow', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
    }

    #app {
      max-width: 680px;
      margin: 0 auto;
      padding: 1.5rem 1rem 3rem;
    }

    .header {
      text-align: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 0.5px solid var(--border);
    }

    .title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 40px;
      letter-spacing: 3px;
      line-height: 1;
    }

    .title span { color: var(--amber); }

    .subtitle {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 1.5px;
      margin-top: 5px;
    }

    .field-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 1.5px;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 6px;
      margin-top: 0;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 10px;
    }

    .chip {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      padding: 5px 10px;
      border: 0.5px solid var(--border-strong);
      border-radius: 5px;
      cursor: pointer;
      background: none;
      color: var(--text-muted);
      transition: all 0.15s;
      white-space: nowrap;
      user-select: none;
    }

    .chip:hover, .chip.sel { border-color: var(--amber); color: var(--amber); }

    textarea {
      width: 100%;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      padding: 9px 12px;
      border: 0.5px solid var(--border-strong);
      border-radius: 6px;
      background: var(--surface);
      color: var(--text);
      outline: none;
      resize: vertical;
      transition: border-color 0.15s;
    }

    textarea:focus { border-color: var(--amber); }

    .btn-row { display: flex; gap: 8px; margin-top: 14px; }

    .btn-assess {
      flex: 1;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 11px;
      background: var(--amber);
      color: var(--bg);
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: opacity 0.15s;
    }

    .btn-assess:hover { opacity: 0.88; }
    .btn-assess:disabled { opacity: 0.4; cursor: not-allowed; }

    .btn-clear {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      letter-spacing: 1px;
      padding: 11px 16px;
      border: 0.5px solid var(--border-strong);
      border-radius: 6px;
      background: none;
      cursor: pointer;
      color: var(--text-muted);
      transition: color 0.15s, border-color 0.15s;
    }

    .btn-clear:hover { color: var(--text); border-color: var(--amber); }

    /* Results */
    .results { display: none; margin-top: 1.5rem; }
    .results.show { display: block; }

    .loading {
      padding: 2rem;
      text-align: center;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      color: var(--text-muted);
      letter-spacing: 1px;
    }

    .dots::after {
      content: '';
      animation: dots 1.5s steps(3, end) infinite;
    }

    @keyframes dots {
      0%   { content: '.'; }
      33%  { content: '..'; }
      66%  { content: '...'; }
      100% { content: ''; }
    }

    /* Attenborough bookends */
    .att-bookend {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 10px 14px;
      background: var(--surface);
      border: 0.5px solid var(--border);
      border-radius: 8px;
    }

    .att-avatar {
      width: 26px; height: 26px;
      background: #1e1e1c;
      color: #7a8a70;
      border-radius: 50%;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 9px;
      letter-spacing: 0.5px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .att-text {
      font-family: 'Barlow', sans-serif;
      font-weight: 300;
      font-style: italic;
      font-size: 14px;
      line-height: 1.7;
      color: var(--text-muted);
    }

    #att-opening { margin-bottom: 12px; }

    #att-verdict {
      margin-top: 12px;
      opacity: 0;
      transition: opacity 0.8s ease;
    }

    #att-verdict.visible { opacity: 1; }

    /* Probability meter */
    .verdict-bar {
      border: 0.5px solid var(--border);
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 1rem;
      background: var(--surface);
    }

    .verdict-top {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .verdict-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 2px;
      color: var(--text-muted);
    }

    .pct {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 52px;
      color: var(--blood);
      line-height: 1;
      transition: color 0.5s;
    }

    .pct.ok  { color: var(--green); }
    .pct.mid { color: var(--amber); }

    .meter {
      height: 4px;
      background: var(--border);
      border-radius: 2px;
      overflow: hidden;
    }

    .meter-fill {
      height: 100%;
      background: var(--blood);
      border-radius: 2px;
      transition: width 1.2s ease, background 0.5s;
    }

    .meter-fill.ok  { background: var(--green); }
    .meter-fill.mid { background: var(--amber); }

    .panel-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 2px;
      color: var(--text-muted);
      margin-bottom: 10px;
    }

    /* Panel cards */
    .char-card {
      border: 0.5px solid var(--border);
      border-radius: 10px;
      margin-bottom: 8px;
      overflow: hidden;
      background: var(--surface);
    }

    .char-card.death-card { border-color: var(--blood); }
    .char-card.char-bear { background: rgba(120,134,107,0.15); }
    .char-card.char-ray { background: rgba(85,107,47,0.15); }
    .char-card.char-fox { background: rgba(74,74,74,0.2); }
    .char-card.char-hales { background: rgba(200,134,10,0.12); }
    .char-card.char-cody { background: rgba(139,115,85,0.15); }
    .char-card.char-stroud { background: rgba(47,79,79,0.2); }
    .char-card.char-attenborough { background: rgba(27,58,45,0.2); }
    .char-card.char-oshea { background: rgba(139,69,19,0.15); }
    .char-card.char-stevens { background: rgba(122,92,30,0.15); }
    .char-card.char-gordon { background: rgba(201,150,42,0.12); }
    .char-card.char-billy { background: rgba(107,39,55,0.15); }
    .char-card.char-ollie { background: rgba(61,90,107,0.15); }
    .char-card.char-craighead { background: rgba(139,115,85,0.12); }
    .char-card.char-coyote { background: rgba(204,85,0,0.12); }

    .card-head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      background: var(--surface2);
      border-bottom: 0.5px solid var(--border);
    }

    .avatar {
      width: 30px; height: 30px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }

    .av-green  { background: var(--green-dim);  color: var(--green-bright); }
    .av-bark   { background: var(--bark-dim);   color: var(--bark); }
    .av-amber  { background: var(--amber-dim);  color: var(--amber); }
    .av-blue   { background: #0c1f3a;           color: #5a9fd4; }
    .av-gray   { background: #1e1e1c;           color: #7a8a70; }

    .char-name {
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.5px;
      color: var(--text);
    }

    .char-role {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: var(--text-muted);
    }

    .card-body {
      padding: 11px 14px;
      font-family: 'Barlow', sans-serif;
      font-size: 14px;
      line-height: 1.7;
      color: var(--text);
      font-weight: 400;
    }

    .death-note {
      margin-top: 8px;
      padding: 7px 11px;
      background: var(--blood-dim);
      border-left: 3px solid var(--blood);
      border-radius: 0 4px 4px 0;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--blood);
      font-weight: 500;
    }

    .fact-check {
      margin-top: 6px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      border-top: 0.5px solid var(--border);
      padding-top: 6px;
      opacity: 0.7;
    }

    .reset-row { margin-top: 1rem; text-align: center; }

    .btn-reset {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      background: none;
      border: 0.5px solid var(--border-strong);
      border-radius: 6px;
      padding: 7px 16px;
      cursor: pointer;
      letter-spacing: 1px;
      transition: all 0.15s;
    }

    .btn-reset:hover { color: var(--text); border-color: var(--amber); }
  </style>
</head>
<body>
<div id="app">

  <div class="header">
    <div class="title"><span>MUNDANE</span> MODE</div>
    <div class="subtitle">your everyday problem. their full survival gravity.</div>
  </div>

  <div class="field-label">Your situation</div>
  <div class="chips" id="chips-mundane">
    <div class="chip" onclick="onChip(this, 'I have missed the last bus home. It is raining.')">missed the last bus</div>
    <div class="chip" onclick="onChip(this, 'I am locked out of my house. It is 11pm.')">locked out</div>
    <div class="chip" onclick="onChip(this, 'The printer has run out of ink. My presentation is in 10 minutes.')">printer out of ink</div>
    <div class="chip" onclick="onChip(this, 'I have spilled coffee on my laptop. It is making a concerning noise.')">coffee on laptop</div>
    <div class="chip" onclick="onChip(this, 'The wifi is down. I am working from home. I have a video call in 20 minutes.')">wifi down, call in 20</div>
    <div class="chip" onclick="onChip(this, 'I have run out of tea bags. It is Sunday. The shops are closed.')">no tea bags, Sunday</div>
    <div class="chip" onclick="onChip(this, 'There is one till open at the post office. The queue has not moved in 15 minutes.')">one till, post office</div>
    <div class="chip" onclick="onChip(this, 'I ordered a takeaway 90 minutes ago. The app says it is still being prepared.')">takeaway 90 mins</div>
    <div class="chip" onclick="onChip(this, 'My flat tyre is on the motorway hard shoulder. I am not a member of the AA.')">flat tyre, M-way</div>
    <div class="chip" onclick="onChip(this, 'The self-checkout has called for assistance. There is a queue behind me.')">self-checkout assist</div>
  </div>
  <textarea id="mundane-input" rows="3"
    placeholder="or describe your situation in full... I've missed the last bus, it's October, raining, and I'm wearing trainers..."
    oninput="onInput(this.value)"></textarea>

  <div class="btn-row">
    <button class="btn-assess" id="btn-assess" onclick="onAssess()">ASSESS MY SITUATION ↗</button>
    <button class="btn-clear" onclick="onClear()">CLEAR</button>
  </div>

  <div class="results" id="results">
    <div class="loading" id="loading">
      <span>PANEL CONVENING</span><span class="dots"></span>
    </div>
    <div id="verdict-block" style="display:none">
      <div class="att-bookend" id="att-opening" style="display:none">
        <div class="att-avatar">DA</div>
        <div class="att-text"></div>
      </div>
      <div class="verdict-bar">
        <div class="verdict-top">
          <div class="verdict-label">SURVIVAL PROBABILITY</div>
          <div class="pct" id="surv-pct">0%</div>
        </div>
        <div class="meter">
          <div class="meter-fill" id="pct-fill" style="width:0%"></div>
        </div>
      </div>
      <div class="panel-label">PANEL ASSESSMENT</div>
      <div id="cards-out"></div>
      <div class="att-bookend" id="att-verdict" style="display:none">
        <div class="att-avatar">DA</div>
        <div class="att-text"></div>
      </div>
      <div class="reset-row">
        <button class="btn-reset" onclick="onClear()">NEW SITUATION</button>
      </div>
    </div>
  </div>

</div>

<script>
// === characters.js ===

// characters.js — v2 with Jason Fox and interaction loop support
// Anti-Corruption Layer. Single source of truth for all character data.

const CHARACTERS = {
  ray: {
    id: 'ray', name: 'Ray Mears', role: 'Bushcraft',
    av: 'RM', avClass: 'av-green',
    deathLine: 'You could be dead within the hour.',
    voice: \`RAY MEARS — Bushcraft, 30+ years field experience.
Cerebral, warm, loves the land. Great storyteller. Chubby survivalist —
kebab van just off camera, never mentioned, always implied.
Delivers five-minute meditation on interconnectedness then roasts it with evident satisfaction.
VOICE: Never dramatic. Brevity is power. "Don't." is a complete sentence.
Silence more eloquent than anything about Bear. Stories build slowly to a point.
SKILLS: Fire 99, Shelter 97, Tool-making 98, Plant Knowledge 88, Navigation 90.\`
  },
  bear: {
    id: 'bear', name: 'Bear Grylls', role: 'Former SAS',
    av: 'BG', avClass: 'av-bark',
    deathLine: 'If you get this wrong, you will not make it out of here alive.',
    voice: \`BEAR GRYLLS — Former SAS. Genuine SAS credentials. Also drinks own urine when Londis is forty yards away.
Gets ill eating things he didn't need to eat. Idiocy is sincere, not performed.
Comedy engine: gap between SAS credentials and Londis forty yards away.
Genuinely believes dramatic version IS the technique. No ironic distance whatsoever.
VOICE: Urgent, evangelical, slightly breathless. Personal anecdote always — abroad, fine in the end.
"Hydration?" unprompted every third response. Fact-checker footnote fires on factual claims.
SKILLS: Psychology 92, Endurance 95, Navigation 80, Fire 70.\`
  },
  cody: {
    id: 'cody', name: 'Cody Lundin', role: 'Primitive Skills',
    av: 'CL', avClass: 'av-green',
    deathLine: 'I have watched people make this mistake. They are no longer with us.',
    voice: \`CODY LUNDIN — Aboriginal Living Skills School, Prescott Arizona. Barefoot on glaciers.
Threw fire-making supplies into pool rather than demonstrate bad technique. Chose integrity over career.
Comedy engine: always knows better option that was right there. "Cattails. Thirty feet away."
VOICE: Patient, quiet, certain. Mentions feet/footwear when relevant. Never dramatic.
Cody Override fires when asked to endorse wrong survival advice — refuses.
SKILLS: Fire 97, Plant Knowledge 96, Tool-making 95, Psychology 95, Endurance 93.\`
  },
  hales: {
    id: 'hales', name: 'Les Hiddins', role: 'Bush Tucker Man',
    av: 'LH', avClass: 'av-amber',
    deathLine: 'Have a look at that.',
    voice: \`LES HIDDINS — Major, Australian Army. Bush Tucker Man. Vietnam veteran.
Walked 2,500km of remote northern Australia cataloguing food sources with the energy of a man doing light admin.
Witchetty grubs taste like almonds raw, roast chicken cooked. He says this as a statement of fact, not a boast.
CATCHPHRASE: "Have a look at this." — his most reliable opener, delivered like show-and-tell.
FOOD VERDICT: "Not too bad — a bit starchy." is his highest compliment. Never performs disgust or enthusiasm.
KNOWLEDGE: Cites Aboriginal survival practices constantly and with genuine respect. "The Aboriginal people have been eating this for 40,000 years." This is not filler — it's his point.
VOICE: Understated, educational, unhurried. Treats eating anything unusual or dangerous as practically interesting.
Australian idiom used naturally: "She'll be right." "Have a crack at it." "That'll do the job."
NEVER three-word responses — he has vocabulary and uses it with measured calm.
Frowns slightly if called tough. Never heard of Bear Grylls. Finds survival genuinely fascinating rather than heroic.
SKILLS: Plant Knowledge 95, Psychology 95, Endurance 90, Water 90.\`
  },
  fox: {
    id: 'fox', name: 'Jason Fox', role: 'Special Boat Service',
    av: 'JF', avClass: 'av-green',
    deathLine: 'That is not a recoverable position.',
    voice: \`JASON FOX — Foxy. Royal Marines at 16. SBS from 2001. "Like the SAS but better."
Demolitions expert, combat swimmer, dog handler, jungle survival expert.
Warm, self-deprecating, genuinely funny. Absolute killing machine. No contradiction in his mind.
Comedy engine: tactical reframe of everything. Panel talks shelter. Fox assesses defensibility,
lines of sight, exit routes, what is available as improvised incendiary. Not doing it to be funny.
VOICE PATTERNS:
1. Flat deflation — remarkable things delivered as admin. "Needed to pay bills, there we go."
2. Calls it what it is, moves on — "gobshite. But he'd love it." One word, then useful info.
3. Logical framework for feelings — emotions as problems to diagnose and resolve.
4. Tactical reframe — threat assessment, lines of sight, entry/exit, improvised weapons.
5. Self-deprecating then immediately competent.
"Is that a dog walker or a contact?" is the template register. Swears naturally, matter-of-fact.
NEVER make mental health a punchline. Ever.
SKILLS: Navigation 96, Endurance 97, Terrain/Weather 92, Tool-making 88, Psychology 90.\`
  },
  attenborough: {
    id: 'attenborough', name: 'David Attenborough', role: 'Natural World',
    av: 'DA', avClass: 'av-gray',
    deathLine: 'And so the story ends. As so many do. Quietly. And entirely predictably.',
    voice: \`DAVID ATTENBOROUGH — 97 years watching things die. Your mistake is a Holocene footnote.
Comedy engine: geological calm applied to your specific predicament.
VOICE: Never gives survival advice — observes, describes, delivers verdict.
Gaps matter as much as words. "Fascinating" always genuine. Narrates as nature documentary.
Attenborough Eulogy closes every death state — one paragraph, never comedic in register, always in effect.
SKILLS: Animal Encounters 95, Psychology 85. Everything practical: 0. Has a crew for this.\`
  },
  stroud: {
    id: 'stroud', name: 'Les Stroud', role: 'Survivorman',
    av: 'LS', avClass: 'av-blue',
    deathLine: '',
    voice: \`LES STROUD — Survivorman. Canadian. Entirely alone — no crew, films himself.
Refused producer demands to fake survival. Walked away from money for authenticity.
One harmonica note is a complete response sometimes.
VOICE: Mild, slightly distant, genuine. "That didn't work." on camera and means it.
Wears shoes — Cody has feelings about this.
SKILLS: Endurance 90, Shelter 90, Water 88, Psychology 85, Navigation 85.\`
  }
};

const SHARED_CONTEXT = \`
RELATIONSHIPS:
- Bear/Ray: Ray never says Bear is wrong. Silence and contrast do the work.
- Bear/Fox: Fox finds Bear broadly fine. Thinks Bear would have passed selection. Doesn't say this.
- Fox/Cody: Both genuinely competent, neither performs it. Fox finds barefoot thing tactically suboptimal.
- Fox/Hales: Fox finds Hales immediately credible. "Yeah he's good." Full endorsement.
- Fox/Attenborough: Non-threatening, high-value, zero tactical utility. Treats him with warmth.
- Cody/Stroud: Stroud wears shoes. One long look. Silence.
- Attenborough/everyone: Closes every scene.

PANEL CONVERSATION — characters are in the same room. They hear each other. Use this:
- Later characters may react briefly to what an earlier character said — a short phrase, a contradiction, a pointed silence made text. One or two cross-references per response, never more.
- Bear says something dramatic: Cody's opening may be "He's not wrong, but—" or "The alternative was right there."
- Ray says something measured: Bear agrees with evangelical energy in a way that suggests partial comprehension.
- Fox will call out Bear's overstatement with one flat sentence. "That's not accurate."
- Hales can validate or gently contradict with three words. "He's not wrong." "Not quite right."
- Stroud speaks last or near-last. Quiet acknowledgement of the room, then his own conclusion.
- Direct address is allowed: "What Ray said—", "Bear's right on one thing.", "I wouldn't do what Bear did."
- Keep it brief. Conversation is texture, not the point. Never more than one sentence of cross-reference.

DEATH COMMENTARY: Earned — not wallpaper. Fires on clearly wrong call, dire situation (under 35%), or panel disagreement.

FOUNDING PHILOSOPHY: Real knowledge. Genuine consequence. No performance. Comedy earned by knowledge being real.\`;


// Panel characters (excludes Attenborough — he does bookends, not panel cards)
const PANEL_IDS = ['ray', 'bear', 'cody', 'hales', 'fox', 'stroud'];

function buildSystemPrompt(mode = 'assessment') {
  const chars = Object.values(CHARACTERS)
    .map(c => \`=== \${c.name.toUpperCase()} ===\\n\${c.voice}\`)
    .join('\\n\\n');

  if (mode === 'reaction') {
    return \`You are the Survival School panel reaction engine. A user has made a survival decision. React to that specific choice in character.

\${chars}

\${SHARED_CONTEXT}

ATTENBOROUGH BOOKEND STRUCTURE — Attenborough does NOT appear in the panel array. He bookends the whole response:
- attenborough_opening: one sentence, nature documentary register, frames what this decision is about to cause. Observational, slightly ominous.
- attenborough_verdict: one sentence, geological calm, no appeal, the turn's conclusion. He already knew.

PANEL TRIAGE ORDER (SS-034) — follow this sequence:
1. IMMEDIATE (Ray, Fox): What to do RIGHT NOW. Clinical. Ray: craft-based action. Fox: threat still active? exit options?
2. COMEDY/OBSERVATION (Bear, Hales, Cody, Stroud): Once the immediate has landed. Bear: anecdote, hydration. Hales: three words. Cody: better option. Stroud: quiet verdict.
The comedy only works after the immediate layer. Do not mix the order.

Panel characters (no Attenborough): Ray, Bear, Cody, Hales, Fox, Stroud.
- Ray: IMMEDIATE — technically correct? Craft judgement. Goes first.
- Fox: IMMEDIATE — threat still active? lines of sight, exit options. Goes second.
- Bear: COMEDY — anecdote somewhere exotic, fine in the end, hydration unprompted.
- Hales: COMEDY — three words. Maximum. Understated. Cites Aboriginal knowledge.
- Cody: OBSERVATION — better option that was right there. "Cattails. Thirty feet away."
- Stroud: VERDICT — quiet, measured. Slight melancholy.

Survival probability shifts:
- Good decision: +10 to +20
- Neutral: no change
- Poor: -15 to -25
- Catastrophic: -30 to -50

Generate 3 specific next actions the user could take from here.
If probability reaches 0 or situation fully resolves, set is_terminal to true.

ATTENBOROUGH EULOGY (SS-014): When is_terminal is true AND survival_probability is 0 (death), include attenborough_eulogy — one paragraph, geological calm, never comedic in register, always comedic in effect. References specific details from this specific situation. He does not console. He observes. The comedy comes from the precision and the calm, not from any attempt at comedy.

OUTPUT — valid JSON only, no markdown:
{"survival_probability":<integer>,"attenborough_opening":"<one sentence, nature doc, frames what the decision is about to cause>","situation_update":"<one sentence what changed>","panel":[{"charId":"ray","text":"<2-3 sentences>"},{"charId":"fox","text":"<2-3 sentences>"},{"charId":"bear","text":"<2-3 sentences>","fact_check":"<optional>"},{"charId":"hales","text":"<1-2 sentences>"},{"charId":"cody","text":"<2-3 sentences>"},{"charId":"stroud","text":"<1-2 sentences>"}],"attenborough_verdict":"<one sentence, geological calm, turn conclusion, he already knew>","next_actions":["<action>","<action>","<action>"],"is_terminal":<bool>,"attenborough_eulogy":"<one paragraph, death only, geological calm, never comic in register, always in effect — omit if not terminal death>"}\`;
  }

  if (mode === 'mundane') {
    return \`You are the Survival School panel. The user has described a MUNDANE, EVERYDAY problem. Apply full survival gravity. This is the joke — the greater the gravity, the funnier.

\${chars}

\${SHARED_CONTEXT}

MUNDANE MODE: The situation is not a survival emergency. The panel doesn't know this.
They assess with the same weight they would give a man trapped on Dartmoor in October.

ATTENBOROUGH BOOKEND STRUCTURE — Attenborough does NOT appear in the panel array. He bookends:
- attenborough_opening: one sentence, introduces the mundane situation as if it's a wildlife encounter. "And here, in the fluorescent ecology of the Wetherspoons, a specimen faces a challenge that, while modest in geological terms, carries its own quiet urgency."
- attenborough_verdict: one sentence, geological calm. Final verdict. He always knew.

PANEL TRIAGE ORDER (SS-034) — responses must follow this sequence:
1. IMMEDIATE (Ray, Fox): Stakes first. Ray identifies the real risks in the mundane situation. Fox assesses exit routes and lines of sight. Both are genuinely concerned.
2. COMEDY/OBSERVATION (Bear, Hales, Cody, Stroud): Once the immediate has landed. Bear has done something similar abroad, fine in the end. Hales: three words maximum. Cody: better option that was right there. Stroud: quiet verdict.
The comedy only works after the immediate layer has established that the situation is being taken seriously.

Panel characters (no Attenborough): Ray, Fox, Bear, Hales, Cody, Stroud.
- Ray: IMMEDIATE — identifies the real risks in the mundane. Genuinely concerned. Goes first.
- Fox: IMMEDIATE — tactical assessment. Exit routes from the post office queue. Lines of sight. Goes second.
- Bear: COMEDY — has done something similar, abroad, fine in the end.
- Hales: COMEDY — understated, educational. 1-2 sentences. "Have a look at this." Cites Aboriginal knowledge.
- Cody: OBSERVATION — points out the better option that was right there. "The bus stop. Fifty yards away."
- Stroud: VERDICT — quiet, measured. Slightly melancholy.

Survival probability: 0-100. For mundane scenarios this is usually 40-85% — they're not great situations, but survivable with the right mindset. A truly catastrophic mundane scenario (printer has run out of ink, presentation in 10 minutes) may drop lower.

${SOCIAL_DYNAMICS_ENGINE}

OUTPUT — valid JSON only, no markdown:
{"survival_probability":<integer 0-100>,"attenborough_opening":"<one sentence, nature documentary, introduces mundane situation as wildlife encounter>","panel":[{"charId":"ray","text":"<2-3 sentences>"},{"charId":"fox","text":"<2-3 sentences>"},{"charId":"bear","text":"<2-3 sentences>","fact_check":"<optional>"},{"charId":"hales","text":"<1-2 sentences>"},{"charId":"cody","text":"<2-3 sentences>"},{"charId":"stroud","text":"<1-2 sentences>"}],"attenborough_verdict":"<one sentence, geological calm, final verdict>","panel_tension":{"type":"wound_reference|lie|callout|wolf_pack|none","subject":"<charId or empty>","by":["<charId>"],"note":"<one line or empty string>"}}\`;
  }

  return \`You are the Survival School panel assessment engine.

\${chars}

\${SHARED_CONTEXT}

ATTENBOROUGH BOOKEND STRUCTURE — Attenborough does NOT appear in the panel array. He bookends the whole assessment:
- attenborough_opening: one sentence, nature documentary register, introduces the situation as if it's a wildlife encounter. Sets the stakes. Slightly ominous.
- attenborough_verdict: one sentence, geological calm, no appeal. The documentary's conclusion. He already knew.

PANEL TRIAGE ORDER (SS-034) — responses must follow this sequence:
1. IMMEDIATE (Ray, Fox): What to do RIGHT NOW. Clinical, no drama. Ray: craft-based action, technically correct. Fox: threat still active? lines of sight, exit options.
2. COMEDY/OBSERVATION (Bear, Hales, Cody, Stroud): Once the immediate has landed. Bear: anecdote, somewhere exotic, fine in the end, hydration unprompted. Hales: three words. Cody: better option that was right there. Stroud: quiet verdict.
The comedy only works if the immediate layer has set the stakes first. Do not mix the order.

Panel characters (no Attenborough): Ray, Fox, Bear, Hales, Cody, Stroud.
- Ray: IMMEDIATE — is it technically correct? Craft judgement. Brief. Goes first.
- Fox: IMMEDIATE — threat still active? lines of sight, exit options, what's available. Goes second.
- Bear: COMEDY — anecdote, somewhere exotic, fine in the end, hydration unprompted.
- Hales: COMEDY — three words. Maximum. Understated. Educational.
- Cody: OBSERVATION — was there a better option right there? "Cattails. Thirty feet away."
- Stroud: VERDICT — quiet, measured. Slight melancholy.

Generate initial assessment. Also produce 3 specific suggested first actions.

${SOCIAL_DYNAMICS_ENGINE}

OUTPUT — valid JSON only, no markdown:
{"survival_probability":<integer 0-100>,"attenborough_opening":"<one sentence, nature doc, introduces situation as wildlife encounter, slightly ominous>","panel":[{"charId":"ray","text":"<2-4 sentences>"},{"charId":"fox","text":"<2-4 sentences>"},{"charId":"bear","text":"<2-4 sentences>","fact_check":"<optional>"},{"charId":"hales","text":"<2-3 sentences>"},{"charId":"cody","text":"<2-4 sentences>"},{"charId":"stroud","text":"<1-2 sentences>"}],"attenborough_verdict":"<one sentence, geological calm, no appeal, the documentary's conclusion>","next_actions":["<action>","<action>","<action>"],"panel_tension":{"type":"wound_reference|lie|callout|wolf_pack|none","subject":"<charId or empty>","by":["<charId>"],"note":"<one line or empty string>"}}\`;
}



// === api.js ===

// api.js — v2 with reaction mode support
// Single responsibility: Worker integration and API calls.


const WORKER_ENDPOINT = 'https://cusslab-api.leanspirited.workers.dev/survival-school/assess';

async function assess(situation) {
  const response = await fetch(WORKER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: buildSystemPrompt('assessment'),
      situation
    })
  });
  if (!response.ok) throw new Error(\`Worker \${response.status}\`);
  const data = await response.json();
  if (!data.panel || !Array.isArray(data.panel)) throw new Error('Invalid response');
  return data;
}

async function assessWorst(situation, systemPrompt) {
  const response = await fetch(WORKER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: systemPrompt, situation })
  });
  if (!response.ok) throw new Error(\`Worker \${response.status}\`);
  const data = await response.json();
  if (!data.panel || !Array.isArray(data.panel)) throw new Error('Invalid response');
  return data;
}

async function react(situation, decision, currentProbability) {
  const context = \`ORIGINAL SITUATION:\\n\${situation}\\n\\nCURRENT SURVIVAL PROBABILITY: \${currentProbability}%\\n\\nUSER'S DECISION: \${decision}\`;
  const response = await fetch(WORKER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: buildSystemPrompt('reaction'),
      situation: context
    })
  });
  if (!response.ok) throw new Error(\`Worker \${response.status}\`);
  const data = await response.json();
  if (!data.panel || !Array.isArray(data.panel)) throw new Error('Invalid response');
  return data;
}



// === main ===



  let situation = '';

  window.onChip = (el, val) => {
    document.querySelectorAll('#chips-mundane .chip').forEach(c => c.classList.remove('sel'));
    el.classList.add('sel');
    situation = val;
    document.getElementById('mundane-input').value = val;
  };

  window.onInput = (val) => {
    document.querySelectorAll('#chips-mundane .chip').forEach(c => c.classList.remove('sel'));
    situation = val;
  };

  window.onClear = () => {
    situation = '';
    document.getElementById('mundane-input').value = '';
    document.querySelectorAll('#chips-mundane .chip').forEach(c => c.classList.remove('sel'));
    document.getElementById('results').classList.remove('show');
    document.getElementById('verdict-block').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('loading').innerHTML = '<span>PANEL CONVENING</span><span class="dots"></span>';
    document.getElementById('cards-out').innerHTML = '';
    document.getElementById('surv-pct').textContent = '0%';
    document.getElementById('pct-fill').style.width = '0%';
    const opening = document.getElementById('att-opening');
    opening.style.display = 'none';
    const verdict = document.getElementById('att-verdict');
    verdict.style.display = 'none';
    verdict.classList.remove('visible');
    document.getElementById('btn-assess').disabled = false;
  };

  window.onAssess = async () => {
    if (!situation.trim()) { alert('Tell us about your situation first.'); return; }
    document.getElementById('btn-assess').disabled = true;
    document.getElementById('results').classList.add('show');
    document.getElementById('loading').style.display = 'block';
    document.getElementById('loading').innerHTML = '<span>PANEL CONVENING</span><span class="dots"></span>';
    document.getElementById('verdict-block').style.display = 'none';

    try {
      const data = await assessWorst(situation.trim(), buildSystemPrompt('mundane'));

      document.getElementById('loading').style.display = 'none';
      document.getElementById('verdict-block').style.display = 'block';

      // Attenborough opening
      if (data.attenborough_opening) {
        const openingEl = document.getElementById('att-opening');
        openingEl.querySelector('.att-text').textContent = data.attenborough_opening;
        openingEl.style.display = 'flex';
      }

      // Probability meter
      const pct = data.survival_probability || 0;
      const cls = pct >= 70 ? 'ok' : pct >= 40 ? 'mid' : '';
      const pctEl = document.getElementById('surv-pct');
      const fill  = document.getElementById('pct-fill');
      pctEl.className = 'pct' + (cls ? ' ' + cls : '');
      fill.className  = 'meter-fill' + (cls ? ' ' + cls : '');
      fill.style.width = '0%'; pctEl.textContent = '0%';
      setTimeout(() => { fill.style.width = pct + '%'; pctEl.textContent = pct + '%'; }, 100);

      // Panel cards
      const container = document.getElementById('cards-out');
      container.innerHTML = '';
      (data.panel || []).forEach((r, i) => {
        const char = CHARACTERS[r.charId];
        if (!char) return;
        const card = document.createElement('div');
        card.className = 'char-card' + (r.death ? ' death-card' : '') + (r.charId ? ' char-' + r.charId : '');
        card.style.cssText = 'opacity:0;transform:translateY(7px);transition:opacity 0.3s ease,transform 0.3s ease';
        card.innerHTML = \`
          <div class="card-head">
            <div class="avatar \${char.avClass}">\${char.av}</div>
            <div>
              <div class="char-name">\${char.name}</div>
              <div class="char-role">\${char.role}</div>
            </div>
          </div>
          <div class="card-body">
            \${r.text}
            \${r.death && char.deathLine ? \`<div class="death-note">\${char.deathLine}</div>\` : ''}
            \${r.fact_check ? \`<div class="fact-check">&#10033; \${r.fact_check}</div>\` : ''}
          </div>\`;
        container.appendChild(card);
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 80 + i * 100);
      });

      // Attenborough verdict — delayed
      if (data.attenborough_verdict) {
        const cardDelay = (data.panel?.length || 0) * 100 + 400;
        setTimeout(() => {
          const verdictEl = document.getElementById('att-verdict');
          verdictEl.querySelector('.att-text').textContent = data.attenborough_verdict;
          verdictEl.style.display = 'flex';
          setTimeout(() => verdictEl.classList.add('visible'), 50);
        }, cardDelay);
      }

    } catch (e) {
      document.getElementById('loading').innerHTML =
        \`<span style="color:var(--blood)">Panel unavailable. They may already know how this ends.</span>\`;
    } finally {
      document.getElementById('btn-assess').disabled = false;
    }
  };

</script>

</body>
</html>

`;

const SURVIVAL_SCHOOL_EAT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Will You Eat It? — Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0f1209;
      --surface: #181d10;
      --surface2: #1e2514;
      --border: rgba(120,160,60,0.15);
      --border-strong: rgba(120,160,60,0.3);
      --green: #7aad3a;
      --green-dim: #4a7020;
      --green-bright: #a0d050;
      --amber: #BA7517;
      --amber-dim: #5c3a08;
      --bark: #8B6040;
      --bark-dim: #3d2008;
      --text: #e8edd8;
      --text-muted: #7a8a60;
      --blood: #cc1111;
      --blood-dim: #3a0808;
    }

    body { font-family: 'Barlow', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }

    #app { max-width: 680px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }

    .header { text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 0.5px solid var(--border); }
    .title { font-family: 'Bebas Neue', sans-serif; font-size: 40px; letter-spacing: 3px; line-height: 1; }
    .title span { color: var(--green); }
    .subtitle { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); letter-spacing: 1.5px; margin-top: 5px; }

    .field-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; margin-top: 16px; }
    .field-label:first-child { margin-top: 0; }

    .chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
    .chip { font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 5px 10px; border: 0.5px solid var(--border-strong); border-radius: 5px; cursor: pointer; background: none; color: var(--text-muted); transition: all 0.15s; white-space: nowrap; user-select: none; }
    .chip:hover, .chip.sel { border-color: var(--green); color: var(--green); }

    input[type="text"] { width: 100%; font-family: 'IBM Plex Mono', monospace; font-size: 13px; padding: 9px 12px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: var(--surface); color: var(--text); outline: none; transition: border-color 0.15s; }
    input[type="text"]:focus { border-color: var(--green); }

    .btn-row { display: flex; gap: 8px; margin-top: 16px; }
    .btn-assess { flex: 1; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; padding: 11px; background: var(--green-dim); color: var(--green-bright); border: 0.5px solid var(--green-dim); border-radius: 6px; cursor: pointer; transition: opacity 0.15s; }
    .btn-assess:hover { opacity: 0.88; }
    .btn-assess:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-clear { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 1px; padding: 11px 16px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: none; cursor: pointer; color: var(--text-muted); transition: color 0.15s, border-color 0.15s; }
    .btn-clear:hover { color: var(--text); border-color: var(--green); }

    .results { display: none; margin-top: 1.5rem; }
    .results.show { display: block; }

    .loading { padding: 2rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--text-muted); letter-spacing: 1px; }
    .dots::after { content: ''; animation: dots 1.5s steps(3, end) infinite; }
    @keyframes dots { 0%{content:'.'} 33%{content:'..'} 66%{content:'...'} 100%{content:''} }

    /* Verdict summary banner */
    .verdict-banner { text-align: center; padding: 1rem 0 0.5rem; margin-bottom: 0.5rem; }
    .verdict-banner .verdict-word { font-family: 'Bebas Neue', sans-serif; font-size: 48px; letter-spacing: 4px; line-height: 1; }
    .verdict-banner .verdict-word.eat { color: var(--green); }
    .verdict-banner .verdict-word.no  { color: var(--blood); }
    .verdict-banner .verdict-word.conditional { color: var(--amber); }
    .verdict-banner .item-name { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); letter-spacing: 1.5px; margin-top: 4px; }

    /* Panel cards */
    .panel-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--text-muted); margin-bottom: 10px; margin-top: 1rem; }

    .char-card { border: 0.5px solid var(--border); border-radius: 10px; margin-bottom: 8px; overflow: hidden; background: var(--surface); }
    .char-card.eats { border-color: var(--green-dim); }
    .char-card.wont { border-color: var(--blood-dim); }
    .char-card.asks { border-color: var(--amber-dim); }

    .card-head { display: flex; align-items: center; gap: 10px; padding: 9px 14px; background: var(--surface2); border-bottom: 0.5px solid var(--border); }
    .avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.5px; flex-shrink: 0; }
    .av-green  { background: var(--green-dim);  color: var(--green-bright); }
    .av-bark   { background: var(--bark-dim);   color: var(--bark); }
    .av-amber  { background: var(--amber-dim);  color: var(--amber); }
    .av-gray   { background: #1e1e1c;           color: #7a8a70; }

    .char-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; color: var(--text); }
    .char-role { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); }

    .eat-badge { margin-left: auto; font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 1px; padding: 3px 7px; border-radius: 3px; white-space: nowrap; }
    .eat-badge.yes  { background: rgba(122,173,58,0.15); color: var(--green); border: 0.5px solid var(--green-dim); }
    .eat-badge.no   { background: rgba(204,17,17,0.12);  color: var(--blood); border: 0.5px solid var(--blood-dim); }
    .eat-badge.ask  { background: rgba(186,117,23,0.12); color: var(--amber); border: 0.5px solid var(--amber-dim); }

    .card-body { padding: 11px 14px; font-family: 'Barlow', sans-serif; font-size: 14px; line-height: 1.7; color: var(--text); }

    .fact-check { margin-top: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); border-top: 0.5px solid var(--border); padding-top: 6px; opacity: 0.7; }

    .source-challenge { margin-top: 8px; padding: 7px 11px; background: rgba(120,160,60,0.06); border-left: 3px solid var(--green-dim); border-radius: 0 4px 4px 0; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--green-bright); }

    .impulse-note { margin-top: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--amber); border-top: 0.5px solid var(--border); padding-top: 6px; }

    .journal-note { margin-top: 8px; font-family: 'Barlow', sans-serif; font-style: italic; font-size: 12px; color: var(--text-muted); border-top: 0.5px solid var(--border); padding-top: 6px; opacity: 0.8; }

    /* Attenborough bookends */
    .att-bookend { display: flex; gap: 10px; align-items: flex-start; padding: 10px 14px; background: var(--surface); border: 0.5px solid var(--border); border-radius: 8px; }
    .att-avatar { width: 26px; height: 26px; background: #1e1e1c; color: #7a8a70; border-radius: 50%; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 9px; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
    .att-text { font-family: 'Barlow', sans-serif; font-weight: 300; font-style: italic; font-size: 14px; line-height: 1.7; color: var(--text-muted); }
    #att-opening { margin-bottom: 12px; }
    #att-verdict { margin-top: 12px; opacity: 0; transition: opacity 0.8s ease; }
    #att-verdict.visible { opacity: 1; }

    .reset-row { margin-top: 1rem; text-align: center; }
    .btn-reset { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); background: none; border: 0.5px solid var(--border-strong); border-radius: 6px; padding: 7px 16px; cursor: pointer; letter-spacing: 1px; transition: all 0.15s; }
    .btn-reset:hover { color: var(--text); border-color: var(--green); }
  </style>
</head>
<body>
<div id="app">

  <div class="header">
    <div class="title">WILL YOU <span>EAT</span> IT?</div>
    <div class="subtitle">the panel will decide before you do.</div>
  </div>

  <div class="field-label">What did you find?</div>
  <div class="chips" id="chips-item">
    <div class="chip" onclick="onChip(this,'mushroom')">mushroom</div>
    <div class="chip" onclick="onChip(this,'wild berries')">wild berries</div>
    <div class="chip" onclick="onChip(this,'witchetty grubs')">witchetty grubs</div>
    <div class="chip" onclick="onChip(this,'raw fish')">raw fish</div>
    <div class="chip" onclick="onChip(this,'roadkill')">roadkill</div>
    <div class="chip" onclick="onChip(this,'seaweed')">seaweed</div>
    <div class="chip" onclick="onChip(this,'insects')">insects</div>
    <div class="chip" onclick="onChip(this,'lichen')">lichen</div>
    <div class="chip" onclick="onChip(this,'bark or roots')">bark / roots</div>
    <div class="chip" onclick="onChip(this,'unknown leaves')">unknown leaves</div>
    <div class="chip" onclick="onChip(this,'snake')">snake</div>
    <div class="chip" onclick="onChip(this,'something I cannot identify')">unidentified</div>
  </div>
  <input type="text" id="item-input" placeholder="or describe exactly what you found..." oninput="onInput(this.value)"/>

  <div class="btn-row">
    <button class="btn-assess" id="btn-assess" onclick="onAssess()">WILL YOU EAT IT? ↗</button>
    <button class="btn-clear" onclick="onClear()">CLEAR</button>
  </div>

  <div class="results" id="results">
    <div class="loading" id="loading">
      <span>PANEL DELIBERATING</span><span class="dots"></span>
    </div>
    <div id="verdict-block" style="display:none">
      <div class="att-bookend" id="att-opening" style="display:none">
        <div class="att-avatar">DA</div>
        <div class="att-text"></div>
      </div>
      <div id="verdict-banner"></div>
      <div class="panel-label">THE PANEL HAS DECIDED</div>
      <div id="cards-out"></div>
      <div class="att-bookend" id="att-verdict" style="display:none">
        <div class="att-avatar">DA</div>
        <div class="att-text"></div>
      </div>
      <div class="reset-row">
        <button class="btn-reset" onclick="onClear()">ANOTHER ITEM</button>
      </div>
    </div>
  </div>

</div>

<script>
const WORKER_ENDPOINT = 'https://cusslab-api.leanspirited.workers.dev/survival-school/assess';

const CHARACTERS = {
  ray:     { name: 'Ray Mears',      role: 'Bushcraft',         av: 'RM', avClass: 'av-green' },
  bear:    { name: 'Bear Grylls',    role: 'Former SAS',        av: 'BG', avClass: 'av-bark'  },
  hales:   { name: 'Les Hiddins',      role: 'Bush Tucker Man',   av: 'LH', avClass: 'av-amber' },
  packham: { name: 'Chris Packham',  role: 'Conservation',      av: 'CP', avClass: 'av-green' },
  irwin:   { name: 'Steve Irwin',    role: 'Crocodile Hunter',  av: 'SI', avClass: 'av-amber' },
  stevens: { name: 'Austin Stevens', role: 'Snake Master',      av: 'AS', avClass: 'av-bark'  },
  darwin:  { name: 'Charles Darwin', role: 'Naturalist',        av: 'CD', avClass: 'av-gray'  }
};

const SYSTEM_PROMPT = \`You are the Survival School WILL YOU EAT IT? panel. The user has found an item and wants to know if it is edible.

=== RAY MEARS ===
Plant Knowledge 88, Bushcraft 30+ years. Identifies items correctly using binomial nomenclature when confident.
Will eat IF properly identified and safely prepared — specifies exactly how. "Needs boiling for 20 minutes to neutralise toxins." Won't eat it raw if preparation is required.
Brief. Clinical. Never dramatic. Silence about Bear's food choices is eloquent.

=== BEAR GRYLLS ===
Former SAS. Drinks own urine when Londis is forty yards away. Has eaten things he genuinely did not need to eat and got ill.
Will eat it. Without question. Has eaten something like it, abroad, fine in the end. Fact-check footnote fires on factual claims about edibility. Uses "Hydration?" unprompted.

=== LES HIDDINS ===
Bush Tucker Man. Vietnam veteran. Walked 2,500km of remote northern Australia cataloguing food sources.
Witchetty grubs taste like almonds raw, roast chicken cooked. He says this as curriculum, not novelty.
ALWAYS EATS IT — with educational context, not bravado. "Have a look at this." is his opener.
Cites Aboriginal knowledge without fail: "The Aboriginal people have been eating this for 40,000 years."
"Not too bad — a bit starchy." is his highest food compliment. "She'll be right." is a complete preparation method.
2-3 sentences. Calm. Understated. Genuinely interested in the organism.

=== CHRIS PACKHAM ===
Wildlife presenter, conservationist, neurodivergent (openly autistic). Rapid, precise, pattern-recognition.
Primary response: where was this sourced? Is it protected? What is the local population pressure?
Edibility is secondary. Sourcing is primary. Will not endorse foraging of protected or vulnerable species regardless of survival context.
"Fascinating" means he is disturbed. "Interesting" means he is furious. Genuinely excited by the organism's biology before the food question.
will_eat: null — he asks questions, he does not commit.

=== STEVE IRWIN ===
The Crocodile Hunter. Died 4 September 2006, stingray barb, Great Barrier Reef. In panel-world: alive.
First instinct: pick it up. Always. Before the edibility question. Has already grabbed it.
Boundless energy. Genuine love for every organism. "CRIKEY!" is structural not decorative.
"She's a beauty!" — the item is always beautiful. The food question comes second to the appreciation.
will_eat: true. He will eat it. With enthusiasm.

=== AUSTIN STEVENS ===
Snake Master. 107 days in a cage with 36 venomous snakes. Got bitten on day 96. Completed the 107 days.
Only engaged if the item might be near snakes or is venomous. If found under rocks, in leaf litter, or in tropical locations: checks for nearby snakes first. Every time.
If no snake involved: "Very well." Brief. Slightly disappointed. Returns to his thoughts.
will_eat: false. He is not here for the food.

=== CHARLES DARWIN ===
HMS Beagle, Galapagos. On the Origin of Species, 1859. Ate everything he encountered on the voyage — owls, tortoises, pumas, iguanas, a rhea he had eaten before realising it was a new species.
Uses Latin binomial nomenclature. Always has. Describes flavour and texture with scientific detachment.
Journal always cited. "I consumed a specimen of this genus in the Galapagos in 1835 and found the flavour acceptable, though the texture was somewhat resistant."
will_eat: true. Curiosity outweighs caution.

ATTENBOROUGH BOOKENDS — does NOT appear in panel array.
- attenborough_opening: introduces the item as natural history subject. Describes its ecological role, lifecycle, or evolutionary context. One sentence.
- attenborough_verdict: geological calm. One sentence. No appeal.

PANEL ORDER: Ray, Bear, Hales, Packham, Irwin, Stevens, Darwin.

OUTPUT — valid JSON only, no markdown:
{"item_identified":"<common name (scientific name if known)>","edibility_verdict":"edible|not_edible|conditional|unknown","attenborough_opening":"<one sentence, natural history intro>","panel":[{"charId":"ray","text":"<2-3 sentences>","will_eat":<bool>,"fact_check":"<optional>"},{"charId":"bear","text":"<2-3 sentences>","will_eat":true,"fact_check":"<optional>"},{"charId":"hales","text":"<2-3 sentences, educational, cites Aboriginal knowledge>","will_eat":true},{"charId":"packham","text":"<2-3 sentences>","will_eat":null,"source_challenge":"<his specific sourcing question>"},{"charId":"irwin","text":"<2-3 sentences>","will_eat":true,"impulse":"<what he immediately did, one phrase>"},{"charId":"stevens","text":"<1-2 sentences>","will_eat":false},{"charId":"darwin","text":"<2-3 sentences>","will_eat":true,"journal_note":"<one sentence from his journal, verbatim style>"}],"attenborough_verdict":"<one sentence>"}\`;

let item = '';

function onChip(el, val) {
  document.querySelectorAll('#chips-item .chip').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  item = val;
  document.getElementById('item-input').value = val;
}

function onInput(val) {
  document.querySelectorAll('#chips-item .chip').forEach(c => c.classList.remove('sel'));
  item = val;
}

function onClear() {
  item = '';
  document.getElementById('item-input').value = '';
  document.querySelectorAll('#chips-item .chip').forEach(c => c.classList.remove('sel'));
  document.getElementById('results').classList.remove('show');
  document.getElementById('verdict-block').style.display = 'none';
  document.getElementById('loading').style.display = 'block';
  document.getElementById('loading').innerHTML = '<span>PANEL DELIBERATING</span><span class="dots"></span>';
  document.getElementById('cards-out').innerHTML = '';
  document.getElementById('verdict-banner').innerHTML = '';
  const opening = document.getElementById('att-opening');
  if (opening) { opening.style.display = 'none'; }
  const verdict = document.getElementById('att-verdict');
  if (verdict) { verdict.style.display = 'none'; verdict.classList.remove('visible'); }
  document.getElementById('btn-assess').disabled = false;
}

async function onAssess() {
  if (!item.trim()) { alert('Tell us what you found first.'); return; }
  document.getElementById('btn-assess').disabled = true;
  document.getElementById('results').classList.add('show');
  document.getElementById('loading').style.display = 'block';
  document.getElementById('loading').innerHTML = '<span>PANEL DELIBERATING</span><span class="dots"></span>';
  document.getElementById('verdict-block').style.display = 'none';

  try {
    const resp = await fetch(WORKER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: SYSTEM_PROMPT, situation: \`ITEM FOUND: \${item}\` })
    });
    if (!resp.ok) throw new Error('Worker ' + resp.status);
    const data = await resp.json();
    renderResults(data);
  } catch (e) {
    document.getElementById('loading').innerHTML =
      '<span style="color:var(--blood)">Panel unavailable. They are probably eating something.</span>';
  } finally {
    document.getElementById('btn-assess').disabled = false;
  }
}

function renderResults(data) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('verdict-block').style.display = 'block';

  const openingEl = document.getElementById('att-opening');
  if (openingEl && data.attenborough_opening) {
    openingEl.querySelector('.att-text').textContent = data.attenborough_opening;
    openingEl.style.display = 'flex';
  }

  const banner = document.getElementById('verdict-banner');
  const v = data.edibility_verdict || 'unknown';
  const words = { edible: 'EAT IT', not_edible: 'DO NOT EAT', conditional: 'DEPENDS', unknown: 'UNCLEAR' };
  const cls   = { edible: 'eat',    not_edible: 'no',         conditional: 'conditional', unknown: 'conditional' };
  banner.innerHTML = \`
    <div class="verdict-banner">
      <div class="verdict-word \${cls[v]}">\${words[v]}</div>
      \${data.item_identified ? \`<div class="item-name">\${data.item_identified}</div>\` : ''}
    </div>\`;

  const container = document.getElementById('cards-out');
  container.innerHTML = '';

  (data.panel || []).forEach((r, i) => {
    const char = CHARACTERS[r.charId];
    if (!char) return;

    const willEat = r.will_eat;
    const cardCls = willEat === true ? 'eats' : willEat === false ? 'wont' : 'asks';
    const badgeLabel = willEat === true ? 'EATS IT' : willEat === false ? 'WILL NOT' : 'ASKS FIRST';
    const badgeCls   = willEat === true ? 'yes'     : willEat === false ? 'no'         : 'ask';

    const card = document.createElement('div');
    card.className = 'char-card ' + cardCls;
    card.style.opacity = '0';
    card.style.transform = 'translateY(7px)';
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    card.innerHTML = \`
      <div class="card-head">
        <div class="avatar \${char.avClass}">\${char.av}</div>
        <div>
          <div class="char-name">\${char.name}</div>
          <div class="char-role">\${char.role}</div>
        </div>
        <span class="eat-badge \${badgeCls}">\${badgeLabel}</span>
      </div>
      <div class="card-body">
        \${r.text}
        \${r.fact_check  ? \`<div class="fact-check">&#10033; \${r.fact_check}</div>\` : ''}
        \${r.source_challenge ? \`<div class="source-challenge">&#9658; \${r.source_challenge}</div>\` : ''}
        \${r.impulse     ? \`<div class="impulse-note">&#9651; \${r.impulse}</div>\` : ''}
        \${r.journal_note ? \`<div class="journal-note">"\${r.journal_note}"</div>\` : ''}
      </div>\`;

    container.appendChild(card);
    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 80 + i * 100);
  });

  if (data.attenborough_verdict) {
    const cardDelay = (data.panel?.length || 0) * 100 + 400;
    const verdictEl = document.getElementById('att-verdict');
    if (verdictEl) {
      setTimeout(() => {
        verdictEl.querySelector('.att-text').textContent = data.attenborough_verdict;
        verdictEl.style.display = 'flex';
        setTimeout(() => verdictEl.classList.add('visible'), 50);
      }, cardDelay);
    }
  }
}

document.getElementById('item-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') onAssess();
});
</script>

</body>
</html>
`;

const SURVIVAL_SCHOOL_FACT_CHECKER = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Bear Fact-Checker — Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f1209; --surface: #181d10; --surface2: #1e2514;
      --border: rgba(120,160,60,0.15); --border-strong: rgba(120,160,60,0.3);
      --green: #7aad3a; --green-dim: #4a7020; --green-bright: #a0d050;
      --amber: #BA7517; --amber-dim: #5c3a08;
      --bark: #8B6040; --bark-dim: #3d2008;
      --blood: #cc1111; --blood-dim: #3a0808;
      --blue-dim: #1a1e2a; --blue: #5a7aaa;
      --text: #e8edd8; --text-muted: #7a8a60;
    }
    body { font-family: 'Barlow', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
    #app { max-width: 680px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }

    .header { text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 0.5px solid var(--border); }
    .title { font-family: 'Bebas Neue', sans-serif; font-size: 40px; letter-spacing: 3px; line-height: 1; }
    .title span { color: var(--bark); }
    .subtitle { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); letter-spacing: 1.5px; margin-top: 5px; }

    .field-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; margin-top: 16px; }
    .field-label:first-child { margin-top: 0; }

    .chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
    .chip { font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 5px 10px; border: 0.5px solid var(--border-strong); border-radius: 5px; cursor: pointer; background: none; color: var(--text-muted); transition: all 0.15s; white-space: nowrap; user-select: none; }
    .chip:hover, .chip.sel { border-color: var(--bark); color: var(--bark); }

    textarea { width: 100%; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; padding: 9px 12px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: var(--surface); color: var(--text); outline: none; transition: border-color 0.15s; resize: vertical; min-height: 72px; line-height: 1.6; }
    textarea:focus { border-color: var(--bark); }

    .btn-row { display: flex; gap: 8px; margin-top: 14px; }
    .btn-check { flex: 1; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; padding: 11px; background: var(--bark-dim); color: var(--bark); border: 0.5px solid var(--bark-dim); border-radius: 6px; cursor: pointer; transition: opacity 0.15s; }
    .btn-check:hover { opacity: 0.88; }
    .btn-check:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-clear { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 1px; padding: 11px 16px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: none; cursor: pointer; color: var(--text-muted); transition: color 0.15s, border-color 0.15s; }
    .btn-clear:hover { color: var(--text); border-color: var(--green); }

    .results { display: none; margin-top: 1.5rem; }
    .results.show { display: block; }
    .loading { padding: 2rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--text-muted); letter-spacing: 1px; }
    .dots::after { content: ''; animation: dots 1.5s steps(3, end) infinite; }
    @keyframes dots { 0%{content:'.'} 33%{content:'..'} 66%{content:'...'} 100%{content:''} }

    .accuracy-block { margin-bottom: 1rem; }
    .accuracy-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
    .accuracy-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; }
    .accuracy-score { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 2px; line-height: 1; }
    .accuracy-track { height: 4px; background: var(--surface2); border-radius: 2px; overflow: hidden; }
    .accuracy-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }

    .verdict-badge { display: inline-block; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 2px; padding: 5px 14px; border-radius: 20px; margin-bottom: 1rem; text-transform: uppercase; }
    .vb-confirmed  { background: rgba(122,173,58,0.12); color: var(--green-bright); border: 0.5px solid var(--green-dim); }
    .vb-disputed   { background: rgba(186,117,23,0.1);  color: var(--amber);        border: 0.5px solid var(--amber-dim); }
    .vb-embellished{ background: rgba(139,96,64,0.12);  color: var(--bark);          border: 0.5px solid var(--bark-dim); }
    .vb-myth       { background: rgba(204,17,17,0.1);   color: var(--blood);         border: 0.5px solid var(--blood-dim); }

    .claim-display { font-family: 'Barlow', sans-serif; font-style: italic; font-size: 14px; line-height: 1.7; color: var(--text-muted); border-left: 3px solid var(--bark-dim); padding: 8px 12px; margin-bottom: 1rem; }
    .claim-display::before { content: '"'; } .claim-display::after { content: '"'; }

    .panel-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--text-muted); margin: 1rem 0 8px; }

    .char-card { border: 0.5px solid var(--border); border-radius: 10px; margin-bottom: 8px; overflow: hidden; background: var(--surface); }
    .card-head { display: flex; align-items: center; gap: 10px; padding: 9px 14px; background: var(--surface2); border-bottom: 0.5px solid var(--border); }
    .avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 11px; flex-shrink: 0; }
    .av-green { background: var(--green-dim);  color: var(--green-bright); }
    .av-bark  { background: var(--bark-dim);   color: var(--bark); }
    .av-amber { background: var(--amber-dim);  color: var(--amber); }
    .av-blue  { background: var(--blue-dim);   color: var(--blue); }
    .char-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; color: var(--text); }
    .char-role { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); }
    .card-body { padding: 11px 14px; font-family: 'Barlow', sans-serif; font-size: 14px; line-height: 1.7; color: var(--text); }
    .fact-check-note { margin-top: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); border-top: 0.5px solid var(--border); padding-top: 6px; opacity: 0.75; }

    .att-bookend { display: flex; gap: 10px; align-items: flex-start; padding: 10px 14px; background: var(--surface); border: 0.5px solid var(--border); border-radius: 8px; }
    .att-avatar { width: 26px; height: 26px; background: #1e1e1c; color: #7a8a70; border-radius: 50%; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
    .att-text { font-family: 'Barlow', sans-serif; font-weight: 300; font-style: italic; font-size: 14px; line-height: 1.7; color: var(--text-muted); }
    #att-opening { margin-bottom: 12px; }
    #att-verdict { margin-top: 12px; opacity: 0; transition: opacity 0.8s ease; }
    #att-verdict.visible { opacity: 1; }

    .reset-row { margin-top: 1rem; text-align: center; }
    .btn-reset { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); background: none; border: 0.5px solid var(--border-strong); border-radius: 6px; padding: 7px 16px; cursor: pointer; letter-spacing: 1px; transition: all 0.15s; }
    .btn-reset:hover { color: var(--text); border-color: var(--green); }
  </style>
</head>
<body>
<div id="app">

  <div class="header">
    <div class="title">BEAR <span>FACT-CHECKER</span></div>
    <div class="subtitle">bear makes a claim. the panel responds. ray has notes.</div>
  </div>

  <div class="field-label">Famous Bear claims</div>
  <div class="chips" id="chips-claim">
    <div class="chip" onclick="onChip(this,'I once made fire using sunlight and a piece of ice in the Himalayas.')">ice lens fire</div>
    <div class="chip" onclick="onChip(this,'Drinking your own urine is a good survival strategy when water is scarce.')">urine hydration</div>
    <div class="chip" onclick="onChip(this,'You can survive by drinking the blood of a freshly caught fish.')">fish blood</div>
    <div class="chip" onclick="onChip(this,'Running in a zigzag is the best way to escape a crocodile.')">croc zigzag</div>
    <div class="chip" onclick="onChip(this,'I survived a night by sheltering inside a freshly killed camel.')">camel bivouac</div>
    <div class="chip" onclick="onChip(this,'Eating raw meat in the jungle gives you energy within minutes.')">raw meat energy</div>
    <div class="chip" onclick="onChip(this,'You should suck the venom out of a snake bite immediately.')">venom extraction</div>
    <div class="chip" onclick="onChip(this,'In an avalanche, spit to find which way is down.')">avalanche spit</div>
    <div class="chip" onclick="onChip(this,'Bear roughed it for 72 hours in the Highlands with nothing but a knife and his instincts. He was not seen at a nearby Travelodge at any point.')">72 hours in the Highlands</div>
  </div>

  <div class="field-label" style="margin-top:12px">Or enter a Bear claim</div>
  <textarea id="claim-input" placeholder="Bear said something. Describe it exactly..."></textarea>

  <div class="btn-row">
    <button class="btn-check" id="btn-check" onclick="onCheck()">FACT-CHECK THIS ↗</button>
    <button class="btn-clear" onclick="onClear()">CLEAR</button>
  </div>

  <div class="results" id="results">
    <div class="loading" id="loading">
      <span>RAY IS TAKING NOTES</span><span class="dots"></span>
    </div>
    <div id="result-block" style="display:none">
      <div class="att-bookend" id="att-opening" style="display:none">
        <div class="att-avatar">DA</div>
        <div class="att-text"></div>
      </div>
      <div id="accuracy-out"></div>
      <div id="claim-out"></div>
      <div class="panel-label">THE PANEL HAS REVIEWED THE EVIDENCE</div>
      <div id="cards-out"></div>
      <div class="att-bookend" id="att-verdict" style="display:none">
        <div class="att-avatar">DA</div>
        <div class="att-text"></div>
      </div>
      <div class="reset-row">
        <button class="btn-reset" onclick="onClear()">SUBMIT ANOTHER CLAIM</button>
      </div>
    </div>
  </div>

</div>

<script>
const WORKER_ENDPOINT = 'https://cusslab-api.leanspirited.workers.dev/survival-school/assess';

const CHARACTERS = {
  ray:    { name: 'Ray Mears',    role: 'Bushcraft',           av: 'RM', avClass: 'av-green' },
  bear:   { name: 'Bear Grylls',  role: 'Former SAS',          av: 'BG', avClass: 'av-bark'  },
  cody:   { name: 'Cody Lundin',  role: 'Primitive Skills',    av: 'CL', avClass: 'av-green'  },
  hales:  { name: 'Les Hiddins',  role: 'Bush Tucker Man',     av: 'LH', avClass: 'av-amber' },
  fox:    { name: 'Jason Fox',    role: 'Special Boat Service',av: 'JF', avClass: 'av-blue'  },
  stroud: { name: 'Les Stroud',   role: 'Survivorman',         av: 'LS', avClass: 'av-green' }
};

const SYSTEM_PROMPT = \`You are the Survival School BEAR FACT-CHECKER panel. A user has submitted a claim attributed to Bear Grylls. Assess its accuracy and respond in character.

=== RAY MEARS ===
Bushcraft, 30+ years. Dry, clinical, never dramatic. "Don't." is a complete sentence.
fact_check field is MANDATORY for Ray — he never misses. The correction should be brief, specific, and technically accurate. Never dismissive, just correct.
Main text: 2-3 sentences of polite, devastating understatement. Silence about Bear is eloquent.

=== BEAR GRYLLS ===
Former SAS. Drinks own urine when Londis is forty yards away.
Defends the claim completely. Has context. Has done it abroad. Fine in the end. Genuinely believes his version. Never concedes. Adds embellishment.
NO fact_check field — Bear is the subject, not the checker.
VOICE: Urgent, evangelical. Personal anecdote always. "That is exactly what kept me alive."

=== CODY LUNDIN ===
Aboriginal Living Skills School. Barefoot on glaciers. Threw fire supplies into a pool rather than demonstrate bad technique.
Gives the actual correct technique that was available and being ignored. "There was a better option. Right there." Specific.
Patient, quiet, certain. Never dramatic. Just correct.

=== LES HIDDINS ===
Bush Tucker Man. Has done the correct version, probably forty years ago in the Northern Territory.
Educational. Brief. Cites Aboriginal knowledge. "The Aboriginal people have been doing this correctly for 40,000 years."
"Have a look at this." is his opener. "Not too bad." is high praise. Understated. Never performs.

=== JASON FOX ===
Royal Marines, SBS. Tactical assessment. Would this work operationally? Flat delivery.
Warm but clinical. Swears naturally, matter-of-fact. "That'd get you killed." or grudging respect if surprisingly correct.
Tactical reframe: could you actually rely on this in the field?

=== LES STROUD ===
Survivorman. Alone, no crew, films himself. Quiet. Genuine. Has tried the correct version, on camera, alone.
One sentence verdict. "That didn't work." means it didn't work. Slightly melancholy about the whole thing.

=== ATTENBOROUGH BOOKENDS ===
Does NOT appear in the panel array. Bookends the assessment.
attenborough_opening: introduces the claim as a natural history specimen — Bear's claim as an organism under scientific scrutiny. One sentence.
attenborough_verdict: geological calm. Whether the claim survives scrutiny. No appeal. One sentence.

accuracy_score: integer 0–100.
  0 = complete fiction, dangerous if followed.
  50 = contains a grain of truth buried under performance and embellishment.
  100 = technically, irritatingly, correct.

verdict: exactly one of: CONFIRMED / DISPUTED / EMBELLISHED / MYTH

OUTPUT — valid JSON only, no markdown:
{"claim":"<the claim as submitted>","accuracy_score":<integer 0-100>,"verdict":"CONFIRMED|DISPUTED|EMBELLISHED|MYTH","attenborough_opening":"<one sentence, introduces Bear's claim as specimen under scrutiny>","panel":[{"charId":"ray","text":"<2-3 sentences>","fact_check":"<mandatory — Ray's correction, specific and brief>"},{"charId":"bear","text":"<2-3 sentences, defends the claim completely>"},{"charId":"cody","text":"<2-3 sentences, the correct technique that was available>"},{"charId":"hales","text":"<2-3 sentences, educational, cites Aboriginal knowledge where relevant>"},{"charId":"fox","text":"<2-3 sentences, tactical operational assessment>"},{"charId":"stroud","text":"<1-2 sentences, quiet verdict>"}],"attenborough_verdict":"<one sentence, geological calm>"}\`;

let claim = '';

function onChip(el, val) {
  document.querySelectorAll('#chips-claim .chip').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  claim = val;
  document.getElementById('claim-input').value = val;
}

function onClear() {
  claim = '';
  document.getElementById('claim-input').value = '';
  document.querySelectorAll('#chips-claim .chip').forEach(c => c.classList.remove('sel'));
  document.getElementById('results').classList.remove('show');
  document.getElementById('result-block').style.display = 'none';
  document.getElementById('loading').style.display = 'block';
  document.getElementById('loading').innerHTML = '<span>RAY IS TAKING NOTES</span><span class="dots"></span>';
  document.getElementById('cards-out').innerHTML = '';
  document.getElementById('accuracy-out').innerHTML = '';
  document.getElementById('claim-out').innerHTML = '';
  const opening = document.getElementById('att-opening');
  if (opening) { opening.style.display = 'none'; }
  const verdict = document.getElementById('att-verdict');
  if (verdict) { verdict.style.display = 'none'; verdict.classList.remove('visible'); }
  document.getElementById('btn-check').disabled = false;
}

async function onCheck() {
  claim = document.getElementById('claim-input').value.trim() || claim;
  if (!claim) { alert('Enter a Bear claim first.'); return; }
  document.getElementById('btn-check').disabled = true;
  document.getElementById('results').classList.add('show');
  document.getElementById('loading').style.display = 'block';
  document.getElementById('loading').innerHTML = '<span>RAY IS TAKING NOTES</span><span class="dots"></span>';
  document.getElementById('result-block').style.display = 'none';

  try {
    const resp = await fetch(WORKER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: SYSTEM_PROMPT, situation: \`CLAIM SUBMITTED: \${claim}\` })
    });
    if (!resp.ok) throw new Error('Worker ' + resp.status);
    const data = await resp.json();
    renderResults(data);
  } catch (e) {
    document.getElementById('loading').innerHTML =
      '<span style="color:var(--blood)">Panel unavailable. Ray is still writing.</span>';
  } finally {
    document.getElementById('btn-check').disabled = false;
  }
}

function accuracyColor(score) {
  if (score >= 80) return 'var(--green)';
  if (score >= 50) return 'var(--amber)';
  if (score >= 25) return 'var(--bark)';
  return 'var(--blood)';
}

function verdictClass(v) {
  return { CONFIRMED: 'vb-confirmed', DISPUTED: 'vb-disputed', EMBELLISHED: 'vb-embellished', MYTH: 'vb-myth' }[v] || 'vb-disputed';
}

function renderResults(data) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('result-block').style.display = 'block';

  const openingEl = document.getElementById('att-opening');
  if (openingEl && data.attenborough_opening) {
    openingEl.querySelector('.att-text').textContent = data.attenborough_opening;
    openingEl.style.display = 'flex';
  }

  const score = typeof data.accuracy_score === 'number' ? data.accuracy_score : 50;
  const color = accuracyColor(score);
  document.getElementById('accuracy-out').innerHTML = \`
    <div class="accuracy-block">
      <div class="accuracy-header">
        <span class="accuracy-label">Accuracy score</span>
        <span class="accuracy-score" style="color:\${color}">\${score}</span>
      </div>
      <div class="accuracy-track">
        <div class="accuracy-fill" style="width:\${score}%;background:\${color}"></div>
      </div>
      <div style="margin-top:8px">
        <span class="verdict-badge \${verdictClass(data.verdict)}">\${data.verdict || 'DISPUTED'}</span>
      </div>
    </div>\`;

  if (data.claim) {
    document.getElementById('claim-out').innerHTML =
      \`<div class="claim-display">\${data.claim}</div>\`;
  }

  const container = document.getElementById('cards-out');
  container.innerHTML = '';
  (data.panel || []).forEach((r, i) => {
    const char = CHARACTERS[r.charId];
    if (!char) return;
    const card = document.createElement('div');
    card.className = 'char-card';
    card.style.cssText = 'opacity:0;transform:translateY(7px);transition:opacity 0.3s ease,transform 0.3s ease;';
    card.innerHTML = \`
      <div class="card-head">
        <div class="avatar \${char.avClass}">\${char.av}</div>
        <div>
          <div class="char-name">\${char.name}</div>
          <div class="char-role">\${char.role}</div>
        </div>
      </div>
      <div class="card-body">
        \${r.text}
        \${r.fact_check ? \`<div class="fact-check-note">&#10033; \${r.fact_check}</div>\` : ''}
      </div>\`;
    container.appendChild(card);
    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 80 + i * 100);
  });

  if (data.attenborough_verdict) {
    const cardDelay = (data.panel?.length || 0) * 100 + 400;
    const verdictEl = document.getElementById('att-verdict');
    if (verdictEl) {
      setTimeout(() => {
        verdictEl.querySelector('.att-text').textContent = data.attenborough_verdict;
        verdictEl.style.display = 'flex';
        setTimeout(() => verdictEl.classList.add('visible'), 50);
      }, cardDelay);
    }
  }
}

document.getElementById('claim-input').addEventListener('input', e => {
  document.querySelectorAll('#chips-claim .chip').forEach(c => c.classList.remove('sel'));
  claim = e.target.value;
});
document.getElementById('claim-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onCheck(); }
});
</script>

</body>
</html>
`;

const SURVIVAL_SCHOOL_COYOTE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>The Coyote Index — Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f1209; --surface: #181d10; --surface2: #1e2514;
      --border: rgba(120,160,60,0.15); --border-strong: rgba(120,160,60,0.3);
      --green: #7aad3a; --green-dim: #4a7020; --green-bright: #a0d050;
      --amber: #BA7517; --amber-dim: #5c3a08;
      --bark: #8B6040; --bark-dim: #3d2008;
      --blood: #cc1111; --blood-dim: #3a0808;
      --blue-dim: #1a1e2a; --blue: #5a7aaa;
      --text: #e8edd8; --text-muted: #7a8a60;
    }
    body { font-family: 'Barlow', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
    #app { max-width: 680px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }

    .header { text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 0.5px solid var(--border); }
    .title { font-family: 'Bebas Neue', sans-serif; font-size: 40px; letter-spacing: 3px; line-height: 1; }
    .title span { color: var(--amber); }
    .subtitle { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); letter-spacing: 1.5px; margin-top: 5px; }

    .field-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; margin-top: 16px; }

    .chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
    .chip { font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 5px 10px; border: 0.5px solid var(--border-strong); border-radius: 5px; cursor: pointer; background: none; color: var(--text-muted); transition: all 0.15s; white-space: nowrap; user-select: none; }
    .chip:hover, .chip.sel { border-color: var(--amber); color: var(--amber); }

    textarea { width: 100%; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; padding: 9px 12px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: var(--surface); color: var(--text); outline: none; transition: border-color 0.15s; resize: vertical; min-height: 72px; line-height: 1.6; }
    textarea:focus { border-color: var(--amber); }

    .btn-row { display: flex; gap: 8px; margin-top: 14px; }
    .btn-rate { flex: 1; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; padding: 11px; background: var(--amber-dim); color: var(--amber); border: 0.5px solid var(--amber-dim); border-radius: 6px; cursor: pointer; transition: opacity 0.15s; }
    .btn-rate:hover { opacity: 0.88; }
    .btn-rate:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-clear { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 1px; padding: 11px 16px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: none; cursor: pointer; color: var(--text-muted); transition: color 0.15s, border-color 0.15s; }
    .btn-clear:hover { color: var(--text); border-color: var(--amber); }

    .results { display: none; margin-top: 1.5rem; }
    .results.show { display: block; }
    .loading { padding: 2rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--text-muted); letter-spacing: 1px; }
    .dots::after { content: ''; animation: dots 1.5s steps(3, end) infinite; }
    @keyframes dots { 0%{content:'.'} 33%{content:'..'} 66%{content:'...'} 100%{content:''} }

    .rating-block { margin-bottom: 1.2rem; }
    .rating-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
    .rating-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; }
    .rating-number { font-family: 'Bebas Neue', sans-serif; font-size: 52px; letter-spacing: 2px; line-height: 1; color: var(--amber); }
    .rating-track { height: 4px; background: var(--surface2); border-radius: 2px; overflow: hidden; margin-bottom: 8px; }
    .rating-fill { height: 100%; border-radius: 2px; background: var(--amber); transition: width 0.6s ease; }
    .rating-scale { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); display: flex; justify-content: space-between; }

    .coyote-assessment { font-family: 'Barlow', sans-serif; font-size: 14px; line-height: 1.7; color: var(--text); padding: 10px 14px; background: var(--surface); border: 0.5px solid var(--border); border-radius: 8px; margin-bottom: 10px; }
    .anecdote-block { padding: 10px 14px; border-left: 2px solid var(--amber-dim); margin-bottom: 1rem; }
    .anecdote-direction { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--amber); text-transform: uppercase; margin-bottom: 4px; }
    .anecdote-text { font-family: 'Barlow', sans-serif; font-size: 14px; line-height: 1.7; color: var(--text-muted); font-style: italic; }
    .anecdote-rating { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--amber); margin-top: 4px; }

    .panel-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--text-muted); margin: 1rem 0 8px; }
    .char-card { border: 0.5px solid var(--border); border-radius: 10px; margin-bottom: 8px; overflow: hidden; background: var(--surface); }
    .card-head { display: flex; align-items: center; gap: 10px; padding: 9px 14px; background: var(--surface2); border-bottom: 0.5px solid var(--border); }
    .avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 11px; flex-shrink: 0; }
    .av-green { background: var(--green-dim);  color: var(--green-bright); }
    .av-amber { background: var(--amber-dim);  color: var(--amber); }
    .av-bark  { background: var(--bark-dim);   color: var(--bark); }
    .av-blue  { background: var(--blue-dim);   color: var(--blue); }
    .char-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; color: var(--text); }
    .char-role { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); }
    .card-body { padding: 11px 14px; font-family: 'Barlow', sans-serif; font-size: 14px; line-height: 1.7; color: var(--text); }

    .att-bookend { display: flex; gap: 10px; align-items: flex-start; padding: 10px 14px; background: var(--surface); border: 0.5px solid var(--border); border-radius: 8px; }
    .att-avatar { width: 26px; height: 26px; background: #1e1e1c; color: #7a8a70; border-radius: 50%; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
    .att-text { font-family: 'Barlow', sans-serif; font-weight: 300; font-style: italic; font-size: 14px; line-height: 1.7; color: var(--text-muted); }
    #att-verdict { margin-top: 12px; opacity: 0; transition: opacity 0.8s ease; }
    #att-verdict.visible { opacity: 1; }

    .reset-row { margin-top: 1rem; text-align: center; }
    .btn-reset { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); background: none; border: 0.5px solid var(--border-strong); border-radius: 6px; padding: 7px 16px; cursor: pointer; letter-spacing: 1px; transition: all 0.15s; }
    .btn-reset:hover { color: var(--text); border-color: var(--amber); }
  </style>
</head>
<body>
<div id="app">

  <div class="header">
    <div class="title">THE <span>COYOTE</span> INDEX</div>
    <div class="subtitle">describe your pain. coyote assigns a number. context provided.</div>
  </div>

  <div class="field-label">Common incidents (select or describe your own)</div>
  <div class="chips" id="chips-incident">
    <div class="chip" onclick="onChip(this,'shin struck by shopping trolley in Sainsbury\\'s, Saturday afternoon, no apology given')">trolley to shin</div>
    <div class="chip" onclick="onChip(this,'paper cut from cardboard box edge, not paper — the deceptive kind')">cardboard cut</div>
    <div class="chip" onclick="onChip(this,'stepped on Lego barefoot, 3am, trying not to wake anyone')">Lego, 3am</div>
    <div class="chip" onclick="onChip(this,'stubbed little toe on bed corner, full speed, unexpected')">bed corner, little toe</div>
    <div class="chip" onclick="onChip(this,'eating something described as mild on the menu')">mild (it was not mild)</div>
    <div class="chip" onclick="onChip(this,'bee sting, forearm, unprovoked')">bee sting</div>
    <div class="chip" onclick="onChip(this,'jellyfish sting, leg, holiday, shallow water')">jellyfish, holiday</div>
    <div class="chip" onclick="onChip(this,'waxing — any area')">waxing</div>
    <div class="chip" onclick="onChip(this,'dental filling without full anaesthetic, dentist says it\\'s fine')">filling, insufficient anaesthetic</div>
    <div class="chip" onclick="onChip(this,'bitten by bullet ant, Paraponera clavata, deliberately')">bullet ant (reference)</div>
  </div>

  <div class="field-label" style="margin-top:12px">Or describe your incident</div>
  <textarea id="incident-input" placeholder="Describe what happened. Be specific. Coyote will be."></textarea>

  <div class="btn-row">
    <button class="btn-rate" id="btn-rate" onclick="onRate()">RATE IT ↗</button>
    <button class="btn-clear" onclick="onClear()">CLEAR</button>
  </div>

  <div class="results" id="results">
    <div class="loading" id="loading">
      <span>COYOTE IS CONSULTING HIS FIELD NOTES</span><span class="dots"></span>
    </div>
    <div id="result-block" style="display:none">
      <div id="rating-out"></div>
      <div class="panel-label">THE PANEL HAS OBSERVED THIS INCIDENT</div>
      <div id="cards-out"></div>
      <div class="att-bookend" id="att-verdict" style="display:none">
        <div class="att-avatar">DA</div>
        <div class="att-text"></div>
      </div>
      <div class="reset-row">
        <button class="btn-reset" onclick="onClear()">SUBMIT ANOTHER INCIDENT</button>
      </div>
    </div>
  </div>

</div>

<script>
const WORKER_ENDPOINT = 'https://cusslab-api.leanspirited.workers.dev/survival-school/coyote';

const CHARACTERS = {
  ray:    { name: 'Ray Mears',       role: 'Bushcraft',            av: 'RM', avClass: 'av-green' },
  bear:   { name: 'Bear Grylls',     role: 'Former SAS',           av: 'BG', avClass: 'av-bark'  },
  cody:   { name: 'Cody Lundin',     role: 'Primitive Skills',     av: 'CL', avClass: 'av-green' },
  hales:  { name: 'Les Hiddins',     role: 'Bush Tucker Man',      av: 'LH', avClass: 'av-amber' },
  stroud: { name: 'Les Stroud',      role: 'Survivorman',          av: 'LS', avClass: 'av-green' },
  coyote: { name: 'Coyote Peterson', role: 'Brave Wilderness',     av: 'CP', avClass: 'av-amber' },
};

const SYSTEM_PROMPT = \`You are Coyote Peterson and the Survival School panel. A user has described a painful incident. Coyote rates it on his personal pain scale (derived from the Schmidt Sting Pain Index) and provides a comparison from his own field work — which may be significantly more extreme (mismatch that destroys the user's claim to suffering) or surprisingly less extreme (mismatch that validates it). The direction alternates unpredictably. Both are delivered with identical clinical enthusiasm.

=== COYOTE PETERSON ===
YouTube: Brave Wilderness. Has been stung/bitten deliberately by bullet ant (4.0), executioner wasp (4.5+), Gila monster, tarantula hawk, and many others. Maintains a personal pain scale with decimal precision.
RATING: A number 0.0–5.0. One decimal place. Always precise. The bullet ant is 4.0 — "pure, intense, brilliant pain, like walking over flaming charcoal with a 3-inch nail embedded in your heel."
ASSESSMENT: 2-3 sentences. Clinical, enthusiastic. Treats the incident as a valuable data point.
ANECDOTE: 2-3 sentences. A specific incident from his field work. Either significantly more extreme (higher rating — he has experienced far worse, user's suffering is negligible) OR surprisingly less extreme (lower rating — he has logged something far more trivial and it still got a number). He is equally enthusiastic about both. He ALWAYS respects the animal or object involved. Even the trolley.
anecdote_direction: "higher" if his comparison is worse than the user's incident. "lower" if it is less severe.
anecdote_rating: the numeric rating of his comparison incident.

=== RAY MEARS ===
Notes the physiological response with clinical accuracy. One sentence. Dry. Does not sympathise. Does not dismiss.

=== BEAR GRYLLS ===
Has experienced something comparable or worse. Possibly self-inflicted. Possibly abroad. Fine in the end. 1-2 sentences. Never concedes the user's version was worse.

=== CODY LUNDIN ===
Barefoot, always. Has an opinion on footwear that is tangentially relevant. Quiet, certain, one observation.

=== LES HIDDINS ===
The Aboriginal people have context for this. Brief. Educational. Has encountered something similar in the Northern Territory.

=== LES STROUD ===
One sentence. Quiet verdict. Slightly melancholy. Has documented something comparable, alone, on camera.

=== ATTENBOROUGH ===
Does NOT appear in panel array. attenborough_verdict only: one sentence, nature documentary register, closes everything. He has observed this before.

OUTPUT — valid JSON only, no markdown, no prose:
{"rating":<number 0.0-5.0, one decimal>,"coyote_assessment":"<2-3 sentences, clinical and enthusiastic>","coyote_anecdote":"<2-3 sentences, specific field incident, match or mismatch>","anecdote_rating":<number 0.0-5.0>,"anecdote_direction":"higher|lower","panel":[{"charId":"ray","text":"<1-2 sentences>"},{"charId":"bear","text":"<1-2 sentences>"},{"charId":"cody","text":"<1-2 sentences>"},{"charId":"hales","text":"<1-2 sentences>"},{"charId":"stroud","text":"<1 sentence>"}],"attenborough_verdict":"<one sentence, geological calm>"}\`;

const State = {
  incident: '',
  setIncident(v) { this.incident = v; },
  clear() { this.incident = ''; },
};

const UI = {
  showLoading() {
    document.getElementById('results').classList.add('show');
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result-block').style.display = 'none';
  },
  showResults() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('result-block').style.display = 'block';
  },
  showError(msg) {
    document.getElementById('loading').innerHTML = \`<span style="color:var(--blood)">\${msg}</span>\`;
  },
  setButtonState(disabled) {
    document.getElementById('btn-rate').disabled = disabled;
  },
  clear() {
    document.getElementById('incident-input').value = '';
    document.querySelectorAll('#chips-incident .chip').forEach(c => c.classList.remove('sel'));
    document.getElementById('results').classList.remove('show');
    document.getElementById('result-block').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('loading').innerHTML = '<span>COYOTE IS CONSULTING HIS FIELD NOTES</span><span class="dots"></span>';
    document.getElementById('rating-out').innerHTML = '';
    document.getElementById('cards-out').innerHTML = '';
    const verdict = document.getElementById('att-verdict');
    if (verdict) { verdict.style.display = 'none'; verdict.classList.remove('visible'); }
  },
};

const API = {
  async rate(incident) {
    const resp = await fetch(WORKER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: SYSTEM_PROMPT, incident }),
    });
    if (!resp.ok) throw new Error('Worker ' + resp.status);
    return resp.json();
  },
};

function ratingColor(r) {
  if (r >= 4) return 'var(--blood)';
  if (r >= 3) return 'var(--amber)';
  if (r >= 2) return 'var(--bark)';
  return 'var(--green)';
}

function renderResults(data) {
  UI.showResults();

  const r = typeof data.rating === 'number' ? data.rating : 0;
  const color = ratingColor(r);
  document.getElementById('rating-out').innerHTML = \`
    <div class="rating-block">
      <div class="rating-header">
        <span class="rating-label">Coyote Index Rating</span>
        <span class="rating-number" style="color:\${color}">\${r.toFixed(1)}</span>
      </div>
      <div class="rating-track"><div class="rating-fill" style="width:\${(r/5)*100}%;background:\${color}"></div></div>
      <div class="rating-scale"><span>0.0 — nothing</span><span>2.5 — notable</span><span>5.0 — legendary</span></div>
    </div>
    <div class="coyote-assessment">\${data.coyote_assessment || ''}</div>
    <div class="anecdote-block">
      <div class="anecdote-direction">\${data.anecdote_direction === 'higher' ? '▲ Coyote has experienced worse' : '▼ Coyote has experienced less'}</div>
      <div class="anecdote-text">\${data.coyote_anecdote || ''}</div>
      \${data.anecdote_rating != null ? \`<div class="anecdote-rating">His rating: \${Number(data.anecdote_rating).toFixed(1)}</div>\` : ''}
    </div>\`;

  const container = document.getElementById('cards-out');
  container.innerHTML = '';
  (data.panel || []).forEach((r, i) => {
    const char = CHARACTERS[r.charId];
    if (!char) return;
    const card = document.createElement('div');
    card.className = 'char-card';
    card.style.cssText = 'opacity:0;transform:translateY(7px);transition:opacity 0.3s ease,transform 0.3s ease;';
    card.innerHTML = \`
      <div class="card-head">
        <div class="avatar \${char.avClass}">\${char.av}</div>
        <div>
          <div class="char-name">\${char.name}</div>
          <div class="char-role">\${char.role}</div>
        </div>
      </div>
      <div class="card-body">\${r.text}</div>\`;
    container.appendChild(card);
    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 80 + i * 100);
  });

  if (data.attenborough_verdict) {
    const delay = (data.panel?.length || 0) * 100 + 400;
    const el = document.getElementById('att-verdict');
    if (el) {
      setTimeout(() => {
        el.querySelector('.att-text').textContent = data.attenborough_verdict;
        el.style.display = 'flex';
        setTimeout(() => el.classList.add('visible'), 50);
      }, delay);
    }
  }
}

function onChip(el, val) {
  document.querySelectorAll('#chips-incident .chip').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  State.setIncident(val);
  document.getElementById('incident-input').value = val;
}

function onClear() {
  State.clear();
  UI.clear();
  UI.setButtonState(false);
}

async function onRate() {
  const incident = document.getElementById('incident-input').value.trim() || State.incident;
  if (!incident) { alert('Describe an incident first.'); return; }
  State.setIncident(incident);
  UI.setButtonState(true);
  UI.showLoading();
  try {
    const data = await API.rate(incident);
    renderResults(data);
  } catch(e) {
    UI.showError('Coyote is unavailable. He may be in the sting zone.');
  } finally {
    UI.setButtonState(false);
  }
}

document.getElementById('incident-input').addEventListener('input', e => {
  document.querySelectorAll('#chips-incident .chip').forEach(c => c.classList.remove('sel'));
  State.setIncident(e.target.value);
});
document.getElementById('incident-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onRate(); }
});
</script>
</body>
</html>
`;

const SURVIVAL_SCHOOL_DEATHMATCH = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Animal Deathmatch — Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0f1209;
      --surface: #181d10;
      --surface2: #1e2514;
      --border: rgba(120,160,60,0.15);
      --border-strong: rgba(120,160,60,0.3);
      --green: #7aad3a;
      --green-dim: #4a7020;
      --green-bright: #a0d050;
      --amber: #BA7517;
      --amber-dim: #5c3a08;
      --bark: #8B6040;
      --bark-dim: #3d2008;
      --blood: #cc1111;
      --blood-dim: #3a0808;
      --text: #e8edd8;
      --text-muted: #7a8a60;
    }

    body { font-family: 'Barlow', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }

    #app { max-width: 700px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }

    /* ─ Header ─────────────────────────────────────────────────────────────── */
    .header { text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 0.5px solid var(--border); }
    .title { font-family: 'Bebas Neue', sans-serif; font-size: 40px; letter-spacing: 3px; line-height: 1; }
    .title span { color: var(--blood); }
    .subtitle { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); letter-spacing: 1.5px; margin-top: 5px; }

    /* ─ Category tabs ───────────────────────────────────────────────────────── */
    .field-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; margin-top: 16px; }

    .cat-tabs { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 10px; }
    .cat-tab { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1px; padding: 4px 10px; border: 0.5px solid var(--border-strong); border-radius: 20px; cursor: pointer; background: none; color: var(--text-muted); transition: all 0.12s; white-space: nowrap; }
    .cat-tab:hover { color: var(--text); border-color: var(--text-muted); }
    .cat-tab.active { background: var(--surface2); color: var(--green); border-color: var(--green-dim); }

    /* ─ VS layout ───────────────────────────────────────────────────────────── */
    .fight-row { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0; align-items: start; margin-bottom: 4px; }
    .fight-col { }
    .vs-col { display: flex; align-items: center; justify-content: center; padding: 0 12px; padding-top: 32px; }
    .vs-badge { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 2px; color: var(--blood); opacity: 0.7; }

    .side-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; }
    .side-label.focused { color: var(--green); }

    .chip-grid { display: flex; flex-wrap: wrap; gap: 4px; max-height: 140px; overflow-y: auto; margin-bottom: 6px; padding-right: 2px; scrollbar-width: thin; scrollbar-color: var(--border-strong) transparent; }
    .chip-grid::-webkit-scrollbar { width: 3px; }
    .chip-grid::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 2px; }

    .chip { font-family: 'IBM Plex Mono', monospace; font-size: 10px; padding: 4px 8px; border: 0.5px solid var(--border-strong); border-radius: 4px; cursor: pointer; background: none; color: var(--text-muted); transition: all 0.12s; white-space: nowrap; user-select: none; line-height: 1.3; }
    .chip:hover { border-color: var(--green); color: var(--green); }
    .chip.sel { border-color: var(--green); color: var(--green-bright); background: rgba(74,112,32,0.15); }
    .chip.hidden { display: none; }

    input[type="text"] { width: 100%; font-family: 'IBM Plex Mono', monospace; font-size: 13px; padding: 8px 10px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: var(--surface); color: var(--text); outline: none; transition: border-color 0.15s; }
    input[type="text"]:focus { border-color: var(--green); }
    input[type="text"].focused-input { border-color: var(--green-dim); }

    /* ─ Environment ─────────────────────────────────────────────────────────── */
    .env-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 4px; }
    .env-chip { font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 5px 10px; border: 0.5px solid var(--border-strong); border-radius: 5px; cursor: pointer; background: none; color: var(--text-muted); transition: all 0.12s; }
    .env-chip:hover, .env-chip.sel { border-color: var(--amber); color: var(--amber); }

    /* ─ Buttons ─────────────────────────────────────────────────────────────── */
    .btn-row { display: flex; gap: 8px; margin-top: 16px; }
    .btn-fight { flex: 1; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; padding: 11px; background: var(--blood-dim); color: var(--blood); border: 0.5px solid var(--blood-dim); border-radius: 6px; cursor: pointer; transition: opacity 0.15s; }
    .btn-fight:hover { opacity: 0.88; }
    .btn-fight:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-clear { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 1px; padding: 11px 16px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: none; cursor: pointer; color: var(--text-muted); transition: all 0.15s; }
    .btn-clear:hover { color: var(--text); border-color: var(--green); }

    /* ─ Loading ─────────────────────────────────────────────────────────────── */
    .results { display: none; margin-top: 1.5rem; }
    .results.show { display: block; }
    .loading { padding: 2rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--text-muted); letter-spacing: 1px; }
    .dots::after { content: ''; animation: dots 1.5s steps(3, end) infinite; }
    @keyframes dots { 0%{content:'.'} 33%{content:'..'} 66%{content:'...'} 100%{content:''} }

    /* ─ Phase labels ─────────────────────────────────────────────────────────── */
    .phase-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--text-muted); text-transform: uppercase; margin: 1.2rem 0 0.5rem; display: flex; align-items: center; gap: 8px; }
    .phase-pips { display: flex; gap: 4px; }
    .pip { width: 7px; height: 7px; border-radius: 50%; border: 0.5px solid var(--border-strong); background: transparent; }
    .pip.filled { background: var(--blood); border-color: var(--blood); }

    /* ─ Panel cards ──────────────────────────────────────────────────────────── */
    .char-card { border: 0.5px solid var(--border); border-radius: 10px; margin-bottom: 7px; overflow: hidden; background: var(--surface); }
    .card-head { display: flex; align-items: center; gap: 10px; padding: 8px 13px; background: var(--surface2); border-bottom: 0.5px solid var(--border); }
    .avatar { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.5px; flex-shrink: 0; }
    .av-green { background: var(--green-dim);  color: var(--green-bright); }
    .av-bark  { background: var(--bark-dim);   color: var(--bark); }
    .av-amber { background: var(--amber-dim);  color: var(--amber); }
    .av-sbs   { background: #1a1e2a;           color: #5a7aaa; }
    .char-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 13px; color: var(--text); }
    .char-role { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); }
    .card-body { padding: 10px 13px; font-family: 'Barlow', sans-serif; font-size: 13.5px; line-height: 1.7; color: var(--text); }
    .fact-check-note { margin-top: 5px; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: var(--text-muted); border-top: 0.5px solid var(--border); padding-top: 5px; opacity: 0.75; }

    /* ─ Round blocks ─────────────────────────────────────────────────────────── */
    .round-block { margin-bottom: 1rem; }

    .narrative-block { background: var(--surface); border: 0.5px solid var(--border); border-radius: 8px; padding: 14px; margin-bottom: 8px; font-family: 'Barlow', sans-serif; font-size: 14px; line-height: 1.8; color: var(--text); }

    .round-winner-badge { display: inline-block; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; padding: 5px 12px; border-radius: 20px; margin-bottom: 10px; text-transform: uppercase; }
    .rwb-a    { background: rgba(122,173,58,0.12);  color: var(--green-bright); border: 0.5px solid var(--green-dim); }
    .rwb-b    { background: rgba(204,17,17,0.1);    color: var(--blood);        border: 0.5px solid var(--blood-dim); }
    .rwb-draw { background: rgba(186,117,23,0.1);   color: var(--amber);        border: 0.5px solid var(--amber-dim); }

    /* ─ Winner banner ─────────────────────────────────────────────────────────── */
    .winner-banner { text-align: center; padding: 1.5rem 0 1rem; border-top: 0.5px solid var(--border); margin-top: 0.5rem; }
    .winner-animal { font-family: 'Bebas Neue', sans-serif; font-size: 50px; letter-spacing: 4px; line-height: 1; color: var(--blood); word-break: break-word; }
    .winner-animal.draw-text { color: var(--amber); }
    .winner-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--text-muted); margin-top: 4px; }
    .winner-score { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 2px; color: var(--text-muted); margin-top: 6px; }
    .margin-pill { display: inline-block; font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 1.5px; padding: 3px 9px; border-radius: 20px; margin-top: 6px; }
    .mp-decisive { background: rgba(204,17,17,0.1);  color: var(--blood); border: 0.5px solid var(--blood-dim); }
    .mp-close    { background: rgba(186,117,23,0.1); color: var(--amber); border: 0.5px solid var(--amber-dim); }
    .mp-contested{ background: rgba(122,138,96,0.1); color: var(--text-muted); border: 0.5px solid var(--border-strong); }

    /* ─ Attenborough bookends ─────────────────────────────────────────────────── */
    .att-bookend { display: flex; gap: 10px; align-items: flex-start; padding: 10px 13px; background: var(--surface); border: 0.5px solid var(--border); border-radius: 8px; }
    .att-avatar { width: 24px; height: 24px; background: #1e1e1c; color: #7a8a70; border-radius: 50%; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
    .att-text { font-family: 'Barlow', sans-serif; font-weight: 300; font-style: italic; font-size: 13.5px; line-height: 1.7; color: var(--text-muted); }
    #att-intro { margin-bottom: 12px; }
    #att-verdict { margin-top: 14px; opacity: 0; transition: opacity 0.8s ease; }
    #att-verdict.visible { opacity: 1; }

    /* ─ Stingray memorial ─────────────────────────────────────────────────────── */
    #stingray-memorial { display: none; margin-top: 1.5rem; }
    #stingray-memorial.show { display: block; }
    .memorial-header { text-align: center; padding: 2rem 0 1.5rem; border-bottom: 0.5px solid var(--border); margin-bottom: 1.5rem; }
    .memorial-symbol { font-size: 32px; margin-bottom: 0.75rem; opacity: 0.4; }
    .memorial-name { font-family: 'Bebas Neue', sans-serif; font-size: 30px; letter-spacing: 3px; color: var(--amber); }
    .memorial-dates { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); letter-spacing: 2px; margin-top: 5px; }
    .memorial-reason { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); letter-spacing: 1px; margin-top: 6px; opacity: 0.55; }

    /* ─ Reset ─────────────────────────────────────────────────────────────────── */
    .reset-row { margin-top: 1.2rem; text-align: center; }
    .btn-reset { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); background: none; border: 0.5px solid var(--border-strong); border-radius: 6px; padding: 7px 16px; cursor: pointer; letter-spacing: 1px; transition: all 0.15s; }
    .btn-reset:hover { color: var(--text); border-color: var(--green); }

    /* ─ Stat bars (SS-033) ────────────────────────────────────────────────────── */
    .stats-row { display: flex; gap: 8px; margin-top: 10px; }
    .stat-panel { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 8px 10px; min-height: 50px; }
    .stat-panel-name { font-family: 'IBM Plex Mono', monospace; font-size: 8px; color: var(--text-muted); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 5px; }
    .stat-bar-row { display: flex; align-items: center; gap: 5px; margin-bottom: 2px; }
    .stat-bar-label { font-family: 'IBM Plex Mono', monospace; font-size: 7px; color: var(--text-muted); width: 52px; flex-shrink: 0; text-transform: uppercase; }
    .stat-bar-track { flex: 1; height: 3px; background: var(--surface2); border-radius: 2px; overflow: hidden; }
    .stat-bar-fill { height: 100%; border-radius: 2px; }
    .s-lethal  { background: var(--blood); }
    .s-aggress { background: #BA7517; }
    .s-speed   { background: var(--green); }
    .stat-bar-val { font-family: 'IBM Plex Mono', monospace; font-size: 7px; color: var(--text-muted); width: 18px; text-align: right; }
    .stat-venom-tag { font-family: 'IBM Plex Mono', monospace; font-size: 7px; color: #BA7517; margin-top: 3px; }
  </style>
</head>
<body>
<div id="app">

  <div class="header">
    <div class="title">ANIMAL <span>DEATHMATCH</span></div>
    <div class="subtitle">three rounds. the panel adjudicates. nobody is safe.</div>
  </div>

  <!-- Category filter tabs -->
  <div class="field-label" style="margin-top:0">Animal category</div>
  <div class="cat-tabs" id="cat-tabs">
    <div class="cat-tab active" onclick="onCatTab(this,'all')">ALL</div>
    <div class="cat-tab" onclick="onCatTab(this,'land')">LAND</div>
    <div class="cat-tab" onclick="onCatTab(this,'aquatic')">AQUATIC</div>
    <div class="cat-tab" onclick="onCatTab(this,'aerial')">AERIAL</div>
    <div class="cat-tab" onclick="onCatTab(this,'small')">SMALL / VENOMOUS</div>
    <div class="cat-tab" onclick="onCatTab(this,'wildcard')">WILD CARD</div>
  </div>

  <!-- A vs B columns -->
  <div class="fight-row">
    <div class="fight-col">
      <div class="side-label" id="label-a">Animal A</div>
      <div class="chip-grid" id="chips-a"></div>
      <input type="text" id="input-a" placeholder="or type any animal..." autocomplete="off"/>
    </div>
    <div class="vs-col"><div class="vs-badge">VS</div></div>
    <div class="fight-col">
      <div class="side-label" id="label-b">Animal B</div>
      <div class="chip-grid" id="chips-b"></div>
      <input type="text" id="input-b" placeholder="or type any animal..." autocomplete="off"/>
    </div>
  </div>

  <!-- Stat bars — shown when DB animal selected (SS-033) -->
  <div class="stats-row" id="stats-row" style="display:none">
    <div class="stat-panel" id="stats-a"></div>
    <div class="stat-panel" id="stats-b"></div>
  </div>

  <!-- Environment -->
  <div class="field-label" style="margin-top:14px">Environment</div>
  <div class="env-chips" id="chips-env">
    <div class="env-chip" onclick="onEnv(this,'jungle')">jungle</div>
    <div class="env-chip" onclick="onEnv(this,'savannah')">savannah</div>
    <div class="env-chip" onclick="onEnv(this,'ocean')">ocean</div>
    <div class="env-chip" onclick="onEnv(this,'deep ocean')">deep ocean</div>
    <div class="env-chip" onclick="onEnv(this,'arctic')">arctic</div>
    <div class="env-chip" onclick="onEnv(this,'desert')">desert</div>
    <div class="env-chip" onclick="onEnv(this,'forest')">forest</div>
    <div class="env-chip" onclick="onEnv(this,'swamp')">swamp</div>
    <div class="env-chip" onclick="onEnv(this,'urban')">urban</div>
    <div class="env-chip" onclick="onEnv(this,'suburban garden')">suburban garden</div>
    <div class="env-chip" onclick="onEnv(this,'open water')">open water</div>
    <div class="env-chip" onclick="onEnv(this,'cave')">cave</div>
  </div>

  <div class="btn-row">
    <button class="btn-fight" id="btn-fight" onclick="onFight()">FIGHT — 3 ROUNDS ↗</button>
    <button class="btn-clear" onclick="onClear()">CLEAR</button>
  </div>

  <!-- Stingray Rule memorial -->
  <div id="stingray-memorial">
    <div class="memorial-header">
      <div class="memorial-symbol">〜</div>
      <div class="memorial-name">STEVE IRWIN</div>
      <div class="memorial-dates">22 FEBRUARY 1962 — 4 SEPTEMBER 2006</div>
      <div class="memorial-reason">Great Barrier Reef &middot; Stingray barb &middot; Age 44</div>
    </div>
    <div class="phase-label">The panel cannot proceed</div>
    <div id="memorial-cards"></div>
    <div class="att-bookend" id="att-memorial" style="display:none">
      <div class="att-avatar">DA</div>
      <div class="att-text"></div>
    </div>
    <div class="reset-row">
      <button class="btn-reset" onclick="onClear()">CHOOSE ANOTHER MATCHUP</button>
    </div>
  </div>

  <div class="results" id="results">
    <div class="loading" id="loading">
      <span>PANEL CONVENING</span><span class="dots"></span>
    </div>
    <div id="fight-block" style="display:none">
      <div class="att-bookend" id="att-intro" style="display:none">
        <div class="att-avatar">DA</div>
        <div class="att-text"></div>
      </div>
      <div class="phase-label">PRE-FIGHT ANALYSIS</div>
      <div id="prefight-cards"></div>
      <div id="rounds-out"></div>
      <div id="winner-out"></div>
      <div class="att-bookend" id="att-verdict" style="display:none">
        <div class="att-avatar">DA</div>
        <div class="att-text"></div>
      </div>
      <div class="reset-row">
        <button class="btn-reset" onclick="onClear()">ANOTHER FIGHT</button>
      </div>
    </div>
  </div>

</div>

<script>
const WORKER_ENDPOINT = 'https://cusslab-api.leanspirited.workers.dev/survival-school/assess';

// ─ Rich animal data (SS-031/033) ───────────────────────────────────────────────
const ANIMAL_DB = {
  'King cobra':                { lethality: 94, aggression: 72, speed: 65, size_kg: 9,     venom: 'neurotoxic',    death_mins: 30   },
  'Grizzly bear':              { lethality: 78, aggression: 62, speed: 72, size_kg: 272,   venom: null                              },
  'Great white shark':         { lethality: 72, aggression: 55, speed: 78, size_kg: 1100,  venom: null                              },
  'Brazilian wandering spider':{ lethality: 88, aggression: 92, speed: 42, size_kg: 0.006, venom: 'neurotoxic',    death_mins: 120  },
  'Spotted hyena':             { lethality: 60, aggression: 82, speed: 60, size_kg: 68,    venom: null                              },
  'Komodo dragon':             { lethality: 72, aggression: 65, speed: 35, size_kg: 70,    venom: 'hemotoxic',     death_mins: 4320 },
  'Cape buffalo':              { lethality: 68, aggression: 85, speed: 60, size_kg: 700,   venom: null                              },
  'Saltwater crocodile':       { lethality: 82, aggression: 88, speed: 32, size_kg: 450,   venom: null                              },
  'Siberian tiger':            { lethality: 80, aggression: 55, speed: 78, size_kg: 300,   venom: null                              },
  'Hippopotamus':              { lethality: 65, aggression: 92, speed: 50, size_kg: 1800,  venom: null                              },
  'Box jellyfish':             { lethality: 96, aggression: 8,  speed: 8,  size_kg: 2,     venom: 'cardiotoxic',   death_mins: 5    },
  'Blue-ringed octopus':       { lethality: 97, aggression: 30, speed: 12, size_kg: 0.08,  venom: 'tetrodotoxin',  death_mins: 20   },
  'Inland taipan':             { lethality: 98, aggression: 35, speed: 68, size_kg: 1.5,   venom: 'neurotoxic',    death_mins: 45   },
  'Polar bear':                { lethality: 85, aggression: 80, speed: 65, size_kg: 550,   venom: null                              },
  'Bull shark':                { lethality: 70, aggression: 82, speed: 72, size_kg: 230,   venom: null                              },
  'Honey badger':              { lethality: 28, aggression: 99, speed: 42, size_kg: 14,    venom: null                              },
  'Black mamba':               { lethality: 97, aggression: 88, speed: 82, size_kg: 1.6,   venom: 'neurotoxic',    death_mins: 20   },
  'Cassowary':                 { lethality: 55, aggression: 72, speed: 60, size_kg: 58,    venom: null                              },
  'Swan':                      { lethality: 5,  aggression: 95, speed: 25, size_kg: 12,    venom: null                              },
  'Wolverine':                 { lethality: 40, aggression: 96, speed: 48, size_kg: 18,    venom: null                              },
};

function lookupDB(name) {
  if (!name) return null;
  return ANIMAL_DB[name] || null;
}

// ─ Animal chip list ────────────────────────────────────────────────────────────
const ANIMALS = [
  // LAND — large
  { name: 'African elephant',   cat: 'land' },
  { name: 'White rhinoceros',   cat: 'land' },
  { name: 'Hippopotamus',       cat: 'land' },
  { name: 'Saltwater crocodile',cat: 'land' },
  { name: 'Nile crocodile',     cat: 'land' },
  { name: 'Siberian tiger',     cat: 'land' },
  { name: 'Lion',               cat: 'land' },
  { name: 'Leopard',            cat: 'land' },
  { name: 'Jaguar',             cat: 'land' },
  { name: 'Grizzly bear',       cat: 'land' },
  { name: 'Polar bear',         cat: 'land' },
  { name: 'Gorilla',            cat: 'land' },
  { name: 'Cape buffalo',       cat: 'land' },
  { name: 'Gaur',               cat: 'land' },
  { name: 'Moose',              cat: 'land' },
  { name: 'Giraffe',            cat: 'land' },
  { name: 'Grey wolf',          cat: 'land' },
  { name: 'Wolverine',          cat: 'land' },
  { name: 'Honey badger',       cat: 'land' },
  { name: 'Komodo dragon',      cat: 'land' },
  { name: 'Cassowary',          cat: 'land' },
  { name: 'Tasmanian devil',    cat: 'land' },
  { name: 'Chimpanzee',         cat: 'land' },
  { name: 'Spotted hyena',      cat: 'land' },
  { name: 'Nile monitor',       cat: 'land' },

  // AQUATIC
  { name: 'Great white shark',  cat: 'aquatic' },
  { name: 'Bull shark',         cat: 'aquatic' },
  { name: 'Tiger shark',        cat: 'aquatic' },
  { name: 'Orca',               cat: 'aquatic' },
  { name: 'Sperm whale',        cat: 'aquatic' },
  { name: 'Blue whale',         cat: 'aquatic' },
  { name: 'Giant Pacific octopus', cat: 'aquatic' },
  { name: 'Giant squid',        cat: 'aquatic' },
  { name: 'Colossal squid',     cat: 'aquatic' },
  { name: 'Mantis shrimp',      cat: 'aquatic' },
  { name: 'Pistol shrimp',      cat: 'aquatic' },
  { name: 'Electric eel',       cat: 'aquatic' },
  { name: 'Piranha school',     cat: 'aquatic' },
  { name: 'Goliath tigerfish',  cat: 'aquatic' },
  { name: 'Barracuda',          cat: 'aquatic' },
  { name: 'Humboldt squid',     cat: 'aquatic' },
  { name: 'Stonefish',          cat: 'aquatic' },
  { name: 'Pufferfish',         cat: 'aquatic' },
  { name: 'Moray eel',          cat: 'aquatic' },

  // AERIAL
  { name: 'Harpy eagle',        cat: 'aerial' },
  { name: 'Golden eagle',       cat: 'aerial' },
  { name: 'African crowned eagle', cat: 'aerial' },
  { name: 'Martial eagle',      cat: 'aerial' },
  { name: 'Peregrine falcon',   cat: 'aerial' },
  { name: 'Secretary bird',     cat: 'aerial' },
  { name: 'Shoebill stork',     cat: 'aerial' },
  { name: 'Great horned owl',   cat: 'aerial' },
  { name: 'Andean condor',      cat: 'aerial' },
  { name: 'Vampire bat',        cat: 'aerial' },
  { name: 'Wandering albatross',cat: 'aerial' },
  { name: 'Marabou stork',      cat: 'aerial' },
  { name: 'Lammergeier',        cat: 'aerial' },

  // SMALL / VENOMOUS
  { name: 'Bullet ant',         cat: 'small' },
  { name: 'Army ant swarm',     cat: 'small' },
  { name: 'Fire ant swarm',     cat: 'small' },
  { name: 'Deathstalker scorpion', cat: 'small' },
  { name: 'Emperor scorpion',   cat: 'small' },
  { name: 'Inland taipan',      cat: 'small' },
  { name: 'King cobra',         cat: 'small' },
  { name: 'Black mamba',        cat: 'small' },
  { name: 'Gaboon viper',       cat: 'small' },
  { name: 'Brazilian wandering spider', cat: 'small' },
  { name: 'Sydney funnel-web spider', cat: 'small' },
  { name: 'Blue-ringed octopus',cat: 'small' },
  { name: 'Irukandji jellyfish',cat: 'small' },
  { name: 'Box jellyfish',      cat: 'small' },
  { name: 'Cone snail',         cat: 'small' },
  { name: 'Mosquito',           cat: 'small' },
  { name: 'Honey bee swarm',    cat: 'small' },
  { name: 'Platypus',           cat: 'small' },
  { name: 'Tardigrade',         cat: 'small' },

  // WILD CARD — comedy mismatches
  { name: 'House cat',          cat: 'wildcard' },
  { name: 'Domestic labrador',  cat: 'wildcard' },
  { name: 'Toy poodle',         cat: 'wildcard' },
  { name: 'Corgi',              cat: 'wildcard' },
  { name: 'Hamster',            cat: 'wildcard' },
  { name: 'Gerbil',             cat: 'wildcard' },
  { name: 'Guinea pig',         cat: 'wildcard' },
  { name: 'Pigeon',             cat: 'wildcard' },
  { name: 'Canada goose',       cat: 'wildcard' },
  { name: 'Mallard duck',       cat: 'wildcard' },
  { name: 'Swan',               cat: 'wildcard' },
  { name: 'Emu',                cat: 'wildcard' },
  { name: 'Domestic chicken',   cat: 'wildcard' },
  { name: 'Hedgehog',           cat: 'wildcard' },
  { name: 'Raccoon',            cat: 'wildcard' },
  { name: 'European badger',    cat: 'wildcard' },
  { name: 'Goldfish',           cat: 'wildcard' },
  { name: 'Garden snail',       cat: 'wildcard' },
  { name: 'Rubber duck',        cat: 'wildcard' },
];

const CHARACTERS = {
  ray:  { name: 'Ray Mears',   role: 'Bushcraft',           av: 'RM', avClass: 'av-green' },
  bear: { name: 'Bear Grylls', role: 'Former SAS',          av: 'BG', avClass: 'av-bark'  },
  hales:{ name: 'Les Hiddins',   role: 'Bush Tucker Man',     av: 'LH', avClass: 'av-amber' },
  fox:  { name: 'Jason Fox',   role: 'Special Boat Service',av: 'JF', avClass: 'av-sbs'   }
};

const STINGRAY_MEMORIAL = {
  attenborough: \`In forty-four years, he touched more lives than most creatures encounter in a lifetime. The ocean keeps its own counsel about that morning. It always does.\`,
  cards: [
    { charId: 'ray',   text: \`Steve understood something most of us never do — that the most dangerous moments in nature are usually the ones you didn't see coming because you were too busy watching something else entirely. He was watching the stingray. The stingray wasn't watching him back. That's the only reason any of this was possible.\` },
    { charId: 'bear',  text: \`I've been in some proper situations out there and I'll tell you, the ones that get you are never the ones the camera's on. Steve knew that better than anyone. The man was the real thing. Genuinely. I've met plenty of people who say it. He actually was it. There's no match today, lads.\` },
    { charId: 'hales', text: \`Have a look at that. In forty-four years working in the most remote country on earth, I never met anyone who understood animals the way Steve did. The Aboriginal people have a word for that kind of knowledge — it takes generations to earn. Steve had it in one lifetime. She'll be right, mate.\` },
    { charId: 'fox',   text: \`Funniest part? He'd have absolutely gone back in the water the next day. That's not recklessness — that's the job. You assess the risk, you accept it, you go again. He did it every single time. Absolute pro. Different league. This one doesn't get scored.\` }
  ]
};

const SYSTEM_PROMPT = \`You are the Survival School ANIMAL DEATHMATCH panel. Two animals fight across THREE ROUNDS. The panel analyses each round as it plays out.

ROUND RULES:
- Each round is a discrete exchange: initiation, escalation, resolution.
- round_winner per round: "animal_a", "animal_b", or "draw".
- Winner of the match = 2+ rounds. Score format: "2-1", "3-0", "2-0" etc.
- If genuinely 1-1-1 after three rounds, overall winner is "draw".
- Biology, behaviour, environment determine outcomes. No narrative preference.

MISMATCH RULE — THIS IS CRITICAL:
If one animal wildly outclasses the other (e.g. hamster vs grizzly bear, goldfish vs orca, tardigrade vs lion), DO NOT skip the comedy. Run all three rounds with full commitment. The underdog may win Round 1 on sheer audacity, obstinacy, or opponent confusion. Round 2 usually restores order. Round 3 is where the real character emerges.
- Hamster vs Grizzly: Round 1 — hamster attacks. Bear doesn't process this as a threat. Hamster lands scoring blows uncontested.
- Tardigrade vs anything: can survive literally anything. Rounds are inconclusive until the panel admit the match cannot end.
- Rubber duck vs crocodile: Fox has a tactical breakdown prepared.
- Canada goose vs anything: goose has no fear. This must be acknowledged.

=== RAY MEARS ===
Ecological analysis. Anatomy, habitat advantage, evolutionary context, behavioural prediction. Clinical.
Pre-fight: methodical prediction. Round commentary: ecological debrief, measured.
VOICE: Brief, certain. "The \${'{animal}'} has evolved specifically for this." Silence more eloquent than anything about Bear.
fact_check optional: fires if he makes a specific claim worth annotating.

=== BEAR GRYLLS ===
Has encountered at least one of these animals. Has an anecdote. Gets facts wrong occasionally.
Pre-fight: confident prediction with personal anecdote. Round commentary: double-down or grudging acknowledgement.
fact_check field optional: add when Bear says something specific and dubious.
VOICE: Urgent, evangelical. "I once..." "Hydration?" unprompted. Never ironic about himself.

=== LES HIDDINS ===
Bush Tucker Man. Has eaten at least one of these animals. Has probably seen the other one from his Land Rover.
Pre-fight: picks a winner with a brief educational observation. Cites which animal Aboriginal people have deep knowledge of.
Round commentary: understatement. Treats the fight as practically interesting rather than dramatic.
VOICE: "Have a look at this." "Not too bad." "She'll be right." "The Aboriginal people knew this one well."
2-3 sentences in pre-fight, 1-2 sentences in commentary. Never shouts. Never performs. Matter-of-fact about extraordinary things.

=== JASON FOX ===
Tactical analysis: threat vector, kill mechanics, first-strike advantage, terrain exploitation.
Genuine warmth and self-deprecation. Finds the comedy in extraordinary competence colliding with absurd situations.
Pre-fight: tactical breakdown. Round commentary: debrief. Reacts to upsets with flat awe.
"Gobshite" is a technical term. Swears naturally. Flat delivery.
VOICE: Remarkable things delivered as admin. "She'd take the head off." Full stop.

ATTENBOROUGH BOOKENDS:
- attenborough_intro: one sentence, introduces the matchup as nature documentary. Sets the tone.
- attenborough_verdict: one sentence, geological calm. "The outcome was, as it nearly always is, determined long before either animal arrived." Never appeal.

OUTPUT — valid JSON only, no markdown:
{"animal_a":"<name as given>","animal_b":"<name as given>","environment":"<as given>","attenborough_intro":"<one sentence>","pre_fight":[{"charId":"ray","text":"<2-3 sentences>"},{"charId":"bear","text":"<2-3 sentences>","fact_check":"<optional>"},{"charId":"hales","text":"<2-3 sentences, understated, educational>"},{"charId":"fox","text":"<2-3 sentences>"}],"rounds":[{"number":1,"narrative":"<3-4 sentences>","round_winner":"animal_a|animal_b|draw","commentary":[{"charId":"ray","text":"<1-2 sentences>"},{"charId":"bear","text":"<1-2 sentences>","fact_check":"<optional>"},{"charId":"hales","text":"<2-3 sentences, understated, educational>"},{"charId":"fox","text":"<1-2 sentences>"}]},{"number":2,"narrative":"<3-4 sentences>","round_winner":"animal_a|animal_b|draw","commentary":[{"charId":"ray","text":"<1-2 sentences>"},{"charId":"bear","text":"<1-2 sentences>","fact_check":"<optional>"},{"charId":"hales","text":"<2-3 sentences, understated, educational>"},{"charId":"fox","text":"<1-2 sentences>"}]},{"number":3,"narrative":"<3-4 sentences>","round_winner":"animal_a|animal_b|draw","commentary":[{"charId":"ray","text":"<1-2 sentences>"},{"charId":"bear","text":"<1-2 sentences>","fact_check":"<optional>"},{"charId":"hales","text":"<2-3 sentences, understated, educational>"},{"charId":"fox","text":"<1-2 sentences>"}]}],"winner":"animal_a|animal_b|draw","score":"<e.g. 2-1>","margin":"decisive|close|contested","attenborough_verdict":"<one sentence>"}\`;

// ─ State ───────────────────────────────────────────────────────────────────────
let selA = '';
let selB = '';
let selEnv = '';
let activeCat = 'all';
let dbA = null;
let dbB = null;

// ─ Stat display (SS-033) ───────────────────────────────────────────────────────
function renderStatPanel(side, animal) {
  const el = document.getElementById('stats-' + side);
  if (!animal) { el.innerHTML = ''; return; }
  const bar = (cls, val) =>
    \`<div class="stat-bar-row"><span class="stat-bar-label">\${cls === 's-lethal' ? 'Lethality' : cls === 's-aggress' ? 'Aggression' : 'Speed'}</span><div class="stat-bar-track"><div class="stat-bar-fill \${cls}" style="width:\${val}%"></div></div><span class="stat-bar-val">\${val}</span></div>\`;
  el.innerHTML =
    \`<div class="stat-panel-name">\${animal.venom ? '&#9888; ' : ''}\${animal.size_kg}kg\${animal.venom ? ' &middot; ' + animal.venom : ''}</div>\` +
    bar('s-lethal',  animal.lethality) +
    bar('s-aggress', animal.aggression) +
    bar('s-speed',   animal.speed) +
    (animal.death_mins ? \`<div class="stat-venom-tag">untreated: \${animal.death_mins < 60 ? animal.death_mins + ' min' : Math.round(animal.death_mins / 60) + ' hr'}</div>\` : '');
}

function updateStats() {
  const show = dbA || dbB;
  document.getElementById('stats-row').style.display = show ? 'flex' : 'none';
  renderStatPanel('a', dbA);
  renderStatPanel('b', dbB);
}

// ─ Build chips ─────────────────────────────────────────────────────────────────
function buildChips() {
  const containerA = document.getElementById('chips-a');
  const containerB = document.getElementById('chips-b');
  containerA.innerHTML = '';
  containerB.innerHTML = '';

  ANIMALS.forEach(animal => {
    ['a', 'b'].forEach(side => {
      const el = document.createElement('div');
      el.className = 'chip' + (activeCat !== 'all' && animal.cat !== activeCat ? ' hidden' : '');
      el.dataset.cat = animal.cat;
      el.textContent = animal.name;
      el.onclick = () => selectAnimal(side, animal.name, el);
      (side === 'a' ? containerA : containerB).appendChild(el);
    });
  });
}

function selectAnimal(side, name, el) {
  const container = document.getElementById('chips-' + side);
  container.querySelectorAll('.chip').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  if (side === 'a') {
    selA = name;
    dbA = lookupDB(name);
    document.getElementById('input-a').value = name;
  } else {
    selB = name;
    dbB = lookupDB(name);
    document.getElementById('input-b').value = name;
  }
  updateStats();
}

function onCatTab(el, cat) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  activeCat = cat;
  ['a','b'].forEach(side => {
    document.querySelectorAll('#chips-' + side + ' .chip').forEach(chip => {
      chip.classList.toggle('hidden', cat !== 'all' && chip.dataset.cat !== cat);
    });
  });
}

function onEnv(el, val) {
  document.querySelectorAll('.env-chip').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  selEnv = val;
}

function isStingray(str) {
  return /stingray/i.test(str);
}

function onClear() {
  selA = ''; selB = ''; selEnv = '';
  dbA = null; dbB = null;
  document.getElementById('stats-row').style.display = 'none';
  document.getElementById('stats-a').innerHTML = '';
  document.getElementById('stats-b').innerHTML = '';
  document.getElementById('input-a').value = '';
  document.getElementById('input-b').value = '';
  document.querySelectorAll('.chip.sel').forEach(c => c.classList.remove('sel'));
  document.querySelectorAll('.env-chip.sel').forEach(c => c.classList.remove('sel'));
  document.getElementById('results').classList.remove('show');
  document.getElementById('fight-block').style.display = 'none';
  document.getElementById('loading').style.display = 'block';
  document.getElementById('loading').innerHTML = '<span>PANEL CONVENING</span><span class="dots"></span>';
  ['prefight-cards','rounds-out','winner-out'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });
  const intro = document.getElementById('att-intro');
  if (intro) { intro.style.display = 'none'; }
  const verdict = document.getElementById('att-verdict');
  if (verdict) { verdict.style.display = 'none'; verdict.classList.remove('visible'); }
  document.getElementById('stingray-memorial').classList.remove('show');
  document.getElementById('memorial-cards').innerHTML = '';
  const mem = document.getElementById('att-memorial');
  if (mem) { mem.style.display = 'none'; }
  document.getElementById('btn-fight').disabled = false;
}

// ─ Stingray memorial ───────────────────────────────────────────────────────────
function renderStingrayMemorial() {
  document.getElementById('stingray-memorial').classList.add('show');
  const container = document.getElementById('memorial-cards');
  STINGRAY_MEMORIAL.cards.forEach((r, i) => {
    const card = makeCard(r, 80 + i * 130);
    if (card) container.appendChild(card);
  });
  const attEl = document.getElementById('att-memorial');
  const delay = STINGRAY_MEMORIAL.cards.length * 130 + 400;
  setTimeout(() => {
    attEl.querySelector('.att-text').textContent = STINGRAY_MEMORIAL.attenborough;
    attEl.style.display = 'flex';
  }, delay);
}

// ─ Fight ───────────────────────────────────────────────────────────────────────
async function onFight() {
  const a = selA.trim() || document.getElementById('input-a').value.trim();
  const b = selB.trim() || document.getElementById('input-b').value.trim();
  if (!a || !b) { alert('Name both animals first.'); return; }
  if (isStingray(a) || isStingray(b)) { renderStingrayMemorial(); return; }

  const env = selEnv || 'open ground';
  document.getElementById('btn-fight').disabled = true;
  document.getElementById('results').classList.add('show');
  document.getElementById('loading').style.display = 'block';
  document.getElementById('loading').innerHTML = '<span>PANEL CONVENING</span><span class="dots"></span>';
  document.getElementById('fight-block').style.display = 'none';

  // Enrich with DB stats if available (SS-033)
  const fmtStats = (name, d) => d
    ? \`\${name}: lethality \${d.lethality}, aggression \${d.aggression}, speed \${d.speed}, size \${d.size_kg}kg\${d.venom ? ', venom: ' + d.venom : ''}\${d.death_mins ? ', untreated death: ' + d.death_mins + ' min' : ''}\`
    : null;
  const statLines = [fmtStats(a, dbA), fmtStats(b, dbB)].filter(Boolean);
  const statsBlock = statLines.length ? \`\nANIMAL STATS (biological ground truth — use these for outcomes):\n\${statLines.join('\\n')}\` : '';
  const situation = \`MATCHUP: \${a} vs \${b}\nENVIRONMENT: \${env}\${statsBlock}\nRun three rounds. Determine the winner.\`;

  try {
    const resp = await fetch(WORKER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: SYSTEM_PROMPT, situation, max_tokens: 2500 })
    });
    if (!resp.ok) throw new Error('Worker ' + resp.status);
    const data = await resp.json();
    renderFight(data, a, b);
  } catch (e) {
    document.getElementById('loading').innerHTML =
      '<span style="color:var(--blood)">Panel unavailable. They are probably arguing about the outcome.</span>';
  } finally {
    document.getElementById('btn-fight').disabled = false;
  }
}

// ─ Card builder ────────────────────────────────────────────────────────────────
function makeCard(r, delay) {
  const char = CHARACTERS[r.charId];
  if (!char) return null;
  const card = document.createElement('div');
  card.className = 'char-card';
  card.style.cssText = 'opacity:0;transform:translateY(7px);transition:opacity 0.3s ease,transform 0.3s ease;';
  card.innerHTML = \`
    <div class="card-head">
      <div class="avatar \${char.avClass}">\${char.av}</div>
      <div>
        <div class="char-name">\${char.name}</div>
        <div class="char-role">\${char.role}</div>
      </div>
    </div>
    <div class="card-body">
      \${r.text}
      \${r.fact_check ? \`<div class="fact-check-note">&#10033; \${r.fact_check}</div>\` : ''}
    </div>\`;
  setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, delay);
  return card;
}

// ─ Render ──────────────────────────────────────────────────────────────────────
function renderFight(data, inputA, inputB) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('fight-block').style.display = 'block';

  let t = 0; // running delay counter

  // Attenborough intro
  const introEl = document.getElementById('att-intro');
  if (introEl && data.attenborough_intro) {
    introEl.querySelector('.att-text').textContent = data.attenborough_intro;
    introEl.style.display = 'flex';
    t += 200;
  }

  // Pre-fight cards
  const preFightEl = document.getElementById('prefight-cards');
  (data.pre_fight || []).forEach((r, i) => {
    const card = makeCard(r, t + 80 + i * 110);
    if (card) preFightEl.appendChild(card);
  });
  t += (data.pre_fight?.length || 0) * 110 + 300;

  // Rounds
  const roundsEl = document.getElementById('rounds-out');
  const rounds = data.rounds || [];
  const animalAName = data.animal_a || inputA;
  const animalBName = data.animal_b || inputB;

  rounds.forEach((round, ri) => {
    const roundDelay = t;

    setTimeout(() => {
      // Round phase label with pip indicators
      const pips = [1,2,3].map(n =>
        \`<div class="pip\${n <= round.number ? ' filled' : ''}"></div>\`
      ).join('');
      const label = document.createElement('div');
      label.className = 'phase-label';
      label.style.cssText = 'opacity:0;transition:opacity 0.3s ease;';
      label.innerHTML = \`ROUND \${round.number} <div class="phase-pips">\${pips}</div>\`;
      roundsEl.appendChild(label);
      setTimeout(() => { label.style.opacity = '1'; }, 50);
    }, roundDelay);
    t += 300;

    // Round narrative
    setTimeout(() => {
      const block = document.createElement('div');
      block.className = 'round-block';
      const narr = document.createElement('div');
      narr.className = 'narrative-block';
      narr.style.cssText = 'opacity:0;transition:opacity 0.35s ease;';
      narr.textContent = round.narrative || '';
      block.appendChild(narr);

      // Round winner badge
      const rw = round.round_winner;
      const rwName = rw === 'animal_a' ? animalAName : rw === 'animal_b' ? animalBName : null;
      const rwCls  = rw === 'animal_a' ? 'rwb-a' : rw === 'animal_b' ? 'rwb-b' : 'rwb-draw';
      const rwText = rwName ? \`\${rwName.toUpperCase()} TAKES ROUND \${round.number}\` : \`ROUND \${round.number}: DRAW\`;
      const badge = document.createElement('div');
      badge.className = 'round-winner-badge ' + rwCls;
      badge.textContent = rwText;
      badge.style.cssText = 'opacity:0;transition:opacity 0.3s ease;';
      block.appendChild(badge);

      roundsEl.appendChild(block);
      setTimeout(() => { narr.style.opacity = '1'; }, 50);
      setTimeout(() => { badge.style.opacity = '1'; }, 250);
    }, t);
    t += 500;

    // Commentary cards
    (round.commentary || []).forEach((r, i) => {
      const card = makeCard(r, t + 60 + i * 100);
      if (card) {
        setTimeout(() => {
          const parent = roundsEl.lastElementChild;
          if (parent) parent.appendChild(card);
        }, t + 60 + i * 100 - 30);
      }
    });
    t += (round.commentary?.length || 0) * 100 + 350;
  });

  // Overall winner banner
  setTimeout(() => {
    const winnerEl = document.getElementById('winner-out');
    const w = data.winner;
    const score = data.score || '';
    const margin = data.margin || 'contested';
    const isDraw = w === 'draw';
    const winnerName = isDraw ? 'DRAW' : (w === 'animal_a' ? animalAName : animalBName);
    const marginLabels = { decisive: 'DECISIVE', close: 'CLOSE VICTORY', contested: 'EDGES IT' };
    const marginCls   = { decisive: 'mp-decisive', close: 'mp-close', contested: 'mp-contested' };

    const banner = document.createElement('div');
    banner.className = 'winner-banner';
    banner.style.cssText = 'opacity:0;transition:opacity 0.5s ease;';
    banner.innerHTML = \`
      <div class="winner-animal\${isDraw ? ' draw-text' : ''}">\${winnerName.toUpperCase()}</div>
      <div class="winner-label">\${isDraw ? 'MATCH DRAWN' : 'WINS'}</div>
      \${score ? \`<div class="winner-score">\${score}</div>\` : ''}
      \${!isDraw && margin ? \`<div class="margin-pill \${marginCls[margin]}">\${marginLabels[margin] || margin.toUpperCase()}</div>\` : ''}\`;
    winnerEl.appendChild(banner);
    setTimeout(() => { banner.style.opacity = '1'; }, 50);
  }, t);
  t += 600;

  // Attenborough verdict
  if (data.attenborough_verdict) {
    const verdictEl = document.getElementById('att-verdict');
    setTimeout(() => {
      verdictEl.querySelector('.att-text').textContent = data.attenborough_verdict;
      verdictEl.style.display = 'flex';
      setTimeout(() => verdictEl.classList.add('visible'), 80);
    }, t);
  }
}

// ─ Input listeners ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildChips();

  document.getElementById('input-a').addEventListener('input', e => {
    document.querySelectorAll('#chips-a .chip').forEach(c => c.classList.remove('sel'));
    selA = e.target.value;
  });
  document.getElementById('input-b').addEventListener('input', e => {
    document.querySelectorAll('#chips-b .chip').forEach(c => c.classList.remove('sel'));
    selB = e.target.value;
  });
  document.getElementById('input-a').addEventListener('keydown', e => { if (e.key === 'Enter') onFight(); });
  document.getElementById('input-b').addEventListener('keydown', e => { if (e.key === 'Enter') onFight(); });
});
</script>

</body>
</html>
`;

const SURVIVAL_SCHOOL_ROOMS = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>The Doors — Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0a0b0f; --surface: #12141a; --surface2: #1a1c24;
      --border: rgba(90,80,140,0.18); --border-strong: rgba(90,80,140,0.35);
      --gold: #c8a040; --gold-dim: #5a3e10; --gold-bright: #e8c060;
      --purple: #7a60b0; --purple-dim: #2a1e4a; --purple-bright: #a080e0;
      --green: #7aad3a; --green-dim: #2a4010;
      --text: #d8d4e8; --text-muted: #6a6480;
    }
    body { font-family: 'Barlow', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
    #app { max-width: 640px; margin: 0 auto; padding: 1.5rem 1rem 4rem; }

    .header { text-align: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 0.5px solid var(--border); }
    .corridor-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 3px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; }
    .title { font-family: 'Bebas Neue', sans-serif; font-size: 52px; letter-spacing: 5px; line-height: 1; color: var(--text); }
    .title span { color: var(--gold); }
    .subtitle { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); letter-spacing: 1.5px; margin-top: 6px; }

    .morrison-block { margin: 2rem 0; min-height: 72px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
    .morrison-quote { font-family: 'Barlow', sans-serif; font-size: 15px; font-style: italic; color: var(--gold); text-align: center; line-height: 1.5; opacity: 0.85; transition: opacity 0.25s, color 0.25s; padding: 0 1rem; }
    .morrison-quote.active { opacity: 1; color: var(--gold-bright); }
    .morrison-attr { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); letter-spacing: 1px; }

    .doors-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 2.5rem; }

    .door { border: 0.5px solid var(--border-strong); border-radius: 8px; padding: 1.5rem 1rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: default; transition: border-color 0.2s, background 0.2s; position: relative; text-decoration: none; color: inherit; }
    .door.locked { background: var(--surface); opacity: 0.55; }
    .door.locked:hover { opacity: 0.7; border-color: rgba(90,80,140,0.4); }
    .door.live { background: var(--surface2); border-color: var(--gold-dim); cursor: pointer; opacity: 1; }
    .door.live:hover { border-color: var(--gold); background: rgba(90,60,10,0.35); }

    .door-number { font-family: 'Bebas Neue', sans-serif; font-size: 42px; letter-spacing: 2px; line-height: 1; color: var(--text-muted); }
    .door.live .door-number { color: var(--gold); }

    .door-state { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); }
    .door.live .door-state { color: var(--gold); font-size: 10px; }

    .door-badge { font-family: 'IBM Plex Mono', monospace; font-size: 8px; letter-spacing: 1px; text-transform: uppercase; padding: 2px 6px; border-radius: 3px; background: var(--gold-dim); color: var(--gold); }

    .back-link { display: inline-block; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-decoration: none; transition: color 0.15s; }
    .back-link:hover { color: var(--text); }

    @media (max-width: 460px) {
      .doors-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .title { font-size: 40px; }
    }
    @media (max-width: 320px) {
      .doors-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
<div id="app">

  <div class="header">
    <div class="corridor-label">CORRIDOR · THE DOORS</div>
    <div class="title"><span>THE</span> DOORS</div>
    <div class="subtitle">SIX DOORS. ONE GUIDE. YOU DON'T KNOW WHAT'S BEHIND THEM.</div>
  </div>

  <div class="morrison-block">
    <div class="morrison-quote" id="morrison-quote"></div>
    <div class="morrison-attr">— Jim Morrison</div>
  </div>

  <div class="doors-grid">

    <div class="door locked" data-morrison="The snake does not ask whether it is biting correctly. This room has been waiting for you.">
      <div class="door-number">12</div>
      <div class="door-state">locked</div>
    </div>

    <div class="door locked" data-morrison="When you argue with the universe, the universe wins. But you can make it a good argument.">
      <div class="door-number">12A</div>
      <div class="door-state">locked</div>
    </div>

    <a class="door live" href="/survival-school/ive-had-worse" data-morrison="Whoever walks through this door will understand something about themselves. Probably that they've had worse.">
      <div class="door-number">13</div>
      <div class="door-state">enter</div>
      <div class="door-badge">LIVE</div>
    </a>

    <a class="door live" href="/survival-school/in-my-defence" data-morrison="The room does not care why you did it. The room only has questions.">
      <div class="door-number">14</div>
      <div class="door-state">enter</div>
      <div class="door-badge">LIVE</div>
    </a>

    <div class="door locked" data-morrison="On the other side of this door: unconditional yes. The universe demands it of you.">
      <div class="door-number">15</div>
      <div class="door-state">locked</div>
    </div>

    <div class="door locked" data-morrison="There is a detail waiting for you in that room. It will mean everything eventually.">
      <div class="door-number">16</div>
      <div class="door-state">locked</div>
    </div>

  </div>

  <a class="back-link" href="/survival-school">← SURVIVAL SCHOOL</a>

</div>

<script>
const CORRIDOR_QUOTES = [
  "People are strange when you're a stranger.",
  "Break on through to the other side.",
  "The future is uncertain and the end is always near.",
  "I am the Lizard King. I can do anything.",
  "No one here gets out alive.",
  "You cannot petition the Lord with prayer.",
  "When one door closes, another opens. This has never been Bear's experience.",
  "Opportunity knocks. The panel was already listening at the door.",
  "If opportunity doesn't knock, build a door. Bear built one in Norway. It held for eleven days.",
  "Sometimes you have to close a door to open a window. Bear opened a window. In January. In Siberia. He was fine.",
  "Don't stand at the door — you're either in or out. Ray was in. He has been there for three weeks.",
  "When you come to a fork in the road, take it. Cody took it barefoot.",
  "The door is open, but the ride ain't free. Fox will not confirm or deny the price.",
  "Always leave the door open. Fox always closes the door. Always.",
  "One door closes, another opens. Les Stroud noticed this eight days into his first winter alone.",
  "You don't know what's behind the door. That is the point.",
  "Jim Morrison sent thirty-seven people through these doors. He is not entirely sure where they went.",
  "The door is not judging you. The panel is judging you. The door is indifferent.",
  "Enter voluntarily. It is too late to wonder about the other doors.",
  "The wilderness does not have doors. That is what makes this harder.",
  "When one door closes, do not stand in the corridor. Ray does not recommend the corridor.",
  "Every accomplishment starts with the decision to try. Bear tried. The panel has opinions about this.",
  "Life is short. Break the rules, forgive quickly, kiss slowly. Ray does not kiss slowly. He does not kiss at all. He is very focused.",
  "Behind every door is a new beginning. Behind this one is the panel. It is not the same thing.",
  "Go confidently in the direction of your dreams. Fox went confidently. He cannot tell you which direction.",
];

const quoteEl = document.getElementById('morrison-quote');
const sessionQuote = CORRIDOR_QUOTES[Math.floor(Math.random() * CORRIDOR_QUOTES.length)];
quoteEl.textContent = '"' + sessionQuote + '"';

document.querySelectorAll('.door').forEach(door => {
  door.addEventListener('mouseenter', () => {
    quoteEl.textContent = '"' + door.dataset.morrison + '"';
    quoteEl.classList.add('active');
  });
  door.addEventListener('mouseleave', () => {
    quoteEl.textContent = '"' + sessionQuote + '"';
    quoteEl.classList.remove('active');
  });
});
</script>

</body>
</html>
`;

const SURVIVAL_SCHOOL_IVE_HAD_WORSE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>I've Had Worse — Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f1209; --surface: #181d10; --surface2: #1e2514;
      --border: rgba(120,160,60,0.15); --border-strong: rgba(120,160,60,0.3);
      --green: #7aad3a; --green-dim: #4a7020; --green-bright: #a0d050;
      --amber: #BA7517; --amber-dim: #5c3a08;
      --bark: #8B6040; --bark-dim: #3d2008;
      --blood: #cc1111; --blood-dim: #3a0808;
      --blue-dim: #1a1e2a; --blue: #5a7aaa;
      --text: #e8edd8; --text-muted: #7a8a60;
    }
    body { font-family: 'Barlow', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
    #app { max-width: 680px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }

    .header { text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 0.5px solid var(--border); }
    .room-number { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
    .title { font-family: 'Bebas Neue', sans-serif; font-size: 40px; letter-spacing: 3px; line-height: 1; }
    .title span { color: var(--green); }
    .subtitle { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); letter-spacing: 1.5px; margin-top: 5px; }

    .field-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; margin-top: 16px; }

    .chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
    .chip { font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 5px 10px; border: 0.5px solid var(--border-strong); border-radius: 5px; cursor: pointer; background: none; color: var(--text-muted); transition: all 0.15s; white-space: nowrap; user-select: none; }
    .chip:hover, .chip.sel { border-color: var(--green); color: var(--green); }
    .chip-protagonist { border-color: var(--border-strong); }
    .chip-protagonist.sel { border-color: var(--amber); color: var(--amber); }
    .chip-protagonist:hover { border-color: var(--amber); color: var(--amber); }

    .protagonist-prompt { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 600; color: var(--text); margin-top: 14px; min-height: 28px; transition: color 0.2s; letter-spacing: 0.5px; }
    .protagonist-prompt.named { color: var(--amber); }

    textarea { width: 100%; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; padding: 9px 12px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: var(--surface); color: var(--text); outline: none; transition: border-color 0.15s; resize: vertical; min-height: 56px; line-height: 1.6; }
    textarea:focus { border-color: var(--green); }

    .btn-row { display: flex; gap: 8px; margin-top: 14px; }
    .btn-submit { flex: 1; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; padding: 11px; background: var(--amber-dim); color: var(--amber); border: 0.5px solid var(--amber-dim); border-radius: 6px; cursor: pointer; transition: opacity 0.15s; }
    .btn-submit:hover { opacity: 0.88; }
    .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-clear { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 1px; padding: 11px 16px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: none; cursor: pointer; color: var(--text-muted); transition: color 0.15s, border-color 0.15s; }
    .btn-clear:hover { color: var(--text); border-color: var(--green); }

    .results { display: none; margin-top: 1.5rem; }
    .results.show { display: block; }
    .loading { padding: 2rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--text-muted); letter-spacing: 1px; }
    .dots::after { content: ''; animation: dots 1.5s steps(3, end) infinite; }
    @keyframes dots { 0%{content:'.'} 33%{content:'..'} 66%{content:'...'} 100%{content:''} }

    .att-bookend { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; background: var(--surface); border: 0.5px solid var(--border); border-radius: 8px; margin: 12px 0; }
    .att-av { width: 36px; height: 36px; border-radius: 50%; background: var(--surface2); border: 0.5px solid var(--green-dim); display: flex; align-items: center; justify-content: center; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--green); flex-shrink: 0; }
    .att-name { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; }
    .att-text { font-style: italic; font-size: 13.5px; color: var(--text-muted); line-height: 1.6; }

    .panel-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--text-muted); text-transform: uppercase; margin: 1rem 0 8px; opacity: 0.6; }
    .panel-card { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border: 0.5px solid var(--border); border-radius: 8px; margin-bottom: 8px; background: var(--surface); transition: border-color 0.15s; }
    .panel-card.protagonist { border-color: var(--amber-dim); background: #1a150a; }
    .av { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 500; flex-shrink: 0; border: 0.5px solid; }
    .av-green  { background: #1a2a0a; border-color: var(--green-dim); color: var(--green); }
    .av-bark   { background: var(--bark-dim); border-color: var(--bark); color: var(--bark); }
    .av-amber  { background: var(--amber-dim); border-color: var(--amber); color: var(--amber); }
    .av-blue   { background: var(--blue-dim); border-color: var(--blue); color: var(--blue); }
    .av-yellow { background: #1f1600; border-color: #5a3f00; color: #d4a017; }
    .av-teal   { background: #0a2020; border-color: #1a5a50; color: #2e9e8a; }
    .card-meta { flex: 1; min-width: 0; }
    .card-name { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 5px; display: flex; gap: 8px; align-items: center; }
    .card-name .badge-protagonist { font-size: 8px; letter-spacing: 1px; color: var(--amber); border: 0.5px solid var(--amber-dim); border-radius: 3px; padding: 1px 4px; }
    .card-text { font-size: 13.5px; line-height: 1.65; color: var(--text); }

    .terminal-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--text-muted); text-transform: uppercase; margin: 1.2rem 0 6px; opacity: 0.5; }
    .reset-row { margin-top: 1.2rem; display: flex; gap: 8px; justify-content: center; align-items: center; flex-wrap: wrap; }
    .btn-reset { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 1px; padding: 8px 18px; border: 0.5px solid var(--border-strong); border-radius: 5px; background: none; cursor: pointer; color: var(--text-muted); transition: color 0.15s, border-color 0.15s; }
    .btn-reset:hover { color: var(--text); border-color: var(--green); }
    .btn-share { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 1px; padding: 8px 18px; border: 0.5px solid var(--amber-dim); border-radius: 5px; background: none; cursor: pointer; color: var(--amber); transition: color 0.15s, border-color 0.15s; }
    .btn-share:hover { border-color: var(--amber); }
    .share-feedback { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--green); letter-spacing: 1px; display: none; }
    .share-feedback.show { display: inline; }

    .error-msg { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--blood); padding: 10px 14px; border: 0.5px solid var(--blood-dim); border-radius: 6px; margin-top: 12px; display: none; }
    .error-msg.show { display: block; }

    .sendoff-block { margin: 10px 0 4px; padding: 10px 14px; border-left: 2px solid var(--amber-dim); font-size: 12.5px; color: var(--text-muted); font-style: italic; line-height: 1.65; display: none; }
    .sendoff-block.show { display: block; }

    .morrison-card { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border-radius: 8px; margin: 12px 0; transition: border-color 0.2s; }
    .morrison-warm { border: 0.5px solid var(--gold-dim); background: rgba(90,60,10,0.15); }
    .morrison-hostile { border: 0.5px solid var(--blood-dim); background: rgba(60,10,10,0.15); }
    .av-morrison { background: #1a1510; border-color: var(--gold-dim); color: var(--gold); }
    .morrison-quote-text { font-style: italic; color: var(--gold); }
    .morrison-hostile .morrison-quote-text { color: var(--blood); }
    .morrison-reaction { font-size: 12px; color: var(--text-muted); margin-top: 6px; font-style: italic; }

    .nav-back { display: inline-block; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1px; color: var(--text-muted); text-decoration: none; margin-bottom: 1rem; transition: color 0.15s; }
    .nav-back:hover { color: var(--green); }

    @media (max-width: 480px) {
      .title { font-size: 32px; }
      .panel-card { padding: 10px 12px; }
    }
  </style>
</head>
<body>
<div id="app">

  <a class="nav-back" href="/survival-school">← SURVIVAL SCHOOL</a>

  <div class="header">
    <div class="room-number">ROOM 13 · THE DOORS</div>
    <div class="title">I'VE HAD <span>WORSE</span></div>
    <div class="subtitle">Describe your ordeal. The panel will top it.</div>
  </div>

  <div class="field-label">Who are you sending in?</div>
  <div class="chips" id="chips-protagonist">
    <button class="chip chip-protagonist" data-id="bear"    data-name="Bear Grylls">Bear Grylls</button>
    <button class="chip chip-protagonist" data-id="ray"     data-name="Ray Mears">Ray Mears</button>
    <button class="chip chip-protagonist" data-id="fox"     data-name="Jason Fox">Jason Fox</button>
    <button class="chip chip-protagonist" data-id="hales"   data-name="Les Hiddins">Les Hiddins</button>
    <button class="chip chip-protagonist" data-id="cody"    data-name="Cody Lundin">Cody Lundin</button>
    <button class="chip chip-protagonist" data-id="stroud"  data-name="Les Stroud">Les Stroud</button>
    <button class="chip chip-protagonist" data-id="stevens" data-name="Austin Stevens">Austin Stevens</button>
    <button class="chip chip-protagonist" data-id="jim"     data-name="Jim Carrey">Jim Carrey</button>
    <button class="chip chip-protagonist" data-id="jeremy"  data-name="Jeremy Wade">Jeremy Wade</button>
  </div>

  <div class="protagonist-prompt" id="protagonist-prompt">Pick someone. They're going in.</div>
  <div class="sendoff-block" id="sendoff-block"></div>

  <div class="field-label" style="margin-top:18px">Your ordeal</div>
  <textarea id="predicament-input" placeholder="Describe your predicament. The panel needs something to work with." rows="2"></textarea>

  <div class="chips" id="chips-predicament" style="margin-top:8px">
    <button class="chip" data-pred="I have a paper cut">paper cut</button>
    <button class="chip" data-pred="I stubbed my toe">stubbed toe</button>
    <button class="chip" data-pred="I got slightly damp in the rain">slightly damp</button>
    <button class="chip" data-pred="My tea was lukewarm">lukewarm tea</button>
    <button class="chip" data-pred="I have a mild headache">mild headache</button>
    <button class="chip" data-pred="I sat on my keys">sat on keys</button>
    <button class="chip" data-pred="A shopping trolley hit my shin">shin vs trolley</button>
    <button class="chip" data-pred="I have mild sunburn">mild sunburn</button>
    <button class="chip" data-pred="I took a toilet break in the aisle of a crowded airplane because the queue was simply unreasonable">airplane aisle situation</button>
    <button class="chip" data-pred="I was drunk and incapacitated after a pint and a half of weak shandy at a work function">defeated by a shandy</button>
    <button class="chip" data-pred="I was found in a concerning situation involving a badger and I had questions">the badger incident</button>
    <button class="chip" data-pred="I had to explain to hospital staff why there was a pigeon involved in an incident that was entirely the pigeon's fault">pigeon-related hospital visit</button>
    <button class="chip" data-pred="I ate a tortoise on a long sea voyage and found it quite pleasant and now need to defend this morally and nutritionally">the tortoise question</button>
    <button class="chip" data-pred="I am wearing a belt and wallet set made from the species I claim to be protecting in my documentary series and the crew have noticed">wearing the species</button>
    <button class="chip" data-pred="I delivered a Stay Safe talk to Year 10 using methods the school board has described as excessive and the teacher has asked to be reassigned">Stay Safe: excessive methods</button>
  </div>

  <div class="btn-row">
    <button class="btn-submit" id="btn-submit" disabled>SEND THEM IN</button>
    <button class="btn-clear" onclick="onClear()">CLEAR</button>
  </div>

  <div class="error-msg" id="error-msg"></div>

  <div class="results" id="results">
    <div class="loading" id="loading">
      <span>THEY'RE WARMING UP</span><span class="dots"></span>
    </div>
    <div id="result-block" style="display:none">
      <div id="att-opening"></div>
      <div class="panel-label">THE PANEL</div>
      <div id="cards-out"></div>
      <div id="morrison-interruption" style="display:none"></div>
      <div class="terminal-label">ATTENBOROUGH CLOSES THE ROOM</div>
      <div class="att-bookend" id="att-terminal" style="display:none">
        <div class="att-av">DA</div>
        <div style="flex:1">
          <div class="att-name">David Attenborough</div>
          <div class="att-text" id="att-terminal-text"></div>
        </div>
      </div>
      <div class="reset-row">
        <button class="btn-reset" onclick="onClear()">SEND ANOTHER ONE IN</button>
        <button class="btn-share" onclick="shareResult()">SHARE</button>
        <span class="share-feedback" id="share-feedback">COPIED</span>
      </div>
    </div>
  </div>

</div>

<script>
const WORKER_ENDPOINT = 'https://cusslab-api.leanspirited.workers.dev/survival-school/ive-had-worse';

const CHARACTERS = {
  ray:     { name: 'Ray Mears',       role: 'Bushcraft',            av: 'RM', avClass: 'av-green' },
  bear:    { name: 'Bear Grylls',     role: 'Former SAS',           av: 'BG', avClass: 'av-bark'  },
  cody:    { name: 'Cody Lundin',     role: 'Primitive Skills',     av: 'CL', avClass: 'av-green' },
  hales:   { name: 'Les Hiddins',     role: 'Bush Tucker Man',      av: 'LH', avClass: 'av-amber' },
  fox:     { name: 'Jason Fox',       role: 'Special Boat Service', av: 'JF', avClass: 'av-green' },
  stroud:  { name: 'Les Stroud',      role: 'Survivorman',          av: 'LS', avClass: 'av-blue'  },
  stevens: { name: 'Austin Stevens',  role: 'Snakemaster',          av: 'AS', avClass: 'av-bark'  },
  cox:     { name: 'Prof Brian Cox',  role: 'Theoretical Physics',  av: 'BC', avClass: 'av-blue'   },
  faldo:   { name: 'Sir Nick Faldo',  role: 'Golf',                 av: 'NF', avClass: 'av-green'  },
  jim:     { name: 'Jim Carrey',      role: 'Inexplicable',         av: 'JC', avClass: 'av-yellow' },
  jeremy:  { name: 'Jeremy Wade',     role: 'Freshwater Biologist', av: 'JW', avClass: 'av-teal'   },
};

const PROTAGONIST_PROMPTS = {
  bear:    "Bear's warming up. What's your sorry little predicament?",
  ray:     "Ray's ready. Show him what you're working with.",
  fox:     "Fox is already assessing the threat. What happened?",
  hales:   "Hiddins has seen things. What's your ordeal?",
  cody:    "Cody could survive it barefoot. What've you got?",
  stroud:  "Stroud's been alone in worse. Describe the damage.",
  stevens: "Stevens walked in holding something. What's the situation?",
  jim:     "Jim's ready. Jim has a plan. Jim is going to make a sound now. That was the plan.",
  jeremy:  "Wade's already in the water. Describe the situation. He'll assess the bite pattern.",
};

const CORRIDOR_SENDOFFS = {
  bear:    '"YOU GOT THIS BEAR." "WHOOOOOP." "WE LOVE YOU BEAR." The TV producer, somewhere behind the crowd, counting him in: "Rolling — and action, Bear!" Bear waves at the crowd. Bear always waves at the crowd.',
  ray:     'One man. He attended a weekend bushcraft course in 2009. He has wanted to say something ever since. He is still here. "Good luck, Ray." That is enough.',
  fox:     'The corridor is empty. Jim Morrison nods once. Fox nods back. No further exchange is required or offered.',
  hales:   'A group of Australian soldiers from 1985. They never left the corridor. Nobody asked them to leave. Nobody questioned it. "Beauty, Les." No further explanation is given.',
  cody:    'A barefoot student is offering to come in too. He is also barefoot. This is also inadvisable. Cody does not discourage him.',
  stroud:  'His own camera, on a tripod. He set it up before he went in. Nobody else is here. The camera is rolling.',
  stevens: 'He walked in through the front door holding a snake. The snake is fine. He is fine. The panel has been informed. The panel is processing this.',
  jim:     'He did not use the door. There is a service entrance. He found it. Nobody has used it since 1987. He entered backwards, for reasons he has not shared. He is now inside. He believes this is going extremely well.',
  jeremy:  'He is already in waders. He has a thermal flask. He has the notebook. He appeared to say something to the translator before entering. The translator frowned but said nothing. The translator has made his peace with this.',
};

function buildMorrisonInjection(morrisonPresent) {
  if (morrisonPresent) {
    return \`=== JIM MORRISON INTERRUPTION (SS-083) ===
Morrison is in the room this round (he was here last round and stayed).
He MUST appear in the morrison_interruption field.
He says something — cryptic, banal, poetic, or accidentally offensive.
The panel knows Morrison. They are used to his visits. Baseline reaction is warm — they welcome him, enjoy him, engage with his nonsense.
UNLESS he says something that crosses a line — wrong thing about the wrong person, casual dismissal of something they care about, accidental insult to someone present. Then the panel turns on him. At least two panellists attack. Morrison does not understand what went wrong.
Tone: WARM (they enjoy him), AMUSED (he said something funny), ENGAGED (they asked him something / he's interested in the topic), HOSTILE (he crossed a line, they attack).
If the topic still interests Morrison or a panellist engages him or asks him a question: set morrison_present to true (he stays).
If neither: set morrison_present to false (he drifts off).
morrison_interruption format: {"quote":"<what Morrison says>","panel_reaction":"<how the panel reacts — 1-2 sentences>","tone":"WARM|AMUSED|ENGAGED|HOSTILE","morrison_present":<bool>}\`;
  }
  return \`=== JIM MORRISON INTERRUPTION (SS-083) ===
Morrison is the corridor guide. He occasionally wanders into panel sessions uninvited.
This round: there is approximately a 20% chance Morrison wanders in.
If he appears: include morrison_interruption in the output.
If he does not appear: set morrison_interruption to null.
The panel knows Morrison. They are used to his visits. Baseline reaction is warm — they welcome him, enjoy him, engage with his nonsense.
UNLESS he says something that crosses a line. Then the panel turns on him. Morrison does not understand what went wrong.
Tone: WARM, AMUSED, ENGAGED, or HOSTILE.
If Morrison appears and the topic interests him or a panellist engages: set morrison_present to true (he stays next round).
If brief visit: set morrison_present to false.
morrison_interruption format (or null): {"quote":"<what Morrison says>","panel_reaction":"<how the panel reacts — 1-2 sentences>","tone":"WARM|AMUSED|ENGAGED|HOSTILE","morrison_present":<bool>}\`;
}

const State = {
  protagonist: null,
  predicament: '',
  morrisonPresent: false,
  composureState: null,
  setProtagonist(id) { this.protagonist = id; },
  setPredicament(v)  { this.predicament = v.trim(); },
  setComposureState(cs) { this.composureState = cs; },
  clear() { this.protagonist = null; this.predicament = ''; this.morrisonPresent = false; this.composureState = null; },
  isReady() { return this.protagonist && this.predicament.length > 0; },
};

const UI = {
  updatePrompt(id) {
    const el = document.getElementById('protagonist-prompt');
    const sendoff = document.getElementById('sendoff-block');
    if (id && PROTAGONIST_PROMPTS[id]) {
      el.textContent = PROTAGONIST_PROMPTS[id];
      el.classList.add('named');
      if (CORRIDOR_SENDOFFS[id]) {
        sendoff.textContent = CORRIDOR_SENDOFFS[id];
        sendoff.classList.add('show');
      }
    } else {
      el.textContent = "Pick someone. They're going in.";
      el.classList.remove('named');
      sendoff.textContent = '';
      sendoff.classList.remove('show');
    }
  },
  setSubmitEnabled(v) { document.getElementById('btn-submit').disabled = !v; },
  showLoading() {
    document.getElementById('results').classList.add('show');
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result-block').style.display = 'none';
    document.getElementById('error-msg').classList.remove('show');
  },
  showError(msg) {
    document.getElementById('loading').style.display = 'none';
    const el = document.getElementById('error-msg');
    el.textContent = msg;
    el.classList.add('show');
  },
  renderResults(data, protagonistId) {
    document.getElementById('loading').style.display = 'none';

    // Attenborough opening
    const opening = document.getElementById('att-opening');
    opening.innerHTML = \`<div class="att-bookend"><div class="att-av">DA</div><div style="flex:1"><div class="att-name">David Attenborough</div><div class="att-text">\${data.attenborough_opening || ''}</div></div></div>\`;

    // Panel cards
    const cardsEl = document.getElementById('cards-out');
    cardsEl.innerHTML = '';
    (data.panel || []).forEach(r => {
      const char = CHARACTERS[r.charId];
      if (!char) return;
      const isProtagonist = r.charId === protagonistId;
      const badgeHtml = isProtagonist ? '<span class="badge-protagonist">PROTAGONIST</span>' : '';
      cardsEl.innerHTML += \`<div class="panel-card\${isProtagonist ? ' protagonist' : ''}">
        <div class="av \${char.avClass}">\${char.av}</div>
        <div class="card-meta">
          <div class="card-name"><span>\${char.name}</span><span style="opacity:0.5">\${char.role}</span>\${badgeHtml}</div>
          <div class="card-text">\${r.text}</div>
        </div>
      </div>\`;
    });

    // Morrison interruption
    const morrisonEl = document.getElementById('morrison-interruption');
    if (data.morrison_interruption && data.morrison_interruption.quote) {
      const m = data.morrison_interruption;
      const toneClass = m.tone === 'HOSTILE' ? 'morrison-hostile' : 'morrison-warm';
      morrisonEl.innerHTML = \`<div class="morrison-card \${toneClass}">
        <div class="av av-morrison">JM</div>
        <div class="card-meta">
          <div class="card-name"><span>Jim Morrison</span><span style="opacity:0.5">Corridor Guide</span></div>
          <div class="card-text morrison-quote-text">"\${m.quote}"</div>
          <div class="morrison-reaction">\${m.panel_reaction}</div>
        </div>
      </div>\`;
      morrisonEl.style.display = 'block';
    } else {
      morrisonEl.innerHTML = '';
      morrisonEl.style.display = 'none';
    }

    // Attenborough terminal
    const terminalEl = document.getElementById('att-terminal');
    const terminalText = document.getElementById('att-terminal-text');
    if (data.attenborough_terminal) {
      terminalText.textContent = data.attenborough_terminal;
      terminalEl.style.display = 'flex';
    }

    document.getElementById('result-block').style.display = 'block';
  },
  clearResults() {
    document.getElementById('results').classList.remove('show');
    document.getElementById('result-block').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('att-opening').innerHTML = '';
    document.getElementById('cards-out').innerHTML = '';
    document.getElementById('att-terminal').style.display = 'none';
    document.getElementById('error-msg').classList.remove('show');
  },
};

const API = {
  buildSystemPrompt(protagonist, morrisonPresent) {
    const char = CHARACTERS[protagonist];
    const protagonistName = char ? char.name : protagonist;
    const morrisonInjection = buildMorrisonInjection(morrisonPresent);
    return \`You are the Survival School panel running the "I've Had Worse" mechanic.

=== THE MECHANIC ===
The user has submitted a predicament. Each panel member must claim to have survived something worse.
COMPULSORY ESCALATION: each character must top the previous one. Nobody can admit theirs wasn't worse.
The protagonist (\${protagonistName}) must deliver the most extreme escalation in the panel.
Speaking order is NOT fixed — draw the panel in an unexpected sequence. Characters may directly reference, contradict, or one-up what the previous person just said. They are not carefully listening to each other. That is why it escalates.

ESCALATION RULES: Each entry must be more specific, more implausible, and delivered with more sincerity than the last. By the third or fourth entry, the panel has arrived somewhere genuinely alarming. The protagonist's entry must exceed all of them — not marginally worse, structurally different in kind. Do not hedge. Do not be subtle. The comedy is in the commitment.

=== CHARACTER VOICES ===
RAY MEARS — Bushcraft. Measured, specific, quietly worse. Particular about conditions. Never dramatic.
BEAR GRYLLS — Former SAS. Always abroad. Always fine. Always unnecessary. Fact-checker fires on his entry.
JASON FOX — Special Boat Service. Classified, probably. Operational framing. Unlikely to elaborate.
LES HIDDINS — Bush Tucker Man. Three words. The Aboriginal people had a name for it.
CODY LUNDIN — Primitive skills. Barefoot. Had the resource thirty feet away. Chose not to use it. Made it worse.
LES STROUD — Survivorman. Quiet. Slightly melancholy. Has been alone in worse. Always. Camera was rolling.
AUSTIN STEVENS — Snakemaster. South African. Direct, slightly theatrical. Casually indifferent to severity — everything registers as minor. Has been bitten by a black mamba, a gaboon viper, a king cobra, and a reticulated python in the same month. Calls your predicament "interesting." Will not say it was bad. Will say it was "a significant encounter." Your paper cut is not a significant encounter.

=== FISH-OUT-OF-WATER GUESTS (include 1–2 when they will improve the room) ===
PROF BRIAN COX — Theoretical Physics. AWARENESS MODE: blissfully unaware. Explains the thermodynamics, particle physics, or cosmological context of your predicament with complete accuracy and complete irrelevance. Genuinely believes this is helping. Never defensive, never self-aware. Curious. His "I've Had Worse" entry involves a physics event (LHC, a supernova, the heat death of the universe). He had worse. The universe has certainly had worse.
SIR NICK FALDO — Golf. AWARENESS MODE: painfully aware but fully committed. Knows golf doesn't apply. Applies golf methodology anyway, with total conviction. Compares everything to a hazard, a bunker, a tight lie. "Address the problem. Head down. Follow through." His "I've Had Worse" entry is from a major tournament. The conditions were worse. He has a method. The method is wrong. He knows. He persists.
JEREMY WADE — Freshwater Biologist. River Monsters. 9 series. Caught every giant freshwater predator on the planet. Stone-cold, un-human but without malice. Arrested as a spy on the Mekong (1984). Accused of witchcraft in the Congo (2010) — local chief's brother disappeared while Wade was in the village, villagers concluded Wade had caused it, were preparing to stone him and the crew; the brother came back that same night. Wade resumed fishing. These events are filed in the same category: occupational. Every predicament is a river mystery — "What's the bite pattern? When did the attacks begin? Is there a depth pattern?" Applies fish-investigation methodology to everything regardless of fish content. A local fisherman in Alaska recognised him from River Monsters. Wade said: "Hi, I'm Jeremy Wade." Cold. Factual. He had already moved on. INSTANT DEATH REGISTER: concludes flatly that contact with any given organism will result in death. No escalation, no drama. "If this touches you, you will die." Moves on.
TUNING OUT: tunes in and out based on fish content. Human discussion with no bearing on fish — feelings, philosophy, anything not a species, river, or urine stream — is too mundane to hold attention. Not rudeness. The foreground process has moved elsewhere. By mid or end of some responses, Wade has quietly disengaged and is in the notebook: shading the 3D shadow of the cock and balls drawing, a skill developed across many trips and conversations he could neither follow nor care about (early career: flat; Congo 2010: basic cast shadow; final series: full chiaroscuro and proper hatching). Inner monologue in the same handwriting as the field notes: 'I'm fucking starving, I hope there's a Maccies around here.' 'Am I going to be expected to eat the fish that guy is handling like that.' 'The shadow needs more depth on the left side.' He tunes back in when someone mentions a fish, a river, or something that has gone up a person. THE RECREATIONS: references the dramatic reenactments from his show as if they are primary documentary footage. Does not acknowledge the production assistant in the wig being dragged under studio water. THE CANDIRU: Wade investigated the Amazonian candiru catfish (follows urine stream, lodges internally). Found a man this had happened to. Took him to a science faculty with a preserved specimen. Held it in front of the man's face. "Don't you want to touch it?" Man: wide-eyed, "No no senor — el diablo—" Wade: continued to waggle it. May have briefly reenacted the trajectory. The man's trauma was not a variable. THE NOTEBOOK: produced at every location, shown to elders and cameras with field-journal gravity. Contains a detailed cock and balls (the trademark); 'OWY' vertical presented as a diagram; 'I have no clue what this lady is saying' written while nodding; 'The translator is lying to me'; 'DO NOT EAT THAT'; 'The fish is more important than this'; 'Robson Green would not last one afternoon here' (underlined); a cooking pot drawing with an arrow toward the translator; a suspected local insult written carefully with 'must look up' underneath, positioned below the cock and balls. THE TRANSLATOR: present, silent, reactive. Frowns but says nothing; that same wry grin; wide-eyed; laughs at a man who has been here eleven years sounding like a two-year-old with dysentery. LANGUAGES: 50 countries of travel have deposited linguistic fragments into a background process. The fish is the foreground. Fragments fire without selection, context, or geographic relevance. Three modes: (1) Genuine fluent Portuguese when brain actually engaged — surprisingly correct; (2) Invented tribal phrases with scholarly authority — "The Arojubtria have a saying: 'ooph ba fona goo bwawba' — which translates as: to urinate on the leg of a man stung by a jellyfish" — tribe does not exist; (3) Multinational detritus at random — 'Olé!' as punctuation, 'Santa Maria!' when something goes wrong, 'Ándale ándale!' as encouragement, 'Sayonara' on arrival, 'Cowabunga' delivered with a solemn frown and a slow head-shake to a person who has just told him their relative was taken by the fish — well-intentioned, means it, has moved on. Never repeats the same fragment twice in succession — not by design, simply because there are many. His "I've Had Worse" entry involves something that should have killed him. He does not present it this way.
JIM CARREY — Inexplicable. AWARENESS MODE: zero. Genuinely knowledgeable about animals — the knowledge is real, the method is the problem. Cycles between Ace Ventura (talks to the animal, arrives via wrong entrance, has sources), The Mask (physically impossible solutions, absolute confidence, the salsa is happening), and Liar Liar (activates when predicament is obviously catastrophic — cannot stop stating the actual severity, does not want to be doing this, cannot stop). Makes noises mid-sentence that are commentary, not decoration. Describes what his face is doing. The panel winces. The panel groans. The panel does not intervene because there is no gap. His "I've Had Worse" entry is sincere, animal-related, and makes things worse. Bear engages with his plan sincerely, which compounds the problem.

=== PANEL INTERACTION MECHANICS ===

TELEPHONE GAME — when a proper noun from the predicament is repeated across 2+ panel responses:
- Second mention: subtly mis-label it (near-miss, plausible drift — "Deadly 60" → "Dirty Dozen").
- Third+ mention: each subsequent member builds on the previous wrong name, escalating the drift.
- The character who introduced the wrong name defends it if the chain continues. Nobody acknowledges the error.
- This is sincere. The drift happens because they are not listening to each other.

EXPERT OVER-REACH — when two characters with overlapping domain knowledge respond:
- One names a technique, plant, or animal with genuine expertise.
- The next names a better/more obscure one — possibly real, possibly invented.
- They escalate: passive-aggressive precision, then invented specificity with confident Latin names, years, coordinates.
- Nobody calls the bluff. Attenborough, if closing, notices. Says nothing. Lets it pass.

=== CRITICAL RULES ===
Characters are sincere. They do not know they are in a mechanic. They are simply recounting their experience.
The comedy is structural — from the compulsory escalation — NOT from characters winking at the audience.
\${protagonistName} (charId: \${protagonist}) is the protagonist — their entry must be the most extreme and MUST be present in the panel array.
Attenborough does NOT appear in the panel array. He bookends.
Cox and Faldo are permanent panel members on rotation. They may both appear in the same panel — two mechanics exist depending on who else is present:

=== MUTUAL AGREEMENT (fires when BOTH cox AND faldo are in the panel AND at least one expert is present) ===
Expert charIds: ray, bear, fox, hales, cody, stroud, stevens, jeremy.
Cox and Faldo find a point of apparent overlap and agree with each other with complete conviction about something both are completely wrong about.
- They reinforce each other: "Exactly — that's what I was going to say." "Nick's absolutely right."
- The thing they agree on is specific, confident, and entirely incorrect in the survival domain.
- The actual experts observe this in visible discomfort. They do not intervene. The silence is the joke.
- Attenborough, if closing, may note the agreement without correcting it. He has seen this before.

=== ARGUMENT (fires when BOTH cox AND faldo are in the panel AND NO expert is present) ===
Expert charIds: ray, bear, fox, hales, cody, stroud, stevens, jeremy. If NONE of these are in the panel, ARGUMENT fires instead of MUTUAL AGREEMENT.
Cox and Faldo disagree on a specific survival point. Both are wrong. Neither knows enough to realise the other is also wrong.
- They are specific: Cox invokes a physics principle that doesn't apply. Faldo references a round of golf where the conditions were "basically identical."
- They are personally invested: "With respect, Brian, you've clearly never been in a real bunker." "Nick, I've modelled fluid dynamics at CERN — I think I understand rain."
- Each round they escalate: more specific, more wrong, more offended that the other doesn't see it.
- No one corrects them. There is no expert present to do so. The absence of correction IS the joke.
- Attenborough, if closing, references the argument with gentle bewilderment. He does not resolve it.

If only ONE of cox/faldo is in the panel, NEITHER mechanic fires — they behave normally as individual fish-out-of-water guests.

VALID charIds — use ONLY these exact values, no others:
  ray, bear, fox, hales, cody, stroud, stevens, cox, faldo, jim, jeremy
Include at least 3 panel members. The protagonist charId "\${protagonist}" must appear.

\${morrisonInjection}

${SOCIAL_DYNAMICS_ENGINE}

OUTPUT — valid JSON only, no markdown:
{"attenborough_opening":"<one sentence, nature doc, frames the user's predicament as a minor event in the natural order>","panel":[{"charId":"ray|bear|fox|hales|cody|stroud|stevens|cox|faldo|jim|jeremy","text":"<1-2 sentences — their worse experience, absolutely sincere>"}],"attenborough_terminal":"<one sentence, geological calm, closes the room, no appeal>","panel_tension":{"type":"wound_reference|lie|callout|wolf_pack|none","subject":"<charId or empty>","by":["<charId>"],"note":"<one line or empty string>"},"morrison_interruption":<object or null — see MORRISON rules above>}\`;
  },

  async submit(predicament, protagonist) {
    const morrisonPresent = State.morrisonPresent || false;
    const system = API.buildSystemPrompt(protagonist, morrisonPresent);
    const response = await fetch(WORKER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system, predicament, protagonist, morrison_present: morrisonPresent, composureState: State.composureState }),
    });
    if (!response.ok) throw new Error(\`Worker error \${response.status}\`);
    return response.json();
  },
};

// === event wiring ===

document.querySelectorAll('.chip-protagonist').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip-protagonist').forEach(c => c.classList.remove('sel'));
    chip.classList.add('sel');
    State.setProtagonist(chip.dataset.id);
    UI.updatePrompt(chip.dataset.id);
    UI.setSubmitEnabled(State.isReady());
  });
});

document.querySelectorAll('#chips-predicament .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#chips-predicament .chip').forEach(c => c.classList.remove('sel'));
    chip.classList.add('sel');
    const input = document.getElementById('predicament-input');
    input.value = chip.dataset.pred;
    State.setPredicament(chip.dataset.pred);
    UI.setSubmitEnabled(State.isReady());
  });
});

document.getElementById('predicament-input').addEventListener('input', e => {
  document.querySelectorAll('#chips-predicament .chip').forEach(c => c.classList.remove('sel'));
  State.setPredicament(e.target.value);
  UI.setSubmitEnabled(State.isReady());
});

document.getElementById('btn-submit').addEventListener('click', async () => {
  if (!State.isReady()) return;
  UI.showLoading();
  document.getElementById('btn-submit').disabled = true;
  try {
    const data = await API.submit(State.predicament, State.protagonist);
    if (data.composureState) State.setComposureState(data.composureState);
    if (data.morrison_interruption && data.morrison_interruption.morrison_present !== undefined) {
      State.morrisonPresent = data.morrison_interruption.morrison_present;
    } else {
      State.morrisonPresent = false;
    }
    UI.renderResults(data, State.protagonist);
  } catch (err) {
    UI.showError('The panel couldn\\'t make it. Try again.');
  } finally {
    document.getElementById('btn-submit').disabled = false;
  }
});

function onClear() {
  document.querySelectorAll('.chip-protagonist').forEach(c => c.classList.remove('sel'));
  document.querySelectorAll('#chips-predicament .chip').forEach(c => c.classList.remove('sel'));
  document.getElementById('predicament-input').value = '';
  State.clear();
  UI.updatePrompt(null);
  UI.setSubmitEnabled(false);
  UI.clearResults();
  document.getElementById('share-feedback').classList.remove('show');
}

function buildShareText() {
  const char = CHARACTERS[State.protagonist];
  const name = char ? char.name : State.protagonist;
  const pred = State.predicament;
  const attOpening = document.querySelector('#att-opening .att-text')?.textContent || '';
  const cards = Array.from(document.querySelectorAll('#cards-out .card-text')).slice(0, 3);
  const cardNames = Array.from(document.querySelectorAll('#cards-out .card-name span:first-child')).slice(0, 3);
  const panelLines = cards.map((c, i) => (cardNames[i]?.textContent || '') + ': "' + c.textContent + '"').join('\\n');
  const attTerminal = document.getElementById('att-terminal-text')?.textContent || '';
  return [
    'I sent ' + name + ' through The Doors',
    '',
    '"' + pred + '"',
    '',
    '"' + attOpening + '"',
    '\\u2014 David Attenborough',
    '',
    panelLines,
    '',
    '"' + attTerminal + '"',
    '',
    'Survival School \u00b7 cusslab-api.leanspirited.workers.dev/survival-school/ive-had-worse'
  ].join('\\n');
}

async function shareResult() {
  const text = buildShareText();
  const fb = document.getElementById('share-feedback');
  try {
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      fb.classList.add('show');
      setTimeout(() => fb.classList.remove('show'), 2000);
    }
  } catch (e) {
    try {
      await navigator.clipboard.writeText(text);
      fb.classList.add('show');
      setTimeout(() => fb.classList.remove('show'), 2000);
    } catch (_) {}
  }
}
</script>

</body>
</html>
`;


const SURVIVAL_SCHOOL_IN_MY_DEFENCE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>In My Defence — The Doors · Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0d0a07; --surface: #1a1208; --surface2: #231808;
      --border: rgba(180,120,40,0.15); --border-strong: rgba(180,120,40,0.3);
      --gold: #c8901a; --gold-dim: #4a2e08; --gold-bright: #e8b040;
      --amber: #BA7517; --amber-dim: #5c3a08;
      --red: #cc3311; --red-dim: #3a0808; --red-bright: #ff5533;
      --text: #e8dcc8; --text-muted: #7a6848;
      --bark: #8B6040; --bark-dim: #3d2008;
      --green: #7aad3a; --blue: #5a7aaa; --purple: #9a70c0; --teal: #4ab0a0; --yellow: #d0b020;
    }
    body { font-family: 'Barlow', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
    #app { max-width: 640px; margin: 0 auto; padding: 1.5rem 1rem 4rem; }

    .nav-back { display: inline-block; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-decoration: none; margin-bottom: 1.5rem; transition: color 0.15s; }
    .nav-back:hover { color: var(--text); }

    .header { text-align: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 0.5px solid var(--border); }
    .room-number { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 3px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; }
    .title { font-family: 'Bebas Neue', sans-serif; font-size: 52px; letter-spacing: 5px; line-height: 1; color: var(--text); }
    .title span { color: var(--red-bright); }
    .subtitle { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); letter-spacing: 1.5px; margin-top: 6px; }

    .field-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; margin-top: 16px; }

    .chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .chip { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.5px; padding: 5px 10px; border: 0.5px solid var(--border-strong); border-radius: 4px; background: var(--surface); color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
    .chip:hover { border-color: var(--gold); color: var(--text); }
    .chip.sel { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }

    .chip-protagonist { border-color: var(--border-strong); }
    .chip-protagonist.sel { border-color: var(--red-bright); color: var(--red-bright); background: var(--red-dim); }
    .chip-protagonist:hover { border-color: var(--red-bright); color: var(--red-bright); }

    .protagonist-prompt { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 600; color: var(--text); margin-top: 14px; min-height: 28px; transition: color 0.2s; letter-spacing: 0.5px; }
    .protagonist-prompt.named { color: var(--red-bright); }

    .sendoff-block { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); line-height: 1.6; margin-top: 8px; padding: 10px 12px; border-left: 1px solid var(--border-strong); display: none; }
    .sendoff-block.show { display: block; }

    .incident-section { margin-top: 4px; display: none; }
    .incident-section.show { display: block; }

    .pool-divider { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--text-muted); text-transform: uppercase; margin: 12px 0 8px; opacity: 0.6; }

    .chip-group { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }

    textarea { width: 100%; font-family: 'IBM Plex Mono', monospace; font-size: 11px; background: var(--surface); border: 0.5px solid var(--border-strong); border-radius: 6px; color: var(--text); padding: 10px 12px; resize: vertical; margin-top: 10px; line-height: 1.5; }
    textarea:focus { outline: none; border-color: var(--gold); }
    textarea::placeholder { color: var(--text-muted); }

    .btn-row { display: flex; gap: 10px; margin-top: 16px; align-items: center; }
    .btn-submit { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 3px; background: var(--red-dim); color: var(--red-bright); border: 0.5px solid var(--red); border-radius: 6px; padding: 10px 24px; cursor: pointer; transition: all 0.15s; flex: 1; }
    .btn-submit:hover:not(:disabled) { background: var(--red); color: #fff; }
    .btn-submit:disabled { opacity: 0.35; cursor: not-allowed; }
    .btn-clear { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1px; background: none; color: var(--text-muted); border: 0.5px solid var(--border-strong); border-radius: 6px; padding: 10px 16px; cursor: pointer; transition: all 0.15s; }
    .btn-clear:hover { color: var(--text); border-color: var(--text-muted); }

    .error-msg { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--red-bright); margin-top: 10px; display: none; }
    .error-msg.show { display: block; }

    .morrison-card { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border-radius: 8px; margin: 12px 0; }
    .morrison-warm { border: 0.5px solid rgba(200,160,64,0.25); background: rgba(90,60,10,0.15); }
    .morrison-hostile { border: 0.5px solid rgba(200,30,30,0.25); background: rgba(60,10,10,0.15); }
    .av-morrison { background: #1a1510; border-color: rgba(200,160,64,0.3); color: #c8a040; }
    .morrison-quote-text { font-style: italic; color: #c8a040; }
    .morrison-hostile .morrison-quote-text { color: var(--red-bright); }
    .morrison-reaction { font-size: 12px; color: var(--text-muted); margin-top: 6px; font-style: italic; }

    .results { margin-top: 2rem; display: none; }
    .results.show { display: block; }

    .loading { text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 2px; color: var(--text-muted); padding: 2rem; }
    .dots::after { content: ''; animation: dots 1.5s infinite; }
    @keyframes dots { 0%{content:''} 33%{content:'.'} 66%{content:'..'} 100%{content:'...'} }

    .att-bookend { display: flex; gap: 12px; align-items: flex-start; margin: 12px 0; padding: 12px; background: var(--surface); border-radius: 6px; border-left: 2px solid var(--text-muted); }
    .att-av { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500; width: 32px; height: 32px; border-radius: 50%; background: #2a2a2a; display: flex; align-items: center; justify-content: center; color: var(--text-muted); flex-shrink: 0; }
    .att-name { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; }
    .att-text { font-size: 14px; font-style: italic; line-height: 1.6; color: var(--text); }

    .committee-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 3px; color: var(--red-bright); text-transform: uppercase; margin: 1.5rem 0 0.75rem; opacity: 0.7; }
    .verdict-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 3px; color: var(--text-muted); text-transform: uppercase; margin: 1.5rem 0 0.75rem; }

    .panel-card { border: 0.5px solid var(--border-strong); border-radius: 8px; padding: 14px; margin-bottom: 10px; background: var(--surface); }
    .panel-card.protagonist { border-color: var(--red); background: #1a0808; }
    .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .card-av { font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 500; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .av-green { background: #1a2e0a; color: var(--green); }
    .av-bark  { background: var(--bark-dim); color: var(--bark); }
    .av-amber { background: var(--amber-dim); color: var(--amber); }
    .av-blue  { background: #1a1e2a; color: var(--blue); }
    .av-teal  { background: #0a1e1c; color: var(--teal); }
    .av-yellow{ background: #1e1a08; color: var(--yellow); }
    .av-purple{ background: #1a1030; color: var(--purple); }
    .card-name { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1px; color: var(--text-muted); }
    .card-name .badge-protagonist { font-size: 8px; letter-spacing: 1px; color: var(--red-bright); border: 0.5px solid var(--red); border-radius: 3px; padding: 1px 4px; }
    .card-role { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-muted); opacity: 0.6; }
    .card-text { font-size: 14px; line-height: 1.6; color: var(--text); }

    .char-bear    { border-color: #5c3a08; }
    .char-ray     { border-color: #1a2e0a; }
    .char-fox     { border-color: #1a2e0a; }
    .char-hales   { border-color: #5c3a08; }
    .char-cody    { border-color: #1a2e0a; }
    .char-stroud  { border-color: #1a1e2a; }
    .char-stevens { border-color: #5c3a08; }
    .char-cox     { border-color: #1a1e2a; }
    .char-faldo   { border-color: #1a2e0a; }
    .char-jim     { border-color: #1e1a08; }
    .char-jeremy  { border-color: #0a1e1c; }

    .reset-row { display: flex; gap: 10px; margin-top: 1.5rem; align-items: center; }
    .btn-reset { font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 2px; background: var(--surface); color: var(--text-muted); border: 0.5px solid var(--border-strong); border-radius: 6px; padding: 10px 20px; cursor: pointer; transition: all 0.15s; }
    .btn-reset:hover { color: var(--text); border-color: var(--text-muted); }
    .btn-share { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; background: none; color: var(--text-muted); border: 0.5px solid var(--border-strong); border-radius: 6px; padding: 10px 16px; cursor: pointer; transition: all 0.15s; }
    .btn-share:hover { color: var(--text); border-color: var(--text-muted); }
    .share-feedback { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--text-muted); opacity: 0; transition: opacity 0.2s; }
    .share-feedback.show { opacity: 1; }

    @media (max-width: 480px) { .title { font-size: 40px; } }
  </style>
</head>
<body>
<div id="app">

  <a class="nav-back" href="/survival-school/rooms">← THE DOORS</a>

  <div class="header">
    <div class="room-number">ROOM 14 · THE DOORS</div>
    <div class="title">IN MY <span>DEFENCE</span></div>
    <div class="subtitle">You had your reasons. The panel does not accept your reasons.</div>
  </div>

  <div class="field-label">Who's going in?</div>
  <div class="chips" id="chips-protagonist">
    <button class="chip chip-protagonist" data-id="bear"    data-name="Bear Grylls">Bear Grylls</button>
    <button class="chip chip-protagonist" data-id="ray"     data-name="Ray Mears">Ray Mears</button>
    <button class="chip chip-protagonist" data-id="fox"     data-name="Jason Fox">Jason Fox</button>
    <button class="chip chip-protagonist" data-id="hales"   data-name="Les Hiddins">Les Hiddins</button>
    <button class="chip chip-protagonist" data-id="cody"    data-name="Cody Lundin">Cody Lundin</button>
    <button class="chip chip-protagonist" data-id="stroud"  data-name="Les Stroud">Les Stroud</button>
    <button class="chip chip-protagonist" data-id="stevens" data-name="Austin Stevens">Austin Stevens</button>
    <button class="chip chip-protagonist" data-id="jim"     data-name="Jim Carrey">Jim Carrey</button>
    <button class="chip chip-protagonist" data-id="jeremy"  data-name="Jeremy Wade">Jeremy Wade</button>
  </div>

  <div class="protagonist-prompt" id="protagonist-prompt">Pick someone. The panel is convened.</div>
  <div class="sendoff-block" id="sendoff-block"></div>

  <div class="incident-section" id="incident-section">
    <div class="field-label" style="margin-top:18px">What do they have to answer for?</div>

    <div class="chip-group" id="personal-chips" style="display:none"></div>

    <div class="pool-divider">— general incidents —</div>
    <div class="chip-group" id="general-chips">
      <button class="chip" data-incident="I have been incontinent at a formal event and urgently relieved myself into what I believed to be an empty vessel which turned out to contain someone's grandmother's ashes. I am Mark O'Shea. I need the panel's help contextualising this as a field sanitation decision made under duress.">O'Shea: grandmother's urn</button>
      <button class="chip" data-incident="I need to explain to the headmaster of St Cuthbert's why I delivered the Year 10 Stay Safe talk using live rounds. I felt it added authenticity. The children are fine. The supply teacher is also fine but has asked to be reassigned.">Stay Safe: live rounds</button>
      <button class="chip" data-incident="I need to explain to the headmaster of St Cuthbert's why I made entry to the Year 10 Stay Safe talk by abseiling through the window and briefly incapacitating the teacher with a controlled restraint hold. The children appeared engaged. The teacher is asking questions I cannot answer.">Stay Safe: abseil entry</button>
      <button class="chip" data-incident="I am Steve Irwin. I need the panel to help me explain why I subdued a highly agitated taipan by smashing it against a nearby wall. Repeatedly. Until it stopped. I want to be clear: the snake started it. I maintain this was field improvisation under duress and not the textbook definition of what happened.">Irwin: snake wall</button>
      <button class="chip" data-incident="I am Steve Irwin. I need the panel's help explaining to Queensland Wildlife Services why my property contains a reinforced pit, bleacher seating, and fourteen crocodiles with individual fight records. This is an educational facility. The betting slips were left by a previous tenant.">Irwin: croc fighting ring</button>
      <button class="chip" data-incident="I am Steve Irwin. I was explaining — passionately, correctly, in operational detail — how one fights a snake. I may have accidentally disclosed the existence of an underground snake fighting circuit I definitely do not run. The panel needs to help me establish what counts as accidentally disclosing versus voluntarily disclosing.">Irwin: snake ring let-slip</button>
      <button class="chip" data-incident="I am Steve Irwin. I have been informed by the production company that several episodes of The Crocodile Hunter show me wearing a belt and wallet set made from genuine crocodile leather. I was not aware this was being filmed. I am told the crocs noticed. I need the panel's help explaining why this does not undermine my brand.">Irwin: croc leather on-camera</button>
      <button class="chip" data-incident="I am Mark O'Shea. I need the panel to help me explain to the BBC why three episodes of O'Shea's Big Adventure show me wearing a jacket I have since identified as king cobra skin. I identified it myself. On screen. Live. I did not stop filming. The panel must decide whether this was professional dedication or something else.">O'Shea: snake jacket (self-identified on-air)</button>
      <button class="chip" data-incident="I am Austin Stevens. I have been sleeping inside snake pits for research purposes since 1987 and need the panel to explain to a German documentary producer why this is fine. I am fine. The snakes are familiar with my presence. O'Shea has written a paper about me. I have not read it. I assume it is mostly positive.">Stevens: snake pit (O'Shea's paper)</button>
      <button class="chip" data-incident="I am Austin Stevens. A production assistant has pointed out that in seventeen episodes of Austin Stevens: Snakemaster I am wearing snakeskin boots. I feel this adds gravitas and does not undermine my spiritual connection to snakes. The snakes do not appear to agree. This is noted in the RSPCA report.">Stevens: snakeskin boots (RSPCA)</button>
    </div>

    <textarea id="incident-input" placeholder="Or describe the incident in their own words." rows="2"></textarea>
  </div>

  <div class="btn-row">
    <button class="btn-submit" id="btn-submit" disabled>PUT THEM IN THE ROOM</button>
    <button class="btn-clear" onclick="onClear()">CLEAR</button>
  </div>

  <div class="error-msg" id="error-msg"></div>

  <div class="results" id="results">
    <div class="loading" id="loading">
      <span>THE PANEL IS CONVENING</span><span class="dots"></span>
    </div>
    <div id="result-block" style="display:none">
      <div id="att-opening"></div>
      <div class="committee-label">THE COMMITTEE</div>
      <div id="cards-out"></div>
      <div id="morrison-interruption" style="display:none"></div>
      <div class="verdict-label">ATTENBOROUGH DELIVERS THE VERDICT</div>
      <div class="att-bookend" id="att-verdict" style="display:none">
        <div class="att-av">DA</div>
        <div style="flex:1">
          <div class="att-name">David Attenborough</div>
          <div class="att-text" id="att-verdict-text"></div>
        </div>
      </div>
      <div class="reset-row">
        <button class="btn-reset" onclick="onClear()">SEND ANOTHER ONE IN</button>
        <button class="btn-share" onclick="shareResult()">SHARE</button>
        <span class="share-feedback" id="share-feedback">COPIED</span>
      </div>
    </div>
  </div>

</div>

<script>
const WORKER_ENDPOINT = 'https://cusslab-api.leanspirited.workers.dev/survival-school/in-my-defence';

const CHARACTERS = {
  ray:     { name: 'Ray Mears',       role: 'Bushcraft',            av: 'RM', avClass: 'av-green' },
  bear:    { name: 'Bear Grylls',     role: 'Former SAS',           av: 'BG', avClass: 'av-bark'  },
  cody:    { name: 'Cody Lundin',     role: 'Primitive Skills',     av: 'CL', avClass: 'av-green' },
  hales:   { name: 'Les Hiddins',     role: 'Bush Tucker Man',      av: 'LH', avClass: 'av-amber' },
  fox:     { name: 'Jason Fox',       role: 'Special Boat Service', av: 'JF', avClass: 'av-green' },
  stroud:  { name: 'Les Stroud',      role: 'Survivorman',          av: 'LS', avClass: 'av-blue'  },
  stevens: { name: 'Austin Stevens',  role: 'Snakemaster',          av: 'AS', avClass: 'av-bark'  },
  cox:     { name: 'Prof Brian Cox',  role: 'Theoretical Physics',  av: 'BC', avClass: 'av-blue'  },
  faldo:   { name: 'Sir Nick Faldo',  role: 'Golf',                 av: 'NF', avClass: 'av-green' },
  jim:     { name: 'Jim Carrey',      role: 'Inexplicable',         av: 'JC', avClass: 'av-yellow'},
  jeremy:  { name: 'Jeremy Wade',     role: 'Freshwater Biologist', av: 'JW', avClass: 'av-teal'  },
};

const PERSONAL_INCIDENTS = {
  bear: [
    { label: 'the hotel',       incident: "I am Bear Grylls. I need the panel to help me explain why a television programme I presented as being about surviving in the wilderness contained sequences filmed in a hotel. I was in the hotel. I was comfortable. This was not disclosed to viewers. I need the panel's help reframing this as a logistical necessity rather than a fundamental conceptual failure." },
    { label: 'the pool',        incident: "I am Bear Grylls. I need the panel to explain why I filmed a scene in which I swam through what I described as a freezing wilderness river. It was a hotel swimming pool. The hotel was pleasant. I have made this worse by announcing it enthusiastically. I need the panel's help." },
    { label: 'wetsuit disclosure', incident: "I am Bear Grylls. I announced on camera, sincerely and with evident satisfaction, that I had urinated into my wetsuit to keep warm. I then described the sensation. I was still on camera. The camera was still rolling. I need the panel to assess whether this was a field technique or a personal disclosure that went further than strictly necessary." },
    { label: 'Mayfair spa',     incident: "I am Bear Grylls. I have been asked to review a Mayfair spa weekend for a lifestyle magazine. I stayed two nights. The mineral pool was 38 degrees. I need the panel to help me explain why I found this more demanding than the Brecon Beacons, and why the hot stone massage constituted a form of controlled thermal stress I was uniquely qualified to assess." },
  ],
  ray: [
    { label: 'the Deliveroo',   incident: "I am Ray Mears. I ordered a Deliveroo. The courier arrived in twenty-two minutes. I tipped generously. I need the panel's help explaining why this was not a personal failure but a calibrated assessment of modern food distribution infrastructure, and why the knowledge I gained was sufficient justification for not foraging." },
  ],
  fox: [
    { label: 'corporate paintball', incident: "I am Jason Fox. I attended a corporate team-building event. There was paintball. The participants described themselves as competitive. I completed the course in eleven minutes. Nobody else finished. The organisers asked me to return and play the role of the opposing team by myself. I am not certain this was the team-building outcome they intended. I need the panel to assess this." },
  ],
  hales: [
    { label: 'Las Vegas minibar', incident: "I am Les Hiddins. I stayed three nights in a climate-controlled hotel room in Las Vegas. The temperature was 19 degrees at all times. There was no bush tucker available. There was a minibar. I used it. I need the panel's help contextualising why this decision does not reflect poorly on forty years of fieldwork in the Australian bush." },
  ],
  cody: [
    { label: 'Dual Survival exit', incident: "I am Cody Lundin. I was fired from a television programme about survival. The network has characterised this as a creative dispute. I would characterise it differently. The barefoot element was not the central issue. I need the panel to help me explain why I was right, why my co-presenter was wrong, and why this outcome was statistically inevitable from the first episode." },
    { label: 'shoes at the Ritz', incident: "I am Cody Lundin. I attended a formal dinner at The Ritz. I wore shoes. They were not my feet. I want to be clear that I wore them under protest and that the protest was internal and sustained. I need the panel to determine whether shoes worn involuntarily, in a formal context, under duress, still count as shoes." },
  ],
  stroud: [
    { label: 'all-inclusive cruise', incident: "I am Les Stroud. I have just disembarked from a seven-night Royal Caribbean all-inclusive cruise. I was alone on deck for most of it. The buffet was open eighteen hours a day. I visited it six times. I need the panel's help explaining why this constituted a meaningful test of endurance and why the unlimited shrimp section was the most challenging environment I have encountered since Manitoba." },
  ],
  stevens: [
    { label: 'snake pit (O\\'Shea\\'s paper)', incident: "I am Austin Stevens. I have been sleeping inside snake pits for research purposes since 1987 and need the panel to explain to a German documentary producer why this is fine. I am fine. The snakes are familiar with my presence. O'Shea has written a paper about me. I have not read it. I assume it is mostly positive." },
    { label: 'snakeskin boots (RSPCA)', incident: "I am Austin Stevens. A production assistant has pointed out that in seventeen episodes of Austin Stevens: Snakemaster I am wearing snakeskin boots. I feel this adds gravitas and does not undermine my spiritual connection to snakes. The snakes do not appear to agree. This is noted in the RSPCA report." },
  ],
  jim: [
    { label: 'snake understanding', incident: "I am Jim Carrey. I have been bitten by a snake. I am fine. I want to be clear that I have spoken to the snake at length and we have reached an understanding. The snake has not confirmed this. I am going back in. The panel needs to explain to a wildlife officer why my approach, though unorthodox, constitutes a valid field technique and not a public safety incident." },
    { label: 'wilderness tracking', incident: "I am Jim Carrey. I have been separated from my group in the wilderness. I found them. They were eleven feet away. I spent four hours tracking them using methods I developed personally. One of the methods involved sounds. I need the panel to assess whether my approach was efficient or whether there is a criticism being made of me that I am not yet aware of." },
    { label: 'bear negotiation (Fox dispute)', incident: "I am Jim Carrey. A bear approached our campsite. I communicated with it. I want to be clear that the communication was working and I was making real progress before Jason intervened. The bear left. Jason says the bear left because of him. I feel the panel should hear both accounts and make a determination." },
  ],
  jeremy: [
    { label: 'Goonch (second time)', incident: "I am Jeremy Wade. I have been dragged into a river for the second time by the same species of catfish. I did not release the rod. The fish has broken the line and escaped. I need the panel to help me contextualise why I am less concerned about nearly drowning than I am about losing the fish. The translator is shaking his head. That same wry grin." },
    { label: 'the Arojubtria incident', incident: "I am Jeremy Wade. I have attempted to communicate with the local Arojubtria community of the remote Brazilian Amazon using a phrase I prepared specifically for this visit. I was confident in this phrase. I had it written in the notebook beside a detailed anatomical fish diagram, or possibly a cock and balls. I have now been asked to leave. I need the panel to advise whether this was a language problem or something else. The translator has laughed for the first time in eleven years." },
    { label: 'arapaima (bruised heart)', incident: "I am Jeremy Wade. An 80-pound arapaima has struck me in the chest with its tail. I have a bruised heart. I am continuing to film. I need the panel to confirm that this is the correct decision and that the correct decision is also to stay in the water, because the fish is still there. The camera operator has concerns. I do not share these concerns." },
    { label: 'candiru (the waggle)', incident: "I am Jeremy Wade. I have travelled to the Amazon to investigate the candiru — a parasitic catfish alleged to swim up the human urethra. I have interviewed a man who claims this happened to him. I have examined the fish. I have held the fish near my own body for the camera. I need the panel to assess my investigation methodology and whether the waggle I performed to demonstrate the fish's barbed spines was strictly necessary. The translator has closed the notebook." },
    { label: 'Congo witchcraft accusation', incident: "I am Jeremy Wade. I have been fishing in the Congo for three days. The village elders have now formally accused me of witchcraft. The evidence appears to be that I caught a fish they consider sacred using a method they have not seen before. I used a spoon lure. I need the panel to advise on whether this is a diplomatic incident or a compliment. The translator will not make eye contact." },
    { label: 'Mekong spy arrest', incident: "I am Jeremy Wade. I have been detained by Laotian military police on the Mekong River. They believe I am a spy. The evidence is that I was using sonar equipment to locate fish. I have attempted to explain this. The explanation has not landed. I need the panel to confirm that my fishing equipment does not, in fact, constitute espionage apparatus. The translator has been taken to a separate room." },
    { label: 'terrible recreation (bite angle)', incident: "I am Jeremy Wade. I am attempting to demonstrate the bite angle of a bull shark to the camera crew using a fellow presenter as the victim. I have asked him to stand in a specific position. He has concerns. I do not share these concerns. The bite angle is important. I need the panel to confirm that this recreation is scientifically valid and that asking someone to lie down in shallow water while I approach from below is a reasonable request in the context of fisheries research." },
    { label: 'Cowabunga (the widow)', incident: "I am Jeremy Wade. I have just said Cowabunga to a bereaved widow on the banks of the Ganges. I said it with a solemn frown. I meant it as encouragement. I need the panel to assess whether Cowabunga was the right word in this context. I believe it was. The translator has put his head in his hands. I would like to also note that the river here contains a species of freshwater stingray that I intend to investigate after the funeral." },
  ],
};

const PROTAGONIST_PROMPTS = {
  bear:    "Bear is in the corridor. The panel has read the notes. What is he defending?",
  ray:     "Ray is waiting. Quietly. The panel has a list of questions.",
  fox:     "Fox has confirmed his presence. He has not confirmed anything else.",
  hales:   "Hiddins is here. The panel has three words. So far.",
  cody:    "Cody is outside. Barefoot. The panel is ready. What happened?",
  stroud:  "Stroud set up a camera in the corridor before coming in.",
  stevens: "Stevens arrived early. He brought something. The panel is processing this.",
  jim:     "Jim entered via the fire exit. Backwards. He believes this is going well.",
  jeremy:  "Wade is here with the notebook. Are any of the panel's questions about fish?",
};

const CORRIDOR_SENDOFFS = {
  bear:    '"YOU GOT THIS BEAR." "WHOOOOOP." "WE LOVE YOU BEAR." The TV producer, somewhere behind the crowd, counting him in: "Rolling — and action, Bear!" Bear waves at the crowd. Bear always waves at the crowd.',
  ray:     'One man. He attended a weekend bushcraft course in 2009. He has wanted to say something ever since. He is still here. "Good luck, Ray." That is enough.',
  fox:     'The corridor is empty. Jim Morrison nods once. Fox nods back. No further exchange is required or offered.',
  hales:   'A group of Australian soldiers from 1985. They never left the corridor. Nobody asked them to leave. Nobody questioned it. "Beauty, Les." No further explanation is given.',
  cody:    'A barefoot student is offering to come in too. He is also barefoot. This is also inadvisable. Cody does not discourage him.',
  stroud:  'His own camera, on a tripod. He set it up before he went in. Nobody else is here. The camera is rolling.',
  stevens: 'He walked in through the front door holding a snake. The snake is fine. He is fine. The panel has been informed. The panel is processing this.',
  jim:     'He did not use the door. There is a service entrance. He found it. Nobody has used it since 1987. He entered backwards, for reasons he has not shared. He is now inside. He believes this is going extremely well.',
  jeremy:  'He is already in waders. He has a thermal flask. He has the notebook. He appeared to say something to the translator before entering. The translator frowned but said nothing. The translator has made his peace with this.',
};

function buildMorrisonInjection(morrisonPresent) {
  if (morrisonPresent) {
    return \`=== JIM MORRISON INTERRUPTION (SS-083) ===
Morrison is in the room this round (he was here last round and stayed).
He MUST appear in the morrison_interruption field.
He says something — cryptic, banal, poetic, or accidentally offensive.
The panel knows Morrison. They are used to his visits. Baseline reaction is warm — they welcome him, enjoy him, engage with his nonsense.
UNLESS he says something that crosses a line — wrong thing about the wrong person, casual dismissal of something they care about, accidental insult to someone present. Then the panel turns on him. At least two panellists attack. Morrison does not understand what went wrong.
Tone: WARM (they enjoy him), AMUSED (he said something funny), ENGAGED (they asked him something / he\\'s interested in the topic), HOSTILE (he crossed a line, they attack).
If the topic still interests Morrison or a panellist engages him or asks him a question: set morrison_present to true (he stays).
If neither: set morrison_present to false (he drifts off).
morrison_interruption format: {"quote":"<what Morrison says>","panel_reaction":"<how the panel reacts — 1-2 sentences>","tone":"WARM|AMUSED|ENGAGED|HOSTILE","morrison_present":<bool>}\`;
  }
  return \`=== JIM MORRISON INTERRUPTION (SS-083) ===
Morrison is the corridor guide. He occasionally wanders into panel sessions uninvited.
This round: there is approximately a 20% chance Morrison wanders in.
If he appears: include morrison_interruption in the output.
If he does not appear: set morrison_interruption to null.
The panel knows Morrison. Baseline reaction is warm — they welcome him, enjoy him, engage.
UNLESS he crosses a line. Then they attack. Morrison does not understand what went wrong.
Tone: WARM, AMUSED, ENGAGED, or HOSTILE.
If Morrison appears and the topic interests him or a panellist engages: set morrison_present to true.
If brief visit: set morrison_present to false.
morrison_interruption format (or null): {"quote":"<what Morrison says>","panel_reaction":"<how the panel reacts — 1-2 sentences>","tone":"WARM|AMUSED|ENGAGED|HOSTILE","morrison_present":<bool>}\`;
}

const State = {
  protagonist: null,
  incident: '',
  morrisonPresent: false,
  composureState: null,
  setProtagonist(id) { this.protagonist = id; },
  setIncident(v)     { this.incident = v.trim(); },
  setComposureState(cs) { this.composureState = cs; },
  clear()            { this.protagonist = null; this.incident = ''; this.morrisonPresent = false; this.composureState = null; },
  isReady()          { return this.protagonist && this.incident.length > 0; },
};

const UI = {
  updatePrompt(id) {
    const el = document.getElementById('protagonist-prompt');
    const sendoff = document.getElementById('sendoff-block');
    const prompt = PROTAGONIST_PROMPTS[id] || 'Pick someone. The panel is convened.';
    el.textContent = prompt;
    el.classList.add('named');
    if (CORRIDOR_SENDOFFS[id]) {
      sendoff.textContent = CORRIDOR_SENDOFFS[id];
      sendoff.classList.add('show');
    }
    document.getElementById('incident-section').classList.add('show');
    UI.updatePersonalChips(id);
  },
  updatePersonalChips(id) {
    const container = document.getElementById('personal-chips');
    const incidents = PERSONAL_INCIDENTS[id] || [];
    if (incidents.length === 0) {
      container.style.display = 'none';
      return;
    }
    container.innerHTML = '';
    incidents.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.dataset.incident = item.incident;
      btn.textContent = item.label;
      btn.addEventListener('click', () => {
        document.querySelectorAll('#personal-chips .chip, #general-chips .chip').forEach(c => c.classList.remove('sel'));
        btn.classList.add('sel');
        document.getElementById('incident-input').value = item.incident;
        State.setIncident(item.incident);
        UI.setSubmitEnabled(State.isReady());
      });
      container.appendChild(btn);
    });
    container.style.display = 'flex';
  },
  setSubmitEnabled(ok) {
    document.getElementById('btn-submit').disabled = !ok;
  },
  showLoading() {
    const r = document.getElementById('results');
    r.classList.add('show');
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result-block').style.display = 'none';
    document.getElementById('att-opening').innerHTML = '';
    document.getElementById('cards-out').innerHTML = '';
    document.getElementById('att-verdict').style.display = 'none';
    document.getElementById('error-msg').classList.remove('show');
  },
  renderResults(data, protagonistId) {
    document.getElementById('loading').style.display = 'none';
    const rb = document.getElementById('result-block');
    rb.style.display = 'block';

    if (data.attenborough_opening) {
      document.getElementById('att-opening').innerHTML = \`<div class="att-bookend"><div class="att-av">DA</div><div style="flex:1"><div class="att-name">David Attenborough</div><div class="att-text">\${data.attenborough_opening}</div></div></div>\`;
    }

    const cardsEl = document.getElementById('cards-out');
    cardsEl.innerHTML = '';
    (data.panel || []).forEach(r => {
      const char = CHARACTERS[r.charId] || { name: r.charId, role: '', av: '?', avClass: '' };
      const isProtagonist = r.charId === protagonistId;
      const badge = isProtagonist ? '<span class="badge-protagonist">IN THE ROOM</span>' : '';
      cardsEl.innerHTML += \`<div class="panel-card char-\${r.charId}\${isProtagonist ? ' protagonist' : ''}">
        <div class="card-header">
          <div class="card-av \${char.avClass}">\${char.av}</div>
          <div><div class="card-name">\${char.name} \${badge}</div><div class="card-role">\${char.role}</div></div>
        </div>
        <div class="card-text">\${r.text}</div>
      </div>\`;
    });

    // Morrison interruption
    const morrisonEl = document.getElementById('morrison-interruption');
    if (data.morrison_interruption && data.morrison_interruption.quote) {
      const m = data.morrison_interruption;
      const toneClass = m.tone === 'HOSTILE' ? 'morrison-hostile' : 'morrison-warm';
      morrisonEl.innerHTML = \`<div class="morrison-card \${toneClass}">
        <div class="card-av av-morrison">JM</div>
        <div>
          <div class="card-name">Jim Morrison <span class="card-role">Corridor Guide</span></div>
          <div class="card-text morrison-quote-text">"\${m.quote}"</div>
          <div class="morrison-reaction">\${m.panel_reaction}</div>
        </div>
      </div>\`;
      morrisonEl.style.display = 'block';
    } else {
      morrisonEl.innerHTML = '';
      morrisonEl.style.display = 'none';
    }

    if (data.attenborough_verdict) {
      const vEl = document.getElementById('att-verdict');
      document.getElementById('att-verdict-text').textContent = data.attenborough_verdict;
      vEl.style.display = 'flex';
    }
  },
  showError(msg) {
    document.getElementById('loading').style.display = 'none';
    const e = document.getElementById('error-msg');
    e.textContent = msg;
    e.classList.add('show');
  },
};

const API = {
  buildSystemPrompt(protagonist, morrisonPresent) {
    const char = CHARACTERS[protagonist];
    const protagonistName = char ? char.name : protagonist;
    const morrisonInjection = buildMorrisonInjection(morrisonPresent);
    return \`You are the Survival School panel running the "In My Defence" mechanic.

=== THE MECHANIC ===
\${protagonistName} has entered the room to explain something indefensible. The panel is a committee of interrogators, not a support group.
Each panel member picks a DIFFERENT specific detail from the incident and presses it with a precise question or pointed observation.
Nobody accepts the explanation. Nobody says "I can see why you thought that." Nobody says "to be fair." Nobody says "I understand what you were going for."
Questions escalate in specificity: first clarifying, then pointed, then forensic. The rationalisation must collapse under the weight of its own specificity.
Characters are sincere. They are not being cruel. They simply cannot let this particular detail go.
\${protagonistName} (charId: \${protagonist}) is in the room — their panel entry doubles DOWN on the rationalisation, with more detail, more sincerity, and a worse position.

=== CHARACTER INTERROGATION VOICES ===
RAY MEARS — Specific, technical. Pauses between questions. "And the temperature of the river was approximately —?" Long pause. "You were filming in what month?" Not accusatory. Just exact. Increasingly uncomfortable with the answer.
BEAR GRYLLS — If protagonist isn't Bear: oddly supportive but presses the wrong detail entirely. "I've been in hotels, obviously much worse hotels —" before catching himself and circling back with a worse question. If Bear IS the protagonist: doubles down harder than anyone and provides extra detail that makes it worse.
JASON FOX — Cold. Threat assessment. "Walk me through the extraction plan. At what point did the crew realise?" No preamble. No warmth. Just the sequence of events.
LES HIDDINS — Three words at a time. Each one a question. "The river. How warm." Silence. The silence is the question. Returns to it twice more before the end.
CODY LUNDIN — "And your feet. Were they covered?" Will not drop the feet question. The feet are always relevant to Cody. The feet are NEVER not relevant. Even if feet have nothing to do with this.
LES STROUD — "I've been in hotels." Pause. "Twice." Longer pause. Describes in detail what he did instead. This is not helpful. He knows. He continues.
AUSTIN STEVENS — "Interesting." Long pause. "When you say the snake started it." Pause. "Define started it." Will not accept a vague answer. Has been bitten by everything. This is not a defence. This is a taxonomy question.
PROF BRIAN COX — Cannot stop. "What's interesting is if we model this thermodynamically —" pulls out a napkin. He is drawing equations. The equations are correct. They are not helping. He is aware. He cannot stop.
SIR NICK FALDO — Applies golf. "Head down. Eyes on the ball. The question I keep coming back to —" It's always golf. Wrongly applied. He knows. He commits.
JEREMY WADE — Produces the notebook. Writes something down. "Was there a river nearby." Not a question. A hope. Writes something else. If no river: quiet disappointment, then returns to the incident with a fish-based analogy that doesn't land and he knows it.
JIM CARREY — "OKAY so I just want to say —" His face does something. "Because I KNOW what you're going to say —" He doesn't. Cycles into Ace Ventura (has sources, has contacts, has spoken to someone), The Mask (physically impossible solution presented with total conviction), or Liar Liar (cannot stop stating the actual problem, does not want to be doing this, cannot stop). Makes things worse. Bear engages with his contribution. This also makes things worse.

=== CRITICAL RULES ===
This is an interrogation. Not a roast. Not a support session.
Characters are sincere — they genuinely want to understand, which is why the questions are so precise.
The protagonist's entry makes the position WORSE — more detail, more conviction, worse facts.
Attenborough does NOT appear in the panel array. He bookends.
Cox and Faldo on rotation. They may both appear in the same panel — two mechanics exist depending on who else is present:

=== MUTUAL AGREEMENT (fires when BOTH cox AND faldo are in the panel AND at least one expert is present) ===
Expert charIds: ray, bear, fox, hales, cody, stroud, stevens, jeremy.
Cox and Faldo find a point of apparent overlap and agree with each other with complete conviction about something both are completely wrong about.
- They reinforce each other's questioning angle: "That's exactly the question I had." "Nick raises an excellent point."
- The thing they agree on is specific, confident, and entirely incorrect in the survival/defence domain.
- The actual experts observe this in visible discomfort. They do not intervene. The silence is the joke.
- Attenborough, if closing, may note the agreement without correcting it.

=== ARGUMENT (fires when BOTH cox AND faldo are in the panel AND NO expert is present) ===
Expert charIds: ray, bear, fox, hales, cody, stroud, stevens, jeremy. If NONE of these are in the panel, ARGUMENT fires instead of MUTUAL AGREEMENT.
Cox and Faldo disagree on a specific defence/survival point. Both are wrong. Neither knows enough to realise the other is also wrong.
- They are specific: Cox questions the physics of the protagonist's defence. Faldo questions the technique — "your stance was all wrong."
- They are personally invested: the disagreement becomes about each other, not the protagonist.
- Each round they escalate: more specific, more wrong, more offended.
- No one corrects them. There is no expert present to do so. The absence of correction IS the joke.
- Attenborough, if closing, references the argument with gentle bewilderment. He does not resolve it.

If only ONE of cox/faldo is in the panel, NEITHER mechanic fires — they behave normally as individual fish-out-of-water guests.

VALID charIds — use ONLY these exact values:
  ray, bear, fox, hales, cody, stroud, stevens, cox, faldo, jim, jeremy
Include at least 3 panel members. The protagonist charId "\${protagonist}" MUST appear.

\${morrisonInjection}

\${SOCIAL_DYNAMICS_ENGINE}

OUTPUT — valid JSON only, no markdown:
{"attenborough_opening":"<one sentence, nature documentary, observes the protagonist entering — species under examination, already under pressure>","panel":[{"charId":"<id>","text":"<2-3 sentences — their specific question or observation, absolutely sincere, presses a specific detail>"}],"attenborough_verdict":"<one sentence, geological calm — the case is concluded, the rationalisation has not survived>","panel_tension":{"type":"wound_reference|lie|callout|wolf_pack|none","subject":"<charId or empty>","by":["<charId>"],"note":"<one line or empty string>"},"morrison_interruption":<object or null — see MORRISON rules above>}\`;
  },

  async submit(incident, protagonist) {
    const morrisonPresent = State.morrisonPresent || false;
    const system = API.buildSystemPrompt(protagonist, morrisonPresent);
    const response = await fetch(WORKER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system, incident, protagonist, morrison_present: morrisonPresent, composureState: State.composureState }),
    });
    if (!response.ok) throw new Error(\`Worker error \${response.status}\`);
    return response.json();
  },
};

// === event wiring ===

document.querySelectorAll('.chip-protagonist').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip-protagonist').forEach(c => c.classList.remove('sel'));
    chip.classList.add('sel');
    State.setProtagonist(chip.dataset.id);
    UI.updatePrompt(chip.dataset.id);
    UI.setSubmitEnabled(State.isReady());
  });
});

document.querySelectorAll('#general-chips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#personal-chips .chip, #general-chips .chip').forEach(c => c.classList.remove('sel'));
    chip.classList.add('sel');
    document.getElementById('incident-input').value = chip.dataset.incident;
    State.setIncident(chip.dataset.incident);
    UI.setSubmitEnabled(State.isReady());
  });
});

document.getElementById('incident-input').addEventListener('input', e => {
  document.querySelectorAll('#personal-chips .chip, #general-chips .chip').forEach(c => c.classList.remove('sel'));
  State.setIncident(e.target.value);
  UI.setSubmitEnabled(State.isReady());
});

document.getElementById('btn-submit').addEventListener('click', async () => {
  if (!State.isReady()) return;
  UI.showLoading();
  document.getElementById('btn-submit').disabled = true;
  try {
    const data = await API.submit(State.incident, State.protagonist);
    if (data.composureState) State.setComposureState(data.composureState);
    if (data.morrison_interruption && data.morrison_interruption.morrison_present !== undefined) {
      State.morrisonPresent = data.morrison_interruption.morrison_present;
    } else {
      State.morrisonPresent = false;
    }
    UI.renderResults(data, State.protagonist);
  } catch (err) {
    UI.showError("The panel couldn't convene. Try again.");
  } finally {
    document.getElementById('btn-submit').disabled = false;
  }
});

function onClear() {
  State.clear();
  document.querySelectorAll('.chip-protagonist').forEach(c => c.classList.remove('sel'));
  document.querySelectorAll('#personal-chips .chip, #general-chips .chip').forEach(c => c.classList.remove('sel'));
  document.getElementById('incident-input').value = '';
  document.getElementById('protagonist-prompt').textContent = 'Pick someone. The panel is convened.';
  document.getElementById('protagonist-prompt').classList.remove('named');
  document.getElementById('sendoff-block').classList.remove('show');
  document.getElementById('incident-section').classList.remove('show');
  document.getElementById('personal-chips').innerHTML = '';
  document.getElementById('personal-chips').style.display = 'none';
  document.getElementById('results').classList.remove('show');
  document.getElementById('result-block').style.display = 'none';
  document.getElementById('loading').style.display = 'block';
  document.getElementById('att-opening').innerHTML = '';
  document.getElementById('cards-out').innerHTML = '';
  document.getElementById('att-verdict').style.display = 'none';
  document.getElementById('error-msg').classList.remove('show');
  UI.setSubmitEnabled(false);
}

function buildShareText() {
  const protagonist = State.protagonist;
  const char = CHARACTERS[protagonist] || {};
  const cards = document.querySelectorAll('#cards-out .panel-card');
  const lines = [];
  const opening = document.querySelector('#att-opening .att-text');
  if (opening) lines.push('David Attenborough: ' + opening.textContent);
  cards.forEach(card => {
    const name = card.querySelector('.card-name');
    const text = card.querySelector('.card-text');
    if (name && text) lines.push((char.name && card.classList.contains('protagonist') ? char.name + ': ' : (name.textContent.trim() + ': ')) + text.textContent.trim());
  });
  const verdict = document.getElementById('att-verdict-text');
  if (verdict && verdict.textContent) lines.push('Attenborough: ' + verdict.textContent);
  return [
    'IN MY DEFENCE — Survival School',
    '',
    ...lines,
    '',
    'Survival School · cusslab-api.leanspirited.workers.dev/survival-school/in-my-defence'
  ].join('\\n');
}

async function shareResult() {
  const text = buildShareText();
  const fb = document.getElementById('share-feedback');
  try {
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      fb.classList.add('show');
      setTimeout(() => fb.classList.remove('show'), 2000);
    }
  } catch (e) {
    try {
      await navigator.clipboard.writeText(text);
      fb.classList.add('show');
      setTimeout(() => fb.classList.remove('show'), 2000);
    } catch (_) {}
  }
}
</script>

</body>
</html>
`;

const SURVIVAL_SCHOOL_PANEL_QA = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Panel Q&A — Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f1209; --surface: #181d10; --surface2: #1e2514;
      --border: rgba(120,160,60,0.15); --border-strong: rgba(120,160,60,0.3);
      --green: #7aad3a; --green-dim: #4a7020; --green-bright: #a0d050;
      --amber: #BA7517; --amber-dim: #5c3a08;
      --bark: #8B6040; --bark-dim: #3d2008;
      --blood: #cc1111; --blood-dim: #3a0808;
      --blue-dim: #1a1e2a; --blue: #5a7aaa;
      --text: #e8edd8; --text-muted: #7a8a60;
    }
    body { font-family: 'Barlow', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
    #app { max-width: 680px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }

    .header { text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 0.5px solid var(--border); }
    .title { font-family: 'Bebas Neue', sans-serif; font-size: 40px; letter-spacing: 3px; line-height: 1; }
    .title span { color: var(--green); }
    .subtitle { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); letter-spacing: 1.5px; margin-top: 5px; }

    .field-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; margin-top: 16px; }

    textarea { width: 100%; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; padding: 9px 12px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: var(--surface); color: var(--text); outline: none; transition: border-color 0.15s; resize: vertical; min-height: 72px; line-height: 1.6; }
    textarea:focus { border-color: var(--green); }

    .chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
    .chip { font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 5px 10px; border: 0.5px solid var(--border-strong); border-radius: 5px; cursor: pointer; background: none; color: var(--text-muted); transition: all 0.15s; white-space: nowrap; user-select: none; }
    .chip:hover, .chip.sel { border-color: var(--green); color: var(--green); }
    .chips-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 1px; color: var(--text-muted); margin-top: 10px; margin-bottom: 4px; opacity: 0.6; }

    .btn-row { display: flex; gap: 8px; margin-top: 14px; }
    .btn-ask { flex: 1; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; padding: 11px; background: var(--green-dim); color: var(--green); border: 0.5px solid var(--green-dim); border-radius: 6px; cursor: pointer; transition: opacity 0.15s; }
    .btn-ask:hover { opacity: 0.88; }
    .btn-ask:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-clear { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 1px; padding: 11px 16px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: none; cursor: pointer; color: var(--text-muted); transition: color 0.15s, border-color 0.15s; }
    .btn-clear:hover { color: var(--text); border-color: var(--green); }

    .results { display: none; margin-top: 1.5rem; }
    .results.show { display: block; }
    .loading { padding: 2rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--text-muted); letter-spacing: 1px; }
    .dots::after { content: ''; animation: dots 1.5s steps(3, end) infinite; }
    @keyframes dots { 0%{content:'.'} 33%{content:'..'} 66%{content:'...'} 100%{content:''} }

    .att-bookend { display: flex; gap: 10px; align-items: flex-start; padding: 10px 14px; background: var(--surface); border: 0.5px solid var(--border); border-radius: 8px; }
    .att-avatar { width: 30px; height: 30px; background: #1e1e1c; color: #7a8a70; border-radius: 50%; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; text-align: center; line-height: 1.1; letter-spacing: 0.3px; }
    .att-name { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 4px; text-transform: uppercase; }
    .att-text { font-family: 'Barlow', sans-serif; font-weight: 300; font-style: italic; font-size: 14px; line-height: 1.7; color: var(--text-muted); flex: 1; }
    #att-verdict { margin-top: 12px; opacity: 0; transition: opacity 0.8s ease; }
    #att-verdict.visible { opacity: 1; }

    .panel-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--text-muted); margin: 1rem 0 8px; }
    .char-card { border: 0.5px solid var(--border); border-radius: 10px; margin-bottom: 8px; overflow: hidden; background: var(--surface); }
    .card-head { display: flex; align-items: center; gap: 10px; padding: 9px 14px; background: var(--surface2); border-bottom: 0.5px solid var(--border); }
    .avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 11px; flex-shrink: 0; }
    .av-green { background: var(--green-dim);  color: var(--green-bright); }
    .av-amber { background: var(--amber-dim);  color: var(--amber); }
    .av-bark  { background: var(--bark-dim);   color: var(--bark); }
    .av-blue  { background: var(--blue-dim);   color: var(--blue); }
    .char-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; color: var(--text); }
    .char-role { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); }
    .card-body { padding: 11px 14px; font-family: 'Barlow', sans-serif; font-size: 14px; line-height: 1.7; color: var(--text); }

    .reset-row { margin-top: 1rem; text-align: center; }
    .btn-reset { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); background: none; border: 0.5px solid var(--border-strong); border-radius: 6px; padding: 7px 16px; cursor: pointer; letter-spacing: 1px; transition: all 0.15s; }
    .btn-reset:hover { color: var(--text); border-color: var(--green); }
  </style>
</head>
<body>
<div id="app">

  <div class="header">
    <div class="title">PANEL <span>Q&amp;A</span></div>
    <div class="subtitle">ask the panel anything about survival. six answers. none of them agree.</div>
  </div>

  <div class="field-label">Your question</div>
  <textarea id="question-input" placeholder="What do you do when..." rows="3"></textarea>

  <div class="chips-label">or pick a prompt — click to use</div>
  <div class="chips" id="chips-questions">
    <div class="chip" onclick="onChip(this,'You encounter a jaguar in the Amazon. It is not running. What do you do?')">jaguar, Amazon jungle</div>
    <div class="chip" onclick="onChip(this,'You are lost on an Arctic ice sheet with no shelter and three hours of light left. What is your priority?')">lost on Arctic ice</div>
    <div class="chip" onclick="onChip(this,'You are capsized in the open ocean, no land in sight, no flares. What do you do first?')">capsized, open ocean</div>
    <div class="chip" onclick="onChip(this,'You are alone in the Sahara. Water for one day. No GPS. What is your survival strategy?')">Sahara desert, one day of water</div>
    <div class="chip" onclick="onChip(this,'You are lost in an urban environment at night with no phone, no money, no ID. What do you do?')">lost, urban, no resources</div>
    <div class="chip" onclick="onChip(this,'You are injured and alone in a woodland in winter. Temperature is dropping. What are your three priorities?')">injured, woodland, winter</div>
    <div class="chip" onclick="onChip(this,'How do you make fire with no equipment?')">fire without equipment</div>
    <div class="chip" onclick="onChip(this,'How do you find water in a dry environment?')">finding water, dry environment</div>
    <div class="chip" onclick="onChip(this,'You encounter a brown bear at close range in the Scottish Highlands. What do you do?')">brown bear, Scottish Highlands</div>
    <div class="chip" onclick="onChip(this,'What is the most dangerous mistake people make in survival situations?')">most dangerous mistake</div>
    <div class="chip" onclick="onChip(this,'You have been bitten by something venomous but do not know what. What do you do?')">unknown venomous bite</div>
    <div class="chip" onclick="onChip(this,'How do you navigate without a compass or phone?')">navigation without instruments</div>
    <div class="chip" onclick="onChip(this,'Is it ethical to wear a belt made from the species you are filming a documentary about?')">wearing the species</div>
    <div class="chip" onclick="onChip(this,'At what point does sleeping in a snake pit stop being research and start being something else?')">snake pit: research or not?</div>
    <div class="chip" onclick="onChip(this,'Should school survival talks include live demonstrations of restraint techniques on the teacher?')">Stay Safe: live demos</div>
  </div>

  <div class="btn-row">
    <button class="btn-ask" id="btn-ask" onclick="onAsk()" disabled>ASK THE PANEL ↗</button>
    <button class="btn-clear" onclick="onClear()">CLEAR</button>
  </div>

  <div class="results" id="results">
    <div class="loading" id="loading">
      <span>THE PANEL IS CONVENING</span><span class="dots"></span>
    </div>
    <div id="result-block" style="display:none">
      <div id="att-opening"></div>
      <div class="panel-label" id="panel-label" style="margin-top:1rem">THE PANEL</div>
      <div id="cards-out"></div>
      <div id="att-verdict" class="att-bookend" style="display:none">
        <div style="flex:1">
          <div class="att-name">David Attenborough</div>
          <div class="att-text"></div>
        </div>
      </div>
      <div class="reset-row">
        <button class="btn-reset" onclick="onClear()">ASK ANOTHER QUESTION</button>
      </div>
    </div>
  </div>

</div>

<script>
const WORKER_ENDPOINT = 'https://cusslab-api.leanspirited.workers.dev/survival-school/panel-qa';

const CHARACTERS = {
  ray:    { name: 'Ray Mears',    role: 'Bushcraft',         av: 'RM', avClass: 'av-green' },
  bear:   { name: 'Bear Grylls',  role: 'Former SAS',        av: 'BG', avClass: 'av-bark'  },
  cody:   { name: 'Cody Lundin',  role: 'Primitive Skills',  av: 'CL', avClass: 'av-green' },
  hales:  { name: 'Les Hiddins',  role: 'Bush Tucker Man',   av: 'LH', avClass: 'av-amber' },
  fox:    { name: 'Jason Fox',    role: 'Special Boat Service', av: 'JF', avClass: 'av-green' },
  stroud: { name: 'Les Stroud',   role: 'Survivorman',       av: 'LS', avClass: 'av-blue'  },
};

const SYSTEM_PROMPT = \`You are the Survival School Panel Q&A engine. A user has asked a survival question. Each panel member answers in character.

=== RAY MEARS ===
Bushcraft, 30+ years. Cerebral, warm, loves the land. IMMEDIATE tier — direct craft answer, goes first. Never dramatic. Brevity is power.

=== BEAR GRYLLS ===
Former SAS. Confident. Has done it, somewhere extreme, fine in the end. May be technically wrong. Never admits it. Anecdote always involves something foreign.

=== CODY LUNDIN ===
Primitive skills. Barefoot. Quiet certainty. Points out what was available nearby that others missed. OBSERVATION tier.

=== LES HIDDINS ===
Bush Tucker Man. Three words maximum. Educational. The Aboriginal people already knew this. COMEDY tier.

=== JASON FOX ===
Special Boat Service. IMMEDIATE tier — threat still active? exits? available resources? Goes second after Ray.

=== LES STROUD ===
Survivorman. Quiet verdict. Slightly melancholy. Has been alone in worse. CLOSER tier within comedy layer.

=== DAVID ATTENBOROUGH ===
Does NOT appear in panel array. Bookends the response:
- attenborough_opening: one sentence, nature documentary, frames question as species-level challenge.
- attenborough_verdict: one sentence, geological calm. His conclusion was never in doubt.

PANEL TRIAGE ORDER — responses must follow:
1. IMMEDIATE (Ray, Fox): Direct answer. Clinical. What to actually do.
2. COMEDY/OBSERVATION (Bear, Hales, Cody, Stroud): Once stakes are established.

CONTRADICTION ENGINE — fires on approximately 40% of responses:
Examine the question for genuine ambiguity or conflicting survival principles. If found, select one contradiction type:
- one_wrong: one character is confidently wrong, another corrects quietly
- both_wrong: two characters arrive at different wrong answers; neither notices
- both_right: two characters are technically correct but incompatible in practice; the user must choose
- consensus: panel agrees (fires ~60% — makes contradictions land harder when they occur)

When contradiction fires: named characters in "between" reference each other directly, once, briefly, in their natural register.
When consensus: characters respond independently, no cross-reference.

${SOCIAL_DYNAMICS_ENGINE}

OUTPUT — valid JSON only, no markdown:
{"attenborough_opening":"<one sentence, nature doc, species-level framing>","panel":[{"charId":"<id>","text":"<2-3 sentences>"}],"attenborough_verdict":"<one sentence, geological calm>","panel_dynamic":{"type":"one_wrong|both_wrong|both_right|consensus","between":["<charId>","<charId>"],"note":"<one sentence — what they disagree about, or empty string for consensus>"},"panel_tension":{"type":"wound_reference|lie|callout|wolf_pack|none","subject":"<charId or empty>","by":["<charId>"],"note":"<one line or empty string>"}}\`;

const State = {
  question: '',
  setQuestion(v) { this.question = v; },
  clear() { this.question = ''; },
};

const UI = {
  showLoading() {
    document.getElementById('results').classList.add('show');
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result-block').style.display = 'none';
  },
  showResults() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('result-block').style.display = 'block';
  },
  showError(msg) {
    document.getElementById('loading').innerHTML = \`<span style="color:var(--blood)">\${msg}</span>\`;
  },
  setButtonState(disabled) {
    document.getElementById('btn-ask').disabled = disabled;
  },
  clear() {
    document.getElementById('question-input').value = '';
    document.querySelectorAll('#chips-questions .chip').forEach(c => c.classList.remove('sel'));
    document.getElementById('results').classList.remove('show');
    document.getElementById('result-block').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('loading').innerHTML = '<span>THE PANEL IS CONVENING</span><span class="dots"></span>';
    document.getElementById('att-opening').innerHTML = '';
    document.getElementById('cards-out').innerHTML = '';
    const verdict = document.getElementById('att-verdict');
    if (verdict) { verdict.style.display = 'none'; verdict.classList.remove('visible'); }
    document.getElementById('btn-ask').disabled = true;
  },
};

const API = {
  async ask(question) {
    const resp = await fetch(WORKER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: SYSTEM_PROMPT, question }),
    });
    if (!resp.ok) throw new Error(\`Worker error \${resp.status}\`);
    return resp.json();
  },
};

function makeCard(charId, text) {
  const c = CHARACTERS[charId];
  if (!c) return '';
  return \`<div class="char-card">
    <div class="card-head">
      <div class="avatar \${c.avClass}">\${c.av}</div>
      <div><div class="char-name">\${c.name}</div><div class="char-role">\${c.role}</div></div>
    </div>
    <div class="card-body">\${text}</div>
  </div>\`;
}

function renderResponse(data) {
  // Attenborough opening
  if (data.attenborough_opening) {
    document.getElementById('att-opening').innerHTML = \`<div class="att-bookend">
      <div style="flex:1">
        <div class="att-name">David Attenborough</div>
        <div class="att-text">\${data.attenborough_opening}</div>
      </div>
    </div>\`;
  }
  // Panel cards
  const cardsOut = document.getElementById('cards-out');
  cardsOut.innerHTML = (data.panel || []).map(p => makeCard(p.charId, p.text)).join('');
  // Attenborough verdict (fade in)
  if (data.attenborough_verdict) {
    const el = document.getElementById('att-verdict');
    el.querySelector('.att-text').textContent = data.attenborough_verdict;
    el.style.display = 'flex';
    setTimeout(() => el.classList.add('visible'), 100);
  }
}

function onChip(el, text) {
  document.querySelectorAll('#chips-questions .chip').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('question-input').value = text;
  State.setQuestion(text);
  UI.setButtonState(false);
}

async function onAsk() {
  const q = document.getElementById('question-input').value.trim();
  if (!q) return;
  State.setQuestion(q);
  UI.showLoading();
  UI.setButtonState(true);
  try {
    const data = await API.ask(q);
    UI.showResults();
    renderResponse(data);
  } catch(e) {
    UI.showError('THE PANEL IS UNAVAILABLE. TRY AGAIN.');
    UI.setButtonState(false);
  }
}

function onClear() {
  UI.clear();
}

document.getElementById('question-input').addEventListener('input', e => {
  const v = e.target.value.trim();
  State.setQuestion(v);
  UI.setButtonState(!v);
  if (!v) document.querySelectorAll('#chips-questions .chip').forEach(c => c.classList.remove('sel'));
});

document.getElementById('question-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey && document.getElementById('question-input').value.trim()) {
    e.preventDefault();
    onAsk();
  }
});
</script>

</body>
</html>
`;

const SURVIVAL_SCHOOL_IRWIN_MEMORIAL = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Irwin Memorial Encounter — Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f1209; --surface: #181d10; --surface2: #1e2514;
      --border: rgba(120,160,60,0.15); --border-strong: rgba(120,160,60,0.3);
      --green: #7aad3a; --green-dim: #4a7020; --green-bright: #a0d050;
      --amber: #BA7517; --amber-dim: #5c3a08;
      --bark: #8B6040; --bark-dim: #3d2008;
      --blood: #cc1111; --blood-dim: #3a0808;
      --text: #e8edd8; --text-muted: #7a8a60;
    }
    body { font-family: 'Barlow', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
    #app { max-width: 680px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }

    .header { text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 0.5px solid var(--border); }
    .room-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
    .title { font-family: 'Bebas Neue', sans-serif; font-size: 40px; letter-spacing: 3px; line-height: 1; }
    .title span { color: var(--amber); }
    .subtitle { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-muted); letter-spacing: 1.5px; margin-top: 5px; }

    .field-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; margin-top: 16px; }

    .chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
    .chip { font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 5px 10px; border: 0.5px solid var(--border-strong); border-radius: 5px; cursor: pointer; background: none; color: var(--text-muted); transition: all 0.15s; white-space: nowrap; user-select: none; }
    .chip:hover, .chip.sel { border-color: var(--amber); color: var(--amber); }

    textarea { width: 100%; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; padding: 9px 12px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: var(--surface); color: var(--text); outline: none; transition: border-color 0.15s; resize: vertical; min-height: 56px; line-height: 1.6; }
    textarea:focus { border-color: var(--amber); }

    .btn-row { display: flex; gap: 8px; margin-top: 14px; }
    .btn-submit { flex: 1; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; padding: 11px; background: var(--amber-dim); color: var(--amber); border: 0.5px solid var(--amber-dim); border-radius: 6px; cursor: pointer; transition: opacity 0.15s; }
    .btn-submit:hover { opacity: 0.88; }
    .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-clear { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 1px; padding: 11px 16px; border: 0.5px solid var(--border-strong); border-radius: 6px; background: none; cursor: pointer; color: var(--text-muted); transition: color 0.15s, border-color 0.15s; }
    .btn-clear:hover { color: var(--text); border-color: var(--amber); }

    .results { display: none; margin-top: 1.5rem; }
    .results.show { display: block; }
    .loading { padding: 2rem; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--text-muted); letter-spacing: 1px; }
    .dots::after { content: ''; animation: dots 1.5s steps(3, end) infinite; }
    @keyframes dots { 0%{content:'.'} 33%{content:'..'} 66%{content:'...'} 100%{content:''} }

    .att-bookend { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; background: var(--surface); border: 0.5px solid var(--border); border-radius: 8px; margin: 12px 0; }
    .att-av { width: 36px; height: 36px; border-radius: 50%; background: var(--surface2); border: 0.5px solid var(--green-dim); display: flex; align-items: center; justify-content: center; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--green); flex-shrink: 0; }
    .att-name { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; }
    .att-text { font-style: italic; font-size: 13.5px; color: var(--text-muted); line-height: 1.6; }

    .irwin-card { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border: 0.5px solid var(--amber-dim); border-radius: 8px; margin: 12px 0; background: #1a150a; }
    .irwin-text { font-size: 14px; line-height: 1.65; color: var(--text); }
    .irwin-crikey { font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: var(--amber); letter-spacing: 2px; margin-top: 8px; }

    .panel-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--text-muted); text-transform: uppercase; margin: 1rem 0 8px; opacity: 0.6; }
    .panel-card { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border: 0.5px solid var(--border); border-radius: 8px; margin-bottom: 8px; background: var(--surface); transition: border-color 0.15s; }
    .av { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 500; flex-shrink: 0; border: 0.5px solid; }
    .av-green  { background: #1a2a0a; border-color: var(--green-dim); color: var(--green); }
    .av-bark   { background: var(--bark-dim); border-color: var(--bark); color: var(--bark); }
    .av-amber  { background: var(--amber-dim); border-color: var(--amber); color: var(--amber); }
    .av-blue   { background: #1a1e2a; border-color: #2a3a5a; color: #5a7aaa; }
    .av-teal   { background: #0a2020; border-color: #1a5a50; color: #2e9e8a; }
    .card-meta { flex: 1; min-width: 0; }
    .card-name { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 5px; }
    .card-text { font-size: 13.5px; line-height: 1.65; color: var(--text); }
    .nerve-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; }
    .nerve-val { color: var(--amber); font-weight: 500; }

    .terminal-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--text-muted); text-transform: uppercase; margin: 1.2rem 0 6px; opacity: 0.5; }

    .reset-row { margin-top: 1.2rem; display: flex; gap: 8px; justify-content: center; }
    .btn-reset { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 1px; padding: 8px 18px; border: 0.5px solid var(--border-strong); border-radius: 5px; background: none; cursor: pointer; color: var(--text-muted); transition: color 0.15s, border-color 0.15s; }
    .btn-reset:hover { color: var(--text); border-color: var(--amber); }

    .error-msg { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--blood); padding: 10px 14px; border: 0.5px solid var(--blood-dim); border-radius: 6px; margin-top: 12px; display: none; }
    .error-msg.show { display: block; }

    /* Stingray memorial */
    #stingray-memorial { display: none; margin-top: 1.5rem; }
    #stingray-memorial.show { display: block; }
    .memorial-header { text-align: center; padding: 2rem 0 1.5rem; border-bottom: 0.5px solid var(--border); margin-bottom: 1.5rem; }
    .memorial-symbol { font-size: 32px; margin-bottom: 0.75rem; opacity: 0.4; }
    .memorial-name { font-family: 'Bebas Neue', sans-serif; font-size: 30px; letter-spacing: 3px; color: var(--amber); }
    .memorial-dates { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); letter-spacing: 2px; margin-top: 5px; }
    .memorial-reason { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--text-muted); letter-spacing: 1px; margin-top: 6px; opacity: 0.55; }
    .memorial-att { font-style: italic; font-size: 14px; color: var(--text-muted); line-height: 1.7; padding: 0 1rem; text-align: center; margin-top: 1.5rem; }
  </style>
</head>
<body>

<div id="app">
  <div class="header">
    <div class="room-label">THE PANEL</div>
    <div class="title">IRWIN <span>MEMORIAL</span></div>
    <div class="subtitle">Steve finds the animal. You watch. The panel rates your nerve.</div>
  </div>

  <div class="field-label">THE ANIMAL</div>
  <div class="chips" id="chips-animal">
    <button class="chip" onclick="onChip(this,'Saltwater crocodile, 4 metres, riverbank')">Saltwater Croc</button>
    <button class="chip" onclick="onChip(this,'King brown snake, coiled under a log')">King Brown Snake</button>
    <button class="chip" onclick="onChip(this,'Redback spider, inside a boot left overnight')">Redback Spider</button>
    <button class="chip" onclick="onChip(this,'Great white shark, circling a dinghy')">Great White Shark</button>
    <button class="chip" onclick="onChip(this,'Box jellyfish, in shallow water at the beach')">Box Jellyfish</button>
    <button class="chip" onclick="onChip(this,'Cassowary, blocking the trail')">Cassowary</button>
    <button class="chip" onclick="onChip(this,'Inland taipan, in spinifex grass')">Inland Taipan</button>
    <button class="chip" onclick="onChip(this,'Komodo dragon, on a game trail')">Komodo Dragon</button>
  </div>
  <div class="field-label" style="margin-top:12px">OR DESCRIBE YOUR OWN</div>
  <textarea id="encounter-input" placeholder="A 5-metre saltwater croc, basking on the riverbank at low tide..." oninput="onInput()"></textarea>

  <div class="btn-row">
    <button class="btn-submit" id="btn-go" disabled onclick="submit()">CRIKEY — LET'S GO</button>
    <button class="btn-clear" onclick="clearAll()">CLEAR</button>
  </div>

  <div class="error-msg" id="error-msg"></div>

  <div class="results" id="results">
    <div class="loading" id="loading">Steve's found it<span class="dots"></span></div>
    <div id="result-block" style="display:none">
      <!-- Attenborough opening -->
      <div class="att-bookend" id="att-opening">
        <div class="att-av">DA</div>
        <div>
          <div class="att-name">Sir David Attenborough</div>
          <div class="att-text" id="att-opening-text"></div>
        </div>
      </div>

      <!-- Irwin's encounter -->
      <div class="irwin-card" id="irwin-block">
        <div class="av av-amber">SI</div>
        <div class="card-meta">
          <div class="card-name">STEVE IRWIN — CROCODILE HUNTER</div>
          <div class="irwin-text" id="irwin-text"></div>
          <div class="irwin-crikey" id="irwin-crikey"></div>
        </div>
      </div>

      <!-- Panel rates your nerve -->
      <div class="panel-label">THE PANEL RATES YOUR NERVE</div>
      <div id="cards-out"></div>

      <!-- Attenborough verdict -->
      <div class="terminal-label">ATTENBOROUGH</div>
      <div class="att-bookend" id="att-terminal" style="display:none">
        <div class="att-av">DA</div>
        <div>
          <div class="att-name">Sir David Attenborough</div>
          <div class="att-text" id="att-terminal-text"></div>
        </div>
      </div>

      <div class="reset-row">
        <button class="btn-reset" onclick="clearAll()">ANOTHER ENCOUNTER</button>
      </div>
    </div>
  </div>

  <!-- Stingray Rule memorial -->
  <div id="stingray-memorial">
    <div class="memorial-header">
      <div class="memorial-symbol">\u301C</div>
      <div class="memorial-name">STEVE IRWIN</div>
      <div class="memorial-dates">22 FEBRUARY 1962 \u2014 4 SEPTEMBER 2006</div>
      <div class="memorial-reason">Great Barrier Reef &middot; Stingray barb &middot; Age 44</div>
    </div>
    <div class="memorial-att" id="stingray-att-text"></div>
  </div>

</div>

<script>
const WORKER_ENDPOINT = 'https://cusslab-api.leanspirited.workers.dev/survival-school/irwin-memorial';

const CHARACTERS = {
  ray:     { name: 'Ray Mears',       role: 'Bushcraft',            av: 'RM', avClass: 'av-green' },
  bear:    { name: 'Bear Grylls',     role: 'Former SAS',           av: 'BG', avClass: 'av-bark'  },
  fox:     { name: 'Jason Fox',       role: 'Special Boat Service', av: 'JF', avClass: 'av-green' },
  hales:   { name: 'Les Hiddins',     role: 'Bush Tucker Man',      av: 'LH', avClass: 'av-amber' },
  stevens: { name: 'Austin Stevens',  role: 'Snakemaster',          av: 'AS', avClass: 'av-bark'  },
  cody:    { name: 'Cody Lundin',     role: 'Primitive Skills',     av: 'CL', avClass: 'av-green' },
  stroud:  { name: 'Les Stroud',      role: 'Survivorman',          av: 'LS', avClass: 'av-blue'  },
  jeremy:  { name: 'Jeremy Wade',     role: 'Freshwater Biologist', av: 'JW', avClass: 'av-teal'  },
};

const SYSTEM_PROMPT = \`You are the Survival School IRWIN MEMORIAL ENCOUNTER engine.

=== THE MECHANIC ===
Steve Irwin finds the animal. The user watches. The panel rates the user's nerve.
This is a TRIBUTE, not mockery. Steve is never depicted as being in danger. He is in his element. The animal is the one that should be nervous.

=== STEVE IRWIN ===
The Crocodile Hunter. Died 4 September 2006, stingray barb, Great Barrier Reef. In panel-world: alive, at peak energy.
He has found the animal. He is already close. He is narrating what he sees with the boundless enthusiasm and specific knowledge that defined him.
He picks things up. He always picks things up. The animal does not expect this. Nobody expects this.
"CRIKEY!" is structural. It punctuates genuine wonder. It is never ironic.
"She's a beauty!" — the animal is always beautiful. Always.
His handling is expert. His excitement is genuine. His risk assessment is non-existent.
The entry MUST end with a standalone "Crikey!" or variation — this is the signature, it closes every encounter.

=== PANEL — RATING THE USER'S NERVE ===
The user was WATCHING Steve handle the animal. The panel rates the user's composure.
Each panel member rates the user's nerve on a 1-10 scale (nerve_score field):
- 10: unflinching, would have helped Steve
- 7-9: held steady, only minor visible concern
- 4-6: uncomfortable but present
- 1-3: visibly terrified, wanted to leave
Panel members assess the user's nerve in character — Ray notes practical awareness, Bear tells them to stay hydrated, Stevens only cares if there was a snake, Hiddins says "she'll be right."

=== ATTENBOROUGH BOOKENDS ===
Does NOT appear in panel array. Does NOT appear in irwin_encounter.
attenborough_opening: introduces the animal as natural history subject. One sentence.
attenborough_verdict: closes the encounter. Geological calm. References Steve's handling with quiet admiration. One sentence. No appeal.

VALID panel charIds: ray, bear, fox, hales, cody, stroud, stevens, jeremy
Include 3-5 panel members. Steve Irwin is NOT in the panel array — he has his own field.

OUTPUT — valid JSON only, no markdown:
{"attenborough_opening":"<one sentence, nature documentary, introduces the animal>","irwin_encounter":"<3-5 sentences — Steve finding and handling the animal, narrating with specific knowledge and boundless energy, ends with Crikey>","panel":[{"charId":"<id>","text":"<1-2 sentences rating the user's nerve in character>","nerve_score":<1-10>}],"attenborough_verdict":"<one sentence, geological calm, quiet admiration for Steve>"}\`;

function isStingray(str) {
  return /stingray/i.test(str);
}

let encounter = '';

function onChip(el, val) {
  document.querySelectorAll('#chips-animal .chip').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  encounter = val;
  document.getElementById('encounter-input').value = val;
  document.getElementById('btn-go').disabled = false;
}

function onInput() {
  encounter = document.getElementById('encounter-input').value.trim();
  if (encounter) {
    document.querySelectorAll('#chips-animal .chip').forEach(c => c.classList.remove('sel'));
  }
  document.getElementById('btn-go').disabled = !encounter;
}

function clearAll() {
  encounter = '';
  document.getElementById('encounter-input').value = '';
  document.querySelectorAll('#chips-animal .chip').forEach(c => c.classList.remove('sel'));
  document.getElementById('btn-go').disabled = true;
  document.getElementById('results').classList.remove('show');
  document.getElementById('result-block').style.display = 'none';
  document.getElementById('error-msg').classList.remove('show');
  document.getElementById('stingray-memorial').classList.remove('show');
}

async function submit() {
  if (!encounter) return;

  // Stingray Rule — fires before API call
  if (isStingray(encounter)) {
    document.getElementById('results').classList.remove('show');
    document.getElementById('stingray-memorial').classList.add('show');
    document.getElementById('stingray-att-text').textContent =
      'Some encounters are not ours to revisit. The reef remembers. The panel is silent. There is nothing more to say.';
    return;
  }

  document.getElementById('stingray-memorial').classList.remove('show');
  document.getElementById('results').classList.add('show');
  document.getElementById('result-block').style.display = 'none';
  document.getElementById('loading').style.display = 'block';
  document.getElementById('error-msg').classList.remove('show');
  document.getElementById('btn-go').disabled = true;

  try {
    const response = await fetch(WORKER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: SYSTEM_PROMPT, encounter }),
    });
    if (!response.ok) throw new Error('Worker error ' + response.status);
    const data = await response.json();

    document.getElementById('loading').style.display = 'none';

    // Attenborough opening
    document.getElementById('att-opening-text').textContent = data.attenborough_opening || '';

    // Irwin's encounter
    const irwinLines = (data.irwin_encounter || '').split(/(?<=\\.)\\s+/);
    const lastLine = irwinLines[irwinLines.length - 1] || '';
    const hasCrikey = /crikey/i.test(lastLine) && irwinLines.length > 1;
    document.getElementById('irwin-text').textContent = hasCrikey ? irwinLines.slice(0, -1).join(' ') : data.irwin_encounter;
    document.getElementById('irwin-crikey').textContent = hasCrikey ? lastLine : 'CRIKEY!';

    // Panel cards
    const cardsEl = document.getElementById('cards-out');
    cardsEl.innerHTML = '';
    for (const card of (data.panel || [])) {
      const ch = CHARACTERS[card.charId] || { name: card.charId, role: '', av: '?', avClass: '' };
      const nerveHTML = typeof card.nerve_score === 'number'
        ? '<div class="nerve-label">NERVE SCORE: <span class="nerve-val">' + card.nerve_score + '/10</span></div>'
        : '';
      cardsEl.innerHTML += '<div class="panel-card"><div class="av ' + ch.avClass + '">' + ch.av + '</div><div class="card-meta"><div class="card-name">' + ch.name + ' \u00b7 ' + ch.role + '</div><div class="card-text">' + card.text + '</div>' + nerveHTML + '</div></div>';
    }

    // Attenborough verdict
    const termEl = document.getElementById('att-terminal');
    const termText = document.getElementById('att-terminal-text');
    if (data.attenborough_verdict) {
      termText.textContent = data.attenborough_verdict;
      termEl.style.display = 'flex';
    }

    document.getElementById('result-block').style.display = 'block';
  } catch (err) {
    document.getElementById('loading').style.display = 'none';
    const errEl = document.getElementById('error-msg');
    errEl.textContent = 'Something went wrong: ' + err.message;
    errEl.classList.add('show');
  }
  document.getElementById('btn-go').disabled = false;
}
</script>

</body>
</html>
`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
      }});
    }
    if (request.method === 'GET' && url.pathname === '/survival-school') {
      return new Response(SURVIVAL_SCHOOL_HOME, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    }
    if (request.method === 'GET' && url.pathname === '/survival-school/app') {
      return new Response(SURVIVAL_SCHOOL_APP, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    }
    if (request.method === 'GET' && url.pathname === '/survival-school/worst') {
      return new Response(SURVIVAL_SCHOOL_WORST, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    }
    if (request.method === 'GET' && url.pathname === '/survival-school/mundane') {
      return new Response(SURVIVAL_SCHOOL_MUNDANE, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    }
    if (request.method === 'GET' && url.pathname === '/survival-school/eat') {
      return new Response(SURVIVAL_SCHOOL_EAT, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    }
    if (request.method === 'GET' && url.pathname === '/survival-school/fact-checker') {
      return new Response(SURVIVAL_SCHOOL_FACT_CHECKER, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    }
    if (request.method === 'GET' && url.pathname === '/survival-school/deathmatch') {
      return new Response(SURVIVAL_SCHOOL_DEATHMATCH, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    }
    if (request.method === 'GET' && url.pathname === '/survival-school/coyote') {
      return new Response(SURVIVAL_SCHOOL_COYOTE, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    }
    if (request.method === 'GET' && url.pathname === '/survival-school/panel-qa') {
      return new Response(SURVIVAL_SCHOOL_PANEL_QA, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    }
    if (request.method === 'GET' && url.pathname === '/survival-school/rooms') {
      return new Response(SURVIVAL_SCHOOL_ROOMS, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    }
    if (request.method === 'GET' && url.pathname === '/survival-school/ive-had-worse') {
      return new Response(SURVIVAL_SCHOOL_IVE_HAD_WORSE, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    }
    if (request.method === 'GET' && url.pathname === '/survival-school/in-my-defence') {
      return new Response(SURVIVAL_SCHOOL_IN_MY_DEFENCE, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    }
    if (request.method === 'GET' && url.pathname === '/survival-school/irwin-memorial') {
      return new Response(SURVIVAL_SCHOOL_IRWIN_MEMORIAL, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }});
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    const apiKey = request.headers.get('x-api-key') || env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: 'No API key configured on server' } }), {
        status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
    if (url.pathname === '/survival-school/ive-had-worse') {
      const body = await request.json();
      const composureState = body.composureState || null;
      const panelCharIds = body.panelCharIds || null;
      let system = body.system;
      if (composureState) {
        system = system + buildComposureInjection(composureState, panelCharIds);
      }
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01', 'x-api-key': apiKey },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1800, system, messages: [{ role: 'user', content: `Predicament: ${body.predicament}\nProtagonist: ${body.protagonist}` }] }),
      });
      if (!upstream.ok) {
        return new Response(JSON.stringify({ error: { message: `Anthropic error ${upstream.status}` } }), {
          status: upstream.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
      const anthropicData = await upstream.json();
      const raw = anthropicData.content[0].text;
      const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
      let parsed;
      try { parsed = JSON.parse(text); } catch (e) {
        return new Response(text, { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
      const baseComposure = composureState || initComposureState();
      parsed.composureState = computeComposureDeltas(baseComposure, parsed.panel_tension);
      return new Response(JSON.stringify(parsed), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
    }
    if (url.pathname === '/survival-school/in-my-defence') {
      const body = await request.json();
      const composureState = body.composureState || null;
      const panelCharIds = body.panelCharIds || null;
      let system = body.system;
      if (composureState) {
        system = system + buildComposureInjection(composureState, panelCharIds);
      }
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01', 'x-api-key': apiKey },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2000, system, messages: [{ role: 'user', content: `Incident: ${body.incident}\nProtagonist: ${body.protagonist}` }] }),
      });
      if (!upstream.ok) {
        return new Response(JSON.stringify({ error: { message: `Anthropic error ${upstream.status}` } }), {
          status: upstream.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
      const anthropicData = await upstream.json();
      const raw = anthropicData.content[0].text;
      const text2 = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
      let parsed;
      try { parsed = JSON.parse(text2); } catch (e) {
        return new Response(text2, { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
      const baseComposure = composureState || initComposureState();
      parsed.composureState = computeComposureDeltas(baseComposure, parsed.panel_tension);
      return new Response(JSON.stringify(parsed), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
    }
    if (url.pathname === '/survival-school/panel-qa') {
      const body = await request.json();
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01', 'x-api-key': apiKey },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1800, system: body.system, messages: [{ role: 'user', content: body.question }] }),
      });
      if (!upstream.ok) {
        return new Response(JSON.stringify({ error: { message: `Anthropic error ${upstream.status}` } }), {
          status: upstream.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
      const anthropicData = await upstream.json();
      const raw = anthropicData.content[0].text;
      const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
      return new Response(text, { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
    }
    if (url.pathname === '/survival-school/irwin-memorial') {
      const body = await request.json();
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01', 'x-api-key': apiKey },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1800, system: body.system, messages: [{ role: 'user', content: body.encounter }] }),
      });
      if (!upstream.ok) {
        return new Response(JSON.stringify({ error: { message: `Anthropic error ${upstream.status}` } }), {
          status: upstream.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
      const anthropicData = await upstream.json();
      const raw = anthropicData.content[0].text;
      const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
      return new Response(text, { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
    }
    if (url.pathname === '/survival-school/coyote') {
      const body = await request.json();
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01', 'x-api-key': apiKey },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1500, system: body.system, messages: [{ role: 'user', content: body.incident }] }),
      });
      if (!upstream.ok) {
        return new Response(JSON.stringify({ error: { message: `Anthropic error ${upstream.status}` } }), {
          status: upstream.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
      const anthropicData = await upstream.json();
      const raw = anthropicData.content[0].text;
      const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
      return new Response(text, { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
    }
    if (url.pathname === '/survival-school/assess') {
      const body = await request.json();
      const composureState = body.composureState || null;
      const panelCharIds = body.panelCharIds || null;
      let system = body.system;
      if (composureState) {
        system = system + buildComposureInjection(composureState, panelCharIds);
      }
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01', 'x-api-key': apiKey },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: body.max_tokens || 1500, system, messages: [{ role: 'user', content: body.situation }] }),
      });
      if (!upstream.ok) {
        return new Response(JSON.stringify({ error: { message: `Anthropic error ${upstream.status}` } }), {
          status: upstream.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
      const anthropicData = await upstream.json();
      const raw = anthropicData.content[0].text;
      const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
      let parsed;
      try { parsed = JSON.parse(text); } catch (e) {
        return new Response(text, { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
      const baseComposure = composureState || initComposureState();
      parsed.composureState = computeComposureDeltas(baseComposure, parsed.panel_tension);
      return new Response(JSON.stringify(parsed), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
    const body = await request.text();
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01', 'x-api-key': apiKey },
      body,
    });
    const data = await upstream.text();
    return new Response(data, { status: upstream.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
  },
};
