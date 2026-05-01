// Helper to build provider-specific booking URLs (Uber, Ola, Rapido, Google Maps fallback)
export function buildProviderUrl(
  mode: string,
  pickupCoords: { lat: number; lng: number } | null,
  dropCoords: { lat: number; lng: number } | null,
  pickupName?: string,
  dropName?: string
): string {
  const pname = pickupName || 'Pickup'
  const dname = dropName || 'Dropoff'

  // Uber deep link (mobile / web)
  if (mode.startsWith('uber')) {
    if (pickupCoords) {
      const params = new URLSearchParams()
      params.set('action', 'setPickup')
      params.set('pickup[latitude]', String(pickupCoords.lat))
      params.set('pickup[longitude]', String(pickupCoords.lng))
      params.set('pickup[nickname]', pname)
      if (dropCoords) {
        params.set('dropoff[latitude]', String(dropCoords.lat))
        params.set('dropoff[longitude]', String(dropCoords.lng))
        params.set('dropoff[nickname]', dname)
      } else {
        params.set('dropoff[formatted_address]', dname)
      }
      return `https://m.uber.com/ul/?${params.toString()}`
    }
    // fallback to google directions by name
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pname)}&destination=${encodeURIComponent(dname)}&travelmode=driving`
  }

  // Ola booking web link (best-effort)
  if (mode.startsWith('ola')) {
    if (pickupCoords && dropCoords) {
      return `https://book.olacabs.com/?pickup_lat=${pickupCoords.lat}&pickup_lng=${pickupCoords.lng}&drop_lat=${dropCoords.lat}&drop_lng=${dropCoords.lng}`
    }
    if (pickupCoords) {
      return `https://book.olacabs.com/?pickup_lat=${pickupCoords.lat}&pickup_lng=${pickupCoords.lng}&dropoff_formatted_address=${encodeURIComponent(dname)}`
    }
    // fall back to Ola home with prefilled addresses if possible
    return `https://book.olacabs.com/?pickup_formatted_address=${encodeURIComponent(pname)}&dropoff_formatted_address=${encodeURIComponent(dname)}`
  }

  // Rapido / bike apps - generic link to site (no stable deeplink public)
  if (mode === 'app-bike') {
    return 'https://www.rapido.bike/'
  }

  // For local taxi/auto/rental, open Google Maps directions with coords when available
  if (pickupCoords && dropCoords) {
    return `https://www.google.com/maps/dir/?api=1&origin=${pickupCoords.lat},${pickupCoords.lng}&destination=${dropCoords.lat},${dropCoords.lng}&travelmode=driving`
  }

  // Fallback: google maps directions by name
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pname)}&destination=${encodeURIComponent(dname)}&travelmode=driving`
}

export default buildProviderUrl
