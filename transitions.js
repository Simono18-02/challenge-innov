// ===== FICHIER: transitions.js =====
// À ajouter dans un fichier séparé et inclure dans toutes vos pages

class ENISEPageTransitions {
    constructor() {
        this.overlay = null;
        this.isTransitioning = false;
        this.transitionDuration = 800;
        this.effects = ['slideHorizontal', 'slideVertical', 'fade', 'curtain', 'zoom'];
        
        this.init();
    }
    
    init() {
        this.createTransitionOverlay();
        this.interceptNavigation();
        this.addPageEnterAnimation();
    }
    
    createTransitionOverlay() {
        // Créer l'overlay de transition
        this.overlay = document.createElement('div');
        this.overlay.className = 'enise-transition-overlay';
        this.overlay.innerHTML = `
            <div class="transition-content">
                <div class="enise-logo">
                    <img src="../logo.png" alt="ENISE" class="logo-animation">
                </div>
                <div class="loading-indicator">
                    <div class="loading-bar">
                        <div class="loading-progress"></div>
                    </div>
                    <p class="loading-text">Chargement...</p>
                </div>
                <div class="transition-particles"></div>
            </div>
        `;
        document.body.appendChild(this.overlay);
        
        this.createParticles();
    }
    
    interceptNavigation() {
        // Intercepter les clics sur les liens de navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Vérifier si c'est un lien vers une autre page HTML
            if (this.isInternalLink(href) && !this.isTransitioning) {
                e.preventDefault();
                this.navigateToPage(href, this.getRandomEffect());
            }
        });
        
        // Gérer le bouton retour du navigateur
        window.addEventListener('popstate', (e) => {
            if (!this.isTransitioning) {
                this.navigateToPage(window.location.pathname, 'fade');
            }
        });
    }
    
    isInternalLink(href) {
        if (!href) return false;
        
        // Liste des pages de votre site
        const internalPages = [
            'index.html',
            '../index.html',
            'Civil_challenge/Civil_challenge.html',
            'Impression_challenge/Impression_challenge.html',
            'International_challenge/International_challenge.html',
            'robotics_challenge/robotics_challenge.html'
        ];
        
        return internalPages.includes(href) || 
               href.startsWith('./') || 
               href.startsWith('../') ||
               (!href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && href.includes('.html'));
    }
    
    getRandomEffect() {
        return this.effects[Math.floor(Math.random() * this.effects.length)];
    }
    
    navigateToPage(url, effect = 'slideHorizontal') {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // 1. Animation de sortie
        this.animatePageOut(effect, () => {
            // 2. Afficher l'overlay
            this.showTransitionOverlay(() => {
                // 3. Charger la nouvelle page
                this.loadPage(url, () => {
                    // 4. Masquer l'overlay et animer l'entrée sera géré par la nouvelle page
                });
            });
        });
    }
    
    animatePageOut(effect, callback) {
        const mainContent = document.querySelector('main') || document.body;
        const elements = document.querySelectorAll('.fade-element, .event-card, .info-card, .gallery-item, .calendar-item, .org-card');
        
        // Ajouter les classes CSS pour l'animation de sortie
        mainContent.classList.add(`transition-out-${effect}`);
        
        // Animer les éléments individuellement avec un délai
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('element-transition-out');
            }, index * 50);
        });
        
        setTimeout(callback, 600);
    }
    
    showTransitionOverlay(callback) {
        this.overlay.classList.add('active');
        this.startLoadingAnimation();
        this.animateParticles();
        
        setTimeout(callback, 300);
    }
    
    loadPage(url, callback) {
        // Simuler un délai de chargement réaliste
        const loadingBar = this.overlay.querySelector('.loading-progress');
        const loadingText = this.overlay.querySelector('.loading-text');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 25 + 5;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                loadingBar.style.width = '100%';
                loadingText.textContent = 'Redirection...';
                
                setTimeout(() => {
                    // Rediriger vers la nouvelle page
                    window.location.href = url;
                }, 300);
            } else {
                loadingBar.style.width = progress + '%';
                
                // Changer le texte de chargement
                const loadingTexts = ['Chargement...', 'Préparation...', 'Presque prêt...'];
                if (progress > 30 && progress < 70) {
                    loadingText.textContent = loadingTexts[1];
                } else if (progress > 70) {
                    loadingText.textContent = loadingTexts[2];
                }
            }
        }, 150);
    }
    
    addPageEnterAnimation() {
        // Animation d'entrée quand une page se charge
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.animatePageIn();
            }, 100);
        });
    }
    
    animatePageIn() {
        const elements = document.querySelectorAll('.fade-element, .event-card, .info-card, .gallery-item, .calendar-item, .org-card');
        const hero = document.querySelector('.hero, .hero-content');
        
        // Animation d'entrée du hero
        if (hero) {
            hero.classList.add('page-enter-animation');
        }
        
        // Animation d'entrée des éléments avec délai échelonné
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('element-enter-animation');
            }, index * 100);
        });
        
        // Masquer l'overlay si il est actif
        if (this.overlay && this.overlay.classList.contains('active')) {
            setTimeout(() => {
                this.hideTransitionOverlay();
            }, 500);
        }
    }
    
    hideTransitionOverlay() {
        this.overlay.classList.remove('active');
        setTimeout(() => {
            const loadingBar = this.overlay.querySelector('.loading-progress');
            loadingBar.style.width = '0%';
            this.isTransitioning = false;
        }, 600);
    }
    
    startLoadingAnimation() {
        const logo = this.overlay.querySelector('.logo-animation');
        logo.classList.add('spinning');
    }
    
    createParticles() {
        const particlesContainer = this.overlay.querySelector('.transition-particles');
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particle.style.animationDuration = (3 + Math.random() * 2) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    animateParticles() {
        const particles = this.overlay.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
    }
}

