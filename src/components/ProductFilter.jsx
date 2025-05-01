import React, { useEffect, useState } from 'react';

function ProductFilter({ onFilterChange }) {
  const [filter, setFilter] = useState('Price')
  useEffect(()=>{
    onFilterChange(filter);
  }, [filter])

  return (
    <div className="filter-card">
      <label>Filter by: {filter}</label>
      <button className='btn' onClick={ () => setFilter('Price') }>Price</button>
      <button className='btn' onClick={ () => setFilter('Review') }>Review</button>
      <button className='btn' onClick={ () => setFilter('Rating') }>Rating</button>
    </div>
  );
}

export default ProductFilter;