# Stellar Upgrades — Full Site SEO & Technical Audit

**Date:** 2026-03-27
**Site:** stellarupgrades.vercel.app / stellarupgrades.ca
**Pages audited:** index.html, solar.html, battery.html, ev-chargers.html, about.html, contact.html, financing.html, 404.html, sitemap.xml, robots.txt, vercel.json

---

## 🔴 CRITICAL — Broken Data / Dead Links / Wrong Info Shown to Users

### C1. Wrong postal code: T6H 2K4 (should be T6H 2J7)
- `index.html:216` — microdata meta tag: `"6005 103A St NW, Edmonton, AB T6H 2K4"`
- `index.html:502` — Organization JSON-LD: `"postalCode":"T6H 2K4"`
- `index.html:503` — LocalBusiness JSON-LD: `"postalCode":"T6H 2K4"`
- `solar.html:1639` — Organization JSON-LD: `"postalCode":"T6H 2K4"`
- **Fix:** Replace all with `T6H 2J7`

### C2. Address missing "Unit 10" (should be "Unit 10, 6005 103A St NW")
- `index.html:216` — microdata: `"6005 103A St NW, Edmonton, AB T6H 2K4"`
- `index.html:434` — footer visible text: `"6005 103A St NW, Edmonton, AB"` (also missing postal code)
- `index.html:502` — Organization JSON-LD `streetAddress`
- `index.html:503` — LocalBusiness JSON-LD `streetAddress`
- `solar.html:903` — footer visible text: `"6005 103A St NW, Edmonton, AB"`
- `solar.html:1636` — Service JSON-LD `streetAddress`
- `solar.html:1639` — Organization JSON-LD `streetAddress`
- `solar.html:1640` — LocalBusiness JSON-LD `streetAddress`
- `battery.html:437` — footer visible text: `"6005 103A St NW, Edmonton, AB"` (also missing postal code)
- `ev-chargers.html:269` — footer: no address at all, just city text
- `about.html:517` — footer: no address at all
- `about.html:832` — JSON-LD: missing streetAddress entirely (only has addressLocality)
- **Fix:** All should read `"Unit 10, 6005 103A St NW"` with postal code `T6H 2J7`

### C3. Wrong business hours in index.html structured data
- `index.html:503` — LocalBusiness JSON-LD: `"opens":"08:00","closes":"18:00"` Mon-Fri only
- **Correct:** Mon-Fri 10:00-20:00, Sat 10:00-18:00, Sun by appointment
- `contact.html:232` — has correct hours (only page with correct schema hours)
- `solar.html` — no hours in any schema
- `battery.html` — no hours in any schema
- `ev-chargers.html` — no hours in any schema
- `about.html` — no hours in any schema
- `financing.html` — no hours in any schema
- **Fix:** Add correct `openingHoursSpecification` to every page's LocalBusiness schema

### C4. Inconsistent review counts across pages
| Location | ratingValue | reviewCount |
|----------|-------------|-------------|
| `index.html:502` Org schema | 5.0 | **50** |
| `index.html:503` LocalBusiness schema | 5.0 | **50** |
| `index.html:354` visible text | 5.0 | **"50+"** |
| `solar.html:1636` Service schema | 5.0 | **50** |
| `solar.html:1640` LocalBusiness schema | 5.0 | **50** |
| `contact.html:232` LocalBusiness schema | 5.0 | **18** |
| `contact.html:132` visible text | 5.0 | **18** |
| `financing.html:394` WebPage schema | 5.0 | **18** |
| `financing.html:167` visible text | 5.0 | **18** |
| `about.html:836` LocalBusiness schema | **4.9** | **50** |
| `about.html:256` visible text | **4.9** | — |
- Google Business Profile shows 18 reviews. Claiming 50 is inaccurate.
- `about.html` says 4.9 stars; every other page says 5.0
- **Fix:** Standardize to actual GBP count (18) and rating (5.0) everywhere

