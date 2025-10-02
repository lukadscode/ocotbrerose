# 📧 Configuration du système d'emails

## 🚀 Configuration rapide

### 1. Avec Gmail (Recommandé)

#### Étape 1 : Activer l'authentification à 2 facteurs
1. Aller dans votre compte Google
2. Sécurité → Authentification à 2 facteurs
3. Activer l'A2F

#### Étape 2 : Générer un mot de passe d'application
1. Dans Sécurité → Authentification à 2 facteurs
2. Cliquer sur "Mots de passe des applications"
3. Sélectionner "Autre (nom personnalisé)"
4. Taper "Octobre Rose 2025"
5. Copier le mot de passe généré (16 caractères)

#### Étape 3 : Configurer le .env
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=le-mot-de-passe-genere-16-caracteres
```

### 2. Avec d'autres fournisseurs

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=votre-email@outlook.com
SMTP_PASS=votre-mot-de-passe
```

#### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=votre-email@yahoo.com
SMTP_PASS=votre-mot-de-passe-app
```

#### OVH
```env
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_USER=votre-email@votre-domaine.com
SMTP_PASS=votre-mot-de-passe
```

## 📨 Emails envoyés automatiquement

### 1. Code OTP (Connexion)
**Quand :** L'utilisateur demande un code pour se connecter
**Template :** Design rose avec code à 6 chiffres
**Expiration :** 10 minutes

### 2. Confirmation inscription Défi
**Quand :** Après inscription au Défi ROSE
**Contenu :** 
- Récapitulatif des informations
- Lien vers l'espace participant
- Instructions pour ajouter des kilomètres

### 3. Confirmation Rowing Care Cup
**Quand :** Après inscription à l'événement
**Contenu :**
- Détails des catégories sélectionnées
- Informations de paiement
- Date et modalités de l'événement

## 🔧 Comment ça fonctionne dans le code

### Service d'envoi
```typescript
// src/lib/email.ts
export const sendOTPEmail = async (email: string, otpCode: string) => {
  const mailOptions = {
    from: `"Octobre Rose 2025" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Votre code d\'accès - Octobre Rose 2025',
    html: `<!-- Template HTML -->`
  };
  
  return transporter.sendMail(mailOptions);
};
```

### Appel dans l'API
```typescript
// src/services/api.ts
export const authService = {
  async sendOTP(email: string) {
    // 1. Générer le code OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 2. Sauvegarder en base
    await prisma.otpCode.create({
      data: { email, code: otpCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
    });
    
    // 3. Envoyer l'email
    await sendOTPEmail(email, otpCode);
  }
};
```

## 🧪 Test des emails

### Vérifier la configuration
```bash
# Lancer le projet
npm run dev

# Tester l'envoi d'OTP
# Aller sur /espace-participant
# Entrer votre email
# Vérifier la réception
```

### Logs de debug
Les erreurs d'envoi apparaissent dans la console :
```bash
npm run dev
# Si erreur SMTP, vous verrez :
# ❌ Erreur configuration email: [détails]
# ✅ Configuration email OK (si tout va bien)
```

## 🚨 Problèmes courants

### Gmail : "Connexion moins sécurisée"
**Solution :** Utiliser un mot de passe d'application (pas votre mot de passe principal)

### Emails en spam
**Solution :** 
- Vérifier l'adresse expéditeur
- Ajouter des en-têtes SPF/DKIM (pour la production)

### Timeout de connexion
**Solution :**
- Vérifier SMTP_HOST et SMTP_PORT
- Tester avec telnet : `telnet smtp.gmail.com 587`

### Mot de passe refusé
**Solution :**
- Vérifier que l'A2F est activée
- Régénérer un nouveau mot de passe d'application

## 📊 Monitoring

### Logs d'envoi
Tous les envois sont loggés :
```typescript
console.log(`📧 Email OTP envoyé à ${email}`);
console.log(`✅ Email inscription envoyé à ${participant.email}`);
```

### Statistiques
Vous pouvez ajouter un compteur d'emails envoyés :
```sql
-- Ajouter une table de logs (optionnel)
CREATE TABLE email_logs (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  type ENUM('otp', 'registration', 'rowing_care_cup') NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success BOOLEAN DEFAULT TRUE
);
```

## 🔒 Sécurité

### Variables d'environnement
- ❌ Ne jamais commiter le fichier `.env`
- ✅ Utiliser `.env.example` comme template
- ✅ Utiliser des mots de passe d'application

### Rate limiting (recommandé pour la production)
```typescript
// Limiter les envois d'OTP
const lastOTP = await prisma.otpCode.findFirst({
  where: { email, createdAt: { gt: new Date(Date.now() - 60000) } }
});

if (lastOTP) {
  throw new Error('Veuillez attendre 1 minute avant de redemander un code');
}
```

## 🎨 Personnalisation des templates

Les templates HTML sont dans `src/lib/email.ts`. Vous pouvez :
- Modifier les couleurs
- Ajouter votre logo
- Changer le texte
- Ajouter des liens personnalisés

Exemple de personnalisation :
```html
<div style="background: linear-gradient(135deg, #ec4899, #f43f5e);">
  <img src="https://votre-domaine.com/logo.png" alt="Logo" />
  <h1>Votre titre personnalisé</h1>
</div>
```