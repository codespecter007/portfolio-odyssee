/** Informations anonymes sur la requête : aucune adresse IP n’est conservée. */
const ROBOTS =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|curl|wget|python|axios/i;

export const estRobot = (req: Request) => ROBOTS.test(req.headers.get("user-agent") ?? "");

export function appareil(req: Request): string {
  const ua = req.headers.get("user-agent") ?? "";
  if (/ipad|tablet/i.test(ua)) return "tablette";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "ordinateur";
}

/** Pays fourni par Vercel à partir de l’adresse IP, qui n’est pas enregistrée. */
export const pays = (req: Request) => {
  const p = req.headers.get("x-vercel-ip-country");
  return p && /^[A-Z]{2}$/.test(p) ? p : null;
};

export const ipDe = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "?";

/** Refuse les envois venant d’un autre site. */
export function memeOrigine(req: Request) {
  const o = req.headers.get("origin");
  return !o || new URL(o).host === req.headers.get("host");
}

/** Identifiant de lien suivi : minuscules, chiffres et tirets. */
export const nettoyerRef = (v: unknown) =>
  typeof v === "string" && /^[a-z0-9-]{1,40}$/.test(v) ? v : null;

/** Limite simple par adresse (mémoire de l’instance). */
const compteurs = new Map<string, number[]>();
export function limite(cle: string, max: number, fenetreMs: number) {
  const t = Date.now();
  const recents = (compteurs.get(cle) ?? []).filter((x) => t - x < fenetreMs);
  if (recents.length >= max) return false;
  recents.push(t);
  compteurs.set(cle, recents);
  if (compteurs.size > 5000) compteurs.clear();
  return true;
}
