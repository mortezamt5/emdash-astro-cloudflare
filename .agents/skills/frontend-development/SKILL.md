---
name: frontend-development
description: Build or maintain Sipazon's public Astro pages, components, vanilla CSS, and native browser interactions, including prototype and responsive visual work.
---

# Frontend development

## Purpose and use

Use for public website implementation, layout, interactions, styling, and visual quality. Read root AGENTS.md first. Use the EmDash skill when changing content queries or models, and the SEO/performance skill when those outcomes are in scope.

## Scope

Own Astro pages, layouts, reusable sections/components, TypeScript view models, native browser scripts, error states, and Cloudflare-compatible server rendering. Keep public presentation separate from CMS data access. Build only routes and features confirmed for the task.

## Workflow

1. Inspect the current implementation and .prototype/sipazon-prototype.html for section order, geometry, responsive behavior, and interactions. Check .prototype/SIPazon-Website-Implementation-Spec.md for supplementary guidance and ARCHITECTURE_ASSESSMENT.md for known gaps.
2. Identify reusable Astro components without changing the approved section composition. Identify copy, images, links, and product claims that need production approval.
3. Check .prototype/colour-roles-palette.png before defining semantic color tokens. The image shows Deep Navy #041C2B, Electric Blue #1F3FE6, Communication Cyan #00A8F4, Signal Blue #1476FF, Slate Navy #0A3348, Graphite #676767, Silver #D8D8D8, Ice Blue #EAF7FF, and White #FFFFFF. Use the image as final authority if a transcription differs.
4. Implement semantic HTML, responsive vanilla CSS, Astro components, and only the native JavaScript needed for approved interactions. Use the appropriate approved SVG from .prototype/logo-web/ without altering it.
5. Compare rendered desktop, tablet, and mobile views with the prototype's structure and spacing. Check keyboard flow, mobile navigation, focus behavior, motion preferences, and contrast; explain unavoidable differences.

## Technical rules

- Use Astro and on-demand SSR for CMS-backed pages on Cloudflare Workers. EmDash's admin React integration does not authorize public React or public hydration.
- Use vanilla CSS, semantic CSS custom properties, responsive grids, and Astro component-scoped styles where useful. No Tailwind, Sass/SCSS, CSS Modules, or extra styling framework.
- Preserve approved layout, navigation, component proportions, and interactions. Do not redesign from preference or assume additional product routes.
- Treat prototype copy, model numbers, integrations, mock data, embedded logo, orange #E0690A, and dark theme as unapproved for production. Do not invent replacement claims.
- Keep .prototype/ read-only. Use semantic landmarks, accessible names, visible focus, keyboard controls, reduced-motion support, and WCAG 2.2 AA as the target.

## Frontend definition of done

- Relevant build and type checks pass; interaction and error behavior are tested.
- Relevant desktop, tablet, and mobile views have been inspected against the prototype; any deviations are reported.
- Keyboard, focus, contrast, motion, and image alternatives are checked for affected UI.
- Public pages use approved assets and palette tokens; no unverified marketing claims are introduced.
- Report the checks actually run and remaining gaps.

## References

- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Astro on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
