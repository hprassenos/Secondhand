import { supabase } from '@/lib/supabase'
import DirectoryClient from './DirectoryClient'
import type { Listing } from '@/types'

export const metadata = {
  title: 'Shop Directory - Secondhand Finds',
  description: 'Browse antique shops, thrift stores, consignment shops, and flea markets',
}

async function getListings() {
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
    .order('name')

  if (error) {
    console.error('Error fetching listings:', error)
    return []
  }

  return data as Listing[]
}

export default async function DirectoryPage() {
  const listings = await getListings()

  return <DirectoryClient initialListings={listings} />
}
