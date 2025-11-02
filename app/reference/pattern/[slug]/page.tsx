import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ReferencePattern, ReferenceImage } from '@/types'
import PatternDetailClient from './PatternDetailClient'

interface PatternPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: PatternPageProps): Promise<Metadata> {
  // Pattern slugs are maker-slug + pattern-slug
  const parts = params.slug.split('--')
  const makerSlug = parts[0]
  const patternSlug = parts[1]

  const { data: pattern } = await supabase
    .from('reference_patterns')
    .select(`
      *,
      maker:reference_makers(*),
      images:reference_images(*)
    `)
    .eq('slug', patternSlug)
    .single()

  if (!pattern || !pattern.maker || pattern.maker.slug !== makerSlug) {
    return {
      title: 'Pattern Not Found',
    }
  }

  const primaryImage = pattern.images?.find((img: any) => img.is_primary)
  const firstImage = pattern.images?.[0]

  return {
    title:
      pattern.meta_title ||
      `${pattern.name} by ${pattern.maker.name} - Pattern Identification Guide`,
    description:
      pattern.meta_description ||
      pattern.description ||
      `Identify ${pattern.name} by ${pattern.maker.name}. View reference photos, learn identification tips, and discover typical values for collectors.`,
    openGraph: {
      title: `${pattern.name} by ${pattern.maker.name}`,
      description: pattern.description || '',
      images: (primaryImage || firstImage)
        ? [(primaryImage || firstImage).image_url]
        : [],
    },
  }
}

async function getPattern(slug: string) {
  // Pattern slugs are maker-slug + pattern-slug (e.g., "wedgwood--blue-willow")
  const parts = slug.split('--')
  const makerSlug = parts[0]
  const patternSlug = parts[1]

  if (!makerSlug || !patternSlug) return null

  const { data: maker } = await supabase
    .from('reference_makers')
    .select('id, slug')
    .eq('slug', makerSlug)
    .single()

  if (!maker) return null

  const { data, error } = await supabase
    .from('reference_patterns')
    .select(`
      *,
      maker:reference_makers(*),
      images:reference_images(*)
    `)
    .eq('slug', patternSlug)
    .eq('maker_id', maker.id)
    .single()

  if (error || !data) return null
  return data as ReferencePattern
}

export default async function PatternPage({ params }: PatternPageProps) {
  const pattern = await getPattern(params.slug)

  if (!pattern || !pattern.maker) {
    notFound()
  }

  // Sort images: primary first, then by sort_order
  const sortedImages = (pattern.images || []).sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (!a.is_primary && b.is_primary) return 1
    return a.sort_order - b.sort_order
  })

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
            {pattern.maker.category && (
              <>
                <Link
                  href={`/reference/category/${pattern.maker.category.slug}`}
                  className="hover:text-vintage-800"
                >
                  {pattern.maker.category.name}
                </Link>
                {' / '}
              </>
            )}
            <Link
              href={`/reference/maker/${pattern.maker.slug}`}
              className="hover:text-vintage-800"
            >
              {pattern.maker.name}
            </Link>
            {' / '}
            <span className="text-vintage-900 font-medium">{pattern.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-4xl font-bold text-vintage-900 mb-2">
                {pattern.name}
              </h1>
              <p className="text-xl text-vintage-700">
                by{' '}
                <Link
                  href={`/reference/maker/${pattern.maker.slug}`}
                  className="hover:underline"
                >
                  {pattern.maker.name}
                </Link>
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex flex-col gap-2 text-sm">
              {pattern.year_introduced && (
                <div className="bg-white px-4 py-2 rounded-lg border border-vintage-200">
                  <span className="text-gray-600">Introduced: </span>
                  <span className="font-semibold text-vintage-900">
                    {pattern.year_introduced}
                    {pattern.year_discontinued && ` – ${pattern.year_discontinued}`}
                  </span>
                </div>
              )}

              {pattern.rarity && (
                <div className="bg-white px-4 py-2 rounded-lg border border-vintage-200">
                  <span className="text-gray-600">Rarity: </span>
                  <span className="font-semibold text-vintage-900 capitalize">
                    {pattern.rarity.replace('_', ' ')}
                  </span>
                </div>
              )}

              {pattern.estimated_value_min && pattern.estimated_value_max && (
                <div className="bg-white px-4 py-2 rounded-lg border border-vintage-200">
                  <span className="text-gray-600">Est. Value: </span>
                  <span className="font-semibold text-vintage-900">
                    ${pattern.estimated_value_min}–${pattern.estimated_value_max}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Image Gallery - Takes 2 columns */}
          <div className="lg:col-span-2">
            {sortedImages.length > 0 ? (
              <PatternDetailClient images={sortedImages} patternName={pattern.name} />
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No reference images yet</p>
              </div>
            )}
          </div>

          {/* Info Sidebar - Takes 1 column */}
          <div className="space-y-6">
            {/* Description */}
            {pattern.description && (
              <div className="card">
                <h2 className="font-bold text-vintage-900 mb-3">Description</h2>
                <div className="text-gray-700 space-y-2">
                  {pattern.description.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Materials & Colors */}
            {(pattern.materials?.length || pattern.colors?.length) && (
              <div className="card">
                <h2 className="font-bold text-vintage-900 mb-3">Details</h2>
                {pattern.materials && pattern.materials.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Materials
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {pattern.materials.map((material) => (
                        <span
                          key={material}
                          className="px-2 py-1 bg-vintage-100 text-vintage-700 rounded text-sm capitalize"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {pattern.colors && pattern.colors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Primary Colors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {pattern.colors.map((color) => (
                        <span
                          key={color}
                          className="px-2 py-1 bg-vintage-100 text-vintage-700 rounded text-sm capitalize"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Identification Tips */}
            {pattern.identification_tips && (
              <div className="card bg-blue-50 border-blue-200">
                <h2 className="font-bold text-vintage-900 mb-3">
                  Identification Tips
                </h2>
                <div className="text-gray-700 text-sm space-y-2">
                  {pattern.identification_tips.split('\n\n').map((tip, i) => (
                    <p key={i}>{tip}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Value Notes */}
            {pattern.value_notes && (
              <div className="card">
                <h2 className="font-bold text-vintage-900 mb-3">Value Notes</h2>
                <p className="text-gray-700 text-sm">{pattern.value_notes}</p>
              </div>
            )}

            {/* Style Period */}
            {pattern.style_period && (
              <div className="card">
                <h2 className="font-bold text-vintage-900 mb-3">Style Period</h2>
                <p className="text-vintage-700 font-medium">{pattern.style_period}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contribute CTA */}
        <div className="mt-12 bg-vintage-100 border border-vintage-300 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-vintage-900 mb-3">
            Have photos of {pattern.name}?
          </h2>
          <p className="text-vintage-700 mb-6 max-w-2xl mx-auto">
            Help collectors identify their pieces by adding more reference photos from
            different angles or showing different items in this pattern.
          </p>
          <Link href="/reference/contribute" className="btn-primary inline-block">
            Add Photos
          </Link>
        </div>
      </div>
    </div>
  )
}
