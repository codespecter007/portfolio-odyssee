import type { LogoName } from "@/lib/logos";

/**
 * Parcours, expériences et compétences.
 * Sources : ce que tu m’as écrit et tes CV.
 * À REMPLACER plus tard : les photos souvenirs (facultatives).
 */

export type Chapitre = {
  numero: string;
  periode: string;
  titre: string;
  sousTitre: string;
  texte: string;
  /** Chemin d’une photo dans /public/photos/, ou `null` pour un emplacement vide. */
  photo: string | null;
  forme: "arche" | "paysage";
};

export const chapitres: Chapitre[] = [
  {
    numero: "01",
    periode: "2008 à 2010",
    titre: "La maternelle",
    sousTitre: "Les premiers pas à l’école",
    texte: "Mes premières années d’école.",
    photo: null,
    forme: "arche",
  },
  {
    numero: "02",
    periode: "2010 à 2016",
    titre: "L’école primaire",
    sousTitre: "CEP obtenu dès le CM1",
    texte: "J’obtiens mon certificat d’études primaires dès le CM1.",
    photo: null,
    forme: "paysage",
  },
  {
    numero: "03",
    periode: "2016 à 2023",
    titre: "Le secondaire",
    sousTitre: "Bac général scientifique, mention assez bien",
    texte:
      "Je termine au Collège La Conquête, à Douala, et je réussis le concours d’entrée en classe préparatoire.",
    photo: null,
    forme: "paysage",
  },
  {
    numero: "04",
    periode: "2023 à 2025",
    titre: "Classe préparatoire",
    sousTitre: "CPGE à l’IUC de Douala",
    texte:
      "Mathématiques, physique et informatique avec Python. Je figure parmi les meilleurs élèves, et je suis parfois délégué de ma classe.",
    photo: null,
    forme: "arche",
  },
  {
    numero: "05",
    periode: "Depuis 2025",
    titre: "3iL Ingénieurs",
    sousTitre: "Cycle ingénieur en informatique, à Limoges",
    texte:
      "Admis en école d’ingénieurs, je rejoins la France. Génie logiciel, architectures des systèmes d’information, bases de données et réseaux.",
    photo: "/photos/portrait-480.webp",
    forme: "arche",
  },
];

export type Experience = {
  periode: string;
  poste: string;
  structure: string;
  description: string;
  technos: string[];
};

export const experiences: Experience[] = [
  {
    periode: "Juil. à sept. 2025",
    poste: "Développeur full-stack, stage de 3 mois",
    structure: "Bridg’in, Douala (Cameroun)",
    description:
      "Une entreprise de formation pour les professionnels et les particuliers. En équipe, nous avons réalisé son site, du back-end Spring Boot à l’interface, et participé à la conception et à la mise en place de son réseau d’entreprise.",
    technos: ["Java", "Spring Boot", "HTML", "CSS", "PostgreSQL", "Docker", "Git", "Réseau LAN"],
  },
];

export type Statut = "Pratiqué" | "Pratiqué en projets" | "En apprentissage" | "Notions";

export type Competence = {
  domaine: string;
  statut: Statut;
  outils: { nom: string; logo?: LogoName }[];
  preuve: string;
  /** Projet lié, pour un lien vers son étude de cas. */
  projet?: string;
};

// Ordre voulu : la programmation et le DevOps d’abord, le réseau et la cybersécurité ensuite.
export const competences: Competence[] = [
  {
    domaine: "Développement full-stack",
    statut: "Pratiqué",
    outils: [
      { nom: "Java", logo: "Java" },
      { nom: "Spring Boot", logo: "Spring Boot" },
      { nom: "React", logo: "React" },
      { nom: "Node.js", logo: "Node.js" },
      { nom: "TypeScript", logo: "TypeScript" },
      { nom: "PostgreSQL", logo: "PostgreSQL" },
    ],
    preuve:
      "Stage chez Bridg’in : API REST Spring Boot et site complet. Projets : bibliothèque en ligne, Cybernova, suivi académique.",
  },
  {
    domaine: "DevOps",
    statut: "Pratiqué en projets",
    outils: [
      { nom: "Docker", logo: "Docker" },
      { nom: "Kubernetes", logo: "Kubernetes" },
      { nom: "GitLab CI", logo: "GitLab" },
      { nom: "GitHub Actions", logo: "GitHub Actions" },
      { nom: "Linux", logo: "Linux" },
    ],
    preuve:
      "Bibliothèque en ligne : microservices conteneurisés et orchestrés sur Kubernetes. Cybernova : pipeline GitLab CI (build, tests, déploiement).",
  },
  {
    domaine: "Données",
    statut: "Pratiqué en projets",
    outils: [
      { nom: "Python", logo: "Python" },
      { nom: "Pandas" },
      { nom: "Scikit-learn" },
      { nom: "SQL" },
    ],
    preuve:
      "Analyse de données et machine learning : collecte, nettoyage, modélisation, visualisation.",
  },
  {
    domaine: "Réseaux",
    statut: "Pratiqué",
    outils: [
      { nom: "Cisco", logo: "Cisco" },
      { nom: "OSPF" },
      { nom: "HSRP" },
      { nom: "LACP" },
      { nom: "Port-channel" },
      { nom: "DHCP" },
      { nom: "VLAN" },
    ],
    preuve:
      "En cours, sur de vrais équipements Cisco et en simulation. Réseau d’une agence : routage inter-VLAN, Wi-Fi, diagnostic.",
    projet: "reseau-agence",
  },
  {
    domaine: "Cybersécurité",
    statut: "Notions",
    outils: [],
    preuve:
      "Gestion des rôles et des droits d’accès dans mes applications, bonnes pratiques de sécurité.",
  },
];
