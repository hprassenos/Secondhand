'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ReferenceSubmission, ReferenceCategory } from '@/types'
import {
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'

interface ModerateReferenceClientProps {
  submissions: ReferenceSubmission[]
  categories: ReferenceCategory[]
}

export default function ModerateReferenceClient({
  submissions: initialSubmissions,
  categories,
}: ModerateReferenceClientProps) {
  const router = useRouter()
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [processing, setProcessing] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] =
    useState<ReferenceSubmission | null>(null)
  const [rejectionNotes, setRejectionNotes] = useState('')

  const handleApprove = async (submission: ReferenceSubmission) => {
    setProcessing(submission.id)

    try {
      // Based on type, insert into the appropriate table
      if (submission.submission_type === 'maker') {
        const data = submission.data as any

        // Generate slug from name
        const slug = data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

        const { error } = await (supabase.from('reference_makers') as any).insert({
          category_id: data.category_id,
          name: data.name,
          slug: slug,
          description: data.description,
          country: data.country,
          founding_year: data.founding_year,
          website_url: data.website_url,
          logo_url: data.logo_url,
        })

        if (error) throw error
      } else if (submission.submission_type === 'pattern') {
        const data = submission.data as any

        // Find or create maker
        let makerId: string | null = null
        const { data: existingMaker } = await (supabase
          .from('reference_makers') as any)
          .select('id')
          .ilike('name', data.maker_name)
          .single()

        if (existingMaker) {
          makerId = existingMaker.id
        } else {
          // Maker doesn't exist - need to reject or create
          alert(
            'Maker not found. Please create the maker first or reject this submission.'
          )
          setProcessing(null)
          return
        }

        // Generate slug
        const slug = data.pattern_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

        // Insert pattern
        const { data: newPattern, error: patternError } = await (supabase
          .from('reference_patterns') as any)
          .insert({
            maker_id: makerId,
            name: data.pattern_name,
            slug: slug,
            description: data.description,
            year_introduced: data.year_introduced,
            materials: data.materials,
            colors: data.colors,
            rarity: data.rarity,
            identification_tips: data.identification_tips,
          })
          .select()
          .single()

        if (patternError) throw patternError

        // Insert images
        if (data.image_urls && data.image_urls.length > 0 && newPattern) {
          const imageInserts = data.image_urls.map(
            (url: string, index: number) => ({
              pattern_id: newPattern.id,
              image_url: url,
              alt_text: `${data.pattern_name} photo ${index + 1}`,
              is_primary: index === 0,
              sort_order: index,
            })
          )

          const { error: imageError } = await (supabase
            .from('reference_images') as any)
            .insert(imageInserts)

          if (imageError) throw imageError
        }
      } else if (submission.submission_type === 'hallmark') {
        const data = submission.data as any

        // Find maker
        const { data: existingMaker } = await (supabase
          .from('reference_makers') as any)
          .select('id')
          .ilike('name', data.maker_name)
          .single()

        if (!existingMaker) {
          alert('Maker not found. Please create the maker first.')
          setProcessing(null)
          return
        }

        const { error} = await (supabase.from('reference_hallmarks') as any).insert({
          maker_id: existingMaker.id,
          image_url: data.hallmark_image_url,
          description: data.description,
          date_range_start: data.date_range_start,
          date_range_end: data.date_range_end,
          mark_type: data.mark_type,
        })

        if (error) throw error
      }

      // Mark submission as approved
      const { error: updateError } = await (supabase
        .from('reference_submissions') as any)
        .update({ status: 'approved' })
        .eq('id', submission.id)

      if (updateError) throw updateError

      setSubmissions(submissions.filter((s) => s.id !== submission.id))
      setSelectedSubmission(null)
      router.refresh()
    } catch (err: any) {
      console.error('Error approving submission:', err)
      alert(`Failed to approve: ${err.message}`)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (submissionId: string) => {
    setProcessing(submissionId)

    const { error } = await (supabase
      .from('reference_submissions') as any)
      .update({
        status: 'rejected',
        reviewer_notes: rejectionNotes || null,
      })
      .eq('id', submissionId)

    if (!error) {
      setSubmissions(submissions.filter((s) => s.id !== submissionId))
      setSelectedSubmission(null)
      setRejectionNotes('')
    } else {
      console.error('Error rejecting submission:', error)
      alert('Failed to reject submission')
    }

    setProcessing(null)
    router.refresh()
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown'
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
            <span className="text-vintage-900 font-medium">
              Moderate Reference Library
            </span>
          </nav>
          <h1 className="text-4xl font-bold text-vintage-900 mb-2">
            Moderate Reference Library Submissions
          </h1>
          <p className="text-gray-600">Review community contributions</p>
        </div>

        {submissions.length === 0 ? (
          <div className="card text-center py-12">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-vintage-900 mb-2">All caught up!</h2>
            <p className="text-gray-600">No pending submissions to review.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Submissions List */}
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                {submissions.length} pending{' '}
                {submissions.length === 1 ? 'submission' : 'submissions'}
              </div>

              {submissions.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className={`w-full text-left card hover:shadow-lg transition-all ${
                    selectedSubmission?.id === submission.id
                      ? 'ring-2 ring-vintage-600'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        submission.submission_type === 'maker'
                          ? 'bg-blue-100 text-blue-700'
                          : submission.submission_type === 'pattern'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {submission.submission_type.charAt(0).toUpperCase() +
                        submission.submission_type.slice(1)}
                    </span>
                    <div className="text-xs text-gray-500">
                      {format(new Date(submission.created_at), 'MMM d, h:mm a')}
                    </div>
                  </div>

                  <h3 className="font-bold text-vintage-900 mb-2">
                    {submission.submission_type === 'maker'
                      ? (submission.data as any).name
                      : submission.submission_type === 'pattern'
                      ? (submission.data as any).pattern_name
                      : `${(submission.data as any).maker_name} Hallmark`}
                  </h3>

                  {submission.submission_type !== 'hallmark' && (
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {(submission.data as any).description}
                    </p>
                  )}
                </button>
              ))}
            </div>

            {/* Detail View */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              {selectedSubmission ? (
                <div className="card">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-vintage-900 mb-4">
                      {selectedSubmission.submission_type === 'maker'
                        ? (selectedSubmission.data as any).name
                        : selectedSubmission.submission_type === 'pattern'
                        ? (selectedSubmission.data as any).pattern_name
                        : `${(selectedSubmission.data as any).maker_name} Hallmark`}
                    </h2>

                    {/* Maker Details */}
                    {selectedSubmission.submission_type === 'maker' && (
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Category:
                          </span>
                          <p className="text-vintage-900">
                            {getCategoryName(
                              (selectedSubmission.data as any).category_id
                            )}
                          </p>
                        </div>
                        {(selectedSubmission.data as any).country && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Country:
                            </span>
                            <p className="text-vintage-900">
                              {(selectedSubmission.data as any).country}
                            </p>
                          </div>
                        )}
                        {(selectedSubmission.data as any).founding_year && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Founded:
                            </span>
                            <p className="text-vintage-900">
                              {(selectedSubmission.data as any).founding_year}
                            </p>
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Description:
                          </span>
                          <p className="text-vintage-900 whitespace-pre-wrap">
                            {(selectedSubmission.data as any).description}
                          </p>
                        </div>
                        {(selectedSubmission.data as any).website_url && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Website:
                            </span>
                            <p>
                              <a
                                href={(selectedSubmission.data as any).website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-vintage-600 hover:underline"
                              >
                                {(selectedSubmission.data as any).website_url}
                              </a>
                            </p>
                          </div>
                        )}
                        {(selectedSubmission.data as any).logo_url && (
                          <div>
                            <span className="text-sm font-medium text-gray-600 mb-2 block">
                              Logo:
                            </span>
                            <a
                              href={(selectedSubmission.data as any).logo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={(selectedSubmission.data as any).logo_url}
                                alt="Logo"
                                className="max-w-xs h-auto border rounded"
                              />
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pattern Details */}
                    {selectedSubmission.submission_type === 'pattern' && (
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Maker:
                          </span>
                          <p className="text-vintage-900">
                            {(selectedSubmission.data as any).maker_name}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Description:
                          </span>
                          <p className="text-vintage-900 whitespace-pre-wrap">
                            {(selectedSubmission.data as any).description}
                          </p>
                        </div>
                        {(selectedSubmission.data as any).year_introduced && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Year Introduced:
                            </span>
                            <p className="text-vintage-900">
                              {(selectedSubmission.data as any).year_introduced}
                            </p>
                          </div>
                        )}
                        {(selectedSubmission.data as any).materials?.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Materials:
                            </span>
                            <p className="text-vintage-900">
                              {(selectedSubmission.data as any).materials.join(', ')}
                            </p>
                          </div>
                        )}
                        {(selectedSubmission.data as any).colors?.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Colors:
                            </span>
                            <p className="text-vintage-900">
                              {(selectedSubmission.data as any).colors.join(', ')}
                            </p>
                          </div>
                        )}
                        {(selectedSubmission.data as any).rarity && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Rarity:
                            </span>
                            <p className="text-vintage-900 capitalize">
                              {(selectedSubmission.data as any).rarity.replace(
                                '_',
                                ' '
                              )}
                            </p>
                          </div>
                        )}
                        {(selectedSubmission.data as any).identification_tips && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Identification Tips:
                            </span>
                            <p className="text-vintage-900 whitespace-pre-wrap">
                              {(selectedSubmission.data as any).identification_tips}
                            </p>
                          </div>
                        )}
                        {(selectedSubmission.data as any).image_urls?.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-600 mb-2 block">
                              Images ({(selectedSubmission.data as any).image_urls.length}):
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              {(selectedSubmission.data as any).image_urls.map(
                                (url: string, index: number) => (
                                  <a
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-80"
                                  >
                                    <img
                                      src={url}
                                      alt={`Pattern photo ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </a>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Hallmark Details */}
                    {selectedSubmission.submission_type === 'hallmark' && (
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Maker:
                          </span>
                          <p className="text-vintage-900">
                            {(selectedSubmission.data as any).maker_name}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 mb-2 block">
                            Hallmark Image:
                          </span>
                          <a
                            href={(selectedSubmission.data as any).hallmark_image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={(selectedSubmission.data as any).hallmark_image_url}
                              alt="Hallmark"
                              className="max-w-xs h-auto border rounded"
                            />
                          </a>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Description:
                          </span>
                          <p className="text-vintage-900 whitespace-pre-wrap">
                            {(selectedSubmission.data as any).description}
                          </p>
                        </div>
                        {((selectedSubmission.data as any).date_range_start ||
                          (selectedSubmission.data as any).date_range_end) && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Date Range:
                            </span>
                            <p className="text-vintage-900">
                              {(selectedSubmission.data as any).date_range_start || '?'} -
                              {(selectedSubmission.data as any).date_range_end || '?'}
                            </p>
                          </div>
                        )}
                        {(selectedSubmission.data as any).mark_type && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Mark Type:
                            </span>
                            <p className="text-vintage-900 capitalize">
                              {(selectedSubmission.data as any).mark_type}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-vintage-200 text-xs text-gray-500">
                      Submitted{' '}
                      {format(
                        new Date(selectedSubmission.created_at),
                        'MMMM d, yyyy \'at\' h:mm a'
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-vintage-200 pt-6 space-y-4">
                    <button
                      onClick={() => handleApprove(selectedSubmission)}
                      disabled={processing === selectedSubmission.id}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      {processing === selectedSubmission.id
                        ? 'Approving...'
                        : 'Approve & Publish'}
                    </button>

                    <div>
                      <textarea
                        value={rejectionNotes}
                        onChange={(e) => setRejectionNotes(e.target.value)}
                        placeholder="Reason for rejection (optional but recommended)..."
                        className="w-full border border-vintage-300 rounded-lg px-4 py-2 mb-2"
                        rows={3}
                      />
                      <button
                        onClick={() => handleReject(selectedSubmission.id)}
                        disabled={processing === selectedSubmission.id}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <XCircleIcon className="h-5 w-5" />
                        {processing === selectedSubmission.id
                          ? 'Rejecting...'
                          : 'Reject Submission'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card text-center py-12">
                  <p className="text-gray-600">
                    Select a submission from the list to review
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
