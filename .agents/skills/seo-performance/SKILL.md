---
name: seo-performance
description: Review or implement Sipazon public-page technical SEO, search-related accessibility, and Core Web Vitals performance.
---

# SEO and performance

## Purpose and use

Use for metadata, indexing, structured data, redirects, accessibility related to search, page speed, or performance audits. Read root AGENTS.md first; coordinate with EmDash skill when CMS metadata or publishing affects output.

## Scope and workflow

1. Inspect actual public routes, rendered HTML, approved content, and indexing requirements. The prototype HTML defines layout and behavior, the palette PNG defines brand colors, and the implementation spec is supplementary; none establishes approved product claims. Keep .prototype/ read-only.
2. For confirmed pages, provide semantic landmarks and heading order, unique titles/descriptions, canonical URLs, Open Graph and X/Twitter metadata, meaningful image alternatives, and stable readable URLs. Use EmDash SEO features where supported by the installed version, with explicit fallbacks.
3. Add or verify sitemap, robots.txt, and redirect mapping once route and domain decisions are confirmed. Include only published canonical pages. Add Organization or Product structured data only when the facts and page type justify it; never invent prices, availability, ratings, certifications, or company claims. Handle multilingual SEO only if languages are approved.
4. Optimize real assets and rendering: responsive images and dimensions, the actual LCP image, fonts, small/deferred native scripts, lean CSS, appropriate public caching, and restrained third-party code. Avoid needless public hydration and layout shifts.
5. Measure affected pages, fix concrete findings, and compare lab and production field data separately.

## Targets and accessibility

Core Web Vitals good thresholds are LCP <= 2.5 seconds, INP <= 200 milliseconds, and CLS <= 0.1, measured at the 75th percentile of real visits, separately for mobile and desktop. Lighthouse and local browser tests are diagnostic lab checks, not proof of these field targets.

Target WCAG 2.2 AA: keyboard operation, visible focus, accessible navigation/forms, semantic landmarks, useful alt text, sufficient contrast, and reduced-motion support. Check palette colors in context; a brand color may fail for small text on white.

## Validation checklist

- Inspect rendered titles, descriptions, canonicals, social tags, headings, alt text, and structured data on affected routes.
- Verify robots and sitemap output, published-only URLs, redirects, and locale tags where applicable.
- Run a relevant Lighthouse or browser performance check; inspect image dimensions, script cost, and layout shifts.
- Exercise keyboard and accessibility checks on affected interactions.
- Use production real-user monitoring to judge field targets when available; report absent data as unverified.

## References

- [Google Search Central SEO guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Core Web Vitals](https://web.dev/articles/vitals)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [EmDash SEO](https://docs.emdashcms.com/guides/seo/)
