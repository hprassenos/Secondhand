import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPinIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'
import type { Listing } from '@/types'

interface PageProps {
  params: {
    state: string
  }
}

async function getCitiesInState(state: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('city, id, name, type')
    .ilike('state', state)

  if (error || !data) {
    return null
  }

  // Group by city
  const cityCounts = data.reduce((acc: any, listing) => {
    if (!acc[listing.city]) {
      acc[listing.city] = []
    }
    acc[listing.city].push(listing)
    return acc
  }, {})

  return Object.entries(cityCounts)
    .map(([city, listings]: [string, any]) => ({
      city,
      listingCount: listings.length,
      listings: listings.slice(0, 3), // Preview listings
    }))
    .sort((a, b) => b.listingCount - a.listingCount)
}

export async function generateMetadata({ params }: PageProps) {
  const state = params.state.toUpperCase()

  return {
    title: `Antique Shops in ${state} - Vintage Stores & Thrift Shops | Secondhand Finds`,
    description: `Find the best antique shops, vintage stores, and thrift shops in ${state}. Browse our directory of curated vintage treasures and collectibles.`,
  }
}

export default async function StatePage({ params }: PageProps) {
  const stateUpper = params.state.toUpperCase()
  const cities = await getCitiesInState(params.state)

  if (!cities || cities.length === 0) {
    notFound()
  }

  const totalListings = cities.reduce((sum, city) => sum + city.listingCount, 0)

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/locations/states" className="hover:text-vintage-600">All States</Link>
          <span className="mx-2">/</span>
          <span className="text-vintage-900 font-medium">{stateUpper}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-vintage-900 mb-4">
            Antique Shops in {stateUpper}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Explore {totalListings} vintage {totalListings === 1 ? 'shop' : 'shops'} across {cities.length} {cities.length === 1 ? 'city' : 'cities'}
          </p>
          <Link href={`/directory?state=${stateUpper}`} className="btn-primary">
            View All {stateUpper} Shops
          </Link>
        </div>

        {/* Cities Grid */}
        <div>
          <h2 className="text-2xl font-bold text-vintage-900 mb-6">Browse by City</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map(({ city, listingCount, listings }) => (
              <div key={city} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-vintage-900">{city}</h3>
                    <p className="text-sm text-gray-600">
                      {listingCount} {listingCount === 1 ? 'shop' : 'shops'}
                    </p>
                  </div>
                  <MapPinIcon className="h-6 w-6 text-vintage-600" />
                </div>

                {/* Preview Listings */}
                <div className="space-y-2 mb-4">
                  {listings.map((listing: any) => (
                    <Link
                      key={listing.id}
                      href={`/directory/${listing.id}`}
                      className="block text-sm text-gray-700 hover:text-vintage-600 truncate"
                    >
                      • {listing.name}
                    </Link>
                  ))}
                  {listingCount > 3 && (
                    <p className="text-sm text-vintage-600">
                      +{listingCount - 3} more
                    </p>
                  )}
                </div>

                <Link
                  href={`/locations/${params.state}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-vintage-600 hover:text-vintage-700 font-medium"
                >
                  View all in {city} →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-16">
          <div className="card prose prose-vintage max-w-none">
            <h2 className="text-2xl font-bold text-vintage-900 mb-4">
              Discover Vintage Treasures in {stateUpper}
            </h2>
            <p className="text-gray-700 mb-4">
              {stateUpper} is home to some of the finest antique shops, vintage stores, and collectible dealers in the country.
              Whether you're hunting for mid-century modern furniture, vintage clothing, antique glassware, or rare collectibles,
              you'll find curated selections at shops throughout the state.
            </p>
            <h3 className="text-xl font-bold text-vintage-900 mb-3 mt-6">
              Popular Cities for Antiquing in {stateUpper}
            </h3>
            <p className="text-gray-700 mb-4">
              The most popular cities for antique shopping in {stateUpper} include:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
              {cities.slice(0, 10).map(({ city }) => (
                <li key={city}>
                  <Link
                    href={`/locations/${params.state}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-vintage-600 hover:text-vintage-700"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-gray-700">
              Each city offers its own unique shopping experience, from historic downtown antique districts to
              sprawling flea markets and everything in between. Start exploring today!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
