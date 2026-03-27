// Cloudflare Worker — Survival School + Cusslab proxy
const SURVIVAL_SCHOOL_HOME = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Survival School</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@700&family=Barlow:wght@400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"/>
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
      --nav-w:        240px;
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

    .logo-mark {
      width: 36px;
      height: 36px;
      flex-shrink: 0;
    }

    .logo-text {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 26px;
      letter-spacing: 3px;
      line-height: 1;
      color: var(--text);
    }

    .logo-text span { color: var(--blood); }

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
      animation: taglines 28s steps(1) infinite;
    }

    .tagline-track span {
      display: block;
      height: 14px;
      line-height: 14px;
      opacity: 0;
      animation: tagline-fade 28s infinite;
    }

    .tagline-track span:nth-child(1)  { animation-delay: 0s; }
    .tagline-track span:nth-child(2)  { animation-delay: 3.5s; }
    .tagline-track span:nth-child(3)  { animation-delay: 7s; }
    .tagline-track span:nth-child(4)  { animation-delay: 10.5s; }
    .tagline-track span:nth-child(5)  { animation-delay: 14s; }
    .tagline-track span:nth-child(6)  { animation-delay: 17.5s; }
    .tagline-track span:nth-child(7)  { animation-delay: 21s; }
    .tagline-track span:nth-child(8)  { animation-delay: 24.5s; }

    @keyframes tagline-fade {
      0%, 100%      { opacity: 0; }
      3%, 96.5%     { opacity: 1; }
      12.5%, 87.5%  { opacity: 1; }
    }

    /* Each span fades in at its delay, stays visible for ~3s, then fades */
    .tagline-track span {
      animation: tagline-fade 28s infinite;
    }

    @keyframes tagline-fade {
      0%    { opacity: 0; }
      2%    { opacity: 1; }
      10.5% { opacity: 1; }
      12.5% { opacity: 0; }
      100%  { opacity: 0; }
    }

    /* ── LAYOUT ─────────────────────────────────────────────────────────── */
    #app-body {
      display: flex;
      flex: 1;
    }

    /* ── SIDEBAR ─────────────────────────────────────────────────────────── */
    nav {
      width: var(--nav-w);
      min-width: var(--nav-w);
      background: var(--surface);
      border-right: 1px solid var(--border);
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-section {
      padding: 0 12px;
      margin-top: 8px;
      margin-bottom: 2px;
    }

    .nav-section-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      letter-spacing: 2px;
      color: var(--text-muted);
      text-transform: uppercase;
      padding: 0 8px;
      margin-bottom: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 8px;
      border-left: 2px solid transparent;
      cursor: pointer;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      transition: background 0.12s, color 0.12s, border-color 0.12s;
      user-select: none;
    }

    .nav-item:hover {
      background: var(--surface2);
      color: var(--text);
      border-left-color: var(--border-strong);
    }

    .nav-item.active {
      background: var(--surface2);
      color: var(--green);
      border-left-color: var(--green);
    }

    .nav-item .nav-icon {
      font-size: 13px;
      width: 18px;
      text-align: center;
      flex-shrink: 0;
    }

    .nav-badge {
      margin-left: auto;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      padding: 2px 5px;
      border-radius: 20px;
      letter-spacing: 0.5px;
    }

    .badge-live {
      background: rgba(122,173,58,0.2);
      color: var(--green-bright);
    }

    .badge-soon {
      background: rgba(122,138,96,0.12);
      color: var(--text-muted);
    }

    /* ── CONTENT ─────────────────────────────────────────────────────────── */
    #content {
      flex: 1;
      overflow: auto;
      background: var(--bg);
    }

    .panel { display: none; height: 100%; }
    .panel.active { display: block; }

    /* ── Iframe panels — full height ────────────────────────────────────── */
    #panel-screwed,
    #panel-worst,
    #panel-mundane { padding: 0; }

    #panel-screwed iframe,
    #panel-worst iframe,
    #panel-mundane iframe {
      width: 100%;
      height: calc(100vh - 65px);
      border: none;
      display: block;
    }

    /* ── COMING SOON panels ──────────────────────────────────────────────── */
    .coming-soon {
      max-width: 560px;
      margin: 80px auto;
      padding: 0 24px;
      text-align: center;
    }

    .coming-soon-icon {
      font-size: 48px;
      margin-bottom: 20px;
      opacity: 0.3;
    }

    .coming-soon-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 32px;
      letter-spacing: 2px;
      margin-bottom: 12px;
      color: var(--text);
    }

    .coming-soon-desc {
      font-family: 'Barlow', sans-serif;
      font-size: 14px;
      line-height: 1.8;
      color: var(--text-muted);
      margin-bottom: 28px;
    }

    .feature-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-align: left;
      max-width: 360px;
      margin: 0 auto;
    }

    .feature-list li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      color: var(--text-muted);
      padding: 8px 12px;
      border: 1px solid var(--border-strong);
      border-radius: var(--radius);
      background: var(--surface);
    }

    .feature-list li .fi-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--border-strong);
      flex-shrink: 0;
    }

    .feature-list li.fi-live .fi-dot { background: var(--green); }
    .feature-list li.fi-next .fi-dot { background: var(--bark); }

    /* ── ABOUT panel ─────────────────────────────────────────────────────── */
    .about-body {
      max-width: 600px;
      margin: 48px auto;
      padding: 0 24px;
    }

    .about-body h2 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      letter-spacing: 2px;
      margin-bottom: 16px;
      color: var(--text);
    }

    .about-body p {
      font-family: 'Barlow', sans-serif;
      font-size: 15px;
      line-height: 1.9;
      color: var(--text-muted);
      margin-bottom: 20px;
    }

    .about-body blockquote {
      border-left: 3px solid var(--green);
      padding: 12px 20px;
      margin: 24px 0;
      background: var(--surface);
      border-radius: 0 var(--radius) var(--radius) 0;
    }

    .about-body blockquote p {
      font-size: 16px;
      font-style: italic;
      color: var(--text);
      margin: 0;
    }

    /* ── MOBILE ──────────────────────────────────────────────────────────── */
    @media (max-width: 640px) {
      nav { width: 200px; min-width: 200px; }
      :root { --nav-w: 200px; }
    }

    @media (max-width: 480px) {
      #app-body { flex-direction: column; }
      nav { width: 100%; min-width: unset; border-right: none; border-bottom: 1px solid var(--border); padding: 8px 12px; flex-direction: row; overflow-x: auto; flex-wrap: nowrap; gap: 0; }
      .nav-section { display: contents; margin: 0; }
      .nav-section-label { display: none; }
      .nav-item { white-space: nowrap; flex-shrink: 0; border-left: none; border-bottom: 2px solid transparent; }
      .nav-item.active { border-bottom-color: var(--green); border-left: none; }
      #panel-screwed iframe,
      #panel-worst iframe,
      #panel-mundane iframe { height: 80vh; }
    }
  </style>
