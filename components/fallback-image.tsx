"use client"

import { useState } from 'react'

type FallbackImageProps = {
  src: string
  fallbackSrc: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'eager' | 'lazy'
}

export default function FallbackImage({ src, fallbackSrc, alt, className, width, height, loading = 'lazy' }: FallbackImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc)
        }
      }}
    />
  )
}
