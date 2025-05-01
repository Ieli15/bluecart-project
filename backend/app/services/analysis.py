def calculate_marginal_benefit(product):
    rating_score = product['rating'] * product['rating_count']
    payment_bonus = 5 if product['payment_mode'] == 'Pay after delivery' else 0
    return rating_score + payment_bonus

def calculate_cost_benefit(product):
    return product['price'] + product['delivery_cost']

def rank_products(products):
    for product in products:
        product['mb'] = calculate_marginal_benefit(product)
        product['cb'] = calculate_cost_benefit(product)
        product['score'] = product['mb'] / (product['cb'] + 1)  # +1 avoids division by zero

    ranked = sorted(products, key=lambda p: p['score'], reverse=True)
    return ranked
