import { unstable_cache } from "next/cache";
import { experiences as experiencesLocales, type Experience } from "@/content/parcours";
import { projets as projetsLocaux, type Projet } from "@/content/projets";
import { baseActive, sql } from "@/lib/serveur/db";

/**
 * Accès aux données du site, par ordre de priorité :
 * 1. la base Postgres (DATABASE_URL, Neon sur Vercel), gérée depuis l’espace admin ;
 * 2. l’API NestJS (API_INTERNAL_URL), pour l’auto-hébergement Docker ;
 * 3. le contenu des fichiers src/content/, utilisé aussi si la source configurée ne répond pas.
 */
const API = process.env.API_INTERNAL_URL;

function depuisBase<T>(requete: string, tag: string, repli: T) {
  const lire = unstable_cache(async () => (await sql(requete)) as T, [tag], {
    revalidate: 300,
    tags: [tag],
  });
  return async (): Promise<T> => {
    try {
      return await lire();
    } catch (e) {
      console.warn(`Base indisponible (${tag}), contenu local utilisé :`, (e as Error).message);
      return repli;
    }
  };
}

async function depuisApi<T>(chemin: string, tag: string, repli: T): Promise<T> {
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

const projetsBase = depuisBase<Projet[]>(
  `SELECT slug, nom, type, annee, categories, description, role, technologies, visuel, etude
   FROM projets WHERE publie ORDER BY ordre, "createdAt"`,
  "projets",
  projetsLocaux,
);
const experiencesBase = depuisBase<Experience[]>(
  `SELECT periode, poste, structure, description, technos
   FROM experiences WHERE publie ORDER BY ordre, "createdAt"`,
  "experiences",
  experiencesLocales,
);

export async function getProjets(): Promise<Projet[]> {
  if (baseActive) return projetsBase();
  if (API) return depuisApi("/projets", "projets", projetsLocaux);
  return projetsLocaux;
}

export async function getProjet(slug: string): Promise<Projet | undefined> {
  const tous = await getProjets();
  return tous.find((p) => p.slug === slug);
}

export async function getExperiences(): Promise<Experience[]> {
  if (baseActive) return experiencesBase();
  if (API) return depuisApi("/experiences", "experiences", experiencesLocales);
  return experiencesLocales;
}
