import { supabase } from '@/lib/supabase'
import EstateSalesClient from './EstateSalesClient'
import type { Event } from '@/types'
import { addWeeks, startOfDay } from 'date-fns'

export const metadata = {
  title: 'Estate Sales - Secondhand Finds',
  description: 'Browse upcoming estate sales with detailed photos and descriptions',
}

async function getUpcomingEstateSales() {
  const now = new Date()
  const nextMonth = addWeeks(now, 8) // Show estate sales up to 8 weeks out

  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_tags (
        tag_id,
        tags (
          id,
          name,
          usage_count
        )
      )
    `)
    .eq('type', 'estate_sale')
    .eq('moderation_status', 'approved')
    .gte('end_time', now.toISOString())
    .lte('start_time', nextMonth.toISOString())
    .order('start_time')

  if (error) {
    console.error('Error fetching estate sales:', error)
    return []
  }

  return data as Event[]
}

export default async function EstateSalesPage() {
  const sales = await getUpcomingEstateSales()

  return <EstateSalesClient initialSales={sales} />
}
