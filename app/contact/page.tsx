'use client'

import { useState } from 'react'
import { EnvelopeIcon, ChatBubbleLeftRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    // TODO: Implement actual email sending
    // For now, just simulate success
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', category: 'general', message: '' })
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-vintage-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            We&apos;d love to hear from you! Get in touch with questions, suggestions, or feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <QuestionMarkCircleIcon className="h-8 w-8 text-vintage-600 mb-3" />
              <h3 className="font-bold text-vintage-900 mb-2">Frequently Asked Questions</h3>
              <p className="text-sm text-gray-600 mb-3">
                Find quick answers to common questions
              </p>
              <Link href="/faq" className="text-vintage-600 hover:text-vintage-700 text-sm font-medium">
                View FAQ →
              </Link>
            </div>

            <div className="card">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-vintage-600 mb-3" />
              <h3 className="font-bold text-vintage-900 mb-2">For Shop Owners</h3>
              <p className="text-sm text-gray-600 mb-3">
                Questions about claiming or managing your listing?
              </p>
              <Link href="/claim-listing" className="text-vintage-600 hover:text-vintage-700 text-sm font-medium">
                Claim Your Listing →
              </Link>
            </div>

            <div className="card bg-vintage-100 border-vintage-300">
              <EnvelopeIcon className="h-8 w-8 text-vintage-700 mb-3" />
              <h3 className="font-bold text-vintage-900 mb-2">Direct Email</h3>
              <p className="text-sm text-gray-700">
                Prefer email? Reach us at:
              </p>
              <a
                href="mailto:hello@secondhandempire.com"
                className="text-vintage-700 hover:text-vintage-800 text-sm font-medium break-all"
              >
                hello@secondhandempire.com
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold text-vintage-900 mb-6">Send Us a Message</h2>

              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                  <p className="font-medium">Message sent successfully!</p>
                  <p className="text-sm mt-1">We&apos;ll get back to you within 1-2 business days.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                  <p className="font-medium">Oops! Something went wrong.</p>
                  <p className="text-sm mt-1">Please try again or email us directly.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="John Smith"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    What is this about? *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="shop_owner">I&apos;m a Shop Owner</option>
                    <option value="technical">Technical Issue</option>
                    <option value="listing">Report a Listing Issue</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback or Suggestion</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Brief summary of your message"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  We typically respond within 1-2 business days
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
