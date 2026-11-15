# Portfolio d’Odyssée KOM FOADEM

Portfolio auto-hébergé : un site Next.js, une API NestJS avec PostgreSQL, un espace
d’administration pour ajouter projets et expériences, et une supervision avec Prometheus et Grafana.
Tout tourne dans Docker, et chaque push sur `main` passe par un pipeline de tests puis de déploiement.

```
                        Internet
                           │  HTTPS (Caddy, Let’s Encrypt)
      ┌────────────────────┼─────────────────────┬──────────────────┐
  domaine/              domaine/api            grafana.domaine    stats.domaine
      │                    │                      │                  │
  Next.js (web) ──────► NestJS (api)          Grafana            Umami
      ▲   revalidation     │                      │                  │
      └────────────────────┤                  Prometheus ◄── node-exporter, cAdvisor,
                       PostgreSQL ◄───────────────┘              Caddy, API (/metrics)
```

## Organisation du dépôt

| Dossier | Contenu |
|---|---|
| `web/` | Site Next.js (pages publiques et espace `/admin`), tests Playwright |
| `api/` | API NestJS + TypeORM : projets, expériences, connexion admin, envoi d’images, métriques |
| `infra/` | `docker-compose.yml` de production, Caddy, Prometheus, tableaux de bord Grafana |
| `.github/workflows/` | Pipeline CI/CD |

## Le pipeline (push → tests → publication)

1. **Tests** : lint, formatage, build et 40 tests Playwright pour le site ; vérification des types,
   tests unitaires et tests de bout en bout (sur un vrai PostgreSQL) pour l’API.
2. **Images** : construction des images Docker `amd64` et `arm64`, publiées sur GitHub Container Registry.
3. **Test de fumée** : la base, l’API et le site démarrent ensemble et doivent répondre.
4. **Déploiement** : copie de la configuration sur le serveur par SSH, mise à jour des conteneurs,
   puis vérification que le site en ligne répond.

Le déploiement ne s’active que lorsque le serveur est configuré (voir le guide).

## Développement local

Il faut Node.js 22 et un PostgreSQL local.

```bash
# API
cd api
cp .env.example .env              # puis remplir les valeurs
npm install
npm run hash-password -- "un mot de passe d’au moins 12 caractères"   # → ADMIN_PASSWORD_HASH
npm run build && npm run seed && npm start      # http://localhost:4000

# Site (dans un autre terminal)
cd web
npm install
API_INTERNAL_URL=http://localhost:4000 REVALIDATE_SECRET=<même valeur que l’API> npm run dev
```

Le site est sur http://localhost:3000 et l’admin sur http://localhost:3000/admin.
Sans `API_INTERNAL_URL`, le site fonctionne seul avec le contenu de `web/src/content/`.

## Espace admin

- `/admin` : liste des projets (ordre, brouillon ou publié) et des expériences.
- Création et modification des projets : carte, technologies et logos, visuel (capture envoyée ou
  schéma en arborescence), étude de cas complète, liens.
- Les modifications apparaissent tout de suite sur le site : l’API prévient Next.js, qui vide son cache.
- Un seul compte, défini par `ADMIN_EMAIL` et `ADMIN_PASSWORD_HASH` ; session dans un cookie httpOnly,
  5 tentatives de connexion par minute au maximum.

## Mise en production

**Hébergement actuel : Vercel (gratuit).** Le site du dossier `web/` est publié à chaque push sur
`main`, avec HTTPS et un nom de domaine. Sans API configurée, il utilise le contenu de
`web/src/content/` et l’espace `/admin` est désactivé.

Réglages du projet Vercel : *Root Directory* `web`, framework Next.js, aucune variable à définir.

**Plus tard : auto-hébergement complet** (API, admin, Grafana) avec Docker sur un serveur :
voir [`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md), puis définir la variable de dépôt
`DEPLOIEMENT_DOCKER=oui` pour activer les étapes Docker du pipeline.
