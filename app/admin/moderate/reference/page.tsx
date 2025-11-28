import { redirect } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import ModerateReferenceClient from './ModerateReferenceClient'

export const metadata = {
  title: 'Moderate Reference Library - Admin Dashboard',
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

async function getPendingSubmissions() {
  const { data, error } = await supabase
    .from('reference_submissions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pending submissions:', error)
    return []
  }

  return data
}

async function getCategories() {
  const { data } = await supabase
    .from('reference_categories')
    .select('*')
    .order('sort_order')

  return data || []
}

export default async function ModerateReferencePage() {
  const user = await checkAdminAccess()
  if (!user) redirect('/auth/login')

  const [submissions, categories] = await Promise.all([
    getPendingSubmissions(),
    getCategories(),
  ])

  return <ModerateReferenceClient submissions={submissions} categories={categories} />
}
