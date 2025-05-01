from flask import Blueprint, request, jsonify
from ..models import User, db
from flask_jwt_extended import create_access_token
from flask_cors import cross_origin

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://127.0.0.1:5173"], supports_credentials=True)
def register():
    if request.method == 'OPTIONS':
        return jsonify({}), 200 

    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "User already exists"}), 400

    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://127.0.0.1:5173"], supports_credentials=True)
def login():
    if request.method == 'OPTIONS':
        return '', 204  # Handle CORS preflight

    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        token = create_access_token(identity=user.id)
        return jsonify({"access_token": token})

    return jsonify({"message": "Invalid credentials"}), 401
