"use client";

import { useEffect, useMemo, useState } from "react";
import { Garde } from "@/components/admin/Garde";
import { api } from "@/lib/admin-api";

type Ligne = { nom: string; visites: number; vues?: number };
type Stats = {
  jours: number;
  totaux: {
    visites: number;
    vues: number;
    cv: number;
    email: number;
    linkedin: number;
    github: number;
    messagesNonLus: number;
  };
  parJour: { jour: string; visites: number; vues: number }[];
  pages: Ligne[];
  sources: Ligne[];
  pays: Ligne[];
  appareils: Ligne[];
  liens: {
    nom: string;
    visites: number;
    vues: number;
    cv: number;
    contacts: number;
    derniere: string;
  }[];
  sessions: {
    debut: string;
    fin: string;
    pays: string | null;
    appareil: string;
    source: string | null;
    ref: string | null;
    vues: number;
    parcours: string[];
    actions: string[];
  }[];
};

const PERIODES = [
  { jours: 7, label: "7 jours" },
  { jours: 30, label: "30 jours" },
  { jours: 90, label: "3 mois" },
  { jours: 365, label: "12 mois" },
];

const nomsPays = (() => {
  try {
    return new Intl.DisplayNames(["fr"], { type: "region" });
  } catch {
    return null;
  }
})();
const pays = (code: string | null) =>
  !code || code === "?" ? "Inconnu" : (nomsPays?.of(code) ?? code);

const ACTIONS: Record<string, string> = {
  cv: "CV téléchargé",
  email: "E-mail ouvert",
  "email-copie": "E-mail copié",
  linkedin: "LinkedIn",
  github: "GitHub",
};

function nomPage(chemin: string) {
  const c = chemin.replace(/\/+$/, "") || "/";
  if (c === "/") return "Accueil";
  if (c === "/projets") return "Projets";
  if (c === "/parcours") return "Parcours";
  if (c === "/contact") return "Contact";
  if (c.startsWith("/projets/")) return `Projet : ${c.slice(9)}`;
  return c;
}

const date = (s: string, heure = false) =>
  new Date(s).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    ...(heure ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Europe/Paris",
  });

function Tuile({ valeur, label }: { valeur: number; label: [string, string] }) {
  return (
    <div className="stats-tuile">
      <strong>{valeur.toLocaleString("fr-FR")}</strong>
      <span>{valeur > 1 ? label[1] : label[0]}</span>
    </div>
  );
}

