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
};

export default nextConfig;
