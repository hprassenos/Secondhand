import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Listing, ListingType } from '@/types'

interface PageProps {
  params: {
    state: string
    city: string
  }
}

const TYPE_LABELS: Record<ListingType, string> = {
  antique_shop: 'Antique Shop',
  thrift_store: 'Thrift Store',
  consignment_shop: 'Consignment Shop',
  flea_market: 'Flea Market',
  auction_house: 'Auction House',
  estate_sale_company: 'Estate Sale Company',
}

async function getListingsInCity(state: string, city: string) {
  const cityFormatted = city.replace(/-/g, ' ')

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_tags (
        tag_id,
        tags (
          id,
          name,
          usage_count
        )
      )
    `)
    .ilike('state', state)
    .ilike('city', cityFormatted)
    .order('name')

  if (error || !data) {
    return null
  }

  return data as Listing[]
}

export async function generateMetadata({ params }: PageProps) {
  const state = params.state.toUpperCase()
  const city = params.city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return {
    title: `Antique Shops in ${city}, ${state} - Vintage Stores & Collectibles | Secondhand Empire`,
    description: `Find the best antique shops, vintage stores, and collectibles in ${city}, ${state}. Browse our curated directory of local vintage treasures.`,
  }
}

export default async function CityPage({ params }: PageProps) {
  const stateUpper = params.state.toUpperCase()
  const cityFormatted = params.city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const listings = await getListingsInCity(params.state, params.city)

  if (!listings || listings.length === 0) {
    notFound()
  }

  // Group by type
  const byType = listings.reduce((acc: any, listing) => {
    if (!acc[listing.type]) {
      acc[listing.type] = []
    }
    acc[listing.type].push(listing)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/locations/states" className="hover:text-vintage-600">All States</Link>
          <span className="mx-2">/</span>
          <Link href={`/locations/${params.state}`} className="hover:text-vintage-600">{stateUpper}</Link>
          <span className="mx-2">/</span>
          <span className="text-vintage-900 font-medium">{cityFormatted}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-vintage-900 mb-4">
            Antique Shops in {cityFormatted}, {stateUpper}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {listings.length} vintage {listings.length === 1 ? 'shop' : 'shops'} and collectible dealers
          </p>
          <div className="flex gap-3">
            <Link href={`/directory?state=${stateUpper}&city=${cityFormatted}`} className="btn-primary">
              View on Map
            </Link>
            <Link href={`/yard-sales?state=${stateUpper}&city=${cityFormatted}`} className="btn-secondary">
              Upcoming Sales
            </Link>
          </div>
        </div>

        {/* Listings by Type */}
        <div className="space-y-12">
          {Object.entries(byType).map(([type, typeListings]: [string, any]) => (
            <div key={type}>
              <h2 className="text-2xl font-bold text-vintage-900 mb-6">
                {TYPE_LABELS[type as ListingType]}s ({typeListings.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {typeListings.map((listing: Listing) => (
                  <Link
                    key={listing.id}
                    href={`/directory/${listing.id}`}
                    className="card hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-vintage-900 flex-1">{listing.name}</h3>
                      {listing.verified && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      <p>{listing.address}</p>
                      {listing.phone && <p>{listing.phone}</p>}
                    </div>

                    {listing.description && (
                      <p className="text-sm text-gray-700 line-clamp-2 mb-3">{listing.description}</p>
                    )}

                    {listing.tags && listing.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {listing.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-vintage-100 text-vintage-700"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SEO Content */}
        <div className="mt-16">
          <div className="card prose prose-vintage max-w-none">
            <h2 className="text-2xl font-bold text-vintage-900 mb-4">
              Guide to Antiquing in {cityFormatted}, {stateUpper}
            </h2>
            <p className="text-gray-700 mb-4">
              {cityFormatted} is a treasure hunter&apos;s paradise with {listings.length} unique vintage shops and antique dealers.
              From elegant antique furniture to vintage clothing, rare collectibles to mid-century modern decor,
              you&apos;ll find something special at every stop.
            </p>

            <h3 className="text-xl font-bold text-vintage-900 mb-3 mt-6">
              What You&apos;ll Find in {cityFormatted}
            </h3>
            <p className="text-gray-700 mb-4">
              Our {cityFormatted} shops specialize in:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
              <li>Antique furniture and home decor</li>
              <li>Vintage clothing and accessories</li>
              <li>Collectible glassware and pottery</li>
              <li>Estate jewelry and silverware</li>
              <li>Rare books and ephemera</li>
              <li>Mid-century modern pieces</li>
            </ul>

            <h3 className="text-xl font-bold text-vintage-900 mb-3 mt-6">
              Plan Your Visit
            </h3>
            <p className="text-gray-700">
              Most antique shops in {cityFormatted} are open weekends and by appointment. Check individual
              shop hours before visiting. Many dealers also participate in estate sales and special events
              throughout the year. Don&apos;t forget to check our <Link href="/yard-sales" className="text-vintage-600 hover:text-vintage-700">yard sales</Link> and <Link href="/estate-sales" className="text-vintage-600 hover:text-vintage-700">estate sales</Link> sections
              for upcoming opportunities to find treasures in {cityFormatted}!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
