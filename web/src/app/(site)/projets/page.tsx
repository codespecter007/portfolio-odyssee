import type { Metadata } from "next";
import { Flottement, TexteParMots } from "@/components/Mouvement";
import { IllustrationProjets } from "@/components/visuels";
import { getProjets } from "@/lib/donnees";
import { Galerie } from "./Galerie";

export const metadata: Metadata = {
  alternates: { canonical: "/projets/" },
  title: "Projets",
  description:
    "Mes projets en développement full-stack, DevOps, IA et réseaux : contexte, mon rôle, choix techniques et résultats.",
};

export default async function PageProjets() {
  return (
    <>
      <section className="ouverture ouverture--contraste">
        <div className="ouverture__grille">
          <div>
            <TexteParMots as="h1" texte="Projets" className="ouverture__titre" />
            <p className="ouverture__accroche">
              du code, des conteneurs,
              <br />
              et la suite.
            </p>
            <p className="t-lead secondaire" style={{ maxWidth: 460, marginLeft: 8 }}>
              Chaque projet précise le besoin, mon rôle et les technologies utilisées.
            </p>
          </div>
          <Flottement amplitude={10} duree={6} className="ouverture__illu">
            <IllustrationProjets />
          </Flottement>
        </div>
      </section>
      <Galerie projets={await getProjets()} />
    </>
  );
}
