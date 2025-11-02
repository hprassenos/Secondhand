import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import EstateSaleDetail from './EstateSaleDetail'
import type { Event } from '@/types'

interface PageProps {
  params: {
    id: string
  }
}

async function getEstateSale(id: string) {
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
    .eq('id', id)
    .eq('type', 'estate_sale')
    .single()

  if (error || !data) {
    return null
  }

  return data as Event
}

export async function generateMetadata({ params }: PageProps) {
  const sale = await getEstateSale(params.id)

  if (!sale) {
    return {
      title: 'Estate Sale Not Found - Secondhand Finds',
    }
  }

  return {
    title: `${sale.title} - ${sale.city}, ${sale.state} | Secondhand Finds`,
    description: sale.description || `Estate sale in ${sale.city}, ${sale.state}`,
  }
}

export default async function EstateSalePage({ params }: PageProps) {
  const sale = await getEstateSale(params.id)

  if (!sale) {
    notFound()
  }

  return <EstateSaleDetail sale={sale} />
}
