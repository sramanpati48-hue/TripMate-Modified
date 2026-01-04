"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer, Eye, Gauge, RefreshCw } from "lucide-react"
import { fetchLiveWeather, type LiveWeather, startRealtimePolling } from "@/lib/realtime-services"
import { Button } from "@/components/ui/button"

interface WeatherWidgetProps {
  locationName: string
  lat: number
  lng: number
  compact?: boolean
}

const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase()
  if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return Sun
  if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) return CloudRain
  if (lowerCondition.includes('snow')) return CloudSnow
  return Cloud
}

export function WeatherWidget({ locationName, lat, lng, compact = false }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<LiveWeather | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const loadWeather = async () => {
    // Validate inputs before fetching
    if (!locationName || typeof lat !== 'number' || typeof lng !== 'number') {
      console.error('Invalid weather widget props:', { locationName, lat, lng })
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const data = await fetchLiveWeather(lat, lng, locationName)
      setWeather(data)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to fetch weather:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeather()
    
    // Auto-refresh every 10 minutes
    const cleanup = startRealtimePolling(loadWeather, 600000)
    return cleanup
  }, [locationName, lat, lng])

  if (loading || !weather) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const WeatherIcon = getWeatherIcon(weather.condition)
  const timeSinceUpdate = Math.floor((new Date().getTime() - lastRefresh.getTime()) / 60000)

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
        <div className="flex items-center gap-2">
          {weather.icon} <WeatherIcon className="h-6 w-6 text-accent" />
        </div>
        <div>
          <p className="text-xl font-bold">{weather.temperature}°C</p>
          <p className="text-xs text-muted-foreground">{weather.condition}</p>
        </div>
        <Badge variant="outline" className="text-xs">Live</Badge>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>Live Weather</span>
            <Badge variant="secondary" className="text-xs animate-pulse">
              ● Real-time
            </Badge>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={loadWeather}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{locationName}</p>
      </CardHeader>
      <CardContent>
        {/* Current Weather */}
        <div className="flex items-center gap-4 mb-6">
          <div className="text-5xl">{weather.icon}</div>
          <div>
            <p className="text-5xl font-bold">{weather.temperature}°C</p>
            <p className="text-muted-foreground">{weather.condition}</p>
            <p className="text-sm text-muted-foreground">Feels like {weather.feelsLike}°C</p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-semibold">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
            <Wind className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Wind Speed</p>
              <p className="font-semibold">{weather.windSpeed} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
            <Eye className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="font-semibold">{weather.visibility} km</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
            <Gauge className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pressure</p>
              <p className="font-semibold">{weather.pressure} mb</p>
            </div>
          </div>
        </div>

        {/* Sun Times */}
        <div className="flex items-center justify-between mb-6 p-3 bg-secondary/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Sunrise</p>
              <p className="font-semibold">{weather.sunrise}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Sunset</p>
              <p className="font-semibold">{weather.sunset}</p>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div>
          <h4 className="text-sm font-semibold mb-3">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-2">
            {weather.forecast.map((day, idx) => {
              const DayIcon = getWeatherIcon(day.condition)
              return (
                <div key={idx} className="flex flex-col items-center gap-1 p-2 bg-secondary/30 rounded-lg">
                  <p className="text-xs font-medium">{day.day}</p>
                  <p className="text-xs text-muted-foreground">{day.date}</p>
                  <div className="text-2xl my-1">{day.icon}</div>
                  <p className="text-sm font-semibold">{day.high}°</p>
                  <p className="text-xs text-muted-foreground">{day.low}°</p>
                  <p className="text-xs text-blue-500">{day.rainChance}%</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Updated {timeSinceUpdate === 0 ? 'just now' : `${timeSinceUpdate} min ago`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
