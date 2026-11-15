import { adminConnecte } from "@/lib/serveur/auth";
import { repondre, route } from "@/lib/serveur/http";

export const GET = route(async () => repondre({ email: await adminConnecte() }));
