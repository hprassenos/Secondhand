# Quick Customization Guide

This guide shows you exactly which files to edit for common changes.

## 🎨 Visual/Design Changes

### Change Main Colors
**File:** `tailwind.config.ts`
**What to edit:** The `vintage` color palette (lines 12-23)

```typescript
// Current vintage brown theme
vintage: {
  600: '#b8935b',  // Main brand color
}

// Change to blue:
vintage: {
  600: '#2563eb',  // Main blue
}
```

**Effect:** Changes all buttons, links, accents site-wide

---

### Change Fonts
**File:** `app/layout.tsx`
**What to edit:** Line 3-4

```typescript
// Current
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

// Popular alternatives:
// Playfair Display (elegant serif)
// Roboto (clean sans-serif)
// Lora (readable serif)
// Open Sans (friendly)
```

Browse all fonts: https://fonts.google.com

---

### Change Button Styles
**File:** `app/globals.css`
**What to edit:** Lines 22-31 (.btn-primary and .btn-secondary)

```css
/* Current */
.btn-primary {
  @apply bg-vintage-600 hover:bg-vintage-700 text-white font-semibold py-2 px-4 rounded-lg;
}

/* Make buttons more rounded */
.btn-primary {
  @apply bg-vintage-600 hover:bg-vintage-700 text-white font-bold py-3 px-6 rounded-full;
}

/* Make buttons flat/minimal */
.btn-primary {
  @apply bg-transparent border-2 border-vintage-600 text-vintage-600 hover:bg-vintage-600 hover:text-white font-semibold py-2 px-4 rounded;
}
```

---

### Change Homepage Layout
**File:** `app/page.tsx`
**What to edit:** The entire file is your homepage

- Lines 8-23: Hero section (main headline)
- Lines 26-49: Feature cards
- Lines 52-66: Call-to-action section

Just edit the text, add sections, remove sections!

---

### Change Navigation Menu
**File:** `components/Navigation.tsx`
**What to edit:** Line 10-15 (navigation array)

```typescript
// Current menu
const navigation = [
  { name: 'Shop Directory', href: '/directory' },
  { name: 'Yard Sales', href: '/yard-sales' },
  { name: 'Estate Sales', href: '/estate-sales' },
  { name: 'Reference Library', href: '/reference' },
]

// Add/remove/reorder items as you want!
```

---

### Change Footer
**File:** `app/layout.tsx`
**What to edit:** Lines 34-62 (footer section)

Edit links, add social media icons, change text, etc.

---

## 📄 Content Changes

### Edit About Page
**File:** `app/about/page.tsx`
- Line 17: Main headline
- Line 28-35: Mission statement
- Line 41-89: Values section
- Line 93-108: Story

Just change the text!

---

### Edit FAQ Questions
**File:** `app/faq/page.tsx`
**What to edit:** Lines 7-132 (faqs array)

Add, remove, or edit questions:

```typescript
{
  category: 'General',
  question: 'Your new question?',
  answer: 'Your answer here.',
}
```

---

### Edit Terms/Privacy
**Files:**
- `app/terms/page.tsx`
- `app/privacy/page.tsx`

Replace with your lawyer's version or customize the provided text.

---

## 🔧 Functional Changes

### Add a New Page
1. Create folder: `app/my-new-page/`
2. Create file: `app/my-new-page/page.tsx`
3. Copy structure from any existing page
4. Add to navigation if needed

---

### Change Shop Types
**File:** `types/index.ts`
**What to edit:** Line 1-7

```typescript
export type ListingType =
  | 'antique_shop'
  | 'thrift_store'
  | 'your_new_type'  // Add new types here
```

Also update:
- `app/directory/DirectoryClient.tsx` (line 13-20)
- Database migration if already deployed

---

### Change Form Fields
Example: Add "Instagram" field to Contact form

**File:** `app/contact/page.tsx`

1. Add to state (line 8-14)
2. Add input field in form (around line 120)
3. Include in form submission (line 20-30)

---

## 🎨 Design System Reference

### Standard Spacing
```
p-2  = 8px padding
p-4  = 16px padding
p-6  = 24px padding
p-8  = 32px padding

m-2  = 8px margin
m-4  = 16px margin
etc.
```

### Standard Text Sizes
```
text-sm   = 14px
text-base = 16px
text-lg   = 18px
text-xl   = 20px
text-2xl  = 24px
text-3xl  = 30px
text-4xl  = 36px
```

### Standard Colors (Current Theme)
```
text-vintage-900  = Dark brown text
text-vintage-600  = Medium brown (brand color)
text-gray-600     = Gray text
bg-white          = White background
bg-vintage-50     = Very light brown background
```

---

## 🚀 Testing Changes

### Before Deploying:
```bash
# Start local dev server
npm run dev

# Opens http://localhost:3000
# Changes appear instantly as you save!
```

### When Ready:
```bash
git add .
git commit -m "Describe what you changed"
git push
```

Vercel automatically deploys in 2-3 minutes!

---

## 💡 Pro Tips

1. **Start Small:** Change one thing, test, deploy. Don't change everything at once.

2. **Use Dev Server:** Always test with `npm run dev` before deploying.

3. **Copy Examples:** Find a page you like, copy its structure for new pages.

4. **Tailwind Docs:** When in doubt: https://tailwindcss.com/docs

5. **Git Safety:** If you break something, just revert:
   ```bash
   git reset --hard HEAD~1
   ```

6. **Multiple Themes:** Keep the vintage theme as a backup while testing new designs.

---

## 🆘 Common "I Want To..." Questions

**"I want a completely different homepage layout"**
→ Edit `app/page.tsx` - it's just HTML/React components

**"I want different colors"**
→ Edit `tailwind.config.ts` - change the vintage color palette

**"I want a different font"**
→ Edit `app/layout.tsx` - import different Google Font

**"I want to add a blog"**
→ Create `app/blog/page.tsx` - copy structure from other pages

**"I want to change the logo"**
→ Edit `components/Navigation.tsx` line 23-24

**"I want different navigation items"**
→ Edit `components/Navigation.tsx` line 10-15

**"I don't like rounded corners on cards"**
→ Edit `app/globals.css` line 33 - change `rounded-lg` to `rounded-none`

---

## 📚 Learning Resources

- **Tailwind CSS:** https://tailwindcss.com/docs
- **Next.js:** https://nextjs.org/docs
- **React:** https://react.dev/learn
- **TypeScript:** https://www.typescriptlang.org/docs/

Most changes you'll want are simple HTML/CSS - no deep programming needed!
