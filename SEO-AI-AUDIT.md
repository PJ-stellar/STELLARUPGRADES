# SEO & AI Visibility Audit Report

**Date:** 2026-03-29
**Site:** stellarupgrades.ca
**Files audited:** 72 HTML files

---

## 1. Title Tags (max 60 characters)

**Status: FIXED**

- 48 files were already under 60 characters
- **24 files trimmed** to under 60 characters while preserving primary keywords and brand name
- 0 missing titles, 0 duplicates
- Files trimmed: index.html, about.html, areas.html, battery.html, beaumont.html, blog-*.html (5), blog.html, careers.html, contact.html, drayton-valley.html, edmonton.html, ev-chargers.html, financing.html, fort-saskatchewan.html, leduc.html, projects.html, rocky-mountain-house.html, sherwood-park.html, solar.html, spruce-grove.html, st-albert.html

## 2. Meta Descriptions (max 155 characters)

**Status: FIXED**

- **70 files trimmed** from 160-250 chars down to under 155 chars
- 2 files intentionally have no description (404.html, welcome.html)
- 0 duplicates
- All descriptions retain primary keyword, value proposition, and call to action

## 3. Canonical URLs

**Status: PASS (with expected exceptions)**

- 70/72 files have unique canonical URLs pointing to themselves
- Missing (acceptable): 404.html, welcome.html (noindex pages)
- 0 duplicate canonicals

## 4. Open Graph Tags

**Status: FIXED**

- 67 files already had complete OG tags
- **3 files fixed** (og:title, og:description, og:type, og:url, og:image added):
  - about.html
  - contact.html
  - ev-chargers.html
- Excluded (acceptable): 404.html, welcome.html

## 5. Structured Data (JSON-LD)

**Status: FIXED**

Already present:
- index.html: Organization, LocalBusiness (x3), WebSite, FAQPage (x2)
- solar.html: Service, LocalBusiness, FAQPage, BreadcrumbList
- battery.html: Product, FAQPage, BreadcrumbList
- ev-chargers.html: Product, FAQPage
- about.html: LocalBusiness
- All 51 area pages: Service, LocalBusiness, BreadcrumbList, FAQPage
- All 5 blog posts: BlogPosting, Person, Organization
- blog.html: Blog, Organization
- projects.html: CollectionPage, LocalBusiness
- contact.html: ContactPage, LocalBusiness
- financing.html: WebPage, LocalBusiness, FAQPage, BreadcrumbList

**Added:**
- BreadcrumbList schema to: ev-chargers.html, about.html, careers.html, and all 5 blog posts (7 files)
- Speakable schema to: index.html, solar.html, battery.html, ev-chargers.html (4 files)
- WebSite SearchAction (sitelinks search box) verified present on index.html

## 6. Heading Hierarchy

**Status: PASS**

- All 72 files have exactly 1 `<h1>` tag
- No files with 0 or multiple h1 tags

## 7. Image Alt Text

**Status: PASS**

- 66/67 images have descriptive alt text
- 1 empty `<img src="" alt="">` in about.html is a lightbox placeholder populated by JavaScript (intentional)

## 8. Internal Linking

**Status: PASS**

- Homepage links to all service pages, about, blog, contact, financing, projects, careers, and areas
- Service pages (solar, battery, ev-chargers) cross-link to each other
- All blog posts link to relevant service pages and area pages
- Blog posts are linked from blog.html
- No orphan pages detected

## 9. robots.txt

**Status: PASS (already correct)**

```
User-agent: *
Allow: /
Sitemap: https://stellarupgrades.ca/sitemap.xml
```

## 10. Sitemap Completeness

**Status: PASS**

- sitemap.xml contains 73 URLs covering all public pages
- welcome.html correctly excluded (noindex page)
- All HTML files are represented in the sitemap

## 11. AI Visibility Optimizations

**Status: FIXED**

- **max-snippet meta tag** added to 70 files (all except 404.html and welcome.html):
  `<meta name="robots" content="max-snippet:-1,max-image-preview:large,max-video-preview:-1">`
- **meta author** added to all 72 files:
  `<meta name="author" content="Stellar Upgrades">`
- **meta subject** added to index.html:
  `<meta name="subject" content="Solar panel, battery backup, and EV charger installation in Edmonton, Alberta">`
- **article meta tags** added to all 5 blog posts:
  `<meta name="article:author" content="Stellar Upgrades">`
  `<meta name="article:published_time" content="2026-03-27">`
- **Speakable schema** added to index.html, solar.html, battery.html, ev-chargers.html

## 12. Page Speed Factors

**Status: FIXED**

- All images now have `loading="eager"` (first visible) or `loading="lazy"` attributes
- **Fixed:** 18 images across solar.html, index.html, contact.html, ev-chargers.html
- All pages use `<link rel="preconnect">` for Google Fonts (fonts.googleapis.com and fonts.gstatic.com)
- No unnecessary external scripts detected beyond GTM/GA4/Google Ads (required tracking)

## 13. Breadcrumb Schema

**Status: FIXED**

- 60 files already had BreadcrumbList schema (all area pages, solar, financing, blog index, projects, contact, index)
- **7 files added:** ev-chargers.html, about.html, careers.html, and all 5 blog posts
- Total: 67 files with BreadcrumbList (appropriate pages only)

## 14. Sitelinks Search Box Schema

**Status: PASS (already present)**

- index.html already has WebSite schema with SearchAction targeting `/areas/{search_term_string}`

## 15. Language Attribute

**Status: PASS**

- All 72 files have `<html lang="en">`

---

## Items Requiring Manual Attention

1. **404.html / welcome.html**: No canonical or meta description — acceptable for error/noindex pages but could be added for completeness
2. **about.html lightbox placeholder**: `<img src="" alt="">` is populated by JS — no fix needed but could confuse automated SEO tools
3. **Blog publish dates**: All 5 blog posts share the same date (2026-03-27) — verify this is correct or update individually
4. **OG images**: about.html, contact.html, and ev-chargers.html use the generic og-home.jpg — consider creating page-specific OG images for better social sharing

---

## Summary

| Check | Before | After |
|-------|--------|-------|
| Titles under 60 chars | 48/72 | **72/72** |
| Descriptions under 155 chars | 0/72 | **70/72** (2 intentionally blank) |
| Canonical URLs | 70/72 | 70/72 (2 n/a) |
| OG tags complete | 67/72 | **70/72** (2 n/a) |
| JSON-LD schemas | 69/72 | 69/72 (2 n/a) |
| BreadcrumbList | 60 files | **67 files** |
| Speakable schema | 0 files | **4 files** |
| Meta author | 0/72 | **72/72** |
| Max-snippet directive | 0/72 | **70/72** |
| Image loading attrs | ~85% | **~99%** |
| H1 hierarchy | 72/72 | 72/72 |
| html lang="en" | 72/72 | 72/72 |
| robots.txt | correct | correct |
| sitemap.xml | complete | complete |
