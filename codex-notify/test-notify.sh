#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_BIN="${NODE_BIN:-node}"
TITLE="${1:-Manual notify test}"
PROMPT_TEXT="${2:-This is a manual test from test-notify.sh}"
CWD_TEXT="${3:-$PWD}"

PAYLOAD=$(cat <<JSON
{"type":"agent-turn-complete","thread-id":"manual-test","turn-id":"manual-turn","cwd":"$CWD_TEXT","input-messages":["$PROMPT_TEXT"],"last-assistant-message":"$TITLE"}
JSON
)

exec "$NODE_BIN" "$SCRIPT_DIR/notify.js" "$PAYLOAD"
