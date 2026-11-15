import { EnTete } from "@/components/EnTete";
import { Mouvements } from "@/components/Mouvement";
import { PiedDePage } from "@/components/PiedDePage";

// Rendu à chaque visite : les données viennent de l’API (avec un cache de 5 minutes,
// vidé dès qu’une modification est faite dans l’admin).
export const dynamic = "force-dynamic";

/** Mise en page du site public : en-tête, contenu, pied de page. */
export default function LayoutSite({ children }: Readonly<{ children: React.ReactNode }>) {
  // Statistiques de visite (Umami, sans cookie), seulement si elles sont configurées.
  const umami = process.env.UMAMI_SCRIPT_URL;
  const idSite = process.env.UMAMI_WEBSITE_ID;
  return (
    <>
      {umami && idSite && <script defer src={umami} data-website-id={idSite} />}
      <a href="#contenu" className="lien-evitement">
        Aller au contenu
      </a>
      <Mouvements>
        <div className="page" id="haut">
          <EnTete />
          <main id="contenu">{children}</main>
          <PiedDePage />
        </div>
      </Mouvements>
    </>
  );
}
