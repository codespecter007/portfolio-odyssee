"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profil, lienOuAncre } from "@/content/profil";
import { BasculeTheme } from "./BasculeTheme";
import { Bouton } from "./Bouton";
import { Fermer, Menu, Telecharger } from "./icones";

const liens = [
  { href: "/", label: "Accueil" },
  { href: "/projets/", label: "Projets" },
  { href: "/parcours/", label: "Parcours" },
  { href: "/contact/", label: "Contact" },
];

const normaliser = (p: string) => (p.endsWith("/") ? p : `${p}/`);

export function EnTete() {
  const chemin = normaliser(usePathname() || "/");
  const [ouvert, setOuvert] = useState(false);
  const boutonMenu = useRef<HTMLButtonElement>(null);
  const boutonFermer = useRef<HTMLButtonElement>(null);
  const [cheminMenu, setCheminMenu] = useState(chemin);

  // Fermer le menu quand on change de page.
  if (cheminMenu !== chemin) {
    setCheminMenu(chemin);
    setOuvert(false);
  }

  const estActif = (href: string) => (href === "/" ? chemin === "/" : chemin.startsWith(href));

  // Fond sur lequel l’en-tête desktop est posé, pour la couleur de la signature.
  const fond =
    chemin === "/projets/"
      ? "entete--sur-sombre"
      : chemin === "/parcours/"
        ? "entete--sur-relief"
        : chemin === "/contact/"
          ? "entete--sur-fond"
          : "";

  useEffect(() => {
    if (!ouvert) return;
    boutonFermer.current?.focus();
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOuvert(false);
        boutonMenu.current?.focus();
      }
    };
    document.addEventListener("keydown", echap);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", echap);
      document.body.style.overflow = "";
    };
  }, [ouvert]);

  return (
    <>
      <header className={`entete ${fond}`}>
        <Link href="/" className="entete__signature">
          <span className="entete__nom-long">{profil.nom}</span>
          <span className="entete__nom-court">{profil.nomCourt}</span>
        </Link>

        <nav className="entete__nav" aria-label="Navigation principale">
          {liens.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="entete__lien"
              aria-current={estActif(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <span className="entete__separateur" aria-hidden />
          <BasculeTheme />
        </nav>

        <Bouton
          href={profil.liens.cv}
          variante="fonce"
          icone={<Telecharger />}
          telecharger
          className="entete__cv"
        >
          Mon CV
        </Bouton>

        <div className="entete__mobile">
          <BasculeTheme />
          <button
            ref={boutonMenu}
            type="button"
            className="bouton-menu"
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            aria-label="Ouvrir le menu"
            onClick={() => setOuvert(true)}
          >
            <Menu taille={22} />
          </button>
        </div>
      </header>

      {ouvert && (
        <div id="menu-mobile" className="menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="menu__barre">
            <span className="entete__signature">{profil.nomCourt}</span>
            <BasculeTheme />
            <button
              ref={boutonFermer}
              type="button"
              className="bouton-menu"
              aria-label="Fermer le menu"
              onClick={() => {
                setOuvert(false);
                boutonMenu.current?.focus();
              }}
            >
              <Fermer taille={22} />
            </button>
          </div>

          <nav className="menu__liens" aria-label="Navigation principale">
            {liens.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className="menu__lien"
                aria-current={estActif(l.href) ? "page" : undefined}
                onClick={() => setOuvert(false)}
              >
                <span>0{i + 1}</span>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="menu__bas sur-contraste">
            <Bouton href={profil.liens.cv} icone={<Telecharger />} telecharger>
              Télécharger mon CV
            </Bouton>
            <div className="menu__externes">
              <a href={lienOuAncre(profil.liens.github)}>GitHub</a>
              <a href={lienOuAncre(profil.liens.linkedin)}>LinkedIn</a>
              <a href={`mailto:${profil.liens.email}`}>E-mail</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