### C5. Old Financeit SeBbyA links still present (should be LdG2EQ)
- `solar.html:958` — `https://www.financeit.ca/s/SeBbyA` ("Apply for 0% Now")
- `solar.html:967` — `https://www.financeit.ca/s/SeBbyA` ("Check My Eligibility")
- `about.html:399` — `https://www.financeit.ca/s/SeBbyA` (financing callout)
- `images/about.html:273` — `https://www.financeit.ca/s/SeBbyA` (stale copy)
- **Fix:** Replace all SeBbyA with `LdG2EQ`

### C6. EV charger page uses unknown Financeit code `3vEl4Q`
- `ev-chargers.html:106,145,159,177,225,250` — all use `https://www.financeit.ca/s/3vEl4Q`
- **Verify:** Is `3vEl4Q` the correct EV-specific Financeit link, or should it also be `LdG2EQ`?

### C7. Broken HTML entities in ev-chargers.html
- `ev-chargers.html:145` — garbled text: `&rarr;middot; $0 down, 0% for 12 months $0 down &middot; 0% for 12 months &rarr;rarr;`
- `ev-chargers.html:159` — same garbled text repeated
- **Fix:** Should read `Get pre-qualified &rarr;` cleanly

### C8. Double percent sign in ev-chargers meta description
- `ev-chargers.html:11` — `"$0 down, 0%% for 12 months"` — should be `0%`

### C9. Six area pages in sitemap don't exist (404s for crawlers)
- `sitemap.xml` lists: `/areas/edmonton`, `/areas/st-albert`, `/areas/sherwood-park`, `/areas/spruce-grove`, `/areas/leduc`, `/areas/beaumont`
- No `areas/` directory exists. All return 404.
- Every page footer links to these non-existent pages
- **Fix:** Either create the pages or remove from sitemap + fix footer links

### C10. `/blog` linked in every page footer — page doesn't exist
- `index.html:436`, `solar.html:903`, `battery.html:439`, `ev-chargers.html:271`, `about.html:519`, `contact.html:203`, `financing.html:361` — all link to `/blog`
- No `blog.html` or `blog/` directory exists
- **Fix:** Create blog page or remove link

### C11. `images/about.html` — stale duplicate file in wrong location
- `/images/about.html` is an old copy of about.html with wrong image paths (`/images/about/`, `/images/projects/`), old SeBbyA link, and duplicate canonical pointing to `/about`
- Could confuse crawlers and serves stale content
- **Fix:** Delete this file

---

## 🟠 HIGH — SEO Issues Directly Impacting Rankings

### H1. Missing Open Graph tags on 3 pages
- `contact.html` — no og:title, og:description, og:type, og:url, og:image
- `about.html` — no og:title, og:description, og:type, og:url, og:image
- `ev-chargers.html` — no og:title, og:description, og:type, og:url, og:image
- `financing.html` — has og tags but **missing og:image**
- **Fix:** Add full OG tag set to all pages

### H2. Missing Twitter Card tags on 5 pages
- Only `index.html` and `solar.html` have twitter:card tags
- Missing on: `battery.html`, `ev-chargers.html`, `about.html`, `contact.html`, `financing.html`
- **Fix:** Add twitter:card, twitter:title, twitter:description, twitter:image to all

### H3. Missing LocalBusiness schema on 3 pages
- `battery.html` — no LocalBusiness schema at all
- `ev-chargers.html` — no LocalBusiness schema at all (has Product schema only)
- `financing.html` — LocalBusiness nested inside WebPage, incomplete
- **Fix:** Add consistent LocalBusiness JSON-LD to every page

### H4. Missing BreadcrumbList schema on 2 pages
- `about.html` — no BreadcrumbList schema
- `ev-chargers.html` — no BreadcrumbList schema
- **Fix:** Add BreadcrumbList to both

### H5. `financing.html` missing from sitemap.xml
- File exists, has canonical, but not listed in sitemap
- **Fix:** Add `<url><loc>https://stellarupgrades.ca/financing</loc></url>` to sitemap

