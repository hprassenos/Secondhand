import { redirect } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import AdminDashboard from './AdminDashboard'

export const metadata = {
  title: 'Admin Dashboard - Secondhand Empire',
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
  const [eventsResult, guestbookResult, claimsResult, referenceResult] = await Promise.all([
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
    supabase
      .from('reference_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
  ])

  // Total counts
  const [totalListings, totalUsers, totalEvents, totalMakers, totalPatterns] = await Promise.all([
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
    supabase
      .from('reference_makers')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('reference_patterns')
      .select('id', { count: 'exact', head: true }),
  ])

  return {
    pendingEvents: eventsResult.count || 0,
    pendingGuestbook: guestbookResult.count || 0,
    pendingClaims: claimsResult.count || 0,
    pendingReferenceSubmissions: referenceResult.count || 0,
    totalListings: totalListings.count || 0,
    totalUsers: totalUsers.count || 0,
    totalEvents: totalEvents.count || 0,
    totalReferenceMakers: totalMakers.count || 0,
    totalReferencePatterns: totalPatterns.count || 0,
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
