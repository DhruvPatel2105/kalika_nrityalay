import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// TODO(domain): placeholder until the real domain is registered — update here
// and it propagates to canonical tags, sitemap.xml, and JSON-LD.
export default defineConfig({
  site: "https://kalikanrityalay.com",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
});
