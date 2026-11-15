"use client";

import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/admin-api";

export function BoutonDeconnexion() {
  const router = useRouter();
  if (usePathname()?.startsWith("/admin/connexion")) return null;
  return (
    <button
      type="button"
      className="admin-bouton admin-bouton--leger"
      onClick={async () => {
        await api("/auth/deconnexion", { method: "POST" }).catch(() => {});
        router.replace("/admin/connexion/");
      }}
    >
      Déconnexion
    </button>
  );
}
