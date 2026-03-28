# Site Consistency Audit Report

**Date:** 2026-03-28
**Scope:** All HTML files in the repository

---

## index.html

### 1. Address — Wrong postal code and missing "Unit 10"
- **Line 216:** `<meta itemprop="address" content="6005 103A St NW, Edmonton, AB T6H 2K4">` — wrong postal code (should be T6H 2J7) and missing "Unit 10"
- **Line 502:** JSON-LD structured data has `"postalCode":"T6H 2K4"` — should be `T6H 2J7`
- **Line 503:** JSON-LD structured data has `"postalCode":"T6H 2K4"` — should be `T6H 2J7`
- **Line 434:** Footer address reads `6005 103A St NW, Edmonton, AB` — missing "Unit 10" and postal code "T6H 2J7"

### 11. Broken internal links
- **Line 436:** `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo

---

## solar.html

### 1. Address — Wrong postal code and missing "Unit 10"
- **Line 1639:** JSON-LD structured data has `"postalCode":"T6H 2K4"` — should be `T6H 2J7`
- **Line 903:** Footer address reads `6005 103A St NW, Edmonton, AB` — missing "Unit 10" and postal code "T6H 2J7"

### 5. Footer links — Missing "Financing" link
- **Line 903:** Footer Company column has only `About`, `Blog`, `Contact` — missing `Financing` link

### 6. Financeit link — Old SeBbyA link
- **Line 958:** `<a href="https://www.financeit.ca/s/SeBbyA" ...>Apply for 0% Now →</a>` — should be `/s/LdG2EQ`
- **Line 967:** `<a href="https://www.financeit.ca/s/SeBbyA" ...>Check My Eligibility →</a>` — should be `/s/LdG2EQ`

### 11. Broken internal links
- **Line 903:** `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo

---

## battery.html

### 1. Address — Missing "Unit 10" and postal code
- **Line 437:** Footer address reads `6005 103A St NW, Edmonton, AB` — missing "Unit 10" and postal code "T6H 2J7"

### 11. Broken internal links
- Footer contains `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo

---

## ev-chargers.html

### 1. Address — Missing entirely from footer
- **Line 269:** Footer `ft-brand` section has no address at all (only phone and email)

### 6. Financeit link — Non-standard link
- **Lines 106, 145, 159, 177, 225, 250:** All Financeit links use `https://www.financeit.ca/s/3vEl4Q` — this is neither the correct `LdG2EQ` link nor the old `SeBbyA` link. Should be verified as intentional or updated to `LdG2EQ`.

### 8. Footer structure — Missing "Contact" link, inconsistent Areas column
- **Line 271:** Company column has `About`, `Blog`, `Financing` — missing `Contact` link
- **Line 272:** Areas column shows only 3 areas + `+ 40 more` (no href) — other pages show up to 7 areas + `+ 40 more towns`

### 11. Broken internal links
- **Line 271:** `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo
- **Line 272:** `<a>+ 40 more</a>` — dead link (no href)

---

## about.html

### 1. Address — Missing entirely from footer
- **Line 517:** Footer `ft-brand` section has no address at all (only phone and email)

### 6. Financeit link — Old SeBbyA link
- **Line 399:** `<a href="https://www.financeit.ca/s/SeBbyA" ...>Financeit — $0 down, 0% for 12 months</a>` — should be `/s/LdG2EQ`

### 7. Rating — 4.9 in structured data
- **Line 836:** `"ratingValue": "4.9"` — should be `"5.0"` to match all other pages

### 8. Footer structure — Missing "Contact" link, inconsistent Areas column
- **Line 519:** Company column has `About`, `Blog`, `Financing` — missing `Contact` link
- **Line 520:** Areas column shows only 3 areas + `+ 40 more` (no href) — inconsistent with other pages

### 11. Broken internal links
- **Line 519:** `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo
- **Line 520:** `<a>+ 40 more</a>` — dead link (no href)

---

## contact.html

### 3. Review count — Visible in meta description
- **Line 11:** `<meta name="description" content="...5.0 stars, 18 Google reviews.">` — review count "18" appears in meta description (semi-visible to users in search results)

### 11. Broken internal links
- Footer contains `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo

---

## financing.html

### 11. Broken internal links
- Footer contains `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo

---

## edmonton.html

### 11. Broken internal links
- Footer contains `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo

---

## sherwood-park.html

### 11. Broken internal links
- Footer contains `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo

---

## leduc.html

### 11. Broken internal links
- Footer contains `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo

---

## st-albert.html

### 11. Broken internal links
- Footer contains `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo

---

## beaumont.html

### 11. Broken internal links
- Footer contains `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo

---

## spruce-grove.html

### 11. Broken internal links
- Footer contains `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo

---

## images/about.html

### 1. Address — Missing entirely from footer
- Footer `ft-brand` section has no address (same structure as about.html)

### 6. Financeit link — Old SeBbyA link
- **Line 273:** `<a href="https://www.financeit.ca/s/SeBbyA" ...>Financeit — $0 down, 0% for 12 months</a>` — should be `/s/LdG2EQ`

### 7. Rating — 4.9 in structured data
- **Line 389:** `"ratingValue": "4.9"` — should be `"5.0"`

### 8. Footer structure — Missing "Contact" link
- Company column has `About`, `Blog`, `Financing` — missing `Contact` link

### 10. Canonical URL — Duplicate
- **Line 12:** `<link rel="canonical" href="https://stellarupgrades.ca/about">` — same canonical as `about.html`. This file at `images/about.html` shares the canonical with the root `about.html`, which means Google sees them as duplicates.

### 11. Broken internal links
- Footer contains `<a href="/blog">Blog</a>` — no `blog.html` exists in the repo

---

## 404.html

### 9. GTM/GA4 tags — Missing
- No GTM-MRMFMJCP or G-9C0YHEVPX0 tracking tags (acceptable for error page, but worth noting)

### 10. Canonical URL — Missing
- No canonical tag (acceptable for error page)

---

## Summary Table

| Issue | Files Affected | Count |
|---|---|---|
| Wrong postal code T6H 2K4 (structured data) | index.html, solar.html | 4 instances |
| Missing "Unit 10" in footer address | index.html, battery.html, solar.html | 3 files |
| Missing address entirely from footer | ev-chargers.html, about.html, images/about.html | 3 files |
| Rating "4.9" instead of "5.0" in structured data | about.html, images/about.html | 2 files |
| Old Financeit SeBbyA link | solar.html (x2), about.html, images/about.html | 4 instances |
| Non-standard Financeit 3vEl4Q link | ev-chargers.html | 6 instances |
| Missing "Contact" in footer Company column | ev-chargers.html, about.html, images/about.html | 3 files |
| Missing "Financing" in footer Company column | solar.html | 1 file |
| Footer Areas column inconsistent (only 3 areas) | ev-chargers.html, about.html, images/about.html | 3 files |
| Dead `+ 40 more` link (no href) | ev-chargers.html, about.html, images/about.html | 3 files |
| Review count "18" in meta description | contact.html | 1 instance |
| `/blog` link with no blog.html | 14 files | 14 files |
| Duplicate canonical URL | images/about.html (duplicates about.html) | 1 file |
| Missing meta itemprop "Unit 10" | index.html | 1 instance |

**Total unique issues: 14 categories, ~56 individual instances**
