# Installation Script for Backend Dependencies
# Run this script to install all required packages

Write-Host "Installing backend dependencies..." -ForegroundColor Green

# Install Prisma and database packages
npm install prisma @prisma/client

# Install authentication packages
npm install bcryptjs jose

# Install TypeScript types
npm install -D @types/bcryptjs

Write-Host ""
Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy .env.example to .env.local and update the values"
Write-Host "2. Run: npx prisma generate"
Write-Host "3. Run: npx prisma db push"
Write-Host "4. Test the API endpoints"
Write-Host ""
Write-Host "For detailed instructions, see BACKEND-SETUP.md" -ForegroundColor Yellow
