import Link from 'next/link'
import { HeartIcon, UsersIcon, MapIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export const metadata = {
  title: 'About Us - Secondhand Finds',
  description: 'Learn about Secondhand Finds and our mission to connect vintage enthusiasts with local treasures',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-vintage-900 mb-4">
            About Secondhand Finds
          </h1>
          <p className="text-xl text-gray-600">
            Connecting treasure hunters with vintage gems since 2025
          </p>
        </div>

        {/* Mission Statement */}
        <div className="card mb-12">
          <h2 className="text-3xl font-bold text-vintage-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-4">
            We believe that every vintage item has a story to tell, and every treasure hunt should be
            an adventure. Secondhand Finds exists to connect passionate collectors, casual browsers,
            and curious explorers with the antique shops, yard sales, and hidden gems in their communities.
          </p>
          <p className="text-lg text-gray-700">
            Whether you're searching for a specific piece to complete your collection, furnishing your
            home with unique character, or simply enjoying the thrill of the hunt, we're here to make
            your vintage shopping experience easier, more organized, and more rewarding.
          </p>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-vintage-900 mb-8 text-center">What We Value</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-vintage-100 rounded-lg">
                  <HeartIcon className="h-8 w-8 text-vintage-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-vintage-900 mb-2">Community First</h3>
                  <p className="text-gray-700">
                    We support local businesses and celebrate the unique character of small shops,
                    family-run estates, and neighborhood sales.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-vintage-100 rounded-lg">
                  <UsersIcon className="h-8 w-8 text-vintage-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-vintage-900 mb-2">Shared Knowledge</h3>
                  <p className="text-gray-700">
                    From identifying hallmarks to sharing finds, we're building a community where
                    collectors help collectors learn and grow.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-vintage-100 rounded-lg">
                  <MapIcon className="h-8 w-8 text-vintage-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-vintage-900 mb-2">Smart Discovery</h3>
                  <p className="text-gray-700">
                    Our tools help you plan efficient routes, find exactly what you're looking for,
                    and never miss a sale in your area.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-vintage-100 rounded-lg">
                  <ShieldCheckIcon className="h-8 w-8 text-vintage-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-vintage-900 mb-2">Trust & Safety</h3>
                  <p className="text-gray-700">
                    We verify listings, moderate content, and provide tools for shop owners to
                    maintain accurate, trustworthy information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="card mb-12">
          <h2 className="text-3xl font-bold text-vintage-900 mb-4">Our Story</h2>
          <div className="prose prose-vintage max-w-none text-gray-700">
            <p className="mb-4">
              Secondhand Finds was born from a simple frustration: weekend treasure hunting meant
              juggling multiple websites, scribbled addresses, and hoping you didn't miss that one
              estate sale with the perfect mid-century dresser.
            </p>
            <p className="mb-4">
              We realized that vintage enthusiasts needed more than just listings – they needed a
              comprehensive platform that understood the unique needs of treasure hunters. From planning
              multi-stop routes to building a reference library for identifying finds, we're creating
              the tools we wished existed.
            </p>
            <p>
              Today, we're proud to serve a growing community of collectors, decorators, resellers, and
              curious explorers. Every shop listing, every yard sale post, and every guestbook entry
              adds to a living map of vintage treasures waiting to be discovered.
            </p>
          </div>
        </div>

        {/* For Shop Owners */}
        <div className="bg-vintage-600 text-white rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4">For Shop Owners</h2>
          <p className="text-vintage-100 mb-6">
            Are you an antique dealer, estate sale company, or shop owner? Secondhand Finds helps you
            reach passionate collectors actively searching for treasures. Claim your free listing today
            and connect with your ideal customers.
          </p>
          <Link href="/claim-listing" className="btn-secondary">
            Claim Your Listing
          </Link>
        </div>

        {/* Team Section (Placeholder) */}
        <div className="card mb-12">
          <h2 className="text-3xl font-bold text-vintage-900 mb-4 text-center">Our Team</h2>
          <p className="text-center text-gray-700 mb-6">
            We're a small but dedicated team of vintage enthusiasts, developers, and community builders
            passionate about making treasure hunting accessible to everyone.
          </p>
          <p className="text-center text-gray-600 text-sm">
            Interested in joining us? <Link href="/contact" className="text-vintage-600 hover:text-vintage-700 font-medium">Get in touch</Link>
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-vintage-900 mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-600 mb-6">
            Start discovering vintage treasures in your area today
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/directory" className="btn-primary">
              Browse Shops
            </Link>
            <Link href="/yard-sales" className="btn-secondary">
              Find Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
