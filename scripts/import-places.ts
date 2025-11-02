/**
 * Google Places API Integration
 *
 * This script legally collects business information from Google Places API.
 * Requires a Google Cloud Platform account and Places API key.
 *
 * Usage:
 *   npm run import:places -- --query "antique shop" --location "New York, NY" --radius 50000
 */

import { supabase } from './lib/supabase'

interface PlaceResult {
  place_id: string
  name: string
  formatted_address: string
  formatted_phone_number?: string
  website?: string
  opening_hours?: {
    weekday_text: string[]
  }
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  types: string[]
}

interface ImportOptions {
  query: string
  location: string
  radius: number
  type?: string
  dryRun?: boolean
}

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

// Mapping of Google types to our listing types
const TYPE_MAPPING: Record<string, string> = {
  'antique_store': 'antique_shop',
  'thrift_store': 'thrift_store',
  'furniture_store': 'antique_shop',
  'home_goods_store': 'antique_shop',
  'store': 'antique_shop', // fallback
}

function determineListingType(types: string[]): string {
  for (const type of types) {
    if (TYPE_MAPPING[type]) {
      return TYPE_MAPPING[type]
    }
  }
  return 'antique_shop' // default
}

function parseAddress(formattedAddress: string) {
  // Parse "123 Main St, Springfield, MA 01101, USA"
  const parts = formattedAddress.split(',').map(p => p.trim())

  if (parts.length < 3) {
    throw new Error(`Cannot parse address: ${formattedAddress}`)
  }

  const address = parts[0]
  const city = parts[1]
  const stateZip = parts[2].split(' ')
  const state = stateZip[0]
  const zip = stateZip[1] || ''

  return { address, city, state, zip }
}

function parseHours(weekdayText?: string[]) {
  if (!weekdayText) return null

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const hours: any = {}

  weekdayText.forEach((text, index) => {
    // Parse "Monday: 9:00 AM – 5:00 PM" or "Monday: Closed"
    const parts = text.split(': ')
    if (parts.length !== 2) return

    const dayText = parts[1].trim()

    if (dayText.toLowerCase() === 'closed') {
      hours[days[index]] = { closed: true }
    } else {
      // Try to parse hours (this is simplified, real parsing is more complex)
      const match = dayText.match(/(\d{1,2}:\d{2}\s*[AP]M)\s*[–-]\s*(\d{1,2}:\d{2}\s*[AP]M)/)
      if (match) {
        hours[days[index]] = {
          open: match[1],
          close: match[2]
        }
      }
    }
  })

  return hours
}

async function searchPlaces(options: ImportOptions) {
  if (!GOOGLE_API_KEY) {
    throw new Error('GOOGLE_PLACES_API_KEY not set in environment variables')
  }

  console.log(`Searching for "${options.query}" near ${options.location}...`)

  // Step 1: Geocode the location
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(options.location)}&key=${GOOGLE_API_KEY}`
  const geocodeRes = await fetch(geocodeUrl)
  const geocodeData = await geocodeRes.json()

  if (!geocodeData.results || geocodeData.results.length === 0) {
    throw new Error('Could not geocode location')
  }

  const { lat, lng } = geocodeData.results[0].geometry.location

  // Step 2: Search for places
  const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${options.radius}&keyword=${encodeURIComponent(options.query)}&key=${GOOGLE_API_KEY}`
  const searchRes = await fetch(searchUrl)
  const searchData = await searchRes.json()

  if (!searchData.results) {
    throw new Error('No results found')
  }

  console.log(`Found ${searchData.results.length} places`)

  const places: PlaceResult[] = []

  // Step 3: Get details for each place (includes phone, website, hours)
  for (const result of searchData.results) {
    console.log(`Fetching details for: ${result.name}`)

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${result.place_id}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,geometry,types&key=${GOOGLE_API_KEY}`
    const detailsRes = await fetch(detailsUrl)
    const detailsData = await detailsRes.json()

    if (detailsData.result) {
      places.push(detailsData.result)
    }

    // Rate limit - Google allows ~1 request per second
    await new Promise(resolve => setTimeout(resolve, 1100))
  }

  return places
}

async function importPlaces(places: PlaceResult[], dryRun: boolean = false) {
  console.log(`\nImporting ${places.length} places...`)

  const listings = places.map(place => {
    try {
      const { address, city, state, zip } = parseAddress(place.formatted_address)
      const listingType = determineListingType(place.types)
      const hours = parseHours(place.opening_hours?.weekday_text)

      return {
        name: place.name,
        type: listingType,
        address,
        city,
        state,
        zip_code: zip,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        phone: place.formatted_phone_number || null,
        website: place.website || null,
        hours: hours,
        claimed: false,
        verified: false,
        featured: false,
      }
    } catch (err) {
      console.error(`Error parsing ${place.name}:`, err)
      return null
    }
  }).filter(Boolean)

  if (dryRun) {
    console.log('\n=== DRY RUN - No data will be saved ===')
    console.log(JSON.stringify(listings, null, 2))
    return
  }

  // Check for duplicates before inserting
  const imported = []
  const skipped = []

  for (const listing of listings) {
    if (!listing) continue

    // Check if listing already exists
    const { data: existing } = await supabase
      .from('listings')
      .select('id, name')
      .eq('name', listing.name)
      .eq('address', listing.address)
      .single()

    if (existing) {
      console.log(`⏭️  Skipping duplicate: ${listing.name}`)
      skipped.push(listing.name)
      continue
    }

    // Insert the listing
    const { error } = await supabase
      .from('listings')
      .insert(listing)

    if (error) {
      console.error(`❌ Error importing ${listing.name}:`, error.message)
    } else {
      console.log(`✅ Imported: ${listing.name}`)
      imported.push(listing.name)
    }
  }

  console.log(`\n=== Import Summary ===`)
  console.log(`✅ Imported: ${imported.length}`)
  console.log(`⏭️  Skipped (duplicates): ${skipped.length}`)
  console.log(`❌ Failed: ${listings.length - imported.length - skipped.length}`)
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2)
  const options: ImportOptions = {
    query: '',
    location: '',
    radius: 50000, // 50km default
    dryRun: false,
  }

  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i]
    const value = args[i + 1]

    switch (flag) {
      case '--query':
        options.query = value
        break
      case '--location':
        options.location = value
        break
      case '--radius':
        options.radius = parseInt(value)
        break
      case '--type':
        options.type = value
        break
      case '--dry-run':
        options.dryRun = true
        i-- // no value for this flag
        break
    }
  }

  if (!options.query || !options.location) {
    console.error('Usage: npm run import:places -- --query "antique shop" --location "New York, NY" [--radius 50000] [--dry-run]')
    process.exit(1)
  }

  searchPlaces(options)
    .then(places => importPlaces(places, options.dryRun))
    .then(() => {
      console.log('\n✨ Import complete!')
      process.exit(0)
    })
    .catch(err => {
      console.error('Error:', err)
      process.exit(1)
    })
}

export { searchPlaces, importPlaces }
