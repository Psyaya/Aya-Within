# Aya-Within

Marketing website for **Aya-Within** — online Internal Family Systems (IFS) coaching with Aya (Ayelet H) Fogel.

- **Live site:** https://ayawithin.com
- **Hosting:** GitHub Pages (custom domain via `CNAME`, HTTPS automatic)
- **Stack:** Static HTML + CSS + vanilla JS. No framework, no build step.

> **Important positioning note:** Aya is an **IFS coach**, and explicitly *"not a licensed therapist."* Sessions are coaching and personal exploration, **not** therapy or mental-health treatment. All SEO/metadata/schema intentionally reflect a *coaching* practice — `Psychologist`/`MedicalBusiness` schema and "therapy" keywords are deliberately avoided.

---

## Project structure

```
index.html          # Single-page home (anchor sections: #offerings, #about, #about-ifs, #faq, #contact)
blog.html           # Blog / resources page (placeholder content for now)
style.css           # All site styles (~1,900 lines; Bootstrap-assisted)
404.html            # Custom on-brand 404 (served automatically by GitHub Pages)
robots.txt          # Crawl directives + sitemap pointer (welcomes AI crawlers)
sitemap.xml         # XML sitemap
site.webmanifest    # PWA/basic web app manifest
analytics-config.js # Public analytics IDs/keys you edit (GA4, Clarity, verification)
analytics.js        # Loader: GA4 + Microsoft Clarity + verification + event tracking
ANALYTICS.md        # How to set up and use analytics/verification
CNAME               # ayawithin.com
images/             # Logos, icons, photos
```

