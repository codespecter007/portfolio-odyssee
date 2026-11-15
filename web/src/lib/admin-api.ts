/** Appels à l’API depuis l’espace admin (navigateur). Le cookie de session part automatiquement. */
export class ErreurApi extends Error {
  constructor(
    public statut: number,
    message: string,
  ) {
    super(message);
  }
}

export async function api<T>(chemin: string, init: RequestInit = {}): Promise<T> {
  const estFormData = init.body instanceof FormData;
  const r = await fetch(`/api${chemin}`, {
    ...init,
    credentials: "same-origin",
    headers: estFormData ? init.headers : { "content-type": "application/json", ...init.headers },
  });
  if (r.status === 204) return undefined as T;
  const corps = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = Array.isArray(corps.message) ? corps.message.join(" · ") : corps.message;
    throw new ErreurApi(r.status, msg ?? `Erreur ${r.status}`);
  }
  return corps as T;
}

export const json = (data: unknown) => JSON.stringify(data);

/** Envoie une image et renvoie son adresse publique (/uploads/…). */
export async function envoyerImage(fichier: File): Promise<string> {
  const fd = new FormData();
  fd.append("fichier", fichier);
  const { url } = await api<{ url: string }>("/admin/uploads", { method: "POST", body: fd });
  return url;
}

export const versSlug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
