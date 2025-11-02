# Secondhand Finds - Vintage Marketplace Platform

A comprehensive vintage and antique marketplace website built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🎯 Overview

Secondhand Finds is a platform connecting vintage enthusiasts with:
- Antique shops, thrift stores, and consignment shops
- Yard sales and garage sales
- Estate sales
- A reference library for identifying vintage items
- Community guestbook for sharing finds

## ✨ Features

### Core Features (Phase 1)
- ✅ **Shop Directory** - Browse and search antique shops, thrift stores, flea markets, etc.
- ✅ **Yard Sale Listings** - User-submitted yard sales with photos and details
- ✅ **Estate Sale Section** - Professional estate sales with extensive photo galleries
- ✅ **Tag System** - Auto-suggest tags with usage tracking (10-15 tags per listing)
- ✅ **User Authentication** - Email and social login (Google, Facebook)
- ✅ **Guestbook System** - Share finds with photos and social media links

### Upcoming Features (Phase 2)
- 🔄 Route Optimizer - Smart routing for multiple sales with custom stops
- 🔄 Reference Library - Knowledge base for hallmarks, makers, patterns
- 🔄 ID.me Verification - Verified badges for shop owners
- 🔄 Nested Listings - Vendors within flea markets
- 🔄 Moderation Queue - Admin panel for content review

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom vintage color palette
- **Database**: Supabase (PostgreSQL with PostGIS for geo queries)
- **Authentication**: Supabase Auth (email + OAuth)
- **Hosting**: Vercel (recommended)
- **State Management**: Zustand
- **Date Utilities**: date-fns
- **Icons**: Heroicons

## 📁 Project Structure

```
├── app/                      # Next.js app directory
│   ├── auth/                 # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   ├── directory/            # Shop directory
│   │   └── [id]/             # Individual shop pages
│   ├── yard-sales/           # Yard sale listings
│   ├── estate-sales/         # Estate sale listings (to be built)
│   ├── reference/            # Reference library (to be built)
│   ├── post-sale/            # Sale posting form
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/               # Reusable components
│   ├── Navigation.tsx        # Main navigation
│   └── TagInput.tsx          # Tag input with auto-suggest
├── lib/                      # Utility libraries
│   └── supabase.ts           # Supabase client
├── types/                    # TypeScript types
│   ├── database.ts           # Database types
│   └── index.ts              # App types
├── supabase/                 # Supabase configuration
│   └── migrations/           # Database migrations
└── public/                   # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account
- (Optional) Google Maps API key for route optimizer
- (Optional) ID.me credentials for verification

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Secondhand
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new Supabase project at [supabase.com](https://supabase.com)

   b. Enable PostGIS extension in your Supabase project:
      - Go to Database → Extensions
      - Search for "postgis" and enable it

   c. Run the migration:
      - Go to SQL Editor in Supabase
      - Copy the contents of `supabase/migrations/20250101000000_initial_schema.sql`
      - Execute the SQL

   d. Configure Authentication:
      - Go to Authentication → Providers
      - Enable Email provider
      - Enable Google OAuth (optional)
      - Enable Facebook OAuth (optional)
      - Set up redirect URLs: `http://localhost:3000/auth/callback`

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Tables

- **users** - User accounts (extends Supabase auth.users)
- **listings** - Shop directory entries (antique shops, thrift stores, etc.)
- **events** - Yard sales and estate sales
- **tags** - Reusable tags with usage counting
- **listing_tags** - Many-to-many relationship for listing tags
- **event_tags** - Many-to-many relationship for event tags
- **guestbook_entries** - Customer finds and photos
- **routes** - Saved route optimizations (Phase 2)

### Key Features

- Row Level Security (RLS) enabled on all tables
- PostGIS for geospatial queries
- Automatic timestamp updates
- Tag usage counting via triggers
- Nested listings support (parent_id for vendors in flea markets)

## 🎨 Design System

### Color Palette
The app uses a custom "vintage" color palette:
- vintage-50 to vintage-900 (warm, antique-inspired colors)
- Base colors range from cream (#faf8f3) to deep brown (#5a442b)

### Components
Reusable Tailwind CSS components:
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.card` - Content cards with shadow
- `.input-field` - Form inputs

## 🔐 Authentication

Users can sign up/login via:
- Email and password
- Google OAuth
- Facebook OAuth

After authentication, users can:
- Post yard sales and estate sales
- Claim shop listings
- Add guestbook entries
- Save route optimizations (Phase 2)

## 🗺️ SEO Strategy

- State-level pillar pages (to be built)
- Individual shop pages with rich metadata
- Fresh content from yard sales and announcements
- Structured data for local businesses
- Social media integration for user-generated content

## 📱 Responsive Design

The platform is fully responsive:
- Mobile-first approach
- Hamburger menu on mobile
- Grid layouts adapt to screen size
- Touch-friendly interactions

## 🚧 Roadmap

### Phase 1 (Complete)
- [x] Basic Next.js setup
- [x] Supabase integration
- [x] Authentication
- [x] Shop directory
- [x] Yard sale listings
- [x] Tag system
- [x] Basic UI/UX

### Phase 2 (In Progress)
- [ ] Estate sale pages
- [ ] Reference library structure
- [ ] Route optimizer
- [ ] Photo upload functionality
- [ ] Moderation dashboard

### Phase 3 (Future)
- [ ] ID.me verification
- [ ] Featured listings (monetization)
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced search with filters
- [ ] Saved searches and alerts

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the project owner.

## 📄 License

All rights reserved. This project is proprietary and confidential.

## 🆘 Support

For issues or questions:
1. Check the documentation in this README
2. Review the code comments
3. Check Supabase logs for database issues
4. Contact the development team

## 🎯 Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically:
- Build your Next.js app
- Set up preview deployments for PRs
- Enable edge functions
- Configure custom domains

### Post-Deployment

1. Update Supabase redirect URLs to include production domain
2. Configure social OAuth providers with production URLs
3. Set up custom domain (optional)
4. Enable analytics (Vercel Analytics recommended)

## 📝 Notes

- All user-generated content goes through moderation (pending → approved/rejected)
- Shop listings can be claimed by owners for verification
- Tags are shared across listings and events
- Geographic data uses PostGIS for efficient queries
- Images should be uploaded to Supabase Storage (to be implemented)

---

**Built with ❤️ for vintage enthusiasts**
