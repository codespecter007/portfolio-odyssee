# Mettre le portfolio en ligne

Ce guide part de zéro : un serveur gratuit chez Oracle Cloud, un domaine offert par le
GitHub Student Developer Pack, puis le branchement du pipeline. Compter environ une heure.

## 1. Le serveur Oracle Cloud (Always Free)

1. Sur cloud.oracle.com : **Compute → Instances → Create instance**.
2. Image : **Ubuntu 24.04**. Forme : **VM.Standard.A1.Flex** (Ampere, ARM), 2 OCPU et 12 Go de RAM.
   Ça reste dans l’offre gratuite.
3. **Add SSH keys** : colle ta clé publique (`ssh-keygen -t ed25519` sur ton PC si tu n’en as pas,
   puis le contenu de `~/.ssh/id_ed25519.pub`).
4. Note l’**adresse IP publique** de l’instance.
5. Ouvrir les ports web : **Networking → Virtual cloud networks → ton VCN → Security Lists →
   Default Security List → Add Ingress Rules** :
   - source `0.0.0.0/0`, TCP, port de destination `80`
   - source `0.0.0.0/0`, TCP, port de destination `443`
   - source `0.0.0.0/0`, UDP, port de destination `443`

Connecte-toi puis prépare la machine :

```bash
ssh ubuntu@<IP>

# Les images Ubuntu d’Oracle bloquent aussi les ports dans iptables : on les ouvre.
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p udp --dport 443 -j ACCEPT
sudo netfilter-persistent save

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
exit            # puis se reconnecter pour que le groupe docker soit pris en compte
```

## 2. Le nom de domaine

1. Fais valider le **GitHub Student Developer Pack** (education.github.com/pack).
2. Dans l’offre Namecheap du Pack, réserve un domaine `.me` (par exemple `komfoadem.me`).
3. Dans Namecheap : **Domain List → Manage → Advanced DNS**, ajoute quatre enregistrements **A**
   vers l’IP du serveur :

   | Hôte | Valeur |
   |---|---|
   | `@` | IP du serveur |
   | `www` | IP du serveur |
   | `grafana` | IP du serveur |
   | `stats` | IP du serveur |

La propagation prend de quelques minutes à une heure. Vérifier : `ping komfoadem.me`.

## 3. Les secrets du serveur

```bash
ssh ubuntu@<IP>
mkdir -p ~/portfolio/infra && cd ~/portfolio/infra
nano .env
```

Copie le contenu de `infra/.env.example` et remplis-le. Pour chaque secret :
`openssl rand -hex 32`. Pour le mot de passe admin, sur ton PC :

```bash
cd api && npm install && npm run hash-password -- "ton mot de passe admin"
```

et colle le résultat **entre apostrophes** : `ADMIN_PASSWORD_HASH='$2b$12$...'`.

Ne mets jamais ce fichier `.env` dans Git.

## 4. Brancher le pipeline GitHub

Sur ton PC, crée une clé réservée au déploiement et autorise-la sur le serveur :

```bash
ssh-keygen -t ed25519 -f deploy_portfolio -N ""
ssh-copy-id -i deploy_portfolio.pub ubuntu@<IP>
```

Dans le dépôt GitHub, **Settings → Secrets and variables → Actions** :

- onglet **Secrets** :
  - `SSH_HOST` : l’IP du serveur
  - `SSH_USER` : `ubuntu`
  - `SSH_KEY` : le contenu du fichier `deploy_portfolio` (la clé **privée**)
- onglet **Variables** :
  - `DOMAINE` : ton domaine, par exemple `komfoadem.me`

Dès que `DOMAINE` existe, chaque push sur `main` déploie automatiquement.

**Images Docker** : après le premier passage du pipeline, va dans ton profil GitHub → **Packages**,
ouvre `portfolio-web` puis `portfolio-api`, **Package settings → Change visibility → Public**.
Le serveur peut alors les télécharger sans identifiant.

Relance le pipeline (**Actions → CI/CD → Run workflow**). Au premier démarrage, Caddy obtient
les certificats HTTPS tout seul.

## 5. Après le premier déploiement

- **Site** : `https://<domaine>`. L’API remplit la base avec le contenu actuel au premier lancement.
- **Admin** : `https://<domaine>/admin`, avec `ADMIN_EMAIL` et ton mot de passe.
- **Grafana** : `https://grafana.<domaine>`, utilisateur `admin`, mot de passe `GRAFANA_ADMIN_PASSWORD`.
  Le tableau de bord **Portfolio · vue d’ensemble** est déjà installé : CPU, mémoire, disque,
  requêtes, temps de réponse, erreurs, consommation de chaque conteneur.
- **Statistiques de visite** : `https://stats.<domaine>`, identifiants par défaut `admin` / `umami`.
  **Change ce mot de passe tout de suite**, ajoute ton site, copie son identifiant dans
  `UMAMI_WEBSITE_ID` du `.env`, puis `docker compose up -d web`.

## Sauvegarde de la base

À ajouter une fois dans la crontab du serveur (`crontab -e`) : une sauvegarde par nuit, gardée 14 jours.

```
0 3 * * * cd ~/portfolio/infra && docker compose exec -T db pg_dump -U portfolio portfolio | gzip > ~/sauvegardes/portfolio-$(date +\%F).sql.gz && find ~/sauvegardes -mtime +14 -delete
```

(Créer le dossier avant : `mkdir -p ~/sauvegardes`.)

## En cas de problème

```bash
cd ~/portfolio/infra
docker compose ps                 # état des conteneurs
docker compose logs -f api        # journaux de l’API (ou web, caddy, db…)
docker compose up -d              # redémarrer ce qui est arrêté
```
