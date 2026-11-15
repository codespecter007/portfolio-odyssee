"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, json } from "@/lib/admin-api";

export default function Connexion() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  return (
    <form
      className="admin-carte admin-connexion"
      onSubmit={async (e) => {
        e.preventDefault();
        setEnvoi(true);
        setErreur("");
        try {
          await api("/auth/connexion", { method: "POST", body: json({ email, motDePasse }) });
          router.replace("/admin/");
        } catch (err) {
          setErreur((err as Error).message);
        } finally {
          setEnvoi(false);
        }
      }}
    >
      <h1 className="t-h2">Connexion</h1>
      <div className="champ">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="champ">
        <label htmlFor="mdp">Mot de passe</label>
        <input
          id="mdp"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />
      </div>
      {erreur && (
        <p className="admin-erreur" role="alert">
          {erreur}
        </p>
      )}
      <button className="admin-bouton" disabled={envoi}>
        {envoi ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