// ===== CSS À AJOUTER DANS LE <style> DE CHAQUE PAGE =====
const transitionCSS = `
/* ===== STYLES POUR LES TRANSITIONS ENTRE PAGES ===== */

.enise-transition-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #C41E3A 0%, #0066CC 100%);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
    backdrop-filter: blur(10px);
}

.enise-transition-overlay.active {
    opacity: 1;
    visibility: visible;
}

.transition-content {
    text-align: center;
    color: white;
    position: relative;
}

.enise-logo {
    margin-bottom: 30px;
}

.logo-animation {
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 50%;
    padding: 15px;
    transition: transform 0.4s ease;
}

.logo-animation.spinning {
    animation: logoSpin 2s linear infinite;
}

@keyframes logoSpin {
    from { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
    to { transform: rotate(360deg) scale(1); }
}

.loading-indicator {
    margin-top: 20px;
}

.loading-bar {
    width: 200px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 auto 15px auto;
}

.loading-progress {
    height: 100%;
    background: linear-gradient(90deg, #fff, #f0f0f0);
    width: 0%;
    transition: width 0.3s ease;
    border-radius: 2px;
}

.loading-text {
    font-size: 14px;
    opacity: 0.9;
    font-weight: 500;
    margin: 0;
}

.transition-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
}

.particle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: particleFloat 4s linear infinite;
    animation-play-state: paused;
}

@keyframes particleFloat {
    0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
    }
}

/* ===== ANIMATIONS DE SORTIE ===== */

.transition-out-slideHorizontal {
    transform: translateX(-100%);
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.transition-out-slideVertical {
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.transition-out-fade {
    opacity: 0;
    transition: all 0.6s ease-out;
}

.transition-out-curtain {
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.transition-out-zoom {
    transform: scale(0.8);
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/* ===== ANIMATIONS DES ÉLÉMENTS ===== */

.element-transition-out {
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.4s ease-out;
}

.element-enter-animation {
    animation: elementEnter 0.8s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}

@keyframes elementEnter {
    0% {
        transform: translateY(30px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

.page-enter-animation {
    animation: pageEnter 1s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}

@keyframes pageEnter {
    0% {
        transform: translateY(50px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
    .logo-animation {
        width: 60px;
        height: 60px;
        padding: 10px;
    }
    
    .loading-bar {
        width: 150px;
    }
    
    .loading-text {
        font-size: 12px;
    }
}
`;

// Initialiser les transitions quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Ajouter les styles CSS
    const styleSheet = document.createElement('style');
    styleSheet.textContent = transitionCSS;
    document.head.appendChild(styleSheet);
    
    // Initialiser le système de transitions
    new ENISEPageTransitions();
});

// Export pour utilisation modulaire (optionnel)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ENISEPageTransitions;
}