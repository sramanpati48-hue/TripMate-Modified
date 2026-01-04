"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { PlaceCard } from "@/components/place-card"
import { PlaceCardSkeleton } from "@/components/place-card-skeleton"
import { Filters } from "@/components/filters"
import { EmptyState } from "@/components/empty-state"
import { PlaceDetailsDialog } from "@/components/place-details-dialog"
import { PricingInfo } from "@/components/pricing-info"
import { LiveNotificationsPanel } from "@/components/live-notifications"
import { mockPlaces, type Place, type Region, type Category } from "@/lib/mock-data"
import { SearchX } from "lucide-react"

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<Region | "All">("All")
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All")

  // Read URL parameters on mount
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    const regionParam = searchParams.get("region")
    
    if (categoryParam) {
      // Capitalize each word to match category values (e.g., "hill station" -> "Hill Station")
      const capitalizedCategory = categoryParam
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      setSelectedCategory(capitalizedCategory as Category)
    }
    
    if (regionParam) {
      const capitalizedRegion = regionParam
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      setSelectedRegion(capitalizedRegion as Region)
    }
  }, [searchParams])

  useEffect(() => {
    // Fetch real-time data from Gemini API with category/region filters
    const fetchPlaces = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('realtime', 'true')
        if (selectedCategory !== 'All') params.set('category', selectedCategory)
        if (selectedRegion !== 'All') params.set('region', selectedRegion)
        if (searchQuery && searchQuery.trim().length > 0) {
          params.set('search', searchQuery.trim())
        }
        
        const response = await fetch(`/api/destinations?${params.toString()}`)
        const data = await response.json()
        setPlaces(data)
      } catch (error) {
        console.error('Error fetching destinations:', error)
        // Fallback to mock data
        setPlaces(mockPlaces)
      } finally {
        setIsLoading(false)
      }
    }
    
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchPlaces()
    }, searchQuery ? 500 : 0)
    
    return () => clearTimeout(timer)
  }, [selectedCategory, selectedRegion, searchQuery])

  const filteredPlaces = places.filter((place) => {
    const matchesSearch = !searchQuery || 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.category.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRegion = selectedRegion === "All" || place.region === selectedRegion
    const matchesCategory = selectedCategory === "All" || place.category.includes(selectedCategory)

    return matchesSearch && matchesRegion && matchesCategory
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-background py-12 border-b">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-3">
              Explore <span className="text-primary">India</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
              Discover incredible destinations across India - from spiritual havens to adventure hotspots
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 max-w-2xl">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={setSearchQuery}
                  showSuggestions={false}
                  placeholder="Search destinations, states, or categories..."
                />
              </div>
              <Filters
                selectedRegion={selectedRegion}
                selectedCategory={selectedCategory}
                onRegionChange={setSelectedRegion}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlaceCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredPlaces.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredPlaces.length} {filteredPlaces.length === 1 ? "result" : "results"}
                </p>
                <PricingInfo />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} onSelect={setSelectedPlace} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={SearchX}
              title="No places found"
              description={`We couldn't find any places matching "${searchQuery}". Try adjusting your search or filters.`}
              actionLabel="Clear Search"
              onAction={() => setSearchQuery("")}
            />
          )}
        </div>
      </main>
      <Footer />

      <PlaceDetailsDialog place={selectedPlace} open={!!selectedPlace} onOpenChange={() => setSelectedPlace(null)} />
      <LiveNotificationsPanel />
    </div>
  )
}
