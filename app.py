import os
from datetime import datetime
from flask import Flask, request, jsonify, render_template_string
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import re

# Charger les variables d'environnement
load_dotenv()

# Configuration Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://localhost/challenge_innov')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Extensions
db = SQLAlchemy(app)
CORS(app)

# Modèles de base de données
class TeamRegistration(db.Model):
    """Modèle pour les inscriptions d'équipes"""
    __tablename__ = 'team_registrations'
    
    id = db.Column(db.Integer, primary_key=True)
    challenge_type = db.Column(db.String(50), nullable=False)  # robotics, civil, impression, international
    team_name = db.Column(db.String(100), nullable=False)
    school = db.Column(db.String(200), nullable=False)
    leader_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    country = db.Column(db.String(100), nullable=True)  # Pour international challenge
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'challenge_type': self.challenge_type,
            'team_name': self.team_name,
            'school': self.school,
            'leader_name': self.leader_name,
            'email': self.email,
            'country': self.country,
            'created_at': self.created_at.isoformat()
        }

class PartnershipRequest(db.Model):
    """Modèle pour les demandes de partenariat"""
    __tablename__ = 'partnership_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(200), nullable=False)
    contact_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    partnership_type = db.Column(db.String(50), nullable=False)
    budget = db.Column(db.String(50), nullable=True)
    message = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'company_name': self.company_name,
            'contact_name': self.contact_name,
            'email': self.email,
            'phone': self.phone,
            'partnership_type': self.partnership_type,
            'budget': self.budget,
            'message': self.message,
            'created_at': self.created_at.isoformat()
        }

class NewsletterSubscription(db.Model):
    """Modèle pour les abonnements newsletter"""
    __tablename__ = 'newsletter_subscriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    active = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'active': self.active
        }

# Fonctions utilitaires
def validate_email(email):
    """Valide le format d'un email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_input(data):
    """Nettoie les données d'entrée"""
    if isinstance(data, str):
        return data.strip()
    return data

# Routes API
@app.route('/')
def home():
    """Page d'accueil de l'API"""
    return jsonify({
        'message': 'API Challenge Innov\'Etudiants',
        'endpoints': {
            'team_registration': '/api/register-team',
            'partnership': '/api/partnership',
            'newsletter': '/api/newsletter',
            'admin': '/admin'
        }
    })

