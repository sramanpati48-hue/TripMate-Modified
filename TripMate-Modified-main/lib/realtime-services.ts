// Real-time data services for the Smart Travel Companion app
// Simulates real-time APIs and data streams

import type { Place } from './mock-data'

// ==================== WEATHER SERVICE ====================
export interface LiveWeather {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  feelsLike: number
  uvIndex: number
  visibility: number
  pressure: number
  sunrise: string
  sunset: string
  icon: string
  forecast: WeatherForecast[]
  lastUpdated: Date
}

export interface WeatherForecast {
  day: string
  date: string
  high: number
  low: number
  condition: string
  icon: string
  rainChance: number
}

// Simulate real-time weather API call
export async function fetchLiveWeather(lat: number, lng: number, locationName: string): Promise<LiveWeather> {
  // Validate inputs
  if (!locationName || typeof locationName !== 'string') {
    locationName = 'Unknown' // Fallback location
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const now = new Date()
  const hour = now.getHours()
  const month = now.getMonth() + 1
  
  // Generate realistic weather based on location and season
  const baseTemp = getBaseTemperature(locationName, month)
  const condition = getWeatherCondition(locationName, month, hour)
  
  return {
    temperature: Math.round(baseTemp + (Math.random() - 0.5) * 4),
    feelsLike: Math.round(baseTemp + (Math.random() - 0.5) * 6),
    condition,
    humidity: Math.round(40 + Math.random() * 40),
    windSpeed: Math.round(5 + Math.random() * 15),
    uvIndex: hour >= 10 && hour <= 16 ? Math.round(6 + Math.random() * 4) : Math.round(Math.random() * 3),
    visibility: Math.round(8 + Math.random() * 7),
    pressure: Math.round(1010 + Math.random() * 20),
    sunrise: getSunriseTime(lat),
    sunset: getSunsetTime(lat),
    icon: getWeatherIcon(condition),
    forecast: generateForecast(locationName, month),
    lastUpdated: now
  }
}

function getBaseTemperature(location: string, month: number): number {
  // Validate inputs
  if (!location || typeof location !== 'string') {
    return 25 // Default temperature
  }

  const locationTemps: Record<string, number[]> = {
    'Agra': [15, 18, 24, 32, 38, 40, 35, 32, 32, 28, 22, 16],
    'Jaipur': [16, 19, 25, 33, 38, 39, 34, 31, 32, 29, 23, 17],
    'Goa': [26, 27, 28, 30, 31, 29, 27, 27, 27, 28, 28, 27],
    'Varanasi': [15, 18, 25, 33, 38, 36, 32, 31, 31, 28, 22, 16],
    'Manali': [2, 5, 10, 16, 20, 23, 21, 20, 18, 13, 7, 3],
    'Kerala': [27, 28, 29, 30, 30, 28, 27, 27, 27, 27, 27, 27],
    'Leh': [-8, -5, 0, 5, 10, 15, 18, 17, 12, 5, -2, -7],
    'Rishikesh': [12, 15, 20, 26, 31, 33, 30, 29, 28, 24, 18, 13]
  }
  
  const normalizedLocation = location.toLowerCase()
  
  for (const key in locationTemps) {
    if (normalizedLocation.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedLocation)) {
      return locationTemps[key][month - 1]
    }
  }
  
  return 25 // Default
}

function getWeatherCondition(location: string, month: number, hour: number): string {
  // Validate location input
  if (!location || typeof location !== 'string') {
    return 'Clear' // Default condition
  }

  const normalizedLocation = location.toLowerCase()
  
  // Monsoon season (June-September)
  if (month >= 6 && month <= 9 && !normalizedLocation.includes('leh')) {
    if (Math.random() > 0.6) return 'Rainy'
    if (Math.random() > 0.7) return 'Cloudy'
  }
  
  // Winter (December-February)
  if (month === 12 || month <= 2) {
    if (normalizedLocation.includes('manali') || normalizedLocation.includes('leh')) {
      return Math.random() > 0.5 ? 'Snowy' : 'Cloudy'
    }
  }
  
  // Time-based conditions
  if (hour >= 6 && hour <= 18) {
    const conditions = ['Sunny', 'Partly Cloudy', 'Clear']
    return conditions[Math.floor(Math.random() * conditions.length)]
  }
  
  return 'Clear'
}

function getWeatherIcon(condition: string): string {
  const icons: Record<string, string> = {
    'Sunny': '☀️',
    'Partly Cloudy': '⛅',
    'Cloudy': '☁️',
    'Rainy': '🌧️',
    'Snowy': '❄️',
    'Clear': '🌙',
    'Stormy': '⛈️'
  }
  return icons[condition] || '☀️'
}

