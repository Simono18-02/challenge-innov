/**
 * Gestion des formulaires avec API Flask
 */

class FormHandler {
    constructor() {
        this.apiBase = 'http://localhost:5000/api';
        this.init();
    }

    init() {
        // Gérer tous les formulaires d'inscription d'équipes
        this.setupTeamRegistrationForms();
        
        // Gérer le formulaire de partenariat
        this.setupPartnershipForm();
        
        // Gérer les formulaires newsletter
        this.setupNewsletterForms();
    }

    setupTeamRegistrationForms() {
        // Formulaires d'inscription d'équipes
        const teamForms = document.querySelectorAll('form.form');
        
        teamForms.forEach(form => {
            // Éviter les formulaires newsletter et partenariat
            if (form.closest('.newsletter-form') || form.closest('#partnership-section')) {
                return;
            }
            
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleTeamRegistration(form);
            });
        });
    }

    setupPartnershipForm() {
        const partnershipForm = document.querySelector('#partnership-section form');
        if (partnershipForm) {
            partnershipForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handlePartnershipRequest(partnershipForm);
            });
        }
    }

    setupNewsletterForms() {
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        
        newsletterForms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleNewsletterSubscription(form);
            });
        });
    }

    async handleTeamRegistration(form) {
        try {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Désactiver le bouton et montrer l'état de chargement
            this.setButtonLoading(submitBtn, true);
            
            // Récupérer le type de challenge depuis l'URL ou la page
            const challengeType = this.getChallengeType();
            
            // Collecter les données du formulaire
            const formData = new FormData(form);
            const data = {
                challenge_type: challengeType,
                team_name: formData.get('team-name') || formData.get('team_name'),
                school: formData.get('school'),
                leader_name: formData.get('leader-name') || formData.get('leader_name'),
                email: formData.get('email'),
                country: formData.get('country') || null
            };

            // Validation côté client
            if (!this.validateTeamData(data)) {
                this.setButtonLoading(submitBtn, false, originalText);
                return;
            }

            // Envoyer à l'API
            const response = await fetch(`${this.apiBase}/register-team`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage('Inscription réussie ! Vous recevrez une confirmation par email.', 'success');
                form.reset();
            } else {
                this.showMessage(result.error || 'Erreur lors de l\'inscription', 'error');
            }

        } catch (error) {
            console.error('Erreur:', error);
            this.showMessage('Erreur de connexion au serveur', 'error');
        } finally {
            const submitBtn = form.querySelector('button[type="submit"]');
            this.setButtonLoading(submitBtn, false, 'Soumettre l\'inscription');
        }
    }

    async handlePartnershipRequest(form) {
        try {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            this.setButtonLoading(submitBtn, true);

            const formData = new FormData(form);
            const data = {
                company_name: formData.get('company-name'),
                contact_name: formData.get('contact-name'),
                email: formData.get('email'),
                phone: formData.get('phone') || null,
                partnership_type: formData.get('partnership-type'),
                budget: formData.get('budget') || null,
                message: formData.get('message') || null
            };

            if (!this.validatePartnershipData(data)) {
                this.setButtonLoading(submitBtn, false, originalText);
                return;
            }

            const response = await fetch(`${this.apiBase}/partnership`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage('Demande de partenariat envoyée avec succès !', 'success');
                form.reset();
            } else {
                this.showMessage(result.error || 'Erreur lors de l\'envoi', 'error');
            }

        } catch (error) {
            console.error('Erreur:', error);
            this.showMessage('Erreur de connexion au serveur', 'error');
        } finally {
            const submitBtn = form.querySelector('button[type="submit"]');
            this.setButtonLoading(submitBtn, false, 'Envoyer la demande');
        }
    }

    async handleNewsletterSubscription(form) {
        try {
            const submitBtn = form.querySelector('button[type="submit"]');
            const emailInput = form.querySelector('input[type="email"]');
            
            if (!emailInput.value || !this.validateEmail(emailInput.value)) {
                this.showMessage('Veuillez entrer une adresse email valide', 'error');
                return;
            }

            this.setButtonLoading(submitBtn, true);

            const data = {
                email: emailInput.value.trim()
            };

            const response = await fetch(`${this.apiBase}/newsletter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage('Abonnement newsletter réussi !', 'success');
                emailInput.value = '';
            } else {
                this.showMessage(result.error || 'Erreur lors de l\'abonnement', 'error');
            }

        } catch (error) {
            console.error('Erreur:', error);
            this.showMessage('Erreur de connexion au serveur', 'error');
        } finally {
            const submitBtn = form.querySelector('button[type="submit"]');
            this.setButtonLoading(submitBtn, false);
        }
    }

    getChallengeType() {
        const path = window.location.pathname;
        
        if (path.includes('robotics')) return 'robotics';
        if (path.includes('civil')) return 'civil';
        if (path.includes('impression')) return 'impression';
        if (path.includes('international')) return 'international';
        
        // Par défaut
        return 'general';
    }

    validateTeamData(data) {
        if (!data.team_name || data.team_name.length < 2) {
            this.showMessage('Le nom d\'équipe doit contenir au moins 2 caractères', 'error');
            return false;
        }

        if (!data.school || data.school.length < 3) {
            this.showMessage('Le nom de l\'école doit contenir au moins 3 caractères', 'error');
            return false;
        }

        if (!data.leader_name || data.leader_name.length < 2) {
            this.showMessage('Le nom du chef d\'équipe doit contenir au moins 2 caractères', 'error');
            return false;
        }

        if (!this.validateEmail(data.email)) {
            this.showMessage('Veuillez entrer une adresse email valide', 'error');
            return false;
        }

        return true;
    }

    validatePartnershipData(data) {
        if (!data.company_name || data.company_name.length < 2) {
            this.showMessage('Le nom de l\'entreprise est requis', 'error');
            return false;
        }

        if (!data.contact_name || data.contact_name.length < 2) {
            this.showMessage('Le nom du contact est requis', 'error');
            return false;
        }

        if (!this.validateEmail(data.email)) {
            this.showMessage('Veuillez entrer une adresse email valide', 'error');
            return false;
        }

        if (!data.partnership_type) {
            this.showMessage('Veuillez sélectionner un type de partenariat', 'error');
            return false;
        }

        return true;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setButtonLoading(button, isLoading, originalText = null) {
        if (isLoading) {
            button.disabled = true;
            button.style.opacity = '0.7';
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        } else {
            button.disabled = false;
            button.style.opacity = '1';
            button.innerHTML = originalText || button.getAttribute('data-original-text') || 'Envoyer';
        }
    }

    showMessage(message, type = 'info') {
        // Supprimer les anciens messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        // Créer le nouveau message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.cssText = `
            padding: 15px;
            margin: 15px 0;
            border-radius: 8px;
            font-weight: 500;
            ${type === 'success' 
                ? 'background-color: rgba(40, 167, 69, 0.1); color: #28a745; border: 1px solid #28a745;'
                : 'background-color: rgba(220, 53, 69, 0.1); color: #dc3545; border: 1px solid #dc3545;'
            }
        `;
        messageDiv.textContent = message;

        // Insérer le message au début du body ou près d'un formulaire
        const container = document.querySelector('.form-container') || document.body;
        container.insertBefore(messageDiv, container.firstChild);

        // Faire défiler vers le message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Auto-supprimer après 5 secondes pour les messages de succès
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }
}

// Initialiser le gestionnaire de formulaires
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
});