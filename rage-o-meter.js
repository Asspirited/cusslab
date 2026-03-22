// rage-o-meter.js
// DOM layer for the Rage-O-Meter component.
// Owns all rendering and interaction. Pure logic delegated to RageOMeterEngine.
// Load after src/logic/rage-o-meter-engine.js and after the DOM is ready.

const RageOMeter = (() => {

  const E = window.RageOMeterEngine;

  const MOODS = [
    { max: 15,  label: 'Zen. Suspicious.' },
    { max: 30,  label: 'Mildly irritated.' },
    { max: 45,  label: 'Getting tetchy.' },
    { max: 60,  label: 'Visibly annoyed.' },
    { max: 75,  label: 'Properly wound up.' },
    { max: 88,  label: 'Absolutely fuming.' },
    { max: 100, label: '🔥 VOLCANIC. LEAVE NOW.' },
  ];

  function _getMood(val) {
    return MOODS.find(m => val <= m.max)?.label || '💀';
  }

  function _getRageColor(val) {
    if (val < 30) return '#3ecf4a';
    if (val < 55) return '#f5c842';
    if (val < 75) return '#ff6b1a';
    return '#e63030';
  }

  let _characters = [];
  let _round = 1;
  let _expanded = false;
  let _sessionEnded = false;
  let _containerId = null;

  // ── Public API ──────────────────────────────────────────────────────────────

  function init(panelConfig, characters, containerId) {
    _destroy();
    if (!E.isRageEnabled(panelConfig)) return;

    _characters = characters.map(c => E.initCharacter(c.name, c.colour || c.color || '#ff6b1a'));
    _round = 1;
    _expanded = false;
    _sessionEnded = false;
    _containerId = containerId;

    _render();
  }

  function toggle() {
    _expanded = !_expanded;
    const body = document.getElementById('rom-body');
    const chevron = document.getElementById('rom-chevron');
    if (body) body.style.display = _expanded ? 'block' : 'none';
    if (chevron) chevron.textContent = _expanded ? '▲' : '▼';
  }

  function onSlider(idx, val) {
    val = parseInt(val);
    const slider = document.getElementById(`rom-slider-${idx}`);
    const c = _characters[idx];
    if (slider) {
      slider.style.background = `linear-gradient(to right, ${c.color} 0%, ${c.color} ${val}%, rgba(255,255,255,0.1) ${val}%, rgba(255,255,255,0.1) 100%)`;
    }
    const valEl = document.getElementById(`rom-sliderval-${idx}`);
    if (valEl) valEl.textContent = val;
    const moodEl = document.getElementById(`rom-mood-${idx}`);
    if (moodEl) moodEl.textContent = _getMood(val);
    const fillEl = document.getElementById(`rom-fill-${idx}`);
    if (fillEl) { fillEl.style.width = val + '%'; fillEl.style.background = _getRageColor(val); }
  }

  function commitRound() {
    _characters = _characters.map((c, i) => {
      const slider = document.getElementById(`rom-slider-${i}`);
      const val = slider ? parseInt(slider.value) : c.current;
      return E.commitRound(c, val);
    });
    _round++;
    _renderMeters();
    _renderSliders();
    const roundEl = document.getElementById('rom-round-label');
    if (roundEl) roundEl.textContent = `ROUND ${_round}`;
  }

  function endSession() {
    // Commit current slider values first
    _characters = _characters.map((c, i) => {
      const slider = document.getElementById(`rom-slider-${i}`);
      const val = slider ? parseInt(slider.value) : c.current;
      return E.commitRound(c, val);
    });
    _sessionEnded = true;
    const inputArea = document.getElementById('rom-input-area');
    const controls = document.getElementById('rom-controls');
    if (inputArea) inputArea.style.display = 'none';
    if (controls) controls.style.display = 'none';
    _renderSummary();
  }

  // ── Rendering ───────────────────────────────────────────────────────────────

  function _render() {
    const container = document.getElementById(_containerId);
    if (!container) return;

    const widget = document.createElement('div');
    widget.id = 'rom-widget';
    widget.style.cssText = 'margin-top:20px;border:1px solid rgba(255,107,26,0.25);border-radius:4px;background:#1a1510;font-family:"Share Tech Mono",monospace;';

    widget.innerHTML = `
      <div id="rom-toggle-bar" onclick="RageOMeter.toggle()" style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;cursor:pointer;user-select:none;">
        <span style="color:#ff6b1a;font-size:0.7rem;letter-spacing:0.15em;">🔥 RAGE-O-METER — ${_characters.length} COMBATANTS</span>
        <span id="rom-chevron" style="color:#ff6b1a;font-size:0.8rem;">▼</span>
      </div>
      <div id="rom-body" style="display:none;padding:0 14px 14px;">
        <div id="rom-input-area" style="margin-bottom:12px;">
          <div style="font-size:0.6rem;letter-spacing:0.15em;color:#8a7d6a;margin-bottom:8px;font-family:'Special Elite',cursive;text-transform:uppercase;">// Set rage after this round</div>
          <div id="rom-sliders" style="display:flex;flex-direction:column;gap:8px;"></div>
        </div>
        <div id="rom-controls" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;align-items:center;">
          <button onclick="RageOMeter.commitRound()" style="font-family:'Share Tech Mono',monospace;font-size:0.65rem;letter-spacing:0.1em;padding:6px 14px;border-radius:3px;border:1px solid #f5c842;background:transparent;color:#f5c842;cursor:pointer;text-transform:uppercase;">▶ Commit Round</button>
          <button onclick="RageOMeter.endSession()" style="font-family:'Share Tech Mono',monospace;font-size:0.65rem;letter-spacing:0.1em;padding:6px 14px;border-radius:3px;border:1px solid #e63030;background:transparent;color:#e63030;cursor:pointer;text-transform:uppercase;">⬛ End Session</button>
          <span id="rom-round-label" style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:#ff6b1a;letter-spacing:0.1em;margin-left:auto;">ROUND ${_round}</span>
        </div>
        <div id="rom-meters" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;"></div>
        <div id="rom-summary" style="display:none;"></div>
      </div>`;

    container.appendChild(widget);
    _renderSliders();
    _renderMeters();
  }

  function _renderSliders() {
    const container = document.getElementById('rom-sliders');
    if (!container) return;
    container.innerHTML = _characters.map((c, i) => `
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="width:90px;font-size:0.62rem;color:${c.color};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${c.name}">${c.name}</span>
        <input type="range" id="rom-slider-${i}" min="0" max="100" value="${c.current}"
          style="-webkit-appearance:none;flex:1;height:4px;border-radius:2px;outline:none;cursor:pointer;background:linear-gradient(to right,${c.color} 0%,${c.color} ${c.current}%,rgba(255,255,255,0.1) ${c.current}%,rgba(255,255,255,0.1) 100%)"
          oninput="RageOMeter.onSlider(${i},this.value)">
        <span id="rom-sliderval-${i}" style="font-family:'Bebas Neue',sans-serif;font-size:0.95rem;width:28px;text-align:right;color:${c.color};">${c.current}</span>
        <span id="rom-mood-${i}" style="font-family:'Special Elite',cursive;font-size:0.55rem;color:#8a7d6a;width:120px;">${_getMood(c.current)}</span>
      </div>`).join('');
  }

  function _renderMeters() {
    const container = document.getElementById('rom-meters');
    if (!container) return;
    container.innerHTML = _characters.map((c, i) => {
      const delta = E.computeDelta(c);
      const color = _getRageColor(c.current);
      const maxH = 20;
      const maxVal = Math.max(...c.history, 100);
      const sparkline = c.history.map(v => {
        const h = Math.max(2, Math.round((v / maxVal) * maxH));
        return `<div style="flex:1;height:${h}px;border-radius:1px;background:${_getRageColor(v)};opacity:0.7;"></div>`;
      }).join('');
      return `
        <div id="rom-card-${i}" style="background:#110e0b;border:1px solid rgba(255,255,255,0.07);border-radius:3px;padding:12px 10px;">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:${c.color};letter-spacing:0.06em;margin-bottom:2px;">${c.name}</div>
          <div style="height:20px;background:rgba(255,255,255,0.04);border-radius:2px;border:1px solid rgba(255,255,255,0.07);overflow:hidden;position:relative;margin-bottom:6px;">
            <div style="position:absolute;top:0;bottom:0;left:0;width:2px;background:rgba(255,255,255,0.3);left:${c.baseline}%;"></div>
            <div id="rom-fill-${i}" style="height:100%;width:${c.current}%;background:${color};border-radius:2px;transition:width 0.5s ease;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;color:${color};">${c.current}</span>
            <span style="font-size:0.6rem;text-align:right;color:${delta >= 0 ? '#e63030' : '#3ecf4a'};">
              <span style="font-family:'Bebas Neue',sans-serif;font-size:0.9rem;display:block;">${delta >= 0 ? '+' : ''}${delta}</span>
              <span style="color:#8a7d6a;font-size:0.45rem;">FROM BASE</span>
            </span>
          </div>
          <div style="display:flex;gap:2px;align-items:flex-end;height:${maxH}px;">${sparkline}</div>
        </div>`;
    }).join('');
  }

  function _renderSummary() {
    const container = document.getElementById('rom-summary');
    if (!container) return;
    container.style.display = 'block';

    const ranked = E.rankByDelta(_characters);
    const maxDelta = Math.max(...ranked.map(c => Math.abs(E.computeDelta(c))), 1);
    const verdict = E.buildVerdict(ranked);

    const bars = ranked.map(c => {
      const delta = E.computeDelta(c);
      const pct = Math.round(Math.abs(delta) / maxDelta * 100);
      const color = delta >= 0 ? _getRageColor(c.current) : '#3ecf4a';
      const sign = delta >= 0 ? '+' : '';
      return `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:0.9rem;color:${c.color};width:90px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c.name}</div>
          <div style="flex:1;height:18px;background:rgba(255,255,255,0.04);border-radius:2px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:${color};border-radius:2px;transition:width 1s ease;min-width:3px;"></div>
          </div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:0.9rem;color:${color};width:44px;text-align:right;flex-shrink:0;">${sign}${delta}</div>
        </div>`;
    }).join('');

    container.innerHTML = `
      <div style="margin-top:14px;padding-top:14px;border-top:1px solid rgba(230,48,48,0.3);">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:#e63030;letter-spacing:0.1em;margin-bottom:4px;">🏴 POST-BATTLE AUTOPSY</div>
        <div style="font-size:0.55rem;letter-spacing:0.15em;color:#8a7d6a;font-family:'Special Elite',cursive;margin-bottom:14px;">// RAGE DELTA FROM BASELINE</div>
        ${bars}
        <div style="margin-top:14px;padding:12px;background:rgba(230,48,48,0.07);border-left:3px solid #e63030;font-family:'Special Elite',cursive;font-size:0.75rem;line-height:1.6;color:#e8dcc8;">
          <div style="font-size:0.5rem;letter-spacing:0.2em;color:#e63030;margin-bottom:4px;">// VERDICT</div>
          ${verdict}
        </div>
      </div>`;
  }

  function _destroy() {
    const existing = document.getElementById('rom-widget');
    if (existing) existing.remove();
  }

  return { init, toggle, onSlider, commitRound, endSession };

})();
