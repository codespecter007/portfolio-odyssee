"use client";

import { useEffect, useState } from "react";
import { Garde } from "@/components/admin/Garde";
import { api, json } from "@/lib/admin-api";

type Message = {
  id: string;
  cree: string;
  nom: string;
  email: string;
  entreprise: string | null;
  message: string;
  ref: string | null;
  lu: boolean;
};

function Liste() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api<Message[]>("/admin/messages")
      .then(setMessages)
      .catch((e) => setErreur(e.message));
  }, []);

  const marquer = async (m: Message, lu: boolean) => {
    await api(`/admin/messages/${m.id}`, { method: "PUT", body: json({ lu }) });
    setMessages((l) => l!.map((x) => (x.id === m.id ? { ...x, lu } : x)));
  };
  const supprimer = async (m: Message) => {
    if (!window.confirm(`Supprimer le message de ${m.nom} ? Cette action est définitive.`)) return;
    await api(`/admin/messages/${m.id}`, { method: "DELETE" });
    setMessages((l) => l!.filter((x) => x.id !== m.id));
  };

  return (
    <section className="admin-carte">
      <h1 className="t-h2">Messages</h1>
      {erreur && <p className="admin-erreur">{erreur}</p>}
      {!messages ? (
        <p className="admin-chargement">Chargement…</p>
      ) : messages.length === 0 ? (
        <p className="secondaire">
          Aucun message pour l’instant. Ils arrivent ici depuis le formulaire de la page Contact.
        </p>
      ) : (
        <ul className="messages">
          {messages.map((m) => (
            <li key={m.id} className={m.lu ? "messages__lu" : undefined}>
              <div className="messages__entete">
                <strong>{m.nom}</strong>
                {m.entreprise && <span>{m.entreprise}</span>}
                {!m.lu && <span className="admin-badge">Nouveau</span>}
                {m.ref && <span className="admin-badge admin-badge--leger">via {m.ref}</span>}
                <time dateTime={m.cree}>
                  {new Date(m.cree).toLocaleString("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Europe/Paris",
                  })}
                </time>
              </div>
              <p className="messages__texte">{m.message}</p>
              <div className="admin-liste__actions">
                <a
                  className="admin-bouton"
                  href={`mailto:${m.email}?subject=${encodeURIComponent("Re : votre message sur mon portfolio")}`}
                  onClick={() => !m.lu && marquer(m, true)}
                >
                  Répondre à {m.email}
                </a>
                <button type="button" onClick={() => marquer(m, !m.lu)}>
                  {m.lu ? "Marquer non lu" : "Marquer lu"}
                </button>
                <button type="button" onClick={() => supprimer(m)}>
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function Messages() {
  return (
    <Garde>
      <Liste />
    </Garde>
  );
}
