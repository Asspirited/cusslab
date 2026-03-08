// Worker Canary — pings cusslab-api worker at session start
// Warns if ANTHROPIC_API_KEY secret is stale or missing.
// Always exits 0 — this is a warning, not a pipeline failure.
// Run: node pipeline/worker-canary.js

'use strict';

const https = require('https');

const ENDPOINT    = 'cusslab-api.cusslab.workers.dev';
const TIMEOUT_MS  = 8000;

function ping() {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 1,
      messages:   [{ role: 'user', content: 'ping' }],
    });

    const req = https.request({
      hostname: ENDPOINT,
      method:   'POST',
      path:     '/',
      headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      res.resume(); // drain
      resolve(res.statusCode);
    });

    req.setTimeout(TIMEOUT_MS, () => { req.destroy(); resolve('timeout'); });
    req.on('error', () => resolve('network'));
    req.write(body);
    req.end();
  });
}

(async () => {
  const status = await ping();

  if (status === 200 || status === 529) {
    // 529 = Anthropic overloaded — worker auth is fine
    console.log(`  ✓ Worker canary: OK (HTTP ${status})`);
  } else if (status === 401 || status === 403) {
    console.log(`  ⚠ Worker canary: WARN — HTTP ${status} — ANTHROPIC_API_KEY secret is stale or revoked`);
    console.log(`    Fix: dash.cloudflare.com → My Profile → API Tokens → Edit Cloudflare Workers`);
    console.log(`         CLOUDFLARE_API_TOKEN=<token> wrangler secret put ANTHROPIC_API_KEY`);
    console.log(`    Note: if you have your own key in Settings, the live site still works.`);
  } else if (status === 500) {
    console.log(`  ⚠ Worker canary: WARN — HTTP 500 — worker has no ANTHROPIC_API_KEY secret configured`);
    console.log(`    Fix: CLOUDFLARE_API_TOKEN=<token> wrangler secret put ANTHROPIC_API_KEY`);
  } else if (status === 'timeout') {
    console.log(`  ⚠ Worker canary: WARN — request timed out (>${TIMEOUT_MS}ms) — worker may be down`);
  } else if (status === 'network') {
    console.log(`  ⚠ Worker canary: WARN — network error — no internet or worker unreachable`);
  } else {
    console.log(`  ⚠ Worker canary: WARN — unexpected HTTP ${status}`);
  }

  console.log(`\nWorker Canary: checked\n`);
  process.exit(0); // always — warning only, never block pipeline
})();
