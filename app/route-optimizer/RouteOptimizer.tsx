'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  MapPinIcon,
  ClockIcon,
  PlusIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import type { Event, Listing } from '@/types'
import { format } from 'date-fns'

interface SelectedSale {
  id: string
  event: Event
  timeAtStop: number // minutes
}

interface CustomStop {
  name: string
  address: string
  duration: number
  type: 'bank' | 'grocery' | 'restaurant' | 'other'
}

interface NearbyShop {
  listing: Listing
  distance: number // miles from route
  detourTime: number // extra minutes
}

export default function RouteOptimizer() {
  const [availableSales, setAvailableSales] = useState<Event[]>([])
  const [selectedSales, setSelectedSales] = useState<SelectedSale[]>([])
  const [customStops, setCustomStops] = useState<CustomStop[]>([])
  const [nearbyShops, setNearbyShops] = useState<NearbyShop[]>([])
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUpcomingSales()
  }, [])

  useEffect(() => {
    if (selectedSales.length > 0) {
      findNearbyShops()
    }
  }, [selectedSales])

  const loadUpcomingSales = async () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('moderation_status', 'approved')
      .gte('end_time', today.toISOString())
      .lte('start_time', nextWeek.toISOString())
      .order('start_time')

    if (!error && data) {
      setAvailableSales(data as Event[])
    }
    setLoading(false)
  }

  const findNearbyShops = async () => {
    // This would use PostGIS to find shops along the route
    // For now, simplified version
    const { data } = await supabase
      .from('listings')
      .select('*')
      .limit(5) // Limit to 5 suggestions

    if (data) {
      // In production, calculate actual distance/detour
      const shops: NearbyShop[] = data.map((listing: any) => ({
        listing: listing as Listing,
        distance: Math.random() * 3, // Mock: 0-3 miles
        detourTime: Math.floor(Math.random() * 10) + 5 // Mock: 5-15 min
      }))

      setNearbyShops(shops)
    }
  }

  const toggleSale = (event: Event) => {
    const existing = selectedSales.find(s => s.id === event.id)

    if (existing) {
      setSelectedSales(selectedSales.filter(s => s.id !== event.id))
    } else {
      setSelectedSales([
        ...selectedSales,
        {
          id: event.id,
          event,
          timeAtStop: 20 // Default 20 minutes
        }
      ])
    }
  }

  const updateStopTime = (id: string, minutes: number) => {
    setSelectedSales(
      selectedSales.map(s =>
        s.id === id ? { ...s, timeAtStop: minutes } : s
      )
    )
  }

  const addCustomStop = () => {
    setCustomStops([
      ...customStops,
      {
        name: '',
        address: '',
        duration: 15,
        type: 'other'
      }
    ])
  }

  const optimizeRoute = () => {
    // Sort by end time (prioritize sales ending soonest)
    const sorted = [...selectedSales].sort((a, b) => {
      const endA = new Date(a.event.end_time).getTime()
      const endB = new Date(b.event.end_time).getTime()
      return endA - endB
    })

    // Calculate totals
    const totalStops = sorted.length + customStops.length
    const totalTime = sorted.reduce((sum, s) => sum + s.timeAtStop, 0) +
                     customStops.reduce((sum, s) => sum + s.duration, 0)
    const estimatedDriveTime = totalStops * 10 // Estimate 10 min between stops

    setOptimizedRoute({
      stops: sorted,
      customStops,
      totalStops,
      totalTime: totalTime + estimatedDriveTime,
      warnings: generateWarnings(sorted)
    })
  }

  const generateWarnings = (route: SelectedSale[]) => {
    const warnings: string[] = []

    // Check if any sales might be missed
    route.forEach((stop, index) => {
      const endTime = new Date(stop.event.end_time)
      const estimatedArrival = new Date()
      estimatedArrival.setMinutes(estimatedArrival.getMinutes() + (index * 30))

      if (estimatedArrival > endTime) {
        warnings.push(`⚠️ You might miss ${stop.event.title} - it ends before you'll arrive`)
      }
    })

    return warnings
  }

  if (loading) {
    return <div className="min-h-screen bg-vintage-50 flex items-center justify-center">
      <p>Loading sales...</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-vintage-900 mb-2">Route Optimizer</h1>
          <p className="text-gray-600">
            Plan your perfect treasure hunting route. We'll optimize by time and suggest shops along the way!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Available Sales */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-vintage-900 mb-4">
                Upcoming Sales ({availableSales.length})
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Select sales to add to your route
              </p>

              <div className="space-y-3">
                {availableSales.map(sale => {
                  const isSelected = selectedSales.some(s => s.id === sale.id)
                  const startDate = new Date(sale.start_time)
                  const endDate = new Date(sale.end_time)

                  return (
                    <div
                      key={sale.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-vintage-600 bg-vintage-50'
                          : 'border-gray-300 hover:border-vintage-400'
                      }`}
                      onClick={() => toggleSale(sale)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded text-vintage-600"
                            />
                            <h3 className="font-bold text-vintage-900">{sale.title}</h3>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1 ml-6">
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-2" />
                              {sale.city}, {sale.state}
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-2" />
                              {format(startDate, 'EEE h:mm a')} - {format(endDate, 'h:mm a')}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="ml-4">
                            <label className="text-xs text-gray-600">Time at stop:</label>
                            <select
                              value={selectedSales.find(s => s.id === sale.id)?.timeAtStop || 20}
                              onChange={(e) => updateStopTime(sale.id, parseInt(e.target.value))}
                              className="ml-2 px-2 py-1 border border-vintage-300 rounded text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value={5}>5 min</option>
                              <option value={10}>10 min</option>
                              <option value={15}>15 min</option>
                              <option value={20}>20 min</option>
                              <option value={30}>30 min</option>
                              <option value={45}>45 min</option>
                              <option value={60}>1 hour</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Custom Stops */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-vintage-900">
                  Custom Stops
                </h2>
                <button onClick={addCustomStop} className="btn-secondary text-sm">
                  <PlusIcon className="h-4 w-4 inline mr-1" />
                  Add Stop
                </button>
              </div>

              {customStops.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  Add stops like bank, grocery store, lunch break, etc.
                </p>
              ) : (
                <div className="space-y-3">
                  {customStops.map((stop, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-3">
                      <input
                        type="text"
                        placeholder="Stop name (e.g., Bank of America)"
                        value={stop.name}
                        onChange={(e) => {
                          const updated = [...customStops]
                          updated[index].name = e.target.value
                          setCustomStops(updated)
                        }}
                        className="input-field mb-2"
                      />
                      <select
                        value={stop.duration}
                        onChange={(e) => {
                          const updated = [...customStops]
                          updated[index].duration = parseInt(e.target.value)
                          setCustomStops(updated)
                        }}
                        className="input-field text-sm"
                      >
                        <option value={5}>5 minutes</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Route Summary & Shops */}
          <div className="space-y-6">
            {/* Route Summary */}
            <div className="card sticky top-4">
              <h2 className="text-xl font-bold text-vintage-900 mb-4">
                Your Route
              </h2>

              {selectedSales.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  Select sales from the left to build your route
                </p>
              ) : (
                <>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total stops:</span>
                      <span className="font-semibold">{selectedSales.length + customStops.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. time:</span>
                      <span className="font-semibold">
                        {Math.floor(
                          selectedSales.reduce((sum, s) => sum + s.timeAtStop, 0) / 60
                        )}h {
                          selectedSales.reduce((sum, s) => sum + s.timeAtStop, 0) % 60
                        }m
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={optimizeRoute}
                    className="btn-primary w-full"
                  >
                    Optimize Route
                  </button>

                  {optimizedRoute && optimizedRoute.warnings.length > 0 && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-yellow-900 mb-1">Warnings:</p>
                      {optimizedRoute.warnings.map((warning: string, i: number) => (
                        <p key={i} className="text-xs text-yellow-800">{warning}</p>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Nearby Shops */}
            {nearbyShops.length > 0 && selectedSales.length > 0 && (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <BuildingStorefrontIcon className="h-6 w-6 text-vintage-600" />
                  <h2 className="text-xl font-bold text-vintage-900">
                    Shops Along Your Route
                  </h2>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  These shops are near your route - consider stopping by!
                </p>

                <div className="space-y-3">
                  {nearbyShops.map(({ listing, distance, detourTime }) => (
                    <div key={listing.id} className="border border-vintage-200 rounded-lg p-3 hover:border-vintage-400 transition-colors">
                      <h3 className="font-semibold text-vintage-900 mb-1">{listing.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {listing.city}, {listing.state}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>📍 {distance.toFixed(1)} mi off route</span>
                        <span>⏱️ +{detourTime} min</span>
                      </div>
                      <a
                        href={`/directory/${listing.id}`}
                        target="_blank"
                        className="text-xs text-vintage-600 hover:text-vintage-700 mt-2 inline-block"
                      >
                        View Shop →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
