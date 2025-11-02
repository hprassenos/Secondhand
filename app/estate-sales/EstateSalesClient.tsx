'use client'

import { useState, useMemo } from 'react'
import { MagnifyingGlassIcon, MapPinIcon, CalendarIcon, PhotoIcon } from '@heroicons/react/24/outline'
import type { Event } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

interface EstateSalesClientProps {
  initialSales: Event[]
}

export default function EstateSalesClient({ initialSales }: EstateSalesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedWeek, setSelectedWeek] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Get unique states and weeks
  const { states, weeks } = useMemo(() => {
    const statesSet = new Set(initialSales.map(s => s.state))

    // Group by week
    const weeksMap = new Map<string, string>()
    initialSales.forEach(sale => {
      const startDate = new Date(sale.start_time)
      const weekStart = new Date(startDate)
      weekStart.setDate(startDate.getDate() - startDate.getDay()) // Start of week
      const weekKey = format(weekStart, 'yyyy-MM-dd')
      const weekLabel = format(weekStart, 'MMM d, yyyy')
      weeksMap.set(weekKey, weekLabel)
    })

    return {
      states: Array.from(statesSet).sort(),
      weeks: Array.from(weeksMap.entries()).sort((a, b) => a[0].localeCompare(b[0])),
    }
  }, [initialSales])

  // Filter sales
  const filteredSales = useMemo(() => {
    return initialSales.filter(sale => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          sale.title.toLowerCase().includes(query) ||
          sale.city.toLowerCase().includes(query) ||
          sale.description?.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // State filter
      if (selectedState && sale.state !== selectedState) {
        return false
      }

      // Week filter
      if (selectedWeek) {
        const startDate = new Date(sale.start_time)
        const weekStart = new Date(startDate)
        weekStart.setDate(startDate.getDate() - startDate.getDay())
        const weekKey = format(weekStart, 'yyyy-MM-dd')
        if (weekKey !== selectedWeek) return false
      }

      return true
    })
  }, [initialSales, searchQuery, selectedState, selectedWeek])

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-vintage-900 mb-2">Estate Sales</h1>
          <p className="text-gray-600">
            Browse {filteredSales.length} upcoming estate sales with detailed photos
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <PhotoIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Professional Estate Sales</h3>
              <p className="text-sm text-blue-800">
                Estate sales are posted by professional companies and can include extensive photo galleries.
                Sales are typically posted weeks in advance to give you time to plan.
              </p>
            </div>
          </div>
        </div>

        {/* Post Estate Sale CTA */}
        <div className="bg-vintage-600 text-white rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Estate Sale Company?</h2>
              <p className="text-vintage-100">List your estate sales and reach thousands of collectors</p>
            </div>
            <Link href="/post-sale" className="btn-secondary mt-4 sm:mt-0">
              Post an Estate Sale
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, city, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-vintage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="flex-1 px-4 py-3 border border-vintage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-500"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="flex-1 px-4 py-3 border border-vintage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-500"
            >
              <option value="">All Weeks</option>
              {weeks.map(([key, label]) => (
                <option key={key} value={key}>Week of {label}</option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-white border border-vintage-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-vintage-600 text-white'
                    : 'text-gray-600 hover:bg-vintage-50'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-vintage-600 text-white'
                    : 'text-gray-600 hover:bg-vintage-50'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Sales Display */}
        {filteredSales.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No estate sales found matching your criteria</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedState('')
                setSelectedWeek('')
              }}
              className="btn-secondary"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredSales.map(sale => (
              viewMode === 'grid' ? (
                <EstateSaleCardGrid key={sale.id} sale={sale} />
              ) : (
                <EstateSaleCardList key={sale.id} sale={sale} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EstateSaleCardGrid({ sale }: { sale: Event }) {
  const startDate = new Date(sale.start_time)
  const endDate = new Date(sale.end_time)

  return (
    <Link href={`/estate-sales/${sale.id}`} className="card hover:shadow-lg transition-shadow p-0 overflow-hidden">
      {/* Featured Image */}
      {sale.photo_urls && sale.photo_urls.length > 0 ? (
        <div className="relative aspect-[4/3] bg-vintage-100">
          <Image
            src={sale.photo_urls[0]}
            alt={sale.title}
            fill
            className="object-cover"
          />
          {sale.photo_urls.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
              <PhotoIcon className="h-3 w-3 mr-1" />
              {sale.photo_urls.length} photos
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-[4/3] bg-vintage-100 flex items-center justify-center">
          <PhotoIcon className="h-16 w-16 text-vintage-300" />
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-bold text-vintage-900 mb-2 line-clamp-2">{sale.title}</h3>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">
              {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
            </span>
          </div>

          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{sale.city}, {sale.state}</span>
          </div>
        </div>

        {sale.description && (
          <p className="text-sm text-gray-700 line-clamp-2 mb-3">{sale.description}</p>
        )}

        {sale.tags && sale.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {sale.tags.slice(0, 3).map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-vintage-100 text-vintage-700"
              >
                {tag.name}
              </span>
            ))}
            {sale.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 text-xs text-vintage-600">
                +{sale.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

function EstateSaleCardList({ sale }: { sale: Event }) {
  const startDate = new Date(sale.start_time)
  const endDate = new Date(sale.end_time)

  return (
    <Link href={`/estate-sales/${sale.id}`} className="card hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Thumbnail */}
        {sale.photo_urls && sale.photo_urls.length > 0 ? (
          <div className="relative w-full md:w-48 aspect-[4/3] md:aspect-square rounded-lg overflow-hidden flex-shrink-0 bg-vintage-100">
            <Image
              src={sale.photo_urls[0]}
              alt={sale.title}
              fill
              className="object-cover"
            />
            {sale.photo_urls.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                <PhotoIcon className="h-3 w-3 mr-1" />
                {sale.photo_urls.length}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full md:w-48 aspect-[4/3] md:aspect-square rounded-lg bg-vintage-100 flex items-center justify-center flex-shrink-0">
            <PhotoIcon className="h-12 w-12 text-vintage-300" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-vintage-900 mb-2">{sale.title}</h3>

          <div className="space-y-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>
                {format(startDate, 'EEEE, MMMM d')} - {format(endDate, 'EEEE, MMMM d, yyyy')}
              </span>
            </div>

            <div className="flex items-start">
              <MapPinIcon className="h-4 w-4 mr-2 mt-0.5" />
              <div>
                <p>{sale.address}</p>
                <p>{sale.city}, {sale.state} {sale.zip_code}</p>
              </div>
            </div>
          </div>

          {sale.description && (
            <p className="text-gray-700 mb-3 line-clamp-3">{sale.description}</p>
          )}

          {sale.tags && sale.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {sale.tags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-vintage-100 text-vintage-700"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
