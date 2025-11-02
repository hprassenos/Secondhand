import { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ReferenceCategory } from '@/types'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Reference Library | Identify Antiques, Hallmarks & Makers',
  description:
    'Comprehensive reference guide for identifying antiques, china, glass, silver, and collectibles. Browse thousands of makers, patterns, and hallmarks with photos.',
  openGraph: {
    title: 'Antique & Vintage Reference Library',
    description:
      'Identify your antiques and collectibles with our comprehensive reference library featuring makers, patterns, and hallmarks.',
  },
}

async function getCategories() {
  const { data, error } = await supabase
    .from('reference_categories')
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data as ReferenceCategory[]
}

export default async function ReferenceLibraryPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-vintage-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-vintage-100 to-vintage-50 border-b border-vintage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-vintage-900 mb-4">
            Reference Library
          </h1>
          <p className="text-xl text-vintage-700 mb-8 max-w-3xl">
            Identify your antiques, china, glass, silver, and collectibles with our
            comprehensive reference guide featuring thousands of makers, patterns, and hallmarks.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <Link
              href="/reference/search"
              className="flex items-center gap-3 bg-white border-2 border-vintage-300 rounded-lg px-4 py-3 hover:border-vintage-500 transition-colors"
            >
              <MagnifyingGlassIcon className="h-6 w-6 text-vintage-600" />
              <span className="text-vintage-600">
                Search for makers, patterns, hallmarks...
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-vintage-900 mb-6">
          Browse by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/reference/category/${category.slug}`}
              className="card hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start gap-4">
                {category.icon && (
                  <div className="text-4xl" aria-hidden="true">
                    {category.icon}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-vintage-900 mb-2 group-hover:text-vintage-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="font-bold text-vintage-900 mb-2">
              Thousands of Reference Photos
            </h3>
            <p className="text-sm text-gray-600">
              High-quality images from multiple angles help you identify your pieces.
              Perfect for Google Lens searches.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold text-vintage-900 mb-2">
              Expert Identification Tips
            </h3>
            <p className="text-sm text-gray-600">
              Learn how to spot authentic pieces, identify reproductions, and date your
              collectibles accurately.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold text-vintage-900 mb-2">
              Community Contributions
            </h3>
            <p className="text-sm text-gray-600">
              Help grow our library by submitting photos and information about your
              pieces. All submissions are reviewed by our team.
            </p>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-vintage-900 mb-4">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Depression Glass',
              'Wedgwood',
              'Waterford Crystal',
              'Sterling Silver Marks',
              'Roseville Pottery',
              'Carnival Glass',
              'Fiesta Ware',
              'Royal Doulton',
              'Pyrex Patterns',
              'Cambridge Glass',
              'Blue Willow',
              'Haviland China',
            ].map((term) => (
              <Link
                key={term}
                href={`/reference/search?q=${encodeURIComponent(term)}`}
                className="px-3 py-1 bg-vintage-100 text-vintage-700 rounded-full text-sm hover:bg-vintage-200 transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        {/* Contribute CTA */}
        <div className="mt-12 bg-vintage-100 border border-vintage-300 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-vintage-900 mb-3">
            Have something to add?
          </h2>
          <p className="text-vintage-700 mb-6 max-w-2xl mx-auto">
            Help our community by submitting photos and information about makers,
            patterns, or hallmarks you've researched.
          </p>
          <Link href="/reference/contribute" className="btn-primary inline-block">
            Contribute to the Library
          </Link>
        </div>
      </div>
    </div>
  )
}