**Third-party services:** Bootstrap 5.3.2 + Bootstrap Icons + Google Fonts (Playfair Display) via CDN · [Web3Forms](https://web3forms.com) for contact/subscribe form handling · [Calendly](https://calendly.com/aya-within) for booking.

Because the site is fully static and JavaScript only adds interactivity (carousel, modals, form POST) rather than rendering content, **the source HTML is exactly what crawlers and users receive** — there are no CSR/SSR/hydration concerns.

---

## Running locally

No build step is required. Serve the folder over HTTP (don't just open the file, so that
absolute paths, the manifest, and `fetch` behave correctly):

```bash
# Python (any OS)
python3 -m http.server 8080
# then visit http://localhost:8080

# or Node
npx serve .

# or VS Code: right-click index.html → "Open with Live Server"
```

Pages to verify: `/` (home), `/blog.html`, and a bad URL (e.g. `/nope`) to confirm the custom 404.

---

## SEO / accessibility / performance audit (2026-07)

A full technical SEO, accessibility, and performance audit was performed. Summary of the
health scores **before → after** the implemented fixes:

| Category | Before | After |
|---|---:|---:|
| Technical SEO | 25 | **82** |
| On-Page SEO | 30 | **80** |
| Local SEO | 15 | **45** |
| Content Quality | 55 | **65** |
| AI Search Readiness | 25 | **70** |
| Accessibility | 65 | **82** |
| Performance | 55 | **65** |
| Structured Data | 0 | **85** |
| Security | 70 | **75** |
| **Overall** | **~30** | **~72** |

### What was wrong (highlights)

- **Critical:** No meta descriptions; developer placeholder title (`Aya-Within – All Pages`); no canonical URLs; no Open Graph/Twitter cards; no favicon; no structured data.
- **High:** Five `<h1>` tags competing on the home page; no `robots.txt`; no `sitemap.xml`.
- **Medium:** Broken CSS background image (`images/brown leaves feet.jpg` did not exist); hero CTA opened an in-page anchor in a new tab (`target="_blank"`); dead footer link (`#blog`); placeholder Facebook link.
- **Business gaps:** No analytics/Search Console; empty blog; no Google Business Profile.

---

## Changes implemented

All changes are in-code and validated (0 editor errors; all JSON-LD, the manifest, and the sitemap parse cleanly).

### Metadata & discoverability
- Rebuilt the `<head>` of [index.html](index.html) and [blog.html](blog.html) with keyword-rich `<title>`, meta description, `canonical`, `robots`, `theme-color`, full **Open Graph** + **Twitter Card** tags, and favicon / apple-touch-icon / manifest links, plus `dns-prefetch` for the CDN.
- Added [robots.txt](robots.txt) (allow-all, explicit allowances for `GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `Google-Extended`, and a sitemap pointer).
- Added [sitemap.xml](sitemap.xml) and [site.webmanifest](site.webmanifest).
- Added a custom on-brand [404.html](404.html) (`noindex`, "Return Home" CTA).

### Structured data (JSON-LD)
- **Home:** `WebSite` + `Person` (with `hasCredential` for degree / IFSCA graduation / RYT-200, `knowsAbout`, `sameAs`) + `ProfessionalService` (with `makesOffer` linking each Calendly session).
- **Home FAQ:** `FAQPage` mirroring the new on-page FAQ.
- **Blog:** `Blog` + `BreadcrumbList`.

### On-page & semantics
- Fixed heading hierarchy: from **5 `<h1>`** on the home page to **exactly one `<h1>` per page** (section headings demoted to `<h2>`, "Background & Training" to `<h3>`). CSS is class-based, so styling was unaffected; the one tag-based rule `.about-training-box h2` was updated to `h3`.
- Added an accessible **FAQ section** (`#faq`) using native `<details>`/`<summary>` with matching styles, and linked "FAQ" in both footers.

### Bug fixes
- [style.css](style.css): repointed the broken `.blog-hero` background image from the missing `images/brown leaves feet.jpg` to the existing `images/ColorsJ.jpg` (eliminates a 404 request, restores the intended look).
- [index.html](index.html): removed `target="_blank"` from the hero "Explore Sessions" CTA (it links to an in-page anchor); fixed the footer `#blog` dead link → `blog.html`.
- [blog.html](blog.html): replaced the placeholder Facebook link (`href="#"` + JS alert) with the real profile URL. *(The blog's Instagram handle was intentionally left as `aya.within_coaching` per owner preference — it differs from the home page's `ayawithin.ifs` on purpose.)*

### Performance nudges
- Added `loading="lazy"` / `decoding="async"` to below-the-fold imagery and `dns-prefetch` for `cdn.jsdelivr.net`.

---

## Recommendations / next steps

These require the owner's accounts, content, or a business decision — they were **not** implemented.

### High priority
1. **Analytics + Search Console.** A config-driven analytics system is now wired in (GA4, Microsoft Clarity, Google/Bing verification, and conversion event tracking) — just add your IDs in [analytics-config.js](analytics-config.js). See [ANALYTICS.md](ANALYTICS.md) for setup. Then verify the domain in Google Search Console and Bing Webmaster Tools and submit `sitemap.xml`.
2. **Publish real blog content.** 4–6 answer-first posts (e.g. *"What is a 'part' in IFS?"*, *"IFS vs. talk therapy"*, *"A simple parts check-in"*) with `BlogPosting` schema. This is the biggest untapped organic + AI-search asset.
3. **Google Business Profile.** Create one as a *service-area* business (virtual). Do **not** invent a physical address.

### Medium priority
4. **Dedicated social-share image.** The `og:image`/`twitter:image` currently point at the logo — create a proper 1200×630 image.
5. **Image optimization.** Add explicit `width`/`height` to `<img>` tags (prevents layout shift / improves CLS), compress and convert large photos to WebP, and add `srcset`.
6. **Contrast check.** Verify brand pink `#C86F80` and gold `#f7a94a` meet WCAG AA (4.5:1) for small text; adjust shades only where needed.
7. **Confirm Instagram handles.** Home uses `ayawithin.ifs`, blog uses `aya.within_coaching` — confirm both are correct.

### Ongoing
8. Trim Bootstrap CSS/JS to what's used; preload the hero image for LCP; consider `background-attachment: scroll` on mobile.
9. Collect Google reviews (link already present) and build a few relevant backlinks (IFS directories, guest posts). Monitor Search Console and iterate on titles/descriptions.

---

## Validating the changes

- **Structured data:** Google [Rich Results Test](https://search.google.com/test/rich-results) & [Schema Markup Validator](https://validator.schema.org/)
- **HTML:** [W3C Validator](https://validator.w3.org/)
- **Performance/Accessibility/SEO:** run Lighthouse against a local server:
  ```bash
  python3 -m http.server 8080
  npx lighthouse http://localhost:8080 --only-categories=performance,accessibility,best-practices,seo --view
  npx pa11y http://localhost:8080
  npx @axe-core/cli http://localhost:8080
  ```
- **Social previews:** Facebook Sharing Debugger · X Card Validator
