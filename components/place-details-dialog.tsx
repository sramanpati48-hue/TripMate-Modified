"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import type { Place } from "@/lib/mock-data"
import { WeatherWidget } from "@/components/weather-widget"
import { LiveVisitorStatus } from "@/components/live-visitor-status"
import {
  Star,
  MapPin,
  Bookmark,
  Plus,
  ChevronLeft,
  ChevronRight,
  Share2,
  Clock,
  IndianRupee,
  Hotel,
  Loader2,
} from "lucide-react"

interface PlaceDetailsDialogProps {
  place: Place | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Hotel {
  name: string
  rating: number
  userRatingsTotal: number
  address: string
  priceLevel: number
  price?: number
  distance?: string
  coordinates?: { lat: number; lng: number }
  amenities?: string[]
}

export function PlaceDetailsDialog({ place, open, onOpenChange }: PlaceDetailsDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [hotelsLoading, setHotelsLoading] = useState(false)

  // Reset image index when place changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [place?.id])

  // Fetch hotels when dialog opens
  useEffect(() => {
    if (place && open) {
      fetchHotels()
    }
  }, [place?.id, open])

  const fetchHotels = async () => {
    if (!place) return

    setHotelsLoading(true)
    try {
      const response = await fetch(
        `/api/nearby-hotels?lat=${place.coordinates.lat}&lng=${place.coordinates.lng}&location=${encodeURIComponent(place.name)}`
      )
      const data = await response.json()
      
      // Use API data if available, otherwise fallback to mock data
      if (data && Array.isArray(data) && data.length > 0) {
        setHotels(data)
      } else {
        // Fallback to mock hotels when API returns empty
        setHotels(generateMockHotels(place.name))
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
      // Fallback to mock hotels on error
      setHotels(generateMockHotels(place.name))
    } finally {
      setHotelsLoading(false)
    }
  }

  const generateMockHotels = (placeName: string): Hotel[] => {
    // Generate coordinates near the place (slight offsets)
    const baseLat = place?.coordinates.lat || 28.6139
    const baseLng = place?.coordinates.lng || 77.2090
    
    return [
      {
        name: `${placeName} Grand Hotel`,
        rating: 4.5,
        userRatingsTotal: 1250,
        address: `Near ${placeName} main area`,
        priceLevel: 3,
        price: 3500,
        distance: '0.8 km',
        coordinates: { lat: baseLat + 0.007, lng: baseLng + 0.005 },
        amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa', 'Gym']
      },
      {
        name: `The Royal ${placeName}`,
        rating: 4.7,
        userRatingsTotal: 890,
        address: `${placeName} city center`,
        priceLevel: 4,
        price: 6500,
        distance: '1.2 km',
        coordinates: { lat: baseLat + 0.010, lng: baseLng - 0.008 },
        amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa', 'Room Service']
      },
      {
        name: `${placeName} Heritage Inn`,
        rating: 4.3,
        userRatingsTotal: 675,
        address: `Old ${placeName} district`,
        priceLevel: 2,
        price: 1800,
        distance: '1.5 km',
        coordinates: { lat: baseLat - 0.012, lng: baseLng + 0.009 },
        amenities: ['WiFi', 'Restaurant', 'Parking']
      },
      {
        name: `Comfort Stay ${placeName}`,
        rating: 4.2,
        userRatingsTotal: 540,
        address: `${placeName} railway station area`,
        priceLevel: 2,
        price: 1500,
        distance: '2.1 km',
        coordinates: { lat: baseLat + 0.015, lng: baseLng + 0.012 },
        amenities: ['WiFi', 'Breakfast', 'AC']
      },
      {
        name: `${placeName} Palace Resort`,
        rating: 4.8,
        userRatingsTotal: 1450,
        address: `${placeName} lakeside`,
        priceLevel: 4,
        price: 8500,
        distance: '3.5 km',
        coordinates: { lat: baseLat - 0.025, lng: baseLng - 0.020 },
        amenities: ['WiFi', 'Pool', 'Restaurant', 'Spa', 'Gym', 'Bar']
      },
      {
        name: `Budget Inn ${placeName}`,
        rating: 4.0,
        userRatingsTotal: 320,
        address: `Near ${placeName} bus stand`,
        priceLevel: 1,
        price: 900,
        distance: '1.8 km',
        coordinates: { lat: baseLat + 0.014, lng: baseLng - 0.011 },
        amenities: ['WiFi', 'Parking']
      }
    ]
  }

  if (!place) return null

  // Use the place's actual images array, or fallback to just the main image
  const images = place.images && place.images.length > 0 ? place.images : [place.image]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          <div className="relative h-64 sm:h-80 overflow-hidden">
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex ? "w-6 bg-primary" : "w-1.5 bg-primary/40"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className="p-6">
            <DialogHeader className="mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {place.category}
                  </Badge>
                  <DialogTitle className="text-2xl">{place.name}</DialogTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {place.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      {place.rating} ({place.reviewCount} reviews)
                    </span>
                    {place.price && (
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        {place.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="weather">Weather</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <p className="text-muted-foreground leading-relaxed mb-4">{place.description}</p>
                <p className="text-muted-foreground leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Best Time</p>
                      <p className="text-sm text-muted-foreground">Apr - Oct</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <IndianRupee className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Budget</p>
                      <p className="text-sm text-muted-foreground">{place.price || "Varies"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hotels" className="mt-4">
                {hotelsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="ml-3 text-muted-foreground">Loading hotels...</span>
                  </div>
                ) : hotels.length > 0 ? (
                  <div className="space-y-4">
                    {hotels.map((hotel, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                                  <Hotel className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-lg">{hotel.name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                    {hotel.coordinates ? (
                                      <button
                                        onClick={() => {
                                          const url = `https://www.google.com/maps/search/?api=1&query=${hotel.coordinates!.lat},${hotel.coordinates!.lng}`
                                          window.open(url, '_blank')
                                        }}
                                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors text-left"
                                      >
                                        {hotel.address}
                                      </button>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">{hotel.address}</p>
                                    )}
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-3 mt-2.5">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span className="font-medium">{hotel.rating}</span>
                                      <span className="text-sm text-muted-foreground">
                                        ({hotel.userRatingsTotal.toLocaleString()})
                                      </span>
                                    </div>
                                    
                                    {hotel.distance && (
                                      <span className="text-sm text-muted-foreground">
                                        • {hotel.distance} away
                                      </span>
                                    )}
                                    
                                    <div className="flex items-center gap-0.5">
                                      {Array.from({ length: hotel.priceLevel }).map((_, i) => (
                                        <IndianRupee key={i} className="h-3 w-3 fill-green-600 text-green-600" />
                                      ))}
                                      {Array.from({ length: 4 - hotel.priceLevel }).map((_, i) => (
                                        <IndianRupee key={`empty-${i}`} className="h-3 w-3 text-muted-foreground/20" />
                                      ))}
                                    </div>
                                  </div>

                                  {hotel.amenities && hotel.amenities.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      {hotel.amenities.map((amenity, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                          {amenity}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {hotel.price && (
                              <div className="text-right shrink-0">
                                <div className="text-2xl font-bold text-primary">
                                  ₹{hotel.price.toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  per night
                                </div>
                                <div className="flex flex-col gap-2 mt-2">
                                  <Button 
                                    size="sm" 
                                    className="w-full"
                                    onClick={() => {
                                      const hotelQuery = encodeURIComponent(hotel.name + ' ' + place.location)
                                      const bookingUrl = `https://www.booking.com/search.html?ss=${hotelQuery}&checkin=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}&checkout=${new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`
                                      window.open(bookingUrl, '_blank')
                                    }}
                                  >
                                    Book Now
                                  </Button>
                                  {hotel.coordinates && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="w-full gap-1"
                                      onClick={() => {
                                        const url = `https://www.google.com/maps/dir/?api=1&destination=${hotel.coordinates!.lat},${hotel.coordinates!.lng}&travelmode=driving`
                                        window.open(url, '_blank')
                                      }}
                                    >
                                      <MapPin className="h-3 w-3" />
                                      Directions
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Hotel className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No hotels found near this location</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="weather" className="mt-4">
                <WeatherWidget
                  locationName={`${place.location}, ${place.state}`}
                  lat={place.coordinates.lat}
                  lng={place.coordinates.lng}
                />
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                          U{i}
                        </div>
                        <div>
                          <p className="font-medium">User {i}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} className={`h-3 w-3 ${j < 4 ? "fill-accent text-accent" : "text-muted"}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Amazing experience! The place was exactly as described and the views were breathtaking.
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setIsBookmarked(!isBookmarked)}>
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button className="flex-1 gap-2">
                <Plus className="h-4 w-4" />
                Add to Trip
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
