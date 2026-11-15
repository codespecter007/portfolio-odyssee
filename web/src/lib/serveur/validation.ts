import { ErreurHttp } from "./http";

const CATEGORIES = ["Web", "Applications", "DevOps", "IA", "Réseaux"];
const VISUELS = ["capture", "mellifica", "reseau", "microservices", "flux", "vide"];

const erreurs: string[] = [];
function texte(o: Record<string, unknown>, cle: string, max: number, min = 0): string {
  const v = o[cle];
  if (typeof v !== "string") {
    erreurs.push(`${cle} : texte attendu`);
    return "";
  }
  const t = v.trim();
  if (t.length < min) erreurs.push(`${cle} : obligatoire`);
  if (t.length > max) erreurs.push(`${cle} : ${max} caractères maximum`);
  return t;
}
const objet = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

function finir() {
  if (erreurs.length) {
    const m = erreurs.join(" · ");
    erreurs.length = 0;
    throw new ErreurHttp(400, m);
  }
}

export type ProjetEntree = {
  slug: string;
  publie: boolean;
  nom: string;
  type: string;
  annee: string | null;
  categories: string[];
  description: string;
  role: string;
  technologies: { nom: string; logo?: string }[];
  visuel: Record<string, unknown>;
  etude: Record<string, unknown>;
};

export function validerProjet(o: Record<string, unknown>): ProjetEntree {
  erreurs.length = 0;
  const slug = texte(o, "slug", 80, 1);
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    erreurs.push("slug : minuscules, chiffres et tirets seulement");
  const annee = o.annee == null || o.annee === "" ? null : texte(o, "annee", 20);
  const categories = Array.isArray(o.categories) ? o.categories : [];
  if (!categories.every((c) => CATEGORIES.includes(c as string)))
    erreurs.push("catégories inconnues");
  const technologies = Array.isArray(o.technologies) ? o.technologies : [];
  if (
    technologies.length > 20 ||
    !technologies.every(
      (t) => objet(t) && typeof t.nom === "string" && t.nom.trim() && t.nom.length <= 40,
    )
  )
    erreurs.push("technologies : 20 au maximum, avec un nom");
  if (!objet(o.visuel) || !VISUELS.includes(o.visuel.type as string))
    erreurs.push("visuel invalide");
  if (!objet(o.etude)) erreurs.push("étude de cas invalide");
  if (JSON.stringify(o.etude ?? {}).length > 40_000) erreurs.push("étude de cas trop longue");
  const r: ProjetEntree = {
    slug,
    publie: o.publie !== false,
    nom: texte(o, "nom", 120, 1),
    type: texte(o, "type", 120),
    annee,
    categories: categories as string[],
    description: texte(o, "description", 600),
    role: texte(o, "role", 400),
    technologies: (technologies as { nom: string; logo?: string }[]).map((t) => ({
      nom: t.nom.trim(),
      ...(t.logo ? { logo: String(t.logo).slice(0, 40) } : {}),
    })),
    visuel: o.visuel as Record<string, unknown>,
    etude: o.etude as Record<string, unknown>,
  };
  finir();
  return r;
}

export type ExperienceEntree = {
  publie: boolean;
  periode: string;
  poste: string;
  structure: string;
  description: string;
  technos: string[];
};

export function validerExperience(o: Record<string, unknown>): ExperienceEntree {
  erreurs.length = 0;
  const technos = Array.isArray(o.technos) ? o.technos : [];
  if (technos.length > 30 || !technos.every((t) => typeof t === "string" && t.length <= 40))
    erreurs.push("technos : 30 au maximum");
  const r: ExperienceEntree = {
    publie: o.publie !== false,
    periode: texte(o, "periode", 60, 1),
    poste: texte(o, "poste", 120, 1),
    structure: texte(o, "structure", 120),
    description: texte(o, "description", 1200),
    technos: (technos as string[]).map((t) => t.trim()).filter(Boolean),
  };
  finir();
  return r;
}

/** Reconnaît le format à partir des premiers octets, sans faire confiance au nom du fichier. */
export function formatImage(buf: Buffer): "png" | "jpg" | "webp" | null {
  if (buf.length < 12) return null;
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP")
    return "webp";
  return null;
}
