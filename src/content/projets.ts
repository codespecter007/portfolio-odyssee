import type { LogoName } from "@/lib/logos";

/**
 * Projets, dans l’ordre d’affichage.
 * Programmation et DevOps d’abord, réseau ensuite.
 * « À REMPLACER » signale ce qui reste à préciser.
 */

export type Categorie = "Web" | "Applications" | "DevOps" | "IA" | "Réseaux";
export const categories: Categorie[] = ["Web", "DevOps", "Applications", "IA", "Réseaux"];

export type Techno = { nom: string; logo?: LogoName };

export type Visuel =
  | { type: "capture"; src: string; alt: string }
  | { type: "mellifica" }
  | { type: "reseau" }
  | { type: "microservices" }
  | { type: "flux"; cadre: string; etapes: Etape[] }
  | { type: "vide" };

/** Une étape d’un schéma de fonctionnement : un bloc, ou une rangée de blocs. */
export type Etape = { titre?: string; detail?: string; blocs?: string[]; fort?: boolean };

export type Schema = "architecture-web" | "microservices" | "reseau";

export type Projet = {
  slug: string;
  nom: string;
  type: string;
  /** Année du projet, si elle est connue. */
  annee?: string;
  categories: Categorie[];
  description: string;
  role: string;
  technologies: Techno[];
  visuel: Visuel;
  etude: {
    accroche: string;
    reperes: { label: string; valeur: string }[];
    contexte: string;
    probleme?: string;
    contribution: { titre: string; intro: string; taches: { titre: string; detail: string }[] };
    choix?: { titre: string; texte: string; schema?: Schema };
    resultat?: {
      titre: string;
      capture?: string;
      /** `score` (sur 100) affiche un anneau, comme dans Lighthouse. */
      mesures: { label: string; valeur: string | null; score?: number }[];
    };
    liens: { code: string | null; demo: string | null };
  };
};

const gh = (depot: string) => `https://github.com/${depot}`;

