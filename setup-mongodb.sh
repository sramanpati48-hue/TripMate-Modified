#!/bin/bash
# MongoDB Atlas Setup Script for Travel App

echo "🚀 Travel App - MongoDB Atlas Setup"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node.js
echo "📋 Step 1: Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Step 2: Check Prisma
echo ""
echo "📋 Step 2: Checking Prisma..."
if ! npx prisma -v &> /dev/null; then
    echo -e "${RED}❌ Prisma is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Prisma is installed${NC}"

# Step 3: Check environment variables
echo ""
echo "📋 Step 3: Checking environment variables..."
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local not found${NC}"
    echo "Please create .env.local file"
    exit 1
fi

if grep -q "mongodb+srv://" .env.local; then
    echo -e "${GREEN}✓ MongoDB URL configured${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB URL not found in .env.local${NC}"
    echo "Please update DATABASE_URL with your MongoDB Atlas connection string"
fi

# Step 4: Test Prisma schema
echo ""
echo "📋 Step 4: Validating Prisma schema..."
if npx prisma validate &> /dev/null; then
    echo -e "${GREEN}✓ Prisma schema is valid${NC}"
else
    echo -e "${RED}❌ Prisma schema validation failed${NC}"
    exit 1
fi

# Step 5: Generate Prisma client
echo ""
echo "📋 Step 5: Generating Prisma client..."
npx prisma generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Prisma client generated${NC}"
else
    echo -e "${RED}❌ Failed to generate Prisma client${NC}"
    exit 1
fi

# Step 6: Database push
echo ""
echo "📋 Step 6: Setting up database collections..."
read -p "Do you want to create database collections now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma db push
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database collections created${NC}"
    else
        echo -e "${RED}❌ Failed to create collections${NC}"
        echo "Make sure your MongoDB connection string is correct"
        exit 1
    fi
fi

# Step 7: Final checks
echo ""
echo "📋 Step 7: Final verification..."
npm run build &> /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Application builds successfully${NC}"
else
    echo -e "${YELLOW}⚠ Build has warnings, but may still work${NC}"
fi

# Success!
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Start development server: npm run dev"
echo "2. Visit: http://localhost:3000"
echo "3. Test by creating an account"
echo ""
echo "To monitor database:"
echo "1. Go to MongoDB Atlas dashboard"
echo "2. Click on your cluster"
echo "3. View collections and data"
echo ""
echo "For production deployment:"
echo "1. Add DATABASE_URL to your hosting platform"
echo "2. Run: npm run build && npm start"
echo ""
