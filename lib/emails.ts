/**
 * Email Templates and Sending Infrastructure
 *
 * Uses Resend (https://resend.com) for transactional emails
 * Free tier: 3,000 emails/month
 *
 * To use:
 * 1. Sign up at resend.com
 * 2. Add RESEND_API_KEY to .env
 * 3. Verify your domain
 */

import { supabase } from '@/lib/supabase'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'hello@secondhandfinds.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://secondhandfinds.com'

interface EmailData {
  [key: string]: any
}

// Email Templates
const templates = {
  welcome: {
    subject: 'Welcome to Secondhand Finds!',
    html: (data: EmailData) => `
      <h1>Welcome to Secondhand Finds!</h1>
      <p>Hi${data.name ? ` ${data.name}` : ''},</p>
      <p>Thanks for joining our community of vintage enthusiasts! We're excited to help you discover amazing treasures.</p>

      <h2>Get Started:</h2>
      <ul>
        <li><a href="${SITE_URL}/directory">Browse Antique Shops</a> in your area</li>
        <li><a href="${SITE_URL}/yard-sales">Find Yard Sales</a> happening this weekend</li>
        <li><a href="${SITE_URL}/estate-sales">Discover Estate Sales</a> with detailed photos</li>
      </ul>

      <p>Happy treasure hunting!</p>
      <p>The Secondhand Finds Team</p>
    `
  },

  shop_welcome: {
    subject: 'Welcome! Your Shop is Now on Secondhand Finds',
    html: (data: EmailData) => `
      <h1>Welcome, ${data.shopName}!</h1>
      <p>Your shop is now listed on Secondhand Finds and is visible to thousands of vintage enthusiasts.</p>

      <h2>Your Listing Stats:</h2>
      <p><a href="${SITE_URL}/directory/${data.listingId}">View Your Listing</a></p>

      <h2>Next Steps:</h2>
      <ul>
        <li>Update your hours and description</li>
        <li>Add photos of your shop</li>
        <li>Encourage customers to leave finds in your guestbook</li>
      </ul>

      <h2>Boost Your Visibility:</h2>
      <p>Shops in your area are seeing an average of ${data.avgViews || '150'} views per month.
      Want to reach even more customers?</p>
      <p><a href="${SITE_URL}/advertise">Learn about featured placement</a></p>

      <p>Need help? Reply to this email anytime.</p>
    `
  },

  monthly_stats: {
    subject: (data: EmailData) => `📊 ${data.shopName}: ${data.totalViews} views last month`,
    html: (data: EmailData) => `
      <h1>${data.shopName} - Monthly Report</h1>
      <p>Here's how your listing performed in ${data.month}:</p>

      <h2>Overview:</h2>
      <ul>
        <li><strong>${data.totalViews}</strong> total views</li>
        <li><strong>${data.uniqueVisitors}</strong> unique visitors</li>
        <li><strong>${data.clickThroughs}</strong> clicks to your website/phone</li>
        <li><strong>${data.growthPercent > 0 ? '+' : ''}${data.growthPercent}%</strong> vs. last month</li>
      </ul>

      <h2>Where Your Visitors Came From:</h2>
      <ul>
        <li>Top State: ${data.topState}</li>
        <li>Top City: ${data.topCity}</li>
      </ul>

      <h2>Compare to Area Average:</h2>
      <p>Shops in ${data.city} averaged <strong>${data.areaAverage}</strong> views last month.
      You're performing <strong>${data.vsAverage}% ${data.vsAverage > 0 ? 'above' : 'below'}</strong> average!</p>

      ${data.growthPercent < 0 ? `
        <h2>💡 Boost Your Traffic:</h2>
        <p>Shops with regular updates see 40% more views. Try:</p>
        <ul>
          <li>Adding new photos to your listing</li>
          <li>Posting upcoming sales or events</li>
          <li>Encouraging customers to share finds</li>
          <li><a href="${SITE_URL}/advertise">Featured placement</a> (${data.areaAverage * 2}+ views/month)</li>
        </ul>
      ` : ''}

      <p><a href="${SITE_URL}/dashboard">View Full Analytics</a></p>

      <p style="font-size: 12px; color: #666;">
        Don't want monthly reports? <a href="${SITE_URL}/settings/emails">Update preferences</a>
      </p>
    `
  },

  weekly_digest: {
    subject: 'This Week\'s New Yard Sales & Estate Sales',
    html: (data: EmailData) => `
      <h1>Your Weekly Treasure Hunt Digest</h1>
      <p>Hi ${data.name},</p>
      <p>Here's what's happening this week in vintage shopping:</p>

      <h2>🏠 New Yard Sales (${data.yardSales.length})</h2>
      ${data.yardSales.map((sale: any) => `
        <div style="border-left: 3px solid #b8935b; padding-left: 10px; margin: 10px 0;">
          <h3>${sale.title}</h3>
          <p>${sale.city}, ${sale.state} • ${sale.date}</p>
          <p><a href="${SITE_URL}/yard-sales/${sale.id}">View Details</a></p>
        </div>
      `).join('')}

      <h2>🎨 New Estate Sales (${data.estateSales.length})</h2>
      ${data.estateSales.map((sale: any) => `
        <div style="border-left: 3px solid #b8935b; padding-left: 10px; margin: 10px 0;">
          <h3>${sale.title}</h3>
          <p>${sale.city}, ${sale.state} • ${sale.date}</p>
          <p><a href="${SITE_URL}/estate-sales/${sale.id}">View Photos</a></p>
        </div>
      `).join('')}

      <p><a href="${SITE_URL}/route-optimizer">Plan Your Route</a> to hit multiple sales efficiently!</p>

      <p style="font-size: 12px; color: #666;">
        Prefer a different day? <a href="${SITE_URL}/settings/emails">Update preferences</a>
      </p>
    `
  }
}

