import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

export function SeasonalBanner() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-8 md:p-12">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('/abstract-travel-pattern-world-map-dots.jpg')`,
              backgroundSize: "cover",
            }}
          />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-primary-foreground">
              <div className="rounded-full bg-primary-foreground/20 p-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold">Winter Wonderland Collection</h3>
                <p className="text-primary-foreground/80">Explore magical winter destinations perfect for the season</p>
              </div>
            </div>

            <Link href="/explore?season=winter">
              <Button size="lg" variant="secondary" className="gap-2 whitespace-nowrap">
                Explore Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
