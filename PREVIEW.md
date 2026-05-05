Previewing the Travel App (local development)

Quick steps to preview locally on Windows (PowerShell):

1. Ensure `.env.local` exists (already created in repo).
2. Run the preview helper script (installs deps, generates Prisma client, starts dev server):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\preview-dev.ps1
```

Notes:
- The script prefers `pnpm` if available, otherwise falls back to `npm`.
- If you only want to install dependencies and not start the server, run `pnpm install` or `npm install` manually.
- Dev server runs at: http://localhost:3000

If you prefer WSL / Git Bash use:

```bash
# from repository root
# cp .env.example .env.local
# npm install || pnpm install
# npx prisma generate
# npm run dev || pnpm run dev
```
