'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import TagInput from '@/components/TagInput'
import type { Tag, EventType } from '@/types'
import Link from 'next/link'

export default function PostSalePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [saleType, setSaleType] = useState<EventType>('yard_sale')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [tags, setTags] = useState<Tag[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Check authentication
      const user = await getCurrentUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Combine date and time
      const startDateTime = new Date(`${startDate}T${startTime}`).toISOString()
      const endDateTime = new Date(`${endDate}T${endTime}`).toISOString()

      // Validate dates
      if (new Date(endDateTime) <= new Date(startDateTime)) {
        setError('End time must be after start time')
        setLoading(false)
        return
      }

      // Create event
      const { data: event, error: eventError } = await (supabase
        .from('events') as any)
        .insert({
          type: saleType,
          title,
          description,
          address,
          city,
          state,
          zip_code: zipCode,
          start_time: startDateTime,
          end_time: endDateTime,
          created_by: user.id,
          moderation_status: 'pending',
        })
        .select()
        .single()

      if (eventError) throw eventError

      // Add tags
      if (tags.length > 0 && event) {
        const tagRelations = tags.map(tag => ({
          event_id: event.id,
          tag_id: tag.id,
        }))

        const { error: tagsError } = await (supabase
          .from('event_tags') as any)
          .insert(tagRelations)

        if (tagsError) throw tagsError
      }

      // Redirect to success page or sales list
      router.push('/post-sale/success')
    } catch (err) {
      console.error('Error posting sale:', err)
      setError('Failed to post sale. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-vintage-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-vintage-900 mb-2">Post a Sale</h1>
          <p className="text-gray-600">
            Share your yard sale or estate sale with treasure hunters
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Sale Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSaleType('yard_sale')}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    saleType === 'yard_sale'
                      ? 'border-vintage-600 bg-vintage-50'
                      : 'border-gray-300 hover:border-vintage-300'
                  }`}
                >
                  <div className="font-semibold text-vintage-900">Yard Sale</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Garage sales, moving sales, etc.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSaleType('estate_sale')}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    saleType === 'estate_sale'
                      ? 'border-vintage-600 bg-vintage-50'
                      : 'border-gray-300 hover:border-vintage-300'
                  }`}
                >
                  <div className="font-semibold text-vintage-900">Estate Sale</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Professional estate sales
                  </div>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Sale Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="e.g., Multi-Family Yard Sale"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                placeholder="Describe what you're selling..."
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                id="address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-field"
                placeholder="123 Main St"
              />
            </div>

            {/* City, State, Zip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  id="state"
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="input-field"
                  placeholder="CA"
                  maxLength={2}
                />
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code *
                </label>
                <input
                  id="zipCode"
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="input-field"
                  placeholder="12345"
                />
              </div>
            </div>

            {/* Start Date/Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  id="startDate"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  id="startTime"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* End Date/Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  id="endDate"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  id="endTime"
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (Optional)
              </label>
              <TagInput
                selectedTags={tags}
                onTagsChange={setTags}
                placeholder="Add tags to help people find your sale..."
              />
              <p className="text-xs text-gray-500 mt-1">
                e.g., furniture, vintage, clothing, toys, antiques
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post Sale'}
              </button>
              <Link href="/" className="btn-secondary">
                Cancel
              </Link>
            </div>

            <p className="text-xs text-gray-500">
              Your listing will be reviewed and published within 24 hours. All listings are subject to our
              <Link href="/terms" className="text-vintage-600 hover:text-vintage-700"> Terms of Service</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
