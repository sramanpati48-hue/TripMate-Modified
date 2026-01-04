"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, MapPin, Clock, IndianRupee } from "lucide-react"
import type { Place } from "@/lib/mock-data"
import { LiveVisitorStatus } from "@/components/live-visitor-status"
import { formatNumber } from "@/lib/utils"

interface PlaceCardProps {
  place: Place
  onSelect?: (place: Place) => void
}

export function PlaceCard({ place, onSelect }: PlaceCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if place is already favorited
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) return

      try {
        const response = await fetch('/api/favorites', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          const isAlreadyFavorite = data.data?.some((fav: any) => fav.placeId === place.id)
          setIsFavorite(isAlreadyFavorite)
        }
      } catch (error) {
        console.error('Failed to check favorite status:', error)
      }
    }

    checkFavoriteStatus()
  }, [place.id])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const token = localStorage.getItem('authToken')
    if (!token) {
      alert('Please login to save favorites')
      window.location.href = '/login'
      return
    }

    setIsLoading(true)

    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?placeId=${place.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (response.ok) {
          setIsFavorite(false)
        } else {
          const data = await response.json()
          alert(data.message || 'Failed to remove from favorites')
        }
      } else {
        // Add to favorites
        const payload = {
          placeId: place.id,
          placeName: place.name,
          placeImage: place.image,
          placeLocation: place.location,
          placeRating: place.rating,
          placeCategory: Array.isArray(place.category) ? place.category.join(', ') : place.category
        }
        
        console.log('Adding to favorites:', payload)

        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        const data = await response.json()
        console.log('Favorite response:', data)

        if (response.ok) {
          setIsFavorite(true)
          alert('Added to favorites! ❤️')
        } else {
          if (data.message === 'Already in favorites') {
            setIsFavorite(true)
          } else {
            console.error('Failed to add favorite:', data)
            alert(data.message || 'Failed to add to favorites')
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      className="overflow-hidden group cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 border-border/50"
      onClick={() => onSelect?.(place)}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={place.image || "/placeholder.svg"}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Add to Favorites Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm hover:bg-background shadow-md"
          onClick={toggleFavorite}
          disabled={isLoading}
        >
          <Heart
            className={`h-4 w-4 transition-all ${
              isFavorite ? "fill-primary text-primary scale-110" : "text-foreground/70"
            }`}
          />
        </Button>
        {/* Categories */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {place.category.slice(0, 2).map((cat) => (
            <Badge
              key={cat}
              className="bg-primary/90 text-primary-foreground backdrop-blur-sm text-xs"
              variant="default"
            >
              {cat}
            </Badge>
          ))}
        </div>
        {/* Price Badge */}
        <Badge className="absolute bottom-3 right-3 bg-background/90 text-foreground backdrop-blur-sm shadow-md">
          <IndianRupee className="h-3 w-3 mr-1" />
          {place.price}
        </Badge>
      </div>
      <CardContent className="p-4 space-y-3">
        {/* Header with Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg line-clamp-1 text-foreground group-hover:text-primary transition-colors">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-sm shrink-0 bg-accent/10 px-2 py-1 rounded-md">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="font-semibold">{place.rating}</span>
          </div>
        </div>

        {/* Location & Duration */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <span className="line-clamp-1">{place.location}, {place.state}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground shrink-0">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">{place.duration}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {place.shortDescription}
        </p>

        {/* Live Visitor Status */}
        <LiveVisitorStatus 
          placeId={place.id}
          placeName={place.name}
          monthlyVisitors={place.monthlyVisitors}
          compact
        />

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{formatNumber(place.reviewCount)} reviews</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {place.region} India
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

