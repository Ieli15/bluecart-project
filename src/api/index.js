// Enhanced API service with multi-shop support
const API_BASE = '/api';
export const getShopLogo = (shopName) => {
    const shopLogos = {
      amazon: '/assets/Amazon.png',
      ebay: '/assets/Ebay.png',
      alibaba: '/assets/AliExpress.png',
      shopify: '/assets/Shopify.png',
      walmart: '/assets/Walmart.png'
    };
    return shopLogos[shopName.toLowerCase()] || '/assets/default-shop.png';
  };

export const searchAllShops = async (query) => {
  try {
    const response = await fetch(`${API_BASE}/products/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query,
        shops: ['amazon', 'ebay', 'alibaba', 'shopify'] // Specify which shops to search
      })
    });
    
    if (!response.ok) throw new Error('Search failed');
    
    const results = await response.json();
    
    // Transform data to ensure consistent structure
    return results.map(product => ({
      ...product,
      shop: product.shop?.toLowerCase() || 'unknown',
      marginal_benefit: product.marginal_benefit || calculateMB(product),
      cost_benefit: product.cost_benefit || calculateCB(product)
    }));
    
  } catch (error) {
    console.error('Search Error:', error);
    throw error;
  }
};

// Helper calculations (can be customized)
const calculateMB = (product) => {
  return (product.rating / 5) * 0.6 + 
         (1 - (product.delivery_cost / 1000)) * 0.3 +
         (product.payment_mode === 'Pay after delivery' ? 0.1 : 0.05);
};

const calculateCB = (product) => {
  return (product.rating * 100) / (product.price + product.delivery_cost);
};