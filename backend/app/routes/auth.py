from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from ..models import User, db
from flask_jwt_extended import create_access_token
from email_validator import validate_email, EmailNotValidError
import re

auth_bp = Blueprint('auth', __name__)

def validate_password(password):
    """Ensure password meets complexity requirements"""
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"[0-9]", password):
        return False
    return True

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'email' not in data or 'password' not in data or 'username' not in data:
            return jsonify({"error": "Missing required fields"}), 400

        # Validate email format
        try:
            email = validate_email(data['email']).email
        except EmailNotValidError:
            return jsonify({"error": "Invalid email format"}), 400

        # Validate password strength
        if not validate_password(data['password']):
            return jsonify({
                "error": "Password must be at least 8 characters with uppercase, lowercase, and numbers"
            }), 400

        # Check if user exists
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 409
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username already taken"}), 409

        # Create new user
        new_user = User(
            username=data['username'],
            email=email,
            password_hash=generate_password_hash(data['password'])
        )

        db.session.add(new_user)
        db.session.commit()

        # Generate access token
        access_token = create_access_token(identity=new_user.id)

        return jsonify({
            "message": "User registered successfully",
            "access_token": access_token,
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error": "Missing email or password"}), 400

        user = User.query.filter_by(email=data['email']).first()

        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({"error": "Invalid credentials"}), 401

        access_token = create_access_token(identity=user.id)

        return jsonify({
            "access_token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }), 200

    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500