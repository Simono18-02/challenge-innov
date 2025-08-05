# Challenge Innov'Etudiants - ENISE

![ENISE Logo](logo.png)

Site web officiel du Challenge Innov'Etudiants organisé par l'École Centrale de Lyon ENISE. Une plateforme dédiée à la promotion de 4 challenges étudiants d'ingénierie et d'innovation.

## 🎯 À propos du projet

Le Challenge Innov'Etudiants réunit chaque année des étudiants de tous horizons autour de 4 défis d'ingénierie :

- **🤖 Challenge Robotique** (Génie Mécanique) - Robot suiveur de ligne autonome
- **🏗️ Concours Artisanat** (Génie Civil) - Construction et savoir-faire traditionnel  
- **🎨 Concours Impression 3D** (Génie Sensoriel) - Innovation en fabrication additive
- **🌍 Challenge International** - Compétition mondiale en partenariat avec Texas A&M

## 🌟 Fonctionnalités

### Interface utilisateur
- **Design moderne et responsive** - Compatible tous appareils
- **Animations fluides** - Transitions entre pages avec overlay personnalisé
- **Vidéos d'arrière-plan** - Immersion visuelle pour chaque challenge
- **Compte à rebours dynamique** - Suivi en temps réel jusqu'aux événements

### Navigation et contenu
- **Navigation intuitive** - Menu fixe avec effet de défilement
- **Pages dédiées** - Une page complète par challenge avec informations détaillées
- **Formulaires d'inscription** - Système d'inscription pour chaque événement
- **Galerie photos** - Mise en valeur des éditions précédentes
- **Espace partenaires** - Section dédiée aux entreprises

### Fonctionnalités techniques
- **Système de transitions** avancé entre les pages
- **Optimisation mobile** - Menu hamburger et adaptation responsive
- **Performance** - Chargement optimisé des ressources
- **Accessibilité** - Respect des standards web

## 📁 Structure du projet

```
challenge-innov-etudiants/
├── index.html                              # Page d'accueil principale
├── logo.png                               # Logo ENISE
├── favicon.png                            # Icône du site
├── viddeomain.mp4                         # Vidéo d'accueil
├── photo_president.png                    # Photo du président
├── transitions.js                         # Système de transitions
├── Civil_challenge/
│   └── Civil_challenge.html              # Page Concours Artisanat (GC)
├── Impression_challenge/
│   └── Impression_challenge.html         # Page Concours Impression 3D (GS)
├── International_challenge/
│   └── International_challenge.html      # Page Challenge International
├── robotics_challenge/
│   ├── robotics_challenge.html           # Page Challenge Robotique (GM)
│   ├── videmo.mp4                        # Vidéo robotique
│   └── RÈGLEMENT OFFICIEL.pdf           # Règlement du challenge
└── partenaires/
    └── partenaires.html                  # Page entreprises/partenaires
```

## 🚀 Installation et lancement

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local (optionnel pour le développement)

### Installation simple
1. **Télécharger le projet**
   ```bash
   git clone https://github.com/votre-repo/challenge-innov-etudiants.git
   cd challenge-innov-etudiants
   ```

2. **Ouvrir dans un navigateur**
   ```bash
   # Ouvrir directement le fichier
   open index.html
   # Ou double-cliquer sur index.html
   ```

### Installation avec serveur local (recommandé)
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (si npx est installé)
npx serve .

# Avec PHP
php -S localhost:8000
```

Puis ouvrir : `http://localhost:8000`

## 📱 Utilisation

### Navigation
- **Page d'accueil** : Vue d'ensemble des 4 challenges
- **Pages challenges** : Informations détaillées, inscriptions, règlements
- **Espace entreprise** : Formulaire de partenariat

### Fonctionnalités interactives
- **Comptes à rebours** : Suivi automatique jusqu'aux dates des événements
- **Formulaires** : Inscription des équipes pour chaque challenge
- **Galeries** : Zoom sur les images avec overlay
- **Transitions** : Navigation fluide entre les pages

## 🎨 Personnalisation

