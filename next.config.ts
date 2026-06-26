import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(process.cwd()),
  images: {
    // Allow remote cover images for blog articles
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    // Preserve SEO from the old static .html URLs
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/servis.html", destination: "/servis", permanent: true },
      { source: "/portfolio.html", destination: "/portfolio", permanent: true },
      { source: "/hubungi.html", destination: "/hubungi", permanent: true },
    ];
  },
  async headers() {
    // Static security headers (these never break anything). The dynamic,
    // per-request Content-Security-Policy is set in middleware.ts.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
