---
name: cloudflare-deployment
description: Configure or operate MORazon's Astro/EmDash Cloudflare Workers deployment, D1, R2, environments, caching, migrations, secrets, and recovery.
---

# Cloudflare deployment

## Purpose and use

Use for infrastructure configuration, deployment, environment bindings, migrations, caching, security, monitoring, and recovery. Read root AGENTS.md first. Follow the installed Astro, EmDash, adapter, and Wrangler versions when applying documentation.

## Scope and rules

The public Astro site and EmDash run on Cloudflare Workers with D1 for data and R2 for uploaded media. The EmDash admin requires its React integration; this does not add React to public pages. Keep .prototype/ read-only; its HTML and palette are presentation references, not deployment configuration.

- Never depend on persistent local filesystem state in a Worker or expose Worker secrets to browser code.
- Separate development, staging, and production Workers, D1 databases, R2 buckets, secrets, and domains. Protect production resources and keep preview away from production data.
- Cache only eligible anonymous public SSR routes. Keep admin, preview, authenticated, personalized, and error responses out of public cache. Use supported EmDash cache hints and verify invalidation after content changes.
- Treat migrations as controlled changes: inspect them, back up affected data, rehearse against staging, and verify results. Back up D1 and R2 independently; rehearse restoration.
- Keep infrastructure changes within the requested scope. Confirm account, DNS, and operational ownership before production cutover.

## Workflow

1. Inspect current bindings, environments, versions, migration state, cache rules, secrets handling, and rollback options.
2. Develop locally with documented EmDash/Cloudflare tooling and non-production resources; verify Worker behavior, D1 connectivity, and R2 access.
3. Run relevant type and build checks; deploy to staging using the project's established workflow.
4. Rehearse and verify migrations. Smoke-test public pages, EmDash admin/preview, product publishing, SEO output, cache behavior, and environment isolation in staging.
5. Before a requested production deployment, confirm recovery assets and rollback path. Deploy through the approved workflow, monitor startup/errors and content visibility, and be ready to revert.

## Validation checklist

- Worker starts with the expected Astro/EmDash runtime and correct D1/R2 bindings.
- Required secrets are present server-side only; staging and production resources are isolated.
- Migrations, publishing visibility, route cache invalidation, and admin/preview cache exclusion are verified.
- D1 and R2 backup and restore procedures are documented and exercised at a level appropriate to the change.
- Monitoring and rollback readiness are checked; report actual results and remaining operational gaps.

## References

- [EmDash Cloudflare deployment](https://docs.emdashcms.com/deployment/cloudflare/)
- [EmDash route caching](https://docs.emdashcms.com/deployment/route-caching/)
- [Cloudflare Workers with Astro](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)
- [Cloudflare D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/)
- [Cloudflare R2 objects](https://developers.cloudflare.com/r2/objects/)
