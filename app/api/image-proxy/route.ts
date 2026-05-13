import { NextRequest } from 'next/server'

const ALLOWED_HOSTS = new Set(['source.unsplash.com', 'images.unsplash.com'])

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return new Response('Missing url parameter', { status: 400 })
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return new Response('Invalid url parameter', { status: 400 })
  }

  if (!ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    return new Response('Host not allowed', { status: 400 })
  }

  try {
    const upstream = await fetch(parsedUrl.toString(), { redirect: 'follow' })
    if (!upstream.ok || !upstream.body) {
      return new Response('Failed to fetch image', { status: 502 })
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg'
    const buffer = await upstream.arrayBuffer()

    return new Response(buffer, {
      status: 200,
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    })
  } catch (error) {
    console.error('Image proxy error:', error)
    return new Response('Image proxy failed', { status: 502 })
  }
}
