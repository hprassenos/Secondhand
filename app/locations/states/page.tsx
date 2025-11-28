import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { MapPinIcon } from '@heroicons/react/24/outline'

export const metadata = {
  title: 'Browse by State - Antique Shops & Vintage Stores | Secondhand Empire',
  description: 'Find antique shops, thrift stores, and vintage treasures in your state. Browse our directory of vintage stores across the United States.',
}

async function getStatesWithCounts() {
  const { data, error } = await (supabase
    .from('listings') as any)
    .select('state, city')

  if (error || !data) {
    return []
  }

  // Count listings and cities per state
  const stateCounts = data.reduce((acc: any, listing: any) => {
    if (!acc[listing.state]) {
      acc[listing.state] = { cities: new Set(), count: 0 }
    }
    acc[listing.state].cities.add(listing.city)
    acc[listing.state].count++
    return acc
  }, {})

  return Object.entries(stateCounts)
    .map(([state, data]: [string, any]) => ({
      state,
      cityCount: data.cities.size,
      listingCount: data.count,
    }))
    .sort((a, b) => a.state.localeCompare(b.state))
}

export default async function StatesPage() {
  const states = await getStatesWithCounts()

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-vintage-900 mb-4">
            Antique Shops by State
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover vintage treasures, antique shops, and thrift stores across the United States
          </p>
        </div>

        {/* States Grid */}
        {states.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {states.map(({ state, cityCount, listingCount }) => (
              <Link
                key={state}
                href={`/locations/${state.toLowerCase()}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <MapPinIcon className="h-8 w-8 text-vintage-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-vintage-900 mb-2">{state}</h2>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{listingCount} {listingCount === 1 ? 'shop' : 'shops'}</p>
                      <p>{cityCount} {cityCount === 1 ? 'city' : 'cities'}</p>
                    </div>
                  </div>
                  <div className="text-vintage-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-600">No listings available yet. Check back soon!</p>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose prose-vintage max-w-none">
          <div className="card">
            <h2 className="text-2xl font-bold text-vintage-900 mb-4">
              Find Antique Shops & Vintage Stores in Your State
            </h2>
            <p className="text-gray-700 mb-4">
              Whether you&apos;re a seasoned collector or just starting your vintage treasure hunt, our state-by-state
              directory makes it easy to find antique shops, thrift stores, consignment shops, and flea markets
              near you.
            </p>
            <p className="text-gray-700 mb-4">
              Each state page includes detailed listings with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Store hours and contact information</li>
              <li>Customer reviews and photos of finds</li>
              <li>Upcoming yard sales and estate sales</li>
              <li>Specialty tags (furniture, glassware, vintage clothing, etc.)</li>
            </ul>
            <p className="text-gray-700">
              Start exploring antique shops in your state today and discover hidden gems waiting to be found!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
