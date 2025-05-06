from flask import current_app
from app import cache

class ProductAnalyzer:
    @staticmethod
    @cache.memoize(timeout=3600)
    def calculate_benefits(products, weights=None):
        weights = weights or {
            'price': 0.3,
            'rating': 0.25,
            'delivery_cost': 0.2,
            'delivery_time': 0.15,
            'payment_mode': 0.1
        }
        
        if not products:
            return []
            
        max_price = max(p['price'] for p in products)
        max_delivery = max(p.get('delivery_cost', 0) for p in products) or 1
        
        for product in products:
            # Marginal Benefit calculation
            mb = (product.get('rating', 0) * weights['rating'] + 
                 min(product.get('review_count', 0)/100, 1) * 0.1 +
                 (1 if product.get('payment_mode') == 'pay_after_delivery' else 0.5) * weights['payment_mode'])
            
            # Cost Benefit calculation
            cb = ((1 - product['price']/max_price) * weights['price'] + 
                 (1 - product.get('delivery_cost', 0)/max_delivery) * weights['delivery_cost'])
            
            product.update({
                'mb_score': round(mb, 2),
                'cb_score': round(cb, 2),
                'overall_score': round(mb * 0.6 + cb * 0.4, 2)
            })
        
        return sorted(products, key=lambda x: x['overall_score'], reverse=True)