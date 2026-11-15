import { profil, lienOuAncre } from "@/content/profil";

/** Pied de page uni : aucun dégradé ni halo. */
export function PiedDePage() {
  return (
    <footer className="pied">
      <div className="pied__haut">
        <p className="pied__signature">{profil.nom}</p>
        <ul className="pied__liens" role="list" aria-label="Liens utiles">
          <li>
            <a href={profil.liens.cv} download="">
              Mon CV
            </a>
          </li>
          <li>
            <a href={lienOuAncre(profil.liens.github)}>GitHub</a>
          </li>
          <li>
            <a href={lienOuAncre(profil.liens.linkedin)}>LinkedIn</a>
          </li>
          <li>
            <a href={`mailto:${profil.liens.email}`}>E-mail</a>
          </li>
        </ul>
      </div>
      <div className="pied__bas">
        <p>Conçu et développé par {profil.nom}</p>
        <a href="#haut">Retour en haut ↑</a>
      </div>
    </footer>
  );
}
