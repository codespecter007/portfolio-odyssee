import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  icone?: ReactNode;
  variante?: "principal" | "secondaire" | "lien" | "fonce";
  externe?: boolean;
  telecharger?: boolean;
  className?: string;
};

/** Bouton-lien de la maquette : libellé + pastille d’icône. */
export function Bouton({
  href,
  children,
  icone,
  variante = "principal",
  externe,
  telecharger,
  className = "",
}: Props) {
  const classes =
    `bouton${variante !== "principal" ? ` bouton--${variante}` : ""} ${className}`.trim();
  const contenu = (
    <>
      <span>{children}</span>
      {icone && <span className="bouton__icone">{icone}</span>}
    </>
  );

  const interne = href.startsWith("/") && !telecharger && !href.endsWith(".pdf");
  if (interne) {
    return (
      <Link href={href} className={classes}>
        {contenu}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={classes}
      {...(externe ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(telecharger ? { download: "" } : {})}
    >
      {contenu}
    </a>
  );
}
