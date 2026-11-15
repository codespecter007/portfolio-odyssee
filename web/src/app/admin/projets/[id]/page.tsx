"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Garde } from "@/components/admin/Garde";
import { Champ, ChampImage, Lignes, Texte } from "@/components/admin/champs";
import { api, json, versSlug } from "@/lib/admin-api";
import { logos } from "@/lib/logos";
import { categories, type Etape, type Projet, type Techno } from "@/content/projets";

type Form = Omit<Projet, "annee"> & { annee: string; publie: boolean };
type Etude = Projet["etude"];

const vide: Form = {
  slug: "",
  nom: "",
  type: "",
  annee: "",
  publie: true,
  categories: [],
  description: "",
  role: "",
  technologies: [],
  visuel: { type: "vide" },
  etude: {
    accroche: "",
    reperes: [],
    contexte: "",
    contribution: { titre: "Ma contribution", intro: "", taches: [] },
    liens: { code: null, demo: null },
  },
};

const nomsLogos = Object.keys(logos);
const typesVisuel = [
  ["capture", "Capture d’écran"],
  ["flux", "Schéma en arborescence"],
  ["microservices", "Schéma microservices (bibliothèque)"],
  ["reseau", "Schéma réseau (TP Cisco)"],
  ["vide", "Aucun visuel"],
] as const;

