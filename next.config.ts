import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site — deploy the `out/` folder to Vercel, Netlify, GitHub Pages or any CDN.
  output: "export",
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()) },
  // Cache Components is off on purpose: it forbids the `dynamic = "force-static"` config
  // that static export requires for sitemap/robots, and a one-page static site gains nothing from it.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
