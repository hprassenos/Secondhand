/**
 * CSV Import Script
 *
 * Import shop listings from a CSV file.
 * Useful for manual data entry or bulk imports from spreadsheets.
 *
 * CSV Format:
 * name,type,address,city,state,zip,phone,website,description
 *
 * Usage:
 *   npm run import:csv -- --file data/shops.csv [--dry-run]
 */

import { supabase } from './lib/supabase'
import * as fs from 'fs'
import * as path from 'path'

interface CSVRow {
  name: string
  type: string
  address: string
  city: string
  state: string
  zip: string
  phone?: string
  website?: string
  description?: string
}

const VALID_TYPES = [
  'antique_shop',
  'thrift_store',
  'consignment_shop',
  'flea_market',
  'auction_house',
  'estate_sale_company'
]

function parseCSV(content: string): CSVRow[] {
  const lines = content.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))

  const rows: CSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    // Simple CSV parsing (doesn't handle commas in quoted fields perfectly)
    const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || []
    const cleanValues = values.map(v => v.trim().replace(/^"|"$/g, ''))

    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = cleanValues[index] || ''
    })

    rows.push(row as CSVRow)
  }

  return rows
}

function validateRow(row: CSVRow, lineNumber: number): string[] {
  const errors: string[] = []

  if (!row.name) {
    errors.push(`Line ${lineNumber}: Missing name`)
  }

  if (!row.type || !VALID_TYPES.includes(row.type)) {
    errors.push(`Line ${lineNumber}: Invalid type "${row.type}". Must be one of: ${VALID_TYPES.join(', ')}`)
  }

  if (!row.address) {
    errors.push(`Line ${lineNumber}: Missing address`)
  }

  if (!row.city) {
    errors.push(`Line ${lineNumber}: Missing city`)
  }

  if (!row.state) {
    errors.push(`Line ${lineNumber}: Missing state`)
  }

  if (!row.zip) {
    errors.push(`Line ${lineNumber}: Missing zip code`)
  }

  if (row.state && row.state.length !== 2) {
    errors.push(`Line ${lineNumber}: State must be 2-letter abbreviation (e.g., "CA", "NY")`)
  }

  return errors
}

async function geocodeAddress(address: string, city: string, state: string, zip: string) {
  // Optional: Geocode addresses using Google Geocoding API
  // This requires GOOGLE_GEOCODING_API_KEY
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY

  if (!apiKey) {
    return { lat: null, lng: null }
  }

  const fullAddress = `${address}, ${city}, ${state} ${zip}`
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location
      return { lat, lng }
    }
  } catch (err) {
    console.warn(`Could not geocode: ${fullAddress}`)
  }

  return { lat: null, lng: null }
}

async function importFromCSV(filePath: string, dryRun: boolean = false) {
  // Read the file
  const content = fs.readFileSync(filePath, 'utf-8')
  const rows = parseCSV(content)

  console.log(`Found ${rows.length} rows in CSV`)

  // Validate all rows first
  const allErrors: string[] = []
  rows.forEach((row, index) => {
    const errors = validateRow(row, index + 2) // +2 because line 1 is header, array is 0-indexed
    allErrors.push(...errors)
  })

  if (allErrors.length > 0) {
    console.error('\n❌ Validation errors:\n')
    allErrors.forEach(err => console.error(err))
    console.error(`\nFound ${allErrors.length} errors. Please fix and try again.`)
    process.exit(1)
  }

  console.log('✅ Validation passed\n')

  if (dryRun) {
    console.log('=== DRY RUN - No data will be saved ===')
    console.log(JSON.stringify(rows, null, 2))
    return
  }

  // Import each row
  const imported = []
  const skipped = []
  const failed = []

  for (const [index, row] of rows.entries()) {
    console.log(`Processing ${index + 1}/${rows.length}: ${row.name}`)

    // Check for duplicates
    const { data: existing } = await supabase
      .from('listings')
      .select('id, name')
      .eq('name', row.name)
      .eq('address', row.address)
      .single()

    if (existing) {
      console.log(`⏭️  Skipping duplicate: ${row.name}`)
      skipped.push(row.name)
      continue
    }

    // Optional: Geocode the address
    const { lat, lng } = await geocodeAddress(row.address, row.city, row.state, row.zip)

    // Insert the listing
    const listing = {
      name: row.name,
      type: row.type,
      address: row.address,
      city: row.city,
      state: row.state.toUpperCase(),
      zip_code: row.zip,
      phone: row.phone || null,
      website: row.website || null,
      description: row.description || null,
      latitude: lat,
      longitude: lng,
      claimed: false,
      verified: false,
      featured: false,
    }

    const { error } = await (supabase
      .from('listings') as any)
      .insert(listing)

    if (error) {
      console.error(`❌ Error importing ${row.name}:`, error.message)
      failed.push(row.name)
    } else {
      console.log(`✅ Imported: ${row.name}`)
      imported.push(row.name)
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`\n=== Import Summary ===`)
  console.log(`✅ Imported: ${imported.length}`)
  console.log(`⏭️  Skipped (duplicates): ${skipped.length}`)
  console.log(`❌ Failed: ${failed.length}`)

  if (failed.length > 0) {
    console.log('\nFailed imports:')
    failed.forEach(name => console.log(`  - ${name}`))
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2)
  let filePath = ''
  let dryRun = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file') {
      filePath = args[i + 1]
      i++
    } else if (args[i] === '--dry-run') {
      dryRun = true
    }
  }

  if (!filePath) {
    console.error('Usage: npm run import:csv -- --file data/shops.csv [--dry-run]')
    process.exit(1)
  }

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  importFromCSV(filePath, dryRun)
    .then(() => {
      console.log('\n✨ Import complete!')
      process.exit(0)
    })
    .catch(err => {
      console.error('Error:', err)
      process.exit(1)
    })
}

export { importFromCSV }
