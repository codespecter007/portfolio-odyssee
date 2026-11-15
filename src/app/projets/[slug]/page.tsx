import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bouton } from "@/components/Bouton";
import { Technos } from "@/components/CarteProjet";
import { Coche, FlecheDiag } from "@/components/icones";
import { Apparition, TexteParMots } from "@/components/Mouvement";
import {
  Ordinateur,
  SchemaArchitecture,
  SchemaMicroservices,
  SchemaReseau,
} from "@/components/visuels";
import { VisuelProjet } from "@/components/CarteProjet";
import { getProjet, projets } from "@/content/projets";
import { lienOuAncre } from "@/content/profil";

export const dynamicParams = false;

export function generateStaticParams() {
  return projets.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projet = getProjet(slug);
  return projet ? { title: projet.nom, description: projet.description } : {};
}

export default async function EtudeDeCas({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projet = getProjet(slug);
  if (!projet) notFound();
  const { etude } = projet;
  const index = projets.indexOf(projet);
  const suivant = projets[(index + 1) % projets.length];
  let n = 0;
  const numero = () => String(++n).padStart(2, "0");

  return (
    <>
      <section className="etude-ouverture">
        <div className="conteneur" style={{ position: "relative", zIndex: 1 }}>
          <TexteParMots
            as="h1"
            texte={projet.nom}
            className="ouverture__titre etude-ouverture__titre"
          />
          <p className="etude-ouverture__accroche">{etude.accroche}</p>
          <dl className="reperes">
            {etude.reperes.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.valeur}</dd>
              </div>
            ))}
          </dl>
        </div>
        <VisuelProjet projet={projet} className="etude-ouverture__visuel" />
      </section>

      <section className="section">
        <div className="conteneur deux-colonnes">
          <Apparition className="bloc-numerote">
            <p className="bloc-numerote__numero" aria-hidden>
              {numero()}
            </p>
            <h2 className="t-h2">Le contexte</h2>
            <p className="t-lead secondaire">{etude.contexte}</p>
            <Technos liste={projet.technologies} />
          </Apparition>
          {etude.probleme && (
            <Apparition className="bloc-numerote" delai={0.1}>
              <p className="bloc-numerote__numero" aria-hidden>
                {numero()}
              </p>
              <h2 className="t-h2">Le problème</h2>
              <p className="t-lead secondaire">{etude.probleme}</p>
            </Apparition>
          )}
        </div>
      </section>

      <section className="section section--contraste">
        <div className="conteneur contribution">
          <div style={{ display: "grid", gap: 22, alignContent: "start" }}>
            <p className="t-legende">/ {etude.contribution.titre} /</p>
            <h2 className="contribution__intro">{etude.contribution.intro}</h2>
          </div>
          <ul className="taches" role="list">
            {etude.contribution.taches.map((t, i) => (
              <Apparition as="li" key={t.titre} className="tache" delai={i * 0.06} decalage={12}>
                <span className="tache__coche" aria-hidden>
                  <Coche />
                </span>
                <strong className="t-h3">{t.titre}</strong>
                <span className="secondaire">{t.detail}</span>
              </Apparition>
            ))}
          </ul>
        </div>
      </section>

      {etude.choix && (
        <section className="section">
          <div className="conteneur">
            <div className="deux-colonnes" style={{ alignItems: "end" }}>
              <div style={{ display: "grid", gap: 12 }}>
                <p className="t-legende">/ Choix techniques /</p>
                <h2 className="t-h1">{etude.choix.titre}</h2>
              </div>
              <p className="t-lead secondaire">{etude.choix.texte}</p>
            </div>
            {etude.choix.schema && (
              <Apparition className="schema-cadre">
                {etude.choix.schema === "architecture-web" ? (
                  <SchemaArchitecture />
                ) : etude.choix.schema === "microservices" ? (
                  <SchemaMicroservices />
                ) : (
                  <SchemaReseau />
                )}
              </Apparition>
            )}
          </div>
        </section>
      )}

      {etude.resultat && (
        <section className="section section--bloc">
          <div className="conteneur resultat">
            <div>
              <p className="t-legende">/ Le résultat /</p>
              <h2 className="t-h1" style={{ marginTop: 12 }}>
                {etude.resultat.titre}
              </h2>
              {etude.resultat.mesures.every((m) => m.score !== undefined) ? (
                <ul className="scores" role="list">
                  {etude.resultat.mesures.map((m) => (
                    <li key={m.label} className="score">
                      <span
                        className="score__anneau"
                        style={{ "--score": m.score } as React.CSSProperties}
                        aria-hidden
                      >
                        {m.valeur}
                      </span>
                      <span className="score__label">
                        {m.label}
                        <span className="visually-hidden"> : {m.valeur} sur 100</span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mesures" role="list">
                  {etude.resultat.mesures.map((m) => (
                    <li key={m.label} className="mesure">
                      <span className="t-h3">{m.label}</span>
                      <span className={m.valeur ? "t-h3" : "t-legende"}>
                        {m.valeur ?? "mesure à venir"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {etude.resultat.mesures.some((m) => m.score !== undefined) && (
                <p className="t-petit secondaire" style={{ marginTop: 16 }}>
                  Mesuré avec Lighthouse (Chrome), en local.
                </p>
              )}
            </div>
            <Ordinateur capture={etude.resultat.capture} alt={`Page d’accueil de ${projet.nom}`} />
          </div>
        </section>
      )}

      <section className="section">
        <div className="conteneur liens-projet">
          <div style={{ display: "grid", gap: 16 }}>
            <p className="t-legende">/ Voir le projet /</p>
            <div className="groupe-boutons">
              {etude.liens.code ? (
                <Bouton href={etude.liens.code} icone={<FlecheDiag />} externe>
                  Le code sur GitHub
                </Bouton>
              ) : (
                <p className="secondaire">Code non public.</p>
              )}
              {etude.liens.demo && (
                <Bouton
                  href={lienOuAncre(etude.liens.demo)}
                  variante="secondaire"
                  icone={<FlecheDiag />}
                  externe
                >
                  La démo en ligne
                </Bouton>
              )}
            </div>
          </div>
          <Link href={`/projets/${suivant.slug}/`} className="projet-suivant">
            <span className="t-mono">Projet suivant</span>
            <span className="t-h2">
              {suivant.nom} <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
