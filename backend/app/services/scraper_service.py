import requests
from ..config import Config
from datetime import datetime
import random

def scrape_products(query):
    # Mock implementation - replace with actual API calls
    mock_shops = ['Amazon', 'eBay', 'Shopify', 'Alibaba']
    results = []
    
    for shop in mock_shops:
        # Generate mock products
        base_price = random.randint(100, 1000)
        products = []
        
        for i in range(1, random.randint(2, 5)):
            product = {
                'name': f"{query} {shop} Model {i}",
                'price': round(base_price * (0.8 + random.random() * 0.4), 2),
                'rating': round(random.uniform(3.5, 5.0), 1),
                'delivery_cost': random.choice([0, 5, 10, 15]),
                'payment_mode': random.choice(['Pay after delivery', 'Pay before delivery']),
                'reviews': [
                    f"Great {query} from {shop}",
                    "Good quality product",
                    "Fast delivery",
                    "Exactly as described"
                ][:random.randint(1, 4)],
                'shop': shop,
                'timestamp': datetime.utcnow().isoformat()
            }
            products.append(product)
        
        results.extend(products)
    
    return results