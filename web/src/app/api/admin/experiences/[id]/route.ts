import { sql } from "@/lib/serveur/db";
import { ErreurHttp, lireJson, rafraichir, repondre, route } from "@/lib/serveur/http";
import { validerExperience } from "@/lib/serveur/validation";

const COLONNES = `id, ordre, publie, periode, poste, structure, description, technos`;
type Ctx = { params: Promise<{ id: string }> };

export const GET = route(async (_req, { params }: Ctx) => {
  const [e] = await sql(`SELECT ${COLONNES} FROM experiences WHERE id = $1`, [(await params).id]);
  if (!e) throw new ErreurHttp(404, "Expérience introuvable");
  return repondre(e);
});

export const PUT = route(async (req, { params }: Ctx) => {
  const e = validerExperience(await lireJson(req));
  const [maj] = await sql(
    `UPDATE experiences SET publie=$1, periode=$2, poste=$3, structure=$4, description=$5, technos=$6,
       "updatedAt"=now() WHERE id = $7 RETURNING ${COLONNES}`,
    [e.publie, e.periode, e.poste, e.structure, e.description, e.technos, (await params).id],
  );
  if (!maj) throw new ErreurHttp(404, "Expérience introuvable");
  rafraichir("experiences");
  return repondre(maj);
});

export const DELETE = route(async (_req, { params }: Ctx) => {
  const r = await sql(`DELETE FROM experiences WHERE id = $1 RETURNING id`, [(await params).id]);
  if (!r.length) throw new ErreurHttp(404, "Expérience introuvable");
  rafraichir("experiences");
  return repondre(null, 204);
});
