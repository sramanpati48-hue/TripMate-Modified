"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/admin/stats-card"
import { Map, Users, Calendar, TrendingUp, Eye, Star } from "lucide-react"
import { formatNumber } from "@/lib/utils"

const recentActivity = [
  { id: 1, action: "New place added", item: "Eiffel Tower", time: "2 hours ago" },
  { id: 2, action: "User registered", item: "john@example.com", time: "3 hours ago" },
  { id: 3, action: "Review posted", item: "Machu Picchu", time: "5 hours ago" },
  { id: 4, action: "Event created", item: "Paris Food Festival", time: "6 hours ago" },
  { id: 5, action: "Place updated", item: "Tokyo Tower", time: "8 hours ago" },
]

const popularPlaces = [
  { id: 1, name: "Santorini, Greece", views: 12453, rating: 4.9 },
  { id: 2, name: "Kyoto, Japan", views: 10234, rating: 4.8 },
  { id: 3, name: "Machu Picchu, Peru", views: 9876, rating: 4.9 },
  { id: 4, name: "Bali, Indonesia", views: 8765, rating: 4.7 },
  { id: 5, name: "Swiss Alps", views: 7654, rating: 4.8 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with TripMate.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Places" value="1,234" change="+12% from last month" changeType="positive" icon={Map} />
        <StatsCard
          title="Active Users"
          value="45,678"
          change="+8% from last month"
          changeType="positive"
          icon={Users}
        />
        <StatsCard title="Events This Month" value="89" change="+5 new events" changeType="positive" icon={Calendar} />
        <StatsCard
          title="Page Views"
          value="2.4M"
          change="+15% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.item}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Places</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularPlaces.map((place, index) => (
                <div key={place.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium">{place.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(place.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      {place.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
