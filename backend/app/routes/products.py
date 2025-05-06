from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import SearchHistory, ProductAnalysis, db
from app.services.scraper_service import scrape_products
from app.services.analyzer import analyze_products
from datetime import datetime

products_bp = Blueprint('products', __name__)

@products_bp.route('/search', methods=['POST'])
@jwt_required(optional=True)
def search_products():
    """
    Endpoint to search for products and provide analyzed results.
    Accepts JSON payload with 'query' and optional 'filters'.
    """
    data = request.get_json()
    query = data.get('query')
    
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400
    
    user_id = get_jwt_identity()
    search = None

    # Log the search for authenticated users
    if user_id:
        try:
            search = SearchHistory(user_id=user_id, query=query)
            db.session.add(search)
            db.session.commit()
        except Exception as e:
            return jsonify({'error': f'Failed to save search history: {str(e)}'}), 500

    # Scrape products
    try:
        scraped_data = scrape_products(query)
    except Exception as e:
        return jsonify({'error': f'Scraping failed: {str(e)}'}), 500

    # Analyze products
    try:
        analyzed_data = analyze_products(scraped_data, data.get('filters', {}))
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

    # Save product analysis for authenticated users
    if user_id and search:
        try:
            for product in analyzed_data:
                analysis = ProductAnalysis(
                    search_id=search.id,
                    product_name=product['name'],
                    shop_name=product['shop'],
                    price=product['price'],
                    rating=product['rating'],
                    delivery_cost=product['delivery_cost'],
                    payment_mode=product['payment_mode'],
                    marginal_benefit=product['marginal_benefit'],
                    cost_benefit=product['cost_benefit']
                )
                db.session.add(analysis)
            db.session.commit()
        except Exception as e:
            return jsonify({'error': f'Failed to save product analysis: {str(e)}'}), 500

    # Build response
    return jsonify({
        'query': query,
        'results_count': len(analyzed_data),
        'results': analyzed_data,
        'timestamp': datetime.utcnow().isoformat()
    }), 200
