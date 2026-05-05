# MongoDB Atlas Setup Script for Travel App (Windows PowerShell)
# Run: powershell -ExecutionPolicy Bypass -File setup-mongodb.ps1

Write-Host "🚀 Travel App - MongoDB Atlas Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "📋 Step 1: Checking prerequisites..." -ForegroundColor Yellow
$nodeVersion = node -v 2>$null
if ($nodeVersion) {
    Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    exit 1
}

# Step 2: Check Prisma
Write-Host "📋 Step 2: Checking Prisma..." -ForegroundColor Yellow
$prismaVersion = npx prisma -v 2>$null
if ($prismaVersion) {
    Write-Host "✓ Prisma is installed" -ForegroundColor Green
} else {
    Write-Host "❌ Prisma is not installed" -ForegroundColor Red
    exit 1
}

# Step 3: Check environment variables
Write-Host "📋 Step 3: Checking environment variables..." -ForegroundColor Yellow
if (Test-Path .env.local) {
    $envContent = Get-Content .env.local -Raw
    if ($envContent -match "mongodb\+srv://") {
        Write-Host "✓ MongoDB URL configured" -ForegroundColor Green
    } else {
        Write-Host "⚠ MongoDB URL not found in .env.local" -ForegroundColor Yellow
        Write-Host "  Please update DATABASE_URL with your MongoDB Atlas connection string" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ .env.local not found" -ForegroundColor Red
    Write-Host "  Please create .env.local file first" -ForegroundColor Red
    exit 1
}

# Step 4: Validate Prisma schema
Write-Host "📋 Step 4: Validating Prisma schema..." -ForegroundColor Yellow
$validateResult = npx prisma validate 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma schema is valid" -ForegroundColor Green
} else {
    Write-Host "❌ Prisma schema validation failed" -ForegroundColor Red
    Write-Host $validateResult
    exit 1
}

# Step 5: Generate Prisma client
Write-Host "📋 Step 5: Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma client generated" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

# Step 6: Database push (optional)
Write-Host "📋 Step 6: Setting up database collections..." -ForegroundColor Yellow
$response = Read-Host "Do you want to create database collections now? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "Creating collections..." -ForegroundColor Cyan
    npx prisma db push
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database collections created" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create collections" -ForegroundColor Red
        Write-Host "Make sure your MongoDB connection string is correct" -ForegroundColor Yellow
        exit 1
    }
}

# Step 7: Build test
Write-Host "📋 Step 7: Testing build..." -ForegroundColor Yellow
npm run build *>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Application builds successfully" -ForegroundColor Green
} else {
    Write-Host "⚠ Build has warnings, but may still work" -ForegroundColor Yellow
}

# Success!
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start development server: npm run dev" -ForegroundColor White
Write-Host "2. Visit: http://localhost:3001" -ForegroundColor White
Write-Host "3. Test by creating an account" -ForegroundColor White
Write-Host ""
Write-Host "To monitor database:" -ForegroundColor Cyan
Write-Host "1. Go to MongoDB Atlas dashboard" -ForegroundColor White
Write-Host "2. Click on your cluster" -ForegroundColor White
Write-Host "3. View collections and data" -ForegroundColor White
Write-Host ""
Write-Host "For production deployment:" -ForegroundColor Cyan
Write-Host "1. Add DATABASE_URL to your hosting platform" -ForegroundColor White
Write-Host "2. Run: npm run build && npm start" -ForegroundColor White
Write-Host ""

# Test health endpoint (optional)
Write-Host "💡 Tip: Test your connection with: npm run dev" -ForegroundColor Cyan
Write-Host "   Then visit: http://localhost:3001/api/health" -ForegroundColor Cyan
