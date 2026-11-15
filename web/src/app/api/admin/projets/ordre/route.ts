import { sql, transaction } from "@/lib/serveur/db";
import { ErreurHttp, lireJson, rafraichir, repondre, route } from "@/lib/serveur/http";
import { COLONNES_PROJET } from "../colonnes";

/** Enregistre un nouvel ordre d’affichage à partir de la liste des identifiants. */
export const PUT = route(async (req) => {
  const { ids } = await lireJson(req);
  if (!Array.isArray(ids) || !ids.every((i) => typeof i === "string") || ids.length > 200)
    throw new ErreurHttp(400, "Liste d’identifiants attendue");
  await transaction(async (q) => {
    for (const [i, id] of ids.entries())
      await q(`UPDATE projets SET ordre = $1 WHERE id = $2`, [i + 1, id]);
  });
  rafraichir("projets");
  return repondre(await sql(`SELECT ${COLONNES_PROJET} FROM projets ORDER BY ordre, "createdAt"`));
});
