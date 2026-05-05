# Complete API Integration Guide

## 📋 APIs to Integrate for Full Real-Time Experience

### 1. ✅ Google Gemini API (Already Done!)
- **Status**: ✅ Integrated
- **Purpose**: Dynamic content generation, itineraries, descriptions
- **Cost**: FREE (1M tokens/month)

---

## 2. 🌤️ OpenWeatherMap API (Real Weather)

### Setup Steps:

**Step 1: Get API Key**
1. Go to https://openweathermap.org/api
2. Click "Sign Up" (free account)
3. Verify email
4. Go to "API Keys" tab
5. Copy your API key

**Step 2: Add to .env.local**
```env
OPENWEATHER_API_KEY=your_key_here
```

**Step 3: Install Package**
```bash
npm install axios
```

**Step 4: Create Weather Service**

Create file: `lib/weather-service.ts`
```typescript
import axios from 'axios'

export async function getRealWeather(city: string, state: string) {
  const API_KEY = process.env.OPENWEATHER_API_KEY
  
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},IN&appid=${API_KEY}&units=metric`
    )
    
    return {
      temperature: Math.round(response.data.main.temp),
      condition: response.data.weather[0].main,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    }
  } catch (error) {
    console.error('Weather fetch error:', error)
    return null
  }
}

export async function get5DayForecast(city: string, state: string) {
  const API_KEY = process.env.OPENWEATHER_API_KEY
  
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},${state},IN&appid=${API_KEY}&units=metric`
    )
    
    return response.data.list.slice(0, 5).map((item: any) => ({
      date: new Date(item.dt * 1000),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      description: item.weather[0].description
    }))
  } catch (error) {
    console.error('Forecast fetch error:', error)
    return null
  }
}
```

**Step 5: Create API Route**

Create file: `app/api/live-weather/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getRealWeather } from '@/lib/weather-service'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get('city')
  const state = searchParams.get('state')
  
  if (!city || !state) {
    return NextResponse.json({ error: 'City and state required' }, { status: 400 })
  }
  
  const weather = await getRealWeather(city, state)
  
  if (!weather) {
    return NextResponse.json({ error: 'Weather not found' }, { status: 404 })
  }
  
  return NextResponse.json(weather)
}
```

**Step 6: Use in Components**
```typescript
// In your component
const [weather, setWeather] = useState(null)

useEffect(() => {
  fetch(`/api/live-weather?city=Mumbai&state=Maharashtra`)
    .then(res => res.json())
    .then(data => setWeather(data))
}, [])
```

**Pricing**: FREE up to 1,000 calls/day

---

## 3. 📸 Unsplash API (Real Destination Photos)

### Setup Steps:

**Step 1: Get API Key**
1. Go to https://unsplash.com/developers
2. Click "Register as a developer"
3. Create new application
4. Copy "Access Key"

**Step 2: Add to .env.local**
```env
UNSPLASH_ACCESS_KEY=your_key_here
```

**Step 3: Install Package**
```bash
npm install unsplash-js
```

**Step 4: Create Image Service**

Create file: `lib/image-service.ts`
```typescript
import { createApi } from 'unsplash-js'

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || ''
})

export async function getDestinationImages(query: string, count: number = 3) {
  try {
    const result = await unsplash.search.getPhotos({
      query: `${query} India travel destination`,
      page: 1,
      perPage: count,
      orientation: 'landscape'
    })
    
    if (result.type === 'success') {
      return result.response.results.map(photo => ({
        id: photo.id,
        url: photo.urls.regular,
        thumbnail: photo.urls.small,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        downloadUrl: photo.links.download_location
      }))
    }
    
    return []
  } catch (error) {
    console.error('Image fetch error:', error)
    return []
  }
}
```

**Step 5: Create API Route**

Create file: `app/api/destination-images/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getDestinationImages } from '@/lib/image-service'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  const count = parseInt(searchParams.get('count') || '3')
  
  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 })
  }
  
  const images = await getDestinationImages(query, count)
  return NextResponse.json(images)
}
```