### H6. No area/city landing pages exist
- Edmonton, St. Albert, Sherwood Park, Spruce Grove, Leduc, Beaumont — zero pages created
- These are critical for local SEO dominance within 200km of Edmonton
- Competitors likely have dedicated city pages ranking for "solar panels [city]"
- **Fix:** Create at minimum 6 city pages with unique content, LocalBusiness schema, city-specific H1s

### H7. No blog exists
- Zero blog posts, zero informational content
- Missing opportunity for long-tail keywords: "solar incentives Alberta", "net metering Alberta", "CEIP Edmonton", "solar panel cost Edmonton 2026"
- **Fix:** Create `/blog` with at least 5-10 cornerstone articles targeting Alberta solar queries

### H8. Footer address inconsistency across pages
| Page | Footer address | Postal code |
|------|---------------|-------------|
| `index.html:434` | 6005 103A St NW, Edmonton, AB | Missing |
| `solar.html:903` | 6005 103A St NW, Edmonton, AB | Missing |
| `battery.html:437` | 6005 103A St NW, Edmonton, AB | Missing |
| `ev-chargers.html:269` | No address shown | Missing |
| `about.html:517` | No address shown | Missing |
| `contact.html:201` | Unit 10, 6005 103A St NW, Edmonton, AB T6H 2J7 | ✅ |
| `financing.html:359` | Unit 10, 6005 103A St NW, Edmonton, AB T6H 2J7 | ✅ |
- **Fix:** Standardize all footers to match contact/financing format

### H9. Heading hierarchy violations
- `index.html:252` — H3 appears before any H2 (calculator section)
- `contact.html:142,166,173` — H3s appear before H2 at line 188
- `financing.html:272-275` — H4 under H2, skipping H3
- `battery.html` — H4s under H2 parents without intervening H3
- **Fix:** Restructure headings to follow strict H1 > H2 > H3 > H4 order

### H10. ev-chargers.html is 1MB+ due to base64-encoded images
- File is 1,038,712 bytes — 4 base64-encoded images inline
- 23 SVG elements also inline
- Severely impacts page load, Time to First Byte, crawl budget
- **Fix:** Extract base64 images to external files, reference via `<img src>`

---

## 🟡 MEDIUM — Optimization Opportunities

### M1. Chart.js + Three.js loaded synchronously on solar page
- `solar.html:29` — Chart.js (~200KB) loaded in `<head>`, render-blocking
- `solar.html:30` — Three.js (~600KB) loaded in `<head>`, render-blocking
- Neither needed until user interacts with calculator
- **Fix:** Add `defer` attribute, or lazy-load on scroll/interaction

### M2. No `<link rel="preload">` for hero/LCP images
- `index.html` — hero image `/images/house-sunset.webp` not preloaded
- `solar.html` — hero image `/images/roof-suburb.webp` not preloaded
- `battery.html` — hero image `/images/ep-cube-lifestyle.jpeg` not preloaded
- **Fix:** Add `<link rel="preload" as="image" href="...">` in `<head>`

### M3. Images missing width/height attributes (CLS risk)
- All `<img>` tags across all pages lack explicit `width` and `height`
- Causes Cumulative Layout Shift during loading
- **Fix:** Add `width` and `height` to every `<img>`

### M4. Large unoptimized images in /images/
- `20260315_131300.jpeg` — 2.9 MB
- `90403333-D85C-4669-9EEA-E43243B0A8A9.png` — 2.7 MB
- `roof-aerial-reveal.jpg` — 1.2 MB
- `longi-panel.png` — 973 KB
- Several JPEGs not converted to WebP
- **Fix:** Compress all images, convert remaining JPGs/PNGs to WebP

### M5. Non-descriptive image filenames
- `20260315_131242.jpeg`, `20260315_131300.jpeg` — camera default names
- `90403333-D85C-4669-9EEA-E43243B0A8A9.png` — UUID
- `Image 1.jpg` — space in filename + generic name
- **Fix:** Rename to SEO-friendly descriptive names (e.g., `stellar-upgrades-crew-winter-install.webp`)

