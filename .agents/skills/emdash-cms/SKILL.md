---
name: emdash-cms
description: Design or change MORazon's EmDash content models, product editing, media, editorial workflows, server queries, previews, and publishing behavior.
---

# EmDash CMS

## Purpose and use

Use for CMS configuration, content architecture, administration workflows, and Astro integration with EmDash. Read root AGENTS.md first; consult this skill only when the task changes CMS-owned content or its delivery.

## Scope

Distinguish static layout/presentation, editable corporate content, product records, and uploaded media. EmDash owns structured editable content and product administration; Astro owns public presentation. Work with Content Collections, supported field types, relationships/taxonomy, revisions, permissions, draft/published states, preview, SEO metadata, media, server queries, cache hints, and invalidation as requirements call for them.

## Workflow

1. Inspect the installed EmDash version, current configuration, content model, and editorial behavior. Use documentation matching that version; ARCHITECTURE_ASSESSMENT.md is supplementary context, not a finalized schema.
2. Confirm which content editors manage. Products must be managed through EmDash, but the exact fields, product granularity, detail pages, search, filtering, galleries, and downloads are not assumed launch requirements. Keep layout and brand tokens in code unless editing them is requested.
3. Define the smallest supported model for confirmed content, with typed access and meaningful validation. Handle media references, alt text, SEO fields, and relationships only where needed.
4. Query published content server-side for public Astro rendering. Keep drafts behind supported authenticated preview; handle missing or unpublished records and route behavior explicitly.
5. Apply supported EmDash cache hints to CMS-backed public routes and test publication, unpublication, and invalidation against the actual deployed configuration.

## Rules

- Preserve the source hierarchy in AGENTS.md: prototype HTML controls layout; palette PNG controls brand colors; the spec is supplementary. Never modify .prototype/ or copy its unverified marketing claims into content.
- Use documented EmDash APIs for the installed version. Do not couple application code to EmDash's internal D1 tables or assume undocumented commands.
- Separate editor permissions from public access. Do not expose drafts, previews, admin credentials, or private media in public responses.
- Do not make every section editable merely because EmDash permits it. Model product fields and taxonomy from confirmed editorial needs.

## Validation checklist

- Create/edit, draft, preview, publish, unpublish, and revision behavior work for affected content.
- Media upload/reference and alt text work; public rendering shows only published content.
- Missing content and SEO metadata have intentional output.
- Cache invalidation makes changes visible at the expected time; admin and preview responses remain private.
- Report which flows were exercised and which depend on unresolved editorial decisions.

## References

- [EmDash collections](https://docs.emdashcms.com/concepts/collections/)
- [EmDash field types](https://docs.emdashcms.com/reference/field-types/)
- [EmDash content querying](https://docs.emdashcms.com/guides/querying-content/)
- [EmDash working with content](https://docs.emdashcms.com/guides/working-with-content/)
- [EmDash route caching](https://docs.emdashcms.com/deployment/route-caching/)
