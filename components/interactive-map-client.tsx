"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Navigation2, Map, MapPin, Star, Phone } from "lucide-react"
import type { Destination, NearbyPlace } from "@/lib/google-maps-service"

interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  type: "destination" | "food" | "event" | "hotel" | "attraction"
  rating?: number
  address?: string
}

const mockLocations: MapLocation[] = [
  { id: "1", name: "Taj Mahal", lat: 27.1751, lng: 78.0421, type: "attraction", rating: 4.8, address: "Agra, Uttar Pradesh" },
  { id: "2", name: "India Gate", lat: 28.6129, lng: 77.2295, type: "attraction", rating: 4.6, address: "New Delhi" },
  { id: "3", name: "Gateway of India", lat: 18.9220, lng: 72.8347, type: "attraction", rating: 4.7, address: "Mumbai, Maharashtra" },
  { id: "4", name: "Hawa Mahal", lat: 26.9239, lng: 75.8267, type: "attraction", rating: 4.5, address: "Jaipur, Rajasthan" },
  { id: "5", name: "Golden Temple", lat: 31.6200, lng: 74.8765, type: "destination", rating: 4.9, address: "Amritsar, Punjab" },
  { id: "6", name: "Mysore Palace", lat: 12.3051, lng: 76.6551, type: "destination", rating: 4.7, address: "Mysore, Karnataka" },
]

// Create custom marker icons for different location types
const createMarkerIcon = (type: string, isSelected: boolean = false) => {
  const colors: { [key: string]: string } = {
    destination: "#e11d48",
    food: "#f97316",
    event: "#8b5cf6",
    hotel: "#0ea5e9",
    attraction: "#ec4899",
  }
  const color = colors[type] || "#3b82f6"
  const size = isSelected ? 44 : 36

  return L.divIcon({
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, ${color}, ${color}dd);
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
        transition: all 0.2s;
        cursor: pointer;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    popupAnchor: [0, -size / 2],
    className: "leaflet-div-icon-custom"
  })
}

interface InteractiveMapProps {
  onMarkerClick?: (location: MapLocation) => void
  selectedId?: string
  searchDestination?: Destination | null
  nearbyPlaces?: NearbyPlace[]
}

export function InteractiveMapClient({ 
  onMarkerClick, 
  selectedId, 
  searchDestination,
  nearbyPlaces = [] 
}: InteractiveMapProps) {
  const [zoom, setZoom] = useState(6)
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629])
  const [selectedNearbyPlace, setSelectedNearbyPlace] = useState<NearbyPlace | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)

  // Center map on search destination
  useEffect(() => {
    if (searchDestination) {
      setMapCenter([searchDestination.location.lat, searchDestination.location.lng])
      setZoom(13)
    }
  }, [searchDestination])

  const filteredLocations = filterType 
    ? mockLocations.filter(loc => loc.type === filterType)
    : mockLocations

  // Handle zoom with map instance
  const handleZoomChange = (delta: number) => {
    const newZoom = Math.max(2, Math.min(19, zoom + delta))
    setZoom(newZoom)
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 rounded-lg overflow-hidden shadow-xl">
      {/* Professional header with controls */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20">
              <Map className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Interactive Travel Map</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Explore destinations across India</p>
            </div>
          </div>
          
          {/* Filter buttons */}
          <div className="flex gap-2 flex-wrap">
            {["destination", "attraction", "food", "hotel"].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(filterType === type ? null : type)}
                className="capitalize text-xs"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ position: "absolute", top: "80px", left: 0, right: 0, bottom: 0 }}>
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ width: "100%", height: "100%" }}
          ref={setMapInstance}
        >
          {/* Professional OSM tile layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
            className="map-tiles"
          />

          {/* Alternative - Cartodb tiles for better look */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            maxZoom={20}
            opacity={0.85}
          />

          {/* Search destination marker */}
          {searchDestination && (
            <Marker
              position={[searchDestination.location.lat, searchDestination.location.lng]}
              icon={createMarkerIcon("destination", true)}
            >
              <Popup className="custom-popup" closeButton={true}>
                <div className="p-3 min-w-[280px]">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {searchDestination.name}
                  </h4>
                  <p className="text-sm text-slate-600">{searchDestination.description || "A beautiful destination in India"}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Nearby places markers */}
          {nearbyPlaces.map((place) => (
            <Marker
              key={place.id}
              position={[place.location.lat, place.location.lng]}
              icon={createMarkerIcon("food", selectedNearbyPlace?.id === place.id)}
              eventHandlers={{
                click: () => {
                  setSelectedNearbyPlace(place)
                  onMarkerClick?.({ ...place, id: place.id, type: "food" })
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="p-3 min-w-[260px]">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    {place.name}
                  </h4>
                  <p className="text-xs text-slate-500 mb-2">{place.formatted_address}</p>
                  <div className="flex items-center gap-3 flex-wrap text-xs">
                    {place.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{place.rating}</span>
                      </div>
                    )}
                    {place.phone_number && (
                      <div className="flex items-center gap-1 text-slate-600">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{place.phone_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Mock locations markers */}
          {filteredLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={createMarkerIcon(location.type, selectedId === location.id)}
              eventHandlers={{
                click: () => {
                  onMarkerClick?.(location)
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="p-3 min-w-[240px]">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    {location.name}
                  </h4>
                  <p className="text-xs text-slate-600 capitalize mb-2">{location.type}</p>
                  {location.address && (
                    <p className="text-sm text-slate-600 mb-2">{location.address}</p>
                  )}
                  <div className="flex items-center gap-1">
                    {location.rating && (
                      <>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{location.rating}</span>
                      </>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Professional floating control panel */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-1.5">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleZoomChange(1)}
          className="rounded-lg h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Zoom in"
        >
          <Plus className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        </Button>
        
        <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 mx-auto" />
        
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleZoomChange(-1)}
          className="rounded-lg h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Zoom out"
        >
          <Minus className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        </Button>
        
        <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 mx-auto" />
        
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setMapCenter([20.5937, 78.9629])
            setZoom(6)
          }}
          className="rounded-lg h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Center on India"
        >
          <Navigation2 className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        </Button>
      </div>

      {/* Legend/Info panel */}
      <div className="absolute bottom-6 left-6 z-20 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 max-w-sm backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-primary to-purple-600" />
          Location Types
        </h4>
        <div className="space-y-2.5">
          {[
            { type: "destination", label: "Destinations", color: "#e11d48" },
            { type: "attraction", label: "Attractions", color: "#ec4899" },
            { type: "food", label: "Dining", color: "#f97316" },
            { type: "hotel", label: "Hotels", color: "#0ea5e9" },
          ].map(({ type, label, color }) => (
            <div key={type} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setFilterType(filterType === type ? null : type)}>
              <div
                className="w-4 h-4 rounded-full shadow-md"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom styles for popups */}
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
          border-radius: 12px;
          border: 1px solid rgba(229, 231, 235, 0.5);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          padding: 0;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(229, 231, 235, 0.5);
        }

        .dark .custom-popup .leaflet-popup-content-wrapper {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%);
          border-color: rgba(71, 85, 105, 0.5);
        }

        .dark .custom-popup .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.98);
          border-color: rgba(71, 85, 105, 0.5);
        }

        .leaflet-control-zoom {
          display: none !important;
        }

        .leaflet-div-icon-custom {
          background: none;
          border: none;
        }

        .map-tiles {
          filter: brightness(0.95) contrast(1.1);
        }

        .dark .map-tiles {
          filter: brightness(0.7) contrast(1.2);
        }
      `}</style>
    </div>
  )
}
