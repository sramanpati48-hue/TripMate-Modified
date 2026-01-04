"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, IndianRupee, Calendar, Activity } from "lucide-react"
import type { TripActivity } from "./trip-day-card"

interface TripSummaryProps {
  days: Array<{
    day: number
    date: string
    activities: TripActivity[]
  }>
}

export function TripSummary({ days }: TripSummaryProps) {
  // Calculate totals
  const totalActivities = days.reduce((sum, day) => sum + day.activities.length, 0)
  const totalTransportCost = days.reduce((sum, day) => {
    return sum + day.activities.reduce((daySum, activity) => {
      return daySum + (activity.transportFare || 0)
    }, 0)
  }, 0)

  const totalActivityCost = days.reduce((sum, day) => {
    return sum + day.activities.filter(a => a.category !== 'Transport').length * 500 // Rough estimate
  }, 0)

  const transportCount = days.reduce((sum, day) => {
    return sum + day.activities.filter(a => a.transportMode).length
  }, 0)

  // Get most used transport mode
  const transportModes: Record<string, number> = {}
  days.forEach(day => {
    day.activities.forEach(activity => {
      if (activity.transportMode) {
        transportModes[activity.transportMode] = (transportModes[activity.transportMode] || 0) + 1
      }
    })
  })

  const mostUsedTransport = Object.entries(transportModes).sort((a, b) => b[1] - a[1])[0]?.[0]

  if (totalActivities === 0) {
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Trip Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Total Days
            </p>
            <p className="text-2xl font-bold">{days.length}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Activity className="h-3.5 w-3.5" />
              Activities
            </p>
            <p className="text-2xl font-bold">{totalActivities}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Car className="h-3.5 w-3.5" />
              Transport Rides
            </p>
            <p className="text-2xl font-bold">{transportCount}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <IndianRupee className="h-3.5 w-3.5" />
              Transport Cost
            </p>
            <p className="text-2xl font-bold text-primary">
              ₹{totalTransportCost.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {mostUsedTransport && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Most Used Transport:</span>
              <Badge variant="secondary" className="gap-1">
                <Car className="h-3 w-3" />
                {mostUsedTransport.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Badge>
            </div>
          </div>
        )}

        <div className="mt-3 p-3 bg-background/50 rounded-md">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> Transport fares include real-time surge pricing based on time of day, 
            day of week, and holidays. Book in advance during peak hours to save up to 40%.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
