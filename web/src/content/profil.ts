/**
 * Informations personnelles et liens.
 *
 * Ce qui est encore marqué « À REMPLACER » est provisoire.
 * Une valeur `null` cache l’élément correspondant ou affiche un emplacement vide.
 */

export const profil = {
  // Prénom, puis le nom en capitales.
  nom: "Odyssée KOM FOADEM",
  nomCourt: "Odyssée KOM FOADEM",
  ecole: "3iL",
  /** Adresse publique du site, utilisée pour le référencement et les aperçus de liens. */
  site: "https://odysseekom.fr",

  presentation:
    "Élève-ingénieur en informatique à 3iL, à Limoges. Je développe des applications full-stack (Java, Spring Boot, React) et je les conteneurise avec Docker et Kubernetes.",

  stage: {
    domaine: "Développement full-stack et DevOps",
    periode: "4 à 5 mois, à partir d’avril 2027",
  },

  disponibilite: "Disponible pour un stage",

  photo: "/photos/accueil.webp" as string | null,
  photoPetite: "/photos/accueil-600.webp" as string | null,

  liens: {
    // À REMPLACER : dépose ton CV général dans /public/cv.pdf.
    cv: "/cv.pdf",
    email: "bertholdodyssee@gmail.com",
    github: "https://github.com/codespecter007" as string | null,
    linkedin: "https://www.linkedin.com/in/odyss%C3%A9e-foadem-178437377/" as string | null,
  },

  // QR code vers https://odysseekom.fr/?ref=qr (les visites venues du CV sont comptées à part).
  qrCode: "/qr-portfolio.svg" as string | null,
};

/** Lien utilisable dans un `href`, même si la vraie adresse n’est pas encore connue. */
export const lienOuAncre = (url: string | null) => url ?? "#";
