/* =====================================================================
 * Aya-Within — Analytics loader
 * ---------------------------------------------------------------------
 * Reads window.SITE_CONFIG (from analytics-config.js) and conditionally
 * loads Google Analytics 4, Microsoft Clarity, site-verification meta
 * tags, and conversion/interaction event tracking.
 *
 * Nothing loads unless the matching ID is filled in, so the site works
 * cleanly with an empty config (no failed requests, no console noise).
 * ===================================================================== */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  if (cfg.enabled === false) return;

  var host = location.hostname;
  var isLocal = host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "";
  if (cfg.disableOnLocalhost !== false && isLocal) {
    // eslint-disable-next-line no-console
    console.info("[analytics] Disabled on localhost (set disableOnLocalhost:false to test).");
    return;
  }

  /* ---- Site-verification meta tags (best-effort; see ANALYTICS.md) ---- */
  function addMeta(name, content) {
    if (!content) return;
    if (document.querySelector('meta[name="' + name + '"]')) return;
    var m = document.createElement("meta");
    m.setAttribute("name", name);
    m.setAttribute("content", content);
    (document.head || document.documentElement).appendChild(m);
  }
  addMeta("google-site-verification", cfg.googleSiteVerification);
  addMeta("msvalidate.01", cfg.bingSiteVerification);

  /* ---- Google Analytics 4 ---- */
  if (cfg.ga4MeasurementId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(cfg.ga4MeasurementId);
    (document.head || document.documentElement).appendChild(ga);
    window.gtag("js", new Date());
    window.gtag("config", cfg.ga4MeasurementId, { anonymize_ip: true });
  }

  /* ---- Microsoft Clarity ---- */
  if (cfg.clarityProjectId) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", cfg.clarityProjectId);
  }

  /* ---- Unified event helper (fires to GA4 + Clarity) ---- */
  function track(name, params) {
    params = params || {};
    if (typeof window.gtag === "function") window.gtag("event", name, params);
    if (typeof window.clarity === "function") {
      try {
        window.clarity("event", name);
        if (params.form) window.clarity("set", "form", params.form);
      } catch (e) { /* no-op */ }
    }
  }
  // Exposed so inline code can call window.ayaTrack('name', {...}) if desired.
  window.ayaTrack = track;

  /* ---- Conversion / interaction tracking ---- */
  function wireEvents() {
    // Booking (Calendly) clicks — primary conversion.
    document.querySelectorAll('a[href*="calendly.com"]').forEach(function (a) {
      a.addEventListener("click", function () {
        track("book_click", {
          event_category: "conversion",
          link_url: a.href,
          link_text: (a.textContent || "").trim().slice(0, 100)
        });
      });
    });

    // Contact form success — the modal only appears on a successful send.
    var contactModal = document.getElementById("contactSuccessModal");
    if (contactModal) {
      contactModal.addEventListener("shown.bs.modal", function () {
        track("generate_lead", { event_category: "conversion", form: "contact" });
      });
    }

    // Newsletter subscribe success.
    var subModal = document.getElementById("subscribeSuccessModal");
    if (subModal) {
      subModal.addEventListener("shown.bs.modal", function () {
        track("newsletter_signup", { event_category: "conversion", form: "subscribe" });
      });
    }

    // Outbound clicks (social, Google reviews, etc.) — excludes Calendly (tracked above).
    document.querySelectorAll('a[href^="http"]').forEach(function (a) {
      if (a.hostname && a.hostname !== host && a.href.indexOf("calendly.com") === -1) {
        a.addEventListener("click", function () {
          track("outbound_click", { link_domain: a.hostname, link_url: a.href });
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireEvents);
  } else {
    wireEvents();
  }
})();
