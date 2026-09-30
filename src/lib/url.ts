import { site } from "@/content/site";

/**
 * Pages build to /path/index.html, so the served (and canonical) URL
 * is /path/ — sitemap and JSON-LD must use the same form, or search
 * engines see a redirect for every listed page. Files keep their
 * extension untouched.
 */
export function withTrailingSlash(path: string): string {
  if (path.endsWith("/") || /\.[a-z0-9]+$/i.test(path)) return path;
  return `${path}/`;
}

export function absoluteUrl(path: string): string {
  return new URL(withTrailingSlash(path), site.domain).toString();
}