### Couleurs principales
```css
:root {
    --primary-red: #C41E3A;    /* Rouge ENISE */
    --tech-blue: #0066CC;      /* Bleu technologique */
    --light-bg: #FFFFFF;       /* Arrière-plan clair */
    --section-bg: #F5F5F5;     /* Sections alternées */
    --text-dark: #2C2C2C;      /* Texte principal */
    --text-light: #FFFFFF;     /* Texte sur fonds colorés */
}
```

### Modification des dates
Modifier les dates des comptes à rebours dans chaque fichier HTML :
```javascript
const countdownDate = new Date("January 31, 2026 09:00:00").getTime();
```

### Ajout de contenu
- **Images** : Remplacer les URLs Unsplash par vos propres images
- **Vidéos** : Remplacer les fichiers .mp4 par vos contenus
- **Logos partenaires** : Modifier les placeholders dans les sections partenaires

## 📧 Configuration des formulaires

### Intégration Formspree (recommandé)
1. Créer un compte sur [Formspree.io](https://formspree.io)
2. Remplacer dans `partenaires.html` :
   ```html
   <form action="https://formspree.io/f/YOUR_UNIQUE_CODE" method="POST">
   ```

### Autres solutions
- **Netlify Forms** : Pour hébergement Netlify
- **Google Forms** : Redirection vers formulaire Google
- **Backend personnalisé** : API REST pour traitement côté serveur

## 🌐 Déploiement

### Hébergement statique (recommandé)
- **Netlify** : Déploiement automatique depuis Git
- **Vercel** : Intégration continue avec GitHub
- **GitHub Pages** : Hébergement gratuit pour projets publics
- **Firebase Hosting** : Solution Google avec CDN global

### Hébergement traditionnel
- Upload des fichiers via FTP sur votre serveur web
- Vérifier les permissions de lecture des fichiers
- Configurer les redirections si nécessaire

## 🛠️ Technologies utilisées

### Frontend
- **HTML5** - Structure sémantique
- **CSS3** - Styles avancés et animations
- **JavaScript ES6+** - Interactivité et transitions
- **Google Fonts** - Typographie Poppins
- **Font Awesome** - Iconographie

### Fonctionnalités CSS
- **Flexbox & Grid** - Mise en page moderne
- **CSS Variables** - Thème cohérent
- **Media Queries** - Design responsive
- **Animations CSS** - Transitions fluides
- **Backdrop-filter** - Effets de flou modernes

### JavaScript
- **DOM Manipulation** - Interactivité native
- **Event Listeners** - Gestion des interactions
- **Async/Await** - Gestion asynchrone (transitions)
- **ES6 Classes** - Code structuré (transitions.js)

## 📱 Compatibilité

### Navigateurs supportés
- **Chrome** 60+
- **Firefox** 55+  
- **Safari** 12+
- **Edge** 79+
- **Mobile Safari** iOS 12+
- **Chrome Mobile** Android 7+

### Résolutions
- **Desktop** : 1920x1080 et plus
- **Laptop** : 1366x768 à 1920x1080
- **Tablet** : 768x1024 (iPad) et équivalents
- **Mobile** : 375x667 à 414x896 (iPhone et Android)

## 🤝 Contribution

### Développement local
1. Forker le repository
2. Créer une branche feature
3. Tester vos modifications
4. Soumettre une Pull Request

### Guidelines
- Respecter la structure CSS existante
- Tester sur mobile et desktop
- Optimiser les images et vidéos
- Commenter les modifications importantes

## 📞 Support et contact

### Contacts ENISE
- **Email** : innovetudiants@gmail.com
- **Adresse** : 58 Rue Jean Parot, 42023 Saint-Étienne
- **Site** : [enise.fr](https://enise.fr)

### Équipe organisatrice
- **Président** : Clément Frêne (Challenge International)
- **GM** : Simon Adam (Challenge Robotique)  
- **GS** : Manon Arias (Concours Impression 3D)
- **GC** : Mathias Aupecle (Concours Artisanat)

## 📄 Licence

© 2024 ENISE - École Centrale de Lyon. Tous droits réservés.

Ce projet est destiné à l'usage de l'École Centrale de Lyon ENISE pour la promotion des challenges étudiants.

---

**Développé avec ❤️ pour l'innovation étudiante**
