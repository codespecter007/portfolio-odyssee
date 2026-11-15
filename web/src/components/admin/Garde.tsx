"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { api } from "@/lib/admin-api";

/** Affiche le contenu seulement si la session admin est valide, sinon renvoie à la connexion. */
export function Garde({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    api("/auth/moi")
      .then(() => setOk(true))
      .catch(() => router.replace("/admin/connexion/"));
  }, [router]);
  if (!ok) return <p className="admin-chargement">Vérification de la session…</p>;
  return <>{children}</>;
}
