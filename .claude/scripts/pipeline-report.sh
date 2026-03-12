#!/usr/bin/env bash
# pipeline-report.sh — self-contained pipeline runner
# Contract: specs/pipeline-report.feature
# Never call nvm externally — bootstrap is internal

export NVM_DIR="/home/rodent/.nvm"
\. "$NVM_DIR/nvm.sh"

cd /home/rodent/cusslab

OUTPUT=$(npm run pipeline 2>&1)
EXIT_CODE=$?

echo "$OUTPUT" | grep -E "(Tests|Gherkin|E2E|canary|passing|failing|statements|branches)" | head -20

if [ $EXIT_CODE -ne 0 ]; then
  echo "PIPELINE RED"
  exit 1
fi

CANARY=$(echo "$OUTPUT" | grep -i canary)
if echo "$CANARY" | grep -qi "red\|fail\|error"; then
  echo "Canary: RED"
  exit 1
fi

echo "Canary: OK"
exit 0
