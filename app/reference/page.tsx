import Link from 'next/link'
import { BookOpenIcon, MagnifyingGlassIcon, SparklesIcon, PaintBrushIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline'

export const metadata = {
  title: 'Reference Library - Secondhand Finds',
  description: 'Learn about hallmarks, makers marks, patterns, and identify your vintage treasures',
}

export default function ReferencePage() {
  const categories = [
    {
      title: 'China & Pottery Marks',
      description: 'Identify makers marks, backstamps, and date codes on ceramics and porcelain',
      icon: <SparklesIcon className="h-8 w-8" />,
      slug: 'china-pottery',
      color: 'blue',
      count: 'Coming Soon',
    },
    {
      title: 'Silver Hallmarks',
      description: 'Decode hallmarks on sterling silver, silverplate, and other precious metals',
      icon: <BuildingLibraryIcon className="h-8 w-8" />,
      slug: 'silver-hallmarks',
      color: 'purple',
      count: 'Coming Soon',
    },
    {
      title: 'Glass Patterns',
      description: 'Identify depression glass, carnival glass, and other vintage glassware patterns',
      icon: <SparklesIcon className="h-8 w-8" />,
      slug: 'glass-patterns',
      color: 'green',
      count: 'Coming Soon',
    },
    {
      title: 'Furniture Makers',
      description: 'Learn about antique furniture makers, styles, and identifying characteristics',
      icon: <PaintBrushIcon className="h-8 w-8" />,
      slug: 'furniture-makers',
      color: 'amber',
      count: 'Coming Soon',
    },
  ]

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-vintage-600 rounded-full mb-6">
            <BookOpenIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-vintage-900 mb-4">Reference Library</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive guide to identifying hallmarks, makers marks, patterns, and learning
            about your vintage treasures
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search the Reference Library
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for makers, hallmarks, patterns..."
                className="w-full pl-10 pr-4 py-3 border border-vintage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-500"
                disabled
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Search functionality coming soon! We're building our reference database.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <h2 className="text-2xl font-bold text-vintage-900 mb-6">Browse Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {categories.map((category) => (
              <div
                key={category.slug}
                className="card hover:shadow-lg transition-shadow cursor-not-allowed opacity-75"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-${category.color}-100 text-${category.color}-600`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-vintage-900">{category.title}</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-vintage-100 text-vintage-700">
                        {category.count}
                      </span>
                    </div>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gradient-to-br from-vintage-100 to-vintage-200 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-vintage-900 mb-6 text-center">
            How to Use the Reference Library
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-vintage-600 rounded-full text-white font-bold text-xl mb-4">
                1
              </div>
              <h3 className="font-bold text-vintage-900 mb-2">Browse or Search</h3>
              <p className="text-gray-700">
                Explore categories or search for specific makers, marks, or patterns
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-vintage-600 rounded-full text-white font-bold text-xl mb-4">
                2
              </div>
              <h3 className="font-bold text-vintage-900 mb-2">Compare & Identify</h3>
              <p className="text-gray-700">
                Match your item's marks or characteristics with our reference images
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-vintage-600 rounded-full text-white font-bold text-xl mb-4">
                3
              </div>
              <h3 className="font-bold text-vintage-900 mb-2">Learn & Value</h3>
              <p className="text-gray-700">
                Discover the history, age, and typical values of your treasures
              </p>
            </div>
          </div>
        </div>

        {/* Contributing Section */}
        <div className="mt-12 card bg-blue-50 border-blue-200">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-vintage-900 mb-3">
                Help Us Build the Library
              </h2>
              <p className="text-gray-700 mb-4">
                The Reference Library is under construction! We're carefully curating information
                about hallmarks, makers marks, and patterns. This takes time to ensure accuracy.
              </p>
              <p className="text-gray-700">
                Are you an expert in antiques or vintage items? We'd love your help in building
                this resource for the community.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/contact" className="btn-primary whitespace-nowrap">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Popular Resources (Placeholder) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-vintage-900 mb-6">Getting Started Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="font-bold text-vintage-900 mb-2">How to Photograph Marks</h3>
              <p className="text-sm text-gray-600 mb-3">
                Tips for capturing clear photos of hallmarks and backstamps for identification
              </p>
              <span className="text-xs text-vintage-600">Coming Soon</span>
            </div>
            <div className="card">
              <h3 className="font-bold text-vintage-900 mb-2">Dating Your Antiques</h3>
              <p className="text-sm text-gray-600 mb-3">
                Learn how to determine the age of antique and vintage items
              </p>
              <span className="text-xs text-vintage-600">Coming Soon</span>
            </div>
            <div className="card">
              <h3 className="font-bold text-vintage-900 mb-2">Spotting Reproductions</h3>
              <p className="text-sm text-gray-600 mb-3">
                Key differences between authentic antiques and modern reproductions
              </p>
              <span className="text-xs text-vintage-600">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
