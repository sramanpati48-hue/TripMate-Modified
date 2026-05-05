"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, TrendingDown, Minus, Clock, AlertCircle } from "lucide-react"
import { getLiveVisitorData, type LiveVisitorData, startRealtimePolling } from "@/lib/realtime-services"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatNumber } from "@/lib/utils"

interface LiveVisitorStatusProps {
  placeId: string
  placeName: string
  monthlyVisitors: number
  compact?: boolean
}

export function LiveVisitorStatus({ placeId, placeName, monthlyVisitors, compact = false }: LiveVisitorStatusProps) {
  const [visitorData, setVisitorData] = useState<LiveVisitorData | null>(null)

  const updateVisitorData = () => {
    const data = getLiveVisitorData(placeId, monthlyVisitors)
    setVisitorData(data)
  }

  useEffect(() => {
    updateVisitorData()
    
    // Update every 2 minutes for real-time data
    const cleanup = startRealtimePolling(updateVisitorData, 120000)
    return cleanup
  }, [placeId, monthlyVisitors])

  if (!visitorData) return null

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
      case 'Moderate': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
      case 'High': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20'
      case 'Very High': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
      default: return 'bg-secondary'
    }
  }

  const getTrendIcon = () => {
    switch (visitorData.trend) {
      case 'increasing': return <TrendingUp className="h-3 w-3" />
      case 'decreasing': return <TrendingDown className="h-3 w-3" />
      default: return <Minus className="h-3 w-3" />
    }
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${getCrowdColor(visitorData.crowdLevel)} animate-pulse`}>
                <Users className="h-3 w-3 mr-1" />
                {visitorData.crowdLevel}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <p className="font-semibold">{formatNumber(visitorData.currentVisitors)} visitors now</p>
              <p className="text-xs text-muted-foreground">
                {visitorData.waitTime > 0 ? `${visitorData.waitTime} min wait` : 'No wait time'}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Users className="h-4 w-4" />
          Live Visitor Status
        </h4>
        <Badge variant="secondary" className="text-xs animate-pulse">
          ● Live
        </Badge>
      </div>

      {/* Current Visitors */}
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{formatNumber(visitorData.currentVisitors)}</span>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          {getTrendIcon()}
          <span className="capitalize">{visitorData.trend}</span>
        </div>
      </div>

      {/* Crowd Level */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Crowd Level</span>
          <Badge className={getCrowdColor(visitorData.crowdLevel)}>
            {visitorData.crowdLevel}
          </Badge>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              visitorData.crowdLevel === 'Very High' ? 'bg-red-500' :
              visitorData.crowdLevel === 'High' ? 'bg-orange-500' :
              visitorData.crowdLevel === 'Moderate' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${100 - visitorData.availabilityPercent}%` }}
          />
        </div>
      </div>

      {/* Wait Time */}
      {visitorData.waitTime > 0 ? (
        <div className="flex items-center gap-2 text-sm p-2 bg-orange-500/10 rounded border border-orange-500/20">
          <Clock className="h-4 w-4 text-orange-600" />
          <span>
            <strong>{visitorData.waitTime} min</strong> wait time
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm p-2 bg-green-500/10 rounded border border-green-500/20">
          <Clock className="h-4 w-4 text-green-600" />
          <span>
            <strong>No wait</strong> - Great time to visit!
          </span>
        </div>
      )}

      {/* Peak Hours */}
      <div className="text-xs">
        <div className="flex items-center gap-1 text-muted-foreground mb-1">
          <AlertCircle className="h-3 w-3" />
          <span>Peak Hours</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {visitorData.peakHours.map((hour, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {hour}
            </Badge>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-muted-foreground text-center pt-2 border-t">
        Updated just now
      </p>
    </div>
  )
}
