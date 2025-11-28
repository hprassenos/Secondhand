import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://secondhandfinds.com'

  // Return minimal sitemap if Supabase credentials are not available (e.g., during local builds)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/yard-sales`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/estate-sales`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reference`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/route-optimizer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Location pages - States
  const { data: stateData } = await (supabase
    .from('listings') as any)
    .select('state')
    .order('state')

  const states = [...new Set(stateData?.map((l: any) => l.state) || [])]
  const statePages: MetadataRoute.Sitemap = states.map((state: any) => ({
    url: `${baseUrl}/locations/${state.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Location pages - Cities
  const { data: cityData } = await (supabase
    .from('listings') as any)
    .select('state, city')
    .order('state, city')

  const cities = cityData || []
  const cityPages: MetadataRoute.Sitemap = cities.map(({ state, city }: any) => ({
    url: `${baseUrl}/locations/${state.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Individual listings
  const { data: listings } = await (supabase
    .from('listings') as any)
    .select('id, updated_at')
    .limit(5000) // Limit to avoid huge sitemaps

  const listingPages: MetadataRoute.Sitemap =
    listings?.map((listing: any) => ({
      url: `${baseUrl}/directory/${listing.id}`,
      lastModified: new Date(listing.updated_at || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.6,
    })) || []

  // Reference library categories
  const { data: categories } = await (supabase
    .from('reference_categories') as any)
    .select('slug, updated_at')

  const categoryPages: MetadataRoute.Sitemap =
    categories?.map((cat: any) => ({
      url: `${baseUrl}/reference/category/${cat.slug}`,
      lastModified: new Date(cat.updated_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    })) || []

  // Reference library makers
  const { data: makers } = await (supabase
    .from('reference_makers') as any)
    .select('slug, updated_at')
    .limit(1000)

  const makerPages: MetadataRoute.Sitemap =
    makers?.map((maker: any) => ({
      url: `${baseUrl}/reference/maker/${maker.slug}`,
      lastModified: new Date(maker.updated_at),
      changeFrequency: 'monthly',
      priority: 0.7,
    })) || []

  // Reference library patterns
  const { data: patterns } = await (supabase
    .from('reference_patterns') as any)
    .select('slug, maker:reference_makers(slug), updated_at')
    .limit(2000)

  const patternPages: MetadataRoute.Sitemap =
    patterns
      ?.filter((p: any) => p.maker && p.maker.slug)
      .map((pattern: any) => ({
        url: `${baseUrl}/reference/pattern/${pattern.maker.slug}--${pattern.slug}`,
        lastModified: new Date(pattern.updated_at),
        changeFrequency: 'monthly',
        priority: 0.6,
      })) || []

  // Combine all pages
  return [
    ...staticPages,
    ...statePages,
    ...cityPages,
    ...listingPages,
    ...categoryPages,
    ...makerPages,
    ...patternPages,
  ]
}
