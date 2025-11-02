import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ReferenceMaker, ReferencePattern, ReferenceHallmark } from '@/types'
import { GlobeAltIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface MakerPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: MakerPageProps): Promise<Metadata> {
  const { data: maker } = await supabase
    .from('reference_makers')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!maker) {
    return {
      title: 'Maker Not Found',
    }
  }

  return {
    title:
      maker.meta_title ||
      `${maker.name} - Patterns, Hallmarks & Identification Guide`,
    description:
      maker.meta_description ||
      maker.description ||
      `Complete reference guide for ${maker.name} including patterns, hallmarks, and identification tips for collectors and antique enthusiasts.`,
    openGraph: {
      title: `${maker.name} Reference Guide`,
      description: maker.description || '',
      images: maker.logo_url ? [maker.logo_url] : [],
    },
  }
}

async function getMaker(slug: string) {
  const { data, error } = await supabase
    .from('reference_makers')
    .select(`
      *,
      category:reference_categories(*)
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as ReferenceMaker
}

async function getPatternsForMaker(makerId: string) {
  const { data, error } = await supabase
    .from('reference_patterns')
    .select(`
      *,
      images:reference_images(*)
    `)
    .eq('maker_id', makerId)
    .order('name')

  if (error) {
    console.error('Error fetching patterns:', error)
    return []
  }

  return data as ReferencePattern[]
}

async function getHallmarksForMaker(makerId: string) {
  const { data, error } = await supabase
    .from('reference_hallmarks')
    .select('*')
    .eq('maker_id', makerId)
    .order('date_range_start')

  if (error) {
    console.error('Error fetching hallmarks:', error)
    return []
  }

  return data as ReferenceHallmark[]
}

export default async function MakerPage({ params }: MakerPageProps) {
  const maker = await getMaker(params.slug)

  if (!maker) {
    notFound()
  }

  const patterns = await getPatternsForMaker(maker.id)
  const hallmarks = await getHallmarksForMaker(maker.id)

  return (
    <div className="min-h-screen bg-vintage-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-vintage-100 to-vintage-50 border-b border-vintage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-sm text-vintage-600 mb-4">
            <Link href="/reference" className="hover:text-vintage-800">
              Reference Library
            </Link>
            {' / '}
            {maker.category && (
              <>
                <Link
                  href={`/reference/category/${maker.category.slug}`}
                  className="hover:text-vintage-800"
                >
                  {maker.category.name}
                </Link>
                {' / '}
              </>
            )}
            <span className="text-vintage-900 font-medium">{maker.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Logo */}
            {maker.logo_url && (
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-white rounded-lg p-4 flex items-center justify-center border-2 border-vintage-200">
                  <img
                    src={maker.logo_url}
                    alt={maker.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-vintage-900 mb-4">
                {maker.name}
              </h1>

              {maker.description && (
                <p className="text-lg text-vintage-700 mb-6">{maker.description}</p>
              )}

              <div className="flex flex-wrap gap-6 text-sm">
                {maker.founding_year && (
                  <div className="flex items-center gap-2 text-vintage-700">
                    <CalendarIcon className="h-5 w-5" />
                    <span>
                      {maker.founding_year}
                      {maker.closing_year ? `–${maker.closing_year}` : '–Present'}
                    </span>
                  </div>
                )}

                {maker.country && (
                  <div className="flex items-center gap-2 text-vintage-700">
                    <GlobeAltIcon className="h-5 w-5" />
                    <span>{maker.country}</span>
                  </div>
                )}

                {maker.website_url && (
                  <a
                    href={maker.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-vintage-600 hover:text-vintage-800 underline"
                  >
                    Official Website →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* History Section */}
        {maker.history && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-vintage-900 mb-4">History</h2>
            <div className="card">
              <div className="prose prose-vintage max-w-none">
                {maker.history.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-700 mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hallmarks Section */}
        {hallmarks.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-vintage-900 mb-4">
              Hallmarks & Marks
            </h2>
            <p className="text-gray-600 mb-6">
              These marks help identify and date {maker.name} pieces. Click to enlarge.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {hallmarks.map((hallmark) => (
                <div key={hallmark.id} className="card group">
                  <div className="aspect-square bg-white rounded-lg mb-3 p-2 flex items-center justify-center border border-vintage-200">
                    <img
                      src={hallmark.image_url}
                      alt={hallmark.description}
                      className="max-w-full max-h-full object-contain cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    {hallmark.description}
                  </p>
                  {hallmark.date_range_start && (
                    <p className="text-xs text-vintage-600">
                      {hallmark.date_range_start}
                      {hallmark.date_range_end
                        ? `–${hallmark.date_range_end}`
                        : '+'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patterns Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-vintage-900 mb-4">
            Patterns & Styles ({patterns.length})
          </h2>

          {patterns.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-vintage-700 mb-4">
                No patterns documented yet for this maker.
              </p>
              <Link
                href="/reference/contribute"
                className="text-vintage-600 hover:text-vintage-800 underline"
              >
                Be the first to contribute →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {patterns.map((pattern) => {
                const primaryImage = pattern.images?.find((img) => img.is_primary)
                const firstImage = pattern.images?.[0]

                return (
                  <Link
                    key={pattern.id}
                    href={`/reference/pattern/${pattern.slug}`}
                    className="card hover:shadow-lg transition-all group"
                  >
                    {(primaryImage || firstImage) && (
                      <div className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={
                            (primaryImage || firstImage)!.image_url
                          }
                          alt={(primaryImage || firstImage)!.alt_text}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}

                    <h3 className="font-bold text-vintage-900 mb-2 group-hover:text-vintage-600 transition-colors">
                      {pattern.name}
                    </h3>

                    {pattern.year_introduced && (
                      <p className="text-sm text-gray-600 mb-2">
                        {pattern.year_introduced}
                        {pattern.year_discontinued
                          ? `–${pattern.year_discontinued}`
                          : ''}
                      </p>
                    )}

                    {pattern.description && (
                      <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                        {pattern.description}
                      </p>
                    )}

                    {pattern.rarity && (
                      <span className="inline-block px-2 py-1 bg-vintage-100 text-vintage-700 rounded text-xs capitalize">
                        {pattern.rarity.replace('_', ' ')}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Contribute CTA */}
        <div className="bg-vintage-100 border border-vintage-300 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-vintage-900 mb-3">
            Have photos or information about {maker.name}?
          </h2>
          <p className="text-vintage-700 mb-6 max-w-2xl mx-auto">
            Help fellow collectors by adding patterns, hallmarks, or identification tips.
          </p>
          <Link href="/reference/contribute" className="btn-primary inline-block">
            Contribute Information
          </Link>
        </div>
      </div>
    </div>
  )
}
