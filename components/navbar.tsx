"use client"

import { useState, useEffect, type KeyboardEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Menu, MapPin, Compass, Map, CalendarDays, User, Sparkles, LogOut, Settings, Plane } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/components/language-provider"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { t } = useI18n()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const storedUser = localStorage.getItem('user')
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (e) {
          console.error('Failed to parse user:', e)
        }
      }
      setIsLoading(false)
    }

    checkAuth()

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = () => {
      checkAuth()
    }
    window.addEventListener('storage', handleStorageChange)
    
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  const handleSearch = () => {
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      router.push('/explore')
      return
    }
    router.push(`/explore?search=${encodeURIComponent(trimmed)}`)
  }

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  const navLinks = [
    { href: "/explore", label: t("navbar.explore"), icon: Compass },
    { href: "/transport", label: t("navbar.transport"), icon: Plane },
    { href: "/map", label: t("navbar.map"), icon: Map },
    { href: "/trip-planner", label: t("navbar.tripPlanner"), icon: CalendarDays },
    { href: "/matchmaker", label: t("navbar.findTravelBuddies"), icon: Sparkles },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b1220]/85 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-[#0b1220]/75">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 text-white">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="rounded-lg bg-gradient-to-br from-orange-500 to-emerald-400 p-2 transition-transform group-hover:scale-110">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">TRIPMATE</span>
              <span className="-mt-1 text-xs text-white/60">{t("navbar.tagline")}</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10 hover:text-white">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
            <Input 
              placeholder={t("navbar.searchDestinations")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/45 focus:bg-white/10 focus:ring-orange-500/30" 
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <ModeToggle />
          
          {/* Desktop Auth Section */}
          <div className="hidden md:block">
            {isLoading ? (
              <Button variant="outline" size="sm" disabled>
                <User className="h-4 w-4" />
              </Button>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-white/10">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border-white/10 bg-[#0f1726] text-white shadow-2xl" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-white/60">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {t("navbar.profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      {t("navbar.settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("navbar.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {t("navbar.login")}
                </Button>
              </Link>
            )}
          </div>

          {isMounted && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{t("navbar.toggleMenu")}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-white/10 bg-[#0b1220] text-white sm:w-[400px]">
                <SheetTitle className="sr-only">{t("navbar.navigationMenu")}</SheetTitle>
                <div className="flex flex-col gap-6 mt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                    <Input
                      placeholder={t("navbar.search")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        handleSearchKeyDown(e)
                        if (e.key === 'Enter') setIsOpen(false)
                      }}
                      className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/45"
                    />
                  </div>

                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-white/10">
                          <link.icon className="h-5 w-5" />
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                  </nav>

                  <LanguageSwitcher compact />

                  <div className="border-t pt-4">
                    {user ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-2 py-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-white/60 truncate">{user.email}</p>
                          </div>
                        </div>
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full justify-start gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                            <User className="h-4 w-4" />
                            {t("navbar.profile")}
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 border-white/10 bg-white/5 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                          onClick={() => {
                            handleLogout()
                            setIsOpen(false)
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          {t("navbar.logout")}
                        </Button>
                      </div>
                    ) : (
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button className="w-full gap-2 bg-orange-500 text-white hover:bg-orange-600">
                          <User className="h-4 w-4" />
                          {t("navbar.loginSignup")}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
