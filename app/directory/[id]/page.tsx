import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ShopDetail from './ShopDetail'
import type { Listing, GuestbookEntry } from '@/types'

interface PageProps {
  params: {
    id: string
  }
}

async function getListing(id: string) {
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
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data as Listing
}

async function getGuestbookEntries(listingId: string) {
  const { data, error } = await supabase
    .from('guestbook_entries')
    .select('*')
    .eq('listing_id', listingId)
    .eq('moderation_status', 'approved')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching guestbook:', error)
    return []
  }

  return data as GuestbookEntry[]
}

export async function generateMetadata({ params }: PageProps) {
  const listing = await getListing(params.id)

  if (!listing) {
    return {
      title: 'Shop Not Found - Secondhand Finds',
    }
  }

  return {
    title: `${listing.name} - ${listing.city}, ${listing.state} | Secondhand Finds`,
    description: listing.description || `Visit ${listing.name}, a vintage and antique shop in ${listing.city}, ${listing.state}`,
  }
}

export default async function ShopPage({ params }: PageProps) {
  const listing = await getListing(params.id)

  if (!listing) {
    notFound()
  }

  const guestbookEntries = await getGuestbookEntries(params.id)

  return <ShopDetail listing={listing} guestbookEntries={guestbookEntries} />
}
