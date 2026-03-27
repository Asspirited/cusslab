#!/bin/bash
# deploy.sh — one command to deploy the Cusslab worker
# Usage: bash ~/cusslab/deploy.sh <cloudflare_api_token>
# Get token: dash.cloudflare.com → My Profile → API Tokens → Edit Cloudflare Workers template

set -e

TOKEN="${1:-$CLOUDFLARE_API_TOKEN}"

if [ -z "$TOKEN" ]; then
  echo "Usage: bash ~/cusslab/deploy.sh <cloudflare_api_token>"
  echo "Get token: dash.cloudflare.com → My Profile → API Tokens → Edit Cloudflare Workers template"
  exit 1
fi

export CLOUDFLARE_API_TOKEN="$TOKEN"
export CLOUDFLARE_ACCOUNT_ID="ce5ebfc99d1b37a7537a039d0b09d0b6"

echo "Deploying cusslab worker..."
npx wrangler deploy --config /home/rodent/cusslab/wrangler.toml

echo ""
echo "Verifying..."
sleep 2
curl -s https://cusslab-api.leanspirited.workers.dev/survival-school/deathmatch | head -c 50
echo ""
echo "Done. If you see HTML above, it's live."
