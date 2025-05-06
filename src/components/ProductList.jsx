import React from 'react';
import PropTypes from 'prop-types';
import { getShopLogo } from '../api';

const ProductList = ({ products }) => {
  if (!products?.length) {
    return <div className="no-products">No products found. Try a different search.</div>;
  }

  // Group by shop for better organization
  const productsByShop = products.reduce((acc, product) => {
    const shop = product.shop || 'other';
    if (!acc[shop]) acc[shop] = [];
    acc[shop].push(product);
    return acc;
  }, {});

  return (
    <div className="shop-results-container">
      {Object.entries(productsByShop).map(([shop, shopProducts]) => (
        <div key={shop} className="shop-section">
          <div className="shop-header">
            <img src={getShopLogo(shop)} alt={shop} className="shop-icon" />
            <h3>{shop.charAt(0).toUpperCase() + shop.slice(1)}</h3>
          </div>
          
          <div className="product-grid">
            {shopProducts.map(product => (
              <div key={`${product.id}-${shop}`} className="product-card">
                <h4>{product.name}</h4>
                <p className="price">KSh {product.price.toLocaleString()}</p>
                <div className="product-meta">
                  <span className="rating">{product.rating} ★</span>
                  <span className="delivery">Delivery: KSh {product.delivery_cost}</span>
                </div>
                <div className="value-scores">
                  <span>MB: {product.marginal_benefit?.toFixed(2) || 'N/A'}</span>
                  <span>CB: {product.cost_benefit?.toFixed(2) || 'N/A'}</span>
                </div>
                <a href={product.url} target="_blank" rel="noopener" className="shop-link">
                  View on {shop}
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      shop: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      rating: PropTypes.number,
      delivery_cost: PropTypes.number,
      url: PropTypes.string,
      marginal_benefit: PropTypes.number,
      cost_benefit: PropTypes.number
    })
  )
};

export default ProductList;