export const projets: Projet[] = [
  {
    slug: "cybernova",
    nom: "Cybernova",
    type: "Projet d’équipe, plateforme web",
    annee: "2025",
    categories: ["Web", "DevOps"],
    description:
      "Une plateforme pour organiser des hackathons : publication des défis, inscription des équipes, soumission des projets et évaluation par un jury.",
    role: "Les espaces organisateur et jury : création et suivi des hackathons, notation des projets.",
    technologies: [
      { nom: "Java", logo: "Java" },
      { nom: "Spring Boot", logo: "Spring Boot" },
      { nom: "PostgreSQL", logo: "PostgreSQL" },
      { nom: "GitLab CI", logo: "GitLab" },
    ],
    visuel: {
      type: "capture",
      src: "/captures/cybernova.webp",
      alt: "Page de recherche des hackathons sur Cybernova",
    },
    etude: {
      accroche: "organiser un hackathon, de l’appel aux équipes jusqu’au jury.",
      reperes: [
        { label: "Mon rôle", valeur: "Espaces organisateur et jury" },
        { label: "Équipe", valeur: "Projet entre amis" },
        { label: "Année", valeur: "2025" },
        { label: "Stack", valeur: "Spring Boot, PostgreSQL" },
      ],
      contexte:
        "Un projet réalisé avec des amis : une plateforme où l’on découvre des hackathons, où les équipes s’inscrivent et soumettent leur projet, et où un jury les évalue.",
      contribution: {
        titre: "Ma contribution",
        intro: "Je me suis occupé de tout ce que voient les organisateurs et le jury.",
        taches: [
          {
            titre: "Espace organisateur",
            detail:
              "Créer un hackathon, ses dates, son lieu et son thème, puis suivre les inscriptions.",
          },
          {
            titre: "Espace jury",
            detail: "Consulter les projets soumis et les évaluer.",
          },
          {
            titre: "API REST Spring Boot",
            detail: "Les services correspondants, avec la modélisation PostgreSQL.",
          },
          {
            titre: "Travail en équipe",
            detail: "User stories, répartition en Scrum, démos et pipeline GitLab CI.",
          },
        ],
      },
      choix: {
        titre: "Une API Spring Boot, une intégration continue",
        texte:
          "Le back-end expose une API REST en Java Spring Boot, adossée à PostgreSQL. Un pipeline GitLab CI construit, teste et déploie l’application à chaque modification.",
      },
      // Le dépôt appartient à un professeur : pas de lien public.
      liens: { code: null, demo: null },
    },
  },
  {
    slug: "bibliotheque",
    nom: "Bibliothèque en ligne",
    type: "Projet d’équipe, microservices",
    annee: "2025",
    categories: ["DevOps", "Web"],
    description:
      "Une bibliothèque en ligne découpée en microservices, conteneurisée avec Docker et déployée sur Kubernetes.",
    role: "Le service de paiement : modèle des transactions, suivi des statuts et référence Stripe.",
    technologies: [
      { nom: "Next.js" },
      { nom: "TypeScript", logo: "TypeScript" },
      { nom: "Node.js", logo: "Node.js" },
      { nom: "PostgreSQL", logo: "PostgreSQL" },
      { nom: "Docker", logo: "Docker" },
      { nom: "Kubernetes", logo: "Kubernetes" },
    ],
    visuel: { type: "microservices" },
    etude: {
      accroche: "cinq services, un cluster Kubernetes.",
      reperes: [
        { label: "Architecture", valeur: "Microservices" },
        { label: "Front-end", valeur: "Next.js, TypeScript" },
        { label: "Déploiement", valeur: "Docker, Kubernetes" },
        { label: "Mon rôle", valeur: "Service de paiement" },
      ],
      contexte:
        "Une application de bibliothèque : catalogue de livres, comptes utilisateurs, emprunts et paiements, avec un espace d’administration.",
      probleme:
        "Chaque fonction doit pouvoir évoluer et être déployée seule. Le sujet demandait aussi une livraison complète : configuration Kubernetes et documentation d’installation, d’utilisation et de maintenance.",
      contribution: {
        titre: "Ma contribution",
        intro: "Dans l’équipe, j’étais chargé du service de paiement.",
        taches: [
          {
            titre: "Service Node.js / Express",
            detail: "Un microservice indépendant, avec son propre conteneur Docker.",
          },
          {
            titre: "Modèle des transactions",
            detail:
              "Schéma Prisma sur PostgreSQL : utilisateur, livre, montant, date, et statut en attente, réussi ou échoué.",
          },
          {
            titre: "Paiement en ligne",
            detail: "Chaque transaction garde la référence de sa session de paiement Stripe.",
          },
          {
            titre: "Découplage",
            detail:
              "Le service ne référence les utilisateurs et les livres que par identifiant, sans dépendre de leurs bases.",
          },
        ],
      },
      choix: {
        titre: "Découper pour déployer",
        texte:
          "Chaque service a sa responsabilité et son conteneur. Kubernetes les orchestre derrière une API Gateway, et la configuration passe par des secrets et des ConfigMaps plutôt que par le code.",
      },
      liens: { code: gh("321Coder123/projet-bibliotheque"), demo: null },
    },
  },
  {
    slug: "gestion-patients",
    nom: "Gestion de patients",
    type: "Application de bureau",
    annee: "2024",
    categories: ["Applications"],
    description:
      "La digitalisation d’une clinique : patients, rendez-vous et dossiers médicaux, dans une application Java.",
    role: "Développement de l’application en Java, avec JavaFX.",
    technologies: [
      { nom: "Java", logo: "Java" },
      { nom: "JavaFX" },
      { nom: "Scene Builder" },
      { nom: "MVC" },
    ],
    // À REMPLACER : une capture de l’application.
    visuel: {
      type: "flux",
      cadre: "application JavaFX · MVC",
      etapes: [
        { titre: "Vues", detail: "JavaFX · Scene Builder", fort: true },
        { titre: "Contrôleurs", detail: "Validation des formulaires" },
        { blocs: ["Patients", "Rendez-vous", "Dossiers médicaux"] },
        { titre: "Base de données", detail: "Accès protégés" },
      ],
    },
    etude: {
      accroche: "une clinique sur ordinateur.",
      reperes: [
        { label: "Type", valeur: "Application de bureau" },
        { label: "Langage", valeur: "Java, JavaFX" },
        { label: "Architecture", valeur: "MVC" },
        { label: "Année", valeur: "2024" },
      ],
      contexte:
        "Une application pour gérer le quotidien d’une clinique : fiches patients, prise de rendez-vous et dossiers médicaux.",
      contribution: {
        titre: "Ce que j’ai réalisé",
        intro: "Une application Java organisée en MVC, avec des données protégées.",
        taches: [
          {
            titre: "Interfaces JavaFX",
            detail: "Écrans conçus avec Scene Builder et mis en forme en CSS.",
          },
          { titre: "Architecture MVC", detail: "Modèles, vues et contrôleurs séparés." },
          { titre: "Données et droits", detail: "Base de données sécurisée et gestion des accès." },
          {
            titre: "Qualité",
            detail: "Validation des formulaires, tests de non-régression, documentation.",
          },
        ],
      },
      liens: { code: null, demo: null },
    },
  },
  {
    slug: "loka",
    nom: "LOKA",
    type: "Projet d’équipe, site web",
    annee: "2026",
    categories: ["Web"],
    description:
      "Un site pour trouver un logement et gérer sa location : biens, locataires, contrats, paiements et documents.",
    // À REMPLACER : ta partie exacte dans le projet.
    role: "Développement web en équipe, en HTML, CSS et JavaScript.",
    technologies: [
      { nom: "HTML5", logo: "HTML5" },
      { nom: "CSS", logo: "CSS" },
      { nom: "JavaScript" },
      { nom: "PHP" },
      { nom: "MySQL" },
    ],
    visuel: { type: "capture", src: "/captures/loka.webp", alt: "Page d’accueil du site LOKA" },
    etude: {
      accroche: "chercher un logement et gérer sa location au même endroit.",
      reperes: [
        { label: "Type", valeur: "Site web" },
        { label: "Équipe", valeur: "Projet d’équipe" },
        { label: "Stack", valeur: "HTML, CSS, JS, PHP" },
        { label: "Année", valeur: "2026" },
      ],
      contexte:
        "LOKA réunit deux usages : les locataires y cherchent un logement, les propriétaires y gèrent leurs biens, leurs contrats et leurs paiements.",
      contribution: {
        titre: "Le projet",
        intro: "Un site complet, découpé en modules.",
        taches: [
          { titre: "Recherche de logements", detail: "Filtres, fiches de biens, colocation." },
          {
            titre: "Gestion locative",
            detail: "Biens, propriétaires, locataires, contrats et documents.",
          },
          { titre: "Paiements et maintenance", detail: "Suivi des loyers et des demandes." },
          { titre: "Tableaux de bord", detail: "Rapports et notifications." },
        ],
      },
      liens: { code: gh("bry237/LOKA"), demo: null },
    },
  },
  {
    slug: "todo-list",
    nom: "To-do list",
    type: "Projet personnel",
    annee: "2026",
    categories: ["Web"],
    description:
      "Une application de gestion de tâches en Python : priorités, échéances, progression et sauvegarde automatique.",
    role: "Projet personnel, réalisé seul.",
    technologies: [{ nom: "Python", logo: "Python" }, { nom: "Flask" }, { nom: "Jinja" }],
    visuel: {
      type: "capture",
      src: "/captures/todo.webp",
      alt: "Liste de tâches de l’application",
    },
    etude: {
      accroche: "apprendre Flask en construisant un vrai outil.",
      reperes: [
        { label: "Type", valeur: "Projet personnel" },
        { label: "Langage", valeur: "Python, Flask" },
        { label: "Données", valeur: "Fichier JSON" },
        { label: "Année", valeur: "2026" },
      ],
      contexte:
        "Une application web pour suivre ses tâches, construite pour apprendre le développement web en Python.",
      contribution: {
        titre: "Ce que j’ai réalisé",
        intro: "Une application Flask complète, du serveur aux templates.",
        taches: [
          { titre: "Tâches", detail: "Ajouter, cocher et supprimer des tâches." },
          {
            titre: "Priorités et échéances",
            detail:
              "Trois niveaux de priorité, tâches en retard mises en évidence, tri automatique.",
          },
          {
            titre: "Progression",
            detail: "Barre d’avancement et liste repliable des tâches terminées.",
          },
          { titre: "Sauvegarde", detail: "Les données sont enregistrées dans un fichier JSON." },
        ],
      },
      liens: { code: gh("codespecter007/Todo_List-Flask"), demo: null },
    },
  },
  {
    slug: "mellifica",
    nom: "Mellifica",
    type: "Projet d’équipe, éco-conception",
    annee: "2026",
    categories: ["Web"],
    description:
      "Un site vitrine de miels rendu accessible et écologique, réalisé à six. Lighthouse : 100 en performances, 96 en accessibilité.",
    role: "Responsable front-end : structure HTML et accessibilité.",
    technologies: [
      { nom: "HTML5", logo: "HTML5" },
      { nom: "CSS", logo: "CSS" },
      { nom: "MariaDB", logo: "MariaDB" },
      { nom: "XAMPP", logo: "XAMPP" },
    ],
    visuel: {
      type: "capture",
      src: "/captures/mellifica.webp",
      alt: "Page Miels du site Mellifica",
    },
    etude: {
      accroche: "un site accessible et sobre, à six.",
      reperes: [
        { label: "Rôle", valeur: "Front-end, accessibilité" },
        { label: "Équipe", valeur: "6 personnes" },
        { label: "Contexte", valeur: "Challenge d’éco-conception" },
        { label: "Lighthouse", valeur: "100 · 96 · 100 · 100" },
      ],
      contexte:
        "Un projet de groupe à six autour de l’éco-conception web : rendre une application accessible et plus écologique. Le site présente des miels et leurs produits dérivés.",
      probleme:
        "Un site vitrine classique pèse vite lourd et reste difficile à utiliser au clavier ou avec un lecteur d’écran. Il fallait un site léger, lisible et accessible.",
      contribution: {
        titre: "Ma contribution",
        intro: "J’ai pris en charge la structure HTML et l’accessibilité.",
        taches: [
          { titre: "Validation W3C", detail: "Un HTML valide, sans erreur au validateur." },
          { titre: "Textes alternatifs", detail: "Chaque image porte une description utile." },
          {
            titre: "Contrastes et labels",
            detail: "Des formulaires lisibles et utilisables au clavier.",
          },
          { titre: "Nettoyage du DOM", detail: "Moins de balises, des pages plus légères." },
          { titre: "Pages Miels et Produits dérivés", detail: "Leur intégration complète." },
        ],
      },
      choix: {
        titre: "Simple, local, léger",
        texte:
          "Le site est développé en local avec XAMPP et MariaDB, sans framework lourd. Moins de dépendances, moins de poids à charger.",
        schema: "architecture-web",
      },
      resultat: {
        titre: "Un site léger et accessible, mesuré avec Lighthouse.",
        capture: "/captures/mellifica-accueil.webp",
        mesures: [
          { label: "Performances", valeur: "100", score: 100 },
          { label: "Accessibilité", valeur: "96", score: 96 },
          { label: "Bonnes pratiques", valeur: "100", score: 100 },
          { label: "SEO", valeur: "100", score: 100 },
        ],
      },
      liens: { code: null, demo: null },
    },
  },
  {
    slug: "nomenclature-ia",
    nom: "Outil de nomenclature assisté par l’IA",
    type: "Projet personnel",
    annee: "2026",
    categories: ["IA", "Applications"],
    description:
      "Un outil qui extrait une nomenclature d’un PowerPoint avec un LLM, la vérifie, puis génère un dossier de montage.",
    role: "Projet personnel, de l’idée à l’outil utilisable.",
    technologies: [
      { nom: "Python", logo: "Python" },
      { nom: "API Claude" },
      { nom: "Power Apps" },
      { nom: "Power Automate" },
    ],
    visuel: {
      type: "capture",
      src: "/captures/nomenclature.webp",
      alt: "Liste des pièces extraites, prête pour le dossier de montage",
    },
    etude: {
      accroche: "11 pièces sur 11, et un humain dans la boucle.",
      reperes: [
        { label: "Type", valeur: "Projet personnel" },
        { label: "Résultat", valeur: "11/11 contre 7/11 sans IA" },
        { label: "Langage", valeur: "Python" },
        { label: "Année", valeur: "2026" },
      ],
      contexte:
        "Préparer un dossier de montage demande de recopier à la main la liste des pièces d’une présentation. L’outil automatise cette étape.",
      contribution: {
        titre: "Ce que j’ai réalisé",
        intro: "Un LLM encadré par des contrôles, pour un résultat fiable.",
        taches: [
          {
            titre: "Extraction par LLM",
            detail: "Données structurées en JSON, avec une consigne qui interdit d’inventer.",
          },
          {
            titre: "Évaluation",
            detail:
              "Comparaison avec le résultat attendu : 11 pièces sur 11 contre 7 sur 11 sans IA.",
          },
          {
            titre: "Contrôles",
            detail:
              "Lignes douteuses marquées « à vérifier », validation dans une interface dédiée.",
          },
          { titre: "Sécurité", detail: "Clé API en variable d’environnement, jamais versionnée." },
          { titre: "Adoption", detail: "Guide d’installation et démo vidéo." },
        ],
      },
      liens: { code: gh("codespecter007/generateur-nomenclature-ia"), demo: null },
    },
  },
  {
    slug: "suivi-academique",
    nom: "Suivi académique",
    type: "Projet de cours, plateforme web",
    annee: "2025",
    categories: ["Web"],
    description:
      "Une plateforme pour les étudiants, les parents et les responsables : notes, alertes, tableaux de bord et messagerie.",
    role: "Développement de la plateforme en PHP et MySQL.",
    technologies: [{ nom: "PHP" }, { nom: "MySQL" }, { nom: "JavaScript" }, { nom: "AJAX" }],
    visuel: {
      type: "flux",
      cadre: "plateforme PHP",
      etapes: [
        { blocs: ["Étudiant", "Parent", "Responsable"], fort: true },
        { titre: "Contrôle des accès", detail: "Selon le rôle" },
        { blocs: ["Tableaux de bord", "Alertes", "Messagerie"] },
        { titre: "MySQL", detail: "Mises à jour en AJAX" },
      ],
    },
    etude: {
      accroche: "un même outil, trois points de vue.",
      reperes: [
        { label: "Type", valeur: "Plateforme web" },
        { label: "Utilisateurs", valeur: "Étudiants, parents, responsables" },
        { label: "Stack", valeur: "PHP, MySQL, AJAX" },
        { label: "Année", valeur: "2025" },
      ],
      contexte:
        "Une plateforme de suivi des études, où chacun voit ce qui le concerne selon son rôle.",
      contribution: {
        titre: "Ce que j’ai réalisé",
        intro: "Une application web avec des accès différents selon le rôle.",
        taches: [
          {
            titre: "Rôles et accès",
            detail: "Étudiant, parent ou responsable : chacun son espace.",
          },
          {
            titre: "Tableaux de bord",
            detail: "Notes et suivi, mis à jour sans recharger la page.",
          },
          { titre: "Alertes et messagerie", detail: "Notifications et messagerie interne." },
        ],
      },
      liens: { code: null, demo: null },
    },
  },
  {
    slug: "releves-de-notes",
    nom: "Relevés de notes",
    type: "Projet de cours, application web",
    annee: "2025",
    categories: ["Web"],
    description:
      "Gérer les étudiants, leurs cours et leurs notes, puis générer automatiquement les relevés en PDF.",
    role: "Développement de l’application en PHP.",
    technologies: [{ nom: "PHP" }, { nom: "MySQL" }, { nom: "JavaScript" }, { nom: "Composer" }],
    visuel: {
      type: "flux",
      cadre: "application PHP",
      etapes: [
        { blocs: ["Administration", "Étudiant"], fort: true },
        { titre: "Notes et cours", detail: "Saisie en AJAX" },
        { titre: "MySQL", detail: "Étudiants, cours, notes" },
        { titre: "Relevé PDF", detail: "Généré automatiquement", fort: true },
      ],
    },
    etude: {
      accroche: "des notes au relevé PDF, en un clic.",
      reperes: [
        { label: "Type", valeur: "Application web" },
        { label: "Stack", valeur: "PHP, MySQL, JS" },
        { label: "Sortie", valeur: "Relevés PDF" },
        { label: "Année", valeur: "2025" },
      ],
      contexte:
        "Une application pour gérer la scolarité : étudiants, cours et notes, avec un espace pour l’administration et un pour les étudiants.",
      contribution: {
        titre: "Ce que j’ai réalisé",
        intro: "Une application complète, de la saisie des notes au relevé imprimable.",
        taches: [
          { titre: "Gestion des notes", detail: "Ajout, modification et suppression, en AJAX." },
          {
            titre: "Espace étudiant",
            detail: "Inscription, connexion et consultation de ses notes.",
          },
          { titre: "Relevés PDF", detail: "Génération automatique du relevé de chaque étudiant." },
          {
            titre: "Statistiques et exports",
            detail: "Tableau de bord, exports des notes et des étudiants.",
          },
        ],
      },
      liens: { code: gh("codespecter007/releves_de_notes"), demo: null },
    },
  },
  {
    slug: "reseau-agence",
    nom: "Réseau d’une agence",
    type: "Travaux pratiques en équipe",
    annee: "2026",
    categories: ["Réseaux"],
    description:
      "Installer et configurer le réseau d’une agence sur du matériel Cisco, du routeur au Wi-Fi, puis diagnostiquer les pannes.",
    role: "Configuration en équipe, en îlot.",
    technologies: [
      { nom: "Cisco", logo: "Cisco" },
      { nom: "VLAN" },
      { nom: "OSPF" },
      { nom: "HSRP" },
      { nom: "LACP" },
      { nom: "DHCP" },
    ],
    visuel: { type: "reseau" },
    etude: {
      accroche: "du routeur au Wi-Fi, sur du vrai matériel.",
      reperes: [
        { label: "Format", valeur: "TP en îlot" },
        { label: "Matériel", valeur: "Cisco 1941, Catalyst 2960" },
        { label: "Wi-Fi", valeur: "Linksys WRT300N" },
        { label: "Fin", valeur: "Restitution individuelle" },
      ],
      contexte:
        "En cours, nous montons des réseaux complets sur des équipements Cisco et en simulation. Ce TP porte sur le réseau d’une agence relié à celui de l’école.",
      contribution: {
        titre: "Ce que nous avons mis en place",
        intro: "Des mécanismes configurés à la main, de bout en bout.",
        taches: [
          { titre: "VLAN et routage inter-VLAN", detail: "Le découpage du réseau de l’agence." },
          { titre: "OSPF", detail: "Le routage dynamique entre les routeurs." },
          { titre: "HSRP", detail: "Une passerelle redondante si un routeur tombe." },
          {
            titre: "LACP et port-channel",
            detail:
              "Plusieurs liens agrégés entre commutateurs, pour le débit et la tolérance aux pannes.",
          },
          { titre: "DHCP et PAT", detail: "Adresses automatiques et sortie vers l’école." },
        ],
      },
      choix: {
        titre: "La topologie du TP",
        texte:
          "Un routeur Cisco 1941 relie l’agence au réseau de l’école. Un switch Catalyst 2960 distribue les VLAN, et un WRT300N fournit le Wi-Fi.",
        schema: "reseau",
      },
      liens: { code: null, demo: null },
    },
  },
];

export const getProjet = (slug: string) => projets.find((p) => p.slug === slug);
