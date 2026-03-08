// Worker Canary — pings cusslab-api worker at session start
// Warns if ANTHROPIC_API_KEY secret is stale or missing.
// Exits 1 on auth failure — this is session-blocking, not a warning.
// Run: node pipeline/worker-canary.js

'use strict';

const https = require('https');

const ENDPOINT    = 'cusslab-api.leanspirited.workers.dev';
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
    console.log(`  ✘ Worker canary: RED — HTTP ${status} — ANTHROPIC_API_KEY secret is stale or revoked`);
    console.log(`    Fix: dash.cloudflare.com → My Profile → API Tokens → Edit Cloudflare Workers template`);
    console.log(`         echo "sk-ant-..." | CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6 npx wrangler secret put ANTHROPIC_API_KEY`);
    console.log(`         Then: npx wrangler deploy (with same env vars)`);
    console.log(`    SESSION BLOCKED — fix before any other work.`);
    console.log(`\nWorker Canary: FAIL\n`);
    process.exit(1);
  } else if (status === 500) {
    console.log(`  ✘ Worker canary: RED — HTTP 500 — worker has no ANTHROPIC_API_KEY secret configured`);
    console.log(`    Fix: echo "sk-ant-..." | CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6 npx wrangler secret put ANTHROPIC_API_KEY`);
    console.log(`    SESSION BLOCKED — fix before any other work.`);
    console.log(`\nWorker Canary: FAIL\n`);
    process.exit(1);
  } else if (status === 'timeout') {
    console.log(`  ⚠ Worker canary: WARN — request timed out (>${TIMEOUT_MS}ms) — worker may be down`);
  } else if (status === 'network') {
    console.log(`  ⚠ Worker canary: WARN — network error — no internet or worker unreachable`);
  } else {
    console.log(`  ⚠ Worker canary: WARN — unexpected HTTP ${status}`);
  }

  console.log(`\nWorker Canary: checked\n`);
  process.exit(0);
})();
