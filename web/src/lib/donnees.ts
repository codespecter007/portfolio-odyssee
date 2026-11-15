import { experiences as experiencesLocales, type Experience } from "@/content/parcours";
import { projets as projetsLocaux, type Projet } from "@/content/projets";

/**
 * Accès aux données du site.
 * Si l’API est configurée (API_INTERNAL_URL), le contenu vient de la base, géré depuis l’admin.
 * Sinon, ou si l’API ne répond pas, le site utilise le contenu des fichiers src/content/.
 */
const API = process.env.API_INTERNAL_URL;

async function lire<T>(chemin: string, tag: string, repli: T): Promise<T> {
  if (!API) return repli;
  try {
    const r = await fetch(`${API}/api${chemin}`, {
      next: { revalidate: 300, tags: [tag] },
      signal: AbortSignal.timeout(4000),
    });
    if (r.status === 404) return repli;
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return (await r.json()) as T;
  } catch (e) {
    console.warn(`API indisponible (${chemin}), contenu local utilisé :`, (e as Error).message);
    return repli;
  }
}

export const getProjets = () => lire<Projet[]>("/projets", "projets", projetsLocaux);

export async function getProjet(slug: string): Promise<Projet | undefined> {
  const tous = await getProjets();
  return tous.find((p) => p.slug === slug);
}

export const getExperiences = () =>
  lire<Experience[]>("/experiences", "experiences", experiencesLocales);
