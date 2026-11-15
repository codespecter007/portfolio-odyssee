import { Pool } from "pg";
import { experiences as experiencesLocales } from "@/content/parcours";
import { projets as projetsLocaux } from "@/content/projets";

/**
 * Base Postgres (Neon sur Vercel). L’intégration Neon fournit DATABASE_URL.
 * Les tables sont créées au premier accès, puis remplies avec le contenu de src/content/
 * si elles sont vides : on ne réécrase jamais le travail fait dans l’admin.
 */
export const URL_BASE = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
export const baseActive = Boolean(URL_BASE);

const g = globalThis as unknown as { __pool?: Pool; __pret?: Promise<void> };

function pool(): Pool {
  if (!URL_BASE) throw new Error("DATABASE_URL absent");
  g.__pool ??= new Pool({ connectionString: URL_BASE, max: 3, idleTimeoutMillis: 10_000 });
  return g.__pool;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS projets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar NOT NULL UNIQUE,
  ordre int NOT NULL DEFAULT 0,
  publie boolean NOT NULL DEFAULT true,
  nom varchar NOT NULL,
  type varchar NOT NULL,
  annee varchar,
  categories text[] NOT NULL DEFAULT '{}',
  description text NOT NULL,
  role text NOT NULL,
  technologies jsonb NOT NULL DEFAULT '[]',
  visuel jsonb NOT NULL DEFAULT '{"type":"vide"}',
  etude jsonb NOT NULL DEFAULT '{}',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ordre int NOT NULL DEFAULT 0,
  publie boolean NOT NULL DEFAULT true,
  periode varchar NOT NULL,
  poste varchar NOT NULL,
  structure varchar NOT NULL,
  description text NOT NULL,
  technos text[] NOT NULL DEFAULT '{}',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS projets_ordre_idx ON projets (ordre);
CREATE INDEX IF NOT EXISTS experiences_ordre_idx ON experiences (ordre);
`;

async function preparer() {
  const c = await pool().connect();
  try {
    await c.query("SELECT pg_advisory_lock(424242)");
    await c.query(SCHEMA);
    const { rows: p } = await c.query("SELECT count(*)::int AS n FROM projets");
    if (p[0].n === 0) {
      for (const [i, x] of projetsLocaux.entries())
        await c.query(
          `INSERT INTO projets (slug, ordre, nom, type, annee, categories, description, role, technologies, visuel, etude)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
          [
            x.slug,
            i + 1,
            x.nom,
            x.type,
            x.annee ?? null,
            x.categories,
            x.description,
            x.role,
            JSON.stringify(x.technologies),
            JSON.stringify(x.visuel),
            JSON.stringify(x.etude),
          ],
        );
    }
    const { rows: e } = await c.query("SELECT count(*)::int AS n FROM experiences");
    if (e[0].n === 0) {
      for (const [i, x] of experiencesLocales.entries())
        await c.query(
          `INSERT INTO experiences (ordre, periode, poste, structure, description, technos)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [i + 1, x.periode, x.poste, x.structure, x.description, x.technos],
        );
    }
  } finally {
    await c.query("SELECT pg_advisory_unlock(424242)").catch(() => {});
    c.release();
  }
}

/** Exécute une requête, après s’être assuré une fois que les tables existent. */
export async function sql<T = Record<string, unknown>>(texte: string, valeurs: unknown[] = []) {
  g.__pret ??= preparer().catch((e) => {
    g.__pret = undefined;
    throw e;
  });
  await g.__pret;
  const r = await pool().query(texte, valeurs);
  return r.rows as T[];
}

/** Plusieurs requêtes dans une même transaction. */
export async function transaction(
  fn: (q: (t: string, v?: unknown[]) => Promise<unknown>) => Promise<void>,
) {
  await sql("SELECT 1");
  const c = await pool().connect();
  try {
    await c.query("BEGIN");
    await fn((t, v) => c.query(t, v));
    await c.query("COMMIT");
  } catch (e) {
    await c.query("ROLLBACK");
    throw e;
  } finally {
    c.release();
  }
}
