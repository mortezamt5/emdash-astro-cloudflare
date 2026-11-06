import { getEmDashCollection, sanitizeHref, type MediaValue } from "emdash";

export interface NavigationItem {
  label: string;
  description?: string;
  icon?: MediaValue;
  href?: string;
  target?: "_self" | "_blank";
  children: NavigationItem[];
  feature?: { tag?: string; title: string; description?: string; linkLabel?: string; href?: string };
}

function normalize(value: unknown): NavigationItem | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  if (item.enabled !== true || typeof item.label !== "string" || !item.label.trim()) return null;
  const raw = typeof item.href === "string" ? item.href.trim() : "";
  let href: string | undefined;
  if (item.link_type === "external" && /^https?:\/\//i.test(raw)) href = sanitizeHref(raw);
  if (item.link_type === "internal" && /^\/(?![\/\\])/.test(raw)) href = sanitizeHref(raw);
  if (item.link_type === "anchor" && (/^#[^\s]*$/.test(raw) || /^\/(?![\/\\])[^\s]*#/.test(raw))) href = sanitizeHref(raw);
  if (href === "#" && raw !== "#") href = undefined;
  const image = item.icon;
  const icon = image && typeof image === "object" && !Array.isArray(image) && typeof (image as Record<string, unknown>).id === "string" ? image as MediaValue : undefined;
  const featureHref = typeof item.feature_href === "string" ? sanitizeHref(item.feature_href.trim()) : "#";
  const feature = typeof item.feature_title === "string" && item.feature_title.trim() ? {
    title: item.feature_title,
    tag: typeof item.feature_tag === "string" ? item.feature_tag : undefined,
    description: typeof item.feature_description === "string" ? item.feature_description : undefined,
    linkLabel: typeof item.feature_link_label === "string" ? item.feature_link_label : undefined,
    href: featureHref !== "#" ? featureHref : undefined,
  } : undefined;
  return {
    label: item.label,
    description: typeof item.description === "string" ? item.description : undefined,
    icon,
    feature,
    href,
    target: item.target === "_blank" ? "_blank" : "_self",
    children: Array.isArray(item.children) ? item.children.map(normalize).filter((child): child is NavigationItem => child !== null) : [],
  };
}

export async function getNavigation(key: string) {
  const result = await getEmDashCollection("site_navigation", { where: { menu_key: key }, limit: 1 });
  const data = result.entries?.[0]?.data;
  const items = Array.isArray(data?.items) ? data.items.map(normalize).filter((item): item is NavigationItem => item !== null) : [];
  return { items, cacheHint: result.cacheHint, error: result.error };
}
