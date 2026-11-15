export const COLONNES_PROJET = `id, slug, ordre, publie, nom, type, annee, categories, description, role, technologies, visuel, etude`;
export const VALEURS_PROJET = (p: {
  slug: string;
  publie: boolean;
  nom: string;
  type: string;
  annee: string | null;
  categories: string[];
  description: string;
  role: string;
  technologies: unknown;
  visuel: unknown;
  etude: unknown;
}) => [
  p.slug,
  p.publie,
  p.nom,
  p.type,
  p.annee,
  p.categories,
  p.description,
  p.role,
  JSON.stringify(p.technologies),
  JSON.stringify(p.visuel),
  JSON.stringify(p.etude),
];
