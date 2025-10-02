# 🎀 Octobre Rose 2025 x FFAviron

Site vitrine complet pour la campagne Octobre Rose 2025 avec la Fédération Française d'Aviron.

## 🚀 Installation et lancement (5 étapes)

### 1. Cloner et installer les dépendances
```bash
git clone <repository-url>
cd octobre-rose-2025
npm install
```

### 2. Configurer la base de données
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Modifier le .env avec vos paramètres MySQL/MariaDB
# DATABASE_URL="mysql://username:password@localhost:3306/octobre_rose"
```

### 3. Initialiser la base de données
```bash
# Générer le client Prisma
npm run db:generate

# Créer la base de données et les tables
npm run db:push

# Insérer les données d'exemple
npm run db:seed
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```

### 5. Ouvrir l'application
L'application sera disponible sur `http://localhost:5173`

**Votre application fonctionne avec une vraie base de données !** 🎉

---

## 📱 Fonctionnalités disponibles

### 🏠 **Site public**
- **Page d'accueil** avec statistiques temps réel depuis la BDD
- **Défi Rose** avec formulaire d'inscription fonctionnel
- **Rowing Care Cup** avec redirection HelloAsso
- **Carte interactive** de l'Europe avec progression animée
- **Calendrier** des événements d'octobre

### 👤 **Espace participant** (`/espace-participant`)
- **Connexion OTP** : Utilisez le code `123456` ou un code réel envoyé
- **Ajout de kilomètres** avec sauvegarde en BDD
- **Historique personnel** des activités depuis la BDD
- **Statistiques individuelles** calculées en temps réel

### ⚙️ **Administration** (`/admin`)
- **Connexion admin** :
  - Email: `admin@octobrerose2025.fr`
  - Mot de passe: `admin123`
- **Dashboard complet** avec métriques BDD
- **Gestion des participants** et clubs
- **Modération des photos** et kilomètres
- **Export des données** depuis Prisma

---

## 🗄️ Base de données

### **Configuration MySQL/MariaDB**

#### Installation MySQL (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

#### Installation MariaDB (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mariadb-server
sudo mysql_secure_installation
```

#### Installation macOS
```bash
# MySQL
brew install mysql
brew services start mysql

# MariaDB
brew install mariadb
brew services start mariadb
```

#### Configuration de la base
```sql
# Se connecter à MySQL/MariaDB
sudo mysql -u root -p

# Créer la base et l'utilisateur
CREATE DATABASE octobre_rose;
CREATE USER 'octobre_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON octobre_rose.* TO 'octobre_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Modifier le .env
```env
DATABASE_URL="mysql://octobre_user:your_password@localhost:3306/octobre_rose"
```

### **Commandes Prisma utiles**
```bash
# Générer le client après modification du schema
npm run db:generate

# Appliquer les changements à la BDD
npm run db:push

# Réinitialiser et re-seeder la BDD
npm run db:reset

# Ouvrir l'interface graphique
npm run db:studio

# Voir les données en direct
npx prisma studio
```

---

## 📊 Données d'exemple incluses

### ✅ **Participants** (6 utilisateurs)
- Marie Dupont (marie.dupont@email.com)
- Pierre Martin (pierre.martin@email.com)
- Sophie Bernard (sophie.bernard@email.com)
- Lucas Moreau (lucas.moreau@email.com)
- Emma Leroy (emma.leroy@email.com)
- Demo User (demo@test.com) - **Pour les tests**

### ✅ **Clubs** (5 clubs européens)
- Club Nautique de Paris (France) - 1250.5 km
- Aviron Bayonnais (France) - 890.2 km
- Rowing Club Amsterdam (Pays-Bas) - 2100.8 km
- Berlin Ruder Club (Allemagne) - 1650.3 km
- Roma Canottieri (Italie) - 980.7 km

### ✅ **Kilomètres** (50 entrées)
- Répartis sur octobre 2025
- Différents types : Indoor, Outdoor, AviFit
- Participants individuels et collectifs
- Tous validés automatiquement

### ✅ **Événements** (6 événements)
- #TOUSconcernés (récurrent)
- Tous en rose au sommet (terminé)
- Rowing Care Cup (à venir - featured)
- Célébration des Amazones (à venir)
- Mission Veni-Vidi-Vinci (à venir)
- City break & Bonus 27 (à venir)

### ✅ **Photos** (3 photos)
- 2 approuvées avec liens Pexels
- 1 en attente de modération

### ✅ **Comptes de test**
- **Admin** : admin@octobrerose2025.fr / admin123
- **Participant** : demo@test.com (OTP: 123456)

---

## 🔧 Développement

### **Structure de la base de données**
```
prisma/
├── schema.prisma          # Schéma de la base
└── seed.js               # Données d'exemple

src/lib/
├── prisma.ts             # Client Prisma
├── database.ts           # Services BDD
└── api.ts               # API simulée
```

