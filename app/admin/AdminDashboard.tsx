'use client'

import Link from 'next/link'
import {
  ClockIcon,
  PhotoIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  pendingEvents: number
  pendingGuestbook: number
  pendingClaims: number
  totalListings: number
  totalUsers: number
  totalEvents: number
}

interface AdminDashboardProps {
  stats: DashboardStats
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  const totalPending = stats.pendingEvents + stats.pendingGuestbook + stats.pendingClaims

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-vintage-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage content, users, and site operations</p>
        </div>

        {/* Alert for Pending Items */}
        {totalPending > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  {totalPending} {totalPending === 1 ? 'item' : 'items'} awaiting moderation
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    {stats.pendingEvents > 0 && <li>{stats.pendingEvents} sale listings</li>}
                    {stats.pendingGuestbook > 0 && <li>{stats.pendingGuestbook} guestbook entries</li>}
                    {stats.pendingClaims > 0 && <li>{stats.pendingClaims} listing claims</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Listings"
            value={stats.totalListings}
            icon={<BuildingStorefrontIcon className="h-8 w-8" />}
            color="blue"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<UsersIcon className="h-8 w-8" />}
            color="green"
          />
          <StatCard
            title="Approved Events"
            value={stats.totalEvents}
            icon={<CalendarIcon className="h-8 w-8" />}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-vintage-900 mb-4">Moderation Queue</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard
              title="Moderate Sales"
              description="Review and approve yard & estate sale listings"
              icon={<CalendarIcon className="h-6 w-6" />}
              badge={stats.pendingEvents}
              href="/admin/moderate/events"
              color="yellow"
            />
            <ActionCard
              title="Moderate Guestbook"
              description="Review customer finds and photos"
              icon={<PhotoIcon className="h-6 w-6" />}
              badge={stats.pendingGuestbook}
              href="/admin/moderate/guestbook"
              color="blue"
            />
            <ActionCard
              title="Review Claims"
              description="Verify shop owner claim requests"
              icon={<BuildingStorefrontIcon className="h-6 w-6" />}
              badge={stats.pendingClaims}
              href="/admin/moderate/claims"
              color="green"
            />
          </div>
        </div>

        {/* Management Sections */}
        <div>
          <h2 className="text-2xl font-bold text-vintage-900 mb-4">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ManagementCard
              title="Users"
              description="Manage user accounts"
              href="/admin/users"
            />
            <ManagementCard
              title="Listings"
              description="Edit shop listings"
              href="/admin/listings"
            />
            <ManagementCard
              title="Tags"
              description="Manage tag taxonomy"
              href="/admin/tags"
            />
            <ManagementCard
              title="Analytics"
              description="View site statistics"
              href="/admin/analytics"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-vintage-900">{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function ActionCard({
  title,
  description,
  icon,
  badge,
  href,
  color
}: {
  title: string
  description: string
  icon: React.ReactNode
  badge?: number
  href: string
  color: 'yellow' | 'blue' | 'green'
}) {
  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    green: 'bg-green-100 text-green-700 border-green-300',
  }

  return (
    <Link href={href} className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {badge !== undefined && badge > 0 && (
          <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full bg-red-500 text-white text-xs font-bold">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-vintage-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  )
}

function ManagementCard({
  title,
  description,
  href
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href} className="card hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-bold text-vintage-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  )
}
