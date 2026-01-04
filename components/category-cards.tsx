import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, Mountain, Landmark, Trees, Waves, MountainSnow, Plane, Train, Bus, Car } from "lucide-react"
import { categories as mockCategories } from "@/lib/mock-data"

const categoryIcons: Record<string, any> = {
  church: Flame,
  mountain: Mountain,
  landmark: Landmark,
  trees: Trees,
  waves: Waves,
  "mountain-snow": MountainSnow,
}

const categoryColors = [
  "bg-primary/10 text-primary border-primary/20",
  "bg-accent/15 text-accent border-accent/20",
  "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "bg-green-500/10 text-green-600 border-green-500/20",
  "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "bg-purple-500/10 text-purple-600 border-purple-500/20",
]

export function CategoryCards() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Explore by <span className="text-primary">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover India through diverse experiences - from spiritual journeys to thrilling adventures
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {mockCategories.map((category, index) => {
            const Icon = categoryIcons[category.icon] || Mountain
            const colorClass = categoryColors[index % categoryColors.length]

            return (
              <Link 
                key={category.name} 
                href={`/explore?category=${category.name.toLowerCase()}`}
              >
                <Card className={`group h-full transition-all hover:shadow-xl hover:-translate-y-2 cursor-pointer border ${colorClass}`}>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className={`rounded-2xl p-5 transition-all group-hover:scale-110 group-hover:rotate-3 ${colorClass}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Transport Booking Highlight */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/20 overflow-hidden">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Plane className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-bold">Book Your Transport</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Compare fares for flights, trains, and buses. Book cabs for local and outstation trips. 
                    All in one place with real-time pricing.
                  </p>
                  <Link href="/transport">
                    <Button size="lg" className="gap-2">
                      <Plane className="h-5 w-5" />
                      Book Now
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Plane, label: "Flights", color: "text-blue-600" },
                    { icon: Train, label: "Trains", color: "text-green-600" },
                    { icon: Bus, label: "Buses", color: "text-orange-600" },
                    { icon: Car, label: "Cabs", color: "text-purple-600" },
                  ].map((item) => (
                    <div key={item.label} className="bg-background/80 backdrop-blur-sm rounded-lg p-4 text-center border">
                      <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                      <p className="font-semibold text-sm">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