### M6. Missing `loading="lazy"` on below-fold images
- `index.html:360,369` — founder images (PJ, Jordan) missing lazy
- `contact.html:180,181` — founder images missing lazy
- **Fix:** Add `loading="lazy"` to all below-fold images

### M7. Founder images have minimal alt text on contact page
- `contact.html:180` — `alt="PJ Singh"` (no context)
- `contact.html:181` — `alt="Jordan Walsh"` (no context)
- **Fix:** `alt="PJ Singh — Co-Founder & Director of Sales, Stellar Upgrades"`

### M8. Footer area links with no href (dead anchors)
- Every page footer has "Red Deer", "Camrose", "+ 40 more towns" as `<a>` tags with no `href`
- Index.html area section (lines 407-409) has ~29 area tags with no `href`
- **Fix:** Either link to area pages (when created) or remove `<a>` tags

### M9. No `/contact` or `/financing` in main nav on any page
- Main nav on all pages: Solar, Battery, EV Chargers, About
- Contact and Financing only accessible via footer
- **Fix:** Consider adding Contact to nav; Financing is secondary so footer is acceptable

### M10. WebSite schema references non-existent search endpoint
- `index.html:504` — SearchAction target: `https://stellarupgrades.ca/search?q={search_term_string}`
- No search functionality exists on the site
- **Fix:** Remove SearchAction from WebSite schema

### M11. about.html rating says 4.9 — all other pages say 5.0
- `about.html:256` visible text: "4.9-star Google rating"
- `about.html:836` JSON-LD: `"ratingValue": "4.9"`
- **Fix:** Align with actual GBP rating (5.0)

### M12. GTM script loaded synchronously before `<meta charset>` on all pages
- All pages: `<script>GTM...</script>` at line 4, before charset declaration
- Technically render-blocking
- **Fix:** Move GTM to after `<meta charset>` or add `async`/`defer`

### M13. No security headers in vercel.json
- Missing: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`, `Referrer-Policy`
- **Fix:** Add security headers to vercel.json

### M14. Cloudflare email obfuscation on some footers
- `solar.html:903` — email shows as `[email protected]` with `/cdn-cgi/l/email-protection` href
- `financing.html:359` — same issue
- If not on Cloudflare (Vercel hosting), this JS won't work → broken email links
- **Fix:** Use plain `mailto:info@stellarupgrades.ca` everywhere

### M15. Solar quiz form doesn't fire GA4 generate_lead event
- `solar.html:1609` — fires Google Ads conversion but no GA4 `generate_lead` event
- Other forms on the page do fire both
- **Fix:** Add `gtag('event','generate_lead',{event_category:'solar_quiz'})`

---

## 🟢 LOW — Accessibility & UI Polish

### L1. No `<label>` elements on any form inputs (WCAG failure)
- All forms across all pages use `placeholder` only — no `<label>` or `aria-label`
- Affects: `index.html` (calculator + exit popup), `solar.html` (3 forms), `battery.html` (quiz), `ev-chargers.html` (form), `contact.html` (form), `financing.html` (form)
- **Fix:** Add `<label>` elements or `aria-label` attributes to every input

### L2. No skip-to-content link on any page
- Screen reader users must tab through entire nav on every page load
- **Fix:** Add `<a href="#main" class="skip-link">Skip to content</a>` at top of each page

### L3. No `aria-expanded` on FAQ accordion buttons
- All pages with FAQ sections use `<button class="faq-q">` with no `aria-expanded`
- **Fix:** Toggle `aria-expanded="true/false"` in JS when accordion opens/closes

### L4. SVG logos have no accessible name
- All pages: inline SVG logo in nav has no `aria-label`, `<title>`, or `role="img"`
- **Fix:** Add `aria-label="Stellar Upgrades home"` to SVG or wrapping `<a>`

### L5. Emoji used as icons without `aria-hidden`
- `index.html`, `solar.html`, `battery.html` — emoji characters used for visual icons
- Screen readers will read emoji descriptions aloud
- **Fix:** Wrap in `<span aria-hidden="true">` or use CSS pseudo-elements

### L6. 404 page has no site navigation or styling
- `404.html` — standalone page, no nav, no footer, no consistent branding
- Has phone number and homepage link only
- **Fix:** Add site nav, footer, and shared styling

### L7. Empty alt tags on lightbox placeholder images
- `about.html:530` — `<img src="" alt="">`
- **Fix:** These are JS-populated lightbox containers; empty alt is acceptable but could use `role="presentation"`

### L8. Footer address `<a>` tags not linked to Google Maps
- `index.html:434`, `battery.html:437`, `solar.html:903` — address in `<a>` tag with no `href`
- **Fix:** Link to `https://www.google.com/maps/place/Stellar+Upgrades`

