// SEO and Structured Data helpers

import { Listing, Event, ReferenceMaker, ReferencePattern } from '@/types'

/**
 * Generate JSON-LD structured data for listings
 * Helps Google understand and display rich snippets
 */
export function generateListingStructuredData(listing: Listing) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.name,
    description: listing.description || `${listing.name} - ${listing.type.replace('_', ' ')} in ${listing.city}, ${listing.state}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip_code,
      addressCountry: 'US',
    },
    ...(listing.latitude && listing.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: listing.latitude,
        longitude: listing.longitude,
      },
    }),
    ...(listing.phone && {
      telephone: listing.phone,
    }),
    ...(listing.website && {
      url: listing.website,
    }),
    ...(listing.hours && {
      openingHoursSpecification: Object.entries(listing.hours).map(([day, hours]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
        opens: hours?.open || '09:00',
        closes: hours?.close || '17:00',
      })),
    }),
    ...(listing.photo_urls && listing.photo_urls.length > 0 && {
      image: listing.photo_urls,
    }),
  }
}

/**
 * Generate JSON-LD for events (yard sales, estate sales)
 */
export function generateEventStructuredData(event: Event) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SaleEvent',
    name: event.title,
    description: event.description || `${event.type.replace('_', ' ')} in ${event.city}, ${event.state}`,
    startDate: event.start_time,
    endDate: event.end_time,
    location: {
      '@type': 'Place',
      name: event.title,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.address,
        addressLocality: event.city,
        addressRegion: event.state,
        postalCode: event.zip_code,
        addressCountry: 'US',
      },
      ...(event.latitude && event.longitude && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: event.latitude,
          longitude: event.longitude,
        },
      }),
    },
    ...(event.photo_urls && event.photo_urls.length > 0 && {
      image: event.photo_urls,
    }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  }
}

/**
 * Generate JSON-LD for reference library makers
 */
export function generateMakerStructuredData(maker: ReferenceMaker) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: maker.name,
    description: maker.description,
    ...(maker.founding_year && {
      foundingDate: maker.founding_year.toString(),
    }),
    ...(maker.closing_year && {
      dissolutionDate: maker.closing_year.toString(),
    }),
    ...(maker.country && {
      location: {
        '@type': 'Country',
        name: maker.country,
      },
    }),
    ...(maker.logo_url && {
      logo: maker.logo_url,
    }),
    ...(maker.website_url && {
      url: maker.website_url,
    }),
  }
}

/**
 * Generate JSON-LD for reference patterns
 */
export function generatePatternStructuredData(
  pattern: ReferencePattern,
  maker: ReferenceMaker
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${pattern.name} by ${maker.name}`,
    description: pattern.description,
    brand: {
      '@type': 'Brand',
      name: maker.name,
    },
    ...(pattern.images && pattern.images.length > 0 && {
      image: pattern.images.map(img => img.image_url),
    }),
    ...(pattern.estimated_value_min && pattern.estimated_value_max && {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: pattern.estimated_value_min,
        highPrice: pattern.estimated_value_max,
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(pattern.year_introduced && {
      releaseDate: pattern.year_introduced.toString(),
    }),
    ...(pattern.materials && {
      material: pattern.materials.join(', '),
    }),
    ...(pattern.colors && {
      color: pattern.colors.join(', '),
    }),
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: {
  name: string
  url: string
}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Helper to inject structured data into page
 * Use this in your page components
 *
 * Example usage in a page.tsx:
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
 * />
 */
export function getStructuredDataScript(data: any) {
  return JSON.stringify(data)
}

/**
 * Generate Open Graph meta tags
 */
export function generateOpenGraphTags({
  title,
  description,
  image,
  url,
  type = 'website',
}: {
  title: string
  description: string
  image?: string
  url: string
  type?: 'website' | 'article' | 'product'
}) {
  return {
    title,
    description,
    type,
    url,
    siteName: 'Secondhand Finds',
    ...(image && { images: [{ url: image }] }),
  }
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterTags({
  title,
  description,
  image,
}: {
  title: string
  description: string
  image?: string
}) {
  return {
    card: 'summary_large_image',
    title,
    description,
    ...(image && { images: [image] }),
  }
}

/**
 * Default SEO config
 */
export const DEFAULT_SEO = {
  title: 'Secondhand Finds | Vintage & Antique Shop Directory',
  description:
    'Discover vintage shops, antique stores, estate sales, and flea markets. Browse our reference library to identify china, glass, silver, and collectibles.',
  keywords: [
    'vintage shops',
    'antique stores',
    'estate sales',
    'yard sales',
    'flea markets',
    'antique identification',
    'china patterns',
    'depression glass',
    'vintage collectibles',
    'antique directory',
  ].join(', '),
}

/**
 * Generate sitemap URL entry
 */
export function generateSitemapEntry({
  url,
  lastModified,
  changeFrequency = 'weekly',
  priority = 0.5,
}: {
  url: string
  lastModified?: Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}) {
  return {
    url,
    lastModified: lastModified || new Date(),
    changeFrequency,
    priority,
  }
}
