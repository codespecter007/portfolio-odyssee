import type { Etape } from "@/content/projets";
import { Personne, QrVide } from "./icones";

/** Emplacement photo : la vraie photo si elle existe, sinon un cadre vide. */
export function Photo({
  src,
  alt,
  forme = "arche",
  className = "",
}: {
  src: string | null;
  alt: string;
  forme?: "arche" | "paysage";
  className?: string;
}) {
  return (
    <div className={`photo photo--${forme} ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- site statique, images déjà optimisées
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <Personne />
      )}
    </div>
  );
}

export function QrCode({ src }: { src: string | null }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- image statique
    <img src={src} alt="QR code vers ce portfolio" width={150} height={150} />
  ) : (
    <div className="qr">
      <QrVide taille={48} />
    </div>
  );
}

/**
 * Écran d’exemple du site Mellifica, dessiné en CSS.
 * À REMPLACER par une vraie capture : passer `capture="/captures/mellifica.webp"`.
 */
export function Tablette({
  capture,
  alt = "Capture d’écran du projet",
  vide = false,
  className = "",
}: {
  capture?: string;
  alt?: string;
  vide?: boolean;
  className?: string;
}) {
  return (
    <div className={`tablette ${className}`}>
      <div className="tablette__ecran">
        {capture ? (
          // eslint-disable-next-line @next/next/no-img-element -- capture statique
          <img src={capture} alt={alt} />
        ) : vide ? (
          <div className="ecran-vide">
            <span className="t-legende">capture à venir</span>
          </div>
        ) : (
          <div className="ecran-exemple" aria-hidden>
            <div className="ecran-exemple__barre">
              <span className="ecran-exemple__marque">Mellifica</span>
              <span className="ecran-exemple__menu">
                <span>Miels</span>
                <span>Produits dérivés</span>
              </span>
            </div>
            <div className="ecran-exemple__banniere">
              <span>
                Des miels de saison,
                <br />
                récoltés près de chez vous
              </span>
              <i />
            </div>
            <div className="ecran-exemple__cases">
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Ordinateur portable, emplacement de la capture du résultat. */
export function Ordinateur({ capture, alt = "" }: { capture?: string; alt?: string }) {
  return (
    <div className="ordinateur">
      <div className="ordinateur__ecran">
        <div>
          {capture ? (
            // eslint-disable-next-line @next/next/no-img-element -- capture statique
            <img src={capture} alt={alt} loading="lazy" />
          ) : (
            <span className="t-legende">capture à venir</span>
          )}
        </div>
      </div>
      <div className="ordinateur__base" />
    </div>
  );
}

/** Schéma de la topologie du TP réseau (repris de la maquette). */
export function SchemaReseau() {
  const n = (x: number, y: number) => ({ left: `${(x / 600) * 100}%`, top: `${(y / 400) * 100}%` });
  return (
    <figure className="schema-reseau" aria-label="Schéma du réseau de l’agence">
      <svg className="schema-reseau__cables" viewBox="0 0 600 400" aria-hidden>
        <path d="M113 74v52M113 169h250M360 110v60M113 169v72M235 169v72M357 169v72M479 169v140M296 67h180" />
        <circle className="schema-reseau__paquet" cx="110" cy="116" r="6" />
        <circle className="schema-reseau__paquet" cx="426" cy="166" r="6">
          <animate attributeName="cx" values="130;460;130" dur="6s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div className="schema-reseau__noeud schema-reseau__noeud--fort" style={n(40, 20)}>
        Réseau de l’école <small>sortie PAT</small>
      </div>
      <div className="schema-reseau__noeud" style={n(300, 40)}>
        Routeur <small>Cisco 1941</small>
      </div>
      <div className="schema-reseau__noeud" style={n(260, 140)}>
        Switch <small>Catalyst 2960</small>
      </div>
      <div className="schema-reseau__noeud" style={n(40, 238)}>
        VLAN 10
      </div>
      <div className="schema-reseau__noeud" style={n(170, 238)}>
        VLAN 20
      </div>
      <div className="schema-reseau__noeud" style={n(300, 238)}>
        VLAN 88
      </div>
      <div className="schema-reseau__noeud" style={n(420, 300)}>
        Wi-Fi <small>WRT300N</small>
      </div>
    </figure>
  );
}

/** Architecture du site Mellifica : navigateur, serveur local, base de données. */
export function SchemaArchitecture() {
  const etapes = [
    ["Navigateur", "HTML, CSS"],
    ["Serveur local", "XAMPP"],
    ["Base de données", "MariaDB"],
  ];
  return (
    <figure className="architecture" aria-label="Architecture du site">
      {etapes.map(([titre, detail], i) => (
        <div key={titre} style={{ display: "contents" }}>
          {i > 0 && <span className="architecture__fleche" aria-hidden />}
          <div className="architecture__noeud">
            <strong className="t-h3">{titre}</strong>
            <small>{detail}</small>
          </div>
        </div>
      ))}
    </figure>
  );
}

/** Architecture de la bibliothèque : gateway, quatre services, PostgreSQL, dans Kubernetes. */
export function SchemaMicroservices() {
  const services = ["Utilisateurs", "Catalogue", "Emprunts", "Paiements"];
  return (
    <figure className="micro" aria-label="Architecture en microservices sur Kubernetes">
      <span className="micro__cluster t-legende">cluster Kubernetes</span>
      <div className="micro__noeud micro__noeud--fort">
        Front-end <small>Next.js</small>
      </div>
      <span className="micro__lien" aria-hidden />
      <div className="micro__noeud">
        API Gateway <small>Express</small>
      </div>
      <span className="micro__lien" aria-hidden />
      <div
        className="micro__services micro__services--arbre"
        style={{ "--n": services.length } as React.CSSProperties}
      >
        {services.map((s) => (
          <div key={s} className="micro__noeud micro__noeud--service">
            {s} <small>Node.js · Docker</small>
          </div>
        ))}
      </div>
      <span className="micro__lien" aria-hidden />
      <div className="micro__noeud">
        PostgreSQL <small>Prisma</small>
      </div>
    </figure>
  );
}

/** Schéma de fonctionnement générique, pour les projets sans capture. */
export function SchemaFlux({ cadre, etapes }: { cadre: string; etapes: Etape[] }) {
  return (
    <figure className="micro" aria-label={`Schéma de fonctionnement : ${cadre}`}>
      <span className="micro__cluster t-legende">{cadre}</span>
      {etapes.map((e, i) => (
        <div key={i} style={{ display: "contents" }}>
          {i > 0 && <span className="micro__lien" aria-hidden />}
          {e.blocs ? (
            <div
              className={`micro__services micro__services--arbre${i === 0 ? " micro__services--racine" : ""}${i === etapes.length - 1 ? " micro__services--feuille" : ""}`}
              style={
                {
                  gridTemplateColumns: `repeat(${e.blocs.length}, minmax(0, 1fr))`,
                  "--n": e.blocs.length,
                } as React.CSSProperties
              }
            >
              {e.blocs.map((b) => (
                <div
                  key={b}
                  className={`micro__noeud micro__noeud--service${e.fort ? " micro__noeud--fort" : ""}`}
                >
                  {b}
                </div>
              ))}
            </div>
          ) : (
            <div className={`micro__noeud${e.fort ? " micro__noeud--fort" : ""}`}>
              {e.titre} {e.detail && <small>{e.detail}</small>}
            </div>
          )}
        </div>
      ))}
    </figure>
  );
}

/** Illustration de la page Projets : un éditeur de code et un terminal, dessinés en CSS. */
export function IllustrationProjets() {
  return (
    <div className="illu" aria-hidden>
      <div className="illu__editeur">
        <div className="illu__barre">
          <i />
          <i />
          <i />
          <span>paiement.service.ts</span>
        </div>
        <pre className="illu__code">
          <span className="k">export async function</span>{" "}
          <span className="f">creerTransaction</span>(req) {"{"}
          {"\n"}
          {"  "}
          <span className="k">const</span> t = <span className="k">await</span> prisma.transaction.
          <span className="f">create</span>({"{"}
          {"\n"}
          {"    "}data: {"{"} ...req.body, statut: <span className="s">&quot;EN_ATTENTE&quot;</span>{" "}
          {"}"},{"\n"}
          {"  "}
          {"}"});
          {"\n"}
          {"  "}
          <span className="k">return</span> t;
          {"\n"}
          {"}"}
        </pre>
      </div>
      <div className="illu__terminal">
        <p>
          <span className="s">$</span> docker compose up -d
        </p>
        <p>
          <span className="ok">✔</span> front <span className="d">démarré</span>
        </p>
        <p>
          <span className="ok">✔</span> gateway <span className="d">démarré</span>
        </p>
        <p>
          <span className="ok">✔</span> paiement <span className="d">démarré</span>
        </p>
        <p>
          <span className="s">$</span> kubectl get pods
          <span className="curseur" />
        </p>
      </div>
      <div className="illu__conteneurs">
        {["front", "api", "db"].map((c) => (
          <span key={c} className="illu__boite">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
