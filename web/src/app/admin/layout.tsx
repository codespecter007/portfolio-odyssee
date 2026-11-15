import type { Metadata } from "next";
import Link from "next/link";
import "./admin.css";
import { BoutonDeconnexion } from "@/components/admin/BoutonDeconnexion";
import { BasculeTheme } from "@/components/BasculeTheme";

export const metadata: Metadata = {
  title: "Espace admin",
  robots: { index: false, follow: false },
};

export default function LayoutAdmin({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="admin">
      <header className="admin__barre">
        <Link href="/admin/" className="admin__titre">
          Espace admin
        </Link>
        <nav aria-label="Administration" className="admin__nav">
          <Link href="/admin/">Contenu</Link>
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
