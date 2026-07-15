/* =====================================================================
 * Aya-Within — Analytics & site-verification configuration
 * ---------------------------------------------------------------------
 * Edit the values below to turn features on. Every value here is PUBLIC
 * (these IDs appear in the page HTML anyway), so it is safe to commit
 * this file to the repository.
 *
 * Leave any value as an empty string ("") to keep that feature OFF.
 * See ANALYTICS.md for step-by-step setup instructions.
 * ===================================================================== */
window.SITE_CONFIG = {
  // Master switch. Set to false to disable ALL analytics everywhere.
  enabled: true,

  // Don't load analytics when viewing on localhost / 127.0.0.1 (recommended).
  disableOnLocalhost: true,

  // Google Analytics 4 — Measurement ID, looks like "G-XXXXXXXXXX".
  ga4MeasurementId: "",

  // Microsoft Clarity — Project ID, looks like "abcde12345".
  clarityProjectId: "",

  // Google Search Console — the "content" value from the HTML-tag method.
  // NOTE: JS-injected meta tags are best-effort for verification; the DNS or
  // HTML-file method is more reliable for GitHub Pages (see ANALYTICS.md).
  googleSiteVerification: "",

  // Bing Webmaster Tools — the "content" value of the msvalidate.01 meta tag.
  bingSiteVerification: ""
};
