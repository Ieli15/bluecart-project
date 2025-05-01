from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from .config import Config
from flask_cors import CORS
from flask_migrate import Migrate  # Import Flask-Migrate

# Extensions
jwt = JWTManager()
db = SQLAlchemy()
migrate = Migrate()  # Initialize Migrate extension

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)  # Initialize Migrate with the app and db

    # Enable CORS for all routes
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://127.0.0.1:5173"}})

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.products import products_bp
    from .routes.users import users_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(products_bp, url_prefix='/products')
    app.register_blueprint(users_bp, url_prefix='/users')

    return app
