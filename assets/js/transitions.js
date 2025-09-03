/**
 * Système de transition simple et discret
 * Remplace l'ancien système complexe par un simple fondu
 */

class SimplePageTransition {
    constructor() {
        this.overlay = null;
        this.isTransitioning = false;
        this.init();
    }
    
    init() {
        this.createOverlay();
        this.handlePageLoad();
        this.interceptNavigation();
    }
    
    createOverlay() {
        // Créer un overlay simple pour les transitions
        this.overlay = document.createElement('div');
        this.overlay.id = 'simple-page-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background-color: rgba(255, 255, 255, 0.95);
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease-in-out;
        `;
        document.body.appendChild(this.overlay);
    }
    
    handlePageLoad() {
        // Masquer l'overlay au chargement de la page
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideOverlay();
            }, 100);
        });
        
        // Masquer immédiatement si le DOM est déjà chargé
        if (document.readyState === 'complete') {
            setTimeout(() => {
                this.hideOverlay();
            }, 100);
        }
    }
    
    interceptNavigation() {
        // Intercepter les clics sur les liens vers d'autres pages
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link || this.isTransitioning) return;
            
            const href = link.getAttribute('href');
            
            // Vérifier si c'est un lien vers une page HTML
            if (this.shouldTransition(href)) {
                e.preventDefault();
                this.navigateToPage(href);
            }
        });
    }
    
    shouldTransition(href) {
        if (!href) return false;
        
        // Ne pas faire de transition pour :
        // - Les ancres (#)
        // - Les emails (mailto:)
        // - Les téléphones (tel:)
        // - Les liens externes (http/https)
        if (href.startsWith('#') || 
            href.startsWith('mailto:') || 
            href.startsWith('tel:') ||
            href.startsWith('http://') ||
            href.startsWith('https://')) {
            return false;
        }
        
        // Faire une transition pour les fichiers .html
        return href.includes('.html');
    }
    
    navigateToPage(url) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.showOverlay();
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }
    
    showOverlay() {
        this.overlay.style.opacity = '1';
        this.overlay.style.pointerEvents = 'auto';
    }
    
    hideOverlay() {
        this.overlay.style.opacity = '0';
        this.overlay.style.pointerEvents = 'none';
        this.isTransitioning = false;
    }
}

// Initialiser le système de transition simple
document.addEventListener('DOMContentLoaded', () => {
    new SimplePageTransition();
});