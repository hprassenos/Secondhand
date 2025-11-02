# Data Collection & Importing Guide

## Legal Data Sources

### 1. Google Places API (Recommended)
- **Legal**: Yes, with proper API usage
- **Cost**: Free tier available (lots of requests)
- **Data**: Names, addresses, phone numbers, hours, categories
- **Requires**: Google Cloud Platform account

### 2. Public Business Registries
- **Legal**: Yes (public records)
- **Cost**: Free
- **Data**: Basic business information
- **Examples**:
  - State Secretary of State databases
  - County business licenses
  - BBB listings

### 3. Manual Entry
- **Legal**: Yes
- **Cost**: Time
- **Data**: Visit shops, call them, or use public sources

### 4. User Submissions
- **Legal**: Yes
- **Cost**: Free
- **Data**: Shop owners add their own businesses

## What NOT to Do

❌ Don't scrape sites like Yelp, TripAdvisor, or other directories without permission
❌ Don't copy descriptions, reviews, or proprietary content
❌ Don't violate Terms of Service
❌ Don't use automated scrapers that hammer servers

## Google Places API Setup

### Step 1: Get API Key
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable "Places API"
4. Create API credentials
5. Restrict the key to Places API only

### Step 2: Add to .env
```
GOOGLE_PLACES_API_KEY=your_key_here
```

### Step 3: Use the import script
```bash
npm run import:places -- --query "antique shop" --location "New York, NY" --radius 50000
```

## CSV Import

For manual data collection or spreadsheet imports:

```bash
npm run import:csv -- --file data/shops.csv
```

CSV Format:
```csv
name,type,address,city,state,zip,phone,website
"Joe's Antiques",antique_shop,"123 Main St","Springfield","MA","01101","555-1234","https://joesantiques.com"
```

## Best Practices

1. **Always verify** - Call shops to confirm they're still in business
2. **Get permission** - When possible, contact shops and ask to be listed
3. **Keep it factual** - Only include publicly available information
4. **Update regularly** - Check and refresh listings quarterly
5. **Allow claiming** - Let shop owners claim and update their listings
6. **Respect robots.txt** - If you do any automated collection
7. **Rate limit** - Don't overload servers
8. **Attribute sources** - If required by API terms

## Data Quality

- Verify phone numbers work
- Ensure addresses are complete
- Standardize state abbreviations
- Check for duplicates
- Remove closed businesses
