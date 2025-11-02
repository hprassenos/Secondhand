import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ReferenceCategory, ReferenceMaker } from '@/types'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { data: category } = await supabase
    .from('reference_categories')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} Reference Guide | Makers & Patterns`,
    description:
      category.description ||
      `Browse ${category.name.toLowerCase()} makers, patterns, and hallmarks. Identify your collectibles with detailed photos and descriptions.`,
    openGraph: {
      title: `${category.name} Reference Guide`,
      description: category.description || '',
    },
  }
}

async function getCategory(slug: string) {
  const { data, error } = await supabase
    .from('reference_categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as ReferenceCategory
}

async function getMakersInCategory(categoryId: string) {
  const { data, error } = await supabase
    .from('reference_makers')
    .select(`
      *,
      patterns:reference_patterns(count)
    `)
    .eq('category_id', categoryId)
    .order('name')

  if (error) {
    console.error('Error fetching makers:', error)
    return []
  }

  return data as (ReferenceMaker & { patterns: { count: number }[] })[]
}

export default async function ReferenceCategoryPage({ params }: CategoryPageProps) {
  const category = await getCategory(params.slug)

  if (!category) {
    notFound()
  }

  const makers = await getMakersInCategory(category.id)

  // Group by country
  const makersByCountry: Record<string, typeof makers> = {}
  makers.forEach((maker) => {
    const country = maker.country || 'Unknown'
    if (!makersByCountry[country]) {
      makersByCountry[country] = []
    }
    makersByCountry[country].push(maker)
  })

  const countries = Object.keys(makersByCountry).sort()

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
            <span className="text-vintage-900 font-medium">{category.name}</span>
          </nav>

          <div className="flex items-start gap-4 mb-6">
            {category.icon && (
              <div className="text-5xl">{category.icon}</div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-vintage-900 mb-3">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-lg text-vintage-700 max-w-3xl">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-vintage-700">
            <span>{makers.length} Makers</span>
            <span>•</span>
            <span>{makers.reduce((sum, m) => sum + (m.patterns?.[0]?.count || 0), 0)} Patterns</span>
          </div>
        </div>
      </div>

      {/* Makers List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {makers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-vintage-700 text-lg mb-4">
              No makers in this category yet.
            </p>
            <p className="text-gray-600">
              Help us grow this category by{' '}
              <Link
                href="/reference/contribute"
                className="text-vintage-600 hover:text-vintage-800 underline"
              >
                contributing your knowledge
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            {/* Alphabetical Index */}
            <div className="mb-8 sticky top-0 bg-vintage-50 py-4 border-b border-vintage-200 z-10">
              <div className="flex flex-wrap gap-2">
                {countries.map((country) => (
                  <a
                    key={country}
                    href={`#${country.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-3 py-1 bg-white border border-vintage-300 rounded-lg text-sm text-vintage-700 hover:bg-vintage-100 transition-colors"
                  >
                    {country}
                  </a>
                ))}
              </div>
            </div>

            {/* Makers by Country */}
            {countries.map((country) => (
              <div
                key={country}
                id={country.toLowerCase().replace(/\s+/g, '-')}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-vintage-900 mb-6 pb-2 border-b-2 border-vintage-300">
                  {country}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {makersByCountry[country].map((maker) => {
                    const patternCount = maker.patterns?.[0]?.count || 0

                    return (
                      <Link
                        key={maker.id}
                        href={`/reference/maker/${maker.slug}`}
                        className="card hover:shadow-lg transition-all group"
                      >
                        {maker.logo_url && (
                          <div className="mb-4 h-24 flex items-center justify-center bg-gray-50 rounded-lg">
                            <img
                              src={maker.logo_url}
                              alt={maker.name}
                              className="max-h-20 max-w-full object-contain"
                            />
                          </div>
                        )}

                        <h3 className="font-bold text-vintage-900 mb-2 group-hover:text-vintage-600 transition-colors">
                          {maker.name}
                        </h3>

                        {maker.founding_year && (
                          <p className="text-sm text-gray-600 mb-2">
                            {maker.founding_year}
                            {maker.closing_year ? `–${maker.closing_year}` : '–Present'}
                          </p>
                        )}

                        {maker.description && (
                          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                            {maker.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-sm text-vintage-600">
                          <span>{patternCount} {patternCount === 1 ? 'Pattern' : 'Patterns'}</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Contribute CTA */}
        <div className="mt-16 bg-vintage-100 border border-vintage-300 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-vintage-900 mb-3">
            Know about a maker we're missing?
          </h2>
          <p className="text-vintage-700 mb-6 max-w-2xl mx-auto">
            Help expand our {category.name.toLowerCase()} reference library by submitting
            information about makers, patterns, or hallmarks.
          </p>
          <Link href="/reference/contribute" className="btn-primary inline-block">
            Contribute Information
          </Link>
        </div>
      </div>
    </div>
  )
}
