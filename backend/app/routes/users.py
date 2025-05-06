from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

users_bp = Blueprint('users', __name__)

@users_bp.route('/profile')
@jwt_required()
def user_profile():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200