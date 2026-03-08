# Auth Ops — Heckler and Cox

Canonical runbook for all authentication, secrets, and Worker operations.
Read at every session start. Do not rely on MEMORY.md for auth — it truncates.

---

## The Law

**Canary RED = session blocked. Fix before anything else. No exceptions.**
"Not session-blocking" is never correct. The shared Worker key is the core product promise.

---

## Canonical URLs and IDs

| Thing | Value |
|---|---|
| Worker URL | `https://cusslab-api.leanspirited.workers.dev` |
| Worker name (wrangler.toml) | `cusslab-api` |
| Cloudflare account | leanspirited@gmail.com |
| Cloudflare account ID | `ce5ebfc99d1b37a7537a039d0b09d0b6` |
| WRONG URL (do not use) | `cusslab-api.cusslab.workers.dev` — stale, always 401 |

---

## Why wrangler login never works

wrangler has a stale cached account ID (`7721964c...`) that differs from the real account (`ce5ebfc9...`).
Every auth attempt hits the wrong account → auth error → wrangler suggests login → browser loop.
`wrangler login` opens a browser that cannot resolve it. Never suggest it. Never use it.

---

## Pushing a new ANTHROPIC_API_KEY — full procedure

### Step 1 — Get a Cloudflare API token
dash.cloudflare.com → leanspirited@gmail.com → My Profile → API Tokens → Create Token
Use the **"Edit Cloudflare Workers" template** (not custom — custom lacks secrets write permission).
Copy the token.

### Step 2 — Get a fresh Anthropic key
console.anthropic.com → API Keys → Create Key
Ask: "Is this a key you just generated right now?" before pushing. If uncertain, generate a new one.
A key that was previously on the Worker and revoked will still look valid but return 401.

### Step 3 — Push the secret
```bash
export NVM_DIR="/home/rodent/.nvm" && \. "/home/rodent/.nvm/nvm.sh" && cd /home/rodent/cusslab
echo "sk-ant-..." | CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6 npx wrangler secret put ANTHROPIC_API_KEY
```

### Step 4 — Redeploy the Worker
Secrets don't always propagate without a redeploy:
```bash
CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=ce5ebfc99d1b37a7537a039d0b09d0b6 npx wrangler deploy
```

### Step 5 — Verify
```bash
curl -s -w "%{http_code}" -X POST https://cusslab-api.leanspirited.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-haiku-4-5-20251001","max_tokens":10,"messages":[{"role":"user","content":"ping"}]}'
```
Expected: `200`. Anything else: do not proceed.

---

## Diagnosing a canary failure

| HTTP status | Meaning | Fix |
|---|---|---|
| 401 | Key rejected by Anthropic | Push new key (Steps 2-5 above) |
| 403 | Cloudflare auth error | Check API token permissions |
| 500 | No key configured on Worker | Push key (Steps 1-5 above) |
| timeout | Worker down or unreachable | Check Cloudflare dashboard |
| 200 | OK | Nothing to do |

If 401 persists after pushing a new key: test the key directly against api.anthropic.com first.
If direct test also 401: the key itself is invalid — generate another.
If direct test passes but Worker returns 401: redeploy (Step 4).

---

## Waste log entries (auth recurring failures)

- WL-060: wrangler login loop — stale cached account ID. Closed 2026-03-08.
- WL-065: canary treated as non-blocking. Closed 2026-03-08.
- WL-066: wrong Worker URL in pipeline and MEMORY.md — recurring. Closed 2026-03-08.
- WL-067: stale key pushed as fresh — always ask before pushing. Closed 2026-03-08.

If a new auth failure appears: add a WL entry before fixing. Auth failures are never one-offs.
