import { redirect } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import ModerateGuestbookClient from './ModerateGuestbookClient'

export const metadata = {
  title: 'Moderate Guestbook - Admin Dashboard',
}

async function checkAdminAccess() {
  const user = await getCurrentUser()
  if (!user) return null

  const { data: userData } = await (supabase
    .from('users') as any)
    .select('account_type')
    .eq('id', user.id)
    .single()

  if (!userData || userData.account_type !== 'admin') return null
  return user
}

async function getPendingGuestbookEntries() {
  const { data, error } = await supabase
    .from('guestbook_entries')
    .select(`
      *,
      listing:listings(id, name, city, state)
    `)
    .eq('moderation_status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending guestbook entries:', error)
    return []
  }

  return data
}

export default async function ModerateGuestbookPage() {
  const user = await checkAdminAccess()
  if (!user) redirect('/auth/login')

  const pendingEntries = await getPendingGuestbookEntries()

  return <ModerateGuestbookClient entries={pendingEntries} />
}
