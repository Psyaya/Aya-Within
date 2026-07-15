# Analytics & Site Verification

This site is instrumented for analytics and search-engine verification through a
small, config-driven setup — **no build step and no code changes required** to turn
things on. You only edit one file: [`analytics-config.js`](analytics-config.js).

## How it works

Two files drive everything, and both are already included in the `<head>` of
[`index.html`](index.html) and [`blog.html`](blog.html):

| File | Purpose |
|---|---|
| [`analytics-config.js`](analytics-config.js) | The **only file you edit.** Holds the public IDs/keys as variables. |
| [`analytics.js`](analytics.js) | The loader. Reads the config and conditionally loads Google Analytics 4, Microsoft Clarity, verification meta tags, and event tracking. |

**Nothing loads unless the matching ID is filled in.** With empty values the site
runs cleanly — no network requests, no console errors. By default analytics is also
**skipped on `localhost`/`127.0.0.1`** so your own local testing doesn't pollute the data.

> All values in `analytics-config.js` are **public** (they appear in the page HTML
> anyway), so it is safe to commit them. Do **not** put private API secrets here.

## The config file

```js
window.SITE_CONFIG = {
  enabled: true,               // master on/off switch
  disableOnLocalhost: true,    // skip tracking on localhost (recommended)
  ga4MeasurementId: "",        // "G-XXXXXXXXXX"
  clarityProjectId: "",        // "abcde12345"
  googleSiteVerification: "",  // Google Search Console HTML-tag value
  bingSiteVerification: ""     // Bing msvalidate.01 value
};
```

---

## Setup steps

### 1. Google Analytics 4 (traffic + conversions)

1. Go to <https://analytics.google.com> → **Admin** → **Create property**.
2. Add a **Web** data stream for `https://ayawithin.com`.
3. Copy the **Measurement ID** (looks like `G-XXXXXXXXXX`).
4. Paste it into `ga4MeasurementId` in `analytics-config.js`.

GA4 is loaded with `anonymize_ip: true`. Custom conversion events are sent
automatically (see [Events tracked](#events-tracked)).

### 2. Microsoft Clarity (heatmaps + session recordings)

1. Go to <https://clarity.microsoft.com> → **Sign in** → **New project**.
2. Name it "Aya-Within", set the URL to `https://ayawithin.com`.
3. Open **Settings → Overview** and copy the **Project ID** (looks like `abcde12345`).
4. Paste it into `clarityProjectId` in `analytics-config.js`.

Clarity gives you free heatmaps and session replays — very useful for seeing where
visitors hesitate before booking. The same conversion events are forwarded to Clarity
as custom events so you can filter recordings by "did they book?".

### 3. Google Search Console (indexing + search queries)

1. Go to <https://search.google.com/search-console> → **Add property**.
2. Choose the **URL prefix** method with `https://ayawithin.com`.
3. Pick the **HTML tag** verification option and copy the `content="..."` value.
4. Paste that value into `googleSiteVerification` in `analytics-config.js`.
5. After it goes live, click **Verify**, then submit the sitemap:
   `https://ayawithin.com/sitemap.xml`.

> **Verification reliability note:** The verifier fetches the page and looks for the
> meta tag. Because our tag is injected by JavaScript, the meta-tag method is
> **best-effort** and may not always verify. The most reliable options for this
> GitHub Pages + custom-domain setup are:
> - **DNS method (recommended):** add the TXT record Google/Bing gives you to the
>   `ayawithin.com` DNS zone. This is independent of the page HTML.
> - **HTML file method:** drop the provided `googleXXXX.html` file in the repo root
>   and commit it.
> - **Direct meta tag:** paste the raw `<meta … />` tag directly into the `<head>`
>   of `index.html` (and `blog.html`) instead of using the config.

### 4. Bing Webmaster Tools

1. Go to <https://www.bing.com/webmasters> → **Add site** `https://ayawithin.com`.
   (You can also **import from Google Search Console** to skip re-verifying.)
2. Choose the **meta tag** option and copy the `content` value of the
   `msvalidate.01` tag.
3. Paste it into `bingSiteVerification` in `analytics-config.js`.
4. Submit the sitemap: `https://ayawithin.com/sitemap.xml`.

The same DNS/file caveat from step 3 applies.

---

## Events tracked

Sent to **both** GA4 and Clarity automatically by [`analytics.js`](analytics.js):

| Event name | Fires when | Notes |
|---|---|---|
| `book_click` | A **Calendly** link/button is clicked | Primary conversion. Includes `link_text`, `link_url`. |
| `generate_lead` | The **contact** form succeeds | Fires on the success modal, so only real submissions count. |
| `newsletter_signup` | The **subscribe** form succeeds | Fires on the success modal. |
| `outbound_click` | Any external link (social, Google Reviews) is clicked | Includes `link_domain`, `link_url`. Excludes Calendly. |

You can fire your own events from anywhere with:

```js
window.ayaTrack("my_event", { any: "params" });
```

### Marking conversions in GA4

`book_click`, `generate_lead`, and `newsletter_signup` are the ones worth marking as
**Key events / conversions**: GA4 → **Admin → Events → Key events**, toggle them on
(they appear after they've fired at least once).

---

## Testing

1. Fill in real IDs in `analytics-config.js`.
2. Temporarily set `disableOnLocalhost: false` (or just test on the live domain).
3. Serve the site:
   ```bash
   python3 -m http.server 8080
   ```
4. **GA4:** open **Reports → Realtime** (or **Admin → DebugView**) and load the site —
   you should appear within seconds. Click a "Book a Session" button and confirm
   `book_click` shows up.
5. **Clarity:** the dashboard shows live sessions within a couple of minutes.
6. **DevTools → Network:** filter for `gtag/js` and `clarity.ms/tag` to confirm the
   tags loaded. **Console** should be clean.
7. **Verification:** use each tool's "Verify" button after the change is live.

> Remember to set `disableOnLocalhost` back to `true` before committing so local
> testing doesn't send data.

---

## Privacy / compliance

- GA4 runs with `anonymize_ip: true`.
- GA4 and Clarity both set cookies and process EU visitor data. Aya works with
  international clients, so if you expect meaningful EU/UK traffic you should add a
  **cookie-consent banner** and gate the loader behind consent (set `enabled: false`
  until the visitor accepts, then re-run). This is a business/legal decision and is
  **not** implemented here.
- Consider adding a short "Analytics & cookies" note to a Privacy Policy page.
