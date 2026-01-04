"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MapPin,
  Search,
  Star,
  Phone,
  Globe,
  Navigation,
  Clock,
  IndianRupee,
  Users,
  Loader2,
  ExternalLink,
  X
} from "lucide-react"
import {
  geocodeDestination,
  searchNearbyPlaces,
  placeTypes,
  type NearbyPlace,
  type Destination,
  getPriceLevelSymbol,
  getDirectionsUrl
} from "@/lib/google-maps-service"

interface NearbyPlacesSearchProps {
  onLocationSelect?: (destination: Destination) => void
  onPlaceSelect?: (place: NearbyPlace) => void
  initialDestination?: string
}

export function NearbyPlacesSearch({
  onLocationSelect,
  onPlaceSelect,
  initialDestination = ""
}: NearbyPlacesSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialDestination)
  const [destination, setDestination] = useState<Destination | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("restaurant")
  const [places, setPlaces] = useState<NearbyPlace[]>([])
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Search for destination
  const handleSearch = async () => {
    if (!searchQuery || !searchQuery.trim()) {
      setError("Please enter a destination")
      return
    }

    setIsSearching(true)
    setError(null)
    setDestination(null)

    try {
      const result = await geocodeDestination(searchQuery.trim())
      
      if (result) {
        setDestination(result)
        onLocationSelect?.(result)
        // Auto-search for restaurants when destination is found
        await loadNearbyPlaces(result.location, "restaurant")
      } else {
        setError("Destination not found. Try: Taj Mahal, Jaipur, Goa, Varanasi, etc.")
        setDestination(null)
      }
    } catch (err) {
      setError("Failed to search destination. Please try again.")
      setDestination(null)
      console.error("Search error:", err)
    } finally {
      setIsSearching(false)
    }
  }

  // Load nearby places for a category
  const loadNearbyPlaces = async (
    location: { lat: number; lng: number },
    category: string
  ) => {
    // Validate location
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      console.error("Invalid location provided")
      return
    }

    setIsLoadingPlaces(true)
    setPlaces([])
    setSelectedPlace(null)

    try {
      const results = await searchNearbyPlaces(location, category)
      setPlaces(results || [])
    } catch (err) {
      console.error("Failed to load places:", err)
      setPlaces([])
    } finally {
      setIsLoadingPlaces(false)
    }
  }

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (destination) {
      loadNearbyPlaces(destination.location, category)
    }
  }

  // Handle place selection
  const handlePlaceClick = (place: NearbyPlace) => {
    setSelectedPlace(place)
    onPlaceSelect?.(place)
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Find Nearby Places</CardTitle>
          <CardDescription>
            Search for restaurants, hotels, and essential locations near your destination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter destination (e.g., Taj Mahal, Jaipur, Goa...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <X className="h-3 w-3" />
              {error}
            </div>
          )}

          {destination && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <MapPin className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-green-900 dark:text-green-100">
                  {destination.name}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 truncate">
                  {destination.address}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Tabs */}
      {destination && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Select Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
              <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 h-auto">
                {placeTypes.map((type) => (
                  <TabsTrigger
                    key={type.id}
                    value={type.id}
                    className="flex flex-col items-center gap-1 py-2"
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-xs hidden sm:block">{type.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Results */}
              <div className="mt-4">
                {isLoadingPlaces ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : places.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No places found in this category</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] pr-4" type="always">
                    <div className="space-y-3">
                      {places.map((place) => (
                        <Card
                          key={place.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedPlace?.id === place.id
                              ? "border-primary shadow-md"
                              : ""
                          }`}
                          onClick={() => handlePlaceClick(place)}
                        >
                          <CardContent className="p-4">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">
                                  {place.name}
                                </h3>
                                <p className="text-xs text-muted-foreground truncate">
                                  {place.address}
                                </p>
                              </div>
                              <Badge
                                variant={place.isOpen ? "default" : "secondary"}
                                className="shrink-0"
                              >
                                {place.isOpen ? "Open" : "Closed"}
                              </Badge>
                            </div>

                            {/* Rating & Distance */}
                            <div className="flex items-center gap-3 mb-2 text-xs">
                              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                                <Star className="h-3 w-3 fill-current" />
                                <span className="font-medium">{place.rating}</span>
                                <span className="text-muted-foreground">
                                  ({place.totalRatings})
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Navigation className="h-3 w-3" />
                                <span>{place.distance}</span>
                              </div>
                              {place.priceLevel && (
                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                  <IndianRupee className="h-3 w-3" />
                                  <span>{getPriceLevelSymbol(place.priceLevel)}</span>
                                </div>
                              )}
                            </div>

                            {/* Opening Hours */}
                            {place.openingHours && place.openingHours.length > 0 && (
                              <div className="flex items-start gap-1 text-xs text-muted-foreground mb-2">
                                <Clock className="h-3 w-3 mt-0.5 shrink-0" />
                                <span className="truncate">
                                  {place.openingHours[0]}
                                </span>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-3">
                              {place.phoneNumber && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(`tel:${place.phoneNumber}`, "_blank")
                                  }}
                                >
                                  <Phone className="h-3 w-3 mr-1" />
                                  Call
                                </Button>
                              )}
                              {place.website && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(place.website, "_blank")
                                  }}
                                >
                                  <Globe className="h-3 w-3 mr-1" />
                                  Website
                                </Button>
                              )}
                              <Button
                                variant="default"
                                size="sm"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (destination) {
                                    const url = getDirectionsUrl(
                                      destination.location,
                                      place.location
                                    )
                                    window.open(url, "_blank")
                                  }
                                }}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Directions
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
