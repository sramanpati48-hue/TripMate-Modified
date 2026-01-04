"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlaceCard } from "@/components/place-card"
import { EmptyState } from "@/components/empty-state"

// Simplified Place type for profile page
interface ProfilePlace {
  id: string
  name: string
  description: string
  image: string
  rating: number
  reviewCount: number
  category: string[]
  location: string
}

interface FavoritePlace extends ProfilePlace {
  placeId: string
  placeName: string
  placeImage: string | null
  placeLocation: string | null
  placeRating: number | null
  placeCategory: string | null
}


import { Settings, MapPin, Calendar, Heart, Bookmark, Map, LogOut, Camera, Star } from "lucide-react"

// Mock data for favorites and bucket list - will be replaced with real data from backend
const mockBucketList: ProfilePlace[] = []

const mockTrips: any[] = []

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("favorites")
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<ProfilePlace[]>([])
  const [favoritesLoading, setFavoritesLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('user')

    if (!token) {
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }

    // Try to use stored user first (faster)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setIsLoading(false)
      } catch (e) {
        console.error('Failed to parse stored user:', e)
      }
    }

    // Fetch fresh user data from backend
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          // Token might be invalid or expired
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          router.push('/login')
          return
        }

        const data = await response.json()
        if (data.success && data.data) {
          setUser(data.data)
          localStorage.setItem('user', JSON.stringify(data.data))
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()

    // Fetch favorites
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            // Transform favorites to ProfilePlace format
            const transformedFavorites: ProfilePlace[] = data.data.map((fav: any) => ({
              id: fav.placeId,
              name: fav.placeName,
              description: '',
              image: fav.placeImage || '/placeholder.svg',
              rating: fav.placeRating || 0,
              reviewCount: 0,
              category: fav.placeCategory ? fav.placeCategory.split(', ') : [],
              location: fav.placeLocation || '',
            }))
            setFavorites(transformedFavorites)
          }
        }
      } catch (error) {
        console.error('Failed to fetch favorites:', error)
      } finally {
        setFavoritesLoading(false)
      }
    }

    fetchFavorites()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-secondary/20">
        {/* Profile Header */}
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" className="flex-1 sm:flex-initial gap-2 bg-transparent">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-initial gap-2 bg-transparent text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <Map className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Trips Planned</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MapPin className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Places Visited</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="h-4 w-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="bucket-list" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Bucket List
              </TabsTrigger>
              <TabsTrigger value="trips" className="gap-2">
                <Calendar className="h-4 w-4" />
                Saved Trips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="favorites">
              {favoritesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading favorites...</p>
                </div>
              ) : favorites.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {favorites.map((place) => (
                    <PlaceCard key={place.id} place={place as any} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Heart}
                  title="No favorites yet"
                  description="Start exploring and heart places you love to add them here."
                  actionLabel="Explore Places"
                  onAction={() => (window.location.href = "/explore")}
                />
              )}
            </TabsContent>

            <TabsContent value="bucket-list">
              {mockBucketList.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {mockBucketList.map((place) => (
                    <PlaceCard key={place.id} place={place as any} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Bookmark}
                  title="Your bucket list is empty"
                  description="Save destinations you dream of visiting to your bucket list."
                  actionLabel="Discover Destinations"
                  onAction={() => (window.location.href = "/explore")}
                />
              )}
            </TabsContent>

            <TabsContent value="trips">
              {mockTrips.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mockTrips.map((trip) => (
                    <Card key={trip.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={trip.image || "/placeholder.svg"}
                          alt={trip.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <Badge
                          className="absolute top-2 right-2"
                          variant={trip.status === "upcoming" ? "default" : "secondary"}
                        >
                          {trip.status === "upcoming" ? "Upcoming" : "Completed"}
                        </Badge>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{trip.name}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {trip.destination}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {trip.dates}
                          </span>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="No saved trips"
                  description="Plan your next adventure with our Trip Planner."
                  actionLabel="Start Planning"
                  onAction={() => (window.location.href = "/trip-planner")}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
