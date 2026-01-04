"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { WeatherWidget } from "@/components/weather-widget"
import { mockPlaces, type Place } from "@/lib/mock-data"
import { Star, MapPin, Cloud, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react"

interface MapSidebarProps {
  onPlaceSelect?: (place: Place) => void
  selectedPlace?: Place | null
  onViewDetails?: (place: Place) => void
}

export function MapSidebar({ onPlaceSelect, selectedPlace, onViewDetails }: MapSidebarProps) {
  const [showWeather, setShowWeather] = useState(true)
  const [showEvents, setShowEvents] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (isCollapsed) {
    return (
      <div className="absolute left-0 top-0 h-full z-10">
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-2 top-4 shadow-lg"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-80 lg:w-96 h-full bg-background border-r flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Nearby Places</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(true)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="weather-toggle" className="flex items-center gap-2 cursor-pointer">
            <Cloud className="h-4 w-4 text-muted-foreground" />
            Show Weather
          </Label>
          <Switch id="weather-toggle" checked={showWeather} onCheckedChange={setShowWeather} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="events-toggle" className="flex items-center gap-2 cursor-pointer">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Show Events
          </Label>
          <Switch id="events-toggle" checked={showEvents} onCheckedChange={setShowEvents} />
        </div>
      </div>

      {showWeather && (
        <div className="p-4 border-b">
          <WeatherWidget 
            locationName={selectedPlace?.name || "Paris"}
            lat={selectedPlace?.coordinates?.lat || 48.8584}
            lng={selectedPlace?.coordinates?.lng || 2.2945}
            compact 
          />
        </div>
      )}

      <ScrollArea className="flex-1 h-full" type="always">
        <div className="p-4 space-y-3">
          {mockPlaces.slice(0, 8).map((place) => (
            <Card
              key={place.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPlace?.id === place.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onPlaceSelect?.(place)}
            >
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <img
                    src={place.image || "/placeholder.svg"}
                    alt={place.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{place.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{place.location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span className="text-xs">{place.rating}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {place.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {selectedPlace && (
        <div className="p-4 border-t bg-secondary/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{selectedPlace.name}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onPlaceSelect?.(null as unknown as Place)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{selectedPlace.description}</p>
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => onViewDetails?.(selectedPlace)}
          >
            View Details
          </Button>
        </div>
      )}
    </div>
  )
}
