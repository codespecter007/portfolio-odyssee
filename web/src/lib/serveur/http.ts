import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { adminConnecte } from "./auth";
import { baseActive } from "./db";

export class ErreurHttp extends Error {
  constructor(
    public statut: number,
    message: string,
  ) {
    super(message);
  }
}

export const repondre = (data: unknown, statut = 200) =>
  statut === 204
    ? new NextResponse(null, { status: 204 })
    : NextResponse.json(data, { status: statut });

/**
 * Enveloppe commune des routes : base requise, session admin si demandé,
 * erreurs transformées en JSON { message }.
 */
export function route<C>(
  fn: (req: Request, ctx: C) => Promise<Response>,
  { admin = true }: { admin?: boolean } = {},
) {
  return async (req: Request, ctx: C) => {
    try {
      if (!baseActive) throw new ErreurHttp(404, "Espace admin non configuré");
      if (admin) {
        if (!(await adminConnecte()))
          throw new ErreurHttp(401, "Session expirée, reconnectez-vous");
        // Protection CSRF en plus du cookie SameSite=Strict.
        if (req.method !== "GET") {
          const origine = req.headers.get("origin");
          if (origine && new URL(origine).host !== req.headers.get("host"))
            throw new ErreurHttp(403, "Origine refusée");
        }
      }
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof ErreurHttp) return repondre({ message: e.message }, e.statut);
      const code = (e as { code?: string }).code;
      if (code === "23505") return repondre({ message: "Ce slug est déjà utilisé" }, 409);
      if (code === "22P02") return repondre({ message: "Identifiant invalide" }, 404);
      console.error(e);
      return repondre({ message: "Erreur interne" }, 500);
    }
  };
}

export async function lireJson(req: Request): Promise<Record<string, unknown>> {
  const corps = await req.json().catch(() => null);
  if (!corps || typeof corps !== "object" || Array.isArray(corps))
    throw new ErreurHttp(400, "Corps JSON attendu");
  return corps as Record<string, unknown>;
}

export const rafraichir = (tag: "projets" | "experiences") => revalidateTag(tag, { expire: 0 });
