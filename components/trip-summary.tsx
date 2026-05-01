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
    <Card className="border border-white/15 bg-white/5 text-slate-900 shadow-lg shadow-orange-100/10 backdrop-blur-md">
      <CardHeader className="border-b border-white/15 pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Activity className="h-5 w-5" />
          Trip Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <p className="flex items-center gap-1 text-sm text-slate-700">
              <Calendar className="h-3.5 w-3.5" />
              Total Days
            </p>
            <p className="text-2xl font-bold text-slate-950">{days.length}</p>
          </div>

          <div className="space-y-1">
            <p className="flex items-center gap-1 text-sm text-slate-700">
              <Activity className="h-3.5 w-3.5" />
              Activities
            </p>
            <p className="text-2xl font-bold text-slate-950">{totalActivities}</p>
          </div>

          <div className="space-y-1">
            <p className="flex items-center gap-1 text-sm text-slate-700">
              <Car className="h-3.5 w-3.5" />
              Transport Rides
            </p>
            <p className="text-2xl font-bold text-slate-950">{transportCount}</p>
          </div>

          <div className="space-y-1">
            <p className="flex items-center gap-1 text-sm text-slate-700">
              <IndianRupee className="h-3.5 w-3.5" />
              Transport Cost
            </p>
            <p className="text-2xl font-bold text-orange-700">
              ₹{totalTransportCost.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {mostUsedTransport && (
          <div className="mt-4 border-t border-white/20 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Most Used Transport:</span>
              <Badge variant="secondary" className="gap-1 border border-white/15 bg-white/35 text-slate-900 hover:bg-white/35">
                <Car className="h-3 w-3" />
                {mostUsedTransport.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Badge>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-4">
          <p className="text-xs text-slate-700">
            💡 <strong>Tip:</strong> Transport fares include real-time surge pricing based on time of day, 
            day of week, and holidays. Book in advance during peak hours to save up to 40%.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