**Step 6: Use in Components**
```typescript
const [images, setImages] = useState([])

useEffect(() => {
  fetch(`/api/destination-images?query=Taj%20Mahal&count=3`)
    .then(res => res.json())
    .then(data => setImages(data))
}, [])
```

**Pricing**: FREE - 50 requests/hour (demo apps)

---

## 4. 🏨 Google Places API (Hotels, Restaurants, Reviews)

### Setup Steps:

**Step 1: Get API Key**
1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable "Places API"
4. Create credentials (API Key)
5. Restrict API key to Places API only

**Step 2: Add to .env.local**
```env
GOOGLE_PLACES_API_KEY=your_key_here
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_key_here
```

**Step 3: Install Package**
```bash
npm install @googlemaps/google-maps-services-js
```

**Step 4: Create Places Service**

Create file: `lib/places-service.ts`
```typescript
import { Client } from '@googlemaps/google-maps-services-js'

const client = new Client({})

export async function getNearbyHotels(lat: number, lng: number, radius: number = 5000) {
  try {
    const response = await client.placesNearby({
      params: {
        location: { lat, lng },
        radius,
        type: 'lodging',
        key: process.env.GOOGLE_PLACES_API_KEY || ''
      }
    })
    
    return response.data.results.map(place => ({
      name: place.name,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      address: place.vicinity,
      priceLevel: place.price_level,
      photo: place.photos?.[0]?.photo_reference,
      placeId: place.place_id
    }))
  } catch (error) {
    console.error('Places fetch error:', error)
    return []
  }
}

export async function getPlaceDetails(placeId: string) {
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: ['name', 'rating', 'formatted_phone_number', 'opening_hours', 'website', 'reviews'],
        key: process.env.GOOGLE_PLACES_API_KEY || ''
      }
    })
    
    return response.data.result
  } catch (error) {
    console.error('Place details error:', error)
    return null
  }
}
```

**Step 5: Create API Route**

Create file: `app/api/nearby-hotels/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getNearbyHotels } from '@/lib/places-service'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')
  
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Coordinates required' }, { status: 400 })
  }
  
  const hotels = await getNearbyHotels(lat, lng)
  return NextResponse.json(hotels)
}
```

**Pricing**: 
- FREE: $200 credit/month (includes ~40,000 requests)
- Pay-as-you-go: $0.017 per request after free tier

---

## 📦 Quick Install All Packages

```bash
npm install axios unsplash-js @googlemaps/google-maps-services-js
```

---

## 🎯 Integration Priority

**Recommended Order:**

1. ✅ **Gemini API** - Already done!
2. 🌤️ **OpenWeatherMap** - Easy, free, instant value
3. 📸 **Unsplash** - Easy, free, great visuals
4. 🏨 **Google Places** - More complex, has costs

---

## 🔐 Security Tips

1. **Never commit .env.local** to Git (already in .gitignore)
2. **Restrict API keys** in provider dashboards
3. **Add rate limiting** to your API routes
4. **Use environment variables** only
5. **Implement caching** to reduce API calls

---

## 💰 Cost Summary

| API | Free Tier | Cost After |
|-----|-----------|------------|
| Gemini | 1M tokens/month | $0.00025/1K chars |
| OpenWeatherMap | 1K calls/day | $0.0012/call |
| Unsplash | 50 calls/hour | Free for non-commercial |
| Google Places | $200/month credit | $0.017/request |

**Estimated Monthly Cost for Moderate Usage**: $5-20

---

## 🚀 After Integration

Your app will have:
- ✅ Real-time destination generation
- ✅ Live weather forecasts
- ✅ Authentic destination photos
- ✅ Real hotel/restaurant data
- ✅ Live reviews and ratings
- ✅ Dynamic pricing information
- ✅ Current availability status

---

## 📝 Next Steps

1. **Get API keys** from each provider (15 mins)
2. **Add to .env.local** (2 mins)
3. **Install packages** (1 min)
4. **Copy code files** (10 mins)
5. **Test endpoints** (5 mins)
6. **Integrate into UI** (30 mins)

**Total Setup Time**: ~1 hour for all integrations!

---

Need help with any specific integration? Just ask!
