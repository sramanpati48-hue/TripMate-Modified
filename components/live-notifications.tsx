"use client"

import { useEffect, useState } from "react"
import { Bell, X, TrendingUp, CloudRain, IndianRupee, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { LiveNotification } from "@/lib/realtime-services"
import { mockPlaces } from "@/lib/mock-data"

export function LiveNotificationsPanel() {
  const [notifications, setNotifications] = useState<LiveNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Simulate incoming notifications
    const interval = setInterval(() => {
      const types: Array<LiveNotification['type']> = ['price_drop', 'weather_alert', 'crowd_update', 'trend']
      const type = types[Math.floor(Math.random() * types.length)]
      const place = mockPlaces[Math.floor(Math.random() * mockPlaces.length)]
      
      const newNotif: LiveNotification = {
        id: `notif-${Date.now()}`,
        type,
        title: type === 'price_drop' ? '💰 Price Drop!' :
               type === 'weather_alert' ? '🌤️ Weather Update' :
               type === 'crowd_update' ? '👥 Low Crowd Alert' :
               '🔥 Trending Now',
        message: type === 'price_drop' ? `${place.name} - Save 25% today!` :
                 type === 'weather_alert' ? `Perfect weather at ${place.name}` :
                 type === 'crowd_update' ? `${place.name} has low crowd levels` :
                 `${place.name} is trending! Check it out`,
        severity: type === 'price_drop' ? 'success' : 'info',
        timestamp: new Date(),
        placeId: place.id,
        actionLabel: 'View'
      }
      
      setNotifications(prev => [newNotif, ...prev].slice(0, 10))
      setUnreadCount(prev => prev + 1)
    }, 15000) // New notification every 15 seconds
    
    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = (notif: LiveNotification) => {
    // Mark as read
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const clearAll = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  const getIcon = (type: LiveNotification['type']) => {
    switch (type) {
      case 'price_drop': return <IndianRupee className="h-4 w-4" />
      case 'weather_alert': return <CloudRain className="h-4 w-4" />
      case 'crowd_update': return <Users className="h-4 w-4" />
      case 'trend': return <TrendingUp className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getColor = (severity: LiveNotification['severity']) => {
    switch (severity) {
      case 'success': return 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'
      case 'warning': return 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400'
      case 'error': return 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
      default: return 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400'
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Notification Button */}
      <Button
        size="icon"
        className="relative h-14 w-14 rounded-full border border-white/10 bg-orange-500 text-white shadow-lg shadow-black/30 hover:bg-orange-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 animate-bounce"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 max-h-[600px] w-96 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]/95 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-4 bg-white/5">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <h3 className="font-semibold">Live Updates</h3>
              <Badge variant="secondary" className="animate-pulse border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">● Live</Badge>
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-white hover:bg-white/10 hover:text-white">
                  Clear All
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-white/65">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No new notifications</p>
                <p className="text-sm mt-1">We'll notify you of any updates</p>
              </div>
            ) : (
              <div className="divide-y divide-white/8">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`cursor-pointer border-l-4 p-4 transition-colors hover:bg-white/5 ${getColor(notif.severity)}`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-lg p-2 ${getColor(notif.severity)}`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{notif.title}</h4>
                        <p className="text-sm text-white/65">{notif.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-white/45">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {notif.actionLabel && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-white hover:bg-white/10 hover:text-white">
                              {notif.actionLabel}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
