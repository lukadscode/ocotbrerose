# 🎀 Octobre Rose 2025 x FFAviron

Application web complète pour la campagne Octobre Rose 2025 avec la Fédération Française d'Aviron.

**Stack technique** : React + TypeScript + Tailwind CSS + Prisma + MariaDB

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation sur VPS Debian 12](#installation-sur-vps-debian-12)
3. [Configuration Apache2](#configuration-apache2)
4. [Configuration MariaDB](#configuration-mariadb)
5. [Installation de l'application](#installation-de-lapplication)
6. [Configuration PM2](#configuration-pm2)
7. [Configuration HTTPS avec Let's Encrypt](#configuration-https)
8. [Fonctionnalités](#fonctionnalités)
9. [Administration](#administration)
10. [Maintenance](#maintenance)
11. [Dépannage](#dépannage)

---

## 🔧 Prérequis

- VPS Debian 12 avec accès root
- Nom de domaine pointant vers votre VPS
- Au moins 2 Go de RAM
- 20 Go d'espace disque

---

## 🚀 Installation sur VPS Debian 12

### 1. Mise à jour du système

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installation de Node.js 20.x

```bash
# Installer curl si nécessaire
sudo apt install -y curl

# Ajouter le dépôt NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Installer Node.js
sudo apt install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

### 3. Installation de MariaDB

```bash
# Installer MariaDB
sudo apt install -y mariadb-server mariadb-client

# Démarrer MariaDB
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Sécuriser l'installation
sudo mysql_secure_installation
```

Répondez aux questions :
- **Enter current password for root**: Appuyez sur Entrée (pas de mot de passe par défaut)
- **Switch to unix_socket authentication**: N
- **Change the root password**: Y → Définissez un mot de passe fort
- **Remove anonymous users**: Y
- **Disallow root login remotely**: Y
- **Remove test database**: Y
- **Reload privilege tables**: Y

### 4. Installation d'Apache2

```bash
# Installer Apache2
sudo apt install -y apache2

# Activer les modules nécessaires
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod ssl
sudo a2enmod headers

# Démarrer Apache
sudo systemctl start apache2
sudo systemctl enable apache2
```

### 5. Installation de PM2

```bash
# Installer PM2 globalement
sudo npm install -g pm2

# Configurer PM2 pour démarrer au boot
pm2 startup
# Exécuter la commande affichée (ressemble à: sudo env PATH=$PATH:/usr/bin...)
```

---

## 🗄️ Configuration MariaDB

### 1. Créer la base de données

```bash
# Se connecter à MariaDB
sudo mysql -u root -p
```

### 2. Exécuter les commandes SQL

```sql
-- Créer la base de données
CREATE DATABASE octobre_rose CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Créer l'utilisateur
CREATE USER 'octobre_user'@'localhost' IDENTIFIED BY 'VotreMotDePasseSecurise123!';

-- Donner tous les droits
GRANT ALL PRIVILEGES ON octobre_rose.* TO 'octobre_user'@'localhost';

-- Appliquer les changements
FLUSH PRIVILEGES;

-- Vérifier
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'octobre_user';

-- Quitter
EXIT;
```

### 3. Tester la connexion

```bash
mysql -u octobre_user -p octobre_rose
# Entrer le mot de passe et vérifier que ça fonctionne
EXIT;
```

---

## 📦 Installation de l'application

### 1. Créer le répertoire

```bash
# Créer le répertoire de l'application
sudo mkdir -p /var/www/octobre-rose
sudo chown $USER:$USER /var/www/octobre-rose
cd /var/www/octobre-rose
```

### 2. Cloner ou uploader le projet

**Option A - Via Git :**
```bash
git clone <votre-repo-url> .
```

**Option B - Via SCP (depuis votre machine locale) :**
```bash
scp -r /chemin/local/du/projet/* user@votre-ip:/var/www/octobre-rose/
```

### 3. Installer les dépendances

```bash
cd /var/www/octobre-rose
npm install
```

### 4. Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier
nano .env
```

**Contenu du fichier .env :**

```env
# Base de données MariaDB
DATABASE_URL="mysql://octobre_user:VotreMotDePasseSecurise123!@localhost:3306/octobre_rose"

# Configuration Email SMTP (Gmail exemple)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application

# JWT Secret (générer une clé aléatoire sécurisée)
JWT_SECRET=VotreCleSuperSecreteAleatoire123456789

# Application
VITE_APP_URL=https://votre-domaine.com
VITE_HELLOASSO_URL=https://www.helloasso.com

# Upload de fichiers
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

**💡 Conseil sécurité** : Générez une clé JWT sécurisée :
```bash
openssl rand -base64 32
```

### 5. Initialiser la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables
npm run db:push

# Insérer les données d'exemple
npm run db:seed
```

### 6. Build de l'application

```bash
npm run build
```

---

## 🔄 Configuration PM2

### 1. Vérifier le fichier de configuration

Le fichier `ecosystem.config.cjs` doit exister à la racine :

```javascript
module.exports = {
  apps: [{
    name: 'octobre-rose',
    script: 'server.js',
    cwd: '/var/www/octobre-rose',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### 2. Démarrer l'application avec PM2

```bash
cd /var/www/octobre-rose

# Démarrer l'application
pm2 start ecosystem.config.cjs

# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs octobre-rose

# Sauvegarder la configuration PM2
pm2 save
```

### 3. Commandes PM2 utiles

```bash
# Redémarrer l'application
pm2 restart octobre-rose

# Arrêter l'application
pm2 stop octobre-rose

# Voir les logs en temps réel
pm2 logs octobre-rose --lines 100

# Supprimer du PM2
pm2 delete octobre-rose

# Monitorer les ressources
pm2 monit
```

---

## 🌐 Configuration Apache2

### 1. Créer le Virtual Host

```bash
sudo nano /etc/apache2/sites-available/octobre-rose.conf
```

**Contenu du fichier :**

```apache
<VirtualHost *:80>
    ServerName votre-domaine.com
    ServerAlias www.votre-domaine.com
    ServerAdmin admin@votre-domaine.com

    # Logs
    ErrorLog ${APACHE_LOG_DIR}/octobre-rose-error.log
    CustomLog ${APACHE_LOG_DIR}/octobre-rose-access.log combined

    # Reverse proxy vers l'application Node.js (PM2)
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    # Headers de sécurité
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
</VirtualHost>
```

### 2. Activer le site

```bash
# Activer le site
sudo a2ensite octobre-rose.conf

# Désactiver le site par défaut (optionnel)
sudo a2dissite 000-default.conf

# Tester la configuration
sudo apache2ctl configtest

# Recharger Apache
sudo systemctl reload apache2
```

---

## 🔒 Configuration HTTPS avec Let's Encrypt

### 1. Installer Certbot

```bash
sudo apt install -y certbot python3-certbot-apache
```

### 2. Obtenir un certificat SSL

```bash
# Obtenir et installer automatiquement le certificat
sudo certbot --apache -d votre-domaine.com -d www.votre-domaine.com
```

Suivez les instructions :
- Entrez votre email
- Acceptez les conditions
- Choisissez de rediriger HTTP vers HTTPS (recommandé)

### 3. Vérifier le renouvellement automatique

```bash
# Tester le renouvellement
sudo certbot renew --dry-run

# Le renouvellement automatique est configuré via cron
```

### 4. Configuration HTTPS finale

Certbot crée automatiquement un fichier `/etc/apache2/sites-available/octobre-rose-le-ssl.conf`. Vérifiez-le :

```bash
sudo nano /etc/apache2/sites-available/octobre-rose-le-ssl.conf
```

---

## ✨ Fonctionnalités

### 🏠 Site Public
- **Page d'accueil** avec statistiques en temps réel
- **Défi Rose** avec formulaire d'inscription
- **Rowing Care Cup** avec gestion des inscriptions
- **Carte interactive** de l'Europe avec progression
- **Calendrier** des événements d'octobre
- **Galerie photos** modérée

### 👤 Espace Participant (`/espace-participant`)
- Connexion sécurisée par OTP email
- Ajout de kilomètres avec validation admin
- Historique personnel des activités
- Statistiques individuelles
- Upload de photos

### ⚙️ Administration (`/admin`)

Accès par défaut :
- **Email** : `admin@octobrerose2025.fr`
- **Mot de passe** : `admin123`

**⚠️ IMPORTANT** : Changez ces identifiants immédiatement en production !

#### Dashboard complet :
- **Participants** : Modification, suppression, recherche
- **Kilomètres** : Validation, modification, filtres
- **Événements** : Création, modification, gestion
- **Rowing Care Cup** : Gestion des inscriptions et paiements
- **Photos** : Approbation/rejet, modération
- **Clubs** : Gestion complète avec statistiques
- **CMS** : Modification de tous les textes et valeurs du site

---

## 🔐 Sécurité en Production

### 1. Changer le mot de passe admin

```bash
# Ouvrir Prisma Studio
npm run db:studio
```

Dans l'interface web (http://localhost:5555) :
1. Aller dans la table `Admin`
2. Modifier l'email et le mot de passe
3. Le mot de passe sera automatiquement hashé lors de la prochaine connexion

### 2. Configurer le Firewall

```bash
# Installer UFW
sudo apt install -y ufw

# Autoriser SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activer le firewall
sudo ufw enable

# Vérifier le statut
sudo ufw status
```

### 3. Sécuriser MariaDB

```bash
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

Vérifier que `bind-address = 127.0.0.1` (écoute uniquement en local)

### 4. Permissions des fichiers

```bash
# Permissions correctes
sudo chown -R $USER:www-data /var/www/octobre-rose
sudo chmod -R 755 /var/www/octobre-rose

# Protéger le fichier .env
chmod 600 /var/www/octobre-rose/.env
```

---

## 🔄 Mise à jour de l'application

### Procédure de mise à jour

```bash
# 1. Naviguer dans le répertoire
cd /var/www/octobre-rose

# 2. Sauvegarder la base de données
mysqldump -u octobre_user -p octobre_rose > backup_$(date +%Y%m%d).sql

# 3. Récupérer les nouvelles versions (git ou upload)
git pull
# OU
# Uploader les nouveaux fichiers via SCP

# 4. Installer les nouvelles dépendances
npm install

# 5. Appliquer les migrations de base de données
npm run db:push

# 6. Rebuild l'application
npm run build

# 7. Redémarrer l'application
pm2 restart octobre-rose

# 8. Vérifier les logs
pm2 logs octobre-rose --lines 50
```

---

## 🛠️ Maintenance

### Sauvegardes automatiques

Créer un script de sauvegarde :

```bash
sudo nano /usr/local/bin/backup-octobre-rose.sh
```

**Contenu du script :**

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/octobre-rose"
DATE=$(date +%Y%m%d_%H%M%S)

# Créer le répertoire de backup
mkdir -p $BACKUP_DIR

# Backup de la base de données
mysqldump -u octobre_user -pVotreMotDePasseSecurise123! octobre_rose | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup des fichiers uploadés
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/octobre-rose/uploads

# Garder seulement les 7 derniers jours
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

**Rendre le script exécutable :**

```bash
sudo chmod +x /usr/local/bin/backup-octobre-rose.sh
```

**Ajouter une tâche cron (backup quotidien à 3h du matin) :**

```bash
sudo crontab -e
```

Ajouter :
```
0 3 * * * /usr/local/bin/backup-octobre-rose.sh >> /var/log/octobre-rose-backup.log 2>&1
```

### Monitoring des logs

```bash
# Logs Apache
sudo tail -f /var/log/apache2/octobre-rose-error.log
sudo tail -f /var/log/apache2/octobre-rose-access.log

# Logs PM2
pm2 logs octobre-rose

# Logs système
sudo journalctl -u apache2 -f
sudo journalctl -u mariadb -f
```

### Nettoyage de la base de données

```bash
# Supprimer les codes OTP expirés (tous les jours)
mysql -u octobre_user -p octobre_rose -e "DELETE FROM otp_codes WHERE expires_at < NOW();"
```

Ajouter au cron :
```bash
sudo crontab -e
```
```
0 2 * * * mysql -u octobre_user -pVotreMotDePasseSecurise123! octobre_rose -e "DELETE FROM otp_codes WHERE expires_at < NOW();" >> /var/log/octobre-rose-cleanup.log 2>&1
```

---

## 🐛 Dépannage

### L'application ne démarre pas

```bash
# Vérifier les logs PM2
pm2 logs octobre-rose --lines 100

# Vérifier que le port 3000 n'est pas utilisé
sudo lsof -i :3000

# Redémarrer l'application
pm2 restart octobre-rose
```

### Erreur de connexion à la base de données

```bash
# Vérifier que MariaDB fonctionne
sudo systemctl status mariadb

# Tester la connexion
mysql -u octobre_user -p octobre_rose

# Vérifier le fichier .env
cat /var/www/octobre-rose/.env | grep DATABASE_URL
```

### Apache ne redirige pas correctement

```bash
# Vérifier la configuration
sudo apache2ctl configtest

# Vérifier que les modules sont actifs
sudo apache2ctl -M | grep proxy

# Redémarrer Apache
sudo systemctl restart apache2
```

### Erreur 502 Bad Gateway

```bash
# L'application PM2 ne répond pas
pm2 status
pm2 restart octobre-rose

# Vérifier les logs
pm2 logs octobre-rose
```

### SSL ne fonctionne pas

```bash
# Renouveler le certificat
sudo certbot renew

# Vérifier la configuration SSL
sudo apache2ctl -t -D DUMP_VHOSTS
```

### Espace disque plein

```bash
# Vérifier l'espace disque
df -h

# Nettoyer les logs
sudo journalctl --vacuum-time=7d

# Nettoyer les anciens backups
sudo find /var/backups/octobre-rose -mtime +30 -delete

# Nettoyer npm cache
npm cache clean --force
```

---

## 📊 Commandes utiles

### Prisma / Base de données

```bash
# Générer le client après modification du schema
npm run db:generate

# Appliquer les changements à la BDD
npm run db:push

# Ouvrir l'interface graphique
npm run db:studio

# Réinitialiser la BDD avec les données d'exemple
npm run db:reset
```

### PM2

```bash
# Lister les processus
pm2 list

# Logs en temps réel
pm2 logs octobre-rose

# Monitorer les ressources
pm2 monit

# Redémarrer après modification
pm2 restart octobre-rose

# Sauvegarder la configuration
pm2 save
```

### Apache

```bash
# Tester la configuration
sudo apache2ctl configtest

# Recharger sans downtime
sudo systemctl reload apache2

# Redémarrer complètement
sudo systemctl restart apache2

# Voir les sites actifs
sudo apache2ctl -S
```

### MariaDB

```bash
# Se connecter
mysql -u octobre_user -p octobre_rose

# Backup manuel
mysqldump -u octobre_user -p octobre_rose > backup.sql

# Restaurer un backup
mysql -u octobre_user -p octobre_rose < backup.sql

# Voir les tables
mysql -u octobre_user -p octobre_rose -e "SHOW TABLES;"
```

---

## 📈 Optimisations de performance

### 1. Activer la compression Apache

```bash
sudo a2enmod deflate
sudo systemctl reload apache2
```

### 2. Configurer le cache Apache

```bash
sudo a2enmod expires
sudo a2enmod headers
```

Ajouter dans votre VirtualHost :
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 3. Optimiser MariaDB

```bash
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

Ajouter/modifier :
```ini
[mysqld]
innodb_buffer_pool_size = 512M
innodb_log_file_size = 128M
query_cache_size = 64M
```

Redémarrer MariaDB :
```bash
sudo systemctl restart mariadb
```

---

## 🎯 Checklist de déploiement

- [ ] VPS Debian 12 configuré
- [ ] Node.js 20.x installé
- [ ] MariaDB installé et sécurisé
- [ ] Apache2 installé avec modules proxy
- [ ] PM2 installé globalement
- [ ] Base de données créée et utilisateur configuré
- [ ] Application clonée dans /var/www/octobre-rose
- [ ] Fichier .env configuré avec les bons paramètres
- [ ] `npm install` exécuté
- [ ] `npm run db:push` exécuté
- [ ] `npm run db:seed` exécuté
- [ ] `npm run build` exécuté
- [ ] Application démarrée avec PM2
- [ ] Virtual Host Apache configuré
- [ ] Site activé avec a2ensite
- [ ] Certificat SSL Let's Encrypt installé
- [ ] Firewall UFW configuré
- [ ] Mot de passe admin changé
- [ ] Backups automatiques configurés
- [ ] Tests de l'application effectués

---

## 📞 Support

### Vérifier que tout fonctionne

1. **Application** : https://votre-domaine.com
2. **Espace participant** : https://votre-domaine.com/espace-participant
3. **Administration** : https://votre-domaine.com/admin
4. **Prisma Studio** : `npm run db:studio` puis http://localhost:5555

### Problèmes courants

| Problème | Solution |
|----------|----------|
| Port 3000 déjà utilisé | `pm2 restart octobre-rose` |
| Erreur de connexion BDD | Vérifier DATABASE_URL dans .env |
| 502 Bad Gateway | Vérifier que PM2 tourne : `pm2 status` |
| SSL invalide | `sudo certbot renew` |
| Application lente | Vérifier les ressources : `pm2 monit` |

---

## 🎉 Application prête pour la production !

Votre application **Octobre Rose 2025 x FFAviron** est maintenant déployée et opérationnelle sur votre VPS Debian 12 avec :

✅ Apache2 comme reverse proxy
✅ MariaDB comme base de données
✅ PM2 pour la gestion des processus
✅ HTTPS avec Let's Encrypt
✅ Backups automatiques
✅ Monitoring et logs

**Bon défi solidaire ! 🎀🚣‍♀️**
