"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Garde } from "@/components/admin/Garde";
import { Texte } from "@/components/admin/champs";
import { api, json } from "@/lib/admin-api";

type Exp = {
  periode: string;
  poste: string;
  structure: string;
  description: string;
  technos: string[];
  publie: boolean;
};
const vide: Exp = {
  periode: "",
  poste: "",
  structure: "",
  description: "",
  technos: [],
  publie: true,
};

function Formulaire() {
  const { id } = useParams<{ id: string }>();
  const nouveau = id === "nouveau";
  const router = useRouter();
  const [e, setE] = useState<Exp>(vide);
  const [technos, setTechnos] = useState("");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (nouveau) return;
    api<Exp>(`/admin/experiences/${id}`)
      .then((x) => {
        setE(x);
        setTechnos(x.technos.join(", "));
      })
      .catch((err) => setErreur(err.message));
  }, [id, nouveau]);

  const set =
    <K extends keyof Exp>(k: K) =>
    (v: Exp[K]) =>
      setE((x) => ({ ...x, [k]: v }));

  return (
    <form
      className="admin-carte admin-formulaire"
      onSubmit={async (ev) => {
        ev.preventDefault();
        setErreur("");
        const corps = {
          periode: e.periode,
          poste: e.poste,
          structure: e.structure,
          description: e.description,
          publie: e.publie,
          technos: technos
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        };
        try {
          await api(nouveau ? "/admin/experiences" : `/admin/experiences/${id}`, {
            method: nouveau ? "POST" : "PUT",
            body: json(corps),
          });
          router.push("/admin/");
        } catch (err) {
          setErreur((err as Error).message);
        }
      }}
    >
      <Link href="/admin/">← Retour</Link>
      <h1 className="t-h2">{nouveau ? "Nouvelle expérience" : "Modifier l’expérience"}</h1>
      <div className="grille-2">
        <Texte label="Poste" valeur={e.poste} onChange={set("poste")} requis />
        <Texte
          label="Période"
          valeur={e.periode}
          onChange={set("periode")}
          aide="Ex. : Juil. à sept. 2025"
          requis
        />
        <Texte label="Structure et lieu" valeur={e.structure} onChange={set("structure")} requis />
        <Texte
          label="Technologies"
          valeur={technos}
          onChange={setTechnos}
          aide="Séparées par des virgules"
        />
      </div>
      <Texte
        label="Description"
        valeur={e.description}
        onChange={set("description")}
        multiligne
        requis
      />
      <label className="case">
        <input
          type="checkbox"
          checked={e.publie}
          onChange={(ev) => set("publie")(ev.target.checked)}
        />{" "}
        Publié sur le site
      </label>
      {erreur && (
        <p className="admin-erreur" role="alert">
          {erreur}
        </p>
      )}
      <button className="admin-bouton">Enregistrer</button>
    </form>
  );
}

export default function PageExperience() {
  return (
    <Garde>
      <Formulaire />
    </Garde>
  );
}
