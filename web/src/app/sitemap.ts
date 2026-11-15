import type { MetadataRoute } from "next";
import { profil } from "@/content/profil";
import { getProjets } from "@/lib/donnees";

// Recalculé au plus une fois par heure, pour inclure les projets ajoutés depuis l’admin.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = profil.site;
  const projets = await getProjets();
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/projets/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/parcours/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact/`, changeFrequency: "yearly", priority: 0.6 },
    ...projets.map((p) => ({
      url: `${base}/projets/${p.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
