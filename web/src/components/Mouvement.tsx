"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const douce = [0.22, 1, 0.36, 1] as const;

/** Respecte « réduire les animations » du système pour tout le site. */
export function Mouvements({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Entrée discrète quand l’élément arrive à l’écran (fondu + légère montée). */
export function Apparition({
  children,
  delai = 0,
  decalage = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delai?: number;
  decalage?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: decalage }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay: delai, ease: douce }}
    >
      {children}
    </M>
  );
}

/** Texte qui apparaît mot par mot (titres du héros). */
export function TexteParMots({
  texte,
  className,
  as = "span",
  delai = 0,
}: {
  texte: string;
  className?: string;
  as?: "span" | "h1" | "p";
  delai?: number;
}) {
  const reduit = useReducedMotion();
  const M = motion[as];
  const mots = texte.split(" ");
  return (
    <M className={className} aria-label={texte}>
      {mots.map((mot, i) => (
        <motion.span
          key={`${mot}-${i}`}
          aria-hidden
          style={{ display: "inline-block", whiteSpace: "pre" }}
          initial={reduit ? false : { opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: delai + i * 0.09, ease: douce }}
        >
          {mot + (i < mots.length - 1 ? " " : "")}
        </motion.span>
      ))}
    </M>
  );
}

/** Léger flottement continu, réservé aux grands écrans. */
export function Flottement({
  children,
  amplitude = 10,
  duree = 6,
  className,
}: {
  children: ReactNode;
  amplitude?: number;
  duree?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration: duree, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
