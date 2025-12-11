from flask import Flask
from flask_cors import CORS
from app.dashboard import dashboard_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(dashboard_bp, url_prefix="/api")

    return app
