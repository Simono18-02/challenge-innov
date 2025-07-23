import os
from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

# Détermine le chemin absolu du dossier pour la base de données
basedir = os.path.abspath(os.path.dirname(__file__))

# Initialisation de l'application Flask
app = Flask(__name__)

# --- CONFIGURATION DE LA BASE DE DONNÉES ---
# Indique à Flask où trouver notre base de données
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'partenaires.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Optionnel, pour désactiver des avertissements

# Lie notre application à SQLAlchemy
db = SQLAlchemy(app)

# --- MODÈLE DE LA BASE DE DONNÉES ---
# On définit ici à quoi ressemblera une entrée "partenaire" dans notre base de données.
class Partenaire(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom_entreprise = db.Column(db.String(100), nullable=False)
    nom_contact = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    telephone = db.Column(db.String(20), nullable=True) # Nullable=True car ce n'est pas obligatoire
    message = db.Column(db.Text, nullable=True)

# --- DÉFINITION DES ROUTES (LES URLS DE NOTRE SITE) ---

# Route pour la page d'accueil
@app.route('/')
def index():
    # 'render_template' va chercher le fichier dans le dossier /templates
    return render_template('index.html')

# Route pour la page des partenaires
# Elle accepte les requêtes GET (quand on affiche la page) et POST (quand le formulaire est soumis)
@app.route('/partenaires', methods=['GET', 'POST'])
def partenaires():
    # Si le formulaire a été envoyé (méthode POST)
    if request.method == 'POST':
        # 1. On récupère les données du formulaire
        nom_ent = request.form.get('entreprise')
        nom_con = request.form.get('nom')
        email_con = request.form.get('email')
        tel_con = request.form.get('telephone')
        msg = request.form.get('message')

        # 2. On crée un nouvel objet Partenaire avec ces données
        nouveau_partenaire = Partenaire(
            nom_entreprise=nom_ent,
            nom_contact=nom_con,
            email=email_con,
            telephone=tel_con,
            message=msg
        )

        # 3. On ajoute ce nouvel objet à la base de données et on sauvegarde
        try:
            db.session.add(nouveau_partenaire)
            db.session.commit()
            # 4. On redirige vers une page de remerciement (pour éviter les soumissions multiples)
            return redirect(url_for('merci'))
        except Exception as e:
            return f"Une erreur est survenue : {e}"

    # Si la méthode est GET, on affiche simplement la page
    return render_template('partenaires.html')

# Route pour la page de remerciement
@app.route('/merci')
def merci():
    # Ici, vous pourriez créer une jolie page "merci.html" dans votre dossier /templates
    return "<h1>Merci !</h1><p>Nous avons bien reçu votre demande et nous vous recontacterons très prochainement.</p><a href='/'>Retour à l'accueil</a>"

# --- Point d'entrée pour lancer l'application ---
if __name__ == '__main__':
    # On s'assure que la base de données est créée si elle n'existe pas
    with app.app_context():
        db.create_all()
    app.run(debug=True) # debug=True pour le développement, à retirer en production