"use client";

import { useState } from "react";
import { Coche, Fleche } from "@/components/icones";
import { ignore, refCourant } from "@/lib/mesure";

type Etat =
  { type: "repos" } | { type: "envoi" } | { type: "ok" } | { type: "erreur"; message: string };

/** Formulaire de contact : le message arrive dans l’espace admin. */
export function FormulaireContact() {
  const [etat, setEtat] = useState<Etat>({ type: "repos" });

  if (etat.type === "ok")
    return (
      <div className="formulaire-contact formulaire-contact--merci" role="status">
        <Coche taille={32} />
        <p className="t-h2">Merci, votre message est bien arrivé.</p>
        <p className="secondaire">Je vous réponds par e-mail, en général sous 48 heures.</p>
      </div>
    );

  return (
    <form
      className="formulaire-contact"
      onSubmit={async (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.currentTarget));
        setEtat({ type: "envoi" });
        try {
          const r = await fetch("/api/contact/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ ...d, ref: ignore() ? null : refCourant() }),
          });
          if (!r.ok)
            throw new Error((await r.json().catch(() => ({}))).message ?? "Envoi impossible");
          setEtat({ type: "ok" });
        } catch (err) {
          setEtat({ type: "erreur", message: (err as Error).message });
        }
      }}
    >
      <h2 className="t-h2">Ou laissez-moi un message</h2>
      <div className="formulaire-contact__grille">
        <label>
          <span>Nom</span>
          <input name="nom" required maxLength={120} autoComplete="name" />
        </label>
        <label>
          <span>E-mail</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" />
        </label>
        <label className="formulaire-contact__large">
          <span>
            Entreprise <small>(facultatif)</small>
          </span>
          <input name="entreprise" maxLength={120} autoComplete="organization" />
        </label>
        <label className="formulaire-contact__large">
          <span>Message</span>
          <textarea name="message" required maxLength={4000} rows={4} />
        </label>
        {/* Champ piège pour les robots, invisible pour les personnes. */}
        <label className="formulaire-contact__piege" aria-hidden="true">
          Site web
          <input name="site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {etat.type === "erreur" && (
        <p className="formulaire-contact__erreur" role="alert">
          {etat.message}
        </p>
      )}
      <div className="formulaire-contact__fin">
        <p className="t-petit secondaire">
          Votre nom et votre adresse servent uniquement à vous répondre.
        </p>
        <button className="bouton" disabled={etat.type === "envoi"}>
          <span>{etat.type === "envoi" ? "Envoi…" : "Envoyer"}</span>
          <span className="bouton__icone">
            <Fleche />
          </span>
        </button>
      </div>
    </form>
  );
}