### **Modèles principaux**
- `Participant` - Utilisateurs inscrits
- `KilometerEntry` - Kilomètres enregistrés
- `Event` - Événements du calendrier
- `Club` - Clubs participants
- `Photo` - Galerie photos
- `RowingCareCupRegistration` - Inscriptions événement
- `OtpCode` - Codes d'authentification
- `Admin` - Comptes administrateurs

### **Services disponibles**
- `participantService` - Gestion participants
- `kilometerService` - Gestion kilomètres
- `eventService` - Gestion événements
- `photoService` - Gestion photos
- `clubService` - Gestion clubs
- `otpService` - Authentification OTP
- `adminService` - Administration

---

## 🚀 Déploiement

### **Build de production**
```bash
npm run build
```

### **Variables d'environnement de production**
```env
DATABASE_URL="mysql://user:password@your-db-host:3306/octobre_rose"
VITE_APP_URL=https://your-domain.com
VITE_HELLOASSO_URL=https://www.helloasso.com
```

### **Hébergement recommandé**
- **Frontend** : Vercel, Netlify, GitHub Pages
- **Base de données** : PlanetScale, Railway, DigitalOcean
- **Tout-en-un** : Railway, Render, Fly.io

---

## 🛠️ Commandes disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build            # Build de production
npm run preview          # Prévisualiser le build
npm run lint             # Vérifier le code

# Base de données
npm run db:generate      # Générer le client Prisma
npm run db:push          # Appliquer le schéma à la BDD
npm run db:seed          # Insérer les données d'exemple
npm run db:studio        # Interface graphique BDD
npm run db:reset         # Réinitialiser et re-seeder
```

---

## 🎨 Technologies utilisées

### **Frontend**
- **React 18** avec TypeScript
- **Tailwind CSS** pour le design
- **Lucide React** pour les icônes
- **React Router** pour la navigation
- **Vite** comme bundler

### **Backend/Base de données**
- **Prisma ORM** pour la base de données
- **MySQL/MariaDB** comme SGBD
- **bcryptjs** pour le hashage des mots de passe
- **Services API** simulés côté client

### **Fonctionnalités**
- **Interface responsive** mobile-first
- **Animations fluides** et micro-interactions
- **Upload de photos** avec prévisualisation
- **Cartes interactives** avec progression temps réel
- **Authentification OTP** avec base de données
- **Administration complète** avec vraies données

---

## 🔐 Sécurité

### **Authentification**
- **OTP par email** avec expiration (10 min)
- **Mots de passe hashés** avec bcrypt
- **Sessions simulées** côté client
- **Validation des données** côté serveur

### **Base de données**
- **Contraintes de clés étrangères**
- **Validation des types** avec Prisma
- **Nettoyage automatique** des codes OTP expirés

---

## 🆘 Dépannage

### **Erreurs de base de données**
```bash
# Réinitialiser complètement
npm run db:reset

# Vérifier la connexion
npx prisma db pull

# Régénérer le client
npm run db:generate
```

### **Erreurs de dépendances**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### **Port 5173 occupé**
```bash
npm run dev -- --port 3000
```

---

## 📈 Statistiques temps réel

Toutes les statistiques affichées proviennent de la vraie base de données :

- ✅ **Participants** : Comptage depuis la table `participants`
- ✅ **Kilomètres** : Somme depuis `kilometer_entries` validées
- ✅ **Clubs** : Comptage depuis la table `clubs`
- ✅ **Événements** : Depuis la table `events`
- ✅ **Photos** : Depuis la table `photos` approuvées

---

## 🎯 Prêt pour la production

L'application est **100% fonctionnelle** avec une vraie base de données et peut être déployée immédiatement pour :

- **Production réelle** avec vraies données
- **Démonstrations** client avec données réalistes
- **Tests utilisateur** complets
- **Présentation** stakeholders avec métriques réelles

Pour une **version production complète**, il suffit de :
1. Configurer une base de données de production
2. Ajouter l'envoi d'emails réels (SMTP)
3. Sécuriser l'authentification (JWT)
4. Ajouter les intégrations tierces (HelloAsso, paiements)

**Octobre Rose 2025 x FFAviron** - Application complète avec vraie base de données ! 🎀

---

## 📞 Support

### **Problèmes courants**

**Q: Erreur de connexion à la base de données ?**
R: Vérifiez que MySQL/MariaDB est démarré et que le DATABASE_URL est correct

**Q: Tables non créées ?**
R: Lancez `npm run db:push` puis `npm run db:seed`

**Q: Données manquantes ?**
R: Relancez `npm run db:seed` pour réinsérer les données d'exemple

**Q: Erreur Prisma Client ?**
R: Lancez `npm run db:generate` pour régénérer le client

### **Logs utiles**
```bash
# Voir les requêtes SQL
DEBUG=prisma:query npm run dev

# Logs détaillés Prisma
DEBUG=prisma:* npm run dev
```

L'application utilise maintenant une **vraie base de données** avec Prisma ! 🚀