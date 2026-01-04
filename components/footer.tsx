import Link from "next/link"
import { MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TripMate</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your smart travel companion for discovering amazing destinations around the world.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Explore</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/explore" className="hover:text-primary transition-colors">
                Destinations
              </Link>
              <Link href="/explore?category=food" className="hover:text-primary transition-colors">
                Food & Dining
              </Link>
              <Link href="/explore?category=events" className="hover:text-primary transition-colors">
                Events
              </Link>
              <Link href="/explore?category=hotels" className="hover:text-primary transition-colors">
                Hotels
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Plan</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/trip-planner" className="hover:text-primary transition-colors">
                Trip Planner
              </Link>
              <Link href="/map" className="hover:text-primary transition-colors">
                Map View
              </Link>
              <Link href="/trip-planner#ai" className="hover:text-primary transition-colors">
                AI Itinerary
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TripMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