function getSunriseTime(lat: number): string {
  const baseTime = lat > 25 ? 6.5 : 6.0
  const hour = Math.floor(baseTime)
  const minute = Math.round((baseTime - hour) * 60)
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

function getSunsetTime(lat: number): string {
  const baseTime = lat > 25 ? 17.5 : 18.0
  const hour = Math.floor(baseTime)
  const minute = Math.round((baseTime - hour) * 60)
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

function generateForecast(location: string, month: number): WeatherForecast[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const now = new Date()
  const forecast: WeatherForecast[] = []
  
  for (let i = 1; i <= 5; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() + i)
    const baseTemp = getBaseTemperature(location, month)
    
    forecast.push({
      day: days[date.getDay()],
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      high: Math.round(baseTemp + Math.random() * 5),
      low: Math.round(baseTemp - 5 - Math.random() * 5),
      condition: getWeatherCondition(location, month, 12),
      icon: getWeatherIcon(getWeatherCondition(location, month, 12)),
      rainChance: month >= 6 && month <= 9 ? Math.round(40 + Math.random() * 40) : Math.round(Math.random() * 30)
    })
  }
  
  return forecast
}

// ==================== VISITOR ANALYTICS SERVICE ====================
export interface LiveVisitorData {
  currentVisitors: number
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Very High'
  trend: 'increasing' | 'stable' | 'decreasing'
  peakHours: string[]
  waitTime: number // minutes
  availabilityPercent: number
  lastUpdated: Date
}

export function getLiveVisitorData(placeId: string, monthlyVisitors: number): LiveVisitorData {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()
  const month = now.getMonth() + 1
  
  // Calculate base visitors per hour
  const dailyVisitors = monthlyVisitors / 30
  const hourlyBase = dailyVisitors / 12 // Assume 12 active hours
  
  // Apply multipliers
  let multiplier = 1.0
  
  // Peak hours (10 AM - 4 PM)
  if (hour >= 10 && hour <= 16) multiplier *= 1.8
  else if (hour >= 8 && hour < 10) multiplier *= 1.3
  else if (hour > 16 && hour <= 18) multiplier *= 1.2
  else multiplier *= 0.3
  
  // Weekend boost
  if (day === 0 || day === 6) multiplier *= 1.5
  
  // Season boost (Winter is peak for most Indian destinations)
  if (month === 12 || month <= 2 || month === 10 || month === 11) {
    multiplier *= 1.4
  } else if (month >= 6 && month <= 9) { // Monsoon
    multiplier *= 0.6
  }
  
  const currentVisitors = Math.round(hourlyBase * multiplier)
  const capacity = Math.round(hourlyBase * 2.5)
  const occupancy = (currentVisitors / capacity) * 100
  
  let crowdLevel: 'Low' | 'Moderate' | 'High' | 'Very High' = 'Low'
  if (occupancy > 80) crowdLevel = 'Very High'
  else if (occupancy > 60) crowdLevel = 'High'
  else if (occupancy > 35) crowdLevel = 'Moderate'
  
  const trend = hour < 12 ? 'increasing' : hour > 17 ? 'decreasing' : 'stable'
  
  return {
    currentVisitors,
    crowdLevel,
    trend,
    peakHours: ['10:00 AM - 12:00 PM', '2:00 PM - 4:00 PM'],
    waitTime: crowdLevel === 'Very High' ? Math.round(30 + Math.random() * 30) : 
              crowdLevel === 'High' ? Math.round(15 + Math.random() * 15) :
              crowdLevel === 'Moderate' ? Math.round(5 + Math.random() * 10) : 0,
    availabilityPercent: Math.round(100 - occupancy),
    lastUpdated: now
  }
}

// ==================== TRENDING DESTINATIONS SERVICE ====================
export interface TrendingDestination {
  placeId: string
  name: string
  trendScore: number
  searchIncrease: number
  bookings24h: number
  socialMentions: number
}

export function getTrendingDestinations(places: Place[]): TrendingDestination[] {
  const now = new Date()
  const hour = now.getHours()
  
  return places.map(place => {
    // Generate realistic trending scores
    const baseScore = place.rating * 20
    const seasonBoost = place.bestSeason.includes(getCurrentSeason()) ? 30 : 0
    const randomFactor = Math.random() * 20
    const timeBoost = hour >= 9 && hour <= 18 ? 10 : 0
    
    return {
      placeId: place.id,
      name: place.name,
      trendScore: Math.round(baseScore + seasonBoost + randomFactor + timeBoost),
      searchIncrease: Math.round(10 + Math.random() * 40),
      bookings24h: Math.round(50 + Math.random() * 200),
      socialMentions: Math.round(100 + Math.random() * 900)
    }
  }).sort((a, b) => b.trendScore - a.trendScore)
}

function getCurrentSeason() {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'Summer'
  if (month >= 6 && month <= 9) return 'Monsoon'
  if (month >= 10 && month <= 11) return 'Autumn'
  if (month === 12 || month <= 2) return 'Winter'
  return 'Spring'
}

// ==================== LIVE NOTIFICATIONS SERVICE ====================
export interface LiveNotification {
  id: string
  type: 'price_drop' | 'weather_alert' | 'crowd_update' | 'booking_alert' | 'trend'
  title: string
  message: string
  severity: 'info' | 'warning' | 'success' | 'error'
  timestamp: Date
  placeId?: string
  actionLabel?: string
}

export async function* generateLiveNotifications(places: Place[]): AsyncGenerator<LiveNotification> {
  const notificationTypes = [
    {
      type: 'price_drop' as const,
      severity: 'success' as const,
      generate: (place: Place) => ({
        title: '💰 Price Drop Alert',
        message: `${place.name} packages dropped by 20%! Limited time offer.`,
        actionLabel: 'View Deals'
      })
    },
    {
      type: 'weather_alert' as const,
      severity: 'warning' as const,
      generate: (place: Place) => ({
        title: '⛈️ Weather Update',
        message: `Perfect weather for ${place.name}! Clear skies expected.`,
        actionLabel: 'Check Weather'
      })
    },
    {
      type: 'crowd_update' as const,
      severity: 'info' as const,
      generate: (place: Place) => ({
        title: '👥 Crowd Alert',
        message: `${place.name} has low crowd levels right now. Great time to visit!`,
        actionLabel: 'Plan Visit'
      })
    },
    {
      type: 'trend' as const,
      severity: 'info' as const,
      generate: (place: Place) => ({
        title: '🔥 Trending Now',
        message: `${place.name} is trending! ${Math.round(Math.random() * 500)}+ people are viewing this.`,
        actionLabel: 'Explore'
      })
    }
  ]
  
  let id = 1
  while (true) {
    const place = places[Math.floor(Math.random() * places.length)]
    const notifType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
    const generated = notifType.generate(place)
    
    yield {
      id: `notif-${id++}`,
      type: notifType.type,
      severity: notifType.severity,
      title: generated.title,
      message: generated.message,
      timestamp: new Date(),
      placeId: place.id,
      actionLabel: generated.actionLabel
    }
    
    // Simulate real-time delay
    await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 10000))
  }
}

