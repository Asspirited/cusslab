#!/usr/bin/env bash
# deploy.sh — ONE canonical deploy for cusslab-api.
# --config is mandatory. NEVER construct the wrangler command by hand.
# Usage: bash .claude/scripts/deploy.sh

set -euo pipefail

export NVM_DIR="/home/rodent/.nvm"
\. "$NVM_DIR/nvm.sh"

TOKEN=$(cat /home/rodent/.cf-deploy-token)

CLOUDFLARE_API_TOKEN="$TOKEN" \
CLOUDFLARE_ACCOUNT_ID="ce5ebfc99d1b37a7537a039d0b09d0b6" \
  npx wrangler deploy --config /home/rodent/cusslab/wrangler.toml
