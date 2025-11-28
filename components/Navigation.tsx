'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Shop Directory', href: '/directory' },
    { name: 'Yard Sales', href: '/yard-sales' },
    { name: 'Estate Sales', href: '/estate-sales' },
    { name: 'Reference Library', href: '/reference' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-vintage-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 md:h-28">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-simplified-transparent.png"
                alt="Secondhand Empire"
                width={180}
                height={90}
                className="h-[50px] w-auto md:h-[90px]"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-vintage-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link href="/post-sale" className="btn-primary">
              Post a Sale
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-vintage-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:bg-vintage-50 hover:text-vintage-600 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/post-sale"
              className="block px-3 py-2 text-vintage-600 hover:bg-vintage-50 rounded-md font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Post a Sale
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
