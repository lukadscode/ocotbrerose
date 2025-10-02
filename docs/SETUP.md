# Configuration du projet Octobre Rose 2025

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone <repository-url>
cd octobre-rose-2025
npm install
```

### 2. Configuration Supabase (Recommandé)

#### Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Récupérer l'URL et la clé API

#### Configuration des variables d'environnement
```bash
cp .env.example .env
```

Remplir le fichier `.env` :
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Déployer les migrations
```bash
# Si vous avez Supabase CLI installé
supabase db push

# Sinon, copier le contenu de supabase/migrations/create_tables.sql
# dans l'éditeur SQL de Supabase Dashboard
```

#### Déployer les Edge Functions
```bash
# Déployer les fonctions
supabase functions deploy send-otp
supabase functions deploy verify-otp
supabase functions deploy send-registration-email
```

### 3. Configuration Email (Resend)

1. Créer un compte sur [resend.com](https://resend.com)
2. Générer une clé API
3. Ajouter la clé dans les secrets Supabase :
```bash
supabase secrets set RESEND_API_KEY=your-resend-api-key
```

### 4. Configuration alternative MariaDB

Si vous préférez utiliser MariaDB au lieu de Supabase :

#### Installation MariaDB
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mariadb-server

# macOS
brew install mariadb

# Windows
# Télécharger depuis https://mariadb.org/download/
```

#### Configuration de la base
```sql
CREATE DATABASE octobre_rose;
CREATE USER 'octobre_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON octobre_rose.* TO 'octobre_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Variables d'environnement pour MariaDB
```env
DATABASE_URL=mysql://octobre_user:your_password@localhost:3306/octobre_rose
DB_HOST=localhost
DB_PORT=3306
DB_USER=octobre_user
DB_PASSWORD=your_password
DB_NAME=octobre_rose
```

#### Installation des dépendances MariaDB
```bash
npm install mysql2 prisma @prisma/client
```

## 🏃‍♂️ Lancement du projet

### Mode développement
```bash
npm run dev
```

### Build de production
```bash
npm run build
npm run preview
```

## 📧 Configuration Email

### Avec Resend (Recommandé)
1. Créer un compte Resend
2. Vérifier votre domaine
3. Générer une clé API
4. Configurer dans Supabase secrets

### Avec SMTP classique
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🗄️ Structure de la base de données

### Tables principales
- `participants` - Informations des participants
- `kilometer_entries` - Enregistrement des kilomètres
- `rowing_care_cup_registrations` - Inscriptions événement
- `clubs` - Informations des clubs
- `events` - Calendrier des événements
- `photos` - Galerie photos
- `otp_codes` - Codes d'authentification

### Fonctionnalités
- ✅ Inscription participants
- ✅ Authentification par OTP
- ✅ Enregistrement kilomètres
- ✅ Upload photos
- ✅ Inscription Rowing Care Cup
- ✅ Emails automatiques
- ✅ Statistiques temps réel
- ✅ Carte interactive
- ✅ Calendrier événements

## 🔐 Sécurité

### Row Level Security (RLS)
- Activé sur toutes les tables
- Politiques d'accès granulaires
- Authentification par OTP sécurisée

### Validation des données
- Validation côté client et serveur
- Sanitisation des entrées
- Protection contre les injections SQL

## 📱 Fonctionnalités

### Pour les participants
- Inscription au défi
- Espace personnel sécurisé
- Ajout de kilomètres
- Upload de photos
- Suivi des statistiques
- Inscription aux événements

### Pour les administrateurs
- Dashboard complet
- Gestion des participants
- Validation des kilomètres
- Statistiques avancées
- Export des données

## 🚀 Déploiement

### Avec Vercel (Recommandé)
```bash
npm install -g vercel
vercel
```

### Avec Netlify
```bash
npm run build
# Déployer le dossier dist/
```

### Variables d'environnement de production
```env
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_APP_URL=https://your-domain.com
VITE_HELLOASSO_URL=https://www.helloasso.com
```

## 🆘 Support

### Problèmes courants

#### Erreur de connexion Supabase
- Vérifier les variables d'environnement
- Vérifier les politiques RLS
- Vérifier les permissions

#### Emails non reçus
- Vérifier la configuration Resend
- Vérifier les spams
- Vérifier les logs Supabase

#### Upload de photos
- Vérifier les permissions du bucket
- Vérifier la taille des fichiers
- Vérifier les formats acceptés

### Logs et debugging
```bash
# Logs Supabase
supabase logs

# Logs de développement
npm run dev -- --debug
```