"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Garde } from "@/components/admin/Garde";
import { api, json } from "@/lib/admin-api";

type ProjetResume = { id: string; slug: string; nom: string; type: string; publie: boolean };
type ExperienceResume = {
  id: string;
  poste: string;
  structure: string;
  periode: string;
  publie: boolean;
};

function Tableau() {
  const [projets, setProjets] = useState<ProjetResume[]>([]);
  const [experiences, setExperiences] = useState<ExperienceResume[]>([]);
  const [message, setMessage] = useState("");

  const [version, setVersion] = useState(0);
  const charger = () => setVersion((v) => v + 1);
  useEffect(() => {
    let actif = true;
    Promise.all([
      api<ProjetResume[]>("/admin/projets"),
      api<ExperienceResume[]>("/admin/experiences"),
    ])
      .then(([p, e]) => {
        if (!actif) return;
        setProjets(p);
        setExperiences(e);
      })
      .catch((e) => actif && setMessage(e.message));
    return () => {
      actif = false;
    };
  }, [version]);

  const deplacer = async (i: number, d: number) => {
    const n = [...projets];
    const [x] = n.splice(i, 1);
    n.splice(i + d, 0, x);
    setProjets(n);
    await api("/admin/projets/ordre", { method: "PUT", body: json({ ids: n.map((p) => p.id) }) });
    setMessage("Ordre enregistré");
  };

  const supprimer = async (chemin: string, nom: string) => {
    if (!window.confirm(`Supprimer « ${nom} » ? Cette action est définitive.`)) return;
    await api(chemin, { method: "DELETE" });
    setMessage(`« ${nom} » supprimé`);
    charger();
  };

  return (
    <div className="admin-tableau">
      {message && (
        <p className="admin-info" role="status">
          {message}
        </p>
      )}

      <section className="admin-carte">
        <div className="admin-carte__entete">
          <h1 className="t-h2">Projets</h1>
          <Link className="admin-bouton" href="/admin/projets/nouveau/">
            + Nouveau projet
          </Link>
        </div>
        <ol className="admin-liste">
          {projets.map((p, i) => (
            <li key={p.id}>
              <span className="admin-liste__ordre">{i + 1}</span>
              <span className="admin-liste__nom">
                <strong>{p.nom}</strong>
                <small>{p.type}</small>
              </span>
              {!p.publie && <span className="admin-badge">Brouillon</span>}
              <span className="admin-liste__actions">
                <button
                  type="button"
                  onClick={() => deplacer(i, -1)}
                  disabled={i === 0}
                  aria-label={`Monter ${p.nom}`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => deplacer(i, 1)}
                  disabled={i === projets.length - 1}
                  aria-label={`Descendre ${p.nom}`}
                >
                  ↓
                </button>
                <Link href={`/admin/projets/${p.id}/`}>Modifier</Link>
                <button type="button" onClick={() => supprimer(`/admin/projets/${p.id}`, p.nom)}>
                  Supprimer
                </button>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="admin-carte">
        <div className="admin-carte__entete">
          <h2 className="t-h2">Expériences</h2>
          <Link className="admin-bouton" href="/admin/experiences/nouveau/">
            + Nouvelle expérience
          </Link>
        </div>
        <ol className="admin-liste">
          {experiences.map((e, i) => (
            <li key={e.id}>
              <span className="admin-liste__ordre">{i + 1}</span>
              <span className="admin-liste__nom">
                <strong>{e.poste}</strong>
                <small>
                  {e.structure} · {e.periode}
                </small>
              </span>
              {!e.publie && <span className="admin-badge">Brouillon</span>}
              <span className="admin-liste__actions">
                <Link href={`/admin/experiences/${e.id}/`}>Modifier</Link>
                <button
                  type="button"
                  onClick={() => supprimer(`/admin/experiences/${e.id}`, e.poste)}
                >
                  Supprimer
                </button>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default function Admin() {
  return (
    <Garde>
      <Tableau />
    </Garde>
  );
}
