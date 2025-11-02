'use client'

import { useState } from 'react'
import { MapPinIcon, PhoneIcon, GlobeAltIcon, ClockIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'
import type { Listing, GuestbookEntry, ListingType, BusinessHours } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

interface ShopDetailProps {
  listing: Listing
  guestbookEntries: GuestbookEntry[]
}

const TYPE_LABELS: Record<ListingType, string> = {
  antique_shop: 'Antique Shop',
  thrift_store: 'Thrift Store',
  consignment_shop: 'Consignment Shop',
  flea_market: 'Flea Market',
  auction_house: 'Auction House',
  estate_sale_company: 'Estate Sale Company',
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

export default function ShopDetail({ listing, guestbookEntries }: ShopDetailProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'guestbook'>('about')

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/directory" className="text-vintage-600 hover:text-vintage-700 mb-4 inline-block">
          ← Back to Directory
        </Link>

        {/* Header */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-vintage-900">{listing.name}</h1>
                {listing.verified && (
                  <CheckBadgeIcon className="h-8 w-8 text-blue-600" title="Verified listing" />
                )}
              </div>
              <p className="text-lg text-vintage-600 mb-4">{TYPE_LABELS[listing.type]}</p>

              {/* Contact Info */}
              <div className="space-y-2 text-gray-700">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{listing.address}</p>
                    <p>{listing.city}, {listing.state} {listing.zip_code}</p>
                  </div>
                </div>

                {listing.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    <a href={`tel:${listing.phone}`} className="hover:text-vintage-600">
                      {listing.phone}
                    </a>
                  </div>
                )}

                {listing.website && (
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-5 w-5 mr-2" />
                    <a
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-vintage-600"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Claim Listing Button */}
            {!listing.claimed && (
              <div className="mt-4 md:mt-0">
                <Link href={`/claim-listing?id=${listing.id}`} className="btn-primary">
                  Claim This Listing
                </Link>
              </div>
            )}
          </div>

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-vintage-200">
              {listing.tags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-vintage-100 text-vintage-700"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hours */}
        {listing.hours && (
          <div className="card mb-6">
            <div className="flex items-center mb-3">
              <ClockIcon className="h-6 w-6 mr-2 text-vintage-600" />
              <h2 className="text-xl font-bold text-vintage-900">Hours</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DAYS.map(day => {
                const hours = (listing.hours as BusinessHours)?.[day]
                return (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="font-medium capitalize text-gray-700">{day}</span>
                    <span className="text-gray-600">
                      {hours?.closed ? 'Closed' : hours ? `${hours.open} - ${hours.close}` : 'Not specified'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-vintage-200 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'about'
                  ? 'border-vintage-600 text-vintage-600'
                  : 'border-transparent text-gray-600 hover:text-vintage-600'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('guestbook')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'guestbook'
                  ? 'border-vintage-600 text-vintage-600'
                  : 'border-transparent text-gray-600 hover:text-vintage-600'
              }`}
            >
              Guestbook ({guestbookEntries.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'about' ? (
          <div className="card">
            <h2 className="text-2xl font-bold text-vintage-900 mb-4">About</h2>
            {listing.description ? (
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            ) : (
              <p className="text-gray-500 italic">No description available yet.</p>
            )}

            {/* Shop Photos */}
            {listing.photo_urls && listing.photo_urls.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-vintage-900 mb-4">Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.photo_urls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={url}
                        alt={`${listing.name} photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add to Guestbook Button */}
            <div className="card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-vintage-900 mb-2">Customer Finds</h2>
                  <p className="text-gray-600">
                    Show off your treasures found at {listing.name}!
                  </p>
                </div>
                <Link
                  href={`/directory/${listing.id}/add-find`}
                  className="btn-primary mt-4 sm:mt-0"
                >
                  Share Your Find
                </Link>
              </div>
            </div>

            {/* Guestbook Entries */}
            {guestbookEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guestbookEntries.map(entry => (
                  <GuestbookCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-600 mb-4">No finds shared yet. Be the first!</p>
                <Link href={`/directory/${listing.id}/add-find`} className="btn-primary">
                  Share Your Find
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function GuestbookCard({ entry }: { entry: GuestbookEntry }) {
  return (
    <div className="card">
      {entry.photo_urls && entry.photo_urls.length > 0 && (
        <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
          <Image
            src={entry.photo_urls[0]}
            alt="Customer find"
            fill
            className="object-cover"
          />
        </div>
      )}

      {entry.description && (
        <p className="text-gray-700 mb-3">{entry.description}</p>
      )}

      {entry.social_links && (
        <div className="flex gap-3 text-sm text-vintage-600">
          {entry.social_links.instagram && (
            <a
              href={`https://instagram.com/${entry.social_links.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-vintage-700"
            >
              @{entry.social_links.instagram}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
