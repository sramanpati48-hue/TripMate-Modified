import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[650px] lg:min-h-[750px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/abstract-travel-pattern-world-map-dots.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/85 to-primary/20" />
      </div>

      <div className="container relative mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-5 py-2 text-sm font-medium text-primary animate-fade-in">
            <Sparkles className="h-4 w-4" />
            Discover India's Hidden Gems
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-balance">
            Your <span className="text-primary">Smart Travel</span> Companion for India
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From the Himalayas to the backwaters, from ancient temples to vibrant beaches. 
            Explore incredible India with personalized recommendations and local insights.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <SearchBar />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/explore">
              <Button size="lg" className="gap-2 w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow">
                Explore Destinations
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/trip-planner">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto bg-background/50 backdrop-blur-sm hover:bg-background">
                Plan Your Trip
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 pt-12 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                150+
              </span>
              <span className="text-muted-foreground">Destinations</span>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                1M+
              </span>
              <span className="text-muted-foreground">Happy Travelers</span>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                4.8
              </span>
              <span className="text-muted-foreground">Average Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

