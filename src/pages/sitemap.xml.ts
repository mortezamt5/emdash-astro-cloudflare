import type { APIRoute } from "astro";

// This release has one public route. Extend the sitemap when CMS routes launch.
export const prerender = false;

export const GET: APIRoute = ({ site, url }) => {
  const home = new URL("/", site ?? url).toString().replaceAll("&", "&amp;");
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>' + home + '</loc></url>\n</urlset>\n';
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
