// ── API Client — all Claude API communication ─────────────────────────────────
// SRP: only module that calls the API
// OCP: extend by changing system prompts, not modifying callClaude
// Exposes global: API

const API = (() => {
  const ENDPOINT           = 'https://cusslab-api.leanspirited.workers.dev';
  const DEFAULT_MODEL      = 'claude-sonnet-4-6';
  const DEFAULT_MAX_TOKENS = 1000;
  const KEY_STORAGE        = 'hecklers_api_key';
  const ERROR_LOG_KEY      = 'hecklers_error_log';
  const LAST_SUCCESS_KEY   = 'hecklers_last_success';
  const ERROR_LOG_MAX      = 50;
  const LOG_PREFIX         = '[Hecklers]';

  // ── Key management ──────────────────────────────────────────────────────────

  function getKey() {
    try { return localStorage.getItem(KEY_STORAGE) || ''; }
    catch(e) { return ''; }
  }

  function setKey(k) {
    const trimmed = (k || '').trim();
    try {
      if (trimmed) localStorage.setItem(KEY_STORAGE, trimmed);
      else localStorage.removeItem(KEY_STORAGE);
    } catch(e) { _logError('settings', 'Could not save API key', e); }
    updateKeyStatus();
  }

  // ── Structured developer logging ────────────────────────────────────────────

  function _logCall(panel, status, durationMs, detail) {
    console.log(`${LOG_PREFIX} API call: ${panel} — ${status} (${durationMs}ms)${detail ? ' — ' + detail : ''}`);
  }

  function _logError(panel, message, err) {
    const status = err?.status || err?.message?.match(/\d{3}/)?.[0] || 'unknown';
    console.error(`${LOG_PREFIX} ERROR: ${panel} — ${message}`, err || '');
    _writeErrorLog({ panel, message, status, timestamp: Date.now() });
  }

  // ── Client-side error log ───────────────────────────────────────────────────

  function _writeErrorLog(entry) {
    try {
      const raw  = localStorage.getItem(ERROR_LOG_KEY);
      const log  = raw ? JSON.parse(raw) : [];
      log.unshift(entry);
      if (log.length > ERROR_LOG_MAX) log.length = ERROR_LOG_MAX;
      localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(log));
      updateKeyStatus(); // refresh error count in Settings
    } catch(e) { /* localStorage unavailable */ }
  }

  function getErrorLog() {
    try {
      const raw = localStorage.getItem(ERROR_LOG_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
  }

  function clearErrorLog() {
    try { localStorage.removeItem(ERROR_LOG_KEY); }
    catch(e) { /* ignore */ }
    updateKeyStatus();
  }

  // ── User-facing error messages — specific and actionable ────────────────────

  function _userMessage(status, errBody) {
    if (status === 401)     return 'API key rejected — check your key in ⚙️ Settings.';
    if (status === 400) {
      const msg = errBody?.error?.message || '';
      if (msg.includes('credit balance')) return 'Out of API credits — add billing at console.anthropic.com.';
      return 'Bad request — your API key may be invalid. Check ⚙️ Settings.';
    }
    if (status === 403)     return 'API key doesn\'t have permission for this request.';
    if (status === 429)     return 'Too many requests — wait a moment and try again.';
    if (status === 529)     return 'Anthropic is overloaded — try again in a few seconds.';
    if (status === 500)     return 'Anthropic server error — try again shortly.';
    if (status === 'network') return 'No network connection — check your internet.';
    const msg = errBody?.error?.message;
    if (msg && msg.length < 120) return `Request failed: ${msg}`;
    return 'Request failed — if this persists, check status.anthropic.com';
  }

  // ── Core API call ───────────────────────────────────────────────────────────

  async function call(systemPrompt, userMessage, maxTokens = DEFAULT_MAX_TOKENS, panel = 'unknown') {
    const key   = getKey();
    const start = Date.now();

    const headers = {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    };
    if (key) headers['x-api-key'] = key;

    let res, errBody;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      res = await fetch(ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        }),
        signal: controller.signal,
      });
    } catch(networkErr) {
      clearTimeout(timeoutId);
      const isTimeout = networkErr.name === 'AbortError';
      const msg = isTimeout ? 'Request timed out — please try again.' : _userMessage('network', null);
      _logError(panel, isTimeout ? 'Timeout (30s)' : 'Network failure', networkErr);
      throw Object.assign(new Error(msg), { userMessage: msg });
    }
    clearTimeout(timeoutId);

    const duration = Date.now() - start;

    if (!res.ok) {
      errBody = await res.json().catch(() => ({}));
      const msg = _userMessage(res.status, errBody);
      _logError(panel, `HTTP ${res.status}`, { status: res.status, body: errBody });
      throw Object.assign(new Error(msg), { userMessage: msg, status: res.status });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || '';
    _logCall(panel, 'ok', duration);

    try { localStorage.setItem(LAST_SUCCESS_KEY, Date.now().toString()); } catch(e) { /* localStorage unavailable — non-fatal */ }
    updateKeyStatus();

    return text;
  }

  // ── Safe JSON call ──────────────────────────────────────────────────────────

  async function callJSON(systemPrompt, userMessage, maxTokens = DEFAULT_MAX_TOKENS, fallback = {}, panel = 'unknown') {
    const text = await call(systemPrompt, userMessage, maxTokens, panel);
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      const start = clean.indexOf('{');
      const end   = clean.lastIndexOf('}');
      if (start === -1 || end === -1) return fallback;
      return JSON.parse(clean.slice(start, end + 1));
    } catch {
      console.warn(`${LOG_PREFIX} JSON parse failed for ${panel}:`, text.substring(0, 200));
      return fallback;
    }
  }

  // ── Status UI ───────────────────────────────────────────────────────────────

  function updateKeyStatus() {
    const k          = getKey();
    const errors     = getErrorLog();
    const lastSuccess = localStorage.getItem(LAST_SUCCESS_KEY);
    const recentErrors = errors.filter(e => Date.now() - e.timestamp < 3600000).length;

    // Header indicator
    const indicator = document.getElementById('key-status-indicator');
    if (indicator) {
      if (!k) {
        indicator.textContent = '● No API key';
        indicator.style.color = '#f87171';
      } else if (recentErrors > 0) {
        indicator.textContent = `● ${recentErrors} error${recentErrors > 1 ? 's' : ''} — check Settings`;
        indicator.style.color = '#fb923c';
      } else {
        indicator.textContent = '● Connected';
        indicator.style.color = '#4ade80';
      }
    }

    // Settings key input display — skip if user is actively editing
    const inp = document.getElementById('settings-key-input');
    if (inp && document.activeElement !== inp) inp.value = k ? (k.slice(0, 12) + '...' + k.slice(-4)) : '';

    // Settings connection status
    const detail = document.getElementById('settings-status-detail');
    if (detail) {
      if (!k) {
        detail.innerHTML = '<span style="color:#f87171">● No key saved.</span> Complete steps 1 and 2 above.';
      } else if (lastSuccess) {
        const ago = _timeAgo(parseInt(lastSuccess));
        detail.innerHTML = `<span style="color:#4ade80">● Connected</span> — key ending in ...${k.slice(-4)}. Last successful call: ${ago}.`;
      } else {
        detail.innerHTML = `<span style="color:#fb923c">● Key saved — not yet verified.</span> Try a panel to test it.`;
      }
    }

    // Settings error log section
    _renderErrorLogUI(errors, recentErrors);
  }

  function _timeAgo(ts) {
    const secs = Math.floor((Date.now() - ts) / 1000);
    if (secs < 60)  return 'just now';
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    return `${Math.floor(secs / 3600)}h ago`;
  }

  function _renderErrorLogUI(errors, recentErrors) {
    const el = document.getElementById('settings-error-log');
    if (!el) return;

    if (errors.length === 0) {
      el.innerHTML = '<p style="color:var(--muted);font-size:13px;">✓ No errors logged.</p>';
      return;
    }

    const recent5 = errors.slice(0, 5);
    const rows = recent5.map(e => {
      const t = _timeAgo(e.timestamp);
      const colour = e.status >= 500 ? '#fb923c' : '#f87171';
      return `<div style="display:flex;gap:12px;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px;">
        <span style="color:var(--muted);white-space:nowrap;">${t}</span>
        <span style="color:${colour};flex:1;">${e.panel} — ${e.message}${e.status ? ' (' + e.status + ')' : ''}</span>
      </div>`;
    }).join('');

    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:13px;color:${recentErrors > 0 ? '#fb923c' : 'var(--muted)'};">
          ${recentErrors > 0 ? `${recentErrors} error${recentErrors > 1 ? 's' : ''} in the last hour` : 'No recent errors'}
        </span>
        <button onclick="API.clearErrorLog()"
          style="background:transparent;color:var(--muted);border:1px solid var(--border);border-radius:4px;padding:2px 8px;font-size:11px;cursor:pointer;">
          Clear log
        </button>
      </div>
      ${rows}
      ${errors.length > 5 ? `<p style="color:var(--muted);font-size:11px;margin-top:6px;">${errors.length - 5} older errors in log.</p>` : ''}
    `;
  }

  function initKeyUI() {
    updateKeyStatus();
  }

  return { call, callJSON, getKey, setKey, initKeyUI, updateKeyStatus, getErrorLog, clearErrorLog };
})();
