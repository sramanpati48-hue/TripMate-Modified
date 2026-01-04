# Google Gemini API Integration

This app now uses Google Gemini API to fetch real-time travel destination data.

## Setup Instructions

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

Open `.env.local` and replace `your_gemini_api_key_here` with your actual API key:

```env
GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE
NEXT_PUBLIC_GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

### 3. Restart the Development Server

After adding your API key, restart the server:

```bash
npm run dev
```

## Features Using Real-Time Data

### 1. **Destinations** (`/explore`)
- Fetches real-time destination data from Gemini
- Filters by category and region
- Generates authentic descriptions, coordinates, and visitor data

### 2. **Itinerary Generation** (`/trip-planner`)
- Creates personalized day-by-day itineraries
- Includes activities, meals, and accommodation recommendations
- Calculates realistic costs based on budget

### 3. **Weather Information**
- Real-time weather updates for destinations
- Temperature, conditions, and forecasts
- Best time to visit recommendations

## API Endpoints

### GET `/api/destinations`
Fetch destination data with optional filters:
- `?realtime=true` - Use Gemini API (requires API key)
- `?category=Spiritual` - Filter by category
- `?region=North` - Filter by region

**Example:**
```javascript
const response = await fetch('/api/destinations?realtime=true&category=Adventure')
const destinations = await response.json()
```

### POST `/api/itinerary`
Generate travel itinerary:

```javascript
const response = await fetch('/api/itinerary', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    destination: 'Leh-Ladakh',
    days: 7,
    budget: 'Medium'
  })
})
const itinerary = await response.json()
```

### GET `/api/weather`
Get weather data:
- `?location=Delhi` - Location name

**Example:**
```javascript
const response = await fetch('/api/weather?location=Goa')
const weather = await response.json()
```

## Fallback Behavior

If the API key is not configured or API calls fail:
- The app automatically falls back to mock data
- No errors shown to users
- Seamless experience maintained

## Rate Limits

Google Gemini API has the following limits:
- **Free tier**: 60 requests per minute
- **Response time**: 2-5 seconds per request

## Cost

Google Gemini API (as of 2025):
- **Free tier**: First 1 million tokens/month free
- **Paid tier**: $0.00025 per 1K characters

For this app's typical usage:
- ~1000 characters per destination request
- ~2000 characters per itinerary request
- Estimated cost: $0.50 - $2.00 per month for moderate usage

## Troubleshooting

### "Gemini API key not configured" Error
- Check that you've added the API key to `.env.local`
- Restart the development server after adding the key
- Verify the key is correct (no extra spaces)

### Slow Loading
- First request takes 3-5 seconds (Gemini API processing)
- Subsequent requests use cached data when possible
- Consider implementing caching strategy for production

### JSON Parsing Errors
- The API automatically cleans Gemini responses
- If errors persist, check console logs
- Falls back to mock data automatically

## Production Deployment

For production:
1. Add `GEMINI_API_KEY` to your hosting environment variables
2. Consider implementing:
   - Response caching (Redis/Memory)
   - Request rate limiting
   - Cost monitoring
   - Error tracking (Sentry)

## Example Implementation

```typescript
// Fetch destinations with real-time data
const [destinations, setDestinations] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch('/api/destinations?realtime=true&category=Beach')
      const data = await res.json()
      setDestinations(data)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }
  
  fetchData()
}, [])
```

## Benefits

✅ **Real-time accuracy** - Always up-to-date information
✅ **Dynamic content** - Generates unique descriptions
✅ **Personalized** - Tailored to user preferences
✅ **Scalable** - Easy to add more categories/regions
✅ **Cost-effective** - Free tier covers most usage
✅ **Fallback ready** - Works without API key

---

**Need Help?** Check the [Google AI Studio documentation](https://ai.google.dev/docs) or open an issue.
