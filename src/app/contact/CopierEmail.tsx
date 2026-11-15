"use client";

import { useState } from "react";
import { Coche, Copier } from "@/components/icones";

export function CopierEmail({ email }: { email: string }) {
  const [copie, setCopie] = useState(false);

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // Presse-papiers indisponible : le lien mailto reste utilisable.
    }
  };

  return (
    <button type="button" className="copier" onClick={copier}>
      {copie ? <Coche /> : <Copier />}
      <span aria-live="polite">{copie ? "Copié" : "Copier"}</span>
    </button>
  );
}
