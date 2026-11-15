import { ouvrirSession, verifierIdentifiants } from "@/lib/serveur/auth";
import { ErreurHttp, lireJson, repondre, route } from "@/lib/serveur/http";

// Cinq tentatives par minute et par adresse IP (au mieux : la mémoire est propre à chaque instance).
const essais = new Map<string, number[]>();

export const POST = route(
  async (req) => {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "?";
    const maintenant = Date.now();
    const recents = (essais.get(ip) ?? []).filter((t) => maintenant - t < 60_000);
    if (recents.length >= 5)
      throw new ErreurHttp(429, "Trop de tentatives, réessayez dans une minute");
    essais.set(ip, [...recents, maintenant]);

    const { email, motDePasse } = await lireJson(req);
    if (typeof email !== "string" || typeof motDePasse !== "string" || motDePasse.length < 8)
      throw new ErreurHttp(400, "E-mail et mot de passe requis");
    const admin = await verifierIdentifiants(email, motDePasse);
    if (!admin) throw new ErreurHttp(401, "Identifiants incorrects");
    essais.delete(ip);
    await ouvrirSession(admin);
    return repondre({ ok: true });
  },
  { admin: false },
);
