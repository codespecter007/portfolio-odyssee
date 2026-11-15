import type { Metadata } from "next";
import { FlecheDiag, Telecharger } from "@/components/icones";
import { Apparition, TexteParMots } from "@/components/Mouvement";
import { QrCode } from "@/components/visuels";
import { profil, lienOuAncre } from "@/content/profil";
import { baseActive } from "@/lib/serveur/db";
import { CopierEmail } from "./CopierEmail";
import { FormulaireContact } from "./FormulaireContact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Pour un stage, une question sur un projet ou un échange.",
};

export default function Contact() {
  const { liens } = profil;
  return (
    <>
      <section className="contact">
        <p className="pastille">{profil.disponibilite}</p>
        <TexteParMots as="h1" texte="Écrivez-moi." className="contact__titre" />
        <div className="contact__email">
          <a href={`mailto:${liens.email}`}>{liens.email}</a>
          <CopierEmail email={liens.email} />
        </div>
        <p className="t-lead secondaire contact__texte">
          Pour un stage, une question sur un projet ou un échange. Je réponds à chaque message.
        </p>
      </section>

      {baseActive && (
        <section className="contact-message" aria-label="Formulaire de contact">
          <Apparition>
            <FormulaireContact />
          </Apparition>
        </section>
      )}

      <section className="blocs-contact" aria-label="Liens">
        <Apparition>
          <a href={liens.cv} download="" className="bloc-contact bloc-contact--cv">
            <span className="bloc-contact__haut">
              <Telecharger taille={28} />
            </span>
            <span>
              <span className="t-h2" style={{ display: "block" }}>
                Mon CV
              </span>
              <span className="secondaire">PDF, une page</span>
            </span>
          </a>
        </Apparition>
        <Apparition delai={0.08}>
          <a
            href={lienOuAncre(liens.github)}
            className="bloc-contact"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="bloc-contact__haut">
              <FlecheDiag taille={28} />
            </span>
            <span>
              <span className="t-h2" style={{ display: "block" }}>
                GitHub
              </span>
              <span className="secondaire">Mes dépôts</span>
            </span>
          </a>
        </Apparition>
        <Apparition delai={0.16}>
          <a
            href={lienOuAncre(liens.linkedin)}
            className="bloc-contact bloc-contact--bloc"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="bloc-contact__haut">
              <FlecheDiag taille={28} />
            </span>
            <span>
              <span className="t-h2" style={{ display: "block" }}>
                LinkedIn
              </span>
              <span className="secondaire">Mon profil</span>
            </span>
          </a>
        </Apparition>
        <Apparition delai={0.24}>
          <div className="bloc-contact bloc-contact--qr">
            <QrCode src={profil.qrCode} />
            <span className="t-petit secondaire">Ce portfolio, sur téléphone</span>
          </div>
        </Apparition>
      </section>
    </>
  );
}
