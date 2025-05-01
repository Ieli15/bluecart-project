from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import SearchHistory, db

products_bp = Blueprint('products', __name__)

@products_bp.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    user_id = get_jwt_identity()

    if user_id:
        history = SearchHistory(user_id=user_id, query=query)
        db.session.add(history)
        db.session.commit()

    # Placeholder: Replace this with scraper + analysis
    results = [
        {"name": "Samsung A51", "shop": "Amazon", "price": 299.99, "rating": 4.6, "delivery_cost": 10.0, "payment_mode": "Pay after delivery"},
        {"name": "Samsung A51", "shop": "eBay", "price": 285.49, "rating": 4.2, "delivery_cost": 15.0, "payment_mode": "Pay before delivery"}
    ]
    return jsonify(results)
