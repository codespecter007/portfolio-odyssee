import { sql } from "@/lib/serveur/db";
import { ErreurHttp, lireJson, rafraichir, repondre, route } from "@/lib/serveur/http";
import { validerProjet } from "@/lib/serveur/validation";
import { COLONNES_PROJET, VALEURS_PROJET } from "../colonnes";

type Ctx = { params: Promise<{ id: string }> };

export const GET = route(async (_req, { params }: Ctx) => {
  const [p] = await sql(`SELECT ${COLONNES_PROJET} FROM projets WHERE id = $1`, [
    (await params).id,
  ]);
  if (!p) throw new ErreurHttp(404, "Projet introuvable");
  return repondre(p);
});

export const PUT = route(async (req, { params }: Ctx) => {
  const p = validerProjet(await lireJson(req));
  const [maj] = await sql(
    `UPDATE projets SET slug=$1, publie=$2, nom=$3, type=$4, annee=$5, categories=$6, description=$7,
       role=$8, technologies=$9, visuel=$10, etude=$11, "updatedAt"=now()
     WHERE id = $12 RETURNING ${COLONNES_PROJET}`,
    [...VALEURS_PROJET(p), (await params).id],
  );
  if (!maj) throw new ErreurHttp(404, "Projet introuvable");
  rafraichir("projets");
  return repondre(maj);
});

export const DELETE = route(async (_req, { params }: Ctx) => {
  const r = await sql(`DELETE FROM projets WHERE id = $1 RETURNING id`, [(await params).id]);
  if (!r.length) throw new ErreurHttp(404, "Projet introuvable");
  rafraichir("projets");
  return repondre(null, 204);
});
