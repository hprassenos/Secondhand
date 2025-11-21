import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Secondhand Empire - Vintage & Antique Marketplace',
  description: 'Discover antique shops, yard sales, estate sales, and vintage treasures in your area',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-vintage-800 text-vintage-100 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Secondhand Empire</h3>
                <p className="text-sm text-vintage-300">
                  Your guide to vintage treasures and antique discoveries
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Discover</h4>
                <ul className="space-y-2 text-sm text-vintage-300">
                  <li><a href="/directory" className="hover:text-white">Shop Directory</a></li>
                  <li><a href="/locations/states" className="hover:text-white">Browse by Location</a></li>
                  <li><a href="/yard-sales" className="hover:text-white">Yard Sales</a></li>
                  <li><a href="/estate-sales" className="hover:text-white">Estate Sales</a></li>
                  <li><a href="/reference" className="hover:text-white">Reference Library</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">For Sellers</h4>
                <ul className="space-y-2 text-sm text-vintage-300">
                  <li><a href="/claim-listing" className="hover:text-white">Claim Your Listing</a></li>
                  <li><a href="/post-sale" className="hover:text-white">Post a Sale</a></li>
                  <li><a href="/pricing" className="hover:text-white">Featured Listings</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Community</h4>
                <ul className="space-y-2 text-sm text-vintage-300">
                  <li><a href="/about" className="hover:text-white">About Us</a></li>
                  <li><a href="/contact" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-vintage-700 mt-8 pt-8 text-center text-sm text-vintage-400">
              <p>&copy; {new Date().getFullYear()} Secondhand Empire. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
