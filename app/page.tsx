import Link from 'next/link'
import Image from 'next/image'
import { MapPinIcon, CalendarIcon, BuildingStorefrontIcon, BookOpenIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-cream-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo-full-transparent.png"
              alt="Secondhand Empire"
              width={400}
              height={300}
              className="w-auto h-auto max-w-[300px]"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-empire-black mb-6">
            Discover Vintage Treasures
            <span className="block text-empire-green">Near You</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find antique shops, yard sales, estate sales, and hidden gems in your area.
            Plan your treasure hunting route with our smart optimizer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/directory" className="btn-primary text-lg px-8 py-3">
              Browse Shops
            </Link>
            <Link href="/yard-sales" className="btn-secondary text-lg px-8 py-3">
              Find Sales Today
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<BuildingStorefrontIcon className="h-12 w-12 text-vintage-600" />}
            title="Shop Directory"
            description="Browse antique shops, thrift stores, consignment shops, and flea markets"
            link="/directory"
          />
          <FeatureCard
            icon={<CalendarIcon className="h-12 w-12 text-vintage-600" />}
            title="Yard Sales"
            description="Find local yard sales and garage sales happening this weekend"
            link="/yard-sales"
          />
          <FeatureCard
            icon={<MapPinIcon className="h-12 w-12 text-vintage-600" />}
            title="Estate Sales"
            description="Discover estate sales with detailed photos posted weeks in advance"
            link="/estate-sales"
          />
          <FeatureCard
            icon={<BookOpenIcon className="h-12 w-12 text-vintage-600" />}
            title="Reference Library"
            description="Learn about hallmarks, makers, patterns, and identify your finds"
            link="/reference"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-vintage-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-vintage-900 mb-4">
            Hosting a Sale?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            List your yard sale or estate sale for free and reach thousands of treasure hunters
          </p>
          <Link href="/post-sale" className="btn-primary text-lg px-8 py-3">
            Post Your Sale
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  link
}: {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}) {
  return (
    <Link href={link} className="card hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-vintage-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}
