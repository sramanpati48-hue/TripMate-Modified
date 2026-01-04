"use client"

import { MapPin, Utensils, Calendar, Building2, Camera } from "lucide-react"

interface MapMarkerProps {
  type: "destination" | "food" | "event" | "hotel" | "attraction"
  selected?: boolean
  onClick?: () => void
}

const markerIcons = {
  destination: MapPin,
  food: Utensils,
  event: Calendar,
  hotel: Building2,
  attraction: Camera,
}

const markerColors = {
  destination: "bg-primary text-primary-foreground",
  food: "bg-accent text-accent-foreground",
  event: "bg-chart-3 text-primary-foreground",
  hotel: "bg-chart-4 text-primary-foreground",
  attraction: "bg-chart-5 text-primary-foreground",
}

export function MapMarker({ type, selected, onClick }: MapMarkerProps) {
  const Icon = markerIcons[type]

  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all
        ${markerColors[type]}
        ${selected ? "scale-125 ring-4 ring-primary/30" : "hover:scale-110"}
      `}
    >
      <Icon className="h-5 w-5" />
      <span
        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${markerColors[type].split(" ")[0]}`}
      />
    </button>
  )
}
