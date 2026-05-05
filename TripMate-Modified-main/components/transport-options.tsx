"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Clock, IndianRupee, TrendingUp, Info } from "lucide-react"
import { 
  getRecommendedTransport, 
  getTransportModeName, 
  formatFare,
  getSurgeBadge,
  type TransportRoute,
  type TransportFare 
} from "@/lib/transport-service"

interface TransportOptionsProps {
  from: string
  to: string
  distance: number
  time?: string
  onSelect?: (option: TransportFare) => void
}

export function TransportOptions({ from, to, distance, time, onSelect }: TransportOptionsProps) {
  const route = getRecommendedTransport(from, to, distance, time)
  const [selectedMode, setSelectedMode] = useState<string | null>(null)

  const handleSelect = (option: TransportFare) => {
    setSelectedMode(option.mode)
    onSelect?.(option)
  }

  const getAvailabilityColor = (availability: 'high' | 'medium' | 'low') => {
    switch (availability) {
      case 'high': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-red-600 bg-red-50'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Car className="h-5 w-5" />
          Transport Options
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {from} → {to} ({distance} km)
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {route.options.map((option, index) => {
          const surgeBadge = getSurgeBadge(option.mode, time)
          const isSelected = selectedMode === option.mode
          const isCheapest = index === 0

          return (
            <div
              key={option.mode}
              className={`p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                isSelected ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => handleSelect(option)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{getTransportModeName(option.mode)}</h4>
                    {isCheapest && (
                      <Badge variant="default" className="text-xs">
                        Cheapest
                      </Badge>
                    )}
                    {surgeBadge && (
                      <Badge variant="destructive" className="text-xs gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {surgeBadge}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">
                    {option.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {option.estimatedTime}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getAvailabilityColor(option.availability)}`}
                    >
                      {option.availability.charAt(0).toUpperCase() + option.availability.slice(1)} Availability
                    </Badge>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-bold text-primary">
                    <IndianRupee className="h-4 w-4" />
                    {option.estimatedFare.toLocaleString('en-IN')}
                  </div>
                  {option.perKmRate > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ₹{option.perKmRate}/km
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
          <div className="flex gap-2">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 dark:text-blue-100">
              <p className="font-medium mb-1">Real-time Pricing</p>
              <p>
                Fares include surge pricing based on current demand, time of day, and special events. 
                Prices may vary by ±20% based on actual conditions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
