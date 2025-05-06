import React, { useState } from 'react';
import { searchAllShops } from '../api';

const SearchBar = ({ onResults, onError }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    onError(null);
    
    try {
      const results = await searchAllShops(query);
      onResults(results);
    } catch (error) {
      onError(error.message || 'Failed to search products');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products across all shops..."
        disabled={isSearching}
      />
      <button type="submit" disabled={isSearching}>
        {isSearching ? 'Searching...' : 'Search All Shops'}
      </button>
    </form>
  );
};

export default SearchBar;