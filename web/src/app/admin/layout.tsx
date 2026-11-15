import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "./admin.css";
import { BoutonDeconnexion } from "@/components/admin/BoutonDeconnexion";
import { BasculeTheme } from "@/components/BasculeTheme";

// Lu à chaque requête : l’espace s’active dès que la base est configurée.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Espace admin",
  robots: { index: false, follow: false },
};

export default function LayoutAdmin({ children }: Readonly<{ children: React.ReactNode }>) {
  // Sans base (DATABASE_URL) ni API (API_INTERNAL_URL), l’espace admin n’existe pas.
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL && !process.env.API_INTERNAL_URL)
    notFound();
  return (
    <div className="admin">
      <header className="admin__barre">
        <Link href="/admin/" className="admin__titre">
          Espace admin
        </Link>
        <nav aria-label="Administration" className="admin__nav">
          <Link href="/admin/">Contenu</Link>
          <Link href="/admin/statistiques/">Statistiques</Link>
          <Link href="/admin/messages/">Messages</Link>
          <a href="/" target="_blank" rel="noopener">
            Voir le site ↗
          </a>
          <BasculeTheme />
          <BoutonDeconnexion />
        </nav>
      </header>
      <main className="admin__contenu">{children}</main>
    </div>
  );
}
