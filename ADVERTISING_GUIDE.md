# Advertising & Monetization Guide

## Overview

The site supports two types of advertising:

1. **Display Ads (Google AdSense)** - For general revenue
2. **Banner Ads** - Premium local shop advertising with geographic targeting

---

## 🎯 Strategic Ad Placement

We've placed ads strategically to maximize revenue without hurting user experience:

### Where Ads Appear

**Directory Page:**
- Top banner (728×90 or responsive)
- Sidebar banner (300×250)
- Between every 6 listings (native-style)

**Individual Shop Pages:**
- Sidebar banner
- Below shop details

**State/City Pages:**
- Top banner
- Sidebar banner (targeted to that region!)

**Yard/Estate Sales:**
- Between listings
- Sidebar

**Homepage:**
- Below hero section
- Above footer

### Where Ads DON'T Appear
- ❌ Login/signup pages (bad UX)
- ❌ Admin dashboard
- ❌ Payment/checkout flows (when you add them)
- ❌ More than 2 ads visible at once

---

## 💰 Display Ads (Google AdSense)

### Setup (One Time - 15 minutes)

1. **Apply for Google AdSense**
   - Go to https://www.google.com/adsense
   - Apply with your domain
   - Wait for approval (1-2 weeks)

2. **Add Your Publisher ID**
   - Get your AdSense publisher ID (ca-pub-XXXXXXXXXX)
   - Add to `.env`:
     ```
     NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX
     ```

3. **Create Ad Units**
   - In AdSense dashboard, create ad units:
     - Homepage Banner (responsive)
     - Sidebar Ad (300×250)
     - In-content Ad (responsive)
   - Copy the "data-ad-slot" IDs

4. **Add to Your Site**
   Edit the pages where you want ads:

   **Example: Directory Page**
   ```typescript
   // app/directory/page.tsx
   import DisplayAd from '@/components/ads/DisplayAd'

   // In your component:
   <DisplayAd slot="1234567890" format="auto" />
   ```

### Estimated Revenue

**With 10,000 monthly visitors:**
- Conservative: $100-300/month
- Average: $300-800/month
- Optimistic: $800-1,500/month

**With 50,000 monthly visitors:**
- Conservative: $500-1,500/month
- Average: $1,500-4,000/month
- Optimistic: $4,000-7,500/month

*Depends on niche, geography, and ad quality*

---

## 🏪 Banner Ads (Premium Local Advertising)

### The Business Model

Local shops can purchase banner ad space that shows:
- Only in their state/city
- On relevant pages (directory, location pages)
- For a set time period (30/60/90 days)

### Pricing Strategy

**Suggested Pricing:**
- **City-level targeting:** $50-100/month
- **State-level targeting:** $150-300/month
- **National (no targeting):** $500-1,000/month

**Positions:**
- Top banner (most visible): +50% premium
- Sidebar (good visibility): Standard price
- Content (contextual): Standard price

### Setup for Shop Owners

**When a shop wants to advertise:**

1. **They contact you or buy via form**
2. **You (admin) add the banner:**
   - Go to `/admin/ads`
   - Upload their banner image
   - Set targeting (CA + Los Angeles)
   - Set dates (30 days)
   - Activate

3. **Banner shows automatically:**
   - Only to users browsing that area
   - Rotates with other ads
   - Tracks clicks and impressions

### Geographic Targeting Example

Shop in Los Angeles purchases an ad:
```
Target States: ['CA']
Target Cities: ['Los Angeles']
```

**Shows on:**
- ✅ /locations/california (state page)
- ✅ /locations/california/los-angeles (city page)
- ✅ /directory?state=CA&city=Los%20Angeles (filtered directory)
- ❌ /locations/new-york (different state)
- ❌ /locations/california/san-diego (different city)

---

## 📊 Ad Performance Tracking

### Analytics Included

**Banner Ads:**
- Impressions (how many times shown)
- Clicks (how many clicked)
- CTR (click-through rate)
- Geographic distribution

**Access via:**
```
/admin/ads
```

### What to Track
- Which positions perform best
- Which cities generate most clicks
- What CTR is normal (2-5% is good)
- When to increase prices

---

## 🎨 Ad Placement Examples

### Homepage
```typescript
// app/page.tsx
import DisplayAd from '@/components/ads/DisplayAd'
import BannerAd from '@/components/ads/BannerAd'

export default function HomePage() {
  return (
    <div>
      {/* Hero section */}
      <HeroSection />

      {/* Display ad after hero */}
      <DisplayAd
        slot="1234567890"
        format="horizontal"
        className="my-8"
      />

      {/* Features */}
      <FeaturesSection />

      {/* National banner ad */}
      <BannerAd
        position="content"
        className="my-8"
      />
    </div>
  )
}
```

