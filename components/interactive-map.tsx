"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapMarker } from "@/components/map-marker"
import { Plus, Minus, Locate, Layers, Navigation, Star, Phone } from "lucide-react"
import type { Destination, NearbyPlace } from "@/lib/google-maps-service"

interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  type: "destination" | "food" | "event" | "hotel" | "attraction"
}

const mockLocations: MapLocation[] = [
  { id: "1", name: "Taj Mahal", lat: 27.1751, lng: 78.0421, type: "attraction" },
  { id: "2", name: "India Gate", lat: 28.6129, lng: 77.2295, type: "attraction" },
  { id: "3", name: "Gateway of India", lat: 18.9220, lng: 72.8347, type: "attraction" },
  { id: "4", name: "Hawa Mahal", lat: 26.9239, lng: 75.8267, type: "attraction" },
  { id: "5", name: "Golden Temple", lat: 31.6200, lng: 74.8765, type: "destination" },
  { id: "6", name: "Mysore Palace", lat: 12.3051, lng: 76.6551, type: "destination" },
]

interface InteractiveMapProps {
  onMarkerClick?: (location: MapLocation) => void
  selectedId?: string
  searchDestination?: Destination | null
  nearbyPlaces?: NearbyPlace[]
}

export function InteractiveMap({ 
  onMarkerClick, 
  selectedId, 
  searchDestination,
  nearbyPlaces = [] 
}: InteractiveMapProps) {
  const [zoom, setZoom] = useState(100)
  // Center on India (approximately center of India)
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 })
  const [selectedNearbyPlace, setSelectedNearbyPlace] = useState<NearbyPlace | null>(null)

  // Center map on search destination
  useEffect(() => {
    if (searchDestination) {
      setMapCenter({
        lat: searchDestination.location.lat,
        lng: searchDestination.location.lng
      })
      setZoom(150)
    } else {
      // Reset to India center when no destination
      setMapCenter({ lat: 20.5937, lng: 78.9629 })
      setZoom(100)
    }
  }, [searchDestination])

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 50))

  // Convert lat/lng to screen position for India map
  const latLngToPosition = (lat: number, lng: number) => {
    const centerLat = mapCenter.lat
    const centerLng = mapCenter.lng
    
    // Scale factors adjusted for India's geography
    // India spans roughly 8°N to 37°N (latitude) and 68°E to 97°E (longitude)
    const latScale = 120 // Adjust this to fit markers correctly
    const lngScale = 100
    
    return {
      left: `${50 + (lng - centerLng) * lngScale}%`,
      top: `${50 - (lat - centerLat) * latScale}%`,
    }
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.4) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
          animation: 'pulse 4s ease-in-out infinite'
        }} />
      </div>
      
      {/* Map container with zoom capability - Full stretch */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Search destination marker - Modern Design */}
        {searchDestination && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-20"
            style={latLngToPosition(
              searchDestination.location.lat,
              searchDestination.location.lng
            )}
          >
            <div className="relative animate-in fade-in zoom-in duration-500">
              {/* Pulsing rings */}
              <div className="absolute inset-0 -m-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full animate-ping" />
              </div>
              <div className="absolute inset-0 -m-2">
                <div className="w-12 h-12 bg-primary/30 rounded-full animate-pulse" />
              </div>
              
              {/* Main marker */}
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary via-primary to-purple-600 rounded-full shadow-2xl flex items-center justify-center ring-4 ring-white dark:ring-gray-900 transition-transform hover:scale-110">
                <Locate className="h-5 w-5 text-white drop-shadow-lg" />
              </div>
              
              {/* Label with modern styling */}
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="bg-gradient-to-r from-primary/95 to-purple-600/95 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold shadow-2xl border border-white/20 text-white">
                  {searchDestination.name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nearby places markers */}
        {nearbyPlaces.map((place) => {
          const position = latLngToPosition(place.location.lat, place.location.lng)
          const isSelected = selectedNearbyPlace?.id === place.id
          
          return (
            <div
              key={place.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer z-10"
              style={position}
              onClick={() => setSelectedNearbyPlace(isSelected ? null : place)}
            >
              <div className={`relative ${isSelected ? 'scale-125' : 'hover:scale-110'} transition-all duration-300`}>
                <div className={`w-8 h-8 rounded-full shadow-xl flex items-center justify-center ring-2 ring-white dark:ring-gray-900 backdrop-blur-sm ${
                  place.category === 'restaurant' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                  place.category === 'hotel' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                  place.category === 'food_stall' ? 'bg-gradient-to-br from-yellow-400 to-amber-600' :
                  place.category === 'hospital' ? 'bg-gradient-to-br from-red-500 to-red-700' :
                  place.category === 'atm' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                  'bg-gradient-to-br from-purple-400 to-purple-600'
                }`}>
                  {place.category === 'restaurant' && '🍽️'}
                  {place.category === 'hotel' && '🏨'}
                  {place.category === 'food_stall' && '☕'}
                  {place.category === 'hospital' && '🏥'}
                  {place.category === 'atm' && '🏧'}
                  {place.category === 'gas_station' && '⛽'}
                  {place.category === 'pharmacy' && '💊'}
                  {place.category === 'tourist_attraction' && '🎯'}
                </div>
                
                {/* Place info popup - Modern Card */}
                {isSelected && (
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-72 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-4 z-30 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-sm">{place.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{place.address}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{place.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Navigation className="h-3 w-3" />
                          <span>{place.distance}</span>
                        </div>
                      </div>

                      {place.phoneNumber && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`tel:${place.phoneNumber}`, '_blank')
                          }}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call Now
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Original mock markers (only show if no search active) */}
        {!searchDestination && mockLocations.map((location) => (
          <div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer z-10"
            style={latLngToPosition(location.lat, location.lng)}
          >
            <MapMarker
              type={location.type}
              selected={selectedId === location.id}
              onClick={() => onMarkerClick?.(location)}
            />
          </div>
        ))}
      </div>

      {/* Map controls - Modern Floating Design */}
      <div className="absolute right-6 top-6 flex flex-col gap-2">
        <div className="bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 p-2 flex flex-col gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomIn} 
            className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomOut} 
            className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
          >
            <Minus className="h-5 w-5" />
          </Button>
          <div className="h-px bg-border/50 my-1" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
            onClick={() => {
              if (searchDestination) {
                setMapCenter({
                  lat: searchDestination.location.lat,
                  lng: searchDestination.location.lng
                })
                setZoom(150)
              } else {
                setMapCenter({ lat: 20.5937, lng: 78.9629 })
                setZoom(100)
              }
            }}
          >
            <Locate className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
          >
            <Layers className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Zoom level indicator - Modern Badge */}
      <div className="absolute left-6 bottom-6 px-4 py-2 bg-gradient-to-r from-primary/95 to-purple-600/95 backdrop-blur-xl rounded-full text-sm font-semibold shadow-lg border border-white/20 text-white">
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          {zoom}%
        </span>
      </div>

      {/* Legend - Modern Card */}
      <div className="absolute right-6 bottom-6 p-4 bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 text-xs space-y-2">
        {searchDestination ? (
          <>
            <div className="font-semibold mb-2 text-sm">Nearby Places</div>
            <div className="flex items-center gap-2">
              <span className="text-base">🍽️</span>
              <span>Restaurants</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🏨</span>
              <span>Hotels</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">☕</span>
              <span>Cafes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🏥</span>
              <span>Hospitals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🏧</span>
              <span>ATMs</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span>Destinations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent" />
              <span>Food</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-chart-3" />
              <span>Events</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-chart-4" />
              <span>Hotels</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