@app.route('/api/register-team', methods=['POST'])
def register_team():
    """Endpoint pour l'inscription des équipes"""
    try:
        data = request.get_json()
        
        # Validation des données
        required_fields = ['challenge_type', 'team_name', 'school', 'leader_name', 'email']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Le champ {field} est requis'}), 400
        
        # Validation email
        if not validate_email(data['email']):
            return jsonify({'error': 'Format d\'email invalide'}), 400
        
        # Nettoyage des données
        for key in data:
            data[key] = sanitize_input(data[key])
        
        # Vérification si l'équipe existe déjà
        existing_team = TeamRegistration.query.filter_by(
            challenge_type=data['challenge_type'],
            team_name=data['team_name']
        ).first()
        
        if existing_team:
            return jsonify({'error': 'Cette équipe est déjà inscrite pour ce challenge'}), 409
        
        # Création de l'inscription
        registration = TeamRegistration(
            challenge_type=data['challenge_type'],
            team_name=data['team_name'],
            school=data['school'],
            leader_name=data['leader_name'],
            email=data['email'],
            country=data.get('country')
        )
        
        db.session.add(registration)
        db.session.commit()
        
        return jsonify({
            'message': 'Inscription réussie !',
            'registration_id': registration.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur serveur: {str(e)}'}), 500

@app.route('/api/partnership', methods=['POST'])
def partnership_request():
    """Endpoint pour les demandes de partenariat"""
    try:
        data = request.get_json()
        
        # Validation des données
        required_fields = ['company_name', 'contact_name', 'email', 'partnership_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Le champ {field} est requis'}), 400
        
        # Validation email
        if not validate_email(data['email']):
            return jsonify({'error': 'Format d\'email invalide'}), 400
        
        # Nettoyage des données
        for key in data:
            data[key] = sanitize_input(data[key])
        
        # Création de la demande
        partnership = PartnershipRequest(
            company_name=data['company_name'],
            contact_name=data['contact_name'],
            email=data['email'],
            phone=data.get('phone'),
            partnership_type=data['partnership_type'],
            budget=data.get('budget'),
            message=data.get('message')
        )
        
        db.session.add(partnership)
        db.session.commit()
        
        return jsonify({
            'message': 'Demande de partenariat envoyée avec succès !',
            'request_id': partnership.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur serveur: {str(e)}'}), 500

@app.route('/api/newsletter', methods=['POST'])
def newsletter_subscribe():
    """Endpoint pour l'abonnement newsletter"""
    try:
        data = request.get_json()
        
        # Validation
        email = data.get('email')
        if not email:
            return jsonify({'error': 'L\'email est requis'}), 400
        
        if not validate_email(email):
            return jsonify({'error': 'Format d\'email invalide'}), 400
        
        email = sanitize_input(email)
        
        # Vérification si déjà inscrit
        existing_sub = NewsletterSubscription.query.filter_by(email=email).first()
        if existing_sub:
            if existing_sub.active:
                return jsonify({'message': 'Vous êtes déjà abonné à la newsletter'}), 200
            else:
                existing_sub.active = True
                db.session.commit()
                return jsonify({'message': 'Abonnement réactivé avec succès !'}), 200
        
        # Nouvel abonnement
        subscription = NewsletterSubscription(email=email)
        db.session.add(subscription)
        db.session.commit()
        
        return jsonify({
            'message': 'Abonnement newsletter réussi !',
            'subscription_id': subscription.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur serveur: {str(e)}'}), 500

@app.route('/admin')
def admin_dashboard():
    """Dashboard administrateur simple"""
    try:
        # Statistiques
        team_count = TeamRegistration.query.count()
        partnership_count = PartnershipRequest.query.count()
        newsletter_count = NewsletterSubscription.query.filter_by(active=True).count()
        
        # Inscriptions par challenge
        challenges_stats = db.session.query(
            TeamRegistration.challenge_type,
            db.func.count(TeamRegistration.id)
        ).group_by(TeamRegistration.challenge_type).all()
        
        # Inscriptions récentes
        recent_registrations = TeamRegistration.query.order_by(
            TeamRegistration.created_at.desc()
        ).limit(10).all()
        
        # Template HTML simple
        template = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Admin - Challenge Innov'Etudiants</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .stats { display: flex; gap: 20px; margin-bottom: 30px; }
                .stat-card { background: #f5f5f5; padding: 20px; border-radius: 8px; }
                .stat-number { font-size: 2em; font-weight: bold; color: #C41E3A; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                th { background-color: #C41E3A; color: white; }
                .challenge-type { 
                    padding: 4px 8px; 
                    border-radius: 4px; 
                    font-size: 0.8em; 
                    font-weight: bold; 
                }
                .robotics { background: #0066CC; color: white; }
                .civil { background: #A0522D; color: white; }
                .impression { background: #6A0DAD; color: white; }
                .international { background: #2E8B57; color: white; }
            </style>
        </head>
        <body>
            <h1>Dashboard Administrateur</h1>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">{{ team_count }}</div>
                    <div>Équipes inscrites</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ partnership_count }}</div>
                    <div>Demandes partenariat</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ newsletter_count }}</div>
                    <div>Abonnés newsletter</div>
                </div>
            </div>
            
            <h2>Inscriptions par Challenge</h2>
            <ul>
            {% for challenge, count in challenges_stats %}
                <li><strong>{{ challenge.title() }}</strong>: {{ count }} équipes</li>
            {% endfor %}
            </ul>
            
            <h2>Inscriptions Récentes</h2>
            <table>
                <thead>
                    <tr>
                        <th>Challenge</th>
                        <th>Équipe</th>
                        <th>École</th>
                        <th>Chef d'équipe</th>
                        <th>Email</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                {% for reg in recent_registrations %}
                    <tr>
                        <td><span class="challenge-type {{ reg.challenge_type }}">{{ reg.challenge_type }}</span></td>
                        <td>{{ reg.team_name }}</td>
                        <td>{{ reg.school }}</td>
                        <td>{{ reg.leader_name }}</td>
                        <td>{{ reg.email }}</td>
                        <td>{{ reg.created_at.strftime('%d/%m/%Y %H:%M') }}</td>
                    </tr>
                {% endfor %}
                </tbody>
            </table>
        </body>
        </html>
        """
        
        return render_template_string(template, 
                                    team_count=team_count,
                                    partnership_count=partnership_count,
                                    newsletter_count=newsletter_count,
                                    challenges_stats=challenges_stats,
                                    recent_registrations=recent_registrations)
        
    except Exception as e:
        return jsonify({'error': f'Erreur: {str(e)}'}), 500

@app.route('/api/stats')
def get_stats():
    """API pour récupérer les statistiques"""
    try:
        stats = {
            'teams': TeamRegistration.query.count(),
            'partnerships': PartnershipRequest.query.count(),
            'newsletter': NewsletterSubscription.query.filter_by(active=True).count(),
            'challenges': {}
        }
        
        # Stats par challenge
        challenges = db.session.query(
            TeamRegistration.challenge_type,
            db.func.count(TeamRegistration.id)
        ).group_by(TeamRegistration.challenge_type).all()
        
        for challenge, count in challenges:
            stats['challenges'][challenge] = count
            
        return jsonify(stats)
        
    except Exception as e:
        return jsonify({'error': f'Erreur: {str(e)}'}), 500

# Gestion des erreurs
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint non trouvé'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Erreur serveur interne'}), 500

# Initialisation de la base de données
def init_db():
    """Initialise la base de données"""
    try:
        db.create_all()
        print("✅ Base de données initialisée avec succès")
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation: {e}")

if __name__ == '__main__':
    with app.app_context():
        init_db()
    
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('FLASK_PORT', 5000)),
        debug=os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    )