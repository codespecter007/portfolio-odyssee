import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/ibm-plex-sans/wght.css";
import "./globals.css";
import { scriptTheme } from "@/components/BasculeTheme";
import { profil } from "@/content/profil";

const titre = `${profil.nom} · Portfolio, stage en informatique`;
const description = `${profil.presentation} Je cherche un stage en ${profil.stage.domaine.toLowerCase()}, ${profil.stage.periode}.`;

export const metadata: Metadata = {
  metadataBase: new URL(profil.site),
  title: { default: titre, template: `%s · ${profil.nom}` },
  description,
  authors: [{ name: profil.nom, url: profil.site }],
  keywords: [
    "stage full-stack",
    "stage DevOps",
    "élève-ingénieur informatique",
    "3iL Limoges",
    "Java",
    "Spring Boot",
    "React",
    "Docker",
    "Kubernetes",
  ],
  // Aperçu affiché quand le lien est partagé (LinkedIn, WhatsApp, e-mail…).
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: profil.nom,
    title: titre,
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${profil.nom}, portfolio` }],
  },
  twitter: { card: "summary_large_image", title: titre, description, images: ["/og.jpg"] },
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
      <body>{children}</body>
    </html>
  );
}
