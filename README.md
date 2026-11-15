# Portfolio d’Odyssée KOM FOADEM

Site statique en Next.js et TypeScript, tiré de la maquette Figma « Portfolio Odyssée · Refonte visuelle ».
Deux thèmes : sombre (olive) et clair (bleu ciel), avec une bascule dans la navigation.

## Lancer le site

Il faut Node.js 20 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Mise en ligne (CI/CD)

Le site est publié sur GitHub Pages par GitHub Actions (`.github/workflows/deploy.yml`) :
à chaque `git push` sur `main`, le pipeline installe les dépendances, lance ESLint,
construit le site statique (`out/`) et le déploie.

Adresse : https://codespecter007.github.io

Pour construire à la main : `npm run build` crée le dossier `out/`.

## Remplacer le contenu provisoire

Tout le texte est dans `src/content/`. Chaque valeur provisoire est marquée `À REMPLACER`.

| Fichier | Contenu |
|---|---|
| `src/content/profil.ts` | présentation, stage recherché, photo, e-mail, liens GitHub et LinkedIn, QR code |
| `src/content/projets.ts` | projets et études de cas (textes, mesures, liens) |
| `src/content/parcours.ts` | chapitres du parcours, expériences, compétences |

Fichiers à déposer dans `public/` :

- `public/cv.pdf` : ton CV ;
- `public/photos/…` : ta photo détourée et, si tu veux, les photos souvenirs ;
- l’image du QR code, une fois l’adresse du site connue ;
- une vraie capture de Mellifica, à passer au composant `Tablette` (`capture="/captures/mellifica.webp"`).

Une valeur `null` affiche un emplacement vide (photo, QR code) ou un lien `#` (GitHub, LinkedIn).
Les filtres de la page Projets n’apparaissent que pour les catégories qui ont au moins un projet.

## Organisation

- `src/app/` : les pages (accueil, projets, étude de cas, parcours, contact) et `globals.css`
  (couleurs des deux thèmes, typographie, composants) ;
- `src/components/` : en-tête et bascule de thème, pied de page, boutons, cartes, schémas, animations ;
- `public/3d/` : rendus 3D en WebP, une version par thème.

## Outils

- `npm run lint` : ESLint ;
- `npm run format` : Prettier ;
- `npm run test:visual` : Playwright prend des captures de chaque page, desktop et mobile,
  dans les deux thèmes (dans `tests/captures/`), et vérifie la bascule et les filtres.
  La première fois : `npx playwright install chromium`.

## Accessibilité et animations

- thème choisi mémorisé, sinon préférence du système ;
- contrastes vérifiés dans les deux thèmes (niveau AA au minimum) ;
- lien d’évitement, focus visible, menu mobile fermable avec Échap ;
- animations coupées si « réduire les animations » est activé dans le système.