/** Visites par jour : barres fines, infobulle au survol, tableau équivalent dessous. */
function Courbe({ donnees }: { donnees: Stats["parJour"] }) {
  const [actif, setActif] = useState<number | null>(null);
  const max = Math.max(1, ...donnees.map((d) => d.visites));
  const pas = max <= 5 ? 1 : Math.ceil(max / 4);
  const graduations = Array.from({ length: Math.floor(max / pas) + 1 }, (_, i) => i * pas);
  const haut = graduations.at(-1)! || 1;
  const d = actif !== null ? donnees[actif] : null;
  return (
    <figure className="stats-courbe">
      <div className="stats-courbe__zone" onMouseLeave={() => setActif(null)}>
        {graduations.map((g) => (
          <span key={g} className="stats-courbe__ligne" style={{ bottom: `${(g / haut) * 100}%` }}>
            <span>{g}</span>
          </span>
        ))}
        <div
          className="stats-courbe__barres"
          style={{ "--n": donnees.length } as React.CSSProperties}
        >
          {donnees.map((j, i) => (
            <button
              key={j.jour}
              type="button"
              className="stats-courbe__colonne"
              aria-label={`${date(j.jour)} : ${j.visites} visites, ${j.vues} pages vues`}
              onMouseEnter={() => setActif(i)}
              onFocus={() => setActif(i)}
              onBlur={() => setActif(null)}
            >
              <span
                className="stats-courbe__barre"
                style={{ height: `${(Math.min(j.visites, haut) / haut) * 100}%` }}
              />
            </button>
          ))}
        </div>
        {d && (
          <div
            className="stats-infobulle"
            style={{
              left: `${((actif! + 0.5) / donnees.length) * 100}%`,
              // Près des bords, l’infobulle s’aligne vers l’intérieur pour rester visible.
              transform: `translateX(${actif! / donnees.length > 0.75 ? "-100%" : actif! / donnees.length < 0.25 ? "0" : "-50%"})`,
            }}
            role="status"
          >
            <strong>{date(d.jour)}</strong>
            <span>
              {d.visites} visite{d.visites > 1 ? "s" : ""} · {d.vues} page{d.vues > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
      <figcaption className="stats-courbe__axe">
        <span>{date(donnees[0]?.jour ?? new Date().toISOString())}</span>
        <span>Aujourd’hui</span>
      </figcaption>
      <details className="stats-details">
        <summary>Voir sous forme de tableau</summary>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Jour</th>
              <th>Visites</th>
              <th>Pages vues</th>
            </tr>
          </thead>
          <tbody>
            {donnees
              .filter((j) => j.vues > 0)
              .map((j) => (
                <tr key={j.jour}>
                  <td>{date(j.jour)}</td>
                  <td>{j.visites}</td>
                  <td>{j.vues}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

function Classement({
  titre,
  lignes,
  nom = (s) => s,
  vide = "Rien pour l’instant",
}: {
  titre: string;
  lignes: Ligne[];
  nom?: (s: string) => string;
  vide?: string;
}) {
  const max = Math.max(1, ...lignes.map((l) => l.vues ?? l.visites));
  return (
    <section className="admin-carte stats-classement">
      <h2 className="t-h3">{titre}</h2>
      {lignes.length === 0 ? (
        <p className="secondaire">{vide}</p>
      ) : (
        <ol>
          {lignes.map((l) => {
            const v = l.vues ?? l.visites;
            return (
              <li key={l.nom}>
                <span className="stats-classement__fond" style={{ width: `${(v / max) * 100}%` }} />
                <span className="stats-classement__nom">{nom(l.nom)}</span>
                <span className="stats-classement__valeur">
                  {v.toLocaleString("fr-FR")}
                  {l.vues !== undefined && <small> {v > 1 ? "vues" : "vue"}</small>}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function Liens({ liens }: { liens: Stats["liens"] }) {
  const [entreprise, setEntreprise] = useState("");
  const [copie, setCopie] = useState(false);
  const ref = entreprise
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const url = typeof window === "undefined" ? "" : `${location.origin}/?ref=${ref}`;
  return (
    <section className="admin-carte">
      <div>
        <h2 className="t-h2">Liens de candidature</h2>
        <p className="secondaire">
          Mettez ce lien dans votre lettre ou votre e-mail : vous verrez ici quand l’entreprise
          visite le site et ce qu’elle consulte. Pour le QR code du CV, utilisez{" "}
          <code>?ref=qr</code>.
        </p>
      </div>
      <div className="stats-generateur">
        <label className="champ">
          <span>Entreprise</span>
          <input
            value={entreprise}
            onChange={(e) => {
              setEntreprise(e.target.value);
              setCopie(false);
            }}
            placeholder="Ex. : Capgemini"
          />
        </label>
        {ref && (
          <div className="stats-generateur__lien">
            <code>{url}</code>
            <button
              type="button"
              className="admin-bouton"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(url);
                  setCopie(true);
                } catch {}
              }}
            >
              {copie ? "Copié" : "Copier"}
            </button>
          </div>
        )}
      </div>
      {liens.length > 0 ? (
        <div className="stats-defile">
          <table className="stats-table">
            <thead>
              <tr>
                <th>Lien</th>
                <th>Visites</th>
                <th>Pages vues</th>
                <th>CV</th>
                <th>E-mail, LinkedIn</th>
                <th>Dernière visite</th>
              </tr>
            </thead>
            <tbody>
              {liens.map((l) => (
                <tr key={l.nom}>
                  <td>
                    <strong>{l.nom}</strong>
                  </td>
                  <td>{l.visites}</td>
                  <td>{l.vues}</td>
                  <td>{l.cv > 0 ? <span className="admin-badge">{l.cv}</span> : 0}</td>
                  <td>{l.contacts}</td>
                  <td>{date(l.derniere, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="secondaire">Aucun lien de candidature n’a encore été ouvert.</p>
      )}
    </section>
  );
}

function Visites({ sessions }: { sessions: Stats["sessions"] }) {
  return (
    <section className="admin-carte">
      <div>
        <h2 className="t-h2">Dernières visites</h2>
        <p className="secondaire">
          Anonymes : le parcours de chaque visite, sans savoir qui c’est.
        </p>
      </div>
      {sessions.length === 0 ? (
        <p className="secondaire">Aucune visite sur cette période.</p>
      ) : (
        <ul className="stats-visites">
          {sessions.map((s, i) => (
            <li key={i}>
              <div className="stats-visites__entete">
                <strong>{date(s.debut, true)}</strong>
                <span>
                  {pays(s.pays)} · {s.appareil}
                  {s.source && ` · depuis ${s.source}`}
                </span>
                {s.ref && <span className="admin-badge">{s.ref}</span>}
              </div>
              <ol className="stats-visites__parcours">
                {s.parcours.map((c, j) => (
                  <li key={j}>{nomPage(c)}</li>
                ))}
              </ol>
              {s.actions.length > 0 && (
                <p className="stats-visites__actions">
                  {s.actions.map((a) => ACTIONS[a] ?? a).join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Tableau() {
  const [jours, setJours] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    let actif = true;
    api<Stats>(`/admin/stats?jours=${jours}`)
      .then((s) => actif && setStats(s))
      .catch((e) => actif && setErreur(e.message));
    return () => {
      actif = false;
    };
  }, [jours]);

  const contacts = useMemo(
    () => (stats ? stats.totaux.email + stats.totaux.linkedin + stats.totaux.github : 0),
    [stats],
  );

  return (
    <div className="admin-tableau">
      <div className="admin-carte__entete">
        <h1 className="t-h2">Statistiques</h1>
        <div className="stats-periodes" role="group" aria-label="Période">
          {PERIODES.map((p) => (
            <button
              key={p.jours}
              type="button"
              aria-pressed={jours === p.jours}
              onClick={() => setJours(p.jours)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      {erreur && <p className="admin-erreur">{erreur}</p>}
      {!stats ? (
        <p className="admin-chargement">Chargement…</p>
      ) : (
        <>
          <section className="admin-carte">
            <div className="stats-tuiles">
              <Tuile valeur={stats.totaux.visites} label={["visite", "visites"]} />
              <Tuile valeur={stats.totaux.vues} label={["page vue", "pages vues"]} />
              <Tuile valeur={stats.totaux.cv} label={["CV téléchargé", "CV téléchargés"]} />
              <Tuile
                valeur={contacts}
                label={["clic e-mail, LinkedIn, GitHub", "clics e-mail, LinkedIn, GitHub"]}
              />
            </div>
            <Courbe donnees={stats.parJour} />
          </section>
          <Liens liens={stats.liens} />
          <div className="stats-grille">
            <Classement titre="Pages les plus vues" lignes={stats.pages} nom={nomPage} />
            <Classement titre="D’où viennent les visites" lignes={stats.sources} />
            <Classement titre="Pays" lignes={stats.pays} nom={pays} />
            <Classement titre="Appareils" lignes={stats.appareils} />
          </div>
          <Visites sessions={stats.sessions} />
          <p className="t-petit secondaire">
            Mesure sans cookie : aucune adresse IP ni donnée personnelle n’est enregistrée, et vos
            propres visites ne sont pas comptées sur les appareils où vous êtes connecté à l’admin.
            Les données de plus de 13 mois sont effacées.
          </p>
        </>
      )}
    </div>
  );
}

export default function Statistiques() {
  return (
    <Garde>
      <Tableau />
    </Garde>
  );
}
