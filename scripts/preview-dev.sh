#!/usr/bin/env bash
# Cross-platform-ish preview script for Unix shells (macOS, WSL, Linux)
set -euo pipefail

echo "Preview script started"

if command -v pnpm >/dev/null 2>&1; then
  pnpm install
else
  npm install
fi

npx prisma generate

if command -v pnpm >/dev/null 2>&1; then
  pnpm run dev
else
  npm run dev
fi
