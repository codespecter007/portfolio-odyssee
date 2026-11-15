import { sql } from "@/lib/serveur/db";
import { lireJson, rafraichir, repondre, route } from "@/lib/serveur/http";
import { validerExperience } from "@/lib/serveur/validation";

const COLONNES = `id, ordre, publie, periode, poste, structure, description, technos`;

export const GET = route(async () =>
  repondre(await sql(`SELECT ${COLONNES} FROM experiences ORDER BY ordre, "createdAt"`)),
);

export const POST = route(async (req) => {
  const e = validerExperience(await lireJson(req));
  const [cree] = await sql(
    `INSERT INTO experiences (publie, periode, poste, structure, description, technos, ordre)
     VALUES ($1,$2,$3,$4,$5,$6, (SELECT coalesce(max(ordre), 0) + 1 FROM experiences))
     RETURNING ${COLONNES}`,
    [e.publie, e.periode, e.poste, e.structure, e.description, e.technos],
  );
  rafraichir("experiences");
  return repondre(cree, 201);
});
