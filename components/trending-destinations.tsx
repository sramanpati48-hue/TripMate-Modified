"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Flame, Search, Calendar, Eye } from "lucide-react"
import { getTrendingDestinations, type TrendingDestination, startRealtimePolling } from "@/lib/realtime-services"
import { mockPlaces } from "@/lib/mock-data"

export function TrendingDestinationsWidget() {
  const [trending, setTrending] = useState<TrendingDestination[]>([])

  const updateTrending = () => {
    const data = getTrendingDestinations(mockPlaces)
    setTrending(data.slice(0, 5))
  }

  useEffect(() => {
    updateTrending()
    
    // Update every 5 minutes
    const cleanup = startRealtimePolling(updateTrending, 300000)
    return cleanup
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Trending Now
          </CardTitle>
          <Badge variant="secondary" className="text-xs animate-pulse">
            ● Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {trending.map((item, index) => {
          const place = mockPlaces.find(p => p.id === item.placeId)
          if (!place) return null

          return (
            <div
              key={item.placeId}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
            >
              {/* Rank Badge */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                ${index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-amber-700 text-white' :
                  'bg-secondary text-muted-foreground'}
              `}>
                {index + 1}
              </div>

              {/* Image */}
              <img
                src={place.image}
                alt={place.name}
                className="w-12 h-12 rounded-lg object-cover"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {place.name}
                </h4>
                <p className="text-xs text-muted-foreground">{place.location}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs">
                    <Search className="h-3 w-3 text-blue-500" />
                    <span className="text-green-600 font-medium">+{item.searchIncrease}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{item.bookings24h}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{item.socialMentions}</span>
                  </div>
                </div>
              </div>

              {/* Trending Score */}
              <div className="text-right">
                <div className="flex items-center gap-1 text-orange-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-bold">{item.trendScore}</span>
                </div>
                <Badge variant="outline" className="text-xs mt-1">
                  Hot 🔥
                </Badge>
              </div>
            </div>
          )
        })}

        {/* Last Updated */}
        <p className="text-xs text-muted-foreground text-center pt-3 border-t">
          Trending data updates every 5 minutes
        </p>
      </CardContent>
    </Card>
  )
}
