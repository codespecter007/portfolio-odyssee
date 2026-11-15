import { sql } from "@/lib/serveur/db";
import { lireJson, rafraichir, repondre, route } from "@/lib/serveur/http";
import { validerProjet } from "@/lib/serveur/validation";
import { COLONNES_PROJET, VALEURS_PROJET } from "./colonnes";

export const GET = route(async () =>
  repondre(await sql(`SELECT ${COLONNES_PROJET} FROM projets ORDER BY ordre, "createdAt"`)),
);

export const POST = route(async (req) => {
  const p = validerProjet(await lireJson(req));
  const [cree] = await sql(
    `INSERT INTO projets (slug, publie, nom, type, annee, categories, description, role, technologies, visuel, etude, ordre)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, (SELECT coalesce(max(ordre), 0) + 1 FROM projets))
     RETURNING ${COLONNES_PROJET}`,
    VALEURS_PROJET(p),
  );
  rafraichir("projets");
  return repondre(cree, 201);
});
