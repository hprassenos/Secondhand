'use client'

import { useState, useMemo } from 'react'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import type { Listing, ListingType } from '@/types'
import Link from 'next/link'

const LISTING_TYPES: { value: ListingType; label: string }[] = [
  { value: 'antique_shop', label: 'Antique Shops' },
  { value: 'thrift_store', label: 'Thrift Stores' },
  { value: 'consignment_shop', label: 'Consignment Shops' },
  { value: 'flea_market', label: 'Flea Markets' },
  { value: 'auction_house', label: 'Auction Houses' },
  { value: 'estate_sale_company', label: 'Estate Sale Companies' },
]

interface DirectoryClientProps {
  initialListings: Listing[]
}

export default function DirectoryClient({ initialListings }: DirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<ListingType[]>([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique states and cities
  const { states, cities } = useMemo(() => {
    const statesSet = new Set(initialListings.map(l => l.state))
    const citiesSet = new Set(
      initialListings
        .filter(l => !selectedState || l.state === selectedState)
        .map(l => l.city)
    )
    return {
      states: Array.from(statesSet).sort(),
      cities: Array.from(citiesSet).sort(),
    }
  }, [initialListings, selectedState])

  // Filter listings
  const filteredListings = useMemo(() => {
    return initialListings.filter(listing => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          listing.name.toLowerCase().includes(query) ||
          listing.city.toLowerCase().includes(query) ||
          listing.description?.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(listing.type)) {
        return false
      }

      // State filter
      if (selectedState && listing.state !== selectedState) {
        return false
      }

      // City filter
      if (selectedCity && listing.city !== selectedCity) {
        return false
      }

      return true
    })
  }, [initialListings, searchQuery, selectedTypes, selectedState, selectedCity])

  const toggleType = (type: ListingType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-vintage-900 mb-2">Shop Directory</h1>
          <p className="text-gray-600">
            Discover {filteredListings.length} antique shops, thrift stores, and vintage treasures
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, city, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-vintage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-500"
            />
          </div>
        </div>

        {/* Filters Toggle (Mobile) */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary w-full flex items-center justify-center"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card sticky top-4 space-y-6">
              {/* Type Filter */}
              <div>
                <h3 className="font-bold text-vintage-900 mb-3">Shop Type</h3>
                <div className="space-y-2">
                  {LISTING_TYPES.map(({ value, label }) => (
                    <label key={value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(value)}
                        onChange={() => toggleType(value)}
                        className="rounded border-vintage-300 text-vintage-600 focus:ring-vintage-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* State Filter */}
              <div>
                <h3 className="font-bold text-vintage-900 mb-3">State</h3>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value)
                    setSelectedCity('') // Reset city when state changes
                  }}
                  className="w-full px-3 py-2 border border-vintage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-500 text-sm"
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              {selectedState && (
                <div>
                  <h3 className="font-bold text-vintage-900 mb-3">City</h3>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-vintage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-500 text-sm"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Clear Filters */}
              {(selectedTypes.length > 0 || selectedState || selectedCity || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedTypes([])
                    setSelectedState('')
                    setSelectedCity('')
                    setSearchQuery('')
                  }}
                  className="text-sm text-vintage-600 hover:text-vintage-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="flex-1">
            {filteredListings.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-600 mb-4">No listings found matching your criteria</p>
                <button
                  onClick={() => {
                    setSelectedTypes([])
                    setSelectedState('')
                    setSelectedCity('')
                    setSearchQuery('')
                  }}
                  className="btn-secondary"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ListingCard({ listing }: { listing: Listing }) {
  const typeLabels: Record<ListingType, string> = {
    antique_shop: 'Antique Shop',
    thrift_store: 'Thrift Store',
    consignment_shop: 'Consignment Shop',
    flea_market: 'Flea Market',
    auction_house: 'Auction House',
    estate_sale_company: 'Estate Sale Company',
  }

  return (
    <Link href={`/directory/${listing.id}`} className="card hover:shadow-lg transition-shadow">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-vintage-900 flex-1">{listing.name}</h3>
          {listing.verified && (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Verified
            </span>
          )}
        </div>

        <p className="text-sm text-vintage-600 mb-3">{typeLabels[listing.type]}</p>

        <div className="text-sm text-gray-600 mb-3">
          <p>{listing.address}</p>
          <p>{listing.city}, {listing.state} {listing.zip_code}</p>
        </div>

        {listing.phone && (
          <p className="text-sm text-gray-600 mb-2">
            <a href={`tel:${listing.phone}`} className="hover:text-vintage-600">
              {listing.phone}
            </a>
          </p>
        )}

        {listing.description && (
          <p className="text-sm text-gray-700 line-clamp-2 mb-3">{listing.description}</p>
        )}

        {listing.tags && listing.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-vintage-200">
            {listing.tags.slice(0, 5).map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-vintage-100 text-vintage-700"
              >
                {tag.name}
              </span>
            ))}
            {listing.tags.length > 5 && (
              <span className="inline-flex items-center px-2 py-1 text-xs text-vintage-600">
                +{listing.tags.length - 5} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
