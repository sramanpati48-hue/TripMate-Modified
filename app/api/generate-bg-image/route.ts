import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Call Gemini API with image generation prompt
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a simple abstract pattern image URL based on this description: ${prompt}. Return ONLY a valid image URL from a free stock photo service like Unsplash, Pexels, or Pixabay that matches the description. Just the URL, nothing else.`
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      // Fallback to a random abstract pattern from Unsplash
      const unsplashQueries = [
        'abstract-geometric-colorful',
        'abstract-patterns-minimal',
        'abstract-waves-flowing',
        'abstract-textures-modern',
        'abstract-shapes-gradient'
      ];
      
      const randomQuery = unsplashQueries[Math.floor(Math.random() * unsplashQueries.length)];
      const imageUrl = `https://source.unsplash.com/1920x1080/?${randomQuery}`;
      
      return NextResponse.json({ imageUrl });
    }

    const data = await response.json();
    
    // Extract image URL from response
    let imageUrl = null;
    
    if (data.contents?.[0]?.parts?.[0]?.text) {
      const text = data.contents[0].parts[0].text;
      // Try to extract URL from response
      const urlMatch = text.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        imageUrl = urlMatch[0];
      }
    }

    // Fallback if no URL found
    if (!imageUrl) {
      const unsplashQueries = [
        'abstract-geometric-colorful',
        'abstract-patterns-minimal',
        'abstract-waves-flowing',
        'abstract-textures-modern',
        'abstract-shapes-gradient'
      ];
      
      const randomQuery = unsplashQueries[Math.floor(Math.random() * unsplashQueries.length)];
      imageUrl = `https://source.unsplash.com/1920x1080/?${randomQuery}`;
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating background image:', error);
    
    // Fallback to random Unsplash abstract image
    const unsplashQueries = [
      'abstract-geometric-colorful',
      'abstract-patterns-minimal',
      'abstract-waves-flowing',
      'abstract-textures-modern',
      'abstract-shapes-gradient'
    ];
    
    const randomQuery = unsplashQueries[Math.floor(Math.random() * unsplashQueries.length)];
    const imageUrl = `https://source.unsplash.com/1920x1080/?${randomQuery}`;
    
    return NextResponse.json({ imageUrl });
  }
}
