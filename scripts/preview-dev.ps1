#!/usr/bin/env pwsh
# Preview helper for Windows PowerShell / PowerShell Core
# This script installs dependencies, generates the Prisma client,
# and starts the Next.js dev server. It prefers `pnpm` when available.

Set-StrictMode -Version Latest

Write-Host "Preview script started"

function Run-IfAvailable($cmd, $args) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        & $cmd @args
        return $true
    }
    return $false
}

# Install dependencies
if (-not (Run-IfAvailable "pnpm" @("install"))) {
    Write-Host "pnpm not found — falling back to npm install"
    npm install
}

# Generate Prisma client
npx prisma generate

# Start dev server
if (-not (Run-IfAvailable "pnpm" @("run","dev"))) {
    Write-Host "Starting dev server with npm"
    npm run dev
}
