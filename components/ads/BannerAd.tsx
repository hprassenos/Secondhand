'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

interface BannerAdProps {
  position: 'top' | 'sidebar' | 'content' | 'footer'
  state?: string
  city?: string
  className?: string
}

interface BannerData {
  id: string
  title: string
  image_url: string
  link_url: string
  target_states: string[] | null
  target_cities: string[] | null
  active: boolean
  clicks: number
  impressions: number
}

/**
 * Geographic Banner Ad Component
 *
 * Shows banner ads purchased by local shops, targeted by geography
 *
 * Usage:
 * <BannerAd position="sidebar" state="CA" city="Los Angeles" />
 */
export default function BannerAd({
  position,
  state,
  city,
  className = ''
}: BannerAdProps) {
  const [ad, setAd] = useState<BannerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAd()
  }, [position, state, city])

  const loadAd = async () => {
    try {
      let query = supabase
        .from('banner_ads')
        .select('*')
        .eq('position', position)
        .eq('active', true)

      // Geographic targeting
      if (state) {
        query = query.or(`target_states.cs.{${state}},target_states.is.null`)
      }
      if (city) {
        query = query.or(`target_cities.cs.{${city}},target_cities.is.null`)
      }

      const { data, error } = await query
        .order('impressions', { ascending: true }) // Rotate based on impressions
        .limit(1)
        .single()

      if (!error && data) {
        setAd(data)

        // Track impression
        await supabase
          .from('banner_ads')
          .update({ impressions: data.impressions + 1 })
          .eq('id', data.id)
      }
    } catch (err) {
      console.error('Error loading banner ad:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = async () => {
    if (ad) {
      // Track click
      await supabase
        .from('banner_ads')
        .update({ clicks: ad.clicks + 1 })
        .eq('id', ad.id)
    }
  }

  if (loading) {
    return <AdPlaceholder position={position} className={className} />
  }

  if (!ad) {
    return null // No ad to show
  }

  const sizeClasses = {
    top: 'w-full h-24 md:h-32',
    sidebar: 'w-full h-64',
    content: 'w-full h-32 md:h-48',
    footer: 'w-full h-24',
  }

  return (
    <div className={`relative ${sizeClasses[position]} ${className}`}>
      <Link
        href={ad.link_url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className="block w-full h-full"
      >
        <div className="relative w-full h-full rounded-lg overflow-hidden border border-vintage-200 hover:border-vintage-400 transition-colors">
          <Image
            src={ad.image_url}
            alt={ad.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] px-1 py-0.5 rounded">
            Sponsored
          </div>
        </div>
      </Link>
    </div>
  )
}

function AdPlaceholder({ position, className }: { position: string, className: string }) {
  const sizeClasses = {
    top: 'h-24 md:h-32',
    sidebar: 'h-64',
    content: 'h-32 md:h-48',
    footer: 'h-24',
  }

  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${sizeClasses[position as keyof typeof sizeClasses]} ${className}`}>
      <p className="text-gray-400 text-sm">
        Banner Ad ({position})
      </p>
    </div>
  )
}
