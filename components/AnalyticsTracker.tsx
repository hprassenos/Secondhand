'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface AnalyticsTrackerProps {
  listingId?: string
  eventId?: string
  type: 'view' | 'click' | 'route_add'
}

/**
 * Analytics Tracker Component
 *
 * Tracks user interactions with listings and events
 * Server-side aggregation prevents duplicate counting
 *
 * Usage:
 * <AnalyticsTracker listingId="123" type="view" />
 */
export default function AnalyticsTracker({
  listingId,
  eventId,
  type
}: AnalyticsTrackerProps) {
  useEffect(() => {
    trackEvent()
  }, [listingId, eventId, type])

  const trackEvent = async () => {
    try {
      // Get session ID (for unique visitor counting)
      let sessionId = sessionStorage.getItem('visitor_id')
      if (!sessionId) {
        sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem('visitor_id', sessionId)
      }

      // Get location info (optional)
      const state = sessionStorage.getItem('user_state') || null
      const city = sessionStorage.getItem('user_city') || null
      const referrer = document.referrer ? new URL(document.referrer).hostname : 'direct'

      if (listingId && type === 'view') {
        // Track listing view
        await (supabase as any).rpc('track_listing_view', {
          p_listing_id: listingId,
          p_visitor_id: sessionId,
          p_state: state,
          p_city: city,
          p_referrer: referrer
        })
      } else if (listingId && type === 'click') {
        // Track click-through (website/phone)
        await (supabase
          .from('listing_analytics') as any)
          .update({
            click_throughs: (supabase as any).raw('click_throughs + 1')
          })
          .eq('listing_id', listingId)
          .eq('date', new Date().toISOString().split('T')[0])
      } else if (eventId && type === 'route_add') {
        // Track route addition
        await (supabase
          .from('event_analytics') as any)
          .update({
            route_adds: (supabase as any).raw('route_adds + 1')
          })
          .eq('event_id', eventId)
          .eq('date', new Date().toISOString().split('T')[0])
      }
    } catch (err) {
      // Silently fail - don't break the page if analytics fail
      console.debug('Analytics tracking error:', err)
    }
  }

  return null // This component renders nothing
}
