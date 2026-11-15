import { fermerSession } from "@/lib/serveur/auth";
import { repondre, route } from "@/lib/serveur/http";

export const POST = route(
  async () => {
    await fermerSession();
    return repondre({ ok: true });
  },
  { admin: false },
);
