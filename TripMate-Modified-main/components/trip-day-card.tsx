"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Plus, Trash2, Clock, MapPin, MoreVertical, Car, IndianRupee, ArrowDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getTransportModeName, formatFare } from "@/lib/transport-service"

export interface TripActivity {
  id: string
  name: string
  time: string
  duration: string
  location: string
  category: string
  notes?: string
  transportMode?: string
  transportFare?: number
  distanceToNext?: number
}

interface TripDayCardProps {
  day: number
  date: string
  activities: TripActivity[]
  onAddActivity?: () => void
  onRemoveActivity?: (activityId: string) => void
  onReorderActivities?: (activities: TripActivity[]) => void
}

export function TripDayCard({
  day,
  date,
  activities,
  onAddActivity,
  onRemoveActivity,
  onReorderActivities,
}: TripDayCardProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, activityId: string) => {
    setDraggedItem(activityId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) return

    const draggedIndex = activities.findIndex((a) => a.id === draggedItem)
    const targetIndex = activities.findIndex((a) => a.id === targetId)

    const newActivities = [...activities]
    const [removed] = newActivities.splice(draggedIndex, 1)
    newActivities.splice(targetIndex, 0, removed)

    onReorderActivities?.(newActivities)
    setDraggedItem(null)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {day}
            </div>
            <div>
              <h3 className="font-semibold">Day {day}</h3>
              <p className="text-sm text-muted-foreground">{date}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onAddActivity} className="gap-1">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {activities.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-3">No activities planned</p>
            <Button variant="outline" size="sm" onClick={onAddActivity} className="gap-2 bg-transparent">
              <Plus className="h-4 w-4" />
              Add Activity
            </Button>
          </div>
        ) : (
          <div>
            {activities.map((activity, index) => (
              <div key={activity.id}>
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, activity.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, activity.id)}
                  className={`flex items-start gap-3 p-4 transition-all hover:bg-secondary/30 ${
                    draggedItem === activity.id ? "opacity-50" : ""
                  }`}
                >
                  <button className="mt-1 cursor-grab active:cursor-grabbing touch-none">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium">{activity.name}</h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.time} ({activity.duration})
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {activity.location}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {activity.category}
                      </Badge>
                    </div>
                    {activity.notes && <p className="mt-2 text-sm text-muted-foreground">{activity.notes}</p>}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => onRemoveActivity?.(activity.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Transport info between activities */}
                {index < activities.length - 1 && activity.transportMode && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary/20 border-y">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border">
                      <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 font-medium">
                        <Car className="h-3.5 w-3.5" />
                        {getTransportModeName(activity.transportMode as any)}
                      </span>
                      {activity.distanceToNext && (
                        <span className="text-muted-foreground">
                          {activity.distanceToNext} km
                        </span>
                      )}
                      {activity.transportFare && (
                        <span className="flex items-center gap-1 text-primary font-semibold ml-auto">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {activity.transportFare.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
