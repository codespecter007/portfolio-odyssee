import type { SVGProps } from "react";
import { logos, type LogoName } from "@/lib/logos";

type P = SVGProps<SVGSVGElement> & { taille?: number };

const base = ({ taille = 16, ...props }: P) => ({
  width: taille,
  height: taille,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export const Fleche = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const FlecheDiag = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const FlecheHaut = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);
export const Telecharger = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
);
export const Mail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
export const Menu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const Fermer = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Copier = (p: P) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
  </svg>
);
export const Coche = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12 5 5 9-10" />
  </svg>
);
export const Personne = (p: P) => (
  <svg {...base(p)} strokeWidth={1.4}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
export const Lune = (p: P) => (
  <svg {...base(p)}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
export const Soleil = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 1.5V4M12 20v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M1.5 12H4M20 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
  </svg>
);
export const QrVide = (p: P) => (
  <svg {...base(p)} strokeWidth={1.6}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3" />
  </svg>
);

/** Logo officiel d’une technologie (Simple Icons). */
export function Logo({ nom, taille = 16 }: { nom: LogoName; taille?: number }) {
  // Un logo inconnu (saisi depuis l’admin) ne doit pas casser la page.
  const logo = logos[nom] as (typeof logos)[LogoName] | undefined;
  if (!logo) return null;
  const { path, color } = logo;
  return (
    <svg width={taille} height={taille} viewBox="0 0 24 24" aria-hidden focusable={false}>
      <path d={path} fill={color} />
    </svg>
  );
}