// Send email function
export async function sendEmail(
  template: keyof typeof templates,
  recipientEmail: string,
  data: EmailData,
  recipientId?: string
) {
  try {
    const emailTemplate = templates[template]
    const subject = typeof emailTemplate.subject === 'function'
      ? emailTemplate.subject(data)
      : emailTemplate.subject
    const html = emailTemplate.html(data)

    // Queue email in database
    await supabase
      .from('email_queue')
      .insert({
        recipient_email: recipientEmail,
        recipient_id: recipientId,
        template,
        subject,
        data,
        status: 'pending'
      })

    // In production, process queue with cron job or background worker
    // For now, send immediately if RESEND_API_KEY exists
    if (RESEND_API_KEY) {
      await sendViaResend(recipientEmail, subject, html)
    }

    return { success: true }
  } catch (err) {
    console.error('Email error:', err)
    return { success: false, error: err }
  }
}

async function sendViaResend(to: string, subject: string, html: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html
    })
  })

  if (!response.ok) {
    throw new Error(`Resend API error: ${response.statusText}`)
  }

  return response.json()
}

// Scheduled jobs (run these with cron or Supabase Edge Functions)

export async function sendMonthlyStatsEmails() {
  // Get all claimed listings
  const { data: listings } = await supabase
    .from('listings')
    .select(`
      id,
      name,
      city,
      state,
      claimed_by,
      users!claimed_by (email, email_preferences)
    `)
    .eq('claimed', true)

  if (!listings) return

  for (const listing of listings) {
    // Check if user wants monthly stats
    const prefs = listing.users?.email_preferences
    if (prefs && !prefs.monthly_stats) continue

    // Get stats
    const { data: stats } = await supabase
      .rpc('get_listing_monthly_stats', {
        p_listing_id: listing.id
      })

    if (!stats || !stats[0]) continue

    const monthlyStats = stats[0]

    // Send email
    await sendEmail(
      'monthly_stats',
      listing.users.email,
      {
        shopName: listing.name,
        listingId: listing.id,
        month: format(new Date(), 'MMMM yyyy'),
        totalViews: monthlyStats.total_views,
        uniqueVisitors: monthlyStats.total_unique_visitors,
        clickThroughs: 0, // TODO: Add to query
        growthPercent: Math.round(monthlyStats.growth_percent),
        topState: monthlyStats.top_state,
        topCity: monthlyStats.top_city,
        city: listing.city,
        areaAverage: 150, // TODO: Calculate actual average
        vsAverage: 10, // TODO: Calculate vs average
      },
      listing.claimed_by
    )
  }
}

export async function sendWeeklyDigests() {
  // Get users who want weekly digest
  const { data: users } = await supabase
    .from('users')
    .select('id, email, email_preferences')
    .eq('email_preferences.weekly_digest', true)

  // Get this week's sales
  const { data: sales } = await supabase
    .from('events')
    .select('*')
    .eq('moderation_status', 'approved')
    .gte('start_time', new Date().toISOString())
    .order('start_time')

  // Group by type
  const yardSales = sales?.filter(s => s.type === 'yard_sale') || []
  const estateSales = sales?.filter(s => s.type === 'estate_sale') || []

  // Send to each user
  for (const user of users || []) {
    await sendEmail(
      'weekly_digest',
      user.email,
      {
        name: user.email.split('@')[0], // Basic name from email
        yardSales: yardSales.slice(0, 5), // Top 5
        estateSales: estateSales.slice(0, 5)
      },
      user.id
    )
  }
}
