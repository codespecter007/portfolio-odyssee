import { sql } from "@/lib/serveur/db";
import { ErreurHttp, lireJson, repondre, route } from "@/lib/serveur/http";

type Ctx = { params: Promise<{ id: string }> };

export const PUT = route(async (req, { params }: Ctx) => {
  const { lu } = await lireJson(req);
  const r = await sql(`UPDATE messages SET lu = $1 WHERE id = $2 RETURNING id`, [
    lu === true,
    (await params).id,
  ]);
  if (!r.length) throw new ErreurHttp(404, "Message introuvable");
  return repondre({ ok: true });
});

export const DELETE = route(async (_req, { params }: Ctx) => {
  const r = await sql(`DELETE FROM messages WHERE id = $1 RETURNING id`, [(await params).id]);
  if (!r.length) throw new ErreurHttp(404, "Message introuvable");
  return repondre(null, 204);
});