</head>
<body>

<header>
  <!-- Logo mark — compass/flame SVG -->
  <svg class="logo-mark" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="17" stroke="#8B0000" stroke-width="1.5"/>
    <path d="M18 4 L21 15 L18 13 L15 15 Z" fill="#8B0000"/>
    <path d="M18 32 L15 21 L18 23 L21 21 Z" fill="#5F5E5A" opacity="0.5"/>
    <path d="M4 18 L15 15 L13 18 L15 21 Z" fill="#5F5E5A" opacity="0.5"/>
    <path d="M32 18 L21 21 L23 18 L21 15 Z" fill="#5F5E5A" opacity="0.5"/>
    <circle cx="18" cy="18" r="2.5" fill="#8B0000"/>
  </svg>
  <div>
    <div class="logo-text">SURVIVAL <span>SCHOOL</span></div>
    <div class="logo-sub">
      <div class="tagline-track">
        <span>ask them... before you bleed out.</span>
        <span>just (don't) do it.</span>
        <span>is it too late? find out fast.</span>
        <span>no fear?™ good. you need some.</span>
        <span>probably the best panel in the world.</span>
        <span>think different. or don't think at all.</span>
        <span>finger lickin' fatality. FINISH HIM.</span>
        <span>the panel knows more than you.</span>
      </div>
    </div>
  </div>
</header>

<div id="app-body">

  <nav>

    <div class="nav-section">
      <div class="nav-section-label">Assessment</div>
      <div class="nav-item active" data-panel="screwed">
        <span class="nav-icon">⚠</span>
        How Screwed Am I?
        <span class="nav-badge badge-live">LIVE</span>
      </div>
      <div class="nav-item" data-panel="fact-checker">
        <span class="nav-icon">✓</span>
        Bear Fact-Checker
        <span class="nav-badge badge-live">LIVE</span>
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-section-label">Scenarios</div>
      <div class="nav-item" data-panel="worst">
        <span class="nav-icon">⚡</span>
        How Bad Is This?
        <span class="nav-badge badge-live">LIVE</span>
      </div>
      <div class="nav-item" data-panel="panel-qa">
        <span class="nav-icon">◎</span>
        Panel Q&amp;A
        <span class="nav-badge badge-soon">SOON</span>
      </div>
      <div class="nav-item" data-panel="mundane">
        <span class="nav-icon">◎</span>
        Mundane Mode
        <span class="nav-badge badge-live">LIVE</span>
      </div>
      <div class="nav-item" data-panel="deathmatch">
        <span class="nav-icon">◎</span>
        Animal Deathmatch
        <span class="nav-badge badge-live">LIVE</span>
      </div>
      <div class="nav-item" data-panel="irwin">
        <span class="nav-icon">◎</span>
        Irwin Memorial
        <span class="nav-badge badge-soon">SOON</span>
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-section-label">The Panel</div>
      <div class="nav-item" data-panel="characters">
        <span class="nav-icon">◉</span>
        Characters
        <span class="nav-badge badge-soon">SOON</span>
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-section-label">Knowledge</div>
      <div class="nav-item" data-panel="domains">
        <span class="nav-icon">◈</span>
        Survival Domains
        <span class="nav-badge badge-soon">SOON</span>
      </div>
      <div class="nav-item" data-panel="skills">
        <span class="nav-icon">◈</span>
        Skill Ratings
        <span class="nav-badge badge-soon">SOON</span>
      </div>
    </div>

    <div class="nav-section">
      <div class="nav-section-label">About</div>
      <div class="nav-item" data-panel="about">
        <span class="nav-icon">◦</span>
        About
      </div>
    </div>

  </nav>

  <div id="content">

    <!-- HOW SCREWED AM I — live -->
    <div class="panel active" id="panel-screwed">
      <iframe src="https://cusslab-api.leanspirited.workers.dev/survival-school/app"
              title="How Screwed Am I?"></iframe>
    </div>

    <!-- HOW BAD IS THIS? — live -->
    <div class="panel" id="panel-worst">
      <iframe src="https://cusslab-api.leanspirited.workers.dev/survival-school/worst"
              title="How Bad Is This?"></iframe>
    </div>

    <!-- BEAR FACT-CHECKER — live -->
    <div class="panel" id="panel-fact-checker">
      <iframe src="https://cusslab-api.leanspirited.workers.dev/survival-school/fact-checker"
              title="Bear Fact-Checker"></iframe>
    </div>

    <!-- PANEL Q&A -->
    <div class="panel" id="panel-panel-qa">
      <div class="coming-soon">
        <div class="coming-soon-icon">◎</div>
        <div class="coming-soon-title">Panel Q&amp;A</div>
        <div class="coming-soon-desc">
          Ask the panel anything about survival. Six experts. Six answers.
          No two of them agree on the right way to make fire.
        </div>
        <ul class="feature-list">
          <li class="fi-next"><span class="fi-dot"></span>Free-form question input</li>
          <li class="fi-next"><span class="fi-dot"></span>All 6 characters respond in voice</li>
          <li class="fi-next"><span class="fi-dot"></span>Relationship matrix fires naturally</li>
        </ul>
      </div>
    </div>

    <!-- MUNDANE MODE — live -->
    <div class="panel" id="panel-mundane">
      <iframe src="https://cusslab-api.leanspirited.workers.dev/survival-school/mundane"
              title="Mundane Mode"></iframe>
    </div>

    <!-- ANIMAL DEATHMATCH — live -->
    <div class="panel" id="panel-deathmatch">
      <iframe src="https://cusslab-api.leanspirited.workers.dev/survival-school/deathmatch"
              title="Animal Deathmatch"></iframe>
    </div>

    <!-- IRWIN MEMORIAL -->
    <div class="panel" id="panel-irwin">
      <div class="coming-soon">
        <div class="coming-soon-icon">◎</div>
        <div class="coming-soon-title">Irwin Memorial Encounter</div>
        <div class="coming-soon-desc">
          Describe an animal encounter. Steve rates your handling.
          From beyond.
        </div>
        <ul class="feature-list">
          <li class="fi-next"><span class="fi-dot"></span>Animal encounter input</li>
          <li class="fi-next"><span class="fi-dot"></span>DEAD_IN_PANEL_WORLD mechanic</li>
          <li class="fi-next"><span class="fi-dot"></span>Panel responds to Irwin's verdict</li>
        </ul>
      </div>
    </div>

    <!-- CHARACTERS -->
    <div class="panel" id="panel-characters">
      <div class="coming-soon">
        <div class="coming-soon-icon">◉</div>
        <div class="coming-soon-title">The Panel</div>
        <div class="coming-soon-desc">
          Six experts. Real knowledge. Distinct voices.
          The comedy is earned by the expertise being genuine.
        </div>
        <ul class="feature-list">
          <li><span class="fi-dot"></span>Ray Mears — Bushcraft</li>
          <li><span class="fi-dot"></span>Bear Grylls — Former SAS</li>
          <li><span class="fi-dot"></span>Cody Lundin — Primitive Skills</li>
          <li><span class="fi-dot"></span>Les Hiddins — Bush Tucker Man</li>
          <li><span class="fi-dot"></span>David Attenborough — Natural World</li>
          <li><span class="fi-dot"></span>Les Stroud — Survivorman</li>
        </ul>
      </div>
    </div>

    <!-- SURVIVAL DOMAINS -->
    <div class="panel" id="panel-domains">
      <div class="coming-soon">
        <div class="coming-soon-icon">◈</div>
        <div class="coming-soon-title">Survival Domains</div>
        <div class="coming-soon-desc">
          12-domain survival knowledge taxonomy. Fire, water, shelter, food,
          navigation, medical, signalling, psychology, terrain, fauna, flora, tools.
          The knowledge behind the panel.
        </div>
        <ul class="feature-list">
          <li class="fi-next"><span class="fi-dot"></span>12 survival domains</li>
          <li class="fi-next"><span class="fi-dot"></span>Per-domain expert profiles</li>
          <li class="fi-next"><span class="fi-dot"></span>Skill rating cross-reference</li>
        </ul>
      </div>
    </div>

    <!-- SKILL RATINGS -->
    <div class="panel" id="panel-skills">
      <div class="coming-soon">
        <div class="coming-soon-icon">◈</div>
        <div class="coming-soon-title">Skill Ratings</div>
        <div class="coming-soon-desc">
          Every panel member rated across every domain.
          Ray: Fire 99. Bear: Fire 70. This is not a coincidence.
        </div>
        <ul class="feature-list">
          <li class="fi-next"><span class="fi-dot"></span>Per-character skill breakdown</li>
          <li class="fi-next"><span class="fi-dot"></span>Domain comparison view</li>
          <li class="fi-next"><span class="fi-dot"></span>The Shoe Question (Cody vs Stroud)</li>
        </ul>
      </div>
    </div>

    <!-- ABOUT -->
    <div class="panel" id="panel-about">
      <div class="about-body">
        <h2>About Survival School</h2>
        <p>
          Real knowledge. Genuine consequence. No performance.
          The comedy is earned by the expertise being real.
          If the experts were charlatans, there's no joke.
        </p>
        <blockquote>
          <p>Cody threw the fire-making supplies into the pool rather than
          demonstrate bad technique for a producer. He chose integrity over
          career in one clean arc of a spear into water.
          That is what this product is.</p>
        </blockquote>
        <p>
          Six survival experts. One panel. Your situation assessed with full
          expertise and no diplomatic softening. Attenborough closes every scene.
          Not by demanding it — because what he says is always the last word.
        </p>
        <p>
          Built by Rod Roden / LeanSpirited.
        </p>
      </div>
    </div>

  </div><!-- #content -->
</div><!-- #app-body -->

<script>
  const navItems = document.querySelectorAll('.nav-item[data-panel]');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.panel;
      const panelId = 'panel-' + target;
      const panel = document.getElementById(panelId);
      if (!panel) return;

      navItems.forEach(n => n.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      panel.classList.add('active');
    });
  });
