# Mettre le portfolio en ligne

Ce guide part de zéro : un serveur Azure (offre étudiante), un domaine offert par le
GitHub Student Developer Pack, puis le branchement du pipeline. Compter environ une heure.

## 1. Le serveur (Azure for Students)

1. Active l’offre sur azure.microsoft.com/free/students avec ton e-mail 3iL : 100 $ de crédit,
   sans carte bancaire.
2. Dans le portail Azure : **Machines virtuelles → Créer → Machine virtuelle Azure**.
   - Groupe de ressources : nouveau, `portfolio`
   - Nom : `portfolio`, région : **France Central**
   - Image : **Ubuntu Server 24.04 LTS, x64**
   - Taille : **B1s** (1 vCPU, 1 Go). Elle fait partie des services gratuits 12 mois de l’offre
     étudiante (750 heures par mois, soit une machine allumée en permanence). Vérifie la mention
     « éligible aux services gratuits » à côté de la taille. La pile est réglée pour tenir dans 1 Go
     avec la mémoire d’échange ci-dessous.
   - Disque : **SSD Premium P6 (64 Go)**, lui aussi dans les services gratuits
   - Authentification : **clé publique SSH**, utilisateur `azureuser`, source :
     *Utiliser une clé publique existante*, puis coller ta clé publique
   - Ports entrants publics : **SSH (22), HTTP (80), HTTPS (443)**
3. **Vérifier + créer**, puis note l’**adresse IP publique** sur la page de la machine.
4. Pour que l’IP ne change jamais : **Adresse IP publique → Configuration → Statique**.

Connecte-toi puis installe Docker :

```bash
ssh azureuser@<IP>
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker azureuser

# Mémoire d’échange de 2 Go (utile surtout sur une petite machine)
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

exit            # puis se reconnecter pour que le groupe docker soit pris en compte
```

Les images Docker sont construites pour amd64 et arm64 : le même pipeline fonctionne
chez Azure, Oracle, DigitalOcean ou Hetzner.

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
ssh azureuser@<IP>
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
ssh-copy-id -i deploy_portfolio.pub azureuser@<IP>
```

Dans le dépôt GitHub, **Settings → Secrets and variables → Actions** :

- onglet **Secrets** :
  - `SSH_HOST` : l’IP du serveur
  - `SSH_USER` : `azureuser`
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
