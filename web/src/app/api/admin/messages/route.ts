import { sql } from "@/lib/serveur/db";
import { repondre, route } from "@/lib/serveur/http";

export const GET = route(async () =>
  repondre(
    await sql(
      `SELECT id, cree, nom, email, entreprise, message, ref, lu FROM messages ORDER BY cree DESC LIMIT 500`,
    ),
  ),
);
