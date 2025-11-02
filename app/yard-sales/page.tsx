import { supabase } from '@/lib/supabase'
import YardSalesClient from './YardSalesClient'
import type { Event } from '@/types'
import { addDays, startOfDay, endOfDay } from 'date-fns'

export const metadata = {
  title: 'Yard Sales - Secondhand Finds',
  description: 'Find yard sales and garage sales happening near you this weekend',
}

async function getUpcomingSales() {
  const now = new Date()
  const nextWeek = addDays(now, 7)

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
    .eq('type', 'yard_sale')
    .eq('moderation_status', 'approved')
    .gte('end_time', now.toISOString())
    .lte('start_time', nextWeek.toISOString())
    .order('start_time')

  if (error) {
    console.error('Error fetching yard sales:', error)
    return []
  }

  return data as Event[]
}

export default async function YardSalesPage() {
  const sales = await getUpcomingSales()

  return <YardSalesClient initialSales={sales} />
}
