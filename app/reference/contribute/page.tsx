import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/supabase'
import ReferenceContributeClient from './ReferenceContributeClient'

export const metadata: Metadata = {
  title: 'Contribute to Reference Library | Secondhand Empire',
  description:
    'Help build our reference library by submitting information about makers, patterns, and hallmarks.',
}

export default async function ReferenceContributePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login?redirect=/reference/contribute')
  }

  // Get categories for the form
  const { data: categories } = await supabase
    .from('reference_categories')
    .select('*')
    .order('sort_order')

  return (
    <ReferenceContributeClient
      user={user}
      categories={categories || []}
    />
  )
}
