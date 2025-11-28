'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ReferenceSearchResult, ReferenceCategory } from '@/types'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface ReferenceSearchClientProps {
  initialQuery: string
}

export default function ReferenceSearchClient({
  initialQuery,
}: ReferenceSearchClientProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<ReferenceSearchResult[]>([])
  const [categories, setCategories] = useState<ReferenceCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(!!initialQuery)

  useEffect(() => {
    loadCategories()
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [])

  const loadCategories = async () => {
    const { data } = await supabase
      .from('reference_categories')
      .select('*')
      .order('sort_order')

    if (data) {
      setCategories(data as ReferenceCategory[])
    }
  }

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    setSearched(true)

    try {
      // Use the search function from the database
      const { data, error } = await (supabase as any).rpc('search_reference_library', {
        search_query: searchQuery,
        category_filter: selectedCategory,
        limit_results: 50,
      })

      if (error) {
        console.error('Search error:', error)
        setResults([])
      } else {
        setResults((data || []) as ReferenceSearchResult[])
      }

      // Log the search
      await (supabase.from('reference_search_log') as any).insert({
        search_query: searchQuery,
        category_id: selectedCategory,
        results_count: data?.length || 0,
      })
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
    router.push(`/reference/search?q=${encodeURIComponent(query)}`, {
      scroll: false,
    })
  }

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    if (query.trim()) {
      performSearch(query)
    }
  }

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
            <span className="text-vintage-900 font-medium">Search</span>
          </nav>

          <h1 className="text-4xl font-bold text-vintage-900 mb-6">
            Search the Reference Library
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-vintage-600" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for makers, patterns, hallmarks..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-vintage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-500"
                />
              </div>
              <button type="submit" className="btn-primary px-8">
                Search
              </button>
            </div>
          </form>

          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedCategory === null
                  ? 'bg-vintage-600 text-white'
                  : 'bg-white text-vintage-700 border border-vintage-300 hover:bg-vintage-100'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-vintage-600 text-white'
                    : 'bg-white text-vintage-700 border border-vintage-300 hover:bg-vintage-100'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-vintage-300 border-t-vintage-600"></div>
            <p className="mt-4 text-vintage-700">Searching...</p>
          </div>
        ) : !searched ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-16 w-16 text-vintage-300 mx-auto mb-4" />
            <p className="text-lg text-vintage-700">
              Enter a search term to find makers, patterns, and hallmarks
            </p>
            <div className="mt-8">
              <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Depression Glass',
                  'Wedgwood',
                  'Sterling Silver',
                  'Roseville',
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term)
                      performSearch(term)
                    }}
                    className="px-3 py-1 bg-vintage-100 text-vintage-700 rounded-full text-sm hover:bg-vintage-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-vintage-700 mb-4">
              No results found for &quot;{query}&quot;
            </p>
            <p className="text-gray-600 mb-6">
              Try different keywords or browse by category
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/reference/category/${category.slug}`}
                  className="px-4 py-2 bg-white border border-vintage-300 rounded-lg hover:bg-vintage-100 transition-colors"
                >
                  {category.icon} {category.name}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-vintage-700">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for &quot;
              {query}&quot;
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => {
                const linkHref =
                  result.type === 'maker'
                    ? `/reference/maker/${result.id}` // Would need slug
                    : `/reference/pattern/${result.id}` // Would need slug

                return (
                  <div key={result.id} className="card hover:shadow-lg transition-shadow group">
                    {result.image_url && (
                      <div className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={result.image_url}
                          alt={result.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-vintage-900 group-hover:text-vintage-600 transition-colors">
                        {result.name}
                      </h3>
                      <span className="text-xs bg-vintage-100 text-vintage-700 px-2 py-1 rounded capitalize flex-shrink-0 ml-2">
                        {result.type}
                      </span>
                    </div>

                    {result.maker_name && (
                      <p className="text-sm text-vintage-600 mb-2">
                        by {result.maker_name}
                      </p>
                    )}

                    {result.category_name && (
                      <p className="text-xs text-gray-500 mb-3">
                        {result.category_name}
                      </p>
                    )}

                    {result.description && (
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {result.description}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
