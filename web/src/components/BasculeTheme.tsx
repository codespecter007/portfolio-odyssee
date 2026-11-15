"use client";

import { useSyncExternalStore } from "react";
import { Lune, Soleil } from "./icones";

export type Theme = "sombre" | "clair";
export const CLE_THEME = "theme";

const lire = (): Theme => (document.documentElement.dataset.theme === "clair" ? "clair" : "sombre");

const abonner = (rappel: () => void) => {
  const obs = new MutationObserver(rappel);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
};

/** Interrupteur lune / soleil de la navigation. Le rond jaune indique le mode actif. */
export function BasculeTheme() {
  const theme = useSyncExternalStore(abonner, lire, () => "sombre" as Theme);
  const suivant: Theme = theme === "sombre" ? "clair" : "sombre";

  const basculer = () => {
    document.documentElement.dataset.theme = suivant;
    try {
      localStorage.setItem(CLE_THEME, suivant);
    } catch {
      // Stockage indisponible (navigation privée) : le choix vaut pour la page en cours.
    }
  };

  return (
    <button
      type="button"
      className="bascule"
      onClick={basculer}
      aria-label={`Passer en mode ${suivant}`}
      title={`Passer en mode ${suivant}`}
    >
      <span className="bascule__rond bascule__rond--lune">
        <Lune />
      </span>
      <span className="bascule__rond bascule__rond--soleil">
        <Soleil />
      </span>
    </button>
  );
}

/**
 * Script exécuté avant l’affichage pour éviter un flash de la mauvaise couleur :
 * choix mémorisé, sinon préférence du système, sinon mode sombre.
 */
export const scriptTheme = `(function(){try{var t=localStorage.getItem("${CLE_THEME}");if(t!=="clair"&&t!=="sombre"){t=matchMedia("(prefers-color-scheme: light)").matches?"clair":"sombre"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="sombre"}})();`;
