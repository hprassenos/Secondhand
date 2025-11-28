import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-vintage-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-vintage-900 mb-4">
            Sale Posted Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Your sale has been submitted and is pending review. We&apos;ll review it within 24 hours and
            notify you once it&apos;s live.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/yard-sales" className="btn-primary">
              Browse Sales
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
