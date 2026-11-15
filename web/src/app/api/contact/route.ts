import { sql } from "@/lib/serveur/db";
import { ErreurHttp, lireJson, repondre, route } from "@/lib/serveur/http";
import { ipDe, limite, memeOrigine, nettoyerRef } from "@/lib/serveur/visiteur";

/** Formulaire de contact : les messages arrivent dans l’espace admin. */
export const POST = route(
  async (req) => {
    if (!memeOrigine(req)) throw new ErreurHttp(403, "Origine refusée");
    const b = await lireJson(req);
    // Champ piège invisible : rempli seulement par les robots.
    if (typeof b.site === "string" && b.site.trim()) return repondre({ ok: true });
    if (!limite(`c:${ipDe(req)}`, 3, 10 * 60_000))
      throw new ErreurHttp(429, "Trop de messages envoyés, réessayez un peu plus tard");
    const txt = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
    const nom = txt(b.nom, 120);
    const email = txt(b.email, 200);
    const entreprise = txt(b.entreprise, 120) || null;
    const message = txt(b.message, 4000);
    if (!nom || !message) throw new ErreurHttp(400, "Nom et message sont obligatoires");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new ErreurHttp(400, "Adresse e-mail invalide");
    await sql(
      `INSERT INTO messages (nom, email, entreprise, message, ref) VALUES ($1,$2,$3,$4,$5)`,
      [nom, email, entreprise, message, nettoyerRef(b.ref)],
    );
    return repondre({ ok: true }, 201);
  },
  { admin: false },
);
