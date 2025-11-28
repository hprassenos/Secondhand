'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Event } from '@/types'
import {
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'

interface ModerateEventsClientProps {
  events: Event[]
}

export default function ModerateEventsClient({ events: initialEvents }: ModerateEventsClientProps) {
  const router = useRouter()
  const [events, setEvents] = useState(initialEvents)
  const [processing, setProcessing] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleApprove = async (eventId: string) => {
    setProcessing(eventId)

    const { error } = await (supabase.from('events') as any)
      .update({ moderation_status: 'approved' })
      .eq('id', eventId)

    if (!error) {
      setEvents(events.filter(e => e.id !== eventId))
      setSelectedEvent(null)
    } else {
      console.error('Error approving event:', error)
      alert('Failed to approve event')
    }

    setProcessing(null)
    router.refresh()
  }

  const handleReject = async (eventId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }

    setProcessing(eventId)

    const { error } = await (supabase.from('events') as any)
      .update({
        moderation_status: 'rejected',
        // Could add rejection_reason field to track this
      })
      .eq('id', eventId)

    if (!error) {
      setEvents(events.filter(e => e.id !== eventId))
      setSelectedEvent(null)
      setRejectionReason('')
    } else {
      console.error('Error rejecting event:', error)
      alert('Failed to reject event')
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
            <span className="text-vintage-900 font-medium">Moderate Sales</span>
          </nav>
          <h1 className="text-4xl font-bold text-vintage-900 mb-2">
            Moderate Yard & Estate Sales
          </h1>
          <p className="text-gray-600">
            Review and approve user-submitted sale listings
          </p>
        </div>

        {events.length === 0 ? (
          <div className="card text-center py-12">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-vintage-900 mb-2">
              All caught up!
            </h2>
            <p className="text-gray-600">
              No pending sale listings to review.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Events List */}
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                {events.length} pending {events.length === 1 ? 'item' : 'items'}
              </div>

              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`w-full text-left card hover:shadow-lg transition-all ${
                    selectedEvent?.id === event.id ? 'ring-2 ring-vintage-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        event.type === 'yard_sale'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {event.type === 'yard_sale' ? 'Yard Sale' : 'Estate Sale'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(event.start_time), 'MMM d, h:mm a')}
                    </div>
                  </div>

                  <h3 className="font-bold text-vintage-900 mb-2">{event.title}</h3>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{event.city}, {event.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(new Date(event.start_time), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>
                        {format(new Date(event.start_time), 'h:mm a')} -
                        {format(new Date(event.end_time), 'h:mm a')}
                      </span>
                    </div>
                    {event.photo_urls && event.photo_urls.length > 0 && (
                      <div className="flex items-center gap-2">
                        <PhotoIcon className="h-4 w-4" />
                        <span>{event.photo_urls.length} photo{event.photo_urls.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Detail View */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              {selectedEvent ? (
                <div className="card">
                  <h2 className="text-2xl font-bold text-vintage-900 mb-4">
                    {selectedEvent.title}
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Type:</span>
                      <p className="text-vintage-900 capitalize">
                        {selectedEvent.type.replace('_', ' ')}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600">Address:</span>
                      <p className="text-vintage-900">
                        {selectedEvent.address}<br />
                        {selectedEvent.city}, {selectedEvent.state} {selectedEvent.zip_code}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-600">Date & Time:</span>
                      <p className="text-vintage-900">
                        {format(new Date(selectedEvent.start_time), 'EEEE, MMMM d, yyyy')}<br />
                        {format(new Date(selectedEvent.start_time), 'h:mm a')} -
                        {format(new Date(selectedEvent.end_time), 'h:mm a')}
                      </p>
                    </div>

                    {selectedEvent.description && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Description:</span>
                        <p className="text-vintage-900 whitespace-pre-wrap">
                          {selectedEvent.description}
                        </p>
                      </div>
                    )}

                    {selectedEvent.photo_urls && selectedEvent.photo_urls.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">
                          Photos ({selectedEvent.photo_urls.length}):
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedEvent.photo_urls.map((url, index) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                            >
                              <img
                                src={url}
                                alt={`Photo ${index + 1}`}
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

                    {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedEvent.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="px-2 py-1 bg-vintage-100 text-vintage-700 rounded text-sm"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-vintage-200 pt-6 space-y-4">
                    <button
                      onClick={() => handleApprove(selectedEvent.id)}
                      disabled={processing === selectedEvent.id}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      {processing === selectedEvent.id ? 'Approving...' : 'Approve & Publish'}
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
                        onClick={() => handleReject(selectedEvent.id)}
                        disabled={processing === selectedEvent.id}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <XCircleIcon className="h-5 w-5" />
                        {processing === selectedEvent.id ? 'Rejecting...' : 'Reject Listing'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card text-center py-12">
                  <p className="text-gray-600">
                    Select an event from the list to review
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
