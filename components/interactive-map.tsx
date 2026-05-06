import dynamic from "next/dynamic"
import type { Destination, NearbyPlace } from "@/lib/google-maps-service"

// Dynamically import the Leaflet component with SSR disabled
const InteractiveMapClient = dynamic(
  () => import("./interactive-map-client").then(mod => ({ default: mod.InteractiveMapClient })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-300 border-t-primary animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading map...</p>
        </div>
      </div>
    )
  }
)

interface InteractiveMapProps {
  onMarkerClick?: (location: any) => void
  selectedId?: string
  searchDestination?: Destination | null
  nearbyPlaces?: NearbyPlace[]
}

export function InteractiveMap(props: InteractiveMapProps) {
  return <InteractiveMapClient {...props} />
}
