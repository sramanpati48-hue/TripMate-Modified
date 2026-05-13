export function proxiedImageUrl(src?: string | null) {
  if (!src) return '/placeholder.svg'

  if (src.startsWith('https://source.unsplash.com/') || src.startsWith('https://images.unsplash.com/')) {
    return `/api/image-proxy?url=${encodeURIComponent(src)}`
  }

  return src
}
