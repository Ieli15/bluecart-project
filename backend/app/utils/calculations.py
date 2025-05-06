def calculate_marginal_benefit(product):
    """Calculate marginal benefit based on product features"""
    rating_weight = 0.5
    delivery_weight = 0.3
    payment_weight = 0.2
    
    # Payment mode score (higher for pay after delivery)
    payment_score = 1.0 if product['payment_mode'] == 'Pay after delivery' else 0.7
    
    # Normalize delivery cost (assuming max delivery cost is 20)
    delivery_score = 1 - (product['delivery_cost'] / 20)
    
    # Normalize rating (assuming max is 5)
    rating_score = product['rating'] / 5
    
    # Calculate marginal benefit (0-1 scale)
    mb = (rating_score * rating_weight + 
          delivery_score * delivery_weight + 
          payment_score * payment_weight)
    
    return round(mb, 3)

def calculate_cost_benefit(product):
    """Calculate cost benefit ratio"""
    if product['price'] <= 0:
        return 0
    
    # CB = (rating * 100) / (price + delivery)
    cb = (product['rating'] * 100) / (product['price'] + product['delivery_cost'])
    return round(cb, 3)