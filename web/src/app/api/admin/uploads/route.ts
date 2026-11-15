import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { ErreurHttp, repondre, route } from "@/lib/serveur/http";
import { formatImage } from "@/lib/serveur/validation";

// Les fonctions Vercel refusent les corps de plus de 4,5 Mo.
const TAILLE_MAX = 4 * 1024 * 1024;
const TYPES = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" } as const;

/** Envoi des captures d’écran depuis l’espace admin, stockées sur Vercel Blob. */
export const POST = route(async (req) => {
  if (!process.env.BLOB_READ_WRITE_TOKEN)
    throw new ErreurHttp(503, "Stockage d’images non configuré (Vercel Blob)");
  const fd = await req.formData().catch(() => null);
  const fichier = fd?.get("fichier");
  if (!(fichier instanceof File)) throw new ErreurHttp(400, "Aucun fichier reçu");
  if (fichier.size > TAILLE_MAX) throw new ErreurHttp(413, "Image trop lourde (4 Mo maximum)");
  const buf = Buffer.from(await fichier.arrayBuffer());
  const format = formatImage(buf);
  if (!format) throw new ErreurHttp(400, "Formats acceptés : PNG, JPEG, WebP");
  const blob = await put(`captures/${randomUUID()}.${format}`, buf, {
    access: "public",
    contentType: TYPES[format],
  });
  return repondre({ url: blob.url });
});
