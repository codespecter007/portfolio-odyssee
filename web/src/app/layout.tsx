import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/ibm-plex-sans/wght.css";
import "./globals.css";
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
      <body>{children}</body>
    </html>
  );
}
