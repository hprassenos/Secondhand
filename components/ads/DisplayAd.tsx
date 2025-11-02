'use client'

import { useEffect, useRef } from 'react'

interface DisplayAdProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  responsive?: boolean
  className?: string
}

/**
 * Google AdSense Display Ad Component
 *
 * Usage:
 * <DisplayAd slot="1234567890" format="auto" />
 *
 * Get your ad slots from Google AdSense dashboard
 */
export default function DisplayAd({
  slot,
  format = 'auto',
  responsive = true,
  className = ''
}: DisplayAdProps) {
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    // Only load ads in production
    if (process.env.NODE_ENV === 'production') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error('AdSense error:', err)
      }
    }
  }, [])

  // Don't show ads in development
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 ${className}`}>
        <p className="text-center text-gray-500 text-sm">
          📢 Ad Placement<br/>
          <span className="text-xs">Slot: {slot}</span>
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
