'use client'

import { useState } from 'react'
import { MapPinIcon, CalendarIcon, ClockIcon, ShareIcon } from '@heroicons/react/24/outline'
import type { Event } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

interface EstateSaleDetailProps {
  sale: Event
}

export default function EstateSaleDetail({ sale }: EstateSaleDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const startDate = new Date(sale.start_time)
  const endDate = new Date(sale.end_time)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sale.title,
          text: sale.description || '',
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/estate-sales" className="text-vintage-600 hover:text-vintage-700 mb-4 inline-block">
          ← Back to Estate Sales
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Photo Gallery */}
            {sale.photo_urls && sale.photo_urls.length > 0 ? (
              <div className="card p-0 overflow-hidden mb-6">
                {/* Main Image */}
                <div className="relative aspect-[16/10] bg-vintage-100">
                  <Image
                    src={sale.photo_urls[selectedImageIndex]}
                    alt={`${sale.title} photo ${selectedImageIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Thumbnail Strip */}
                {sale.photo_urls.length > 1 && (
                  <div className="p-4 bg-white border-t border-vintage-200">
                    <div className="flex gap-2 overflow-x-auto">
                      {sale.photo_urls.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${
                            index === selectedImageIndex
                              ? 'border-vintage-600'
                              : 'border-transparent hover:border-vintage-300'
                          }`}
                        >
                          <Image
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card aspect-[16/10] flex items-center justify-center bg-vintage-100 mb-6">
                <p className="text-gray-500">No photos available</p>
              </div>
            )}

            {/* Description */}
            <div className="card">
              <h2 className="text-2xl font-bold text-vintage-900 mb-4">About This Sale</h2>
              {sale.description ? (
                <p className="text-gray-700 whitespace-pre-wrap">{sale.description}</p>
              ) : (
                <p className="text-gray-500 italic">No description provided</p>
              )}

              {/* Tags */}
              {sale.tags && sale.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-vintage-200">
                  <h3 className="font-semibold text-vintage-900 mb-3">Featured Items</h3>
                  <div className="flex flex-wrap gap-2">
                    {sale.tags.map(tag => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-vintage-100 text-vintage-700"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4 space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-vintage-900 mb-2">{sale.title}</h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Estate Sale
                </span>
              </div>

              {/* Date & Time */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <CalendarIcon className="h-5 w-5 mr-3 mt-0.5 text-vintage-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(startDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                    {format(startDate, 'yyyy-MM-dd') !== format(endDate, 'yyyy-MM-dd') && (
                      <p className="text-sm text-gray-600">
                        through {format(endDate, 'EEEE, MMMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <ClockIcon className="h-5 w-5 mr-3 mt-0.5 text-vintage-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="pt-4 border-t border-vintage-200">
                <div className="flex items-start mb-3">
                  <MapPinIcon className="h-5 w-5 mr-3 mt-0.5 text-vintage-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{sale.address}</p>
                    <p className="text-gray-600">{sale.city}, {sale.state} {sale.zip_code}</p>
                  </div>
                </div>

                {/* Map Link */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${sale.address}, ${sale.city}, ${sale.state} ${sale.zip_code}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-center"
                >
                  View on Map
                </a>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="btn-primary w-full flex items-center justify-center"
              >
                <ShareIcon className="h-5 w-5 mr-2" />
                Share This Sale
              </button>

              {/* Safety Notice */}
              <div className="pt-4 border-t border-vintage-200">
                <p className="text-xs text-gray-500">
                  <strong>Safety reminder:</strong> Always attend sales during daylight hours and
                  bring a friend when possible. Verify sale details before visiting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
