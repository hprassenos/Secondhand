'use client'

import { useState, useMemo } from 'react'
import { MagnifyingGlassIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline'
import type { Event } from '@/types'
import Link from 'next/link'
import { format } from 'date-fns'

interface YardSalesClientProps {
  initialSales: Event[]
}

export default function YardSalesClient({ initialSales }: YardSalesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  // Get unique states and dates
  const { states, dates } = useMemo(() => {
    const statesSet = new Set(initialSales.map(s => s.state))
    const datesSet = new Set(
      initialSales.map(s => format(new Date(s.start_time), 'yyyy-MM-dd'))
    )
    return {
      states: Array.from(statesSet).sort(),
      dates: Array.from(datesSet).sort(),
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

      // Date filter
      if (selectedDate) {
        const saleDate = format(new Date(sale.start_time), 'yyyy-MM-dd')
        if (saleDate !== selectedDate) return false
      }

      return true
    })
  }, [initialSales, searchQuery, selectedState, selectedDate])

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-vintage-900 mb-2">Yard Sales</h1>
          <p className="text-gray-600">
            Find {filteredSales.length} yard sales happening this week
          </p>
        </div>

        {/* Post Sale CTA */}
        <div className="bg-vintage-600 text-white rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Hosting a Yard Sale?</h2>
              <p className="text-vintage-100">List your sale for free and reach treasure hunters in your area</p>
            </div>
            <Link href="/post-sale" className="btn-secondary mt-4 sm:mt-0">
              Post Your Sale
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-3 border border-vintage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-500"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 border border-vintage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-500"
            >
              <option value="">All Dates</option>
              {dates.map(date => (
                <option key={date} value={date}>
                  {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sales List */}
        {filteredSales.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No yard sales found matching your criteria</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedState('')
                setSelectedDate('')
              }}
              className="btn-secondary"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSales.map(sale => (
              <SaleCard key={sale.id} sale={sale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SaleCard({ sale }: { sale: Event }) {
  const startDate = new Date(sale.start_time)
  const endDate = new Date(sale.end_time)

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-vintage-900 mb-2">{sale.title}</h3>

          <div className="space-y-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>
                {format(startDate, 'EEEE, MMMM d')} • {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
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
            <p className="text-gray-700 mb-3">{sale.description}</p>
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

        <div className="md:w-48 flex flex-col justify-between">
          <Link
            href={`/yard-sales/${sale.id}`}
            className="btn-primary text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
