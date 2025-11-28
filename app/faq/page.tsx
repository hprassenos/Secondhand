'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string | React.ReactNode
  category: string
}

const faqs: FAQItem[] = [
  // General
  {
    category: 'General',
    question: 'What is Secondhand Finds?',
    answer: 'Secondhand Finds is a comprehensive directory and platform for vintage enthusiasts. We help you discover antique shops, thrift stores, yard sales, estate sales, and connect with a community of collectors.',
  },
  {
    category: 'General',
    question: 'Is Secondhand Finds free to use?',
    answer: 'Yes! Browsing listings, searching for shops, and viewing yard/estate sales is completely free. Shop owners can claim their listings for free as well. We may offer premium features in the future.',
  },
  {
    category: 'General',
    question: 'What areas do you cover?',
    answer: 'We cover the entire United States and are constantly adding more listings. If you don\'t see shops in your area yet, help us grow by submitting listings or encouraging local shops to claim their profiles!',
  },

  // For Shoppers
  {
    category: 'For Shoppers',
    question: 'How do I find shops near me?',
    answer: (
      <>
        Use our <Link href="/directory" className="text-vintage-600 hover:text-vintage-700">Shop Directory</Link> and filter by state and city.
        You can also browse by location using our <Link href="/locations/states" className="text-vintage-600 hover:text-vintage-700">location pages</Link>.
      </>
    ),
  },
  {
    category: 'For Shoppers',
    question: 'Can I save shops or searches?',
    answer: 'This feature is coming soon! Create an account now to be ready when we launch saved searches, favorite shops, and personalized recommendations.',
  },
  {
    category: 'For Shoppers',
    question: 'How do I share my finds?',
    answer: (
      <>
        Visit any shop page and click &quot;Share Your Find&quot; to add photos and descriptions to the guestbook.
        Your finds will be reviewed and published within 24 hours.
      </>
    ),
  },
  {
    category: 'For Shoppers',
    question: 'How accurate are shop hours and information?',
    answer: 'We do our best to maintain accurate information, but we recommend calling ahead or checking the shop&apos;s website before visiting. Verified and claimed listings are typically more accurate as they&apos;re managed by the shop owners.',
  },

  // Yard & Estate Sales
  {
    category: 'Yard & Estate Sales',
    question: 'How do I post a yard sale?',
    answer: (
      <>
        Click <Link href="/post-sale" className="text-vintage-600 hover:text-vintage-700">Post a Sale</Link> in the navigation,
        fill out the form with your sale details, and we&apos;ll review and publish it within 24 hours. It&apos;s completely free!
      </>
    ),
  },
  {
    category: 'Yard & Estate Sales',
    question: 'What&apos;s the difference between yard sales and estate sales?',
    answer: 'Yard sales are typically one-day or weekend sales by individuals. Estate sales are usually multi-day professional sales with extensive inventory, posted weeks in advance with detailed photo galleries.',
  },
  {
    category: 'Yard & Estate Sales',
    question: 'How far in advance can I post a sale?',
    answer: 'Yard sales can be posted up to 2 weeks in advance. Estate sales can be posted up to 8 weeks in advance, giving collectors more time to plan their visits.',
  },
  {
    category: 'Yard & Estate Sales',
    question: 'Can I edit my sale after posting?',
    answer: 'Yes! Log in to your account, go to your posted sales, and you can edit details, add photos, or cancel the sale if needed.',
  },

  // For Shop Owners
  {
    category: 'For Shop Owners',
    question: 'How do I claim my shop listing?',
    answer: (
      <>
        Find your shop in our <Link href="/directory" className="text-vintage-600 hover:text-vintage-700">directory</Link>,
        click &quot;Claim This Listing,&quot; and follow the verification process. We&apos;ll review your claim within 1-2 business days.
      </>
    ),
  },
  {
    category: 'For Shop Owners',
    question: 'What if my shop isn&apos;t listed yet?',
    answer: 'Contact us to add your shop! We&apos;re constantly expanding our directory and are happy to add new businesses.',
  },
  {
    category: 'For Shop Owners',
    question: 'What are the benefits of claiming my listing?',
    answer: 'Claimed shops can: update business information, manage photos, get a verified badge, respond to guestbook entries, post announcements, and access analytics about listing views.',
  },
  {
    category: 'For Shop Owners',
    question: 'How much does it cost?',
    answer: 'Basic listings and claiming your shop is completely free. We may offer premium features like featured placement and enhanced listings in the future.',
  },
  {
    category: 'For Shop Owners',
    question: 'Can I remove or hide my listing?',
    answer: 'Yes. Once you&apos;ve claimed your listing, you can request to have it unpublished at any time through your account settings or by contacting us.',
  },

  // Technical
  {
    category: 'Technical',
    question: 'Do I need an account?',
    answer: 'No account is needed to browse shops and sales. You&apos;ll need to create a free account to post sales, share finds in guestbooks, save searches, or claim a shop listing.',
  },
  {
    category: 'Technical',
    question: 'Is my information secure?',
    answer: (
      <>
        Yes. We use industry-standard security measures to protect your data. Read our full{' '}
        <Link href="/privacy" className="text-vintage-600 hover:text-vintage-700">Privacy Policy</Link> for details.
      </>
    ),
  },
  {
    category: 'Technical',
    question: 'What browsers do you support?',
    answer: 'Secondhand Finds works on all modern browsers including Chrome, Firefox, Safari, and Edge. We also have a mobile-responsive design for browsing on phones and tablets.',
  },

  // Reference Library
  {
    category: 'Reference Library',
    question: 'What is the Reference Library?',
    answer: 'Our Reference Library will be a comprehensive resource for identifying hallmarks, makers marks, patterns, and learning about vintage items. We&apos;re currently building this section.',
  },
  {
    category: 'Reference Library',
    question: 'Can I contribute to the Reference Library?',
    answer: (
      <>
        Yes! If you have expertise in antiques or vintage items, we&apos;d love your help.{' '}
        <Link href="/contact" className="text-vintage-600 hover:text-vintage-700">Contact us</Link> to learn about contributing.
      </>
    ),
  },

  // Route Optimizer
  {
    category: 'Route Optimizer',
    question: 'What is the Route Optimizer?',
    answer: 'The Route Optimizer (coming soon) will help you plan efficient routes to visit multiple yard sales and estate sales. It prioritizes sales ending soonest and can include custom stops like banks or stores.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))]
  const filteredFAQs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory)

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-vintage-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about Secondhand Finds
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-vintage-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-vintage-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="card">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-start justify-between text-left"
              >
                <div className="flex-1 pr-4">
                  <span className="text-xs text-vintage-600 font-medium">
                    {faq.category}
                  </span>
                  <h3 className="text-lg font-bold text-vintage-900 mt-1">
                    {faq.question}
                  </h3>
                </div>
                {openIndex === index ? (
                  <ChevronUpIcon className="h-5 w-5 text-vintage-600 flex-shrink-0 mt-1" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                )}
              </button>

              {openIndex === index && (
                <div className="mt-4 pt-4 border-t border-vintage-200">
                  <p className="text-gray-700">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 card bg-vintage-100 border-vintage-300 text-center">
          <h2 className="text-2xl font-bold text-vintage-900 mb-3">
            Still Have Questions?
          </h2>
          <p className="text-gray-700 mb-6">
            Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
