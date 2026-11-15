"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CarteProjet } from "@/components/CarteProjet";
import { Bouton } from "@/components/Bouton";
import { FlecheDiag } from "@/components/icones";
import { logos } from "@/lib/logos";
import { categories, projets, type Categorie } from "@/content/projets";
import { profil, lienOuAncre } from "@/content/profil";

type Filtre = "Tous" | Categorie;

export function Galerie() {
  const [filtre, setFiltre] = useState<Filtre>("Tous");

  const compte = (c: Filtre) =>
    c === "Tous" ? projets.length : projets.filter((p) => p.categories.includes(c)).length;
  // Les catégories encore vides ne sont pas proposées.
  const filtres: Filtre[] = ["Tous", ...categories.filter((c) => compte(c) > 0)];
  const visibles =
    filtre === "Tous" ? projets : projets.filter((p) => p.categories.includes(filtre));
  // Les deux premiers projets en grand, en alternance ; les suivants sur deux colonnes.
  const vedettes = visibles.slice(0, 2);
  const autres = visibles.slice(2);

  return (
    <>
      <div className="conteneur">
        <div className="filtres" role="group" aria-label="Filtrer les projets">
          {filtres.map((f) => (
            <button
              key={f}
              type="button"
              className="filtre"
              aria-pressed={filtre === f}
              onClick={() => setFiltre(f)}
            >
              {f}
              <small>
                {compte(f)}
                <span className="visually-hidden"> projet{compte(f) > 1 ? "s" : ""}</span>
              </small>
            </button>
          ))}
        </div>
        <p className="visually-hidden" aria-live="polite">
          {visibles.length} projet{visibles.length > 1 ? "s" : ""} affiché
          {visibles.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="conteneur galerie">
        <AnimatePresence mode="popLayout" initial={false}>
          {vedettes.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35 }}
            >
              <CarteProjet projet={p} format={i === 0 ? "grande" : "inverse"} niveauTitre={2} />
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="galerie__rangee">
          <AnimatePresence mode="popLayout" initial={false}>
            {autres.map((p) => (
              <motion.div
                key={p.slug}
                className="galerie__item"
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
              >
                <CarteProjet projet={p} format="haute" niveauTitre={2} />
              </motion.div>
            ))}
            <motion.div
              key="github"
              className="galerie__item galerie__github"
              layout
              transition={{ duration: 0.35 }}
            >
              <div className="carte-github sur-contraste">
                <span className="carte-github__logo" aria-hidden>
                  <svg viewBox="0 0 24 24" width="64" height="64">
                    <path fill="currentColor" d={logos.GitHub.path} />
                  </svg>
                </span>
                <h2 className="t-h2">Tout mon code est sur GitHub.</h2>
                <p className="secondaire">Dépôts, commits et documentation de chaque projet.</p>
                <Bouton href={lienOuAncre(profil.liens.github)} icone={<FlecheDiag />} externe>
                  Voir mon GitHub
                </Bouton>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
