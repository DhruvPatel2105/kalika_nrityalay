import type { APIRoute } from "astro";
import { getPublishedPosts } from "@/lib/blog";
import { withTrailingSlash } from "@/lib/url";

const routes: { path: string; priority: string; lastmod?: Date }[] = [
  { path: "/", priority: "1.0" },
  { path: "/guru", priority: "0.8" },
  { path: "/classes", priority: "0.9" },
  { path: "/curriculum", priority: "0.7" },
  { path: "/fees", priority: "0.8" },
  { path: "/trial", priority: "0.9" },
  { path: "/bharatanatyam-classes-vastral-ahmedabad", priority: "0.9" },
  { path: "/benefits-of-bharatanatyam", priority: "0.8" },
  { path: "/blog", priority: "0.6" },
];

export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, "") ?? "";

  const posts = await getPublishedPosts();
  const all = [
    ...routes,
    ...posts.map((post) => ({
      path: `/blog/${post.id}`,
      priority: "0.6",
      lastmod: post.data.updatedDate ?? post.data.pubDate,
    })),
  ];

  const urls = all
    .map(
      (route) => `  <url>
    <loc>${base}${withTrailingSlash(route.path)}</loc>${
      route.lastmod
        ? `\n    <lastmod>${route.lastmod.toISOString().slice(0, 10)}</lastmod>`
        : ""
    }
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
