"use client";

import { useId, useState, type ReactNode } from "react";
import { envoyerImage } from "@/lib/admin-api";

export function Champ({
  label,
  aide,
  children,
}: {
  label: string;
  aide?: string;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div className="champ">
      <label htmlFor={id}>{label}</label>
      {children(id)}
      {aide && <small>{aide}</small>}
    </div>
  );
}

export function Texte({
  label,
  valeur,
  onChange,
  aide,
  multiligne,
  requis,
}: {
  label: string;
  valeur: string | null | undefined;
  onChange: (v: string) => void;
  aide?: string;
  multiligne?: boolean;
  requis?: boolean;
}) {
  return (
    <Champ label={label} aide={aide}>
      {(id) =>
        multiligne ? (
          <textarea
            id={id}
            rows={3}
            value={valeur ?? ""}
            required={requis}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            id={id}
            value={valeur ?? ""}
            required={requis}
            onChange={(e) => onChange(e.target.value)}
          />
        )
      }
    </Champ>
  );
}

/** Liste de lignes éditables (ajout, suppression, déplacement). */
export function Lignes<T>({
  titre,
  lignes,
  onChange,
  vide,
  rendu,
}: {
  titre: string;
  lignes: T[];
  onChange: (l: T[]) => void;
  vide: T;
  rendu: (l: T, maj: (v: T) => void) => ReactNode;
}) {
  const maj = (i: number, v: T) => onChange(lignes.map((x, j) => (j === i ? v : x)));
  const deplacer = (i: number, d: number) => {
    const n = [...lignes];
    const [x] = n.splice(i, 1);
    n.splice(i + d, 0, x);
    onChange(n);
  };
  return (
    <fieldset className="lignes">
      <legend>{titre}</legend>
      {lignes.map((l, i) => (
        <div key={i} className="ligne">
          <div className="ligne__champs">{rendu(l, (v) => maj(i, v))}</div>
          <div className="ligne__actions">
            <button
              type="button"
              onClick={() => deplacer(i, -1)}
              disabled={i === 0}
              aria-label="Monter"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => deplacer(i, 1)}
              disabled={i === lignes.length - 1}
              aria-label="Descendre"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => onChange(lignes.filter((_, j) => j !== i))}
              aria-label="Supprimer la ligne"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="admin-bouton admin-bouton--leger"
        onClick={() => onChange([...lignes, vide])}
      >
        + Ajouter
      </button>
    </fieldset>
  );
}

/** Envoi d’une image, avec aperçu. */
export function ChampImage({
  label,
  url,
  onChange,
}: {
  label: string;
  url: string | undefined;
  onChange: (url: string) => void;
}) {
  const [etat, setEtat] = useState("");
  return (
    <Champ label={label} aide="PNG, JPEG ou WebP, 5 Mo maximum.">
      {(id) => (
        <div className="image">
          {url && (
            // eslint-disable-next-line @next/next/no-img-element -- aperçu dans l’admin
            <img src={url} alt="" />
          )}
          <input
            id={id}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setEtat("Envoi…");
              try {
                onChange(await envoyerImage(f));
                setEtat("Image envoyée");
              } catch (err) {
                setEtat((err as Error).message);
              }
            }}
          />
          {etat && <small role="status">{etat}</small>}
        </div>
      )}
    </Champ>
  );
}
