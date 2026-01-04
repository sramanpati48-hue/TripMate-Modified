"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { MapSidebar } from "@/components/map-sidebar"
import { InteractiveMap } from "@/components/interactive-map"
import { PlaceDetailsDialog } from "@/components/place-details-dialog"
import { NearbyPlacesSearch } from "@/components/nearby-places-search"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MapPin, Search } from "lucide-react"
import type { Place } from "@/lib/mock-data"
import type { Destination, NearbyPlace } from "@/lib/google-maps-service"

export default function MapPage() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [detailsPlace, setDetailsPlace] = useState<Place | null>(null)
  const [searchDestination, setSearchDestination] = useState<Destination | null>(null)
  const [selectedNearbyPlace, setSelectedNearbyPlace] = useState<NearbyPlace | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <MapSidebar 
          onPlaceSelect={setSelectedPlace} 
          selectedPlace={selectedPlace}
          onViewDetails={setDetailsPlace}
        />
        <div className="flex-1 relative">
          <InteractiveMap 
            selectedId={selectedPlace?.id}
            searchDestination={searchDestination}
            nearbyPlaces={selectedNearbyPlace ? [selectedNearbyPlace] : []}
          />
          
          {/* Floating Search Button */}
          <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <SheetTrigger asChild>
              <Button
                size="lg"
                className="absolute top-4 left-4 shadow-lg z-10 gap-2"
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Find Nearby Places</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Nearby Places Search
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <NearbyPlacesSearch
                  onLocationSelect={(dest) => {
                    setSearchDestination(dest)
                  }}
                  onPlaceSelect={(place) => {
                    setSelectedNearbyPlace(place)
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <PlaceDetailsDialog place={detailsPlace} open={!!detailsPlace} onOpenChange={() => setDetailsPlace(null)} />
    </div>
  )
}
