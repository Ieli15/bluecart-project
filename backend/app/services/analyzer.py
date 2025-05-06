from ..utils.calculations import calculate_marginal_benefit, calculate_cost_benefit

def analyze_products(products, filters=None):
    if filters is None:
        filters = {}
    
    # Calculate MB and CB for each product
    for product in products:
        product['marginal_benefit'] = calculate_marginal_benefit(product)
        product['cost_benefit'] = calculate_cost_benefit(product)
    
    # Apply filters
    if filters.get('min_rating'):
        products = [p for p in products if p['rating'] >= float(filters['min_rating'])]
    if filters.get('max_price'):
        products = [p for p in products if p['price'] <= float(filters['max_price'])]
    if filters.get('payment_mode'):
        products = [p for p in products if p['payment_mode'] == filters['payment_mode']]
    
    # Sort based on user preference or default (MB * CB)
    sort_by = filters.get('sort_by', 'value')
    if sort_by == 'price':
        products.sort(key=lambda x: x['price'])
    elif sort_by == 'rating':
        products.sort(key=lambda x: -x['rating'])
    else:  # Default sort by value (MB * CB)
        products.sort(key=lambda x: -(x['marginal_benefit'] * x['cost_benefit']))
    
    return products