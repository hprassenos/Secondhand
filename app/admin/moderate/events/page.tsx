import { redirect } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import ModerateEventsClient from './ModerateEventsClient'

export const metadata = {
  title: 'Moderate Sales - Admin Dashboard',
}

async function checkAdminAccess() {
  const user = await getCurrentUser()
  if (!user) return null

  const { data: userData } = await supabase
    .from('users')
    .select('account_type')
    .eq('id', user.id)
    .single()

  if (!userData || userData.account_type !== 'admin') return null
  return user
}

async function getPendingEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('moderation_status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending events:', error)
    return []
  }

  return data
}

export default async function ModerateEventsPage() {
  const user = await checkAdminAccess()
  if (!user) redirect('/auth/login')

  const pendingEvents = await getPendingEvents()

  return <ModerateEventsClient events={pendingEvents} />
}
