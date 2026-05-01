# 🚀 Quick Setup: Enable Claude Haiku 4.5

## ✅ What's Been Done

Claude Haiku 4.5 is now **ENABLED and set as the default AI model** for all clients!

## ⚡ 3-Minute Setup

### 1. Get Your API Key (2 minutes)

1. Visit: **https://console.anthropic.com/**
2. Click "Sign Up" (or "Log In")
3. Go to **API Keys** → **Create Key**
4. Copy your API key

### 2. Add to Environment (1 minute)

Create/update `.env.local` in your project root:

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

### 3. Restart Server

```bash
npm run dev
```

## 🎉 That's It!

Your app now uses Claude Haiku 4.5 by default for:
- ✅ Itinerary generation
- ✅ Travel planning
- ✅ All AI-powered features

## 🧪 Test It

1. Open your app: http://localhost:3000
2. Go to **Trip Planner** page
3. Generate an itinerary
4. Check console logs for: `🤖 Using Claude Haiku 4.5`

## 💰 Pricing

- **Cost**: ~$0.003 per itinerary (less than 1 cent!)
- **Free tier**: First $5 credit on new accounts
- **Estimate**: 1000+ itineraries for ~$3

## 🔄 Switch Back to Groq (Optional)

If you want to use Groq AI instead, modify your API call:

```javascript
body: JSON.stringify({
  destination: 'Goa',
  days: 5,
  budget: 'Medium',
  model: 'groq' // Add this line
})
```

## 📚 Full Documentation

See [CLAUDE-HAIKU-ENABLED.md](./CLAUDE-HAIKU-ENABLED.md) for complete details.

---

**Status**: ✅ Claude Haiku 4.5 enabled for all clients (default)
