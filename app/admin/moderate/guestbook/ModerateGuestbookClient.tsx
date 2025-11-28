'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { GuestbookEntry } from '@/types'
import {
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'

interface ExtendedGuestbookEntry extends GuestbookEntry {
  listing?: {
    id: string
    name: string
    city: string
    state: string
  }
}

interface ModerateGuestbookClientProps {
  entries: ExtendedGuestbookEntry[]
}

export default function ModerateGuestbookClient({
  entries: initialEntries,
}: ModerateGuestbookClientProps) {
  const router = useRouter()
  const [entries, setEntries] = useState(initialEntries)
  const [processing, setProcessing] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<ExtendedGuestbookEntry | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleApprove = async (entryId: string) => {
    setProcessing(entryId)

    const { error } = await (supabase.from('guestbook_entries') as any)
      .update({ moderation_status: 'approved' })
      .eq('id', entryId)

    if (!error) {
      setEntries(entries.filter((e) => e.id !== entryId))
      setSelectedEntry(null)
    } else {
      console.error('Error approving entry:', error)
      alert('Failed to approve entry')
    }

    setProcessing(null)
    router.refresh()
  }

  const handleReject = async (entryId: string) => {
    setProcessing(entryId)

    const { error } = await (supabase.from('guestbook_entries') as any)
      .update({ moderation_status: 'rejected' })
      .eq('id', entryId)

    if (!error) {
      setEntries(entries.filter((e) => e.id !== entryId))
      setSelectedEntry(null)
      setRejectionReason('')
    } else {
      console.error('Error rejecting entry:', error)
      alert('Failed to reject entry')
    }

    setProcessing(null)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-vintage-600 mb-4">
            <Link href="/admin" className="hover:text-vintage-800">
              Admin Dashboard
            </Link>
            {' / '}
            <span className="text-vintage-900 font-medium">Moderate Guestbook</span>
          </nav>
          <h1 className="text-4xl font-bold text-vintage-900 mb-2">
            Moderate Guestbook Entries
          </h1>
          <p className="text-gray-600">Review customer finds and photos</p>
        </div>

        {entries.length === 0 ? (
          <div className="card text-center py-12">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-vintage-900 mb-2">All caught up!</h2>
            <p className="text-gray-600">No pending guestbook entries to review.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Entries List */}
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                {entries.length} pending {entries.length === 1 ? 'entry' : 'entries'}
              </div>

              {entries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`w-full text-left card hover:shadow-lg transition-all ${
                    selectedEntry?.id === entry.id ? 'ring-2 ring-vintage-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {entry.listing && (
                        <div className="flex items-center gap-1 text-sm text-vintage-700">
                          <BuildingStorefrontIcon className="h-4 w-4" />
                          <span className="font-medium">{entry.listing.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(entry.created_at), 'MMM d, h:mm a')}
                    </div>
                  </div>

                  {entry.description && (
                    <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                      {entry.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    {entry.photo_urls && entry.photo_urls.length > 0 && (
                      <div className="flex items-center gap-1">
                        <PhotoIcon className="h-4 w-4" />
                        <span>
                          {entry.photo_urls.length} photo
                          {entry.photo_urls.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    {entry.social_links &&
                      Object.keys(entry.social_links).length > 0 && (
                        <span>Has social links</span>
                      )}
                  </div>
                </button>
              ))}
            </div>

            {/* Detail View */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              {selectedEntry ? (
                <div className="card">
                  <div className="mb-6">
                    {selectedEntry.listing && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-600">Shop:</span>
                        <p className="text-vintage-900">
                          <Link
                            href={`/directory/${selectedEntry.listing.id}`}
                            target="_blank"
                            className="hover:underline"
                          >
                            {selectedEntry.listing.name}
                          </Link>
                          <br />
                          <span className="text-sm text-gray-600">
                            {selectedEntry.listing.city}, {selectedEntry.listing.state}
                          </span>
                        </p>
                      </div>
                    )}

                    {selectedEntry.description && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-600">
                          Description:
                        </span>
                        <p className="text-vintage-900 whitespace-pre-wrap">
                          {selectedEntry.description}
                        </p>
                      </div>
                    )}

                    {selectedEntry.photo_urls && selectedEntry.photo_urls.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-600 mb-2 block">
                          Photos ({selectedEntry.photo_urls.length}):
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedEntry.photo_urls.map((url, index) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={url}
                                alt={`Find photo ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = ''
                                  e.currentTarget.alt = 'Failed to load'
                                }}
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedEntry.social_links &&
                      Object.keys(selectedEntry.social_links).length > 0 && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-600 mb-2 block">
                            Social Links:
                          </span>
                          <div className="space-y-1 text-sm">
                            {selectedEntry.social_links.instagram && (
                              <div>
                                <span className="text-gray-600">Instagram:</span>{' '}
                                <a
                                  href={selectedEntry.social_links.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-vintage-600 hover:underline"
                                >
                                  {selectedEntry.social_links.instagram}
                                </a>
                              </div>
                            )}
                            {selectedEntry.social_links.facebook && (
                              <div>
                                <span className="text-gray-600">Facebook:</span>{' '}
                                <a
                                  href={selectedEntry.social_links.facebook}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-vintage-600 hover:underline"
                                >
                                  {selectedEntry.social_links.facebook}
                                </a>
                              </div>
                            )}
                            {selectedEntry.social_links.twitter && (
                              <div>
                                <span className="text-gray-600">Twitter:</span>{' '}
                                <a
                                  href={selectedEntry.social_links.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-vintage-600 hover:underline"
                                >
                                  {selectedEntry.social_links.twitter}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    <div className="text-xs text-gray-500">
                      Submitted {format(new Date(selectedEntry.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-vintage-200 pt-6 space-y-4">
                    <button
                      onClick={() => handleApprove(selectedEntry.id)}
                      disabled={processing === selectedEntry.id}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      {processing === selectedEntry.id ? 'Approving...' : 'Approve & Publish'}
                    </button>

                    <div>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Reason for rejection (optional but recommended)..."
                        className="w-full border border-vintage-300 rounded-lg px-4 py-2 mb-2"
                        rows={3}
                      />
                      <button
                        onClick={() => handleReject(selectedEntry.id)}
                        disabled={processing === selectedEntry.id}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <XCircleIcon className="h-5 w-5" />
                        {processing === selectedEntry.id ? 'Rejecting...' : 'Reject Entry'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card text-center py-12">
                  <p className="text-gray-600">
                    Select an entry from the list to review
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
