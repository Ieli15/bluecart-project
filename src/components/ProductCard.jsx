import React from 'react';

function ProductCard({ product, onClose }) {
  const getIconForUrl = (url) => {
    if (url) {
      if (url.includes('amazon')) {
        return ' on Amazon';
      } else if (url.includes('ebay')) {
        return ' on eBay';
      } else if (url.includes('walmart')) {
        return ' on Walmart';
      }else if(url.includes('aliexpress')) {
        return ' on Alibaba'
      }else{
        return " "
      }
    }

    return 'Unknown Platform';
  };

  return (
    <div className="product-card">
      <div className="card-content">
        <img src={product.image} alt={product.name} />
        <p>{product.name}</p>
        <p>Price <span>{product.price}</span></p>
        <button>
          <a href={product.link} target="_blank" rel="noopener noreferrer">
            Buy{getIconForUrl(product.link)}
          </a>
        </button>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ProductCard;
