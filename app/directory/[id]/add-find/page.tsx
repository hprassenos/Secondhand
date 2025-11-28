'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function AddFindPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = params.id as string

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [description, setDescription] = useState('')
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [photoInput, setPhotoInput] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [twitter, setTwitter] = useState('')

  const addPhotoUrl = () => {
    if (photoInput.trim() && photoUrls.length < 10) {
      setPhotoUrls([...photoUrls, photoInput.trim()])
      setPhotoInput('')
    }
  }

  const removePhotoUrl = (index: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index))
  }

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

      // Prepare social links
      const socialLinks: any = {}
      if (instagram) socialLinks.instagram = instagram.replace('@', '')
      if (facebook) socialLinks.facebook = facebook
      if (twitter) socialLinks.twitter = twitter.replace('@', '')

      // Create guestbook entry
      const { error: entryError } = await (supabase
        .from('guestbook_entries') as any)
        .insert({
          listing_id: listingId,
          user_id: user.id,
          description,
          photo_urls: photoUrls,
          social_links: Object.keys(socialLinks).length > 0 ? socialLinks : null,
          moderation_status: 'pending',
        })

      if (entryError) throw entryError

      // Redirect to shop page
      router.push(`/directory/${listingId}?tab=guestbook&success=true`)
    } catch (err) {
      console.error('Error adding find:', err)
      setError('Failed to share your find. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-vintage-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href={`/directory/${listingId}`} className="text-vintage-600 hover:text-vintage-700 mb-4 inline-block">
            ← Back to Shop
          </Link>
          <h1 className="text-4xl font-bold text-vintage-900 mb-2">Share Your Find</h1>
          <p className="text-gray-600">
            Show off what you discovered at this shop!
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Tell us about your find
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                placeholder="What did you find? What do you love about it? Any interesting backstory?"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional, but helps others appreciate your treasure!
              </p>
            </div>

            {/* Photo URLs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photos (up to 10)
              </label>

              {/* Photo URL List */}
              {photoUrls.length > 0 && (
                <div className="mb-3 space-y-2">
                  {photoUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 bg-vintage-50 p-2 rounded">
                      <PhotoIcon className="h-5 w-5 text-vintage-600 flex-shrink-0" />
                      <span className="flex-1 text-sm truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => removePhotoUrl(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Photo URL Input */}
              {photoUrls.length < 10 && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={photoInput}
                    onChange={(e) => setPhotoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addPhotoUrl()
                      }
                    }}
                    className="flex-1 input-field"
                    placeholder="https://example.com/photo.jpg"
                  />
                  <button
                    type="button"
                    onClick={addPhotoUrl}
                    disabled={!photoInput.trim()}
                    className="btn-secondary whitespace-nowrap disabled:opacity-50"
                  >
                    Add Photo
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-1">
                For now, please upload your photos to an image hosting service (like Imgur) and paste the URLs here.
                We&apos;ll add direct photo upload in a future update!
              </p>
            </div>

            {/* Social Media Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Social Media (Optional)
              </label>
              <div className="space-y-3">
                <div>
                  <label htmlFor="instagram" className="block text-xs text-gray-600 mb-1">
                    Instagram Handle
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-vintage-300 bg-vintage-50 text-gray-600">
                      @
                    </span>
                    <input
                      id="instagram"
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="flex-1 px-4 py-2 border border-vintage-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-vintage-500"
                      placeholder="yourusername"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="facebook" className="block text-xs text-gray-600 mb-1">
                    Facebook Profile URL
                  </label>
                  <input
                    id="facebook"
                    type="url"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="input-field"
                    placeholder="https://facebook.com/yourprofile"
                  />
                </div>

                <div>
                  <label htmlFor="twitter" className="block text-xs text-gray-600 mb-1">
                    Twitter/X Handle
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-vintage-300 bg-vintage-50 text-gray-600">
                      @
                    </span>
                    <input
                      id="twitter"
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="flex-1 px-4 py-2 border border-vintage-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-vintage-500"
                      placeholder="yourusername"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Sharing Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Be respectful and positive</li>
                <li>Only share items you personally found at this shop</li>
                <li>Include clear photos when possible</li>
                <li>Your entry will be reviewed before appearing publicly</li>
              </ul>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || photoUrls.length === 0}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sharing...' : 'Share My Find'}
              </button>
              <Link href={`/directory/${listingId}`} className="btn-secondary">
                Cancel
              </Link>
            </div>

            <p className="text-xs text-gray-500">
              By sharing, you agree that your photos and description may be displayed publicly.
              Your entry will be reviewed within 24 hours.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