</script>

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
    <div class="field-label">Location</div>
    <div class="chips" id="chips-loc">
      <div class="chip" onclick="onChip(this,'loc','Dartmoor, October')">Dartmoor, October</div>
      <div class="chip" onclick="onChip(this,'loc','Scottish Highlands, midwinter')">Scottish Highlands, midwinter</div>
      <div class="chip" onclick="onChip(this,'loc','Amazon rainforest')">Amazon rainforest</div>
      <div class="chip" onclick="onChip(this,'loc','Sonoran Desert, Arizona')">Sonoran Desert, Arizona</div>
      <div class="chip" onclick="onChip(this,'loc','North Sea, small boat')">North Sea, small boat</div>
      <div class="chip" onclick="onChip(this,'loc','M25 contraflow')">M25 contraflow</div>
    </div>
    <input type="text" id="loc-input" placeholder="or describe your location..." oninput="onFieldInput('loc',this.value)"/>

    <div class="field-label">Situation &amp; key circumstances</div>
    <div class="chips" id="chips-sit">
      <div class="chip" onclick="onChip(this,'sit','lost, no map, phone at 4%')">lost, no map, phone at 4%</div>
      <div class="chip" onclick="onChip(this,'sit','shelter destroyed, nightfall in 2 hours')">shelter destroyed, nightfall 2hrs</div>
      <div class="chip" onclick="onChip(this,'sit','injured ankle, alone')">injured ankle, alone</div>
      <div class="chip" onclick="onChip(this,'sit','broke down, no signal')">broke down, no signal</div>
    </div>
    <input type="text" id="sit-input" placeholder="or describe your situation..." oninput="onFieldInput('sit',this.value)"/>

    <div class="field-label">Who or what is with you</div>
    <div class="chips" id="chips-who">
      <div class="chip" onclick="onChip(this,'who','alone')">alone</div>
      <div class="chip" onclick="onChip(this,'who','one other, no survival knowledge')">one other, no skills</div>
      <div class="chip" onclick="onChip(this,'who','dog')">dog</div>
      <div class="chip" onclick="onChip(this,'who','puff adder, nearby')">puff adder, nearby</div>
      <div class="chip" onclick="onChip(this,'who','children')">children</div>
    </div>
    <input type="text" id="who-input" placeholder="or describe who / what is with you..." oninput="onFieldInput('who',this.value)"/>

    <div class="field-label">Weather &amp; time of day</div>
    <div class="chips" id="chips-wx">
      <div class="chip" onclick="onChip(this,'wx','dusk, temperature dropping fast')">dusk, dropping fast</div>
      <div class="chip" onclick="onChip(this,'wx','heavy rain, no shelter')">heavy rain, no shelter</div>
      <div class="chip" onclick="onChip(this,'wx','midday, 38°C, no shade')">midday, 38°C</div>
      <div class="chip" onclick="onChip(this,'wx','night, clear, -8°C')">night, -8°C</div>
      <div class="chip" onclick="onChip(this,'wx','fog, visibility 10m')">fog, 10m visibility</div>
    </div>
    <input type="text" id="wx-input" placeholder="or describe conditions..." oninput="onFieldInput('wx',this.value)"/>

    <div class="btn-row">
      <button class="btn-assess" id="btn-guided" onclick="onAssess('guided')">ASSESS MY SITUATION ↗</button>
      <button class="btn-clear" onclick="onClear()">CLEAR</button>
    </div>
  </div>

  <div class="input-panel" id="panel-free">
    <div class="field-label">Describe your situation</div>
    <textarea id="free-input" rows="5"
      placeholder="I'm on Dartmoor, it's October, phone at 4%, no map, dusk in 90 minutes, wearing trainers..."
      oninput="onFreeInput(this.value)"></textarea>
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

