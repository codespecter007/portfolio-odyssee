import { revalidateTag } from "next/cache";

/**
 * Appelé par l’API après chaque modification faite dans l’admin.
 * Protégé par un secret partagé ; Caddy ne l’expose pas sur Internet.
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ erreur: "non autorisé" }, { status: 401 });
  }
  const { tag } = (await req.json().catch(() => ({}))) as { tag?: string };
  if (tag !== "projets" && tag !== "experiences") {
    return Response.json({ erreur: "tag inconnu" }, { status: 400 });
  }
  revalidateTag(tag, { expire: 0 });
  return Response.json({ ok: true, tag });
}
