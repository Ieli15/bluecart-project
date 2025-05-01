from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import SearchHistory, db

users_bp = Blueprint('users', __name__)

@users_bp.route('/history', methods=['GET'])
@jwt_required()
def history():
    user_id = get_jwt_identity()
    history = SearchHistory.query.filter_by(user_id=user_id).all()
    return jsonify([{"query": h.query, "timestamp": h.timestamp.isoformat()} for h in history])

