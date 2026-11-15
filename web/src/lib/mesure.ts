/**
 * Mesure d’audience côté navigateur, sans cookie.
 * Un identifiant aléatoire vit le temps de l’onglet (sessionStorage) ; il ne suit personne ailleurs.
 * Les visites de l’admin sont ignorées sur l’appareil où il s’est connecté.
 */
const CLE_SESSION = "mesure-session";
const CLE_REF = "mesure-ref";
export const CLE_IGNORER = "mesure-ignorer";

function stockage<T>(fn: () => T, repli: T): T {
  try {
    return fn();
  } catch {
    return repli;
  }
}

export function session(): string {
  return stockage(() => {
    let s = sessionStorage.getItem(CLE_SESSION);
    if (!s) {
      s = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
      sessionStorage.setItem(CLE_SESSION, s);
    }
    return s;
  }, "inconnu00");
}

/** Lien suivi (?ref=entreprise) : retenu pour toute la visite. */
export function refCourant(): string | null {
  return stockage(() => {
    const brut = new URLSearchParams(location.search).get("ref")?.toLowerCase();
    if (brut && /^[a-z0-9-]{1,40}$/.test(brut)) sessionStorage.setItem(CLE_REF, brut);
    return sessionStorage.getItem(CLE_REF);
  }, null);
}

export const ignore = () => stockage(() => localStorage.getItem(CLE_IGNORER) === "1", false);

export function envoyer(type: string, extra: Record<string, unknown> = {}) {
  if (ignore()) return;
  const corps = JSON.stringify({ type, session: session(), ref: refCourant(), ...extra });
  const blob = new Blob([corps], { type: "application/json" });
  if (!navigator.sendBeacon?.("/api/stats/", blob))
    fetch("/api/stats/", {
      method: "POST",
      body: corps,
      keepalive: true,
      headers: { "content-type": "application/json" },
    }).catch(() => {});
}
