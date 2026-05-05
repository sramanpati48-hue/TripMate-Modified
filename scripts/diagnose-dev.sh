#!/usr/bin/env bash
set -euo pipefail

KILL=false
if [[ ${1-} == "kill" ]]; then
  KILL=true
fi

echo "Checking for process listening on port 3000..."
if command -v ss >/dev/null 2>&1; then
  LISTEN=$(ss -ltnp 2>/dev/null | grep ':3000' || true)
else
  LISTEN=$(lsof -i :3000 -sTCP:LISTEN -Pn 2>/dev/null || true)
fi

if [[ -n "$LISTEN" ]]; then
  echo "Port 3000 is in use:";
  echo "$LISTEN"
  if [[ "$KILL" == "true" ]]; then
    PID=$(echo "$LISTEN" | awk '{print $NF}' | sed -E 's/.*pid=([0-9]+).*/\1/' | head -n1)
    if [[ -n "$PID" ]]; then
      echo "Killing PID $PID"
      kill -9 "$PID" || true
    else
      echo "Could not parse PID. Manually inspect above output."
    fi
  else
    echo "To kill the process and free the port, re-run with: ./scripts/diagnose-dev.sh kill"
    exit 0
  fi
else
  echo "No process is listening on port 3000."
fi

echo "Running preview helper (install/generate/dev)..."
if command -v bash >/dev/null 2>&1; then
  exec ./scripts/preview-dev.sh
else
  echo "Shell not available to run preview helper. Run ./scripts/preview-dev.sh manually."
fi
