'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { CheckCircleIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import type { Listing } from '@/types'

function ClaimListingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const listingId = searchParams.get('id')

  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState<Listing | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'verify' | 'claim' | 'success'>('verify')

  // Verification fields
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')
  const [verificationNotes, setVerificationNotes] = useState('')

  // Load listing
  useEffect(() => {
    if (listingId) {
      loadListing(listingId)
    }
  }, [listingId])

  const loadListing = async (id: string) => {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      setError('Listing not found')
    } else {
      setListing(data as Listing)
    }
  }

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      if (!listing) {
        throw new Error('No listing selected')
      }

      // Update listing with claim
      const { error: updateError } = await supabase
        .from('listings')
        .update({
          claimed: true,
          claimed_by: user.id,
          // Store verification info temporarily (in a real app, you'd use a separate claims table)
        })
        .eq('id', listing.id)

      if (updateError) throw updateError

      // In a real application, you would:
      // 1. Create a claim request record for admin review
      // 2. Send verification email to the owner email
      // 3. Notify admins of the claim request

      setStep('success')
    } catch (err) {
      console.error('Error claiming listing:', err)
      setError('Failed to claim listing. Please try again.')
      setLoading(false)
    }
  }

  if (!listingId) {
    return (
      <div className="min-h-screen bg-vintage-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center py-12">
            <BuildingStorefrontIcon className="h-16 w-16 text-vintage-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-vintage-900 mb-4">Claim Your Business Listing</h2>
            <p className="text-gray-600 mb-6">
              Find your business in our directory and click "Claim This Listing" to get started.
            </p>
            <Link href="/directory" className="btn-primary">
              Browse Directory
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-vintage-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/directory" className="btn-secondary">
              Back to Directory
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-vintage-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center py-12">
            <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-vintage-900 mb-4">Claim Submitted!</h2>
            <p className="text-gray-600 mb-6">
              We've received your claim for <strong>{listing?.name}</strong>. Our team will review your
              submission and contact you at <strong>{ownerEmail}</strong> within 1-2 business days.
            </p>
            <div className="space-y-3">
              <h3 className="font-semibold text-vintage-900">What happens next?</h3>
              <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>We'll verify your ownership through the contact information you provided</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>Once verified, you'll get full control over your listing</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>You can add photos, update hours, respond to guestbook entries, and more</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 flex gap-3 justify-center">
              <Link href={`/directory/${listing?.id}`} className="btn-primary">
                View Your Listing
              </Link>
              <Link href="/" className="btn-secondary">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vintage-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-vintage-900 mb-2">Claim Your Listing</h1>
          <p className="text-gray-600">
            Verify your ownership and take control of your business profile
          </p>
        </div>

        {listing && (
          <div className="card mb-6 bg-vintage-50 border-2 border-vintage-300">
            <div className="flex items-start gap-4">
              <BuildingStorefrontIcon className="h-12 w-12 text-vintage-600 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-vintage-900">{listing.name}</h2>
                <p className="text-gray-600">
                  {listing.address}, {listing.city}, {listing.state}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <form onSubmit={handleClaimSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Verification Required</h3>
              <p className="text-sm text-blue-800">
                To claim this listing, we need to verify that you are the owner or authorized representative
                of this business. Please provide your contact information for verification.
              </p>
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                Your Full Name *
              </label>
              <input
                id="ownerName"
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="input-field"
                placeholder="John Smith"
              />
            </div>

            {/* Owner Email */}
            <div>
              <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Business Email Address *
              </label>
              <input
                id="ownerEmail"
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="input-field"
                placeholder="owner@yourbusiness.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll send verification instructions to this email
              </p>
            </div>

            {/* Owner Phone */}
            <div>
              <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Business Phone Number *
              </label>
              <input
                id="ownerPhone"
                type="tel"
                required
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="input-field"
                placeholder="(555) 123-4567"
              />
              <p className="text-xs text-gray-500 mt-1">
                This should match the phone number associated with the business
              </p>
            </div>

            {/* Verification Notes */}
            <div>
              <label htmlFor="verificationNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information (Optional)
              </label>
              <textarea
                id="verificationNotes"
                rows={3}
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                className="input-field"
                placeholder="Any additional information that can help us verify your ownership..."
              />
            </div>

            {/* Benefits of Claiming */}
            <div className="bg-vintage-50 border border-vintage-300 rounded-lg p-4">
              <h3 className="font-semibold text-vintage-900 mb-3">Benefits of Claiming Your Listing</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Update your business information, hours, and photos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Respond to customer guestbook entries</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Get a verified badge on your listing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Post announcements and special sales</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <span>Access analytics about your listing views</span>
                </li>
              </ul>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Claim Request'}
              </button>
              <Link href={`/directory/${listing?.id}`} className="btn-secondary">
                Cancel
              </Link>
            </div>

            <p className="text-xs text-gray-500">
              By submitting this claim, you confirm that you are the owner or authorized representative
              of this business. False claims may result in account suspension.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ClaimListingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-vintage-50 py-12 flex items-center justify-center">
        <div className="text-vintage-600">Loading...</div>
      </div>
    }>
      <ClaimListingContent />
    </Suspense>
  )
}
