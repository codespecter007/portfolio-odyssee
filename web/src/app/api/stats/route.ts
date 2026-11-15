import { sql } from "@/lib/serveur/db";
import { lireJson, repondre, route } from "@/lib/serveur/http";
import {
  appareil,
  estRobot,
  ipDe,
  limite,
  memeOrigine,
  nettoyerRef,
  pays,
} from "@/lib/serveur/visiteur";

const TYPES = ["vue", "cv", "email", "email-copie", "linkedin", "github"] as const;

/**
 * Mesure d’audience sans cookie : un identifiant de session aléatoire (onglet), le chemin,
 * la source et le pays. Rien ne permet de retrouver une personne. Conservation : 13 mois.
 */
export const POST = route(
  async (req) => {
    if (!memeOrigine(req) || estRobot(req) || !limite(`s:${ipDe(req)}`, 120, 60_000))
      return repondre(null, 204);
    const b = await lireJson(req);
    const type = TYPES.find((t) => t === b.type);
    const session =
      typeof b.session === "string" && /^[a-z0-9]{8,32}$/.test(b.session) ? b.session : null;
    if (!type || !session) return repondre(null, 204);
    const chemin = typeof b.chemin === "string" ? b.chemin.slice(0, 200) : null;
    const source = typeof b.source === "string" ? b.source.slice(0, 100).toLowerCase() : null;
    await sql(
      `INSERT INTO evenements (type, chemin, source, ref, pays, appareil, session)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [type, chemin, source, nettoyerRef(b.ref), pays(req), appareil(req), session],
    );
    if (Math.random() < 0.01)
      await sql(`DELETE FROM evenements WHERE cree < now() - interval '13 months'`);
    return repondre(null, 204);
  },
  { admin: false },
);
