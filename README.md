# Travel App - Next.js Application

A comprehensive travel planning application with AI-powered itineraries, interactive maps, and real-time features.

## Features

- 🌍 Explore destinations across India
- 🤖 AI-powered itinerary generation
- 🗺️ Interactive maps with Google Maps integration
- 🌤️ Live weather information
- 🏨 Hotel and restaurant recommendations
- 🚗 Transport booking integration
- 👥 Travel matchmaker feature
- ⭐ Favorites and user profiles
- 🎨 Dark/Light mode

## Deploy to Netlify

### Prerequisites

1. A GitHub account
2. A Netlify account (sign up at https://netlify.com)
3. A PostgreSQL database (recommended: Supabase, PlanetScale, or Neon)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Add the remote and push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Netlify

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18

### Step 3: Set Environment Variables

In Netlify dashboard, go to **Site settings** → **Environment variables** and add:

```
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_API_URL=https://your-site.netlify.app
```

### Step 4: Install Netlify Plugin

The `netlify.toml` file already includes the Next.js plugin configuration. Netlify will automatically install it during deployment.

### Step 5: Run Database Migrations

After deployment, you need to run Prisma migrations. You can do this by:

1. Installing Netlify CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. Link your site: `netlify link`
4. Run migration: `netlify env:import .env.local` (if you have local env file)
5. Then manually run migrations through your database provider's interface or use a migration script

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

See `.env.example` for all required environment variables.

## Tech Stack

- **Framework**: Next.js 16
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **AI**: Google Gemini & Groq AI
- **Maps**: Google Maps API
- **UI**: Radix UI + Tailwind CSS
- **Weather**: OpenWeather API

## Project Structure

```
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utility functions and services
├── prisma/          # Database schema
├── public/          # Static assets
└── styles/          # Global styles
```

## Support

For issues or questions, please open an issue in the GitHub repository.
