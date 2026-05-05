import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { CategoryCards } from "@/components/category-cards"
import { FeaturedPlaces } from "@/components/featured-places"
import { SeasonalBanner } from "@/components/seasonal-banner"
import { TrendingDestinationsWidget } from "@/components/trending-destinations"
import { LiveNotificationsPanel } from "@/components/live-notifications"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryCards />
        
        {/* Trending Destinations Section */}
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4">
            <TrendingDestinationsWidget />
          </div>
        </section>
        
        <FeaturedPlaces />
        <SeasonalBanner />
      </main>
      <Footer />
      
      {/* Global Live Notifications */}
      <LiveNotificationsPanel />
    </div>
  )
}