### L9. `house-sunset.jpg` duplicated in root and /images/
- Root: `/house-sunset.jpg` (298 KB)
- Images: `/images/house-sunset.jpg` + `/images/house-sunset.webp`
- **Fix:** Remove root copy, use only `/images/` version

---

## Content Gap Analysis — Missing Pages for Alberta SEO Dominance

### Must-create city/area pages:
1. `/areas/edmonton` — "Solar Panel Installation Edmonton"
2. `/areas/st-albert` — "Solar Panels St. Albert"
3. `/areas/sherwood-park` — "Solar Installation Sherwood Park"
4. `/areas/spruce-grove` — "Solar Panels Spruce Grove"
5. `/areas/leduc` — "Solar Installation Leduc"
6. `/areas/beaumont` — "Solar Panels Beaumont"
7. Consider also: Fort Saskatchewan, Red Deer, Camrose, Stony Plain

### Must-create blog/content pages:
1. "How Much Do Solar Panels Cost in Edmonton? (2026 Guide)"
2. "Best Solar Company Edmonton — What to Look For"
3. "Solar Incentives & Rebates in Alberta 2026"
4. "Net Metering Alberta — Complete Guide"
5. "CEIP Edmonton — How Property Tax Solar Financing Works"
6. "Solar Panels in Winter — Do They Work in Alberta?"
7. "Battery Backup vs Generator — Which Is Better for Alberta?"
8. "EV Charger Installation Cost Edmonton"

---

## Tracking & Conversion Summary

### lead_source values by page (SunBase):
| Page | lead_source | ✅ Unique? |
|------|------------|-----------|
| `index.html` | `Website - Homepage Calculator` | ✅ |
| `index.html` | `Website - Exit Popup` | ✅ |
| `solar.html` | `Website - Solar Engine` | ✅ |
| `solar.html` | `Website - Solar Quiz` | ✅ |
| `solar.html` | `Website - Solar Hero Fast Track` | ✅ |
| `battery.html` | `Website - Battery Quiz` | ✅ |
| `ev-chargers.html` | `Website - EV Charger Page` | ✅ |
| `contact.html` | `Website - Contact Page` | ✅ |
| `financing.html` | `Website - Financing Page` | ✅ |
| `about.html` | `Website` | ⚠️ Not specific enough |

### Google Ads conversion tracking:
- All pages fire `AW-385606008/2VjbCMSd3_8bEPmVz_tC` on form submit + phone click ✅
- GA4 property `G-9C0YHEVPX0` configured on all pages ✅
- GTM container `GTM-MRMFMJCP` on all pages ✅
- **Gap:** `solar.html` quiz form (line 1609) fires Ads conversion but not GA4 `generate_lead`
- **Gap:** `about.html` lead_source is generic `"Website"` instead of `"Website - About Page"`

---

## Issue Count Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 11 |
| 🟠 HIGH | 10 |
| 🟡 MEDIUM | 15 |
| 🟢 LOW | 9 |
| **Total** | **45** |
