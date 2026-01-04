// Curated image mapping for consistent destination images
const destinationImageMap: { [key: string]: string[] } = {
  "taj mahal": [
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=1200&h=800&fit=crop"
  ],
  "agra": [
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=1200&h=800&fit=crop"
  ],
  "jaipur": [
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop"
  ],
  "hawa mahal": [
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop"
  ],
  "varanasi": [
    "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1580492542976-33d36efeb8c4?w=1200&h=800&fit=crop"
  ],
  "goa": [
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1587693266063-e5f0f98e4ec7?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1599852518062-e197f7623e06?w=1200&h=800&fit=crop"
  ],
  "kerala": [
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1588409992621-2f1b9ee23ef2?w=1200&h=800&fit=crop"
  ],
  "backwaters": [
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1588409992621-2f1b9ee23ef2?w=1200&h=800&fit=crop"
  ],
  "udaipur": [
    "https://images.unsplash.com/photo-1595659443118-58f985427e54?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1568277778573-db69f49d1f0e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=800&fit=crop"
  ],
  "mysore": [
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1594217389688-65c26da7f1b5?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1594217389688-65c26da7f1b5?w=1200&h=800&fit=crop"
  ],
  "hampi": [
    "https://images.unsplash.com/photo-1604868484830-df16be3e5c52?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1590757165837-39a6bd70e78e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1580499514717-2e06ca4a7502?w=1200&h=800&fit=crop"
  ],
  "leh ladakh": [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=1200&h=800&fit=crop"
  ],
  "ladakh": [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=1200&h=800&fit=crop"
  ],
  "manali": [
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&h=800&fit=crop"
  ],
  "rishikesh": [
    "https://images.unsplash.com/photo-1558430452-18c6980090c2?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1606217883254-5658f7c77bd4?w=1200&h=800&fit=crop"
  ],
  "khajuraho": [
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1633093452944-c86298e4feae?w=1200&h=800&fit=crop"
  ],
  "amritsar": [
    "https://images.unsplash.com/photo-1577610919966-d9af3d872f0d?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1598969997908-5f2a16a4081f?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&h=800&fit=crop"
  ],
  "golden temple": [
    "https://images.unsplash.com/photo-1577610919966-d9af3d872f0d?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1598969997908-5f2a16a4081f?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&h=800&fit=crop"
  ],
  "darjeeling": [
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1624020432566-f8dfbfe79f6e?w=1200&h=800&fit=crop"
  ],
  "delhi": [
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1554995347-7d6ff12ec8f7?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&h=800&fit=crop"
  ],
  "mumbai": [
    "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1595643991587-f17b6b7b2b46?w=1200&h=800&fit=crop"
  ],
  "ooty": [
    "https://images.unsplash.com/photo-1624020432566-f8dfbfe79f6e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=800&fit=crop"
  ],
  "shimla": [
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&h=800&fit=crop"
  ],
  "munnar": [
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1624020432566-f8dfbfe79f6e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=800&fit=crop"
  ],
  "coorg": [
    "https://images.unsplash.com/photo-1624020432566-f8dfbfe79f6e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&h=800&fit=crop"
  ],
  "alleppey": [
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1588409992621-2f1b9ee23ef2?w=1200&h=800&fit=crop"
  ],
  "jodhpur": [
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&h=800&fit=crop"
  ],
  "jaisalmer": [
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&h=800&fit=crop"
  ],
  "kolkata": [
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1554995347-7d6ff12ec8f7?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&h=800&fit=crop"
  ],
  "bangalore": [
    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=800&fit=crop"
  ],
  "dharamshala": [
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&h=800&fit=crop"
  ],
  "kullu": [
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop"
  ],
  "nainital": [
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1624020432566-f8dfbfe79f6e?w=1200&h=800&fit=crop"
  ],
  "mussoorie": [
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&h=800&fit=crop"
  ],
  "chennai": [
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&h=800&fit=crop"
  ],
  "hyderabad": [
    "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1633093452944-c86298e4feae?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop"
  ],
  "pune": [
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1554995347-7d6ff12ec8f7?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&h=800&fit=crop"
  ]
}

// Pexels API integration for destination images (fallback)
async function getPexelsImages(query: string, count: number = 3) {
  const API_KEY = process.env.PEXELS_API_KEY
  
  if (!API_KEY) {
    return []
  }

  try {
    // Make the query more specific for better results
    const enhancedQuery = `${query} India landmark famous tourist attraction`
    
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(enhancedQuery)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          'Authorization': API_KEY
        },
        next: { revalidate: 86400 } // Cache for 24 hours
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    
    return data.photos?.map((photo: any) => ({
      id: photo.id.toString(),
      url: photo.src.large,
      thumbnail: photo.src.small,
      full: photo.src.original,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      alt: photo.alt || query
    })) || []
  } catch (error) {
    console.error('Pexels fetch error:', error)
    return []
  }
}

export async function getDestinationImages(query: string, count: number = 3) {
  // First, check if we have curated images for this destination
  const queryLower = query.toLowerCase()
  
  // Try to match against curated destinations
  for (const [key, images] of Object.entries(destinationImageMap)) {
    if (queryLower.includes(key) || key.includes(queryLower)) {
      console.log(`Using curated images for: ${query}`)
      return images.slice(0, count).map((url, index) => ({
        id: `${key}-${index}`,
        url: url,
        thumbnail: url,
        full: url,
        photographer: 'Unsplash',
        photographerUrl: 'https://unsplash.com',
        alt: query
      }))
    }
  }
  
  // Fallback to Pexels API for destinations not in our curated list
  console.log(`Fetching from Pexels for: ${query}`)
  const pexelsImages = await getPexelsImages(query, count)
  if (pexelsImages.length > 0) {
    return pexelsImages
  }

  // Return placeholder images if everything fails
  console.log('No images found, using placeholders')
  return []
}

export async function searchImages(query: string, count: number = 10) {
  // Use Pexels for image search
  const pexelsImages = await getPexelsImages(query, count)
  return pexelsImages
}
