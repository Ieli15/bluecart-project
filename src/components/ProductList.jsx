// src/components/ProductList.jsx
import React from 'react';

const ProductList = ({ products }) => {
  return (
    <div>
      {products.map((product, index) => (
        <div key={index}>
          <h3>{product.name}</h3>
          <p>Shop: {product.shop}</p>
          <p>Price: ${product.price}</p>
          <p>Rating: {product.rating} ({product.rating_count} reviews)</p>
          <p>Delivery Cost: ${product.delivery_cost}</p>
          <p>Payment Mode: {product.payment_mode}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