### State Page (with targeting)
```typescript
// app/locations/[state]/page.tsx
import BannerAd from '@/components/ads/BannerAd'

export default function StatePage({ params }) {
  const state = params.state.toUpperCase()

  return (
    <div>
      {/* Top banner - shows ads targeting this state */}
      <BannerAd
        position="top"
        state={state}
        className="mb-6"
      />

      {/* Content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {/* City listings */}
        </div>

        <aside>
          {/* Sidebar banner - also state-targeted */}
          <BannerAd
            position="sidebar"
            state={state}
          />

          {/* Display ad below */}
          <DisplayAd
            slot="9876543210"
            format="vertical"
            className="mt-4"
          />
        </aside>
      </div>
    </div>
  )
}
```

### City Page (most targeted)
```typescript
// app/locations/[state]/[city]/page.tsx
export default function CityPage({ params }) {
  const state = params.state.toUpperCase()
  const city = params.city.replace(/-/g, ' ')

  return (
    <div>
      {/* Hyper-targeted banner */}
      <BannerAd
        position="top"
        state={state}
        city={city}
        className="mb-6"
      />

      {/* Shop listings with ads mixed in */}
    </div>
  )
}
```

---

## 💡 Best Practices

### Do's ✅
- Place ads naturally in content flow
- Use geographic targeting for local relevance
- Limit to 2-3 ads per page
- Make ads clearly labeled as "Sponsored"
- Optimize for mobile (responsive ads)
- A/B test different positions

### Don'ts ❌
- Don't place ads above the fold exclusively
- Don't use pop-ups or interstitials
- Don't show ads on legal pages (terms, privacy)
- Don't fake organic content styling
- Don't slow down page load times

---

## 📈 Revenue Projections

### Month 1-3 (Building Traffic)
- Display Ads: $100-500/month
- Banner Ads: $0-200/month (few shops)
- **Total: $100-700/month**

### Month 6-12 (Growing)
- Display Ads: $500-2,000/month
- Banner Ads: $500-2,000/month (10-20 shops)
- **Total: $1,000-4,000/month**

### Year 2+ (Established)
- Display Ads: $2,000-5,000/month
- Banner Ads: $2,000-10,000/month (50+ shops)
- **Total: $4,000-15,000/month**

---

## 🔧 Implementation Checklist

**Phase 1: Display Ads (Week 1)**
- [ ] Apply for Google AdSense
- [ ] Get approved
- [ ] Add publisher ID to .env
- [ ] Create ad units in AdSense
- [ ] Add DisplayAd components to key pages
- [ ] Test and verify ads show

**Phase 2: Banner Ads (Month 2-3)**
- [ ] Run banner_ads migration
- [ ] Build admin interface for adding banners
- [ ] Create pricing page for shops
- [ ] Add BannerAd components to location pages
- [ ] Reach out to first 5-10 shops
- [ ] Run first banner campaign

**Phase 3: Optimization (Ongoing)**
- [ ] Track which positions perform best
- [ ] A/B test different placements
- [ ] Adjust pricing based on demand
- [ ] Create self-service banner purchase flow
- [ ] Add more targeting options

---

## 🎯 Where to Add Ads (Specific Files)

**High-Priority Pages:**
1. `/app/directory/page.tsx` - Main directory (high traffic)
2. `/app/locations/[state]/page.tsx` - State pages
3. `/app/locations/[state]/[city]/page.tsx` - City pages
4. `/app/page.tsx` - Homepage

**Medium-Priority:**
5. `/app/yard-sales/page.tsx` - Yard sales listing
6. `/app/estate-sales/page.tsx` - Estate sales listing
7. `/app/directory/[id]/page.tsx` - Individual shop pages

**Low-Priority:**
8. `/app/reference/page.tsx` - Reference library
9. `/app/about/page.tsx` - About page

---

## 📞 Selling Banner Ads

**Email Template for Local Shops:**

```
Subject: Advertise Your Shop to Local Treasure Hunters

Hi [Shop Owner],

I noticed you run [Shop Name] in [City]. We're launching a vintage
marketplace platform that's already getting [X] visitors/month from
people looking for antique shops in [City].

We're offering featured banner advertising that shows ONLY to people
browsing shops in [City/State]. Your ad would appear on:

• The [City] directory page
• [State] location pages
• Filtered search results

Pricing: $XX/month for 30 days
Includes: Click tracking, impression analytics

Interested? Reply and I'll send specs for your banner image.

Best,
[Your Name]
```

---

## 🚀 Quick Start (After Launch)

**Week 1:** Get AdSense approved (apply immediately!)
**Week 2-3:** Add DisplayAd components to top 5 pages
**Week 4:** Email 10 local shops about banner ads
**Month 2:** First banner ad revenue!

**The infrastructure is ready - you just need to activate it!**
