import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/icones";
import { Apparition, TexteParMots } from "@/components/Mouvement";
import { Photo } from "@/components/visuels";
import { chapitres, competences, experiences } from "@/content/parcours";
import { getProjet } from "@/content/projets";

export const metadata: Metadata = {
  title: "Parcours et compétences",
  description: "De la maternelle à l’école d’ingénieurs, et les compétences qui en découlent.",
};

export default function Parcours() {
  return (
    <>
      <section className="parcours-ouverture">
        <div>
          <p className="t-legende">/ Mon parcours /</p>
          <h1>
            <TexteParMots texte="De la maternelle" />
            <em>
              <TexteParMots texte="à l’école d’ingénieurs." delai={0.3} />
            </em>
          </h1>
          <p className="t-lead secondaire">
            Les étapes de mon parcours jusqu’à l’informatique, et ce que chacune m’a apporté.
          </p>
        </div>
      </section>

      <section className="conteneur" aria-label="Chronologie">
        <ol className="chapitres" role="list">
          {chapitres.map((c, i) => (
            <Apparition
              as="li"
              key={c.numero}
              className={`chapitre${i === chapitres.length - 1 ? " chapitre--actuel" : ""}`}
            >
              <p className="t-geant chapitre__numero" aria-hidden>
                {c.numero}
              </p>
              <div className="chapitre__texte">
                <p className="chapitre__periode">{c.periode}</p>
                <h2 className="t-h2">{c.titre}</h2>
                <p className="t-italique" style={{ fontSize: "1.6rem" }}>
                  {c.sousTitre}
                </p>
                <p className="t-lead secondaire">{c.texte}</p>
              </div>
              {c.photo && (
                <Photo src={c.photo} alt={`${c.titre} : photo souvenir`} forme={c.forme} />
              )}
            </Apparition>
          ))}
        </ol>

        <Apparition className="experiences">
          <div style={{ display: "grid", gap: 8 }}>
            <p className="t-legende">/ Expériences /</p>
            <h2 className="t-h2">Expérience professionnelle</h2>
          </div>
          <ul role="list">
            {experiences.map((e) => (
              <li key={`${e.periode}-${e.poste}`} className="experience">
                <span className="t-mono experience__periode">{e.periode}</span>
                <div className="experience__corps">
                  <strong className="t-h3">{e.poste}</strong>
                  <span className="secondaire">{e.structure}</span>
                  <p>{e.description}</p>
                  <ul className="technos" role="list" aria-label="Technologies">
                    {e.technos.map((t) => (
                      <li key={t} className="techno">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </Apparition>
      </section>

      <section className="section section--bloc" aria-labelledby="titre-competences">
        <div className="conteneur">
          <p className="t-legende">/ Ce que je sais faire /</p>
          <div className="deux-colonnes" style={{ alignItems: "end", marginTop: 12 }}>
            <h2 id="titre-competences" className="t-h1">
              Compétences, avec leurs preuves
            </h2>
            <p className="t-lead secondaire">
              Pas de jauge ni de pourcentage. Pour chaque domaine : où j’en suis, avec quels outils,
              et ce qui le prouve.
            </p>
          </div>

          <ul className="domaines" role="list">
            {competences.map((c, i) => {
              const projet = c.projet ? getProjet(c.projet) : undefined;
              return (
                <Apparition as="li" key={c.domaine} className="domaine" delai={i * 0.05}>
                  <div className="domaine__titre">
                    <h3 className="t-h2">{c.domaine}</h3>
                    <p className="domaine__statut">→ {c.statut}</p>
                  </div>
                  <ul className="technos" role="list" aria-label="Outils">
                    {c.outils.map((o) => (
                      <li key={o.nom} className="techno">
                        {o.logo && (
                          <span className="techno__logo">
                            <Logo nom={o.logo} />
                          </span>
                        )}
                        {o.nom}
                      </li>
                    ))}
                  </ul>
                  <div className="domaine__preuve">
                    <span className="t-mono secondaire">Preuve</span>
                    <p>{c.preuve}</p>
                    {projet && (
                      <Link href={`/projets/${projet.slug}/`}>
                        Voir l’étude de cas : {projet.nom}
                      </Link>
                    )}
                  </div>
                </Apparition>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