function Formulaire() {
  const { id } = useParams<{ id: string }>();
  const nouveau = id === "nouveau";
  const router = useRouter();
  const [p, setP] = useState<Form>(vide);
  const [slugManuel, setSlugManuel] = useState(!nouveau);
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    if (nouveau) return;
    api<Form>(`/admin/projets/${id}`)
      .then((x) =>
        setP({ ...vide, ...x, annee: x.annee ?? "", etude: { ...vide.etude, ...x.etude } }),
      )
      .catch((err) => setErreur(err.message));
  }, [id, nouveau]);

  const set =
    <K extends keyof Form>(k: K) =>
    (v: Form[K]) =>
      setP((x) => ({ ...x, [k]: v }));
  const setEtude =
    <K extends keyof Etude>(k: K) =>
    (v: Etude[K]) =>
      setP((x) => ({ ...x, etude: { ...x.etude, [k]: v } }));

  const v = p.visuel;
  const e = p.etude;

  const enregistrer = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setEnvoi(true);
    setErreur("");
    // On retire les sections laissées vides pour ne pas afficher de blocs creux sur le site.
    const etude: Etude = { ...e };
    if (!etude.probleme) delete etude.probleme;
    if (etude.choix && !etude.choix.titre && !etude.choix.texte) delete etude.choix;
    if (etude.resultat && !etude.resultat.titre && etude.resultat.mesures.length === 0)
      delete etude.resultat;
    const corps = { ...p, annee: p.annee || null, etude };
    try {
      await api(nouveau ? "/admin/projets" : `/admin/projets/${id}`, {
        method: nouveau ? "POST" : "PUT",
        body: json(corps),
      });
      router.push("/admin/");
    } catch (err) {
      setErreur((err as Error).message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <form className="admin-carte admin-formulaire" onSubmit={enregistrer}>
      <Link href="/admin/">← Retour</Link>
      <h1 className="t-h2">{nouveau ? "Nouveau projet" : `Modifier : ${p.nom}`}</h1>
      {erreur && (
        <p className="admin-erreur" role="alert">
          {erreur}
        </p>
      )}

      <h2 className="t-h3">La carte</h2>
      <div className="grille-2">
        <Texte
          label="Nom"
          valeur={p.nom}
          requis
          onChange={(n) => setP((x) => ({ ...x, nom: n, slug: slugManuel ? x.slug : versSlug(n) }))}
        />
        <Texte
          label="Adresse (slug)"
          valeur={p.slug}
          requis
          aide={`/projets/${p.slug || "…"}/`}
          onChange={(s) => {
            setSlugManuel(true);
            set("slug")(versSlug(s));
          }}
        />
        <Texte
          label="Type"
          valeur={p.type}
          onChange={set("type")}
          aide="Ex. : Projet d’équipe, plateforme web"
          requis
        />
        <Texte label="Année" valeur={p.annee} onChange={set("annee")} />
      </div>
      <Texte
        label="Description courte"
        valeur={p.description}
        onChange={set("description")}
        multiligne
        requis
      />
      <Texte label="Mon rôle" valeur={p.role} onChange={set("role")} multiligne requis />

      <fieldset className="lignes">
        <legend>Catégories (filtres)</legend>
        <div className="cases">
          {categories.map((c) => (
            <label key={c} className="case">
              <input
                type="checkbox"
                checked={p.categories.includes(c)}
                onChange={(ev) =>
                  set("categories")(
                    ev.target.checked ? [...p.categories, c] : p.categories.filter((x) => x !== c),
                  )
                }
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      <Lignes<Techno>
        titre="Technologies"
        lignes={p.technologies}
        onChange={set("technologies")}
        vide={{ nom: "" }}
        rendu={(t, maj) => (
          <>
            <Texte label="Nom" valeur={t.nom} onChange={(nom) => maj({ ...t, nom })} />
            <Champ label="Logo">
              {(idc) => (
                <select
                  id={idc}
                  value={t.logo ?? ""}
                  onChange={(ev) =>
                    maj({ ...t, logo: (ev.target.value || undefined) as Techno["logo"] })
                  }
                >
                  <option value="">Sans logo</option>
                  {nomsLogos.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              )}
            </Champ>
          </>
        )}
      />

      <h2 className="t-h3">Le visuel</h2>
      <Champ label="Type de visuel">
        {(idc) => (
          <select
            id={idc}
            value={v.type}
            onChange={(ev) => {
              const t = ev.target.value as Projet["visuel"]["type"];
              set("visuel")(
                t === "capture"
                  ? { type: "capture", src: "", alt: "" }
                  : t === "flux"
                    ? { type: "flux", cadre: "", etapes: [] }
                    : ({ type: t } as Projet["visuel"]),
              );
            }}
          >
            {typesVisuel.map(([val, lib]) => (
              <option key={val} value={val}>
                {lib}
              </option>
            ))}
          </select>
        )}
      </Champ>
      {v.type === "capture" && (
        <div className="grille-2">
          <ChampImage
            label="Capture"
            url={v.src}
            onChange={(src) => set("visuel")({ ...v, src })}
          />
          <Texte
            label="Texte alternatif"
            valeur={v.alt}
            onChange={(alt) => set("visuel")({ ...v, alt })}
            aide="Décris l’image pour les lecteurs d’écran."
          />
        </div>
      )}
      {v.type === "flux" && (
        <>
          <Texte
            label="Titre du cadre"
            valeur={v.cadre}
            onChange={(cadre) => set("visuel")({ ...v, cadre })}
            aide="Ex. : application JavaFX · MVC"
          />
          <Lignes<Etape>
            titre="Étapes, de haut en bas"
            lignes={v.etapes}
            onChange={(etapes) => set("visuel")({ ...v, etapes })}
            vide={{ titre: "" }}
            rendu={(et, maj) => (
              <>
                <Texte
                  label="Titre"
                  valeur={et.titre}
                  onChange={(titre) => maj({ ...et, titre })}
                />
                <Texte
                  label="Détail"
                  valeur={et.detail}
                  onChange={(detail) => maj({ ...et, detail })}
                />
                <Texte
                  label="Branches"
                  valeur={et.blocs?.join(", ")}
                  aide="Plusieurs blocs côte à côte, séparés par des virgules (remplace le titre)"
                  onChange={(b) => {
                    const blocs = b
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean);
                    maj({ ...et, blocs: blocs.length ? blocs : undefined });
                  }}
                />
                <label className="case">
                  <input
                    type="checkbox"
                    checked={!!et.fort}
                    onChange={(ev) => maj({ ...et, fort: ev.target.checked })}
                  />{" "}
                  Bloc foncé
                </label>
              </>
            )}
          />
        </>
      )}

      <h2 className="t-h3">L’étude de cas</h2>
      <Texte
        label="Accroche"
        valeur={e.accroche}
        onChange={setEtude("accroche")}
        aide="Sous-titre, après le nom"
      />
      <Lignes<{ label: string; valeur: string }>
        titre="Repères (4 conseillés)"
        lignes={e.reperes}
        onChange={setEtude("reperes")}
        vide={{ label: "", valeur: "" }}
        rendu={(r, maj) => (
          <>
            <Texte label="Libellé" valeur={r.label} onChange={(label) => maj({ ...r, label })} />
            <Texte label="Valeur" valeur={r.valeur} onChange={(valeur) => maj({ ...r, valeur })} />
          </>
        )}
      />
      <Texte label="Le contexte" valeur={e.contexte} onChange={setEtude("contexte")} multiligne />
      <Texte
        label="Le problème (facultatif)"
        valeur={e.probleme}
        onChange={setEtude("probleme")}
        multiligne
      />
      <div className="grille-2">
        <Texte
          label="Titre de la contribution"
          valeur={e.contribution.titre}
          onChange={(titre) => setEtude("contribution")({ ...e.contribution, titre })}
        />
        <Texte
          label="Phrase d’introduction"
          valeur={e.contribution.intro}
          onChange={(intro) => setEtude("contribution")({ ...e.contribution, intro })}
        />
      </div>
      <Lignes<{ titre: string; detail: string }>
        titre="Ce que j’ai fait"
        lignes={e.contribution.taches}
        onChange={(taches) => setEtude("contribution")({ ...e.contribution, taches })}
        vide={{ titre: "", detail: "" }}
        rendu={(t, maj) => (
          <>
            <Texte label="Titre" valeur={t.titre} onChange={(titre) => maj({ ...t, titre })} />
            <Texte label="Détail" valeur={t.detail} onChange={(detail) => maj({ ...t, detail })} />
          </>
        )}
      />
      <div className="grille-2">
        <Texte
          label="Choix techniques : titre"
          valeur={e.choix?.titre}
          onChange={(titre) => setEtude("choix")({ texte: "", ...e.choix, titre })}
        />
        <Texte
          label="Choix techniques : texte"
          valeur={e.choix?.texte}
          multiligne
          onChange={(texte) => setEtude("choix")({ titre: "", ...e.choix, texte })}
        />
      </div>
      <div className="grille-2">
        <Texte
          label="Lien vers le code"
          valeur={e.liens.code}
          onChange={(code) => setEtude("liens")({ ...e.liens, code: code || null })}
          aide="https://github.com/…"
        />
        <Texte
          label="Lien vers la démo"
          valeur={e.liens.demo}
          onChange={(demo) => setEtude("liens")({ ...e.liens, demo: demo || null })}
        />
      </div>

      <label className="case">
        <input
          type="checkbox"
          checked={p.publie}
          onChange={(ev) => set("publie")(ev.target.checked)}
        />{" "}
        Publié sur le site (décocher pour garder en brouillon)
      </label>
      <div className="admin-formulaire__fin">
        <button className="admin-bouton" disabled={envoi}>
          {envoi ? "Enregistrement…" : "Enregistrer"}
        </button>
        {!nouveau && p.publie && (
          <a href={`/projets/${p.slug}/`} target="_blank" rel="noopener">
            Voir la page ↗
          </a>
        )}
      </div>
    </form>
  );
}

export default function PageProjet() {
  return (
    <Garde>
      <Formulaire />
    </Garde>
  );
}
