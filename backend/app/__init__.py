from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from .config import Config
from .extensions import db
import logging
from logging.handlers import RotatingFileHandler
import os
from datetime import timedelta
from werkzeug.middleware.proxy_fix import ProxyFix

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Handle reverse proxy headers
    app.wsgi_app = ProxyFix(
        app.wsgi_app,
        x_for=1,
        x_proto=1,
        x_host=1,
        x_prefix=1
    )

    # ===== Enhanced CORS Configuration =====
    cors_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    
    if app.config.get('PRODUCTION_DOMAINS'):
        cors_origins.extend(app.config['PRODUCTION_DOMAINS'])
    
    CORS(app, resources={
        r"/api/*": {
            "origins": cors_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": [
                "Content-Type",
                "Authorization",
                "X-Requested-With",
                "X-CSRF-Token"
            ],
            "expose_headers": [
                "Content-Length",
                "Authorization",
                "X-Total-Count",
                "X-New-Token"
            ],
            "supports_credentials": app.config.get('CORS_SUPPORTS_CREDENTIALS', False),
            "max_age": app.config.get('CORS_MAX_AGE', 86400)
        }
    })

    # ===== Database Configuration =====
    db.init_app(app)
    Migrate(app, db)
    
    # ===== Rate Limiting with Redis =====
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        storage_uri=app.config.get('REDIS_URL', 'memory://'),
        default_limits=["200 per day", "50 per hour"]
    )
    
    if app.config.get('ENV') == 'development':
        limiter.enabled = False

    # ===== JWT Configuration =====
    jwt = JWTManager(app)
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
    
    # ===== Blueprint Registration =====
    register_blueprints(app)
    
    # ===== Health Check Endpoint =====
    @app.route('/health')
    def health_check():
        return jsonify({"status": "healthy", "environment": app.config.get('ENV')}), 200
    
    # ===== Error Handlers =====
    register_error_handlers(app)
    
    # ===== Logging Configuration =====
    configure_logging(app)
    
    return app

def register_blueprints(app):
    """Register all application blueprints"""
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.users import users_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(users_bp, url_prefix='/api/users')

def register_error_handlers(app):
    """Register global error handlers"""
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "error": "Bad request",
            "message": str(error.description) if hasattr(error, 'description') else str(error)
        }), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            "error": "Unauthorized",
            "message": "Authentication required"
        }), 401
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "error": "Not found",
            "message": "The requested resource was not found"
        }), 404
    
    @app.errorhandler(429)
    def rate_limit_exceeded(error):
        return jsonify({
            "error": "Too many requests",
            "message": "Rate limit exceeded"
        }), 429
    
    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"Server error: {str(error)}")
        return jsonify({
            "error": "Internal server error",
            "message": "An unexpected error occurred"
        }), 500

def configure_logging(app):
    """Configure application logging"""
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
            
        file_handler = RotatingFileHandler(
            'logs/bluecart.log',
            maxBytes=10240 * 10,  # 100KB
            backupCount=10,
            encoding='utf-8'
        )
        
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s '
            '[in %(pathname)s:%(lineno)d]'
        ))
        
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Application startup')