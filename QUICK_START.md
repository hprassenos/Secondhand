# Quick Start Guide - Populating Your Directory

## Option 1: Google Places API (Recommended - Most shops)

This is the **best legal way** to get shop data. Google Places has public business information.

### Setup (5 minutes)
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable "Places API" and "Geocoding API"
4. Create credentials (API Key)
5. Add to your `.env`:
   ```
   GOOGLE_PLACES_API_KEY=your_key_here
   ```

### Usage
```bash
# Search for antique shops in a specific area
npm run import:places -- --query "antique shop" --location "Los Angeles, CA" --radius 50000

# Try different queries
npm run import:places -- --query "thrift store" --location "New York, NY" --radius 30000
npm run import:places -- --query "vintage store" --location "Portland, OR" --radius 40000
npm run import:places -- --query "consignment shop" --location "Austin, TX" --radius 25000

# Dry run to preview without importing
npm run import:places -- --query "antique shop" --location "Boston, MA" --dry-run
```

**Cost:** Google gives you $200/month credit = ~20,000 searches for free!

---

## Option 2: CSV Import (Manual data entry)

Best for when you:
- Have a list of shops you've visited
- Found shops in local directories
- Got data from chambers of commerce

### Usage
1. Create or edit `data/shops.csv`:
```csv
name,type,address,city,state,zip,phone,website,description
"Joe's Antiques",antique_shop,"123 Main St","Springfield","MA","01101","555-1234","https://joesantiques.com",""
"Vintage Vibes",thrift_store,"456 Oak Ave","Boston","MA","02101","555-5678","",""
```

2. Import:
```bash
npm run import:csv -- --file data/shops.csv

# Dry run to test first
npm run import:csv -- --file data/shops.csv --dry-run
```

Valid shop types:
- `antique_shop`
- `thrift_store`
- `consignment_shop`
- `flea_market`
- `auction_house`
- `estate_sale_company`

---

## Option 3: User Submissions (Ongoing)

Let shop owners add themselves:
- Share the link: `yourdomain.com/claim-listing`
- They can add their shop
- You approve in moderation queue

---

## Recommended Workflow

### Week 1: Seed major cities
```bash
npm run import:places -- --query "antique shop" --location "New York, NY" --radius 50000
npm run import:places -- --query "antique shop" --location "Los Angeles, CA" --radius 50000
npm run import:places -- --query "antique shop" --location "Chicago, IL" --radius 50000
```

### Week 2: Add more types
```bash
npm run import:places -- --query "thrift store" --location "New York, NY" --radius 50000
npm run import:places -- --query "vintage store" --location "New York, NY" --radius 50000
npm run import:places -- --query "consignment shop" --location "New York, NY" --radius 50000
```

### Week 3: Expand to more cities
Use a list of top 50 US cities and repeat the process.

### Week 4: Manual curation
- Call shops to verify they're still open
- Let them claim their listings
- Add better descriptions with permission

---

## Legal & Ethical Guidelines

✅ **Safe to collect:**
- Business names (facts)
- Addresses (public)
- Phone numbers (published)
- Hours of operation
- Business type/category

❌ **Don't copy:**
- Reviews or ratings
- User-generated descriptions
- Photos without permission
- Proprietary categorizations
- Content from other websites

✅ **Best practices:**
- Always verify data is current
- Let businesses claim and update listings
- Remove listings if requested
- Give shop owners full control once verified

---

## Data Quality Tips

1. **Remove duplicates:** Script checks automatically
2. **Verify closed businesses:** Call or check online
3. **Standardize formatting:** Scripts handle this
4. **Update quarterly:** Set a calendar reminder
5. **Enable claims:** Let owners keep info fresh

---

## Example: Populate 100 shops in 30 minutes

```bash
# Major city - 3 searches = ~60-90 shops
npm run import:places -- --query "antique shop" --location "Seattle, WA" --radius 40000
npm run import:places -- --query "thrift store" --location "Seattle, WA" --radius 40000
npm run import:places -- --query "vintage store" --location "Seattle, WA" --radius 40000

# Total: ~60-90 shops in 10-15 minutes
# Repeat for other cities
```

---

## Need Help?

- See `DATA_COLLECTION.md` for detailed documentation
- Check `scripts/import-places.ts` for technical details
- Example CSV: `data/example-shops.csv`
