"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, IndianRupee, Info, Navigation, Car, ArrowDown } from "lucide-react"
import { getTransportModeName } from "@/lib/transport-service"

export interface AIActivity {
  id: string
  time: string
  name: string
  description: string
  duration: string
  location: string
  category: string
  tips?: string
  cost?: string
  transportMode?: string
  transportFare?: number
  distanceToNext?: number
}

interface AIItineraryCardProps {
  activity: AIActivity
  isFirst?: boolean
  isLast?: boolean
}

export function AIItineraryCard({ activity, isFirst, isLast }: AIItineraryCardProps) {
  return (
    <div>
      <div className="flex gap-4">
        {/* Timeline */}
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />
          {!isLast && <div className="w-0.5 flex-1 bg-border my-2" />}
        </div>

        {/* Content */}
        <Card className={`flex-1 ${isFirst ? "mt-0" : "mt-0"} ${isLast ? "mb-0" : "mb-4"}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-sm font-medium text-primary">{activity.time}</p>
                <h4 className="font-semibold mt-0.5">{activity.name}</h4>
              </div>
              <Badge variant="secondary">{activity.category}</Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center gap-1 whitespace-nowrap text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{activity.duration}</span>
              </span>
              <button
                onClick={() => {
                  const query = encodeURIComponent(activity.location)
                  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
                }}
                className="flex items-center gap-1 whitespace-nowrap text-primary hover:underline transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{activity.location}</span>
              </button>
              {activity.cost && (
                <span className="flex items-center gap-1 font-medium text-foreground min-w-fit">
                  <span className="whitespace-nowrap">
                    {typeof activity.cost === 'number' ? `₹${activity.cost.toLocaleString()}` : activity.cost.toString().startsWith('₹') ? activity.cost : `₹${activity.cost}`}
                  </span>
                </span>
              )}
            </div>

            <Button
              size="sm"
              variant="outline"
              className="mt-3 w-full gap-2"
              onClick={() => {
                const query = encodeURIComponent(activity.location)
                window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
              }}
            >
              <Navigation className="h-4 w-4" />
              View on Google Maps
            </Button>

            {activity.tips && (
              <div className="mt-3 p-2 bg-accent/10 rounded-md flex items-start gap-2">
                <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{activity.tips}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Transport info to next activity */}
      {!isLast && activity.transportMode && (
        <div className="flex gap-4 my-2">
          <div className="w-3" />
          <Card className="flex-1 bg-secondary/30 border-dashed">
            <CardContent className="p-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border">
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Car className="h-4 w-4" />
                    {getTransportModeName(activity.transportMode as any)}
                  </span>
                  {activity.distanceToNext && (
                    <span className="text-muted-foreground">
                      {activity.distanceToNext} km
                    </span>
                  )}
                  {activity.transportFare && (
                    <span className="flex items-center gap-1 text-primary font-semibold ml-auto">
                      <IndianRupee className="h-4 w-4" />
                      {activity.transportFare.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