// ==================== LIVE SEARCH SUGGESTIONS ====================
export interface SearchSuggestion {
  query: string
  type: 'destination' | 'activity' | 'trending'
  count: number
  trending: boolean
}

export function getLiveSearchSuggestions(query: string, places: Place[]): SearchSuggestion[] {
  if (!query || query.length < 2) {
    return getTrendingSearches(places)
  }
  
  const suggestions: SearchSuggestion[] = []
  const lowerQuery = query.toLowerCase()
  
  // Match destinations
  places.forEach(place => {
    if (place.name.toLowerCase().includes(lowerQuery) ||
        place.location.toLowerCase().includes(lowerQuery) ||
        place.state.toLowerCase().includes(lowerQuery)) {
      suggestions.push({
        query: place.name,
        type: 'destination',
        count: Math.round(1000 + Math.random() * 9000),
        trending: Math.random() > 0.7
      })
    }
  })
  
  // Match activities
  const activities = ['beach', 'temple', 'fort', 'mountain', 'trek', 'yoga', 'safari', 'cruise']
  activities.forEach(activity => {
    if (activity.includes(lowerQuery)) {
      suggestions.push({
        query: activity,
        type: 'activity',
        count: Math.round(500 + Math.random() * 4500),
        trending: Math.random() > 0.8
      })
    }
  })
  
  return suggestions.slice(0, 6)
}

function getTrendingSearches(places: Place[]): SearchSuggestion[] {
  const trending = getTrendingDestinations(places).slice(0, 5)
  
  return trending.map(t => ({
    query: t.name,
    type: 'trending' as const,
    count: t.searchIncrease,
    trending: true
  }))
}

// ==================== LIVE TRAVEL BUDDY STATUS ====================
export interface TravelBuddyStatus {
  buddyId: string
  online: boolean
  lastActive: string
  currentActivity: string
  availableForChat: boolean
}

export function getLiveBuddyStatus(buddyId: string): TravelBuddyStatus {
  const now = new Date()
  const hour = now.getHours()
  
  // Simulate online status based on time
  const online = hour >= 8 && hour <= 23 && Math.random() > 0.3
  
  const activities = [
    'Planning trip to Goa',
    'Viewing Taj Mahal details',
    'Comparing hotel prices',
    'Reading reviews',
    'Browsing activities',
    'Chatting with travelers'
  ]
  
  return {
    buddyId,
    online,
    lastActive: online ? 'now' : `${Math.floor(Math.random() * 60)} min ago`,
    currentActivity: online ? activities[Math.floor(Math.random() * activities.length)] : '',
    availableForChat: online && Math.random() > 0.5
  }
}

// ==================== REAL-TIME DATA POLLING ====================
export function startRealtimePolling(
  callback: () => void,
  intervalMs: number = 30000
): () => void {
  const interval = setInterval(callback, intervalMs)
  return () => clearInterval(interval)
}
