"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { envoyer } from "@/lib/mesure";

/** Source de la visite : le site d’origine, « qr-code » ou « direct ». */
function source(): string {
  try {
    if (sessionStorage.getItem("mesure-source")) return "";
    const ref = new URLSearchParams(location.search).get("ref");
    let s = "direct";
    if (ref === "qr") s = "qr-code";
    else if (document.referrer) {
      const h = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (h !== location.hostname.replace(/^www\./, "")) s = h;
    }
    sessionStorage.setItem("mesure-source", s);
    return s;
  } catch {
    return "";
  }
}

function typeDuLien(cible: Element): string | null {
  const marque = cible.closest("[data-stat]")?.getAttribute("data-stat");
  if (marque) return marque;
  const a = cible.closest("a");
  if (!a) return null;
  const href = a.getAttribute("href") ?? "";
  if (href.startsWith("mailto:")) return "email";
  if (/\.pdf($|\?)/i.test(href)) return "cv";
  if (/linkedin\.com/i.test(href)) return "linkedin";
  if (/github\.com/i.test(href)) return "github";
  return null;
}

export function Mesure() {
  const chemin = usePathname();

  useEffect(() => {
    const s = source();
    envoyer("vue", { chemin, ...(s ? { source: s } : {}) });
  }, [chemin]);

  useEffect(() => {
    const clic = (e: MouseEvent) => {
      const type = e.target instanceof Element ? typeDuLien(e.target) : null;
      if (type) envoyer(type, { chemin: location.pathname });
    };
    document.addEventListener("click", clic, { capture: true });
    return () => document.removeEventListener("click", clic, { capture: true });
  }, []);

  return null;
}
