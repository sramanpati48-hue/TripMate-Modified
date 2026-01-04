"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  MapPin,
  LayoutDashboard,
  Map,
  Users,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Utensils,
  Building2,
} from "lucide-react"

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/places", label: "Places", icon: Map },
  { href: "/admin/restaurants", label: "Restaurants", icon: Utensils },
  { href: "/admin/hotels", label: "Hotels", icon: Building2 },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen bg-sidebar border-r flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <Link href="/admin" className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
          <MapPin className="h-6 w-6 text-sidebar-primary shrink-0" />
          {!isCollapsed && <span className="font-bold text-sidebar-foreground">TripMate</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-sidebar-foreground"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href))
          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-2",
                )}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>{link.label}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-2 border-t">
        <Link href="/">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-3 text-sidebar-foreground", isCollapsed && "justify-center px-2")}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Back to Site</span>}
          </Button>
        </Link>
      </div>
    </aside>
  )
}
