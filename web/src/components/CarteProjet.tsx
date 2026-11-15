import Link from "next/link";
import type { Projet, Techno } from "@/content/projets";
import { Fleche, Logo } from "./icones";
import { SchemaFlux, SchemaMicroservices, SchemaReseau, Tablette } from "./visuels";

export function Technos({ liste }: { liste: Techno[] }) {
  return (
    <ul className="technos" role="list" aria-label="Technologies">
      {liste.map((t) => (
        <li key={t.nom} className="techno">
          {t.logo && (
            <span className="techno__logo">
              <Logo nom={t.logo} />
            </span>
          )}
          {t.nom}
        </li>
      ))}
    </ul>
  );
}

export function VisuelProjet({ projet, className = "" }: { projet: Projet; className?: string }) {
  const v = projet.visuel;
  if (v.type === "reseau" || v.type === "microservices" || v.type === "flux") {
    return (
      <div className={`visuel visuel--schema ${className}`}>
        {v.type === "reseau" ? (
          <SchemaReseau />
        ) : v.type === "microservices" ? (
          <SchemaMicroservices />
        ) : (
          <SchemaFlux cadre={v.cadre} etapes={v.etapes} />
        )}
      </div>
    );
  }
  return (
    <div className={`visuel visuel--tablette ${className}`}>
      <Tablette
        capture={v.type === "capture" ? v.src : undefined}
        alt={v.type === "capture" ? v.alt : undefined}
        vide={v.type === "vide"}
      />
    </div>
  );
}

/**
 * Carte projet. Trois compositions, comme dans la maquette :
 * - grande : visuel à gauche, texte à droite ;
 * - inverse : bloc foncé, texte à gauche, visuel à droite ;
 * - haute : visuel en haut, texte dessous (galerie).
 */
export function CarteProjet({
  projet,
  format = "grande",
  niveauTitre = 3,
}: {
  projet: Projet;
  format?: "grande" | "inverse" | "haute";
  niveauTitre?: 2 | 3;
}) {
  const Titre = `h${niveauTitre}` as const;
  const texte = (
    <div className="carte-projet__texte">
      <p className="t-legende">
        / {projet.type}
        {projet.annee ? `, ${projet.annee}` : ""} /
      </p>
      <Titre className="t-h2">{projet.nom}</Titre>
      <p className="secondaire">{projet.description}</p>
      <dl className="carte-projet__role">
        <dt>Mon rôle</dt>
        <dd>{projet.role}</dd>
      </dl>
      <Technos liste={projet.technologies} />
      <Link href={`/projets/${projet.slug}/`} className="bouton bouton--lien carte-projet__lien">
        <span>
          Lire l’étude de cas<span className="visually-hidden"> : {projet.nom}</span>
        </span>
        <span className="bouton__icone">
          <Fleche />
        </span>
      </Link>
    </div>
  );

  return (
    <article className={`carte-projet carte-projet--${format}`}>
      {format === "inverse" ? (
        <>
          {texte}
          <VisuelProjet projet={projet} className="carte-projet__visuel" />
        </>
      ) : (
        <>
          <VisuelProjet projet={projet} className="carte-projet__visuel" />
          {texte}
        </>
      )}
    </article>
  );
}
