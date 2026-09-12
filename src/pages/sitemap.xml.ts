import type { APIRoute } from "astro";

const routes = [
  { path: "/", priority: "1.0" },
  { path: "/guru", priority: "0.8" },
  { path: "/classes", priority: "0.9" },
  { path: "/curriculum", priority: "0.7" },
  { path: "/fees", priority: "0.8" },
  { path: "/trial", priority: "0.9" },
];

export const GET: APIRoute = ({ site }) => {
  const base = site?.toString().replace(/\/$/, "") ?? "";
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>${base}${route.path}</loc>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
