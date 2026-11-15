import type { Metadata } from "next";
import { Bouton } from "@/components/Bouton";
import { CarteProjet } from "@/components/CarteProjet";
import { Fleche, Logo, Mail, Telecharger } from "@/components/icones";
import { Apparition, Flottement, TexteParMots } from "@/components/Mouvement";
import { Photo } from "@/components/visuels";
import { profil } from "@/content/profil";
import { getProjets } from "@/lib/donnees";
import type { LogoName } from "@/lib/logos";

const outils: LogoName[] = [
  "Java",
  "Spring Boot",
  "React",
  "Docker",
  "Kubernetes",
  "PostgreSQL",
  "GitHub",
];
const logosSombres = new Set<LogoName>(["Java", "GitHub"]);

const tuiles = [
  {
    numero: "01",
    titre: "Programmer",
    texte: "Des applications full-stack, de l’API Spring Boot à l’interface React.",
  },
  {
    numero: "02",
    titre: "Automatiser",
    texte: "Docker, Kubernetes et pipelines CI/CD pour livrer mes projets.",
  },
  { numero: "03", titre: "Relier", texte: "Des réseaux configurés à la main : VLAN, OSPF, HSRP." },
];

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Données structurées : aident Google à reconnaître la personne derrière le site. */
const personne = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profil.nom,
  url: profil.site,
  image: `${profil.site}/og.jpg`,
  jobTitle: "Élève-ingénieur en informatique",
  description: profil.presentation,
  alumniOf: { "@type": "CollegeOrUniversity", name: "3iL, école d’ingénieurs en informatique" },
  address: { "@type": "PostalAddress", addressLocality: "Limoges", addressCountry: "FR" },
  sameAs: [profil.liens.github, profil.liens.linkedin].filter(Boolean),
  knowsAbout: [
    "Développement full-stack",
    "DevOps",
    "Java",
    "Spring Boot",
    "React",
    "Docker",
    "Kubernetes",
  ],
};

export default async function Accueil() {
  const [mellifica, reseau] = await getProjets();
  const altPhoto = `Portrait de ${profil.nom}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personne).replace(/</g, "\\u003c") }}
      />
      {/* Héros : nom, stage recherché et accès au CV dès le premier écran */}
      <section className="heros">
        <TexteParMots
          as="h1"
          texte={profil.nom.replace("KOM FOADEM", "KOM\u00a0FOADEM")}
          className="t-heros heros__nom"
        />
        <TexteParMots
          as="p"
          texte="Cherche un stage"
          className="t-italique-heros heros__accroche"
          delai={0.35}
        />

        <div className="heros__scene">
          <Apparition delai={0.9} decalage={30} className="heros__panneau-cadre">
            <Flottement amplitude={6} duree={7}>
              <div className="heros__panneau heros__panneau--presentation">
                <p className="pastille">{profil.disponibilite}</p>
                <p className="t-lead">{profil.presentation}</p>
              </div>
            </Flottement>
          </Apparition>

          <Apparition delai={0.6} decalage={60} className="heros__photo">
            <Photo src={profil.photo} alt={altPhoto} className="heros__photo-cadre" />
          </Apparition>

          <Apparition delai={1.05} decalage={30}>
            <Flottement amplitude={6} duree={8}>
              <div className="heros__panneau heros__panneau--stage">
                <p className="t-mono">Stage recherché</p>
                <p className="t-h3">{profil.stage.domaine}</p>
                <p className="secondaire">{profil.stage.periode}</p>
                <div className="groupe-boutons">
                  <Bouton href="/projets/" icone={<Fleche />}>
                    Mes projets
                  </Bouton>
                  <Bouton
                    href={profil.liens.cv}
                    variante="secondaire"
                    icone={<Telecharger />}
                    telecharger
                  >
                    Mon CV
                  </Bouton>
                </div>
              </div>
            </Flottement>
          </Apparition>
        </div>
      </section>

      {/* Mobile : la présentation et la photo passent sous le premier écran */}
      <section className="presentation-mobile" aria-label="Présentation">
        <Photo src={profil.photoPetite} alt={altPhoto} />
        <p className="pastille" style={{ justifySelf: "start" }}>
          {profil.disponibilite}
        </p>
        <p>{profil.presentation}</p>
      </section>

      <section className="outils conteneur" aria-labelledby="titre-outils">
        <h2 id="titre-outils" className="t-h3 secondaire">
          Les outils de mes projets
        </h2>
        <ul className="outils__liste" role="list">
          {outils.map((o) => (
            <li key={o} className="outil t-h3">
              <span className={`outil__logo${logosSombres.has(o) ? " outil__logo--sombre" : ""}`}>
                <Logo nom={o} taille={logosSombres.has(o) ? 22 : 30} />
              </span>
              {o}
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="titre-projets">
        <div className="conteneur">
          <Apparition className="entete-section entete-section--centre">
            <p className="t-legende">/ Projets sélectionnés /</p>
            <h2 id="titre-projets" className="t-h1">
              Ce que j’ai construit
            </h2>
          </Apparition>
          <div className="liste-projets">
            <Apparition>
              <CarteProjet projet={mellifica} format="grande" />
            </Apparition>
            <Apparition>
              <CarteProjet projet={reseau} format="inverse" />
            </Apparition>
            <div className="centre">
              <Bouton href="/projets/" variante="secondaire" icone={<Fleche />}>
                Tous les projets
              </Bouton>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--bloc" aria-labelledby="titre-anime">
        <div className="conteneur">
          <div className="entete-section entete-section--centre">
            <p className="t-legende">/ Ce qui m’anime /</p>
            <h2 id="titre-anime" className="t-h1">
              Trois façons de construire
            </h2>
          </div>
          <div className="tuiles">
            <svg
              className="tuiles__liaisons"
              viewBox="0 0 1248 80"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path d="M300 40 C 360 0, 420 0, 460 46" />
              <circle cx="462" cy="48" r="7" />
              <path d="M750 50 C 790 90, 850 90, 880 40" />
              <circle cx="882" cy="38" r="7" />
            </svg>
            {tuiles.map((t, i) => (
              <Apparition key={t.numero} delai={i * 0.12} className="tuile">
                <p className="tuile__numero" aria-hidden>
                  {t.numero}
                </p>
                <h3 className="t-h2">{t.titre}</h3>
                <p className="secondaire">{t.texte}</p>
              </Apparition>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--contraste sur-contraste" aria-labelledby="titre-cta">
        <div className="conteneur cta">
          <div>
            <h2 id="titre-cta" className="cta__titre">
              Parlons de <em>votre stage.</em>
            </h2>
            <p className="t-lead cta__texte secondaire">
              Je réponds à chaque message. Le plus simple : un e-mail, ou mon CV en un clic.
            </p>
            <div className="groupe-boutons">
              <Bouton href="/contact/" icone={<Mail />}>
                M’écrire
              </Bouton>
              <Bouton
                href={profil.liens.cv}
                variante="secondaire"
                icone={<Telecharger />}
                telecharger
              >
                Mon CV
              </Bouton>
            </div>
          </div>
          <div className="rendu" role="presentation" />
        </div>
      </section>
    </>
  );
}
