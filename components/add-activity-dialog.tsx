"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TripActivity } from "@/components/trip-day-card"
import { getTransportModeName, calculateFare, type TransportMode, formatFare } from "@/lib/transport-service"
import { Car, IndianRupee, Clock } from "lucide-react"

interface AddActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (activity: Omit<TripActivity, "id">) => void
  previousLocation?: string
}

const categories = ["Sightseeing", "Food", "Activity", "Transport", "Accommodation", "Shopping", "Entertainment"]

const durations = ["30 min", "1 hour", "2 hours", "3 hours", "Half day", "Full day"]

const transportModes: TransportMode[] = [
  "none",
  "metro",
  "auto-rickshaw",
  "uber-go",
  "ola-mini",
  "taxi",
  "local-bus",
  "app-bike",
]

export function AddActivityDialog({ open, onOpenChange, onAdd, previousLocation }: AddActivityDialogProps) {
  const [name, setName] = useState("")
  const [time, setTime] = useState("09:00")
  const [duration, setDuration] = useState("1 hour")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("Sightseeing")
  const [notes, setNotes] = useState("")
  const [transportMode, setTransportMode] = useState<TransportMode>("uber-go")
  const [estimatedDistance, setEstimatedDistance] = useState(5)
  const [transportFare, setTransportFare] = useState(0)

  // Calculate transport fare when mode or distance changes
  useEffect(() => {
    if (transportMode !== "none") {
      const fareData = calculateFare(transportMode, estimatedDistance, time)
      setTransportFare(fareData.estimatedFare)
    } else {
      setTransportFare(0)
    }
  }, [transportMode, estimatedDistance, time])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !location) return

    onAdd({
      name,
      time,
      duration,
      location,
      category,
      notes: notes || undefined,
      transportMode: transportMode !== "none" ? transportMode : undefined,
      transportFare: transportFare > 0 ? transportFare : undefined,
      distanceToNext: transportMode !== "none" ? estimatedDistance : undefined,
    })

    // Reset form
    setName("")
    setTime("09:00")
    setDuration("1 hour")
    setLocation("")
    setCategory("Sightseeing")
    setNotes("")
    setTransportMode("uber-go")
    setEstimatedDistance(5)
    setTransportFare(0)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Activity Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Visit Eiffel Tower"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Start Time</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Paris, France"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
            />
          </div>

          {/* Transport Section */}
          {previousLocation && (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Car className="h-4 w-4" />
                <span>Transport to This Activity</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transportMode">Transport Mode</Label>
                  <Select value={transportMode} onValueChange={(value) => setTransportMode(value as TransportMode)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {transportModes.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {getTransportModeName(mode)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    min="0.5"
                    max="100"
                    step="0.5"
                    value={estimatedDistance}
                    onChange={(e) => setEstimatedDistance(parseFloat(e.target.value) || 5)}
                  />
                </div>
              </div>

              {transportMode !== "none" && (
                <Card className="p-3 bg-secondary/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Fare:</span>
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <IndianRupee className="h-4 w-4" />
                      {transportFare.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From: {previousLocation}
                  </p>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Activity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
