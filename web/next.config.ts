import type { NextConfig } from "next";

/**
 * Le site tourne comme un serveur Node (image Docker « standalone »).
 * En production, Caddy envoie /api et /uploads à l’API NestJS.
 * En développement, ces chemins sont redirigés ici vers l’API locale.
 */
const API = process.env.API_INTERNAL_URL;

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  async rewrites() {
    if (!API || process.env.NODE_ENV === "production") return [];
    return [
      { source: "/api/:chemin*", destination: `${API}/api/:chemin*` },
      { source: "/uploads/:chemin*", destination: `${API}/uploads/:chemin*` },
    ];
  },
  async headers() {
    return [{ source: "/admin/:chemin*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] }];
  },
};

export default nextConfig;
