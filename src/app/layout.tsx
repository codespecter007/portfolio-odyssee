import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/ibm-plex-sans/wght.css";
import "./globals.css";
import { EnTete } from "@/components/EnTete";
import { PiedDePage } from "@/components/PiedDePage";
import { Mouvements } from "@/components/Mouvement";
import { scriptTheme } from "@/components/BasculeTheme";
import { profil } from "@/content/profil";

export const metadata: Metadata = {
  title: {
    default: `${profil.nom} · Portfolio, stage en informatique`,
    template: `%s · ${profil.nom}`,
  },
  description: `${profil.presentation} Je cherche un stage.`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#26301d" },
    { media: "(prefers-color-scheme: light)", color: "#f4fafc" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" data-theme="sombre" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTheme }} />
      </head>
      <body>
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
      </body>
    </html>
  );
}