Panel characters (no Attenborough): Ray, Bear, Cody, Hales, Fox, Stroud.
- Ray: is it technically correct? Craft judgement. Brief.
- Bear: anecdote, probably did something similar somewhere exotic, hydration check.
- Cody: was there a better option right there they missed?
- Hales: brief, understated, educational. "Have a look at this." "Not too bad." "She'll be right." Cites Aboriginal knowledge. 1-3 sentences.
- Fox: tactical assessment — lines of sight, threat exposure, exit options, what's available.
- Stroud: quiet verdict.

Survival probability shifts:
- Good decision: +10 to +20
- Neutral: no change
- Poor: -15 to -25
- Catastrophic: -30 to -50

Generate 3 specific next actions the user could take from here.
If probability reaches 0 or situation fully resolves, set is_terminal to true.

OUTPUT — valid JSON only, no markdown:
{"survival_probability":<integer>,"attenborough_opening":"<one sentence, nature doc, frames what the decision is about to cause>","situation_update":"<one sentence what changed>","panel":[{"charId":"<id>","text":"<2-3 sentences>","death":<bool>,"fact_check":"<optional — Bear only>"}],"attenborough_verdict":"<one sentence, geological calm, turn conclusion, he already knew>","next_actions":["<action>","<action>","<action>"],"is_terminal":<bool>}\`;
  }

  if (mode === 'mundane') {
    return \`You are the Survival School panel. The user has described a MUNDANE, EVERYDAY problem. Apply full survival gravity. This is the joke — the greater the gravity, the funnier.

\${chars}

\${SHARED_CONTEXT}

MUNDANE MODE: The situation is not a survival emergency. The panel doesn't know this.
They assess with the same weight they would give a man trapped on Dartmoor in October.
Ray identifies three immediate risks. Fox assesses lines of sight. Cody notes what was available nearby. Bear has done something similar abroad.

ATTENBOROUGH BOOKEND STRUCTURE — Attenborough does NOT appear in the panel array. He bookends:
- attenborough_opening: one sentence, introduces the mundane situation as if it's a wildlife encounter. "And here, in the fluorescent ecology of the Wetherspoons, a specimen faces a challenge that, while modest in geological terms, carries its own quiet urgency."
- attenborough_verdict: one sentence, geological calm. Final verdict. He always knew.

Panel characters (no Attenborough): Ray, Bear, Cody, Hales, Fox, Stroud.
- Ray: identifies real risks in the mundane situation. Genuinely concerned.
- Bear: has done something similar, abroad, fine in the end.
- Cody: points out the better option that was right there. "The bus stop. Fifty yards away."
- Hales: understated, educational. 1-2 sentences. "Have a look at this." Cites Aboriginal knowledge.
- Fox: tactical assessment of the mundane. Exit routes from the post office queue.
- Stroud: quiet, measured verdict. Slightly melancholy.

Survival probability: 0-100. For mundane scenarios this is usually 40-85% — they're not great situations, but survivable with the right mindset. A truly catastrophic mundane scenario (printer has run out of ink, presentation in 10 minutes) may drop lower.

OUTPUT — valid JSON only, no markdown:
{"survival_probability":<integer 0-100>,"attenborough_opening":"<one sentence, nature documentary, introduces mundane situation as wildlife encounter>","panel":[{"charId":"<id>","text":"<2-3 sentences>","death":<bool>,"fact_check":"<optional Bear only>"}],"attenborough_verdict":"<one sentence, geological calm, final verdict>"}\`;
  }

  return \`You are the Survival School panel assessment engine.

\${chars}

\${SHARED_CONTEXT}

ATTENBOROUGH BOOKEND STRUCTURE — Attenborough does NOT appear in the panel array. He bookends the whole assessment:
- attenborough_opening: one sentence, nature documentary register, introduces the situation as if it's a wildlife encounter. Sets the stakes. Slightly ominous.
- attenborough_verdict: one sentence, geological calm, no appeal. The documentary's conclusion. He already knew.

Panel characters (no Attenborough): Ray, Bear, Cody, Hales, Fox, Stroud.

Generate initial assessment. Also produce 3 specific suggested first actions.

OUTPUT — valid JSON only, no markdown:
{"survival_probability":<integer 0-100>,"attenborough_opening":"<one sentence, nature doc, introduces situation as wildlife encounter, slightly ominous>","panel":[{"charId":"<id>","text":"<2-4 sentences>","death":<bool>,"fact_check":"<optional Bear only>"}],"attenborough_verdict":"<one sentence, geological calm, no appeal, the documentary's conclusion>","next_actions":["<action>","<action>","<action>"]}\`;
}



// === state.js ===

// state.js — v2 with interaction loop state
// Single responsibility: all state management. No DOM. No API.

const DEFAULT_STATE = {
  mode: 'guided',
  guided: { loc: '', sit: '', who: '', wx: '' },
  free: { text: '' },
  status: 'idle',         // idle | loading | results | reacting | terminal
  situation: null,        // built situation string, persists across reactions
  probability: null,      // current survival probability
  turnCount: 0,           // how many decisions made
  history: []             // array of {decision, probability, situationUpdate}
};

let _state = JSON.parse(JSON.stringify(DEFAULT_STATE));

const getState = () => JSON.parse(JSON.stringify(_state));
const setMode = (mode) => { _state.mode = mode; };
const setGuidedField = (field, value) => { _state.guided[field] = value; };
const setFreeText = (text) => { _state.free.text = text; };
const setStatus = (status) => { _state.status = status; };

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

function reset() {
  _state = JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function buildSituation() {
  if (_state.mode === 'free') return _state.free.text.trim() || null;
  const { loc, sit, who, wx } = _state.guided;
  if (!loc && !sit) return null;
  return [
    loc && \`Location: \${loc}\`,
    sit && \`Situation: \${sit}\`,
    who && \`With you: \${who}\`,
    wx  && \`Conditions: \${wx}\`
  ].filter(Boolean).join('\\n');
}

  getState, setMode, setGuidedField, setFreeText,
  setStatus, setProbability, setSituation, recordDecision,
  reset, buildSituation
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

function clearAll() {
  ['loc', 'sit', 'who', 'wx'].forEach(f => {
    const el = document.getElementById(\`\${f}-input\`);
    if (el) el.value = '';
    clearChips(f);
  });
  const free = document.getElementById('free-input');
  if (free) free.value = '';
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
    card.className = 'char-card' + (r.death ? ' death-card' : '');
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
      setTimeout(() => showTerminal(data.survival_probability), nextDelay);
    } else {
      setTimeout(() => showDecisionInput(data.next_actions, data.survival_probability, onDecision), nextDelay);
    }
  } else {
    if (data.is_terminal) {
      showTerminal(data.survival_probability);
    } else {
      setTimeout(() => showDecisionInput(data.next_actions, data.survival_probability, onDecision), 800);
    }
  }
}

// Terminal state
function showTerminal(probability) {
  const block = document.getElementById('interaction-block');
  block.style.display = 'block';

  if (probability <= 0) {
    block.innerHTML = \`
      <div class="terminal terminal-dead">
        <div class="terminal-label">YOU DID NOT SURVIVE</div>
        <div class="terminal-sub">Attenborough will close proceedings.</div>
      </div>
      <div class="reset-row"><button class="btn-reset" onclick="window._onReset()">TRY AGAIN</button></div>\`;
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

  switchTab, pickChip, clearChips, clearAll,
  showLoading, showError, showResults, showReaction,
  showTerminal, hideResults, setButtonState, updateProbability,
  showAttOpening, showAttVerdict
};


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



  // Tab / chip / input handlers
  window.onTabClick = (mode) => { State.setMode(mode); UI.switchTab(mode); };
  window.onChip = (el, field, val) => {
    State.setGuidedField(field, val);
    UI.pickChip(el, field);
    document.getElementById(\`\${field}-input\`).value = val;
  };
  window.onFieldInput = (field, val) => { State.setGuidedField(field, val); UI.clearChips(field); };
  window.onFreeInput = (val) => State.setFreeText(val);
  window.onClear = () => { State.reset(); UI.clearAll(); };

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
  <title>How Bad Is This? — Survival School</title>
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
    <div class="title">HOW <span>BAD</span> IS THIS?</div>
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

  <div class="field-label">What happened?</div>
  <div class="chips" id="chips-event">
    <div class="chip" onclick="onChip(this,'event','bitten by a snake')">bitten by snake</div>
    <div class="chip" onclick="onChip(this,'event','stung or bitten by something venomous')">stung / bitten</div>
    <div class="chip" onclick="onChip(this,'event','bear encounter, it\\'s charging')">bear charging</div>
    <div class="chip" onclick="onChip(this,'event','something is circling me')">being circled</div>
    <div class="chip" onclick="onChip(this,'event','knocked from boat into open water')">overboard</div>
    <div class="chip" onclick="onChip(this,'event','I\\'ve been stalked for the last 20 minutes')">being stalked</div>
    <div class="chip" onclick="onChip(this,'event','pinned or trapped, cannot move')">pinned / trapped</div>
    <div class="chip" onclick="onChip(this,'event','attacked by something I did not expect to be aggressive')">unexpected attack</div>
  </div>
  <input type="text" id="event-input" placeholder="or describe what happened..." oninput="onFieldInput('event',this.value)"/>

  <div class="field-label">The animal or hazard</div>
  <div class="chips" id="chips-animal">
    <div class="chip" onclick="onChip(this,'animal','king cobra')">king cobra</div>
    <div class="chip" onclick="onChip(this,'animal','black mamba')">black mamba</div>
    <div class="chip" onclick="onChip(this,'animal','Brazilian wandering spider')">Brazilian wandering spider</div>
    <div class="chip" onclick="onChip(this,'animal','grizzly bear')">grizzly bear</div>
    <div class="chip" onclick="onChip(this,'animal','polar bear')">polar bear</div>
    <div class="chip" onclick="onChip(this,'animal','great white shark')">great white shark</div>
    <div class="chip" onclick="onChip(this,'animal','saltwater crocodile')">saltwater croc</div>
    <div class="chip" onclick="onChip(this,'animal','Komodo dragon')">Komodo dragon</div>
    <div class="chip" onclick="onChip(this,'animal','pack of spotted hyenas')">hyena pack</div>
    <div class="chip" onclick="onChip(this,'animal','box jellyfish')">box jellyfish</div>
    <div class="chip" onclick="onChip(this,'animal','hippo')">hippo</div>
    <div class="chip" onclick="onChip(this,'animal','cassowary')">cassowary</div>
    <div class="chip" onclick="onChip(this,'animal','manatee')">manatee</div>
    <div class="chip" onclick="onChip(this,'animal','swan')">swan</div>
  </div>
  <input type="text" id="animal-input" placeholder="or name the animal or hazard..." oninput="onFieldInput('animal',this.value)"/>

  <div class="field-label">Circumstances</div>
  <div class="chips" id="chips-circ">
    <div class="chip" onclick="onChip(this,'circ','alone, no communication')">alone, no comms</div>
    <div class="chip" onclick="onChip(this,'circ','2 hours from nearest hospital')">2hrs from hospital</div>
    <div class="chip" onclick="onChip(this,'circ','remote wilderness, helicopter is the only option')">remote, heli only</div>
    <div class="chip" onclick="onChip(this,'circ','urban, ambulance 10 minutes away')">urban, 10min ETA</div>
    <div class="chip" onclick="onChip(this,'circ','no medical kit at all')">no kit</div>
    <div class="chip" onclick="onChip(this,'circ','basic first aid kit available')">first aid kit</div>
    <div class="chip" onclick="onChip(this,'circ','dark, nightfall already')">nightfall</div>
    <div class="chip" onclick="onChip(this,'circ','trained medic in the group')">medic with me</div>
  </div>
  <input type="text" id="circ-input" placeholder="or describe your circumstances..." oninput="onFieldInput('circ',this.value)"/>

  <div class="btn-row">
    <button class="btn-assess" id="btn-assess" onclick="onAssess()">HOW BAD IS THIS? ↗</button>
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
    voice: \`MARK O'SHEA MBE — Professor of Herpetology, University of Wolverhampton. WHO snakebite expert.
Named his king cobra "Sleeping Beauty." Got bitten regularly despite the papers. Book: Blood, Sweat and Snakebites.
Golden Rule: No Set-ups. Still got bitten. Ready Steady Cook alumnus.
VOICE: Academically precise, slightly barbed (Fawlty Towers register — right, but somehow you enjoy watching things go wrong for him).
References "chapter seven" of his own published work. Credentialled recklessness.
Comedy: gap between his credentials and the number of times animals have ignored them.
Genuinely surprised when animal deviates from the published literature. Every time.\`
  },
  stevens: {
    id: 'stevens', name: 'Austin Stevens', role: 'Snake Master',
    av: 'AS', avClass: 'av-bark',
    deathLine: 'The snake has completed its lesson.',
    voice: \`AUSTIN STEVENS — Spent 107 days in a cage with 36 of Africa's most venomous snakes. Got bitten by a cobra on day 96. Refused to leave. Completed the full 107 days.
Juggled a sleeping Amazon Tree Boa. Prodded a docile boomslang. Was bitten in almost every episode.
Genuinely believes he has a spiritual connection with snakes. The snakes do not share this belief.
VOICE: Grandiose, mystical, completely unbothered by evidence. Every bite is communion. Every near-death is spiritual growth.
Only fully engaged if there's a snake or venomous creature involved. Everything else is background noise.
"Was there a snake?" fires when the incident doesn't involve one.
The snake didn't bite him — it chose to share its venom as a gift.\`
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
- Ray: immediate triage. What to do right now. Craft-based. Brief, no drama.
- Fox: tactical — is the threat still active? Exit routes? What does the user have available?
- O'Shea: medical/herpetological expertise. References chapter numbers. Surprised if animal deviated from his published literature.
- Stevens: spiritual interpretation. Only fully engaged if snake or venomous creature involved — "Was there a snake?" fires if not.
- Bear: personal anecdote, somewhere exotic, fine in the end. Hydration check.
- Hales: understated, educational. "Have a look at this." "Not too bad — a bit starchy." 1-2 sentences. Never dramatic.
- Cody: verdict + ACTION LINE — a single, specific imperative sentence. What to do RIGHT NOW.

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
      (isCody ? ' cody-card' : '');
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

Panel characters (no Attenborough): Ray, Bear, Cody, Hales, Fox, Stroud.
- Ray: is it technically correct? Craft judgement. Brief.
- Bear: anecdote, probably did something similar somewhere exotic, hydration check.
- Cody: was there a better option right there they missed?
- Hales: brief, understated, educational. "Have a look at this." "Not too bad." "She'll be right." Cites Aboriginal knowledge. 1-3 sentences.
- Fox: tactical assessment — lines of sight, threat exposure, exit options, what's available.
- Stroud: quiet verdict.

Survival probability shifts:
- Good decision: +10 to +20
- Neutral: no change
- Poor: -15 to -25
- Catastrophic: -30 to -50

Generate 3 specific next actions the user could take from here.
If probability reaches 0 or situation fully resolves, set is_terminal to true.

OUTPUT — valid JSON only, no markdown:
{"survival_probability":<integer>,"attenborough_opening":"<one sentence, nature doc, frames what the decision is about to cause>","situation_update":"<one sentence what changed>","panel":[{"charId":"<id>","text":"<2-3 sentences>","death":<bool>,"fact_check":"<optional — Bear only>"}],"attenborough_verdict":"<one sentence, geological calm, turn conclusion, he already knew>","next_actions":["<action>","<action>","<action>"],"is_terminal":<bool>}\`;
  }

  if (mode === 'mundane') {
    return \`You are the Survival School panel. The user has described a MUNDANE, EVERYDAY problem. Apply full survival gravity. This is the joke — the greater the gravity, the funnier.

\${chars}

\${SHARED_CONTEXT}

MUNDANE MODE: The situation is not a survival emergency. The panel doesn't know this.
They assess with the same weight they would give a man trapped on Dartmoor in October.
Ray identifies three immediate risks. Fox assesses lines of sight. Cody notes what was available nearby. Bear has done something similar abroad.

ATTENBOROUGH BOOKEND STRUCTURE — Attenborough does NOT appear in the panel array. He bookends:
- attenborough_opening: one sentence, introduces the mundane situation as if it's a wildlife encounter. "And here, in the fluorescent ecology of the Wetherspoons, a specimen faces a challenge that, while modest in geological terms, carries its own quiet urgency."
- attenborough_verdict: one sentence, geological calm. Final verdict. He always knew.

Panel characters (no Attenborough): Ray, Bear, Cody, Hales, Fox, Stroud.
- Ray: identifies real risks in the mundane situation. Genuinely concerned.
- Bear: has done something similar, abroad, fine in the end.
- Cody: points out the better option that was right there. "The bus stop. Fifty yards away."
- Hales: understated, educational. 1-2 sentences. "Have a look at this." Cites Aboriginal knowledge.
- Fox: tactical assessment of the mundane. Exit routes from the post office queue.
- Stroud: quiet, measured verdict. Slightly melancholy.

Survival probability: 0-100. For mundane scenarios this is usually 40-85% — they're not great situations, but survivable with the right mindset. A truly catastrophic mundane scenario (printer has run out of ink, presentation in 10 minutes) may drop lower.

OUTPUT — valid JSON only, no markdown:
{"survival_probability":<integer 0-100>,"attenborough_opening":"<one sentence, nature documentary, introduces mundane situation as wildlife encounter>","panel":[{"charId":"<id>","text":"<2-3 sentences>","death":<bool>,"fact_check":"<optional Bear only>"}],"attenborough_verdict":"<one sentence, geological calm, final verdict>"}\`;
  }

  return \`You are the Survival School panel assessment engine.

\${chars}

\${SHARED_CONTEXT}

ATTENBOROUGH BOOKEND STRUCTURE — Attenborough does NOT appear in the panel array. He bookends the whole assessment:
- attenborough_opening: one sentence, nature documentary register, introduces the situation as if it's a wildlife encounter. Sets the stakes. Slightly ominous.
- attenborough_verdict: one sentence, geological calm, no appeal. The documentary's conclusion. He already knew.

Panel characters (no Attenborough): Ray, Bear, Cody, Hales, Fox, Stroud.

Generate initial assessment. Also produce 3 specific suggested first actions.

OUTPUT — valid JSON only, no markdown:
{"survival_probability":<integer 0-100>,"attenborough_opening":"<one sentence, nature doc, introduces situation as wildlife encounter, slightly ominous>","panel":[{"charId":"<id>","text":"<2-4 sentences>","death":<bool>,"fact_check":"<optional Bear only>"}],"attenborough_verdict":"<one sentence, geological calm, no appeal, the documentary's conclusion>","next_actions":["<action>","<action>","<action>"]}\`;
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
        card.className = 'char-card' + (r.death ? ' death-card' : '');
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

// ─ Animal database ─────────────────────────────────────────────────────────────
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
    document.getElementById('input-a').value = name;
  } else {
    selB = name;
    document.getElementById('input-b').value = name;
  }
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

  const situation = \`MATCHUP: \${a} vs \${b}\nENVIRONMENT: \${env}\nRun three rounds. Determine the winner.\`;

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
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    const apiKey = request.headers.get('x-api-key') || env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: 'No API key configured on server' } }), {
        status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
    if (url.pathname === '/survival-school/assess') {
      const body = await request.json();
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'anthropic-version': '2023-06-01', 'x-api-key': apiKey },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: body.max_tokens || 1500, system: body.system, messages: [{ role: 'user', content: body.situation }] }),
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
