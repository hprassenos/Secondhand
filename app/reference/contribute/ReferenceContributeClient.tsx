'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ReferenceCategory, ReferenceSubmissionType } from '@/types'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

interface User {
  id: string
  email?: string
}

interface ReferenceContributeClientProps {
  user: User
  categories: ReferenceCategory[]
}

export default function ReferenceContributeClient({
  user,
  categories,
}: ReferenceContributeClientProps) {
  const router = useRouter()
  const [submissionType, setSubmissionType] = useState<ReferenceSubmissionType>('maker')
  const [formData, setFormData] = useState<any>({
    category_id: categories[0]?.id || '',
    name: '',
    description: '',
    country: '',
    founding_year: '',
    website_url: '',
    logo_url: '',
    // Pattern fields
    maker_name: '',
    year_introduced: '',
    materials: '',
    colors: '',
    rarity: 'common',
    identification_tips: '',
    image_urls: ['', '', ''],
    // Hallmark fields
    hallmark_image_url: '',
    date_range_start: '',
    date_range_end: '',
    mark_type: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // Build the data payload based on submission type
      let payload: any = {}

      if (submissionType === 'maker') {
        payload = {
          category_id: formData.category_id,
          name: formData.name,
          description: formData.description,
          country: formData.country || null,
          founding_year: formData.founding_year ? parseInt(formData.founding_year) : null,
          website_url: formData.website_url || null,
          logo_url: formData.logo_url || null,
        }
      } else if (submissionType === 'pattern') {
        payload = {
          maker_name: formData.maker_name,
          pattern_name: formData.name,
          description: formData.description,
          year_introduced: formData.year_introduced
            ? parseInt(formData.year_introduced)
            : null,
          materials: formData.materials
            .split(',')
            .map((m: string) => m.trim())
            .filter(Boolean),
          colors: formData.colors
            .split(',')
            .map((c: string) => c.trim())
            .filter(Boolean),
          rarity: formData.rarity,
          identification_tips: formData.identification_tips || null,
          image_urls: formData.image_urls.filter((url: string) => url.trim()),
        }
      } else if (submissionType === 'hallmark') {
        payload = {
          maker_name: formData.maker_name,
          hallmark_image_url: formData.hallmark_image_url,
          description: formData.description,
          date_range_start: formData.date_range_start
            ? parseInt(formData.date_range_start)
            : null,
          date_range_end: formData.date_range_end
            ? parseInt(formData.date_range_end)
            : null,
          mark_type: formData.mark_type || null,
        }
      }

      // Submit to database
      const { error: submitError } = await (supabase
        .from('reference_submissions') as any)
        .insert({
          submitted_by: user.id,
          submission_type: submissionType,
          data: payload,
          status: 'pending',
        })

      if (submitError) throw submitError

      setSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false)
        setFormData({
          category_id: categories[0]?.id || '',
          name: '',
          description: '',
          country: '',
          founding_year: '',
          website_url: '',
          logo_url: '',
          maker_name: '',
          year_introduced: '',
          materials: '',
          colors: '',
          rarity: 'common',
          identification_tips: '',
          image_urls: ['', '', ''],
          hallmark_image_url: '',
          date_range_start: '',
          date_range_end: '',
          mark_type: '',
        })
      }, 3000)
    } catch (err: any) {
      console.error('Submission error:', err)
      setError(err.message || 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...formData.image_urls]
    newUrls[index] = value
    updateFormData('image_urls', newUrls)
  }

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-vintage-600 mb-4">
          <Link href="/reference" className="hover:text-vintage-800">
            Reference Library
          </Link>
          {' / '}
          <span className="text-vintage-900 font-medium">Contribute</span>
        </nav>

        <h1 className="text-4xl font-bold text-vintage-900 mb-4">
          Contribute to the Library
        </h1>
        <p className="text-lg text-vintage-700 mb-8">
          Help fellow collectors by sharing your knowledge about makers, patterns, and
          hallmarks. All submissions are reviewed by our team before publication.
        </p>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">
                Submission Received!
              </h3>
              <p className="text-sm text-green-800">
                Thank you for contributing! Our team will review your submission and
                publish it soon.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Submission Failed</h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Submission Type Selector */}
        <div className="card mb-8">
          <h2 className="font-bold text-vintage-900 mb-4">What would you like to add?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setSubmissionType('maker')}
              className={`p-4 rounded-lg border-2 transition-all ${
                submissionType === 'maker'
                  ? 'border-vintage-600 bg-vintage-50'
                  : 'border-vintage-200 hover:border-vintage-400'
              }`}
            >
              <h3 className="font-semibold text-vintage-900 mb-1">Maker/Manufacturer</h3>
              <p className="text-sm text-gray-600">
                Add a new maker or manufacturer
              </p>
            </button>

            <button
              onClick={() => setSubmissionType('pattern')}
              className={`p-4 rounded-lg border-2 transition-all ${
                submissionType === 'pattern'
                  ? 'border-vintage-600 bg-vintage-50'
                  : 'border-vintage-200 hover:border-vintage-400'
              }`}
            >
              <h3 className="font-semibold text-vintage-900 mb-1">Pattern/Style</h3>
              <p className="text-sm text-gray-600">
                Add a pattern or style with photos
              </p>
            </button>

            <button
              onClick={() => setSubmissionType('hallmark')}
              className={`p-4 rounded-lg border-2 transition-all ${
                submissionType === 'hallmark'
                  ? 'border-vintage-600 bg-vintage-50'
                  : 'border-vintage-200 hover:border-vintage-400'
              }`}
            >
              <h3 className="font-semibold text-vintage-900 mb-1">Hallmark/Mark</h3>
              <p className="text-sm text-gray-600">Add a backstamp or hallmark</p>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Maker Form */}
          {submissionType === 'maker' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => updateFormData('category_id', e.target.value)}
                  required
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maker Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  required
                  placeholder="e.g., Wedgwood, Roseville Pottery"
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  required
                  rows={4}
                  placeholder="Brief history and description of the maker..."
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => updateFormData('country', e.target.value)}
                    placeholder="e.g., England, USA, Germany"
                    className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Founding Year
                  </label>
                  <input
                    type="number"
                    value={formData.founding_year}
                    onChange={(e) => updateFormData('founding_year', e.target.value)}
                    placeholder="e.g., 1895"
                    className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Official Website (if still active)
                </label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => updateFormData('website_url', e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => updateFormData('logo_url', e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to an image of the maker&apos;s logo
                </p>
              </div>
            </>
          )}

          {/* Pattern Form */}
          {submissionType === 'pattern' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maker/Manufacturer Name *
                </label>
                <input
                  type="text"
                  value={formData.maker_name}
                  onChange={(e) => updateFormData('maker_name', e.target.value)}
                  required
                  placeholder="e.g., Wedgwood"
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pattern Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  required
                  placeholder="e.g., Blue Willow, Rose Medallion"
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  required
                  rows={4}
                  placeholder="Describe the pattern, its characteristics, colors, etc..."
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Introduced
                  </label>
                  <input
                    type="number"
                    value={formData.year_introduced}
                    onChange={(e) => updateFormData('year_introduced', e.target.value)}
                    placeholder="e.g., 1950"
                    className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rarity
                  </label>
                  <select
                    value={formData.rarity}
                    onChange={(e) => updateFormData('rarity', e.target.value)}
                    className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                  >
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="very_rare">Very Rare</option>
                    <option value="extremely_rare">Extremely Rare</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materials (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.materials}
                  onChange={(e) => updateFormData('materials', e.target.value)}
                  placeholder="e.g., porcelain, gold trim, hand-painted"
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Colors (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => updateFormData('colors', e.target.value)}
                  placeholder="e.g., blue, white, gold"
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identification Tips
                </label>
                <textarea
                  value={formData.identification_tips}
                  onChange={(e) => updateFormData('identification_tips', e.target.value)}
                  rows={3}
                  placeholder="How to identify authentic pieces, common reproductions to watch for, etc..."
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Images (URLs)
                </label>
                {formData.image_urls.map((url: string, index: number) => (
                  <input
                    key={index}
                    type="url"
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    placeholder={`Image ${index + 1} URL`}
                    className="w-full border border-vintage-300 rounded-lg px-4 py-2 mb-2"
                  />
                ))}
                <button
                  type="button"
                  onClick={() =>
                    updateFormData('image_urls', [...formData.image_urls, ''])
                  }
                  className="text-sm text-vintage-600 hover:text-vintage-800"
                >
                  + Add another image
                </button>
              </div>
            </>
          )}

          {/* Hallmark Form */}
          {submissionType === 'hallmark' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maker/Manufacturer Name *
                </label>
                <input
                  type="text"
                  value={formData.maker_name}
                  onChange={(e) => updateFormData('maker_name', e.target.value)}
                  required
                  placeholder="e.g., Wedgwood"
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hallmark Image URL *
                </label>
                <input
                  type="url"
                  value={formData.hallmark_image_url}
                  onChange={(e) => updateFormData('hallmark_image_url', e.target.value)}
                  required
                  placeholder="https://..."
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Clear photo of the backstamp or hallmark
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  required
                  rows={3}
                  placeholder="Describe what the mark looks like and any text it contains..."
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range Start
                  </label>
                  <input
                    type="number"
                    value={formData.date_range_start}
                    onChange={(e) => updateFormData('date_range_start', e.target.value)}
                    placeholder="e.g., 1950"
                    className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range End
                  </label>
                  <input
                    type="number"
                    value={formData.date_range_end}
                    onChange={(e) => updateFormData('date_range_end', e.target.value)}
                    placeholder="e.g., 1965"
                    className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mark Type
                </label>
                <select
                  value={formData.mark_type}
                  onChange={(e) => updateFormData('mark_type', e.target.value)}
                  className="w-full border border-vintage-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select type...</option>
                  <option value="backstamp">Backstamp</option>
                  <option value="impressed">Impressed</option>
                  <option value="printed">Printed</option>
                  <option value="hand-painted">Hand-painted</option>
                  <option value="paper label">Paper Label</option>
                </select>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t border-vintage-200">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Your submission will be reviewed by our team before being published.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
