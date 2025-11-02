import { redirect } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import AdminDashboard from './AdminDashboard'

export const metadata = {
  title: 'Admin Dashboard - Secondhand Finds',
}

async function checkAdminAccess() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  // Check if user is admin
  const { data: userData } = await supabase
    .from('users')
    .select('account_type')
    .eq('id', user.id)
    .single()

  if (!userData || userData.account_type !== 'admin') {
    return null
  }

  return user
}

async function getDashboardStats() {
  // Pending moderation counts
  const [eventsResult, guestbookResult, claimsResult] = await Promise.all([
    supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('moderation_status', 'pending'),
    supabase
      .from('guestbook_entries')
      .select('id', { count: 'exact', head: true })
      .eq('moderation_status', 'pending'),
    supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('claimed', true)
      .eq('verified', false),
  ])

  // Total counts
  const [totalListings, totalUsers, totalEvents] = await Promise.all([
    supabase
      .from('listings')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('users')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('moderation_status', 'approved'),
  ])

  return {
    pendingEvents: eventsResult.count || 0,
    pendingGuestbook: guestbookResult.count || 0,
    pendingClaims: claimsResult.count || 0,
    totalListings: totalListings.count || 0,
    totalUsers: totalUsers.count || 0,
    totalEvents: totalEvents.count || 0,
  }
}

export default async function AdminPage() {
  const user = await checkAdminAccess()

  if (!user) {
    redirect('/auth/login')
  }

  const stats = await getDashboardStats()

  return <AdminDashboard stats={stats} />
}
