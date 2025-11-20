# Deployment Guide - Secondhand Finds

Complete step-by-step guide for deploying your vintage marketplace to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)
- Google account (for Places API and AdSense)
- Domain name (optional, Vercel provides free subdomain)

## Part 1: Supabase Setup (15 minutes)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name:** secondhand-finds
   - **Database Password:** (generate strong password - save this!)
   - **Region:** Choose closest to your target audience
4. Click "Create new project" (takes ~2 minutes)

### 1.2 Run Database Migrations

1. In your Supabase project, go to **SQL Editor**
2. Run each migration file in order:
   - `supabase/migrations/20250101000000_initial_schema.sql`
   - `supabase/migrations/20250102000000_banner_ads.sql`
   - `supabase/migrations/20250103000000_analytics_and_emails.sql`
   - `supabase/migrations/20250104000000_reference_library.sql`

3. To run each migration:
   - Click "New Query"
   - Copy/paste the entire contents of the migration file
   - Click "Run"
   - Wait for success message

**IMPORTANT:** Run migrations in order! Later migrations depend on earlier ones.

### 1.3 Enable PostGIS Extension

1. In SQL Editor, run:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 1.4 Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values (you'll need them soon):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role** key (only use this server-side!)

### 1.5 Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (should be on by default)
3. Enable **Google** provider:
   - Get OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase
4. Enable **Facebook** provider (optional):
   - Get credentials from [Facebook Developers](https://developers.facebook.com/)
   - Add OAuth redirect URI
   - Copy App ID and Secret to Supabase

### 1.6 Configure Storage (for future photo uploads)

1. Go to **Storage**
2. Create buckets:
   - `shop-photos` (public)
   - `sale-photos` (public)
   - `guestbook-photos` (public)
   - `reference-photos` (public)

## Part 2: Vercel Deployment (10 minutes)

### 2.1 Push Code to GitHub

If you haven't already:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2.2 Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `Secondhand` repository
4. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

### 2.3 Set Environment Variables

Click "Environment Variables" and add:

```bash
# Supabase (from Part 1.4)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Google Places API (get from Google Cloud Console)
GOOGLE_PLACES_API_KEY=your-api-key-here

# Email (Resend - get from resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Google AdSense (get when you enable AdSense)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx

# Analytics (optional - for tracking)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

**Note:** Only add the ones you have now. You can add AdSense and Analytics later.

### 2.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://secondhand-xxxx.vercel.app`

### 2.5 Update Supabase with Vercel URL

1. Go back to Supabase → **Authentication** → **URL Configuration**
2. Add your Vercel URL to:
   - **Site URL:** `https://secondhand-xxxx.vercel.app`
   - **Redirect URLs:** Add `https://secondhand-xxxx.vercel.app/**`

## Part 3: Google Services Setup

### 3.1 Google Places API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Secondhand Finds"
3. Enable these APIs:
   - **Places API**
   - **Geocoding API**
   - **Maps JavaScript API** (if you add maps later)
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Restrict the API key:
   - **Application restrictions:** HTTP referrers
   - Add your domains: `secondhand-xxxx.vercel.app`, `localhost:3000`
   - **API restrictions:** Limit to Places API, Geocoding API
6. Copy API key → Add to Vercel environment variables
7. Redeploy: Vercel dashboard → your project → "Redeploy"

### 3.2 Google AdSense (Wait for Traffic)

**Don't do this until you have:**
- At least 100 listings
- Regular traffic (500+ visitors/month)
- Original content (blog posts, guides)

When ready:
1. Go to [adsense.google.com](https://adsense.google.com/)
2. Sign up and add your site
3. Add AdSense code to your site (already integrated in components)
4. Wait for approval (1-2 weeks)

## Part 4: Create Your Admin Account

### 4.1 Sign Up

1. Go to your deployed site
2. Click "Sign Up"
3. Create account with your email
4. Verify email

### 4.2 Make Yourself Admin

1. Go to Supabase → **Table Editor** → `users` table
2. Find your user record
3. Change `account_type` from `user` to `admin`
4. Save

Now you can access `/admin` on your site!

## Part 5: Populate Initial Data

### 5.1 Import Shops via Google Places

On your local machine (once laptop arrives):

```bash
# Install dependencies
npm install

# Import shops for a city
npm run import:places "Antique Shops" "Portland, OR" 50

# Import different types
npm run import:places "Thrift Stores" "Seattle, WA" 30
npm run import:places "Flea Markets" "Los Angeles, CA" 20
```

See `DATA_COLLECTION.md` for detailed instructions.

### 5.2 Add Reference Library Content

Start with popular categories:

1. **Depression Glass:**
   - Find Wikipedia articles
   - Use book references
   - Credit sources properly

2. **Popular Makers:**
   - Wedgwood
   - Roseville
   - Pyrex
   - Fiesta

3. **Get Images:**
   - Use public domain sources
   - Museums (many have free use images)
   - Government archives
   - Always credit source

**Pro Tip:** Start with 10-20 popular makers and 50-100 patterns. This gives you enough for SEO but is manageable to curate.

### 5.3 Seed Some Yard Sales

To test the system and show how it works:
1. Post 5-10 upcoming yard sales manually
2. Use different dates/times
3. Add realistic photos
4. Moderate them yourself in admin panel

## Part 6: Custom Domain (Optional)

### 6.1 Purchase Domain

Buy from:
- Namecheap
- Google Domains
- GoDaddy
- Cloudflare

Suggested: `secondhandfinds.com` or `vintagefinds.co`

### 6.2 Connect to Vercel

1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your custom domain
3. Vercel will provide DNS records
4. Add records to your domain provider:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com
5. Wait for DNS propagation (5 minutes - 24 hours)

### 6.3 Update URLs

Update in Supabase **Authentication** settings:
- Site URL: `https://yourdomain.com`
- Redirect URLs: `https://yourdomain.com/**`

## Part 7: Email System Setup (Resend)

### 7.1 Create Resend Account

1. Go to [resend.com](https://resend.com/)
2. Sign up (free tier: 100 emails/day)
3. Verify your sending domain (optional but recommended)

### 7.2 Get API Key

1. Resend Dashboard → **API Keys**
2. Create key with send permission
3. Add to Vercel: `RESEND_API_KEY=re_xxxx`

### 7.3 Test Emails

The system sends:
- Welcome emails (new users)
- Monthly stats (shop owners)
- Weekly digest (subscribers)
- Rejection notices (moderated content)

Test by signing up a new account and checking your inbox.

## Part 8: Monitoring & Analytics

### 8.1 Vercel Analytics

1. Vercel Dashboard → Your Project → **Analytics**
2. Enable (free for hobby projects)
3. View traffic, performance metrics

### 8.2 Google Analytics (Optional)

1. Create GA4 property at [analytics.google.com](https://analytics.google.com/)
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to Vercel env vars: `NEXT_PUBLIC_GA_TRACKING_ID`
4. Redeploy

### 8.3 Supabase Logs

Monitor database:
- **Logs** → View queries, errors
- **Database** → Performance insights
- **API** → Usage stats

## Part 9: Launch Checklist

Before announcing your site:

- [ ] At least 50 shop listings populated
- [ ] 10-20 reference library makers
- [ ] 50-100 reference patterns with photos
- [ ] About page filled with your story
- [ ] Contact form working
- [ ] Test user signup/login
- [ ] Test posting a yard sale
- [ ] Test guestbook entry
- [ ] Admin moderation working
- [ ] Email notifications working
- [ ] Mobile responsive (test on phone)
- [ ] SEO meta tags set
- [ ] Google Search Console setup
- [ ] Social media accounts created
- [ ] Privacy policy reviewed
- [ ] Terms of service reviewed

## Part 10: Post-Launch Growth

### Week 1:
- Submit to Google Search Console
- Submit to Bing Webmaster Tools
- Post on local Facebook groups
- Email 10 shops about claiming listings

### Week 2:
- Blog post: "How to Start Antiquing in [Your City]"
- Reference library: Add 10 more makers
- Reach out to local estate sale companies

### Month 1 Goal:
- 200+ shops
- 50+ weekly active users
- 10+ reference library submissions
- 5 shops claimed their listings

### Month 3 Goal:
- 500+ shops
- 200+ weekly users
- Apply for Google AdSense
- Launch premium banner ad program

## Troubleshooting

### "Module not found" errors
```bash
npm install
npm run build
```

### Database connection errors
- Check SUPABASE_URL and ANON_KEY are correct
- Verify migrations ran successfully
- Check Supabase project is active

### OAuth login not working
- Verify redirect URLs in Google/Facebook console
- Check Supabase auth settings
- Try incognito/private browsing

### Images not loading
- Check storage buckets are public
- Verify image URLs are accessible
- Check CORS settings in Supabase

### Emails not sending
- Verify RESEND_API_KEY is set
- Check Resend dashboard for errors
- Verify "from" email is verified domain

## Cost Estimates (Monthly)

**Free Tier (Good for first 6 months):**
- Vercel: $0 (hobby plan)
- Supabase: $0 (500MB database, 2GB bandwidth)
- Resend: $0 (100 emails/day)
- Domain: $12/year (~$1/month)
- **Total: ~$1/month**

**Growing (5,000 users/month):**
- Vercel: $0 (still free)
- Supabase: $25 (Pro plan - more storage)
- Resend: $20 (50k emails/month)
- Domain: $1/month
- **Total: ~$46/month**

**Profitable (50,000 users/month):**
- Vercel: $20 (Pro plan - better performance)
- Supabase: $25-$100 (based on usage)
- Resend: $80-$200 (based on emails)
- Google Maps: $200 (if using maps heavily)
- **Total: ~$325-$540/month**
- **Revenue from AdSense: $500-$2,000/month**

## Next Steps

1. **Run through this guide** when laptop arrives
2. **Populate 50-100 shops** using import script
3. **Add 20-30 reference makers** to start
4. **Soft launch** to friends/family for feedback
5. **Fix any bugs** they find
6. **Public launch** to local community
7. **Scale gradually** based on traffic

## Support

If you run into issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Review browser console for errors
4. Check environment variables are set correctly

Remember: Deploy early, iterate often. Don't wait for perfection!

---

**Estimated Time to Deploy:**
- Part 1 (Supabase): 15 minutes
- Part 2 (Vercel): 10 minutes
- Part 3 (Google): 20 minutes
- Part 4 (Admin): 5 minutes
- **Total: ~50 minutes to live site**

You can do Parts 5-10 after initial deployment.
