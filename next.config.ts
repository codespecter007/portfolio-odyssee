import type { NextConfig } from "next";

// Site statique : `npm run build` génère le dossier `out/`,
// à déposer tel quel sur n'importe quel hébergeur (GitHub Pages, Netlify, OVH…).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
