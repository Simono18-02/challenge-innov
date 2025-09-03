# Serveur Flask - Challenge Innov'Etudiants

## 🚀 Installation et Configuration

### 1. Prérequis
- Python 3.8+
- PostgreSQL 12+ installé et en cours d'exécution
- pip (gestionnaire de paquets Python)

### 2. Installation des dépendances
```bash
pip install -r requirements.txt
```

### 3. Configuration PostgreSQL

#### Créer la base de données :
```sql
-- Se connecter à PostgreSQL
sudo -u postgres psql

-- Créer la base de données
CREATE DATABASE challenge_innov;

-- Créer un utilisateur (optionnel)
CREATE USER challenge_user WITH PASSWORD 'votre_mot_de_passe';

-- Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE challenge_innov TO challenge_user;

-- Quitter
\q
```

#### Configurer le fichier `.env` :
```env
# Configuration de la base de données PostgreSQL
DATABASE_URL=postgresql://challenge_user:votre_mot_de_passe@localhost:5432/challenge_innov
FLASK_SECRET_KEY=votre-clé-secrète-ici
FLASK_ENV=development
FLASK_DEBUG=True

# Configuration email (optionnel pour notifications)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### 4. Lancement du serveur
```bash
python app.py
```

Le serveur se lancera sur `http://localhost:5000`

## 📡 API Endpoints

### Inscription d'équipes
- **URL** : `/api/register-team`
- **Méthode** : `POST`
- **Content-Type** : `application/json`

**Corps de la requête :**
```json
{
  "challenge_type": "robotics|civil|impression|international",
  "team_name": "Nom de l'équipe",
  "school": "École/Université",
  "leader_name": "Nom du chef d'équipe",
  "email": "contact@example.com",
  "country": "France" // Optionnel, requis pour international
}
```

### Demande de partenariat
- **URL** : `/api/partnership`
- **Méthode** : `POST`
- **Content-Type** : `application/json`

**Corps de la requête :**
```json
{
  "company_name": "Nom de l'entreprise",
  "contact_name": "Nom du contact",
  "email": "contact@entreprise.com",
  "phone": "0123456789", // Optionnel
  "partnership_type": "sponsor|materiel|expertise|communication",
  "budget": "< 1000€", // Optionnel
  "message": "Message personnalisé" // Optionnel
}
```

### Newsletter
- **URL** : `/api/newsletter`
- **Méthode** : `POST`
- **Content-Type** : `application/json`

**Corps de la requête :**
```json
{
  "email": "user@example.com"
}
```

### Statistiques
- **URL** : `/api/stats`
- **Méthode** : `GET`
- **Réponse** :
```json
{
  "teams": 15,
  "partnerships": 5,
  "newsletter": 42,
  "challenges": {
    "robotics": 8,
    "civil": 4,
    "impression": 2,
    "international": 1
  }
}
```

## 🛡️ Base de Données

### Tables créées automatiquement :

#### `team_registrations`
- `id` (INTEGER, PRIMARY KEY)
- `challenge_type` (VARCHAR(50), NOT NULL)
- `team_name` (VARCHAR(100), NOT NULL)
- `school` (VARCHAR(200), NOT NULL)
- `leader_name` (VARCHAR(100), NOT NULL)
- `email` (VARCHAR(120), NOT NULL)
- `country` (VARCHAR(100), NULLABLE)
- `created_at` (DATETIME)

#### `partnership_requests`
- `id` (INTEGER, PRIMARY KEY)
- `company_name` (VARCHAR(200), NOT NULL)
- `contact_name` (VARCHAR(100), NOT NULL)
- `email` (VARCHAR(120), NOT NULL)
- `phone` (VARCHAR(20), NULLABLE)
- `partnership_type` (VARCHAR(50), NOT NULL)
- `budget` (VARCHAR(50), NULLABLE)
- `message` (TEXT, NULLABLE)
- `created_at` (DATETIME)

#### `newsletter_subscriptions`
- `id` (INTEGER, PRIMARY KEY)
- `email` (VARCHAR(120), UNIQUE, NOT NULL)
- `created_at` (DATETIME)
- `active` (BOOLEAN, DEFAULT TRUE)

## 📊 Dashboard Admin

Accédez au dashboard administrateur sur : `http://localhost:5000/admin`

**Fonctionnalités :**
- Statistiques en temps réel
- Liste des inscriptions récentes
- Compteurs par challenge
- Vue d'ensemble des partenariats et abonnements newsletter

## 🔧 Scripts JavaScript

Le fichier `assets/js/forms.js` gère automatiquement :
- ✅ Soumission des formulaires via AJAX
- ✅ Validation côté client
- ✅ Messages d'erreur et de succès
- ✅ États de chargement des boutons
- ✅ Détection automatique du type de challenge

## 🚨 Gestion des erreurs

- **400** : Données manquantes ou invalides
- **409** : Équipe déjà inscrite
- **500** : Erreur serveur interne

Toutes les erreurs sont loggées et retournent un JSON avec le message d'erreur.

## 🔐 Sécurité

- Validation des emails côté serveur
- Nettoyage des données d'entrée (sanitization)
- Protection contre les doublons
- Headers CORS configurés
- Gestion des erreurs sans exposition d'informations sensibles

## 📝 Logs

Le serveur affiche :
- ✅ Confirmation d'initialisation de la base de données
- ❌ Erreurs de connexion à la base
- 📊 Requêtes API reçues
- 🚨 Erreurs lors du traitement

## 🔄 Développement

Pour le développement, utilisez :
```bash
FLASK_DEBUG=True python app.py
```

Cela active :
- Rechargement automatique
- Messages d'erreur détaillés
- Mode debug Flask