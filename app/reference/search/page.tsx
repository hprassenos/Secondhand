import { Metadata } from 'next'
import ReferenceSearchClient from './ReferenceSearchClient'

export const metadata: Metadata = {
  title: 'Search Reference Library | Identify Antiques & Collectibles',
  description:
    'Search our comprehensive reference library to identify antiques, china, glass, silver, and collectibles by maker, pattern, or hallmark.',
}

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

export default async function ReferenceSearchPage({
  searchParams,
}: SearchPageProps) {
  const initialQuery = searchParams.q || ''

  return <ReferenceSearchClient initialQuery={initialQuery} />
}
