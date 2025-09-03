/**
 * Main JavaScript for Challenge Innov'Etudiants
 * Handles form validation, countdowns, mobile menu, and interactions
 */

class ChallengeInnovApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initCountdowns();
        this.initLazyLoading();
        this.initFormValidation();
        this.initMobileMenu();
        this.initGallery();
        this.setupAccessibility();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            // Remove loading states
            document.body.classList.remove('loading');
            
            // Setup smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        });

        // Handle form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form[data-validate="true"]')) {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });

        // Handle window resize for responsive adjustments
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    initCountdowns() {
        const countdowns = document.querySelectorAll('[data-countdown]');
        countdowns.forEach(countdown => {
            const targetDate = countdown.dataset.countdown;
            if (targetDate) {
                this.createCountdown(targetDate, countdown);
            }
        });
    }

    createCountdown(targetDate, element) {
        try {
            const countdownDate = new Date(targetDate).getTime();
            
            if (isNaN(countdownDate)) {
                throw new Error('Invalid date provided');
            }

            const updateCountdown = () => {
                const now = new Date().getTime();
                const distance = countdownDate - now;

                if (distance < 0) {
                    element.innerHTML = '<div class="countdown-expired">Événement en cours ou terminé</div>';
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                element.innerHTML = `
                    <div class="countdown-item">
                        <div>${days}</div>
                        <span>Jours</span>
                    </div>
                    <div class="countdown-item">
                        <div>${hours}</div>
                        <span>Heures</span>
                    </div>
                    <div class="countdown-item">
                        <div>${minutes}</div>
                        <span>Minutes</span>
                    </div>
                    <div class="countdown-item">
                        <div>${seconds}</div>
                        <span>Secondes</span>
                    </div>
                `;
            };

            updateCountdown();
            setInterval(updateCountdown, 1000);

        } catch (error) {
            console.warn(`Countdown initialization failed: ${error.message}`);
            element.textContent = 'Date à venir';
        }
    }

    initLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                    
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Lazy load videos
        const videos = document.querySelectorAll('video[data-src]');
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    video.src = video.dataset.src;
                    video.load();
                    observer.unobserve(video);
                }
            });
        });

        videos.forEach(video => videoObserver.observe(video));
    }

    initFormValidation() {
        const forms = document.querySelectorAll('form[data-validate="true"]');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.validateField(input);
                    }
                });
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error states
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-text');
        if (existingError) {
            existingError.remove();
        }

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Ce champ est obligatoire';
        }

        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer une adresse e-mail valide';
            }
        }

        // Phone validation
        if (fieldType === 'tel' && value) {
            const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer un numéro de téléphone valide';
            }
        }

        // Custom validation rules
        if (field.dataset.minLength && value.length < parseInt(field.dataset.minLength)) {
            isValid = false;
            errorMessage = `Minimum ${field.dataset.minLength} caractères requis`;
        }

        if (!isValid) {
            field.classList.add('error');
            const errorElement = document.createElement('div');
            errorElement.className = 'error-text';
            errorElement.textContent = errorMessage;
            field.parentNode.appendChild(errorElement);
        }

        return isValid;
    }

    async handleFormSubmit(form) {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        const messageContainer = form.querySelector('.form-message');
        let isFormValid = true;

        // Validate all required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showFormMessage(messageContainer, 'Veuillez corriger les erreurs ci-dessus', 'error');
            return;
        }

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.showFormMessage(messageContainer, 'Votre message a été envoyé avec succès !', 'success');
                form.reset();
                
                // Remove any error states
                form.querySelectorAll('.error').forEach(field => {
                    field.classList.remove('error');
                });
                form.querySelectorAll('.error-text').forEach(error => {
                    error.remove();
                });
            } else {
                throw new Error('Erreur serveur');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormMessage(messageContainer, 'Une erreur est survenue. Veuillez réessayer plus tard.', 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    setButtonLoading(button, isLoading) {
        if (!button) return;

        const textSpan = button.querySelector('.btn-text') || button;
        const loadingSpan = button.querySelector('.btn-loading') || this.createLoadingElement();

        if (isLoading) {
            button.disabled = true;
            button.classList.add('btn-loading');
            if (textSpan !== button) textSpan.style.opacity = '0';
            if (!button.querySelector('.btn-spinner')) {
                button.appendChild(loadingSpan);
            }
        } else {
            button.disabled = false;
            button.classList.remove('btn-loading');
            if (textSpan !== button) textSpan.style.opacity = '1';
            const spinner = button.querySelector('.btn-spinner');
            if (spinner) spinner.remove();
        }
    }

    createLoadingElement() {
        const spinner = document.createElement('span');
        spinner.className = 'btn-spinner';
        spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        spinner.style.position = 'absolute';
        return spinner;
    }

    showFormMessage(container, message, type) {
        if (!container) return;

        container.textContent = message;
        container.className = `form-message ${type}`;
        container.removeAttribute('hidden');

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                container.setAttribute('hidden', '');
            }, 5000);
        }
    }

    initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                
                // Update ARIA attributes
                const isExpanded = navLinks.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', isExpanded);
                
                // Change icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-bars';
                    }
                }
            });

            // Close menu on window resize to desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    this.openImageModal(img);
                }
            });
            
            // Add keyboard support
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const img = item.querySelector('img');
                    if (img) {
                        this.openImageModal(img);
                    }
                }
            });
            
            // Make focusable
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'Ouvrir l\'image en grand');
        });
    }

    openImageModal(img) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content">
                    <button class="modal-close" aria-label="Fermer">&times;</button>
                    <img src="${img.src}" alt="${img.alt}" />
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
            }
            .modal-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            .modal-content img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            .modal-close {
                position: absolute;
                top: -40px;
                right: -40px;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Close modal events
        const closeModal = () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.className === 'modal-backdrop') {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Focus management
        modal.querySelector('.modal-close').focus();
    }

    setupAccessibility() {
        // Add skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Improve focus management
        document.addEventListener('keydown', (e) => {
            // Escape key closes any open menus
            if (e.key === 'Escape') {
                const activeMenu = document.querySelector('.nav-links.active');
                if (activeMenu) {
                    activeMenu.classList.remove('active');
                    document.querySelector('.menu-toggle').focus();
                }
            }
        });
    }

    handleResize() {
        // Recalculate any layout-dependent elements
        // This can be expanded as needed
        console.log('Window resized');
    }

    // Public methods for external use
    showMessage(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-red);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize the application
window.addEventListener('DOMContentLoaded', () => {
    window.challengeApp = new ChallengeInnovApp();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChallengeInnovApp;
}