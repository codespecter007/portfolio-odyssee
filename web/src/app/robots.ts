import type { MetadataRoute } from "next";
import { profil } from "@/content/profil";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/interne/"] },
    sitemap: `${profil.site}/sitemap.xml`,
    host: profil.site,
  };
}
